const BG_COLOR = '#F0F8FF'; // A light, clear background (like a bright sky)
const SURFACE_COLOR = '#FFFFFF'; // Clean white for main elements
const TEXT_PRIMARY = '#333333'; // Strong, dark text for readability
const TEXT_SECONDARY = '#666666'; // Slightly lighter for secondary info
const ACCENT = '#FF4081'; // Vibrant pink/magenta (common in anime for highlights/energy)
const ACCENT_LIGHT = '#FF80AB'; // Lighter accent for subtle variations
const ERROR = '#D32F2F'; // Strong red for errors
const WARNING = '#FFD600'; // Bright yellow for warnings
const BORDER_COLOR = '#222222'; // Bold, dark outlines
const BORDER_COLOR_DARK = '#222222'; // Bold, dark outlines
const BORDER_COLOR_LIGHT = '#CCCCCC'; // Lighter border for subtle separation
const SHADOW_COLOR = 'rgba(0, 0, 0, 0.25)'; // Sharper, more defined shadows

const getButtonStyles = (type, isDisabled) => {
    const baseStyles = {
        fontWeight: '900', // Extra bold for impact
        textTransform: 'uppercase',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s ease-out', // Snappier transitions
        userSelect: 'none',
        borderRadius: '8px', // Slightly sharper corners, but still rounded
        border: `2px solid ${BORDER_COLOR_DARK}`, // Bold outline
        backgroundColor: SURFACE_COLOR,
        color: TEXT_PRIMARY,
        boxShadow: `4px 4px 0px ${SHADOW_COLOR}`, // Distinct, offset shadow
        fontFamily: '"Comic Sans MS", "Arial Black", sans-serif', // More playful/impactful font
        letterSpacing: '0.05em', // Noticeable letter spacing
        position: 'relative', // For active state transformation
        top: '0',
        left: '0',
    };

    let specificStyles = {};
    let hoverBg = ACCENT_LIGHT;
    let hoverColor = TEXT_PRIMARY;
    let hoverBorder = `2px solid ${ACCENT}`;
    let hoverShadow = `2px 2px 0px ${SHADOW_COLOR}`; // Shadow shifts on hover/active

    switch (type) {
        case 'primary':
            specificStyles = {
                padding: '0.4rem 1rem',
                fontSize: '1rem',
                backgroundColor: ACCENT,
                color: SURFACE_COLOR, // White text on accent
                border: `2px solid ${BORDER_COLOR_DARK}`,
                boxShadow: `5px 5px 0px ${SHADOW_COLOR}`,
            };
            hoverBg = ACCENT_LIGHT;
            hoverColor = SURFACE_COLOR;
            hoverBorder = `2px solid ${BORDER_COLOR_DARK}`;
            hoverShadow = `3px 3px 0px ${SHADOW_COLOR}`;
            break;
        case 'tab':
            specificStyles = {
                padding: '0.8rem 1.6rem',
                fontSize: '0.9rem',
                backgroundColor: SURFACE_COLOR,
                color: TEXT_PRIMARY,
                border: `2px solid ${BORDER_COLOR_DARK}`,
                boxShadow: `3px 3px 0px ${SHADOW_COLOR}`,
            };
            hoverBg = ACCENT_LIGHT;
            hoverColor = TEXT_PRIMARY;
            hoverBorder = `2px solid ${ACCENT}`;
            hoverShadow = `2px 2px 0px ${SHADOW_COLOR}`;
            break;
        case 'pause':
            specificStyles = {
                padding: '0.3rem 1rem',
                fontSize: '0.85rem',
                backgroundColor: WARNING,
                color: TEXT_PRIMARY,
                border: `2px solid ${BORDER_COLOR_DARK}`,
                boxShadow: `3px 3px 0px ${SHADOW_COLOR}`,
            };
            hoverBg = WARNING;
            hoverColor = TEXT_PRIMARY;
            hoverBorder = `2px solid ${BORDER_COLOR_DARK}`;
            hoverShadow = `2px 2px 0px ${SHADOW_COLOR}`;
            break;
        case 'resume':
            specificStyles = {
                padding: '0.3rem 1rem',
                fontSize: '0.85rem',
                backgroundColor: ACCENT,
                color: SURFACE_COLOR,
                border: `2px solid ${BORDER_COLOR_DARK}`,
                boxShadow: `3px 3px 0px ${SHADOW_COLOR}`,
            };
            hoverBg = ACCENT_LIGHT;
            hoverColor = SURFACE_COLOR;
            hoverBorder = `2px solid ${BORDER_COLOR_DARK}`;
            hoverShadow = `2px 2px 0px ${SHADOW_COLOR}`;
            break;
        case 'remove':
            specificStyles = {
                padding: '0.3rem 1rem',
                fontSize: '0.85rem',
                backgroundColor: ERROR,
                color: SURFACE_COLOR,
                border: `2px solid ${BORDER_COLOR_DARK}`,
                boxShadow: `3px 3px 0px ${SHADOW_COLOR}`,
            };
            hoverBg = ERROR;
            hoverColor = SURFACE_COLOR;
            hoverBorder = `2px solid ${BORDER_COLOR_DARK}`;
            hoverShadow = `2px 2px 0px ${SHADOW_COLOR}`;
            break;
        case 'remove-queue':
            specificStyles = {
                padding: '0.3rem 1rem',
                fontSize: '0.85rem',
                backgroundColor: SURFACE_COLOR,
                color: TEXT_PRIMARY,
                border: `2px solid ${BORDER_COLOR_DARK}`,
                boxShadow: `3px 3px 0px ${SHADOW_COLOR}`,
            };
            hoverBg = ACCENT_LIGHT;
            hoverColor = TEXT_PRIMARY;
            hoverBorder = `2px solid ${ACCENT}`;
            hoverShadow = `2px 2px 0px ${SHADOW_COLOR}`;
            break;
        case 'confirm':
            specificStyles = {
                padding: '0.8rem 1.6rem',
                fontSize: '0.9rem',
                backgroundColor: ERROR,
                color: SURFACE_COLOR,
                border: `2px solid ${BORDER_COLOR_DARK}`,
                boxShadow: `3px 3px 0px ${SHADOW_COLOR}`,
            };
            hoverBg = ERROR;
            hoverColor = SURFACE_COLOR;
            hoverBorder = `2px solid ${BORDER_COLOR_DARK}`;
            hoverShadow = `2px 2px 0px ${SHADOW_COLOR}`;
            break;
        case 'cancel':
            specificStyles = {
                padding: '0.8rem 1.6rem',
                fontSize: '0.9rem',
                backgroundColor: SURFACE_COLOR,
                color: TEXT_PRIMARY,
                border: `2px solid ${BORDER_COLOR_DARK}`,
                boxShadow: `3px 3px 0px ${SHADOW_COLOR}`,
            };
            hoverBg = ACCENT_LIGHT;
            hoverColor = TEXT_PRIMARY;
            hoverBorder = `2px solid ${ACCENT}`;
            hoverShadow = `2px 2px 0px ${SHADOW_COLOR}`;
            break;
        default:
            break;
    }

    if (isDisabled) {
        specificStyles.backgroundColor = BORDER_COLOR_LIGHT; // Muted disabled color
        specificStyles.color = TEXT_SECONDARY;
        specificStyles.cursor = 'not-allowed';
        specificStyles.border = `2px solid ${BORDER_COLOR_DARK}`;
        specificStyles.boxShadow = 'none'; // No shadow for disabled buttons
        specificStyles.top = '0';
        specificStyles.left = '0';
        hoverBg = specificStyles.backgroundColor;
        hoverColor = specificStyles.color;
        hoverBorder = specificStyles.border;
        hoverShadow = 'none';
    }

    return {
        style: { ...baseStyles, ...specificStyles },
        onMouseDown: isDisabled ? null : (e) => {
            e.currentTarget.style.boxShadow = 'none'; // Shadow disappears on press
            e.currentTarget.style.transform = 'translate(4px, 4px)'; // Button shifts down-right
        },
        onMouseUp: isDisabled ? null : (e) => {
            e.currentTarget.style.boxShadow = specificStyles.boxShadow;
            e.currentTarget.style.transform = 'translate(0, 0)';
        },
        onMouseEnter: isDisabled ? null : (e) => {
            e.currentTarget.style.backgroundColor = hoverBg;
            e.currentTarget.style.color = hoverColor;
            e.currentTarget.style.border = hoverBorder;
            e.currentTarget.style.boxShadow = hoverShadow;
        },
        onMouseLeave: isDisabled ? null : (e) => {
            e.currentTarget.style.backgroundColor = specificStyles.backgroundColor;
            e.currentTarget.style.color = specificStyles.color;
            e.currentTarget.style.border = specificStyles.border;
            e.currentTarget.style.boxShadow = specificStyles.boxShadow;
            e.currentTarget.style.transform = 'translate(0, 0)';
        },
    };
};

