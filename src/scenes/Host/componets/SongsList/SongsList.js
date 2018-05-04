import Immutable from 'immutable';
import PropTypes from 'prop-types';
import styles from './SongsList.scss';
import * as React from 'react';
import { List, AutoSizer} from 'react-virtualized'
import SongItem from '../SongItem'


export default class SongsList extends React.PureComponent {

    constructor(props) {
        super(props);
        console.log(this.props.list)
        this.state = {
            listHeight: 300,
            listRowHeight: 50,
            overscanRowCount: 10,
            rowCount: props.list.size,
            scrollToIndex: undefined,
            showScrollingPlaceholder: true,
            useDynamicRowHeight: true,
        };

    }

    render() {
        const {
            listHeight,
            listRowHeight,
            overscanRowCount,
            rowCount,
            scrollToIndex,
            showScrollingPlaceholder,
            useDynamicRowHeight,
        } = this.state;

        return (
            <div>
                <AutoSizer >
                    {({dimensions}) => (
                        <List
                            width={ 300 }
                            height = { 300 }
                            rowHeight = { 30 }
                            rowWidth = { 30 }
                            rowRenderer={this._rowRenderer}
                            rowStyle={ { alignItems: 'stretch' } }
                            className={styles.List}
                            height={listHeight}
                            overscanRowCount={5}
                            rowCount={rowCount}
                        />
                    )}
                </AutoSizer>
            </div>
        );
    }

    _getDatum = (index) => {
        const {list} = this.props;
        return list.get(index % list.size);
    }

    
    _rowRenderer=({index, isScrolling, key, style}) => {
        const  { admin, list, upVote, downVote, onDelete } = this.props;
        const row = list.get(index)
        console.log(row)
        return (
            <div key={row.id} className={styles.row}> {JSON.stringify(row)}</div>
        );
    }
}
/*
                <SongItem
                    author={ datum.author }
                    disabledUp = {datum.disabledUp}
                    disabledDown = {datum.disabledDown}
                    song={datum.song}
                    votes={datum.song.project.votes}
                    visableDelete={datum.visableDelete || admin}
                    active={datum.active}
                    upVote={upVote}
                    downVote = {downVote }
                    onDeleteClick = {onDelete}
                    id={datum.id}
                />
                */

