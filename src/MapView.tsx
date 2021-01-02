import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, MapConsumer } from "react-leaflet";
import { Icon, LatLng, LatLngTuple, Map } from "leaflet";
import { OSMSupermarket } from './OSMData';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import SplitButton from 'react-bootstrap/SplitButton';
import Dropdown from 'react-bootstrap/Dropdown';
import LocateControl from './LocateControl';
import Spinner from 'react-bootstrap/Spinner';
import SearchControl from './GeoSearchControl';
import MapMenuButton from './MapMenuButton';
import './MapView.css';
import L from 'leaflet';
import { useTranslation } from 'react-i18next';
const queryOverpass = require('@derhuerst/query-overpass')

const initialCenter: LatLngTuple = [48.1351, 11.5820]

const radii = [1, 2, 3, 5, 10, 15]

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

// Marker that opens it its popup on creation.
const OpenPopupMarker = (props: any) => {

    const myref = useRef<typeof Marker | null>(null)

    useEffect(() => {
        // This does not type for some reason:
        // myref.current?.openPopup()
        if (myref.current) {
            const myany: any = myref.current
            myany.openPopup()
        }
    })

    return <Marker ref={myref} {...props} />
}

const HomeMarker = ({ pos, query }: { pos: LatLng, query: (radius?: number) => void }) => {

    const [loading, setLoading] = useState(false)

    const doQuery = (radius?: number) => {
        setLoading(true)
        query(radius)
    }

    const t = useTranslation('map').t
    const tt = useTranslation('common').t

    return (
        <OpenPopupMarker position={pos} icon={goldMarker} >
            <Popup>
                {loading ?
                    (<Button
                        variant="outline-primary"
                        disabled={loading}
                    >
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="mr-2"
                        />
                        {tt('Loading...')}
                    </Button>) :
                    (<SplitButton
                        id="radius-button"
                        variant="outline-primary"
                        title={t('Find shops')}
                        onClick={() => doQuery(undefined)}
                        disabled={loading}
                    >
                        {radii.map(radius => {
                            return (
                                <Dropdown.Item
                                    eventKey={radius.toString()}
                                    onClick={() => doQuery(radius)}
                                >
                                    {`${t('Radius')}: ${radius} km`}
                                </Dropdown.Item>)
                        })}
                        <Dropdown.Divider />
                    </SplitButton>)}
            </Popup>
        </OpenPopupMarker >
    )
}

function MapView({
    onStartTagging, onStopTagging, tagging,
    onUpdateMarkets, onOpenMenu,
    supermarkets, selectedMarkets, setMap
}:
    {
        onStartTagging: (supermarket: OSMSupermarket) => void,
        onStopTagging: () => void,
        tagging: boolean,
        onUpdateMarkets: callbackType,
        onOpenMenu: () => void,
        supermarkets: OSMSupermarket[] | null,
        selectedMarkets: number[],
        setMap: (map: Map) => void
    }) {

    const [homePosition, setHomePosition] = useState<LatLng | null>(null)
    const [map, updMap] = useState<Map | undefined>(undefined)

    const onFindProducts = (supermarkets: OSMSupermarket) => {
        onUpdateMarkets([supermarkets])
    }

    const queryMarkets = (radius?: number) => {
        let queryArea: string;
        if (!radius && map) {
            const bounds = map.getBounds()
            const [s, e, n, w] = [bounds.getSouth(), bounds.getEast(), bounds.getNorth(), bounds.getWest()]
            queryArea = `(${s}, ${w}, ${n}, ${e})`
        }
        else {
            const pos = homePosition
            if (pos === null) return
            radius = radius ? radius : 1
            queryArea = `(around:${radius * 1000}, ${pos.lat}, ${pos.lng})`
        }
        const query = `
            [out:json][timeout:25];
            node
                [shop=supermarket]
                ${queryArea};
                out;
        `;
        queryOverpass(query, { fetchMode: 'cors' })
            .then(onUpdateMarkets)
            .then(() => setHomePosition(null))
            .catch(console.error)
    }

    const flyHome = (pos: LatLng) => {
        setHomePosition(pos)
        if (map) {
            map.flyTo(pos, map.getZoom())
        }
    }

    function MapEvents() {
        useMapEvents({
            click: e => {
                setHomePosition(e.latlng)
            },
            locationfound: (e) => {
                flyHome(e.latlng)
            }
        })
        return null
    }

    const onSearchLocate = (e: any) => {
        flyHome(L.latLng(e.location.y, e.location.x))
    }

    const t = useTranslation('map').t
    const tt = useTranslation('common').t

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
                                    {data.name ? data.name : t('Unknown')}
                                </Card.Title>
                                {data.brand ? (<Card.Text>{`${tt('Brand')}: ${data.brand}`}</Card.Text>) : null}
                                {data["addr:street"] !== undefined ? (<Card.Text>{address} </Card.Text>) : null}
                                <Button
                                    variant="outline-primary"
                                    onClick={_ => tagging ? onStopTagging() : onFindProducts(market)}>
                                    {t('Find products')}
                                </Button>
                                <Button
                                    variant="outline-secondary"
                                    onClick={_ => tagging ? onStopTagging() : onStartTagging(market)}
                                    className="mt-2"
                                    style={{ display: "block" }}
                                >
                                    {tagging ? tt('Stop tagging') : tt('Tag products')}
                                </Button>
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
        <>
            <MapContainer center={initialCenter} zoom={13} scrollWheelZoom={false} >
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapEvents />
                <MapConsumer>
                    {(map) => {
                        setMap(map)
                        updMap(map)
                        map.on('geosearch/showlocation', onSearchLocate)
                        return null
                    }}
                </MapConsumer>
                <MapMenuButton onClick={() => onOpenMenu()} />
                <SearchControl style={"bar"} showMarker={false} showPopup={false}
                    retainZoomLevel={true} autoClose={true}
                    searchLabel={t('Enter address')} keepResult={true} />
                <LocateControl keepCurrentZoomLevel={true} drawMarker={false} />
                {homePosition ? <HomeMarker pos={homePosition} query={queryMarkets} /> : null}
                {getMarkets()}
            </MapContainer>
        </>
    )
}

export default MapView;