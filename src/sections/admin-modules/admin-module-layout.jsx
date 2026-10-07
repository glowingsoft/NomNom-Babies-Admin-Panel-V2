import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';


export function AdminModuleLayout({
  title,
  links,
  actionLabel,
  onAction,
  children,
  maxWidth = 'xl',
  breadcrumbsSx,
  headerCardSx,
}) {
  const breadcrumbLinks = links ?? [
    { name: 'Dashboard', href: paths.adminDashboard.root },
    { name: title },
  ];

  return (
    <DashboardContent maxWidth={maxWidth}>
      <Card
        sx={{
          p: { xs: 2, md: 2.5 },
          mb: { xs: 2, md: 3 },
          bgcolor: 'background.paper',
          ...headerCardSx,
        }}
      >
        <CustomBreadcrumbs
          heading={title}
          links={breadcrumbLinks}
          slotProps={{
            heading: {
              mb: { xs: 1.25, md: 2 },
              fontSize: { xs: '1.9rem', sm: '2.1rem', md: '2.25rem' },
              lineHeight: 1.2,
            },
            action: {
              width: { xs: 1, sm: 'auto' },
            },
          }}
          action={
            actionLabel ? (
              <Button
                variant="contained"
                color="primary"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={onAction}
                sx={{ width: { xs: 1, sm: 'auto' } }}
              >
                {actionLabel}
              </Button>
            ) : null
          }
          sx={{
            mb: 0,
            '& > .MuiStack-root:first-of-type': {
              flexWrap: { xs: 'wrap', sm: 'nowrap' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              rowGap: 1.5,
            },
            ...breadcrumbsSx,
          }}
        />
      </Card>

      {children}
    </DashboardContent>
  );
}

AdminModuleLayout.propTypes = {
  title: PropTypes.string.isRequired,
  links: PropTypes.array,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func,
  children: PropTypes.node,
  maxWidth: PropTypes.string,
  breadcrumbsSx: PropTypes.object,
  headerCardSx: PropTypes.object,
};
