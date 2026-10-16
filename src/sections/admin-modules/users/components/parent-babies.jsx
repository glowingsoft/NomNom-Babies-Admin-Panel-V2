import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import TableContainer from '@mui/material/TableContainer';

import { Label } from 'src/components/label';
import { Chip, Divider, Stack } from '@mui/material';

// ----------------------------------------------------------------------

export function ParentBabies({ babies, selectedBabyId }) {
  return (
    <Card>
      <CardHeader title="Children" subheader={<Chip label={`${babies.length} child${babies.length !== 1 ? 'ren' : ''} registered`} size="small" sx={{ mb: 1 }} />} />

      <Divider />

      <TableContainer sx={{ overflow: 'auto' }}>
        <Table sx={{ minWidth: 480 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Food Cultures</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {babies.map((baby) => (
              <TableRow
                hover
                key={baby.id}
                sx={{
                  transition: 'all .2s ease',

                  backgroundColor: baby.id === selectedBabyId ? (theme) => theme.vars.palette.primary.lighter : 'inherit',

                  '&:hover': {
                    backgroundColor: baby.id === selectedBabyId ? (theme) => theme.vars.palette.primary.lighter : 'action.hover',
                  },

                  '& td': {
                    py: 2,
                  },
                }}
              >
                <TableCell>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: 'primary.main',
                      }}
                    >
                      {baby.name?.charAt(0)}
                    </Avatar>

                    <Typography variant="subtitle2">{baby.name}</Typography>
                  </Stack>
                </TableCell>
                <TableCell sx={{ color: 'text.secondary', typography: 'body2' }}>{baby.babyStage || '—'}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap">
                    {baby.foodCultures?.length ? baby.foodCultures.map((culture) => <Chip key={culture} label={culture} size="small" variant="soft" />) : '—'}
                  </Stack>
                </TableCell>
                <TableCell>
                  <Label variant="soft" color={baby.status === 'active' ? 'success' : baby.status === 'trial' ? 'warning' : 'error'}>
                    {baby.status}
                  </Label>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
