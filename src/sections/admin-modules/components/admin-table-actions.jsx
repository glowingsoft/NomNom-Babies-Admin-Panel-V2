import PropTypes from 'prop-types';

import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function AdminTableActions({ onEdit, onDelete, extra }) {
  return (
    <TableCell align="center">
      <Stack direction="row" justifyContent="center" spacing={0.5}>
        {extra}
        {onEdit && (
          <IconButton size="small" color="primary" onClick={onEdit}>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        )}
        {onDelete && (
          <IconButton size="small" color="error" onClick={onDelete}>
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        )}
      </Stack>
    </TableCell>
  );
}

AdminTableActions.propTypes = {
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  extra: PropTypes.node,
};
