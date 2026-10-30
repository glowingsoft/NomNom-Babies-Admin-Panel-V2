import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import { LandingShell } from './landing-shell';
import { api, BRAND, BRAND_DARK, SCREENS } from './api';

const FEATURES = [
  {
    emoji: '🌍',
    title: 'Recipes from your cultures',
    text: 'Blend up to two food cultures — from Nigerian plantain to Pakistani khichdi — with recipes matched to your baby’s age.',
  },
  {
    emoji: '🗓️',
    title: 'Daily feeding timetable',
    text: 'Plan milk and meals for every day of the week, tick feeds off as you go and get a reminder before each one.',
  },
  {
    emoji: '🛡️',
    title: 'Allergen guard tracker',
    text: 'Log each new food with the date and reaction, so you can spot allergies early and introduce foods safely.',
  },
  {
    emoji: '🛒',
    title: 'Smart grocery lists',
    text: 'Add a recipe and its ingredients land on your grocery list, grouped by category and ready to tick off.',
  },
  {
    emoji: '🥕',
    title: 'Nutrition made simple',
    text: 'See the key nutrients in every recipe, feeding insights and allergy reminders written for parents.',
  },
  {
    emoji: '👶',
    title: 'Profiles for every baby',
    text: 'Twins or siblings? Keep a profile per baby — each with their own stage, cultures, plan and progress.',
  },
];

const SHOTS = [
  ['01-home', 'Personal home'],
  ['03-recipes', 'Baby recipes'],
  ['04-recipe-detail', 'Step-by-step recipes'],
  ['06-schedule', 'Feeding schedule'],
  ['08-grocery-list', 'Grocery list'],
  ['10-food-tracker', 'Allergen tracker'],
  ['12-achievements', 'Badges & milestones'],
  ['14-babies-profiles', 'Multiple babies'],
];

const STEPS = [
  ['Pick your cultures', 'Choose up to two food cultures your family loves.'],
  ['Tell us about your baby', 'Their name and stage — from first tastes at 6 months to family foods.'],
  ['Follow the plan', 'Recipes, a daily timetable, grocery lists and a tracker, all in one place.'],
];

function Phone({ name, alt, sx }) {
  return (
    <Box
      component="img"
      src={`${SCREENS}/${name}.png`}
      alt={alt}
      loading="lazy"
      sx={{
        width: '100%',
        borderRadius: '28px',
        border: '8px solid #1F1A17',
        boxShadow: '0 24px 60px rgba(242,140,68,0.25)',
        bgcolor: '#fff',
        ...sx,
      }}
    />
  );
}

function StoreButtons() {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} id="download">
      {['Google Play', 'App Store'].map((store) => (
        <Button
          key={store}
          variant="contained"
          size="large"
          disabled
          sx={{
            borderRadius: 3,
            px: 3,
            bgcolor: '#1F1A17 !important',
            color: '#fff !important',
            opacity: 0.92,
            flexDirection: 'column',
            alignItems: 'flex-start',
            lineHeight: 1.2,
          }}
        >
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            Coming soon on
          </Typography>
          <Typography sx={{ fontWeight: 700 }}>{store}</Typography>
        </Button>
      ))}
    </Stack>
  );
}

