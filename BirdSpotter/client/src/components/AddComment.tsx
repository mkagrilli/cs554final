import './App.css'
import {useState} from 'react'
import axios from 'axios'

function AddComment(props: any) {
    const [formData, setFormData] = useState({body: '', classification: ''})
    const [error, setErr] = useState<null | string>(null)

    const handleChange = (e: any) => {
        setFormData((prev) => ({...prev, [e.target.name]: e.target.value}))
    }
    const createComment = async() => {
        if (formData.body.trim() == '') {
            setErr('comment body cannot be empty')
        }
        if (formData.classification.trim() == '') {
            setErr('must provide a classification for the bird')
        }
        await axios.post(`http://localhost:3000/posts/${props.postId}`, {body: formData.body, classification: formData.classification});
        alert('Comment added');
        (document.getElementById('body') as HTMLInputElement).value = '';
        (document.getElementById('classification') as HTMLInputElement).value = ''
    }

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
            <button onClick={() => createComment()}>Submit Comment</button>
        </div>
    )
}

export default AddComment