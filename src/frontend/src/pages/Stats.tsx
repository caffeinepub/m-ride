import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllRides, useGetStats } from "@/hooks/useQueries";
import {
  AlertCircle,
  Award,
  BarChart2,
  Clock,
  Hash,
  Loader2,
  MapPin,
  TrendingUp,
} from "lucide-react";
import { type Variants, motion } from "motion/react";

function formatTotalTime(minutes: bigint): string {
  const totalMins = Number(minutes);
  const hrs = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  if (hrs === 0) return `${mins} min`;
  if (mins === 0) return `${hrs} hrs`;
  return `${hrs}h ${mins}m`;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function Stats() {
  const { data: stats, isLoading, isError } = useGetStats();
  const { data: rides } = useGetAllRides();

  // Compute local derived stats
  const avgRating =
    rides && rides.length > 0
      ? (
          rides.reduce((sum, r) => sum + Number(r.rating), 0) / rides.length
        ).toFixed(1)
      : null;

  const totalHours = stats
    ? (Number(stats.totalDurationMinutes) / 60).toFixed(1)
    : null;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-2">
          Your Numbers
        </p>
        <h1 className="font-display font-black text-4xl md:text-5xl text-foreground leading-none tracking-tight flex items-center gap-3">
          <BarChart2 size={36} className="text-primary" />
          Statistics
        </h1>
      </div>

      {isLoading && (
        <div
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
          data-ocid="stats.loading_state"
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-36 bg-card rounded-lg" />
          ))}
        </div>
      )}

      {isError && (
        <div
          data-ocid="stats.error_state"
          className="card-industrial rounded-lg p-12 text-center space-y-3"
        >
          <AlertCircle size={32} className="mx-auto text-destructive" />
          <p className="font-medium">Failed to load stats</p>
        </div>
      )}

      {stats && (
        <motion.div
          data-ocid="stats.section"
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-10"
        >
          {/* Primary stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <motion.div variants={itemVariants}>
              <BigStat
                icon={<Hash size={20} />}
                label="Total Rides"
                value={Number(stats.totalRides).toString()}
                unit="rides"
                accent
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <BigStat
                icon={<MapPin size={20} />}
                label="Total Distance"
                value={stats.totalDistanceKm.toFixed(0)}
                unit="km"
              />
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="col-span-2 md:col-span-1"
            >
              <BigStat
                icon={<Clock size={20} />}
                label="Total Time"
                value={totalHours ?? "0"}
                unit="hours"
              />
            </motion.div>
          </div>

          {/* Divider with label */}
          <motion.div variants={itemVariants} className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Averages & Records
              </span>
            </div>
          </motion.div>

          {/* Secondary stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <motion.div variants={itemVariants}>
              <BigStat
                icon={<TrendingUp size={20} />}
                label="Avg Distance"
                value={stats.avgDistanceKm.toFixed(1)}
                unit="km/ride"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <BigStat
                icon={<Award size={20} />}
                label="Longest Ride"
                value={stats.longestRideKm.toFixed(0)}
                unit="km"
              />
            </motion.div>
            {avgRating && (
              <motion.div
                variants={itemVariants}
                className="col-span-2 md:col-span-1"
              >
                <BigStat
                  icon={<span className="text-base">⭐</span>}
                  label="Avg Rating"
                  value={avgRating}
                  unit="/ 5"
                />
              </motion.div>
            )}
          </div>

          {/* Longest ride highlight */}
          {stats.longestRideName && (
            <motion.div variants={itemVariants}>
              <div className="card-industrial rounded-lg p-6 flex items-center justify-between gap-6">
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    🏆 Longest Ride
                  </p>
                  <p className="font-display font-black text-2xl text-foreground">
                    {stats.longestRideName}
                  </p>
                  <p className="text-primary font-medium">
                    {stats.longestRideKm.toFixed(1)} km
                  </p>
                </div>
                <div className="flex-shrink-0 text-5xl opacity-30">🏍️</div>
              </div>
            </motion.div>
          )}

          {/* Time breakdown */}
          {Number(stats.totalRides) > 0 && (
            <motion.div variants={itemVariants}>
              <div className="space-y-3">
                <h3 className="font-display font-bold text-sm uppercase tracking-widest text-muted-foreground">
                  Time Breakdown
                </h3>
                <div className="card-industrial rounded-lg p-5 space-y-4">
                  <TimeRow
                    label="Total duration"
                    value={formatTotalTime(stats.totalDurationMinutes)}
                  />
                  <TimeRow label="As hours" value={`${totalHours} hours`} />
                  <TimeRow
                    label="Avg per ride"
                    value={
                      Number(stats.totalRides) > 0
                        ? formatTotalTime(
                            BigInt(
                              Math.round(
                                Number(stats.totalDurationMinutes) /
                                  Number(stats.totalRides),
                              ),
                            ),
                          )
                        : "—"
                    }
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Empty state if no rides */}
          {Number(stats.totalRides) === 0 && (
            <motion.div
              variants={itemVariants}
              className="card-industrial rounded-lg p-16 text-center space-y-4"
            >
              <div className="text-6xl opacity-20">📊</div>
              <p className="font-display font-bold text-xl">No data yet</p>
              <p className="text-sm text-muted-foreground">
                Log some rides to see your stats here.
              </p>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}

function BigStat({
  icon,
  label,
  value,
  unit,
  accent = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`card-industrial rounded-lg p-5 space-y-3 ${accent ? "border-primary/30" : ""}`}
    >
      <div className="flex items-center gap-2">
        <span className={accent ? "text-primary" : "text-muted-foreground"}>
          {icon}
        </span>
        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="flex items-end gap-2">
        <span
          className={`font-display font-black text-3xl md:text-4xl leading-none ${
            accent ? "text-primary" : "text-foreground"
          }`}
        >
          {value}
        </span>
        <span className="text-sm text-muted-foreground mb-1">{unit}</span>
      </div>
    </div>
  );
}

function TimeRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-display font-bold text-foreground">{value}</span>
    </div>
  );
}
