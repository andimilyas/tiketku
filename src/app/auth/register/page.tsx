'use client';

import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import GoogleIcon from '@mui/icons-material/Google';
import { signIn } from "next-auth/react";
import Link from "next/link";

const RegisterPage = () => {
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState("");
  const [username, setUsername] = useState("");

  const handleMethodChange = (
    event: React.MouseEvent<HTMLElement>,
    newMethod: 'email' | 'phone' | null
  ) => {
    if (newMethod !== null) {
      setMethod(newMethod);
      setValue('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError("");
    setRegisterSuccess("");
    if (!value || !password || !confirmPassword) {
      setRegisterError("Semua field wajib diisi");
      return;
    }
    if (password !== confirmPassword) {
      setRegisterError("Password dan konfirmasi password tidak sama");
      return;
    }
    setRegisterLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value, password, name: username }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal register");
      setRegisterSuccess("Register berhasil! Silakan cek email untuk OTP.");
      setRegisterEmail(value);
      setOtpDialogOpen(true);
    } catch (err: any) {
      setRegisterError(err.message);
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError("");
    setOtpSuccess("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: registerEmail, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "OTP salah");
      setOtpSuccess("Email berhasil diverifikasi! Silakan login.");
      setOtpDialogOpen(false);
    } catch (err: any) {
      setOtpError(err.message);
    }
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    await signIn("google");
    setLoading(false);
  };

  return (
    <Container maxWidth="xs" sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
        <Typography variant="h5" fontWeight={700} mb={2} align="center">
          Daftar Akun TixGo
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3} align="center">
          Nikmati kemudahan pesan tiket dengan akun TixGo.
        </Typography>
        <ToggleButtonGroup
          value={method}
          exclusive
          onChange={handleMethodChange}
          fullWidth
          sx={{ mb: 2 }}
        >
          <ToggleButton value="email" sx={{ flex: 1, textTransform: "none" }}>
            Email
          </ToggleButton>
          <ToggleButton value="phone" sx={{ flex: 1, textTransform: "none" }}>
            Nomor HP
          </ToggleButton>
        </ToggleButtonGroup>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            {method === "email" ? (
              <>
                <TextField
                  label="Username"
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  fullWidth
                  required
                  autoComplete="username"
                />
                <TextField
                  label="Email"
                  type="email"
                  value={value}
                  onChange={e => setValue(e.target.value)}
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
                  autoComplete="new-password"
                />
                <TextField
                  label="Konfirmasi Password"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  fullWidth
                  required
                  autoComplete="new-password"
                />
                {registerError && <Alert severity="error">{registerError}</Alert>}
                {registerSuccess && <Alert severity="success">{registerSuccess}</Alert>}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={registerLoading}
                  sx={{ textTransform: "none", fontWeight: 600 }}
                >
                  Daftar dengan Email
                </Button>
              </>
            ) : (
              <TextField
                label="Nomor HP"
                type="tel"
                value={value}
                onChange={e => setValue(e.target.value)}
                fullWidth
                required
                autoComplete="tel"
                inputProps={{ pattern: "[0-9]*", inputMode: "numeric" }}
              />
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Daftar dengan {method === "email" ? "Email" : "Nomor HP"}
            </Button>
          </Stack>
        </form>
        <Dialog open={otpDialogOpen} onClose={() => setOtpDialogOpen(false)}>
          <DialogTitle>Verifikasi Email</DialogTitle>
          <form onSubmit={handleOtpSubmit}>
            <DialogContent>
              <Typography mb={2}>Masukkan kode OTP yang dikirim ke email kamu.</Typography>
              <TextField
                label="Kode OTP"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                fullWidth
                required
                autoFocus
              />
              {otpError && <Alert severity="error" sx={{ mt: 2 }}>{otpError}</Alert>}
              {otpSuccess && <Alert severity="success" sx={{ mt: 2 }}>{otpSuccess}</Alert>}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOtpDialogOpen(false)}>Batal</Button>
              <Button type="submit" variant="contained">Verifikasi</Button>
            </DialogActions>
          </form>
        </Dialog>
        <Divider sx={{ my: 3 }}>atau</Divider>
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          startIcon={<GoogleIcon />}
          onClick={handleGoogleRegister}
          disabled={loading}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          Login lebih cepat dengan Google
        </Button>
        <Box mt={3} textAlign="center">
          <Typography variant="body2">
            Sudah punya akun?{" "}
            <Link href="/auth/login" style={{ color: "#2563eb", textDecoration: "none", fontWeight: 600 }}>
              Masuk
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
