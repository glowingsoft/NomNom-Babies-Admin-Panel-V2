import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

export function AdminModuleInfoCard({ title, description, stats }) {
  return (
    <Card sx={{ p: 2.5, mb: 3 }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: stats?.length ? 2 : 0 }}>
        {description}
      </Typography>
      {!!stats?.length && (
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {stats.map((item) => (
            <Label key={item.key ?? item.label} variant="soft" color={item.color ?? 'default'}>
              {item.label}
            </Label>
          ))}
        </Stack>
      )}
    </Card>
  );
}

AdminModuleInfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      label: PropTypes.string.isRequired,
      color: PropTypes.string,
    })
  ),
};
