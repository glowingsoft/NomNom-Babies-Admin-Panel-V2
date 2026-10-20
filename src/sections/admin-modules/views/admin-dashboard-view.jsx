import { useEffect } from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { Chart, useChart } from 'src/components/chart';
import { SeoIllustration } from 'src/assets/illustrations';
import { DashboardContent } from 'src/layouts/dashboard';
import { AppWidget } from 'src/sections/overview/app/app-widget';
import { AppWelcome } from 'src/sections/overview/app/app-welcome';
import { CourseWidgetSummary } from 'src/sections/overview/course/course-widget-summary';
import { AdminDashboardPanel } from '../components/admin-dashboard-panel';
import { ChartRadialBar } from 'src/sections/_examples/extra/chart-view/chart-radial-bar';
import { AppNewInvoice } from 'src/sections/overview/app/app-new-invoice';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import { fNumber } from 'src/utils/format-number';
import { fDateTime } from 'src/utils/format-time';

import { toast } from 'src/components/snackbar';
import { useGetDashboardQuery } from 'src/store/Reducer/dashboard';

export function AdminDashboardView() {
  const router = useRouter();
  const theme = useTheme();

  const { data: dashboardRes, isFetching: isLoading } = useGetDashboardQuery({ topN: 5, limit: 5 });
  const dashboard = dashboardRes?.data || {};

  const failedSections = Object.keys(dashboard.errors || {}).join(', ');
  useEffect(() => {
    if (failedSections) toast.warning(`Some dashboard sections failed to load: ${failedSections}`);
  }, [failedSections]);

  // Sections that failed on the server come back null (see dashboard.errors); fall back to empty values.
  const widgets = dashboard.widgets || {};
  const userStatus = dashboard.userStatus || { active: 0, inactive: 0, suspended: 0, total: 0 };
  const health = dashboard.platformHealth || { countriesRate: 0, ageGroupsRate: 0, recipesRate: 0 };
  const growth = dashboard.growthTrend || { months: [], series: [] };
  const countryGrowth = dashboard.countryGrowth || { months: [], series: [] };
  const activities = dashboard.recentActivities || [];
  const topDownloads = dashboard.topDownloadedRecipes || [];
  const topRecipes = dashboard.topRecipes || [];
  const topCountries = dashboard.topCountries || [];
  const appDownloads = dashboard.appDownloads || { android: 0, ios: 0, total: 0 };
  const growthSeries = structuredClone(growth.series ?? []);
  const countrySeries = structuredClone(countryGrowth.series ?? []);

  // Header widgets
  const activeUserPct = widgets.totalUsers > 0 ? Math.round((widgets.activeUsers / widgets.totalUsers) * 100) : 0;

  const totalUsersDonut = userStatus.total ?? userStatus.active + userStatus.inactive + userStatus.suspended;
  const suspendedPct = totalUsersDonut > 0 ? Math.round((userStatus.suspended / totalUsersDonut) * 100) : 0;

  const totalAppDownloadsDonut = appDownloads.total ?? appDownloads.android + appDownloads.ios;

  // Platform health radial
  const healthRadialColors = [
    [theme.vars.palette.primary.light, theme.vars.palette.primary.main],
    [theme.vars.palette.success.light, theme.vars.palette.success.main],
    [theme.vars.palette.warning.light, theme.vars.palette.warning.main],
  ];

  // USer Status Donut
  const donutColors = [theme.vars.palette.success.main, theme.vars.palette.error.main, theme.vars.palette.warning.main];
  const donutOptions = useChart({
    colors: donutColors,
    labels: ['Active', 'Suspended', 'Inactive'],
    legend: { show: false },
    stroke: { width: 0 },
    tooltip: { fillSeriesColor: false },
    plotOptions: {
      pie: {
        donut: {
          size: '72%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              formatter: () => `${totalUsersDonut}`,
              fontSize: theme.typography.h3.fontSize,
              fontWeight: theme.typography.h3.fontWeight,
              color: theme.palette.text.primary,
            },
            value: {
              show: true,
              fontSize: theme.typography.h4.fontSize,
              fontWeight: theme.typography.h4.fontWeight,
              color: theme.palette.text.primary,
              offsetY: 8,
            },
          },
        },
      },
    },
  });

  // App downloads donut
  const appDownloadsColors = [theme.vars.palette.success.main, theme.vars.palette.info.main];
  const appDownloadsDonutOptions = useChart({
    colors: appDownloadsColors,
    labels: ['Android', 'iOS'],
    legend: { show: false },
    stroke: { width: 0 },
    tooltip: { fillSeriesColor: false },
    plotOptions: {
      pie: {
        donut: {
          size: '72%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              formatter: () => `${totalAppDownloadsDonut}`,
              fontSize: theme.typography.h3.fontSize,
              fontWeight: theme.typography.h3.fontWeight,
              color: theme.palette.text.primary,
            },
            value: {
              show: true,
              fontSize: theme.typography.h4.fontSize,
              fontWeight: theme.typography.h4.fontWeight,
              color: theme.palette.text.primary,
              offsetY: 8,
            },
          },
        },
      },
    },
  });

  // Platform growth bar chart
  const trendChartOptions = useChart({
    colors: [theme.vars.palette.primary.main, theme.vars.palette.primary.light, theme.vars.palette.info.main],
    xaxis: { categories: growth.months, tickPlacement: 'on' },
    yaxis: { min: 0, labels: { formatter: (v) => `${Math.round(v)}` } },
    legend: { show: true, position: 'top', horizontalAlign: 'left' },
    tooltip: { shared: true, intersect: false },
    stroke: { width: 0 },
    chart: { stacked: false },
    plotOptions: { bar: { columnWidth: '72%', borderRadius: 5 } },
  });

  // Country user growth line chart
  const countryLineColors = [
    theme.vars.palette.primary.main,
    theme.vars.palette.info.main,
    theme.vars.palette.success.main,
    theme.vars.palette.warning.main,
    theme.vars.palette.error.main,
  ];
  const countryLineOptions = useChart({
    colors: countryLineColors,
    xaxis: { categories: countryGrowth.months },
    yaxis: { min: 0, labels: { formatter: (v) => `${Math.round(v)}` } },
    legend: { show: true, position: 'top', horizontalAlign: 'left' },
    tooltip: { shared: true, intersect: false },
    stroke: { width: 2, curve: 'smooth' },
    markers: { size: 4 },
  });

  const CHART_HEIGHT = { height: { xs: 'auto', lg: 520 } };

  const WidgetCard = ({ children, path }) => (
    <Box
      onClick={() => router.push(path)}
      sx={{
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        borderRadius: 2,
        '&:hover': { transform: 'translateY(-6px)', boxShadow: (t) => t.shadows[10] },
        '&:active': { transform: 'translateY(-2px)' },
      }}
    >
      {children}
    </Box>
  );

  const activityRows = activities.map((a) => ({
    id: a._id,
    action: a.action,
    detail: a.detail,
    time: fDateTime(a.createdAt),
  }));

  const mealTypeName = (mealType) => {
    if (!mealType) return '—';
    if (typeof mealType === 'string') return mealType;
    return mealType.name || '—';
  };

  const downloadRows = topDownloads.map((r) => ({
    id: r.recipeId,
    name: r.title || 'Untitled recipe',
    category: mealTypeName(r.mealType),
    downloads: r.downloads ?? 0,
  }));

  const recipeRows = topRecipes.map((r) => ({
    id: r._id,
    name: r.title,
    category: mealTypeName(r.mealType),
    country: r.country?.name || '—',
    views: r.views ?? 0,
  }));

  const countryRows = topCountries.map((c) => ({
    id: c.countryId,
    name: c.name,
    users: c.users,
    selectionRate: `${c.selectionRate}%`,
  }));

  return (
    <DashboardContent maxWidth="xl">
      {isLoading && <LinearProgress sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: theme.zIndex.appBar + 1 }} />}

      <Grid container spacing={3} alignItems="flex-start">
        {/* ── Welcome + widgets ──────────────────────────────────────────── */}
        <Grid xs={12} md={8}>
          <AppWelcome
            title={`NomNom Babies\nAdmin overview`}
            description="Track users, active countries, recipes, downloads, and caregiver engagement — all in one place."
            img={<SeoIllustration hideBackground />}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column', height: 1 }}>
            <AppWidget title="Active users" total={widgets.activeUsers || 0} icon="solar:users-group-rounded-bold" chart={{ series: activeUserPct }} />
            <AppWidget
              title="Suspended users"
              total={userStatus.suspended || 0}
              icon="solar:shield-warning-bold"
              chart={{ series: suspendedPct, colors: [theme.vars.palette.error.light, theme.vars.palette.error.main] }}
              sx={{ bgcolor: 'error.dark' }}
            />
          </Box>
        </Grid>

        {/* ── Stat cards ─────────────────────────────────────────────────── */}
        <Grid xs={12} sm={6} md={3}>
          <WidgetCard path={paths.adminDashboard.user.list}>
            <CourseWidgetSummary title="Total users" icon="../../../assets/icons/navbar/ic-user.svg" total={widgets.totalUsers || 0} />
          </WidgetCard>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <WidgetCard path={paths.adminDashboard.modules.countries}>
            <CourseWidgetSummary title="Active countries" icon="../../../assets/icons/navbar/ic-country.svg" total={widgets.activeCountries || 0} />
          </WidgetCard>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <WidgetCard path={paths.adminDashboard.modules.recipes}>
            <CourseWidgetSummary title="Recipes" icon="../../../assets/icons/navbar/ic-recipe.svg" total={widgets.totalRecipes || 0} />
          </WidgetCard>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <WidgetCard path={paths.adminDashboard.modules.resources}>
            <CourseWidgetSummary title="Downloaded resources" icon="../../../assets/icons/navbar/ic-resources.svg" total={widgets.downloadedResources || 0} />
          </WidgetCard>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <WidgetCard path={paths.adminDashboard.modules.recipes}>
            <CourseWidgetSummary title="Published Recipes" icon="../../../assets/icons/navbar/ic-invoice.svg" total={widgets.publishedRecipes || 0} />
          </WidgetCard>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <WidgetCard path={paths.adminDashboard.content.support}>
            <CourseWidgetSummary title="Open tickets" icon="../../../assets/icons/navbar/ic-mail.svg" total={widgets.openSupportTickets || 0} />
          </WidgetCard>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <WidgetCard path={paths.adminDashboard.modules.ageGroups}>
            <CourseWidgetSummary title="Age groups" icon="../../../assets/icons/navbar/ic-calendar.svg" total={widgets.totalAgeGroups || 0} />
          </WidgetCard>
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <WidgetCard path={paths.adminDashboard.modules.nutritionTags}>
            <CourseWidgetSummary title="Nutrition tags" icon="../../../assets/icons/navbar/ic-label.svg" total={widgets.totalNutritionTags || 0} />
          </WidgetCard>
        </Grid>

        {/* ── App downloads ──────────────────────────────────────────────── */}
        <Grid xs={12}>
          <AdminDashboardPanel
            title="App downloads"
            subtitle="Unique devices registered per platform"
            icon="solar:smartphone-2-bold"
            contentSx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', py: 2 }}
          >
            <Stack direction="row" spacing={3} alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
              <Stack direction="row" spacing={3}>
                {[
                  { label: 'Android', color: appDownloadsColors[0], value: appDownloads.android },
                  { label: 'iOS', color: appDownloadsColors[1], value: appDownloads.ios },
                ].map(({ label, color, value }) => (
                  <Stack key={label} direction="row" alignItems="center" spacing={0.75}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color, flexShrink: 0 }} />
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      {label} ({fNumber(value)})
                    </Typography>
                  </Stack>
                ))}
              </Stack>

              <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                Total: {fNumber(appDownloads.total)}
              </Typography>
            </Stack>
            <Chart key={totalAppDownloadsDonut} type="donut" series={[appDownloads.android, appDownloads.ios]} options={appDownloadsDonutOptions} height={320} sx={{ width: 1 }} />
          </AdminDashboardPanel>
        </Grid>

        {/* ── Row 1: Platform health | User status ───────────────────────── */}
        <Grid xs={12} md={6}>
          <Box sx={CHART_HEIGHT}>
            <AdminDashboardPanel title="Platform health" subtitle="Active countries, age groups & published recipes" icon="solar:pulse-bold" sx={{ height: '100%' }}>
              <ChartRadialBar
                chart={{
                  categories: ['Countries', 'Age groups', 'Recipes'],
                  series: [health.countriesRate, health.ageGroupsRate, health.recipesRate],
                  colors: healthRadialColors,
                }}
              />
            </AdminDashboardPanel>
          </Box>
        </Grid>

        <Grid xs={12} md={6}>
          <Box sx={CHART_HEIGHT}>
            <AdminDashboardPanel
              title="User status"
              subtitle="Breakdown of active, inactive and suspended users"
              icon="solar:users-group-rounded-bold"
              sx={{ height: '100%' }}
              contentSx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', py: 2 }}
            >
              <Stack direction="row" spacing={3} alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                <Stack direction="row" spacing={3}>
                  {[
                    { label: 'Active', color: donutColors[0] },
                    { label: 'Suspended', color: donutColors[1] },
                    { label: 'Inactive', color: donutColors[2] },
                  ].map(({ label, color }) => (
                    <Stack key={label} direction="row" alignItems="center" spacing={0.75}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color, flexShrink: 0 }} />
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {label}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>

                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  Total: {totalUsersDonut}
                </Typography>
              </Stack>
              <Chart
                key={totalUsersDonut}
                type="donut"
                series={[userStatus.active, userStatus.suspended, userStatus.inactive]}
                options={donutOptions}
                height={400}
                sx={{ width: 1 }}
              />
            </AdminDashboardPanel>
          </Box>
        </Grid>

        {/* ── Row 2: Platform growth | User growth by country ────────────── */}
        <Grid xs={12} md={6}>
          <Box sx={CHART_HEIGHT}>
            <AdminDashboardPanel
              title="Platform growth"
              subtitle="Users, recipes, and downloads over 6 months"
              icon="solar:chart-square-bold"
              sx={{ height: '100%' }}
              contentSx={{ px: { xs: 1, md: 1.5 }, py: 1.5 }}
            >
              <Chart type="bar" series={growthSeries} options={trendChartOptions} height={360} sx={{ px: 0.5 }} />
            </AdminDashboardPanel>
          </Box>
        </Grid>

        <Grid xs={12} md={6}>
          <Box sx={CHART_HEIGHT}>
            <AdminDashboardPanel
              title="User growth by country"
              subtitle="Monthly active users across top countries"
              icon="solar:global-bold"
              sx={{ height: '100%' }}
              contentSx={{ px: { xs: 1.25, md: 2 }, py: 1.75 }}
            >
              <Chart type="line" series={countrySeries} options={countryLineOptions} height={360} sx={{ px: { xs: 0.25, md: 0.75 }, pb: { xs: 0.25, md: 0.5 } }} />
            </AdminDashboardPanel>
          </Box>
        </Grid>

        {/* ── Tables ─────────────────────────────────────────────────────── */}
        <Grid xs={12} md={6}>
          <Box sx={{ height: { xs: 550, lg: 520 } }}>
            <AppNewInvoice
              title="Recent Activities"
              subheader="Latest admin actions"
              icon="solar:history-bold"
              tableData={activityRows}
              headLabel={[{ id: 'action', label: 'Action' }, { id: 'detail', label: 'Detail' }, { id: 'time', label: 'Time' }, { id: '' }]}
              viewAllPath={paths.adminDashboard.modules.activities}
            />
          </Box>
        </Grid>

        <Grid xs={12} md={6}>
          <Box sx={{ height: { xs: 550, lg: 520 } }}>
            <AppNewInvoice
              title="Top downloaded recipes"
              subheader="Most downloaded recipe PDFs"
              icon="solar:download-bold"
              tableData={downloadRows}
              headLabel={[{ id: 'name', label: 'Recipe' }, { id: 'category', label: 'Meal Type' }, { id: 'downloads', label: 'Downloads', align: 'right' }, { id: '' }]}
              viewAllPath={paths.adminDashboard.modules.recipes}
            />
          </Box>
        </Grid>

        <Grid xs={12} md={6}>
          <Box sx={{ height: { xs: 550, lg: 520 } }}>
            <AppNewInvoice
              title="Top viewed recipes"
              subheader="Includes top first-food recipes such as Banana & Apple Puree"
              icon="solar:chef-hat-bold"
              tableData={recipeRows}
              headLabel={[
                { id: 'name', label: 'Recipe' },
                { id: 'Meal Type', label: 'Meal Type' },
                { id: 'country', label: 'Country' },
                { id: 'views', label: 'Views', align: 'right' },
                { id: '' },
              ]}
              viewAllPath={paths.adminDashboard.modules.recipes}
            />
          </Box>
        </Grid>

        <Grid xs={12} md={6}>
          <Box sx={{ height: { xs: 550, lg: 520 } }}>
            <AppNewInvoice
              title="Most selected countries"
              subheader="Food cultures chosen by caregivers"
              icon="solar:global-bold"
              tableData={countryRows}
              headLabel={[{ id: 'name', label: 'Country' }, { id: 'users', label: 'Users', align: 'right' }, { id: 'selectionRate', label: 'Share', align: 'right' }, { id: '' }]}
              viewAllPath={paths.adminDashboard.modules.countries}
            />
          </Box>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
