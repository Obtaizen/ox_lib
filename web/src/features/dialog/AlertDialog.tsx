import { Box, Button, createStyles, Group, Modal, Stack, useMantineTheme } from '@mantine/core';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import { useLocales } from '../../providers/LocaleProvider';
import remarkGfm from 'remark-gfm';
import type { AlertProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';

const useStyles = createStyles((theme) => ({
  contentStack: {
    color: theme.colors.dark[2],
  },
  shell: {
    position: 'relative',
    padding: 16,
    borderRadius: theme.radius.md,
    background: 'var(--ox-card)',
    border: `1px solid var(--ox-card-border)`,
    boxShadow: 'var(--ox-card-shadow)',
    overflow: 'hidden',
  },
  accent: {
    display: 'none',
  },
  header: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: 800,
    color: '#f7f9fd',
    marginBottom: 6,
    textShadow: '0 1px 2px rgba(0,0,0,0.35)',
  },
}));

const AlertDialog: React.FC = () => {
  const { locale } = useLocales();
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const [dialogData, setDialogData] = useState<AlertProps>({
    header: '',
    content: '',
  });

  const closeAlert = (button: string) => {
    setOpened(false);
    fetchNui('closeAlert', button);
  };

  useNuiEvent('sendAlert', (data: AlertProps) => {
    setDialogData(data);
    setOpened(true);
  });

  useNuiEvent('closeAlertDialog', () => {
    setOpened(false);
  });

  return (
    <>
      <Modal
        opened={opened}
        centered={dialogData.centered}
        size={dialogData.size || 'md'}
        overflow={dialogData.overflow ? 'inside' : 'outside'}
        closeOnClickOutside={false}
        onClose={() => {
          setOpened(false);
          closeAlert('cancel');
        }}
        withCloseButton={false}
        overlayOpacity={0.5}
        exitTransitionDuration={150}
        transition="fade"
        styles={{
          modal: { background: 'transparent', boxShadow: 'none' },
          body: { padding: 0 },
          title: { display: 'none' },
          header: { display: 'none' },
        }}
        title={null}
      >
        <Box className={classes.shell}>
          <Box className={classes.accent} />
          <div className={classes.header}>
            <ReactMarkdown components={MarkdownComponents}>{dialogData.header}</ReactMarkdown>
          </div>
          <Stack className={classes.contentStack}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                ...MarkdownComponents,
                img: ({ ...props }) => <img style={{ maxWidth: '100%', maxHeight: '100%' }} {...props} />,
              }}
            >
              {dialogData.content}
            </ReactMarkdown>
          </Stack>
          <Group position="right" spacing={10} mt={12}>
            {dialogData.cancel && (
              <Button variant="default" onClick={() => closeAlert('cancel')} mr={3}>
                {dialogData.labels?.cancel || locale.ui.cancel}
              </Button>
            )}
            <Button
              variant={dialogData.cancel ? 'light' : 'default'}
              color={dialogData.cancel ? theme.primaryColor : undefined}
              onClick={() => closeAlert('confirm')}
            >
              {dialogData.labels?.confirm || locale.ui.confirm}
            </Button>
          </Group>
        </Box>
      </Modal>
    </>
  );
};

export default AlertDialog;
