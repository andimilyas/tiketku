'use client';

// import { useState } from 'react';
// import { Container, Typography } from '@mui/material';
// import FlightSearchForm from './flightsearch';
// import FlightList from './flightlist';
// import BookingForm from './bookingform';

// export default function FlightsPage() {
//   const [flights, setFlights] = useState<any[]>([]);
//   const [selectedFlight, setSelectedFlight] = useState<any | null>(null);

//   return (
//     <Container maxWidth="sm" sx={{ py: 4 }}>
//       <Typography variant="h4" fontWeight="bold" mb={3}>
//         Flight Search
//       </Typography>
//       {!selectedFlight ? (
//         <>
//           <FlightSearchForm onResults={setFlights} />
//           <FlightList flights={flights} onSelect={setSelectedFlight} />
//         </>
//       ) : (
//         <BookingForm flight={selectedFlight} />
//       )}
//     </Container>
//   );
// }

import { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

export default function FlightsPage() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/flights?dep_iata=CGK')
      .then((res) => res.json())
      .then((data) => {
        setFlights(data.data || []);
        setLoading(false);
      });
  }, []);

  return (
    <Container sx={{ backgroundColor: 'white' }}>
      <Typography variant="h4" gutterBottom>
        Jadwal Penerbangan dari CGK
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Maskapai</TableCell>
              <TableCell>Asal</TableCell>
              <TableCell>Tujuan</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flights.map((flight: any, index: number) => (
              <TableRow key={index}>
                <TableCell>{flight?.airline?.name ?? '-'}</TableCell>
                <TableCell>{flight?.departure?.iata ?? '-'}</TableCell>
                <TableCell>{flight?.arrival?.iata ?? '-'}</TableCell>
                <TableCell>{flight?.flight_status ?? '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Container>
  );
}
