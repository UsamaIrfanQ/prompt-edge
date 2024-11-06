'use client';
import React, { ReactNode } from 'react';
import type { AppProps } from 'next/app';
import { ChakraProvider, Box, Portal, useDisclosure } from '@chakra-ui/react';
import theme from '@/theme/theme';
import routes from '@/routes';
import Sidebar from '@/components/sidebar/Sidebar';
import Footer from '@/components/footer/FooterAdmin';
import Navbar from '@/components/navbar/NavbarAdmin';
import { getActiveRoute, getActiveNavbar } from '@/utils/navigation';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import '@/styles/App.css';
import '@/styles/Contact.css';
import '@/styles/Plugins.css';
import '@/styles/MiniCalendar.css';
import AppWrappers from './AppWrappers';
import { SessionProvider } from '@/context/SessionContext'; // Import the provider

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
    <html lang="en">
      <body id={'root'}>
        <AppWrappers>
          <SessionProvider>
            {pathname?.includes('register') || pathname?.includes('chat') || pathname?.includes('sign-in') ? (
              children
            ) : (
              <Box>
                <Sidebar setApiKey={setApiKey} routes={routes} />
                <Box
                  pt={{ base: '60px', md: '90px' }}
                  float="right"
                  minHeight="100vh"
                  height="100%"
                  overflow="auto"
                  position="relative"
                  maxHeight="100%"
                  w="100%"
                  // w={{ base: '100%', xl: 'calc( 100% - 290px )' }}
                  // maxWidth={{ base: '100%', xl: 'calc( 100% - 290px )' }}
                  transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
                  transitionDuration=".2s, .2s, .35s"
                  transitionProperty="top, bottom, width"
                  transitionTimingFunction="linear, linear, ease"
                  bg="radial-gradient(farthest-side at top left, rgba(249, 120, 147, 0.8), transparent),
                      radial-gradient(farthest-side at bottom left, rgba(249, 120, 147, 0.6), transparent),
                      radial-gradient(farthest-side at top right, rgba(249, 225, 175, 1), transparent),
                      radial-gradient(farthest-corner at bottom right, rgba(108, 183, 240, 0.9), transparent)"
                >
                  <Portal>
                    <Box>
                      <Navbar
                        setApiKey={setApiKey}
                        onOpen={onOpen}
                        logoText={'Mazik UI Dashboard PRO'}
                        brandText={getActiveRoute(routes, pathname)}
                        secondary={getActiveNavbar(routes, pathname)}
                      />
                    </Box>
                  </Portal>
                  <Box
                    mx="auto"
                    p={{ base: '20px', md: '20px' }}
                    pe="20px"
                    minH="calc(100vh - 92px)"
                    pt="50px"
                  >
                    {children}
                  </Box>
                 
                </Box>
              </Box>
            )}
          </SessionProvider>
        </AppWrappers>
      </body>
    </html>
  );
}
