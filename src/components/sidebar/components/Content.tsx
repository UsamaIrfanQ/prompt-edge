'use client';
// chakra imports
import {
  Badge,
  Box,
  Button,
  Flex,
  Icon,
  Link,
  Menu,
  MenuButton,
  MenuList,
  Stack,
  Tab,
  TabList,
  Tabs,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import NavLink from '@/components/link/NavLink';
//   Custom components
import avatar4 from '/public/img/avatars/avatar4.png';
import { NextAvatar } from '@/components/image/Avatar';
import APIModal from '@/components/apiModal';
import Brand from '@/components/sidebar/components/Brand';
import Links from '@/components/sidebar/components/Links';
import SidebarCard from '@/components/sidebar/components/SidebarCard';
import { RoundedChart } from '@/components/icons/Icons';
import { PropsWithChildren, useState } from 'react';
import { IRoute } from '@/types/navigation';
import { IoMdPerson } from 'react-icons/io';
import { FiLogOut } from 'react-icons/fi';
import { LuHistory } from 'react-icons/lu';
import { MdOutlineManageAccounts, MdOutlineSettings } from 'react-icons/md';
import SidebarTabs from './SidebarTabs';
import { FaHome } from 'react-icons/fa';
import { RiContactsBookLine } from "react-icons/ri";
import { CiViewList } from "react-icons/ci";
import { GrNodes } from "react-icons/gr";

// FUNCTIONS

interface SidebarContent extends PropsWithChildren {
  routes: IRoute[];
  [x: string]: any;
}

function SidebarContent(props: SidebarContent) {
  const [tabIndex, setTabIndex] = useState(0)
  const { routes, setApiKey, sessions, fetchSessions } = props;
  const textColor = useColorModeValue('navy.700', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300');
  const bgColor = useColorModeValue('white', 'navy.700');
  const shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    '14px 17px 40px 4px rgba(12, 44, 55, 0.18)',
  );
  const iconColor = useColorModeValue('navy.700', 'white');
  const shadowPillBar = useColorModeValue(
    '4px 17px 40px 4px rgba(112, 144, 176, 0.08)',
    'none',
  );
  const gray = useColorModeValue('gray.500', 'white');

  const handleTabsChange = (index: number) => {
    setTabIndex(index)
  }

  // SIDEBAR
  return (
    <Flex
      direction="column"
      height="100%"
      pt="20px"
      pb="26px"
      borderRadius="30px"
      maxW="285px"
      px="20px"
    >
      <Brand />
      <APIModal setApiKey={setApiKey} sidebar={true} />
      <Stack direction="column" mb="auto" mt="8px">
        {/* <Button
          display="flex"
          fontSize={'sm'}
          fontWeight="600"
          my="8px"
          minH="40px"
          colorScheme="blue"
          size="lg"
          bg={'#1c9cf4'}
          borderRadius="6px"
          textColor={'white'}
          _hover={{ bg: '#0b73fc' }}
          leftIcon={<FaHome />}
        >
          Home
        </Button>          <Button
          display="flex"
          fontSize={'sm'}
          fontWeight="600"
          my="8px"
          minH="40px"
          colorScheme="blue"
          size="lg"
          bg={'#1c9cf4'}
          borderRadius="6px"
          textColor={'white'}
          _hover={{ bg: '#0b73fc' }}
          leftIcon={<RiContactsBookLine />}
        >
          Prospects
        </Button>          <Button
          display="flex"
          fontSize={'sm'}
          fontWeight="600"
          my="8px"
          minH="40px"
          colorScheme="blue"
          size="lg"
          bg={'#1c9cf4'}
          borderRadius="6px"
          textColor={'white'}
          _hover={{ bg: '#0b73fc' }}
          leftIcon={<CiViewList />}
        >
          Projects
        </Button>          <Button
          display="flex"
          fontSize={'sm'}
          fontWeight="600"
          my="8px"
          minH="40px"
          colorScheme="blue"
          size="lg"
          bg={'#1c9cf4'}
          borderRadius="6px"
          textColor={'white'}
          _hover={{ bg: '#0b73fc' }}
          leftIcon={<GrNodes />}
        >
          Customers
        </Button> */}
        <SidebarTabs index={tabIndex} onChange={handleTabsChange} tabs={[
          { icon: <FaHome style={{ width: 50, height: 50 }} />, label: 'Home', to: '/chat' },
          { icon: <RiContactsBookLine style={{ width: 50, height: 50 }} />, label: 'Prospects', to: "/prospects" },
          { icon: <CiViewList style={{ width: 50, height: 50 }} />, label: 'Projects' },
          { icon: <GrNodes style={{ width: 50, height: 50 }} />, label: 'Customers' },
        ]} />
        {/* <Links routes={routes} sessions={sessions} /> */}
      </Stack>

      {/* <Box mt="60px" width={'100%'} display={'flex'} justifyContent={'center'}>
        <SidebarCard />
      </Box> */}

      <Flex
        mt="8px"
        justifyContent="center"
        alignItems="center"
        boxShadow={shadowPillBar}
        borderRadius="30px"
        p="14px"
      >
        <NextAvatar h="34px" w="34px" src={avatar4} me="10px" />
        <Text color={textColor} fontSize="xs" fontWeight="600" me="10px">
          Quisitive
        </Text>
        <Menu>
          <MenuButton
            as={Button}
            variant="transparent"
            aria-label=""
            border="1px solid"
            borderColor={borderColor}
            borderRadius="full"
            w="34px"
            h="34px"
            px="0px"
            p="0px"
            minW="34px"
            me="10px"
            justifyContent={'center'}
            alignItems="center"
            color={iconColor}
          >
            <Flex align="center" justifyContent="center">
              <Icon
                as={MdOutlineSettings}
                width="18px"
                height="18px"
                color="inherit"
              />
            </Flex>
          </MenuButton>
          <MenuList
            ms="-20px"
            py="25px"
            ps="20px"
            pe="20px"
            w="246px"
            borderRadius="16px"
            transform="translate(-19px, -62px)!important"
            border="0px"
            boxShadow={shadow}
            bg={bgColor}
          >
            <Box mb="30px">
              <Flex align="center" w="100%" cursor={'not-allowed'}>
                <Icon
                  as={MdOutlineManageAccounts}
                  width="24px"
                  height="24px"
                  color={gray}
                  me="12px"
                  opacity={'0.4'}
                />
                <Text
                  color={gray}
                  fontWeight="500"
                  fontSize="sm"
                  opacity={'0.4'}
                >
                  Profile Settings
                </Text>

              </Flex>
            </Box>
            <Box mb="30px">
              <Flex cursor={'not-allowed'} align="center">
                <Icon
                  as={LuHistory}
                  width="24px"
                  height="24px"
                  color={gray}
                  opacity="0.4"
                  me="12px"
                />
                <Text color={gray} fontWeight="500" fontSize="sm" opacity="0.4">
                  History
                </Text>

              </Flex>
            </Box>
            <Box mb="30px">
              <Flex cursor={'not-allowed'} align="center">
                <Icon
                  as={RoundedChart}
                  width="24px"
                  height="24px"
                  color={gray}
                  opacity="0.4"
                  me="12px"
                />
                <Text color={gray} fontWeight="500" fontSize="sm" opacity="0.4">
                  Usage
                </Text>

              </Flex>
            </Box>
            <Box>
              <Flex cursor={'not-allowed'} align="center">
                <Icon
                  as={IoMdPerson}
                  width="24px"
                  height="24px"
                  color={gray}
                  opacity="0.4"
                  me="12px"
                />
                <Text color={gray} fontWeight="500" fontSize="sm" opacity="0.4">
                  My Plan
                </Text>
              </Flex>
            </Box>
          </MenuList>
        </Menu>
        <Button
          variant="transparent"
          border="1px solid"
          borderColor={borderColor}
          borderRadius="full"
          w="34px"
          h="34px"
          px="0px"
          minW="34px"
          justifyContent={'center'}
          alignItems="center"
        >
          <Icon as={FiLogOut} width="16px" height="16px" color="inherit" />
        </Button>
      </Flex>
    </Flex>
  );
}

export default SidebarContent;
