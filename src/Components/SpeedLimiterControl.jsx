import { invoke } from '@tauri-apps/api/core';
import { useState, useEffect } from 'react';

export default function SpeedLimiterControl() {
    const [limit, setLimit] = useState(''); // store as string for easier controlled input

    // Fetch current speed limit on mount
    useEffect(() => {
        (async () => {
            try {
                const current = await invoke('get_speed_limit');
                if (typeof current === 'number') {
                    setLimit(current.toFixed(0));
                }
            } catch (err) {
                console.error('Failed to fetch speed limit', err);
            }
        })();
    }, []);

    const handleChange = async (e) => {
        const value = e.target.value;
        setLimit(value);

        const parsed = parseFloat(value);
        if (!isNaN(parsed) && parsed >= 0) {
            try {
                await invoke('set_speed_limit', { kbps: parsed });
            } catch (err) {
                console.error('Failed to set speed limit:', err);
            }
        }
    };

    return (
        <div style={{
            marginTop: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            maxWidth: '300px',
        }}>
            <label style={{ fontWeight: 'bold' }}>
                Global Speed Limit (KB/s)
            </label>
            <input
                type="number"
                min="0"
                placeholder="Unlimited"
                value={limit}
                onChange={handleChange}
                style={{
                    padding: '0.5rem',
                    fontSize: '1rem',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    outline: 'none',
                }}
            />
        </div>
    );
}
