import type { Address } from "@/features/addresses/types/address";

/** An address as people read it: who, then where. */
const AddressText = ({ address }: { address: Address }) => (
  <span className="flex flex-col gap-0.5 text-sm leading-5">
    <span className="font-semibold">
      {address.label ?? address.fullName}
      {address.isDefault ? (
        <span className="ml-2 rounded-full border border-grey-300 px-2 py-0.5 text-[11px] font-semibold text-grey-700">
          Default
        </span>
      ) : null}
    </span>
    <span>
      {address.fullName} · {address.phone}
    </span>
    <span className="text-grey-700">
      {[address.addressLine1, address.addressLine2].filter(Boolean).join(", ")}
      <br />
      {address.city}, {address.state} {address.postalCode}
    </span>
  </span>
);

export default AddressText;
