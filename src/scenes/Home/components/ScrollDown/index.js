import React from "react";
import classes from './ScrollDown.scss'; 
import { animateScroll as scroll } from 'react-scroll'

const ScrollDown = () => (
    <p className={classes.scrolldown}>
        <a className='smoothscroll' onClick={ e=>{
            scroll.scrollToBottom();
        }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24"><path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"/></svg>
        </a>
    </p>
)
 export default ScrollDown;
