import React from 'react';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import Checkbox from 'material-ui/Checkbox';
import classes from './Grid.scss'

const styles = {
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    gridList: {
        width: '50vh',
        height: '70vh',
        overflowY: 'auto',
    },
};


const Grid= ({tilesData, handleTouchTap}) => (
    <GridList
        cellHeight={180}
        cols={2}
        style={styles.gridList}
        className={classes.Grid}
        cellHeight={200}
        padding={1}
    >
        {tilesData.map((tile) => (
            <span 
                key={tile.id}>  
            <GridTile
                key={tile.name+tile.album.images[0].url}
                title={tile.name}
                subtitle={<span> by <b>{tile.artists.map( artist => <b> { artist.name } </b> )}</b></span>}
                actionIcon={
                    <Checkbox
                        style={styles.checkbox}
                        onCheck={ (e) => {handleTouchTap(tile)}}
                    />
                }
            >
                <img src={tile.album.images[0].url} />
            </GridTile>
        </span>
        ))}
    </GridList>
);
export default Grid;
