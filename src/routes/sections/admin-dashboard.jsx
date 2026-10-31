import { lazy, Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';
import ProtectedRoute from 'src/auth/guard/custom-auth-guard';
import { Box, LinearProgress } from '@mui/material';

const AdminDashboardPage = lazy(() => import('src/pages/dashboard/admin').then((m) => ({ default: m.AdminDashboardPage })));
const OverviewEcommercePage = lazy(() => import('src/pages/dashboard/ecommerce'));
const OverviewBankingPage = lazy(() => import('src/pages/dashboard/active-routes/banking'));
const OverviewBookingPage = lazy(() => import('src/pages/dashboard/booking'));
const OverviewFilePage = lazy(() => import('src/pages/dashboard/file'));
const OverviewCoursePage = lazy(() => import('src/pages/dashboard/course'));
const ProductDetailsPage = lazy(() => import('src/pages/dashboard/product/details'));
const ProductListPage = lazy(() => import('src/pages/dashboard/product/list'));
const ProductCreatePage = lazy(() => import('src/pages/dashboard/product/new'));
const ProductEditPage = lazy(() => import('src/pages/dashboard/product/edit'));
const OrderListPage = lazy(() => import('src/pages/dashboard/order/list'));
const OrderDetailsPage = lazy(() => import('src/pages/dashboard/order/details'));
const InvoiceListPage = lazy(() => import('src/pages/dashboard/invoice/list'));
const InvoiceDetailsPage = lazy(() => import('src/pages/dashboard/invoice/details'));
const InvoiceCreatePage = lazy(() => import('src/pages/dashboard/invoice/new'));
const InvoiceEditPage = lazy(() => import('src/pages/dashboard/invoice/edit'));
const UserProfilePage = lazy(() => import('src/pages/dashboard/user/profile'));
const UserCardsPage = lazy(() => import('src/pages/dashboard/user/cards'));
const AdminAccountPage = lazy(() => import('src/pages/dashboard/admin').then((m) => ({ default: m.AdminAccountPage })));
const UserCreatePage = lazy(() => import('src/pages/dashboard/user/new'));
const UserEditPage = lazy(() => import('src/pages/dashboard/user/edit'));
const BlogPostsPage = lazy(() => import('src/pages/dashboard/post/list'));
const BlogPostPage = lazy(() => import('src/pages/dashboard/post/details'));
const BlogNewPostPage = lazy(() => import('src/pages/dashboard/post/new'));
const BlogEditPostPage = lazy(() => import('src/pages/dashboard/post/edit'));
const JobDetailsPage = lazy(() => import('src/pages/dashboard/job/details'));
const JobListPage = lazy(() => import('src/pages/dashboard/job/list'));
const JobCreatePage = lazy(() => import('src/pages/dashboard/job/new'));
const JobEditPage = lazy(() => import('src/pages/dashboard/job/edit'));
const TourDetailsPage = lazy(() => import('src/pages/dashboard/tour/details'));
const TourListPage = lazy(() => import('src/pages/dashboard/tour/list'));
const TourCreatePage = lazy(() => import('src/pages/dashboard/tour/new'));
const TourEditPage = lazy(() => import('src/pages/dashboard/tour/edit'));
const FileManagerPage = lazy(() => import('src/pages/dashboard/file-manager'));
const ChatPage = lazy(() => import('src/pages/dashboard/chat'));
const MailPage = lazy(() => import('src/pages/dashboard/mail'));
const CalendarPage = lazy(() => import('src/pages/dashboard/calendar'));
const KanbanPage = lazy(() => import('src/pages/dashboard/kanban'));
const PermissionDeniedPage = lazy(() => import('src/pages/dashboard/permission'));
const ParamsPage = lazy(() => import('src/pages/dashboard/params'));
const BlankPage = lazy(() => import('src/pages/dashboard/blank'));
const TermsPage = lazy(() => import('src/pages/dashboard/active-routes/terms'));
const AboutUsPage = lazy(() => import('src/pages/dashboard/active-routes/about'));
const PolicyPage = lazy(() => import('src/pages/dashboard/active-routes/policy'));
const SupportPage = lazy(() => import('src/pages/dashboard/active-routes/support'));
const FaqsPage = lazy(() => import('src/pages/dashboard/active-routes/faqs'));
const HelpCenterPage = lazy(() => import('src/pages/dashboard/active-routes/help-center'));
const AdminCountriesPage = lazy(() => import('src/pages/dashboard/admin').then((m) => ({ default: m.AdminCountriesPage })));
const AdminAgeGroupsPage = lazy(() => import('src/pages/dashboard/admin').then((m) => ({ default: m.AdminAgeGroupsPage })));
const AdminMealsPage = lazy(() => import('src/pages/dashboard/admin').then((m) => ({ default: m.AdminMealsPage })));
const AdminRecipesPage = lazy(() => import('src/pages/dashboard/admin').then((m) => ({ default: m.AdminRecipesPage })));
const AdminNutritionTagsPage = lazy(() => import('src/pages/dashboard/admin').then((m) => ({ default: m.AdminNutritionTagsPage })));
const AdminContentApprovalPage = lazy(() => import('src/pages/dashboard/admin').then((m) => ({ default: m.AdminContentApprovalPage })));
const AdminResourcesPage = lazy(() => import('src/pages/dashboard/admin').then((m) => ({ default: m.AdminResourcesPage })));
const AdminTranslationsPage = lazy(() => import('src/pages/dashboard/admin').then((m) => ({ default: m.AdminTranslationsPage })));
const AdminAppTextsPage = lazy(() => import('src/pages/dashboard/admin').then((m) => ({ default: m.AdminAppTextsPage })));
const AdminRecentActivitiesPage = lazy(() => import('src/pages/dashboard/admin').then((m) => ({ default: m.AdminRecentActivitiesPage })));
const AdminNotificationsPage = lazy(() => import('src/pages/dashboard/admin').then((m) => ({ default: m.AdminNotificationsPage })));
const AdminSettingsPage = lazy(() => import('src/pages/dashboard/admin').then((m) => ({ default: m.AdminSettingsPage })));
const AdminUsersPage = lazy(() => import('src/pages/dashboard/admin').then((m) => ({ default: m.AdminUsersPage })));
const AdminUserDetailsPage = lazy(() => import('src/pages/dashboard/admin').then((m) => ({ default: m.AdminUserDetailsPage })));
const AdminGroceryListsPage = lazy(() => import('src/pages/dashboard/admin').then((m) => ({ default: m.AdminGroceryListsPage })));
const AdminTransactionsPage = lazy(() => import('src/pages/dashboard/admin').then((m) => ({ default: m.AdminTransactionsPage })));

const layoutContent = (
  <DashboardLayout showThemeColorSelect>
    <Suspense
      fallback={
        <Box
          sx={{
            px: 5,
            width: 1,
            flexGrow: 1,
            minHeight: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.default',
          }}
        >
          <LinearProgress sx={{ width: 1, maxWidth: 400 }} />
        </Box>
      }
    >
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const adminDashboardRoutes = [
  {
    path: 'admin-dashboard',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <ProtectedRoute requiredPermission={[1]}>{layoutContent}</ProtectedRoute>,
    children: [
      { element: <AdminDashboardPage />, index: true },
      { path: 'ecommerce', element: <OverviewEcommercePage /> },
      { path: 'analytics', element: <Navigate to="/admin-dashboard" replace /> },
      { path: 'banking', element: <OverviewBankingPage /> },
      { path: 'booking', element: <OverviewBookingPage /> },
      { path: 'file', element: <OverviewFilePage /> },
      { path: 'course', element: <OverviewCoursePage /> },

      { path: 'terms', element: <TermsPage /> },
      { path: 'privacy', element: <PolicyPage /> },
      { path: 'faqs', element: <FaqsPage /> },
      { path: 'about', element: <AboutUsPage /> },
      { path: 'contact', element: <OverviewCoursePage /> },
      { path: 'support', element: <SupportPage /> },
      { path: 'help-center', element: <HelpCenterPage /> },

      { path: 'countries', element: <AdminCountriesPage /> },
      { path: 'age-groups', element: <AdminAgeGroupsPage /> },
      { path: 'meals', element: <AdminMealsPage /> },
      { path: 'recipes', element: <AdminRecipesPage /> },
      { path: 'grocery-lists', element: <AdminGroceryListsPage /> },
      { path: 'nutrition-tags', element: <AdminNutritionTagsPage /> },
      { path: 'content-approval', element: <AdminContentApprovalPage /> },
      { path: 'resources', element: <AdminResourcesPage /> },
      { path: 'translations', element: <AdminTranslationsPage /> },
      { path: 'app-texts', element: <AdminAppTextsPage /> },
      { path: 'activities', element: <AdminRecentActivitiesPage /> },
      { path: 'notifications', element: <AdminNotificationsPage /> },
      { path: 'settings', element: <AdminSettingsPage /> },
      { path: 'transactions', element: <AdminTransactionsPage /> },

      {
        path: 'user',
        children: [
          { element: <UserProfilePage />, index: true },
          { path: 'profile', element: <UserProfilePage /> },
          { path: 'cards', element: <UserCardsPage /> },
          { path: 'list', element: <AdminUsersPage /> },
          { path: 'new', element: <UserCreatePage /> },
          { path: ':id', element: <AdminUserDetailsPage /> },
          { path: ':userId/baby/:babyId', element: <AdminUserDetailsPage /> },
          { path: ':id/edit', element: <UserEditPage /> },
          { path: 'account', element: <AdminAccountPage /> },
        ],
      },
      {
        path: 'product',
        children: [
          { element: <ProductListPage />, index: true },
          { path: 'list', element: <ProductListPage /> },
          { path: ':id', element: <ProductDetailsPage /> },
          { path: 'new', element: <ProductCreatePage /> },
          { path: ':id/edit', element: <ProductEditPage /> },
        ],
      },
      {
        path: 'order',
        children: [
          { element: <OrderListPage />, index: true },
          { path: 'list', element: <OrderListPage /> },
          { path: ':id', element: <OrderDetailsPage /> },
        ],
      },
      {
        path: 'invoice',
        children: [
          { element: <InvoiceListPage />, index: true },
          { path: 'list', element: <InvoiceListPage /> },
          { path: ':id', element: <InvoiceDetailsPage /> },
          { path: ':id/edit', element: <InvoiceEditPage /> },
          { path: 'new', element: <InvoiceCreatePage /> },
        ],
      },
      {
        path: 'post',
        children: [
          { element: <BlogPostsPage />, index: true },
          { path: 'list', element: <BlogPostsPage /> },
          { path: ':title', element: <BlogPostPage /> },
          { path: ':title/edit', element: <BlogEditPostPage /> },
          { path: 'new', element: <BlogNewPostPage /> },
        ],
      },
      {
        path: 'job',
        children: [
          { element: <JobListPage />, index: true },
          { path: 'list', element: <JobListPage /> },
          { path: ':id', element: <JobDetailsPage /> },
          { path: 'new', element: <JobCreatePage /> },
          { path: ':id/edit', element: <JobEditPage /> },
        ],
      },
      {
        path: 'tour',
        children: [
          { element: <TourListPage />, index: true },
          { path: 'list', element: <TourListPage /> },
          { path: ':id', element: <TourDetailsPage /> },
          { path: 'new', element: <TourCreatePage /> },
          { path: ':id/edit', element: <TourEditPage /> },
        ],
      },
      { path: 'file-manager', element: <FileManagerPage /> },
      { path: 'mail', element: <MailPage /> },
      { path: 'chat', element: <ChatPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'kanban', element: <KanbanPage /> },
      { path: 'permission', element: <PermissionDeniedPage /> },
      { path: 'params', element: <ParamsPage /> },
      { path: 'blank', element: <BlankPage /> },
    ],
  },
];
