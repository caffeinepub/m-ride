import { StarRatingDisplay } from "@/components/StarRating";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteRide, useGetRide } from "@/hooks/useQueries";
import { useRouter } from "@tanstack/react-router";
import {
  AlertCircle,
  Calendar,
  ChevronLeft,
  Clock,
  Edit2,
  FileText,
  Loader2,
  MapPin,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

interface RideDetailProps {
  rideId: bigint;
}

function formatDuration(minutes: bigint): string {
  const totalMins = Number(minutes);
  const hrs = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  if (hrs === 0) return `${mins} min`;
  if (mins === 0) return `${hrs} hr`;
  return `${hrs} hr ${mins} min`;
}

export function RideDetail({ rideId }: RideDetailProps) {
  const router = useRouter();
  const { data: ride, isLoading, isError } = useGetRide(rideId);
  const deleteMutation = useDeleteRide();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(rideId);
      toast.success("Ride deleted.");
      router.navigate({ to: "/rides" });
    } catch {
      toast.error("Failed to delete ride.");
    }
    setDeleteOpen(false);
  };

  if (isLoading) {
    return (
      <div
        className="max-w-2xl mx-auto space-y-6"
        data-ocid="ride_log.loading_state"
      >
        <Skeleton className="h-12 w-48 bg-card" />
        <div className="card-industrial rounded-lg p-8 space-y-6">
          <Skeleton className="h-8 w-3/4 bg-muted" />
          <Skeleton className="h-6 w-1/2 bg-muted" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-20 bg-muted" />
            <Skeleton className="h-20 bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !ride) {
    return (
      <div className="max-w-2xl mx-auto" data-ocid="ride_log.error_state">
        <div className="card-industrial rounded-lg p-12 text-center space-y-3">
          <AlertCircle size={32} className="mx-auto text-destructive" />
          <p className="font-display font-bold text-xl">Ride not found</p>
          <p className="text-sm text-muted-foreground">
            This ride may have been deleted.
          </p>
          <Button
            variant="outline"
            className="border-border"
            onClick={() => router.navigate({ to: "/rides" })}
          >
            <ChevronLeft size={14} className="mr-1" />
            Back to Ride Log
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Back link */}
      <button
        type="button"
        onClick={() => router.navigate({ to: "/rides" })}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
      >
        <ChevronLeft size={16} />
        Ride Log
      </button>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-2">
              {ride.date}
            </p>
            <h1 className="font-display font-black text-3xl md:text-4xl text-foreground leading-tight">
              {ride.name}
            </h1>
            <div className="mt-3">
              <StarRatingDisplay rating={Number(ride.rating)} size={18} />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              data-ocid="ride_detail.edit.button"
              onClick={() =>
                router.navigate({
                  to: "/rides/$rideId/edit",
                  params: { rideId: rideId.toString() },
                })
              }
              className="border-border hover:border-primary/50 hover:text-primary transition-colors font-medium"
            >
              <Edit2 size={14} className="mr-1.5" />
              Edit
            </Button>

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  data-ocid="ride_detail.delete.button"
                  className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive transition-colors font-medium"
                >
                  <Trash2 size={14} className="mr-1.5" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent
                data-ocid="ride_detail.delete_confirm.dialog"
                className="bg-card border-border"
              >
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-display font-bold text-xl">
                    Delete this ride?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-muted-foreground">
                    <strong className="text-foreground">{ride.name}</strong>{" "}
                    will be permanently removed. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    data-ocid="ride_detail.delete_confirm.cancel_button"
                    className="border-border hover:bg-muted font-medium"
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    data-ocid="ride_detail.delete_confirm.confirm_button"
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-display font-bold uppercase tracking-wide"
                  >
                    {deleteMutation.isPending ? (
                      <Loader2 size={14} className="mr-2 animate-spin" />
                    ) : (
                      <Trash2 size={14} className="mr-2" />
                    )}
                    Delete Ride
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <DetailStat
            icon={<MapPin size={16} />}
            label="Distance"
            value={`${ride.distanceKm.toFixed(1)} km`}
          />
          <DetailStat
            icon={<Clock size={16} />}
            label="Duration"
            value={formatDuration(ride.durationMinutes)}
          />
          <DetailStat
            icon={<Calendar size={16} />}
            label="Date"
            value={ride.date}
            className="col-span-2 md:col-span-1"
          />
        </div>

        {/* Speed estimate */}
        {Number(ride.durationMinutes) > 0 && (
          <div className="card-industrial rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1">
                Avg Speed
              </p>
              <p className="font-display font-black text-2xl text-foreground">
                {(
                  ride.distanceKm /
                  (Number(ride.durationMinutes) / 60)
                ).toFixed(1)}{" "}
                <span className="text-base font-normal text-muted-foreground">
                  km/h
                </span>
              </p>
            </div>
            <div className="w-12 h-12 rounded bg-primary/10 border border-primary/20 flex items-center justify-center">
              <span className="text-primary text-xl">⚡</span>
            </div>
          </div>
        )}

        {/* Notes */}
        {ride.notes && (
          <div className="card-industrial rounded-lg p-5 space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText size={14} />
              <span className="text-xs font-medium uppercase tracking-widest">
                Notes
              </span>
            </div>
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
              {ride.notes}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function DetailStat({
  icon,
  label,
  value,
  className = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`card-industrial rounded-lg p-4 space-y-2 ${className}`}>
      <div className="flex items-center gap-2 text-primary">
        {icon}
        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
      </div>
      <p className="font-display font-bold text-xl text-foreground">{value}</p>
    </div>
  );
}
