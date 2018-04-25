import React, {Component} from 'react'
import ContentAdd from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import {push} from 'react-router-redux'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firebaseConnect, getVal } from 'react-redux-firebase'
import SongsList from '../../componets/SongsList/index.js'
import { UserIsAuthenticated } from 'utils/router'
import { success, error, warning, info, removeAll } from 'react-notification-system-redux';
import { isEmpty } from 'react-redux-firebase'

const fixedbutton = {
    position: 'fixed',
    bottom: '50px',
    right: '50px', 
    size: '400px'
}

const mapDispatchToProps = (dispatch)=> {
    return({
        changeLocation: (loc) => dispatch(push(loc)),
        sendError: (errorObj) => dispatch(error(errorObj)),
        sendInfo: (infoObj) => dispatch(info(infoObj)),
    })
}

@UserIsAuthenticated

@firebaseConnect((props) => {
    return [
        { path: 'projects' }, // create todo listener
    ]
})

@connect(({ firebase, firebase: { auth, profile },},props) => (
    {
        project:  firebase.data.projects ? firebase.data.projects[`${props.params.name}`] : "" , // lodash's get can also be used
        auth: auth,
        name: props.params.name,
        profile,
        uid: auth.uid,
    }),
    mapDispatchToProps,
)

export default class Lists extends Component {
    onClick = e => {
        this.props.changeLocation(`Host/Songs/${this.props.params.name}`) 
    }

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
        const { sendInfo, sendError, firebase, name} = this.props;
        try{
            let ref =  firebase.database().ref(`projects/${name}/Songs/${id}/`);
            ref.remove( e =>{
                if( error ) throw Error(e.message)
                sendInfo({
                    title: 'Song '+song.name+' Deleted',
                    position: 'tr',
                })
            });
        }catch( e ){
            sendError({
                title: 'Error Deleting '+song,
                position: 'tr',
            })
            console.error(e.message,e.stack)
        }
    }


    render() {
        const {project,params,uid} = this.props;
        const songs = project ? project.Songs: null;
        return (
            <div> 
                { !isEmpty(songs) ? (
                    <SongsList 
                        uid={uid}
                        onDelete={this.onDelete}
                        upVote={this.upVote}
                        downVote={this.downVote}
                        admin={project.createdBy}
                        name={params.name} 
                        songs={songs} /> 
                ) : (
                    <div className={""}>Song Queue Empty</div>
                )}
                <FloatingActionButton 
                    style={fixedbutton}
                    secondary={true}
                    onClick={this.onClick}>
                    <ContentAdd />
                </FloatingActionButton>
            </div>
        );
    }
}

