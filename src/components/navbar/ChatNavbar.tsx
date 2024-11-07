import React from 'react';
// ChatHeader.tsx
import {
  Box,
  Flex,
  IconButton,
  Input,
  Text,
  Spacer,
  Avatar,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  useDisclosure,
  Menu,
  MenuButton,
  Center,
  MenuList,
  MenuItem,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiSearch, FiPlus } from 'react-icons/fi';
import { IoMenu } from 'react-icons/io5';
import Sidebar, { SidebarResponsive } from '../sidebar/Sidebar';
import routes from '@/routes';
import Link from 'next/link';
const ChatNavbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  let menuBg = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('navy.700', 'white');
  const borderColor = useColorModeValue('#E6ECFA', 'rgba(135, 140, 189, 0.3)');
  const shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    '0px 41px 75px #081132',
  );
  return (
    <>
      <Drawer placement="left" size="xs" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent
          background="transparent"
          border="none"
          shadow="none"
          boxShadow="none"
        >
          <Sidebar routes={routes} />
        </DrawerContent>
      </Drawer>
      <Box py={2} px={4} borderRadius="md" display="flex" alignItems="center">
        <SidebarResponsive routes={routes} />
        <IconButton
          aria-label="Microsoft Icon"
          icon={<IoMenu />}
          size="lg"
          variant="ghost"
          _hover={{ bg: 'none', color: 'blue.400' }}
          color="gray.600"
          onClick={onOpen}
          display={{ base: 'none', xl: 'block' }}
          minW="unset"
        />
        <Link href="/">
          <Text fontWeight="bold" fontSize="lg" ml={{md:8, sm:4}} color="gray.800">
            PromptEdge D365
          </Text>
        </Link>
        <Spacer />
        <Flex
          align="center"
          boxShadow="sm"
          maxW="300px"
          w="100%"
          display={{ base: 'none', md: 'flex' }}
          h={'40px'}
        >
          <IconButton
            aria-label="Search"
            icon={<FiSearch />}
            variant="ghost"
            color="gray.600"
            size="sm"
            position={"absolute"}
            zIndex={'1'}
            w={'40px'}
          />
          <Input
            placeholder="Search"
            variant="filled"
            fontSize="sm"
            color="gray.700"
            h="100%"
            borderRadius="md"
            pl={'40px'}
            _focus={{bg: 'white', border: 'none', outline: 'none'}}
            _focusVisible={{bg: 'white', border: 'none'}}
          />
        </Flex>
        <Spacer />
        <IconButton
          aria-label="Add"
          icon={<FiPlus />}
          variant="ghost"
          color="gray.600"
          _hover={{ bg: 'rgba(0, 0, 0, 0.1)' }}
          size="lg"
          mr={{ base: '0.5rem' }}
        />
        <Menu>
          <MenuButton p="0px" style={{ position: 'relative' }}>
            <Box
              _hover={{ cursor: 'pointer' }}
              bg={'#1c9cf4'}
              textColor={'white'}
              w="40px"
              h="40px"
              borderRadius={'50%'}
            />
            <Center
              top={0}
              left={0}
              position={'absolute'}
              w={'100%'}
              h={'100%'}
            >
              <Text fontSize={'xs'} fontWeight="bold" color={'white'}>
                C
              </Text>
            </Center>
          </MenuButton>
          <MenuList
            boxShadow={shadow}
            p="0px"
            mt="10px"
            borderRadius="20px"
            bg={menuBg}
            border="none"
          >
            <Flex w="100%" mb="0px">
              <Text
                ps="20px"
                pt="16px"
                pb="10px"
                w="100%"
                borderBottom="1px solid"
                borderColor={borderColor}
                fontSize="sm"
                fontWeight="700"
                color={textColor}
              >
                👋&nbsp; Hey, Circle
              </Text>
            </Flex>
            <Flex flexDirection="column" p="10px">
              {/* <NavLink href="/settings"> */}
              <MenuItem
                _hover={{ bg: 'none' }}
                _focus={{ bg: 'none' }}
                color={textColor}
                borderRadius="8px"
                px="14px"
              >
                <Text fontWeight="500" fontSize="sm">
                  Profile Settings
                </Text>
              </MenuItem>
              <MenuItem
                _hover={{ bg: 'none' }}
                _focus={{ bg: 'none' }}
                color="red.400"
                borderRadius="8px"
                px="14px"
                onClick={() => {
                  // Clear local storage
                  localStorage.clear();
                  // Redirect to the /logout page
                  window.location.href = '/logout';
                }}
              >
                <Text fontWeight="500" fontSize="sm">
                  Log out
                </Text>
              </MenuItem>
            </Flex>
          </MenuList>
        </Menu>
      </Box>
    </>
  );
};
export default ChatNavbar;
