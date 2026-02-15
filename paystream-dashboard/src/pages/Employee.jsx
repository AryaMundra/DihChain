import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useWeb3 } from "../web3/useWeb3";
import { toast } from "react-toastify";

export default function Employee() {
  const { contract, account } = useWeb3();

  const [earned, setEarned] = useState("0");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);

  // =========================
  // Fetch Earned Amount
  // =========================
  const fetchEarned = async () => {
    try {
      if (!contract || !account) return;

      setChecking(true);
      const amount = await contract.earned(account);
      setEarned(ethers.formatUnits(amount, 18));
    } catch (err) {
      console.error(err);
    } finally {
      setChecking(false);
    }
  };

  // Auto refresh every 5 seconds
  useEffect(() => {
    fetchEarned();

    const interval = setInterval(() => {
      fetchEarned();
    }, 5000);

    return () => clearInterval(interval);
  }, [contract, account]);

  // =========================
  // Withdraw Salary
  // =========================
  const handleWithdraw = async () => {
    try {
      if (!contract) return;

      setLoading(true);

      const tx = await contract.withdraw();
      await tx.wait();

      toast.success("Withdrawal Successful!");
      fetchEarned();
    } catch (err) {
      console.error(err);
      toast.error("Withdrawal Failed");
    } finally {
      setLoading(false);
    }
  };

  if (!account) {
    return (
      <Typography color="error">
        Connect wallet to access employee portal.
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Employee Portal
      </Typography>

      <Paper sx={{ p: 4 }}>
        <Stack spacing={3}>
          <Typography>
            Connected Wallet:
            <br />
            <strong>{account}</strong>
          </Typography>

          <Typography variant="h6">
            Earned Salary:
          </Typography>

          <Typography variant="h4" color="primary">
            {checking ? (
              <CircularProgress size={28} />
            ) : (
              `${earned} HLUSD`
            )}
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={handleWithdraw}
            disabled={loading || Number(earned) === 0}
          >
            {loading ? <CircularProgress size={24} /> : "Withdraw Salary"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}