// Material Design Color Palette (Example)
const PRIMARY_COLOR = '#6200EE'; // Deep Purple
const PRIMARY_LIGHT = '#9C27B0'; // Lighter Purple for accents/hovers
const PRIMARY_DARK = '#3700B3'; // Darker Purple for status bar/darker tones
const SECONDARY_COLOR = '#03DAC6'; // Teal Green (accent color)
const SECONDARY_DARK = '#018786'; // Darker Teal for active states

const SURFACE_COLOR = '#FFFFFF'; // White for cards, backgrounds
const BG_COLOR = '#F5F5F5'; // Light gray for overall background
const TEXT_PRIMARY = '#FFFFFF'; // White text on primary color
const TEXT_ON_SURFACE_PRIMARY = 'rgba(0, 0, 0, 0.87)'; // Black 87% opacity for primary text
const TEXT_SECONDARY = 'rgba(0, 0, 0, 0.60)'; // Black 60% opacity for secondary text
const TEXT_ON_SURFACE_DISABLED = 'rgba(0, 0, 0, 0.38)'; // Black 38% opacity for disabled text

const ERROR = '#B00020'; // Standard Material Error Red
const WARNING = '#FFC107'; // Standard Material Warning Yellow

// Material Design Elevation Shadows (simplified for common use)
const ELEVATION_01 = '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'; // For subtle lifts (e.g., raised button default)
const ELEVATION_02 = '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)'; // For inputs, tabs
const ELEVATION_002 = '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)'; // For inputs, tabs
const ELEVATION_004 = '0 6px 10px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.23)'; // For cards, hovering buttons
const ELEVATION_008 = '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)'; // For dialogs, more prominent elements
const ELEVATION_024 = '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)'; // For very high elevation elements

