import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

export function createAdminPage(title, ViewComponent) {
  const metadata = { title: `${title} | Admin - ${CONFIG.site.name}` };

  function AdminPage() {
    return (
      <>
        <Helmet>
          <title>{metadata.title}</title>
        </Helmet>
        <ViewComponent />
      </>
    );
  }

  return AdminPage;
}
