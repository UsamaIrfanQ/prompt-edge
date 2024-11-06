'use client';
/*eslint-disable*/

import MessageBoxChat from '@/components/MessageBox';
import { ChatBody, OpenAIModel } from '@/types/types';
import {
  Button,
  Flex,
  Icon,
  Image,
  Input,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { MdAutoAwesome } from 'react-icons/md';
import { AttachmentIcon } from '@chakra-ui/icons';
import { useSession } from '@/context/SessionContext';
import { useParams, useRouter } from 'next/navigation'; // Import the useRouter hook
import { LoadingModal } from '@/components/loadingModal';
import copilotLogo from '../../public/img/copilot-logo.png';
import { StartChatRequest } from '@/types/Request/Chat';
import chatClient from '@/service/chat';
import { StartConversationResponse } from '@/types/Response/Chat';
import { staticCompanyResponse } from '@/utils/static';

export default function Chat() {
  const router = useRouter(); // Initialize the useRouter hook to access URL params
  const [chat_id, setChatId] = useState<string>();
  // Input States
  const [inputOnSubmit, setInputOnSubmit] = useState<string>('');
  const [inputCode, setInputCode] = useState<string>('');
  // Response message
  const [outputData, setOutputData] = useState<StartConversationResponse>();
  const [history, setHistory] = useState<
    Array<{ content: string; role: string }>
  >([]);
  // ChatGPT model
  const [model, setModel] = useState<OpenAIModel>('gpt-4o');
  // Loading state
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast(); // Initialize the toast hook
  const [isLoading, setIsLoading] = useState(false); // State to control modal visibility

  let navbarPosition = 'fixed' as const;
  let navbarFilter = 'none';
  let navbarBackdrop = 'blur(20px)';

  // API Key
  // const [apiKey, setApiKey] = useState<string>(apiKeyApp);
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const inputColor = useColorModeValue('navy.700', 'white');
  const gray = useColorModeValue('gray.500', 'white');
  const placeholderColor = useColorModeValue(
    { color: 'gray.500' },
    { color: 'whiteAlpha.600' },
  );
  const [user_id, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const hasRefreshed = localStorage.getItem('hasRefreshed');
    if (!hasRefreshed) {
      localStorage.setItem('hasRefreshed', 'true');
      window.location.reload(); // Trigger page refresh
    }
    // This ensures it only runs on the client side
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('user_id');

      if (!storedUserId) {
        router.push('/logout'); // Redirect to the logout page
      } else {
        setUserId(storedUserId);
      }
    }
  }, [router]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      toast({
        title: 'No file selected.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsLoading(true); // Show loading modal
      const response = await fetch('/api/uploadFile', {
        method: 'POST',
        headers: {
          user_id: user_id ? user_id : '', // add user_id from state in the headers
        },
        body: formData, // send the file in FormData format
      });

      setIsLoading(false); // Hide loading modal after response

      if (!response.ok) {
        toast({
          title: 'Error uploading file.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const data = await response.json();
      toast({
        title: 'File uploaded successfully.',
        // description: `File path: ${data.file_path}`, // Show additional info if needed
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
        variant: 'subtle',
      });
      console.log('Upload response:', data);
    } catch (error) {
      setIsLoading(false); // Hide loading modal in case of error
      console.error('File upload error:', error);
      toast({
        title: 'Error uploading file.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        variant: 'subtle',
      });
    }
  };

  const handleTranslate = async () => {
    setInputOnSubmit(inputCode);
    setInputCode('');
    const maxCodeLength = model === 'gpt-4o' ? 700 : 700;

    if (!inputCode) {
      alert('Please enter your message.');
      return;
    }

    if (inputCode.length > maxCodeLength) {
      alert(
        `Please enter code less than ${maxCodeLength} characters. You are currently at ${inputCode.length} characters.`,
      );
      return;
    }
    // setOutputData(undefined);
    setLoading(true);
    const controller = new AbortController();
    if (!user_id) {
      setLoading(false);
      alert(
        'Something went wrong when fetching from the API. Make sure to use a valid API key.sssss',
      );
      return;
    }
    const selectedFileIds = JSON.parse(
      localStorage.getItem('selectedFileIds') || '[]',
    );

    const body: StartChatRequest = {
      user_input: inputCode,
      id: chat_id,
      user_id: user_id,
    };
    const data = await chatClient.startConversation(body);

    setOutputData(data);
    setChatId(data.chat_id);
    setLoading(false);
  };

  const handleChange = (Event: any) => {
    setInputCode(Event.target.value);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.keyCode === 13) {
        handleTranslate();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [inputCode, handleTranslate]);

  return (
    <Flex
      w="100%"
      direction="column"
      position="relative"
      borderRadius="12px"
      bg="rgba(255, 255, 255, 0.5)"
      padding={{ base: '8px', md: '0px' }}
    >
      <Flex
        direction="column"
        alignItems="center"
        mx="auto"
        overflowY="hidden"
        h="100%"
        w={{ base: '100%', md: '100%', xl: '100%' }}
        minH={{ base: 'calc(100vh - 108px)', lg: '75vh' }}
        maxH={{ base: 'calc(100vh - 108px)', lg: '80vh' }}
      >
        {/* Model Change */}
        <Flex
          direction={'column'}
          w="100%"
          mb={outputData ? '20px' : 'auto'}
        ></Flex>
        {/* Main Box */}
        <Flex
          direction="column"
          alignItems="center"
          w="100%"
          h="100%"
          mx="auto"
          display={!!outputData ? 'none' : 'flex'} // Check if history is available
          mb={'auto'}
        >
          <Image
            src="/img/copilot-logo.png"
            alt="Logo"
            w="250px"
            mb="20px"
            maxWidth="250px"
          />
          <Text fontWeight="bold" fontSize="20px" textAlign="center">
            Your Copilot for Dynamic 365 Implementation
          </Text>
        </Flex>
        <Flex
          direction="column"
          w="100%"
          h="100%"
          mx="auto"
          display={!!outputData ? 'flex' : 'none'} // Check if history is available
          mb={'auto'}
          overflowY="auto"
        >
          <Flex w="100%" paddingX={{ base: '8px', lg: '20px' }}>
            <MessageBoxChat output={outputData} />
          </Flex>
        </Flex>

        <Flex
          w={{ base: '100%', md: '80%', xl: '62%' }} // Responsive width
          justifySelf="flex-end"
          zIndex="1000"
          pb={{ base: 4, md: 6, xl: 10 }} // Responsive padding bottom
          borderRadius={{ base: '0px', md: 10 }} // No radius on mobile, but radius on larger screens
          flexDirection={{ base: 'column', md: 'row' }}
        >
          <Input
            minH={{ base: '48px', md: '56px' }}
            h="100%"
            border="1px solid"
            borderColor={borderColor}
            bg="white"
            borderRadius="45px"
            p={{ base: '10px 15px', md: '15px 20px' }} // Smaller padding on mobile
            fontSize={{ base: 'xs', md: 'sm' }} // Smaller font size on mobile
            fontWeight="500"
            _focus={{ borderColor: 'none' }}
            color={inputColor}
            _placeholder={placeholderColor}
            placeholder="Type your message here..."
            onChange={handleChange}
            value={inputCode}
          />

          <Flex alignItems="center">
            <Button
              as="label"
              htmlFor="file-upload"
              variant="ghost"
              me="10px"
              borderRadius="45px"
              _hover={{
                bg: 'white',
              }}
              h="54px"
              w="54px"
              minW="54px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={AttachmentIcon} w={6} h={6} color="gray.800" />
              <Input
                id="file-upload"
                type="file"
                display="none"
                onChange={handleFileUpload} // handle file input change
              />
            </Button>

            <Button
              flex="1"
              textColor={'white'}
              py={{ base: '12px', md: '20px' }} // Reduced padding for mobile
              px={{ base: '8px', md: '16px' }} // Reduced horizontal padding for mobile
              fontSize={{ base: 'xs', md: 'sm' }} // Smaller font size on mobile
              borderRadius="45px"
              w={{ base: '100px', md: '160px', xl: '210px' }} // Reduced width on mobile
              h={{ base: '44px', md: '54px' }} // Reduced height on mobile
              onClick={handleTranslate}
              isLoading={loading ? true : false}
              bg={'#1c9cf4'}
              _hover={{ bg: '#0b73fc' }}
            >
              Submit
            </Button>
          </Flex>
        </Flex>
      </Flex>
      {/* Chat Input */}
      <LoadingModal isOpen={isLoading} />
    </Flex>
  );
}
