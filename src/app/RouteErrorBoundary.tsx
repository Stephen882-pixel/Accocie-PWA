import { isRouteErrorResponse, Link, useRouteError } from "react-router";

const RouteErrorBoundary = () => {
  const error = useRouteError();
  const isNotFound = isRouteErrorResponse(error) && error.status === 404;

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background p-6 text-center">
      <h1 className="text-xl font-semibold">
        {isNotFound ? "Page not found." : "Something went wrong."}
      </h1>
      <p className="text-sm text-grey-700">
        {isNotFound
          ? "The page you asked for does not exist or has moved."
          : "Reload the app and try again."}
      </p>
      <Link
        to="/"
        className="flex h-11 items-center rounded-control bg-primary px-4 text-sm font-medium text-white hover:bg-primary-dark"
      >
        Go to home
      </Link>
    </div>
  );
};

export default RouteErrorBoundary;