const styles = {
    container: {
        padding: '20px',
        fontFamily: '"Comic Sans MS", "Arial Black", sans-serif', // Playful, bold font
        margin: '0 auto',
        backgroundColor: BG_COLOR,
        height: "calc(100vh - 97px)", // Full height minus header/footer
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '0px', // Sharper corners for container
        border: `3px solid ${BORDER_COLOR_DARK}`, // Strong outline for main container
        boxShadow: `8px 8px 0px ${SHADOW_COLOR}`, // Bold, offset shadow
        color: TEXT_PRIMARY,
        overflow: "hidden",
    },
    inputRow: {
        display: 'flex',
        flexDirection: 'row',
        gap: '1rem',
        marginBottom: '1rem',
        borderBottom: `2px dashed ${BORDER_COLOR_LIGHT}`, // Dashed line for separation
        paddingBottom: '1rem',
    },
    input: {
        flex: '1',
        padding: '1rem 1rem',
        border: `2px solid ${BORDER_COLOR_DARK}`, // Bold input border
        backgroundColor: SURFACE_COLOR,
        color: TEXT_PRIMARY,
        fontSize: '1.125rem',
        outline: 'none',
        fontFamily: '"Comic Sans MS", "Arial Black", sans-serif',
        borderRadius: '8px',
        boxShadow: `2px 2px 0px ${SHADOW_COLOR}`, // Offset shadow for input
    },
    tabRow: {
        display: 'flex',
        gap: '1rem',
        marginBottom: '1rem',
        paddingBottom: '0.4rem',
        borderBottom: `2px dashed ${BORDER_COLOR_LIGHT}`,
    },
    tab: (isActive) => ({
        ...getButtonStyles('tab', false).style,
        backgroundColor: isActive ? ACCENT : SURFACE_COLOR, // Accent for active tab
        color: isActive ? SURFACE_COLOR : TEXT_PRIMARY,
        border: `2px solid ${BORDER_COLOR_DARK}`,
        boxShadow: isActive ? `2px 2px 0px ${SHADOW_COLOR}` : `3px 3px 0px ${SHADOW_COLOR}`,
        borderRadius: '8px',
        padding: '0.4rem 1.8rem',
        // Active tab has a subtle "pressed" look by shifting its shadow slightly
        transform: isActive ? 'translate(2px, 2px)' : 'translate(0,0)',
        boxShadow: isActive ? `0px 0px 0px ${SHADOW_COLOR}` : `3px 3px 0px ${SHADOW_COLOR}`,
    }),
    collapseAll: {
        marginBottom: '1.5rem',
        textAlign: 'right',
    },
    collapseAllBtn: {
        ...getButtonStyles('remove-queue', false).style,
        fontSize: '0.9rem',
        padding: '0.6rem 1.4rem',
        backgroundColor: SURFACE_COLOR,
        color: TEXT_PRIMARY,
        border: `2px solid ${BORDER_COLOR_DARK}`,
        boxShadow: `3px 3px 0px ${SHADOW_COLOR}`,
    },
    downloadsSection: {
        flexGrow: '1',
    },
    searchInput: {
        width: '100%',
        boxSizing: 'border-box',
        padding: '0.5rem',
        marginBottom: '0.4rem',
        border: `2px solid ${BORDER_COLOR_DARK}`,
        backgroundColor: SURFACE_COLOR,
        color: TEXT_PRIMARY,
        fontSize: '1rem',
        outline: 'none',
        fontFamily: '"Comic Sans MS", "Arial Black", sans-serif',
        borderRadius: '8px',
        boxShadow: `2px 2px 0px ${SHADOW_COLOR}`,
    },
    downloadsGrid: {
        display: 'grid',
        height: "100%",
    },
    downloadsList: {
        gap: '1.5rem',
        overflow: "auto",
        height: "100%",
        paddingRight: '10px',
    },
    downloadItem: (dl, isExpanded) => ({
        background: `linear-gradient(to right, ${dl.status === "downloading" ? ACCENT :
      dl.status === "paused" ? WARNING :
        dl.status?.failed ? ERROR :
          TEXT_SECONDARY} ${dl.progress}%, ${SURFACE_COLOR} ${dl.progress}%)`,
    transition: 'all 0.2s ease-out',
        padding: '0.1rem 1rem',
        marginBottom: "0.7rem",
        borderRadius: '12px',
        boxShadow: `5px 5px 0px ${SHADOW_COLOR}`,
        border: `2px solid ${BORDER_COLOR_DARK}`,
        color: TEXT_PRIMARY,
        position: 'relative',
        cursor: 'pointer',
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${dl.progress}%`,
            backgroundColor: dl.status === "downloading" ? ACCENT :
                dl.status === "paused" ? WARNING :
                dl.status?.failed ? ERROR :
                ACCENT_LIGHT, // Finished items can have a subtle fill
            borderRadius: '10px',
            opacity: dl.progress > 0 ? 0.3 : 0, // Still subtle, but more visible
            transition: 'width 0.2s ease-out, opacity 0.2s ease-out',
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
        color: SURFACE_COLOR,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: '0.75rem',
        borderRadius: '6px',
        border: `1px solid ${BORDER_COLOR_DARK}`,
        boxShadow: `2px 2px 0px ${SHADOW_COLOR}`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '2.5rem',
    },
    fileName: {
        wordBreak: 'break-all',
        fontWeight: "900", // Extra bold for file names
        letterSpacing: "0.5px",
        flex: 1,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        marginRight: '10px',
    },
    progress: {
        fontSize: '1.05rem',
        fontWeight: 'bold',
        fontFamily: '"Comic Sans MS", "Arial Black", sans-serif',
        color: TEXT_PRIMARY,
        marginLeft: 'auto',
        whiteSpace: 'nowrap',
    },
    expandArrow: (isExpanded) => ({
        fontSize: '1.3rem',
        fontWeight: 'bold',
        color: TEXT_PRIMARY,
        transition: 'transform 0.2s ease-in-out',
        transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
        marginLeft: '0.8rem',
        whiteSpace: 'nowrap',
    }),
    queueTag: {
        backgroundColor: WARNING, // Bright warning color for queue
        color: TEXT_PRIMARY,
        padding: '0.3rem 0.6rem',
        fontSize: '0.75rem',
        fontWeight: 'bold',
        borderRadius: '6px',
        border: `1px solid ${BORDER_COLOR_DARK}`,
        boxShadow: `2px 2px 0px ${SHADOW_COLOR}`,
        display: 'inline-block',
        marginBottom: '0.8rem',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
    },
    expandedDetails: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '0.6rem',
        fontSize: '0.85rem',
        fontFamily: '"Comic Sans MS", "Arial Black", sans-serif',
        marginBottom: '1rem',
        color: TEXT_PRIMARY,
        border: `2px dashed ${BORDER_COLOR_LIGHT}`, // Dashed border for details
        padding: '1rem',
        backgroundColor: BG_COLOR, // Details background matches main background
        borderRadius: '8px',
        boxShadow: `1px 1px 0px ${SHADOW_COLOR}`, // Subtle offset shadow
    },
    expandedDetailsText: {
        color: TEXT_PRIMARY,
        fontWeight: 'normal',
    },
    expandedActions: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.8rem',
    },
    noDownloads: {
        fontSize: '1.35rem',
        color: TEXT_SECONDARY,
        fontWeight: 'normal',
        textAlign: 'center',
        padding: '3rem 0',
        backgroundColor: SURFACE_COLOR,
        borderRadius: '12px',
        boxShadow: `5px 5px 0px ${SHADOW_COLOR}`,
        border: `2px solid ${BORDER_COLOR_DARK}`,
    },
    section: {
        flexGrow: '1',
        backgroundColor: SURFACE_COLOR,
        padding: '1.5rem',
        borderRadius: '12px',
        boxShadow: `6px 6px 0px ${SHADOW_COLOR}`,
        border: `2px solid ${BORDER_COLOR_DARK}`,
        color: TEXT_PRIMARY,
        overflowY: 'auto',
    },
    settingsHeader: {
        fontSize: '2rem',
        fontWeight: '900',
        marginBottom: '1.5rem',
        paddingBottom: '0.8rem',
        borderBottom: `2px dashed ${BORDER_COLOR_LIGHT}`,
        color: TEXT_PRIMARY,
        textTransform: 'uppercase',
        textShadow: `2px 2px 0px ${SHADOW_COLOR}`, // Stronger text shadow
    },
    settingsContent: {
        fontSize: '1.1rem',
        color: TEXT_SECONDARY,
        height: "calc(100vh - 300px)",
        overflow: "auto",
        paddingRight: '10px',
    },
    settingsInner: {
        padding: '1.5rem',
    },
    settingsTitle: {
        fontSize: '1.6rem',
        fontWeight: '900',
        marginBottom: '1.2rem',
        color: TEXT_PRIMARY,
    },
    confirmDialog: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)', // Darker, opaque overlay
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    dialogContent: {
        backgroundColor: SURFACE_COLOR,
        padding: '2.5rem',
        borderRadius: '15px',
        boxShadow: `8px 8px 0px ${SHADOW_COLOR}`,
        border: `3px solid ${BORDER_COLOR_DARK}`,
        maxWidth: '30rem',
        width: '90%',
        textAlign: 'center',
        color: TEXT_PRIMARY,
    },
    dialogTitle: {
        fontSize: '1.8rem',
        fontWeight: '900',
        fontFamily: '"Comic Sans MS", "Arial Black", sans-serif',
        letterSpacing: '0.05em',
        marginBottom: '1.8rem',
        color: TEXT_PRIMARY,
        textTransform: 'uppercase',
        textShadow: `2px 2px 0px ${SHADOW_COLOR}`,
    },
    dialogText: {
        marginBottom: '2.2rem',
        fontSize: '1.1rem',
        color: TEXT_PRIMARY,
        fontFamily: '"Comic Sans MS", "Arial Black", sans-serif',
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
        fontFamily: '"Comic Sans MS", "Arial Black", sans-serif',
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
        borderRadius: '15px',
        boxShadow: `8px 8px 0px ${SHADOW_COLOR}`,
        border: `3px solid ${BORDER_COLOR_DARK}`,
        maxWidth: '90%',
        width: '480px',
        textAlign: 'center',
        color: TEXT_PRIMARY,
    },
    conflictDialogTitle: {
        fontSize: '1.6rem',
        fontWeight: '900',
        fontFamily: '"Comic Sans MS", "Arial Black", sans-serif',
        letterSpacing: '0.05em',
        marginBottom: '1.8rem',
        color: TEXT_PRIMARY,
        textTransform: 'uppercase',
        textShadow: `2px 2px 0px ${SHADOW_COLOR}`,
    },
    conflictDialogText: {
        marginBottom: '1.8rem',
        fontSize: '1.1rem',
        color: TEXT_PRIMARY,
        fontFamily: '"Comic Sans MS", "Arial Black", sans-serif',
        fontWeight: 'normal',
        lineHeight: '1.5',
    },
    conflictDialogInput: {
        width: '100%',
        boxSizing: 'border-box',
        padding: '1.2rem 1.5rem',
        marginBottom: '1.8rem',
        border: `2px solid ${BORDER_COLOR_DARK}`,
        backgroundColor: SURFACE_COLOR,
        color: TEXT_PRIMARY,
        fontSize: '1.125rem',
        outline: 'none',
        fontFamily: '"Comic Sans MS", "Arial Black", sans-serif',
        borderRadius: '8px',
        boxShadow: `2px 2px 0px ${SHADOW_COLOR}`,
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
       BORDER_COLOR,
       BORDER_COLOR_DARK,
       BORDER_COLOR_LIGHT,
       SHADOW_COLOR,
       getButtonStyles,
       styles,
}
export default ALL;
