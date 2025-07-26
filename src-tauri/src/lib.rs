mod persistence;
pub mod torrent;
use persistence::{load_state, save_state};
use std::collections::HashSet;
use std::env::current_dir;
use std::pin::Pin;
use std::{
    collections::{HashMap, VecDeque},
    fs,
    path::PathBuf,
    sync::Arc,
    time::{Duration, Instant, SystemTime, UNIX_EPOCH},
};
use std::convert::Infallible;
use tauri::path::PathResolver;
use tauri::Manager;

use futures_util::{
    future::{AbortHandle, Abortable},
    Stream, StreamExt,
};
use reqwest::{Client, StatusCode};
use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Emitter, State};
use tokio::{
    fs::{remove_file, OpenOptions},
    io::AsyncWriteExt,
    sync::Mutex,
    task,
};

#[derive(Debug, Clone)]
struct AppState {
    downloads: Arc<Mutex<Vec<Download>>>,
    handles: Arc<Mutex<HashMap<u64, AbortHandle>>>,
    queue: Arc<Mutex<VecDeque<Download>>>,
    is_downloading: Arc<Mutex<bool>>,
    current_id: Arc<Mutex<Option<u64>>>,
    active_downloads: Arc<Mutex<HashSet<u64>>>,  
    max_concurrent_downloads: Arc<Mutex<usize>>, 
    speed_limit: Arc<Mutex<Option<f64>>>,        
    download_dir: Arc<Mutex<PathBuf>>,
    max_retries: Arc<Mutex<u32>>, 
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct Download {
    id: u64,
    url: String,
    file_path: PathBuf,
    progress: f64,
    status: DownloadStatus,
    downloaded_bytes: u64,
    speed_kbps: f64,
    eta_seconds: Option<u64>,
    total_bytes: Option<u64>,
    retries_left: u32, 
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
enum DownloadStatus {
    Queued,
    Downloading,
    Paused,
    Completed,
    Failed(String),
}

#[tauri::command]
async fn enqueue_download(
    url: String,
    state: State<'_, AppState>,
    app_handle: AppHandle,
) -> Result<u64, String> {
    create_and_start_download(url, state, true, app_handle).await
}

pub async fn enqueue_download_internal(
    url: String,
    state: Arc<AppState>,
    app_handle: AppHandle,
) -> Result<u64, String> {
    create_and_start_download_arc(url, state, true, app_handle).await
}

#[tauri::command]
async fn add_to_queue(
    url: String,
    state: State<'_, AppState>,
    app_handle: AppHandle,
) -> Result<u64, String> {
    create_and_start_download(url, state, false, app_handle).await
}
use percent_encoding::percent_decode;
use url::Url;
fn percent_decode_manual(encoded: &str) -> String {
    let mut bytes = encoded.as_bytes();
    let mut output = Vec::with_capacity(bytes.len());
    let mut i = 0;

    while i < bytes.len() {
        if bytes[i] == b'%' && i + 2 < bytes.len() {
            if let (Some(h), Some(l)) = (from_hex(bytes[i + 1]), from_hex(bytes[i + 2])) {
                output.push((h << 4) | l);
                i += 3;
                continue;
            }
        }
        output.push(bytes[i]);
        i += 1;
    }

    String::from_utf8_lossy(&output).to_string()
}

fn from_hex(byte: u8) -> Option<u8> {
    match byte {
        b'0'..=b'9' => Some(byte - b'0'),
        b'a'..=b'f' => Some(byte - b'a' + 10),
        b'A'..=b'F' => Some(byte - b'A' + 10),
        _ => None,
    }
}
fn extract_clean_filename(url: &str) -> String {
    match Url::parse(url) {
        Ok(parsed_url) => {
            if let Some(encoded) = parsed_url
                .path_segments()
                .and_then(|segments| segments.last())
            {
                percent_decode(encoded.as_bytes())
                    .decode_utf8_lossy()
                    .to_string()
            } else {
                "download".to_string()
            }
        }
        Err(_) => "download".to_string(),
    }
}


async fn create_and_start_download(
    url: String,
    state: State<'_, AppState>,
    auto_start: bool,
    app_handle: AppHandle,
) -> Result<u64, String> {
    use url::Url;

    let parsed_url = Url::parse(&url).map_err(|e| e.to_string())?;
    let raw_name = parsed_url
        .path_segments()
        .and_then(|segments| segments.last())
        .unwrap_or("download");
    use percent_encoding::percent_decode;

    let file_name = extract_clean_filename(&url);

    let file_path = {
        let dir = state.download_dir.lock().await.clone();
        dir.join(file_name)
    };

    let id = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map_err(|e| e.to_string())?
        .as_secs();
    let retries = *state.max_retries.lock().await;

    let download = Download {
        id,
        url,
        file_path,
        progress: 0.0,
        status: DownloadStatus::Queued,
        downloaded_bytes: 0,
        speed_kbps: 0.0,
        eta_seconds: None,
        total_bytes: None,
        retries_left: retries, 
    };

    state.downloads.lock().await.push(download.clone());
    state.queue.lock().await.push_back(download);

    if auto_start {
        spawn_next_download(
            state.downloads.clone(),
            state.handles.clone(),
            state.queue.clone(),
            state.active_downloads.clone(),
            state.max_concurrent_downloads.clone(),
            
            
            app_handle,
        );
    }

    Ok(id)
}
async fn create_and_start_download_arc(
    url: String,
    state: Arc<AppState>,
    auto_start: bool,
    app_handle: AppHandle,
) -> Result<u64, String> {
    use url::Url;

    let parsed_url = Url::parse(&url).map_err(|e| e.to_string())?;
    let raw_name = parsed_url
        .path_segments()
        .and_then(|segments| segments.last())
        .unwrap_or("download");
    use percent_encoding::percent_decode;

    let file_name = extract_clean_filename(&url);

    let file_path = {
        let dir = state.download_dir.lock().await.clone();
        dir.join(file_name)
    };

    let id = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map_err(|e| e.to_string())?
        .as_secs();
    let retries = *state.max_retries.lock().await;

    let download = Download {
        id,
        url,
        file_path,
        progress: 0.0,
        status: DownloadStatus::Queued,
        downloaded_bytes: 0,
        speed_kbps: 0.0,
        eta_seconds: None,
        total_bytes: None,
        retries_left: retries, 
    };

    state.downloads.lock().await.push(download.clone());
    state.queue.lock().await.push_back(download);

    if auto_start {
        spawn_next_download(
            state.downloads.clone(),
            state.handles.clone(),
            state.queue.clone(),
            state.active_downloads.clone(),
            state.max_concurrent_downloads.clone(),
            
            
            app_handle,
        );
    }

    Ok(id)
}

#[tauri::command]
async fn get_downloads(state: State<'_, AppState>) -> Result<Vec<Download>, String> {
    Ok(state.downloads.lock().await.clone())
}

#[tauri::command]
async fn get_queue(state: State<'_, AppState>) -> Result<Vec<Download>, String> {
    let downloads_guard = state.downloads.lock().await;
    let queue_guard = state.queue.lock().await;

    let mut result = Vec::new();

    let current_id_value = *state.current_id.lock().await;

    if let Some(current_id) = current_id_value {
        if let Some(current_dl) = downloads_guard
            .iter()
            .find(|d| d.id == current_id && d.status == DownloadStatus::Downloading)
        {
            result.push(current_dl.clone());
        }
    }

    for queued_dl_in_deque in queue_guard.iter() {
        if Some(queued_dl_in_deque.id) != current_id_value {
            if let Some(full_dl) = downloads_guard
                .iter()
                .find(|d| d.id == queued_dl_in_deque.id)
            {
                result.push(full_dl.clone());
            }
        }
    }
    drop(downloads_guard);
    Ok(result)
}

#[tauri::command]
async fn start_queue(state: State<'_, AppState>, app_handle: AppHandle) -> Result<(), ()> {
    spawn_next_download(
        state.downloads.clone(),
        state.handles.clone(),
        state.queue.clone(),
        state.active_downloads.clone(),
        state.max_concurrent_downloads.clone(),
        
        
        app_handle,
    );
    Ok(())
}

#[tauri::command]
async fn remove_from_queue(id: u64, state: State<'_, AppState>) -> Result<(), String> {
    let mut queue = state.queue.lock().await;
    if let Some(index) = queue.iter().position(|d| d.id == id) {
        queue.remove(index);

        let mut downloads_guard = state.downloads.lock().await;
        if let Some(dl) = downloads_guard.iter_mut().find(|d| d.id == id) {
            if dl.status == DownloadStatus::Queued {
                dl.status = DownloadStatus::Paused;
            }
        }
        drop(downloads_guard);
    }
    drop(queue);
    Ok(())
}

#[tauri::command]
async fn move_in_queue(
    id: u64,
    direction: String,
    state: State<'_, AppState>,
) -> Result<(), String> {
    let mut queue = state.queue.lock().await;
    if let Some(index) = queue.iter().position(|d| d.id == id) {
        match direction.as_str() {
            "up" if index > 0 => {
                let item = queue.remove(index).unwrap();
                queue.insert(index - 1, item);
            }
            "down" if index < queue.len() - 1 => {
                let item = queue.remove(index).unwrap();
                queue.insert(index + 1, item);
            }
            _ => {}
        }
    }
    Ok(())
}

#[tauri::command]
async fn pause_download(
    id: u64,
    state: State<'_, AppState>,
    app_handle: AppHandle,
) -> Result<(), String> {
    let mut handles = state.handles.lock().await;

    if let Some(handle) = handles.remove(&id) {

        handle.abort();

        let mut downloads = state.downloads.lock().await;
        if let Some(d) = downloads.iter_mut().find(|d| d.id == id) {
    
            d.status = DownloadStatus::Paused;
            d.speed_kbps = 0.0;
            d.eta_seconds = None;
            let _ = app_handle.emit("download-progress", d.clone());
    
        }
        drop(downloads);
        *state.is_downloading.lock().await = false;
        *state.current_id.lock().await = None;

        save_state(&app_handle.clone(), &state).await;

        Ok(())
    } else {

        Err("Download not found".into())
    }
}

#[tauri::command]
async fn resume_download(
    id: u64,
    state: State<'_, AppState>,
    app_handle: AppHandle,
) -> Result<(), String> {
    let mut downloads_guard = state.downloads.lock().await;
    let apph = app_handle.clone();
    if let Some(download) = downloads_guard
        .iter_mut()
        .find(|d| {
            d.id == id
                && (d.status == DownloadStatus::Paused
                    || matches!(d.status, DownloadStatus::Failed(_)))
        })
        .cloned()
    {
        drop(downloads_guard);
        state.queue.lock().await.push_front(download);
        spawn_next_download(
            state.downloads.clone(),
            state.handles.clone(),
            state.queue.clone(),
            state.active_downloads.clone(),
            state.max_concurrent_downloads.clone(),
            
            
            apph,
        );
        save_state(&app_handle.clone(), &state).await;
        Ok(())
    } else {
        Err("Download not found or not paused".into())
    }
}

#[tauri::command]
async fn remove_download(
    id: u64,
    state: State<'_, AppState>,
    app_handle: AppHandle,
) -> Result<(), String> {
    let mut handles = state.handles.lock().await;
    if let Some(handle) = handles.remove(&id) {
        handle.abort();
    }

    let mut downloads = state.downloads.lock().await;
    if let Some(index) = downloads.iter().position(|d| d.id == id) {
        let file_path = downloads[index].file_path.clone();
        let _ = remove_file(file_path).await;
        downloads.remove(index);
    }

    let mut queue = state.queue.lock().await;
    queue.retain(|d| d.id != id);

    let mut current_id_guard = state.current_id.lock().await;
    drop(downloads);
    drop(queue);
    if *current_id_guard == Some(id) {
        *current_id_guard = None;
        *state.is_downloading.lock().await = false;
    }
    save_state(&app_handle.clone(), &state).await;
    Ok(())
}
#[tauri::command]
async fn remove_download_from_list(
    id: u64,
    state: State<'_, AppState>,
    app_handle: AppHandle,
) -> Result<(), String> {
    let mut handles = state.handles.lock().await;
    if let Some(handle) = handles.remove(&id) {
        handle.abort();
    }

    let mut downloads = state.downloads.lock().await;
    if let Some(index) = downloads.iter().position(|d| d.id == id) {
        downloads.remove(index);
    }

    let mut queue = state.queue.lock().await;
    queue.retain(|d| d.id != id);

    let mut current_id_guard = state.current_id.lock().await;
    drop(downloads);
    drop(queue);
    if *current_id_guard == Some(id) {
        *current_id_guard = None;
        *state.is_downloading.lock().await = false;
    }
    save_state(&app_handle.clone(), &state).await;
    Ok(())
}

#[tauri::command]
async fn check_file_existence(url: String) -> Result<(bool, String), String> {
    use std::fs;
    use url::Url;

    let parsed_url = Url::parse(&url).map_err(|e| e.to_string())?;
    let file_name = extract_clean_filename(url.as_str());

    let file_path = dirs::download_dir()
        .unwrap_or_else(|| PathBuf::from("."))
        .join(file_name);

    let exists = fs::metadata(&file_path).is_ok();
    Ok((exists, file_path.to_string_lossy().to_string()))
}

#[tauri::command]
async fn enqueue_download_with_options(
    url: String,
    overwrite: bool,
    resume: bool,
    save_as: String,
    state: State<'_, AppState>,
    app_handle: AppHandle,
) -> Result<u64, String> {
    use url::Url;
    let parsed_url = Url::parse(&url).map_err(|e| e.to_string())?;

    let file_name = if !(save_as.clone().trim().is_empty()) {
        save_as.clone()
    } else {
        extract_clean_filename(url.clone().as_str())
    };
    
    
    
    let default_dir = state.download_dir.lock().await;
    let file_path = default_dir.join(&file_name);

    let mut downloads_guard = state.downloads.lock().await;

    
    if let Some(existing) = downloads_guard
        .iter_mut()
        .find(|d| d.file_path == file_path)
    {
        if overwrite {
            let _ = fs::remove_file(&file_path);
            existing.progress = 0.0;
            existing.downloaded_bytes = 0;
            existing.total_bytes = None;
            existing.speed_kbps = 0.0;
            existing.eta_seconds = None;
            existing.status = DownloadStatus::Queued;

            
            state.queue.lock().await.push_back(existing.clone());

            spawn_next_download(
                state.downloads.clone(),
                state.handles.clone(),
                state.queue.clone(),
                state.active_downloads.clone(),
                state.max_concurrent_downloads.clone(),
                
                
                app_handle,
            );

            return Ok(existing.id);
        } else if resume {
            let resume_bytes = match fs::metadata(&file_path) {
                Ok(meta) => meta.len(),
                Err(_) => 0,
            };
            existing.downloaded_bytes = resume_bytes;
            existing.status = DownloadStatus::Queued;
            existing.total_bytes = None;
            existing.progress = 0.0;
            existing.eta_seconds = None;
            existing.speed_kbps = 0.0;

            state.queue.lock().await.push_back(existing.clone());

            spawn_next_download(
                state.downloads.clone(),
                state.handles.clone(),
                state.queue.clone(),
                state.active_downloads.clone(),
                state.max_concurrent_downloads.clone(),
                
                
                app_handle,
            );

            return Ok(existing.id);
        } else {
            return Err("File already exists.".to_string());
        }
    }
    
    let id = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map_err(|e| e.to_string())?
        .as_secs();

    let downloaded_bytes = if resume && file_path.exists() {
        match fs::metadata(&file_path) {
            Ok(meta) => meta.len(),
            Err(_) => 0,
        }
    } else {
        0
    };

    let download = Download {
        id,
        url,
        file_path: file_path.clone(),
        progress: 0.0,
        status: DownloadStatus::Queued,
        downloaded_bytes,
        speed_kbps: 0.0,
        eta_seconds: None,
        total_bytes: None,
        retries_left: state.max_retries.lock().await.clone(),
    };

    downloads_guard.push(download.clone());
    drop(downloads_guard);
    state.queue.lock().await.push_back(download);

    spawn_next_download(
        state.downloads.clone(),
        state.handles.clone(),
        state.queue.clone(),
        state.active_downloads.clone(),
        state.max_concurrent_downloads.clone(),
        
        
        app_handle,
    );

    Ok(id)
}

fn spawn_next_download(
    downloads: Arc<Mutex<Vec<Download>>>,
    handles: Arc<Mutex<HashMap<u64, AbortHandle>>>,
    queue: Arc<Mutex<VecDeque<Download>>>,
    active_downloads: Arc<Mutex<HashSet<u64>>>,
    max_concurrent_downloads: Arc<Mutex<usize>>,
    app_handle: AppHandle,
) {
    let state_clone = app_handle.state::<AppState>().inner().clone();
    let app_handle_clone = app_handle.clone();

    tokio::spawn(async move {
        loop {
            tokio::time::sleep(Duration::from_secs(5)).await;
            let is_any_downloading = *state_clone.is_downloading.lock().await;
            // println!("saving");
            if is_any_downloading {
                save_state(&app_handle_clone, &state_clone).await;
            } else {
                break;
            }
        }
    });
    task::spawn(async move {
        let max_parallel = *max_concurrent_downloads.lock().await;
        let mut active = active_downloads.lock().await;
        let mut queue_guard = queue.lock().await;

        while active.len() < max_parallel {
            let Some(next) = queue_guard.pop_front() else {
                break;
            };

            let id = next.id;
            active.insert(id);
            drop(queue_guard); 

            let mut downloads_lock = downloads.lock().await;
            if let Some(dl) = downloads_lock.iter_mut().find(|d| d.id == id) {
                dl.status = DownloadStatus::Downloading;
                let _ = app_handle.emit("download-progress", dl.clone());
            }
            drop(downloads_lock);

            let (abort_handle, abort_reg) = AbortHandle::new_pair();
            handles.lock().await.insert(id, abort_handle);

            let downloads_cl = downloads.clone();
            let handles_cl = handles.clone();
            let queue_cl = queue.clone();
            let active_cl = active_downloads.clone();
            let max_dl_cl = max_concurrent_downloads.clone();
            let app_cl = app_handle.clone();

            task::spawn(async move {
                let result = Abortable::new(
                    download_file(next.clone(), downloads_cl.clone(), app_cl.clone()),
                    abort_reg,
                )
                .await;

                handles_cl.lock().await.remove(&id);
                active_cl.lock().await.remove(&id);

                let mut downloads_lock = downloads_cl.lock().await;
                if let Some(dl) = downloads_lock.iter_mut().find(|d| d.id == id) {
                    match result {
                        Ok(Ok(_)) => {
                            dl.status = DownloadStatus::Completed;
                            dl.progress = 100.0;
                        }
                        Ok(Err(e)) => {
                            dl.status = DownloadStatus::Failed(e.to_string());
                        }
                        Err(_) => {
                            dl.status = DownloadStatus::Paused;
                        }
                    }
                    dl.speed_kbps = 0.0;
                    dl.eta_seconds = None;
                    let _ = app_cl.emit("download-progress", dl.clone());
                }
                drop(downloads_lock); 
                                      
                spawn_next_download(
                    downloads_cl,
                    handles_cl,
                    queue_cl,
                    active_cl,
                    max_dl_cl,
                    app_cl,
                );
            });

            
            queue_guard = queue.lock().await;
        }
        drop(active);
    });
}

use crate::persistence::{ensure_state_file_exists, get_state_path};
use tokio::time::{timeout, Duration as TokioDuration};

async fn fail(
    download: &Download,
    state: &Arc<Mutex<Vec<Download>>>,
    app_handle: &AppHandle,
    message: String,
) {
    update_status(state, download.id, DownloadStatus::Failed(message.clone())).await;
    update_progress_bytes_speed(
        state,
        download.id,
        0.0,
        download.downloaded_bytes,
        Some(0.0),
        download.total_bytes,
    )
    .await;

    if let Some(dl) = get_download_by_id(state, download.id).await {
        let _ = app_handle.emit("download-progress", dl.clone());
        println!("{} is failed", dl.file_path.display());
    }
}

async fn emit_status(
    download: &Download,
    state: &Arc<Mutex<Vec<Download>>>,
    app_handle: &AppHandle,
) {
    if let Some(updated) = get_download_by_id(state, download.id).await {
        let _ = app_handle.emit("download-progress", updated);
    }
}
async fn download_file(
    download: Download,
    state: Arc<Mutex<Vec<Download>>>,
    app_handle: AppHandle,
) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let client = Client::new();

    let mut file = match OpenOptions::new()
        .create(true)
        .append(true)
        .open(&download.file_path)
        .await
    {
        Ok(f) => f,
        Err(e) => {
            update_status(&state, download.id, DownloadStatus::Failed(e.to_string())).await;
            let _ = app_handle.emit(
                "download-progress",
                get_download_by_id(&state, download.id)
                    .await
                    .unwrap_or(download),
            );
            return Err(Box::new(e));
        }
    };

    update_status(&state, download.id, DownloadStatus::Downloading).await;
    let _ = app_handle.emit(
        "download-progress",
        get_download_by_id(&state, download.id)
            .await
            .unwrap_or(download.clone()),
    );

    let response = match client
        .get(&download.url)
        .header("Range", format!("bytes={}-", download.downloaded_bytes))
        .send()
        .await
    {
        Ok(resp) => resp,
        Err(e) => {
            update_status(&state, download.id, DownloadStatus::Failed(e.to_string())).await;
            let _ = app_handle.emit(
                "download-progress",
                get_download_by_id(&state, download.id)
                    .await
                    .unwrap_or(download),
            );
            return Err(Box::new(e));
        }
    };

    let total_size_from_header = response.content_length().unwrap_or(0);
    let total_file_size = total_size_from_header + download.downloaded_bytes;

    let downloaded = download.downloaded_bytes;
    update_progress_bytes_speed(
        &state,
        download.id,
        0.0,
        downloaded,
        Some(0.0),
        Some(total_file_size),
    )
    .await;
    let _ = app_handle.emit(
        "download-progress",
        get_download_by_id(&state, download.id)
            .await
            .unwrap_or(download.clone()),
    );

    
    let kbps_limit = *app_handle.state::<AppState>().speed_limit.lock().await;
    let raw_stream = response.bytes_stream();

    let mut stream: Pin<Box<dyn Stream<Item = Result<Bytes, reqwest::Error>> + Send>> =
        if let Some(kbps) = kbps_limit {
            if kbps > 0.0 {
                Box::pin(throttle_stream(raw_stream, kbps))
            } else {
                Box::pin(raw_stream)
            }
        } else {
            Box::pin(raw_stream)
        };

    let mut downloaded = downloaded;
    let mut last_check = Instant::now();
    let mut bytes_since_last_check = 0u64;

    while let Some(item) = stream.next().await {
        let chunk = match item {
            Ok(c) => c,
            Err(e) => {
                let mut dls = state.lock().await;
                if let Some(dl) = dls.iter_mut().find(|d| d.id == download.id) {
                    if dl.retries_left > 0 {
                        dl.retries_left -= 1;
                        dl.status = DownloadStatus::Paused;

                        let attempt = 10 - dl.retries_left;
                        let delay_secs = (2_u64).pow(attempt.min(5)); 
                        let app = app_handle.clone();
                        let id = dl.id;
                        let state_cloned = state.clone();

                        
                        let _ = app.emit("download-progress", dl.clone());

                        
                        tokio::spawn(async move {
                            tokio::time::sleep(Duration::from_secs(delay_secs)).await;

                            
                            let mut downloads = state_cloned.lock().await;
                            if let Some(d) = downloads.iter_mut().find(|d| d.id == id) {
                                d.status = DownloadStatus::Queued;
                                let _ = app.emit("download-progress", d.clone());
                            }

                            let app_state = app.state::<AppState>();
                            let downloads = app_state.downloads.clone();
                            let handles = app_state.handles.clone();
                            let queue = app_state.queue.clone();
                            let active = app_state.active_downloads.clone();
                            let max = app_state.max_concurrent_downloads.clone();

                            let queue_cloned = queue.clone(); 

                            let mut q = queue.lock().await;
                            if !q.iter().any(|d| d.id == id) {
                                if let Some(dl) = downloads.lock().await.iter().find(|d| d.id == id)
                                {
                                    q.push_back(dl.clone());
                                }
                            }
                            drop(q); 

                            spawn_next_download(
                                downloads,
                                handles,
                                queue_cloned, 
                                active,
                                max,
                                app.clone(),
                            );
                        });

                        return Err(Box::new(e));
                    } else {
                        
                        dl.status = DownloadStatus::Failed(e.to_string());
                        dl.speed_kbps = 0.0;
                        dl.eta_seconds = None;
                        let _ = app_handle.emit("download-progress", dl.clone());
                        return Err(Box::new(e));
                    }
                } else {
                    
                    return Err(Box::new(e));
                }
            }
        };

        if let Err(e) = file.write_all(&chunk).await {
            update_status(&state, download.id, DownloadStatus::Failed(e.to_string())).await;
            let _ = app_handle.emit(
                "download-progress",
                get_download_by_id(&state, download.id)
                    .await
                    .unwrap_or(download),
            );
            return Err(Box::new(e));
        }

        downloaded += chunk.len() as u64;
        bytes_since_last_check += chunk.len() as u64;

        let elapsed = last_check.elapsed();
        let mut speed_kbps = None;

        if elapsed >= Duration::from_millis(500) {
            let kbps = bytes_since_last_check as f64 / 1024.0 / elapsed.as_secs_f64();
            speed_kbps = Some(kbps);
            last_check = Instant::now();
            bytes_since_last_check = 0;
        }

        let progress = if total_file_size > 0 {
            (downloaded as f64 / total_file_size as f64) * 100.0
        } else {
            0.0
        };

        update_progress_bytes_speed(
            &state,
            download.id,
            progress,
            downloaded,
            speed_kbps,
            Some(total_file_size),
        )
        .await;

        let _ = app_handle.emit(
            "download-progress",
            get_download_by_id(&state, download.id)
                .await
                .unwrap_or(download.clone()),
        );
    }
    let app_state: State<'_, AppState> = app_handle.state::<AppState>();
    update_status(&state, download.id, DownloadStatus::Completed).await;
    let _ = app_handle.emit(
        "download-progress",
        get_download_by_id(&state, download.id)
            .await
            .unwrap_or(download),
    );
    save_state(&app_handle.clone(), &app_state).await;
    Ok(())
}
async fn get_download_by_id(state: &Arc<Mutex<Vec<Download>>>, id: u64) -> Option<Download> {
    let downloads = state.lock().await;
    downloads.iter().find(|d| d.id == id).cloned()
}

async fn update_status(state: &Arc<Mutex<Vec<Download>>>, id: u64, status: DownloadStatus) {
    let mut downloads = state.lock().await;
    if let Some(download) = downloads.iter_mut().find(|d| d.id == id) {
        download.status = status;
    }
}

async fn update_progress_bytes_speed(
    state: &Arc<Mutex<Vec<Download>>>,
    id: u64,
    progress: f64,
    downloaded_bytes: u64,
    speed_kbps: Option<f64>,
    total_bytes: Option<u64>,
) {
    let mut downloads = state.lock().await;
    if let Some(download) = downloads.iter_mut().find(|d| d.id == id) {
        download.progress = progress;
        download.downloaded_bytes = downloaded_bytes;

        if let Some(total) = total_bytes {
            download.total_bytes = Some(total);
        }

        if let Some(speed) = speed_kbps {
            download.speed_kbps = speed;
            if let Some(total) = download.total_bytes {
                if speed > 0.0 && downloaded_bytes < total {
                    let remaining_bytes = total.saturating_sub(downloaded_bytes);
                    let remaining_kb = remaining_bytes as f64 / 1024.0;
                    let eta_secs = (remaining_kb / speed).round() as u64;
                    download.eta_seconds = Some(eta_secs);
                } else {
                    download.eta_seconds = None;
                }
            } else {
                download.eta_seconds = None;
            }
        } else {
            if download.status != DownloadStatus::Downloading {
                download.speed_kbps = 0.0;
                download.eta_seconds = None;
            }
        }
    }
}

fn builtin_touch(args: &[&str]) {
    if args.is_empty() {
        eprintln!("touch: missing file operand");
        return;
    }
    for file in args {
        if let Err(e) = fs::OpenOptions::new().create(true).write(true).open(file) {
            eprintln!("touch: cannot touch '{}': {}", file, e);
        }
    }
}
#[tauri::command]
async fn set_max_retries(state: State<'_, AppState>, max: u32) -> Result<(), String> {
    *state.max_retries.lock().await = max;
    Ok(())
}

#[tauri::command]
async fn get_max_retries(state: State<'_, AppState>) -> Result<u32, String> {
    Ok(*state.max_retries.lock().await)
}
#[tauri::command]
async fn set_speed_limit(state: State<'_, AppState>, kbps: f64) -> Result<(), ()> {
    *state.speed_limit.lock().await = Some(kbps);
    Ok(())
}

#[tauri::command]
async fn get_speed_limit(state: State<'_, AppState>) -> Result<Option<f64>, ()> {
    Ok(*state.speed_limit.lock().await)
}

#[tauri::command]
async fn get_max_concurrent_downloads(state: State<'_, AppState>) -> Result<usize, String> {
    Ok(*state.max_concurrent_downloads.lock().await)
}

#[tauri::command]
async fn set_max_concurrent_downloads(
    state: State<'_, AppState>,
    value: usize,
) -> Result<(), String> {
    *state.max_concurrent_downloads.lock().await = value;
    Ok(())
}

#[tauri::command]
async fn get_download_dir(state: State<'_, AppState>) -> Result<String, String> {
    Ok(state
        .download_dir
        .lock()
        .await
        .to_string_lossy()
        .to_string())
}

#[tauri::command]
async fn set_download_dir(state: State<'_, AppState>, new_path: String) -> Result<(), String> {
    let path = PathBuf::from(new_path);
    if !path.exists() || !path.is_dir() {
        return Err("Invalid directory".to_string());
    }
    *state.download_dir.lock().await = path;
    Ok(())
}

use bytes::Bytes;
use serde_json::json;
use tokio::time::{sleep, Duration as D}; 
                                         

fn throttle_stream<S>(
    stream: S,
    kbps_limit: f64,
) -> impl Stream<Item = Result<Bytes, reqwest::Error>>
where
    S: Stream<Item = Result<Bytes, reqwest::Error>> + Unpin,
{
    let byte_limit_per_sec = (kbps_limit * 1024.0) as usize;
    let chunk_size = 8192;
    let delay_per_chunk = Duration::from_secs_f64(chunk_size as f64 / byte_limit_per_sec as f64);

    futures_util::stream::unfold((stream, delay_per_chunk), |(mut s, delay)| async move {
        match s.next().await {
            Some(item) => {
                sleep(delay).await;
                Some((item, (s, delay)))
            }
            None => None,
        }
    })
}


use warp::Filter;
use warp::reply::{json, Json, with_status, WithStatus};

#[derive(Debug, Clone, Deserialize)]
pub struct EnqueueRequest {
    pub url: String,
}




pub fn enqueue_filter(
    state: Arc<AppState>,
    app_handle: AppHandle,
) -> impl Filter<Extract = (impl warp::Reply,), Error = warp::Rejection> + Clone {
    let state_filter = warp::any().map(move || state.clone());
    let handle_filter = warp::any().map(move || app_handle.clone());

    warp::path!("enqueue")
        .and(warp::post())
        .and(warp::body::json())
        .and(state_filter)
        .and(handle_filter)
        .and_then(handle_enqueue)
}


async fn handle_enqueue(
    req: EnqueueRequest,
    state: Arc<AppState>,
    app_handle: AppHandle,
) -> Result<impl warp::Reply, Infallible> {
    let response: WithStatus<Json> = match enqueue_download_internal(req.url, state, app_handle).await {
        Ok(id) => with_status(
            json(&serde_json::json!({ "status": "ok", "id": id })),
            StatusCode::OK,
        ),
        Err(e) => with_status(
            json(&serde_json::json!({ "status": "error", "message": e })),
            StatusCode::INTERNAL_SERVER_ERROR,
        ),
    };
    Ok(response)
}


pub fn spawn_http_api(app: AppHandle, state: Arc<AppState>) {
    tokio::spawn(async move {

        let state_filter = warp::any().map({
            let s = state.clone();
            move || s.clone()
        });

        let app_filter = warp::any().map({
            let app = app.clone();
            move || app.clone()
        });

        let enqueue_route = warp::path!("add")
            .and(warp::post())
            .and(warp::body::json())
            .and(state_filter)
            .and(app_filter)
            .and_then(
                |req: serde_json::Value, state: Arc<AppState>, app: AppHandle| async move {
                    let url = req.get("url")
                        .and_then(|v| v.as_str())
                        .unwrap_or("")
                        .to_string();

                    match enqueue_download_internal(url, state, app.clone()).await {
                        Ok(id) => {
                            // Show the main window when a new download is added
                            if let Some(window) = app.get_window("main") {
                                let _ = window.show();
                                let _ = window.set_focus();
                            }

                            Ok::<_, warp::Rejection>(warp::reply::json(
                                &serde_json::json!({ "status": "ok", "id": id })
                            ))
                        },
                        Err(e) => Ok::<_, warp::Rejection>(warp::reply::json(
                            &serde_json::json!({ "status": "error", "message": format!("{}", e) })
                        )),
                    }
                }
            );
        warp::serve(enqueue_route)
            .run(([127, 0, 0, 1], 52345))
            .await;
    });
}

use tauri_plugin_autostart::MacosLauncher;
use tauri_plugin_autostart::ManagerExt;
#[tokio::main]
pub async fn run() {

    let default_download_dir = dirs::download_dir().unwrap_or_else(|| PathBuf::from("."));
    let app_state = AppState {
        downloads: Arc::new(Mutex::new(Vec::new())),
        handles: Arc::new(Mutex::new(HashMap::new())),
        queue: Arc::new(Mutex::new(VecDeque::new())),
        is_downloading: Arc::new(Mutex::new(false)),
        current_id: Arc::new(Mutex::new(None)),
        speed_limit: Arc::new(Mutex::new(Some(0.0))),
        active_downloads: Arc::new(Mutex::new(HashSet::new())),
        max_concurrent_downloads: Arc::new(Mutex::new(3)), 
        download_dir: Arc::new(Mutex::new(default_download_dir)),
        max_retries: Arc::new(Mutex::new(10)),
    };

        
    tauri::Builder::default()
        
        .plugin(tauri_plugin_autostart::init(
                    MacosLauncher::LaunchAgent,
                    Some(vec!["--flag1", "--flag2"]),
                ))
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_notification::init())
        .manage(app_state.clone())
        .setup(|app| {
            if let Err(e) = ensure_state_file_exists() {
                eprintln!("Failed to create default state.json: {}", e);
            }
            let handle_owned = app.handle().clone();

            let state_owned = app.state::<AppState>().inner().clone();

            tauri::async_runtime::spawn(async move {
                load_state(handle_owned, state_owned.clone()).await;
            });
            let app_handle = app.handle();
            let state_owned2 = app.state::<AppState>().inner().clone();
            

            spawn_http_api(app_handle.clone(), state_owned2.into()); 

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            enqueue_download,
            add_to_queue,
            start_queue,
            get_downloads,
            get_queue,
            move_in_queue,
            remove_from_queue,
            pause_download,
            resume_download,
            remove_download,
            remove_download_from_list,
            check_file_existence,
            enqueue_download_with_options,
            set_speed_limit,
            get_speed_limit,
            get_max_concurrent_downloads, 
            set_max_concurrent_downloads, 
            get_download_dir,
            set_download_dir,
            set_max_retries,
            get_max_retries
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(mobile)]
#[tauri::mobile_entry_point]
fn main() {
    let default_download_dir = dirs::download_dir().unwrap_or_else(|| PathBuf::from("."));
    let app_state = AppState {
        downloads: Arc::new(Mutex::new(Vec::new())),
        handles: Arc::new(Mutex::new(HashMap::new())),
        queue: Arc::new(Mutex::new(VecDeque::new())),
        is_downloading: Arc::new(Mutex::new(false)),
        current_id: Arc::new(Mutex::new(None)),
        speed_limit: Arc::new(Mutex::new(Some(0.0))),
        active_downloads: Arc::new(Mutex::new(HashSet::new())),
        max_concurrent_downloads: Arc::new(Mutex::new(3)), 
        download_dir: Arc::new(Mutex::new(default_download_dir)),
        max_retries: Arc::new(Mutex::new(10)),
    };

    
    tauri::Builder::default()
        
        
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_notification::init())
        .manage(app_state.clone())
        .setup(|app| {
            if let Err(e) = ensure_state_file_exists() {
                eprintln!("Failed to create default state.json: {}", e);
            }
            let handle_owned = app.handle().clone();

            let state_owned = app.state::<AppState>().inner().clone();

            tauri::async_runtime::spawn(async move {
                load_state(handle_owned, state_owned.clone()).await;
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            enqueue_download,
            add_to_queue,
            start_queue,
            get_downloads,
            get_queue,
            move_in_queue,
            remove_from_queue,
            pause_download,
            resume_download,
            remove_download,
            remove_download_from_list,
            check_file_existence,
            enqueue_download_with_options,
            set_speed_limit,
            get_speed_limit,
            get_max_concurrent_downloads, 
            set_max_concurrent_downloads, 
            get_download_dir,
            set_download_dir,
            set_max_retries,
            get_max_retries
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
