import React, { useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const CheckIfRegistered: React.FC = () => {
    let { user, isAuthenticated } = useAuth0();
    const navigate = useNavigate();
    const handleRegister = () => {
        navigate('/register');
    };
    useEffect(() => {
        const checkIfRegistered = async () => {
            if (isAuthenticated && user) {
                const data = {authId: user.sub}
                const userIsRegistered = (await axios.post(`http://localhost:3000/users/checkIfRegistered`, data)).data.isRegistered;
                if (userIsRegistered) {
                } else {
                    handleRegister()
                }
                console.log("User is authenticated");
            } else {
            console.log("User is not authenticated")
            }
        }
        checkIfRegistered();
  }, [isAuthenticated]);

  return (
    isAuthenticated
  )
};

export default CheckIfRegistered;
