import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { RouterLink } from 'src/routes/components';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { useAdminDashboardCardSx } from 'src/components/admin-theme';
import { ADMIN_SETTINGS_DEFAULT } from 'src/_mock/admin-nomnom';
import { AdminModuleLayout } from '../admin-module-layout';


function PreviewRow({ icon, label, value }) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="flex-start">
      <Iconify icon={icon} width={20} sx={{ mt: 0.25, opacity: 0.9 }} />
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="caption" sx={{ opacity: 0.72, display: 'block' }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, wordBreak: 'break-word' }}>
          {value}
        </Typography>
      </Box>
    </Stack>
  );
}


export function SettingsView() {
  const [form, setForm] = useState(ADMIN_SETTINGS_DEFAULT);
  const previewCardSx = useAdminDashboardCardSx({ gradient: true });

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSave = () => {
    toast.success('App settings saved');
  };

  const priceDisplay = useMemo(() => {
    const n = parseFloat(form.oneTimePrice);
    return Number.isFinite(n) ? n.toFixed(2) : form.oneTimePrice || '—';
  }, [form.oneTimePrice]);

  const summaryItems = useMemo(
    () => [
      { icon: 'solar:dollar-minimalistic-bold', label: 'One-time price', value: `$${priceDisplay} USD` },
      { icon: 'solar:clock-circle-bold', label: 'Free trial', value: `${form.trialDays || '0'} days` },
      { icon: 'solar:text-bold', label: 'Tagline', value: form.appTagline || '—' },
      { icon: 'solar:letter-bold', label: 'Support email', value: form.supportEmail },
      { icon: 'solar:phone-bold', label: 'Support phone', value: form.supportPhone },
    ],
    [form, priceDisplay]
  );

  return (
    <AdminModuleLayout title="Settings & configuration" maxWidth="xl">
      <Grid container spacing={3} alignItems="stretch">
        <Grid xs={12} lg={8}>
          <Card sx={{ p: { xs: 2.5, md: 3 }, height: 1 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              App configuration
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
              Manage pricing, trial limits, app text, privacy links, and support contact details for
              caregivers.
            </Typography>

            <Stack spacing={3}>
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Pricing & trial
                </Typography>
                <Grid container spacing={2}>
                  <Grid xs={12} sm={6}>
                    <TextField
                      label="One-time payment"
                      value={form.oneTimePrice}
                      onChange={update('oneTimePrice')}
                      fullWidth
                      helperText="e.g. update from $29.99 to a launch offer"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        endAdornment: <InputAdornment position="end">USD</InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <TextField
                      label="Free trial limit (days)"
                      value={form.trialDays}
                      onChange={update('trialDays')}
                      fullWidth
                      type="number"
                      inputProps={{ min: 0 }}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  App text
                </Typography>
                <TextField
                  label="App tagline"
                  value={form.appTagline}
                  onChange={update('appTagline')}
                  fullWidth
                  multiline
                  rows={2}
                  helperText="Shown in onboarding and app store listings"
                />
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Support contact
                </Typography>
                <Grid container spacing={2}>
                  <Grid xs={12} sm={6}>
                    <TextField
                      label="Support email"
                      value={form.supportEmail}
                      onChange={update('supportEmail')}
                      fullWidth
                      type="email"
                    />
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <TextField
                      label="Support phone"
                      value={form.supportPhone}
                      onChange={update('supportPhone')}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Legal links
                </Typography>
                <Grid container spacing={2}>
                  <Grid xs={12} sm={6}>
                    <TextField
                      label="Privacy policy URL / path"
                      value={form.privacyUrl}
                      onChange={update('privacyUrl')}
                      fullWidth
                    />
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <TextField
                      label="Terms of service URL / path"
                      value={form.termsUrl}
                      onChange={update('termsUrl')}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Box>

              <Button variant="contained" color="primary" onClick={handleSave} sx={{ alignSelf: 'flex-start' }}>
                Save settings
              </Button>
            </Stack>
          </Card>
        </Grid>

        <Grid xs={12} lg={4}>
          <Stack spacing={3} sx={{ height: 1 }}>
            <Card
              className={previewCardSx ? 'admin-dashboard-hero-card' : undefined}
              sx={{
                p: 3,
                color: 'common.white',
                ...(previewCardSx ?? { bgcolor: 'primary.dark' }),
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <Iconify icon="solar:smartphone-bold" width={22} />
                <Typography variant="subtitle1">App preview</Typography>
              </Stack>
              <Typography variant="caption" sx={{ opacity: 0.8, display: 'block', mb: 2 }}>
                How caregivers see paywall & support info
              </Typography>

              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  bgcolor: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                <Typography variant="overline" sx={{ opacity: 0.75 }}>
                  NomNom Babies
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, mb: 2, fontStyle: 'italic' }}>
                  {form.appTagline || 'Your tagline appears here'}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  ${priceDisplay}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.85 }}>
                  one-time · {form.trialDays || '0'}-day free trial
                </Typography>
              </Box>

              <Stack spacing={2} sx={{ mt: 2.5 }}>
                <PreviewRow icon="solar:letter-bold" label="Email" value={form.supportEmail} />
                <PreviewRow icon="solar:phone-bold" label="Phone" value={form.supportPhone} />
              </Stack>
            </Card>

            <Card sx={{ p: 2.5, flex: 1 }}>
              <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
                Current values
              </Typography>
              <List dense disablePadding>
                {summaryItems.map((item) => (
                  <ListItem key={item.label} disableGutters sx={{ py: 0.75 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Iconify icon={item.icon} width={22} sx={{ color: 'primary.main' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      secondary={item.value}
                      primaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                      secondaryTypographyProps={{ variant: 'body2', color: 'text.primary' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Card>

            <Card sx={{ p: 2.5 }}>
              <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
                Legal pages
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Open legal pages managed in admin.
              </Typography>
              <Stack spacing={1}>
                <Button
                  component={RouterLink}
                  href={form.privacyUrl}
                  variant="outlined"
                  color="primary"
                  fullWidth
                  startIcon={<Iconify icon="solar:shield-check-bold" />}
                >
                  Privacy policy
                </Button>
                <Button
                  component={RouterLink}
                  href={form.termsUrl}
                  variant="outlined"
                  color="primary"
                  fullWidth
                  startIcon={<Iconify icon="solar:document-text-bold" />}
                >
                  Terms of service
                </Button>
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                Paths update when you save settings.
              </Typography>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </AdminModuleLayout>
  );
}
