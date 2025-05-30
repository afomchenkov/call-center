import type { ReactNode } from 'react';
import { Controller } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import { toDashedLowerCase } from '@/utils';

/**
 * Example:
 * 
 * <DateField
 *         name="date"
 *         label="Date"
 *         control={control}
 *         rules={{
 *           required: {
 *             value: true,
 *             message: "Date is required",
 *           },
 *           validate: (date: string) => {
 *             const [year] = date.split("-");
 *             if (year.length > 4) {
 *               return "Year value is invalid";
 *             }
 *             if (isDateInPast(date)) {
 *               return "Date cannot be in the past";
 *             }
 *           },
 *         }}
 *       />
 */

type DateFieldType = (props: {
  name: string;
  label: string;
  control: Control;
  // eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
  rules?: Object;
}) => ReactNode;

export const DateField: DateFieldType = ({ name, label, control, rules }) => {
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
            <label htmlFor={`form-date-field-${componentId}`}>{label}</label>
            <input
              id={`form-date-field-${componentId}`}
              className={`${hasError ? 'is-invalid' : ''}`}
              type="date"
              {...field}
            />
            {hasError && <small>{fieldState?.error?.message}</small>}
          </div>
        );
      }}
    />
  );
};
