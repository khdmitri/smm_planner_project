// app/page.js - no directives needed
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export default function Home() {
  return (
    <main>
      <Container sx={{
          height: '90vh',
          marginTop: 8,
          backgroundColor: 'primary.dark',
          color: 'white',
          '&:hover': {
              backgroundColor: 'primary.main',
              opacity: [0.9, 0.8, 0.7],
          },
      }}>
          <Box>
              <Typography component="p" variant="h2">
                  SLOGAN HERE
              </Typography>
          </Box>
      </Container>
    </main>
  );
}
