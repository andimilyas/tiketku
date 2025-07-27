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
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/" });
    setLoading(false);
  };

  // Fungsi ini secara umum sudah benar untuk handle login dengan NextAuth credentials.
  // Namun, signIn dari next-auth tidak throw error jika login gagal, 
  // melainkan mengembalikan object (bisa null/redirect). 
  // Untuk feedback error ke user, sebaiknya cek hasil signIn.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await signIn("credentials", {
        email,
        password,
        callbackUrl: "/",
        redirect: false, // supaya tidak auto redirect, bisa cek error
      });
      if (res?.error) {
        // TODO: tampilkan error ke user, misal setError(res.error)
        console.error("Login failed:", res.error);
      } else if (res?.ok) {
        // Redirect manual jika login sukses
        window.location.href = res.url || "/";
      }
    } catch (error) {
      console.error("Unexpected error during login:", error);
    }
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
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              fullWidth
              required
              autoComplete="current-password"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Masuk dengan Email
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
