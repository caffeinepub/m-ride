import { StarRatingDisplay } from "@/components/StarRating";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllRides, useGetStats } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import {
  Bike,
  ChevronRight,
  Clock,
  MapPin,
  Plus,
  TrendingUp,
} from "lucide-react";
import { type Variants, motion } from "motion/react";

function formatDuration(minutes: bigint): string {
  const totalMins = Number(minutes);
  const hrs = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  if (hrs === 0) return `${mins}m`;
  if (mins === 0) return `${hrs}h`;
  return `${hrs}h ${mins}m`;
}

function formatDistance(km: number): string {
  return `${km.toFixed(1)} km`;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export function Dashboard() {
  const { data: rides, isLoading: ridesLoading } = useGetAllRides();
  const { data: stats, isLoading: statsLoading } = useGetStats();

  const recentRides = rides
    ? [...rides].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5)
    : [];

  return (
    <div className="space-y-10">
      {/* Hero Header */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-2"
      >
        <motion.div variants={itemVariants}>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-2">
            Your Riding Journey
          </p>
          <h1 className="font-display font-black text-4xl md:text-5xl text-foreground leading-none tracking-tight">
            Dashboard
          </h1>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link to="/rides/new">
            <Button
              size="lg"
              data-ocid="dashboard.log_ride.primary_button"
              className="mt-4 font-display font-bold uppercase tracking-wide bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow transition-all hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus size={18} className="mr-2" />
              Log a Ride
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-3 gap-4"
      >
        <motion.div variants={itemVariants}>
          <StatCard
            icon={<Bike size={20} />}
            label="Total Rides"
            value={
              statsLoading
                ? null
                : stats
                  ? Number(stats.totalRides).toString()
                  : "0"
            }
            unit="rides"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            icon={<MapPin size={20} />}
            label="Total Distance"
            value={
              statsLoading
                ? null
                : stats
                  ? stats.totalDistanceKm.toFixed(0)
                  : "0"
            }
            unit="km"
          />
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="col-span-2 md:col-span-1"
        >
          <StatCard
            icon={<Clock size={20} />}
            label="Time in Saddle"
            value={
              statsLoading
                ? null
                : stats
                  ? (Number(stats.totalDurationMinutes) / 60).toFixed(1)
                  : "0"
            }
            unit="hours"
          />
        </motion.div>
      </motion.div>

      {/* Recent Rides */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <TrendingUp size={18} className="text-primary" />
            <h2 className="font-display font-bold text-xl uppercase tracking-wide">
              Recent Rides
            </h2>
          </div>
          <Link
            to="/rides"
            className="text-xs text-primary hover:text-primary/80 font-medium uppercase tracking-wide flex items-center gap-1 transition-colors"
          >
            View All <ChevronRight size={12} />
          </Link>
        </motion.div>

        {ridesLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full bg-card" />
            ))}
          </div>
        ) : recentRides.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="card-industrial rounded-lg p-12 text-center space-y-4"
          >
            <div className="text-5xl opacity-20">🏍️</div>
            <p className="text-muted-foreground font-medium">
              No rides logged yet.
            </p>
            <p className="text-sm text-muted-foreground/70">
              Hit the road and log your first ride.
            </p>
            <Link to="/rides/new">
              <Button
                variant="outline"
                size="sm"
                className="border-primary/30 text-primary hover:bg-primary/10"
              >
                <Plus size={14} className="mr-1" /> Log First Ride
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-2">
            {recentRides.map((ride, index) => (
              <motion.div key={ride.id.toString()} variants={itemVariants}>
                <Link
                  to="/rides/$rideId"
                  params={{ rideId: ride.id.toString() }}
                  className="group"
                >
                  <div className="card-industrial rounded-lg p-4 hover:border-primary/40 transition-all duration-150 hover:bg-card/80 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="flex-shrink-0 w-8 h-8 rounded bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <span className="text-primary text-xs font-display font-bold">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-display font-bold text-foreground truncate group-hover:text-primary transition-colors">
                          {ride.name}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                          <span>{ride.date}</span>
                          <span className="text-border">•</span>
                          <span>{formatDistance(ride.distanceKm)}</span>
                          <span className="text-border">•</span>
                          <span>{formatDuration(ride.durationMinutes)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <StarRatingDisplay
                        rating={Number(ride.rating)}
                        size={12}
                      />
                      <ChevronRight
                        size={14}
                        className="text-muted-foreground group-hover:text-primary transition-colors"
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  unit,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null;
  unit: string;
}) {
  return (
    <div className="card-industrial rounded-lg p-5 space-y-3">
      <div className="flex items-center gap-2 text-primary">
        {icon}
        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
      </div>
      {value === null ? (
        <Skeleton className="h-10 w-24 bg-muted" />
      ) : (
        <div className="flex items-end gap-2">
          <span className="font-display font-black text-3xl md:text-4xl text-foreground leading-none">
            {value}
          </span>
          <span className="text-sm text-muted-foreground mb-1 font-medium">
            {unit}
          </span>
        </div>
      )}
    </div>
  );
}
