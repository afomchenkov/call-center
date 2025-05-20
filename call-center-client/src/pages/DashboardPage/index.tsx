import type { ReactNode } from 'react';
import { AgentWorkloadView } from '@/components/views/AgentWorkloadView';
import { ActiveAgentsView } from '@/components/views/ActiveAgentsView';
import { DashboardView } from '@/components/views/DashboardView';
import { TicketsView } from '@/components/views/TicketsView';

import { useAgents, useCreateAgent } from '@/hooks';
import type { RegisterAgentDto } from '@/models/agent';


export default function DashboardPage(): ReactNode {
  const { data: activeAgents /*, isLoading, isError */, refetch } = useAgents();
  const { mutate /*, isPending, isSuccess, isError, error */ } = useCreateAgent();

  const handleRegisterNewAgent = (data: RegisterAgentDto) => {
    mutate(data, {
      onSuccess: (newAgent) => {
        console.log('New Agent registered: ', newAgent);
        refetch();
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
        />
      </section>

      <section className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x border shadow">
        <div className="flex-1 p-4">
          <TicketsView
            tickets={[
              { id: 'T1', type: 'voice', platform: 'Phone' },
              { id: 'T2', type: 'text', platform: 'Chat' },
              { id: 'T3', type: 'text', platform: 'Messenger' },
              { id: 'T21', type: 'text', platform: 'Chat' },
              { id: 'T53', type: 'voice', platform: 'Messenger' },
              { id: 'T211', type: 'voice', platform: 'Chat' },
              { id: 'T6', type: 'voice', platform: 'Messenger' },
            ]}
          />
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
            return {
              ...agent,
              activeCalls: 1,
              activeMessages: 2,
              taskCapacity: 5,
            };
          })}
        />
      </section>
    </div>
  );
}
