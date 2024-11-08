// app/auth/callback/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import {
  Box,
  Text,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
} from '@chakra-ui/react';

const CallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const code = searchParams.get('code'); // Get the code from the query parameters

    if (code) {
      // Store the code in localStorage
      localStorage.setItem('code', code);

      // Show the loading modal
      onOpen();

      // Call the function to send the code to the API and store the userId
      sendCodeToAPIAndStoreUserId(code);
    }
  }, [searchParams, onOpen]);

  const sendCodeToAPIAndStoreUserId = async (code: string) => {
    try {
      // Example API call to send the code and get userId
      localStorage.setItem('user_id', code); // Store the userId in localStorage
      router.push('/chat');
      // const response = await fetch('/api/getUserId', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ code }), // Send the stored code to the backend API
      // });

      // if (response.ok) {
      //   const responseData = await response.json(); // Get the entire response data
      //   console.log(responseData); // Log the response data

      //   // Directly access userId from the response
      //   const userId = responseData.userId; // Access userId directly

      //   // Ensure userId is a string before storing
      //   localStorage.setItem('user_id', userId); // Store the userId in localStorage
      //   // Redirect the user to the main chat page
      // } else {
      //   console.error('Error fetching userId');
      // }
    } catch (error) {
      console.error('Error in API request', error);
    } finally {
      setLoading(false); // Close the modal when done
      onClose();
    }
  };

  return (
    <Suspense fallback={<LoadingComponent />}>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Text fontSize="xl" mb={4}>
          Redirecting...
        </Text>
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalBody>
              <Spinner size="xl" />
              <Text>Fetching your user data, please wait...</Text>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </Suspense>
  );
};

const LoadingComponent = () => (
  <Box
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    height="100vh"
  >
    <Spinner size="xl" />
    <Text>Loading...</Text>
  </Box>
);

export default CallbackPage;
