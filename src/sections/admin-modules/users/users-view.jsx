import React, { useCallback, useMemo, useState } from 'react';

import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Avatar, LinearProgress, Menu, MenuItem, Tooltip } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';

import { AdminModuleLayout } from '../admin-module-layout';
import { AdminTableToolbar } from '../components/admin-table-toolbar';
import { AdminListingCard } from '../components/admin-listing-card';
import { AdminTableActions } from '../components/admin-table-actions';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { TablePaginationCustom, useTable } from 'src/components/table';
import { useGetAllUsersQuery, useUpdateUserStatusMutation, useDeleteUserMutation } from 'src/store/Reducer/users';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'sr', label: 'Sr#', width: 80 },
  { id: 'name', label: 'Name' },
  { id: 'babies', label: 'Babies', width: 120 },
  { id: 'foodCultures', label: 'Food cultures' },
  { id: 'status', label: 'Status', width: 120 },
  { id: 'actions', label: 'Actions', width: 96, align: 'center' },
];

const FILTER_TABS = [
  { value: 'all', label: 'All', color: 'default' },
  { value: 'active', label: 'Active', color: 'success' },
  { value: 'inactive', label: 'Inactive', color: 'error' },
  { value: 'suspended', label: 'Suspended', color: 'warning' },
  { value: 'restricted', label: 'Restricted', color: 'info' },
  { value: 'softDeleted', label: 'Deleted', color: 'default' },
];

const USAGE_LABELS = {
  active: 'Active',
  inactive: 'Inactive',
  suspended: 'Suspended',
  restricted: 'Restricted',
  softDeleted: 'Deleted',
};

const USAGE_COLORS = {
  active: 'success',
  inactive: 'error',
  suspended: 'warning',
  restricted: 'info',
  softDeleted: 'default',
};

// Statuses a user can be manually moved between (softDeleted only happens via delete)
const STATUS_OPTIONS = [
  { value: 'active', label: 'Active', color: 'success' },
  { value: 'inactive', label: 'Inactive', color: 'error' },
  { value: 'suspended', label: 'Suspended', color: 'warning' },
  { value: 'restricted', label: 'Restricted', color: 'info' },
];

function userHasAllFoodCultures(user, required) {
  if (!required.length) return true;
  const cultures = user?.foodCultures || [];
  return required.every((culture) => cultures.includes(culture));
}

function countUsersWithFoodCultures(users, required) {
  return users.filter((user) => userHasAllFoodCultures(user, required)).length;
}

// ----------------------------------------------------------------------

