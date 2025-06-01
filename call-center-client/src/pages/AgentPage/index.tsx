import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useParams, useNavigate, redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { useStore } from '@/state/storeHooks';
import { store } from '@/state/store';
import { initializeAgent, loadAgent, loadAgentError } from './Agent.slice';
import { getAgent } from '@/services/agent.service';
import { useTaskComplete } from '@/hooks';

function MissingIdError(): ReactNode {
  const { t } = useTranslation();

  return (
    <Alert variant="destructive" className="mt-4">
      <AlertTitle>{t('agentsPage.errorLoadingAgentData')}</AlertTitle>
      <AlertDescription>{t('agentsPage.missingId')}</AlertDescription>
    </Alert>
  );
}

async function loadAgentData(id: string) {
  store.dispatch(initializeAgent());

  try {
    const agent = await getAgent(id);

    if (agent.isOk()) {
      store.dispatch(loadAgent(agent.unwrap()));
    }

    if (agent.isErr()) {
      store.dispatch(loadAgentError());
    }
  } catch {
    redirect('');
  }
}

// TODO: add edit agent form
export default function AgentsPage(): ReactNode {
  const navigate = useNavigate();

  const { id: agentId } = useParams<{ id: string }>();
  const { mutate: completeTask } = useTaskComplete();
  const { t } = useTranslation();
  const { agent, isLoading, isError } = useStore(({ agent }) => agent);

  useEffect(() => {
    loadAgentData(agentId || '');
  }, [agentId]);

  if (!agentId) {
    return <MissingIdError />;
  }

  if (isLoading) {
    return <p className="text-gray-600">{t('agentsPage.loadingAgents')}</p>;
  }

  if (isError || agent.isNone()) {
    return <p className="text-red-600 font-medium">{t('agentsPage.errorOrNoData')}</p>;
  }

  const agentData = agent.unwrap();

  const handleComplete = (taskId: string) => {
    completeTask(
      {
        agent_identifier: agentId,
        task_id: taskId,
      },
      {
        onSuccess: () => {
          toast.success(`Task ${taskId.slice(-6)} completed`);
          loadAgentData(agentId);
        },
        onError: (error: Error) => {
          toast.error(`Failed to complete task: ${error.message}`);
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <Button
        onClick={() => navigate(-1)}
        variant="outline"
        size="icon"
        className="cursor-pointer"
      >
        <ChevronLeftIcon />
      </Button>

      <h2 className="text-xl font-bold">
        {t('agentsPage.tasksAssigned')} {agentData.name}
      </h2>

      <ul className="space-y-2">
        {agentData.assigned_tasks.length > 0 ? (
          agentData.assigned_tasks.map((task) => (
            <li key={task.id}>
              <button
                onClick={() => handleComplete(task.id)}
                className="w-full text-left border rounded-lg px-4 py-3 bg-muted hover:bg-muted/70 transition shadow-sm hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
              >
                <div className="font-semibold text-base text-foreground">
                  Task ID: {task.id.slice(-8)} - {t('agentsPage.clickComplete')}
                </div>
              </button>
            </li>
          ))
        ) : (
          <li className="text-sm text-muted-foreground">
            {t('agentsPage.noTasks')}
          </li>
        )}
      </ul>
    </div>
  );
}
