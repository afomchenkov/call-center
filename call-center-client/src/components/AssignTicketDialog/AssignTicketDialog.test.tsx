import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AssignTicketDialog } from './';

/**
 * @vitest-environment jsdom
 */

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('AssignTicketDialog', () => {
  it('should render dialog when open is true', () => {
    const handleOpenChange = vi.fn();
    const handleSubmit = vi.fn();

    render(
      <MemoryRouter>
        <AssignTicketDialog open={true} onOpenChange={handleOpenChange} onFormSubmit={handleSubmit} />
      </MemoryRouter>,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('assignTicket.title')).toBeInTheDocument();
    expect(screen.getByText('assignTicket.description')).toBeInTheDocument();
    expect(screen.getByText('assignTicket.platform')).toBeInTheDocument();
    expect(screen.getByText('assignTicket.restrictions')).toBeInTheDocument();
    expect(screen.getByText('common.submit')).toBeInTheDocument();
    expect(screen.getByText('common.cancel')).toBeInTheDocument();
  });

  it('should call onOpenChange when Cancel is clicked', () => {
    const handleOpenChange = vi.fn();
    const handleSubmit = vi.fn();

    render(
      <MemoryRouter>
        <AssignTicketDialog open={true} onOpenChange={handleOpenChange} onFormSubmit={handleSubmit} />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText('common.cancel'));
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });
});
