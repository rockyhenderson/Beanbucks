import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import noImage from '../assets/no_image_found.png';

const DrinkCard = ({ drink, onClick }) => {
  const image = drink.image || noImage;

  return (
    <Card
      onClick={onClick}
      sx={{
        width: '100%',
        borderRadius: '16px',
        backgroundColor: 'var(--card)',
        color: 'var(--text)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease',
        cursor: 'pointer',
        '&:hover': {
          transform: 'scale(1.02)',
        },
      }}
    >
      <CardMedia
        component="img"
        image={image}
        alt={drink.name}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = noImage;
        }}
        sx={{
          height: 180,
          objectFit: 'cover',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
        }}
      />
      <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontFamily: 'Poppins',
            fontWeight: 600,
            fontSize: '1.1rem',
            mb: 0.5,
            color: 'var(--heading-color)',
          }}
        >
          {drink.name}
        </Typography>
        <Typography
          sx={{
            fontFamily: 'Poppins',
            color: 'var(--body-text)',
            fontSize: '1rem',
            mb: 1,
          }}
        >
          £{Number(drink.price).toFixed(2)}
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: 'var(--primary)',
            color: 'var(--button-text)',
            textTransform: 'none',
            fontWeight: 500,
            fontFamily: 'Poppins',
            borderRadius: '8px',
            px: 2,
            py: 1,
            '&:hover': {
              backgroundColor: '#cc4a00', // slightly darker orange
            },
          }}
        >
          Add Now
        </Button>
      </CardContent>
    </Card>
  );
};

export default DrinkCard;
