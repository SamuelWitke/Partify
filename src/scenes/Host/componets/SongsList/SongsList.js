import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import { compose, withHandlers } from 'recompose'
import { List } from 'material-ui/List'
import Paper from 'material-ui/Paper'
import Subheader from 'material-ui/Subheader'
import { spinnerWhileLoading } from 'utils/components'
import SongItem from '../SongItem'
import classes from './SongsList.scss'
import { connect } from 'react-redux'
import {GridList, GridTile} from 'material-ui/GridList';
import { firebaseConnect, getVal } from 'react-redux-firebase'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui/svg-icons/action/delete'

const styles = {
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    gridList: {
        display: 'flex',
        flexWrap: 'wrap',
        width: 500,
        height: 450,
    },
};



const SongsList = ({onDelete,upVote,downVote,songs,admin,auth,uid}) => (
    <Paper>
        <div className={classes.list}>
            <div style={styles.root}>
                <Subheader>Songs</Subheader>
                <GridList
                    cols={1}
                    padding={1}
                    cellHeight={200}
                    style={styles.gridList}
                >
                    { map( songs, (song, id)  => {
                        const disabledUp = typeof song.song.project.votedUpBy == 'object' ? Object.keys(song.song.project.votedUpBy).map( key => key).includes(uid)  : false;
                        const disabledDown = typeof song.song.project.votedDownBy == 'object' ? Object.keys(song.song.project.votedDownBy).map( key => key).includes(uid)  : false;
                        const visableDelete = song.song.project.submitedBy === uid  
                        const active = song.song.active ? true : false;
                        const author = song.song.project.author;
                        return (
                            <span key={id}>
                                <SongItem
                                    author={ author }
                                    disabledUp = {disabledUp}
                                    disabledDown = {disabledDown}
                                    song={song.song}
                                    votes={song.song.project.votes}
                                    visableDelete={visableDelete || admin}
                                    active={active}
                                    upVote={upVote}
                                    downVote = {downVote }
                                    onDeleteClick = {onDelete}
                                    id={id}
                                />
                            </span>
                        )})}
                    </GridList >
                </div>
            </div>
        </Paper>
)
export default SongsList;

