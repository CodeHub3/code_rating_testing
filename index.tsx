import { Chip, Tooltip } from "@mui/material";
import { getRatingColor } from "../../utils/colorUtils";

interface RatingChipProps {
    rating: number | null;
    label?: string;
    tooltipText?: string;
}

export const RatingChip = ({ rating, label, tooltipText }: RatingChipProps) => {
    const formatRating = (value: number | null) => {
        if (value === null || value === undefined) return "N/A";
        return Number.isInteger(value) ? `${value} / 7` : `${value.toFixed(1)} / 7`;
    };

    const ratingText = formatRating(rating);
    const displayText = label ? `${label}: ${ratingText}` : `${ratingText}`;
    const tooltipMessage = tooltipText ?? (label ? `${label}: ${ratingText}` : displayText);

    return (
        <Tooltip title={tooltipMessage}>
            <Chip
                label={displayText}
                sx={{
                    bgcolor: getRatingColor(rating),
                    color: "#fff",
                    fontWeight: "bold",
                    borderRadius: 4,
                    px: 0,
                }}
            />
        </Tooltip>
    );
};
