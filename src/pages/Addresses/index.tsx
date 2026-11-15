import { useState } from "react";
import { Plus } from "lucide-react";
import QueryError from "@/components/feedback/QueryError";
import AuthShell from "@/components/layout/AuthShell";
import Button from "@/components/ui/Button";
import { toApiError } from "@/lib/api/apiError";
import AddressForm from "@/features/addresses/components/AddressForm";
import AddressText from "@/features/addresses/components/AddressText";
import {
  useAddresses,
  useRemoveAddress,
  useUpdateAddress,
} from "@/features/addresses/queries/addresses";

/** `"new"`, an address id being edited, or nothing open. */
type Editing = "new" | string | null;

const Addresses = () => {
  const addresses = useAddresses();
  const remove = useRemoveAddress();
  const update = useUpdateAddress();
  const [editing, setEditing] = useState<Editing>(null);

  const actionError = remove.error ?? update.error;

  return (
    <AuthShell backTo="/account" title="Addresses">
      {actionError ? (
        <p role="alert" className="text-sm text-error-700">
          {toApiError(actionError).message}
        </p>
      ) : null}

      {addresses.isPending ? (
        <div className="h-28 animate-pulse rounded-card bg-grey-100" />
      ) : addresses.isError ? (
        <QueryError
          message={toApiError(addresses.error).message}
          onRetry={() => addresses.refetch()}
        />
      ) : (
        addresses.data.map((address) =>
          editing === address.id ? (
            <section
              key={address.id}
              className="rounded-card border border-grey-300 p-4"
            >
              <AddressForm
                address={address}
                onSaved={() => setEditing(null)}
                onCancel={() => setEditing(null)}
              />
            </section>
          ) : (
            <article
              key={address.id}
              className="flex flex-col gap-3 rounded-card border border-grey-300 p-4"
            >
              <AddressText address={address} />
              <div className="-mb-2 flex flex-wrap gap-x-4 text-sm font-semibold">
                <button
                  type="button"
                  onClick={() => setEditing(address.id)}
                  className="min-h-11 text-primary"
                >
                  Edit
                </button>
                {address.isDefault ? null : (
                  <button
                    type="button"
                    disabled={update.isPending}
                    onClick={() =>
                      update.mutate({
                        id: address.id,
                        payload: { isDefault: true },
                      })
                    }
                    className="min-h-11 text-primary"
                  >
                    Make default
                  </button>
                )}
                <button
                  type="button"
                  disabled={remove.isPending}
                  onClick={() => remove.mutate(address.id)}
                  className="min-h-11 text-error-700"
                >
                  Delete
                </button>
              </div>
            </article>
          ),
        )
      )}

      {editing === "new" ? (
        <section className="rounded-card border border-grey-300 p-4">
          <AddressForm
            onSaved={() => setEditing(null)}
            onCancel={() => setEditing(null)}
          />
        </section>
      ) : (
        <Button variant="secondary" onClick={() => setEditing("new")}>
          <Plus size={18} aria-hidden="true" className="mr-1.5" />
          Add an address
        </Button>
      )}
    </AuthShell>
  );
};

export default Addresses;
