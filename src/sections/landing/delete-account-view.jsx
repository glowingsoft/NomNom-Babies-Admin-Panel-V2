import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { api, BRAND, BRAND_DARK } from './api';
import { LandingShell, PageHero } from './landing-shell';

// The request id lives only in this tab's session storage (it is never emailed), so the code must be entered
// and the deletion confirmed in the same browser that started the request.
const STORE_KEY = 'nn.accountDeletion';
const CONFIRM_WORD = 'DELETE';

const readState = () => {
  try {
    return JSON.parse(sessionStorage.getItem(STORE_KEY) || 'null');
  } catch {
    return null;
  }
};
const saveState = (s) => {
  try {
    if (s) sessionStorage.setItem(STORE_KEY, JSON.stringify(s));
    else sessionStorage.removeItem(STORE_KEY);
  } catch {
    // storage unavailable: the flow still works within this page
  }
};

const LOST = [
  'Your profile, login and all baby profiles',
  'Feeding schedules, timetables and food logs',
  'Food tracker history, favourites and grocery lists',
  'Achievements and notifications',
];

const gradientButton = { borderRadius: 3, background: `linear-gradient(90deg, ${BRAND}, ${BRAND_DARK})` };

// Play Store / App Store account deletion page: email → 6-digit code → type DELETE → deleted.
export function DeleteAccountView() {
  const saved = readState();
  const [step, setStep] = useState(saved?.deletionToken ? 'confirm' : saved?.requestId ? 'code' : 'email');
  const [email, setEmail] = useState(saved?.email ?? '');
  const [otp, setOtp] = useState('');
  const [typed, setTyped] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);

  const run = async (fn) => {
    setBusy(true);
    setError('');
    try {
      await fn();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const requestCode = () =>
    run(async () => {
      const value = email.trim().toLowerCase();
      if (!/^\S+@\S+\.\S+$/.test(value)) throw new Error('Enter the email address of your account.');
      const r = await api('account-deletion/request', { method: 'POST', body: { email: value } });
      saveState({ email: value, requestId: r.data.requestId });
      setOtp('');
      setInfo(`We sent a 6-digit code to ${value}. It expires in 10 minutes.`);
      setStep('code');
    });

  const verifyCode = () =>
    run(async () => {
      const s = readState();
      if (!s?.requestId) {
        setStep('email');
        throw new Error('Please start again from this browser.');
      }
      if (!/^\d{6}$/.test(otp.trim())) throw new Error('Enter the 6-digit code from the email.');
      const r = await api('account-deletion/verify', {
        method: 'POST',
        body: { email: s.email, otp: otp.trim(), requestId: s.requestId },
      });
      saveState({ ...s, deletionToken: r.data.deletionToken });
      setInfo('');
      setStep('confirm');
    });

  const confirmDeletion = () =>
    run(async () => {
      const s = readState();
      if (!s?.deletionToken) {
        setStep('email');
        throw new Error('Your verification expired. Please start again.');
      }
      await api('account-deletion/confirm', {
        method: 'POST',
        body: { requestId: s.requestId, deletionToken: s.deletionToken },
      });
      saveState(null);
      setStep('done');
    });

  const restart = () => {
    saveState(null);
    setStep('email');
    setOtp('');
    setTyped('');
    setError('');
    setInfo('');
  };

  return (
    <LandingShell>
      <Helmet>
        <title>Delete Your Account | NomNom Babies</title>
      </Helmet>
      <PageHero
        title="Delete your account"
        subtitle="Request deletion of your NomNom Babies account and its personal data."
      />
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Card sx={{ p: 4, borderRadius: 4 }}>
          <Stack spacing={2.5}>
            {error ? <Alert severity="error">{error}</Alert> : null}
            {info ? <Alert severity="info">{info}</Alert> : null}

            {step === 'email' ? (
              <>
                <Typography variant="h6">1. Enter your account email</Typography>
                <Typography variant="body2" color="text.secondary">
                  We’ll email you a verification code to confirm it’s really you.
                </Typography>
                <TextField
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && requestCode()}
                />
                <Button size="large" variant="contained" disabled={busy} onClick={requestCode} sx={gradientButton}>
                  {busy ? 'Sending…' : 'Send verification code'}
                </Button>
              </>
            ) : null}

            {step === 'code' ? (
              <>
                <Typography variant="h6">2. Enter the code</Typography>
                <TextField
                  label="6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  onKeyDown={(e) => e.key === 'Enter' && verifyCode()}
                  inputProps={{ inputMode: 'numeric', style: { letterSpacing: 8, fontSize: 22 } }}
                />
                <Button size="large" variant="contained" disabled={busy} onClick={verifyCode} sx={gradientButton}>
                  {busy ? 'Verifying…' : 'Verify'}
                </Button>
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Button disabled={busy} onClick={requestCode}>
                    Resend code
                  </Button>
                  <Button color="inherit" onClick={restart}>
                    Use another email
                  </Button>
                </Stack>
              </>
            ) : null}

            {step === 'confirm' ? (
              <>
                <Typography variant="h6">3. Confirm deletion</Typography>
                <Alert severity="warning">
                  This permanently deletes <b>{readState()?.email}</b>. It can’t be undone. You will lose:
                  <Box component="ul" sx={{ m: 0, mt: 1, pl: 2.5 }}>
                    {LOST.map((l) => (
                      <li key={l}>{l}</li>
                    ))}
                  </Box>
                </Alert>
                <TextField
                  label={`Type ${CONFIRM_WORD} to confirm`}
                  value={typed}
                  onChange={(e) => setTyped(e.target.value)}
                  inputProps={{ style: { letterSpacing: 2, fontWeight: 700 } }}
                />
                <Button
                  size="large"
                  variant="contained"
                  color="error"
                  disabled={busy || typed.trim().toUpperCase() !== CONFIRM_WORD}
                  onClick={confirmDeletion}
                  sx={{ borderRadius: 3 }}
                >
                  {busy ? 'Deleting…' : 'Permanently delete my account'}
                </Button>
                <Button color="inherit" onClick={restart}>
                  Cancel
                </Button>
              </>
            ) : null}

            {step === 'done' ? (
              <>
                <Alert severity="success">Your account has been deleted.</Alert>
                <Typography color="text.secondary">
                  We’ve sent a confirmation email. If you use the app, you’ve been signed out on all
                  devices. You’re welcome back any time with a new account.
                </Typography>
              </>
            ) : null}
          </Stack>
        </Card>

        <Typography variant="body2" sx={{ mt: 3, color: 'text.secondary' }}>
          You can also delete your account in the app: Settings → Delete Account. Deletion removes
          your personal data from our active systems straight away; limited records may be kept where
          the law requires (for example billing records).
        </Typography>
      </Container>
    </LandingShell>
  );
}
