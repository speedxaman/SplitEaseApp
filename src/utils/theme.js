export const Colors = {
  // Premium Gradients (Cred-style)
  primary: '#5B21B6', // Deep purple
  primaryLight: '#7C3AED',
  primaryDark: '#4C1D95',
  
  // Gold/Orange Accents (Cred signature)
  accent: '#F59E0B',
  accentLight: '#FCD34D',
  accentDark: '#D97706',
  
  // Premium Secondary
  secondary: '#06B6D4', // Cyan accent
  secondaryLight: '#22D3EE',
  
  // Status
  success: '#10B981',
  successLight: '#6EE7B7',
  danger: '#EF4444',
  dangerLight: '#FCA5A5',
  warning: '#F59E0B',
  
  // Neutral - Light Mode
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  
  // Premium shades
  transparentPrimary: 'rgba(91, 33, 182, 0.1)',
  transparentAccent: 'rgba(245, 158, 11, 0.1)',
};

// Light Mode Theme - Premium
export const LightTheme = {
  bg: {
    primary: '#FAFBFC',
    secondary: '#FFFFFF',
    tertiary: '#F0F3FF',
  },
  text: {
    primary: '#0F1419',
    secondary: '#5B6470',
    tertiary: '#8B92A1',
  },
  border: '#E5E8EF',
  card: '#FFFFFF',
  input: '#F5F7FB',
  gradient: ['#FAFBFC', '#F5F7FB'],
};

// Dark Mode Theme - Premium
export const DarkTheme = {
  bg: {
    primary: '#0A0E27',
    secondary: '#1A1F3A',
    tertiary: '#252D4D',
  },
  text: {
    primary: '#F5F7FA',
    secondary: '#B8BEC9',
    tertiary: '#8B92A1',
  },
  border: '#2D3548',
  card: '#1A1F3A',
  input: '#252D4D',
  gradient: ['#0A0E27', '#1A1F3A'],
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const BorderRadius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  round: 50,
};

export const Typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
};

export const Shadows = {
  sm: {
    shadowColor: '#5B21B6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#5B21B6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  lg: {
    shadowColor: '#5B21B6',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  xlg: {
    shadowColor: '#5B21B6',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.18,
    shadowRadius: 32,
    elevation: 16,
  },
};
