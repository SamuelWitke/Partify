import React from 'react'
import Github from 'static/gitub.svg';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

const styles = theme => ({
	paper: {
		padding: theme.spacing.unit * 2,
		textAlign: 'center',
		color: theme.palette.text.secondary,
		},
});

const About = () => (
	<div style={{ backgroundColor: '#151516', flexGrow: 1}}>
		<Paper className={styles.paper}>                
			<Card style={{backgroundColor: '#151516' }}>
				<CardTitle style={{color: 'white'}}> 
					Partify                     </CardTitle>
				<CardText style={{color: 'white'}}>
					This is a free open source Spotify-powered app that lets users host parties and have guests connect using their smartphones to submit and vote on songs. The app will only play the highest voted song and can connect to personal playlists.
				</CardText>
			</Card>
		</Paper>
	</div>
	)
export default About;
