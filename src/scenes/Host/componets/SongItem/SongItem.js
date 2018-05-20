import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classes from './SongItem.scss'
import { ListItem } from 'material-ui/List'
import Checkbox from 'material-ui/Checkbox'
import Delete from 'material-ui/svg-icons/action/delete'
import { isObject } from 'lodash'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';
import Badge from 'material-ui/Badge';
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import ThumbUp from 'material-ui/svg-icons/action/thumb-up';
import ThumbDown from 'material-ui/svg-icons/action/thumb-down';
import FlatButton from 'material-ui/FlatButton';

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
						}}>
							<Checkbox 
								style={{width: 50}}
								iconStyle={{width: 30, height: 30}}
								checkedIcon={<ThumbUp />}
								uncheckedIcon={<ThumbUp />}
								disabled={disabledUp || active}
								checked={disabledUp || active}
								onCheck={() => upVote(song, song._key || id)}/>
							<Checkbox 
								style={{width: 50}}
								iconStyle={{width: 30, height: 30}}
								checkedIcon={<ThumbDown />}
								uncheckedIcon={<ThumbDown />}
								checked={disabledDown || active}
								disabled={disabledDown || active}
								onCheck={() => downVote(song, song._key || id)}/>
							{ visableDelete && 
							<IconButton 
								style={{width: 0,height: 0,padding: 0}}
								onClick={() => onDeleteClick(song, song._key || id)}
								iconStyle={{width: 30, height: 30}}
							>
								<DeleteIcon 
									style={{width: 0}}
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
