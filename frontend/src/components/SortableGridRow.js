import React from 'react';
import { GridRow } from '@mui/x-data-grid';


const DragState = {
    rowId: -1,
    dropId: -1 // drag target
};

export const reOrderRows = (rowId, dropId, rows, setRows) => {
    let newRows = rows.slice();
    const rowPos = newRows.findIndex(el => el.id === rowId );
    const row = newRows[rowPos];
    newRows.splice(rowPos, 1);
    const dropPos = newRows.findIndex(el => el.id === dropId );
    newRows.splice(dropPos, 0, row);
    setRows(newRows);
};

const SortableGridRow = (props) => {
    const handleReorder = props.handleReorder;
    let newProps = Object.assign({}, props);
    delete newProps.handleReorder;

    return (
        <GridRow {...newProps}
                 draggable="true"
                 onDragStart={(e) => {
                     DragState.rowId = props.row.id
                 }}
                 onDragEnter={e => {
                     e.preventDefault();
                     if (props.row.id !== DragState.rowId) {
                         DragState.dropId = props.row.id;
                     }
                 }}
                 onDragEnd={(e) => {
                     if (DragState.dropId !== -1) {
                         handleReorder(DragState.rowId, DragState.dropId);
                     }
                     DragState.rowId = -1;
                     DragState.dropId = -1;
                 }}
        />
    );
};
export default SortableGridRow;
