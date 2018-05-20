import React from 'react'
import CunyTech from '../components/CUNY-TECH-INFO/CunyTech.js'
import HomePage from '../components/HomePage/HomePage.js'
import About from '../components/About/About.js';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
	root: {
		flexGrow: 1,
		},
	paper: {
		padding: theme.spacing.unit * 2,
		textAlign: 'center',
		color: theme.palette.text.secondary,
		},
});

const Home = () => (
	<Grid container spacing={24}>
		<Grid item xs={12}>
			<Paper className={styles.paper}>
				<HomePage />
			</Paper>
		</Grid>
		<Grid item xs={12} sm={12}>
			 <About /> 
		</Grid>
		<Grid item xs={12} sm={12}>
			<CunyTech /> 
		</Grid>
	</Grid>
	)
export default Home;
