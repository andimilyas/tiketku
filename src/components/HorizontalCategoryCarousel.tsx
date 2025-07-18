import React from 'react';
import { Box, Button } from '@mui/material';

export interface CategoryItem {
  key: string;
  label: string;
  icon: React.ReactElement;
}

interface HorizontalCategoryCarouselProps {
  categories: CategoryItem[];
  selected: string;
  onSelect: (key: string) => void;
}

const HorizontalCategoryCarousel: React.FC<HorizontalCategoryCarouselProps> = ({ categories, selected, onSelect }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        overflowX: 'auto',
        bgcolor: 'white',
        borderRadius: 2,
        boxShadow: 3,
        px: 2,
        py: 1.5,
        gap: 2,
        alignItems: 'center',
        width: '90%',
        mx: 'auto',
        minHeight: 0,
        height: 'auto',
      }}
    >
      {categories.map((cat) => (
        <Button
          key={cat.key}
          onClick={() => onSelect(cat.key)}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            whiteSpace: 'nowrap',
            bgcolor: selected === cat.key ? 'primary.50' : 'transparent',
            color: selected === cat.key ? 'primary.main' : 'text.primary',
            fontWeight: selected === cat.key ? 700 : 500,
            borderRadius: 3,
            px: 2.5,
            py: 1.2,
            minWidth: 0,
            width: 'auto',
            boxShadow: selected === cat.key ? 2 : 0,
            border: selected === cat.key ? '2px solid' : '1px solid',
            borderColor: selected === cat.key ? 'primary.main' : 'grey.200',
            textTransform: 'none',
            transition: 'all 0.2s',
            lineHeight: 1,
            fontSize: 16,
            '&:hover': {
              bgcolor: 'primary.100',
              color: 'primary.main',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {React.isValidElement(cat.icon) &&
              React.cloneElement(cat.icon as React.ReactElement<any>, { fontSize: 'small' })}
            <span style={{ whiteSpace: 'nowrap', fontWeight: 700 }}>{cat.label}</span>
          </Box>
        </Button>
      ))}
    </Box>
  );
};

export default HorizontalCategoryCarousel; 