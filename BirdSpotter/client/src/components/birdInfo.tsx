import {useState, useEffect} from 'react';
import './App.css'
import axios from 'axios';
import { useParams } from 'react-router-dom';

function BirdInfo(props: any) {
    const [bird, setBird] = useState<any>(null)
    const [error, setErr] = useState(false)
    const [loading, setLoading] = useState(true)
    let {id} = useParams()
    useEffect(() => {
        const fetchData = async(id: any) => {
            try {
                const {data} = await axios.get(`https://nuthatch.lastelm.software/birds/${id}`, {headers: {accept: 'application/json', 'API-Key': '5740c2e1-3293-45b3-a215-31edafa6d2d6'}})
                console.log(data)
                setBird(data)
                setLoading(false)
            }catch(e) {
                setLoading(false)
                setErr(true)
            }
        }
        fetchData(id)
    }, [id])

    if (loading) {
        return (
            <div>loading</div>
        )
    }
    else if (error) {
        return (
            <div className='error'>404 Bird not found</div>
        )
    }
    else {
        return (
            <div className='birdContainer'>
                <h2>{bird.name}</h2>
                <h3>or {bird.sciName}</h3>
                <br/>
                {bird.images.length != 0? (<img src={bird.images[0]} width="600"/>): (<span>No Images available</span>)}
                <br/>
                <br/>
                <div>Found In: {bird.region.map((region:any) => {
                    return (<div key={region}>{region}</div>)
                })}
                </div>
                <br/>
                {bird.lengthMax && (<div>Max Length: {bird.lengthMax}cm</div>)}
                {bird.wingspanMax && (<div>Max Wingspan: {bird.wingspanMax}cm</div>)}


            </div>
        )
    }
}

export default BirdInfo