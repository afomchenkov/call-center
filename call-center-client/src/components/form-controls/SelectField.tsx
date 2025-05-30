import type { ReactNode } from 'react';
import { Controller } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import { toDashedLowerCase } from '@/utils';

type SelectFieldType = (props: {
  name: string;
  label: string;
  control: Control;
  // eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
  rules?: Object;
  options: { label: string; value: string }[];
}) => ReactNode;

export const SelectField: SelectFieldType = ({
  name,
  label,
  control,
  rules,
  options,
}) => {
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
            <label htmlFor={`form-select-field-${componentId}`}>{label}</label>
            <select
              id={`form-select-field-${componentId}`}
              className={`${hasError ? 'is-invalid' : ''}`}
              {...field}
            >
              <option value="-1">Select</option>
              {options.map(({ label, value }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {hasError && <small>{fieldState?.error?.message}</small>}
          </div>
        );
      }}
    />
  );
};
