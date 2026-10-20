import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import LinearProgress from '@mui/material/LinearProgress';
import { useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export function getAdminDialogPaperSx(theme) {
  return {
    boxShadow: theme.customShadows?.dialog,
  };
}

// ----------------------------------------------------------------------

export function AdminFormDialog({ open, onClose, title, children, maxWidth = 'sm', fullWidth = true, ...other }) {
  const theme = useTheme();

  return (
    <Dialog open={open} onClose={onClose} fullWidth={fullWidth} maxWidth={maxWidth} slotProps={{ paper: { sx: getAdminDialogPaperSx(theme) } }} {...other}>
      {title ? <DialogTitle>{title}</DialogTitle> : null}
      {children}
    </Dialog>
  );
}

AdminFormDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  children: PropTypes.node,
  maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', false]),
  fullWidth: PropTypes.bool,
};

// ----------------------------------------------------------------------

export function AdminDialogActions({
  onCancel,
  onSubmit,
  cancelLabel = 'Cancel',
  submitLabel = 'Save',
  submitColor = 'primary',
  submitDisabled = false,
  loading = false,
  children,
}) {
  return (
    <DialogActions sx={{ gap: 1.5, py: 2.5 }}>
      {loading ? <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 9 }} /> : null}
      <Button variant="outlined" color="primary" onClick={onCancel} disabled={loading} sx={{ py: 1.25 }}>
        {cancelLabel}
      </Button>
      {children}
      {onSubmit ? (
        <Button variant="contained" color={submitColor} onClick={onSubmit} disabled={submitDisabled || loading} sx={{ py: 1.25 }}>
          {submitLabel}
        </Button>
      ) : null}
    </DialogActions>
  );
}

AdminDialogActions.propTypes = {
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  cancelLabel: PropTypes.string,
  submitLabel: PropTypes.string,
  submitDisabled: PropTypes.bool,
  loading: PropTypes.bool,
  submitColor: PropTypes.string,
  children: PropTypes.node,
};
