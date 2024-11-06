'use client';
/* eslint-disable */

// chakra imports
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Flex,
  HStack,
  Text,
  List,
  Icon,
  ListItem,
  useColorModeValue,
  Link,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToast,
} from '@chakra-ui/react';
import { FaCircle } from 'react-icons/fa';
import { IoMdAdd } from 'react-icons/io';
import NavLink from '@/components/link/NavLink';
import { IRoute } from '@/types/navigation';
import { PropsWithChildren, useCallback, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { DeleteIcon } from '@chakra-ui/icons';
import { FiMoreVertical } from 'react-icons/fi';
import { useSession } from '@/context/SessionContext';
import { LoadingModal } from '@/components/loadingModal';

interface Session {
  chat_id: string;
  title: string;

}


interface SidebarLinksProps extends PropsWithChildren {
  routes: IRoute[];     // Array of route objects
  sessions: Session[];  // Array of session objects (type `Session`)
}


export function SidebarLinks(props: SidebarLinksProps) {
  //   Chakra color mode
  const pathname = usePathname();
  let activeColor = useColorModeValue('navy.700', 'white');
  let inactiveColor = useColorModeValue('gray.500', 'gray.500');
  let borderColor = useColorModeValue('gray.200', 'whiteAlpha.300');
  let activeIcon = useColorModeValue('brand.500', 'white');
  let iconColor = useColorModeValue('navy.700', 'white');
  let gray = useColorModeValue('gray.500', 'gray.500');
  const { fetchSessions } = useSession();
  const [isLoading, setIsLoading] = useState(false); // State to control modal visibility



  const { routes, sessions } = props;
  const toast = useToast(); // Initialize useToast


  const handleDeleteChat = async (chat_id: string) => {

    try {
      setIsLoading(true); // Show loading modal
      const response = await fetch('api/deleteChatByChatId', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chat_id }),
      });

      if (response.ok) {
        setIsLoading(false); // Hide loading modal after response
        // Show success toast
        toast({
          title: 'Conversation deleted successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
          variant: 'subtle',
          colorScheme: 'green', // Green for success
        });

        console.log(`Chat with ID ${chat_id} deleted successfully`);
        fetchSessions();
        // You may want to refresh the sessions state here to reflect the updated chat list.
      } else {
        setIsLoading(false); // Hide loading modal after response
        // Show failure toast
        toast({
          title: 'Failed to delete chat.',
          description: 'There was an issue deleting the chat. Please try again.',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
          variant: 'subtle',
          colorScheme: 'red', // Red for error
        });

        console.error('Failed to delete the chat.');
      }
    } catch (error) {
      // Show error toast
      toast({
        title: 'An error occurred.',
        description: 'Unable to delete the chat due to a server error.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
        variant: 'subtle',
        colorScheme: 'red', // Red for error
      });

      console.error('An error occurred while deleting the chat:', error);
    }
  };


  // verifies if routeName is the one active (in browser input)
  const activeRoute = useCallback(
    (routeName: string) => {
      return pathname?.includes(routeName);
    },
    [pathname],
  );
  const router = useRouter(); // Initialize the router

  // this function creates the links and collapses that appear in the sidebar (left menu)
  const createLinks = (routes: IRoute[]) => {
    return routes.map((route, key) => {
      if (route.collapse && !route.invisible) {
        return (
          <Accordion defaultIndex={0} allowToggle key={key}>
            <Flex w="100%" justifyContent={'space-between'}>
              <AccordionItem isDisabled border="none" mb="14px" key={key}>
                <AccordionButton
                  display="flex"
                  alignItems="center"
                  mb="4px"
                  justifyContent="center"
                  _hover={{
                    bg: 'unset',
                  }}
                  _focus={{
                    boxShadow: 'none',
                  }}
                  borderRadius="8px"
                  w="100%"
                  py="0px"
                  ms={0}
                >
                  {route.icon ? (
                    <Flex
                      align="center"
                      justifyContent="space-between"
                      w="100%"
                    >
                      <HStack
                        spacing={
                          activeRoute(route.path.toLowerCase())
                            ? '22px'
                            : '26px'
                        }
                      >
                        <Flex
                          w="100%"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Box
                            color={
                              route.disabled
                                ? gray
                                : activeRoute(route.path.toLowerCase())
                                  ? activeIcon
                                  : inactiveColor
                            }
                            me="12px"
                            mt="6px"
                          >
                            {route.icon}
                          </Box>
                          <Text
                            cursor="not-allowed"
                            me="auto"
                            color={
                              route.disabled
                                ? gray
                                : activeRoute(route.path.toLowerCase())
                                  ? activeColor
                                  : 'gray.500'
                            }
                            fontWeight="500"
                            letterSpacing="0px"
                            fontSize="sm"
                          >
                            {route.name}
                          </Text>
                        </Flex>
                      </HStack>
                    </Flex>
                  ) : (
                    <Flex pt="0px" pb="10px" alignItems="center" w="100%">
                      <HStack
                        spacing={
                          activeRoute(route.path.toLowerCase())
                            ? '22px'
                            : '26px'
                        }
                        ps="32px"
                      >
                        <Text
                          cursor="not-allowed"
                          me="auto"
                          fontWeight="500"
                          letterSpacing="0px"
                          fontSize="sm"
                        >
                          {route.name}
                        </Text>
                      </HStack>
                      <AccordionIcon
                        ms="auto"
                        color={route.disabled ? gray : 'gray.500'}
                      />
                    </Flex>
                  )}
                </AccordionButton>
                <AccordionPanel py="0px" ps={'8px'}>
                  <List>
                    {
                      route.icon && route.items
                        ? createLinks(route.items) // for bullet accordion links
                        : route.items
                          ? createAccordionLinks(route.items)
                          : '' // for non-bullet accordion links
                    }
                  </List>
                </AccordionPanel>
              </AccordionItem>
              <Link
                isExternal
                href="https://Mazik-ui.com/ai-template"
                mt="6px"
              >
                <Badge
                  display={{ base: 'flex', lg: 'none', xl: 'flex' }}
                  colorScheme="brand"
                  borderRadius="25px"
                  color="brand.500"
                  textTransform={'none'}
                  letterSpacing="0px"
                  px="8px"
                >
                  PRO
                </Badge>
              </Link>
            </Flex>
          </Accordion>
        );
      } else if (!route.invisible) {
        return (
          <>
            {route.icon ? (
              <Flex
                align="center"
                justifyContent="space-between"
                w="100%"
                maxW="100%"
                mb="0px"
              >
                <HStack
                  w="100%"
                  mb="14px"
                  spacing={
                    activeRoute(route.path.toLowerCase()) ? '22px' : '26px'
                  }
                >
                  {route.name === 'Prompt Edge' ? (
                    <Flex direction="column" py="5px">
                      {sessions && sessions.length > 0 ? ( // Check if sessions is defined and has elements
                        sessions.map((session) => (
                          <Box
                            py="10px"
                            borderRadius="10px"
                            mb="8px"
                            cursor="pointer"
                            bg={useColorModeValue('white', 'navy.700')}

                          >
                            <Flex direction="row">
                              <Flex direction="row" alignItems="center" justifyContent="space-between" px={1} _hover={{
                                bg: 'blue.50',
                                transform: 'scale(1.02)',
                                transition: 'all 0.2s ease-in-out',
                              }}>
                                {/* NavLink with Icon and Text aligned in a row */}
                                <NavLink
                                  href={`/chat/${session.chat_id}`}
                                  key={session.chat_id}
                                  styles={{ display: 'flex', alignItems: 'center', width: '100%' }}
                                >
                                  <Flex alignItems="center">
                                    <Box color="blue.500" me="7px">
                                      {route.icon}
                                    </Box>
                                    <Text
                                      fontWeight="medium"
                                      color={useColorModeValue('blue.700', 'white')}
                                      fontSize="15px" // Custom font size
                                    >
                                      {session.title ? session.title : `Session ${session.chat_id}`}
                                    </Text>
                                  </Flex>
                                </NavLink>

                                {/* Three-dot menu for delete */}

                                <LoadingModal isOpen={isLoading} />

                              </Flex>
                              <Menu>
                                <MenuButton
                                  as={IconButton}
                                  aria-label="Options"
                                  icon={<FiMoreVertical />} // Use any icon like FiMoreVertical from react-icons
                                  variant="ghost"
                                  size="sm"
                                />
                                <MenuList>
                                  <MenuItem
                                    icon={<DeleteIcon />} // Delete icon from Chakra UI
                                    onClick={() => handleDeleteChat(session.chat_id)}
                                  >
                                    Delete
                                  </MenuItem>
                                </MenuList>
                              </Menu>
                            </Flex>
                          </Box>
                        ))
                      ) : (
                        <Text p={6} color={useColorModeValue('gray.500', 'gray.200')}>
                          No chat history available.
                        </Text>
                      )}
                    </Flex>
                  ) : (
                    <Flex
                      w="100%"
                      alignItems="center"
                      justifyContent="center"
                      cursor="not-allowed"
                    >
                      <Box
                        opacity="0.4"
                        color={
                          route.disabled
                            ? gray
                            : activeRoute(route.path.toLowerCase())
                              ? activeIcon
                              : inactiveColor
                        }
                        me="12px"
                        mt="6px"
                      >
                        {route.icon}
                      </Box>
                      <Text
                        opacity="0.4"
                        me="auto"
                        color={
                          route.disabled
                            ? gray
                            : activeRoute(route.path.toLowerCase())
                              ? activeColor
                              : 'gray.500'
                        }
                        fontWeight="500"
                        letterSpacing="0px"
                        fontSize="sm"
                      >
                        {route.name}
                      </Text>
                      <Link
                        isExternal
                        href="https://Mazik-ui.com/ai-template"
                      >
                        <Badge
                          display={{ base: 'flex', lg: 'none', xl: 'flex' }}
                          colorScheme="brand"
                          borderRadius="25px"
                          color="brand.500"
                          textTransform={'none'}
                          letterSpacing="0px"
                          px="8px"
                        >
                          PRO
                        </Badge>
                      </Link>
                    </Flex>
                  )}
                </HStack >
              </Flex >
            ) : (
              <ListItem ms={0} cursor="not-allowed" opacity={'0.4'}>
                <Flex ps="32px" alignItems="center" mb="8px">
                  <Text
                    color={
                      route.disabled
                        ? gray
                        : activeRoute(route.path.toLowerCase())
                          ? activeColor
                          : inactiveColor
                    }
                    fontWeight="500"
                    fontSize="xs"
                  >
                    {route.name}
                  </Text>
                </Flex>
              </ListItem>
            )
            }
          </>
        );
      }
    });
  };
  // this function creates the links from the secondary accordions (for example auth -> sign-in -> default)
  const createAccordionLinks = (routes: IRoute[]) => {
    return routes.map((route: IRoute, key: number) => {
      return (
        <ListItem
          ms="28px"
          display="flex"
          alignItems="center"
          mb="10px"
          key={key}
          cursor="not-allowed"
        >
          <Icon
            w="6px"
            h="6px"
            me="8px"
            as={FaCircle}
            color={route.disabled ? gray : activeIcon}
          />
          <Text
            color={
              route.disabled
                ? gray
                : activeRoute(route.path.toLowerCase())
                  ? activeColor
                  : inactiveColor
            }
            fontWeight={
              activeRoute(route.path.toLowerCase()) ? 'bold' : 'normal'
            }
            fontSize="sm"
          >
            {route.name}
          </Text>
        </ListItem>
      );
    });
  };
  //  BRAND
  return <>{createLinks(routes)}</>;
}

export default SidebarLinks;
