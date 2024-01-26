'use client';
import * as React from 'react';
import NextAppDirEmotionCacheProvider from './EmotionCache';
import theme from './theme';

import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from '@mui/material/styles';
import { CssVarsProvider as JoyCssVarsProvider, getInitColorSchemeScript} from '@mui/joy/styles';
import CssBaseline from '@mui/material/CssBaseline';
const materialTheme = materialExtendTheme()
export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <NextAppDirEmotionCacheProvider options={{ key: 'joy' }}>
      <JoyCssVarsProvider>

      <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
          <CssBaseline enableColorScheme />
          {getInitColorSchemeScript()}
          {children}
        </MaterialCssVarsProvider>
      </JoyCssVarsProvider>

    </NextAppDirEmotionCacheProvider>
  );
}
