'use client';
import React, { ReactNode } from 'react';
import type { AppProps } from 'next/app';
import {
  ChakraProvider,
  Box,
  Portal,
  useDisclosure,
  Image,
} from '@chakra-ui/react';
import theme from '@/theme/theme';
import routes from '@/routes';
import Sidebar from '@/components/sidebar/Sidebar';
import Footer from '@/components/footer/FooterAdmin';
import Navbar from '@/components/navbar/NavbarAdmin';
import { getActiveRoute, getActiveNavbar } from '@/utils/navigation';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SessionProvider } from '@/context/SessionContext'; // Import the provider
import ChatNavbar from '@/components/navbar/ChatNavbar';

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [apiKey, setApiKey] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  useEffect(() => {
    const initialKey = localStorage.getItem('apiKey');
    console.log(initialKey);
    if (initialKey?.includes('sk-') && apiKey !== initialKey) {
      setApiKey(initialKey);
    }
  }, [apiKey]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      h="100vh"
      padding={{ base: '0px', md: '50px' }}
      bg="radial-gradient(farthest-side at top left, rgba(249, 120, 147, 0.8), transparent),
              radial-gradient(farthest-side at bottom left, rgba(249, 120, 147, 0.6), transparent),
              radial-gradient(farthest-side at top right, rgba(249, 225, 175, 1), transparent),
              radial-gradient(farthest-corner at bottom right, rgba(108, 183, 240, 0.9), transparent)"
    >
      <Box h="100vh" w="100vw" position="fixed" filter="blur(15px)">
        <Image
          src="/img/copilot-logo.png"
          alt="Logo"
          position="absolute"
          left="50%"
          top="50%"
          transform="translate(-50%, -50%)"
          w={{ base: '90%', md: '80%', lg: '60%' }}
          mb="20px"
        />
      </Box>
      <Box
        bg="rgba(255, 255, 255, 0.2)"
        border="2px solid #E2E8F0"
        borderRadius="12px"
        overflow="auto"
        position="relative"
        h={{ base: '100%', md: "auto" }}
        w={{ base: '100%', md: '95%', lg: '90%' }}
        transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
        transitionDuration=".2s, .2s, .35s"
        transitionProperty="top, bottom, width"
        transitionTimingFunction="linear, linear, ease"
      >
        <ChatNavbar
        // setApiKey={setApiKey}
        // onOpen={onOpen}
        // logoText={'Mazik UI Dashboard PRO'}
        // brandText={getActiveRoute(routes, pathname)}
        // secondary={getActiveNavbar(routes, pathname)}
        />
        <Box mx="auto" p={{ base: '8px', md: '20px' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
