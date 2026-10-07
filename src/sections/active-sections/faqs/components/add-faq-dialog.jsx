import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';

import { Field, Form } from 'src/components/hook-form';

const DEFAULT_VALUES = {
  question: '',
  answer: '',
};

export default function AddFaqDialog({ open, onClose, onSubmit, schema, loading = false }) {
  const methods = useForm({
    mode: 'all',
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_VALUES,
  });

  const { reset, handleSubmit } = methods;

  useEffect(() => {
    if (open) {
      reset(DEFAULT_VALUES);
    }
  }, [open, reset]);

  const handleFormSubmit = handleSubmit(async (data) => {
    await onSubmit(data);

    reset(DEFAULT_VALUES);
  });

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={loading ? undefined : onClose}>
      <Form methods={methods} onSubmit={handleFormSubmit}>
        <DialogTitle>Add FAQ</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <Field.Text name="question" label="Question" placeholder="Enter question" />

            <Field.Text name="answer" label="Answer" placeholder="Write answer..." multiline rows={5} />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button color="inherit" variant="outlined" onClick={onClose} disabled={loading}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={loading}>
            Add FAQ
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
