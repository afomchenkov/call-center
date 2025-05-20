import type { ReactNode } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { QueueListIcon, PlusIcon } from '@heroicons/react/24/outline';

/**
 * - Segregate task list by type: voice and text
 * - Display empty state if no tasks are in queue
 * - Allow the user to create a task from the view
 */

type QueuedTicket = {
  id: string;
  type: 'voice' | 'text';
  platform: string;
};

type TasksViewProps = {
  tickets: QueuedTicket[];
};

export function TicketsView({ tickets = [] }: TasksViewProps): ReactNode {
  const [filter, setFilter] = useState<'all' | 'voice' | 'text'>('all');

  const filtered = tickets.filter((t) => filter === 'all' || t.type === filter);

  const { t } = useTranslation();

  return (
    <section className="space-y-4">
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
          <Button variant="outline" size="icon" className="cursor-pointer">
            <PlusIcon />
          </Button>
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
              <li key={ticket.id} className="py-2 px-4 flex justify-between">
                <span className="font-medium">{ticket.id}</span>
                <span className="text-sm text-gray-600">{ticket.platform}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  );
}
