'use client';
/*eslint-disable*/
import MessageBoxChat from '@/components/MessageBox';
import { ChatBody, OpenAIModel, PILL_VIEWS } from '@/types/types';
import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { MdAutoAwesome } from 'react-icons/md';
import { FaPaperPlane } from 'react-icons/fa';
import { AttachmentIcon } from '@chakra-ui/icons';
import { useSession } from '@/context/SessionContext';
import { useParams, useRouter } from 'next/navigation'; // Import the useRouter hook
import { LoadingModal } from '@/components/loadingModal';
import copilotLogo from '../../public/img/copilot-logo.png';
import { StartChatRequest } from '@/types/Request/Chat';
import chatClient from '@/service/chat';
import { StartConversationResponse } from '@/types/Response/Chat';
import { staticCompanyResponse } from '@/utils/static';
import { FiRefreshCw } from 'react-icons/fi';

type Pill = {
  title: string;
  value: PILL_VIEWS;
};

interface PillRowProps {
  pills: Pill[];
  onSelect: (value: PILL_VIEWS) => void;
}

const pillsList = [
  { title: 'Mizkan Holdings Co., Ltd.', value: PILL_VIEWS.COMPANY_VIEW },
  { title: 'Data Migration Scope.', value: PILL_VIEWS.DATA_MIGRATION },
  { title: 'Business Processes', value: PILL_VIEWS.BUSINESS_PROCESS },
  { title: 'Integration View', value: PILL_VIEWS.INTEGRATION_VIEW },
  { title: 'Application Module View', value: PILL_VIEWS.APPLICATION_MODULE },
  { title: 'Erp Platform View', value: PILL_VIEWS.ERP_PLATFORM_VIEW },
];

const PillsRow: React.FC<PillRowProps> = ({ pills, onSelect }) => {
  return (
    <Box
      display="flex"
      mb={2}
      alignSelf="end"
      alignItems="center"
      justifyContent="space-between"
      p={2}
    >
      <HStack spacing={2}>
        {pills.map((pill, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            borderRadius="12px"
            colorScheme="gray"
            border="2px #ccc solid"
            _hover={{ bg: 'gray.100' }}
            onClick={() => onSelect(pill.value)}
          >
            {pill?.title}
          </Button>
        ))}
      </HStack>

      <IconButton
        aria-label="Refresh"
        icon={<FiRefreshCw />}
        variant="ghost"
        colorScheme="gray"
        size="sm"
      />
    </Box>
  );
};

export default function Chat() {
  const router = useRouter(); // Initialize the useRouter hook to access URL params
  // Input States
  const [chat_id, setChatId] = useState<string>();
  const [selectedPill, setSelectedPill] = useState<PILL_VIEWS>();
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
    const body: StartChatRequest = {
      user_input: inputCode,
      chat_id: chat_id,
      id: chat_id,
      user_id: user_id,
    };
    try {
      const data = await chatClient.startConversation(body, {
        headers: {
          user_id: user_id,
        },
      });
      setOutputData(data);
      setChatId(data?.id);
    } catch (error) {
      console.log(error);
      toast({
        title: 'Something went wrong. Please try again later.',
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: 'top-right',
        variant: 'subtle',
      });
    }
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

  const handlePillSelect = (value: PILL_VIEWS) => {
    setSelectedPill(value);
  };

  console.log('CHAT ID', chat_id);
  console.log('USER ID', user_id);
  console.log('CHAT DATA', outputData);

  return (
    <Flex
      w="100%"
      h="100%"
      direction="column"
      justifyContent={outputData ? '' : 'center'}
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
        h={outputData ? '100%' : ''}
        w={{ base: '100%', md: '100%', xl: '100%' }}
        // minH={{ base: 'calc(100vh - 108px)', lg: '75vh' }}
        // maxH={{ base: 'calc(100vh - 108px)', lg: '80vh' }}
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
          pb={'2rem'}
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
          h={outputData ? 'calc(100% - 52px)' : ''}
          mx="auto"
          display={!!outputData ? 'flex' : 'none'} // Check if history is available
          mb={'auto'}
          overflowY="auto"
        >
          <Flex w="100%" h="100%" paddingX={{ base: '8px', lg: '20px' }}>
            <MessageBoxChat selectedPill={selectedPill} output={outputData} />
          </Flex>
        </Flex>

        <Flex flexDirection="column" w="100%" alignItems="center">
          {!!outputData && (
            <PillsRow pills={pillsList} onSelect={handlePillSelect} />
          )}
          <Flex
            alignItems="center"
            w={{ base: '100%', md: '80%', xl: '62%' }}
            justifySelf="flex-end"
            bg="white"
            zIndex="1000"
            p={{ base: 2, md: 2 }}
            mb={{ base: 4, md: 6 }}
            borderRadius={{ base: '0px', md: '45px', xl: '45px' }}
            maxH={'52px'}
          >
            <Button
              as="label"
              htmlFor="file-upload"
              variant="ghost"
              me="5px"
              borderRadius="45px"
              _hover={{
                bg: 'white',
              }}
              h="42px"
              w="52px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={AttachmentIcon} w={5} h={5} color="gray.800" />
              <Input
                id="file-upload"
                type="file"
                display="none"
                onChange={handleFileUpload}
              />
            </Button>
            <Input
              h="100%"
              bg="white"
              p={{ base: '10px 15px 10px 5px', md: '12px 20px 12px 5px' }} // Smaller padding on mobile
              me="10px"
              border="none"
              fontSize={{ base: 'xs', md: 'sm' }} // Smaller font size on mobile
              fontWeight="500"
              _focus={{ borderColor: 'none' }}
              _focusVisible={{ borderColor: 'none' }}
              color={inputColor}
              _placeholder={placeholderColor}
              placeholder="Type your message here..."
              onChange={handleChange}
              value={inputCode}
            />

            <Button
              py={{ base: '8px', md: '10px' }}
              px={{ base: '8px', md: '10px' }}
              fontSize={{ base: 'xs', md: 'sm' }}
              borderRadius="45px"
              ms="auto"
              w={{ base: '41px', md: '45px' }}
              h={{ base: '38px', md: '42px' }}
              mr={{ base: '25px', md: '0px' }}
              onClick={handleTranslate}
              isLoading={loading ? true : false}
              bg={'#1c9cf4'}
              textColor={'white'}
              _hover={{ bg: '#0b73fc' }}
              disabled={inputCode.length > 0 ? false : true}
            >
              <FaPaperPlane size={14} />
            </Button>
          </Flex>
        </Flex>
      </Flex>
      {/* Chat Input */}
      <LoadingModal isOpen={isLoading} />
    </Flex>
  );
}
