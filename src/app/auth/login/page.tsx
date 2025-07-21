"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  TextField,
  Paper,
  Divider,
  Stack,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { signIn } from "next-auth/react";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  // Password field is not used for Google login, but included for future extensibility
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle Google login
  const handleGoogleLogin = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/" });
    setLoading(false);
  };

  // Handle form submit (for email login, if implemented in the future)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // You can implement email/password login here if needed
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
        <Typography variant="h5" fontWeight={700} mb={2} align="center">
          Masuk ke TixGo
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3} align="center">
          Silakan login menggunakan akun Google Anda untuk melanjutkan.
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              fullWidth
              required
              autoComplete="email"
            />
            {/* Password field is optional, since Google login is the main method */}
            {/* <TextField
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              fullWidth
              autoComplete="current-password"
            /> */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Masuk dengan Email (Coming Soon)
            </Button>
          </Stack>
        </form>
        <Divider sx={{ my: 3 }}>atau</Divider>
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          startIcon={<GoogleIcon />}
          onClick={handleGoogleLogin}
          disabled={loading}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          Masuk dengan Google
        </Button>
      </Paper>
    </Container>
  );
};

export default LoginPage;
