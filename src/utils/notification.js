import {
    isPermissionGranted,
    requestPermission,
    sendNotification,
} from '@tauri-apps/plugin-notification';
// when using `"withGlobalTauri": true`, you may use
// const { isPermissionGranted, requestPermission, sendNotification, } = window.__TAURI__.notification;

export const sendNotif = async (title,body)=> {
    return
}
