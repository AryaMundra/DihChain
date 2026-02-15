import { Box, Typography, Paper } from "@mui/material";

export default function Dashboard() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Paper sx={{ p: 4 }}>
        <Typography variant="body1" color="text.secondary">
          Welcome to PayStream Vault Dashboard.
          <br />
          This is your main overview page.
        </Typography>
      </Paper>
    </Box>
  );
}