"use client"

import {DataGrid} from '@mui/x-data-grid';
import {IconButton} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const get_columns = (deleteFunc, editFunc) =>
    [
        {field: 'id', headerName: 'ID', width: 70},
        {field: 'chat_id', headerName: 'CHAT ID', width: 150, type: 'number'},
        {field: 'description', headerName: 'DESCRIPTION', width: 200},
        {
            field: 'action',
            headerName: 'ACTION',
            sortable: false,
            width: 160,
            valueGetter: (params) => {
                return <div>
                    <IconButton aria-label="delete" size="large" onClick={() => deleteFunc(params.row.id)}>
                        <DeleteIcon/>
                    </IconButton>&nbsp;|&nbsp;
                    <IconButton aria-label="delete" size="large" onClick={() => editFunc(params.row.id)}>
                        <EditIcon/>
                    </IconButton>
                </div>
            }
        },
    ];

const get_rows = (data) => {
    if (Array.isArray(data)) {
        const result_list = []
        data.map((item) => {
            result_list.push({
                    id: item.id,
                    chat_id: item.chat_id,
                    description: item.description
                }
            )
        })
        return result_list
    }
    return [];
}

export default function ConfigList(props) {
    const {data, deleteFunc, editFunc} = props
    return (
        <div style={{height: 400, width: '100%'}}>
            <DataGrid
                rows={get_rows(data)}
                columns={get_columns(deleteFunc, editFunc)}
                initialState={{
                    pagination: {
                        paginationModel: {page: 0, pageSize: 5},
                    },
                }}
                pageSizeOptions={[5, 10]}
            />
        </div>
    );
}