import React from 'react';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import Checkbox from 'material-ui/Checkbox';

const styles = {
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    gridList: {
        width: 500,
        height: 450,
        overflowY: 'auto',
    },
};


const Grid= ({tilesData, handleTouchTap}) => (
    <div>
        <GridList
            cellHeight={180}
        >
            {tilesData.map((tile) => (
                <GridTile
                    key={tile.href}
                    title={tile.name}
                    subtitle={<span>by <b>{tile.artists.map( artist => <b> { artist.name } </b> )}</b></span>}
                    actionIcon={
                        <Checkbox
                            style={styles.checkbox}
                            onCheck={ (e) => {handleTouchTap(tile)}}
                        />
                    }
                >
                    <img src={tile.album.images[0].url} />
                </GridTile>
            ))}
        </GridList>
    </div>
);
export default Grid;
