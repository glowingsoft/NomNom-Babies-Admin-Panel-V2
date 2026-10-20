import PropTypes from 'prop-types';
import { memo } from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { varAlpha } from 'src/theme/styles';
import { Label } from 'src/components/label';


function StatusTabsFilter({ value, options, onChange, getCount, sx, ...other }) {
    return (
        <Tabs
            value={value}
            onChange={onChange}
            {...other}
            sx={{
                px: { xs: 1, sm: 3 },
                py: { xs: 0.25, sm: 0.5 },
                minHeight: { xs: 44, sm: 56 },
                gap: 1,
                boxShadow: (theme) =>
                    `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
                '& .MuiTabs-flexContainer': {
                    gap: { xs: 0.75, sm: 2 },
                    flexWrap: { xs: 'wrap', sm: 'nowrap' },
                },
                '& .MuiTab-root': {
                    minWidth: 'auto',
                    minHeight: { xs: 36, sm: 48 },
                    px: { xs: 1, sm: 2 },
                    py: { xs: 0.5, sm: 1.25 },
                    mr: { xs: 0, sm: 1 },
                    gap: { xs: 0.75, sm: 1.25 },
                    typography: { xs: 'body2', sm: 'subtitle2' },
                },
                '& .MuiTab-root:last-of-type': {
                    mr: 0,
                },
                ...sx,
            }}
        >
            {options.map((tab) => (
                <Tab
                    key={tab.value}
                    iconPosition="end"
                    value={tab.value}
                    label={tab.label}
                    sx={{
                        '& .MuiTab-iconWrapper': {
                            ml: { xs: 0.75, sm: 1.25 },
                        },
                    }}
                    icon={
                        getCount(tab.value) == null ? undefined : (
                            <Label
                                variant={((tab.value === 'all' || tab.value === value) && 'filled') || 'soft'}
                                color={tab.color || 'default'}
                            >
                                {getCount(tab.value)}
                            </Label>
                        )
                    }
                />
            ))}
        </Tabs>
    );
}

StatusTabsFilter.propTypes = {
    value: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            color: PropTypes.string,
        })
    ).isRequired,
    onChange: PropTypes.func.isRequired,
    getCount: PropTypes.func.isRequired,
    sx: PropTypes.object,
};

export default memo(StatusTabsFilter);