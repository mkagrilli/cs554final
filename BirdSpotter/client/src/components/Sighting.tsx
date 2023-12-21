import './App.css'
import {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
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
                    return (<Comment comment={comms} key={comms._id}/>)
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
                <img src={sighting.imageUrl}/>
                <br/>
                <br/>
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