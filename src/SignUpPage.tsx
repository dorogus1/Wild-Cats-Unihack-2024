import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUpPage.css";

interface SignUpPageProps {
    setIsSignedUp: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ setIsSignedUp }) => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const navigate = useNavigate();

    const handleSignUp = () => {
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match!");
            return;
        }

        let users: { username: string; password: string }[] = [];
        try {
            users = JSON.parse(localStorage.getItem("users") || "[]");
        } catch (error) {
            console.error("Error parsing users from localStorage:", error);
        }

        const userExists = users.some(user => user.username === username);
        if (userExists) {
            setErrorMessage("Username already exists!");
            return;
        }

        users.push({ username, password });
        localStorage.setItem("users", JSON.stringify(users));
        setIsSignedUp(true);
        navigate("/login");
    };

    return (
        <div className="signup-container">
            <h1 className={"signup-title"}>Sign Up</h1>
            <input
                type="text"
                className="input-field"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                className="input-field"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input
                type="password"
                className="input-field"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button className="button" onClick={handleSignUp}>Sign Up</button>
        </div>
    );
};

export default SignUpPage;
