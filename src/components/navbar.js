import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import dogLogo from '../assets/dog-api-logo.svg';

import {Drawer, Grid} from '@material-ui/core'

const drawerWidth = 300;

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        zIndex: 1,
        overflow: 'hidden',
        display: 'flex',
        position: 'relative',
        minHeight: '100vh',
        width: '100vw',
    },
    drawer: {
        width: drawerWidth,
    },
    drawerBackground: {
            width: drawerWidth,
            flexShrink: 0,
            paddingTop: '50px',
            textAlign: 'left',
            background: '#E5EEFD',
    },
    panelTitle: {
        textAlign: 'center',
    },
    panelPadding: {
        padding: '20px',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    }
}));

function Navbar ( {children} ) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Drawer
                variant="permanent"
                className={classes.drawer}
                classes={{paper: classes.drawerBackground}}
                open
            >
                <h1 className={classes.panelTitle}>Resources</h1>
                <div className={classes.panelPadding}>
                    <img src={dogLogo}/>
                    <h2>DOG CEO</h2>
                    <p>Website</p>
                    <p>Dog.API</p>
                    <p>Github</p>
                </div>
            </Drawer>
            <main className={classes.content}>
                {children}
            </main>
        </div>
    );
}

export default Navbar;
