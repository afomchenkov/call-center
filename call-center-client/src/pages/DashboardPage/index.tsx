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
} from '@/hooks';
import { QueueModel, QueueItemModel } from '@/models';
import type { RegisterAgentDto, AssignTicketDto } from '@/models';
import type { QueuedTicket } from '@/types';

const parseQueuedItems = (queue: QueueModel | undefined): QueuedTicket[] => {
  if (!queue) {
    return [];
  }

  return [
    ...queue.textQueue.map((item) => QueueItemModel.withType(item, 'text')),
    ...queue.voiceQueue.map((item) => QueueItemModel.withType(item, 'voice')),
  ];
};

export default function DashboardPage(): ReactNode {
  const { data: activeAgents /*, isLoading, isError */, refetch: refetchAgents } = useAgents();
  const { mutate: registerAgent /*, isPending, isSuccess, isError, error */ } =
    useCreateAgent();
  const { mutate: resetSystem /*, isLoading */ } = useResetSystem();
  const { data: queue /*, isLoading, isError */ } = useQueueStatus();
  const { mutate: assignTicket } = useTaskAssign();

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
  }

  const handleSystemReset = () => {
    resetSystem(void 0, {
      onSuccess: () => {
        refetchAgents();
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
          activeCalls={3}
          activeMessages={12}
          completedTasks={2}
          queuedTickets={[]}
          onSystemResetClick={handleSystemReset}
        />
      </section>

      <section className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x border shadow">
        <div className="flex-1 p-4">
          <TicketsView tickets={parseQueuedItems(queue)} onAssignNewTicket={handleAssignNewTicket}/>
        </div>
        <div className="flex-1 p-4">
          <AgentWorkloadView
            onRegisterNewAgent={handleRegisterNewAgent}
            agents={(activeAgents || []).map((agent) => {
              return {
                ...agent,
                completedTasks: 5,
                totalTasks: 10,
              };
            })}
          />
        </div>
      </section>

      <section className="border p-4 shadow">
        <ActiveAgentsView
          agents={(activeAgents || []).map((agent) => {
            const activeCalls = agent.assignedTasks.filter(
              (task) => task.platform === 'call'
            ).length;
            const activeMessages = agent.assignedTasks.filter(
              (task) => task.platform !== 'call'
            ).length;

            return {
              ...agent,
              activeCalls,
              activeMessages,
              taskCapacity: 0,
            };
          })}
        />
      </section>
    </div>
  );
}
