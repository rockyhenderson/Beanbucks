import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          BeanBucks
        </Typography>
        <Button color="inherit" component={Link} to="/">Home</Button>
        <Button color="inherit" component={Link} to="/order">Order</Button>
        <Button color="inherit" component={Link} to="/rewards">Rewards</Button>
        <Button color="inherit" component={Link} to="/store">Store</Button>
        <Button color="inherit" component={Link} to="/profile">Profile</Button>
        <Button color="inherit" component={Link} to="/cart">Cart</Button>
        <Button color="inherit" component={Link} to="/admin">BeanAdmin</Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
