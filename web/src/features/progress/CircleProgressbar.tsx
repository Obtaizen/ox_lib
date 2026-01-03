import React from 'react';
import {createStyles, keyframes, Stack, Text} from '@mantine/core';
import {useNuiEvent} from '../../hooks/useNuiEvent';
import {fetchNui} from '../../utils/fetchNui';
import ScaleFade from '../../transitions/ScaleFade';
import type {CircleProgressbarProps} from '../../typings';

// Animate the stroke around the square perimeter (similar to the old circle dasharray)
const perimeter = 2 * (64 + 64); // based on rect size below
const progressSquareStroke = keyframes({
  '0%': { strokeDasharray: `0, ${perimeter}` },
  '100%': { strokeDasharray: `${perimeter}, 0` },
});

const useStyles = createStyles((theme, params: { position: 'middle' | 'bottom'; duration: number }) => ({
  container: {
    width: '100%',
    height: params.position === 'middle' ? '100%' : '20%',
    bottom: 0,
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progress: {
    position: 'relative',
    width: 72,
    height: 72,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: 12,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.45)',
  },
  svg: {
    width: '100%',
    height: '100%',
    transform: 'rotate(-90deg)', // start from top and go clockwise
    filter: 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.8))',
  },
  track: {
    stroke: 'rgba(255, 255, 255, 0.45)',
    strokeWidth: 6,
    fill: 'transparent',
    strokeLinejoin: 'round',
    rx: 10,
    ry: 10,
  },
  stroke: {
    stroke: '#fff',
    strokeWidth: 6,
    fill: 'transparent',
    strokeLinejoin: 'round',
    rx: 10,
    ry: 10,
    animation: `${progressSquareStroke} linear forwards`,
    animationDuration: `${params.duration}ms`,
  },
  value: {
    position: 'absolute',
    inset: 0,
    textAlign: 'center',
    fontFamily: 'Roboto Mono',
    fontWeight: 700,
    letterSpacing: 1,
    textShadow: '1px 1px 2px #0b0d11, -1px -1px 2px #0b0d11, 0 0 6px rgba(0,0,0,0.65)',
    color: 'var(--ox-text-strong)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    textAlign: 'left',
    fontWeight: 700,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    textShadow: '1px 1px 0 #0b0d11',
    color: 'var(--ox-text-strong)',
    height: 25,
  },
  wrapper: {
    marginTop: params.position === 'middle' ? 25 : undefined,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
}));

const CircleProgressbar: React.FC = () => {
  const [visible, setVisible] = React.useState(false);
  const [progressDuration, setProgressDuration] = React.useState(0);
  const [position, setPosition] = React.useState<'middle' | 'bottom'>('middle');
  const [value, setValue] = React.useState(0);
  const [label, setLabel] = React.useState('');
  const { classes } = useStyles({ position, duration: progressDuration });

  useNuiEvent('progressCancel', () => {
    setValue(99);
    setVisible(false);
  });

  useNuiEvent<CircleProgressbarProps>('circleProgress', (data) => {
    if (visible) return;
    setVisible(true);
    setValue(0);
    setLabel(data.label || '');
    setProgressDuration(data.duration);
    setPosition(data.position || 'middle');
    const onePercent = data.duration * 0.01;
    const updateProgress = setInterval(() => {
      setValue((previousValue) => {
        const newValue = previousValue + 1;
        newValue >= 100 && clearInterval(updateProgress);
        return newValue;
      });
    }, onePercent);
  });

  return (
    <>
      <Stack spacing={0} className={classes.container}>
        <ScaleFade visible={visible} onExitComplete={() => fetchNui('progressComplete')}>
          <div className={classes.wrapper}>
            <div className={classes.progress}>
              <svg viewBox="0 0 72 72" className={classes.svg} onAnimationEnd={() => setVisible(false)}>
                <rect x="4" y="4" width="64" height="64" className={classes.track} />
                <rect x="4" y="4" width="64" height="64" className={classes.stroke} />
              </svg>
              <Text className={classes.value}>{value}%</Text>
            </div>
            {label && <Text className={classes.label}>{label}</Text>}
          </div>
        </ScaleFade>
      </Stack>
    </>
  );
};

export default CircleProgressbar;
