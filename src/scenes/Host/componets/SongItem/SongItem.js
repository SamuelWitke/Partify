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

const SongItem = ({ author, active, disabledUp, name, disabledDown, song,img, visableDelete, id, votes, downVote, upVote, onDeleteClick }) => (
    <Card>
        <CardMedia
            style={{
                maxWidth: '25em',
                maxHeight: '25em',
                color: active ? "yellow" : "",
            }}
            overlay={<CardTitle title={
                <Badge badgeContent={votes} primary={true}>
                    <span
                        style={{
                            color: active ? "firebrick" : "",

                        }}
                    > {name} </span>
            </Badge>
            }
            subtitle={"Submitted by "+author} 
        />}
    >
        <img src={img} alt="" />
    </CardMedia>
    <CardActions>
        <div style={{
            display: 'flex',
            flexDirection: 'row',
        }}>
            <Checkbox 
                style={{width: 0}}
                checkedIcon={<ThumbUp />}
                uncheckedIcon={<ThumbUp />}
                disabled={disabledUp || active}
                checked={disabledUp || active}
                onCheck={() => upVote(song, song._key || id)}/>
            <Checkbox 
                style={{width: 0}}
                checkedIcon={<ThumbDown />}
                uncheckedIcon={<ThumbDown />}
                checked={disabledDown || active}
                disabled={disabledDown || active}
                onCheck={() => downVote(song, song._key || id)}/>
            { visableDelete && 

            <IconButton 
                style={{width: 0,height: 0,padding: 0}}
                tooltip="Delete" 
                onClick={() => onDeleteClick(song, song._key || id)}
            >
                    <DeleteIcon 
                        style={{width: 0}}

                    />
                </IconButton>
            }
        </div>
    </CardActions>

    </Card>
);
export default SongItem; 
/*
*    <Card>
     <CardHeader 
        title={
            <div className={classes.container}>
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
        />
        <CardMedia
      overlay={<CardTitle title="Overlay title" subtitle="Overlay subtitle" />}
    >
        <img src={img} alt="" />
    </CardMedia>
    <CardActions>
        <div style={{display: "inline-block"}}> 
        </CardActions>
    </Card>

 * actionPosition="right"
        titlePosition="top"
        titleBackground={active ? "linear-gradient(to bottom,rgba(121,32,116,1) 0%, rgba(82,0,71,1) 0%, rgba(103,29,96,1) 100%": "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"}
    >
    */
