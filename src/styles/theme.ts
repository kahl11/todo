// Theme configuration for consistent styling across the app
export const theme = {
  // Color schemes
  colors: {
    primary: {
      bg: 'bg-indigo-600',
      bgHover: 'hover:bg-indigo-700',
      text: 'text-indigo-600',
      textHover: 'hover:text-indigo-700',
      border: 'border-indigo-600',
      ring: 'focus:ring-indigo-500',
    },
    gray: {
      bg: 'bg-gray-100 dark:bg-gray-700',
      bgHover: 'hover:bg-gray-200 dark:hover:bg-gray-600',
      text: 'text-gray-600 dark:text-gray-400',
      textHover: 'hover:text-gray-700 dark:hover:text-gray-300',
      textSecondary: 'text-gray-500 dark:text-gray-400',
      border: 'border-gray-300 dark:border-gray-600',
    },
    surface: {
      primary: 'bg-white dark:bg-gray-800',
      secondary: 'bg-gray-50 dark:bg-gray-900',
      border: 'border-gray-200 dark:border-gray-700',
    },
    text: {
      primary: 'text-gray-900 dark:text-gray-100',
      secondary: 'text-gray-600 dark:text-gray-400',
      muted: 'text-gray-500 dark:text-gray-500',
    },
    status: {
      success: {
        bg: 'bg-green-100 dark:bg-green-900',
        text: 'text-green-600 dark:text-green-400',
        border: 'border-green-300 dark:border-green-600',
      },
      warning: {
        bg: 'bg-orange-100 dark:bg-orange-900',
        text: 'text-orange-600 dark:text-orange-400',
        border: 'border-orange-300 dark:border-orange-600',
      },
      error: {
        bg: 'bg-red-100 dark:bg-red-900',
        text: 'text-red-600 dark:text-red-400',
        border: 'border-red-300 dark:border-red-600',
      },
    },
  },

  // Common component styles
  components: {
    // Button variants
    button: {
      primary: `bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium 
               flex items-center space-x-2 transition-colors duration-200`,
      secondary: `text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 
                 px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors duration-200`,
      danger: `text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 
              px-4 py-2 rounded-lg transition-colors duration-200`,
      ghost: `text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 
             p-2 rounded-lg transition-colors duration-200`,
    },

    // Card styles
    card: {
      base: `bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700`,
      hover: `hover:shadow-md transition-shadow duration-200`,
      interactive: `bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 
                   hover:shadow-md transition-shadow duration-200`,
      header: `p-6 border-b border-gray-200 dark:border-gray-700`,
      content: `p-6`,
    },

    // Input styles
    input: {
      base: `w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
            focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
            bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
            placeholder-gray-500 dark:placeholder-gray-400`,
      textarea: `w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none 
                focus:ring-2 focus:ring-indigo-500 focus:border-transparent 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                placeholder-gray-500 dark:placeholder-gray-400`,
    },

    // Badge styles
    badge: {
      base: `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border`,
      success: `bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-700`,
      warning: `bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-300 dark:border-orange-700`,
      error: `bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-700`,
    },

    // Modal styles
    modal: {
      overlay: `fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50`,
      content: `bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md`,
    },

    // Layout styles
    layout: {
      page: `min-h-screen bg-gray-50 dark:bg-gray-900`,
      header: `bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700`,
      container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`,
      section: `grid grid-cols-1 md:grid-cols-3 gap-6`,
    },

    // Icon containers
    iconContainer: {
      primary: `h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center`,
      success: `h-12 w-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center`,
      warning: `h-12 w-12 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center`,
      small: `h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center`,
    },

    // Empty states
    empty: {
      container: `text-center py-12`,
      icon: `h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4`,
      title: `text-lg font-medium text-gray-900 dark:text-gray-100 mb-2`,
      description: `text-gray-600 dark:text-gray-400 mb-4`,
    },

    // Loading states
    loading: {
      spinner: `animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600`,
      pulse: `animate-pulse flex space-x-4`,
      skeleton: `h-4 bg-gray-300 dark:bg-gray-600 rounded`,
    },
  },

  // Animation classes
  animations: {
    transition: 'transition-colors duration-200',
    fadeIn: 'transition-opacity duration-200',
    slideIn: 'transition-transform duration-200',
    bounce: 'transition-transform duration-150',
  },

  // Spacing utilities
  spacing: {
    section: 'space-y-6',
    items: 'space-x-4',
    itemsVertical: 'space-y-3',
    padding: {
      page: 'py-8',
      section: 'p-6',
      card: 'p-4',
    },
  },
};

// Helper function to combine theme classes
export const cn = (...classes: (string | undefined | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// Theme class getters for common patterns
export const getButtonClass = (variant: keyof typeof theme.components.button = 'primary') => {
  return theme.components.button[variant];
};

export const getCardClass = (interactive = false) => {
  return interactive ? theme.components.card.interactive : theme.components.card.base;
};

export const getBadgeClass = (variant: keyof typeof theme.components.badge = 'base') => {
  return `${theme.components.badge.base} ${theme.components.badge[variant]}`;
};
