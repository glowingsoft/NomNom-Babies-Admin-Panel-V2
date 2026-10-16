import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';

import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom, TableNoData } from 'src/components/table';

// ----------------------------------------------------------------------

export function AdminListingCard({ toolbar, headLabel, minWidth = 720, notFound, children }) {
  return (
    <Card>
      {toolbar}

      <Scrollbar>
        <Table sx={{ minWidth }}>
          <TableHeadCustom headLabel={headLabel} />
          <TableBody>
            {children}
            <TableNoData notFound={notFound} />
          </TableBody>
        </Table>
      </Scrollbar>
    </Card>
  );
}

AdminListingCard.propTypes = {
  toolbar: PropTypes.node,
  headLabel: PropTypes.array,
  minWidth: PropTypes.number,
  notFound: PropTypes.bool,
  children: PropTypes.node,
};
