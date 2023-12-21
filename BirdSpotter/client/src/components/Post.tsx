import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import { useAuth0 } from "@auth0/auth0-react";

interface FormData {
  userId: string;
  title: string;
  desc: string;
  image: File | null;
  coordinates: [number, number] | null;
}

const LeafletMap: React.FC<{ onCoordinatesChange: (coordinates: [number, number]) => void }> = ({
  onCoordinatesChange,
}) => {
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
  const [position, setPosition] = useState<[number, number]>([0, 0]);

  const handleMarkerDragEnd = (event: L.LeafletEvent) => {
    const marker = event.target.getLatLng();
    setPosition([marker.lat, marker.lng]);
    onCoordinatesChange([marker.lat, marker.lng]);
  };

  return (
    <>
      <Marker position={position} draggable={true} eventHandlers={{ dragend: handleMarkerDragEnd }}>
        <Popup>Drag me to select location</Popup>
      </Marker>
    </>
  );
};

const MyForm: React.FC = () => {
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

  const [formData, setFormData] = useState<FormData>({
    userId: userData.userId || '', // Add userId from userData if available
    title: '',
    desc: '',
    image: null,
    coordinates: null,
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if(name === 'desc' && value.length === 250)
    {
      window.alert("Description shouldn't exceed 250 characters.");
    }
    else
    {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    setFormData({ ...formData, image: file });
  };

  const handleCoordinatesChange = (coordinates: [number, number]) => {
    setFormData({ ...formData, coordinates });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const form = new FormData();
      form.append('userId', userData._id);//formData.userId); // Include userId in the form data
      form.append('title', formData.title);
      form.append('desc', formData.desc);
      if (formData.image) {
        form.append('image', formData.image);
      }

      if (formData.coordinates) {
        form.append('latitude', formData.coordinates[0].toString());
        form.append('longitude', formData.coordinates[1].toString());
      }

      const response = await axios.post<{ data: any }>('http://localhost:3000/posts/newpost', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Backend response:', response.data);
    } catch (error) {
      console.error('Error sending data to backend:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Bird Species:
        <input type="text" name="title" value={formData.title} onChange={handleInputChange} />
      </label>
      <br />
      <br />
      <label>
        Description:
        <input type="text" name="desc" maxLength = {250} value={formData.desc} onChange={handleInputChange} />
      </label>
      <br />
      <br />
      <MapContainer center={[0, 0]} zoom={2} style={{ height: '300px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LeafletMap onCoordinatesChange={handleCoordinatesChange} />
      </MapContainer>
      {formData.coordinates && (
        <p>
          Selected Coordinates: {formData.coordinates[0]}, {formData.coordinates[1]}
        </p>
      )}

      <br />
      <br />
      <label>
        Image:
        <input type="file" name="image" accept="image/*" onChange={handleImageChange} />
      </label>
      <br />
      <br />
      <button type="submit">Submit</button>
    </form>
  );
};

export default MyForm;