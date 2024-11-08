import React from "react";
import { useNavigate } from "react-router-dom";
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import OSM from 'ol/source/OSM';
import { useEffect } from "react";

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn"); // Șterge autentificarea din localStorage
        navigate("/login"); // Redirecționează către pagina de login
    };

    const mapContainerStyle = { width: '100%', height: '1000px', border: '1px solid black' };

    useEffect(() => {
        const osmSource = new OSM();

        new Map({
            target: 'map',
            layers: [
                new TileLayer({
                    source: osmSource,
                }),
            ],
            view: new View({
                center: [0, 0],
                zoom: 2,
            }),
        });
    }, []);

    return (
        <div style={{textAlign: "center", marginTop: "50px"}}>
            <h1>Welcome to the Home Page!</h1>
            <div id='map' style={mapContainerStyle}></div>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default HomePage;
