import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  CircularProgress,
  Divider,
} from "@mui/material";
import { useState } from "react";
import { ethers } from "ethers";
import { useWeb3 } from "../web3/useWeb3";
import { toast } from "react-toastify";

export default function Streams() {
  const { contract, isOwner } = useWeb3();

  const [employee, setEmployee] = useState("");
  const [salary, setSalary] = useState("");
  const [tax, setTax] = useState("");
  const [earnedAmount, setEarnedAmount] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // Start Stream
  // =========================
  const handleStartStream = async () => {
    try {
      if (!contract) return;
      if (!employee || !salary || tax === "")
        return toast.warning("Fill all fields");

      setLoading(true);

      const parsedSalary = ethers.parseUnits(salary, 18);

      const tx = await contract.startStream(
        employee,
        parsedSalary,
        Number(tax)
      );

      await tx.wait();

      toast.success("Stream Started Successfully!");
      setEmployee("");
      setSalary("");
      setTax("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to start stream");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Pause Stream
  // =========================
  const handlePause = async () => {
    try {
      if (!contract || !employee)
        return toast.warning("Enter employee address");

      setLoading(true);

      const tx = await contract.pauseStream(employee);
      await tx.wait();

      toast.success("Stream Paused");
    } catch (err) {
      console.error(err);
      toast.error("Pause Failed");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Cancel Stream
  // =========================
  const handleCancel = async () => {
    try {
      if (!contract || !employee)
        return toast.warning("Enter employee address");

      setLoading(true);

      const tx = await contract.cancelStream(employee);
      await tx.wait();

      toast.success("Stream Cancelled");
    } catch (err) {
      console.error(err);
      toast.error("Cancel Failed");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Check Earned
  // =========================
  const handleCheckEarned = async () => {
    try {
      if (!contract || !employee)
        return toast.warning("Enter employee address");

      const amount = await contract.earned(employee);
      setEarnedAmount(ethers.formatUnits(amount, 18));
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch earned amount");
    }
  };

  if (!isOwner) {
    return (
      <Typography color="error">
        Only contract owner can manage streams.
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Stream Management
      </Typography>

      <Paper sx={{ p: 4 }}>
        <Stack spacing={3}>
          <TextField
            label="Employee Address"
            value={employee}
            onChange={(e) => setEmployee(e.target.value)}
            fullWidth
          />

          <Divider />

          <TextField
            label="Monthly Salary (HLUSD)"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            fullWidth
          />

          <TextField
            label="Tax Percentage"
            value={tax}
            onChange={(e) => setTax(e.target.value)}
            fullWidth
          />

          <Button
            variant="contained"
            onClick={handleStartStream}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Start Stream"}
          </Button>

          <Divider />

          <Button
            variant="outlined"
            color="warning"
            onClick={handlePause}
            disabled={loading}
          >
            Pause Stream
          </Button>

          <Button
            variant="outlined"
            color="error"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel Stream
          </Button>

          <Divider />

          <Button variant="outlined" onClick={handleCheckEarned}>
            Check Earned Amount
          </Button>

          {earnedAmount && (
            <Typography>
              Earned: <strong>{earnedAmount} HLUSD</strong>
            </Typography>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}