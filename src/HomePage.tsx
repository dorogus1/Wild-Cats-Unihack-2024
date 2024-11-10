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
import LineString from 'ol/geom/LineString';

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const mapRef = useRef<Map | null>(null);
    const vectorSourceRef = useRef<VectorSource | null>(null);
    const bikeLayerRef = useRef<VectorLayer | null>(null);
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
        bikeLayerRef.current = bikeLayer;

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

            const pointFeature = new Feature({
                geometry: new Point(coordinate),
            });

            pointFeature.setStyle(new Style({
                image: new CircleStyle({
                    radius: 7,
                    fill: new Fill({ color: 'red' }),
                    stroke: new Stroke({ color: 'white', width: 2 }),
                }),
            }));

            vectorSource.addFeature(pointFeature);

            if (vectorSource.getFeatures().length === 2) {
                vectorSource.getFeatures().forEach(feature => {
                    feature.setStyle(new Style({
                        image: new CircleStyle({
                            radius: 7,
                            fill: new Fill({ color: 'green' }),
                            stroke: new Stroke({ color: 'white', width: 2 }),
                        }),
                    }));
                })

                const lineCoordinates = vectorSource.getFeatures()
                    .map(feature => (feature.getGeometry() as Point).getCoordinates());

                const bikeLayerFeatures = bikeLayerSource.getFeatures();

                const retrieveNearestFeature = (coordinate: number[]): Feature<LineString> | null => {
                    let nearestFeature: Feature<LineString> | null = null;
                    let minDistance = Infinity;

                    bikeLayerFeatures.forEach((feature) => {
                        const geometry = feature.getGeometry();

                        if (geometry instanceof LineString) {
                            geometry.forEachSegment((start, end) => {
                                const distance = Math.min(
                                    computeDistance(coordinate, start),
                                    computeDistance(coordinate, end)
                                );

                                if (distance < minDistance) {
                                    minDistance = distance;
                                    nearestFeature = feature as Feature<LineString>;
                                }
                            });
                        }
                    });

                    return nearestFeature;
                };

                const startPoint = lineCoordinates[0];
                const endPoint = lineCoordinates[1];

                const closestStartSegment = retrieveNearestFeature(startPoint);
                const closestEndSegment = retrieveNearestFeature(endPoint);

                if (closestStartSegment && closestEndSegment) {
                    const combinedCoordinates = [
                        startPoint,
                        ...((closestStartSegment.getGeometry() as LineString).getCoordinates().slice(1, -1)),
                        endPoint
                    ];

                    const lineFeature = new Feature(
                        new LineString(combinedCoordinates)
                    );

                    lineFeature.setStyle(new Style({
                        stroke: new Stroke({
                            color: 'green',
                            width: 10,
                        })
                    }));

                    // Add the line feature to the bikeLayer source
                    vectorSource.addFeature(lineFeature);
                }
            }

            if (vectorSource.getFeatures().length === 4) {
                const vectorFeatures = vectorSource.getFeatures();
                vectorSource.clear();
                vectorSource.addFeature(vectorFeatures[3]);
            }

            const view = olMap.getView();
            view.setCenter(coordinate);
            view.setZoom(15);

        });

        setMap(olMap);
    }, []);

    const computeDistance = (coord1: number[], coord2: number[]): number => {
        const dx = coord2[0] - coord1[0];
        const dy = coord2[1] - coord1[1];
        return Math.sqrt(dx * dx + dy * dy);
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Welcome to the Home Page!</h1>
            <div id="map" style={mapContainerStyle}></div>
            <button onClick={handleLogout} style={{ marginTop: "20px" }}>Logout</button>
        </div>
    );
};

export default HomePage;
