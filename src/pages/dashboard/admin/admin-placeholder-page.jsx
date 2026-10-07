import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

import { CONFIG } from 'src/config-global';

import { BlankView } from 'src/sections/blank/view';

// ----------------------------------------------------------------------

const PATH_TITLE_MAP = {
  countries: 'Countries',
  'age-groups': 'Age Groups',
  recipes: 'Recipes',
  'nutrition-tags': 'Nutrition Tags',
  'content-approval': 'Content Approval',
  resources: 'Resources',
  translations: 'Translations',
  notifications: 'Notifications',
  settings: 'Settings',
};

// ----------------------------------------------------------------------

export default function AdminPlaceholderPage() {
  const { pathname } = useLocation();

  const segment = pathname.split('/').filter(Boolean).pop() ?? '';

  const title = PATH_TITLE_MAP[segment] ?? 'Module';

  const metadata = { title: `${title} | Admin - ${CONFIG.site.name}` };

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
      </Helmet>

      <BlankView title={title} description="This module will be available in a future update." />
    </>
  );
}
