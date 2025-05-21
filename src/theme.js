import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4285F4',
    accent: '#1a73e8',
    inbound: '#1a73e8',
    outbound: '#ea4335',
    transfer: '#fbbc04',
    background: '#f8f9fa',
    surface: '#ffffff',
    text: '#202124',
    subtext: '#5f6368',
    border: '#dadce0',
  },
  roundness: 8,
};