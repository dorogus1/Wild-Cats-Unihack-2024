import React, {useRef} from "react";
import { useNavigate } from "react-router-dom";
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { useEffect } from "react";
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

            const pointFeature = new Feature({
                geometry: new Point(coordinate)
            });

            pointFeature.setStyle(new Style({
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

            vectorSource.clear(); // Curăță marker-ele existente dacă dorești
            vectorSource.addFeature(pointFeature);

            const view = map.getView();
            view.setCenter(coordinate);
            view.setZoom(14);
        });
    }, []);

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Welcome to the Home Page!</h1>
            <div id="map" style={mapContainerStyle}></div>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default HomePage;