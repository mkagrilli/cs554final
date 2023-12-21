import './App.css'
import {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import noImage from '../assets/downloaded.jpeg';
import axios from 'axios'
import Comment from './Comment'
import AddComment from './AddComment'

function Sighting() {
    let {id} = useParams()
    const [sighting, setSighting] = useState<undefined | any>(undefined)
    const [comments, setComments] = useState<undefined | any>(undefined)
    const [isComments, setIs] = useState(false)
    const [toggleCom, setToggle] = useState(false)
    useEffect(() => {
        const fetchData = async (id: any) => {
            const {data} = await axios.get(`http://localhost:3000/posts/${id}`) 
            setSighting(data.data)
            if (data.data.comments.length !== 0) {
                let comms = data.data.comments.map((comms: any) => {
                    return ((<div><Comment comment={comms} key={comms._id}/><br/></div>))
                })
                setComments(comms)
                setIs(true)
            }
        }
        fetchData(id)
    },[id])
    if (sighting) {
        return (
        <div className='sighting'>
            <div className='sightingBody'>
                <h3 className='postTitle'>{sighting.title}</h3>
                <br/>
                {sighting.imageUrl.length > 0 ? (
                    <img src={sighting.imageUrl[0]} alt={sighting.title} />
                ) : (
                    <img src={noImage}  alt={sighting.title}/>
                )}
                <br/>
                <br/>
                <h4>Comments</h4>
                {isComments && comments}
                <span>Disagree with the poster's bird identification? </span>
                <button onClick={() => setToggle(!toggleCom)}>submit your own with a comment</button>
                <br/>
                {toggleCom && <AddComment postId={id}/>}
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