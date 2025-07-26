import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { useEffect, useRef, useState } from 'react';
import SpeedLimiterControl from "./Components/SpeedLimiterControl.jsx";
import MaxConcurrentDownloadsInput from "./Components/MaxConcurrentDownloadsInput.jsx";
import DownloadPathInput from "./Components/DownloadPathInput.jsx";
import {openFile, openFolder} from "./utils/Opener.js";
import RetrySettings from "./Components/RetrySettings.jsx";
import AutoStartToggle from "./Components/AutostartToggle.jsx";
import glass from './uis/glass.js';
import material from './uis/material.js';
import brutal from './uis/brutal3.js';
import morph from './uis/morph.js';
import anime from './uis/anime.js';
import {webviewWindow} from "@tauri-apps/api";





const formatBytes = (bytes, decimals = 2) => {
    if (bytes === null || bytes === undefined) return 'N/A BYTES';
    if (bytes === 0) return '0 BYTES';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['BYTES', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const formatTime = (seconds) => {
    if (seconds === null || seconds === undefined || isNaN(seconds) || seconds < 0) return 'N/A';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}M ${s}S`;
};

const getFullExtension = (filePath) => {
    if (!filePath) return null;
    const fileName = filePath.split(/[\\/]/).pop();
    if (!fileName) return null;

    const lowerCaseFileName = fileName.toLowerCase();

    const knownCompoundExts = ['tar.gz', 'tar.xz', 'tar.bz2', 'tar.zst', 'pkg.tar.zst', 'sql.gz'];
    for (const ext of knownCompoundExts) {
        if (lowerCaseFileName.endsWith('.' + ext)) {
            return '.' + ext;
        }
    }

    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex === -1) return null;

    return fileName.slice(lastDotIndex);
};




function App() {

    const [theme, setTheme] = useState(material);
    function getTheme_() {
        let th = localStorage.getItem('theme') || "brutal";
        if (th === "brutal") th = brutal;
        else if (th === "glass") th = glass;
        else if (th === "morph") th = morph;
        else if (th === "anime") th = anime;
        else if (th === "material") th = material;
        else th = brutal;
        setTheme(th);
        return th;
    }
    function setTheme_(val) {
        localStorage.setItem('theme', val);
        getTheme_()
    }

    useEffect(() => {
        let storedTheme = getTheme_();
    },[])
    const [downloads, setDownloads] = useState([]);
    const [url, setUrl] = useState('');
    const [tab, setTab] = useState('downloads');
    const [searchTerm, setSearchTerm] = useState('');
    const [speedLimit, setSpeedLimit] = useState(null);

    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [downloadToRemove, setDownloadToRemove] = useState(null);
    const [removeFileFromDisk, setRemoveFileFromDisk] = useState(false);
    const [queue, setQueue] = useState([]);
    const [fileConflict, setFileConflict] = useState(null);
    const [downloadPath, setDownloadPath] = useState('');
    const [maxConcurrentDownloads, setMaxConcurrentDownloads] = useState(1);
    const [retryAttempts, setRetryAttempts] = useState(3);
    const [retryDelay, setRetryDelay] = useState(5);
    const [autoStart, setAutoStart] = useState(false);


    const [expandedItems, setExpandedItems] = useState(new Set());


    const toggleExpand = (id) => {
        setExpandedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };



    const collapseAll = () => {
        setExpandedItems(new Set());
    };


    const removeFromQueue = async (id) => {
        try {
            await invoke('remove_from_queue', { id });
            await refresh();
        } catch (err) {
            console.error("Failed to remove from queue:", err);
        }
    };


    const refresh = async () => {
        try {

            const [dls, q, limit] = await Promise.all([
                invoke('get_downloads'),
                invoke('get_queue'),
                invoke('get_speed_limit').catch(() => null),
            ]);
            setDownloads(dls);
            setQueue(q.map(dl => dl.id));
            setSpeedLimit(limit ?? null);
        } catch (err) {
            console.error("Error refreshing:", err);
        }
    };


    const [promptDefault, setPromptDefault] = useState("")
    const enqueueDownload = async () => {
        if (!url.trim()) return;

        try {
            const [exists, path] = await invoke('check_file_existence', { url });

            if (exists) {
                setFileConflict({ url, filePath: path });
                setPromptDefault(path.split(/[\\/]/).pop());
                return;
            }

            await invoke('enqueue_download_with_options', {
                url,
                overwrite: false,
                resume: false,
                saveAs: "",
            });
            setUrl('');
            await refresh();
        } catch (err) {
            console.error("Failed to enqueue download:", err);
        }
    };

    const handleFileConflictAction = async (action, customName = "") => {
        if (!fileConflict) return;

        const options = {
            url: fileConflict.url,
            overwrite: action === 'overwrite',
            resume: action === 'resume',
            saveAs: action === 'save_as' ? customName : "",
        };
        try {
            await invoke('enqueue_download_with_options', options);
        } catch (e) {
            console.error("Failed to add download:", e);
        }

        setFileConflict(null);
        setPromptDefault('');
        setUrl('');
        await refresh();
    };



    const pauseDownload = async (id) => {
        try {
            await invoke('pause_download', { id });
            await refresh();
        } catch (error) {
            console.error('Failed to pause download:', error);
        }
    };


    const resumeDownload = async (id) => {
        try {
            await invoke('resume_download', { id });
            await refresh();
        } catch (error) {
            console.error('Failed to resume download:', error);
        }
    };


    const handleRemoveClick = (dl) => {
        setDownloadToRemove(dl);

        const shouldRemoveFile = dl.status === 'completed';
        setRemoveFileFromDisk(shouldRemoveFile);
        setShowConfirmDialog(true);
    };


    const confirmRemoveDownload = async () => {
        if (downloadToRemove) {
            try {

                await invoke('remove_download', { id: downloadToRemove.id, remove_from_disk: removeFileFromDisk });
                await refresh();
            } catch (e) {
                console.error("Remove failed:", e);
            } finally {

                setShowConfirmDialog(false);
                setDownloadToRemove(null);
                setRemoveFileFromDisk(false);
            }
        }
    };


    const cancelRemoveDownload = () => {
        setShowConfirmDialog(false);
        setDownloadToRemove(null);
        setRemoveFileFromDisk(false);
    };


    const filteredDownloads = downloads.filter(dl =>
        (dl.file_path ? dl.file_path.split(/[\\/]/).pop().toLowerCase() : 'unknown file')
            .includes(searchTerm.toLowerCase())
    );


    useEffect(() => {
        const handleProgress = async () => {
            try {
                const dls = await invoke('get_downloads');
                setDownloads(dls);


                dls.forEach(async dl => {
                    if (dl.status === 'completed') {
                        const fileName = dl.file_path?.split(/[\\/]/).pop() ?? 'Unknown File';
                        sendNotif("Download Complete", `${fileName} has finished downloading!`);
                    } else if (typeof dl.status === 'string' && dl.status.startsWith('failed')) {
                        const fileName = dl.file_path?.split(/[\\/]/).pop() ?? 'Unknown File';
                        sendNotif("Download Failed", `${fileName} failed to download: ${dl.status.replace('failed: ', '')}`);
                    }
                });

            } catch (err) {
                console.error('Failed to get downloads:', err);
            }
        };

        refresh();

        const unlistenPromise = listen('download-progress', handleProgress);

        return () => {
            unlistenPromise.then(unlisten => unlisten());
        };
    }, []);

    return (
        <div  style={{height: "100vh",overflow: "hidden"}}>

            <style>
                {`
                /* Neobrutalist Scrollbar Styles */
                ::-webkit-scrollbar {
                    width: 12px;
                    height: 12px;
                }
                ::-webkit-scrollbar-track {
                    background: ${theme.BG_COLOR};
                    border: 2px solid ${theme.BORDER_COLOR};
                    border-radius: 0px;
                }
                ::-webkit-scrollbar-thumb {
                    background-color: ${theme.ACCENT};
                    border: 2px solid ${theme.BORDER_COLOR};
                    border-radius: 0px;
                    box-shadow: 0 0 5px ${theme.SHADOW_COLOR};
                }
                input::placeholder {
                    color: ${theme.TEXT_SECONDARY};
                    opacity: 1;
                    font-style: normal;
                }
                input[type="checkbox"] {
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    appearance: none;
                    width: 1.5rem;
                    height: 1.5rem;
                    border: 2px solid ${theme.BORDER_COLOR};
                    background-color: ${theme.SURFACE_COLOR};
                    cursor: pointer;
                    position: relative;
                    outline: none;
                    box-shadow: 2px 2px 0px ${theme.SHADOW_COLOR};
                }
                input[type="checkbox"]:checked {
                    background-color: ${theme.ACCENT};
                    border-color: ${theme.ACCENT};
                }
                input[type="checkbox"]:checked::after {
                    content: 'X';
                    display: block;
                    color: ${theme.TEXT_PRIMARY};
                    font-size: 1rem;
                    line-height: 1.3rem;
                    text-align: center;
                    font-weight: 900;
                }
                `}
            </style>



            <div
                data-tauri-drag-region
                style= {{...theme.styles.container,height: "fit-content",padding:0,borderBottom:"1px solid "+theme.BORDER_COLOR}}
            >
                <div
                    data-tauri-drag-region
                    style={{
                        width: '100%',
                        borderTop: 'none',
                        borderLeft: 'none',
                        borderRight: 'none',
                        borderBottom: 'none',
                    }}
                >
                    <div
                        data-tauri-drag-region
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.5rem',
                        }}
                    >
                        {/* Left side title + red light */}
                        <div
                            data-tauri-drag-region
                            style={{ display: 'flex', alignItems: 'center' }}
                        >
            <span
                style={{
                    fontSize: '1.25rem',
                    fontWeight: '500',
                    letterSpacing: '0.05em',
                    marginRight: '1rem',
                }}
            >
              MadByte
            </span>
                        </div>

                        {/* Right side buttons */}
                        <div data-tauri-drag-region style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                onClick={() => webviewWindow.WebviewWindow.getCurrent().minimize()}
                                {...theme.getButtonStyles("pause", false)}
                            >
                            </button>

                            <button
                                onClick={() => webviewWindow.WebviewWindow.getCurrent().toggleMaximize()}
                                {...theme.getButtonStyles("resume", false)}
                            >
                            </button>

                            <button
                                onClick={() => webviewWindow.WebviewWindow.getCurrent().hide()}
                                {...theme.getButtonStyles("remove", false)}
                            >
                                <span style={{ fontWeight: 'bold', fontSize: '0rem',color:"transparent" }}>×</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>


        <div style={theme.styles.container}>

            <div style={theme.styles.inputRow}>
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="ENTER URL TO DOWNLOAD..."
                    style={theme.styles.input}
                />
                <button
                    {...theme.getButtonStyles('primary', false)}
                    onClick={enqueueDownload}
                >
                    Download
                </button>
            </div>

            <div style={theme.styles.tabRow}>
                <button
                    {...theme.getButtonStyles('tab', false)}
                    onClick={() => setTab('downloads')}
                    style={theme.styles.tab(tab === 'downloads')}
                >
                    DOWNLOADS
                </button>
                <button
                    {...theme.getButtonStyles('tab', false)}
                    onClick={() => setTab('settings')}
                    style={theme.styles.tab(tab === 'settings')}
                >
                    SETTINGS
                </button>
            </div>

            {tab === 'downloads' && (
                <div style={theme.styles.downloadsSection}>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="SEARCH DOWNLOADS BY NAME..."
                        style={theme.styles.searchInput}
                    />

                    <div style={theme.styles.downloadsGrid}>
                        <div style={theme.styles.downloadsList}>
                            {filteredDownloads.length === 0 ? (
                                <p style={theme.styles.noDownloads}>
                                    NO DOWNLOADS FOUND.
                                </p>
                            ) : (
                                filteredDownloads.reverse().map(dl => {
                                    const isQueued = queue.includes(dl.id);
                                    const isPauseDisabled = dl.status === 'paused' || dl.status === 'completed' || dl.status === 'failed';
                                    const isResumeDisabled = dl.status === 'downloading' || dl.status === 'completed' || dl.status === 'failed';
                                    const queuePosition = isQueued ? queue.indexOf(dl.id) + 1 : null;
                                    const extension = getFullExtension(dl.file_path);
                                    const isExpanded = expandedItems.has(dl.id);

                                    return (
                                        <div key={dl.id} style={theme.styles.downloadItem(dl, isExpanded)} onClick={() => toggleExpand(dl.id)}>
                                            <strong style={theme.styles.downloadItemHeader(isExpanded, isQueued)}>
                                                {extension && (
                                                    <p style={theme.styles.extensionTag}>{extension.slice(1)}</p>
                                                )}
                                                <p style={theme.styles.fileName}>
                                                    {dl.file_path ? dl.file_path.split(/[\\/]/).pop().toUpperCase() : 'UNKNOWN FILE'}
                                                </p>
                                                <span style={theme.styles.progress}>
                                                    {dl.progress.toFixed(1)}%
                                                </span>
                                                <span style={theme.styles.expandArrow(isExpanded)}>
                                                    {isExpanded ? '▼' : '▶'}
                                                </span>
                                            </strong>

                                            {isQueued && isExpanded && (
                                                <div style={theme.styles.queueTag}>
                                                    #{queuePosition} IN QUEUE
                                                </div>
                                            )}

                                            {isExpanded && (
                                                <>
                                                    <div style={theme.styles.expandedDetails}>
                                                        <div style={theme.styles.expandedDetailsText}><strong>STATUS:</strong> <span>{(dl.status?.failed ? dl.status.failed : dl.status.toUpperCase())}</span></div>
                                                        <div style={theme.styles.expandedDetailsText}>
                                                            <strong>SPEED:</strong> {dl.speed_kbps ? dl.speed_kbps.toFixed(2) : '0.00'} KB/S
                                                            {speedLimit != 0 && (
                                                                <span style={{ color: TEXT_SECONDARY, marginLeft: '6px' }}>
                                                                    {dl.status === "downloading" && `(CAP: ${speedLimit?.toFixed(0)} KB/S)`}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div style={theme.styles.expandedDetailsText}><strong>ETA:</strong> {formatTime(dl.eta_seconds).toUpperCase()}</div>
                                                        <div style={theme.styles.expandedDetailsText}><strong>DOWNLOADED:</strong> {formatBytes(dl.downloaded_bytes).toUpperCase()}</div>
                                                        <div style={theme.styles.expandedDetailsText}><strong>TOTAL:</strong> {formatBytes(dl.total_bytes).toUpperCase()}</div>
                                                    </div>

                                                    <div style={theme.styles.expandedActions}>
                                                        <button
                                                            {...theme.getButtonStyles('pause', isPauseDisabled)}
                                                            onClick={(e) => { e.stopPropagation(); pauseDownload(dl.id); }}
                                                            disabled={isPauseDisabled}
                                                        >
                                                            PAUSE
                                                        </button>
                                                        <button
                                                            {...theme.getButtonStyles('resume', isResumeDisabled)}
                                                            onClick={(e) => { e.stopPropagation(); resumeDownload(dl.id); }}
                                                            disabled={isResumeDisabled}
                                                        >
                                                            RESUME
                                                        </button>
                                                        <button
                                                            {...theme.getButtonStyles('remove', false)}
                                                            onClick={(e) => { e.stopPropagation(); handleRemoveClick(dl); }}
                                                        >
                                                            TERMINATE
                                                        </button>
                                                        {dl.status === "completed" &&
                                                            <button
                                                                {...theme.getButtonStyles('resume', false)}
                                                                onClick={(e) => { e.stopPropagation(); openFile(dl.file_path); }}
                                                            >
                                                                ACCESS FILE
                                                            </button>
                                                        }
                                                        {dl.status === "completed" &&
                                                            <button
                                                                {...theme.getButtonStyles('resume', false)}
                                                                onClick={(e) => { e.stopPropagation(); openFolder(dl.file_path); }}
                                                            >
                                                                LOCATE FOLDER
                                                            </button>
                                                        }
                                                        {isQueued && !isResumeDisabled &&
                                                            <button
                                                                {...theme.getButtonStyles('remove-queue', false)}
                                                                onClick={(e) => { e.stopPropagation(); removeFromQueue(dl.id); }}
                                                            >
                                                                DEQUEUE
                                                            </button>
                                                        }
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            )}

            {tab === 'settings' && (
                <div style={theme.styles.section}>
                    <h2 style={theme.styles.settingsHeader}>SETTINGS</h2>
                    <div style={theme.styles.settingsContent}>
                        <div style={theme.styles.settingsInner}>
                            <p style={theme.styles.settingsTitle}>SETTINGS</p>
                            <div>
                                <Dropdown
                                    theme={theme}
                                    onSelect={(t)=>{

                                        setTheme_(t.value)
                                    }}
                                    options={[
                                        { label: 'Morph', value: 'morph' },
                                        { label: 'Glass', value: 'glass' },
                                        { label: 'Anime', value: 'anime' },
                                        { label: 'Brutal', value: 'brutal' },
                                        { label: 'Material', value: 'material' },
                                    ]}
                                    placeholder={"Select Theme"}

                                />
                            </div>
                            <SpeedLimiterControl speedLimit={speedLimit} setSpeedLimit={setSpeedLimit} refresh={refresh} />
                            <MaxConcurrentDownloadsInput maxConcurrentDownloads={maxConcurrentDownloads} setMaxConcurrentDownloads={setMaxConcurrentDownloads} refresh={refresh} />
                            <DownloadPathInput downloadPath={downloadPath} setDownloadPath={setDownloadPath} refresh={refresh} />
                            <RetrySettings retryAttempts={retryAttempts} setRetryAttempts={setRetryAttempts} retryDelay={retryDelay} setRetryDelay={setRetryDelay} refresh={refresh} />
                            <AutoStartToggle autoStart={autoStart} setAutoStart={setAutoStart} refresh={refresh} />
                        </div>
                    </div>
                </div>
            )}

            {showConfirmDialog && downloadToRemove && (
                <div style={theme.styles.confirmDialog}>
                    <div style={theme.styles.dialogContent}>
                        <h3 style={theme.styles.dialogTitle}>CONFIRM TERMINATION</h3>
                        <p style={theme.styles.dialogText}>
                            INITIATE PROTOCOL FOR REMOVAL OF "
                            <span style={{ fontWeight: 'normal', wordBreak: 'break-all', color: ACCENT }}>
                                {downloadToRemove.file_path?.split(/[\\/]/).pop()?.toUpperCase() ?? 'UNKNOWN DATA'}
                            </span>
                            "?
                        </p>
                        {downloadToRemove.status === 'completed' && (
                            <div style={theme.styles.dialogCheckboxRow}>
                                <input
                                    type="checkbox"
                                    id="removeFileFromDisk"
                                    checked={removeFileFromDisk}
                                    onChange={(e) => setRemoveFileFromDisk(e.target.checked)}
                                />
                                <label htmlFor="removeFileFromDisk" style={theme.styles.dialogCheckboxLabel}>
                                    ERASE DATA FROM STORAGE
                                </label>
                            </div>
                        )}
                        <div style={theme.styles.dialogActions}>
                            <button
                                {...theme.getButtonStyles('confirm', false)}
                                onClick={confirmRemoveDownload}
                            >
                                CONFIRM
                            </button>
                            <button
                                {...theme.getButtonStyles('cancel', false)}
                                onClick={cancelRemoveDownload}
                            >
                                ABORT
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {fileConflict && (
                <div style={theme.styles.confirmDialog}>
                    <div style={theme.styles.conflictDialogContent}>
                        <h3 style={theme.styles.conflictDialogTitle}>DATA CONFLICT DETECTED</h3>
                        <p style={theme.styles.conflictDialogText}>
                            A FILE WITH THE IDENTIFIER "
                            <span style={{ fontWeight: 'normal', wordBreak: 'break-all', color: ACCENT }}>
                                {fileConflict.filePath?.split(/[\\/]/).pop()?.toUpperCase() ?? 'UNKNOWN DATA'}
                            </span>
                            " ALREADY EXISTS. INITIATE OVERRIDE PROTOCOL?
                        </p>
                        <input
                            type="text"
                            value={promptDefault}
                            onChange={(e) => setPromptDefault(e.target.value)}
                            placeholder="ENTER NEW DATA IDENTIFIER (OPTIONAL)"
                            style={theme.styles.conflictDialogInput}
                        />
                        <div style={theme.styles.dialogActions}>
                            <button
                                {...theme.getButtonStyles('primary', false)}
                                onClick={() => handleFileConflictAction('overwrite')}
                                style={{ backgroundColor: theme.WARNING, borderColor: theme.BORDER_COLOR, color: theme.TEXT_PRIMARY }}
                            >
                                OVERRIDE
                            </button>
                            <button
                                {...theme.getButtonStyles('primary', false)}
                                onClick={() => handleFileConflictAction('resume')}
                                style={{ backgroundColor: ACCENT, borderColor: BORDER_COLOR, color: TEXT_PRIMARY }}
                            >
                                RESUME TRANSFER
                            </button>
                            <button
                                {...theme.getButtonStyles('primary', !promptDefault.trim())}
                                onClick={() => handleFileConflictAction('save_as', promptDefault)}
                                style={{ backgroundColor: SURFACE_COLOR, borderColor: BORDER_COLOR, color: TEXT_PRIMARY }}
                            >
                                RENAME & SAVE
                            </button>
                            <button
                                {...theme.getButtonStyles('cancel', false)}
                                onClick={() => setFileConflict(null)}
                            >
                                CANCEL
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </div>
    );
}

const Dropdown = ({ options, onSelect, placeholder }) => {

    const [isOpen, setIsOpen] = useState(false);

    const [localSelectedOption, setLocalSelectedOption] = useState(null);

    const dropdownRef = useRef(null);


    useEffect(() => {
        const handleClickOutside = (event) => {

            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };


        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };


    const handleOptionClick = (option) => {
        setLocalSelectedOption(option);
        onSelect(option);
        setIsOpen(false);
    };


    const dropdownContainerStyles = {
        position: 'relative',
        width: '100%',
    };


    const dropdownButtonStyles = {
        width: '100%',
        padding: '0.5rem 1rem',
        textAlign: 'left',
        backgroundColor: '#ffffff',
        border: '1px solid #d1d5db',
        borderRadius: '0.375rem',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        outline: 'none',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: 'background-color 0.15s ease-in-out',
        cursor: 'pointer',
    };

    const dropdownButtonHoverStyles = {
        backgroundColor: '#f9fafb',
    };


    const dropdownButtonTextStyles = {
        color: '#4b5563',
    };


    const dropdownArrowStyles = {
        height: '1.25rem',
        width: '1.25rem',
        color: '#9ca3af',
        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.2s ease-in-out',
    };


    const dropdownListContainerStyles = {
        position: 'absolute',
        zIndex: 10,
        marginTop: '0.5rem',
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: '0.375rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e5e7eb',
        outline: 'none',
        overflow: 'hidden',
    };


    const dropdownListStyles = {
        paddingTop: '0.25rem',
        paddingBottom: '0.25rem',
    };


    const dropdownOptionStyles = {
        padding: '0.5rem 1rem',
        fontSize: '0.875rem',
        color: '#4b5563',
        cursor: 'pointer',
        transition: 'background-color 0.15s ease-in-out, color 0.15s ease-in-out',
    };

    const dropdownOptionHoverStyles = {
        backgroundColor: '#dbeafe',
        color: '#1d4ed8',
    };

    return (
        <div style={dropdownContainerStyles} ref={dropdownRef}>
            <button
                type="button"
                style={dropdownButtonStyles}
                onClick={toggleDropdown}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, dropdownButtonHoverStyles)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, dropdownButtonStyles)}
            >
                <span style={dropdownButtonTextStyles}>
                    {localSelectedOption ? localSelectedOption.label : placeholder}
                </span>

                <svg
                    style={dropdownArrowStyles}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>


            {isOpen && (
                <div
                    style={dropdownListContainerStyles}
                    role="listbox"
                >
                    <div style={dropdownListStyles}>
                        {options.map((option) => (
                            <div
                                key={option.value}
                                style={dropdownOptionStyles}
                                onClick={() => handleOptionClick(option)}
                                role="option"
                                aria-selected={localSelectedOption && localSelectedOption.value === option.value}
                                onMouseEnter={(e) => Object.assign(e.currentTarget.style, dropdownOptionHoverStyles)}
                                onMouseLeave={(e) => Object.assign(e.currentTarget.style, dropdownOptionStyles)}
                            >
                                {option.label}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
export default App;
