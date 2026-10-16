import { useState } from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Tooltip from '@mui/material/Tooltip';

import { paths } from 'src/routes/paths';
import { useParams } from 'react-router';
import { useTabs } from 'src/hooks/use-tabs';
import { useRouter } from 'src/routes/hooks';
import { fDate } from 'src/utils/format-time';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ProfileCover } from './components/profile-cover';
import { ParentInfo } from './components/parent-info';
import { ParentBabies } from './components/parent-babies';
import { ParentRecipes } from './components/parent-recipies';
import { ParentTimetables } from './components/parent-timetables';
import { ParentFavourites } from './components/parent-favourites';
import { ParentGroceryList } from './components/parent-grocery-list';
import { ParentSubscriptions } from './components/parent-subscriptions';
import { ParentSupport } from './components/parent-support';
import { useSearchParams } from 'react-router-dom';

import { useGetUserDetailsQuery, useUpdateUserStatusMutation, useDeleteUserMutation } from 'src/store/Reducer/users';
import { LinearProgress } from '@mui/material';

// ----------------------------------------------------------------------

const TABS = [
  { value: 'info', label: 'Profile', icon: <Iconify icon="solar:user-id-bold" width={24} /> },
  { value: 'babies', label: 'Children', icon: <Iconify icon="solar:users-group-rounded-bold" width={24} /> },
  { value: 'recipes', label: 'Recipes Used', icon: <Iconify icon="solar:notebook-bold" width={24} /> },
  { value: 'timetables', label: 'Timetables', icon: <Iconify icon="solar:calendar-bold" width={24} /> },
  { value: 'favourites', label: 'Favourites', icon: <Iconify icon="solar:heart-bold" width={24} /> },
  { value: 'grocery', label: 'Grocery List', icon: <Iconify icon="solar:cart-large-2-bold" width={24} /> },
  { value: 'subscriptions', label: 'Subscriptions', icon: <Iconify icon="solar:card-bold" width={24} /> },
  { value: 'support', label: 'Support', icon: <Iconify icon="solar:chat-round-dots-bold" width={24} /> },
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active', color: 'success' },
  { value: 'inactive', label: 'Inactive', color: 'error' },
  { value: 'suspended', label: 'Suspended', color: 'warning' },
  { value: 'restricted', label: 'Restricted', color: 'info' },
];

// Maps the raw /users/:id response into the flat shape the tab components expect
function mapUserDetails(raw) {
  if (!raw) return null;

  return {
    id: raw._id,
    name: raw.name,
    email: raw.email,
    phone: raw.phone,
    avatarUrl: raw.profileIcon,
    status: raw.accountState?.status,
    foodCultures: raw.foodCultures || [],
    joinedAt: raw.createdAt ? fDate(raw.createdAt) : '—',
    lastActiveAt: raw.updatedAt ? fDate(raw.updatedAt) : '—',
    babies: (raw.babies || []).map((b) => ({
      id: b._id,
      name: b.name,
      avatar: b.profileIcon,
      status: b.isActive ? 'active' : 'inactive',
      foodCultures: (b.selectedCountries || []).map((c) => c.name),
      babyStage: b.babyStage?.title || null,
    })),
    recipesUsed: (raw.recipes || []).map((r) => ({
      id: r._id,
      title: r.title || r.recipe?.title,
      image: r.image || r.recipe?.image,
      category: r.category || null,
      usedAt: r.usedAt || r.createdAt || null,
    })),
    timetables: (raw.timetables || []).map((t) => ({
      id: `${t.babyId}-${t.date}`,
      babyId: t.babyId,
      babyName: t.babyName,
      date: t.date || null,
      createdAt: t.createdAt || null,
      mealCount: t.mealCount || 0,
      slots: (t.slots || []).map((s) => ({
        id: s._id,
        type: s.type,
        title: s.title,
        description: s.description,
        time: s.time,
        isOptional: s.isOptional,
        completed: s.completed,
      })),
    })),
    favouriteRecipes: (raw.favoriteRecipes || []).map((f) => ({
      id: f._id,
      name: f.recipe?.title,
      image: f.recipe?.image,
      category: null,
      downloaded: false,
    })),
    subscriptionHistory: (raw.subscriptionHistory?.length ? raw.subscriptionHistory : raw.subscriptions || []).map((s) => ({
      id: s._id,
      plan: s.type,
      startDate: s.startDate,
      endDate: s.endDate,
      status: s.endDate ? 'expired' : 'active',
    })),
    supportQuestions: raw.supportQuestions || [],
    groceryList: {
      recipes: (raw.groceryList?.recipes || []).map((entry) => ({
        id: entry._id,
        recipeId: entry.recipe?._id,
        title: entry.recipe?.title,
        image: entry.recipe?.image,
        icon: entry.recipe?.icon,
        ingredients: (entry.ingredients || []).map((ing) => ({
          name: ing.name,
          quantity: ing.quantity,
          icon: ing.icon,
          category: ing.category,
        })),
      })),
    },
  };
}

// ----------------------------------------------------------------------

