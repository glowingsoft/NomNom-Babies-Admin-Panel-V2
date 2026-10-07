import PropTypes from 'prop-types';

import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export function AdminOrderCell({ order }) {
  return (
    <TableCell align="left" sx={{ pl: 2.5 }}>
      <Typography variant="body2">{order}</Typography>
    </TableCell>
  );
}

AdminOrderCell.propTypes = {
  order: PropTypes.number,
};
