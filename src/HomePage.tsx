import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Map from "ol/Map";
import GeoJSON from "ol/format/GeoJSON";
import "ol/ol.css";
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import "ol-ext/dist/ol-ext.css";
import SearchNominatim from "ol-ext/control/SearchNominatim";
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Style, Fill, Stroke, Circle as CircleStyle } from 'ol/style';
import LayerSwitcher from "ol-ext/control/LayerSwitcher";
import VectorLayer from "ol/layer/Vector";

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const mapRef = useRef<Map | null>(null);
    const vectorSourceRef = useRef<VectorSource | null>(null);

    const [lastTwoLocations, setLastTwoLocations] = useState<[number[], number[]]>([[], []]);
    const [map, setMap] = useState<Map | null>(null);

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        navigate("/login");
    };

    const mapContainerStyle = { width: '100%', height: '1000px', border: '1px solid black' };

    useEffect(() => {
        const xyzSource = new XYZ({
            url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        });

        const timisoaraCoordinates = fromLonLat([21.2087, 45.7489]);

        const vectorSource = new VectorSource();
        vectorSourceRef.current = vectorSource;
        const vectorLayer = new VectorLayer({
            source: vectorSource,
        });

        const bikeLayerSource = new VectorSource({
            url: process.env.PUBLIC_URL + '/geojson/bike-lanes.geojson',
            format: new GeoJSON(),
        });

        const bikeLayer = new VectorLayer({
            source: bikeLayerSource,
            style: new Style({
                stroke: new Stroke({
                    color: 'blue',
                    width: 3,
                }),
            }),
        });

        const olMap = new Map({
            target: 'map',
            layers: [
                new TileLayer({ source: xyzSource }),
                vectorLayer,
                bikeLayer,
            ],
            view: new View({
                center: timisoaraCoordinates,
                zoom: 13,
            }),
        });
        mapRef.current = olMap;

        const layerSwitcher = new LayerSwitcher();
        olMap.addControl(layerSwitcher);

        const searchNominatim = new SearchNominatim({
            reverse: false,
            placeholder: 'Search for location...',
            maxItems: 10,
            minLength: 3,
        });
        olMap.addControl(searchNominatim);

        searchNominatim.on('select', (e) => {
            const coordinate = e.coordinate;

            const pointFeatureRed = new Feature({
                geometry: new Point(coordinate),
            });

            pointFeatureRed.setStyle(new Style({
                image: new CircleStyle({
                    radius: 7,
                    fill: new Fill({ color: 'red' }),
                    stroke: new Stroke({ color: 'white', width: 2 }),
                }),
            }));

            vectorSource.clear();
            vectorSource.addFeature(pointFeatureRed);

            const view = olMap.getView();
            view.setCenter(coordinate);
            view.setZoom(15);

            if (lastTwoLocations[0].length !== 0 && lastTwoLocations[1].length !== 0) {
                lastTwoLocations.forEach(coord => {
                    const pointFeatureGreen = new Feature({
                        geometry: new Point(coord),
                    });

                    pointFeatureGreen.setStyle(new Style({
                        image: new CircleStyle({
                            radius: 7,
                            fill: new Fill({ color: 'green' }),
                            stroke: new Stroke({ color: 'white', width: 2 }),
                        }),
                    }));

                    vectorSource.addFeature(pointFeatureGreen);
                });
            }

            setLastTwoLocations(prev => {
                if (prev[0].length !== 0 && prev[1].length !== 0) {
                    return [coordinate, []];
                } else if (prev[0].length === 0) {
                    return [coordinate, []];
                } else {
                    return [prev[0], coordinate];
                }
            });
        });

        setMap(olMap);
    }, []);

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Welcome to the Home Page!</h1>
            <div id="map" style={mapContainerStyle}></div>
            <button onClick={handleLogout} style={{ marginTop: "20px" }}>Logout</button>
        </div>
    );
};

export default HomePage;
