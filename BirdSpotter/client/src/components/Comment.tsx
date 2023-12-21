import './App.css'
import {useState, useEffect} from 'react'
import axios from 'axios'

function Comment(props: any) {
    const [comment, setComment] = useState(props.comment)
    const [user, setUser] = useState<undefined | any>(undefined)
    useEffect(() => {
        const fetchData = async (id: any) => {
            const {data} = await axios.get(`http://localhost:3000/users/${id}`) 
            setUser(data.data)
        }
        fetchData(comment.userId)
    },[])

    const upvote = async(userId: string) => {
        
    }

    if (user) {
        return (
            <div className="commentDiv">
                <span>{user.username}: {comment.body}</span>
                <br/>
                <br/>
            </div>
        )
    }   
    else {
        return(
            <div>Loading</div>
        )
    }
}

export default Comment