import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { ethers } from "ethers";
import { useWeb3 } from "../web3/useWeb3";
import { CONTRACT_ADDRESS } from "../web3/config";
import { toast } from "react-toastify";

export default function Treasury() {
  const { contract, hlusd, account, isOwner } = useWeb3();

  const [balance, setBalance] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchBalance = async () => {
    try {
      if (!contract) return;
      const bal = await contract.treasuryBalance();
      setBalance(ethers.formatUnits(bal, 18));
    } catch (err) {
      toast.error("Failed to fetch balance");
    }
  };

  const handleDeposit = async () => {
    try {
      console.log("strat");
      if (!contract || !hlusd) return;
      if (!amount) return toast.warning("Enter amount");

      setLoading(true);

      const parsedAmount = ethers.parseUnits(amount, 18);
      console.log(parsedAmount);
      console.log("approved start");
      // Step 1: Approve HLUSD
      const approveTx = await hlusd.approve(CONTRACT_ADDRESS, parsedAmount);
      await approveTx.wait();
      console.log("approved end");

      // Step 2: Deposit
      const depositTx = await contract.depositTreasury(parsedAmount);
      await depositTx.wait();
      console.log("deposit end");

      toast.success("Treasury Deposited Successfully!");
      setAmount("");
      fetchBalance();
    } catch (err) {
      console.error(err);
      toast.error("Transaction Failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isOwner) {
    return (
      <Typography color="error">
        Only contract owner can access Treasury Management.
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Treasury Management
      </Typography>

      <Paper sx={{ p: 4 }}>
        <Stack spacing={3}>
          <Button variant="outlined" onClick={fetchBalance}>
            Refresh Treasury Balance
          </Button>

          <Typography>
            Current Balance:{" "}
            <strong>{balance ? `${balance} HLUSD` : "—"}</strong>
          </Typography>

          <TextField
            label="Deposit Amount (HLUSD)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
          />

          <Button
            variant="contained"
            onClick={handleDeposit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Approve & Deposit"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}