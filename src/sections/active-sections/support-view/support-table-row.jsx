import { Avatar, Box, CircularProgress, Link, Menu, MenuItem, Stack, Tooltip } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import PropTypes from 'prop-types';
import { memo, useState } from 'react';
import { GenericTableRowActions } from 'src/components/generic-table/table-row-actions';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import EllipsisCellWithTooltip from 'src/components/table/ellipsis-cell-with-tooltip';
import { useBoolean } from 'src/hooks/use-boolean';
import { useRouter } from 'src/routes/hooks';
import { toast } from 'src/components/snackbar';
import { useUpdateSupportStatusMutation } from 'src/store/Reducer/support';
import { fDate, formatStr } from 'src/utils/format-time';
import QuickSupportReply from './components/quick-support-reply';
import { STATUS_OPTIONS } from './supports-list-view';

const AUTO_CLOSE_DAYS = 15;
// Admins can only set these by hand; pending/responded/closed are set by the backend.
const MANUAL_STATUSES = ['open', 'resolved'];
// Reply is only offered while the request is awaiting an answer.
const REPLY_STATUSES = ['pending', 'open'];

export const SupportTableRow = memo(
  ({ row, serialNumber, onDeleteRow }) => {
    const reply = useBoolean();
    // Closed requests are final: their status can no longer be changed.
    const canChangeStatus = row.status !== 'closed';
    const [statusAnchor, setStatusAnchor] = useState(null);
    const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateSupportStatusMutation();

    const changeStatus = async (status) => {
      try {
        await updateStatus({ id: row._id, status }).unwrap();
        toast.success(`Marked as ${status}`);
      } catch (error) {
        toast.error(error?.data?.message || 'Failed to update status');
      }
    };

    const handleSelectStatus = (status) => {
      setStatusAnchor(null);
      if (status === row.status) return;
      changeStatus(status);
    };

    const router = useRouter();

    // The server closes requests that stay pending for 15 days, counted from the last status change.
    const closesInDays =
      row.status === 'pending' && row.updatedAt
        ? Math.max(0, Math.ceil((new Date(row.updatedAt).getTime() + AUTO_CLOSE_DAYS * 86400000 - Date.now()) / 86400000))
        : null;

    const actions = [
      {
        key: 'reply',
        icon: 'tabler:message-filled',
        tooltip: 'Reply',
        color: reply.value ? 'inherit' : 'default',
        onClick: () => {
          reply.onTrue();
        },
      },
    ];

    return (
      <>
        <TableRow hover tabIndex={-1}>
          <TableCell sx={{ whiteSpace: 'nowrap' }}>{serialNumber}</TableCell>

          <TableCell>
            <Stack spacing={2} direction="row" alignItems="center">
              <Avatar alt={row.name} src={row.avatar} />

              <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
                {row.name}

                <Box component="span" sx={{ color: 'text.disabled' }}>
                  {row.email}
                </Box>
              </Stack>
            </Stack>
          </TableCell>

          {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.phone || '-'}</TableCell> */}

          <EllipsisCellWithTooltip maxWidth="150px">{row?.subject || 'N/A'}</EllipsisCellWithTooltip>

          <EllipsisCellWithTooltip maxWidth="200px">{row?.message || 'N/A'}</EllipsisCellWithTooltip>

          <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.createdAt ? fDate(row.createdAt, formatStr.paramCase.date) : 'N/A'}</TableCell>
          <TableCell>
            <Tooltip
              title={closesInDays === null ? '' : `Pending requests are closed automatically after ${AUTO_CLOSE_DAYS} days (closes in ${closesInDays} ${closesInDays === 1 ? 'day' : 'days'}).`}
              arrow
            >
            <Label
              variant="soft"
              color={STATUS_OPTIONS.find((option) => option.value === row.status)?.color || 'default'}
              onClick={canChangeStatus ? (event) => !isUpdatingStatus && setStatusAnchor(event.currentTarget) : undefined}
              sx={{ cursor: canChangeStatus && !isUpdatingStatus ? 'pointer' : 'default' }}
              endIcon={isUpdatingStatus ? <CircularProgress size={12} color="inherit" /> : canChangeStatus ? <Iconify icon="eva:arrow-ios-downward-fill" width={14} /> : undefined}
            >
              {row.status || 'N/A'}
            </Label>
            </Tooltip>
            <Menu anchorEl={statusAnchor} open={Boolean(statusAnchor)} onClose={() => setStatusAnchor(null)}>
              {STATUS_OPTIONS.filter((option) => MANUAL_STATUSES.includes(option.value)).map((option) => (
                <MenuItem key={option.value} disabled={option.value === row.status} onClick={() => handleSelectStatus(option.value)}>
                  {option.label}
                </MenuItem>
              ))}
            </Menu>
          </TableCell>

          <TableCell>
            <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center' }}>{REPLY_STATUSES.includes(row.status) ? <GenericTableRowActions actions={actions} /> : '--'}</Box>
          </TableCell>
        </TableRow>

        {/* <UserQuickEditForm
        currentUser={row}
        open={quickEdit.value}
        onClose={quickEdit.onFalse}
      /> */}
        <QuickSupportReply open={reply.value} onclose={() => reply.onFalse()} row={row} />
      </>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison function for memo
    return (
      prevProps.row._id === nextProps.row._id &&
      prevProps.row.name === nextProps.row.name &&
      prevProps.row.balance === nextProps.row.balance &&
      prevProps.row.status === nextProps.row.status &&
      prevProps.row.createdAt === nextProps.row.createdAt &&
      prevProps.serialNumber === nextProps.serialNumber
    );
  }
);

SupportTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  serialNumber: PropTypes.number.isRequired,
  onDeleteRow: PropTypes.func.isRequired,
};

SupportTableRow.displayName = 'SupportTableRow';
