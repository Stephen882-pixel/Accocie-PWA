import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AddressService } from "@/features/addresses/api/addressService";
import type { AddressPayload } from "@/features/addresses/types/address";

const ADDRESSES_KEY = ["addresses"];

export const useAddresses = () =>
  useQuery({ queryKey: ADDRESSES_KEY, queryFn: AddressService.list });

/** Any change refetches the list: making one default un-defaults the rest. */
const useAddressMutation = <T, R>(mutationFn: (variables: T) => Promise<R>) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ADDRESSES_KEY }),
  });
};

export const useAddAddress = () =>
  useAddressMutation((payload: AddressPayload) => AddressService.add(payload));

export const useUpdateAddress = () =>
  useAddressMutation(
    ({ id, payload }: { id: string; payload: Partial<AddressPayload> }) =>
      AddressService.update(id, payload),
  );

export const useRemoveAddress = () =>
  useAddressMutation((id: string) => AddressService.remove(id));
