import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { fDate } from 'src/utils/format-time';
import { Label } from 'src/components/label';
import { Chip, Divider } from '@mui/material';

// ----------------------------------------------------------------------

export function ParentSubscriptions({ subscriptions }) {
  return (
    <Card>
      <CardHeader title="Subscription History" subheader={<Chip label={`${subscriptions.length} record${subscriptions.length !== 1 ? 's' : ''}`} size="small" sx={{ mb: 1 }} />} />

      <Divider />

      <TableContainer sx={{ overflow: 'auto' }}>
        <Table sx={{ minWidth: 540 }}>
          <TableHead>
            <TableRow>
              <TableCell>Plan</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {subscriptions.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No subscription history
                </TableCell>
              </TableRow>
            )}

            {subscriptions.map((sub) => (
              <TableRow key={sub.id} hover>
                <TableCell>
                  <Typography variant="subtitle2">{sub.plan}</Typography>
                </TableCell>
                <TableCell sx={{ color: 'text.secondary', typography: 'body2' }}>{sub.startDate ? fDate(sub.startDate) : '—'}</TableCell>
                <TableCell sx={{ color: 'text.secondary', typography: 'body2' }}>{sub.endDate ? fDate(sub.endDate) : '—'}</TableCell>
                <TableCell sx={{ typography: 'body2' }}>{sub.amount || '—'}</TableCell>
                <TableCell>
                  <Label color={sub.status === 'active' ? 'success' : sub.status === 'expired' ? 'error' : 'warning'}>{sub.status || 'unknown'}</Label>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
