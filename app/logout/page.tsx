'use client';
/*eslint-disable*/

import { Box, Button, Center, Flex, Text } from '@chakra-ui/react';
import { useEffect } from 'react';

export default function Logout() {
    // Function to handle redirection to Microsoft's OAuth2 authorization
    const redirectToAuthorize = () => {
        const clientId = '4ca4d135-dc7b-4f3c-bb8f-3162e59e71fe'; // Your client_id
        const authorizeUrl = 'https://login.microsoftonline.com/a0b6a447-2d01-4c5d-bab2-29cafae4c989/oauth2/v2.0/authorize';
        const redirectUri = encodeURIComponent('https://delightful-island-0aae4dc0f.5.azurestaticapps.net/auth/callback'); // Replace with your redirect URI
        const scope = encodeURIComponent('openid profile offline_access https://graph.microsoft.com/.default'); // Example scope
        const responseType = 'code'; // Authorization code flow
        const state = encodeURIComponent('abc123'); // Optional but recommended for CSRF protection
        const prompt = 'consent'; // Optional, forces the user to consent every time

        // Construct the full URL with the necessary query parameters
        const urlWithParams = `${authorizeUrl}?client_id=${clientId}` +
            `&response_type=${responseType}` +
            `&redirect_uri=${redirectUri}` +
            `&scope=${scope}` +
            `&state=${state}` +
            `&prompt=${prompt}`;

        localStorage.clear();

        // Redirect the user to the URL
        window.location.href = urlWithParams;
    };

    return (
            <Center 
                backdropFilter="blur(200px)"
                bg="rgba(255, 255, 255, 0.3)"
                border="3px solid #ffffff"
                h="calc(100vh - 136px)"
                borderRadius="12px"
                marginLeft={{ md: '20px', xl: '300px' }}
            >
                <Box textAlign="center">
                    <Text fontSize="2xl" fontWeight="bold" mb="8">
                        Sign in with Microsoft to access PromptGPT
                    </Text>
                    <Button
                        onClick={redirectToAuthorize}  // Use the function for redirection
                        colorScheme="blue"
                        size="lg"
                        bg={'#1c9cf4'}
                        borderRadius="6px"
                        textColor={'white'}
                        _hover={{ bg: '#0b73fc' }}
                    >
                        Sign in with Microsoft
                    </Button>
                </Box>
            </Center>
    );
}
