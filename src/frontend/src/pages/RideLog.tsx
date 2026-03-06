import type { Ride } from "@/backend.d";
import { StarRatingDisplay } from "@/components/StarRating";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllRides } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import { ChevronDown, ChevronUp, List, Plus } from "lucide-react";
import { type Variants, motion } from "motion/react";
import { useState } from "react";

type SortField = "date" | "name" | "distanceKm" | "durationMinutes" | "rating";
type SortDir = "asc" | "desc";

function formatDuration(minutes: bigint): string {
  const totalMins = Number(minutes);
  const hrs = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  if (hrs === 0) return `${mins}m`;
  if (mins === 0) return `${hrs}h`;
  return `${hrs}h ${mins}m`;
}

function SortIcon({
  field,
  sortField,
  sortDir,
}: { field: SortField; sortField: SortField; sortDir: SortDir }) {
  if (sortField !== field)
    return <ChevronDown size={12} className="text-muted-foreground/40" />;
  return sortDir === "asc" ? (
    <ChevronUp size={12} className="text-primary" />
  ) : (
    <ChevronDown size={12} className="text-primary" />
  );
}

function sortRides(rides: Ride[], field: SortField, dir: SortDir): Ride[] {
  return [...rides].sort((a, b) => {
    let comparison = 0;
    switch (field) {
      case "date":
        comparison = a.date.localeCompare(b.date);
        break;
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "distanceKm":
        comparison = a.distanceKm - b.distanceKm;
        break;
      case "durationMinutes":
        comparison = Number(a.durationMinutes) - Number(b.durationMinutes);
        break;
      case "rating":
        comparison = Number(a.rating) - Number(b.rating);
        break;
    }
    return dir === "asc" ? comparison : -comparison;
  });
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0, transition: { duration: 0.25 } },
};

export function RideLog() {
  const { data: rides, isLoading } = useGetAllRides();
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const sortedRides = rides ? sortRides(rides, sortField, sortDir) : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-2">
            All Rides
          </p>
          <h1 className="font-display font-black text-4xl md:text-5xl text-foreground leading-none tracking-tight flex items-center gap-3">
            <List size={36} className="text-primary" />
            Ride Log
          </h1>
          {!isLoading && rides && (
            <p className="text-muted-foreground mt-2 text-sm">
              {rides.length} ride{rides.length !== 1 ? "s" : ""} recorded
            </p>
          )}
        </div>
        <Link to="/rides/new">
          <Button className="font-display font-bold uppercase tracking-wide bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-sm hover:shadow-glow transition-all hover:scale-[1.02] active:scale-[0.98] flex-shrink-0">
            <Plus size={16} className="mr-2" />
            Log Ride
          </Button>
        </Link>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3" data-ocid="ride_log.loading_state">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full bg-card" />
          ))}
        </div>
      ) : sortedRides.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          data-ocid="ride_log.empty_state"
          className="card-industrial rounded-lg p-16 text-center space-y-4"
        >
          <div className="text-6xl opacity-20">🏍️</div>
          <p className="font-display font-bold text-xl text-foreground">
            No rides yet.
          </p>
          <p className="text-sm text-muted-foreground">
            Get out there and log your first ride.
          </p>
          <Link to="/rides/new">
            <Button
              variant="outline"
              className="border-primary/30 text-primary hover:bg-primary/10 font-medium"
            >
              <Plus size={14} className="mr-2" />
              Log First Ride
            </Button>
          </Link>
        </motion.div>
      ) : (
        <div className="card-industrial rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto] md:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-4 py-3 border-b border-border bg-muted/30">
            {(
              [
                { field: "name" as SortField, label: "Ride Name" },
                { field: "date" as SortField, label: "Date" },
                { field: "distanceKm" as SortField, label: "Distance" },
                { field: "durationMinutes" as SortField, label: "Duration" },
                { field: "rating" as SortField, label: "Rating" },
              ] as { field: SortField; label: string }[]
            ).map(({ field, label }) => (
              <button
                key={field}
                type="button"
                onClick={() => handleSort(field)}
                className="flex items-center gap-1 text-xs font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors text-left"
              >
                {label}
                <SortIcon
                  field={field}
                  sortField={sortField}
                  sortDir={sortDir}
                />
              </button>
            ))}
          </div>

          {/* Rows */}
          <motion.div
            data-ocid="ride_log.list"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="divide-y divide-border"
          >
            {sortedRides.map((ride, index) => (
              <motion.div
                key={ride.id.toString()}
                variants={itemVariants}
                data-ocid={`ride_log.item.${index + 1}`}
              >
                <Link
                  to="/rides/$rideId"
                  params={{ rideId: ride.id.toString() }}
                  className="group grid grid-cols-[1fr_auto_auto_auto_auto] md:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-4 py-4 hover:bg-primary/5 transition-colors items-center"
                >
                  <span className="font-display font-bold text-foreground group-hover:text-primary transition-colors truncate">
                    {ride.name}
                  </span>
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {ride.date}
                  </span>
                  <span className="text-sm text-foreground font-medium whitespace-nowrap">
                    {ride.distanceKm.toFixed(1)} km
                  </span>
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatDuration(ride.durationMinutes)}
                  </span>
                  <StarRatingDisplay rating={Number(ride.rating)} size={12} />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
}
