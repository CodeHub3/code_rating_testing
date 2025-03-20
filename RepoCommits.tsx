import {useParams} from "react-router-dom";
import {useList, useNavigation} from "@refinedev/core";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {
    CircularProgress, Link, Typography, Chip, Box, Tooltip, Paper, Avatar, Alert
} from "@mui/material";
import CommitIcon from "@mui/icons-material/Commit";
import dayjs from "dayjs";
import {RatingChip} from "../../components";

interface User {
    username: string;
}

/*interface Task {
    number: number;
    title: string;
    url: string;
}*/

export const RepoCommits = () => {
    const {repoId} = useParams();
    const {data, isLoading, error} = useList({resource: `repos/${repoId}/commits`});
    const {push} = useNavigation();

    const handleCommitSelection = (commitHash: string) => {
        push(`/repo/${repoId}/commit/${commitHash}`);
    };

    // THIS IS A COMMENT

    const columns: GridColDef[] = [
        {
            field: "message", headerName: "Message", minWidth: 250, flex: 0.4, renderCell: (params) => (
                <Box display="flex" alignItems="center" gap={1}>
                    <CommitIcon color="primary"/>
                    {params.value.split('\n')[0]}
                </Box>
            )
        },
        {
            field: "author",
            headerName: "Author",
            minWidth: 150,
            valueGetter: (value: User) => value?.username || "Unknown",
        },
        {
            field: "timestamp",
            headerName: "Date",
            minWidth: 180,
            align: "center",
            renderCell: (params) => (
                <Box display="flex" alignItems="center" height="100%" width="100%">
                    <Typography variant="body2">
                        {params.value ? dayjs(params.value).format("YYYY-MM-DD HH:mm") : "N/A"}
                    </Typography>
                </Box>
            ),
        }, {
            field: "average_author_rating",
            headerName: "Author Rating",
            minWidth: 50,
            align: "center",
            renderCell: (params) => (
                <RatingChip rating={params.value} tooltipText="Average Author Code Compexity Rating"/>
            ),
        },
        {
            field: "average_peer_rating",
            headerName: "Peer Rating",
            minWidth: 50,
            align: "center",
            renderCell: (params) => (
                <RatingChip rating={params.value} tooltipText="Average Peer Code Compexity Rating"/>
            ),
        },
        {
            field: "average_complexity_rating",
            headerName: "Overall Rating",
            minWidth: 50,
            align: "center",
            renderCell: (params) => (
                <RatingChip rating={params.value} tooltipText="Average Overall Code Compexity Rating"/>
            ),
        },
        {
            field: "related_tasks",
            headerName: "Tasks",
            minWidth: 200,
            flex: 1,
            align: "center",
            renderCell: (params) => (
                params.value?.length ? (
                    <Box display="flex" height="100%" justifyContent="center" alignItems="center" flexWrap="wrap"
                         gap={1}>
                        {params.value.map((task: Task) => (
                            <Tooltip key={task.number} title={task.title}>
                                <Chip
                                    label={`#${task.number}`}
                                    color="info"
                                />
                            </Tooltip>
                        ))}
                    </Box>
                ) : ""
            )
        },
        {
            field: "url",
            headerName: "URL",
            minWidth: 150,
            flex: 0.5,
            renderCell: (params) => (
                <Link href={params.value} target="_blank" rel="noopener noreferrer">
                    View on Github
                </Link>
            )
        },
    ];

    if (isLoading) {
        return (
            <Box sx={{ p: 3, textAlign: "center" }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Loading Commits...</Typography>
            </Box>
        );
    }

    if (isLoading) {
        return (
            <Box sx={{ p: 3, textAlign: "center" }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Loading Commits...</Typography>
            </Box>
        );
    }

    if (error || !data?.data) {
        return (
            <Box sx={{ p: 3, textAlign: "center" }}>
                <Alert severity="error">
                    {"Error loading Commits. Please try again."}
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{p: 3}}>
            <Typography variant="h5" sx={{mb: 3, fontWeight: "bold"}}>Commits</Typography>
            <Paper sx={{p: 3, borderRadius: 3, boxShadow: 3, width: "100%"}}>
                <Typography variant="subtitle1" marginBottom={2}>Click on a commit to view details.</Typography>
                <DataGrid rows={data?.data || []} columns={columns} pageSizeOptions={[5, 10]}
                          isRowSelectable={() => false} sx={{border: 0, cursor: "pointer",}}
                          onRowClick={(params) => handleCommitSelection(params.row.commit_hash)}
                />
            </Paper>
        </Box>
    );
};
