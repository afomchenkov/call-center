// import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { useLog } from '../../hooks';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import styled from 'styled-components';

const Navigation = () => {
  return null;
};

const BaseLayoutStyled = styled.div``;

// type BaseLayoutProps = {
//   title: string | ReactNode;
//   children: string | ReactNode;
// }

export const BaseLayout = () => {
  const { consoleError } = useLog();

  return (
    <BaseLayoutStyled>
      <header role='menu'>
        <Navigation />
      </header>
      <ErrorBoundary
        fallback={<div>Something went wrong.</div>}
        onError={consoleError}
      >
        <main role='main'>
          <Outlet />
        </main>
      </ErrorBoundary>
      <footer></footer>
    </BaseLayoutStyled>
  );
};
