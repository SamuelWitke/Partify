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


const Grid= ({items, handleTouchTap}) => (
    <GridList
        cellHeight={180}
        cols={2}
        cellHeight={200}
        padding={1}
    >

        {items.map((item) => (
            <span
                key={item.id}>
            <GridTile
                key={item.name}
                title={item.name}
                actionIcon={
                    <Checkbox
                        style={styles.checkbox}
                        onCheck={ (e) => {handleTouchTap(item)}}
                    />
                }
            >
           <img src={item.images[0].url} />
            </GridTile>
        </span>
        ))}
    </GridList>
);
export default Grid;

