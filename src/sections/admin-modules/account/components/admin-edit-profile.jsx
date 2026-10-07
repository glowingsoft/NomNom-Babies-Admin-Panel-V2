import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import LoadingButton from '@mui/lab/LoadingButton';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { toast } from 'src/components/snackbar';

import { useUpdateProfileMutation } from 'src/store/Reducer/auth';
import { useCallback, useState } from 'react';

const EditProfileSchema = zod.object({
  displayName: zod.string().min(1, { message: 'Name is required!' }),
});

export function AdminEditProfile({ info, onCancel }) {
  const [updateProfile] = useUpdateProfileMutation();
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(info?.avatarUrl || '');

  const methods = useForm({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      displayName: info?.name || '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleAvatarChange = useCallback((event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (jpeg, jpg, png, gif)');
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData();
      formData.append('name', data.displayName);

      if (avatarFile) {
        formData.append('profileIcon', avatarFile);
      }

      await updateProfile(formData).unwrap();

      toast.success('Profile updated successfully!');
      onCancel?.();
    } catch (error) {
      console.error(error);
      toast.error(error?.data?.message || 'Failed to update profile');
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
            <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
              <Avatar
                src={info?.avatarUrl}
                sx={{
                  width: 110,
                  height: 110,
                  bgcolor: 'primary.main',
                  fontSize: 48,
                  fontWeight: 700,
                }}
              >
                {info?.name?.charAt(0)?.toUpperCase()}
              </Avatar>

              <IconButton
                size="small"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' },
                }}
              >
                <Iconify icon="solar:camera-add-bold" width={18} />
              </IconButton>
            </Box>

            <Typography variant="caption" color="text.secondary" display="block">
              Allowed *.jpeg, *.jpg, *.png, *.gif
            </Typography>
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card>
            <CardHeader title="Edit Profile Information" />

            <Stack spacing={3} sx={{ p: 3 }}>
              <Field.Text name="displayName" label="Full Name" />

              <Field.Text name="email" label="Email" disabled defaultValue={info?.email || ''} helperText="Email cannot be changed" />

              <Stack direction="row" justifyContent="flex-end" spacing={2}>
                <Button variant="outlined" color="inherit" onClick={onCancel}>
                  Cancel
                </Button>

                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  Save Changes
                </LoadingButton>
              </Stack>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
