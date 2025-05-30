import type { ReactNode } from 'react';
import { Controller } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import { toDashedLowerCase } from '@/utils';

/**
 * Example
 * 
 * <NumberField
 *         name="value"
 *         label="Value"
 *         control={control}
 *         rules={{
 *           required: {
 *             value: true,
 *             message: "Value is required",
 *           },
 *           min: {
 *             value: 0.1,
 *             message: "Value must be greater than 0",
 *           },
 *           max: {
 *             value: 1000000,
 *             message: "Value value must be less than 1000000",
 *           },
 *           validate: (value: string) => {
 *             const intValue = parseInt(value);
 * 
 *             if (isNaN(intValue)) {
 *               return "Value is not a number";
 *             }
 *             
 *             return intValue;
 *           },
 *         }}
 *       />
 */

type NumberFieldType = (props: {
  name: string;
  label: string;
  control: Control;
  // eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
  rules?: Object;
}) => ReactNode;

export const NumberField: NumberFieldType = ({
  name,
  label,
  control,
  rules,
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
            <label htmlFor={`form-number-field-${componentId}`}>{label}</label>
            <input
              id={`form-number-field-${componentId}`}
              className={`${hasError ? 'is-invalid' : ''}`}
              type="number"
              {...field}
            />
            {hasError && <small>{fieldState?.error?.message}</small>}
          </div>
        );
      }}
    />
  );
};
