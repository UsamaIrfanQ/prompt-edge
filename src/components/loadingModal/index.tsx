import { Modal, ModalOverlay, ModalContent, ModalBody, Box, Spinner, Image, useDisclosure } from '@chakra-ui/react';

interface LoadingModalProps {
    isOpen: boolean;
}

export const LoadingModal: React.FC<LoadingModalProps> = ({ isOpen }) => {
    return (
        <Modal isOpen={isOpen} onClose={() => { }} isCentered>
            <ModalOverlay />
            <ModalContent bg="transparent" boxShadow="none">
                <ModalBody display="flex" justifyContent="center" alignItems="center">
                    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                        {/* Add your logo here */}
                        <Image
                            src="/img/logo.png"
                            alt="Logo"
                            width="600px" // Set custom width
                            height="auto" // Maintain aspect ratio
                            mb={4}
                        />

                        {/* Spinner or animation */}
                        <Spinner
                            thickness="4px"
                            speed="0.65s"
                            emptyColor="gray.200"
                            color="blue.500"
                            size="xl"
                            label="Loading"
                        />
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
