import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Map from "ol/Map";
import GeoJSON from "ol/format/GeoJSON";
import "ol/ol.css";
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import "ol/ol.css";
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
    const [map, setMap] = useState<Map | null>(null);

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        navigate("/login");
    };

    const mapContainerStyle = { width: '100%', height: '1000px', border: '1px solid black' };

    useEffect(() => {
        // Configurăm sursa OpenStreetMap
        const xyzSource = new XYZ({
            url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        });

        // Coordonatele centrului pentru Timișoara
        const timisoaraCoordinates = fromLonLat([21.2087, 45.7489]);

        // Sursa pentru layer-ul vectorial
        const vectorSource = new VectorSource();
        const vectorLayer = new VectorLayer({
            source: vectorSource,
        });

        // Sursa pentru layer-ul GeoJSON (piste de biciclete)
        const bikeLayerSource = new VectorSource({
            url: process.env.PUBLIC_URL + '/geojson/bike-lanes.geojson', // Path către fișierul GeoJSON
            format: new GeoJSON(),
        });

        // Layer pentru pistele de biciclete
        const bikeLayer = new VectorLayer({
            source: bikeLayerSource,
            style: new Style({
                stroke: new Stroke({
                    color: 'blue',
                    width: 3,
                }),
            }),
        });

        // Inițializăm harta OpenLayers
        const olMap = new Map({
            target: 'map',
            layers: [
                new TileLayer({
                    source: xyzSource,
                }),
                vectorLayer,
                bikeLayer, // Adăugăm layer-ul cu pistele de biciclete
            ],
            view: new View({
                center: timisoaraCoordinates,
                zoom: 13,
            }),
        });
        mapRef.current = olMap;

        // Adăugăm controlul de LayerSwitcher
        const layerSwitcher = new LayerSwitcher();
        olMap.addControl(layerSwitcher);

        // Adăugăm controlul de căutare Nominatim
        const searchNominatim = new SearchNominatim({
            reverse: false,
            placeholder: 'Search for location...',
            maxItems: 10,
            minLength: 3,
        });
        olMap.addControl(searchNominatim);

        // Gestionăm evenimentul de selectare
        searchNominatim.on('select', (e) => {
            const coordinate = e.coordinate;

            const pointFeature = new Feature({
                geometry: new Point(coordinate),
            });

            pointFeature.setStyle(new Style({
                image: new CircleStyle({
                    radius: 7,
                    fill: new Fill({
                        color: 'red',
                    }),
                    stroke: new Stroke({
                        color: 'white',
                        width: 2,
                    }),
                }),
            }));

            vectorSource.clear(); // Curățăm marker-ele existente
            vectorSource.addFeature(pointFeature);

            const view = olMap.getView();
            view.setCenter(coordinate);
            view.setZoom(16);
        });

        // Setăm harta în state
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
