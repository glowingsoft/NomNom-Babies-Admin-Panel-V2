import { Link as RouterLink } from 'react-router-dom';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { BRAND, BRAND_DARK, SUPPORT_EMAIL } from './api';

const NAV = [
  { label: 'Features', href: '/#features' },
  { label: 'Screens', href: '/#screens' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Contact', href: '/contact' },
];

const FOOTER = [
  { label: 'About Us', href: '/about' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Delete Account', href: '/delete-account' },
];

// Public site frame: header + footer. The admin sign-in (/admin) is intentionally not linked anywhere.
export function LandingShell({ children }) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FFFBF7', display: 'flex', flexDirection: 'column' }}>
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          bgcolor: 'rgba(255,251,247,0.92)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(251,146,60,0.12)',
        }}
      >
        <Container sx={{ py: 1.5, display: 'flex', alignItems: 'center', gap: 3 }}>
          <Link component={RouterLink} to="/" sx={{ display: 'flex' }}>
            <Box component="img" src="/assets/landing/logo.png" alt="NomNom Babies" sx={{ height: 40 }} />
          </Link>
          <Stack direction="row" spacing={3} sx={{ ml: 'auto', display: { xs: 'none', md: 'flex' } }}>
            {NAV.map((n) => (
              <Link
                key={n.label}
                component={RouterLink}
                to={n.href}
                underline="none"
                sx={{ color: 'text.primary', fontWeight: 600, '&:hover': { color: BRAND } }}
              >
                {n.label}
              </Link>
            ))}
          </Stack>
          <Button
            component={RouterLink}
            to="/#download"
            variant="contained"
            sx={{
              ml: { xs: 'auto', md: 0 },
              borderRadius: 3,
              background: `linear-gradient(90deg, ${BRAND}, ${BRAND_DARK})`,
              boxShadow: 'none',
            }}
          >
            Get the app
          </Button>
        </Container>
      </Box>

      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>

      <Box component="footer" sx={{ bgcolor: '#2B1D14', color: 'rgba(255,255,255,0.8)', mt: 8 }}>
        <Container sx={{ py: 6 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} justifyContent="space-between">
            <Box sx={{ maxWidth: 360 }}>
              <Typography variant="h6" sx={{ color: '#fff', mb: 1 }}>
                NomNom Babies
              </Typography>
              <Typography variant="body2">
                Culturally personalised baby feeding — recipes, timetables, grocery lists and an
                allergen tracker for every stage of weaning.
              </Typography>
              <Typography variant="body2" sx={{ mt: 2 }}>
                <Link href={`mailto:${SUPPORT_EMAIL}`} sx={{ color: BRAND }}>
                  {SUPPORT_EMAIL}
                </Link>
              </Typography>
            </Box>
            <Stack spacing={1}>
              {FOOTER.map((f) => (
                <Link
                  key={f.label}
                  component={RouterLink}
                  to={f.href}
                  underline="hover"
                  sx={{ color: 'rgba(255,255,255,0.8)' }}
                >
                  {f.label}
                </Link>
              ))}
            </Stack>
          </Stack>
          <Typography variant="caption" sx={{ display: 'block', mt: 5, opacity: 0.6 }}>
            © {new Date().getFullYear()} NomNom Babies. All rights reserved. Not a substitute for
            medical advice — always check with your pediatrician.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

/** Centered page header used by the inner pages. */
export function PageHero({ title, subtitle }) {
  return (
    <Box sx={{ py: { xs: 6, md: 8 }, textAlign: 'center', bgcolor: '#FFF1E6' }}>
      <Container maxWidth="md">
        <Typography variant="h2" sx={{ fontSize: { xs: 32, md: 44 }, fontWeight: 800 }}>
          {title}
        </Typography>
        {subtitle ? (
          <Typography sx={{ mt: 1.5, color: 'text.secondary' }}>{subtitle}</Typography>
        ) : null}
      </Container>
    </Box>
  );
}
