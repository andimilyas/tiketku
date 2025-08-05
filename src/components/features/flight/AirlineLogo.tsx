import { Flight } from "@mui/icons-material";
import { Box } from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";

export const AirlineLogo = React.memo(({ airline }: { airline: { name: string; iata: string } }) => {
    const [imageError, setImageError] = useState(false);
    const [svgError, setSvgError] = useState(false);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.src = `/airlines/${airline.iata.toLowerCase()}.png`;
        img.onload = () => setLoaded(true);
        img.onerror = () => setLoaded(false);
      }, [airline.iata]);
  
    if (!imageError) {
        return (
            <Box
                component="img"
                src={`/airlines/${airline.iata.toLowerCase()}.png`}
                alt={airline.name}
                sx={{ width: 40, height: 40, objectFit: 'contain' }}
                onError={() => setImageError(true)}
            />
        );
    }
  
    if (!svgError) {
        return (
            <Box
                component="img"
                src={`/airlines/${airline.iata.toLowerCase()}.svg`}
                alt={airline.name}
                sx={{ width: 40, height: 40, objectFit: 'contain' }}
                onError={() => setSvgError(true)}
            />
        );
    }
  
    return <Flight sx={{ width: 40, height: 40, color: 'primary.main' }} />;
  });