'use client';
// Chakra imports
import { Flex, useColorModeValue, Image } from '@chakra-ui/react';
import { HSeparator } from '@/components/separator/Separator';

export function SidebarBrand() {
  //   Chakra color mode
  let logoColor = useColorModeValue('navy.700', 'white');

  return (
    <Flex alignItems="center" flexDirection="column">
      <Image src="/img/logo-.png" alt="Logo" w="120px" mb="20px" maxWidth="120px" />
      <HSeparator mb="20px" w="284px" />
    </Flex>
  );
}

export default SidebarBrand;
