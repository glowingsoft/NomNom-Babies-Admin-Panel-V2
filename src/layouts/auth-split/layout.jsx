import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import { paths } from 'src/routes/paths';
import { useBoolean } from 'src/hooks/use-boolean';
import { CONFIG } from 'src/config-global';
import { Logo } from 'src/components/logo';
import loginIllustration from 'src/assets/illustrations/login.svg';
import { getAdminDashboardBackgroundSx } from 'src/theme/admin-theme/admin-theme-background';

import { NOMNOM_AUTH_SECTION } from './nomnom-auth-content';
import { Section } from './section';
import { Main, Content } from './main';
import { HeaderBase } from '../core/header-base';
import { LayoutSection } from '../core/layout-section';

const nomnomAuthShellBg = getAdminDashboardBackgroundSx();


export function AuthSplitLayout({ sx, section, branding, children }) {
  const mobileNavOpen = useBoolean();

  const layoutQuery = 'md';
  const isNomnom = branding === 'nomnom';

  const sectionTitle = isNomnom ? section?.title ?? NOMNOM_AUTH_SECTION.title : section?.title;
  const sectionSubtitle = isNomnom
    ? section?.subtitle ?? NOMNOM_AUTH_SECTION.subtitle
    : section?.subtitle;

  return (
    <LayoutSection
      headerSection={
        <HeaderBase
          disableElevation
          disableOffset={isNomnom}
          color={isNomnom ? 'transparent' : undefined}
          elevation={isNomnom ? 0 : undefined}
          layoutQuery={layoutQuery}
          onOpenNav={mobileNavOpen.onTrue}
          slotsDisplay={{
            signIn: false,
            account: false,
            purchase: false,
            contacts: false,
            searchbar: false,
            workspaces: false,
            menuButton: false,
            localization: false,
            notifications: false,
            helpLink: !isNomnom,
          }}
          slots={{
            topArea: (
              <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
                This is an info Alert.
              </Alert>
            ),
            rightAreaEnd: null,
          }}
          slotProps={{
            container: {
              maxWidth: false,
              ...(isNomnom && {
                sx: {
                  pt: 2.5,
                  pb: 1,
                  alignItems: 'flex-start',
                },
              }),
            },
            ...(isNomnom && {
              toolbar: {
                sx: {
                  bgcolor: 'transparent',
                  color: 'text.primary',
                  minHeight: 'auto',
                  height: 'auto',
                },
              },
            }),
          }}
          sx={{
            position: { [layoutQuery]: 'fixed' },
            ...(isNomnom && {
              ...nomnomAuthShellBg,
              color: 'text.primary',
              boxShadow: 'none',
              '[data-slot="logo"]': { display: 'none' },
            }),
          }}
        />
      }
      footerSection={null}
      sx={{
        ...(isNomnom && {
          minHeight: '100vh',
          ...nomnomAuthShellBg,
        }),
        ...sx,
      }}
      cssVars={{
        '--layout-auth-content-width': '420px',
      }}
    >
      <Main layoutQuery={layoutQuery}>
        <Section
          title={sectionTitle}
          layoutQuery={layoutQuery}
          imgUrl={section?.imgUrl}
          method={CONFIG.auth.method}
          subtitle={sectionSubtitle}
          logo={isNomnom ? <Logo /> : undefined}
          illustration={
            isNomnom ? (
              <Box
                component="img"
                src={loginIllustration}
                alt="Login illustration"
                sx={{ width: 1, maxWidth: 300, mx: 'auto' }}
              />
            ) : undefined
          }
          hideAuthMethods={isNomnom}
          plainBackground={isNomnom}
          methods={
            isNomnom
              ? undefined
              : [
                  {
                    label: 'Jwt',
                    path: paths.auth.jwt.signIn,
                    icon: `${CONFIG.site.basePath}/assets/icons/platforms/ic-jwt.svg`,
                  },
                  {
                    label: 'Firebase',
                    path: paths.auth.firebase.signIn,
                    icon: `${CONFIG.site.basePath}/assets/icons/platforms/ic-firebase.svg`,
                  },
                  {
                    label: 'Amplify',
                    path: paths.auth.amplify.signIn,
                    icon: `${CONFIG.site.basePath}/assets/icons/platforms/ic-amplify.svg`,
                  },
                  {
                    label: 'Auth0',
                    path: paths.auth.auth0.signIn,
                    icon: `${CONFIG.site.basePath}/assets/icons/platforms/ic-auth0.svg`,
                  },
                  {
                    label: 'Supabase',
                    path: paths.auth.supabase.signIn,
                    icon: `${CONFIG.site.basePath}/assets/icons/platforms/ic-supabase.svg`,
                  },
                ]
          }
        />
        <Content
          layoutQuery={layoutQuery}
          sx={
            isNomnom
              ? {
                  py: { xs: 1.5, sm: 3 },
                  justifyContent: 'center',
                }
              : undefined
          }
        >
          {children}
        </Content>
      </Main>
    </LayoutSection>
  );
}
