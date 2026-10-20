export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    VERIFY_OTP: 'auth/verify-otp/email',
    RESEND_OTP: 'auth/resend-otp/email',
    CHANGE_PASSWORD: 'auth/change-password',
    PROFILE: 'admin/user/profile',
    UPDATE_PROFILE: 'admin/user/profile',
    LOGOUT: '/auth/logout',
  },

  DASHBOARD: {
    ALL: 'admin/admin-panel/dashboard',
    WIDGETS: 'admin/admin-panel/dashboard/widgets',
    USER_STATUS: 'admin/admin-panel/dashboard/user-status',
    PLATFORM_HEALTH: 'admin/admin-panel/dashboard/platform-health',
    GROWTH_TREND: 'admin/admin-panel/dashboard/growth-trend',
    COUNTRY_GROWTH: 'admin/admin-panel/dashboard/country-growth',
    RECENT_ACTIVITIES: 'admin/admin-panel/dashboard/recent-activities',
    TOP_DOWNLOADED_RECIPES: 'admin/admin-panel/dashboard/top-downloaded-recipes',
    TOP_RECIPES: 'admin/admin-panel/dashboard/top-recipes',
    TOP_COUNTRIES: 'admin/admin-panel/dashboard/top-countries',
    APP_DOWNLOADS: 'admin/admin-panel/dashboard/app-downloads',
    DOWNLOADED_PDFS: 'download-pdf',
  },

  USERS: {
    ALL_USERS: 'admin/user/allUsers',
    USER_DETAILS: (id) => `admin/user/${id}`,
    UPDATE_USER: (id) => `admin/user/${id}/status`,
    DELETE_USER: (id) => `admin/user/${id}`,
  },

  LANGUAGES: {
    ALL_LANGUAGES: 'admin/languages',
    CREATE_LANGUAGE: 'admin/languages',
    UPDATE_LANGUAGE: (id) => `admin/languages/${id}`,
    DELETE_LANGUAGE: (id) => `admin/languages/${id}`,
  },

  COUNTRIES: {
    ALL_COUNTRIES: 'admin/countries',
    CREATE_COUNTRY: 'admin/countries',
    UPDATE_COUNTRY: (id) => `admin/countries/${id}`,
    DELETE_COUNTRY: (id) => `admin/countries/${id}`,
  },

  BABYSTAGES: {
    ALL_BABYSTAGES: 'baby-stages/admin/all',
    CREATE_BABYSTAGE: 'baby-stages',
    UPDATE_BABYSTAGE: (id) => `baby-stages/${id}`,
    DELETE_BABYSTAGE: (id) => `baby-stages/${id}`,
  },

  UPLOAD: {
    S3: 'upload/s3',
  },

  MEALS: {
    ALL_MEALS: 'meals/admin/all',
    CREATE_MEAL: 'meals/admin',
    UPDATE_MEAL: (id) => `meals/admin/${id}`,
    DELETE_MEAL: (id) => `meals/admin/${id}`,
  },

  GROCERY_LISTS: {
    ALL_GROCERY_LISTS: 'grocery-list/admin/all',
    GROCERY_LIST_DETAILS: (id) => `grocery-list/admin/${id}`,
  },

  RECIPES: {
    ALL_RECIPES: 'recipes/admin/all',
    CREATE_RECIPE: 'recipes/admin',
    RECIPE_DETAILS: (id) => `recipes/admin/${id}`,
    UPDATE_RECIPE: (id) => `recipes/admin/${id}`,
    DELETE_RECIPE: (id) => `recipes/admin/${id}`,
  },

  NUTRITIONS: {
    ALL_NUTRITIONS: 'nutrition/admin/all',
    CREATE_NUTRITION: 'nutrition/admin',
    UPDATE_NUTRITION: (id) => `nutrition/admin/${id}`,
    DELETE_NUTRITION: (id) => `nutrition/admin/${id}`,
  },

  ACTIVITY: {
    ACTIVITY_LOGS: 'admin/activities',
  },

  SUPPORT: {
    GET_LIST: 'admin/support',
    UPDATE_STATUS: (id) => `admin/support/status/${id}`,
    REPLY: (id) => `admin/support/${id}/reply`,
    DELETE: (id) => `admin/support/${id}`,
  },

  SETTINGS: {
    GET_TERMS: 'admin/settings/terms-conditions',
    UPDATE_TERMS: 'admin/settings/terms-conditions',
    GET_ABOUT: 'admin/settings/about-us',
    UPDATE_ABOUT: 'admin/settings/about-us',
    GET_PRIVACY: 'admin/settings/privacy-policy',
    UPDATE_PRIVACY: 'admin/settings/privacy-policy',
    GET_FAQ: 'admin/settings/faqs',
    CREATE_FAQ: 'admin/settings/faqs',
    UPDATE_FAQ: (id) => `admin/settings/faqs/${id}`,
    DELETE_FAQ: (id) => `admin/settings/faqs/${id}`,
  },

  WALLETS: '/wallets',
  WALLETS_BY_ID: (id) => `/wallets/${id}`,

  TRANSACTIONS: '/transactions',
  TRANSACTIONS_BY_ID: (id) => `/transactions/${id}`,

  CATEGORIES: '/categories',
  CATEGORIES_BY_ID: (id) => `/categories/${id}`,
};
