const BG_COLOR = '#E0E5EC'; // Softer background for neumorphism
const SURFACE_COLOR = '#E0E5EC'; // Same as BG for seamless integration
const TEXT_PRIMARY = '#343A40'; // Darker, softer text
const TEXT_SECONDARY = '#A3B1C6'; // Lighter, subtle text for secondary elements
const ACCENT = '#FF6B6B'; // Softer, more vibrant accent
const ACCENT_LIGHT = '#FF8E8E'; // Lighter accent for highlights
const ERROR = '#DC3545'; // Softer error red
const WARNING = '#FFC107'; // Softer warning yellow
const SHADOW_LIGHT = '#FFFFFF'; // Highlight shadow (top-left)
const SHADOW_DARK = '#A3B1C6'; // Dark shadow (bottom-right)
const SHADOW_COLOR = '#A3B1C6'; // Dark shadow (bottom-right)
const BORDER_COLOR = 'transparent'; // No hard borders in neumorphism

const getButtonStyles = (type, isDisabled) => {
    const baseStyles = {
        fontWeight: 'bold', // Slightly bolder for better readability on soft surfaces
        textTransform: 'uppercase',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease-in-out', // Smoother transitions
        userSelect: 'none',
        borderRadius: '12px', // Rounded corners for neumorphism
        border: BORDER_COLOR, // No visible border
        backgroundColor: SURFACE_COLOR,
        color: TEXT_PRIMARY,
        boxShadow: isDisabled ?
            'none' : // No shadow for disabled buttons
            `5px 5px 10px ${SHADOW_DARK}, -5px -5px 10px ${SHADOW_LIGHT}`, // Extruded effect
        fontFamily: '"Arial", sans-serif', // Softer font for neumorphism
        letterSpacing: '0.02em', // Subtle letter spacing
    };

    let specificStyles = {};
    let hoverBg = SURFACE_COLOR;
    let hoverColor = TEXT_PRIMARY;
    let hoverShadow = `inset 3px 3px 7px ${SHADOW_DARK}, inset -3px -3px 7px ${SHADOW_LIGHT}`; // Pressed effect
    let activeShadow = `inset 3px 3px 7px ${SHADOW_DARK}, inset -3px -3px 7px ${SHADOW_LIGHT}`; // Active (pressed) effect

    switch (type) {
        case 'primary':
            specificStyles = {
                padding: '1.2rem 2.5rem',
                fontSize: '1rem',
                backgroundColor: ACCENT,
                color: SHADOW_LIGHT, // Lighter text on accent background
                boxShadow: `5px 5px 10px ${SHADOW_DARK}, -5px -5px 10px ${SHADOW_LIGHT}`,
            };
            hoverBg = ACCENT_LIGHT;
            hoverColor = SHADOW_LIGHT;
            hoverShadow = `inset 3px 3px 7px ${SHADOW_DARK}, inset -3px -3px 7px ${SHADOW_LIGHT}`;
            activeShadow = `inset 3px 3px 7px ${SHADOW_DARK}, inset -3px -3px 7px ${SHADOW_LIGHT}`;
            break;
        case 'tab':
            specificStyles = {
                padding: '0.8rem 1.6rem',
                fontSize: '0.9rem',
                backgroundColor: SURFACE_COLOR,
                color: TEXT_PRIMARY,
                boxShadow: `3px 3px 6px ${SHADOW_DARK}, -3px -3px 6px ${SHADOW_LIGHT}`,
            };
            hoverBg = BG_COLOR; // Subtle hover effect
            hoverColor = TEXT_PRIMARY;
            hoverShadow = `inset 2px 2px 5px ${SHADOW_DARK}, inset -2px -2px 5px ${SHADOW_LIGHT}`;
            activeShadow = `inset 2px 2px 5px ${SHADOW_DARK}, inset -2px -2px 5px ${SHADOW_LIGHT}`;
            break;
        case 'pause':
            specificStyles = {
                padding: '0.7rem 1.3rem',
                fontSize: '0.85rem',
                backgroundColor: WARNING,
                color: TEXT_PRIMARY,
                boxShadow: `4px 4px 8px ${SHADOW_DARK}, -4px -4px 8px ${SHADOW_LIGHT}`,
            };
            hoverBg = WARNING;
            hoverColor = TEXT_PRIMARY;
            hoverShadow = `inset 2px 2px 5px ${SHADOW_DARK}, inset -2px -2px 5px ${SHADOW_LIGHT}`;
            activeShadow = `inset 2px 2px 5px ${SHADOW_DARK}, inset -2px -2px 5px ${SHADOW_LIGHT}`;
            break;
        case 'resume':
            specificStyles = {
                padding: '0.7rem 1.3rem',
                fontSize: '0.85rem',
                backgroundColor: ACCENT,
                color: SHADOW_LIGHT,
                boxShadow: `4px 4px 8px ${SHADOW_DARK}, -4px -4px 8px ${SHADOW_LIGHT}`,
            };
            hoverBg = ACCENT;
            hoverColor = SHADOW_LIGHT;
            hoverShadow = `inset 2px 2px 5px ${SHADOW_DARK}, inset -2px -2px 5px ${SHADOW_LIGHT}`;
            activeShadow = `inset 2px 2px 5px ${SHADOW_DARK}, inset -2px -2px 5px ${SHADOW_LIGHT}`;
            break;
        case 'remove':
            specificStyles = {
                padding: '0.7rem 1.3rem',
                fontSize: '0.85rem',
                backgroundColor: ERROR,
                color: SHADOW_LIGHT,
                boxShadow: `4px 4px 8px ${SHADOW_DARK}, -4px -4px 8px ${SHADOW_LIGHT}`,
            };
            hoverBg = ERROR;
            hoverColor = SHADOW_LIGHT;
            hoverShadow = `inset 2px 2px 5px ${SHADOW_DARK}, inset -2px -2px 5px ${SHADOW_LIGHT}`;
            activeShadow = `inset 2px 2px 5px ${SHADOW_DARK}, inset -2px -2px 5px ${SHADOW_LIGHT}`;
            break;
        case 'remove-queue':
            specificStyles = {
                padding: '0.7rem 1.3rem',
                fontSize: '0.85rem',
                backgroundColor: SURFACE_COLOR,
                color: TEXT_PRIMARY,
                boxShadow: `4px 4px 8px ${SHADOW_DARK}, -4px -4px 8px ${SHADOW_LIGHT}`,
            };
            hoverBg = BG_COLOR;
            hoverColor = TEXT_PRIMARY;
            hoverShadow = `inset 2px 2px 5px ${SHADOW_DARK}, inset -2px -2px 5px ${SHADOW_LIGHT}`;
            activeShadow = `inset 2px 2px 5px ${SHADOW_DARK}, inset -2px -2px 5px ${SHADOW_LIGHT}`;
            break;
        case 'confirm':
            specificStyles = {
                padding: '0.8rem 1.6rem',
                fontSize: '0.9rem',
                backgroundColor: ERROR,
                color: SHADOW_LIGHT,
                boxShadow: `4px 4px 8px ${SHADOW_DARK}, -4px -4px 8px ${SHADOW_LIGHT}`,
            };
            hoverBg = ERROR;
            hoverColor = SHADOW_LIGHT;
            hoverShadow = `inset 2px 2px 5px ${SHADOW_DARK}, inset -2px -2px 5px ${SHADOW_LIGHT}`;
            activeShadow = `inset 2px 2px 5px ${SHADOW_DARK}, inset -2px -2px 5px ${SHADOW_LIGHT}`;
            break;
        case 'cancel':
            specificStyles = {
                padding: '0.8rem 1.6rem',
                fontSize: '0.9rem',
                backgroundColor: SURFACE_COLOR,
                color: TEXT_PRIMARY,
                boxShadow: `4px 4px 8px ${SHADOW_DARK}, -4px -4px 8px ${SHADOW_LIGHT}`,
            };
            hoverBg = BG_COLOR;
            hoverColor = TEXT_PRIMARY;
            hoverShadow = `inset 2px 2px 5px ${SHADOW_DARK}, inset -2px -2px 5px ${SHADOW_LIGHT}`;
            activeShadow = `inset 2px 2px 5px ${SHADOW_DARK}, inset -2px -2px 5px ${SHADOW_LIGHT}`;
            break;
        default:
            break;
    }

    if (isDisabled) {
        specificStyles.backgroundColor = SHADOW_DARK; // Darker disabled color
        specificStyles.color = TEXT_SECONDARY; // Lighter text on disabled background
        specificStyles.cursor = 'not-allowed';
        specificStyles.boxShadow = 'none'; // No shadow for disabled buttons
        hoverBg = specificStyles.backgroundColor;
        hoverColor = specificStyles.color;
        hoverShadow = 'none';
        activeShadow = 'none';
    }

    return {
        style: { ...baseStyles, ...specificStyles },
        onMouseDown: isDisabled ? null : (e) => {
            e.currentTarget.style.boxShadow = activeShadow;
            e.currentTarget.style.transform = 'scale(0.98)'; // Slight scale down on press
        },
        onMouseUp: isDisabled ? null : (e) => {
            e.currentTarget.style.boxShadow = specificStyles.boxShadow;
            e.currentTarget.style.transform = 'scale(1)'; // Reset scale
        },
        onMouseEnter: isDisabled ? null : (e) => {
            e.currentTarget.style.backgroundColor = hoverBg;
            e.currentTarget.style.color = hoverColor;
            e.currentTarget.style.boxShadow = hoverShadow;
        },
        onMouseLeave: isDisabled ? null : (e) => {
            e.currentTarget.style.backgroundColor = specificStyles.backgroundColor;
            e.currentTarget.style.color = specificStyles.color;
            e.currentTarget.style.boxShadow = specificStyles.boxShadow;
            e.currentTarget.style.transform = 'scale(1)';
        },
    };
};

