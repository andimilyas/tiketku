import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface PaymentConfig {
  merchantId: string;
  clientKey: string;
  serverKey: string;
  environment: 'sandbox' | 'production';
}

interface MidtransResponse {
  token: string;
  redirect_url: string;
}

export const usePayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bookingState = useSelector((state: RootState) => state.booking);

  const initiateMidtransPayment = useCallback(async () => {
    if (!bookingState.selectedFlight || !bookingState.bookingId) {
      throw new Error('Missing booking information');
    }

    setIsProcessing(true);
    setError(null);

    try {
      const paymentData = {
        bookingId: bookingState.bookingId,
        amount: bookingState.totalAmount,
        customerDetails: {
          email: bookingState.contactInfo.email,
          phone: `${bookingState.contactInfo.countryCode}${bookingState.contactInfo.phone}`,
          first_name: bookingState.passengerDetails[0]?.firstName || '',
          last_name: bookingState.passengerDetails[0]?.lastName || ''
        },
        itemDetails: [{
          id: bookingState.selectedFlight.id,
          name: `${bookingState.selectedFlight.departure.iata} - ${bookingState.selectedFlight.arrival.iata}`,
          price: bookingState.totalAmount,
          quantity: 1,
          category: 'flight'
        }]
      };

      const response = await fetch('/api/payment/midtrans/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error('Failed to initiate payment');
      }

      const result: MidtransResponse = await response.json();
      
      // Redirect to Midtrans payment page
      if (result.redirect_url) {
        window.location.href = result.redirect_url;
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment initiation failed';
      setError(errorMessage);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [bookingState]);

  const verifyPayment = useCallback(async (orderId: string) => {
    try {
      const response = await fetch(`/api/payment/verify/${orderId}`);
      
      if (!response.ok) {
        throw new Error('Payment verification failed');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Payment verification failed:', error);
      throw error;
    }
  }, []);

  return {
    isProcessing,
    error,
    initiateMidtransPayment,
    verifyPayment,
    clearError: () => setError(null)
  };
};