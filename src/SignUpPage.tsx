import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUpPage: React.FC = () => {
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

        // Save user credentials (in a real app, send this data to a backend server)
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const userExists = users.some((user: any) => user.username === username);

        if (userExists) {
            setErrorMessage("Username already exists!");
            return;
        }

        users.push({ username, password });
        localStorage.setItem("users", JSON.stringify(users));

        // Redirect to login page after successful signup
        navigate("/login");
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Sign Up</h1>
            <div>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div>
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </div>
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            <button onClick={handleSignUp}>Sign Up</button>
        </div>
    );
};

export default SignUpPage;
