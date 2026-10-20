import { useCallback, useEffect, useMemo, useState } from 'react';

import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Switch from '@mui/material/Switch';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import { Chip, LinearProgress, Stack } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { toast } from 'src/components/snackbar';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

import { AdminModuleLayout } from '../admin-module-layout';
import { AdminTableToolbar } from '../components/admin-table-toolbar';
import { AdminListingCard } from '../components/admin-listing-card';
import { AdminTableActions } from '../components/admin-table-actions';
import { AdminDeleteDialog } from '../components/admin-delete-dialog';
import { RecipeFormDialog } from './recipe-form-dialog';
import { RecipeViewDialog } from './recipe-view-dialog';
import { TablePaginationCustom, useTable } from 'src/components/table';
import { useCreateRecipeMutation, useDeleteRecipeMutation, useGetRecipeByIdQuery, useGetRecipesQuery, useUpdateRecipeMutation } from 'src/store/Reducer/recipes';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'sr', label: 'Sr#', width: 80 },
  { id: 'title', label: 'Recipe' },
  { id: 'country', label: 'Country', width: 110 },
  { id: 'babyStage', label: 'Age Group', width: 120 },
  { id: 'mealType', label: 'Meal Type', width: 130 },
  { id: 'prepTime', label: 'Prep', width: 80 },
  { id: 'nutritionTags', label: 'Nutrition tags', width: 180 },
  { id: 'status', label: 'Status', width: 110 },
  { id: 'isActive', label: 'Active', width: 90, align: 'center' },
  { id: 'actions', label: 'Actions', width: 110, align: 'center' },
];

const FILTER_TABS = [
  { value: 'all', label: 'All', color: 'default' },
  { value: 'published', label: 'Published', color: 'success' },
  { value: 'draft', label: 'Draft', color: 'warning' },
  { value: 'archived', label: 'Archived', color: 'default' },
];

const statusColor = (status) => {
  if (status === 'published') return 'success';
  if (status === 'draft') return 'warning';
  return 'default';
};

// ----------------------------------------------------------------------

