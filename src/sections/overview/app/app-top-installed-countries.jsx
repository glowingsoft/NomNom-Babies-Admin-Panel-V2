import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { fShortenNumber } from 'src/utils/format-number';

import { Scrollbar } from 'src/components/scrollbar';
import { Iconify, FlagIcon } from 'src/components/iconify';
import { useTheme, alpha } from '@mui/material';

// ----------------------------------------------------------------------

export function AppTopInstalledCountries({ title, icon, subheader, list, ...other }) {
  const theme = useTheme();
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
      />

      <Scrollbar
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
        }}
      >
        <Box
          sx={{
            p: 3,
            gap: 2,
            minWidth: 360,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {list.map((item) => (
            <Item key={item.id} item={item} />
          ))}
        </Box>
      </Scrollbar>
    </Card>
  );
}

// ----------------------------------------------------------------------

function Item({ item, sx, ...other }) {
  return (
    <Box
      sx={{
        gap: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...sx,
      }}
      {...other}
    >
      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle2">{item.name}</Typography>

        <Typography variant="body2" color="text.secondary">
          {item.country}
        </Typography>
      </Box>

      <Box
        sx={{
          gap: 0.5,
          display: 'flex',
          alignItems: 'center',
          typography: 'body2',
          fontWeight: 600,
          color: 'primary.main',
        }}
      >
        <Iconify icon="solar:download-bold" width={16} />
        {fShortenNumber(item.downloads)}
      </Box>
    </Box>
  );
}
