import React, { useState } from 'react';
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";
import {NavLink, Route, Routes, useNavigate} from 'react-router-dom'


const Register: React.FC = () => {
    let { user, isAuthenticated } = useAuth0();
    const [username, setUsername] = useState<string>('');
    const navigate = useNavigate();
    const handleRedirect = () => {
        navigate('/');
    };

    const checkIfRegistered = async () => {
        if (isAuthenticated && user) {
            const data = { authId: user.sub };
            const userIsRegistered = (await axios.post(`http://localhost:3000/users/checkIfRegistered`, data)).data.isRegistered;
            if (userIsRegistered) {
                handleRedirect();
            } 
          
        } else {
          console.log('User is not authenticated');
        }
    };

    checkIfRegistered();

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        console.log('Submitted username:', username);
        event.preventDefault();
        if (user) {
            const data = {
                authId: user.sub,
                username: username,
                email: user.email
            }
            const response = (await axios.post(`http://localhost:3000/users/register`, data)).data.isRegistered;
            if (response) {
                console.log("User successfully registered!")
                handleRedirect()
            } else {
                console.log("User was not registered!")
            }
        }
    };

    return (
        <div>
        <h2>User Form</h2>
        <form onSubmit={handleFormSubmit}>
            <label>
            Please enter your username: <br></br>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            </label>
            <br />
            <button type="submit">Submit</button>
        </form>
        </div>
    );
};

export default Register;
