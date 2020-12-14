import L from 'leaflet';
import { createControlComponent } from '@react-leaflet/core';
import EasyButton from 'leaflet-easybutton';
import 'leaflet-easybutton/src/easy-button.css';

const _ = EasyButton

const MenuButton = createControlComponent(
    (props: any) => {
        return L.easyButton({
            id: 'menu-map-button',
            position: 'topright',
            leafletClasses: true,
            states: [{
                stateName: 'open-menu',
                onClick: (_btn, _map) => {
                    props.onClick()
                },
                title: 'open menu',
                icon: 'fa-bars'
            }]
        });
    })

export default MenuButton