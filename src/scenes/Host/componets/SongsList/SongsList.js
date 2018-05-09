import Immutable from 'immutable';
import PropTypes from 'prop-types';
import classes from './SongsList.scss';
import React from 'react';
import { List, AutoSizer} from 'react-virtualized'
import SongItem from '../SongItem/index.js'

export default class SongsList extends React.Component {
      constructor(props) {
        super(props);
      }
    componentWillReceiveProps(){
        this.refs.forceUpdateGrid();
    }
    render() {
        return (
            <div className={classes.container} style={{ display: 'flex' }}>
                <div style={{ flex: '1 1 auto' , height: '100vh'}}>
                    <AutoSizer>
                        { ({width, height}) => {
                            return <List
                                className={classes.List}
                                ref={ref => this.refs = ref}
                                rowCount={this.props.list.size}
                                rowStyle={ { alignItems: 'stretch' } }
                                width={width}
                                height={height}
                                rowHeight={500}
                                rowRenderer={this._rowRenderer}
                            />
                        }}
                    </AutoSizer>
                </div>
            </div>
        );
    }

    _rowRenderer=({index, isScrolling, key, style}) => {
        const  { active, admin, list, upVote, downVote, onDelete } = this.props;
        const row = list.get(index)
        const activeSong = row.song.uri === active
        return (
            <div
                className={classes.row}
                key={key}
                style={style}
            >
                <SongItem
                    author={ row.author }
                    disabledUp = {row.disabledUp}
                    disabledDown = {row.disabledDown}
                    song={row.song}
                    name={row.song.name}
                    votes={row.song.project.votes}
                    visableDelete={ admin || row.visableDelete}
                    active={active}
                    upVote={upVote}
                    active = { activeSong }
                    downVote = {downVote }
                    onDeleteClick = {onDelete}
                    id={row.id}
                    img = { row.img }
                />
            </div>
        );
    }
}
/*

*/