export function LandingView() {
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    api('app/settings/faqs?limit=20')
      .then((r) => setFaqs(r.data ?? []))
      .catch(() => setFaqs([]));
  }, []);

  return (
    <LandingShell>
      <Helmet>
        <title>NomNom Babies — Healthy first foods for every culture</title>
        <meta
          name="description"
          content="Culturally personalised baby weaning app: age-based recipes, feeding timetables, grocery lists and an allergen tracker."
        />
      </Helmet>

      {/* Hero */}
      <Box sx={{ background: 'linear-gradient(160deg, #FFE7D3 0%, #FFFBF7 60%)', overflow: 'hidden' }}>
        <Container sx={{ py: { xs: 6, md: 10 } }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={7}>
              <Chip
                label="For the love of healthy babies"
                sx={{ bgcolor: 'rgba(251,146,60,0.15)', color: BRAND_DARK, fontWeight: 700, mb: 2 }}
              />
              <Typography variant="h1" sx={{ fontSize: { xs: 40, md: 60 }, fontWeight: 800, lineHeight: 1.1 }}>
                Healthy first foods for{' '}
                <Box component="span" sx={{ color: BRAND }}>
                  every culture
                </Box>
              </Typography>
              <Typography sx={{ mt: 2.5, fontSize: 18, color: 'text.secondary', maxWidth: 560 }}>
                NomNom Babies turns your family’s food traditions into a personalised weaning plan —
                age-based recipes, a daily feeding timetable, smart grocery lists and an allergen
                tracker, all in one app.
              </Typography>
              <Box sx={{ mt: 4 }}>
                <StoreButtons />
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box sx={{ position: 'relative', maxWidth: 360, mx: 'auto' }}>
                <Phone name="01-home" alt="NomNom Babies home screen" />
                <Phone
                  name="04-recipe-detail"
                  alt="Recipe detail"
                  sx={{
                    position: 'absolute',
                    width: '62%',
                    right: { xs: -10, md: -90 },
                    bottom: -30,
                    display: { xs: 'none', sm: 'block' },
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features */}
      <Container id="features" sx={{ py: { xs: 8, md: 12 } }}>
        <Typography variant="h3" textAlign="center" sx={{ fontWeight: 800 }}>
          Everything your weaning journey needs
        </Typography>
        <Typography textAlign="center" sx={{ color: 'text.secondary', mt: 1.5, mb: 6 }}>
          Built with parents, guided by WHO & CDC weaning advice.
        </Typography>
        <Grid container spacing={3}>
          {FEATURES.map((f) => (
            <Grid item xs={12} sm={6} md={4} key={f.title}>
              <Card sx={{ p: 3.5, height: '100%', borderRadius: 4, boxShadow: '0 8px 30px rgba(242,140,68,0.08)' }}>
                <Typography sx={{ fontSize: 36 }}>{f.emoji}</Typography>
                <Typography variant="h6" sx={{ mt: 1.5, fontWeight: 700 }}>
                  {f.title}
                </Typography>
                <Typography sx={{ mt: 1, color: 'text.secondary' }}>{f.text}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Screens */}
      <Box id="screens" sx={{ bgcolor: '#FFF1E6', py: { xs: 8, md: 12 } }}>
        <Container>
          <Typography variant="h3" textAlign="center" sx={{ fontWeight: 800, mb: 6 }}>
            A look inside the app
          </Typography>
          <Grid container spacing={4}>
            {SHOTS.map(([name, label]) => (
              <Grid item xs={6} md={3} key={name}>
                <Phone name={name} alt={label} />
                <Typography textAlign="center" sx={{ mt: 1.5, fontWeight: 700 }}>
                  {label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How it works */}
      <Container sx={{ py: { xs: 8, md: 12 } }}>
        <Typography variant="h3" textAlign="center" sx={{ fontWeight: 800, mb: 6 }}>
          Start in three steps
        </Typography>
        <Grid container spacing={3}>
          {STEPS.map(([title, text], i) => (
            <Grid item xs={12} md={4} key={title}>
              <Stack spacing={1.5} alignItems="center" textAlign="center">
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: 22,
                    background: `linear-gradient(90deg, ${BRAND}, ${BRAND_DARK})`,
                  }}
                >
                  {i + 1}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {title}
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>{text}</Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* FAQ */}
      {faqs.length ? (
        <Container id="faq" maxWidth="md" sx={{ pb: { xs: 8, md: 10 } }}>
          <Typography variant="h3" textAlign="center" sx={{ fontWeight: 800, mb: 4 }}>
            Frequently asked questions
          </Typography>
          {faqs.map((f) => (
            <Accordion key={f._id} disableGutters sx={{ mb: 1.5, borderRadius: 3, '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<span>＋</span>}>
                <Typography sx={{ fontWeight: 700 }}>{f.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ color: 'text.secondary' }}>{f.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Container>
      ) : null}

      {/* CTA */}
      <Container>
        <Box
          sx={{
            borderRadius: 6,
            p: { xs: 4, md: 7 },
            textAlign: 'center',
            color: '#fff',
            background: `linear-gradient(120deg, ${BRAND}, ${BRAND_DARK})`,
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 800 }}>
            Make every first bite count
          </Typography>
          <Typography sx={{ mt: 1.5, opacity: 0.9 }}>
            NomNom Babies is launching soon on Android and iOS.
          </Typography>
        </Box>
      </Container>
    </LandingShell>
  );
}
