import { useCallback, useEffect, useMemo, useState } from 'react';

import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { LinearProgress } from '@mui/material';
import { useSearchParams } from 'react-router-dom';

import { useBoolean } from 'src/hooks/use-boolean';
import { fDateTime } from 'src/utils/format-time';
import { Iconify } from 'src/components/iconify';
import { TablePaginationCustom, useTable } from 'src/components/table';

import { AdminModuleLayout } from '../admin-module-layout';
import { AdminTableToolbar } from '../components/admin-table-toolbar';
import { AdminListingCard } from '../components/admin-listing-card';
import { AdminTableActions } from '../components/admin-table-actions';
import { GroceryListViewDialog } from './grocery-list-view-dialog';
import { useGetGroceryListByIdQuery, useGetGroceryListsQuery } from 'src/store/Reducer/groceryList';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'sr', label: 'Sr#', width: 80 },
  { id: 'user', label: 'User' },
  { id: 'baby', label: 'Baby', width: 160 },
  { id: 'recipes', label: 'Recipes', width: 100 },
  { id: 'ingredients', label: 'Ingredients', width: 110 },
  { id: 'updatedAt', label: 'Last updated', width: 180 },
  { id: 'actions', label: 'Actions', width: 72, align: 'center' },
];

// ----------------------------------------------------------------------

export function GroceryListView() {
  const [searchParams] = useSearchParams();
  const viewDialog = useBoolean();
  const table = useTable();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [viewingId, setViewingId] = useState(null);

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
    return params;
  }, [table.page, table.rowsPerPage, debouncedSearch]);

  const { data: listResponse, isFetching } = useGetGroceryListsQuery(queryParams);

  const { data: viewResponse, isFetching: isLoadingView } = useGetGroceryListByIdQuery(viewingId, {
    skip: !viewingId,
  });

  const rows = listResponse?.data ?? [];
  const totalRows = listResponse?.meta?.totalRecords ?? rows.length;
  const viewingRecord = viewingId ? viewResponse?.data : null;

  const openView = useCallback(
    (row) => {
      setViewingId(row._id);
      viewDialog.onTrue();
    },
    [viewDialog]
  );

  return (
    <AdminModuleLayout title="Grocery lists">
      <AdminListingCard
        notFound={!isFetching && rows.length === 0}
        minWidth={900}
        headLabel={TABLE_HEAD}
        toolbar={
          <AdminTableToolbar
            searchValue={search}
            onSearchChange={(value) => {
              table.onResetPage();
              setSearch(value);
            }}
            searchPlaceholder="Search by user name or email..."
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
              <TableCell>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar
                    alt={row.user?.name}
                    src={row.user?.profileIcon || undefined}
                    sx={{ width: 36, height: 36, bgcolor: 'primary.main', color: 'common.white', fontSize: 14, fontWeight: 700 }}
                  >
                    {row.user?.name?.charAt(0)}
                  </Avatar>
                  <div>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {row.user?.name ?? '-'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {row.user?.email ?? ''}
                    </Typography>
                  </div>
                </Stack>
              </TableCell>
              <TableCell>{row.baby?.name ?? '-'}</TableCell>
              <TableCell>{row.recipesCount ?? 0}</TableCell>
              <TableCell>{row.itemsCount ?? 0}</TableCell>
              <TableCell>{row.updatedAt ? fDateTime(row.updatedAt) : '-'}</TableCell>
              <AdminTableActions
                extra={
                  <Tooltip title="View">
                    <IconButton size="small" color="default" onClick={() => openView(row)}>
                      <Iconify icon="solar:eye-bold" width={20} />
                    </IconButton>
                  </Tooltip>
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

      <GroceryListViewDialog
        open={viewDialog.value}
        onClose={() => {
          viewDialog.onFalse();
          setViewingId(null);
        }}
        data={viewingRecord}
        loading={Boolean(viewingId) && isLoadingView}
      />
    </AdminModuleLayout>
  );
}
