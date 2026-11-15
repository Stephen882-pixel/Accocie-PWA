import { useState, type FormEvent } from "react";
import type { UseMutationResult } from "@tanstack/react-query";
import Alert from "@/components/feedback/Alert";
import Button from "@/components/ui/Button";
import { toApiError } from "@/lib/api/apiError";

type OrderRequestFormProps = {
  /** e.g. "Cancel this order". */
  openLabel: string;
  submitLabel: string;
  successMessage: string;
  request: UseMutationResult<void, Error, string>;
};

/**
 * A cancellation or return request: a button that opens a reason field.
 * These are requests; an admin approves them and the customer is emailed.
 */
const OrderRequestForm = ({
  openLabel,
  submitLabel,
  successMessage,
  request,
}: OrderRequestFormProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (request.isSuccess) return <Alert tone="success">{successMessage}</Alert>;

  if (!isOpen) {
    return (
      <Button variant="ghost" onClick={() => setIsOpen(true)}>
        {openLabel}
      </Button>
    );
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    request.mutate(
      String(new FormData(event.currentTarget).get("reason")).trim(),
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-card border border-grey-300 p-4"
    >
      {request.error ? (
        <Alert tone="error">{toApiError(request.error).message}</Alert>
      ) : null}
      <label htmlFor="request-reason" className="text-sm font-medium">
        Tell us why
      </label>
      <textarea
        id="request-reason"
        name="reason"
        rows={3}
        minLength={5}
        maxLength={500}
        required
        className="rounded-control border border-grey-400 px-3.5 py-3 text-[15px] outline-none focus:border-primary focus:ring-1 focus:ring-primary"
      />
      <Button type="submit" variant="secondary" isLoading={request.isPending}>
        {submitLabel}
      </Button>
      <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
        Never mind
      </Button>
    </form>
  );
};

export default OrderRequestForm;
