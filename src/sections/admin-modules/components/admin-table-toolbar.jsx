import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import { varAlpha } from 'src/theme/styles';

import StatusTabsFilter from 'src/components/filters/status-tabs-filter';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function AdminTableToolbar({
  filterValue,
  filterOptions,
  onFilterChange,
  getFilterCount,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  sx,
}) {
  const hasFilters = !!filterOptions?.length;

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'stretch', md: 'center' }}
      justifyContent="space-between"
      spacing={{ xs: 2, md: 2.5 }}
      sx={{
        p: { xs: 2, md: 2.5 },
        gap: { md: 3 },
        borderBottom: (theme) => `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)}`,
        ...sx,
      }}
    >
      {hasFilters && (
        <StatusTabsFilter
          value={filterValue}
          options={filterOptions}
          onChange={onFilterChange}
          getCount={getFilterCount}
          sx={{
            flex: 1,
            minWidth: 0,
            px: 0,
            py: 0,
            minHeight: 52,
            boxShadow: 'none',
            '& .MuiTabs-flexContainer': {
              gap: { xs: 1, sm: 2 },
            },
            '& .MuiTab-root': {
              minHeight: 52,
              py: 1.5,
            },
          }}
        />
      )}

      <TextField
        size="small"
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={searchPlaceholder}
        sx={{
          width: { xs: 1, md: hasFilters ? 300 : 1 },
          maxWidth: { md: hasFilters ? 340 : 'none' },
          flexShrink: 0,
          ml: { md: hasFilters ? 'auto' : 0 },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" width={20} sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
}

AdminTableToolbar.propTypes = {
  filterValue: PropTypes.string,
  filterOptions: PropTypes.array,
  onFilterChange: PropTypes.func,
  getFilterCount: PropTypes.func,
  searchValue: PropTypes.string,
  onSearchChange: PropTypes.func.isRequired,
  searchPlaceholder: PropTypes.string,
  sx: PropTypes.object,
};
