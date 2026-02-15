import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useWeb3 } from "../../web3/useWeb3";

export default function Navbar() {
  const { account, connectWallet } = useWeb3();

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography sx={{ flexGrow: 1 }} variant="h6">
          PayStream Vault
        </Typography>

        <Button color="inherit" onClick={connectWallet}>
          {account
            ? account.slice(0, 6) + "..." + account.slice(-4)
            : "Connect Wallet"}
        </Button>
      </Toolbar>
    </AppBar>
  );
}