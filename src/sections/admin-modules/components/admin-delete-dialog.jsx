import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import DialogContent from '@mui/material/DialogContent';

import { AdminDialogActions, AdminFormDialog } from './admin-form-dialog';

// ----------------------------------------------------------------------

export function AdminDeleteDialog({ open, onClose, title, itemName, warning, onConfirm, loading }) {
  return (
    <AdminFormDialog open={open} onClose={onClose} title={title} maxWidth="xs">
      <DialogContent sx={{ typography: 'body2' }}>
        Remove <strong>{itemName}</strong>? {warning}
      </DialogContent>
      <AdminDialogActions onCancel={onClose} loading={loading}>
        <Button variant="contained" color="error" onClick={onConfirm} disabled={loading}>
          Delete
        </Button>
      </AdminDialogActions>
    </AdminFormDialog>
  );
}

AdminDeleteDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  itemName: PropTypes.string,
  warning: PropTypes.string,
  onConfirm: PropTypes.func,
  loading: PropTypes.bool,
};
