import './App.css'
import {useState, useEffect} from 'react'
import axios from 'axios'
import { useCookies } from 'react-cookie'
import { useParams } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

function Comment(props: any) {
    let {id} = useParams()
    const comment = props.comment
    const [user, setUser] = useState<undefined | any>(undefined)
    const [error, setErr] = useState<undefined | string>(undefined)
    const [bird, setBird] = useState<undefined | any>(undefined)
    const [cookies, setCookie] = useCookies(['userId'])
    const [hasUpvoted, setUpvoted] = useState(false)
    const [hasDownvoted, setDownvoted] = useState(false)
    const [voteErr, setVErr] = useState<any>(undefined)
    const [votes, setVotes] = useState(comment.upvotes.length - comment.downvotes.length)
    const [isUsers, setIs] = useState(false);
    const [birdLink, setLink] = useState<any>(null)
    useEffect(() => {
        if (cookies.userId) {
            if (comment.upvotes.includes(cookies.userId)) {
                setUpvoted(true)
            }
            else if (comment.downvotes.includes(cookies.userId)) {
                setDownvoted(true)
            }
            if (cookies.userId == comment.userId) {
                setIs(true)
            }
        }
        const fetchData = async (uid: any) => {
            try {
                const {data} = await axios.get(`http://localhost:3000/users/${uid}`) 
                setUser(data.data)
                let classification:any = await axios.get(`https://nuthatch.lastelm.software/birds/${comment.classification}`, {headers: {accept: 'application/json', 'API-Key': '5740c2e1-3293-45b3-a215-31edafa6d2d6'}})
                classification = classification.data
                setLink(`/bird/${classification.id}`)
                setBird(classification)
            } catch (e) {
                setErr('Error retrieving data')
            }
        }
        fetchData(comment.userId)
    },[cookies.userId])

    const upvote = async(userId: string) => {
        if (!cookies.userId) {
            setVErr('you must be logged in to do this')
        }
        else {
            let upvoted = await axios.put(`http://localhost:3000/posts/${id}/comments/${comment._id}`, {type: 'upvote', userId: userId})
            if (!upvoted) {
                setVErr('unable to vote')
            }
            else {
                setVErr(null)
                if (hasUpvoted) {
                    //console.log('remove up')
                    setVotes(votes-1)
                    setUpvoted(false)
                }
                else {
                    //console.log('up')
                    setUpvoted(true)
                    setVotes(votes+1)
                    //console.log(votes)
                    if (hasDownvoted) {
                        setVotes(votes+2)
                        console.log(votes)
                        setDownvoted(false)
                    }  
                }
            }
        }
        
    }
    const downvote = async(userId: string) => {
        if (!cookies.userId) {
            setVErr('you must be logged in to do this')
        }
        else {
            let downvote = await axios.put(`http://localhost:3000/posts/${id}/comments/${comment._id}`, {type: 'downvote', userId: userId})
            if (!downvote) {
                setVErr('unable to vote')
            }
            else {
                setVErr(null)
                if (hasDownvoted) {
                    console.log('removeDown')
                    setVotes(votes+1)
                    setDownvoted(false)
                }
                else {
                    console.log('down')
                    setDownvoted(true)
                    setVotes(votes-1)
                    console.log(votes)
                    if (hasUpvoted) {
                        console.log('upActive')
                        setVotes(votes-2)
                        console.log(votes)
                        setUpvoted(false)
                    }
                }   
            }
        }
        
    }

    if (user) {
        return (
            <div className="commentDiv">
                <span>{user.username}: {comment.body}</span>
                <br/>
                <span>Bird Classification: <NavLink to={birdLink}>{bird && bird.name}</NavLink> | votes: {votes}</span>
                <div>{!isUsers && (<div><button className="Upvote" onClick={() => upvote(cookies.userId)}>{hasUpvoted?(<div>upvoted</div>): (<div>upvote</div>)}</button>
                <button className="Downvote" onClick={() => downvote(cookies.userId)}>{hasDownvoted?(<div>downvoted</div>): (<div>downvote</div>)}</button><div className='error'>{voteErr && voteErr}</div></div>)}</div>
                <span>_______________________________________</span>
            </div>
        )
    } 
    else if (error) {
        return(
            <div>{error}</div>
        )
    }
    else {
        return(
            <div>Loading</div>
        )
    }
}

export default Comment