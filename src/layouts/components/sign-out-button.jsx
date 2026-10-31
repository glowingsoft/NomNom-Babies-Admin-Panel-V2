import { useAuth0 } from '@auth0/auth0-react';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useRouter } from 'src/routes/hooks';
import { CONFIG } from 'src/config-global';
import { toast } from 'src/components/snackbar';
import { signOut as amplifySignOut } from 'src/auth/context/amplify/action';
import { signOut as firebaseSignOut } from 'src/auth/context/firebase/action';
import { signOut as jwtSignOut } from 'src/auth/context/jwt/action';
import { signOut as supabaseSignOut } from 'src/auth/context/supabase/action';
import { useAuthContext } from 'src/auth/hooks';
import { logout } from 'src/store/slices/userSlice';
import { walletsApi } from 'src/store/Reducer/wallets-api';
import { categoriesApi } from 'src/store/Reducer/categories-api';
import { authApi, useAdminLogoutMutation } from 'src/store/Reducer/auth';

const signOut =
  (CONFIG.auth.method === 'supabase' && supabaseSignOut) ||
  (CONFIG.auth.method === 'firebase' && firebaseSignOut) ||
  (CONFIG.auth.method === 'amplify' && amplifySignOut) ||
  jwtSignOut;

export function SignOutButton({ onClose, variant = 'soft', color = 'error', size = 'large', requireConfirm = false, sx, ...other }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { checkUserSession } = useAuthContext();
  const { logout: signOutAuth0 } = useAuth0();

  const [adminLogout] = useAdminLogoutMutation();

  const handleLogout = useCallback(async () => {
    try {
      // Ends the session on the server (revokes the refresh cookie) before clearing local state.
      await adminLogout({ deviceId: '123' })
        .unwrap()
        .catch(() => undefined);
      dispatch(walletsApi.util.resetApiState());
      dispatch(categoriesApi.util.resetApiState());
      dispatch(authApi.util.resetApiState());

      dispatch(logout());

      localStorage.clear();

      onClose?.();

      router.replace('/');

      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Unable to logout!');
    }
  }, [adminLogout, dispatch, onClose, router]);

  const handleLogoutAuth0 = useCallback(async () => {
    try {
      await signOutAuth0();

      dispatch(walletsApi.util.resetApiState());
      dispatch(transactionsApi.util.resetApiState());
      dispatch(categoriesApi.util.resetApiState());
      dispatch(authApi.util.resetApiState());

      onClose?.();
      router.refresh();

      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Unable to logout!');
    }
  }, [onClose, router, signOutAuth0, dispatch]);

  const handleOpenConfirm = useCallback(() => {
    if (!requireConfirm) {
      if (CONFIG.auth.method === 'auth0') {
        handleLogoutAuth0();
      } else {
        handleLogout();
      }
      return;
    }
    setConfirmOpen(true);
  }, [handleLogout, handleLogoutAuth0, requireConfirm]);

  const handleCloseConfirm = useCallback(() => {
    setConfirmOpen(false);
  }, []);

  const handleConfirmLogout = useCallback(() => {
    setConfirmOpen(false);
    if (CONFIG.auth.method === 'auth0') {
      handleLogoutAuth0();
    } else {
      handleLogout();
    }
  }, [handleLogout, handleLogoutAuth0]);

  return (
    <>
      <Button fullWidth variant={variant} size={size} color={color} onClick={handleOpenConfirm} sx={sx} {...other}>
        Logout
      </Button>

      <Dialog open={confirmOpen} onClose={handleCloseConfirm} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm logout</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to logout?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmLogout} color="primary" variant="contained">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
