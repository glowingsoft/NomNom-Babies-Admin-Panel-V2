import { useState } from 'react';

import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import Box from '@mui/material/Box';
import { Card, LinearProgress } from '@mui/material';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { fDateTime } from 'src/utils/format-time';

import { AdminModuleLayout } from '../admin-module-layout';
import { AdminTableToolbar } from '../components/admin-table-toolbar';
import { AdminListingCard } from '../components/admin-listing-card';
import { TablePaginationCustom, useTable } from 'src/components/table';

import { useGetActivitiesQuery } from 'src/store/Reducer/activities';

const TABLE_HEAD = [
  { id: 'sr', label: 'Sr#', width: 80 },
  { id: 'action', label: 'Action' },
  { id: 'detail', label: 'Detail' },
  { id: 'module', label: 'Module', width: 140 },
  { id: 'time', label: 'Time', width: 160 },
  { id: 'metadata', label: '', width: 60 },
];

export function RecentActivitiesView() {
  const table = useTable();

  const [search, setSearch] = useState('');

  const { data, isFetching } = useGetActivitiesQuery({
    page: table.page + 1,
    limit: table.rowsPerPage,
    search,
  });

  const rows = data?.data || [];
  const totalRecords = data?.meta?.totalRecords || 0;

  return (
    <AdminModuleLayout title="Recent Activities">
      <Card>
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
              searchPlaceholder="Search activity..."
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
            rows.map((row, index) => <ActivityRow key={row.id} row={row} dense={table.dense} serialNumber={table.page * table.rowsPerPage + index + 1} />)
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
      </Card>
    </AdminModuleLayout>
  );
}

function ActivityRow({ row, dense, serialNumber }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const hasMetadata = row.metadata && Object.keys(row.metadata).length > 0;

  const open = Boolean(anchorEl);

  return (
    <TableRow
      hover
      sx={{
        '& .MuiTableCell-root': {
          py: dense ? 0.75 : 2,
        },
      }}
    >
      <TableCell>{serialNumber}</TableCell>

      <TableCell sx={{ fontWeight: 600 }}>{row.action}</TableCell>

      <TableCell>{row.detail}</TableCell>

      <TableCell>
        <Label variant="soft" color="default">
          {row.module}
        </Label>
      </TableCell>

      <TableCell>
        <Label variant="soft" color="info">
          {fDateTime(row.time)}
        </Label>
      </TableCell>

      <TableCell align="center">
        {hasMetadata && (
          <>
            <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
              <Iconify icon="solar:info-circle-bold" width={18} />
            </IconButton>

            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={() => setAnchorEl(null)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <Box
                component="pre"
                sx={{
                  p: 2,
                  m: 0,
                  maxWidth: 320,
                  maxHeight: 240,
                  overflow: 'auto',
                  fontSize: 12,
                  bgcolor: 'background.neutral',
                }}
              >
                {JSON.stringify(row.metadata, null, 2)}
              </Box>
            </Popover>
          </>
        )}
      </TableCell>
    </TableRow>
  );
}
