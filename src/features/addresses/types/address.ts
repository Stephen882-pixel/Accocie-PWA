export interface Address {
  id: string;
  /** e.g. "Home", "Work". */
  label: string | null;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  /** The API calls it state; in Kenya it is the county. */
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

/** What the API accepts: it rejects null, so empty optional fields are left out or "". */
export interface AddressPayload {
  label?: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault?: boolean;
}
