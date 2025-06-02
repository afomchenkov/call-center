import { render, screen } from '@testing-library/react';
import { ActiveAgentsView } from './';
import { vi } from 'vitest';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const agentsMock = [
  {
    id: '1',
    name: 'Agent One',
    languageSkills: ['English', 'French'],
    activeCalls: 2,
    activeMessages: 5,
    taskCapacity: 3,
  },
  {
    id: '2',
    name: 'Agent Two',
    languageSkills: ['Spanish'],
    activeCalls: 0,
    activeMessages: 1,
    taskCapacity: 0,
  },
];

describe('ActiveAgentsView', () => {
  it('should render no agents message when list is empty', () => {
    render(<ActiveAgentsView agents={[]} />);
    expect(screen.getByText('activeAgents.noAgents')).toBeInTheDocument();
  });

  it('should render agents info correctly', () => {
    render(<ActiveAgentsView agents={agentsMock} />);

    expect(screen.getByText('activeAgents.title')).toBeInTheDocument();

    agentsMock.forEach((agent) => {
      expect(screen.getByText(agent.name)).toBeInTheDocument();
      expect(screen.getByText(`activeAgents.languages: ${agent.languageSkills.join('|')}`)).toBeInTheDocument();
      const capacityText = screen.getByText(new RegExp(`activeAgents.capacity: ${agent.taskCapacity}`));
      expect(capacityText).toBeInTheDocument();

      if (agent.taskCapacity === 0) {
        expect(capacityText).toHaveClass('text-red-400');
      } else {
        expect(capacityText).toHaveClass('text-green-500');
      }
      expect(screen.getByText(agent.activeCalls.toString())).toBeInTheDocument();
      expect(screen.getByText(agent.activeMessages.toString())).toBeInTheDocument();
    });
  });
});
