import React from 'react';
import PropTypes from 'prop-types';
import loginSVG from './log_in.svg';

export const SpotifyLogin= () => (
	<div className="login">                                                                           
		<h2>Click to login in</h2>                                                                 
        <a href="/login" >
            <img src={loginSVG} />
        </a>                              
	</div>  
)
