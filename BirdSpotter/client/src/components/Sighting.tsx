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
    const [commentedUsers, setUsers] = useState<any>([])
    const [commentedBirds, setBirds] = useState<any>([])
    useEffect(() => {
        const fetchData = async (id: any) => {
            const {data} = await axios.get(`http://localhost:3000/posts/${id}`) 
            setSighting(data.data)
            if (data.data.comments.length !== 0) {
                let comms = data.data.comments.map((comms: any) => {
                    setUsers((commentedUsers:any) => ([...commentedUsers,comms.userId]))
                    setBirds((commentedBirds:any) => ([...commentedBirds,comms.classification]))
                    return ((<div key={comms._id}><Comment comment={comms}/><br/></div>))
                })
                console.log(commentedUsers)
                console.log(commentedBirds)
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
                <span>Location: {sighting.location && sighting.location}</span>
                <p>Description: {sighting.description && sighting.description}</p>
                {sighting.imageUrl[0] && (<img src={sighting.imageUrl[0]} height='500'/>)}
                <br/>
                <br/>
                <h4>Comments</h4>
                {isComments && comments}
                <span>Disagree with the poster's bird identification? </span>
                <button onClick={() => setToggle(!toggleCom)}>submit your own with a comment</button>
                <br/>
                {toggleCom && <AddComment postId={id} postUser={sighting.userId} commentedUsers={commentedUsers} commentedBirds={commentedBirds}/>}
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