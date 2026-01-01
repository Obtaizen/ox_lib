import { MantineTheme, MantineThemeOverride } from '@mantine/core';

// Arc Raiders-inspired palette and typography
const slate = ['#f5f7fa', '#dfe2e7', '#c7ccd4', '#a7afb8', '#828b95', '#5a6069', '#3b4047', '#2a2f35', '#1c2025', '#111418'];
const accent = ['#fff4ec', '#ffd9ba', '#ffbf8d', '#ffa45e', '#ff8b37', '#ff7a29', '#e66313', '#b74f0f', '#8d3c0b', '#632a07'];
const teal = ['#e9fcfb', '#c6f5f2', '#9fece6', '#77e2da', '#55d9cf', '#33d0c4', '#29b6ab', '#1f9188', '#166c66', '#0d4744'];

export const theme: MantineThemeOverride = {
  colorScheme: 'dark',
  fontFamily: 'Space Grotesk, \"Roboto Condensed\", Roboto, \"Helvetica Neue\", Arial, sans-serif',
  radius: { xs: 2, sm: 3, md: 4, lg: 6, xl: 8 },
  primaryColor: 'accent',
  defaultRadius: 'sm',
  colors: {
    dark: slate as any,
    accent: accent as any,
    tealish: teal as any,
  },
  shadows: {
    xs: '0px 1px 2px rgba(0,0,0,0.35)',
    sm: '0px 2px 6px rgba(0,0,0,0.45)',
    md: '0px 6px 14px rgba(0,0,0,0.4)',
  },
  components: {
    Button: {
      defaultProps: {
        uppercase: true,
        size: 'sm',
      },
      styles: (theme: MantineTheme) => ({
        root: {
          letterSpacing: 0.6,
          fontWeight: 700,
          borderRadius: theme.radius.sm,
          textShadow: '0 1px 0 rgba(0,0,0,0.25)',
          boxShadow: theme.shadows.xs,
        },
      }),
    },
    Modal: {
      styles: {
        header: {
          marginBottom: 4,
        },
        title: {
          letterSpacing: 0.4,
          fontWeight: 700,
        },
        body: {
          paddingTop: 6,
        },
      },
    },
  },
};
