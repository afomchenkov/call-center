import type { ReactNode } from 'react';
import { Controller } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import { toDashedLowerCase } from '@/utils';

type TextFieldType = (props: {
  name: string;
  label: string;
  control: Control;
  // eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
  rules?: Object;
}) => ReactNode;

export const TextField: TextFieldType = ({ name, label, control, rules }) => {
  const componentId = toDashedLowerCase(label);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => {
        const hasError = Boolean(fieldState.error);

        return (
          <div>
            <label htmlFor={`form-text-field-${componentId}`}>{label}</label>
            <input
              id={`form-text-field-${componentId}`}
              className={`${hasError ? 'is-invalid' : ''}`}
              type="text"
              {...field}
            />
            {hasError && <small>{fieldState?.error?.message}</small>}
          </div>
        );
      }}
    />
  );
};
