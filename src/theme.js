import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3a6ea8', // soft blue
    accent: '#7a8ca3', // soft gray-blue
    inbound: '#3a6ea8',
    outbound: '#b3c6e6',
    transfer: '#eaf2fb',
    background: '#f7fafd',
    surface: '#fff',
    text: '#222',
    subtext: '#7a8ca3',
    border: '#e3eaf3',
  },
  roundness: 18,
};