import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { AppDispatch, RootState } from '@/store';
import { ProcessedFlight, PassengerDetail, ContactInfo } from '@/types/flight';

export const useBookingFlow = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const createBooking = useCallback(async (bookingData: {
    flightId: string;
    passengers: PassengerDetail[];
    contactInfo: ContactInfo;
    totalAmount: number;
  }) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error('Failed to create booking');
      }

      const result = await response.json();
      
      if (result.success) {
        return result.booking;
      } else {
        throw new Error(result.error || 'Booking failed');
      }
    } catch (error) {
      console.error('Create booking failed:', error);
      throw error;
    }
  }, []);

  const navigateToReview = useCallback((flightId: string, searchParams: string) => {
    router.push(`/pesawat/review/${flightId}?${searchParams}`);
  }, [router]);

  const navigateToPassengers = useCallback((flightId: string, searchParams: string) => {
    router.push(`/pesawat/booking/${flightId}/passengers?${searchParams}`);
  }, [router]);

  const navigateToPayment = useCallback((bookingId: string) => {
    router.push(`/payment/checkout/${bookingId}`);
  }, [router]);

  const navigateToSuccess = useCallback((bookingId: string) => {
    router.push(`/payment/success/${bookingId}`);
  }, [router]);

  return {
    createBooking,
    navigateToReview,
    navigateToPassengers,
    navigateToPayment,
    navigateToSuccess
  };
};