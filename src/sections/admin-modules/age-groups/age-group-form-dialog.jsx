import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import DialogContent from '@mui/material/DialogContent';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { AdminDialogActions, AdminFormDialog } from '../components/admin-form-dialog';
import { FormControlLabel, Switch } from '@mui/material';

// ----------------------------------------------------------------------

const defaultForm = { title: '', features: '', active: true };

// ----------------------------------------------------------------------

export function AgeGroupFormDialog({ open, onClose, onSubmit, initialData, title, submitting }) {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (open) {
      setForm(initialData ? { title: initialData.title, features: initialData.features?.join(', ' || ''), active: initialData.active } : defaultForm);
    }
  }, [open, initialData]);

  const handleSubmit = () => {
    if (!form.title.trim()) return;

    onSubmit({
      title: form.title.trim(),
      features: form.features
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      active: form.active,
    });
  };

  return (
    <AdminFormDialog open={open} onClose={onClose} title={title} maxWidth="sm">
      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <TextField
            label="Age Group"
            placeholder="e.g. 6 months, 7–8 months, 9–12 months"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            fullWidth
          />
          <TextField
            label="Features"
            placeholder="e.g. First foods, Finger foods"
            value={form.features}
            onChange={(e) => setForm((f) => ({ ...f, features: e.target.value }))}
            fullWidth
          />
          <FormControlLabel
            control={
              <Switch
                checked={form.active}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    active: e.target.checked,
                  }))
                }
              />
            }
            label={form.active ? 'Active' : 'Inactive'}
          />
        </Stack>
      </DialogContent>
      <AdminDialogActions onCancel={onClose} onSubmit={handleSubmit} submitDisabled={!form.title.trim()} loading={submitting} />
    </AdminFormDialog>
  );
}

AgeGroupFormDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  initialData: PropTypes.object,
  title: PropTypes.string,
  submitting: PropTypes.bool,
};
