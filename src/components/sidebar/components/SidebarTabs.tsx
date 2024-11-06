import { Button, Flex, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React from 'react';

type Tab = {
  icon?: JSX.Element | string;
  label: string;
  to?: string;
};

type SidebarTabsProps = {
  index?: number;
  onChange: (index: number) => void;
  tabs: Tab[];
};

const SidebarTabs = ({ index, onChange, tabs }: SidebarTabsProps) => {
  const router = useRouter();
  return (
    <Flex direction="column" alignItems="start">
      {tabs?.map((tab, idx) => (
        <Flex width="100%" key={idx} direction="row">
          <Button
            display="flex"
            flexDirection="column"
            alignItems="center"
            fontSize={'sm'}
            fontWeight="600"
            my="8px"
            width="100%"
            minH="60px"
            padding="4px"
            colorScheme="blue"
            size="lg"
            borderRadius="6px"
            textColor={{ base: 'blue.400', lg: 'white' }}
            variant="ghost"
            _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
            onClick={() => {
              onChange(idx);
              if (tab.to) {
                router.push(tab.to);
              }
            }}
          >
            {tab.icon}
            <Text>{tab.label}</Text>
          </Button>
        </Flex>
      ))}
    </Flex>
  );
};

export default SidebarTabs;
