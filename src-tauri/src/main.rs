// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
// #[cfg(mobile)]
// #[tauri::mobile_entry_point]
fn main() {
    mad_byte_lib::run()
}