const getButtonStyles = (type, isDisabled) => {
    const baseStyles = {
        fontWeight: '500', // Medium weight for Material text
        textTransform: 'uppercase',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s cubic-bezier(.4,0,.2,1)', // Standard Material transition curve
        userSelect: 'none',
        borderRadius: '0px', // Standard Material button radius
        border: 'none', // No explicit borders, rely on shadows
        backgroundColor: PRIMARY_COLOR,
        color: TEXT_PRIMARY,
        boxShadow: ELEVATION_01, // Default raised button elevation
        fontFamily: '"Roboto", "Segoe UI", sans-serif', // Material font
        letterSpacing: '0.02em',
        outline: 'none', // Remove default outline
    };

    let specificStyles = {};
    let hoverBg = PRIMARY_LIGHT;
    let hoverColor = TEXT_PRIMARY;
    let hoverShadow = ELEVATION_004; // Button raises on hover
    let activeShadow = ELEVATION_002; // Button depresses slightly on active

    switch (type) {
        case 'primary':
            specificStyles = {
                padding: '1rem 2rem',
                fontSize: '0.9rem',
                backgroundColor: PRIMARY_COLOR,
                color: TEXT_PRIMARY,
                boxShadow: ELEVATION_02, // Slightly higher initial elevation for primary
            };
            hoverBg = PRIMARY_LIGHT;
            hoverColor = TEXT_PRIMARY;
            hoverShadow = ELEVATION_004;
            activeShadow = ELEVATION_01;
            break;
        case 'tab':
            specificStyles = {
                padding: '0.6rem 1.2rem',
                fontSize: '0.85rem',
                backgroundColor: 'transparent', // Tab buttons often flat initially
                color: TEXT_SECONDARY,
                boxShadow: 'none',
            };
            hoverBg = 'rgba(0, 0, 0, 0.08)'; // Ripple-like hover effect
            hoverColor = TEXT_ON_SURFACE_PRIMARY;
            hoverShadow = 'none';
            activeShadow = 'none';
            break;
        case 'pause':
            specificStyles = {
                padding: '0.6rem 1.1rem',
                fontSize: '0.8rem',
                backgroundColor: WARNING,
                color: TEXT_ON_SURFACE_PRIMARY, // Dark text on warning
                boxShadow: ELEVATION_01,
            };
            hoverBg = WARNING; // No dramatic change
            hoverColor = TEXT_ON_SURFACE_PRIMARY;
            hoverShadow = ELEVATION_004;
            activeShadow = ELEVATION_01;
            break;
        case 'resume':
            specificStyles = {
                padding: '0.6rem 1.1rem',
                fontSize: '0.8rem',
                backgroundColor: SECONDARY_COLOR, // Using secondary for resume action
                color: TEXT_PRIMARY,
                boxShadow: ELEVATION_01,
            };
            hoverBg = SECONDARY_DARK;
            hoverColor = TEXT_PRIMARY;
            hoverShadow = ELEVATION_004;
            activeShadow = ELEVATION_01;
            break;
        case 'remove':
            specificStyles = {
                padding: '0.6rem 1.1rem',
                fontSize: '0.8rem',
                backgroundColor: ERROR,
                color: TEXT_PRIMARY,
                boxShadow: ELEVATION_01,
            };
            hoverBg = ERROR; // No dramatic change
            hoverColor = TEXT_PRIMARY;
            hoverShadow = ELEVATION_004;
            activeShadow = ELEVATION_01;
            break;
        case 'remove-queue':
            specificStyles = {
                padding: '0.6rem 1.1rem',
                fontSize: '0.8rem',
                backgroundColor: 'transparent', // Flat button for remove all
                color: TEXT_SECONDARY,
                boxShadow: 'none',
            };
            hoverBg = 'rgba(0, 0, 0, 0.08)';
            hoverColor = TEXT_ON_SURFACE_PRIMARY;
            hoverShadow = 'none';
            activeShadow = 'none';
            break;
        case 'confirm':
            specificStyles = {
                padding: '0.7rem 1.4rem',
                fontSize: '0.85rem',
                backgroundColor: ERROR,
                color: TEXT_PRIMARY,
                boxShadow: ELEVATION_01,
            };
            hoverBg = ERROR;
            hoverColor = TEXT_PRIMARY;
            hoverShadow = ELEVATION_004;
            activeShadow = ELEVATION_01;
            break;
        case 'cancel':
            specificStyles = {
                padding: '0.7rem 1.4rem',
                fontSize: '0.85rem',
                backgroundColor: 'transparent',
                color: TEXT_ON_SURFACE_PRIMARY, // Primary text for cancel flat button
                boxShadow: 'none',
            };
            hoverBg = 'rgba(0, 0, 0, 0.08)';
            hoverColor = TEXT_ON_SURFACE_PRIMARY;
            hoverShadow = 'none';
            activeShadow = 'none';
            break;
        default:
            break;
    }

    if (isDisabled) {
        specificStyles.backgroundColor = 'rgba(0, 0, 0, 0.12)'; // Light grey for disabled buttons
        specificStyles.color = TEXT_ON_SURFACE_DISABLED;
        specificStyles.cursor = 'not-allowed';
        specificStyles.boxShadow = 'none'; // Disabled buttons have no elevation
        hoverBg = specificStyles.backgroundColor;
        hoverColor = specificStyles.color;
        hoverShadow = 'none';
        activeShadow = 'none';
    }

    return {
        style: { ...baseStyles, ...specificStyles },
        onMouseDown: isDisabled ? null : (e) => {
            e.currentTarget.style.boxShadow = activeShadow;
            e.currentTarget.style.transform = 'translateY(1px)'; // Subtle press effect
        },
        onMouseUp: isDisabled ? null : (e) => {
            e.currentTarget.style.boxShadow = specificStyles.boxShadow;
            e.currentTarget.style.transform = 'translateY(0)';
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
            e.currentTarget.style.transform = 'translateY(0)';
        },
    };
};

