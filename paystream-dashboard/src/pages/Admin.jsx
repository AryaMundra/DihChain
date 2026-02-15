import { Box, Typography, Paper } from "@mui/material";

export default function Admin() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Controls
      </Typography>

      <Paper sx={{ p: 4 }}>
        <Typography variant="body1" color="text.secondary">
          Admin-only operations:
          <br />
          • Pay Bonus
          <br />
          • Update Tax Vault
        </Typography>
      </Paper>
    </Box>
  );
}