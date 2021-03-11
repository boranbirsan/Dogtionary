import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import dogLogo from '../assets/dog-api-logo.svg';

import {Drawer} from '@material-ui/core'

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
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    link:{
        outline: 'none',
        textDecoration: 'none',
        color: 'black',
        paddingBottom: '10px',
        display: 'block'
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
                <h1 style={{textAlign: 'center'}}>Resources</h1>
                <div style={{padding: '20px'}}>
                    <img src={dogLogo} alt={''}/>
                    <h2 style={{paddingLeft: '15px'}}>DOG CEO</h2>
                    <a className={classes.link} href='https://dog.ceo'>Website</a>
                    <a className={classes.link} href='https://dog.ceo/dog-api/'>Dog.API</a>
                    <a className={classes.link} href='https://github.com/ElliottLandsborough/dog-ceo-api'>Github</a>
                    <br/>
                    <hr/>
                    <h2 style={{paddingLeft: '15px'}}>Classification</h2>
                    <h4>@tensorflow-models/mobilenet</h4>
                    <a className={classes.link} href='https://www.npmjs.com/package/@tensorflow-models/mobilenet'>npm</a>
                    <a className={classes.link} href='https://github.com/tensorflow/tfjs-models/tree/master/mobilenet'>Github</a>
                </div>
            </Drawer>
            <main className={classes.content}>
                {children}
            </main>
        </div>
    );
}

export default Navbar;
