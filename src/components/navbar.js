import React from 'react';
import { useMediaQuery } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

import dogLogo from '../assets/dog-api-logo.svg';

import {Drawer, List, ListItemIcon, ListItemText, ListItem} from '@material-ui/core'
import { Language, GitHub, Pets } from '@material-ui/icons';

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
        border: '0px'
    },
    drawerBackground: {
        width: drawerWidth,
        flexShrink: 0,
        paddingTop: '50px',
        textAlign: 'left',
        background: '#eee',
        border: '0px'
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    compressList: {
        padding: '0px'
    },
    ListIcon: {
        minWidth: '25px',
        width: '10%',
        color: 'black',
    },
    link:{
        outline: 'none',
        textDecoration: 'none',
        color: 'black',
    }
}));

function Navbar ( {children} ) {
    const classes = useStyles();
    const isMobile = useMediaQuery('(max-width: 850px');

    return (
        <div className={classes.root}>
            {!isMobile && <Drawer
                variant="permanent"
                className={classes.drawer}
                classes={{paper: classes.drawerBackground}}
                open
            >
                <h3 style={{textAlign: 'center'}}>Resources</h3>
                <div style={{padding: '20px'}}>
                    <img src={dogLogo} alt={''}/>
                    <h2 style={{paddingLeft: '15px'}}>DOG CEO</h2>
                    <List>
                        <a className={classes.link} href='https://dog.ceo/'>
                            <ListItem className={classes.compressList} button >
                                <ListItemIcon className={classes.ListIcon}><Language fontSize="small"/></ListItemIcon>
                                <ListItemText primary='Website' />
                            </ListItem>
                        </a>
                        <a className={classes.link} href='https://dog.ceo/dog-api/'>
                            <ListItem className={classes.compressList} button >
                                <ListItemIcon className={classes.ListIcon}><Pets fontSize="small"/></ListItemIcon>
                                <ListItemText primary='Dog.API' />
                            </ListItem>
                        </a>
                        <a className={classes.link} href='https://github.com/ElliottLandsborough/dog-ceo-api'>
                            <ListItem className={classes.compressList} button >
                                <ListItemIcon className={classes.ListIcon}><GitHub fontSize="small"/></ListItemIcon>
                                <ListItemText primary='Github' />
                            </ListItem>
                        </a>
                    </List>
                    <br/>
                    <hr/>
                    <h2 style={{paddingLeft: '15px'}}>Classification</h2>
                    <h4 style={{marginBottom: '15px'}}>@tensorflow-models/mobilenet</h4>
                    <List>
                        <a className={classes.link} href='https://www.npmjs.com/package/@tensorflow-models/mobilenet'>
                            <ListItem className={classes.compressList} button >
                                <ListItemIcon className={classes.ListIcon}><Language fontSize="small"/></ListItemIcon>
                                <ListItemText primary='npm Docs' />
                            </ListItem>
                        </a>
                        <a className={classes.link} href='https://github.com/tensorflow/tfjs-models/tree/master/mobilenet'>
                            <ListItem className={classes.compressList} button >
                                <ListItemIcon className={classes.ListIcon}><GitHub fontSize="small"/></ListItemIcon>
                                <ListItemText primary='Github' />
                            </ListItem>
                        </a>
                    </List>
                </div>
            </Drawer>}
            <main className={classes.content}>
                {children}
            </main>
        </div>
    );
}

export default Navbar;