export function RecipesView() {
  const formDialog = useBoolean();
  const viewDialog = useBoolean();
  const confirmDelete = useBoolean();
  const table = useTable();

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [listFilter, setListFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [viewingId, setViewingId] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const queryParams = useMemo(() => {
    const params = {
      page: table.page + 1,
      limit: table.rowsPerPage,
    };
    if (debouncedSearch) params.search = debouncedSearch;
    if (listFilter !== 'all') params.status = listFilter;
    return params;
  }, [table.page, table.rowsPerPage, debouncedSearch, listFilter]);

  const { data: listResponse, isFetching } = useGetRecipesQuery(queryParams);


  const { data: detailResponse, isFetching: isLoadingDetail } = useGetRecipeByIdQuery(editingId, {
    skip: !editingId,
  });

  const { data: viewResponse, isFetching: isLoadingView } = useGetRecipeByIdQuery(viewingId, {
    skip: !viewingId,
  });

  const [createRecipe, { isLoading: isCreating }] = useCreateRecipeMutation();
  const [updateRecipe, { isLoading: isUpdating }] = useUpdateRecipeMutation();
  const [deleteRecipe, { isLoading: isDeleting }] = useDeleteRecipeMutation();

  const rows = listResponse?.data ?? [];
  const totalRows = listResponse?.meta?.totalRecords ?? rows.length;


  // Tab badges come from meta.counts (totals per status, independent of page/search/filter).
  const getTabCount = useCallback((tab) => listResponse?.meta?.counts?.[tab], [listResponse?.meta?.counts]);

  const editingRecord = editingId ? detailResponse?.data : null;
  const viewingRecord = viewingId ? viewResponse?.data : null;

  const openAdd = useCallback(() => {
    setEditingId(null);
    formDialog.onTrue();
  }, [formDialog]);

  const openEdit = useCallback(
    (row) => {
      setEditingId(row._id);
      formDialog.onTrue();
    },
    [formDialog]
  );

  const openView = useCallback(
    (row) => {
      setViewingId(row._id);
      viewDialog.onTrue();
    },
    [viewDialog]
  );

  const handleSave = useCallback(
    async (form) => {
      try {
        if (editingId) {
          await updateRecipe({ id: editingId, ...form }).unwrap();
          toast.success(`${form.title} updated`);
        } else {
          await createRecipe(form).unwrap();
          toast.success(`${form.title} added`);
        }
        formDialog.onFalse();
      } catch (error) {
        toast.error(error?.data?.message || 'Something went wrong');
      }
    },
    [editingId, createRecipe, updateRecipe, formDialog]
  );

  const handleArchive = useCallback(
    async (id) => {
      try {
        await updateRecipe({ id, status: 'archived' }).unwrap();
        toast.success('Recipe archived');
      } catch (error) {
        toast.error(error?.data?.message || 'Failed to archive recipe');
      }
    },
    [updateRecipe]
  );

  const handleToggleActive = useCallback(
    async (row) => {
      setTogglingId(row._id);
      try {
        await updateRecipe({ id: row._id, isActive: !row.isActive }).unwrap();
        toast.success(`${row.title} marked ${row.isActive ? 'inactive' : 'active'}`);
      } catch (error) {
        toast.error(error?.data?.message || 'Failed to update recipe');
      } finally {
        setTogglingId(null);
      }
    },
    [updateRecipe]
  );

  const handleTabChange = useCallback(
    (_event, newValue) => {
      table.onResetPage();
      setListFilter(newValue);
    },
    [table]
  );

  const handleDelete = useCallback(async () => {
    if (!deleting) return;
    try {
      await deleteRecipe(deleting._id).unwrap();
      toast.success(`${deleting.title} deleted`);
      setDeleting(null);
      confirmDelete.onFalse();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to delete recipe');
    }
  }, [confirmDelete, deleting, deleteRecipe]);

  return (
    <AdminModuleLayout title="Recipe management" actionLabel="Add recipe" onAction={openAdd}>
      <AdminListingCard
        notFound={!isFetching && rows.length === 0}
        minWidth={1250}
        headLabel={TABLE_HEAD}
        toolbar={
          <AdminTableToolbar
            filterValue={listFilter}
            filterOptions={FILTER_TABS}
            onFilterChange={handleTabChange}
            getFilterCount={getTabCount}
            searchValue={search}
            onSearchChange={(value) => {
              table.onResetPage();
              setSearch(value);
            }}
            searchPlaceholder="Search recipes..."
          />
        }
      >
        {isFetching ? (
          <TableRow>
            <TableCell colSpan={TABLE_HEAD.length} align="center" sx={{ py: 5 }}>
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
          rows.map((row, index) => (
            <TableRow
              key={row._id}
              hover
              sx={{
                '& .MuiTableCell-root': {
                  py: table.dense ? 0.75 : 2,
                },
              }}
            >
              <TableCell>{table.page * table.rowsPerPage + index + 1}</TableCell>
              <TableCell sx={{ fontWeight: 600, maxWidth: 240 }}>
                <Tooltip title={row.title}>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Avatar
                      alt={row.title}
                      src={row.image || undefined}
                      variant="rounded"
                      sx={{ width: 32, height: 32, bgcolor: 'primary.main', color: 'common.white', fontSize: 14, fontWeight: 700 }}
                    >
                      {row.title?.charAt(0)}
                    </Avatar>
                    {row.title}
                  </span>
                </Tooltip>
              </TableCell>
              <TableCell>{row.country?.name ?? '-'}</TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.babyStage?.title ?? '-'}</TableCell>
              <TableCell>{row.mealType?.name ?? '-'}</TableCell>
              <TableCell>{row.prepTime ? `${row.prepTime} min` : '—'}</TableCell>
              <TableCell>
                {row.nutritionTags?.length ? (
                  <Stack direction="row" spacing={0.5} useFlexGap flexWrap="wrap">
                    {row.nutritionTags.map((tag) => (
                      <Chip key={tag._id} label={tag.name} size="small" variant="soft" />
                    ))}
                  </Stack>
                ) : (
                  '—'
                )}
              </TableCell>
              <TableCell>
                <Label variant="soft" color={statusColor(row.status)}>
                  {row.status}
                </Label>
              </TableCell>
              <TableCell align="center">
                <Switch size="small" checked={Boolean(row.isActive)} disabled={togglingId === row._id || isUpdating} onChange={() => handleToggleActive(row)} />
              </TableCell>
              <AdminTableActions
                onEdit={() => openEdit(row)}
                onDelete={() => {
                  setDeleting(row);
                  confirmDelete.onTrue();
                }}
                extra={
                  <>
                    <Tooltip title="View">
                      <IconButton size="small" color="default" onClick={() => openView(row)}>
                        <Iconify icon="solar:eye-bold" width={20} />
                      </IconButton>
                    </Tooltip>
                    {row.status !== 'archived' && (
                      <Tooltip title="Archive">
                        <IconButton size="small" color="primary" disabled={isUpdating} onClick={() => handleArchive(row._id)}>
                          <Iconify icon="solar:archive-bold" width={20} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </>
                }
              />
            </TableRow>
          ))
        )}
      </AdminListingCard>

      <TablePaginationCustom
        page={table.page}
        dense={table.dense}
        count={totalRows}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onChangeDense={table.onChangeDense}
        onRowsPerPageChange={table.onChangeRowsPerPage}
      />

      <RecipeFormDialog
        open={formDialog.value}
        onClose={formDialog.onFalse}
        onSubmit={handleSave}
        initialData={editingRecord}
        loadingInitialData={Boolean(editingId) && isLoadingDetail}
        title={editingId ? 'Edit recipe' : 'Add recipe'}
        submitting={isCreating || isUpdating}
      />

      <RecipeViewDialog
        open={viewDialog.value}
        onClose={() => {
          viewDialog.onFalse();
          setViewingId(null);
        }}
        data={viewingRecord}
        loading={Boolean(viewingId) && isLoadingView}
      />

      <AdminDeleteDialog
        open={confirmDelete.value}
        onClose={confirmDelete.onFalse}
        title="Delete recipe"
        itemName={deleting?.title}
        warning="This cannot be undone."
        onConfirm={handleDelete}
        loading={isDeleting}
      />
    </AdminModuleLayout>
  );
}
