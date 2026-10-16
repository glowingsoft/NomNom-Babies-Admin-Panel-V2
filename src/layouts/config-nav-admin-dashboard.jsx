import { paths } from 'src/routes/paths';
import { CONFIG } from 'src/config-global';
import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';

const icon = (name) => <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/${name}.svg`} />;

const ICONS = {
  dashboard: icon('ic-dashboard-2'),
  menuItem: icon('ic-menu-item'),
  tour: icon('ic-tour'),
  user: icon('ic-user'),
  userHub: <Iconify width={22} icon="solar:users-group-rounded-bold-duotone" />,
  product: icon('ic-product'),
  label: icon('ic-label'),
  file: icon('ic-file'),
  folder: icon('ic-folder'),
  blog: icon('ic-blog'),
  mail: icon('ic-mail'),
  lock: icon('ic-lock'),
  parameter: icon('ic-parameter'),
  faqs: icon('ic-faqs'),
  about: icon('ic-tour'),
  helpCenter: icon('ic-blog'),
  privacy: icon('ic-lock'),
  terms: icon('ic-file'),
  support: icon('ic-chat'),
  recent: icon('ic-recent'),
  recipies: icon('ic-recipies'),
  groceryList: <Iconify width={22} icon="solar:cart-large-2-bold-duotone" />,
};

export const navDataAdmin = [
  {
    items: [
      { title: 'Dashboard', path: paths.adminDashboard.root, icon: ICONS.dashboard },
      {
        title: 'App content',
        path: '#app-content',
        icon: ICONS.menuItem,
        children: [
          { title: 'Countries', path: paths.adminDashboard.modules.countries, icon: ICONS.tour },
          { title: 'Age groups', path: paths.adminDashboard.modules.ageGroups, icon: ICONS.user },
          { title: 'Meals', path: paths.adminDashboard.modules.meals, icon: ICONS.recipies },
          { title: 'Recipes', path: paths.adminDashboard.modules.recipes, icon: ICONS.recipies },
          { title: 'Grocery lists', path: paths.adminDashboard.modules.groceryLists, icon: ICONS.groceryList },
          {
            title: 'Nutrition tags',
            path: paths.adminDashboard.modules.nutritionTags,
            icon: ICONS.label,
          },
          { title: 'Downloaded Resources', path: paths.adminDashboard.modules.resources, icon: ICONS.folder },

          {
            title: 'Languages',
            path: paths.adminDashboard.modules.translations,
            icon: ICONS.blog,
          },
          {
            title: 'Recent Activites',
            path: paths.adminDashboard.modules.activities,
            icon: ICONS.recent,
          },
        ],
      },
      {
        title: 'User hub',
        path: '#users-communication',
        icon: ICONS.userHub,
        children: [
          { title: 'Users', path: paths.adminDashboard.user.list, icon: ICONS.user },
          { title: 'Support', path: paths.adminDashboard.content.support, icon: ICONS.support },
        ],
      },
      {
        title: 'Help & legal',
        path: '#help-legal',
        icon: ICONS.helpCenter,
        children: [
          { title: "FAQ's", path: paths.adminDashboard.content.faqs, icon: ICONS.faqs },
          { title: 'About us', path: paths.adminDashboard.content.about, icon: ICONS.about },
          {
            title: 'Privacy policy',
            path: paths.adminDashboard.content.privacy,
            icon: ICONS.privacy,
          },
          {
            title: 'Terms of service',
            path: paths.adminDashboard.content.terms,
            icon: ICONS.terms,
          },
        ],
      },
    ],
  },
];
