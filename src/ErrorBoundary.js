import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

const ErrorFallback = () => (
  <div>
    <h2>Something went terribly wrong.</h2>
    <p>You should reload this page.</p>
  </div>
);

const onError = (error, info) => {
  console.error(`${error} [${info.componentStack}]`);
};

const ErrorBoundary = ({ children }) => (
  <ReactErrorBoundary FallbackComponent={ErrorFallback} onError={onError}>
    {children}
  </ReactErrorBoundary>
);

export { ErrorBoundary };
