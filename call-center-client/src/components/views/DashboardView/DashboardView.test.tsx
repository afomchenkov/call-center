import { render, screen, fireEvent } from '@testing-library/react';
import { DashboardView } from './';
import { vi } from 'vitest';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('DashboardView', () => {
  it('should render main titles and icons', () => {
    render(
      <DashboardView
        activeCalls={5}
        activeMessages={10}
        completedTasks={15}
        queuedTickets={3}
        onSystemResetClick={vi.fn()}
      />,
    );

    expect(screen.getByText('system.title')).toBeInTheDocument();
    expect(screen.getByText('resetSystem')).toBeInTheDocument();
  });

  it('should render StatusCards with correct titles and values', () => {
    render(
      <DashboardView
        activeCalls={5}
        activeMessages={10}
        completedTasks={15}
        queuedTickets={3}
        onSystemResetClick={vi.fn()}
      />,
    );

    expect(screen.getByText('system.activeCalls')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();

    expect(screen.getByText('system.activeMessages')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();

    expect(screen.getByText('system.completedTasks')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('should display queued tickets count when greater than 0', () => {
    render(
      <DashboardView
        activeCalls={0}
        activeMessages={0}
        completedTasks={0}
        queuedTickets={7}
        onSystemResetClick={vi.fn()}
      />,
    );

    expect(screen.getByText('system.queuedTickets')).toBeInTheDocument();
    expect(screen.getByText('common.numberOfQueuedTickets: 7')).toBeInTheDocument();
  });

  it('should show no queued tickets message when queuedTickets is 0', () => {
    render(
      <DashboardView
        activeCalls={0}
        activeMessages={0}
        completedTasks={0}
        queuedTickets={0}
        onSystemResetClick={vi.fn()}
      />,
    );

    expect(screen.getByText('system.noQueuedTickets')).toBeInTheDocument();
  });

  it('should call onSystemResetClick when reset button is clicked', () => {
    const resetHandler = vi.fn();

    render(
      <DashboardView
        activeCalls={1}
        activeMessages={2}
        completedTasks={3}
        queuedTickets={4}
        onSystemResetClick={resetHandler}
      />,
    );

    const button = screen.getByRole('button', { name: /resetSystem/i });
    fireEvent.click(button);

    expect(resetHandler).toHaveBeenCalledTimes(1);
  });
});
