import {useCustomMutation, useInvalidate, useList} from "@refinedev/core";
import {DataGrid, GridColDef} from "@mui/x-data-grid";
import {CircularProgress, Typography, Container, Checkbox, Grid2, Paper, Box, Alert} from "@mui/material";
import {RatingChip} from "../../components";

export const Users = () => {
        const {data, isLoading, error} = useList({resource: "users"});
        const {mutate} = useCustomMutation();
        const invalidate = useInvalidate(); // Refetch data after mutation

        const handleToggleExclusion = (username: string, currentStatus: boolean) => {
            mutate({
                    url: `users/${username}/toggle_exclusion/`, // Calls the correct API endpoint
                    method: "post",
                    values: {}, // No need to send additional data
                    successNotification: () => ({
                        message: `User ${currentStatus ? "included" : "excluded"} from ratings`,
                        type: "success",
                    }),
                },
                {
                    onError: (error, variables, context) => {
                        // An error occurred!
                    },
                    onSuccess: () => {
                        invalidate({resource: "users", invalidates: ["list"]});
                    },
                }
            );
        };

        const columns: GridColDef[] = [
            {field: "username", headerName: "Username", minWidth: 200, flex: 0.5},
            {field: "email", headerName: "Email", minWidth: 200, flex: 0.5},
            {field: "rating_count", headerName: "Ratings", minWidth: 100, align: "center", },
            {
                field: "total_repositories",
                headerName: "Total Repositories",
                width: 100,
                align: "center",
            },
            {
                field: "total_commits",
                headerName: "Total Commits",
                width: 100,
                align: "center",
            },
            {
                field: "total_tasks",
                headerName: "Total Tasks",
                width: 100,
                align: "center",
            },
            {
                field: "average_commit_rating",
                headerName: "Avg. Commit Rating",
                minWidth: 100,
                flex: 0.5,
                align: "center",
                renderCell: (params) => (
                    <RatingChip rating={params.value} tooltipText="Average Code Complexity Rating for all rated commits of this user across all registered repositories" />
                ),
            },
            {
                field: "average_task_rating",
                headerName: "Avg. Task Rating",
                minWidth: 100,
                flex: 0.5,
                align: "center",
                renderCell: (params) => (
                    <RatingChip rating={params.value} tooltipText="Average Code Complexity Rating for all rated commits of this user across all registered repositories" />
                ),
            },
            {
                field: "exclude_from_ratings",
                headerName: "Excluded from Ratings",
                width: 200,
                align: "center",
                renderCell: (params) => (
                    <Checkbox
                        checked={params.value}
                        onChange={() => handleToggleExclusion(params.row.username, params.value)}
                    />
                ),
            },
        ];

        if (isLoading) {
            return (
                <Box sx={{p: 3, textAlign: "center"}}>
                    <CircularProgress/>
                    <Typography sx={{mt: 2}}>Loading Users...</Typography>
                </Box>
            );
        }

        if (error || !data?.data) {
            return (
                <Box sx={{p: 3, textAlign: "center"}}>
                    <Alert severity="error">
                        {"Error loading users. Please try again."}
                    </Alert>
                </Box>
            );
        }

        return (
            <Grid2>
                <Grid2 sx={{display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3}}>
                    <Typography variant="h4" fontWeight="bold">
                        Users
                    </Typography>
                </Grid2>
                <Paper variant="outlined" sx={{p: 3, borderRadius: 3, boxShadow: 3}}>
                    <DataGrid
                        rows={data?.data || []}
                        columns={columns}
                        pageSizeOptions={[5, 10, 25]}
                        isRowSelectable={() => false}
                        sx={{border: 0}}
                    />
                </Paper>
            </Grid2>
        );
    }
;
