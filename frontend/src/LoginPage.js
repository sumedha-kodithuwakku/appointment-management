// LoginPage.js
import React from 'react';
import backgroundImage from './login-background.webp'; // Ensure this path is correct
import { Button, Box, Container } from '@mui/material';

const LoginPage = () => {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundImage: `url(${backgroundImage})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover', // Ensures the background covers the area without spaces
                backgroundPosition: 'center', // Centers the background image
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
            }}
        >
            <Container maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img 
                src={`${process.env.PUBLIC_URL}/logo-transparent.png`} 
                alt="CareConnect" 
                style={{ width: '600px', marginBottom: '60px', marginTop: '-150px'}} // Adjust the margin as needed
            />
                <Button
                    variant="contained"
                    sx={{ 
                        mt: 2,
                        backgroundColor: '#1B4571', 
                        '&:hover': {
                          backgroundColor: '#163A5E', // Adjust this color as needed
                        },
                    }}
                    onClick={() => window.location.href = "/auth/login"}
                >
                    Login
                </Button>
            </Container>
        </Box>
    );
};

export default LoginPage;