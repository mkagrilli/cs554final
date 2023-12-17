import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const getToken = async () => {
    let { getAccessTokenSilently } = useAuth0();

    const token = await getAccessTokenSilently();
    console.log(token);
};

const Profile: React.FC = () => {
    let { user, isAuthenticated, isLoading } = useAuth0();

    if (!isAuthenticated) {
        user = {
            picture: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/258.png",
            name: "Guest",
            email: "No Email"
        }
    }
    getToken()
    if (isLoading) {
        return <div>Loading ...</div>;
    }

    if (!isAuthenticated || !user) {
        return (
          <div>
            <p>Hey, profile data is supposed to display here... But you aren't logged in. So that's kind of awkward, ngl.</p>
          </div>
        );
      }
    return (
        <div>
            <img src={user.picture} alt={user.name} />
            <h2>{user.name}</h2>
            <p>{user.email}</p>
        </div>
    );
};

export default Profile;
