import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

const MaxConcurrentDownloadsInput = () => {
    const [maxConcurrent, setMaxConcurrent] = useState(3);

    useEffect(() => {
        invoke('get_max_concurrent_downloads')
            .then(setMaxConcurrent)
            .catch(console.error);
    }, []);

    const handleChange = async (e) => {
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val) && val > 0) {
            setMaxConcurrent(val);
            await invoke('set_max_concurrent_downloads', { value: val });
        }
    };

    return (
        <div style={{ marginTop: '1rem' }}>
            <label htmlFor="max-concurrent" style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Max Concurrent Downloads
            </label>
            <input
                id="max-concurrent"
                type="number"
                min="1"
                value={maxConcurrent}
                onChange={handleChange}
                style={{
                    padding: '0.5rem',
                    fontSize: '1rem',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    width: '100px',
                }}
            />
        </div>
    );
};

export default MaxConcurrentDownloadsInput;