const styles = {
    container: {
        padding: '1.5rem',
        fontFamily: '"Segoe UI", sans-serif', // Modern, clean font
        margin: '0 auto',
        backgroundColor: BG_COLOR,
        height: "calc(100vh - 6.4rem)", // Adjusted for padding
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '0px', // Large border-radius for main container
        boxShadow: `10px 10px 20px ${SHADOW_DARK}, -10px -10px 20px ${SHADOW_LIGHT}`, // Extruded effect
        color: TEXT_PRIMARY,
        overflow: "hidden",
        border: 'none', // No hard border
    },
    inputRow: {
        display: 'flex',
        flexDirection: 'row',
        gap: '1rem',
        marginBottom: '1rem',
        borderBottom: `1px solid ${SHADOW_DARK}`, // Subtle separator
        paddingBottom: '1rem',
    },
    input: {
        flex: '1',
        padding: '1rem 1.5rem',
        border: 'none',
        backgroundColor: BG_COLOR, // Input matches background for 'pressed in' look
        color: TEXT_PRIMARY,
        fontSize: '1rem',
        outline: 'none',
        fontFamily: '"Segoe UI", sans-serif',
        borderRadius: '10px',
        boxShadow: `inset 4px 4px 8px ${SHADOW_DARK}, inset -4px -4px 8px ${SHADOW_LIGHT}`, // Inset shadow for input
    },
    tabRow: {
        display: 'flex',
        gap: '1rem',
        marginBottom: '1rem',
        paddingBottom: '0.8rem',
        borderBottom: `1px solid ${SHADOW_DARK}`,
    },
    tab: (isActive) => ({
        ...getButtonStyles('tab', false).style,
        backgroundColor: isActive ? ACCENT : BG_COLOR, // Accent for active tab, BG for inactive
        color: isActive ? SHADOW_LIGHT : TEXT_PRIMARY,
        boxShadow: isActive ?
            `inset 3px 3px 7px ${SHADOW_DARK}, inset -3px -3px 7px ${SHADOW_LIGHT}` : // Pressed in for active
            `3px 3px 6px ${SHADOW_DARK}, -3px -3px 6px ${SHADOW_LIGHT}`, // Extruded for inactive
        fontWeight: 'normal',
        borderRadius: '10px',
        padding: '0.8rem 1.8rem',
    }),
    collapseAll: {
        marginBottom: '1.5rem',
        textAlign: 'right',
    },
    collapseAllBtn: {
        ...getButtonStyles('remove-queue', false).style,
        fontSize: '0.9rem',
        padding: '0.6rem 1.4rem',
        backgroundColor: BG_COLOR,
        color: TEXT_PRIMARY,
        boxShadow: `3px 3px 6px ${SHADOW_DARK}, -3px -3px 6px ${SHADOW_LIGHT}`,
    },
    downloadsSection: {
        flexGrow: '1',
    },
    searchInput: {
        width: '100%',
        boxSizing: 'border-box',
        padding: '0.5rem',
        marginBottom: '1rem',
        border: 'none',
        backgroundColor: BG_COLOR,
        color: TEXT_PRIMARY,
        fontSize: '1rem',
        outline: 'none',
        fontFamily: '"Segoe UI", sans-serif',
        borderRadius: '10px',
        boxShadow: `inset 4px 4px 8px ${SHADOW_DARK}, inset -4px -4px 8px ${SHADOW_LIGHT}`,
    },
    downloadsGrid: {
        display: 'grid',
        height: "calc(100vh - 230px)", // Adjusted height
    },
    downloadsList: {
        gap: '1rem',
        overflow: "auto",
        height: "calc(100% - 65px)", // Adjusted height
        paddingRight: '10px', // For scrollbar
    },
    downloadItem: (dl, isExpanded) => ({
        background: `linear-gradient(to right, ${dl.status === "downloading" ? ACCENT :
      dl.status === "paused" ? WARNING :
        dl.status?.failed ? ERROR :
          TEXT_SECONDARY} ${dl.progress}%, ${SURFACE_COLOR} ${dl.progress}%)`,

        transition: 'all 0.3s ease-in-out',
        padding: '0.4rem 1.2rem',
        marginBottom: "0.7rem", // Spacing between items
        borderRadius: '15px',
        boxShadow: `6px 6px 12px ${SHADOW_DARK}, -6px -6px 12px ${SHADOW_LIGHT}`, // Extruded effect
        border: 'none',
        color: TEXT_PRIMARY,
        position: 'relative',
        cursor: 'pointer',
        // Progress indicator integrated subtly
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${dl.progress}%`,
            backgroundColor: dl.status === "downloading" ? ACCENT_LIGHT :
                dl.status === "paused" ? WARNING :
                dl.status?.failed ? ERROR :
                SHADOW_DARK, // Finished items can have a subtle fill
            borderRadius: '15px',
            opacity: dl.progress > 0 ? 0.3 : 0, // Subtle opacity for progress
            transition: 'width 0.3s ease-out, opacity 0.3s ease-out',
            zIndex: -1,
        }
    }),
    downloadItemHeader: (isExpanded, isQueued) => ({
        display: 'flex',
        alignItems: "center",
        fontSize: '1rem',
        fontWeight: 'bold',
        marginBottom: isExpanded && isQueued ? '0.6rem' : '0',
        color: TEXT_PRIMARY,
    }),
    extensionTag: {
        padding: '5px 8px',
        marginRight: '8px',
        backgroundColor: ACCENT,
        color: SHADOW_LIGHT,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: '0.75rem',
        borderRadius: '8px',
        boxShadow: `2px 2px 4px ${SHADOW_DARK}, -2px -2px 4px ${SHADOW_LIGHT}`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '2.5rem',
        border: 'none',
    },
    fileName: {
        wordBreak: 'break-all',
        fontWeight: "600",
        letterSpacing: "0.5px",
        flex: 1, // Allows text to take available space
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        marginRight: '10px', // Space before progress/arrow
    },
    progress: {
        fontSize: '1.05rem',
        fontWeight: 'bold',
        fontFamily: '"Segoe UI", sans-serif',
        color: TEXT_PRIMARY,
        marginLeft: 'auto',
        whiteSpace: 'nowrap',
    },
    expandArrow: (isExpanded) => ({
        fontSize: '1.3rem',
        fontWeight: 'bold',
        color: TEXT_SECONDARY,
        transition: 'transform 0.2s ease-in-out',
        transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
        marginLeft: '0.8rem',
        whiteSpace: 'nowrap',
    }),
    queueTag: {
        backgroundColor: TEXT_PRIMARY,
        color: ACCENT,
        padding: '0.3rem 0.6rem',
        fontSize: '0.75rem',
        fontWeight: 'bold',
        borderRadius: '8px',
        boxShadow: `2px 2px 4px ${SHADOW_DARK}, -2px -2px 4px ${SHADOW_LIGHT}`,
        display: 'inline-block',
        marginBottom: '0.8rem',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        border: 'none',
    },
    expandedDetails: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', // Slightly wider columns
        gap: '0.6rem',
        fontSize: '0.85rem',
        fontFamily: '"Segoe UI", sans-serif',
        marginBottom: '1rem',
        color: TEXT_PRIMARY,
        border: 'none',
        padding: '1rem',
        backgroundColor: BG_COLOR,
        borderRadius: '10px',
        boxShadow: `inset 3px 3px 6px ${SHADOW_DARK}, inset -3px -3px 6px ${SHADOW_LIGHT}`, // Inset for details
    },
    expandedDetailsText: {
        color: TEXT_PRIMARY,
        fontWeight: 'normal',
    },
    expandedActions: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.8rem', // More space between actions
    },
    noDownloads: {
        fontSize: '1.35rem',
        color: TEXT_SECONDARY,
        fontWeight: 'normal',
        textAlign: 'center',
        padding: '3rem 0',
        backgroundColor: SURFACE_COLOR,
        borderRadius: '15px',
        boxShadow: `6px 6px 12px ${SHADOW_DARK}, -6px -6px 12px ${SHADOW_LIGHT}`,
        border: 'none',
    },
    section: {
        flexGrow: '1',
        backgroundColor: SURFACE_COLOR,
        padding: '1.5rem',
        borderRadius: '15px',
        boxShadow: `8px 8px 16px ${SHADOW_DARK}, -8px -8px 16px ${SHADOW_LIGHT}`,
        border: 'none',
        color: TEXT_PRIMARY,
        overflowY: 'auto', // Allows scrolling for content
    },
    settingsHeader: {
        fontSize: '2rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem',
        paddingBottom: '0.8rem',
        borderBottom: `1px solid ${SHADOW_DARK}`,
        color: TEXT_PRIMARY,
        textTransform: 'uppercase',
        textShadow: '1px 1px 2px rgba(0,0,0,0.1)', // Subtle text shadow
    },
    settingsContent: {
        fontSize: '1.1rem',
        color: TEXT_SECONDARY,
        height: "calc(100vh - 300px)", // Adjusted height
        overflow: "auto",
        paddingRight: '10px',
    },
    settingsInner: {
        padding: '1.5rem',
    },
    settingsTitle: {
        fontSize: '1.6rem',
        fontWeight: 'bold',
        marginBottom: '1.2rem',
        color: TEXT_PRIMARY,
    },
    confirmDialog: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)', // Softer overlay
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    dialogContent: {
        backgroundColor: SURFACE_COLOR,
        padding: '2.5rem',
        borderRadius: '20px',
        boxShadow: `10px 10px 20px ${SHADOW_DARK}, -10px -10px 20px ${SHADOW_LIGHT}`,
        border: 'none',
        maxWidth: '30rem',
        width: '90%',
        textAlign: 'center',
        color: TEXT_PRIMARY,
    },
    dialogTitle: {
        fontSize: '1.8rem',
        fontWeight: 'bold',
        fontFamily: '"Segoe UI", sans-serif',
        letterSpacing: '0.05em',
        marginBottom: '1.8rem',
        color: TEXT_PRIMARY,
        textTransform: 'uppercase',
    },
    dialogText: {
        marginBottom: '2.2rem',
        fontSize: '1.1rem',
        color: TEXT_PRIMARY,
        fontFamily: '"Segoe UI", sans-serif',
        fontWeight: 'normal',
        lineHeight: '1.5',
    },
    dialogCheckboxRow: {
        marginBottom: '2.2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
    },
    dialogCheckboxLabel: {
        fontSize: '1rem',
        fontWeight: 'normal',
        color: TEXT_PRIMARY,
        textTransform: 'uppercase',
        fontFamily: '"Segoe UI", sans-serif',
    },
    dialogActions: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '1.2rem',
    },
    conflictDialogContent: {
        backgroundColor: SURFACE_COLOR,
        padding: '2.5rem',
        borderRadius: '20px',
        boxShadow: `10px 10px 20px ${SHADOW_DARK}, -10px -10px 20px ${SHADOW_LIGHT}`,
        border: 'none',
        maxWidth: '90%',
        width: '480px', // Slightly wider
        textAlign: 'center',
        color: TEXT_PRIMARY,
    },
    conflictDialogTitle: {
        fontSize: '1.6rem',
        fontWeight: 'bold',
        fontFamily: '"Segoe UI", sans-serif',
        letterSpacing: '0.05em',
        marginBottom: '1.8rem',
        color: TEXT_PRIMARY,
        textTransform: 'uppercase',
    },
    conflictDialogText: {
        marginBottom: '1.8rem',
        fontSize: '1.1rem',
        color: TEXT_PRIMARY,
        fontFamily: '"Segoe UI", sans-serif',
        fontWeight: 'normal',
        lineHeight: '1.5',
    },
    conflictDialogInput: {
        width: '100%',
        boxSizing: 'border-box',
        padding: '1.2rem 1.5rem',
        marginBottom: '1.8rem',
        border: 'none',
        backgroundColor: BG_COLOR,
        color: TEXT_PRIMARY,
        fontSize: '1.125rem',
        outline: 'none',
        fontFamily: '"Segoe UI", sans-serif',
        borderRadius: '10px',
        boxShadow: `inset 4px 4px 8px ${SHADOW_DARK}, inset -4px -4px 8px ${SHADOW_LIGHT}`,
    },
};

const ALL = {
       BG_COLOR,
       SURFACE_COLOR,
       TEXT_PRIMARY,
       TEXT_SECONDARY,
       ACCENT,
       ACCENT_LIGHT,
       ERROR,
       WARNING,
       SHADOW_LIGHT,
       SHADOW_DARK,
       SHADOW_COLOR,
       BORDER_COLOR,
       getButtonStyles,
       styles,
}

export default ALL;
