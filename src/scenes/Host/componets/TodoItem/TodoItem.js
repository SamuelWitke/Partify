import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classes from './TodoItem.scss'
import { ListItem } from 'material-ui/List'
import Checkbox from 'material-ui/Checkbox'
import Delete from 'material-ui/svg-icons/action/delete'
import { isObject } from 'lodash'
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import ActionFavorite from 'material-ui/svg-icons/action/favorite';
import ActionFavoriteBorder from 'material-ui/svg-icons/action/favorite-border';

import DeleteIcon from 'material-ui/svg-icons/action/delete'




const TodoItem = ({ disabled,song,visableDelete,key, id, onCompleteClick, onDeleteClick }) => (
    <GridTile
        key={song.key}
        title={
            <div>
                { visableDelete && 
                <IconButton tooltip="Delete" 
                    onClick={() => onDeleteClick(song, song._key || id)}
                >
                    <DeleteIcon />
                </IconButton>
                }
                {song.name}
            </div>
        }
        style={{
            padding: '15%',
            width: '100%',
            height: '100%',
        }}
        actionIcon={
            <Checkbox 
                checkedIcon={<ActionFavorite />}
                uncheckedIcon={<ActionFavoriteBorder />}
                disabled={disabled}
                checked={disabled}
                onCheck={() => onCompleteClick(song, song._key || id)}/>
        }
        actionPosition="right"
        titlePosition="top"
        titleBackground="linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
    >
        <img style={classes.img} src={song.album.images[0].url} />

    </GridTile>
)

TodoItem.propTypes = {
    song: PropTypes.object.isRequired,
    key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onDeleteClick: PropTypes.func,
    onCompleteClick: PropTypes.func
}

export default TodoItem
