import './App.css'
import {useState} from 'react'
import axios from 'axios'
import {useCookies} from 'react-cookie';

function AddComment(props: any) {
    const [formData, setFormData] = useState({body: '', classification: ''})
    const [error, setErr] = useState<null | any>(null)
    const [cookies, setCookie] = useCookies(['userId'])
    const [results, setResults] = useState<any>(null)
    const [searchErr, setSErr] = useState<any>(null)
    const [selected, setSelected] = useState<any>(null)
    const [usersCommented] = useState(props.commentedUsers)
    const [birdsCommented] = useState(props.commentedBirds)

    const handleChange = (e: any) => {
        setFormData((prev) => ({...prev, [e.target.name]: e.target.value}))
    }
    const createComment = async() => {
        let pass = true
        try {
            setErr(null)
            if (formData.body.trim() == '') {
                throw 'comment body cannot be empty'
            }
            if (!selected) {
                throw 'must select a classification for the bird'
            }
            console.log(birdsCommented)
            console.log(selected)
            if (birdsCommented.includes(`${selected}`)) {
                throw `this classification has already been suggested`
            }
        }catch(e) {
            pass = false
            setErr(e)
        }
        if (pass) {
            await axios.post(`http://localhost:3000/posts/${props.postId}`, {body: formData.body, classification: `${selected}`, userId: cookies.userId});
            alert('Comment added');
            (document.getElementById('body') as HTMLInputElement).value = '';
            (document.getElementById('term') as HTMLInputElement).value = '';
            window.location.reload();
        }
    }
    const onSubmitSearch = async (e:any) => {
        e.preventDefault();
        setSErr(null)
        let term = (document.getElementById('term') as HTMLInputElement)
        let search = ''
        console.log(term.value)
        if (term.value) {
            search = term.value.trim()
            if (search == '' || !search) {
                setSErr("must provide a search term")
            }
            try {
                let {data} = await axios.get(`https://nuthatch.lastelm.software/v2/birds?pageSize=10&name=${search}`, {headers: {accept: 'application/json', 'API-Key': '5740c2e1-3293-45b3-a215-31edafa6d2d6'}})
                console.log(data)
                setResults(data.entities)
            }catch(e) {
                setSErr("no results found")
            }
        }
        
    }

    if (!cookies.userId) {
        return(
            <div className='error'>you must be logged in to leave a comment</div>
        )
    }
    else if(usersCommented.includes(cookies.userId)) {
        return(
            <div className='error'>you can only leave one comment</div>
        )
    }
    else if(cookies.userId == props.postUser) {
        return(
            <div className='error'>you cannot comment on your own post</div>
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
                    <form className='search' id='search' onSubmit={onSubmitSearch}>
                        <label>
                            Find and select a bird:
                            <input id='term'/> 
                        </label>
                        <button className='searchButton' type='submit'>
                            Search
                        </button>
                    </form>
                    <div className='error'>{searchErr && searchErr}</div>
                    <div className='resultsDiv'>
                        {results && (<span><br/>{results.map((entity: any) => {
                            return (
                                <span key={entity.id}>{entity.name} 
                                <button onClick={() => setSelected(entity.id)}>{entity.id == selected?(<span>Selected</span>): (<span>Select</span>)}</button><br/></span>
                            )
                        })}<br/></span>)}
                    </div>
                </div>
                <div className='error'>{error && error}</div>
                <button onClick={() => createComment()}>Submit Comment</button>
            </div>
        )
    }
}

export default AddComment