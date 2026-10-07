import { useCallback, useState } from 'react';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import { toast } from 'src/components/snackbar';
import { Label } from 'src/components/label';

import { ADMIN_CONTENT_APPROVAL } from 'src/_mock/admin-nomnom';

import { AdminModuleLayout } from '../admin-module-layout';
import { AdminTableToolbar } from '../components/admin-table-toolbar';
import { AdminListingCard } from '../components/admin-listing-card';
import { useAdminListFilter } from '../utils/use-admin-list-filter';
import { IconButton, Tooltip } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { TablePaginationCustom, useTable } from 'src/components/table';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'sr', label: 'Sr#' },
  { id: 'title', label: 'Title' },
  { id: 'type', label: 'Type', width: 120 },
  { id: 'author', label: 'Author', width: 140 },
  { id: 'submittedAt', label: 'Submitted', width: 120 },
  { id: 'status', label: 'Status', width: 120 },
  { id: 'actions', label: 'Actions', width: 72, align: 'center' },
];

const FILTER_TABS = [
  { value: 'all', label: 'All', color: 'default' },
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'approved', label: 'Approved', color: 'success' },
  { value: 'rejected', label: 'Rejected', color: 'error' },
];

const statusLabel = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
};

const statusColor = (status) => {
  if (status === 'approved') return 'success';
  if (status === 'rejected') return 'error';
  return 'warning';
};

// ----------------------------------------------------------------------

export function ContentApprovalView() {
  const table = useTable();
  const [rows, setRows] = useState(ADMIN_CONTENT_APPROVAL);

  const { search, setSearch, listFilter, filtered, handleTabChange, getTabCount } = useAdminListFilter(rows, {
    applyFilter: (row, tab) => tab === 'all' || row.status === tab,
    getSearchableText: (row) => `${row.title} ${row.type} ${row.author}`,
  });

  const dataInPage = filtered.slice(table.page * table.rowsPerPage, table.page * table.rowsPerPage + table.rowsPerPage);

  const approve = useCallback((id) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'approved' } : r)));
    toast.success('Approved for publishing');
  }, []);

  const reject = useCallback((id) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'rejected' } : r)));
    toast.info('Sent back for edits');
  }, []);

  return (
    <AdminModuleLayout title="Content approval">
      <AdminListingCard
        notFound={filtered.length === 0}
        minWidth={880}
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
            searchPlaceholder="Search content..."
          />
        }
      >
        {dataInPage.map((row, index) => (
          <TableRow
            key={row.id}
            hover
            sx={{
              '& .MuiTableCell-root': {
                py: table.dense ? 0.75 : 2,
              },
            }}
          >
            <TableCell>{table.page * table.rowsPerPage + index + 1}</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>{row.title}</TableCell>
            <TableCell>{row.type}</TableCell>
            <TableCell>{row.author}</TableCell>
            <TableCell>{row.submittedAt}</TableCell>
            <TableCell>
              <Label variant="soft" color={statusColor(row.status)}>
                {statusLabel[row.status] ?? row.status}
              </Label>
            </TableCell>
            <TableCell align="center">
              {row.status === 'pending' ? (
                <Stack direction="row" spacing={1} justifyContent="center">
                  <IconButton
                    color="success"
                    sx={{
                      border: 1,
                      borderColor: 'success.main',
                    }}
                    onClick={() => approve(row.id)}
                  >
                    <Iconify icon="solar:check-circle-bold" />
                  </IconButton>

                  <IconButton
                    color="error"
                    sx={{
                      border: 1,
                      borderColor: 'error.main',
                    }}
                    onClick={() => reject(row.id)}
                  >
                    <Iconify icon="solar:close-circle-bold" />
                  </IconButton>
                </Stack>
              ) : (
                '—'
              )}
            </TableCell>
          </TableRow>
        ))}
      </AdminListingCard>
      <TablePaginationCustom
        page={table.page}
        dense={table.dense}
        count={filtered.length}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onChangeDense={table.onChangeDense}
        onRowsPerPageChange={table.onChangeRowsPerPage}
      />
    </AdminModuleLayout>
  );
}
