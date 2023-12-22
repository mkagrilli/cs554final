import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    useEffect(() => {
        const getUserData = async () => {
            if (isAuthenticated && user) {
                const data = { authId: user.sub };
                const userIsRegistered = (await axios.post(`http://localhost:3000/users/checkIfRegistered`, data)).data.isRegistered;
                if (userIsRegistered) {
                    console.log('User is authenticated and registered');
                    const data = (await axios.get(`http://localhost:3000/users/authid/${user.sub}`)).data.data
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
    const navigate = useNavigate(); 
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
    userId: userData.userId || '',
    title: '',
    desc: '',
    image: null,
    coordinates: null,
  });

  const [titleSuggestions, setTitleSuggestions] = useState<string[]>([]);
  
  const fetchTitleSuggestions = async (inputValue: string) => {
    try {
      const response = await axios.get(`https://nuthatch.lastelm.software/v2/birds?name=${inputValue}`, {headers: {'api-key': 'c381a016-3a46-4199-a28b-f40f3ec14141'}});
      const entities = response.data.entities;
      const suggestions = entities.filter((entity:any) => entity.name.toLowerCase().startsWith(inputValue.toLowerCase())).map((entity: any) => entity.name);      
      setTitleSuggestions(suggestions);
      } catch (error) {
        console.error('Error fetching title suggestions:', error);
        setTitleSuggestions([]);
      }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if(name === 'desc' && value.length === 250)
    {
      window.alert("Description shouldn't exceed 250 characters.");
    }
    else if (name === 'title')
    {
      setFormData({ ...formData, [name]: value });
      fetchTitleSuggestions(value);
    }
    else
    {
      setFormData({ ...formData, [name]: value });
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      if (formData.title.trim() === '') {
        setTitleSuggestions([]);
      } else {
        fetchTitleSuggestions(formData.title);
      }
    }, 200);

    return () => clearTimeout(delay); 
  }, [formData.title]);

  // handles title select
  const handleTitleSelect = (selectedTitle: string) =>
  {
    setFormData({...formData, title: selectedTitle});
    setTitleSuggestions([]);
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files && e.target.files[0];
  if (!files) {
    window.alert("Please select an image.");
    return;
  }
  const file = files;
  setFormData({ ...formData, image: file });
  };

  const handleCoordinatesChange = (coordinates: [number, number]) => {
    setFormData({ ...formData, coordinates });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.title.trim()) {
        window.alert("Please enter a title.");
        return;
      }
    
      if (!formData.desc) {
        window.alert("Please enter a description.");
        return;
      }

      if (!formData.coordinates) {
        window.alert("Please select coordinates on the map.");
        return;
      }
    
      if (!formData.image) {
        window.alert("Please upload an image.");
        return;
      }

    try {
      const form = new FormData();
      form.append('userId', userData._id);
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
      const postId = response.data.data._id;
      navigate('/post/'+postId);
    } catch (error) {
      console.error('Error sending data to backend:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Bird Species:
        <br />
        <input type="text" name="title" value={formData.title} onChange={handleInputChange} />
        
        {titleSuggestions.length > 0 && (
          <ul>
            {titleSuggestions.map((title, index) => (
              <li key={index} onClick={() => handleTitleSelect(title)}>
                {title}
              </li>
            ))}
          </ul>
        )}
     </label>
      <br />
      <br />
      <label>
        Description:
        <br />
        <textarea placeholder = "Describe the bird here..." name="desc" maxLength = {250} rows = {5} cols = {40} value={formData.desc} onChange={handleInputChange} />
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