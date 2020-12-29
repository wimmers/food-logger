import React from "react";
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InfoIcon from '@material-ui/icons/Info';
import HelpIcon from '@material-ui/icons/Help';
import CheckIcon from '@material-ui/icons/Check';
import CropFreeIcon from '@material-ui/icons/CropFree';
import { useTranslation } from 'react-i18next';
import './Menu.css';

type MenuElement = [string, JSX.Element, () => void]

function makeListItems(elements: MenuElement[]) {
    return elements.map(([text, icon, onClick]) => (
        <ListItem button key={text} onClick={onClick}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={text} />
        </ListItem>
    ))
}

function Menu({ open, onClose, onTagProducts, tagging }: {
    open: boolean,
    onClose: () => void,
    onTagProducts: () => void,
    tagging: boolean
}) {

    const t = useTranslation('menu').t
    const tt = useTranslation('common').t

    const mainElements: MenuElement[] = [
        [   
            tagging ? tt("Stop tagging") : tt("Tag products"),
            <CheckIcon />,
            onTagProducts
        ],
        [t("Scan barcode"), <CropFreeIcon />, () => { }]
    ]

    const infoElements: MenuElement[] = [
        [t("FAQ"), < HelpIcon />, () => { }],
        [t("About"), <InfoIcon />, () => { }]
    ]

    const list = () => (
        <div
            role="presentation"
            className="menu"
        >
            <List>
                {makeListItems(mainElements)}
            </List>
            <Divider />
            <List>
                {makeListItems(infoElements)}
            </List>
        </div>
    );

    return (
        <Drawer anchor={'right'} open={open} onClose={onClose}>
            {list()}
        </Drawer>
    )
}

export default Menu;