import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";

type BookingConfirmationProps = {
  bookingId: string;
  name: string;
  date: string;
  time: string;
  onBackToHome?: () => void;
};

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  bookingId,
  name,
  date,
  time,
  onBackToHome,
}) => {
  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 400,
        margin: "0 auto",
        padding: 4,
        textAlign: "center",
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Booking Confirmed!
      </Typography>
      <Typography variant="body1" gutterBottom>
        Thank you, <strong>{name}</strong>, for your booking.
      </Typography>
      <Box my={2}>
        <Typography variant="subtitle1">
          <strong>Booking ID:</strong> {bookingId}
        </Typography>
        <Typography variant="subtitle1">
          <strong>Date:</strong> {date}
        </Typography>
        <Typography variant="subtitle1">
          <strong>Time:</strong> {time}
        </Typography>
      </Box>
      <Typography variant="body2" gutterBottom>
        We look forward to seeing you!
      </Typography>
      {onBackToHome && (
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={onBackToHome}
        >
          Back to Home
        </Button>
      )}
    </Paper>
  );
};

export default BookingConfirmation;

