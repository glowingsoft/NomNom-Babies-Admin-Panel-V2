import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'src/components/snackbar';
import { z as zod } from 'zod';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { useBoolean } from 'src/hooks/use-boolean';
import { Field, Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { useDispatch } from 'react-redux';
import { setUser } from 'src/store/slices/userSlice';
import { handleApiError } from 'src/utils/errorHandler';
import { getDeviceType } from 'src/utils/getDeviceType';
import { useAdminLoginMutation } from 'src/store/Reducer/auth';

export const SignInSchema = zod.object({
  email: zod.string().min(1, { message: 'Email is required!' }).email({ message: 'Email must be a valid email address!' }),
  password: zod.string().min(1, { message: 'Password is required!' }).min(6, { message: 'Password must be at least 6 characters!' }),
});

export function JwtSignInView() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [adminLogin, { isLoading }] = useAdminLoginMutation();

  const [errorMsg, setErrorMsg] = useState('');

  const password = useBoolean();

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const goTo = (permission) => {
    switch (permission) {
      case 1:
        router.push(paths.adminDashboard.root);
        break;
      default:
        router.push('/');
        break;
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    const deviceType = getDeviceType();

    const payload = {
      email: data.email.trim().toLowerCase(),
      password: data.password,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      userType: data.email.includes('admin') ? 'admin' : 'user',
      deviceType,
      deviceId: '123',
      language: 'en',
    };

    try {
      const response = await adminLogin(payload).unwrap();

      console.log('Login Response:', response);

      if (response.error) {
        return toast.error(response.error.data?.message);
      }

      if (!response.data) {
        toast.error('Login failed: No user data received');
        router.push('/');
        return null;
      }

      const user = response.data;

      if (!user) {
        return router.push('/404');
      }

      if (!user?.accountState?.status) {
        toast.error('Your account is inactive. Please contact support.');
        return null;
      }

      // const user_type = user?.accountState?.userType === 'user' ? 2 : 1;
      const user_type = 1;
      const permission = user_type;

      const UpdatedUserData = {
        ...user,
        permission,
      };

      console.log('Updated User Data', UpdatedUserData);

      dispatch(setUser(UpdatedUserData));
      goTo(user_type);

      reset();
      toast.success(response.message || 'Login successful!');
    } catch (error) {
      console.log(error);
      setErrorMsg(typeof error === 'string' ? error : error.message);
      handleApiError(error);
    }
  });

  const renderHead = (
    <Stack spacing={1.5} sx={{ mb: 4 }}>
      <Typography variant="h4">Welcome back, Admin</Typography>

      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
        Sign in with your admin credentials to manage NomNom Babies content, recipes, and caregiver resources.
      </Typography>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={3}>
      <Field.Text name="email" label="Email address" InputLabelProps={{ shrink: true }} />

      <Stack spacing={1.5}>
        <Field.Text
          name="password"
          label="Password"
          placeholder="6+ characters"
          type={password.value ? 'text' : 'password'}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <LoadingButton
        fullWidth
        color="primary"
        size="large"
        type="submit"
        variant="contained"
        disabled={isSubmitting || isLoading}
        sx={{
          '&.Mui-disabled': {
            bgcolor: 'primary.main',
            color: 'common.white',
            opacity: 1,
          },
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <span>{isLoading ? 'Signing in...' : 'Sign in'}</span>
          {isLoading && <CircularProgress size={16} sx={{ color: 'common.white' }} />}
        </Stack>
      </LoadingButton>
    </Stack>
  );

  return (
    <>
      {renderHead}

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>
    </>
  );
}
