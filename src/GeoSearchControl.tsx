import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import { createControlComponent } from '@react-leaflet/core';
import 'leaflet-geosearch/dist/geosearch.css';

const provider = new OpenStreetMapProvider();

const SearchControl = createControlComponent(
    (props: any) => {
        const search = new GeoSearchControl({ ...props, provider });
        return search
    }
)

export default SearchControl;