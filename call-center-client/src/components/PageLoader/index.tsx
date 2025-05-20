import { SpinnerCircular } from 'spinners-react';
import styled from 'styled-components';

const PageLoaderWrapper = styled.div`
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export function PageLoader() {
  return (
    <PageLoaderWrapper>
      <SpinnerCircular
        color="#0f62fe"
        secondaryColor="#f4f4f4"
        thickness={130}
      />
    </PageLoaderWrapper>
  );
}
