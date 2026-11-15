import { api } from "@/lib/api/client";
import type { ApiSuccess } from "@/types/api";
import type {
  Address,
  AddressPayload,
} from "@/features/addresses/types/address";

export const AddressService = {
  list: async (): Promise<Address[]> => {
    const response = await api.get<ApiSuccess<Address[]>>("/users/addresses");
    return response.data.data;
  },

  add: async (payload: AddressPayload): Promise<Address> => {
    const response = await api.post<ApiSuccess<Address>>(
      "/users/addresses",
      payload,
    );
    return response.data.data;
  },

  update: async (id: string, payload: Partial<AddressPayload>) => {
    const response = await api.put<ApiSuccess<Address>>(
      `/users/addresses/${id}`,
      payload,
    );
    return response.data.data;
  },

  remove: async (id: string) => {
    await api.delete(`/users/addresses/${id}`);
  },
};
