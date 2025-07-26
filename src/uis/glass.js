// Colors adjusted for Glassmorphism
const BG_COLOR = '#8EC5FC'; // A lighter, vibrant blue for background gradient
const BG_COLOR_START = '#8EC5FC'; // A lighter, vibrant blue for background gradient
const BG_COLOR_END = '#E0C3FC';   // A softer purple for background gradient
const SURFACE_COLOR = 'rgba(255, 255, 255, 0.2)'; // Translucent white for glass elements
const TEXT_PRIMARY = '#FFFFFF'; // White text for contrast on translucent elements
const TEXT_SECONDARY = 'rgba(255, 255, 255, 0.7)'; // Slightly transparent white for secondary text
const ACCENT = 'rgba(255, 107, 107, 0.7)'; // Translucent accent color (reddish)
const ACCENT_LIGHT = 'rgba(255, 142, 142, 0.8)'; // Lighter, more opaque accent for highlights/active
const ERROR = 'rgba(220, 53, 69, 0.7)'; // Translucent error red
const WARNING = 'rgba(255, 193, 7, 0.7)'; // Translucent warning yellow
const BORDER_COLOR = 'rgba(255, 255, 255, 0.4)'; // Subtle white border
const SHADOW_COLOR = 'rgba(0, 0, 0, 0.1)'; // Soft, subtle shadow for depth

