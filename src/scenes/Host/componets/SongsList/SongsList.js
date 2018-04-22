import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import { compose, withHandlers } from 'recompose'
import { isEmpty } from 'react-redux-firebase'
import { List } from 'material-ui/List'
import Paper from 'material-ui/Paper'
import Subheader from 'material-ui/Subheader'
import { spinnerWhileLoading } from 'utils/components'
import SongItem from '../SongItem'
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

const mapDispatchToProps = (dispatch)=> {
    return({
        sendError: (errorObj) => dispatch(error(errorObj)),
        sendInfo: (infoObj) => dispatch(info(infoObj))
    })
}

@firebaseConnect()
@connect(({ firebase, firebase: { auth, profile }}) => ({
    auth: auth,
    profile,
    uid: auth.uid,
}),
    mapDispatchToProps,
)

export default class SongsList extends Component {

    upVote = (song,id) => {
        const {sendError, sendInfo, firebase, uid}= this.props;
        try{
            let refVote = firebase.database().ref(`projects/${this.props.name}/Songs/${id}/song/project/votes`)
            let refBy = firebase.database().ref(`projects/${this.props.name}/Songs/${id}/song/project/votedUpBy/${uid}`).set(uid);
            refVote.transaction( (votes) => {
                return (votes || 0) + 1;
            });
            sendInfo({
                title: song.name+" Upvoted ",
                position: 'tr',
            })
        }catch( e ){
            sendError({
                title: 'Error Upvoting',
                position: 'tr',
            })
        }
    }

    downVote = (song,id) => {
        const {sendError, sendInfo,name,firebase, uid}= this.props;
        try{
            let refVote = firebase.database().ref(`projects/${name}/Songs/${id}/song/project/votes`)
            let refBy = firebase.database().ref(`projects/${name}/Songs/${id}/song/project/votedDownBy/${uid}`).set(uid);
            const votes = refVote.transaction( (votes) => {
                return (votes || 0) - 1;
            });
            votes.then( data => {
                if(data.snapshot.val() < -1){
                    firebase.database().ref(`projects/${name}/Songs/${id}/`).remove();
                    sendInfo({
                        title: song.name+" was removed due to low votes ",
                        position: 'tr',
                    })
                }else{
                    sendInfo({
                        title: song.name+" Downvoted ",
                        position: 'tr',
                    })
                }

            } )
        }catch( e ){
            sendError({
                title: 'Error Upvoting',
                position: 'tr',
            })
            console.error(e.message,e.stack)
        }
    }

    onDelete = (song,id) => {
        const { sendInfo, firebase, name} = this.props;
        try{
            let refVote = firebase.database().ref(`projects/${name}/Songs/${id}/`).remove();
            sendInfo({
                title: 'Song '+song.name+' Deleted',
                position: 'tr',
            })
        }catch( e ){
            sendError({
                title: 'Error Deleting '+song,
                position: 'tr',
            })
        }
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
            { songs != undefined || !isEmpty(songs) ? (
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
                        console.log(disabledDown)
                        // if(active && visableDelete) this.sendActiveMsg();
                        return (
                            <span key={id}>
                            <SongItem
                                author={ author }
                                disabledUp = {disabledUp}
                                disabledDown = {disabledDown}
                                song={song.song}
                                votes={song.song.project.votes}
                                active={active}
                                upVote={this.upVote}
                                downVote = { this.downVote }
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
                <div className={classes.empty}>Song Queue Empty</div>
            )}
            </Paper>
    )
    }
}
