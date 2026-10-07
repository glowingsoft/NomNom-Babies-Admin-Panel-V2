import { useMemo, useState } from 'react';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { toast } from 'src/components/snackbar';
import { Label } from 'src/components/label';

import {
  ADMIN_NOTIFICATIONS,
  ADMIN_NOTIFICATION_SEGMENTS,
} from 'src/_mock/admin-nomnom';

import { AdminModuleLayout } from '../admin-module-layout';
import { AdminTableToolbar } from '../components/admin-table-toolbar';
import { AdminListingCard } from '../components/admin-listing-card';
import { useAdminListFilter } from '../utils/use-admin-list-filter';

// ----------------------------------------------------------------------

const DOC_EXAMPLE_MESSAGE = 'New month-6 recipes now available for Gambia';

const TABLE_HEAD = [
  { id: 'title', label: 'Message' },
  { id: 'audience', label: 'Audience / segment' },
  { id: 'recipientCount', label: 'Recipients', width: 100, align: 'right' },
  { id: 'sentAt', label: 'Sent', width: 120 },
  { id: 'status', label: 'Status', width: 100 },
];

const FILTER_TABS = [
  { value: 'all', label: 'All', color: 'default' },
  { value: 'sent', label: 'Sent', color: 'success' },
];

function getSegment(value) {
  return ADMIN_NOTIFICATION_SEGMENTS.find((s) => s.value === value) ?? ADMIN_NOTIFICATION_SEGMENTS[0];
}

// ----------------------------------------------------------------------

export function NotificationsView() {
  const [message, setMessage] = useState('');
  const [segmentValue, setSegmentValue] = useState('gambia-6');
  const [history, setHistory] = useState(ADMIN_NOTIFICATIONS);

  const selectedSegment = useMemo(() => getSegment(segmentValue), [segmentValue]);

  const { search, setSearch, listFilter, filtered, handleTabChange, getTabCount } = useAdminListFilter(
    history,
    {
      applyFilter: (row, tab) => tab === 'all' || row.status === tab,
      getSearchableText: (row) => `${row.title} ${row.audience}`,
    }
  );

  const handleSend = () => {
    if (!message.trim()) {
      toast.error('Enter a notification message');
      return;
    }

    const segment = getSegment(segmentValue);

    setHistory((prev) => [
      {
        id: String(Date.now()),
        title: message.trim(),
        audience: segment.label,
        segmentValue: segment.value,
        recipientCount: segment.recipientCount,
        sentAt: 'Just now',
        status: 'sent',
      },
      ...prev,
    ]);
    setMessage('');
    toast.success(`Notification sent to ${segment.recipientCount} users`);
  };

  const fillDocExample = () => {
    setMessage(DOC_EXAMPLE_MESSAGE);
    setSegmentValue('gambia-6');
  };

  return (
    <AdminModuleLayout title="Push notifications">
      <Grid container spacing={3}>
        <Grid xs={12} md={5}>
          <Card sx={{ p: 3, height: 1 }}>
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              Create & send
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Send to all users or a specific segment (country and age group).
            </Typography>

            <Stack spacing={2}>
              <TextField
                label="Message"
                placeholder={DOC_EXAMPLE_MESSAGE}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                multiline
                rows={3}
                fullWidth
              />

              <TextField
                select
                label="Audience segment"
                value={segmentValue}
                onChange={(e) => setSegmentValue(e.target.value)}
                fullWidth
                helperText={selectedSegment.description}
              >
                {ADMIN_NOTIFICATION_SEGMENTS.map((segment) => (
                  <MenuItem key={segment.value} value={segment.value}>
                    {segment.label}
                  </MenuItem>
                ))}
              </TextField>

              <Alert severity="info" variant="outlined" sx={{ py: 0.5 }}>
                <Typography variant="body2">
                  Will reach <strong>{selectedSegment.recipientCount}</strong> relevant users
                </Typography>
              </Alert>

              <Stack direction="row" spacing={1.5} flexWrap="wrap">
                <Button variant="contained" color="primary" onClick={handleSend}>
                  Send notification
                </Button>
                <Button variant="outlined" color="inherit" onClick={fillDocExample}>
                  Use doc example
                </Button>
              </Stack>
            </Stack>
          </Card>
        </Grid>

        <Grid xs={12} md={7}>
          <AdminListingCard
            notFound={filtered.length === 0}
            minWidth={640}
            headLabel={TABLE_HEAD}
            toolbar={
              <AdminTableToolbar
                filterValue={listFilter}
                filterOptions={FILTER_TABS}
                onFilterChange={handleTabChange}
                getFilterCount={getTabCount}
                searchValue={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search message or segment…"
              />
            }
          >
            {filtered.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell sx={{ fontWeight: 600 }}>{row.title}</TableCell>
                <TableCell>{row.audience}</TableCell>
                <TableCell align="right">
                  {row.recipientCount != null ? row.recipientCount.toLocaleString() : '—'}
                </TableCell>
                <TableCell>{row.sentAt}</TableCell>
                <TableCell>
                  <Label variant="soft" color="success">
                    Sent
                  </Label>
                </TableCell>
              </TableRow>
            ))}
          </AdminListingCard>
        </Grid>
      </Grid>
    </AdminModuleLayout>
  );
}
