// src/data/movieTickets.ts
export interface MovieTicket {
    id: number;
    title: string;
    cinema: string;
    showtime: string; // ISO datetime
    thumbnail?: string;
    price: number;
  }
  
  export const movieTickets: MovieTicket[] = [
    {
      id: 1,
      title: "Inside Out 2",
      cinema: "CGV Grand Indonesia",
      showtime: "2025-08-01T19:30:00",
      price: 55000
    },
    {
      id: 2,
      title: "Deadpool & Wolverine",
      cinema: "XXI Plaza Senayan",
      showtime: "2025-08-02T21:00:00",
      price: 65000
    },
    {
      id: 3,
      title: "Deadpool & Wolverine",
      cinema: "XXI Plaza Senayan",
      showtime: "2025-08-02T21:00:00",
      price: 65000
    },
    {
      id: 4,
      title: "Deadpool & Wolverine",
      cinema: "XXI Plaza Senayan",
      showtime: "2025-08-02T21:00:00",
      price: 65000
    },
    {
      id: 5,
      title: "Deadpool & Wolverine",
      cinema: "XXI Plaza Senayan",
      showtime: "2025-08-02T21:00:00",
      price: 65000
    },
  ];
  