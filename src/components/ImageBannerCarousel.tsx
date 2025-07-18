"use-client"

import React from 'react';
import { Box, Button, Typography } from '@mui/material';

export interface BannerItem {
  image: string;
  title: string;
  description: string;
  cta: string;
  href: string;
}

interface ImageBannerCarouselProps {
  banners: BannerItem[];
  autoPlayInterval?: number;
}

const ImageBannerCarousel: React.FC<ImageBannerCarouselProps> = ({
  banners,
  autoPlayInterval = 6000,
}) => {
  const [current, setCurrent] = React.useState(0);

  const handlePrev = () => setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  const handleNext = () => setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));

  React.useEffect(() => {
    const timer = setInterval(() => handleNext(), autoPlayInterval);
    return () => clearInterval(timer);
  }, [current, autoPlayInterval]);

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Banner Image */}
      <Box
        sx={{
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: 3,
          position: 'relative',
          height: { xs: 200, sm: 320, md: 360 },
        }}
      >
        <img
          src={banners[current].image}
          alt={banners[current].title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
        {/* Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'rgba(0,0,0,0.35)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            px: { xs: 2, sm: 6 },
          }}
        >
          <Box sx={{ mt: 10 }}>
            <Typography variant="h4" fontWeight="bold" color="white" gutterBottom sx={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
              {banners[current].title}
            </Typography>
            <Typography variant="subtitle1" color="white" sx={{ mb: 2, textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
              {banners[current].description}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              href={banners[current].href}
              sx={{ width: 'fit-content', fontWeight: 600, px: 4, borderRadius: 2, mt: 4 }}
            >
              {banners[current].cta}
            </Button>
          </Box>
          {/* Dots Indicator */}
          <Box sx={{ display: 'flex', justifyContent: 'end', mb: 4 }}>
            {banners.map((_, idx) => (
              <Box
                key={idx}
                onClick={() => setCurrent(idx)}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: idx === current ? 'primary.main' : 'grey.400',
                  mx: 0.5,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: idx === current ? '2px solid #fff' : 'none',
                  boxShadow: idx === current ? 2 : 0,
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
      {/* Navigation Buttons */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: -30,
          transform: 'translateY(-50%)',
          zIndex: 2,
        }}
      >
        <Button
          onClick={handlePrev}
          sx={{
            minWidth: 0,
            bgcolor: 'rgba(255,255,255,0.7)',
            borderRadius: '50%',
            p: 1,
            mx: 1,
            '&:hover': { bgcolor: 'primary.light' },
          }}
        >
          <span className="material-icons" style={{ fontSize: 28, color: '#1976d2' }}>chevron_left</span>
        </Button>
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          right: -30,
          transform: 'translateY(-50%)',
          zIndex: 2,
        }}
      >
        <Button
          onClick={handleNext}
          sx={{
            minWidth: 0,
            bgcolor: 'rgba(255,255,255,0.7)',
            borderRadius: '50%',
            p: 1,
            mx: 1,
            '&:hover': { bgcolor: 'primary.light' },
          }}
        >
          <span className="material-icons" style={{ fontSize: 28, color: '#1976d2' }}>chevron_right</span>
        </Button>
      </Box>
      {/* Material Icons font for navigation */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      />
    </Box>
  );
};

export default ImageBannerCarousel;