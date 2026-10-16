import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import DialogContent from '@mui/material/DialogContent';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { Upload } from 'src/components/upload';
import { Iconify } from 'src/components/iconify';

import { ADMIN_COUNTRIES } from 'src/_mock/admin-nomnom';

import { AdminDialogActions, AdminFormDialog } from '../components/admin-form-dialog';
import { formatFileSize } from './resource-file-utils';

// ----------------------------------------------------------------------

const TYPE_OPTIONS = ['Meal plan', 'Grocery list', 'Recipe cards', 'Timetable', 'Guide'];

const defaultForm = { name: '', country: 'Nigeria', type: 'Timetable' };

// ----------------------------------------------------------------------

export function ResourceFormDialog({ open, onClose, onSubmit, initialData, title }) {
  const [form, setForm] = useState(defaultForm);
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (open) {
      setForm(
        initialData
          ? {
              name: initialData.name,
              country: initialData.country,
              type: initialData.type,
            }
          : defaultForm
      );

      if (initialData?.fileUrl) {
        setFile({
          name: initialData.fileName,
          url: initialData.fileUrl,
          sizeLabel: initialData.size,
        });
      } else {
        setFile(null);
      }
    }
  }, [open, initialData]);

  const handleDrop = useCallback((accepted) => {
    const next = accepted?.[0];
    if (next) {
      setFile(next);
    }
  }, []);

  const handleRemoveFile = useCallback(() => {
    setFile(null);
  }, []);

  const handleSubmit = () => {
    if (!form.name.trim()) return;

    const uploadedFile = file instanceof File ? file : null;
    const existingFile = file && !(file instanceof File) ? file : null;

    if (!uploadedFile && !existingFile) return;

    onSubmit({
      name: form.name.trim(),
      country: form.country,
      type: form.type,
      file: uploadedFile,
      fileUrl: uploadedFile ? undefined : existingFile?.url,
      fileName: uploadedFile ? uploadedFile.name : existingFile?.name,
      size: uploadedFile ? formatFileSize(uploadedFile.size) : existingFile?.sizeLabel,
    });
    onClose();
  };

  const hasFile = file instanceof File || (file && file.url);
  const fileLabel =
    file instanceof File ? file.name : file?.name ?? 'No PDF selected';

  return (
    <AdminFormDialog open={open} onClose={onClose} title={title} maxWidth="sm">
      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <TextField
            label="Resource name"
            placeholder="e.g. Month 6 Timetable PDF"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            fullWidth
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              select
              label="Country"
              value={form.country}
              onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
              fullWidth
            >
              {ADMIN_COUNTRIES.filter((c) => c.enabled).map((c) => (
                <MenuItem key={c.id} value={c.name}>
                  {c.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Type"
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              fullWidth
            >
              {TYPE_OPTIONS.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              PDF file
            </Typography>
            <Upload
              accept={{ 'application/pdf': ['.pdf'] }}
              maxFiles={1}
              maxSize={15728640}
              value={file instanceof File ? file : null}
              onDrop={handleDrop}
              onDelete={handleRemoveFile}
              helperText="Upload recipe cards, grocery lists, or meal plan PDFs (max 15 MB)"
            />
            {hasFile && (
              <Stack
                direction="row"
                alignItems="center"
                spacing={1.5}
                sx={{
                  mt: 2,
                  p: 1.5,
                  borderRadius: 1,
                  bgcolor: 'background.neutral',
                }}
              >
                <Iconify icon="solar:file-text-bold" width={28} sx={{ color: 'error.main' }} />
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography variant="body2" noWrap>
                    {fileLabel}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {file instanceof File
                      ? formatFileSize(file.size)
                      : file?.sizeLabel || 'Ready to download'}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
                  {file?.url && (
                    <Typography
                      component="a"
                      href={file.url}
                      download={file.name}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="caption"
                      sx={{ color: 'primary.main', alignSelf: 'center', px: 0.5 }}
                    >
                      Preview
                    </Typography>
                  )}
                  <IconButton size="small" color="error" onClick={handleRemoveFile} aria-label="Remove file">
                    <Iconify icon="solar:trash-bin-trash-bold" width={18} />
                  </IconButton>
                </Stack>
              </Stack>
            )}
          </Box>
        </Stack>
      </DialogContent>
      <AdminDialogActions
        onCancel={onClose}
        onSubmit={handleSubmit}
        submitDisabled={!form.name.trim() || !hasFile}
      />
    </AdminFormDialog>
  );
}

ResourceFormDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  initialData: PropTypes.object,
  title: PropTypes.string,
};
