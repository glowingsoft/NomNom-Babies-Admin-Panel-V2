import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import LinearProgress from '@mui/material/LinearProgress';

import { paths } from 'src/routes/paths';
import { useTabs } from 'src/hooks/use-tabs';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { useMockedUser } from 'src/auth/hooks';

import { ProfileCover } from './profile-cover';
import { AdminProfileHome } from './admin-profile-home';
import { AccountChangePassword } from './account-change-password';

const TABS = [
  {
    value: 'profile',
    label: 'Profile',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  {
    value: 'changePassword',
    label: 'Change Password',
    icon: <Iconify icon="ic:round-vpn-key" width={24} />,
  },
];

export function AdminProfileView() {
  const tabs = useTabs('profile');

  const { user } = useMockedUser();

  const info = {
    name: user?.displayName || user?.basicInfo?.name,
    email: user?.email || user?.basicInfo?.email,
    phoneNumber: user?.phoneNumber || user?.basicInfo?.phoneNumber,
    avatarUrl: user?.photoURL || user?.basicInfo?.profileIcon,

    role: 'Admin',
    status: 'Active',
  };

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
        <ProfileCover name={info.name} email={info.email} role={info.role} avatarUrl={info.avatarUrl} coverUrl="/assets/background/background-5.webp" />

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

      {tabs.value === 'profile' && <AdminProfileHome info={info} />}

      {tabs.value === 'changePassword' && <AccountChangePassword />}
    </DashboardContent>
  );
}