const styles = {
    container: {
        padding: '1.5rem',
        fontFamily: '"Roboto", "Segoe UI", sans-serif',
        margin: '0 auto',
        backgroundColor: BG_COLOR, // Overall background color
        height: "calc(100vh - 6.2rem)",
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '8px', // Main container has slightly larger radius
        boxShadow: ELEVATION_004, // Main app container has a consistent elevation
        color: TEXT_ON_SURFACE_PRIMARY,
        overflow: "hidden",
    },
    inputRow: {
        display: 'flex',
        flexDirection: 'row',
        gap: '1rem',
        marginBottom: '1rem',
        borderBottom: `1px solid rgba(0, 0, 0, 0.12)`, // Subtle divider
        paddingBottom: '1rem',
    },
    input: {
        flex: '1',
        padding: '0.8rem 1rem', // Standard Material input padding
        border: 'none',
        borderBottom: `1px solid rgba(0, 0, 0, 0.42)`, // Underline input style
        backgroundColor: SURFACE_COLOR,
        color: TEXT_ON_SURFACE_PRIMARY,
        fontSize: '1rem',
        outline: 'none',
        fontFamily: '"Roboto", "Segoe UI", sans-serif',
        borderRadius: '4px 4px 0 0', // Top rounded corners, flat bottom for underline
        boxShadow: 'none', // Inputs often flat, or have very subtle elevation
        transition: 'border-bottom-color 0.2s cubic-bezier(.4,0,.2,1)',
        '&:focus': {
            borderBottom: `2px solid ${PRIMARY_COLOR}`, // Thicker accent on focus
        }
    },
    tabRow: {
        display: 'flex',
        gap: '0.3rem', // Smaller gap for tabs
        marginBottom: '1rem',
        paddingBottom: '0.4rem',
        borderBottom: `1px solid rgba(0, 0, 0, 0.12)`,
    },
    tab: (isActive) => ({
        ...getButtonStyles('tab', false).style,
        backgroundColor: isActive ? 'rgba(0, 0, 0, 0.08)' : 'transparent', // Active tab has a light fill
        color: isActive ? PRIMARY_COLOR : TEXT_SECONDARY, // Active tab color is primary accent
        fontWeight: isActive ? '600' : '500',
        borderRadius: '4px',
        padding: '0.4rem 1.4rem',
        position: 'relative', // For indicator line
        '&::after': isActive ? {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '2px',
            backgroundColor: PRIMARY_COLOR, // Indicator line
            transition: 'all 0.2s cubic-bezier(.4,0,.2,1)',
        } : {},
    }),
    collapseAll: {
        marginBottom: '1.5rem',
        textAlign: 'right',
    },
    collapseAllBtn: {
        ...getButtonStyles('remove-queue', false).style,
        fontSize: '0.85rem',
        padding: '0.6rem 1.2rem',
        color: PRIMARY_COLOR, // Flat buttons use primary color for text
    },
    downloadsSection: {
        flexGrow: '1',
    },
    searchInput: {
        width: '100%',
        boxSizing: 'border-box',
        padding: '0.4rem 1rem',
        marginBottom: '1rem',
        border: 'none',
        borderBottom: `1px solid rgba(0, 0, 0, 0.42)`,
        backgroundColor: SURFACE_COLOR,
        color: TEXT_ON_SURFACE_PRIMARY,
        fontSize: '1rem',
        outline: 'none',
        fontFamily: '"Roboto", "Segoe UI", sans-serif',
        borderRadius: '4px 4px 0 0',
        boxShadow: 'none',
        transition: 'border-bottom-color 0.2s cubic-bezier(.4,0,.2,1)',
        '&:focus': {
            borderBottom: `2px solid ${PRIMARY_COLOR}`,
        }
    },
    downloadsGrid: {
        display: 'grid',
        height: "calc(100vh - 195px)",
    },
    downloadsList: {
        gap: '1rem', // Smaller gap for cards
        overflow: "auto",
        height: "calc(100% - 65px)",
        paddingRight: '10px',
    },
    downloadItem: (dl, isExpanded) => ({
        background: `linear-gradient(to right, ${dl.status === "downloading" ? ACCENT :
      dl.status === "paused" ? WARNING :
        dl.status?.failed ? ERROR :
          TEXT_SECONDARY} ${dl.progress}%, ${SURFACE_COLOR} ${dl.progress}%)`,
       transition: 'all 0.2s cubic-bezier(.4,0,.2,1)',
        padding: '0.1rem 1rem',
        marginBottom: "0.3rem",
        borderRadius: '8px', // Card radius
        boxShadow: ELEVATION_01, // Card elevation
        border: 'none',
        color: TEXT_ON_SURFACE_PRIMARY,
        position: 'relative',
        cursor: 'pointer',
        '&:hover': {
            boxShadow: ELEVATION_004, // Card raises on hover
        },
        // Progress indicator - subtle colored layer
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${dl.progress}%`,
            backgroundColor: dl.status === "downloading" ? SECONDARY_COLOR :
                dl.status === "paused" ? WARNING :
                dl.status?.failed ? ERROR :
                SECONDARY_COLOR, // Can be PRIMARY_COLOR for finished
            borderRadius: '8px',
            opacity: dl.progress > 0 ? 0.1 : 0, // Very subtle, like a color wash
            transition: 'width 0.3s cubic-bezier(.4,0,.2,1), opacity 0.3s cubic-bezier(.4,0,.2,1)',
            zIndex: -1,
        }
    }),
    downloadItemHeader: (isExpanded, isQueued) => ({
        display: 'flex',
        alignItems: "center",
        fontSize: '0.95rem',
        fontWeight: '500',
        marginBottom: isExpanded && isQueued ? '0.6rem' : '0',
        color: TEXT_ON_SURFACE_PRIMARY,
    }),
    extensionTag: {
        padding: '4px 8px',
        marginRight: '8px',
        backgroundColor: SECONDARY_COLOR,
        color: TEXT_PRIMARY,
        fontWeight: '500',
        textTransform: 'uppercase',
        fontSize: '0.7rem',
        borderRadius: '4px',
        boxShadow: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '2.5rem',
    },
    fileName: {
        wordBreak: 'break-all',
        fontWeight: "500",
        letterSpacing: "0.02em",
        flex: 1,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        marginRight: '10px',
    },
    progress: {
        fontSize: '0.95rem',
        fontWeight: '500',
        fontFamily: '"Roboto", "Segoe UI", sans-serif',
        color: TEXT_SECONDARY,
        marginLeft: 'auto',
        whiteSpace: 'nowrap',
    },
    expandArrow: (isExpanded) => ({
        fontSize: '1.2rem',
        fontWeight: '500',
        color: TEXT_SECONDARY,
        transition: 'transform 0.2s cubic-bezier(.4,0,.2,1)',
        transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
        marginLeft: '0.8rem',
        whiteSpace: 'nowrap',
    }),
    queueTag: {
        backgroundColor: BG_COLOR, // Light background for tag
        color: TEXT_SECONDARY,
        padding: '0.2rem 0.5rem',
        fontSize: '0.7rem',
        fontWeight: '500',
        borderRadius: '4px',
        boxShadow: 'none',
        display: 'inline-block',
        marginBottom: '0.6rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        border: `1px solid rgba(0, 0, 0, 0.12)`,
    },
    expandedDetails: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '0.5rem',
        fontSize: '0.8rem',
        fontFamily: '"Roboto", "Segoe UI", sans-serif',
        marginBottom: '0.8rem',
        color: TEXT_SECONDARY, // Secondary text for details
        border: 'none',
        padding: '0.8rem 1rem',
        backgroundColor: BG_COLOR, // Lighter background for nested details
        borderRadius: '4px',
        boxShadow: 'none', // No elevation for inner details
    },
    expandedDetailsText: {
        color: TEXT_ON_SURFACE_PRIMARY,
        fontWeight: 'normal',
    },
    expandedActions: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.6rem',
    },
    noDownloads: {
        fontSize: '1.1rem',
        color: TEXT_SECONDARY,
        fontWeight: 'normal',
        textAlign: 'center',
        padding: '2rem 0',
        backgroundColor: SURFACE_COLOR,
        borderRadius: '8px',
        boxShadow: ELEVATION_01,
    },
    section: {
        flexGrow: '1',
        backgroundColor: SURFACE_COLOR,
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: ELEVATION_004, // Sections have higher elevation
        color: TEXT_ON_SURFACE_PRIMARY,
        overflowY: 'auto',
    },
    settingsHeader: {
        fontSize: '1.6rem',
        fontWeight: '500',
        marginBottom: '1.2rem',
        paddingBottom: '0.8rem',
        borderBottom: `1px solid rgba(0, 0, 0, 0.12)`,
        color: TEXT_ON_SURFACE_PRIMARY,
        textTransform: 'normal', // No uppercase for settings headers
    },
    settingsContent: {
        fontSize: '0.95rem',
        color: TEXT_SECONDARY,
        height: "calc(100vh - 300px)",
        overflow: "auto",
        paddingRight: '10px',
    },
    settingsInner: {
        padding: '1rem',
    },
    settingsTitle: {
        fontSize: '1.2rem',
        fontWeight: '500',
        marginBottom: '0.8rem',
        color: TEXT_ON_SURFACE_PRIMARY,
    },
    confirmDialog: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)', // Standard overlay
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    dialogContent: {
        backgroundColor: SURFACE_COLOR,
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: ELEVATION_008, // Dialogs have high elevation
        maxWidth: '28rem',
        width: '90%',
        textAlign: 'center',
        color: TEXT_ON_SURFACE_PRIMARY,
    },
    dialogTitle: {
        fontSize: '1.4rem',
        fontWeight: '500',
        fontFamily: '"Roboto", "Segoe UI", sans-serif',
        marginBottom: '1.5rem',
        color: TEXT_ON_SURFACE_PRIMARY,
        textTransform: 'normal',
    },
    dialogText: {
        marginBottom: '1.8rem',
        fontSize: '0.95rem',
        color: TEXT_SECONDARY,
        fontFamily: '"Roboto", "Segoe UI", sans-serif',
        fontWeight: 'normal',
        lineHeight: '1.4',
    },
    dialogCheckboxRow: {
        marginBottom: '1.8rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.8rem',
    },
    dialogCheckboxLabel: {
        fontSize: '0.95rem',
        fontWeight: 'normal',
        color: TEXT_ON_SURFACE_PRIMARY,
        textTransform: 'normal',
        fontFamily: '"Roboto", "Segoe UI", sans-serif',
    },
    dialogActions: {
        display: 'flex',
        justifyContent: 'flex-end', // Actions typically right-aligned
        flexWrap: 'wrap',
        gap: '0.6rem',
        paddingTop: '1rem',
    },
    conflictDialogContent: {
        backgroundColor: SURFACE_COLOR,
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: ELEVATION_008,
        maxWidth: '90%',
        width: '400px',
        textAlign: 'center',
        color: TEXT_ON_SURFACE_PRIMARY,
    },
    conflictDialogTitle: {
        fontSize: '1.3rem',
        fontWeight: '500',
        fontFamily: '"Roboto", "Segoe UI", sans-serif',
        marginBottom: '1.5rem',
        color: TEXT_ON_SURFACE_PRIMARY,
        textTransform: 'normal',
    },
    conflictDialogText: {
        marginBottom: '1.5rem',
        fontSize: '0.95rem',
        color: TEXT_SECONDARY,
        fontFamily: '"Roboto", "Segoe UI", sans-serif',
        fontWeight: 'normal',
        lineHeight: '1.4',
    },
    conflictDialogInput: {
        width: '100%',
        boxSizing: 'border-box',
        padding: '0.8rem 1rem',
        marginBottom: '1.5rem',
        border: 'none',
        borderBottom: `1px solid rgba(0, 0, 0, 0.42)`,
        backgroundColor: SURFACE_COLOR,
        color: TEXT_ON_SURFACE_PRIMARY,
        fontSize: '1rem',
        outline: 'none',
        fontFamily: '"Roboto", "Segoe UI", sans-serif',
        borderRadius: '4px 4px 0 0',
        boxShadow: 'none',
        transition: 'border-bottom-color 0.2s cubic-bezier(.4,0,.2,1)',
        '&:focus': {
            borderBottom: `2px solid ${PRIMARY_COLOR}`,
        }
    },
};

const ALL = {
       PRIMARY_COLOR,
       PRIMARY_LIGHT,
       PRIMARY_DARK,
       SECONDARY_COLOR,
       SECONDARY_DARK,
       SURFACE_COLOR,
       BACKGROUND_COLOR: BG_COLOR,
       TEXT_ON_PRIMARY: TEXT_PRIMARY,
       TEXT_ON_SURFACE_PRIMARY,
       TEXT_ON_SURFACE_SECONDARY: TEXT_SECONDARY,
       TEXT_ON_SURFACE_DISABLED,
       ERROR_COLOR: ERROR,
       WARNING_COLOR: WARNING,
       ELEVATION_01,
       ELEVATION_02,
       ELEVATION_002,
       ELEVATION_004,
       ELEVATION_008,
       ELEVATION_024,
       getButtonStyles,
       styles,
};
export default ALL;
