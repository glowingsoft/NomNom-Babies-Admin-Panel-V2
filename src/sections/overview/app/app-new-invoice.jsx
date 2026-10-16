import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import CardHeader from '@mui/material/CardHeader';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { TableHeadCustom } from 'src/components/table';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { useTheme, alpha } from '@mui/material/styles';
import { TableContainer } from '@mui/material';
import { useRouter } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export function AppNewInvoice({ title, subheader, tableData, headLabel, icon, viewAllPath, ...other }) {
  const theme = useTheme();
  const router = useRouter();

  return (
    <Card
      {...other}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        ...(other.sx || {}),
      }}
    >
      <CardHeader
        avatar={
          icon ? (
            <Box
              sx={{
                width: 44,
                height: 44,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1.5,
                color: 'primary.main',
                bgcolor: alpha(theme.palette.primary.main, 0.1),
              }}
            >
              <Iconify icon={icon} width={24} />
            </Box>
          ) : null
        }
        title={title}
        subheader={subheader}
        sx={{
          mb: 2,
          '& .MuiCardHeader-avatar': {
            mr: 2,
          },
        }}
      />

      <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
        <Table stickyHeader sx={{ minWidth: 500 }}>
          <TableHeadCustom
            headLabel={headLabel}
            sx={{
              '& .MuiTableCell-root': {
                bgcolor: 'primary.main',
                color: 'common.white',
                typography: 'subtitle2',
              },
            }}
          />

          <TableBody>
            {tableData.map((row, index) => (
              <RowItem key={row.id || row.name || index} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box sx={{ p: 2, textAlign: 'right' }}>
        <Button size="small" color="inherit" onClick={() => router.push(viewAllPath)} endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} sx={{ ml: -0.5 }} />}>
          View All
        </Button>
      </Box>
    </Card>
  );
}

function RowItem({ row }) {
  const popover = usePopover();

  const isActivityRow = row.action !== undefined && row.detail !== undefined && row.time !== undefined;

  const isDownloadRow = row.downloads !== undefined && row.category !== undefined && row.views === undefined;

  const isRecipeRow = row.views !== undefined && row.country !== undefined && row.category !== undefined;

  const isCountryRow = row.users !== undefined && row.selectionRate !== undefined;

  return (
    <>
      <TableRow hover>
        {isActivityRow && (
          <>
            <TableCell sx={{ fontWeight: 600 }}>{row.action}</TableCell>

            <TableCell
              sx={{
                maxWidth: 280,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {row.detail}
            </TableCell>

            <TableCell>
              <Label variant="soft" color="info">
                {row.time}
              </Label>
            </TableCell>
          </>
        )}

        {isDownloadRow && (
          <>
            <TableCell sx={{ fontWeight: 600 }}>{row.name}</TableCell>

            <TableCell>
              <Label variant="soft" color="info" sx={{ textTransform: 'none' }}>
                {row.category}
              </Label>
            </TableCell>

            <TableCell align="right" sx={{ fontWeight: 600 }}>
              {row.downloads.toLocaleString()}
            </TableCell>
          </>
        )}

        {isRecipeRow && (
          <>
            <TableCell sx={{ fontWeight: 600 }}>{row.name}</TableCell>

            <TableCell>
              <Label variant="soft" color="info" sx={{ textTransform: 'none' }}>
                {row.category}
              </Label>
            </TableCell>

            <TableCell>{row.country}</TableCell>

            <TableCell align="right" sx={{ fontWeight: 600 }}>
              {row.views.toLocaleString()}
            </TableCell>
          </>
        )}

        {isCountryRow && (
          <>
            <TableCell sx={{ fontWeight: 600 }}>{row.name}</TableCell>

            <TableCell align="right">{row.users.toLocaleString()}</TableCell>

            <TableCell align="right">
              <Label variant="soft" color="primary">
                {row.selectionRate}
              </Label>
            </TableCell>
          </>
        )}
      </TableRow>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{
          arrow: { placement: 'right-top' },
        }}
      >
        <MenuList>
          <MenuItem onClick={popover.onClose}>
            <Iconify icon="solar:eye-bold" />
            View Details
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}
