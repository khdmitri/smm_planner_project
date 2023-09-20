"use client"

import {DataGrid} from '@mui/x-data-grid';
import {Box, IconButton, Typography} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import '../../../../../styles/data-grid.css';

const get_columns = (deleteFunc, editFunc) =>
    [
        {field: 'id', headerName: 'ID', align: "left", headerClassName: 'data-grid-header'},
        {field: 'chat_id', headerName: 'GROUP ID', width: 150, align: "left", headerClassName: 'data-grid-header'},
        {
            field: 'description',
            headerName: 'DESCRIPTION',
            width: 200,
            align: "left",
            headerClassName: 'data-grid-header'
        },
        {
            field: 'action',
            headerName: 'ACTION',
            sortable: false,
            width: 150,
            headerAlign: "center",
            headerClassName: 'data-grid-header',
            renderCell: (params) => (
                <Box display="flex" justifyContent="right" alignItems="center">
                    <IconButton aria-label="delete" size="large" onClick={() => deleteFunc(params.row.id)}>
                        <DeleteIcon/>
                    </IconButton>
                    <Typography variant="span">
                        &nbsp;|&nbsp;
                    </Typography>
                    <IconButton aria-label="edit" size="large" onClick={() => editFunc(params.row.id)}>
                        <EditIcon/>
                    </IconButton>
                </Box>
            )
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