const getButtonStyles = (type, isDisabled) => {
    const baseStyles = {
        fontWeight: 'bold',
        textTransform: 'uppercase',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease-in-out', // Smooth transitions
        userSelect: 'none',
        borderRadius: '16px', // Rounded corners for glass elements
        border: `1px solid ${BORDER_COLOR}`, // Subtle border
        backgroundColor: SURFACE_COLOR,
        color: TEXT_PRIMARY,
        boxShadow: `0 4px 10px ${SHADOW_COLOR}`, // Soft shadow for floating effect
        backdropFilter: 'blur(10px) saturate(180%)', // Core glassmorphism effect
        WebkitBackdropFilter: 'blur(10px) saturate(180%)', // For Safari
        fontFamily: '"Segoe UI", sans-serif',
        letterSpacing: '0.03em', // Slightly more pronounced letter spacing
    };

    let specificStyles = {};
    let hoverBg = ACCENT_LIGHT; // More opaque accent on hover
    let hoverColor = TEXT_PRIMARY;
    let hoverBorder = `1px solid ${ACCENT_LIGHT}`;
    let hoverShadow = `0 6px 15px ${SHADOW_COLOR}`; // Slightly larger shadow on hover

    switch (type) {
        case 'primary':
            specificStyles = {
                padding: '1.2rem 2.5rem',
                fontSize: '1rem',
                backgroundColor: ACCENT, // Opaque accent for primary
                color: TEXT_PRIMARY,
                border: `1px solid ${ACCENT_LIGHT}`,
                boxShadow: `0 5px 12px ${SHADOW_COLOR}`,
            };
            hoverBg = ACCENT_LIGHT;
            hoverColor = TEXT_PRIMARY;
            hoverBorder = `1px solid ${TEXT_PRIMARY}`; // Border brightens on hover
            hoverShadow = `0 8px 18px ${SHADOW_COLOR}`;
            break;
        case 'tab':
            specificStyles = {
                padding: '0.8rem 1.6rem',
                fontSize: '0.9rem',
                backgroundColor: SURFACE_COLOR,
                color: TEXT_PRIMARY,
                border: `1px solid ${BORDER_COLOR}`,
                boxShadow: `0 3px 8px ${SHADOW_COLOR}`,
            };
            hoverBg = 'rgba(255, 255, 255, 0.3)'; // Slightly more opaque white on hover
            hoverColor = TEXT_PRIMARY;
            hoverBorder = `1px solid ${TEXT_PRIMARY}`;
            hoverShadow = `0 4px 10px ${SHADOW_COLOR}`;
            break;
        case 'pause':
            specificStyles = {
                padding: '0.7rem 1.3rem',
                fontSize: '0.85rem',
                backgroundColor: WARNING,
                color: TEXT_PRIMARY,
                border: `1px solid ${WARNING}`,
                boxShadow: `0 4px 8px ${SHADOW_COLOR}`,
            };
            hoverBg = 'rgba(255, 193, 7, 0.8)'; // More opaque warning
            hoverColor = TEXT_PRIMARY;
            hoverBorder = `1px solid ${TEXT_PRIMARY}`;
            hoverShadow = `0 5px 12px ${SHADOW_COLOR}`;
            break;
        case 'resume':
            specificStyles = {
                padding: '0.7rem 1.3rem',
                fontSize: '0.85rem',
                backgroundColor: ACCENT,
                color: TEXT_PRIMARY,
                border: `1px solid ${ACCENT_LIGHT}`,
                boxShadow: `0 4px 8px ${SHADOW_COLOR}`,
            };
            hoverBg = ACCENT_LIGHT;
            hoverColor = TEXT_PRIMARY;
            hoverBorder = `1px solid ${TEXT_PRIMARY}`;
            hoverShadow = `0 5px 12px ${SHADOW_COLOR}`;
            break;
        case 'remove':
            specificStyles = {
                padding: '0.7rem 1.3rem',
                fontSize: '0.85rem',
                backgroundColor: ERROR,
                color: TEXT_PRIMARY,
                border: `1px solid ${ERROR}`,
                boxShadow: `0 4px 8px ${SHADOW_COLOR}`,
            };
            hoverBg = 'rgba(220, 53, 69, 0.8)'; // More opaque error
            hoverColor = TEXT_PRIMARY;
            hoverBorder = `1px solid ${TEXT_PRIMARY}`;
            hoverShadow = `0 5px 12px ${SHADOW_COLOR}`;
            break;
        case 'remove-queue':
            specificStyles = {
                padding: '0.7rem 1.3rem',
                fontSize: '0.85rem',
                backgroundColor: SURFACE_COLOR,
                color: TEXT_PRIMARY,
                border: `1px solid ${BORDER_COLOR}`,
                boxShadow: `0 4px 8px ${SHADOW_COLOR}`,
            };
            hoverBg = 'rgba(255, 255, 255, 0.3)';
            hoverColor = TEXT_PRIMARY;
            hoverBorder = `1px solid ${TEXT_PRIMARY}`;
            hoverShadow = `0 5px 12px ${SHADOW_COLOR}`;
            break;
        case 'confirm':
            specificStyles = {
                padding: '0.8rem 1.6rem',
                fontSize: '0.9rem',
                backgroundColor: ERROR,
                color: TEXT_PRIMARY,
                border: `1px solid ${ERROR}`,
                boxShadow: `0 4px 8px ${SHADOW_COLOR}`,
            };
            hoverBg = 'rgba(220, 53, 69, 0.8)';
            hoverColor = TEXT_PRIMARY;
            hoverBorder = `1px solid ${TEXT_PRIMARY}`;
            hoverShadow = `0 5px 12px ${SHADOW_COLOR}`;
            break;
        case 'cancel':
            specificStyles = {
                padding: '0.8rem 1.6rem',
                fontSize: '0.9rem',
                backgroundColor: SURFACE_COLOR,
                color: TEXT_PRIMARY,
                border: `1px solid ${BORDER_COLOR}`,
                boxShadow: `0 4px 8px ${SHADOW_COLOR}`,
            };
            hoverBg = 'rgba(255, 255, 255, 0.3)';
            hoverColor = TEXT_PRIMARY;
            hoverBorder = `1px solid ${TEXT_PRIMARY}`;
            hoverShadow = `0 5px 12px ${SHADOW_COLOR}`;
            break;
        default:
            break;
    }

    if (isDisabled) {
        specificStyles.backgroundColor = 'rgba(0, 0, 0, 0.1)'; // Very subtle disabled color
        specificStyles.color = TEXT_SECONDARY;
        specificStyles.cursor = 'not-allowed';
        specificStyles.border = `1px solid rgba(255, 255, 255, 0.2)`;
        specificStyles.boxShadow = 'none'; // No shadow for disabled buttons
        specificStyles.backdropFilter = 'none'; // No blur for disabled buttons
        specificStyles.WebkitBackdropFilter = 'none';
        hoverBg = specificStyles.backgroundColor;
        hoverColor = specificStyles.color;
        hoverBorder = specificStyles.border;
        hoverShadow = 'none';
    }

    return {
        style: { ...baseStyles, ...specificStyles },
        onMouseDown: isDisabled ? null : (e) => {
            e.currentTarget.style.boxShadow = `0 2px 5px ${SHADOW_COLOR}`; // Smaller shadow on press
            e.currentTarget.style.transform = 'translateY(1px)'; // Slight downward press
        },
        onMouseUp: isDisabled ? null : (e) => {
            e.currentTarget.style.boxShadow = specificStyles.boxShadow;
            e.currentTarget.style.transform = 'translateY(0)';
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
            e.currentTarget.style.transform = 'translateY(0)';
        },
    };
};

