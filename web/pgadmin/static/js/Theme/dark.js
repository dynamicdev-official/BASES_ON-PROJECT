/////////////////////////////////////////////////////////////
//
// bases_on — Database Dashboard by dynamicdev_
//
// Copyright (C) 2024 - 2026, dynamicdev_ — All Rights Reserved
//
//////////////////////////////////////////////////////////////

/* The dark theme — bases_on red tone */
import { createTheme } from '@material-ui/core/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';

export default function(basicSettings) {
  return createTheme(basicSettings, {
    palette: {
      default: {
        main: '#6b6b6b',
        contrastText: '#fff',
        borderColor: '#2e2e2e',
        disabledBorderColor: '#2e2e2e',
        disabledContrastText: '#fff',
        hoverMain: '#303030',
        hoverContrastText: '#fff',
        hoverBorderColor: '#151515',
      },
      primary: {
        main: '#7F1D1D',
        light: '#3B1111',
        contrastText: '#fff',
        hoverMain: darken('#7F1D1D', 0.25),
        hoverBorderColor: darken('#7F1D1D', 0.25),
        disabledMain: '#7F1D1D',
      },
      success:  {
        main: '#26852B',
        light: '#2B472C',
        contrastText: '#000',
      },
      error: {
        main: '#da6758',
        light: '#212121',
        contrastText: '#fff',
        lighter: '#212121',
      },
      warning: {
        main: '#eea236',
        light: '#b18d5a',
        contrastText: '#fff',
      },
      info: {
        main: '#fde74c',
      },
      grey: {
        '200': '#424242',
        '400': '#303030',
        '600': '#2e2e2e',
        '800': '#212121',
      },
      text: {
        primary: '#d4d4d4',
        muted: '#8A8A8A',
      },
      checkbox: {
        disabled: '#6b6b6b'
      },
      background: {
        paper: '#212121',
        default: '#212121',
      },
      typography: {
        fontFamily: '"Inter", sans-serif',
        fontWeightLight: 400,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
        fontWeightBold: 700,
        h1: { fontWeight: 700 },
        h2: { fontWeight: 700 },
        h3: { fontWeight: 700 },
        h4: { fontWeight: 700 },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
      },
    },
    custom: {
      icon: {
        main: '#6b6b6b',
        contrastText: '#fff',
        borderColor: darken('#2e2e2e', 0.6),
        disabledMain: '#6b6b6b',
        disabledContrastText: '#fff',
        disabledBorderColor: '#2e2e2e',
        hoverMain: '#303030',
        hoverContrastText: '#fff',
      }
    },
    otherVars: {
      borderColor: '#4a4a4a',
      inputBorderColor: '#6b6b6b',
      inputDisabledBg: 'inherit',
      errorColor: '#DA6758',
      headerBg: '#424242',
      activeBorder: '#7F1D1D',
      activeColor: '#7F1D1D',
      tableBg: '#424242',
      activeStepBg: '#7F1D1D',
      activeStepFg: '#FFFFFF',
      stepBg: '#FFFFFF',
      stepFg: '#000',
      toggleBtnBg: '#000',
      editorToolbarBg: '#303030',
      qtDatagridBg: '#2e2e2e',
      qtDatagridSelectFg: '#d4d4d4',
      cardHeaderBg: '#424242',
      colorFg: '#FFFFFF',
      emptySpaceBg: '#212121',
      textMuted: '#8A8A8A',
      erdCanvasBg: '#303030',
      erdGridColor: '#444952',
      schemaDiff: {
        diffRowColor: '#807a48',
        sourceRowColor: '#402025',
        targetRowColor: '#6b5438',
        diffColorFg: '#d4d4d4',
        diffSelectFG: '#d4d4d4',
        diffSelCheckbox: '#3B1111'
      },
      editor: {
        fg: '#fff',
        bg: '#212121',
        selectionBg: '#5C2020',
        keyword: '#7F1D1D',
        number: '#7fcc5c',
        string: '#e4e487',
        variable: '#7dc9f1',
        type: '#7dc9f1',
        comment: '#7fcc5c',
        punctuation: '#d6aaaa',
        operator: '#d6aaaa',
        ////
        foldmarker: '#EF4444',
        activeline: '#2D1515',
        activelineLight: '#2D1515',
        activelineBorderColor: 'none',
        guttersBg: '#303030',
        guttersFg: '#8A8A8A',
      },
    }
  });
}
