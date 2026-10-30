import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { LandingShell, PageHero } from './landing-shell';
import { api, BRAND, BRAND_DARK, SUPPORT_EMAIL } from './api';

const EMPTY = { name: '', email: '', subject: '', message: '' };

// Contact form → POST app/support (shows up under Support Requests in the admin panel).
export function ContactView() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: '', text: '' });
  const [sending, setSending] = useState(false);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: '' }));
  };

  const validate = () => {
    const next = {
      name: form.name.trim() ? '' : 'Name is required',
      email: /^\S+@\S+\.\S+$/.test(form.email.trim()) ? '' : 'Enter a valid email',
      subject: form.subject.trim() ? '' : 'Subject is required',
      message: form.message.trim().length >= 10 ? '' : 'Please write at least 10 characters',
    };
    setErrors(next);
    return !Object.values(next).some(Boolean);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSending(true);
    setStatus({ type: '', text: '' });
    try {
      await api('app/support', {
        method: 'POST',
        body: {
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          subject: form.subject.trim(),
          message: form.message.trim(),
        },
      });
      setForm(EMPTY);
      setStatus({ type: 'success', text: 'Thanks! Your message has been sent — we’ll reply by email.' });
    } catch (err) {
      setStatus({ type: 'error', text: err.message });
    } finally {
      setSending(false);
    }
  };

  return (
    <LandingShell>
      <Helmet>
        <title>Contact Us | NomNom Babies</title>
      </Helmet>
      <PageHero
        title="Contact Us"
        subtitle={`Questions, feedback or support — write to us here or at ${SUPPORT_EMAIL}.`}
      />
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Card component="form" onSubmit={submit} noValidate sx={{ p: 4, borderRadius: 4 }}>
          <Stack spacing={2.5}>
            {status.text ? <Alert severity={status.type}>{status.text}</Alert> : null}
            <TextField label="Name" value={form.name} onChange={set('name')} error={!!errors.name} helperText={errors.name} />
            <TextField label="Email" type="email" value={form.email} onChange={set('email')} error={!!errors.email} helperText={errors.email} />
            <TextField label="Subject" value={form.subject} onChange={set('subject')} error={!!errors.subject} helperText={errors.subject} />
            <TextField
              label="Message"
              multiline
              minRows={5}
              value={form.message}
              onChange={set('message')}
              error={!!errors.message}
              helperText={errors.message}
              inputProps={{ maxLength: 1000 }}
            />
            <Button
              type="submit"
              size="large"
              variant="contained"
              disabled={sending}
              sx={{ borderRadius: 3, background: `linear-gradient(90deg, ${BRAND}, ${BRAND_DARK})` }}
            >
              {sending ? 'Sending…' : 'Send message'}
            </Button>
          </Stack>
        </Card>
        <Typography variant="body2" sx={{ mt: 3, color: 'text.secondary', textAlign: 'center' }}>
          We usually reply within 2 business days.
        </Typography>
      </Container>
    </LandingShell>
  );
}
