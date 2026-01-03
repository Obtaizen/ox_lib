import { Box, createStyles, Text } from '@mantine/core';
import React from 'react';

const useStyles = createStyles((theme) => ({
  container: {
    textAlign: 'center',
    borderTopLeftRadius: theme.radius.md,
    borderTopRightRadius: theme.radius.md,
    background: 'linear-gradient(135deg, #141824 0%, #1e2434 100%)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    height: 64,
    width: 410,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.45)',
  },
  heading: {
    fontSize: 22,
    textTransform: 'uppercase',
    fontWeight: 700,
    letterSpacing: 1.5,
    color: '#f5f7fb',
  },
}));

const Header: React.FC<{ title: string }> = ({ title }) => {
  const { classes } = useStyles();

  return (
    <Box className={classes.container}>
      <Text className={classes.heading}>{title}</Text>
    </Box>
  );
};

export default React.memo(Header);
