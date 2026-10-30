import { lazy, Suspense } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

import { MainLayout } from 'src/layouts/main';

import { SplashScreen } from 'src/components/loading-screen';

import { GuestGuard } from 'src/auth/guard';
import { RedirectIfLoggedIn } from 'src/auth/guard/custom-auth-guard';
import { AuthSplitLayout } from 'src/layouts/auth-split';
import { adminDashboardRoutes } from './admin-dashboard';
import { authRoutes } from './auth';
import { authDemoRoutes } from './auth-demo';
import { componentsRoutes } from './components';
import { dashboardRoutes } from './dashboard';
import { mainRoutes } from './main';

// ----------------------------------------------------------------------

const named = (load, name) => lazy(() => load().then((m) => ({ default: m[name] })));

const Landing = {
  Home: named(() => import('src/sections/landing/landing-view'), 'LandingView'),
  Legal: named(() => import('src/sections/landing/legal-view'), 'LegalView'),
  Contact: named(() => import('src/sections/landing/contact-view'), 'ContactView'),
  DeleteAccount: named(() => import('src/sections/landing/delete-account-view'), 'DeleteAccountView'),
};

const PublicPage = ({ children }) => <Suspense fallback={<SplashScreen />}>{children}</Suspense>;

const Jwt = {
  SignInPage: lazy(() => import('src/pages/auth/jwt/sign-in')),
  SignUpPage: lazy(() => import('src/pages/auth/jwt/sign-up')),
};

export function Router() {
  return useRoutes([
    // Public website (landing + pages linked from the app stores)
    {
      path: '/',
      element: (
        <RedirectIfLoggedIn>
          <PublicPage><Landing.Home /></PublicPage>
        </RedirectIfLoggedIn>
      ),
    },
    { path: '/about', element: <PublicPage><Landing.Legal page="about" /></PublicPage> },
    { path: '/privacy-policy', element: <PublicPage><Landing.Legal page="privacy" /></PublicPage> },
    { path: '/terms', element: <PublicPage><Landing.Legal page="terms" /></PublicPage> },
    { path: '/contact', element: <PublicPage><Landing.Contact /></PublicPage> },
    { path: '/delete-account', element: <PublicPage><Landing.DeleteAccount /></PublicPage> },

    // Admin sign-in — not linked from the public site.
    {
      path: '/admin',
      element: (
        <RedirectIfLoggedIn>
          <GuestGuard>
            <AuthSplitLayout branding="nomnom">
              <Jwt.SignInPage />
            </AuthSplitLayout>
          </GuestGuard>
        </RedirectIfLoggedIn>
      ),
    },

    // Auth
    ...authRoutes,
    ...authDemoRoutes,

    // Dashboard
    ...dashboardRoutes,

    // Admin Dashboard
    ...adminDashboardRoutes,

    // Main
    ...mainRoutes,

    // Components
    ...componentsRoutes,

    // No match
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
