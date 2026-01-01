import { Box, Button, createStyles, Group, Modal, Stack } from '@mantine/core';
import React from 'react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { useLocales } from '../../providers/LocaleProvider';
import { fetchNui } from '../../utils/fetchNui';
import type { InputProps } from '../../typings';
import { OptionValue } from '../../typings';
import InputField from './components/fields/input';
import CheckboxField from './components/fields/checkbox';
import SelectField from './components/fields/select';
import NumberField from './components/fields/number';
import SliderField from './components/fields/slider';
import { useFieldArray, useForm } from 'react-hook-form';
import ColorField from './components/fields/color';
import DateField from './components/fields/date';
import TextareaField from './components/fields/textarea';
import TimeField from './components/fields/time';
import dayjs from 'dayjs';

export type FormValues = {
  test: {
    value: any;
  }[];
};

const useStyles = createStyles((theme) => ({
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
  title: {
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: 800,
    color: '#f7f9fd',
    marginBottom: 4,
    textShadow: '0 1px 2px rgba(0,0,0,0.45)',
  },
  footer: {
    marginTop: 6,
  },
  fieldBlock: {
    padding: '8px 10px',
    borderRadius: theme.radius.sm,
    background: 'rgba(255,255,255,0.02)',
    border: `1px solid rgba(255,255,255,0.06)`,
  },
}));

const InputDialog: React.FC = () => {
  const { classes } = useStyles();
  const [fields, setFields] = React.useState<InputProps>({
    heading: '',
    rows: [{ type: 'input', label: '' }],
  });
  const [visible, setVisible] = React.useState(false);
  const { locale } = useLocales();

  const form = useForm<{ test: { value: any }[] }>({});
  const fieldForm = useFieldArray({
    control: form.control,
    name: 'test',
  });

  useNuiEvent<InputProps>('openDialog', (data) => {
    setFields(data);
    setVisible(true);
    data.rows.forEach((row, index) => {
      fieldForm.insert(index, {
  value:
    (row.type !== 'checkbox'
      ? row.type === 'date' || row.type === 'date-range' || row.type === 'time'
        ? // Set date to current one if default is set to true
          row.default === true
          ? new Date().getTime()
          : Array.isArray(row.default)
          ? row.default.map((date) => new Date(date).getTime())
          : row.default && new Date(row.default).getTime()
        : row.default
      : row.checked) ?? null,
});
      // Backwards compat with new Select data type
      if (row.type === 'select' || row.type === 'multi-select') {
        row.options = row.options.map((option) =>
          !option.label ? { ...option, label: option.value } : option
        ) as Array<OptionValue>;
      }
    });
  });

  useNuiEvent('closeInputDialog', async () => await handleClose(true));

  const handleClose = async (dontPost?: boolean) => {
    setVisible(false);
    await new Promise((resolve) => setTimeout(resolve, 200));
    form.reset();
    fieldForm.remove();
    if (dontPost) return;
    fetchNui('inputData');
  };

  const onSubmit = form.handleSubmit(async (data) => {
    setVisible(false);
    const values: any[] = [];
    for (let i = 0; i < fields.rows.length; i++) {
      const row = fields.rows[i];

      if ((row.type === 'date' || row.type === 'date-range') && row.returnString) {
        if (!data.test[i]) continue;
        data.test[i].value = dayjs(data.test[i].value).format(row.format || 'DD/MM/YYYY');
      }
    }
    Object.values(data.test).forEach((obj: { value: any }) => values.push(obj.value));
    await new Promise((resolve) => setTimeout(resolve, 200));
    form.reset();
    fieldForm.remove();
    fetchNui('inputData', values);
  });

  return (
    <>
      <Modal
        opened={visible}
        onClose={handleClose}
        centered
        closeOnEscape={fields.options?.allowCancel !== false}
        closeOnClickOutside={false}
        size={fields.options?.size || 'xs'}
        styles={{
          modal: { background: 'transparent', boxShadow: 'none' },
          body: { padding: 0 },
          title: { display: 'none' },
          header: { display: 'none' },
        }}
        title={null}
        withCloseButton={false}
        overlayOpacity={0.5}
        transition="fade"
        exitTransitionDuration={150}
      >
        <form onSubmit={onSubmit}>
          <Box className={classes.shell}>
            <Box className={classes.accent} />
            {fields.heading && <div className={classes.title}>{fields.heading}</div>}
            <Stack spacing={8}>
            {fieldForm.fields.map((item, index) => {
              const row = fields.rows[index];
              return (
                <React.Fragment key={item.id}>
                  {row.type === 'input' && (
                    <div className={classes.fieldBlock}>
                      <InputField
                        register={form.register(`test.${index}.value`, { required: row.required })}
                        row={row}
                        index={index}
                      />
                    </div>
                  )}
                  {row.type === 'checkbox' && (
                    <div className={classes.fieldBlock}>
                      <CheckboxField
                        register={form.register(`test.${index}.value`, { required: row.required })}
                        row={row}
                        index={index}
                      />
                    </div>
                  )}
                  {(row.type === 'select' || row.type === 'multi-select') && (
                    <div className={classes.fieldBlock}>
                      <SelectField row={row} index={index} control={form.control} />
                    </div>
                  )}
                  {row.type === 'number' && (
                    <div className={classes.fieldBlock}>
                      <NumberField control={form.control} row={row} index={index} />
                    </div>
                  )}
                  {row.type === 'slider' && (
                    <div className={classes.fieldBlock}>
                      <SliderField control={form.control} row={row} index={index} />
                    </div>
                  )}
                  {row.type === 'color' && (
                    <div className={classes.fieldBlock}>
                      <ColorField control={form.control} row={row} index={index} />
                    </div>
                  )}
                  {row.type === 'time' && (
                    <div className={classes.fieldBlock}>
                      <TimeField control={form.control} row={row} index={index} />
                    </div>
                  )}
                  {row.type === 'date' || row.type === 'date-range' ? (
                    <div className={classes.fieldBlock}>
                      <DateField control={form.control} row={row} index={index} />
                    </div>
                  ) : null}
                  {row.type === 'textarea' && (
                    <div className={classes.fieldBlock}>
                      <TextareaField
                        register={form.register(`test.${index}.value`, { required: row.required })}
                        row={row}
                        index={index}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
            <Group position="right" spacing={10} className={classes.footer}>
              <Button
                variant="default"
                onClick={() => handleClose()}
                mr={3}
                disabled={fields.options?.allowCancel === false}
              >
                {locale.ui.cancel}
              </Button>
              <Button variant="filled" color="accent" type="submit">
                {locale.ui.confirm}
              </Button>
            </Group>
          </Stack>
          </Box>
        </form>
      </Modal>
    </>
  );
};

export default InputDialog;
