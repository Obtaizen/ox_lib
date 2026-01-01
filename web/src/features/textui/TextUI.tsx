import React from 'react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { Box, createStyles, Group } from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import ScaleFade from '../../transitions/ScaleFade';
import remarkGfm from 'remark-gfm';
import type { TextUiPosition, TextUiProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';
import LibIcon from '../../components/LibIcon';
import { isIconUrl } from '../../utils/isIconUrl';

const useStyles = createStyles((theme, params: { position?: TextUiPosition }) => ({
  wrapper: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 
      params.position === 'top-center' ? 'baseline' :
      params.position === 'bottom-center' ? 'flex-end' : 'center',
    justifyContent: 
      params.position === 'right-center' ? 'flex-end' :
      params.position === 'left-center' ? 'flex-start' : 'center',
  },
  container: {
    fontSize: 16,
    padding: 14,
    margin: 8,
    background: 'var(--ox-card)',
    color: '#f7f9fd',
    fontFamily: 'Space Grotesk, Roboto Condensed, Roboto, Helvetica Neue, Arial, sans-serif',
    borderRadius: theme.radius.sm,
    boxShadow: 'var(--ox-card-shadow)',
    border: `1px solid var(--ox-card-border)`,
    position: 'relative',
    overflow: 'hidden',
    textShadow: '0 1px 2px rgba(0,0,0,0.35)',
    display: 'flex',
    alignItems: 'center',
  },
  accent: {
    display: 'none',
  },
  separator: {
    width: 1,
    height: 20,
    background: 'rgba(255,255,255,0.1)',
    margin: '0 12px',
  },
  letterIcon: {
    width: 26,
    height: 26,
    borderRadius: 999,
    background: '#f7f9fd',
    color: '#0d1016',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: 14,
    boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
  },
  letterText: {
    lineHeight: 1,
  },
}));

const TextUI: React.FC = () => {
  const [data, setData] = React.useState<TextUiProps>({
    text: '',
    position: 'right-center',
  });
  const [visible, setVisible] = React.useState(false);
  const { classes } = useStyles({ position: data.position });

  useNuiEvent<TextUiProps>('textUi', (data) => {
    if (!data.position) data.position = 'right-center'; // Default right position
    setData(data);
    setVisible(true);
  });

  useNuiEvent('textUiHide', () => setVisible(false));

  return (
    <>
      <Box className={classes.wrapper}>
        <ScaleFade visible={visible}>
          <Box style={data.style} className={classes.container}>
            <Group spacing={12}>
              {data.icon && (
                <>
                  {typeof data.icon === 'string' && !isIconUrl(data.icon) && data.icon.length <= 2 ? (
                    <div className={classes.letterIcon}>
                      <span className={classes.letterText}>{data.icon.slice(0, 1).toUpperCase()}</span>
                    </div>
                  ) : (
                    <LibIcon
                      icon={data.icon}
                      fixedWidth
                      size="lg"
                      animation={data.iconAnimation}
                      style={{
                        color: data.iconColor,
                        alignSelf: !data.alignIcon || data.alignIcon === 'center' ? 'center' : 'start',
                      }}
                    />
                  )}
                </>
              )}
              <div className={classes.separator} />
              <ReactMarkdown components={MarkdownComponents} remarkPlugins={[remarkGfm]}>
                {data.text}
              </ReactMarkdown>
            </Group>
          </Box>
        </ScaleFade>
      </Box>
    </>
  );
};

export default TextUI;
