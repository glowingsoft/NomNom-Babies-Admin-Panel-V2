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
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        p: { xs: 2, md: 2.5 },
        // Wrap by available width (the sidebar changes it), not by viewport breakpoint.
        flexWrap: 'wrap',
        gap: { xs: 2, md: 3 },
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
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            flex: '999 1 480px',
            minWidth: 0,
            px: 0,
            py: 0,
            minHeight: 52,
            boxShadow: 'none',
            '& .MuiTabs-flexContainer': {
              gap: { xs: 1, sm: 2 },
              flexWrap: 'nowrap',
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
          flex: hasFilters ? '1 1 260px' : '1 1 100%',
          maxWidth: { xs: 'none', sm: hasFilters ? 340 : 'none' },
          ml: hasFilters ? 'auto' : 0,
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
