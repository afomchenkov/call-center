import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  PresentationChartBarIcon,
  ReceiptRefundIcon,
} from '@heroicons/react/24/outline';

/**
 * - Displays:
 *    - Number of active calls, messages, and completed tasks
 *    - Total tickets in queue
 *    - Agent workload and task distribution
 */

type QueuedTicket = {
  id: string;
  platform: string;
};

type DashboardViewParams = {
  activeCalls: number;
  activeMessages: number;
  completedTasks: number;
  queuedTickets: QueuedTicket[];
};

function StatusCard({
  title,
  value,
}: {
  title: string;
  value: number;
}): ReactNode {
  return (
    <div className="p-4 border rounded shadow-sm text-center">
      <p className="text-gray-600 text-sm">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

export function DashboardView(params: DashboardViewParams): ReactNode {
  const {
    activeCalls = 0,
    activeMessages = 0,
    completedTasks = 0,
    queuedTickets = [],
  } = params;
  const { t } = useTranslation();

  const handleResetSystemClick = () => {};

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{t('system.title')}</h2>
          <PresentationChartBarIcon className="w-4 h-4 ml-2" />
        </div>

        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={handleResetSystemClick}
        >
          {t('resetSystem')} <ReceiptRefundIcon />
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatusCard title={t('system.activeCalls')} value={activeCalls} />
        <StatusCard title={t('system.activeMessages')} value={activeMessages} />
        <StatusCard title={t('system.completedTasks')} value={completedTasks} />
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-medium mb-2">
          {t('system.queuedTickets')}
        </h3>
        {queuedTickets.length === 0 ? (
          <p className="text-gray-500 text-sm">{t('system.noQueuedTickets')}</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {queuedTickets.map((ticket) => (
              <li key={ticket.id} className="py-2 flex justify-between">
                <span className="font-medium">{ticket.id}</span>
                <span className="text-gray-600 text-sm">{ticket.platform}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
