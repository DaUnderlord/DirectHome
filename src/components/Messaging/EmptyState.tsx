import React, { ReactNode } from 'react';
import { Box, Stack, Text, Title, useMantineTheme } from '@mantine/core';
import { 
  IconMessage, 
  IconMessageOff, 
  IconSearch, 
  IconX 
} from '@tabler/icons-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon: 'message' | 'search' | 'error' | 'empty';
  action?: ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  description, 
  icon, 
  action 
}) => {
  const theme = useMantineTheme();
  
  // Get icon component based on type
  const getIcon = () => {
    switch (icon) {
      case 'message':
        return <IconMessage size={48} color={theme.colors.blue[3]} />;
      case 'search':
        return <IconSearch size={48} color={theme.colors.yellow[4]} />;
      case 'error':
        return <IconX size={48} color={theme.colors.red[5]} />;
      case 'empty':
        return <IconMessageOff size={48} color={theme.colors.gray[5]} />;
      default:
        return <IconMessage size={48} color={theme.colors.blue[3]} />;
    }
  };
  
  return (
    <Box p="xl" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Stack align="center" gap="md">
        {getIcon()}
        <Title order={3}>{title}</Title>
        <Text c="dimmed" ta="center" maw={400}>
          {description}
        </Text>
        {action && <Box mt="md">{action}</Box>}
      </Stack>
    </Box>
  );
};

export default EmptyState;