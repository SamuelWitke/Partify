import React, {Component} from 'react'
import ContentAdd from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import {push} from 'react-router-redux'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firebaseConnect, getVal } from 'react-redux-firebase'
import SongsList from '../../componets/SongsList/index.js'
import { UserIsAuthenticated } from 'utils/router'

const fixedbutton = {
    position: 'fixed',
    bottom: '50px',
    right: '50px', 
    size: '400px'
}

const mapDispatchToProps = (dispatch)=> {
    return({
        changeLocation: (loc) => dispatch(push(loc)),
        sendError: (errorObj) => dispatch(error(errorObj))
    })
}

@UserIsAuthenticated
@firebaseConnect((props) => {
    return [
        { path: 'projects' }, // create todo listener
    ]
})
@connect(({ firebase, firebase: { auth }  }, props) => (
    {
        project:  firebase.data.projects ? firebase.data.projects[`${props.params.name}`] : "" , // lodash's get can also be used
        uid: auth.uid,
    }),
    mapDispatchToProps,
)

class Lists extends Component {
    onClick = e => {
        this.props.changeLocation(`Host/Songs/${this.props.params.name}`) 
    }
    render() {
        const {project,params} = this.props;
        const songs = project ? project.Songs: null;
        return (
            <div> 
                <SongsList 
                    admin={project.createdBy}
                    name={params.name} 
                    songs={songs} /> 
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

export default Lists;
