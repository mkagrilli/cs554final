import './App.css'
import {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import axios from 'axios'

function Sighting() {
    let {id} = useParams()
    const [sighting, setSighting] = useState<undefined | any>(undefined)
    const [comments, setComments] = useState<undefined | any>(undefined)
    useEffect(() => {
        const fetchData = async (id: any) => {
            const {data} = await axios.get(`http://localhost:3000/posts/${id}`) 
            setSighting(data.data)
            let comms = data.data.comments.map((comms: any) => {
                return (<div>{comms.body}</div>)
            })
            setComments(comms)
        }
        fetchData(id)
    },[id])
    if (sighting) {
        return (
        <div className='sighting'>
            <div className='sightingBody'>
                <h3 className='postTitle'>{sighting.title}</h3>
                <br/>
                <img src={sighting.imageUrl}/>
                <br/>
                <br/>
                {comments}
            </div>
        </div>
        )
    }
    else {
        return (
            <div>Loading</div>
        )
    }
    
}

export default Sighting;