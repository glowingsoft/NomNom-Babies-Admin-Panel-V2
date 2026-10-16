import { useMemo, useState } from 'react';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { Label } from 'src/components/label';
import { TablePaginationCustom, useTable } from 'src/components/table';
import { ADMIN_TRANSACTIONS } from 'src/_mock/admin-nomnom';

import { AdminModuleLayout } from '../admin-module-layout';
import { AdminListingCard } from '../components/admin-listing-card';
import { AdminTableToolbar } from '../components/admin-table-toolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'sr',      label: 'Sr#',     width: 72 },
  { id: 'txRef',   label: 'Tx ID',   width: 160 },
  { id: 'user',    label: 'User' },
  { id: 'plan',    label: 'Plan',    width: 120 },
  { id: 'amount',  label: 'Amount',  width: 100, align: 'right' },
  { id: 'date',    label: 'Start',   width: 120 },
  { id: 'endDate', label: 'Expiry',  width: 120 },
  { id: 'status',  label: 'Status',  width: 110 },
];

const PLAN_FILTER_TABS = [
  { value: 'all',        label: 'All',        color: 'default' },
  { value: 'Premium',    label: 'Premium',    color: 'primary' },
  { value: 'Free Trial', label: 'Free Trial', color: 'info' },
];

const STATUS_COLOR = {
  active:  'success',
  expired: 'default',
};

// ----------------------------------------------------------------------

export function TransactionsView() {
  const table = useTable({ defaultRowsPerPage: 10 });

  const [search, setSearch]       = useState('');
  const [planFilter, setPlanFilter] = useState('all');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return ADMIN_TRANSACTIONS.filter((row) => {
      const matchesPlan   = planFilter === 'all' || row.plan === planFilter;
      const matchesSearch = !q || row.userName.toLowerCase().includes(q) || row.userEmail.toLowerCase().includes(q) || row.txRef.toLowerCase().includes(q);
      return matchesPlan && matchesSearch;
    });
  }, [search, planFilter]);

  const dataInPage = filtered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const getTabCount = (value) => {
    if (value === 'all') return ADMIN_TRANSACTIONS.length;
    return ADMIN_TRANSACTIONS.filter((r) => r.plan === value).length;
  };

  return (
    <AdminModuleLayout title="Subscription Transactions">
      <Card>
        <AdminListingCard
          notFound={filtered.length === 0}
          minWidth={860}
          headLabel={TABLE_HEAD}
          toolbar={
            <AdminTableToolbar
              filterValue={planFilter}
              filterOptions={PLAN_FILTER_TABS}
              onFilterChange={(_e, value) => {
                table.onResetPage();
                setPlanFilter(value);
              }}
              getFilterCount={getTabCount}
              searchValue={search}
              onSearchChange={(value) => {
                table.onResetPage();
                setSearch(value);
              }}
              searchPlaceholder="Search user, email or Tx ID…"
            />
          }
        >
          {dataInPage.map((row, index) => (
            <TableRow
              key={row.id}
              hover
              sx={{ '& .MuiTableCell-root': { py: table.dense ? 0.75 : 1.75 } }}
            >
              <TableCell>{table.page * table.rowsPerPage + index + 1}</TableCell>

              <TableCell>
                <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                  {row.txRef}
                </Typography>
              </TableCell>

              <TableCell>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Avatar
                    sx={{ width: 36, height: 36, bgcolor: 'primary.main', color: 'common.white', fontSize: 14, fontWeight: 700 }}
                  >
                    {row.userName.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2">{row.userName}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{row.userEmail}</Typography>
                  </Box>
                </Stack>
              </TableCell>

              <TableCell>
                <Label variant="soft" color={row.plan === 'Premium' ? 'primary' : 'info'}>
                  {row.plan}
                </Label>
              </TableCell>

              <TableCell align="right">
                <Typography variant="subtitle2">{row.amount}</Typography>
              </TableCell>

              <TableCell>
                <Typography variant="body2">{row.date}</Typography>
              </TableCell>

              <TableCell>
                <Typography variant="body2">{row.endDate ?? '—'}</Typography>
              </TableCell>

              <TableCell>
                <Label variant="soft" color={STATUS_COLOR[row.status] || 'default'}>
                  {row.status}
                </Label>
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
      </Card>
    </AdminModuleLayout>
  );
}
