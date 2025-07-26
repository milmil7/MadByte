use serde::{Deserialize, Serialize};
use std::collections::{HashSet, VecDeque};
use std::env::current_dir;
use std::fs::File;
use std::io::Write;
use std::path::{Path, PathBuf};
use std::sync::Arc;
use tauri::AppHandle;
use tokio::fs;
use tokio::sync::Mutex;

use crate::{AppState, Download, DownloadStatus};

#[derive(Serialize, Deserialize)]
pub struct PersistedState {
    pub downloads: Vec<Download>,
    pub queue: VecDeque<Download>,
    pub max_concurrent_downloads: usize, 
    pub speed_limit: Option<f64>,        
    pub download_dir: PathBuf,
    pub max_retries: u32,
}

pub async fn deduplicate_state_lists(state: &AppState) {
    
    let mut seen_ids = HashSet::new();
    {
        let mut downloads = state.downloads.lock().await;
        downloads.retain(|dl| seen_ids.insert(dl.id));
        drop(downloads);
    }

    
    {
        let downloads = state.downloads.lock().await;
        let valid_ids: HashSet<_> = downloads.iter().map(|d| d.id).collect();
        let mut seen = HashSet::new();
        let mut queue = state.queue.lock().await;
        queue.retain(|dl| valid_ids.contains(&dl.id) && seen.insert(dl.id));
        drop(downloads);
    }
}
pub fn get_state_path() -> PathBuf {
    current_dir().unwrap().join("state.json")
}
pub fn ensure_state_file_exists() -> std::io::Result<()> {
    let path = get_state_path();

    if !path.exists() {
        let download_dir = dirs::download_dir()
            .unwrap_or_else(|| PathBuf::from("./downloads")) 
            .to_string_lossy()
            .to_string();

        let default_state = format!(
            r#"{{
                "downloads": [],
                "queue": [],
                "max_concurrent_downloads": 3,
                "speed_limit": 0,
                "download_dir": "{}"
                "max_retries": 10
            }}"#,
            download_dir.replace('\\', "\\\\"), 
        );

        let mut file = File::create(&path)?;
        file.write_all(default_state.trim().as_bytes())?;
    }

    Ok(())
}

pub async fn save_state(app: &AppHandle, state: &AppState) {
    deduplicate_state_lists(&state).await;
    println!(" save0");
    let path = get_state_path();
    println!(" save1");

    let downloads = state.downloads.lock().await.clone();
    println!(" save2");
    let queue = state.queue.lock().await.clone();
    let max_concurrent_downloads = state.max_concurrent_downloads.lock().await.clone();
    let speed_limit = state.speed_limit.lock().await.clone();
    let download_dir = state.download_dir.lock().await.clone();
    let max_retries = state.max_retries.lock().await.clone();
    println!(" save3");

    let persisted = PersistedState {
        downloads,
        queue,
        max_concurrent_downloads,
        speed_limit,
        download_dir,
        max_retries,
    };
    if let Ok(json) = serde_json::to_string_pretty(&persisted) {
        let _ = fs::write(path, json).await;
    } else if let Err(e) = serde_json::to_string_pretty(&persisted) {
        println!("w asdafsdf save, {}", e.to_string());
    }
}

pub async fn load_state(app: AppHandle, state: AppState) {
    
    let path = get_state_path(); 
    println!("{}", path.to_str().unwrap());
    if let Ok(contents) = fs::read_to_string(path.clone()).await {
        if let Ok(mut loaded) = serde_json::from_str::<PersistedState>(&contents) {
            for dl in loaded.downloads.iter_mut() {
                if dl.status != DownloadStatus::Completed {
                    dl.status = DownloadStatus::Paused;
                    dl.speed_kbps = 0.0;
                    dl.eta_seconds = None;
                }
            }
            for dl in loaded.queue.iter_mut() {
                if dl.status != DownloadStatus::Completed {
                    dl.status = DownloadStatus::Paused;
                    dl.speed_kbps = 0.0;
                    dl.eta_seconds = None;
                }
            }
            
            println!("asdafsdf");
            *state.downloads.lock().await = loaded.downloads;
            *state.queue.lock().await = loaded.queue;
            *state.speed_limit.lock().await = loaded.speed_limit;
            *state.download_dir.lock().await = loaded.download_dir;
            *state.max_concurrent_downloads.lock().await = loaded.max_concurrent_downloads;
            *state.max_retries.lock().await = loaded.max_retries;
        } else if let Err(e) = serde_json::from_str::<PersistedState>(&contents) {
            println!("{}", e.to_string());
            println!("w 1 asdafsdf");
        }
    } else if let Err(e) = fs::read_to_string(path).await {
        println!("w{} 2 ", e.to_string());
    }
    deduplicate_state_lists(&state).await;
}
