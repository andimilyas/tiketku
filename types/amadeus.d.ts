declare module 'amadeus' {
    interface AmadeusOptions {
      clientId: string;
      clientSecret: string;
    }
  
    interface FlightOffer {
      type: string;
      id: string;
      source: string;
      instantTicketingRequired: boolean;
      itineraries: any[];
      price: {
        currency: string;
        total: string;
        base: string;
      };
      validatingAirlineCodes: string[];
      travelerPricings: any[];
    }
  
    class Amadeus {
      constructor(options: AmadeusOptions);
      shopping: {
        flightOffersSearch: {
          get(params: Record<string, string | number>): Promise<{ data: FlightOffer[] }>;
        };
      };
    }
  
    export = Amadeus;
  }
  