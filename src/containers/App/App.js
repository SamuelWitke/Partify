import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Router } from 'react-router'
import { Provider } from 'react-redux'
import hashHistory from '../../history';
import {connect} from 'react-redux';

// Themeing/Styling
import Theme from 'theme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Notifications from 'react-notification-system-redux';


class AppContainer extends Component {
    static childContextTypes = {
        muiTheme: PropTypes.object
    }

    static propTypes = {
        routes: PropTypes.object.isRequired,
        store: PropTypes.object.isRequired
    }

    getChildContext = () => ({
        muiTheme: getMuiTheme(Theme)
    })

    render() {
        const { routes, store } = this.props
        const {notifications} = this.props;
        return (
            <Provider store={store}>
                <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                    <div>
                        <Notifications notifications={notifications} />
                        <Router history={hashHistory}>{routes}</Router>
                    </div>
                </MuiThemeProvider>
            </Provider>
        )
    }
}

export default connect(
    state => ({ notifications: state.notifications })
)(AppContainer);