export function UserDetailsView() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || 'info';
  const selectedBabyId = searchParams.get('babyId');

  const { data: userResponse, isLoading, error } = useGetUserDetailsQuery(id, { skip: !id });
  const profileData = mapUserDetails(userResponse?.data);

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserStatusMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const [statusAnchorEl, setStatusAnchorEl] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const tabs = useTabs(activeTab);
  const router = useRouter();

  const COVER_URL = '/assets/background/background-5.webp';
  const isSoftDeleted = profileData?.status === 'softDeleted';

  const handleStatusChange = async (newStatus) => {
    setStatusAnchorEl(null);
    if (!profileData || profileData.status === newStatus) return;
    try {
      await updateUser({ id: profileData.id, status: newStatus }).unwrap();
      toast.success('Status updated');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async () => {
    setConfirmDelete(false);
    if (!profileData) return;
    try {
      await deleteUser(profileData.id).unwrap();
      toast.success('User deleted');
      router.push(paths.adminDashboard.user.list);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="User Profile"
        links={[{ name: 'Dashboard', href: paths.adminDashboard.root }, { name: 'Users', href: paths.adminDashboard.user.list }, { name: profileData?.name }]}
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              onClick={() => router.push(paths.adminDashboard.user.list)}
              startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
              color="inherit"
              variant="outlined"
              size="small"
            >
              Back to users
            </Button>

            {profileData && (
              <>
                <Tooltip title={isSoftDeleted ? 'User is deleted' : 'Change status'}>
                  <span>
                    <IconButton color="warning" disabled={isUpdating || isSoftDeleted} onClick={(e) => setStatusAnchorEl(e.currentTarget)}>
                      {isUpdating ? (
                        <LinearProgress
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            zIndex: 9,
                          }}
                        />
                      ) : (
                        <Iconify icon="solar:menu-dots-bold" />
                      )}
                    </IconButton>
                  </span>
                </Tooltip>

                <Tooltip title={isSoftDeleted ? 'Already deleted' : 'Delete user'}>
                  <span>
                    <IconButton color="error" disabled={isDeleting || isSoftDeleted} onClick={() => setConfirmDelete(true)}>
                      {isDeleting ? (
                        <LinearProgress
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            zIndex: 9,
                          }}
                        />
                      ) : (
                        <Iconify icon="solar:trash-bin-trash-bold" />
                      )}
                    </IconButton>
                  </span>
                </Tooltip>
              </>
            )}
          </Box>
        }
      />

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Failed to load user details.
        </Alert>
      )}

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8, position: 'relative' }}>
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
      )}

      {!isLoading && profileData && (
        <>
          <Card sx={{ mt: 2, mb: 3, height: { xs: 380, sm: 340, md: 290 }, position: 'relative', overflow: 'hidden' }}>
            <ProfileCover
              role={profileData.status}
              name={profileData.name}
              avatarUrl={profileData.avatarUrl}
              coverUrl={COVER_URL}
              childrenCount={profileData.babies?.length || 0}
              recipiesCount={profileData.recipesUsed?.length || 0}
              plansCount={profileData.timetables?.length || 0}
              favouriteCount={profileData.favouriteRecipes?.length || 0}
            />

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
                overflowX: 'auto',
              }}
            >
              <Tabs
                value={tabs.value}
                onChange={tabs.onChange}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{ minHeight: 64, '& .MuiTab-root': { minHeight: 64, px: 2 } }}
              >
                {TABS.map((tab) => (
                  <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
                ))}
              </Tabs>
            </Box>
          </Card>

          {tabs.value === 'info' && <ParentInfo profileData={profileData} />}
          {tabs.value === 'babies' && <ParentBabies babies={profileData.babies || []} selectedBabyId={selectedBabyId} />}
          {tabs.value === 'recipes' && <ParentRecipes recipes={profileData.recipesUsed || []} />}
          {tabs.value === 'timetables' && <ParentTimetables timetables={profileData.timetables || []} />}
          {tabs.value === 'favourites' && <ParentFavourites favourites={profileData.favouriteRecipes || []} />}
          {tabs.value === 'grocery' && <ParentGroceryList groceryList={profileData.groceryList} userEmail={profileData.email} userName={profileData.name} />}
          {tabs.value === 'subscriptions' && <ParentSubscriptions subscriptions={profileData.subscriptionHistory || []} />}
          {tabs.value === 'support' && <ParentSupport questions={profileData.supportQuestions || []} />}
        </>
      )}

      <Menu anchorEl={statusAnchorEl} open={Boolean(statusAnchorEl)} onClose={() => setStatusAnchorEl(null)}>
        {STATUS_OPTIONS.map((item) => (
          <MenuItem key={item.value} disabled={profileData?.status === item.value} onClick={() => handleStatusChange(item.value)}>
            <Label variant="soft" color={item.color}>
              {item.label}
            </Label>
          </MenuItem>
        ))}
      </Menu>

      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>Delete user?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{profileData?.name}</strong>? Their status will be set to <strong>Deleted</strong>.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
