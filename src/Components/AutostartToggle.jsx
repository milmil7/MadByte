import React, { useEffect, useState } from 'react';
import { enable, disable, isEnabled } from '@tauri-apps/plugin-autostart';

const AutoStartToggle = () => {
  const [autoStartEnabled, setAutoStartEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const enabled = await isEnabled();
        setAutoStartEnabled(enabled);
      } catch (err) {
        console.error('Failed to check autostart status:', err);
      } finally {
        setLoading(false);
      }
    };
    checkStatus();
  }, []);

  // Toggle handler
  const handleToggle = async () => {
    try {
      if (autoStartEnabled) {
        await disable();
        setAutoStartEnabled(false);
      } else {
        await enable();
        setAutoStartEnabled(true);
      }
    } catch (err) {
      console.error('Failed to toggle autostart:', err);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: "1rem" }}>
      <input
        type="checkbox"
        id="autostart"
        checked={autoStartEnabled}
        disabled={loading}
        onChange={handleToggle}
      />
      <label htmlFor="autostart" style={{ fontSize: '1rem' }}>
        Start app on system startup
      </label>
    </div>
  );
};

export default AutoStartToggle;
