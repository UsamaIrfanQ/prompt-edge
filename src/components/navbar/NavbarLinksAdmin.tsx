'use client';
// Chakra Imports
import {
  Box,
  Button,
  Center,
  Flex,
  Icon,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { SearchBar } from '@/components/navbar/searchBar/SearchBar';
import { SidebarResponsive } from '@/components/sidebar/Sidebar';
import { IoMdMoon, IoMdSunny } from 'react-icons/io';
import { MdInfoOutline } from 'react-icons/md';
import routes from '@/routes';
import { useState } from 'react';
import { FiFileText, FiDownload, FiTrash2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { AddIcon } from '@chakra-ui/icons';


interface File {
  user_id: string;
  file_id: string;
  file_name: string;
}

export default function HeaderLinks(props: {
  secondary: boolean;
  setApiKey: any;
}) {
  const toast = useToast(); // Initialize useToast
  const { secondary, setApiKey } = props;
  const { colorMode, toggleColorMode } = useColorMode();
  // Chakra Color Mode
  const navbarIcon = useColorModeValue('gray.500', 'white');
  let menuBg = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('navy.700', 'white');
  const borderColor = useColorModeValue('#E6ECFA', 'rgba(135, 140, 189, 0.3)');
  const shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    '0px 41px 75px #081132',
  );
  const buttonBg = useColorModeValue('transparent', 'navy.800');
  const hoverButton = useColorModeValue(
    { bg: 'gray.100' },
    { bg: 'whiteAlpha.100' },
  );
  const activeButton = useColorModeValue(
    { bg: 'gray.200' },
    { bg: 'whiteAlpha.200' },
  );


  const { isOpen, onOpen, onClose } = useDisclosure();
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);


  const filesPerPage = 5; // Number of files to display per page
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total number of pages
  const totalPages = Math.ceil(files.length / filesPerPage);

  // Get current files to display
  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = files.slice(indexOfFirstFile, indexOfLastFile);

  const [selectedFiles, setSelectedFiles] = useState<String[]>(() => {
    // Load selected file IDs from local storage on initial render
    const savedFiles = localStorage.getItem('selectedFileIds');
    return savedFiles ? JSON.parse(savedFiles) : [];
  });

  const handleToggleSelect = (fileId: String) => {
    if (selectedFiles.includes(fileId)) {
      // If the file is already selected, deselect it
      setSelectedFiles([]);
    } else {
      // Otherwise, select the new file and deselect any previous selection
      setSelectedFiles([fileId]);
    }
  };

  const handleSaveSelection = () => {
    localStorage.setItem('selectedFileIds', JSON.stringify(selectedFiles));
    toast({
      title: "Success!",
      description: "File selection successfully updated.",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: 'top-right',
      variant: 'subtle'
    });
    onClose(); // Close the modal after saving
  };

  const handleDownload = async (file_id: string) => {
    try {
      const user_id = localStorage.getItem("user_id")
      const response = await fetch('/api/getFileUrl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ file_id: file_id, user_id: user_id }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch file URL');
      }

      const { file_url } = await response.json();

      if (!file_url) {
        throw new Error('File URL not found');
      }

      // Trigger download by opening the file URL in a new window
      window.open(file_url, '_blank');
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleDelete = async (file_id: string) => {
    try {
      const user_id = localStorage.getItem("user_id");
      const response = await fetch('/api/deleteFileByFileId', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ file_id: file_id, user_id: user_id }),
      });

      if (!response.ok) {
        toast({
          title: "Error deleting file",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: 'top-right',
          variant: 'subtle',
        });
        throw new Error('Failed to delete file');
      }

      // Remove the file from selectedFiles and update localStorage
      setSelectedFiles((prevSelected) => {
        const updatedFiles = prevSelected.filter(id => id !== file_id);
        localStorage.setItem('selectedFileIds', JSON.stringify(updatedFiles)); // Update local storage
        return updatedFiles;
      });

      onClose();

      toast({
        title: "File deleted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: 'top-right',
        variant: 'subtle',
      });

    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };


  const fetchFilesByUserId = async (userId: string) => {
    try {
      const response = await fetch('/api/getAllFiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
      });


      if (!response.ok) {
        throw new Error('Failed to fetch files');
      }

      const files = await response.json();
      console.log("fetched files", files);
      return files;
    } catch (error) {
      console.error('Error fetching files:', error);
      return [];
    }
  };

  const handleButtonClick = async () => {
    const userId = localStorage.getItem('user_id');

    if (userId) {
      setLoading(true);  // Show the loading spinner immediately
      onOpen(); // Open the modal
      try {
        const fetchedFiles = await fetchFilesByUserId(userId);
        console.log("fetched files", fetchedFiles);
        setFiles(fetchedFiles.files);
      } catch (error) {
        console.error('Error fetching files:', error);
      } finally {
        setLoading(false);  // Hide the spinner once the process is complete
      }
    } else {
      console.error('User ID not found in local storage');
    }
  };


  return (
    <Flex
      zIndex="100"
      w={{ sm: '100%', md: 'auto' }}
      alignItems="center"
      flexDirection="row"
      bg={menuBg}
      flexWrap={secondary ? { base: 'wrap', md: 'nowrap' } : 'unset'}
      p="10px"
      borderRadius="30px"
      boxShadow={shadow}
    >
      <SearchBar
        mb={() => {
          if (secondary) {
            return { base: '10px', md: 'unset' };
          }
          return 'unset';
        }}
        me="10px"
        borderRadius="30px"
      />
      <SidebarResponsive routes={routes} />
      {/* <APIModal setApiKey={setApiKey} /> */}


      <Link href='/chat'>
        <Button
          variant="no-hover"
          bg="transparent"
          p="0px"
          minW="unset"
          minH="unset"
          h="18px"
          w="max-content"
        // onClick={toggleColorMode}
        >
          <Icon
            me="10px"
            h="18px"
            w="18px"
            color={navbarIcon}
            as={AddIcon}
          />
        </Button>
      </Link>

      <Button
        variant="no-hover"
        bg="transparent"
        p="0px"
        minW="unset"
        minH="unset"
        h="18px"
        w="max-content"
      // onClick={toggleColorMode}
      >
        <Icon
          me="10px"
          h="18px"
          w="18px"
          color={navbarIcon}
          as={colorMode === 'light' ? IoMdMoon : IoMdSunny}
        />
      </Button>
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
          <Center top={0} left={0} position={'absolute'} w={'100%'} h={'100%'}>
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
            {/* </NavLink> */}
            {/* <MenuItem
              _hover={{ bg: 'none' }}
              _focus={{ bg: 'none' }}
              color={textColor}
              borderRadius="8px"
              px="14px"
            >
              <Text fontWeight="500" fontSize="sm">
                Newsletter Settings
              </Text>
            </MenuItem> */}
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
      <Modal
        isOpen={isOpen}
        onClose={onClose} // Allow the close button to work normally
        closeOnOverlayClick={false} // Prevent closing when clicking outside
        closeOnEsc={false} // Prevent closing when pressing the escape key
      >
        <ModalOverlay />
        <ModalContent bg="white" borderRadius="10px" boxShadow="lg">
          <ModalHeader
            fontSize="24px"
            fontWeight="700"
            mx="auto"
            textAlign="center"
            borderBottom="1px solid #e2e8f0"
            pb={3}
          >
            Your Uploaded Documents
          </ModalHeader>
          <ModalCloseButton /> {/* This will allow the modal to close */}
          <ModalBody>
            {loading ? (
              <Flex justifyContent="center" alignItems="center" height="100%">
                <Spinner size="lg" color="blue.500" />
              </Flex>
            ) : (
              <Flex flexDirection="column">
                {currentFiles.length > 0 ? (
                  currentFiles.map((file, index) => (
                    <Box
                      key={index}
                      p="15px"
                      mb="10px"
                      borderRadius="8px"
                      border="1px solid #e2e8f0"
                      boxShadow="md"
                      transition="all 0.2s"
                      _hover={{ boxShadow: "lg", borderColor: "blue.300" }}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Flex alignItems="center">
                        <input
                          type="checkbox"
                          checked={selectedFiles.includes(file.file_id)}
                          onChange={() => handleToggleSelect(file.file_id)}
                        />
                        <Box ml="10px">
                          <Text fontSize="18px" fontWeight="500">
                            {file.file_name}
                          </Text>
                        </Box>
                      </Flex>
                      <Flex>
                        <Button
                          size="sm"
                          bg={'#1c9cf4'}
                          textColor={'white'}
                          mr={2}
                          onClick={() => handleDownload(file.file_id)}
                          _hover={{ bg: "blue.600" }}
                        >
                          <FiDownload />
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleDelete(file.file_id)}
                          _hover={{ bg: "red.600" }}
                        >
                          <FiTrash2 />
                        </Button>
                      </Flex>
                    </Box>
                  ))
                ) : (
                  <Text textAlign="center" color="gray.500">
                    No documents found
                  </Text>
                )}
              </Flex>
            )}
          </ModalBody>

          <ModalFooter>
            <Flex justifyContent="space-between" width="100%">
              <IconButton
                aria-label="Previous Page"
                icon={<FiChevronLeft />}
                colorScheme="gray"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} // Go to previous page
                isDisabled={currentPage === 1}
                mr={3}
              />
              <Button
                bg={'#1c9cf4'}
                textColor={'white'}
                mr={3}
                onClick={handleSaveSelection}
              >
                Save Selection
              </Button>
              <IconButton
                aria-label="Next Page"
                icon={<FiChevronRight />}
                colorScheme="gray"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} // Go to next page
                isDisabled={currentPage === totalPages}
                mr={3}
              />
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>


    </Flex>
  );
}
