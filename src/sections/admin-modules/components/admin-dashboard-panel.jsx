import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TableContainer from '@mui/material/TableContainer';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { varAlpha } from 'src/theme/styles';


export function AdminDashboardPanel({
  title,
  subtitle,
  icon,
  children,
  action,
  fillHeight = false,
  sx,
  contentSx,
}) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        ...(fillHeight && { height: 1 }),
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: `1px solid ${varAlpha(theme.vars.palette.primary.mainChannel, 0.12)}`,
        boxShadow: theme.customShadows.card,
        ...sx,
      }}
    >
      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
        spacing={2}
        sx={{
          px: 2.5,
          pt: 2.5,
          pb: subtitle ? 1.5 : 2,
          borderBottom: `1px solid ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)}`,
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ minWidth: 0 }}>
          {icon && (
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
          )}
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" sx={{ lineHeight: 1.35 }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        </Stack>
        {action}
      </Stack>

      <Box sx={{ ...(fillHeight && { flex: 1 }), px: 2.5, py: 2, ...contentSx }}>{children}</Box>
    </Card>
  );
}

AdminDashboardPanel.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  icon: PropTypes.string,
  children: PropTypes.node,
  action: PropTypes.node,
  fillHeight: PropTypes.bool,
  sx: PropTypes.object,
  contentSx: PropTypes.object,
};


export function DashboardTableCard({
  title,
  subtitle,
  icon,
  fillHeight = false,
  tableMinWidth = 520,
  mobileContent,
  children,
  contentSx,
}) {
  return (
    <AdminDashboardPanel
      title={title}
      subtitle={subtitle}
      icon={icon}
      fillHeight={fillHeight}
      contentSx={{ py: 1.5, px: { xs: 2, sm: 1.5 }, ...contentSx }}
    >
      {mobileContent ? (
        <>
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>{mobileContent}</Box>
          <TableContainer
            sx={{
              display: { xs: 'none', md: 'block' },
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch',
              mx: { md: -0.5 },
            }}
          >
            <Box component="div" sx={{ minWidth: tableMinWidth }}>
              {children}
            </Box>
          </TableContainer>
        </>
      ) : (
        <TableContainer
          sx={{
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            mx: { xs: -0.5, sm: 0 },
          }}
        >
          <Box component="div" sx={{ minWidth: tableMinWidth }}>
            {children}
          </Box>
        </TableContainer>
      )}
    </AdminDashboardPanel>
  );
}

DashboardTableCard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  icon: PropTypes.string,
  fillHeight: PropTypes.bool,
  tableMinWidth: PropTypes.number,
  mobileContent: PropTypes.node,
  children: PropTypes.node,
  contentSx: PropTypes.object,
};


function MobileListShell({ children }) {
  const theme = useTheme();
  const borderColor = varAlpha(theme.vars.palette.grey['500Channel'], 0.16);

  return (
    <Stack divider={<Box sx={{ borderBottom: `1px solid ${borderColor}` }} />} spacing={0}>
      {children}
    </Stack>
  );
}

MobileListShell.propTypes = {
  children: PropTypes.node,
};


export function AdminDashboardActivityMobileList({ rows }) {
  return (
    <MobileListShell>
      {rows.map((row) => (
        <Box key={row.id} sx={{ py: 1.75 }}>
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1.5}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, flex: 1, minWidth: 0 }}>
              {row.action}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', flexShrink: 0, pt: 0.25 }}>
              {row.time}
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, lineHeight: 1.5 }}>
            {row.detail}
          </Typography>
        </Box>
      ))}
    </MobileListShell>
  );
}

AdminDashboardActivityMobileList.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      action: PropTypes.string,
      detail: PropTypes.string,
      time: PropTypes.string,
    })
  ).isRequired,
};


