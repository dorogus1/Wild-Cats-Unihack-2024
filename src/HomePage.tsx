import React, { useState } from "react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import "ol/ol.css"
import "ol-ext/dist/ol-ext.css"
import SearchNominatim from "ol-ext/control/SearchNominatim";
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Style, Fill, Stroke, Circle as CircleStyle } from 'ol/style';

import LayerSwitcher from "ol-ext/control/LayerSwitcher"
import VectorLayer from "ol/layer/Vector";

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const mapRef = useRef<Map | null>(null);
    const vectorSourceRef = useRef<VectorSource | null>(null);


    const [lastTwoLocations, setLastTwoLocations] = useState<[number[], number[]]>([[], []]);

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

        const map = new Map({
            target: 'map',
            layers: [
                new TileLayer({
                    source: xyzSource,
                }),
                vectorLayer,
            ],
            view: new View({
                center: timisoaraCoordinates,
                zoom: 13,
            }),
        });
        mapRef.current = map;

        const layerSwitcher = new LayerSwitcher();
        map.addControl(layerSwitcher);

        const searchNominatim = new SearchNominatim({
            reverse: false,
            placeholder: 'Search for location...',
            maxItems: 10,
            minLength: 3,
        });
        map.addControl(searchNominatim);

        searchNominatim.on('select', (e) => {
            const coordinate = e.coordinate;

            const pointFeatureRed = new Feature({
                geometry: new Point(coordinate)
            });

            pointFeatureRed.setStyle(new Style({
                image: new CircleStyle({
                    radius: 7,
                    fill: new Fill({
                        color: 'red'
                    }),
                    stroke: new Stroke({
                        color: 'white',
                        width: 2
                    })
                })
            }));

            vectorSource.addFeature(pointFeatureRed);

            const view = map.getView();
            view.setCenter(coordinate);
            view.setZoom(15);

            if (lastTwoLocations[0].length !== 0 && lastTwoLocations[1].length !== 0) {
                lastTwoLocations.forEach(coord => {
                    const pointFeatureGreen = new Feature({
                        geometry: new Point(coord)
                    });

                    pointFeatureGreen.setStyle(new Style({
                        image: new CircleStyle({
                            radius: 7,
                            fill: new Fill({
                                color: 'green'
                            }),
                            stroke: new Stroke({
                                color: 'white',
                                width: 2
                            })
                        })
                    }));

                    vectorSource.addFeature(pointFeatureGreen);
                });
            }

            setLastTwoLocations(prev => {
                console.log(prev);
                console.trace();
                if (prev[0].length !== 0 && prev[1].length !== 0) {
                    return [coordinate, []];
                } else if (prev[0].length === 0) {
                    return [coordinate, []];
                } else {
                    return [prev[0], coordinate];
                }
            });

        });
    });

    // useEffect(() => {
    //     if (lastTwoLocations[0].length && lastTwoLocations[1].length && !vectorSourceRef.current) {
    //         const vectorSource = new VectorSource();
    //
    //         // Crează și stilizează punctele pentru ultimele două locații
    //
    //
    //
    //         // Adaugă vector layer pe hartă
    //         const vectorLayer = new VectorLayer({
    //             source: vectorSource,
    //         });
    //
    //         if (mapRef.current) {
    //             mapRef.current.addLayer(vectorLayer);
    //         }
    //     }
    // }, [lastTwoLocations]);

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Welcome to the Home Page!</h1>
            <div id="map" style={mapContainerStyle}></div>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default HomePage;