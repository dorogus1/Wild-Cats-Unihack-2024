import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { fromLonLat } from "ol/proj";
import { Style, Stroke } from "ol/style";
import "ol/ol.css";

const HomePage: React.FC = () => {
    const navigate = useNavigate();
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

        // Încărcăm fișierul GeoJSON pentru pistele de biciclete
        const bikeLayerSource = new VectorSource({
            url: process.env.PUBLIC_URL + '/geojson/bike-lanes.geojson', // Path către fișierul GeoJSON
            format: new GeoJSON(),
        });

        // Stilizare pentru pistele de biciclete
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
                bikeLayer, // Adăugăm layer-ul cu pistele de biciclete
            ],
            view: new View({
                center: timisoaraCoordinates,
                zoom: 13,
            }),
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
