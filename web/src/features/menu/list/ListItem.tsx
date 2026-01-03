import { Box, createStyles, Group, Progress, Stack, Text } from '@mantine/core';
import React, { forwardRef } from 'react';
import CustomCheckbox from './CustomCheckbox';
import type { MenuItem } from '../../../typings';
import { isIconUrl } from '../../../utils/isIconUrl';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import LibIcon from '../../../components/LibIcon';

interface Props {
  item: MenuItem;
  index: number;
  scrollIndex: number;
  checked: boolean;
}

const useStyles = createStyles((theme, params: { iconColor?: string }) => ({
  buttonContainer: {
    background: 'linear-gradient(135deg, rgba(32, 38, 52, 0.95) 0%, rgba(22, 26, 36, 0.95) 100%)',
    borderRadius: theme.radius.md,
    padding: 10,
    height: 72,
    scrollMargin: 10,
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 6px 14px rgba(0, 0, 0, 0.35)',
    transition: 'border-color 120ms ease, box-shadow 120ms ease, transform 120ms ease',
    '&:focus, &:hover': {
      borderColor: '#4dabf7',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(77, 171, 247, 0.35)',
      outline: 'none',
      transform: 'translateY(-1px)',
    },
  },
  iconImage: {
    maxWidth: 32,
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.35))',
  },
  buttonWrapper: {
    paddingLeft: 2,
    paddingRight: 6,
    height: '100%',
    alignItems: 'center',
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    borderRadius: 10,
    background: 'rgba(255, 255, 255, 0.05)',
  },
  icon: {
    fontSize: 22,
    color: params.iconColor || theme.white,
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
  },
  label: {
    color: 'rgba(255, 255, 255, 0.6)',
    textTransform: 'uppercase',
    fontSize: 11,
    verticalAlign: 'middle',
    letterSpacing: 0.6,
  },
  chevronIcon: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.65)',
  },
  scrollIndexValue: {
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'uppercase',
    fontSize: 13,
  },
  progressStack: {
    width: '100%',
    marginRight: 5,
  },
  progressLabel: {
    verticalAlign: 'middle',
    marginBottom: 3,
    color: theme.white,
    fontWeight: 600,
  },
  primaryText: {
    color: theme.white,
    fontSize: 15,
    fontWeight: 600,
  },
}));

const ListItem = forwardRef<Array<HTMLDivElement | null>, Props>(({ item, index, scrollIndex, checked }, ref) => {
  const { classes } = useStyles({ iconColor: item.iconColor });

  return (
    <Box
      tabIndex={index}
      className={classes.buttonContainer}
      key={`item-${index}`}
      ref={(element: HTMLDivElement) => {
        if (ref)
          // @ts-ignore i cba
          return (ref.current = [...ref.current, element]);
      }}
    >
      <Group spacing={15} noWrap className={classes.buttonWrapper}>
        {item.icon && (
          <Box className={classes.iconContainer}>
            {typeof item.icon === 'string' && isIconUrl(item.icon) ? (
              <img src={item.icon} alt="Missing image" className={classes.iconImage} />
            ) : (
              <LibIcon
                icon={item.icon as IconProp}
                className={classes.icon}
                fixedWidth
                animation={item.iconAnimation}
              />
            )}
          </Box>
        )}
        {Array.isArray(item.values) ? (
          <Group position="apart" w="100%">
            <Stack spacing={0} justify="space-between">
              <Text className={classes.label}>{item.label}</Text>
              <Text className={classes.primaryText}>
                {typeof item.values[scrollIndex] === 'object'
                  ? // @ts-ignore for some reason even checking the type TS still thinks it's a string
                    item.values[scrollIndex].label
                  : item.values[scrollIndex]}
              </Text>
            </Stack>
            <Group spacing={1} position="center">
              <LibIcon icon="chevron-left" className={classes.chevronIcon} />
              <Text className={classes.scrollIndexValue}>
                {scrollIndex + 1}/{item.values.length}
              </Text>
              <LibIcon icon="chevron-right" className={classes.chevronIcon} />
            </Group>
          </Group>
        ) : item.checked !== undefined ? (
          <Group position="apart" w="100%">
            <Text className={classes.primaryText}>{item.label}</Text>
            <CustomCheckbox checked={checked}></CustomCheckbox>
          </Group>
        ) : item.progress !== undefined ? (
          <Stack className={classes.progressStack} spacing={0}>
            <Text className={classes.progressLabel}>{item.label}</Text>
            <Progress
              value={item.progress}
              color={item.colorScheme || 'blue'}
              radius="md"
              styles={(theme) => ({
                root: { backgroundColor: 'rgba(255, 255, 255, 0.08)' },
                bar: { boxShadow: '0 2px 6px rgba(0,0,0,0.25)' },
              })}
            />
          </Stack>
        ) : (
          <Text className={classes.primaryText}>{item.label}</Text>
        )}
      </Group>
    </Box>
  );
});

export default React.memo(ListItem);
