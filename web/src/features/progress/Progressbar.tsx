import React from 'react';
import { Box, createStyles, Text } from '@mantine/core';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import ScaleFade from '../../transitions/ScaleFade';
import type { ProgressbarProps } from '../../typings';

const useStyles = createStyles((theme) => ({
  container: {
    width: 320,
    height: 28,
    borderRadius: theme.radius.xs,
    backgroundColor: 'var(--ox-track)',
    border: `1px solid var(--ox-track-edge)`,
    boxShadow: 'var(--ox-shadow)',
    overflow: 'hidden',
    position: 'relative',
  },
  wrapper: {
    width: '100%',
    height: '20%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
    position: 'absolute',
  },
  bar: {
    height: '100%',
    width: '100%',
    backgroundColor: 'var(--ox-fill)',
    boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.65)',
    position: 'absolute',
    inset: 0,
  },
  labelWrapper: {
    position: 'absolute',
    display: 'flex',
    inset: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    pointerEvents: 'none',
  },
  label: {
    maxWidth: 290,
    padding: '4px 10px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontSize: 16,
    fontWeight: 800,
    letterSpacing: 1,
    color: 'var(--ox-text-strong)',
    textTransform: 'uppercase',
    textShadow:
      '1px 1px 0 #0b0d11, -1px -1px 0 #0b0d11, -1px 1px 0 #0b0d11, 1px -1px 0 #0b0d11, 0 0 4px rgba(0,0,0,0.35)',
  },
}));

const Progressbar: React.FC = () => {
  const { classes } = useStyles();
  const [visible, setVisible] = React.useState(false);
  const [label, setLabel] = React.useState('');
  const [duration, setDuration] = React.useState(0);

  useNuiEvent('progressCancel', () => setVisible(false));

  useNuiEvent<ProgressbarProps>('progress', (data) => {
    setVisible(true);
    setLabel(data.label);
    setDuration(data.duration);
  });

  return (
    <>
      <Box className={classes.wrapper}>
        <ScaleFade visible={visible} onExitComplete={() => fetchNui('progressComplete')}>
          <Box className={classes.container}>
            <Box
              className={classes.bar}
              onAnimationEnd={() => setVisible(false)}
              sx={{
                animation: 'progress-bar linear',
                animationDuration: `${duration}ms`,
                animationFillMode: 'forwards',
              }}
            />
            <Box className={classes.labelWrapper}>
              <Text className={classes.label}>{label}</Text>
            </Box>
          </Box>
        </ScaleFade>
      </Box>
    </>
  );
};

export default Progressbar;
