import { Box, makeStyles } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { PrimaryButton } from './components/Buttons';
import { PgMenu, PgMenuDivider, PgMenuItem, PgSubMenu } from './components/Menu';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import { usePgAdmin } from '../../static/js/BrowserComponent';

const useStyles = makeStyles((theme)=>({
  root: {
    height: '30px',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: '0 0.5rem',
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    width: '35px',
    height: '100%',
    background: 'url(/static/img/logo-128.png) 4px center / contain no-repeat',
  },
  menus: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    marginLeft: '16px',

    '& .MuiButton-containedPrimary': {
      padding: '1px 8px',
    }
  },
  userMenu: {
    marginLeft: 'auto',
    '& .MuiButton-containedPrimary': {
      fontSize: '0.825rem',
    }
  },
  gravatar: {
    marginRight: '4px',
  }
}));



export default function AppMenuBar() {
  const classes = useStyles();
  const [,setRefresh] = useState(false);
  const pgAdmin = usePgAdmin();

  const reRenderMenus = ()=>setRefresh((prev)=>!prev);

  useEffect(()=>{
    pgAdmin.Browser.Events.on('pgadmin:nw-enable-disable-menu-items', _.debounce(()=>{
      reRenderMenus();
    }, 100));
    pgAdmin.Browser.Events.on('pgadmin:nw-refresh-menu-item', _.debounce(()=>{
      reRenderMenus();
    }, 100));
  }, []);

  const getPgMenuItem = (menuItem, i)=>{
    if(menuItem.type == 'separator') {
      return <PgMenuDivider key={i}/>;
    }
    const hasCheck = typeof menuItem.checked == 'boolean';

    return <PgMenuItem
      key={i}
      disabled={menuItem.isDisabled}
      onClick={()=>{
        menuItem.callback();
        if(hasCheck) {
          reRenderMenus();
        }
      }}
      hasCheck={hasCheck}
      checked={menuItem.checked}
      closeOnCheck={true}
    >{menuItem.label}</PgMenuItem>;
  };

  const userMenuInfo = pgAdmin.Browser.utils.userMenuInfo;

  return(
    <>
      <Box className={classes.root} data-test="app-menu-bar">
        <div className={classes.logo} />
        <span style={{color: '#fff', fontWeight: '800', fontSize: '1rem', fontFamily: '"Inter", sans-serif', letterSpacing: '0.2px', marginLeft: '-2px'}}>Bases_on</span>
        <div className={classes.menus}>
          {pgAdmin.Browser.MainMenus?.map((menu)=>{
            return (
              <PgMenu
                menuButton={<PrimaryButton key={menu.label} data-label={menu.label}>{menu.label}<KeyboardArrowDownIcon fontSize="small" /></PrimaryButton>}
                label={menu.label}
                key={menu.name}
              >
                {menu.getMenuItems().map((menuItem, i)=>{
                  const submenus = menuItem.getMenuItems();
                  if(submenus) {
                    return <PgSubMenu key={menuItem.label} label={menuItem.label}>
                      {submenus.map((submenuItem, si)=>{
                        return getPgMenuItem(submenuItem, si);
                      })}
                    </PgSubMenu>;
                  }
                  return getPgMenuItem(menuItem, i);
                })}
              </PgMenu>
            );
          })}
        </div>
        {userMenuInfo &&
        <div className={classes.userMenu}>
          <PgMenu
            menuButton={
              <PrimaryButton data-test="loggedin-username">
                <div className={classes.gravatar}>
                  {userMenuInfo.gravatar &&
                  <img src={userMenuInfo.gravatar} width = "18" height = "18"
                    alt ={`Gravatar image for ${ userMenuInfo.username }`} />}
                  {!userMenuInfo.gravatar && <AccountCircleRoundedIcon />}
                </div>
                { userMenuInfo.username } ({userMenuInfo.auth_source})
                <KeyboardArrowDownIcon fontSize="small" />
              </PrimaryButton>
            }
            label={userMenuInfo.username}
            align="end"
          >
            {userMenuInfo.menus.map((menuItem, i)=>{
              return getPgMenuItem(menuItem, i);
            })}
          </PgMenu>
        </div>}
      </Box>
    </>
  );
}
