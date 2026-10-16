import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';

export function ParentGroceryList({ groceryList, userEmail, userName }) {
  const router = useRouter();
  const recipes = groceryList?.recipes || [];
  const searchTerm = userEmail || userName || '';

  return (
    <Card>
      <CardHeader
        title="Grocery List"
        subheader={
          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            <Chip label={`${recipes.length} recipe${recipes.length !== 1 ? 's' : ''}`} size="small" />
          </Stack>
        }
        action={
          <Button
            size="small"
            color="inherit"
            startIcon={<Iconify icon="solar:square-top-down-bold" width={18} />}
            onClick={() => router.push(`${paths.adminDashboard.modules.groceryLists}?search=${encodeURIComponent(searchTerm)}`)}
            disabled={!searchTerm}
          >
            Open in Grocery lists
          </Button>
        }
      />

      <Divider />

      {recipes.length === 0 && (
        <Box sx={{ py: 6, textAlign: 'center' }}>
          <Iconify icon="solar:cart-large-2-bold" width={40} sx={{ color: 'text.disabled', mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            No grocery list created yet.
          </Typography>
        </Box>
      )}

      <Stack spacing={2} sx={{ p: 3 }}>
        {recipes.map((entry) => (
          <Card key={entry.id} variant="outlined" sx={{ p: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1.5 }}>
              <Avatar variant="rounded" src={entry.image || undefined} sx={{ width: 48, height: 48, bgcolor: 'primary.lighter' }}>
                {entry.icon || <Iconify icon="solar:notebook-bold" />}
              </Avatar>

              <Typography variant="subtitle1" fontWeight={600}>
                {entry.title || 'Untitled recipe'}
              </Typography>
            </Stack>

            <Stack spacing={0.5} divider={<Divider flexItem />}>
              {entry.ingredients.map((ingredient, index) => (
                <Stack key={index} direction="row" alignItems="center" spacing={1.5} sx={{ py: 0.5 }}>
                  <Typography variant="body2" sx={{ flexGrow: 1 }}>
                    {ingredient.icon ? `${ingredient.icon} ` : ''}
                    {ingredient.name}
                  </Typography>

                  {ingredient.category && <Chip size="small" label={ingredient.category} variant="soft" />}

                  {ingredient.quantity && (
                    <Typography variant="caption" color="text.secondary" sx={{ minWidth: 64, textAlign: 'right' }}>
                      {ingredient.quantity}
                    </Typography>
                  )}
                </Stack>
              ))}

              {entry.ingredients.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                  No ingredients listed.
                </Typography>
              )}
            </Stack>
          </Card>
        ))}
      </Stack>
    </Card>
  );
}

ParentGroceryList.propTypes = {
  groceryList: PropTypes.shape({
    recipes: PropTypes.array,
  }),
  userEmail: PropTypes.string,
  userName: PropTypes.string,
};
