import type { FormEvent } from "react";
import Alert from "@/components/feedback/Alert";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";
import { toApiError } from "@/lib/api/apiError";
import {
  useAddAddress,
  useUpdateAddress,
} from "@/features/addresses/queries/addresses";
import type { Address } from "@/features/addresses/types/address";

type AddressFormProps = {
  /** Edit this address; without it the form adds a new one. */
  address?: Address;
  onSaved: (address: Address) => void;
  onCancel?: () => void;
};

/** Adds or edits an address. Used by the address book and by checkout. */
const AddressForm = ({ address, onSaved, onCancel }: AddressFormProps) => {
  const add = useAddAddress();
  const update = useUpdateAddress();
  const save = address ? update : add;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const value = (name: string) => String(form.get(name) ?? "").trim();

    const payload = {
      label: value("label") || undefined,
      fullName: value("fullName"),
      // The API accepts digits only, e.g. +254712345678.
      phone: value("phone").replace(/[\s()-]/g, ""),
      addressLine1: value("addressLine1"),
      addressLine2: value("addressLine2"),
      city: value("city"),
      state: value("state"),
      postalCode: value("postalCode"),
      isDefault: form.get("isDefault") === "on",
    };

    if (address) {
      update.mutate({ id: address.id, payload }, { onSuccess: onSaved });
    } else {
      add.mutate(payload, { onSuccess: onSaved });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {save.error ? (
        <Alert tone="error">{toApiError(save.error).message}</Alert>
      ) : null}

      <TextField
        label="Label (optional)"
        name="label"
        placeholder="Home, Work…"
        defaultValue={address?.label ?? ""}
      />
      <TextField
        label="Full name"
        name="fullName"
        autoComplete="name"
        defaultValue={address?.fullName}
        minLength={2}
        required
      />
      <TextField
        label="Phone number"
        name="phone"
        type="tel"
        autoComplete="tel"
        placeholder="+254 712 345 678"
        defaultValue={address?.phone}
        required
      />
      <TextField
        label="Street address"
        name="addressLine1"
        autoComplete="address-line1"
        placeholder="Building, street"
        defaultValue={address?.addressLine1}
        minLength={3}
        required
      />
      <TextField
        label="Apartment, floor (optional)"
        name="addressLine2"
        autoComplete="address-line2"
        defaultValue={address?.addressLine2 ?? ""}
      />
      <div className="grid grid-cols-2 gap-3">
        <TextField
          label="Town / city"
          name="city"
          autoComplete="address-level2"
          defaultValue={address?.city}
          minLength={2}
          required
        />
        <TextField
          label="County"
          name="state"
          autoComplete="address-level1"
          defaultValue={address?.state}
          minLength={2}
          required
        />
      </div>
      <TextField
        label="Postal code"
        name="postalCode"
        autoComplete="postal-code"
        inputMode="numeric"
        placeholder="00100"
        defaultValue={address?.postalCode}
        minLength={2}
        required
      />
      <label className="flex min-h-11 items-center gap-2.5 text-sm">
        <input
          type="checkbox"
          name="isDefault"
          defaultChecked={address?.isDefault}
          className="size-5 accent-primary"
        />
        Use as my default address
      </label>

      <Button type="submit" isLoading={save.isPending}>
        {address ? "Save address" : "Add address"}
      </Button>
      {onCancel ? (
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      ) : null}
    </form>
  );
};

export default AddressForm;
