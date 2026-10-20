import { useCallback, useEffect, useMemo, useState } from 'react';

import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { LinearProgress } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { toast } from 'src/components/snackbar';
import { Label } from 'src/components/label';
import { TablePaginationCustom, useTable } from 'src/components/table';

import { AdminModuleLayout } from '../admin-module-layout';
import { AdminTableToolbar } from '../components/admin-table-toolbar';
import { AdminListingCard } from '../components/admin-listing-card';
import { AdminTableActions } from '../components/admin-table-actions';
import { AdminDeleteDialog } from '../components/admin-delete-dialog';
import { NutritionTagFormDialog } from './nutrition-tag-form-dialog';
import { useCreateNutritionMutation, useDeleteNutritionMutation, useGetNutritionsQuery, useUpdateNutritionMutation } from 'src/store/Reducer/nutrition';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'sr', label: 'Sr#', width: 80 },
  { id: 'name', label: 'Tag', width: 160 },
  { id: 'benefit', label: 'Benefit shown under recipes' },
  { id: 'recipes', label: 'Recipes', width: 100 },
  { id: 'status', label: 'Status', width: 120 },
  { id: 'actions', label: 'Actions', width: 72, align: 'center' },
];

const statusLabel = {
  active: 'Active',
  disabled: 'Disabled',
};

const statusColor = (status) => {
  if (status === 'active') return 'success';
  if (status === 'disabled') return 'error';
  return 'default';
};

const FILTER_TABS = [
  { value: 'all', label: 'All', color: 'default' },
  { value: 'active', label: 'Active', color: 'success' },
  { value: 'disabled', label: 'Disabled', color: 'error' },
];

// ----------------------------------------------------------------------

export function NutritionTagsView() {
  const formDialog = useBoolean();
  const confirmDelete = useBoolean();
  const table = useTable();

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [listFilter, setListFilter] = useState('all');
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

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

  const { data: listResponse, isFetching } = useGetNutritionsQuery(queryParams);


  const [createNutrition, { isLoading: isCreating }] = useCreateNutritionMutation();
  const [updateNutrition, { isLoading: isUpdating }] = useUpdateNutritionMutation();
  const [deleteNutrition, { isLoading: isDeleting }] = useDeleteNutritionMutation();

  const rows = listResponse?.data ?? [];
  const totalRows = listResponse?.meta?.totalRecords ?? rows.length;


  // Tab badges come from meta.counts (totals per status, independent of page/search/filter).
  const getTabCount = useCallback((tab) => listResponse?.meta?.counts?.[tab], [listResponse?.meta?.counts]);

  const openAdd = useCallback(() => {
    setEditing(null);
    formDialog.onTrue();
  }, [formDialog]);

  const openEdit = useCallback(
    (row) => {
      setEditing(row);
      formDialog.onTrue();
    },
    [formDialog]
  );

  const handleSave = useCallback(
    async (form) => {
      try {
        if (editing) {
          await updateNutrition({ id: editing._id, ...form }).unwrap();
          toast.success(`${form.name} updated`);
        } else {
          await createNutrition(form).unwrap();
          toast.success(`${form.name} added`);
        }
        formDialog.onFalse();
      } catch (error) {
        toast.error(error?.data?.message || 'Something went wrong');
      }
    },
    [editing, createNutrition, updateNutrition, formDialog]
  );

  const handleTabChange = useCallback(
    (_event, newValue) => {
      table.onResetPage();
      setListFilter(newValue);
    },
    [table]
  );

  const requestDelete = useCallback(
    (row) => {
      if (row.recipes > 0) {
        toast.error(`"${row.name}" is used by ${row.recipes} recipe${row.recipes === 1 ? '' : 's'} and can't be deleted until they're reassigned.`);
        return;
      }
      setDeleting(row);
      confirmDelete.onTrue();
    },
    [confirmDelete]
  );

  const handleDelete = useCallback(async () => {
    if (!deleting) return;
    try {
      await deleteNutrition(deleting._id).unwrap();
      toast.success(`${deleting.name} removed`);
      setDeleting(null);
      confirmDelete.onFalse();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to delete tag');
    }
  }, [confirmDelete, deleting, deleteNutrition]);

  return (
    <AdminModuleLayout title="Nutrition tags" actionLabel="Add tag" onAction={openAdd}>
      <AdminListingCard
        notFound={!isFetching && rows.length === 0}
        minWidth={640}
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
            searchPlaceholder="Search nutrition tags..."
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
              <TableCell sx={{ fontWeight: 600 }}>{row.name}</TableCell>
              <TableCell sx={{ color: 'text.secondary' }}>{row.benefit}</TableCell>
              <TableCell>{row.recipes}</TableCell>
              <TableCell>
                <Label variant="soft" color={statusColor(row.status)}>
                  {statusLabel[row.status] ?? row.status}
                </Label>
              </TableCell>
              <AdminTableActions onEdit={() => openEdit(row)} onDelete={() => requestDelete(row)} />
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

      <NutritionTagFormDialog
        open={formDialog.value}
        onClose={formDialog.onFalse}
        onSubmit={handleSave}
        initialData={editing}
        title={editing ? 'Edit nutrition tag' : 'Add nutrition tag'}
        submitting={isCreating || isUpdating}
      />

      <AdminDeleteDialog
        open={confirmDelete.value}
        onClose={confirmDelete.onFalse}
        title="Delete tag"
        itemName={deleting?.name}
        warning="Recipes using this tag will keep the label until updated."
        onConfirm={handleDelete}
        loading={isDeleting}
      />
    </AdminModuleLayout>
  );
}
