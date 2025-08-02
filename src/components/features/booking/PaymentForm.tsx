import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Stack,
} from "@mui/material";

type PaymentFormProps = {
  onSubmit?: (data: PaymentFormData) => void;
};

type PaymentFormData = {
  name: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
};

const PaymentForm: React.FC<PaymentFormProps> = ({ onSubmit }) => {
  const [form, setForm] = useState<PaymentFormData>({
    name: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.name ||
      !form.cardNumber ||
      !form.expiry ||
      !form.cvc
    ) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    if (onSubmit) {
      onSubmit(form);
    }
    // Optionally reset form
    // setForm({ name: "", cardNumber: "", expiry: "", cvc: "" });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 400,
        mx: "auto",
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        backgroundColor: "background.paper",
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      <Typography variant="h6" component="h2" mb={1}>
        Payment Details
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 1 }}>
          {error}
        </Alert>
      )}
      <TextField
        label="Name on Card"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Full Name"
        fullWidth
        variant="outlined"
        margin="normal"
      />
      <TextField
        label="Card Number"
        name="cardNumber"
        value={form.cardNumber}
        onChange={handleChange}
        placeholder="1234 5678 9012 3456"
        inputProps={{ maxLength: 19 }}
        fullWidth
        variant="outlined"
        margin="normal"
      />
      <Stack direction="row" spacing={2}>
        <TextField
          label="Expiry"
          name="expiry"
          value={form.expiry}
          onChange={handleChange}
          placeholder="MM/YY"
          inputProps={{ maxLength: 5 }}
          fullWidth
          variant="outlined"
          margin="normal"
        />
        <TextField
          label="CVC"
          name="cvc"
          type="password"
          value={form.cvc}
          onChange={handleChange}
          placeholder="CVC"
          inputProps={{ maxLength: 4 }}
          fullWidth
          variant="outlined"
          margin="normal"
        />
      </Stack>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ fontWeight: "bold", py: 1.2, mt: 1 }}
      >
        Pay Now
      </Button>
    </Box>
  );
};

export default PaymentForm;
