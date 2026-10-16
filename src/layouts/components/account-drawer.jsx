import { useCallback, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useRouter } from 'src/routes/hooks';
import { varAlpha } from 'src/theme/styles';
import { Iconify } from 'src/components/iconify';
import { useMockedUser } from 'src/auth/hooks';
import { AccountButton } from './account-button';
import { SignOutButton } from './sign-out-button';


export function AccountDrawer({ data = [], sx, ...other }) {
  const theme = useTheme();

  const router = useRouter();

  const { user } = useMockedUser();

  const [open, setOpen] = useState(false);

  const handleOpenDrawer = useCallback(() => {
    setOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setOpen(false);
  }, []);

  const handleClickItem = useCallback(
    (path) => {
      handleCloseDrawer();
      router.push(path);
    },
    [handleCloseDrawer, router]
  );

  const displayName = user?.displayName || user?.basicInfo?.name;
  const email = user?.basicInfo?.email || user?.email;
  const avatarLetter = displayName?.charAt(0)?.toUpperCase() || '?';

  return (
    <>
      <AccountButton
        open={open}
        onClick={handleOpenDrawer}
        photoURL={user?.photoURL || user?.basicInfo?.profileIcon}
        displayName={displayName}
        sx={sx}
        {...other}
      />

      <Drawer
        open={open}
        onClose={handleCloseDrawer}
        anchor="right"
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{
          sx: {
            width: 320,
            overflow: 'hidden',
          },
        }}
      >
        <IconButton
          onClick={handleCloseDrawer}
          size="small"
          sx={{ top: 10, left: 10, zIndex: 9, position: 'absolute' }}
        >
          <Iconify icon="mingcute:close-line" width={20} />
        </IconButton>

        <Stack sx={{ pt: 5, pb: 2, px: 2.5 }}>
          <Stack alignItems="center" spacing={1}>
            <Avatar
              src={user?.photoURL || user?.basicInfo?.profileIcon}
              alt={displayName}
              sx={{
                width: 118,
                height: 118,
                bgcolor: 'primary.main',
                fontSize: 42,
                fontWeight: 700,
              }}
            >
              {avatarLetter}
            </Avatar>

            <Typography variant="subtitle2" noWrap sx={{ maxWidth: 1, fontWeight: 700 }}>
              {displayName}
            </Typography>

            <Typography variant="caption" noWrap sx={{ color: 'text.secondary', maxWidth: 1 }}>
              {email}
            </Typography>
          </Stack>

          <Stack
            sx={{
              mt: 2,
              py: 1.5,
              borderTop: `dashed 1px ${theme.vars.palette.divider}`,
              borderBottom: `dashed 1px ${theme.vars.palette.divider}`,
            }}
          >
            {data.map((option) => (
              <MenuItem
                key={option.label}
                onClick={() => handleClickItem(option.href)}
                sx={{
                  py: 1,
                  borderRadius: 1,
                  color: 'text.primary',
                  '& svg': {
                    width: 22,
                    height: 22,
                    color: 'primary.main',
                  },
                  '&:hover': {
                    bgcolor: varAlpha(theme.vars.palette.primary.mainChannel, 0.08),
                  },
                }}
              >
                {option.icon}
                <Box component="span" sx={{ ml: 1.5, typography: 'body2' }}>
                  {option.label}
                </Box>
              </MenuItem>
            ))}
          </Stack>

          <Box sx={{ pt: 2, pb: 0.5 }}>
            <SignOutButton
              onClose={handleCloseDrawer}
              variant="contained"
              color="primary"
              size="medium"
              sx={{
                py: 1.25,
                fontWeight: 700,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            />
          </Box>
        </Stack>
      </Drawer>
    </>
  );
}