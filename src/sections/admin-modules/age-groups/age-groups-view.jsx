import { useCallback, useEffect, useState } from 'react';

import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import { useBoolean } from 'src/hooks/use-boolean';

import { toast } from 'src/components/snackbar';

import { AdminModuleLayout } from '../admin-module-layout';
import { AdminTableToolbar } from '../components/admin-table-toolbar';
import { AdminListingCard } from '../components/admin-listing-card';
import { AdminTableActions } from '../components/admin-table-actions';
import { AdminDeleteDialog } from '../components/admin-delete-dialog';
import { AgeGroupFormDialog } from './age-group-form-dialog';
import { Label } from 'src/components/label';
import { TablePaginationCustom, useTable } from 'src/components/table';
import { useCreateBabyStageMutation, useDeleteBabyStageMutation, useGetBabyStagesQuery, useUpdateBabyStageMutation } from 'src/store/Reducer/babyStage';
import { LinearProgress } from '@mui/material';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'sr', label: 'Sr#', width: 80 },
  { id: 'title', label: 'Age Group', width: 120 },
  { id: 'features', label: 'Features' },
  { id: 'recipes', label: 'Recipes', width: 96 },
  { id: 'active', label: 'Status', width: 120 },
  { id: 'actions', label: 'Actions', width: 72, align: 'center' },
];

const statusLabel = {
  true: 'Active',
  false: 'Disabled',
};

const statusColor = (active) => {
  return active ? 'success' : 'error';
};

const FILTER_TABS = [
  { value: 'all', label: 'All', color: 'default' },
  { value: 'active', label: 'Active', color: 'success' },
  { value: 'disabled', label: 'Disabled', color: 'error' },
];

// ----------------------------------------------------------------------

export function AgeGroupsView() {
  const formDialog = useBoolean();
  const confirmDelete = useBoolean();
  const table = useTable();

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [listFilter, setListFilter] = useState('all');

  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const queryParams = {
    page: table.page + 1,
    limit: table.rowsPerPage,
  };

  if (debouncedSearch) {
    queryParams.search = debouncedSearch;
  }

  if (listFilter !== 'all') {
    queryParams.status = listFilter;
  }

  const { data: response, isFetching } = useGetBabyStagesQuery(queryParams);
  const [createBabyStage, { isLoading: isCreating }] = useCreateBabyStageMutation();
  const [updateBabyStage, { isLoading: isUpdating }] = useUpdateBabyStageMutation();
  const [deleteBabyStage, { isLoading: isDeleting }] = useDeleteBabyStageMutation();

  const rows = response?.data ?? [];

  const totalRecords = response?.meta?.totalRecords ?? 0;



  // Tab badges come from meta.counts (totals per status, independent of page/search/filter).
  const getTabCount = useCallback((tab) => response?.meta?.counts?.[tab], [response?.meta?.counts]);

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

  const handleSave = async (form) => {
    try {
      if (editing) {
        await updateBabyStage({
          id: editing._id,
          ...form,
        }).unwrap();

        toast.success('Age group updated');
      } else {
        await createBabyStage(form).unwrap();

        toast.success('Age group created');
      }

      formDialog.onFalse();
    } catch (err) {
      toast.error(err?.data?.message || 'Something went wrong');
    }
  };

  const handleTabChange = useCallback(
    (_event, value) => {
      table.onResetPage();
      setListFilter(value);
    },
    [table]
  );

  const handleDelete = async () => {
    try {
      await deleteBabyStage(deleting._id).unwrap();

      toast.success('Deleted');

      confirmDelete.onFalse();
    } catch (err) {
      toast.error(err?.data?.message);
    }
  };

  return (
    <AdminModuleLayout title="Age Group" actionLabel="Add Age Group" onAction={openAdd}>
      <AdminListingCard
        notFound={!isFetching && rows.length === 0}
        minWidth={720}
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
            searchPlaceholder="Search baby stages..."
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
              <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{row.title}</TableCell>
              <TableCell>{row.features?.length ? row.features.join(', ') : '-'}</TableCell>
              <TableCell>{row.recipes ?? 0}</TableCell>
              <TableCell>
                <Label variant="soft" color={statusColor(row.active)}>
                  {row.active ? 'Active' : 'Disabled'}
                </Label>
              </TableCell>
              <AdminTableActions
                onEdit={() => openEdit(row)}
                onDelete={() => {
                  setDeleting(row);
                  confirmDelete.onTrue();
                }}
              />
            </TableRow>
          ))
        )}
      </AdminListingCard>

      <TablePaginationCustom
        page={table.page}
        dense={table.dense}
        count={totalRecords}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onChangeDense={table.onChangeDense}
        onRowsPerPageChange={table.onChangeRowsPerPage}
      />

      <AgeGroupFormDialog
        open={formDialog.value}
        onClose={formDialog.onFalse}
        onSubmit={handleSave}
        initialData={editing}
        title={editing ? 'Edit Age Group' : 'Add Age Group'}
        submitting={isCreating || isUpdating}
      />

      <AdminDeleteDialog
        open={confirmDelete.value}
        onClose={confirmDelete.onFalse}
        title="Delete Age Group"
        itemName={deleting?.title}
        warning="Age groups with linked recipes cannot be deleted."
        onConfirm={handleDelete}
        loading={isDeleting}
      />
    </AdminModuleLayout>
  );
}
