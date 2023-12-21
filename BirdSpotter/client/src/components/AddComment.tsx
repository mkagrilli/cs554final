import './App.css'
import {useState} from 'react'
import axios from 'axios'
import {useCookies} from 'react-cookie';

function AddComment(props: any) {
    const [formData, setFormData] = useState({body: '', classification: ''})
    const [error, setErr] = useState<null | any>(null)
    const [cookies, setCookie] = useCookies(['userId'])

    const handleChange = (e: any) => {
        setFormData((prev) => ({...prev, [e.target.name]: e.target.value}))
    }
    const createComment = async() => {
        try {
            setErr(null)
            if (formData.body.trim() == '') {
                throw 'comment body cannot be empty'
            }
            if (formData.classification.trim() == '') {
                throw 'must provide a classification for the bird'
            }
        }catch(e) {
            setErr(e)
        }
        if (!error) {
            await axios.post(`http://localhost:3000/posts/${props.postId}`, {body: formData.body, classification: formData.classification, userId: cookies.userId});
            alert('Comment added');
            (document.getElementById('body') as HTMLInputElement).value = '';
            (document.getElementById('classification') as HTMLInputElement).value = ''
        }
        
    }

    if (!cookies.userId) {
        return(
            <div>you must be logged in to leave a comment</div>
        )
    }
    else {
        return (
            <div className='challenge'>
                <div className='commentCreation'>
                    <label>
                        Comment Body:
                        <input onChange={(e) => handleChange(e)}
                            id='body'
                            name='body'
                            maxLength={100}
                            size={50}
                        />
                    </label>
                    <br/>
                    <label>
                        bird classification ID (to be changed to search)
                        <input onChange={(e) => handleChange(e)}
                            id='classification'
                            name='classification'
                        />
                    </label>
                </div>
                <div className='error'>{error && error}</div>
                <button onClick={() => createComment()}>Submit Comment</button>
            </div>
        )
    }
}

export default AddComment