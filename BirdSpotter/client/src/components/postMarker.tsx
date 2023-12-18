import { Popup, Marker } from "react-leaflet";
import {Link} from 'react-router-dom';
import * as L from 'leaflet';
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Typography,
} from '@mui/material';

function PostMarker (props: any) {
    const post = props.post
    const birdIcon = L.icon({
        iconUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2tzuN_OzwCKolgvnyiDKt_WIS4x1q9x-c8w&usqp=CAU',
        iconSize: [30,30]
    })
    return (
        <Marker position={post.coordinates} icon={birdIcon}>
            <Popup>
                <Card
                    variant='outlined'
                    sx={{
                        maxWidth: 250,
                        height: 'auto',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        borderRadius: 5,
                        border: '1px solid #1e8678',
                        boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
                    }}>
                        <CardActionArea>
                            <Link to={`/post/${post._id}`}>
                                <CardMedia
                                    sx={{
                                        height: '100%',
                                        width: '100%'
                                    }}
                                    component='img'
                                    image={post.imageUrl}
                                />
                                 <CardContent>
                                    <Typography
                                        sx={{
                                            borderBottom: '1px solid #1e8678',
                                            frontWeight: 'bold'
                                        }}
                                        gutterBottom
                                        variant='h6'
                                        component='h3'
                                    >
                                        {post.title}
                                    </Typography>
                                </CardContent>
                            </Link>
                        </CardActionArea>
                </Card>
            </Popup>
        </Marker>
    )
}

export default PostMarker