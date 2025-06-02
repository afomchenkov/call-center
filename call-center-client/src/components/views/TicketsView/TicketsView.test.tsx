import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { TicketsView } from './';
import { QueueItemModel } from '@/models';
import type { QueuedTicket } from '@/types';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('@/utils', () => ({
  snakeToTitleCase: (str: string) => str.toUpperCase(),
  formatQueueTicketDate: (date: string) => `formatted-${date}`,
  parseLanguageRestrictions: (restrictions: string[]) => restrictions.join(','),
}));

vi.mock('@/components/AssignTicketDialog', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  AssignTicketDialog: ({ open, onOpenChange, onFormSubmit }: any) => {
    if (!open) return null;
    return (
      <div data-testid='assign-ticket-dialog'>
        <button data-testid='submit-assign-ticket' onClick={() => onFormSubmit({ ticketId: 'test-id' })}>
          Submit
        </button>
        <button data-testid='close-dialog' onClick={() => onOpenChange(false)}>
          Close
        </button>
      </div>
    );
  },
}));

const queueItem1 = new QueueItemModel(1, 1, '12345678ABCDEFGH', 'mobile_app', ['en', 'fr'], true, new Date().getTime());
const queuedTicket1 = { ...queueItem1, type: 'voice' };

const queueItem2 = new QueueItemModel(2, 2, 'ABCDEFGH12345678', 'web_chat', ['es'], false, new Date().getTime());
const queuedTicket2 = { ...queueItem2, type: 'text' };

const sampleTickets = [queuedTicket1, queuedTicket2];

describe('TicketsView', () => {
  it('should render title, icon and ticket count', () => {
    render(<TicketsView tickets={sampleTickets as QueuedTicket[]} onAssignNewTicket={() => {}} />);

    expect(screen.getByText('ticketsQueue.title')).toBeInTheDocument();
    expect(screen.getByText(`${sampleTickets.length} ticketsQueue.queuedTickets`)).toBeInTheDocument();
  });

  it('should filter tickets by type when filter buttons clicked', () => {
    render(<TicketsView tickets={sampleTickets as QueuedTicket[]} onAssignNewTicket={() => {}} />);

    expect(screen.getAllByRole('listitem').length).toBe(2);
    fireEvent.click(screen.getByText('ticketsQueue.voice'));
    expect(screen.getAllByRole('listitem').length).toBe(1);
    expect(screen.getByText(sampleTickets[0].ticketId.slice(-8))).toBeInTheDocument();

    fireEvent.click(screen.getByText('ticketsQueue.text'));
    expect(screen.getAllByRole('listitem').length).toBe(1);
    expect(screen.getByText(sampleTickets[1].ticketId.slice(-8))).toBeInTheDocument();
    fireEvent.click(screen.getByText('ticketsQueue.allTickets'));
    expect(screen.getAllByRole('listitem').length).toBe(2);
  });

  it('should display no tickets message when filtered list is empty', () => {
    render(<TicketsView tickets={[]} onAssignNewTicket={() => {}} />);

    expect(screen.getByText('ticketsQueue.noTickets')).toBeInTheDocument();
  });

  it('opens assign ticket dialog when button clicked and submits form', async () => {
    const onAssignNewTicket = vi.fn();

    render(<TicketsView tickets={sampleTickets as QueuedTicket[]} onAssignNewTicket={onAssignNewTicket} />);

    expect(screen.queryByTestId('assign-ticket-dialog')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('assignTicket.title'));
    expect(screen.getByTestId('assign-ticket-dialog')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('submit-assign-ticket'));

    await waitFor(() => {
      expect(onAssignNewTicket).toHaveBeenCalledTimes(1);
      expect(onAssignNewTicket).toHaveBeenCalledWith({ ticketId: 'test-id' });
    });

    expect(screen.queryByTestId('assign-ticket-dialog')).not.toBeInTheDocument();
  });

  it('should close assign ticket dialog when close button clicked', () => {
    render(<TicketsView tickets={sampleTickets as QueuedTicket[]} onAssignNewTicket={() => {}} />);

    fireEvent.click(screen.getByText('assignTicket.title'));
    expect(screen.getByTestId('assign-ticket-dialog')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('close-dialog'));
    expect(screen.queryByTestId('assign-ticket-dialog')).not.toBeInTheDocument();
  });
});
