import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { removeFromCart, clearCart } from '../store/cartSlice';
import { Box, Typography, Button, List, ListItem, ListItemText, IconButton, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function CartList() {
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const dispatch = useDispatch();

  if (cartItems.length === 0) {
    return <Typography variant="body1">Keranjang kosong.</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4, p: 2, border: '1px solid #eee', borderRadius: 2 }}>
      <Typography variant="h6" fontWeight={700} mb={2}>Keranjang</Typography>
      <List>
        {cartItems.map(item => (
          <React.Fragment key={item.id}>
            <ListItem
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => dispatch(removeFromCart(item.id))}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={`${item.name} x${item.quantity}`}
                secondary={`Rp ${(item.price * item.quantity).toLocaleString()}`}
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
      <Button variant="outlined" color="error" fullWidth sx={{ mt: 2 }} onClick={() => dispatch(clearCart())}>
        Kosongkan Keranjang
      </Button>
    </Box>
  );
} 