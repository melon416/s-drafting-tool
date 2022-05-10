import { initializeIcons } from '@uifabric/icons';
import './assets/css/source-sans-pro/source-sans-pro.css';
import { loadTheme } from 'office-ui-fabric-react';

initializeIcons('/fabric-icons/');

loadTheme({
  defaultFontStyle: { fontFamily: '"Source Sans Pro", sans-serif' },
  palette: {
    themePrimary: '#cc3333',
    themeLighterAlt: '#fdf5f5',
    themeLighter: '#f7d9d9',
    themeLight: '#f0baba',
    themeTertiary: '#e07b7b',
    themeSecondary: '#d24747',
    themeDarkAlt: '#b82e2e',
    themeDark: '#9b2727',
    themeDarker: '#721d1d',
    neutralLighterAlt: '#f8f8f8',
    neutralLighter: '#f4f4f4',
    neutralLight: '#eaeaea',
    neutralQuaternaryAlt: '#dadada',
    neutralQuaternary: '#d0d0d0',
    neutralTertiaryAlt: '#c8c8c8',
    neutralTertiary: '#aab1b6',
    neutralSecondary: '#90999f',
    neutralPrimaryAlt: '#788187',
    neutralPrimary: '#202528',
    neutralDark: '#4a5358',
    black: '#353c40',
    white: '#ffffff',
  },
});
