import { useCallback, useMemo, useState } from 'react';

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
import { useAdminListFilter } from '../utils/use-admin-list-filter';
import { TranslationFormDialog } from './translation-form-dialog';
import { AppTextsDialog } from './app-texts-dialog';
import { TablePaginationCustom, useTable } from 'src/components/table';
import { useCreateLanguageMutation, useGetLanguagesQuery, useUpdateLanguageMutation, useDeleteLanguageMutation } from 'src/store/Reducer/language';
import { IconButton, LinearProgress, Tooltip } from '@mui/material';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'sr', label: 'Sr#', width: 80 },
  { id: 'title', label: 'Title', width: 200 },
  { id: 'transliteration', label: 'Transliteration' },
  { id: 'code', label: 'Code' },
  { id: 'flag', label: 'Flag', width: 120 },
  { id: 'texts', label: 'App texts', width: 160 },
  { id: 'active', label: 'Status', width: 120 },
  { id: 'actions', label: 'Actions', width: 120, align: 'center' },
];

const FILTER_TABS = [
  { value: 'all', label: 'All', color: 'default' },
  { value: 'active', label: 'Active', color: 'success' },
  { value: 'inactive', label: 'Disabled', color: 'error' },
];

// ----------------------------------------------------------------------

export function TranslationsView() {
  const formDialog = useBoolean();
  const confirmDelete = useBoolean();
  const table = useTable();

  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [textsFor, setTextsFor] = useState(null);

  const queryParams = useMemo(() => ({ page: table.page + 1, limit: table.rowsPerPage }), [table.page, table.rowsPerPage]);

  const { data, isLoading, isFetching, refetch } = useGetLanguagesQuery(queryParams);

  const [createLanguage, { isLoading: isCreating }] = useCreateLanguageMutation();
  const [updateLanguage, { isLoading: isUpdating }] = useUpdateLanguageMutation();
  const [deleteLanguage, { isLoading: isDeleting }] = useDeleteLanguageMutation();
  const rows = data?.data || [];

  const { search, setSearch, listFilter, filtered, handleTabChange } = useAdminListFilter(rows, {
    applyFilter: (row, tab) => {
      if (tab === 'all') return true;
      if (tab === 'active') return row.active;

      return !row.active;
    },
    getSearchableText: (row) => `${row.title} ${row.transliteration} ${row.code || ''}`,
  });

  // Tab badges come from meta.counts (totals per status, independent of page/search/filter).
  const getTabCount = (tab) => data?.meta?.counts?.[tab];

  const dataInPage = filtered.slice(table.page * table.rowsPerPage, table.page * table.rowsPerPage + table.rowsPerPage);

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
          await updateLanguage({ id: editing._id, ...form }).unwrap();
          toast.success('Language updated');
        } else {
          await createLanguage(form).unwrap();
          toast.success('Language added');
        }
        formDialog.onFalse();
        setEditing(null);
        refetch();
      } catch (error) {
        toast.error(error?.data?.message || 'Something went wrong');
      }
    },
    [editing, createLanguage, updateLanguage, formDialog, refetch]
  );

  const handleDelete = useCallback(async () => {
    if (!deleting) return;
    try {
      await deleteLanguage(deleting._id).unwrap();
      toast.success('Language removed');
      setDeleting(null);
      confirmDelete.onFalse();
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to delete language');
    }
  }, [confirmDelete, deleting, deleteLanguage, refetch]);

  return (
    <AdminModuleLayout title="Languages" actionLabel="Add Language" onAction={openAdd}>
      <AdminListingCard
        notFound={filtered.length === 0}
        minWidth={960}
        headLabel={TABLE_HEAD}
        toolbar={
          <AdminTableToolbar
            filterValue={listFilter}
            filterOptions={FILTER_TABS}
            onFilterChange={(_event, value) => {
              table.onResetPage();
              handleTabChange(_event, value);
            }}
            getFilterCount={getTabCount}
            searchValue={search}
            onSearchChange={(value) => {
              table.onResetPage();
              setSearch(value);
            }}
            searchPlaceholder="Search Language..."
          />
        }
      >
        {isLoading || isFetching ? (
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
          dataInPage.map((row, index) => (
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

              <TableCell sx={{ fontFamily: 'monospace', fontSize: 12 }}>{row.title}</TableCell>

              <TableCell>{row.transliteration}</TableCell>

              <TableCell>{row.code}</TableCell>

              <TableCell>{row.flag}</TableCell>

              <TableCell>
                <Label variant="soft" color={row.missingTranslations ? 'warning' : 'success'}>
                  {row.missingTranslations ? `${row.missingTranslations} missing` : `${row.totalTranslations ?? 0} translated`}
                </Label>
              </TableCell>

              <TableCell>
                <Label variant="soft" color={row.active ? 'success' : 'error'}>
                  {row.active ? 'Active' : 'Disabled'}
                </Label>
              </TableCell>

              <AdminTableActions
                extra={
                  <Tooltip title="Edit app texts">
                    <IconButton size="small" color="info" onClick={() => setTextsFor(row)}>
                      <Iconify icon="solar:text-field-bold" />
                    </IconButton>
                  </Tooltip>
                }
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
        count={data?.meta?.totalRecords ?? filtered.length}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onChangeDense={table.onChangeDense}
        onRowsPerPageChange={table.onChangeRowsPerPage}
      />

      <TranslationFormDialog
        open={formDialog.value}
        onClose={() => {
          formDialog.onFalse();
          setEditing(null);
        }}
        onSubmit={handleSave}
        initialData={editing}
        title={editing ? 'Edit Language' : 'Add Language'}
        loading={isCreating || isUpdating}
      />

      <AppTextsDialog language={textsFor} onClose={() => setTextsFor(null)} />

      <AdminDeleteDialog
        open={confirmDelete.value}
        onClose={confirmDelete.onFalse}
        title="Delete Language"
        itemName={deleting?.title}
        warning="The language will no longer be available in the app."
        onConfirm={handleDelete}
        loading={isDeleting}
      />
    </AdminModuleLayout>
  );
}
