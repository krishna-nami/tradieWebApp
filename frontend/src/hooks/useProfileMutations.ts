// hooks/useProfileMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import {
  updateGenericProfile,
  updateTradieDetails,
  addSpecialisation,
  removeSpecialisation,
  setAvailability,
} from "@/lib/services/tradieProfile";

function handleErr(err: unknown, fallback: string) {
  const message = isAxiosError(err)
    ? (err.response?.data?.message ?? fallback)
    : "Something went wrong.";
  toast.error(message);
}

export function useProfileMutations() {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["auth", "me"] });

  const saveGeneric = useMutation({
    mutationFn: updateGenericProfile,
    onSuccess: () => {
      toast.success("Profile updated");
      invalidate();
    },
    onError: (err) => handleErr(err, "Could not update profile."),
  });

  const saveTradieDetails = useMutation({
    mutationFn: updateTradieDetails,
    onSuccess: () => {
      toast.success("Trade details updated");
      invalidate();
    },
    onError: (err) => handleErr(err, "Could not update trade details."),
  });

  const addSpec = useMutation({
    mutationFn: addSpecialisation,
    onSuccess: () => {
      toast.success("Specialisation added");
      invalidate();
    },
    onError: (err) => handleErr(err, "Could not add specialisation."),
  });

  const removeSpec = useMutation({
    mutationFn: removeSpecialisation,
    onSuccess: () => {
      toast.success("Specialisation removed");
      invalidate();
    },
    onError: (err) => handleErr(err, "Could not remove specialisation."),
  });

  const saveAvailability = useMutation({
    mutationFn: setAvailability,
    onSuccess: () => {
      toast.success("Availability updated");
      invalidate();
    },
    onError: (err) => handleErr(err, "Could not update availability."),
  });

  return {
    saveGeneric,
    saveTradieDetails,
    addSpec,
    removeSpec,
    saveAvailability,
  };
}
