import type { ReactNode } from 'react';
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
    data: activeAgents /*, isLoading, isError */,
    refetch: refetchAgents,
  } = useAgents();
  const { mutate: registerAgent /*, isPending, isSuccess, isError, error */ } =
    useCreateAgent();
  const { mutate: resetSystem /*, isLoading */ } = useResetSystem();
  const { data: queue /*, isLoading, isError */, refetch: refetchQueue } =
    useQueueStatus();
  const { mutate: assignTicket } = useTaskAssign();
  const { data: completedTasks /*, isLoading, error */ } = useCompletedTasks();

  // TODO: important -> handle errors

  const handleRegisterNewAgent = (data: RegisterAgentDto) => {
    registerAgent(data, {
      onSuccess: () => {
        refetchAgents();
      },
      onError: (err) => {
        console.error('Failed new agent', err);
      },
    });
  };

  const handleAssignNewTicket = (data: AssignTicketDto) => {
    assignTicket(data, {
      onSuccess: () => {
        // refetch();
      },
      onError: (err) => {
        console.error('Failed assign ticket', err);
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
        console.error('Failed system reset', err);
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