const styles = {
    container: {
        padding: '1.5rem',
        fontFamily: '"Segoe UI", sans-serif',
        margin: '0 auto',
        // Background for glassmorphism needs to be vibrant to show the blur effect
        background: `linear-gradient(135deg, ${BG_COLOR_START} 0%, ${BG_COLOR_END} 100%)`,
        height: "calc(100vh - 6.7rem)",
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '0px', // More rounded for main container
        boxShadow: `0 8px 20px ${SHADOW_COLOR}`, // Soft shadow
        color: TEXT_PRIMARY,
        overflow: "hidden",
        border: 'none', // No hard border on the main container itself
    },
    inputRow: {
        display: 'flex',
        flexDirection: 'row',
        gap: '1rem',
        marginBottom: '1rem',
        borderBottom: `1px solid ${BORDER_COLOR}`, // Subtle transparent border
        paddingBottom: '1rem',
    },
    input: {
        flex: '1',
        padding: '0.5rem 1rem',
        border: `1px solid ${BORDER_COLOR}`,
        backgroundColor: 'rgba(255, 255, 255, 0.1)', // Very light translucent background for input
        color: TEXT_PRIMARY,
        fontSize: '1rem',
        outline: 'none',
        fontFamily: '"Segoe UI", sans-serif',
        borderRadius: '12px',
        boxShadow: `0 2px 5px ${SHADOW_COLOR}`,
        backdropFilter: 'blur(5px)', // Slight blur for input field
        WebkitBackdropFilter: 'blur(5px)',
    },
    tabRow: {
        display: 'flex',
        gap: '1rem',
        marginBottom: '1rem',
        paddingBottom: '0.5rem',
        borderBottom: `1px solid ${BORDER_COLOR}`,
    },
    tab: (isActive) => ({
        ...getButtonStyles('tab', false).style,
        backgroundColor: isActive ? ACCENT_LIGHT : SURFACE_COLOR, // More opaque for active
        color: TEXT_PRIMARY,
        border: isActive ? `1px solid ${TEXT_PRIMARY}` : `1px solid ${BORDER_COLOR}`,
        boxShadow: isActive ? `0 5px 12px ${SHADOW_COLOR}` : `0 3px 8px ${SHADOW_COLOR}`,
        backdropFilter: 'blur(10px) saturate(180%)',
        WebkitBackdropFilter: 'blur(10px) saturate(180%)',
        borderRadius: '12px',
        padding: '0.4rem 1rem',
    }),
    collapseAll: {
        marginBottom: '1.5rem',
        textAlign: 'right',
    },
    collapseAllBtn: {
        ...getButtonStyles('remove-queue', false).style,
        fontSize: '0.5rem',
        padding: '0.6rem 1.4rem',
        backgroundColor: SURFACE_COLOR,
        color: TEXT_PRIMARY,
        border: `1px solid ${BORDER_COLOR}`,
        boxShadow: `0 3px 8px ${SHADOW_COLOR}`,
    },
    downloadsSection: {
        flexGrow: '1',
    },
    searchInput: {
        width: '100%',
        boxSizing: 'border-box',
        padding: '0.5rem',
        marginBottom: '1rem',
        border: `1px solid ${BORDER_COLOR}`,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: TEXT_PRIMARY,
        fontSize: '1rem',
        outline: 'none',
        fontFamily: '"Segoe UI", sans-serif',
        borderRadius: '12px',
        boxShadow: `0 2px 5px ${SHADOW_COLOR}`,
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
    },
    downloadsGrid: {
        display: 'grid',
        height: "calc(100vh - 220px)",
    },
    downloadsList: {
        gap: '1rem',
        overflow: "auto",
        height: "calc(100% - 65px)",
        paddingRight: '10px',
    },
    downloadItem: (dl, isExpanded) => ({
        background: `linear-gradient(to right, ${dl.status === "downloading" ? ACCENT :
      dl.status === "paused" ? WARNING :
        dl.status?.failed ? ERROR :
          TEXT_SECONDARY} ${dl.progress}%, ${SURFACE_COLOR} ${dl.progress}%)`,
        transition: 'all 0.3s ease-in-out',
        padding: '0.3rem 1.2rem',
        marginBottom: "0.5rem",
        borderRadius: '18px', // Slightly more rounded
        boxShadow: `0 6px 15px ${SHADOW_COLOR}`, // Soft shadow
        border: `1px solid ${BORDER_COLOR}`,
        color: TEXT_PRIMARY,
        position: 'relative',
        cursor: 'pointer',
        backdropFilter: 'blur(10px) saturate(180%)', // Apply blur to each item
        WebkitBackdropFilter: 'blur(10px) saturate(180%)',
        // Progress indicator - subtle translucent fill
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
                'rgba(255, 255, 255, 0.3)', // Finished items
            borderRadius: '18px',
            opacity: dl.progress > 0 ? 0.2 : 0, // Very subtle opacity
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
        backgroundColor: ACCENT_LIGHT, // Slightly more opaque accent for tags
        color: TEXT_PRIMARY,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: '0.75rem',
        borderRadius: '10px',
        boxShadow: `0 1px 3px ${SHADOW_COLOR}`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '2.5rem',
        border: `1px solid ${ACCENT_LIGHT}`,
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
    },
    fileName: {
        wordBreak: 'break-all',
        fontWeight: "600",
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
        backgroundColor: 'rgba(255, 255, 255, 0.15)', // Light translucent background for queue tag
        color: TEXT_PRIMARY,
        padding: '0.3rem 0.6rem',
        fontSize: '0.75rem',
        fontWeight: 'bold',
        borderRadius: '10px',
        boxShadow: `0 1px 3px ${SHADOW_COLOR}`,
        display: 'inline-block',
        marginBottom: '0.8rem',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        border: `1px solid ${BORDER_COLOR}`,
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
    },
    expandedDetails: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '0.6rem',
        fontSize: '0.85rem',
        fontFamily: '"Segoe UI", sans-serif',
        marginBottom: '1rem',
        color: TEXT_PRIMARY,
        border: `1px solid ${BORDER_COLOR}`,
        padding: '1rem',
        backgroundColor: 'rgba(255, 255, 255, 0.1)', // Inner elements slightly less opaque
        borderRadius: '12px',
        boxShadow: `0 2px 5px ${SHADOW_COLOR}`,
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
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
        color: TEXT_PRIMARY,
        fontWeight: 'normal',
        textAlign: 'center',
        padding: '3rem 0',
        backgroundColor: SURFACE_COLOR,
        borderRadius: '18px',
        boxShadow: `0 6px 15px ${SHADOW_COLOR}`,
        border: `1px solid ${BORDER_COLOR}`,
        backdropFilter: 'blur(10px) saturate(180%)',
        WebkitBackdropFilter: 'blur(10px) saturate(180%)',
    },
    section: {
        flexGrow: '1',
        backgroundColor: SURFACE_COLOR,
        padding: '1.5rem',
        borderRadius: '18px',
        boxShadow: `0 8px 20px ${SHADOW_COLOR}`,
        border: `1px solid ${BORDER_COLOR}`,
        color: TEXT_PRIMARY,
        overflowY: 'auto',
        backdropFilter: 'blur(10px) saturate(180%)',
        WebkitBackdropFilter: 'blur(10px) saturate(180%)',
    },
    settingsHeader: {
        fontSize: '2rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem',
        paddingBottom: '0.8rem',
        borderBottom: `1px solid ${BORDER_COLOR}`,
        color: TEXT_PRIMARY,
        textTransform: 'uppercase',
        textShadow: '0 1px 3px rgba(0,0,0,0.1)', // Subtle text shadow for depth
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
        backgroundColor: 'rgba(0,0,0,0.5)', // Darker overlay
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(5px)', // Blur the background behind the dialog overlay
        WebkitBackdropFilter: 'blur(5px)',
    },
    dialogContent: {
        backgroundColor: SURFACE_COLOR,
        padding: '2.5rem',
        borderRadius: '20px',
        boxShadow: `0 10px 25px ${SHADOW_COLOR}`,
        border: `1px solid ${BORDER_COLOR}`,
        maxWidth: '30rem',
        width: '90%',
        textAlign: 'center',
        color: TEXT_PRIMARY,
        backdropFilter: 'blur(15px) saturate(180%)', // Stronger blur for dialog
        WebkitBackdropFilter: 'blur(15px) saturate(180%)',
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
        boxShadow: `0 10px 25px ${SHADOW_COLOR}`,
        border: `1px solid ${BORDER_COLOR}`,
        maxWidth: '90%',
        width: '480px',
        textAlign: 'center',
        color: TEXT_PRIMARY,
        backdropFilter: 'blur(15px) saturate(180%)',
        WebkitBackdropFilter: 'blur(15px) saturate(180%)',
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
        border: `1px solid ${BORDER_COLOR}`,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: TEXT_PRIMARY,
        fontSize: '1.125rem',
        outline: 'none',
        fontFamily: '"Segoe UI", sans-serif',
        borderRadius: '12px',
        boxShadow: `0 2px 5px ${SHADOW_COLOR}`,
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
    },
};
const ALL = {
       BG_COLOR,
       BG_COLOR_START,
       BG_COLOR_END,
       SURFACE_COLOR,
       TEXT_PRIMARY,
       TEXT_SECONDARY,
       ACCENT,
       ACCENT_LIGHT,
       ERROR,
       WARNING,
       BORDER_COLOR,
       SHADOW_COLOR,
       getButtonStyles,
       styles,
}
export default ALL;
