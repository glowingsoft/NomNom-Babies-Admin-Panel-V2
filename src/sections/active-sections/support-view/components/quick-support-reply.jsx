import React from 'react';
import { Dialog, DialogTitle, DialogContent, Button, DialogActions } from '@mui/material';
import { Form, RHFTextField } from 'src/components/hook-form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import { z as zod } from 'zod';
import { toast } from 'src/components/snackbar';
import { useReplySupportMutation } from 'src/store/Reducer/support';

const QuickSupportReply = ({ open, onclose, row }) => {
  const [replySupport, { isLoading }] = useReplySupportMutation();

  const schema = zod.object({
    message: zod.string().min(1, 'Message is required'),
  });

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      message: '',
    },
  });
  const handleClose = () => {
    onclose();
    methods.reset();
  };

  const onSubmit = async (data) => {
    try {
      await replySupport({ id: row._id, message: data.message.trim() }).unwrap();
      toast.success('Reply sent');
      handleClose();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to send reply');
    }
  };
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <Form methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
        <DialogTitle sx={{ pb: 0 }}>Reply </DialogTitle>
        <DialogContent>
          <RHFTextField name="message" label="Message" multiline rows={3} sx={{ mt: 2 }} />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" color="primary" loading={isLoading}>
            Send
          </LoadingButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
};

export default QuickSupportReply;
