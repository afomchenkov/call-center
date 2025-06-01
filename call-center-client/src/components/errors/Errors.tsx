import type { ReactNode } from 'react';
import type { GenericErrors } from '@/types';

type ErrorsProps = { errors: GenericErrors };

export function Errors({ errors }: ErrorsProps): ReactNode {
  return (
    <ul className="error-messages">
      {Object.entries(errors).map(([field, fieldErrors]) =>
        fieldErrors.map((fieldError) => (
          <li key={field + fieldError}>
            {field} {fieldError}
          </li>
        ))
      )}
    </ul>
  );
}
