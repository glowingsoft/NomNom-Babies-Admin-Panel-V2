import { useCallback, useEffect, useMemo, useState } from 'react';
import Switch from '@mui/material/Switch';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useBoolean } from 'src/hooks/use-boolean';
import { toast } from 'src/components/snackbar';
import { Label } from 'src/components/label';
import { AdminModuleLayout } from '../admin-module-layout';
import { AdminTableToolbar } from '../components/admin-table-toolbar';
import { AdminListingCard } from '../components/admin-listing-card';
import { AdminTableActions } from '../components/admin-table-actions';
import { AdminDeleteDialog } from '../components/admin-delete-dialog';
import { CountryFormDialog } from './country-form-dialog';
import { TablePaginationCustom, useTable } from 'src/components/table';
import { Card, Chip, LinearProgress, Stack } from '@mui/material';
import { useCreateCountryMutation, useDeleteCountryMutation, useGetCountriesQuery, useUpdateCountryMutation } from 'src/store/Reducer/country';

const TABLE_HEAD = [
  { id: 'sr', label: 'Sr#', width: 80 },
  { id: 'name', label: 'Country' },
  { id: 'code', label: 'Code', width: 88 },
  { id: 'signatureFoods', label: 'Signature Foods', width: 220 },
  { id: 'recipes', label: 'Recipes', width: 96 },
  { id: 'status', label: 'Status', width: 120 },
  { id: 'actions', label: 'Actions', width: 72, align: 'center' },
];

const statusLabel = {
  active: 'Active',
  disabled: 'Disabled',
  review: 'Under Review',
};

const statusColor = (status) => {
  if (status === 'active') return 'success';
  if (status === 'review') return 'warning';
  if (status === 'disabled') return 'error';
  return 'default';
};

const COUNTRY_FILTER_TABS = [
  { value: 'all', label: 'All', color: 'default' },
  { value: 'enabled', label: 'Active', color: 'success' },
  { value: 'disabled', label: 'Disabled', color: 'error' },
  { value: 'review', label: 'Under Review', color: 'warning' },
];

export function CountriesView() {
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
    if (listFilter === 'enabled') {
      params.status = 'active';
    }
    if (listFilter === 'review') {
      params.status = 'review';
    }
    if (listFilter === 'disabled') {
      params.status = 'disabled';
    }

    return params;
  }, [table.page, table.rowsPerPage, debouncedSearch, listFilter]);

  const { data: listResponse, isFetching } = useGetCountriesQuery(queryParams);

  const { data: allCountResponse } = useGetCountriesQuery({ page: 1, limit: 1 });
  const { data: enabledCountResponse } = useGetCountriesQuery({ page: 1, limit: 1, status: 'active' });
  const { data: reviewCountResponse } = useGetCountriesQuery({ page: 1, limit: 1, status: 'review' });
  const { data: disabledCountResponse } = useGetCountriesQuery({ page: 1, limit: 1, status: 'disabled' });

  const [createCountry, { isLoading: isCreating }] = useCreateCountryMutation();
  const [updateCountry, { isLoading: isUpdating }] = useUpdateCountryMutation();
  const [deleteCountry, { isLoading: isDeleting }] = useDeleteCountryMutation();

  const rows = listResponse?.data ?? [];
  const totalRows = listResponse?.meta?.totalRecords ?? rows.length;

  const tabCounts = {
    all: allCountResponse?.meta?.totalRecords ?? 0,
    enabled: enabledCountResponse?.meta?.totalRecords ?? 0,
    review: reviewCountResponse?.meta?.totalRecords ?? 0,
    disabled: disabledCountResponse?.meta?.totalRecords ?? 0,
  };

  const getTabCount = useCallback((tab) => tabCounts[tab] ?? 0, [tabCounts]);

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
      const body = {
        name: form.name,
        code: form.code,
        status: form.status,
        isEnabled: form.enabled,
        signatureFoods: form.signatureFoods,
      };

      try {
        if (editing) {
          await updateCountry({ id: editing._id, ...body }).unwrap();
          toast.success(`${form.name} updated`);
        } else {
          await createCountry(body).unwrap();
          toast.success(`${form.name} added to countries`);
        }
        formDialog.onFalse();
      } catch (error) {
        toast.error(error?.data?.message || 'Something went wrong');
      }
    },
    [editing, createCountry, updateCountry, formDialog]
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
      await deleteCountry(deleting._id).unwrap();
      toast.success(`${deleting.name} removed`);
      setDeleting(null);
      confirmDelete.onFalse();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to delete country');
    }
  }, [confirmDelete, deleting, deleteCountry]);

  return (
    <AdminModuleLayout title="Country management" actionLabel="Add country" onAction={openAdd}>
      <Card>
        <AdminListingCard
          notFound={!isFetching && rows.length === 0}
          minWidth={800}
          headLabel={TABLE_HEAD}
          toolbar={
            <AdminTableToolbar
              filterValue={listFilter}
              filterOptions={COUNTRY_FILTER_TABS}
              onFilterChange={handleTabChange}
              getFilterCount={getTabCount}
              searchValue={search}
              onSearchChange={(value) => {
                table.onResetPage();
                setSearch(value);
              }}
              searchPlaceholder="Search by name or code..."
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
                <TableCell>{row.code}</TableCell>
                <TableCell>
                  {row.signatureFoods?.length ? (
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                      {row.signatureFoods.slice(0, 3).map((food) => (
                        <Chip key={food} label={food} size="small" variant="soft" />
                      ))}
                      {row.signatureFoods.length > 3 && <Chip label={`+${row.signatureFoods.length - 3}`} size="small" variant="soft" />}
                    </Stack>
                  ) : (
                    '—'
                  )}
                </TableCell>
                <TableCell>{row.recipes}</TableCell>
                <TableCell>
                  <Label variant="soft" color={statusColor(row.status)}>
                    {statusLabel[row.status] ?? row.status}
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
          count={totalRows}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onChangeDense={table.onChangeDense}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      <CountryFormDialog
        open={formDialog.value}
        onClose={formDialog.onFalse}
        onSubmit={handleSave}
        initialData={editing}
        title={editing ? 'Edit country' : 'Add country'}
        submitting={isCreating || isUpdating}
      />

      <AdminDeleteDialog
        open={confirmDelete.value}
        onClose={confirmDelete.onFalse}
        title="Delete country"
        itemName={deleting?.name}
        warning="Recipes linked to this country will need to be reassigned."
        onConfirm={handleDelete}
        loading={isDeleting}
      />
    </AdminModuleLayout>
  );
}
