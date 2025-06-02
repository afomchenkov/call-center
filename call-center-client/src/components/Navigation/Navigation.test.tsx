import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Navigation } from './';

/**
 * @vitest-environment jsdom
 */

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('Navigation menu', () => {
  it('should render navigation menu component', () => {
    const { container } = render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>,
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    const buttons = container.getElementsByTagName('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});
