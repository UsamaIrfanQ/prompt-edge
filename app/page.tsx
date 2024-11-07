'use client';
/*eslint-disable*/

import MessageBoxChat from '@/components/MessageBox';
import { ChatBody, OpenAIModel } from '@/types/types';
import {
  Button,
  Flex,
  Icon,
  Input,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { MdAutoAwesome } from 'react-icons/md';
import { FaPaperPlane } from "react-icons/fa6";
import { AttachmentIcon } from '@chakra-ui/icons';
import { useSession } from '@/context/SessionContext';
import { useRouter } from 'next/navigation';
import { LoadingModal } from '@/components/loadingModal';
import { StartConversationResponse } from '@/types/Response/Chat';

export default function Chat() {
  const [inputOnSubmit, setInputOnSubmit] = useState<string>('');
  const [inputCode, setInputCode] = useState<string>('');
  const [outputCode, setOutputCode] = useState<StartConversationResponse>();
  const [history, setHistory] = useState([]);
  const [model, setModel] = useState<OpenAIModel>('gpt-4o');
  const [loading, setLoading] = useState<boolean>(false);
  const [user_id, setUserId] = useState<string | null>(null);
  const [chat_id, setChatId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const inputColor = useColorModeValue('navy.700', 'white');
  const placeholderColor = useColorModeValue(
    { color: 'gray.500' },
    { color: 'whiteAlpha.600' },
  );
  const toast = useToast();
  const router = useRouter();

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

  const { fetchSessions } = useSession();

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
    // setOutputCode(' ');
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
    console.log('selectedFileIds', selectedFileIds);

    const body: ChatBody = {
      inputCode,
      model,
      user_id,
      file_id: selectedFileIds.length > 0 ? selectedFileIds[0] : undefined, // Use first file ID or undefined
      chat_id,
    };
    const response = await fetch('/api/chatAPI', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify(body),
    });
    console.log('response', response);

    if (!response.ok) {
      setLoading(false);
      alert(
        'Something went wrong when fetching from the API. Make sure to use a valid API key.',
      );
      return;
    }
    const data = await response.json();
    console.log('dataaaaaaaaaa', data);
    const apiResponse = data.response;
    const apiHistory = data.history;
    fetchSessions();

    if (!apiResponse) {
      setLoading(false);
      alert('Something went wrong');
      return;
    }
    setOutputCode(apiResponse);
    setHistory(apiHistory.History || []);
    setChatId(apiHistory.chat_id);
    setLoading(false);
  };

  const handleChange = (Event: any) => {
    setInputCode(Event.target.value);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.keyCode === 13) {
        // Check if Enter key is pressed
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
      pt={{ base: '70px', md: '0px' }}
      direction="column"
      position="relative"
    >
      <Flex
        direction="column"
        mx="auto"
        w={{ base: '100%', md: '100%', xl: '100%' }}
        minH={{ base: '75vh', '2xl': '85vh' }}
        maxW={{ base: '75vh', md: '880px', xl: '640px', '2xl': '860px' }}
      >
        {/* Model Change */}
        <Flex
          direction={'column'}
          w="100%"
          mb={outputCode ? '20px' : 'auto'}
        ></Flex>
        {/* Main Box */}
        <Flex
          direction="column"
          w="100%"
          mx="auto"
          display={outputCode ? 'flex' : 'none'}
          mb={'auto'}
        >
          <Flex
            w="100%"
            align={'center'}
            mb="75px"
            display={{ base: 'none', md: 'flex' }}
          ></Flex>
          <Flex w="100%">
            <MessageBoxChat output={outputCode} />
          </Flex>
        </Flex>
        {/* Chat Input */}
        <Flex
          alignItems="center"
          position="fixed"
          bottom="0"
          w={{ base: '100%', md: '80%', xl: '62%' }}
          justifySelf="flex-end"
          bg="white"
          zIndex="1000"
          p={{ md: 2}}
          mb={{ base: 4, md: 6 }}
          borderRadius={{ base: '0px', md: '45px', xl: "45px" }}
          maxH="52px"
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
              onChange={handleFileUpload} // handle file input change
            />
          </Button>
          <Input
            h="100%"
            bg="white"
            p={{ base: '10px 15px 10px 5px', md: '12px 20px 12px 5px' }} // Smaller padding on mobile
            me="10px"
            border='none'
            fontSize={{ base: 'xs', md: 'sm' }}        // Smaller font size on mobile
            fontWeight="500"
            _focus={{ borderColor: 'none' }}
            _focusVisible={{borderColor: 'none'}}
            color={inputColor}
            _placeholder={placeholderColor}
            placeholder="Type your message here..."
            onChange={handleChange}
            value={inputCode}
          />

          <Button
            py={{ base: '8px', md: '10px' }} // Reduced padding for mobile
            px={{ base: '8px', md: '10px' }}  // Reduced horizontal padding for mobile
            fontSize={{ base: 'xs', md: 'sm' }} // Smaller font size on mobile
            borderRadius="45px"
            ms="auto"
            w={{ base: '41px', md: '45px' }} // Reduced width on mobile
            h={{ base: '38px', md: '42px' }}  // Reduced height on mobile
            mr={{ base: '25px', md: '0px' }}  // Padding right for mobile
            onClick={handleTranslate}
            isLoading={loading ? true : false}
            bg={'#1c9cf4'}
            textColor={'white'}
            _hover={{ bg: '#0b73fc' }}
          >
            <FaPaperPlane size={14}/>
          </Button>
        </Flex>
        <Flex
          justify="center"
          mt="20px"
          direction={{ base: 'row', md: 'row' }}
          alignItems="center"
        >
          {/* <Text fontSize="xs" textAlign="center" color={gray}>
            Free Research Preview. MazikGPT may produce inaccurate information
            about people, places, or facts.
          </Text> */}
        </Flex>
      </Flex>
      <LoadingModal isOpen={isLoading} />
    </Flex>
  );
}
