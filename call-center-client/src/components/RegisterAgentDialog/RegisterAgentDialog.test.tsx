import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { RegisterAgentDialog } from './';

/**
 * @vitest-environment jsdom
 */

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('RegisterAgentDialog', () => {
  const setup = () => {
    const onFormSubmit = vi.fn();
    const onOpenChange = vi.fn();

    render(
      <MemoryRouter>
        <RegisterAgentDialog open={true} onFormSubmit={onFormSubmit} onOpenChange={onOpenChange} />
      </MemoryRouter>,
    );

    return { onFormSubmit, onOpenChange };
  };

  it('should render dialog with inputs and buttons', () => {
    setup();

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Agent name')).toBeInTheDocument();
    expect(screen.getByText('registerAgent.register')).toBeInTheDocument();
    expect(screen.getByText('common.cancel')).toBeInTheDocument();
  });

  it('should call onOpenChange(false) when cancel button is clicked', () => {
    const { onOpenChange } = setup();
    fireEvent.click(screen.getByText('common.cancel'));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
