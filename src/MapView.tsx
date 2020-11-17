import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, MapConsumer } from "react-leaflet";
import { Icon, LatLng, LatLngTuple, Map } from "leaflet";
import { OSMSupermarket } from './OSMData';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/esm/Card';
const queryOverpass = require('@derhuerst/query-overpass')
import './MapView.css';

const initialCenter: LatLngTuple = [48.1351, 11.5820]

// See: https://github.com/pointhi/leaflet-color-markers
// Better alternative? https://github.com/lvoogdt/Leaflet.awesome-markers
const blackMarker = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-black.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
});

const goldMarker = new Icon.Default({
    className: 'huechange-190'
});

const redMarker = new Icon.Default({
    className: 'huechange-140'
});

const greenMarker = new Icon.Default({
    className: 'huechange-280'
});

const defaultMarker = new Icon.Default()

type callbackType = (supermarkets: OSMSupermarket[]) => void

function MapView({ onUpdateMarkets, supermarkets, selectedMarkets, setMap }:
    {
        onUpdateMarkets: callbackType,
        supermarkets: OSMSupermarket[] | null,
        selectedMarkets: number[],
        setMap: (map: Map) => void
    }) {

    const [homePosition, setHomePosition] = useState<LatLng | null>(null)

    const updateMarkets = (supermarkets: OSMSupermarket[]) => {
        onUpdateMarkets(supermarkets)
    }

    const queryMarkets = () => {
        const pos = homePosition
        if (pos === null) return
        const query = `
            [out:json][timeout:25];
            node
                [shop=supermarket]
                (around:1000, ${pos.lat}, ${pos.lng});
                out;
        `;
        queryOverpass(query, { fetchMode: 'cors' })
            .then(updateMarkets)
            .catch(console.error)
    }

    function MapEvents() {
        useMapEvents({
            click: e => {
                // map.locate()
                setHomePosition(e.latlng)
            },
            locationfound: (location) => {
                console.log('location found:', location)
            },
        })
        return null
    }

    const getMarkets = () => {
        if (supermarkets === null) return null

        function makeMarket(market: OSMSupermarket) {
            const position: LatLngTuple = [market.lat, market.lon]
            const data = market.tags
            const nullableToString = (x: string | undefined) => {
                return (x !== undefined ? x : '')
            }
            const address = `${nullableToString(data["addr:street"])} ${nullableToString(data["addr:housenumber"])},
            ${nullableToString(data["addr:postcode"])} ${nullableToString(data["addr:city"])}
            `
            const icon = selectedMarkets.includes(market.id) ? greenMarker : defaultMarker
            const marker =
                <Marker position={position} key={market.id.toString()} icon={icon}>
                    <Popup>
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    {data.name ? data.name : 'Unknown'}
                                </Card.Title>
                                {data.brand ? (<Card.Text>{'Brand: ' + data.brand}</Card.Text>) : null}
                                {data["addr:street"] !== undefined ? (<Card.Text>{address} </Card.Text>) : null}
                                <Button variant="outline-primary" onClick={_ => updateMarkets([market])}>Find products at this shop</Button>
                            </Card.Body>
                        </Card>
                    </Popup>
                </Marker>
            return marker
        }
        return supermarkets.map((market, _index, _array) => {
            return makeMarket(market)
        })
    }

    return (
        <MapContainer center={initialCenter} zoom={13} scrollWheelZoom={false} >
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapEvents />
            <MapConsumer>
                {(map) => {
                    console.log('map center:', map.getCenter())
                    setMap(map)
                    return null
                }}
            </MapConsumer>
            {/* Marker for center position */}
            <Marker position={initialCenter} icon={redMarker}>
                <Popup>
                    This is Munich on OSM. <br /> Try to click somewhere else.
                </Popup>
            </Marker>
            {homePosition ?
                <Marker position={homePosition} icon={goldMarker}>
                    <Popup>
                        <Button variant="outline-primary" onClick={queryMarkets}>Find shops around here</Button>
                    </Popup>
                </Marker> : null
            }
            {getMarkets()}
        </MapContainer>
    )
}

export default MapView;