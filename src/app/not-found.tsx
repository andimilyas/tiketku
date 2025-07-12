"use client";

import React from "react";
import Link from 'next/link';

import {
  Box,
  Typography,
  Button,
  Container,
  Stack,
  SvgIcon
} from "@mui/material";

const NotFound: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "grey.100",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Stack spacing={3} alignItems="center">
          {/* Ilustrasi dengan SVG */}
          <SvgIcon fontSize="large" sx={{ fontSize: 80, color: "grey.500" }}>
            {/* Icon silang dalam lingkaran */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#e2e8f0" />
              <path
                d="M9 9l6 6M15 9l-6 6"
                stroke="#64748b"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </SvgIcon>

          <Typography variant="h3" fontWeight="bold" color="grey.800">
            404
          </Typography>

          <Typography variant="h6" color="text.secondary">
            Maaf, halaman yang Anda cari tidak ditemukan.
          </Typography>

          <Button component={Link} href="/" variant="contained" size="large">
            Kembali ke Home
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default NotFound;
