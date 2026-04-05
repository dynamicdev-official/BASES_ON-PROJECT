import { Box, Button, darken, makeStyles } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { MESSAGE_TYPE, NotifierMessage } from '../components/FormComponents';
import { FinalNotifyContent } from '../helpers/Notifier';
import PropTypes from 'prop-types';
import CustomPropTypes from '../custom_prop_types';

const contentBg = '#1a1a2e';
const loginBtnBg = '#7F1D1D';

const useStyles = makeStyles((theme)=>({
  root: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    display: 'flex',
    justifyContent: 'center',
    height: '100%',
  },
  pageContent: {
    display: 'flex',
    flexDirection: 'column',
    padding: '16px',
    backgroundColor: contentBg,
    borderRadius: theme.shape.borderRadius,
    maxHeight: '100%',
    minWidth: '450px',
    maxWidth: '450px'
  },
  logo: {
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '1.4rem',
    fontWeight: '900',
    fontFamily: '"Arial Black", sans-serif',
    letterSpacing: '1px',
    '&::after': {
      content: '"BASES_ON"',
    },
  },
  item: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '15px',
    fontSize: '1.2rem'
  },
  button: {
    backgroundColor: loginBtnBg,
    color: '#fff',
    padding: '4px 8px',
    width: '100%',
    '&:hover': {
      backgroundColor: darken(loginBtnBg, 0.1),
    },
    '&.Mui-disabled': {
      opacity: 0.60,
      color: '#fff'
    },
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40px',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8rem',
    fontWeight: 500,
    fontFamily: '"Inter", sans-serif',
  }
}));

export function SecurityButton({...props}) {
  const classes = useStyles();
  return <Button type="submit" className={classes.button} {...props} />;
}

export default function BasePage({pageImage, title,  children, messages}) {
  const classes = useStyles();
  const snackbar = useSnackbar();

  useEffect(()=>{
    messages?.forEach((m)=>{
      snackbar.enqueueSnackbar(null, {
        autoHideDuration: null,
        content: (key)=>{
          if(Array.isArray(m[0])) m[0] = m[0][0];
          const type = Object.values(MESSAGE_TYPE).includes(m[0]) ? m[0] : MESSAGE_TYPE.INFO;
          return <FinalNotifyContent>
            <NotifierMessage type={type} message={m[1]} closable={true} onClose={()=>{snackbar.closeSnackbar(key);}} style={{maxWidth: '400px'}} />
          </FinalNotifyContent>;
        }
      });
    });
  }, [messages]);
  return (
    <Box className={classes.root}>
      <Box display="flex" minWidth="80%" gridGap='40px' alignItems="center" padding="20px 80px">
        <Box flexGrow={1} height="80%" textAlign="center">
          {pageImage}
        </Box>
        <Box className={classes.pageContent}>
          <Box className={classes.item}><div className={classes.logo} /></Box>
          <Box className={classes.item}>{title}</Box>
          <Box display="flex" flexDirection="column" minHeight={0}>{children}</Box>
        </Box>
      </Box>
      <Box className={classes.footer}>
        Copyright © 2026 dynamicdev_ | BASES_ON PROJECT.
      </Box>
    </Box>
  );
}

BasePage.propTypes = {
  pageImage: CustomPropTypes.children,
  title: PropTypes.string,
  children: CustomPropTypes.children,
  messages: PropTypes.arrayOf(PropTypes.array)
};
