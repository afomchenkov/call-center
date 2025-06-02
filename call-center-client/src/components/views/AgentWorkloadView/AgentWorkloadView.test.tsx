import { render, screen, fireEvent } from '@testing-library/react';
import { AgentWorkloadView } from './';
import { vi } from 'vitest';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('@/components/RegisterAgentDialog', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  RegisterAgentDialog: (props: any) => (
    <div data-testid='register-agent-dialog'>
      {props.open && (
        <>
          <button
            onClick={() => props.onFormSubmit({ name: 'New Agent', language_skills: ['English'] })}
            data-testid='submit-dialog'
          >
            Submit Dialog
          </button>
          <button onClick={() => props.onOpenChange(false)} data-testid='close-dialog'>
            Close Dialog
          </button>
        </>
      )}
    </div>
  ),
}));

const agentsMock = [
  {
    id: '1',
    name: 'Agent One',
    languageSkills: ['English', 'French'],
    activeTasks: 2,
    totalCapacity: 5,
  },
  {
    id: '2',
    name: 'Agent Two',
    languageSkills: ['Spanish'],
    activeTasks: 0,
    totalCapacity: 3,
  },
];

describe('AgentWorkloadView', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  it('should render title and new agent button', () => {
    render(<AgentWorkloadView agents={[]} onRegisterNewAgent={vi.fn()} />);
    expect(screen.getByText('agentWorkload.title')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should show no agents message when list is empty', () => {
    render(<AgentWorkloadView agents={[]} onRegisterNewAgent={vi.fn()} />);
    expect(screen.getByText('agentWorkload.noAgents')).toBeInTheDocument();
  });

  it('should navigate to agent detail page on agent click', () => {
    render(<AgentWorkloadView agents={agentsMock} onRegisterNewAgent={vi.fn()} />);

    const agentItem = screen.getByText('Agent One').closest('li');
    expect(agentItem).toBeInTheDocument();

    if (agentItem) {
      fireEvent.click(agentItem);
    }

    expect(mockNavigate).toHaveBeenCalledWith('/agents/1');
  });
});
