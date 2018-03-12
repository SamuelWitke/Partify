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
@connect(({ firebase, firebase: { auth } }) => ({
    auth: auth,
    uid: auth.uid,
}))

export default class SongsList extends Component {
    toggleDone = (song,id) => {
        let refVote = this.props.firebase.database().ref(`projects/${this.props.name}/Songs/${id}/song/project/votes`)
        let refBy = this.props.firebase.database().ref(`projects/${this.props.name}/Songs/${id}/song/project/votedBy/${this.props.uid}`).set(this.props.uid);
        //this.props.firebase.database().ref(`projects/${this.props.name}/Songs/${id}/song/project/votedBy/${refBy}`).set(this.props.auth.uid)
        refVote.transaction( (votes) => {
            return (votes || 0) + 1;
        });
        this.props.dispatch(success({
            title: 'Song Upvoted',
            position: 'tr',
        }))

    }
    render() {
        const { songs,auth,uid } = this.props 
        map( songs, (song, id)  => {
        console.log(typeof song.song.project.votedBy == 'object' ? Object.keys(song.song.project.votedBy).map( key => key).includes(uid):false,uid)})
 
        return(
            <Paper style={{maxHeight: '100%', overflow: 'auto'}}>
                {!isEmpty(songs) ? (
                    <div style={styles.root}>
                        <Subheader>Songs</Subheader>
                        <GridList
                            cols={1}
                            cellHeight={180}
                            style={styles.gridList}
                        >
                            {map( songs, (song, id)  => (
                                <span>
                                    {/* forgive me lord I have sinned */}
                                <TodoItem
                                    disabled = {typeof song.song.project.votedBy == 'object' ? Object.keys(song.song.project.votedBy).map( key => key).includes(uid)  : false}
                                    song={song.song}
                                    onCompleteClick={this.toggleDone}
                                    id={id}
                                    key={id}
                                />
                            </span>
                            ))}
                        </GridList >
                    </div>
                ) : (
                    <div className={classes.empty}>No songs</div>
                )}
            </Paper>
        )
    }
}

/*
SongsList.propTypes = {
    songs: PropTypes.object,
    toggleDone: PropTypes.func, // from withHandlers
    deleteTodo: PropTypes.func, // from withHandlers
    firebase: PropTypes.object // eslint-disable-line react/no-unused-prop-types
}
    export default compose(
        withFirebase, // firebaseConnect() can also be used
        ,
        withHandlers({
            ,
            deleteTodo: props => id => {
            const { songs, auth, firebase } = props
            if (!auth || !auth.uid) {
                return props.showError('You must be Logged into Delete')
                }
// return props.showError('Delete example requires using populate')
// only works if populated
            if (songs[id].owner.email !== auth.email) {
                return props.showError('You must own todo to delete')
                }
            return firebase.remove(`songs/${id}`).catch(err => {
// TODO: Have error caught by epic
                console.error('Error removing todo: ', err) // eslint-disable-line no-console
                props.showError('Error Removing todo')
                return Promise.reject(err)
                })
            }
        })
    )(SongsList)
    */
