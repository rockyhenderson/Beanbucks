import React from "react";
import {
  Box,
  Typography,
  Grid,
  Link as MuiLink,
  IconButton,
  Divider,
} from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter"; // X (Twitter)
import MusicNoteIcon from "@mui/icons-material/MusicNote"; // TikTok alt
import { Link } from "react-router-dom";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#161620",
        color: "#FFFFFF",
        padding: "2rem 1.5rem",
        mt: 8,
      }}
    >
      <Grid container spacing={4}>
        {/* Brand Info */}
        <Grid item xs={12} md={4}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#FD6100" }}>
            BeanBucks
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: "#CCC" }}>
            Brewed bold. Delivered fast.
          </Typography>
        </Grid>

        {/* Quick Links */}
        <Grid item xs={6} md={2}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Quick Links
          </Typography>
          <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 1 }}>
            <MuiLink component={Link} to="/" underline="hover" color="#FFF">
              Home
            </MuiLink>
            <MuiLink component={Link} to="/order" underline="hover" color="#FFF">
              Order
            </MuiLink>
            <MuiLink component={Link} to="/rewards" underline="hover" color="#FFF">
              Rewards
            </MuiLink>
            <MuiLink component={Link} to="/store" underline="hover" color="#FFF">
              Stores
            </MuiLink>
            <MuiLink component={Link} to="/admin" underline="hover" color="#FFF">
              Admin
            </MuiLink>
          </Box>
        </Grid>

        {/* Legal Links */}
        <Grid item xs={6} md={2}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Legal
          </Typography>
          <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 1 }}>
            <MuiLink component={Link} to="/privacy" underline="hover" color="#FFF">
              Privacy Policy
            </MuiLink>
            <MuiLink component={Link} to="/terms" underline="hover" color="#FFF">
              Terms & Conditions
            </MuiLink>
            <MuiLink component={Link} to="/cookies" underline="hover" color="#FFF">
              Cookie Preferences
            </MuiLink>
          </Box>
        </Grid>

        {/* Contact & Social */}
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Contact
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: "#CCC" }}>
            support@beanbucks.com
          </Typography>
          <Typography variant="body2" sx={{ color: "#CCC" }}>
            0123 456 789 (Mon–Fri 9am–5pm)
          </Typography>

          <Box sx={{ mt: 2 }}>
            <IconButton
              href="#"
              target="_blank"
              rel="noopener"
              sx={{ color: "#FD6100" }}
            >
              <InstagramIcon />
            </IconButton>
            <IconButton
              href="#"
              target="_blank"
              rel="noopener"
              sx={{ color: "#FD6100" }}
            >
              <MusicNoteIcon /> {/* TikTok placeholder */}
            </IconButton>
            <IconButton
              href="#"
              target="_blank"
              rel="noopener"
              sx={{ color: "#FD6100" }}
            >
              <TwitterIcon />
            </IconButton>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3, borderColor: "#444" }} />

      <Typography
        variant="body2"
        align="center"
        sx={{ color: "#888", fontSize: "0.85rem" }}
      >
        &copy; {new Date().getFullYear()} BeanBucks. All rights reserved.
      </Typography>
    </Box>
  );
}

export default Footer;
