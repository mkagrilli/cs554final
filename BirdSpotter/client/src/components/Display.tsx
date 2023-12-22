import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DisplayCard from './DisplayCard'; 
import { useParams, useNavigate } from 'react-router-dom';
import { Grid } from '@mui/material';

import '../components/App.css';

interface Post {
  _id: string;
  userId: string;
  title: string;
  imageUrl: string[];
  description: string;
  location: string;
  coordinates: number[];
}

const Display: React.FC = () => {
  let { page } = useParams<{ page: string }>();
  const pageNumber = Number(page);
  const [loading, setLoading] = useState(true);
  const [postData, setPostData] = useState<Post[] | undefined>();
  const [pageNumberState, setPageNumber] = useState(pageNumber);
  const [nextButton, setNextButton] = useState(true);
  const [prevButton, setPrevButton] = useState(false);
  const [hasError400, set400] = useState(false);
  const [hasError404, set404] = useState(false);
  const [cardsData, setCardsData] = useState<JSX.Element[] | undefined>();
  const history = useNavigate();

  const IncreasePage = () => {
    const newPageNumber = pageNumberState + 1;
    setPageNumber(newPageNumber);
    setLoading(true);
    history(`/posts/page/${newPageNumber}`);
  };

  const DecreasePage = () => {
    const newPageNumber = pageNumberState - 1;
    setPageNumber(newPageNumber);
    setLoading(true);
    history(`/posts/page/${newPageNumber}`);
  };

  useEffect(() => {
    setPageNumber(pageNumber);
  }, [pageNumber]);
  
  useEffect(() => {
    console.log('on load useeffect');
    setPostData(undefined);
  
    async function fetchData() {
      try {
        setPageNumber(pageNumberState);
        const { data } = await axios.get(`http://localhost:3000/posts/page/${pageNumberState}`);
        const { data: postCountData } = await axios.get(`http://localhost:3000/posts/postcount/amount`);
        let tot = Object.keys(data).length;  
        let results: Post[] = [];
        let max;
        const amount = postCountData.postCount;
        if (tot === 0) {
            set404(true);
            return;
          }
        if (tot && tot < 20) {
          max = tot;
          setNextButton(false);
        } else {
          max = 20;
          setNextButton(true);
        }
        if (pageNumberState === 1) {
          setPrevButton(false);
        } else {
          setPrevButton(true);
        }
        if(amount === tot*pageNumberState){
            setNextButton(false);
        }
        results = Object.values(data);
        set400(false);
        set404(false);
        setPostData(results);
      } catch (e) {
        console.log(e);
        set404(true);
        return;
      }
    }
  
    fetchData();
  }, [pageNumberState]);

  useEffect(() => {
    console.log('postData useeffect');
    setLoading(true);
    if (postData) {
      const cardsData = postData.map((data, index) => (
        <DisplayCard post={data} key={data._id || index} />
      ));

      setCardsData(cardsData);
      setLoading(false);
    }
  }, [postData]);

  if (hasError400) {
    return <div><h2>Error 400</h2></div>;
  } else if (hasError404) {
    return <div><h2>Error 404</h2></div>;
  } else if (loading) {
    return <div><h2>Loading....</h2></div>;
  } else {
    return (
      <div>
        <Link to='/'>Back to Home...</Link>
        <br />
        <br />
        <Grid
          container
          spacing={2}
          sx={{
            flexGrow: 1,
            flexDirection: 'row',
          }}
        >
          {cardsData}
        </Grid>
        {prevButton && <button onClick={DecreasePage}>Previous Page</button>}
        <p>Page Number: {pageNumberState}</p>
        {nextButton && <button onClick={IncreasePage}>Next Page</button>}
      </div>
    );
  }
};

export default Display;
