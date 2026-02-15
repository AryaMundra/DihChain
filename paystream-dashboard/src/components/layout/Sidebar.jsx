import { Drawer, List, ListItem, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";

const drawerWidth = 220;

export default function Sidebar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          mt: 8,
        },
      }}
    >
      <List>
        <ListItem button component={Link} to="/">
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/treasury">
          <ListItemText primary="Treasury" />
        </ListItem>
        <ListItem button component={Link} to="/streams">
          <ListItemText primary="Streams" />
        </ListItem>
        <ListItem button component={Link} to="/employee">
          <ListItemText primary="Employee" />
        </ListItem>
        <ListItem button component={Link} to="/admin">
          <ListItemText primary="Admin" />
        </ListItem>
      </List>
    </Drawer>
  );
}