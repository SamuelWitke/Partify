import React from 'react';
import Paper from 'material-ui/Paper';
import {Card, CardActions, CardHeader,  CardTitle} from 'material-ui/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import Badge from 'material-ui/Badge';


const ActiveSong = ({votes, activeSong, visableActive, onDelete}) => (
	<Paper>
		<Card>
			<CardMedia
				overlay={
					<CardTitle title={""
					} subtitle={"Submitted by "+activeSong.author} />}
					>
					      <CardActionArea>
							<h1><Badge primary={true} badgeContent={votes}>Votes Earned</Badge></h1>
							{activeSong.song.name} by {activeSong.song.artists.map( artist =>  artist.name  )}
							
	
</CardActionArea>
<CardActions>
								{ visableActive &&
								<IconButton
											onClick={() => onDelete(activeSong.song,activeSong.id)}
									>
										<DeleteIcon
										/>
									</IconButton>
										}
									</CardActions>
						<CardMedia
          component="img"
          alt="Contemplative Reptile"
          image={activeSong.img}
          title="Contemplative Reptile"
        />
					</CardMedia>
				</Card>
			</Paper>
)
export default ActiveSong;
