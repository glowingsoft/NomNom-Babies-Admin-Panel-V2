import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

import { fDate } from 'src/utils/format-time';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

export function ParentSupport({ questions }) {
  return (
    <Card>
      <CardHeader title="Support Questions" subheader={<Chip label={`${questions.length} question${questions.length !== 1 ? 's' : ''} asked`} size="small" sx={{ mb: 1,}} />} />

      <Divider />

      {questions.length === 0 && (
        <Typography
          variant="body2"
          sx={{
            p: 4,
            color: 'text.secondary',
            textAlign: 'center',
          }}
        >
          No support questions asked yet.
        </Typography>
      )}

      <Stack spacing={2} sx={{ p: 3 }}>
        {questions.map((q) => (
          <Box
            key={q.id}
            sx={{
              p: 2.5,
              borderRadius: 2,
              border: (theme) => `1px solid ${theme.vars.palette.divider}`,
              bgcolor: 'background.neutral',
              transition: 'all .2s ease',
              '&:hover': {
                boxShadow: (theme) => theme.customShadows.z8,
              },
            }}
          >
            {/* Header */}
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1.5}>
              <Stack direction="row" spacing={1.5}>
                <Iconify icon="solar:question-circle-bold" width={22} sx={{ color: 'primary.main', mt: 0.25 }} />

                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {q.question}
                  </Typography>

                  <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 0.5 }}>
                    <Iconify icon="solar:calendar-bold" width={14} sx={{ color: 'text.disabled' }} />

                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {q.createdAt ? fDate(q.createdAt) : ''}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>

              <Label color={q.status === 'resolved' ? 'success' : q.status === 'pending' ? 'warning' : 'info'}>{q.status || 'open'}</Label>
            </Stack>

            {/* Reply */}
            {q.answer && (
              <Box
                sx={{
                  mt: 2,
                  ml: { sm: 4.5 },
                  p: 2,
                  borderRadius: 1.5,
                  bgcolor: 'background.paper',
                  borderLeft: (theme) => `4px solid ${theme.vars.palette.success.main}`,
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <Iconify icon="solar:chat-round-dots-bold" width={16} sx={{ color: 'success.main' }} />

                  <Typography variant="caption" fontWeight={600} color="success.main">
                    Admin Reply
                  </Typography>
                </Stack>

                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {q.answer}
                </Typography>
              </Box>
            )}
          </Box>
        ))}
      </Stack>
    </Card>
  );
}
