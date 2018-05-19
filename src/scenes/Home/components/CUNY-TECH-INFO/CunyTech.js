import React ,{ Component }from 'react'
import TechPrep from 'static/CunyTechPrep.jpg'
import TTP from 'static/ttp.png'
import Cuny from '../../../../static/cuny.png';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {Card, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

const styles = theme => ({
	paper: {
		padding: theme.spacing.unit * 2,
		textAlign: 'center',
		color: theme.palette.text.secondary,
		},
});


class CunyTech extends Component {
	constructor(props){
		super(props);
		this.state = {
			visible: true
			}
		}
	blink = ()=> {
		this.setState({ visible: !this.state.visible });
		}

	componentDidMount() {
		this.interval = setInterval(this.blink, 530);
		}

	componentWillUnmount() {
		clearInterval(this.interval);
		}

	render() {
		return(
			<Grid container >
				<div style={{ backgroundColor: '#151516',  flexGrow: 1}}>
					<Grid item xs={12}>
						<Paper className={styles.paper}>
							<Card body style={{backgroundColor: '#151516' }}>
								<CardTitle style={{color: 'white'}}> 
									Application Created In  <a href="https://cunytechprep.nyc/"> CUNY Tech Prep </a>
								</CardTitle>
								<CardText style={{color: 'white'}}>
								> <span style={ { visibility: this.state.visible ? 'visible' : 'hidden'  } }> _  </span> 
								A full stack JavaScript boot-camp for CUNY computer science majors to learn in-demand technologies, master professional soft skills, and land great tech jobs in NYC.
							</CardText>
						</Card>
						<Grid container style={{ backgroundColor: '#151516'}} >
							<Grid item xs={4}>
								<Paper className={styles.paper}>
									<a href="http://www2.cuny.edu/">
										<img className="img-responsive img-circle center-block" style={{maxHeight: '15em', maxWidth: '15em'}} src={Cuny} alt={"logo"}/> 
									</a>
								</Paper>
							</Grid>
							<Grid item xs={4}>
								<Paper className={styles.paper}>
									<a href="https://cunytechprep.nyc/">
										<img className="img-responsive img-circle center-block" style={{maxHeight: '15em', maxWidth: '15em'}} src={TechPrep} alt={"logo"}/> 
									</a>
								</Paper>
							</Grid>
							<Grid item xs={4}>
								<Paper className={styles.paper}>
									<a href="http://www.techtalentpipeline.nyc/">
										<img className="img-responsive img-circle center-block" style={{maxHeight: '15em', maxWidth: '15em'}} src={TTP} alt={"logo"}/> 								</a>
								</Paper>
							</Grid>
						</Grid>
					</Paper>
				</Grid>
			</div>
		</Grid>
			)
		}
	}
export default CunyTech;
