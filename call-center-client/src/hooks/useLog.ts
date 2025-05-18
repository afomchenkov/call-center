import { useCallback } from 'react';

type LogObject = any;

export const useLog = () => {
  const consoleLog = useCallback((logObject: LogObject) => {
    console.log('[[call-center-app]]: ', JSON.stringify(logObject));
  }, []);

  const consoleError = useCallback((logObject: LogObject) => {
    console.error('[[call-center-app]]: ', JSON.stringify(logObject));
  }, []);

  const consoleWarn = useCallback((logObject: LogObject) => {
    console.warn('[[call-center-app]]: ', JSON.stringify(logObject));
  }, []);

  return {
    consoleError,
    consoleLog,
    consoleWarn,
  };
};
