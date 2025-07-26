import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
const DownloadPathInput = () => {
    const [path, setPath] = useState('');

    useEffect(() => {
        invoke('get_download_dir').then(setPath).catch(console.error);
    }, []);

    const handleBrowse = async () => {
        const selected = await open({
            directory: true,
            multiple: false,
            title:"Choose a path:"
        });
        if (typeof selected === 'string') {
            setPath(selected);
            await invoke('set_download_dir', { newPath: selected });
        }
    };

    return (
        <div style={{ marginTop: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Default Download Directory
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                    type="text"
                    value={path}
                    readOnly
                    style={{
                        flex: 1,
                        padding: '0.5rem',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: '#f9f9f9',
                    }}
                />
                <button
                    onClick={handleBrowse}
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#007bff',
                        color: 'white',
                        fontWeight: 'bold',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                >
                    Browse
                </button>
            </div>
        </div>
    );
};

export default DownloadPathInput;
