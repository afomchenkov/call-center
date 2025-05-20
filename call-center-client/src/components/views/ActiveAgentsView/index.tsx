import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { UserIcon } from '@heroicons/react/24/solid';
// import { Button } from '@/components/ui/button';
import {
  ChatBubbleOvalLeftIcon,
  PhoneIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

/**
 * - Show agent name, number of supported languages, and task capacity
 * - View agent task status (calls and messages count)
 */

type Agent = {
  id: string;
  name: string;
  languageSkills: string[];
  activeCalls: number;
  activeMessages: number;
  taskCapacity: number;
};

type ActiveAgentsViewProps = {
  agents: Agent[];
};

export function ActiveAgentsView(props: ActiveAgentsViewProps): ReactNode {
  const { agents = [] } = props;
  const { t } = useTranslation();

  return (
    <section className="h-full flex flex-col">
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-semibold">{t('activeAgents.title')}</h2>
        <UsersIcon className="w-4 h-4 ml-2" />
      </div>

      {agents.length === 0 ? (
        <p className="text-sm text-gray-500">{t('activeAgents.noAgents')}</p>
      ) : (
        <div className="overflow-y-auto max-h-96 pr-1 space-y-3">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="flex items-center justify-between p-4 border shadow-sm"
            >
              <div className="flex items-center gap-3">
                <UserIcon className="w-6 h-6 text-gray-600" />
                <div>
                  <p className="font-medium">{agent.name}</p>
                  <p className="text-sm text-gray-500">
                    {t('activeAgents.languages')}: {agent.languageSkills.length}
                  </p>
                </div>
              </div>

              <div className="text-right flex items-center justify-between text-sm">
                <div className="flex-1 text-center mr-2">
                  {t('activeAgents.capacity')}: {agent.taskCapacity}
                </div>

                <div className="flex items-center gap-1 mr-2">
                  <PhoneIcon className="w-4 h-4" />
                  <span>{agent.activeCalls}</span>
                </div>

                <div className="flex items-center gap-1">
                  <ChatBubbleOvalLeftIcon className="w-4 h-4" />
                  <span>{agent.activeMessages}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
