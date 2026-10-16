import { useState } from 'react';

import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import { fDateTime } from 'src/utils/format-time';
import { Label } from 'src/components/label';
import { TablePaginationCustom, useTable } from 'src/components/table';

import { AdminModuleLayout } from '../admin-module-layout';
import { AdminTableToolbar } from '../components/admin-table-toolbar';
import { AdminListingCard } from '../components/admin-listing-card';
import { useGetDownloadedPdfsQuery } from 'src/store/Reducer/dashboard';
import { LinearProgress } from '@mui/material';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'sr', label: 'Sr#', width: 80 },
  { id: 'detail', label: 'Resource' },
  { id: 'type', label: 'Type', width: 150 },
  { id: 'country', label: 'Country', width: 140 },
  { id: 'user', label: 'Downloaded by', width: 220 },
  { id: 'downloadedAt', label: 'Downloaded at', width: 160 },
  // { id: 'actions', label: 'PDF', width: 72, align: 'center' },
];

const FILTER_TABS = [
  { value: '', label: 'All', color: 'default' },
  { value: 'recipe', label: 'Recipe', color: 'info' },
  { value: 'feeding_timetable', label: 'Feeding timetable', color: 'warning' },
  { value: 'grocery_list', label: 'Grocery list', color: 'success' },
];

const typeColor = (type) => {
  if (type === 'recipe') return 'info';
  if (type === 'feeding_timetable') return 'warning';
  if (type === 'grocery_list') return 'success';
  return 'default';
};

// ----------------------------------------------------------------------

export function ResourcesView() {
  const table = useTable();
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');

  const { data, isFetching } = useGetDownloadedPdfsQuery({
    page: table.page + 1,
    limit: table.rowsPerPage,
    keyword: search,
    type,
  });

  const rows = data?.data || [];
  const totalRecords = data?.meta?.totalRecords || 0;
  const counts = data?.meta?.counts || {};

  const getFilterCount = (tabValue) => {
    if (tabValue === '') return counts.all || 0;
    return counts[tabValue] || 0;
  };

  return (
    <AdminModuleLayout title="Downloaded Resources">
      <AdminListingCard
        notFound={!isFetching && rows.length === 0}
        minWidth={900}
        headLabel={TABLE_HEAD}
        toolbar={
          <AdminTableToolbar
            filterValue={type}
            filterOptions={FILTER_TABS}
            onFilterChange={(_event, value) => {
              table.onResetPage();
              setType(value);
            }}
            getFilterCount={getFilterCount}
            searchValue={search}
            onSearchChange={(value) => {
              table.onResetPage();
              setSearch(value);
            }}
            searchPlaceholder="Search by resource or user..."
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
            <TableRow key={row.id} hover>
              <TableCell>{table.page * table.rowsPerPage + index + 1}</TableCell>

              <TableCell sx={{ fontWeight: 600 }}>{row.detail}</TableCell>

              <TableCell>
                <Label variant="soft" color={typeColor(row.type)} sx={{ textTransform: 'none' }}>
                  {row.typeLabel}
                </Label>
              </TableCell>

              <TableCell>{row.countries?.length ? row.countries.map((c) => c.name).join(', ') : '—'}</TableCell>

              <TableCell>
                <div>{row.userName}</div>
                <div style={{ fontSize: 12, opacity: 0.7 }}>{row.userEmail}</div>
              </TableCell>

              <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDateTime(row.downloadedAt)}</TableCell>

              {/* <TableCell align="center">
        {row.pdfUrl ? (
          <Tooltip title="Open PDF">
            <IconButton
              size="small"
              color="primary"
              component={Link}
              href={row.pdfUrl}
              target="_blank"
              rel="noopener"
            >
              <Iconify icon="eva:download-fill" width={20} />
            </IconButton>
          </Tooltip>
        ) : (
          '—'
        )}
      </TableCell> */}
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
    </AdminModuleLayout>
  );
}
