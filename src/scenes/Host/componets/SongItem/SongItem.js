import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classes from './SongItem.scss'
import { ListItem } from 'material-ui/List'
import Checkbox from 'material-ui/Checkbox'
import Delete from 'material-ui/svg-icons/action/delete'
import { isObject } from 'lodash'
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';
import Badge from 'material-ui/Badge';
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import ThumbUp from 'material-ui/svg-icons/action/thumb-up';
import ThumbDown from 'material-ui/svg-icons/action/thumb-down';

const SongItem = ({ author, active, disabledUp, name, disabledDown, song,img, visableDelete, id, votes, downVote, upVote, onDeleteClick }) => (
    <GridTile
        key={id}
        title={
            <div className={classes.container}>
                { visableDelete && 
                <IconButton tooltip="Delete" 
                    onClick={() => onDeleteClick(song, song._key || id)}
                >
                    <DeleteIcon />
                </IconButton>
                }
                <Badge badgeContent={votes} primary={true}>
                    <span className={classes.title}> {name} </span>
                </Badge>
            </div>
        }
        subtitle={"Song Submitted by " + author}
        style={{
            padding: '15%',
            width: '100%',
            height: '100%',
        }}
        actionIcon={
            <div style={{display: "inline-block"}}> 
                <div style={{  float: 'left'}}> 
                    <Checkbox 
                        checkedIcon={<ThumbUp />}
                        uncheckedIcon={<ThumbUp />}
                        disabled={disabledUp || active}
                        checked={disabledUp || active}
                        onCheck={() => upVote(song, song._key || id)}/>
                </div>
                <div style={{  float: 'right'}}> 
                    <Checkbox 
                        checkedIcon={<ThumbDown />}
                        uncheckedIcon={<ThumbDown />}
                        checked={disabledDown || active}
                        disabled={disabledDown || active}
                        onCheck={() => downVote(song, song._key || id)}/>
                </div>
            </div>
        }
        actionPosition="right"
        titlePosition="top"
        titleBackground={active ? "linear-gradient(to bottom,rgba(121,32,116,1) 0%, rgba(82,0,71,1) 0%, rgba(103,29,96,1) 100%": "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"}
    >
        <img style={""} src={img} />
    </GridTile>
)
export default SongItem; 
