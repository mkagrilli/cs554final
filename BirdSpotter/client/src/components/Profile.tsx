import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';
import { useState, useEffect } from 'react';

const Profile: React.FC = () => {
    let { user, isAuthenticated, isLoading } = useAuth0();
    const [userData, setUserData] = useState<Record<string, any>>({});

    useEffect(() => {
        const getUserData = async () => {
            if (isAuthenticated && user) {
                const data = { authId: user.sub };
                const userIsRegistered = (await axios.post(`http://localhost:3000/users/checkIfRegistered`, data)).data.isRegistered;
                if (userIsRegistered) {
                    console.log('User is authenticated and registered');
                    const data = (await axios.get(`http://localhost:3000/users/authid/${user.sub}`)).data.data
                    setUserData(data);
                    console.log(data)
                }
            }
        };
        getUserData();
    }, [isAuthenticated, user]); 


    if (!isAuthenticated || !user) {
        return (
            <div>
              <p>Hey, profile data is supposed to display here... But you aren't logged in. So that's kind of awkward, ngl.</p>
            </div>
          );
    }
    if (isLoading) {
        return <div>Loading ...</div>;
    }
    return (
        <div>
            <img src={user.picture} alt={user.name} />
            <p>Username: {userData.username}</p>
            <p>Email: {userData.email}</p>
            {/* <p>MongoDB ID: {userData._id}</p>
            <p>Auth0 ID: {userData.authId}</p> */}
        </div>
    );
};

export default Profile;
