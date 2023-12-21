import noImage from '../assets/downloaded.jpeg';
import { Link } from 'react-router-dom';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography
} from '@mui/material';

interface DisplayCardProps {
  post: {
    _id: string;
    userId: string;
    title: string;
    imageUrl: string[];
    description: string;
    location: string;
    coordinates: number[];
  };
}

function DisplayCard({ post }: DisplayCardProps) {
  return (
    <Grid item xs={12} sm={12} key={post._id}>
      <Card
        variant='outlined'
        sx={{
          maxWidth: 1000,
          height: 'auto',
          marginLeft: 'auto',
          marginRight: 'auto',
          borderRadius: 5,
          border: '1px solid #1e8678',
          boxShadow:
            '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
        }}
      >
        <CardActionArea>
          <Link to={`/post/${post._id}`}>
            <CardMedia
              sx={{
                height: '100%',
                width: '100%'
              }}
              component='img'
              image={
                post.imageUrl.length > 0
                  ? post.imageUrl[0]
                  : noImage
              }
              title='post image'
            />

            <CardContent>
              <Typography
                sx={{
                  borderBottom: '1px solid #1e8678',
                  fontWeight: 'bold'
                }}
                gutterBottom
                variant='h6'
                component='h3'
              >
                <span>Title: </span>{post.title
                  ? post.title
                  : 'No Title'}
                <br />
                <span>Description: </span>
                {post.description
                  ? post.description
                  : 'No Description'}
              </Typography>
            </CardContent>
          </Link>
        </CardActionArea>
      </Card>
    </Grid>
  );
}

export default DisplayCard;
