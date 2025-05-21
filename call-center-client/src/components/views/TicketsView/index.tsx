import type { ReactNode } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { QueueListIcon } from '@heroicons/react/24/outline';
import type { QueuedTicket } from '@/types';
import {
  snakeToTitleCase,
  formatQueueTicketDate,
  parseLanguageRestrictions,
} from '@/utils';
import { AssignTicketDialog } from '@/components/AssignTicketDialog';
import type { AssignTicketDto } from '@/models';

/**
 * - Segregate task list by type: voice and text
 * - Display empty state if no tasks are in queue
 * - Allow the user to create a task from the view
 */

type TasksViewProps = {
  tickets: QueuedTicket[];
  onAssignNewTicket: (data: AssignTicketDto) => void;
};

export function TicketsView(props: TasksViewProps): ReactNode {
  const { tickets = [], onAssignNewTicket } = props;
  const { t } = useTranslation();
  const [isAssignTicketDialogOpen, setIsAssignTicketDialogOpen] =
    useState(false);
  const [filter, setFilter] = useState<'all' | 'voice' | 'text'>('all');

  const filtered = tickets.filter((t) => filter === 'all' || t.type === filter);

  const handleAssignTicketSubmit = (assignTicketData: AssignTicketDto) => {
    if (onAssignNewTicket) {
      onAssignNewTicket(assignTicketData);
    }
    setIsAssignTicketDialogOpen(false);
  };

  return (
    <section className="space-y-4 overflow-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{t('ticketsQueue.title')}</h2>
          <QueueListIcon className="w-4 h-4 ml-2" />
        </div>
        <span className="text-sm text-gray-600">
          {filtered.length} {t('ticketsQueue.queuedTickets')}
        </span>
      </div>

      <div className="flex gap-2">
        <Button
          className="cursor-pointer"
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          {t('ticketsQueue.allTickets')}
        </Button>
        <Button
          className="cursor-pointer"
          variant={filter === 'voice' ? 'default' : 'outline'}
          onClick={() => setFilter('voice')}
        >
          {t('ticketsQueue.voice')}
        </Button>
        <Button
          className="cursor-pointer"
          variant={filter === 'text' ? 'default' : 'outline'}
          onClick={() => setFilter('text')}
        >
          {t('ticketsQueue.text')}
        </Button>

        <div className="ml-auto">
          <Button
            className="mt-auto w-full cursor-pointer"
            variant="secondary"
            onClick={() => setIsAssignTicketDialogOpen(true)}
          >
            {t('assignTicket.title')}
          </Button>
          <AssignTicketDialog
            open={isAssignTicketDialogOpen}
            onOpenChange={setIsAssignTicketDialogOpen}
            onFormSubmit={handleAssignTicketSubmit}
          />
        </div>
      </div>

      <div className="max-h-64 overflow-y-auto">
        <ul className="divide-y divide-gray-200">
          {filtered.length === 0 ? (
            <p className="text-sm text-gray-500">
              {t('ticketsQueue.noTickets')}
            </p>
          ) : (
            filtered.map((ticket) => (
              <li key={ticket.ticketId} className="py-2 px-4 hover:bg-gray-100">
                <div className="flex justify-between min-w-0">
                  <span className="font-medium mr-2 shrink-0">
                    {ticket.ticketId.slice(-8)}
                  </span>
                  <div className="overflow-x-auto whitespace-nowrap text-sm text-gray-600 ml-auto">
                    <span className="mr-2">
                      [{parseLanguageRestrictions(ticket.restrictions)}]
                    </span>
                    <span className="mx-1">|</span>
                    <span className="mr-2">
                      {snakeToTitleCase(ticket.platform)}
                    </span>
                    <span className="mx-1">|</span>
                    <span>{formatQueueTicketDate(ticket.createdAt)}</span>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  );
}
