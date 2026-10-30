import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { api, BRAND } from './api';
import { LandingShell, PageHero } from './landing-shell';

const PAGES = {
  about: { title: 'About Us', endpoint: 'app/settings/about-us' },
  privacy: { title: 'Privacy Policy', endpoint: 'app/settings/privacy-policy' },
  terms: { title: 'Terms & Conditions', endpoint: 'app/settings/terms-conditions' },
};

// About / Privacy / Terms — the same content the app shows, edited from the admin panel (Settings).
export function LegalView({ page }) {
  const { title, endpoint } = PAGES[page];
  const [html, setHtml] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setHtml(null);
    api(endpoint)
      .then((r) => setHtml(r.data?.content ?? ''))
      .catch((e) => setError(e.message));
  }, [endpoint]);

  return (
    <LandingShell>
      <Helmet>
        <title>{title} | NomNom Babies</title>
      </Helmet>
      <PageHero title={title} />
      <Container maxWidth="md" sx={{ py: 6 }}>
        {error ? <Typography color="error">{error}</Typography> : null}
        {html === null && !error ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <CircularProgress sx={{ color: BRAND }} />
          </Box>
        ) : null}
        {html ? (
          <Box
            sx={{
              lineHeight: 1.8,
              color: 'text.secondary',
              '& h1': { display: 'none' },
              '& h2, & h3, & strong': { color: 'text.primary' },
              '& a': { color: BRAND },
            }}
            // Admin-authored rich text from our own API.
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : null}
      </Container>
    </LandingShell>
  );
}