export function UsersView() {
  const router = useRouter();
  const table = useTable();

  const [expandedRows, setExpandedRows] = useState({});
  const [cultureFilter, setCultureFilter] = useState([]);
  const [search, setSearch] = useState('');
  const [listFilter, setListFilter] = useState('all');
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actioningId, setActioningId] = useState(null); // row currently being updated/deleted

  // Paginated data actually shown in the table
  const {
    data: usersResponse,
    isFetching,
    error,
  } = useGetAllUsersQuery({
    page: table.page + 1,
    limit: table.rowsPerPage,
    search,
    status: listFilter !== 'all' ? listFilter : undefined,
  });

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserStatusMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const rows = useMemo(() => usersResponse?.data || [], [usersResponse?.data]);
  // Insight card and culture options are based on the users loaded for the current page (no extra request).
  const allUsers = rows;

  const totalRows = usersResponse?.meta?.totalRecords || 0;

  const FOOD_CULTURE_OPTIONS = useMemo(() => {
    const cultures = new Set();

    allUsers.forEach((user) => {
      (user.foodCultures || []).forEach((c) => cultures.add(c));
      (user.babies || []).forEach((baby) => {
        (baby.foodCultures || []).forEach((c) => cultures.add(c));
      });
    });

    return [...cultures].sort();
  }, [allUsers]);

  const handleTabChange = useCallback(
    (_event, newValue) => {
      setListFilter(newValue);
      table.onResetPage();
    },
    [table]
  );

  const handleSearchChange = useCallback(
    (value) => {
      setSearch(value);
      table.onResetPage();
    },
    [table]
  );

  // Tab badges come from meta.counts (totals per status, independent of page/search/filter).
  const getTabCount = useCallback((tab) => usersResponse?.meta?.counts?.[tab], [usersResponse?.meta?.counts]);

  const openStatusMenu = (event, row) => {
    setMenuAnchor(event.currentTarget);
    setSelectedUser(row);
  };

  const closeStatusMenu = () => {
    setMenuAnchor(null);
    setSelectedUser(null);
  };

  // Culture filter is applied client-side on top of the current server page.
  // Pagination count falls back to the filtered length in that case (see caveat above).
  const filtered = useMemo(() => rows.filter((row) => userHasAllFoodCultures(row, cultureFilter)), [rows, cultureFilter]);

  const dataInPage = filtered;

  const paginationCount = cultureFilter.length ? filtered.length : totalRows;

  const cultureFilterCount = useMemo(() => (cultureFilter.length ? countUsersWithFoodCultures(allUsers, cultureFilter) : null), [allUsers, cultureFilter]);

  const openView = useCallback(
    (row) => {
      router.push(paths.adminDashboard.user.details(row._id));
    },
    [router]
  );

  const insightLabel = cultureFilter.length > 0 ? cultureFilter.join(', ') : 'all food cultures';
  const insightCount = cultureFilter.length ? cultureFilterCount : allUsers.length;

  const handleToggleRow = (userId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const handleStatusChange = async (newStatus) => {
    const row = selectedUser;
    closeStatusMenu();
    if (!row || row.status === newStatus) return;

    setActioningId(row._id);
    try {
      await updateUser({ id: row._id, status: newStatus }).unwrap();
      toast.success('Status updated');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update status');
    } finally {
      setActioningId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const row = deleteTarget;
    setDeleteTarget(null);
    setActioningId(row._id);
    try {
      await deleteUser(row._id).unwrap();
      toast.success('User deleted');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to delete user');
    } finally {
      setActioningId(null);
    }
  };

  return (
    <AdminModuleLayout title="User management">
      <Card sx={{ p: 2.5, mb: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'stretch', md: 'center' }} justifyContent="space-between" spacing={2}>
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
              Food culture insight
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>{insightCount}</strong> of {allUsers.length} users on this page selected <strong>{insightLabel}</strong> as their food cultures.
            </Typography>
          </Box>

          <Autocomplete
            multiple
            size="small"
            options={FOOD_CULTURE_OPTIONS}
            value={cultureFilter}
            onChange={(_event, value) => setCultureFilter(value)}
            renderInput={(params) => <TextField {...params} label="Filter by food cultures" placeholder="e.g. Nigeria, United Kingdom" />}
            renderTags={(value, getTagProps) => value.map((option, index) => <Chip {...getTagProps({ index })} key={option} label={option} size="small" />)}
            sx={{ width: { xs: 1, md: 360 } }}
          />
        </Stack>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load users. Please try again.
        </Alert>
      )}

      <Card>
        <AdminListingCard
          notFound={!isFetching && !filtered.length}
          headLabel={TABLE_HEAD}
          minWidth={880}
          toolbar={
            <AdminTableToolbar
              filterValue={listFilter}
              filterOptions={FILTER_TABS}
              onFilterChange={handleTabChange}
              getFilterCount={getTabCount}
              searchValue={search}
              onSearchChange={handleSearchChange}
              searchPlaceholder="Search name, email, or country…"
            />
          }
        >
          {isFetching ? (
            <TableRow>
              <TableCell colSpan={TABLE_HEAD.length} align="center" sx={{ py: 6 }}>
                <LinearProgress
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 9,
                  }}
                />
              </TableCell>
            </TableRow>
          ) : (
            dataInPage.map((row, index) => {
              const isRowBusy = actioningId === row._id;
              const isSoftDeleted = row.status === 'softDeleted';

              return (
                <React.Fragment key={row._id}>
                  <TableRow
                    hover
                    sx={{
                      '& .MuiTableCell-root': {
                        py: table.dense ? 0.75 : 2,
                      },
                    }}
                  >
                    <TableCell>{table.page * table.rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ width: 28, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                          {row.babies?.length > 0 && (
                            <IconButton size="small" onClick={() => handleToggleRow(row._id)}>
                              <Iconify icon={expandedRows[row._id] ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'} />
                            </IconButton>
                          )}
                        </Box>

                        <Avatar
                          alt={row.name}
                          src={row.avatar || undefined}
                          sx={{ width: 40, height: 40, bgcolor: 'primary.main', color: 'common.white', fontSize: 16, fontWeight: 700 }}
                        >
                          {row.name?.charAt(0)?.toUpperCase()}
                        </Avatar>

                        <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
                          <Typography variant="subtitle2">{row.name}</Typography>
                          <Box component="span" sx={{ color: 'text.secondary', fontSize: 13 }}>
                            {row.email}
                          </Box>
                        </Stack>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">{row.babies?.length || 0}</Typography>
                    </TableCell>

                    <TableCell>
                      <Stack direction="row" flexWrap="wrap" gap={0.5}>
                        {(row.foodCultures || []).length ? (row.foodCultures || []).map((country) => <Chip key={country} label={country} size="small" variant="soft" />) : '-'}
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Label variant="soft" color={USAGE_COLORS[row.status] ?? 'default'}>
                        {USAGE_LABELS[row.status] ?? row.status}
                      </Label>
                    </TableCell>

                    <AdminTableActions
                      extra={
                        isRowBusy ? (
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
                          <>
                            <Tooltip title="View">
                              <IconButton size="small" color="primary" onClick={() => openView(row)}>
                                <Iconify icon="solar:eye-bold" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title={isSoftDeleted ? 'Already deleted' : 'Delete user'}>
                              <span>
                                <IconButton size="small" color="error" disabled={isDeleting || isSoftDeleted} onClick={() => setDeleteTarget(row)}>
                                  <Iconify icon="solar:trash-bin-trash-bold" />
                                </IconButton>
                              </span>
                            </Tooltip>

                            <Tooltip title={isSoftDeleted ? 'User is deleted' : 'Change status'}>
                              <span>
                                <IconButton size="small" color="warning" disabled={isUpdating || isSoftDeleted} onClick={(event) => openStatusMenu(event, row)}>
                                  <Iconify icon="solar:menu-dots-bold" />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </>
                        )
                      }
                    />
                  </TableRow>

                  {expandedRows[row._id] &&
                    row.babies?.map((baby, babyIndex) => (
                      <TableRow
                        key={baby._id}
                        sx={{
                          '& .MuiTableCell-root': {
                            py: table.dense ? 0.75 : 2,
                          },
                        }}
                      >
                        <TableCell>{table.page * table.rowsPerPage + babyIndex + 1}</TableCell>
                        <TableCell>
                          <Stack spacing={2} direction="row" alignItems="center" sx={{ pl: 6 }}>
                            <Avatar
                              alt={baby.name}
                              src={baby.avatar || undefined}
                              sx={{ width: 36, height: 36, bgcolor: 'primary.main', color: 'common.white', fontSize: 14, fontWeight: 700 }}
                            >
                              {baby.name?.charAt(0)?.toUpperCase()}
                            </Avatar>

                            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
                              {baby.name}
                              <Box component="span" sx={{ color: 'text.disabled', fontSize: 13 }}>
                                Baby
                              </Box>
                            </Stack>
                          </Stack>
                        </TableCell>

                        <TableCell>-</TableCell>

                        <TableCell>
                          <Stack direction="row" flexWrap="wrap" gap={0.5}>
                            {(baby.foodCultures || []).length
                              ? (baby.foodCultures || []).map((country) => <Chip key={country} label={country} size="small" variant="soft" />)
                              : '-'}
                          </Stack>
                        </TableCell>

                        <TableCell>
                          <Label color={USAGE_COLORS[baby.status] || 'default'} variant="soft">
                            {USAGE_LABELS[baby.status] || baby.status}
                          </Label>
                        </TableCell>

                        <TableCell align="center">
                          <IconButton size="small" color="primary" onClick={() => router.push(`${paths.adminDashboard.user.details(row._id)}?tab=babies&babyId=${baby._id}`)}>
                            <Iconify icon="solar:eye-bold" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </React.Fragment>
              );
            })
          )}
        </AdminListingCard>

        <TablePaginationCustom
          page={table.page}
          dense={table.dense}
          count={paginationCount}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onChangeDense={table.onChangeDense}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />

        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeStatusMenu}>
          {STATUS_OPTIONS.map((item) => (
            <MenuItem key={item.value} disabled={selectedUser?.status === item.value} onClick={() => handleStatusChange(item.value)}>
              <Label variant="soft" color={item.color}>
                {item.label}
              </Label>
            </MenuItem>
          ))}
        </Menu>
      </Card>

      {/* Delete confirmation */}
      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)}>
        <DialogTitle>Delete user?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? Their status will be set to <strong>Deleted</strong>.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </AdminModuleLayout>
  );
}
