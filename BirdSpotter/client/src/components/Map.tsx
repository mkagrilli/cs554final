import "leaflet/dist/leaflet.css";
import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import Markers from './Markers';



function MainMap() {
    return (
        <div>
            <span>Click the map to get started</span>
            <MapContainer
                center={{ lat: 40.745255, lng: -74.034775}}
                zoom={13}
                scrollWheelZoom={true}
                style={{height:'500px', width:'500px'}}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Markers />
            </MapContainer>
        </div>
    )
    
}




export default MainMap