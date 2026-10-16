import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import DialogContent from '@mui/material/DialogContent';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import { AdminDialogActions, AdminFormDialog } from '../components/admin-form-dialog';
import { Autocomplete, Chip } from '@mui/material';

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'review', label: 'Under Review' },
  { value: 'disabled', label: 'Disabled' },
];

const defaultForm = {
  name: '',
  code: '',
  status: 'active',
  enabled: true,
  signatureFoods: [],
};

export function CountryFormDialog({ open, onClose, onSubmit, initialData, title, submitting }) {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (open) {
      setForm(
        initialData
          ? {
              name: initialData.name,
              code: initialData.code,
              status: initialData.status,
              enabled: initialData.isEnabled ?? initialData.enabled,
              signatureFoods: initialData.signatureFoods ?? [],
            }
          : defaultForm
      );
    }
  }, [open, initialData]);

  const handleSubmit = () => {
    if (!form.name.trim() || !form.code.trim()) {
      return;
    }
    onSubmit({
      ...form,
      name: form.name.trim(),
      code: form.code.trim().toUpperCase(),
      signatureFoods: form.signatureFoods.map((food) => food.trim()).filter(Boolean),
    });
    onClose();
  };

  return (
    <AdminFormDialog open={open} onClose={onClose} title={title} maxWidth="sm">
      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <TextField label="Country name" placeholder="e.g. Pakistan" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} fullWidth />
          <TextField
            label="Country code"
            placeholder="e.g. PK"
            value={form.code}
            onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
            inputProps={{ maxLength: 3 }}
            fullWidth
          />
          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={form.signatureFoods}
            onChange={(_event, newValue) => setForm((f) => ({ ...f, signatureFoods: newValue }))}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                const { key, ...tagProps } = getTagProps({ index });
                return <Chip key={key} label={option} size="small" {...tagProps} />;
              })
            }
            renderInput={(params) => <TextField {...params} label="Signature foods" placeholder="Type a dish and press Enter" />}
          />

          <TextField
            select
            label="Status"
            value={form.status}
            onChange={(e) => {
              const status = e.target.value;
              setForm((f) => ({
                ...f,
                status,
                enabled: status !== 'disabled',
              }));
            }}
            fullWidth
          >
            {STATUS_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>
          <FormControlLabel
            control={
              <Switch
                checked={form.enabled}
                onChange={(e) => {
                  const enabled = e.target.checked;
                  setForm((f) => ({
                    ...f,
                    enabled,
                    status: !enabled ? 'disabled' : f.status === 'disabled' ? 'active' : f.status,
                  }));
                }}
                color="primary"
              />
            }
            label="Enabled"
          />
        </Stack>
      </DialogContent>
      <AdminDialogActions onCancel={onClose} onSubmit={handleSubmit} submitDisabled={!form.name.trim() || !form.code.trim() || submitting} loading={submitting} />
    </AdminFormDialog>
  );
}

CountryFormDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  initialData: PropTypes.object,
  title: PropTypes.string,
  submitting: PropTypes.bool,
};
