import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';
import { useTabs } from 'src/hooks/use-tabs';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { useMockedUser } from 'src/auth/hooks';

import { AdminProfileCover } from './components/admin-profile-cover';
import { AdminProfileHome } from './components/admin-profile-home';
import { AdminChangePassword } from './components/admin-change-password';
import { AdminEditProfile } from './components/admin-edit-profile';
import { useGetMyProfileQuery } from 'src/store/Reducer/auth';
import { LinearProgress } from '@mui/material';

const TABS = [
  {
    value: 'profile',
    label: 'Profile',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  {
    value: 'editProfile',
    label: 'Edit Profile',
    icon: <Iconify icon="solar:pen-bold" width={24} />,
  },
  {
    value: 'changePassword',
    label: 'Change Password',
    icon: <Iconify icon="ic:round-vpn-key" width={24} />,
  },
];

export function AdminAccountGeneral() {
  const tabs = useTabs('profile');

  const { data, isLoading } = useGetMyProfileQuery();

  const basicInfo = data?.data?.basicInfo;

  const accountState = data?.data?.accountState;

  const { user } = useMockedUser();

  const info = {
    name: basicInfo?.name,
    email: basicInfo?.email,
    phoneNumber: basicInfo?.phoneNumber,
    avatarUrl: basicInfo?.profileIcon,

    role: accountState?.role || 'Admin',
    status: accountState?.status || 'Active',
  };

  if (isLoading) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <LinearProgress
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 9,
            }}
          />
        </Box>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Profile"
        links={[
          {
            name: 'Dashboard',
            href: paths.adminDashboard.root,
          },
          {
            name: 'Profile',
          },
        ]}
        sx={{ mb: 3 }}
      />

      <Card
        sx={{
          mb: 3,
          height: 290,
          position: 'relative',
          borderRadius: 2,
        }}
      >
        <AdminProfileCover name={info.name} email={info.email} role={info.role} avatarUrl={info.avatarUrl} coverUrl="/assets/background/background-5.webp" />

        <Box
          display="flex"
          justifyContent={{ xs: 'center', md: 'flex-end' }}
          sx={{
            width: 1,
            bottom: 0,
            zIndex: 9,
            px: { md: 3 },
            position: 'absolute',
            bgcolor: 'background.paper',
          }}
        >
          <Tabs value={tabs.value} onChange={tabs.onChange}>
            {TABS.map((tab) => (
              <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
            ))}
          </Tabs>
        </Box>
      </Card>

      {tabs.value === 'profile' && <AdminProfileHome info={info} onEdit={() => tabs.setValue('editProfile')} />}

      {tabs.value === 'editProfile' && <AdminEditProfile info={info} onCancel={() => tabs.setValue('profile')} />}

      {tabs.value === 'changePassword' && <AdminChangePassword />}
    </DashboardContent>
  );
}