export function AdminDashboardDownloadsMobileList({ rows }) {
  const theme = useTheme();

  return (
    <MobileListShell>
      {rows.map((row, index) => (
        <Stack
          key={row.id}
          direction="row"
          spacing={1.5}
          alignItems="flex-start"
          sx={{
            py: 1.75,
            transition: theme.transitions.create('background-color'),
          }}
        >
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              typography: 'caption',
              fontWeight: 700,
              flexShrink: 0,
              ...(index === 0 && {
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
              }),
              ...(index === 1 && {
                bgcolor: 'info.lighter',
                color: 'info.dark',
              }),
              ...(index >= 2 && {
                bgcolor: 'action.hover',
                color: 'text.secondary',
              }),
            }}
          >
            {index + 1}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" sx={{ lineHeight: 1.45 }}>
              {row.name}
            </Typography>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={1}
              sx={{ mt: 1 }}
            >
              <Label variant="soft" color="default" sx={{ textTransform: 'none' }}>
                {row.country}
              </Label>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {row.downloadsLabel ?? row.downloads}
              </Typography>
            </Stack>
          </Box>
        </Stack>
      ))}
    </MobileListShell>
  );
}

AdminDashboardDownloadsMobileList.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string,
      country: PropTypes.string,
      downloads: PropTypes.number,
      downloadsLabel: PropTypes.string,
    })
  ).isRequired,
};


export function AdminDashboardRankList({ items, dividerColor }) {
  const theme = useTheme();
  const borderColor = dividerColor ?? varAlpha(theme.vars.palette.grey['500Channel'], 0.16);

  return (
    <Stack
      divider={<Box sx={{ borderBottom: `1px solid ${borderColor}` }} />}
      spacing={0}
    >
      {items}
    </Stack>
  );
}

AdminDashboardRankList.propTypes = {
  items: PropTypes.node,
  dividerColor: PropTypes.string,
};


export function AdminDashboardRankRow({ rank, title, meta = [], titleSx }) {
  const theme = useTheme();

  return (
    <Stack
      direction="row"
      spacing={1.5}
      alignItems="flex-start"
      sx={{
        py: 1.5,
        transition: theme.transitions.create('background-color'),
        '&:hover': {
          bgcolor: varAlpha(theme.vars.palette.primary.mainChannel, 0.04),
        },
      }}
    >
      <RankBadge rank={rank} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="subtitle2" sx={{ wordBreak: 'break-word', ...titleSx }}>
          {title}
        </Typography>
        {!!meta.length && (
          <Stack spacing={0.75} sx={{ mt: 1 }}>
            {meta.map((item) => (
              <Stack
                key={item.label}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={1}
                sx={{ flexWrap: 'wrap', gap: 0.5 }}
              >
                <Typography variant="caption" color="text.secondary">
                  {item.label}
                </Typography>
                {item.chip ? (
                  item.chip
                ) : (
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 600,
                      color: item.highlight ? 'primary.main' : 'text.primary',
                    }}
                  >
                    {item.value}
                  </Typography>
                )}
              </Stack>
            ))}
          </Stack>
        )}
      </Box>
    </Stack>
  );
}

AdminDashboardRankRow.propTypes = {
  rank: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  meta: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      highlight: PropTypes.bool,
      chip: PropTypes.node,
    })
  ),
  titleSx: PropTypes.object,
};


function RankBadge({ rank }) {
  return (
    <Box
      sx={{
        width: 28,
        height: 28,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        typography: 'caption',
        fontWeight: 700,
        flexShrink: 0,
        ...(rank === 1 && {
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
        }),
        ...(rank === 2 && {
          bgcolor: 'info.lighter',
          color: 'info.dark',
        }),
        ...(rank >= 3 && {
          bgcolor: 'action.hover',
          color: 'text.secondary',
        }),
      }}
    >
      {rank}
    </Box>
  );
}


export function AdminDashboardSectionHeader({ title, subtitle, icon = 'solar:chart-2-bold' }) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        p: 2.5,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        border: `1px solid ${varAlpha(theme.vars.palette.primary.mainChannel, 0.12)}`,
        background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, transparent 55%)`,
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 2,
          color: 'primary.main',
          bgcolor: alpha(theme.palette.primary.main, 0.12),
        }}
      >
        <Iconify icon={icon} width={26} />
      </Box>
      <Box>
        <Typography variant="h5">{title}</Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Card>
  );
}

AdminDashboardSectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  icon: PropTypes.string,
};
