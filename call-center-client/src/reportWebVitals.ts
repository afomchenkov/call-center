import { onLCP, onINP, onCLS } from 'web-vitals';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ReportHandler = any;

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    onLCP(onPerfEntry);
    onINP(onPerfEntry);
    onCLS(onPerfEntry);
  }
};

export default reportWebVitals;
