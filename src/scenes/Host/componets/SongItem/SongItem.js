import React, { Component } from 'react'
import Checkbox from 'material-ui/Checkbox'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import Badge from 'material-ui/Badge';
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import ThumbUp from 'material-ui/svg-icons/action/thumb-up';
import ThumbDown from 'material-ui/svg-icons/action/thumb-down';

class SongItem extends Component { 
	constructor (props){
		super(props);
		this.state = {
			imgLoaded:false
		}
	}
	handleImgLoaded = (event) =>{
		this.setState({
			imgLoaded:true
		});
	}
	render() {
		const { author, active, disabledUp, name, disabledDown, song,img, visableDelete, id, votes, downVote, upVote, onDeleteClick } = this.props;
		const { imgLoaded } = this.state;
		const style = imgLoaded ? {} : {visibility: 'hidden'}
		return (
			<div style={{ margin: '0 auto'}}>
				<Card>
					<CardMedia
						style={{
							maxWidth: '25em',
							maxHeight: '25em',
						}}
						overlay={
							<CardTitle title={
								<Badge badgeContent={votes} primary={true}>
									<span> {name} </span>
								</Badge>
							}
							subtitle={"Submitted by "+author} 
						/>}
					>
						<img src={img} style={style} onLoad={this.handleImgLoaded} alt="Artist Image" />
					</CardMedia>
					<CardActions>
						<div style={{
							display: 'flex',
							flexDirection: 'row',
							alignContent: "flex-start"
						}}>
							<Checkbox 
								iconStyle={{width: 30, height: 30}}
								checkedIcon={<ThumbUp />}
								uncheckedIcon={<ThumbUp />}
								disabled={disabledUp || active}
								checked={disabledUp || active}
								onCheck={() => upVote(song, song._key || id)}/>
							<Checkbox 
								iconStyle={{width: 30, height: 30}}
								checkedIcon={<ThumbDown />}
								uncheckedIcon={<ThumbDown />}
								checked={disabledDown || active}
								disabled={disabledDown || active}
								onCheck={() => downVote(song, song._key || id)}/>
							{ visableDelete && 
							<IconButton 
								onClick={() => onDeleteClick(song, song._key || id)}
								iconStyle={{width: 30, height: 30}}
							>
								<DeleteIcon 
								/>
							</IconButton>
							}
						</div>
					</CardActions>
				</Card>
			</div>
		);
	}
}
export default SongItem; 
