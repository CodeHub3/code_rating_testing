import {useParams} from "react-router-dom";
import {useList, useCustomMutation, useNavigation} from "@refinedev/core";
import {
    DataGrid, GridColDef
} from "@mui/x-data-grid";
import {
    Checkbox, CircularProgress, Typography, Box, Grid, Paper, Avatar, Divider, Alert
} from "@mui/material";
import {LineChart} from "@mui/x-charts";
import dayjs from "dayjs";
import {RatingChip} from "../../components";

export const RepoContributors = () => {
    const {repoId} = useParams();
    const {data, isLoading, refetch, error} = useList({resource: `repos/${repoId}/contributors`});
    const {push} = useNavigation();

    const {mutate} = useCustomMutation();

    const handleToggleExclusion = (username: string, currentStatus: boolean) => {
        mutate({
            url: `users/${username}/toggle_exclusion/`,
            method: "post",
            values: {},
            successNotification: () => ({
                message: `User ${currentStatus ? "included" : "excluded"} from ratings`,
                type: "success",
            }),
        }, {onSuccess: () => refetch()});
    };

    const handleContributorSelection = (username: string) => {
        push(`/repo/${repoId}/contributor/${username}`);
    };

    if (isLoading) {
        return (
            <Box sx={{ p: 3, textAlign: "center" }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Loading Contributors...</Typography>
            </Box>
        );
    }

    if (error || !data?.data) {
        return (
            <Box sx={{ p: 3, textAlign: "center" }}>
                <Alert severity="error">
                    {"Error loading Contributors. Please try again."}
                </Alert>
            </Box>
        );
    }

    const contributors = data?.data || [];

    const sortedContributors = [...contributors].sort((a, b) => b.total_commits - a.total_commits);

    const columns: GridColDef[] = [
        {
            field: "username",
            headerName: "Username",
            minWidth: 120,
            flex: 0.5,
            align: "center",
            renderCell: (params) => (
                <Box sx={{display: "flex", alignItems: "center", height: "100%"}}>
                    {params.row.avatar_url && (
                        <Avatar src={params.row.avatar_url} alt={params.value} sx={{width: 30, height: 30, mr: 1}}/>
                    )}
                    <Typography variant="body1">{params.value}</Typography>
                </Box>
            ),
        },
        {field: "email", headerName: "Email", minWidth: 120, flex: 0.5},
        {field: "total_rated_commits_authored", headerName: "Rated Commits", minWidth: 100, type: "number", align: "center",},
        {field: "total_tasks_closed", headerName: "Tasks Closed", minWidth: 100, type: "number", align: "center",},
        {field: "total_commits", headerName: "Total Commits", minWidth: 100, type: "number", align: "center",},
        {
            field: "average_complexity_author_rating",
            headerName: "(Author) Avg. Complexity Rating",
            minWidth: 100,
            type: "number",
            align: "center",
            renderCell: (params) => (
                <RatingChip rating={params.value} tooltipText="Average Author Code Complexity Rating for commits by this contributor."/>
            ),
        },
        {
            field: "average_complexity_peer_rating",
            headerName: "(Peer) Avg. Complexity Rating",
            minWidth: 100,
            type: "number",
            align: "center",
            renderCell: (params) => (
                <RatingChip rating={params.value} tooltipText="Average Peer Code Complexity Rating for commits by this contributor."/>
            ),
        },
        {
            field: "average_complexity_overall_rating",
            headerName: "(Overall) Avg. Complexity Rating",
            minWidth: 100,
            type: "number",
            align: "center",
            renderCell: (params) => (
                <RatingChip rating={params.value} tooltipText="Average Code Complexity Rating for commits by this contributor."/>
            ),
        },
        {
            field: "average_task_rating",
            headerName: "Avg. Task Rating",
            minWidth: 100,
            type: "number",
            align: "center",
            renderCell: (params) => (
                <RatingChip rating={params.value} tooltipText="Average Task Difficulty Rating"/>
            ),
        },
        {
            field: "exclude_from_ratings",
            headerName: "Excluded from Ratings",
            width: 150,
            align: "center",
            renderCell: (params) => (
                <Checkbox
                    checked={params.value}
                    onChange={() => handleToggleExclusion(params.row.username, params.value)}
                />
            ),
        },
    ];

    // Generate charts per contributor
    const contributorCharts = sortedContributors.map(contributor => {
        if (!contributor.weekly_commit_data?.length) return null;

        // Format commit history for visualization
        const formattedData = contributor.weekly_commit_data.map((week: { date: number; commits: any; }) => ({
            date: new Date(week.date * 1000).toISOString().split("T")[0],
            commits: week.commits,
        }));

        return (
            <Grid item xs={12} md={6} key={contributor.username}>
                <Paper sx={{p: 3, borderRadius: 3, boxShadow: 3, width: "100%"}}>
                    <Box sx={{display: "flex", alignItems: "center", mb: 1}}>
                        <Avatar src={contributor.avatar_url} alt={contributor.username}
                                sx={{width: 40, height: 40, mr: 1}}/>
                        <Typography variant="h6">
                            <strong style={{color: "blue"}}>{contributor.username}</strong>
                            <span
                                style={{fontSize: "14px", color: "gray"}}> ({contributor.total_commits} commits)</span>
                        </Typography>
                    </Box>
                    <Typography variant="body2">
                        <span style={{color: "green"}}>+{contributor.total_additions} additions</span> {" "}
                        <span style={{color: "red"}}>-{contributor.total_deletions} deletions</span>
                    </Typography>
                    <LineChart
                        dataset={formattedData}
                        xAxis={[{dataKey: "date", scaleType: "band", label: "Week of"}]}
                        yAxis={[{dataKey: "commits", min: 0, tickMinStep: 1, label: "Commits"}]}
                        series={[{dataKey: "commits", color: "blue", showMark: false}]}
                        height={250}
                    />
                </Paper>
            </Grid>
        );
    }).filter(Boolean); // Filter out null values

    return (
        <Box sx={{p: 3}}>
            <Typography variant="h5" sx={{mb: 3, fontWeight: "bold"}}>Contributors</Typography>

            <Paper sx={{p: 3, borderRadius: 3, boxShadow: 3, width: "100%"}}>
                <Typography variant="subtitle1" marginBottom={2}>Click on a contributor to view details.</Typography>
                <DataGrid rows={contributors} columns={columns} pageSizeOptions={[5, 10]} isRowSelectable={() => false}
                          sx={{border: 0, cursor: "pointer"}} onRowClick={(params) => handleContributorSelection(params.row.username)}/>
            </Paper>
            <Divider sx={{my: 4}}/>

            {/* ✅ Contributor Commit History Charts */}
            <Grid container spacing={3} sx={{mt: 4}}>
                {contributorCharts.length > 0 ? contributorCharts : (
                    <Typography variant="h6" sx={{textAlign: "center", width: "100%", mt: 2}}>
                        No contributor commit history available.
                    </Typography>
                )}
            </Grid>
        </Box>
    );
};
