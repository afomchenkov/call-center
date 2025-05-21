import type { ReactNode } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { useTaskComplete, useAgent } from '@/hooks';

function MissingIdError(): ReactNode {
  return (
    <Alert variant="destructive" className="mt-4">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        The ID was not provided. Please select an agent to continue.
      </AlertDescription>
    </Alert>
  );
}

export default function AgentsPage(): ReactNode {
  const { id: agentId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { mutate: completeTask } = useTaskComplete();
  const {
    data: agentData,
    refetch: refetchAgent,
    isLoading,
    isError,
    error,
  } = useAgent(agentId || '');

  if (!agentId) {
    return <MissingIdError />;
  }

  if (isLoading) {
    return <p className="text-gray-600">Loading agent data...</p>;
  }

  if (isError || !agentData) {
    return (
      <p className="text-red-600 font-medium">{(error as Error).message}</p>
    );
  }

  const handleComplete = (taskId: string) => {
    completeTask(
      {
        agent_identifier: agentData.id,
        task_id: taskId,
      },
      {
        onSuccess: () => {
          toast.success(`Task ${taskId.slice(-6)} completed`);
          refetchAgent();
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

      <h2 className="text-xl font-bold">Tasks assigned to {agentData.name}</h2>

      <ul className="space-y-2">
        {agentData.assignedTasks.length > 0 ? (
          agentData.assignedTasks.map((task) => (
            <li key={task.id}>
              <button
                onClick={() => handleComplete(task.id)}
                className="w-full text-left border rounded-lg px-4 py-3 bg-muted hover:bg-muted/70 transition shadow-sm hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
              >
                <div className="font-semibold text-base text-foreground">
                  Task ID: {task.id.slice(-8)} - click to complete
                </div>
              </button>
            </li>
          ))
        ) : (
          <li className="text-sm text-muted-foreground">No tasks assigned</li>
        )}
      </ul>
    </div>
  );
}
