import Button from "@/components/ui/Button";

type QueryErrorProps = {
  message: string;
  onRetry: () => void;
};

/** A failed load, with a way to try again. */
const QueryError = ({ message, onRetry }: QueryErrorProps) => (
  <div
    role="alert"
    className="flex flex-col items-center gap-4 rounded-card border border-grey-300 px-6 py-10 text-center"
  >
    <p className="text-[15px] text-grey-700">{message}</p>
    <div className="w-full max-w-60">
      <Button variant="secondary" onClick={onRetry}>
        Try again
      </Button>
    </div>
  </div>
);

export default QueryError;
