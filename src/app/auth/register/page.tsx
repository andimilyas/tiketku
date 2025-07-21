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
} from "@mui/material";
import GoogleIcon from '@mui/icons-material/Google';
import { signIn } from "next-auth/react";
import Link from "next/link";

const RegisterPage = () => {
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMethodChange = (
    event: React.MouseEvent<HTMLElement>,
    newMethod: 'email' | 'phone' | null
  ) => {
    if (newMethod !== null) {
      setMethod(newMethod);
      setValue('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Registration logic here (not implemented)
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
              <TextField
                label="Email"
                type="email"
                value={value}
                onChange={e => setValue(e.target.value)}
                fullWidth
                required
                autoComplete="email"
              />
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
              Daftar dengan {method === "email" ? "Email" : "Nomor HP"} (Coming Soon)
            </Button>
          </Stack>
        </form>
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
