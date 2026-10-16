import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import { fDate } from 'src/utils/format-time';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';

const SLOT_ICONS = {
  meal: 'solar:chef-hat-bold',
  milk: 'solar:cup-bold',
};

export function ParentTimetables({ timetables }) {
  if (timetables.length === 0) {
    return (
      <Card sx={{ p: 4, textAlign: 'center' }}>
        <Iconify icon="solar:calendar-bold" width={40} sx={{ mb: 1, color: 'text.disabled' }} />

        <Typography variant="body2" color="text.secondary">
          No timetables assigned yet.
        </Typography>
      </Card>
    );
  }

  return (
    <Stack spacing={2}>
      {timetables.map((timetable) => (
        <Accordion
          key={timetable.id}
          disableGutters
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
            '&:before': { display: 'none' },
            boxShadow: (theme) => theme.customShadows?.z4,
          }}
        >
          <AccordionSummary
            expandIcon={<Iconify icon="eva:chevron-down-fill" />}
            sx={{
              px: 3,
              py: 1,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" sx={{ width: 1 }}>
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  width: 48,
                  height: 48,
                }}
              >
                <Iconify icon="solar:calendar-mark-bold" width={24} />
              </Avatar>

              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1">{timetable.date ? fDate(timetable.date) : 'Feeding Plan'}</Typography>

                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                  {timetable.babyName && <Chip size="small" label={`For ${timetable.babyName}`} />}

                  {timetable.createdAt && (
                    <Typography variant="caption" color="text.secondary">
                      Created {fDate(timetable.createdAt)}
                    </Typography>
                  )}
                </Stack>
              </Box>

              <Label color="info">{timetable.mealCount || 0} meals/day</Label>
            </Stack>
          </AccordionSummary>

          <AccordionDetails sx={{ px: 3, pb: 3 }}>
            <Divider sx={{ mb: 2 }} />

            <Stack spacing={2}>
              {(timetable.slots || []).map((slot) => (
                <Stack key={slot.id} direction="row" spacing={2} alignItems="center">
                  <Avatar
                    sx={{
                      width: 34,
                      height: 34,
                      bgcolor: slot.completed ? 'success.lighter' : 'primary.lighter',
                      color: slot.completed ? 'success.main' : 'primary.main',
                    }}
                  >
                    <Iconify icon={SLOT_ICONS[slot.type] || 'solar:clock-circle-bold'} width={18} />
                  </Avatar>

                  <Box sx={{ flexGrow: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="subtitle2">{slot.title}</Typography>
                      {slot.isOptional && <Chip size="small" label="Optional" variant="soft" />}
                    </Stack>

                    <Typography variant="body2" color="text.secondary">
                      {slot.description} · {slot.time}
                    </Typography>
                  </Box>

                  <Label variant="soft" color={slot.completed ? 'success' : 'default'}>
                    {slot.completed ? 'Done' : 'Pending'}
                  </Label>
                </Stack>
              ))}

              {(timetable.slots || []).length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 1 }}>
                  No meal schedule set yet.
                </Typography>
              )}
            </Stack>
          </AccordionDetails>
        </Accordion>
      ))}
    </Stack>
  );
}
