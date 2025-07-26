import { openPath, revealItemInDir } from '@tauri-apps/plugin-opener';
// when using `"withGlobalTauri": true`, you may use
// const { openPath } = window.__TAURI__.opener;

// opens a file using the default program:
export async function openFile(path) {
    await openPath(path);
}
export async function openFolder(path) {
    await revealItemInDir(path);
}
