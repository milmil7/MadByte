import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { TrayIcon } from '@tauri-apps/api/tray';
import { defaultWindowIcon } from '@tauri-apps/api/app';
import { Menu } from '@tauri-apps/api/menu';
import { webviewWindow } from "@tauri-apps/api";
const tray = async () => {

  const menu = await Menu.new({
    items: [
      {
        id: 'quit',
        text: 'Quit',
        action: () => {
          webviewWindow.WebviewWindow.getCurrent().close()
        },
      },
      {
        id: 'show',
        text: 'Show',
        action: (event) => {
          webviewWindow.WebviewWindow.getCurrent().show()
        },
      },
    ],
  });
  const options = {
    menu,
    menuOnLeftClick: true,
    icon: await defaultWindowIcon(),
    action: (event) => {
      if (event.type === "Click") {
        webviewWindow.WebviewWindow.getCurrent().show()
      }
      
    },
  };

  
  const tray = await TrayIcon.new(options);
}
tray().catch(console.error);
ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
      <App />
  // </React.StrictMode>,
);
