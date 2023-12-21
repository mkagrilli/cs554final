import './App.css'
import { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';

function Post() {
    let { user, isAuthenticated } = useAuth0();
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



    return (
        <div className='postPage'>
            <p>Page to post Bird Sightings</p>
        </div>
    )
}

export default Post;