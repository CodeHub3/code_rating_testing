import {useParams, Outlet} from "react-router-dom";
import {Card, Typography, Container, CircularProgress, Grid2, Breadcrumbs, Box, Avatar, Chip} from "@mui/material";
import {RepoTabs} from "./RepoTabs";
import {useOne} from "@refinedev/core";
import {Link} from "react-router";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";

export const RepoDashboard = () => {
    const {repoId} = useParams();
    const {data, isLoading} = useOne({resource: "repos", id: repoId});

    const repo = data?.data;
    if (isLoading) return <CircularProgress/>;

    return (
        <Grid2>
            <Card sx={{ mb: 3, p: 3, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box display="flex" alignItems="center">
                    <Typography variant="h4" fontWeight="bold">
                        {repo?.name}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1} sx={{ ml: 6, p: 1}}>
                        <Typography variant="subtitle1" color="text.secondary">
                            <strong>{repo?.owner}</strong>
                        </Typography>
                    </Box>
                </Box>
                <Chip
                    label={repo?.rating_active ? "Tracking Enabled" : "Tracking Disabled"}
                    color={repo?.rating_active ? "success" : "warning"}
                    icon={<TrackChangesIcon />}
                />
            </Card>
            <RepoTabs/>
            <Card variant="outlined" sx={{mt: 2, p: 2, borderRadius: 5}}>
                <Outlet/>
            </Card>
        </Grid2>
    );
};
