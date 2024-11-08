import React from "react";
import { useNavigate } from "react-router-dom";
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { useEffect } from "react";
import { fromLonLat } from 'ol/proj';

const HomePage: React.FC = () => {
    const navigate = useNavigate();

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

        new Map({
            target: 'map',
            layers: [
                new TileLayer({
                    source: xyzSource,
                }),
            ],
            view: new View({
                center: timisoaraCoordinates,
                zoom: 13,
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
