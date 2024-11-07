import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Button,
  Flex,
  Image,
  Text,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useColorModeValue,
  useToast,
  Box,
  Heading,
  Divider,
  VStack,
  Checkbox,
  Container,
  Input,
  SimpleGrid,
  Stack,
  List,
  ListItem,
  useBreakpointValue,
} from '@chakra-ui/react';
import Card from '@/components/card/Card';
import RMstyle from '../styles/markdown-styles.module.css';
import { FaCopy, FaInfoCircle } from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight, FiRefreshCw } from 'react-icons/fi';
import {
  staticBusinessProcessesData,
  staticCompanyMarkdownText,
  staticMigrationsData,
  applicationModuleData,
  erpPlatformData,
} from '@/utils/static';
import { AddIcon, DownloadIcon } from '@chakra-ui/icons';
import styled from '@emotion/styled';
import { title } from 'process';
import {
  ChatViewData,
  StartConversationResponse,
  ViewDataProcessField,
  ViewDataResponse,
} from '@/types/Response/Chat';
import dataHelper from '@/helpers/DataHelper';
import { PILL_VIEWS } from '@/types/types';

interface MessageBoxProps {
  output?: StartConversationResponse;
  selectedPill?: PILL_VIEWS;
}

interface CompanyInfoProps {
  viewData: ViewDataResponse;
}

const CompanyInfoCard: React.FC<CompanyInfoProps> = ({ viewData }) => {
  const {
    title,
    content,
    industry,
    SIC_Code,
    type_of_manufacturing,
    headquarters_address,
    employees,
    corporate_structure,
    subsidiaries_and_brands,
  } = viewData;
  return (
    <Box>
      <Heading size="md" mb={3}>
        {title}
      </Heading>
      <Text mb={4}>{content}</Text>

      <SimpleGrid columns={2} spacing={5}>
        <Stack spacing={2}>
          <Text fontWeight="bold">Industry:</Text>
          <Text>{dataHelper.stringWithFallback(industry)}</Text>

          <Text fontWeight="bold">SIC Code:</Text>
          <Text>{dataHelper.stringWithFallback(SIC_Code)}</Text>

          <Text fontWeight="bold">Type of Manufacturing:</Text>
          <Text>{dataHelper.stringWithFallback(type_of_manufacturing)}</Text>

          <Text fontWeight="bold">Headquarters address:</Text>
          <Text>{dataHelper.stringWithFallback(headquarters_address)}</Text>

          <Text fontWeight="bold">Employees:</Text>
          <Text>{dataHelper.stringWithFallback(employees)}</Text>
        </Stack>

        <Stack spacing={2}>
          <Text fontWeight="bold">Corporate Structure:</Text>
          <Text>{dataHelper.stringWithFallback(corporate_structure)}</Text>

          <Text fontWeight="bold">Subsidiaries and Brands</Text>
          <List spacing={1}>
            {subsidiaries_and_brands.map((brand, index) => (
              <ListItem key={index}>
                • {dataHelper.stringWithFallback(brand)}
              </ListItem>
            ))}
          </List>
        </Stack>
      </SimpleGrid>
    </Box>
  );
};

// Types for our data structure
interface MigrationItem {
  id: string;
  label: string;
  value?: string;
  isChecked: boolean;
}

interface MigrationSection {
  title: string;
  items: MigrationItem[];
}

// Component with updated logic
interface DataMigrationViewProps {
  viewData: ViewDataResponse;
  onSectionChange?: (updatedSections: ViewDataProcessField[]) => void;
}

