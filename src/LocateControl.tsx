import { useEffect } from "react";
import Locate from "leaflet.locatecontrol";
import L from 'leaflet';
import { createControlComponent } from '@react-leaflet/core';
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css';

const _ = Locate

const LocateControl = createControlComponent(
    (props) => L.control.locate()
)

export default LocateControl;