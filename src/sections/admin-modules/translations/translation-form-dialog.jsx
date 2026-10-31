import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import DialogContent from '@mui/material/DialogContent';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { AdminDialogActions, AdminFormDialog } from '../components/admin-form-dialog';
import { FormControlLabel, Switch, Typography } from '@mui/material';

// ----------------------------------------------------------------------

const defaultForm = { title: '', transliteration: '', flag: '', code: '', active: true };

// ----------------------------------------------------------------------

export function TranslationFormDialog({ open, onClose, onSubmit, initialData, title, loading }) {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (open) {
      setForm(
        initialData
          ? {
              title: initialData.title || '',
              transliteration: initialData.transliteration || '',
              flag: initialData.flag || '',
              code: initialData.code || '',
              active: initialData.active ?? true,
            }
          : defaultForm
      );
    }
  }, [open, initialData]);

  const handleSubmit = () => {
    onSubmit({
      title: form.title.trim(),
      transliteration: form.transliteration.trim(),
      flag: form.flag,
      code: form.code.trim().toLowerCase(),
      active: form.active,
    });
  };

  return (
    <AdminFormDialog open={open} onClose={onClose} title={title} maxWidth="md">
      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <TextField
            label="Language"
            placeholder="English, Urdu,...."
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            disabled={!!initialData}
            fullWidth
          />
          <TextField
            label="Transliteration"
            value={form.transliteration}
            onChange={(e) => setForm((f) => ({ ...f, transliteration: e.target.value }))}
            multiline
            rows={2}
            fullWidth
          />
          <TextField label="Code" placeholder="🇵🇰, 🇺🇸,...." value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} multiline rows={2} fullWidth />
          <TextField label="Flag" placeholder="ur, us, en...." value={form.flag} onChange={(e) => setForm((f) => ({ ...f, flag: e.target.value }))} multiline rows={2} fullWidth />
          <FormControlLabel label="Active" control={<Switch checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} />} />
          <Typography variant="caption" color="text.secondary">
            A language can be active only when all of its app texts are translated (App texts button in the list). New languages start
            disabled.
          </Typography>
        </Stack>
      </DialogContent>
      <AdminDialogActions onCancel={onClose} onSubmit={handleSubmit} submitDisabled={!form.title.trim() || !form.transliteration.trim() || !form.code.trim()} loading={loading} />
    </AdminFormDialog>
  );
}

TranslationFormDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  initialData: PropTypes.object,
  title: PropTypes.string,
  loading: PropTypes.bool,
};
