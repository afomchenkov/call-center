import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { AgentWorkloadView } from '@/components/views/AgentWorkloadView';
import { ActiveAgentsView } from '@/components/views/ActiveAgentsView';
import { DashboardView } from '@/components/views/DashboardView';
import { TicketsView } from '@/components/views/TicketsView';
import {
  useAgents,
  useCreateAgent,
  useResetSystem,
  useQueueStatus,
  useTaskAssign,
  useCompletedTasks,
  useLog,
  // useTaskComplete,
} from '@/hooks';
// import { QueueModel, QueueItemModel } from '@/models';
import type { RegisterAgentDto, AssignTicketDto } from '@/models';
import {
  getAgentCallTasks,
  getAgentTextTasks,
  calculateAgentCapacity,
  parseQueuedItems,
  calculateActiveVoiceTasks,
  calculateActiveTextTasks,
  calculateTotalCapacity,
} from '@/utils';

export default function DashboardPage(): ReactNode {
  const {
    data: activeAgents,
    isError: isLoadActiveAgentsError,
    refetch: refetchAgents,
  } = useAgents();
  const { mutate: registerAgent, isError: isCreateAgentError } =
    useCreateAgent();
  const { mutate: resetSystem, isError: isResetSystemError } = useResetSystem();
  const {
    data: queue,
    isError: isLoadQueueError,
    refetch: refetchQueue,
  } = useQueueStatus();
  const { mutate: assignTicket, isError: isAssignTicketError } =
    useTaskAssign();
  const { data: completedTasks, isError: isLoadCompletedTasksError } =
    useCompletedTasks();
  const { consoleError } = useLog();

  useEffect(() => {
    // TODO: handle errors over global state
    consoleError('An HTTP error has occurred...');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isLoadActiveAgentsError,
    isCreateAgentError,
    isResetSystemError,
    isLoadQueueError,
    isAssignTicketError,
    isLoadCompletedTasksError,
  ]);

  const handleRegisterNewAgent = (data: RegisterAgentDto) => {
    registerAgent(data, {
      onSuccess: () => {
        refetchAgents();
      },
      onError: (err) => {
        toast.error('Failed to create a new agent', {
          description: err.message,
          closeButton: true,
        });
      },
    });
  };

  const handleAssignNewTicket = (data: AssignTicketDto) => {
    assignTicket(data, {
      onSuccess: () => {
        refetchAgents();
        refetchQueue();
      },
      onError: (err) => {
        toast.error('Failed to assign new ticket', {
          description: err.message,
          closeButton: true,
        });
      },
    });
  };

  const handleSystemReset = () => {
    resetSystem(void 0, {
      onSuccess: () => {
        refetchAgents();
        refetchQueue();
      },
      onError: (err) => {
        toast.error('Failed to reset the system', {
          description: err.message,
          closeButton: true,
        });
      },
    });
  };

  return (
    <div className="p-4 space-y-4">
      <section className="border p-4 shadow">
        <DashboardView
          activeCalls={calculateActiveVoiceTasks(activeAgents)}
          activeMessages={calculateActiveTextTasks(activeAgents)}
          completedTasks={completedTasks?.length || 0}
          queuedTickets={parseQueuedItems(queue).length}
          onSystemResetClick={handleSystemReset}
        />
      </section>

      <section className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x border shadow">
        <div className="w-full sm:w-1/2 p-4">
          <TicketsView
            tickets={parseQueuedItems(queue)}
            onAssignNewTicket={handleAssignNewTicket}
          />
        </div>
        <div className="w-full sm:w-1/2 p-4 overflow-auto">
          <AgentWorkloadView
            onRegisterNewAgent={handleRegisterNewAgent}
            agents={(activeAgents || []).map((agent) => {
              return {
                ...agent,
                activeTasks: agent.assignedTasks.length,
                totalCapacity: calculateTotalCapacity(agent),
              };
            })}
          />
        </div>
      </section>

      <section className="border p-4 shadow">
        <ActiveAgentsView
          agents={(activeAgents || []).map((agent) => {
            return {
              ...agent,
              activeCalls: getAgentCallTasks(agent).length,
              activeMessages: getAgentTextTasks(agent).length,
              taskCapacity: calculateAgentCapacity(agent),
            };
          })}
        />
      </section>
    </div>
  );
}
