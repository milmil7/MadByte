import { invoke } from '@tauri-apps/api/core';
import { useEffect, useState } from 'react';

function RetrySettings() {
    const [maxRetries, setMaxRetries] = useState(10);

    useEffect(() => {
        invoke('get_max_retries').then(setMaxRetries);
    }, []);

    const updateRetries = async (e) => {
        const value = parseInt(e.target.value);
        setMaxRetries(value);
        await invoke('set_max_retries', { max: value });
    };

    return (
        <div style={{ marginTop: '1rem' }}>
            <label style={{ fontWeight: 'bold' }}>Max Retries</label>
            <input
                type="number"
                value={maxRetries}
                min={0}
                max={20}
                onChange={updateRetries}
                style={{ marginLeft: '10px', padding: '0.5rem', width: '5rem' }}
            />
        </div>
    );
}

export default RetrySettings;
