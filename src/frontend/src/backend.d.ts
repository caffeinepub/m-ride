import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Ride {
    id: bigint;
    date: string;
    name: string;
    distanceKm: number;
    durationMinutes: bigint;
    notes: string;
    rating: bigint;
}
export interface RideStats {
    avgDistanceKm: number;
    longestRideName: string;
    totalDistanceKm: number;
    totalDurationMinutes: bigint;
    totalRides: bigint;
    longestRideKm: number;
}
export interface backendInterface {
    createRide(name: string, date: string, distanceKm: number, durationMinutes: bigint, notes: string, rating: bigint): Promise<Ride>;
    deleteRide(id: bigint): Promise<void>;
    getAllRides(): Promise<Array<Ride>>;
    getRide(id: bigint): Promise<Ride>;
    getStats(): Promise<RideStats>;
    updateRide(id: bigint, name: string, date: string, distanceKm: number, durationMinutes: bigint, notes: string, rating: bigint): Promise<Ride>;
}
