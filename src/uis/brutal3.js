const BG_COLOR = '#F0F0F0';
const SURFACE_COLOR = '#FFFFFF';
const TEXT_PRIMARY = '#000000';
const TEXT_SECONDARY = '#6f6f6f';
const ACCENT = '#FF0077';
const ACCENT_LIGHT = '#FF3399';
const ERROR = '#FF0000';
const WARNING = '#FFCC00';
const BORDER_COLOR = '#000000';
const SHADOW_COLOR = '#000000';
const getButtonStyles = (type, isDisabled) => {
    const baseStyles = {
        fontWeight: 'normal',
        textTransform: 'uppercase',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        transition: 'background-color 0.1s ease-out, color 0.1s ease-out, border-color 0.1s ease-out, box-shadow 0.1s ease-out',
        userSelect: 'none',
        borderRadius: '0px',
        border: `3px solid ${BORDER_COLOR}`,
        backgroundColor: SURFACE_COLOR,
        color: TEXT_PRIMARY,
        boxShadow: `4px 4px 0px ${SHADOW_COLOR}`,
        fontFamily: '"Impact", "Arial Black", sans-serif',
    };

    let specificStyles = {};
    let hoverBg = ACCENT;
    let hoverColor = TEXT_PRIMARY;
    let hoverBorder = `3px solid ${BORDER_COLOR}`;
    let hoverShadow = `6px 6px 0px ${SHADOW_COLOR}`;

    switch (type) {
        case 'primary':
            specificStyles = {
                padding: '1rem 2rem',
                fontSize: '1rem',
                backgroundColor: ACCENT,
                color: TEXT_PRIMARY,
                border: `3px solid ${BORDER_COLOR}`,
                boxShadow: `4px 4px 0px ${SHADOW_COLOR}`,
            };
            hoverBg = ACCENT;
            hoverColor = TEXT_PRIMARY;
            hoverBorder = `3px solid ${BORDER_COLOR}`;
            hoverShadow = `4px 4px 0px ${SHADOW_COLOR}`;
            break;
        case 'tab':
            specificStyles = {
                padding: '0.75rem 1.5rem',
                fontSize: '0.9rem',
                backgroundColor: SURFACE_COLOR,
                color: TEXT_PRIMARY,
                border: 'none',
                boxShadow: 'none',
            };
            hoverBg = BORDER_COLOR;
            hoverColor = SURFACE_COLOR;
            hoverBorder = 'none';
            hoverShadow = 'none';
            break;
        case 'pause':
            specificStyles = {
                padding: '0.6rem 1.2rem',
                fontSize: '0.8rem',
                backgroundColor: WARNING,
                color: TEXT_PRIMARY,
                border: `3px solid ${BORDER_COLOR}`,
                boxShadow: `4px 4px 0px ${SHADOW_COLOR}`,
            };
            hoverBg = TEXT_PRIMARY;
            hoverColor = WARNING;
            hoverBorder = `3px solid ${WARNING}`;
            break;
        case 'resume':
            specificStyles = {
                padding: '0.6rem 1.2rem',
                fontSize: '0.8rem',
                backgroundColor: ACCENT,
                color: TEXT_PRIMARY,
                border: `3px solid ${BORDER_COLOR}`,
                boxShadow: `4px 4px 0px ${SHADOW_COLOR}`,
            };
            hoverBg = TEXT_PRIMARY;
            hoverColor = ACCENT;
            hoverBorder = `3px solid ${ACCENT}`;
            break;
        case 'remove':
            specificStyles = {
                padding: '0.6rem 1.2rem',
                fontSize: '0.8rem',
                backgroundColor: ERROR,
                color: TEXT_PRIMARY,
                border: `3px solid ${BORDER_COLOR}`,
                boxShadow: `4px 4px 0px ${SHADOW_COLOR}`,
            };
            hoverBg = TEXT_PRIMARY;
            hoverColor = ERROR;
            hoverBorder = `3px solid ${ERROR}`;
            break;
        case 'remove-queue':
            specificStyles = {
                padding: '0.6rem 1.2rem',
                fontSize: '0.8rem',
                backgroundColor: SURFACE_COLOR,
                color: TEXT_PRIMARY,
                border: `3px solid ${BORDER_COLOR}`,
                boxShadow: `4px 4px 0px ${SHADOW_COLOR}`,
            };
            hoverBg = ACCENT;
            hoverColor = TEXT_PRIMARY;
            hoverBorder = `3px solid ${ACCENT}`;
            break;
        case 'confirm':
            specificStyles = {
                padding: '0.75rem 1.5rem',
                fontSize: '0.9rem',
                backgroundColor: ERROR,
                color: TEXT_PRIMARY,
                border: `3px solid ${BORDER_COLOR}`,
                boxShadow: `4px 4px 0px ${SHADOW_COLOR}`,
            };
            hoverBg = TEXT_PRIMARY;
            hoverColor = ERROR;
            hoverBorder = `3px solid ${ERROR}`;
            break;
        case 'cancel':
            specificStyles = {
                padding: '0.75rem 1.5rem',
                fontSize: '0.9rem',
                backgroundColor: SURFACE_COLOR,
                color: TEXT_PRIMARY,
                border: `3px solid ${BORDER_COLOR}`,
                boxShadow: `4px 4px 0px ${SHADOW_COLOR}`,
            };
            hoverBg = TEXT_PRIMARY;
            hoverColor = SURFACE_COLOR;
            hoverBorder = `3px solid ${BORDER_COLOR}`;
            break;
        default:
            break;
    }

    if (isDisabled) {
        specificStyles.backgroundColor = TEXT_SECONDARY;
        specificStyles.color = BG_COLOR;
        specificStyles.cursor = 'not-allowed';
        specificStyles.border = `3px solid ${BORDER_COLOR}`;
        specificStyles.boxShadow = 'none';
        hoverBg = specificStyles.backgroundColor;
        hoverColor = specificStyles.color;
        hoverBorder = specificStyles.border;
        hoverShadow = 'none';
    }

    return {
        style: { ...baseStyles, ...specificStyles },
        onMouseDown: isDisabled ? null : (e) => {
            e.currentTarget.style.backgroundColor = specificStyles.backgroundColor;
            e.currentTarget.style.color = specificStyles.color;
            e.currentTarget.style.border = specificStyles.border;
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'translate(4px, 4px)';
        },
        onMouseUp: isDisabled ? null : (e) => {
            e.currentTarget.style.backgroundColor = specificStyles.backgroundColor;
            e.currentTarget.style.color = specificStyles.color;
            e.currentTarget.style.border = specificStyles.border;
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
        },
    };
};
const styles = {
  container: {
    padding: '1rem',
    fontFamily: '"Impact", "Arial Black", sans-serif',
    margin: '0 auto',
    backgroundColor: BG_COLOR,
    height: "calc(100vh - 96px)",
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '0px',
    boxShadow: 'none',
    color: TEXT_PRIMARY,
    overflow: "hidden",
    border: `3px solid ${BORDER_COLOR}`,
  },
  inputRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: '1rem',
    marginBottom: '0.5rem',
    borderBottom: `3px solid ${BORDER_COLOR}`,
    paddingBottom: '1rem',
  },
  input: {
    flex: '1',
    padding: '0.5rem',
    border: `3px solid ${BORDER_COLOR}`,
    backgroundColor: SURFACE_COLOR,
    color: TEXT_PRIMARY,
    fontSize: '1rem',
    outline: 'none',
    fontFamily: '"Impact", "Arial Black", sans-serif',
    borderRadius: '0px',
    boxShadow: `4px 4px 0px ${SHADOW_COLOR}`,
  },
  tabRow: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem',
    paddingBottom: '0.5rem',
    borderBottom: `3px solid ${BORDER_COLOR}`,
  },
  tab: (isActive) => ({
    ...getButtonStyles('tab', false).style,
    backgroundColor: isActive ? ACCENT : SURFACE_COLOR,
    color: TEXT_PRIMARY,
    borderBottom: isActive ? `6px solid ${BORDER_COLOR}` : 'none',
    fontWeight: 'normal',
  }),
  collapseAll: {
    marginBottom: '1rem',
    textAlign: 'right',
  },
  collapseAllBtn: {
    ...getButtonStyles('remove-queue', false).style,
    fontSize: '0.95rem',
    padding: '0.5rem 1.2rem',
    backgroundColor: SURFACE_COLOR,
    color: TEXT_PRIMARY,
    border: `3px solid ${BORDER_COLOR}`,
    boxShadow: `2px 2px 0px ${SHADOW_COLOR}`,
  },
  downloadsSection: {
    flexGrow: '1',
  },
  searchInput: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '0.5rem',
    marginBottom: '0.5rem',
    border: `3px solid ${BORDER_COLOR}`,
    backgroundColor: SURFACE_COLOR,
    color: TEXT_PRIMARY,
    fontSize: '1rem',
    outline: 'none',
    fontFamily: '"Impact", "Arial Black", sans-serif',
    borderRadius: '0px',
    boxShadow: `4px 4px 0px ${SHADOW_COLOR}`,
  },
  downloadsGrid: {
    display: 'grid',
    height: "calc(100vh - 259px)",
  },
  downloadsList: {
    gap: '1rem',
    overflow: "auto",
    height: "calc(100% - 25px)",
  },
  downloadItem: (dl, isExpanded) => ({
    background: `linear-gradient(to right, ${dl.status === "downloading" ? ACCENT :
      dl.status === "paused" ? WARNING :
        dl.status?.failed ? ERROR :
          TEXT_SECONDARY} ${dl.progress}%, ${SURFACE_COLOR} ${dl.progress}%)`,
    transition: 'background 0.3s ease-out',
    padding: '0.3rem',
    marginBottom: "14px",
    borderRadius: '0px',
    boxShadow: `6px 6px 0px ${SHADOW_COLOR}`,
    border: `3px solid ${BORDER_COLOR}`,
    color: TEXT_PRIMARY,
    position: 'relative',
    marginRight: 10,
    overflow: 'hidden',
    cursor: 'pointer',
  }),
  downloadItemHeader: (isExpanded, isQueued) => ({
    display: 'flex',
    alignItems: "center",
    fontSize: '1rem',
    fontWeight: 'normal',
    marginBottom: isExpanded && isQueued ? '0.4rem' : '0',
    color: TEXT_PRIMARY,
  }),
  extensionTag: {
    padding: '4px 6px',
    marginRight: '6px',
    backgroundColor: ACCENT,
    color: TEXT_PRIMARY,
    fontWeight: 'normal',
    textTransform: 'uppercase',
    fontSize: '0.7rem',
    borderRadius: '0px',
    boxShadow: `2px 2px 0px ${SHADOW_COLOR}`,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '2rem',
    border: `2px solid ${BORDER_COLOR}`,
  },
  fileName: {
    wordBreak: 'break-all',
    fontWeight: "500",
    letterSpacing: "1px",
    width: "fit-content",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  progress: {
    fontSize: '1.1rem',
    fontWeight: 'normal',
    fontFamily: '"Impact", "Arial Black", sans-serif',
    color: TEXT_PRIMARY,
    marginLeft: 'auto',
    whiteSpace: 'nowrap',
  },
  expandArrow: (isExpanded) => ({
    fontSize: '1.2rem',
    fontWeight: 'normal',
    color: TEXT_PRIMARY,
    transition: 'none',
    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
    marginLeft: '0.5rem',
    whiteSpace: 'nowrap',
  }),
  queueTag: {
    backgroundColor: TEXT_PRIMARY,
    color: ACCENT,
    padding: '0.2rem 0.5rem',
    fontSize: '0.7rem',
    fontWeight: 'normal',
    borderRadius: '0px',
    boxShadow: `2px 2px 0px ${SHADOW_COLOR}`,
    display: 'inline-block',
    marginBottom: '0.6rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    border: `2px solid ${BORDER_COLOR}`,
  },
  expandedDetails: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '0.4rem',
    fontSize: '0.75rem',
    fontFamily: '"Impact", "Arial Black", sans-serif',
    marginBottom: '0.8rem',
    color: TEXT_PRIMARY,
    border: `2px solid ${BORDER_COLOR}`,
    padding: '0.5rem',
    backgroundColor: BG_COLOR,
    boxShadow: `2px 2px 0px ${SHADOW_COLOR}`,
  },
  expandedDetailsText: {
    color: TEXT_PRIMARY,
  },
  expandedActions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.6rem',
  },
  noDownloads: {
    fontSize: '1.25rem',
    color: TEXT_SECONDARY,
    fontWeight: 'normal',
    textAlign: 'center',
    padding: '2.5rem 0',
    backgroundColor: SURFACE_COLOR,
    borderRadius: '0px',
    boxShadow: `6px 6px 0px ${SHADOW_COLOR}`,
    border: `3px solid ${BORDER_COLOR}`,
  },
  section: {
    flexGrow: '1',
    backgroundColor: SURFACE_COLOR,
    padding: '0 1.5rem',
    borderRadius: '0px',
    boxShadow: 'none',
    border: `2px solid ${BORDER_COLOR}`,
    color: TEXT_PRIMARY,
    overflowY: 'clip',
  },
  settingsHeader: {
    fontSize: '1.875rem',
    fontWeight: 'normal',
    marginBottom: '1rem',
    paddingBottom: '0.5rem',
    borderBottom: `2px solid ${BORDER_COLOR}`,
    color: TEXT_PRIMARY,
    textTransform: 'uppercase',
    textShadow: 'none',
  },
  settingsContent: {
    fontSize: '1.125rem',
    color: TEXT_SECONDARY,
    height: "calc(100vh - 265px)",
    overflow: "auto",
  },
  settingsInner: {
    padding: '1.5rem',
  },
  settingsTitle: {
    fontSize: '1.5rem',
    fontWeight: 'normal',
    marginBottom: '1rem',
  },
  confirmDialog: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  dialogContent: {
    backgroundColor: SURFACE_COLOR,
    padding: '2rem',
    borderRadius: '0px',
    boxShadow: `8px 8px 0px ${SHADOW_COLOR}`,
    border: `3px solid ${BORDER_COLOR}`,
    maxWidth: '28rem',
    width: '90%',
    textAlign: 'center',
    color: TEXT_PRIMARY,
  },
  dialogTitle: {
    fontSize: '1.5rem',
    fontWeight: 'normal',
    fontFamily: '"Impact", "Arial Black", sans-serif',
    letterSpacing: '0.05em',
    marginBottom: '1.5rem',
    color: TEXT_PRIMARY,
    textTransform: 'uppercase',
  },
  dialogText: {
    marginBottom: '2rem',
    fontSize: '1rem',
    color: TEXT_PRIMARY,
    fontFamily: '"Impact", "Arial Black", sans-serif',
    fontWeight: 'normal',
  },
  dialogCheckboxRow: {
    marginBottom: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.8rem',
  },
  dialogCheckboxLabel: {
    fontSize: '0.9rem',
    fontWeight: 'normal',
    color: TEXT_PRIMARY,
    textTransform: 'uppercase',
    fontFamily: '"Impact", "Arial Black", sans-serif',
  },
  dialogActions: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  conflictDialogContent: {
    backgroundColor: SURFACE_COLOR,
    padding: '2rem',
    borderRadius: '0px',
    boxShadow: `8px 8px 0px ${SHADOW_COLOR}`,
    border: `3px solid ${BORDER_COLOR}`,
    maxWidth: '90%',
    width: '450px',
    textAlign: 'center',
    color: TEXT_PRIMARY,
  },
  conflictDialogTitle: {
    fontSize: '1.4rem',
    fontWeight: 'normal',
    fontFamily: '"Impact", "Arial Black", sans-serif',
    letterSpacing: '0.05em',
    marginBottom: '1.5rem',
    color: TEXT_PRIMARY,
    textTransform: 'uppercase',
  },
  conflictDialogText: {
    marginBottom: '1.5rem',
    fontSize: '1rem',
    color: TEXT_PRIMARY,
    fontFamily: '"Impact", "Arial Black", sans-serif',
    fontWeight: 'normal',
  },
  conflictDialogInput: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '1rem',
    marginBottom: '1.5rem',
    border: `3px solid ${BORDER_COLOR}`,
    backgroundColor: SURFACE_COLOR,
    color: TEXT_PRIMARY,
    fontSize: '1.125rem',
    outline: 'none',
    fontFamily: '"Impact", "Arial Black", sans-serif',
    borderRadius: '0px',
    boxShadow: `4px 4px 0px ${SHADOW_COLOR}`,
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
       SHADOW_COLOR,
       getButtonStyles,
       styles,
}
export default ALL;
