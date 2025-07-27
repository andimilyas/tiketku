import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Seed maskapai
  const garuda = await prisma.airline.create({
    data: {
      name: "Garuda Indonesia",
      iata: "GA",
      icao: "GIA",
      logo: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Garuda_Indonesia_logo.svg",
    },
  });
  const lion = await prisma.airline.create({
    data: {
      name: "Lion Air",
      iata: "JT",
      icao: "LNI",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/47/Lion_Air_logo.svg",
    },
  });
  const sriwijaya = await prisma.airline.create({
    data: {
      name: "Sriwijaya Air",
      iata: "SJ",
      icao: "SJY",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Sriwijaya_Air_logo.svg",
    },
  });
  const batik = await prisma.airline.create({
    data: {
      name: "Batik Air",
      iata: "ID",
      icao: "BTK",
      logo: "https://upload.wikimedia.org/wikipedia/commons/d/de/Batik_Air_logo.svg",
    },
  });
  const citilink = await prisma.airline.create({
    data: {
      name: "Citilink",
      iata: "QG",
      icao: "CTV",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/f4/Citilink_logo.svg",
    },
  });

  // Seed flight (10 data)
  await prisma.flightDetail.create({
    data: {
      product: {
        create: {
          vendor: {
            create: { name: "Garuda Indonesia", type: "AIRLINE" },
          },
          category: "flight",
          title: "Jakarta - Bali",
          price: 1200000,
        },
      },
      airline: { connect: { id: garuda.id } },
      flightNumber: "GA124",
      originAirportCode: "CGK",
      destinationAirportCode: "DPS",
      departure: "Jakarta",
      arrival: "Bali",
      departureTime: new Date("2025-07-30T08:00:00Z"),
      arrivalTime: new Date("2025-07-30T10:30:00Z"),
      duration: "PT2H30M",
    },
  });

  await prisma.flightDetail.create({
    data: {
      product: {
        create: {
          vendor: {
            create: { name: "Lion Air", type: "AIRLINE" },
          },
          category: "flight",
          title: "Jakarta - Surabaya",
          price: 950000,
        },
      },
      airline: { connect: { id: lion.id } },
      flightNumber: "JT456",
      originAirportCode: "CGK",
      destinationAirportCode: "SUB",
      departure: "Jakarta",
      arrival: "Surabaya",
      departureTime: new Date("2025-07-31T09:00:00Z"),
      arrivalTime: new Date("2025-07-31T10:30:00Z"),
      duration: "PT1H30M",
    },
  });

  await prisma.flightDetail.create({
    data: {
      product: {
        create: {
          vendor: {
            create: { name: "Sriwijaya Air", type: "AIRLINE" },
          },
          category: "flight",
          title: "Jakarta - Makassar",
          price: 1100000,
        },
      },
      airline: { connect: { id: sriwijaya.id } },
      flightNumber: "SJ789",
      originAirportCode: "CGK",
      destinationAirportCode: "UPG",
      departure: "Jakarta",
      arrival: "Makassar",
      departureTime: new Date("2025-08-01T07:00:00Z"),
      arrivalTime: new Date("2025-08-01T10:00:00Z"),
      duration: "PT3H0M",
    },
  });

  await prisma.flightDetail.create({
    data: {
      product: {
        create: {
          vendor: {
            create: { name: "Batik Air", type: "AIRLINE" },
          },
          category: "flight",
          title: "Jakarta - Yogyakarta",
          price: 900000,
        },
      },
      airline: { connect: { id: batik.id } },
      flightNumber: "ID101",
      originAirportCode: "CGK",
      destinationAirportCode: "YIA",
      departure: "Jakarta",
      arrival: "Yogyakarta",
      departureTime: new Date("2025-08-02T06:00:00Z"),
      arrivalTime: new Date("2025-08-02T07:30:00Z"),
      duration: "PT1H30M",
    },
  });

  await prisma.flightDetail.create({
    data: {
      product: {
        create: {
          vendor: {
            create: { name: "Citilink", type: "AIRLINE" },
          },
          category: "flight",
          title: "Jakarta - Padang",
          price: 950000,
        },
      },
      airline: { connect: { id: citilink.id } },
      flightNumber: "QG202",
      originAirportCode: "CGK",
      destinationAirportCode: "PDG",
      departure: "Jakarta",
      arrival: "Padang",
      departureTime: new Date("2025-08-03T11:00:00Z"),
      arrivalTime: new Date("2025-08-03T13:00:00Z"),
      duration: "PT2H0M",
    },
  });

  await prisma.flightDetail.create({
    data: {
      product: {
        create: {
          vendor: {
            create: { name: "Garuda Indonesia", type: "AIRLINE" },
          },
          category: "flight",
          title: "Bali - Jakarta",
          price: 1200000,
        },
      },
      airline: { connect: { id: garuda.id } },
      flightNumber: "GA124",
      originAirportCode: "DPS",
      destinationAirportCode: "CGK",
      departure: "Bali",
      arrival: "Jakarta",
      departureTime: new Date("2025-08-04T14:00:00Z"),
      arrivalTime: new Date("2025-08-04T16:30:00Z"),
      duration: "PT2H30M",
    },
  });

  await prisma.flightDetail.create({
    data: {
      product: {
        create: {
          vendor: {
            create: { name: "Lion Air", type: "AIRLINE" },
          },
          category: "flight",
          title: "Surabaya - Jakarta",
          price: 950000,
        },
      },
      airline: { connect: { id: lion.id } },
      flightNumber: "JT457",
      originAirportCode: "SUB",
      destinationAirportCode: "CGK",
      departure: "Surabaya",
      arrival: "Jakarta",
      departureTime: new Date("2025-08-05T15:00:00Z"),
      arrivalTime: new Date("2025-08-05T16:30:00Z"),
      duration: "PT1H30M",
    },
  });

  await prisma.flightDetail.create({
    data: {
      product: {
        create: {
          vendor: {
            create: { name: "Sriwijaya Air", type: "AIRLINE" },
          },
          category: "flight",
          title: "Makassar - Jakarta",
          price: 1100000,
        },
      },
      airline: { connect: { id: sriwijaya.id } },
      flightNumber: "SJ790",
      originAirportCode: "UPG",
      destinationAirportCode: "CGK",
      departure: "Makassar",
      arrival: "Jakarta",
      departureTime: new Date("2025-08-06T17:00:00Z"),
      arrivalTime: new Date("2025-08-06T20:00:00Z"),
      duration: "PT3H0M",
    },
  });

  await prisma.flightDetail.create({
    data: {
      product: {
        create: {
          vendor: {
            create: { name: "Batik Air", type: "AIRLINE" },
          },
          category: "flight",
          title: "Yogyakarta - Jakarta",
          price: 900000,
        },
      },
      airline: { connect: { id: batik.id } },
      flightNumber: "ID102",
      originAirportCode: "YIA",
      destinationAirportCode: "CGK",
      departure: "Yogyakarta",
      arrival: "Jakarta",
      departureTime: new Date("2025-08-07T18:00:00Z"),
      arrivalTime: new Date("2025-08-07T19:30:00Z"),
      duration: "PT1H30M",
    },
  });

  await prisma.flightDetail.create({
    data: {
      product: {
        create: {
          vendor: {
            create: { name: "Citilink", type: "AIRLINE" },
          },
          category: "flight",
          title: "Padang - Jakarta",
          price: 950000,
        },
      },
      airline: { connect: { id: citilink.id } },
      flightNumber: "QG203",
      originAirportCode: "PDG",
      destinationAirportCode: "CGK",
      departure: "Padang",
      arrival: "Jakarta",
      departureTime: new Date("2025-08-08T20:00:00Z"),
      arrivalTime: new Date("2025-08-08T22:00:00Z"),
      duration: "PT2H0M",
    },
  });
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());