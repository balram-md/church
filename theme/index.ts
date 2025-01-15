import {MD3LightTheme, configureFonts, useTheme} from 'react-native-paper';
import fontConfig from './fonts/fontConfig';
import {MD2Colors} from 'react-native-paper/lib/typescript/types';
import {light, dark} from './themes';
// @ts-ignore

const fonts = configureFonts({config: fontConfig});
const theme = {
  ...MD3LightTheme,
  fonts: {...fonts},
  colors: {
    ...MD3LightTheme.colors,
    ...light.colors,
  },
};

export type AppTheme = typeof theme;
export const useAppTheme = () => useTheme<AppTheme>();

export default theme;
