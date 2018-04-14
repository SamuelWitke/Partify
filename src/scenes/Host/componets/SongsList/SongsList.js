import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import { compose, withHandlers } from 'recompose'
import { isEmpty } from 'react-redux-firebase'
import { List } from 'material-ui/List'
import Paper from 'material-ui/Paper'
import Subheader from 'material-ui/Subheader'
import { spinnerWhileLoading } from 'utils/components'
import TodoItem from '../TodoItem'
import classes from './SongsList.scss'
import { connect } from 'react-redux'
import {GridList, GridTile} from 'material-ui/GridList';
import { success, error, warning, info, removeAll } from 'react-notification-system-redux';
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
@firebaseConnect()
@connect(({ firebase, firebase: { auth, profile }}) => ({
    auth: auth,
    profile,
    uid: auth.uid,
}))

export default class SongsList extends Component {
    toggleDone = (song,id) => {
        let refVote = this.props.firebase.database().ref(`projects/${this.props.name}/Songs/${id}/song/project/votes`)
        let refBy = this.props.firebase.database().ref(`projects/${this.props.name}/Songs/${id}/song/project/votedBy/${this.props.uid}`).set(this.props.uid);
        refVote.transaction( (votes) => {
            return (votes || 0) + 1;
        });
        this.props.dispatch(info({
            title: song.name+" Upvoted ",
            position: 'tr',
        }))

    }
    onDelete = (song,id) => {
        let refVote = this.props.firebase.database().ref(`projects/${this.props.name}/Songs/${id}/`).remove();
        this.props.dispatch(info({
            title: 'Song Deleted',
            position: 'tr',
        }))
    }
        /*
    sendActiveMsg=() =>{
        this.props.dispatch(success({
            title: 'Song Submitted is Playing',
            position: 'tr',
        }))
    }
    */
    render() {
        const {songs,auth,uid,profile} = this.props 
        return(
            <Paper>
                {!isEmpty(songs) ? (
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
                                    const disabled = typeof song.song.project.votedBy == 'object' ? Object.keys(song.song.project.votedBy).map( key => key).includes(uid)  : false;
                                    const visableDelete = song.song.project.submitedBy === uid
                                    const active = song.song.active ? true : false;
                                    const author = song.song.project.author;
                                    // if(active && visableDelete) this.sendActiveMsg();
                                    return (
                                    <span key={id}>
                                        <TodoItem
                                            author={ author }
                                            disabled = {disabled}
                                            song={song.song}
                                            votes={song.song.project.votes}
                                            active={active}
                                            onCompleteClick={this.toggleDone}
                                            visableDelete={visableDelete}
                                            onDeleteClick = {this.onDelete}
                                            id={id}
                                        />
                                    </span>
                                    )})}
                            </GridList >
                        </div>
                    </div>
                ) : (
                    <div className={classes.empty}>No songs</div>
                )}
            </Paper>
        )
    }
}
