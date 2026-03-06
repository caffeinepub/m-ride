import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Ride, RideStats } from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllRides() {
  const { actor, isFetching } = useActor();
  return useQuery<Ride[]>({
    queryKey: ["rides"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRides();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetRide(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Ride>({
    queryKey: ["ride", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) throw new Error("No actor or id");
      return actor.getRide(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useGetStats() {
  const { actor, isFetching } = useActor();
  return useQuery<RideStats>({
    queryKey: ["stats"],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.getStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateRide() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      date: string;
      distanceKm: number;
      durationMinutes: bigint;
      notes: string;
      rating: bigint;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.createRide(
        data.name,
        data.date,
        data.distanceKm,
        data.durationMinutes,
        data.notes,
        data.rating,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rides"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useUpdateRide() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      name: string;
      date: string;
      distanceKm: number;
      durationMinutes: bigint;
      notes: string;
      rating: bigint;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateRide(
        data.id,
        data.name,
        data.date,
        data.distanceKm,
        data.durationMinutes,
        data.notes,
        data.rating,
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["rides"] });
      queryClient.invalidateQueries({
        queryKey: ["ride", variables.id.toString()],
      });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useDeleteRide() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteRide(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rides"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}
