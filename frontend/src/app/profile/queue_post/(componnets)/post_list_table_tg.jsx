"use client"

import {DataGrid} from '@mui/x-data-grid';
import {Alert, Box, IconButton, Typography} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import '../../../../styles/data-grid.css';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import moment from "moment";
import EditIcon from "@mui/icons-material/Edit";

const get_columns = (deleteFunc) =>
    [
        {field: 'id', headerName: 'ID', align: "left", headerClassName: 'data-grid-header'},
        {field: 'title', headerName: 'TITLE', width: 220, align: "left", headerClassName: 'data-grid-header'},
        {
            field: 'if_posted',
            headerName: 'POSTED',
            width: 100,
            align: "center",
            headerClassName: 'data-grid-header',
            renderCell: (params) => {
                if (params.row.is_posted)
                    return (
                        <Box>
                            {params.row.post_result &&
                                <Box>
                                    <Typography component="p" variant="body2">
                                        {params.row.post_result.success ?
                                            <CheckIcon color="success"/> :
                                            <CloseIcon color="warning"/>
                                        }
                                    </Typography>
                                </Box>
                            }
                        </Box>
                    )
                else
                    return "-"
            },
        },
        {
            field: 'when',
            headerName: 'POST DATE',
            width: 150,
            align: "center",
            headerAlign: "center",
            headerClassName: 'data-grid-header',
            valueGetter: (params) => {
                return `${moment(params.row.when).format("DD-MM-YYYY hh:mm")}`
            }
        },
        {
            field: 'message',
            headerName: 'Server Message',
            sortable: false,
            width: 250,
            align: "center",
            headerAlign: "center",
            headerClassName: 'data-grid-header',
            renderCell: (params) => (
                <Box>
                    <textarea readOnly={true}>
                        {params.row.post_result.msg ? params.row.post_result.msg : "-"}
                    </textarea>
                </Box>
            )
        },
        {
            field: 'action',
            headerName: 'ACTION',
            sortable: false,
            width: 100,
            align: "center",
            headerAlign: "center",
            headerClassName: 'data-grid-header',
            renderCell: (params) => (
                <Box display="flex" justifyContent="right" alignItems="center">
                    <IconButton aria-label="delete" size="large" onClick={() => deleteFunc(params.row.id)}>
                        <DeleteIcon color="warning"/>
                    </IconButton>
                </Box>
            )
        },
    ];

const get_rows = (data) => {
    if (Array.isArray(data)) {
        const result_list = []
        console.log("data=", data)
        data.map((item) => {
            result_list.push({
                    id: item.id,
                    title: item.title,
                    is_posted: item.is_posted,
                    post_result: item.post_result,
                    when: item.when
                }
            )
        })
        return result_list
    }
    return [];
}

export default function PostListTableTg(props) {
    const {data, deleteFunc} = props
    return (
        <div style={{height: 500, width: '100%'}}>
            <DataGrid
                rowHeight={104}
                rows={get_rows(data)}
                columns={get_columns(deleteFunc)}
                initialState={{
                    pagination: {
                        paginationModel: {page: 0, pageSize: 10},
                    },
                }}
                pageSizeOptions={[10, 100]}
            />
        </div>
    );
}
