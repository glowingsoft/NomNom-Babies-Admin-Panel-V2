import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { fNumber } from 'src/utils/format-number';

import { ADMIN_ANALYTICS } from 'src/_mock/admin-nomnom';

import { AdminModuleLayout } from '../admin-module-layout';
import { AppWidgetSummary } from 'src/sections/overview/app/app-widget-summary';

// ----------------------------------------------------------------------

export function AdminAnalyticsView() {
  const data = ADMIN_ANALYTICS;

  return (
    <AdminModuleLayout title="Analytics">
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid xs={12} sm={6}>
          <AppWidgetSummary
            title="Trial conversion"
            percent={2.1}
            total={data.trialConversion}
            chart={{ categories: ['W1', 'W2', 'W3', 'W4'], series: [14, 16, 17, 18.4] }}
          />
        </Grid>
        <Grid xs={12} sm={6}>
          <AppWidgetSummary
            title="Engagement rate"
            percent={5.4}
            total={data.engagementRate}
            chart={{ categories: ['W1', 'W2', 'W3', 'W4'], series: [52, 55, 58, 62] }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Top viewed recipes
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Recipe</TableCell>
                  <TableCell>Country</TableCell>
                  <TableCell align="right">Views</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.topRecipes.map((row) => (
                  <TableRow key={row.name} hover>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.country}</TableCell>
                    <TableCell align="right">{fNumber(row.views)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </Grid>
        <Grid xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Most selected countries
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Country</TableCell>
                  <TableCell align="right">Users</TableCell>
                  <TableCell align="right">Share</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.topCountries.map((row) => (
                  <TableRow key={row.name} hover>
                    <TableCell>{row.name}</TableCell>
                    <TableCell align="right">{fNumber(row.users)}</TableCell>
                    <TableCell align="right">{row.selectionRate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </Grid>
      </Grid>
    </AdminModuleLayout>
  );
}
