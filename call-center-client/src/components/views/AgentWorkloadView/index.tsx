import type { ReactNode } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Progress } from '@/components/ui/progress';

// import { Button } from '@/components/ui/button';
import { CircleStackIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { RegisterAgentDialog } from '@/components/RegisterAgentDialog';
import type { RegisterAgentDto } from '@/models';

/**
 * - Display each agent’s current task load and capacity usage
 * - Show voice call/task indicators and capacity bar
 * - Allow the user to create new agents and assign/edit agent's skills
 */

type Agent = {
  id: string;
  name: string;
  languageSkills: string[];
  completedTasks: number;
  totalTasks: number;
};

type AgentWorkloadViewProps = {
  agents: Agent[];
  onRegisterNewAgent: (data: RegisterAgentDto) => void;
};

export function AgentWorkloadView(props: AgentWorkloadViewProps): ReactNode {
  const { agents = [], onRegisterNewAgent } = props;

  const [openRegisterAgentDialog, setOpenRegisterAgentDialog] = useState(false);
  const { t } = useTranslation();

  const handleRegisterNewAgent = (data: RegisterAgentDto) => {
    setOpenRegisterAgentDialog(false);
    if (onRegisterNewAgent) {
      onRegisterNewAgent(data);
    }
  };

  return (
    <section className="space-y-4 h-full">
      <div className="flex gap-2">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold">{t('agentWorkload.title')}</h2>
          <CircleStackIcon className="w-4 h-4 ml-2" />
        </div>

        <div className="ml-auto">
          <Button
            variant="outline"
            size="icon"
            className="cursor-pointer"
            onClick={() => setOpenRegisterAgentDialog(true)}
          >
            <PlusIcon />
          </Button>
        </div>
      </div>

      <RegisterAgentDialog
        open={openRegisterAgentDialog}
        onOpenChange={setOpenRegisterAgentDialog}
        onFormSubmit={handleRegisterNewAgent}
      />

      {agents.length === 0 ? (
        <p className="text-sm text-gray-500">{t('agentWorkload.noAgents')}</p>
      ) : (
        <div className="max-h-80 overflow-y-auto pr-1">
          <ul className="space-y-4">
            {agents.map((agent) => {
              const progress =
                agent.totalTasks > 0
                  ? (agent.completedTasks / agent.totalTasks) * 100
                  : 0;

              return (
                <li
                  key={agent.id}
                  className="p-4 border rounded shadow-sm space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-base font-medium">{agent.name}</p>
                      <p className="text-sm text-gray-500">
                        {t('agentWorkload.languages')}:{' '}
                        {agent.languageSkills.length}
                      </p>
                    </div>
                    <span className="text-sm text-gray-600">
                      {agent.completedTasks}/{agent.totalTasks}{' '}
                      {t('agentWorkload.tasks')}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
