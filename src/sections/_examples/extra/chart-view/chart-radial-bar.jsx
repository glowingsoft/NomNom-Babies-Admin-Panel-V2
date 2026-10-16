import { useTheme } from '@mui/material/styles';

import { fNumber } from 'src/utils/format-number';

import { varAlpha } from 'src/theme/styles';

import { Chart, useChart, ChartLegends } from 'src/components/chart';
import { Stack, Typography } from '@mui/material';

// ----------------------------------------------------------------------

export function ChartRadialBar({ chart, title, subtitle }) {
  const theme = useTheme();

  const chartColors = chart.colors ?? [
    [theme.palette.secondary.light, theme.palette.secondary.main],
    [theme.palette.warning.light, theme.palette.warning.main],
  ];

  const chartOptions = useChart({
    chart: { sparkline: { enabled: true } },
    colors: chartColors.map((color) => color[1]),
    labels: chart.categories,
    stroke: { width: 0 },
    fill: {
      type: 'gradient',
      gradient: {
        colorStops: chartColors.map((color) => [
          {
            offset: 0,
            color: color[0],
            opacity: 1,
          },
          {
            offset: 100,
            color: color[1],
            opacity: 1,
          },
        ]),
      },
    },
    grid: {
      padding: {
        top: -40,
        bottom: -40,
      },
    },
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 14,
          size: '32%',
        },
        track: {
          margin: 14,
          background: varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
        },
        dataLabels: {
          total: { formatter: () => fNumber(2324) },
          value: {
            offsetY: 2,
            fontSize: theme.typography.h5.fontSize,
          },
          name: { offsetY: -10 },
        },
      },
    },
  });

  return (
    <>
      {(title || subtitle) && (
        <Stack spacing={0.5} sx={{ mb: 3 }}>
          {title && <Typography variant="h6">{title}</Typography>}
          {subtitle && (
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
              {subtitle}
            </Typography>
          )}
        </Stack>
      )}
      <ChartLegends
        labels={chartOptions?.labels}
        colors={chartOptions?.colors}
        sx={{
          px: 0,
          pt: 1,
          pb: 0,
          justifyContent: 'flex-start',
        }}
      />

      <Chart type="radialBar" series={chart.series} options={chartOptions} height={400} sx={{ width: 1 }} />
    </>
  );
}