const DataMigrationView: React.FC<DataMigrationViewProps> = ({
  viewData,
  onSectionChange,
}) => {
  const [sections, setSections] = useState<ViewDataResponse['fields']>(
    viewData.fields ?? [],
  );

  const handleCheckboxChange = (sectionIndex: number) => {
    const newSections = sections ? [...sections] : [];
    newSections[sectionIndex].isChecked = `${
      newSections[sectionIndex].isChecked === 'true' ? 'false' : 'true'
    }`;
    setSections(newSections);
    onSectionChange && onSectionChange(newSections);
  };

  const handleInputChange = (sectionIndex: number, value: string) => {
    const newSections = sections ? [...sections] : [];
    newSections[sectionIndex].value = value;
    setSections(newSections);
    onSectionChange && onSectionChange(newSections);
  };

  return (
    <Container maxW="container.xl" overflowY="auto" py={6}>
      <Heading size="md" mb={4}>
        {viewData?.title}
      </Heading>
      <Text fontSize="sm" color="gray.600" mb={6}>
        {viewData?.description}
      </Text>

      <SimpleGrid columns={[1, 2]} spacing={8}>
        {sections?.map((section, sectionIndex) => (
          <Box key={section.id} flex={1}>
            <VStack align="stretch" spacing={4}>
              <HStack key={section.id} spacing={4}>
                <Checkbox
                  isChecked={section.isChecked === 'true'}
                  onChange={() => handleCheckboxChange(sectionIndex)}
                >
                  <Text fontSize="16px" whiteSpace="nowrap">
                    {section.label}
                  </Text>
                </Checkbox>
                <Input
                  borderRadius="8px"
                  border="1px #ccc solid"
                  background="white"
                  size="sm"
                  value={section.value || ''}
                  onChange={(e) =>
                    handleInputChange(sectionIndex, e.target.value)
                  }
                  isDisabled={section.isChecked === 'false'} // Disabled if checkbox is not checked
                  placeholder={section.inputPlaceHolders || 'Enter value...'}
                />
              </HStack>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </Container>
  );
};

interface BusinessProcessesViewProps {
  viewData: ViewDataResponse;
}

const BusinessProcessesView: React.FC<BusinessProcessesViewProps> = ({
  viewData,
}) => {
  // Initialize selectedProcesses based on `isChecked` value
  const [selectedProcesses, setSelectedProcesses] = useState<string[]>(
    (viewData.fields ?? [])
      .filter((field) => field.isChecked === 'true')
      .map((field) => field.label),
  );

  // Function to handle checkbox selection
  const handleCheckboxChange = (label: string) => {
    setSelectedProcesses((prevSelected) =>
      prevSelected.includes(label)
        ? prevSelected.filter((process) => process !== label)
        : [...prevSelected, label],
    );
  };

  return (
    <Container maxW="container.xl" overflowY="auto" py={6}>
      <Heading as="h3" size="md" mb={2}>
        {viewData.title}
      </Heading>
      <Text>{viewData.description}</Text>
      <Divider mb={4} />
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        {viewData.fields?.map((field) => (
          <Checkbox
            key={field.id}
            defaultChecked={field.isChecked === 'true'}
            isChecked={selectedProcesses.includes(field.label)}
            onChange={() => handleCheckboxChange(field.label)}
          >
            <Text fontWeight="bold" display="inline">
              {field.label}
            </Text>
            <Text display="inline" color="gray.600" ml={2}>
              {field.description}
            </Text>
          </Checkbox>
        ))}
      </SimpleGrid>
    </Container>
  );
};

interface ModulesViewProps {
  viewData: ViewDataResponse;
}

const ModulesView: React.FC<ModulesViewProps> = ({ viewData }) => {
  // Group fields by their `group` property
  const groupedFields = viewData.fields?.reduce((acc, field) => {
    if (field.group) {
      (acc[field.group] = acc[field.group] || []).push(field);
    }
    return acc;
  }, {} as Record<string, ViewDataProcessField[]>);

  // Initialize selected processes based on `isChecked` value
  const [selectedProcesses, setSelectedProcesses] = useState<string[]>(
    viewData.fields
      ?.filter((field) => field.isChecked === 'true')
      .map((field) => field.label) ?? [],
  );

  // Function to handle checkbox selection
  const handleCheckboxChange = (label: string) => {
    setSelectedProcesses((prevSelected) =>
      prevSelected.includes(label)
        ? prevSelected.filter((process) => process !== label)
        : [...prevSelected, label],
    );
  };

  return (
    <Container maxW="container.xl" overflowY="auto" py={6}>
      <Heading as="h3" size="md" mb={2}>
        {viewData.title}
      </Heading>
      <Text>{viewData.description}</Text>
      <Divider mb={4} />

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
        {groupedFields &&
          Object.entries(groupedFields).map(([groupName, fields]) => (
            <Box key={groupName} mb={6}>
              <Heading as="h4" size="sm" mb={2}>
                {groupName}
              </Heading>
              <Flex flexDirection="column" alignItems="start" ml={2}>
                {fields.map((field) => (
                  <Checkbox
                    key={field.id}
                    isChecked={selectedProcesses.includes(field.label)}
                    onChange={() => handleCheckboxChange(field.label)}
                    mb={2}
                  >
                    <Text fontWeight="bold" display="inline">
                      {field.label}
                    </Text>
                    <Text display="inline" color="gray.600" ml={2}>
                      {field.description}
                    </Text>
                  </Checkbox>
                ))}
              </Flex>
            </Box>
          ))}
      </SimpleGrid>
    </Container>
  );
};

interface DocumentCreationViewProps {
  viewData: ViewDataResponse;
}

const DocumentCreationView: React.FC<DocumentCreationViewProps> = ({
  viewData,
}) => {
  // Responsive size for the button based on screen size
  const buttonSize = useBreakpointValue({ base: 'md', md: 'lg' });

  return (
    <Container maxW="container.xl" overflowY="auto" py={6}>
      <Flex flexDirection="column" alignItems="start">
        <Heading as="h3" size="lg" mb={2} textAlign="left">
          Document Creation
        </Heading>
        <Text mb={4} textAlign="left" color="gray.600">
          Please download and review the document below.
        </Text>
        <Divider mb={4} />
        <VStack spacing={4}>
          <Button
            key={viewData?.id}
            as="a"
            href={viewData?.url}
            target="_blank"
            rel="noopener noreferrer"
            leftIcon={<DownloadIcon />}
            colorScheme="blue"
            background="blue.400"
            size={buttonSize}
            width={{ base: '100%', md: 'auto' }}
          >
            Download Document
          </Button>
        </VStack>
      </Flex>
    </Container>
  );
};

type MarkdownView = {
  content: string;
};

const MarkdownView: React.FC<MarkdownView> = ({ content }) => {
  return (
    <Box overflowY="auto">
      <ReactMarkdown
        className={RMstyle.reactMarkDown}
        components={{
          p: ({ node, ...props }) => (
            <p style={{ marginBottom: '1em' }} {...props} /> // Adds space between paragraph and next element
          ),
          ul: ({ node, ...props }) => (
            <ul {...props} /> // Adds space before the bullet list
          ),
          ol: ({ node, ...props }) => (
            <ol {...props} /> // Adds space before the numbered list
          ),
          li: ({ node, ...props }) => <li {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </Box>
  );
};

const ApplicationModuleView: React.FC = () => {
  const [sections, setSections] = useState(applicationModuleData);

  const handleCheckboxChange = (sectionIndex: number, itemIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].items[itemIndex].isChecked =
      !newSections[sectionIndex].items[itemIndex].isChecked;
    setSections(newSections);
  };

  return (
    <Container maxW="container.xl" overflowY="auto" py={6}>
      <Heading size="md" mb={4}>
        Dynamics 365 - Application Modules
      </Heading>
      <Text fontSize="sm" color="gray.600" mb={6}>
        These modules are designed to optimize financial operations, enhance
        supply chain efficiency, and ensure compliance with industry
        regulations:
      </Text>

      <HStack align="start" spacing={8}>
        {sections.map((section, sectionIndex) => (
          <Box
            key={section.title}
            flex={1}
            borderWidth="1px"
            borderRadius="8px"
            boxShadow="sm"
            p={4}
            bg="gray.50"
          >
            <Checkbox
              isChecked={section.items.every((item) => item.isChecked)}
              onChange={() =>
                setSections((prevSections) => {
                  const newSections = [...prevSections];
                  const allChecked = newSections[sectionIndex].items.every(
                    (item) => item.isChecked,
                  );
                  newSections[sectionIndex].items.forEach(
                    (item) => (item.isChecked = !allChecked),
                  );
                  return newSections;
                })
              }
              fontWeight="bold"
              mb={4}
            >
              {section.title}
            </Checkbox>

            <VStack align="stretch" spacing={4}>
              {section.items.map((item, itemIndex) => (
                <HStack key={item.id} align="start" spacing={2}>
                  <Checkbox
                    isChecked={item.isChecked}
                    onChange={() =>
                      handleCheckboxChange(sectionIndex, itemIndex)
                    }
                  />
                  <Box mt="-6px">
                    <Text fontWeight="semibold" fontSize="md">
                      {item.label}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {item.description}
                    </Text>
                  </Box>
                </HStack>
              ))}
            </VStack>
          </Box>
        ))}
      </HStack>
    </Container>
  );
};

type ErpPlatformViewProps = {
  viewData: ViewDataResponse;
};

const ErpPlatformView: React.FC<ErpPlatformViewProps> = ({ viewData }) => {
  const [sections, setSections] = useState<ViewDataResponse['fields']>(
    viewData?.fields ?? [],
  );

  const handleCheckboxChange = (fieldIndex: number) => {
    const newSections = sections ? [...sections] : [];
    newSections[fieldIndex].isChecked = `${
      newSections[fieldIndex].isChecked === 'true' ? 'false' : 'true'
    }`;
    setSections(newSections);
  };

  return (
    <Container maxW="container.xl" overflowY="auto" py={6}>
      <Heading size="md" mb={4}>
        {viewData?.title}
      </Heading>
      <Text fontSize="sm" color="gray.600" mb={6}>
        {viewData?.description}
      </Text>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        {viewData.fields?.map((field, fieldIndex) => (
          <Box key={field.id} mb={3}>
            <Checkbox
              isChecked={field.isChecked === 'true'}
              onChange={() => handleCheckboxChange(fieldIndex)}
              fontWeight="bold"
            >
              {field.label}
            </Checkbox>
            <Text fontSize="sm" color="gray.600" pl="6">
              {field.description}
            </Text>
          </Box>
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default function MessageBox({ output, selectedPill }: MessageBoxProps) {
  const toast = useToast();
  const textColor = useColorModeValue('navy.700', 'white');
  const [viewData, setViewData] = useState<ViewDataResponse[]>();
  const bottomRef = useRef<HTMLDivElement | null>(null); // Reference to the bottom of the chat
  const [isCitationModalOpen, setIsCitationModalOpen] = useState(false); // Modal state
  const [selectedCitation, setSelectedCitation] = useState<string | null>(null); // Selected citation
  const [selectedCitations, setSelectedCitations] = useState<string[]>([]); // Store selected message's citations

  useEffect(() => {
    if (output?.response) {
      if (typeof output?.response === 'string') {
        try {
          const data = JSON.parse(output?.response);
          setViewData(data);
        } catch (error) {
          setViewData(undefined);
          console.log('ERROR => Unable to parse chat response json: ', error);
        }
      } else {
        setViewData(output?.response);
      }
    }
  }, [output?.response]);

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content).then(() => {
      toast({
        title: 'Message copied successfully.',
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top-right',
        variant: 'subtle',
      });
    });
  };

  const handleModalClose = () => {
    setIsCitationModalOpen(false); // Close the modal
  };

  const ChatDynamicView = useMemo(() => {
    switch (viewData?.[0]?.viewType) {
      case 'companyinfo':
        return <CompanyInfoCard viewData={viewData?.[0]} key={1} />;
      case 'datamigration':
        return <DataMigrationView viewData={viewData?.[0]} />;
      case 'businessprocesses':
        return <BusinessProcessesView viewData={viewData?.[0]} key={3} />;
      case 'documentcreation':
        return <DocumentCreationView viewData={viewData?.[0]} key={4} />;
      case 'modules':
        return <ModulesView viewData={viewData?.[0]} key={5} />;
      case 'modules':
        return <ApplicationModuleView key={6} />;
      case 'erp':
        return <ErpPlatformView viewData={viewData?.[0]} />;
      default:
        return <MarkdownView content={staticCompanyMarkdownText} key={1} />;
    }
  }, [viewData]);

  const [currentPage, setCurrentPage] = useState(1);
  const citationsPerPage = 1; // Adjust the number of citations per page

  // Calculate total pages based on the number of citations
  const totalPages = Math.ceil(selectedCitations.length / citationsPerPage);

  // Get the citations for the current page
  const currentCitations = selectedCitations.slice(
    (currentPage - 1) * citationsPerPage,
    currentPage * citationsPerPage,
  );

  return (
    <>
      <Flex direction="column" alignItems="end" w="100%" h="100%">
        <Card
          display={!!output ? 'flex' : 'none'}
          color={textColor}
          minH="300px"
          h="100%"
          fontSize={{ base: 'sm', md: 'md' }}
          lineHeight={{ base: '24px', md: '26px' }}
          fontWeight="500"
          mb={2}
          backdropFilter="blur(200px)"
          bg="rgba(255, 255, 255, 0.3)"
          border="3px solid #ffffff"
          overflowY="auto" // Allow scrolling if the content exceeds the container height
        >
          {viewData?.[0]?.viewType !== 'simplechat' ? (
            <Flex direction="column">
              <div
                style={{
                  marginBottom: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignSelf: 'flex-end',
                  maxWidth: '70%',
                }}
              >
                <Box
                  background="blue.300"
                  color="white"
                  style={{
                    padding: '10px 20px',
                    borderRadius: '30px',
                    textAlign: 'left', // Text always left-aligned
                  }}
                >
                  {/* <Image src="/img/prompt-edge-logo.svg" alt="Logo" w="20px" mb="20px" maxWidth="20px" /> */}
                  <ReactMarkdown
                    className={RMstyle.reactMarkDown}
                    components={{
                      p: ({ node, ...props }) => (
                        <p {...props} /> // Adds space between paragraph and next element
                      ),
                      ul: ({ node, ...props }) => (
                        <ul {...props} /> // Adds space before the bullet list
                      ),
                      ol: ({ node, ...props }) => (
                        <ol {...props} /> // Adds space before the numbered list
                      ),
                      li: ({ node, ...props }) => <li {...props} />,
                    }}
                  >
                    {output?.input ?? ''}
                  </ReactMarkdown>
                </Box>
              </div>
              {ChatDynamicView}
            </Flex>
          ) : (
            <Box>
              {!!output && (
                <Flex direction="column">
                  <div
                    style={{
                      marginBottom: '10px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignSelf: 'flex-end',
                      maxWidth: '70%',
                    }}
                  >
                    <Box
                      background="blue.300"
                      color="white"
                      style={{
                        padding: '10px 20px',
                        borderRadius: '50px',
                        textAlign: 'left', // Text always left-aligned
                      }}
                    >
                      {/* <Image src="/img/prompt-edge-logo.svg" alt="Logo" w="20px" mb="20px" maxWidth="20px" /> */}
                      <ReactMarkdown
                        className={RMstyle.reactMarkDown}
                        components={{
                          p: ({ node, ...props }) => (
                            <p style={{ lineHeight: '1.5em' }} {...props} /> // Adds space between paragraph and next element
                          ),
                          ul: ({ node, ...props }) => (
                            <ul {...props} /> // Adds space before the bullet list
                          ),
                          ol: ({ node, ...props }) => (
                            <ol {...props} /> // Adds space before the numbered list
                          ),
                          li: ({ node, ...props }) => <li {...props} />,
                        }}
                      >
                        {output?.input ?? ''}
                      </ReactMarkdown>
                    </Box>
                  </div>
                  <Box
                    style={{
                      marginBottom: '10px',
                      display: 'flex',
                      alignSelf: 'flex-start', // User messages aligned to the right
                      borderRadius: '6px',
                      maxWidth: '85%',
                    }}
                  >
                    <Box
                      backgroundColor="white"
                      w="35px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      borderRadius="45px"
                      h="35px"
                    >
                      <Image
                        src="/img/prompt-edge-logo.svg"
                        alt="Logo"
                        w="30px"
                        maxWidth="30px"
                      />
                    </Box>
                    <Box
                      style={{
                        padding: '0 10px',
                        borderRadius: '6px',
                        maxWidth: '70%',
                        textAlign: 'left', // Text always left-aligned
                        // color: entry.role === 'user' ? '#fff' : '#1B254B',
                      }}
                    >
                      {/* <Image src="/img/prompt-edge-logo.svg" alt="Logo" w="20px" mb="20px" maxWidth="20px" /> */}
                      <ReactMarkdown
                        className={RMstyle.reactMarkDown}
                        components={{
                          p: ({ node, ...props }) => (
                            <p {...props} /> // Adds space between paragraph and next element
                          ),
                          ul: ({ node, ...props }) => (
                            <ul {...props} /> // Adds space before the bullet list
                          ),
                          ol: ({ node, ...props }) => (
                            <ol {...props} /> // Adds space before the numbered list
                          ),
                          li: ({ node, ...props }) => <li {...props} />,
                        }}
                      >
                        {output?.response?.[0]?.content ?? ''}
                      </ReactMarkdown>
                    </Box>
                  </Box>
                </Flex>
              )}
              <div ref={bottomRef} />
            </Box>
          )}
        </Card>
      </Flex>
      <Modal
        isOpen={isCitationModalOpen}
        onClose={handleModalClose}
        size="lg"
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent bgColor={'white'}>
          <ModalHeader>Message Citations</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedCitations.length > 0 ? (
              <>
                {currentCitations.map((citation, index) => (
                  <p key={index} style={{ marginBottom: '1em' }}>
                    {citation}
                  </p>
                ))}
              </>
            ) : (
              <p>No citations available.</p>
            )}
          </ModalBody>
          <ModalFooter>
            <Flex justifyContent="space-between" width="100%">
              <IconButton
                aria-label="Previous Page"
                icon={<FiChevronLeft />}
                colorScheme="gray"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                isDisabled={currentPage === 1}
              />
              <Button
                bg={'#1c9cf4'}
                textColor={'white'}
                mr={3}
                onClick={handleModalClose}
              >
                Close
              </Button>
              <IconButton
                aria-label="Next Page"
                icon={<FiChevronRight />}
                colorScheme="gray"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                isDisabled={currentPage === totalPages}
              />
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
