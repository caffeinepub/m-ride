import type { Ride } from "@/backend.d";
import { StarRatingInput } from "@/components/StarRating";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateRide, useGetRide, useUpdateRide } from "@/hooks/useQueries";
import { useRouter } from "@tanstack/react-router";
import { Loader2, PenLine, Save, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface RideFormProps {
  editId?: bigint | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface FormData {
  name: string;
  date: string;
  distanceKm: string;
  durationMinutes: string;
  notes: string;
  rating: number;
}

const today = new Date().toISOString().split("T")[0];

const defaultForm: FormData = {
  name: "",
  date: today,
  distanceKm: "",
  durationMinutes: "",
  notes: "",
  rating: 3,
};

function rideToForm(ride: Ride): FormData {
  return {
    name: ride.name,
    date: ride.date,
    distanceKm: ride.distanceKm.toString(),
    durationMinutes: Number(ride.durationMinutes).toString(),
    notes: ride.notes,
    rating: Number(ride.rating),
  };
}

export function RideForm({ editId, onSuccess, onCancel }: RideFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(defaultForm);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const isEdit = editId != null;
  const { data: existingRide, isLoading: rideLoading } = useGetRide(
    editId ?? null,
  );

  const createMutation = useCreateRide();
  const updateMutation = useUpdateRide();
  const isPending = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (existingRide) {
      setForm(rideToForm(existingRide));
    }
  }, [existingRide]);

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.date) newErrors.date = "Date is required";
    if (!form.distanceKm || Number(form.distanceKm) <= 0)
      newErrors.distanceKm = "Enter a valid distance";
    if (!form.durationMinutes || Number(form.durationMinutes) <= 0)
      newErrors.durationMinutes = "Enter valid duration";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: form.name.trim(),
      date: form.date,
      distanceKm: Number(form.distanceKm),
      durationMinutes: BigInt(Math.round(Number(form.durationMinutes))),
      notes: form.notes.trim(),
      rating: BigInt(form.rating),
    };

    try {
      if (isEdit && editId != null) {
        await updateMutation.mutateAsync({ id: editId, ...payload });
        toast.success("Ride updated!");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Ride logged!");
      }
      if (onSuccess) {
        onSuccess();
      } else {
        router.navigate({ to: "/rides" });
      }
    } catch {
      toast.error("Something went wrong. Try again.");
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.history.back();
    }
  };

  if (isEdit && rideLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="animate-spin text-primary" size={28} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
      >
        {/* Header */}
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-2">
            {isEdit ? "Update Ride" : "New Entry"}
          </p>
          <h1 className="font-display font-black text-4xl md:text-5xl text-foreground leading-none tracking-tight flex items-center gap-3">
            <PenLine size={32} className="text-primary" />
            {isEdit ? "Edit Ride" : "Log a Ride"}
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card-industrial rounded-lg p-6 space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-xs font-medium uppercase tracking-widest text-muted-foreground"
              >
                Ride Name *
              </Label>
              <Input
                id="name"
                data-ocid="add_ride.name.input"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="e.g. Morning Mountain Run"
                className="bg-background border-border focus:border-primary transition-colors font-medium"
                autoComplete="off"
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label
                htmlFor="date"
                className="text-xs font-medium uppercase tracking-widest text-muted-foreground"
              >
                Date *
              </Label>
              <Input
                id="date"
                data-ocid="add_ride.date.input"
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, date: e.target.value }))
                }
                className="bg-background border-border focus:border-primary transition-colors"
              />
              {errors.date && (
                <p className="text-xs text-destructive">{errors.date}</p>
              )}
            </div>

            {/* Distance + Duration row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="distance"
                  className="text-xs font-medium uppercase tracking-widest text-muted-foreground"
                >
                  Distance (km) *
                </Label>
                <Input
                  id="distance"
                  data-ocid="add_ride.distance.input"
                  type="number"
                  min="0"
                  step="0.1"
                  value={form.distanceKm}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, distanceKm: e.target.value }))
                  }
                  placeholder="0.0"
                  className="bg-background border-border focus:border-primary transition-colors"
                />
                {errors.distanceKm && (
                  <p className="text-xs text-destructive">
                    {errors.distanceKm}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="duration"
                  className="text-xs font-medium uppercase tracking-widest text-muted-foreground"
                >
                  Duration (mins) *
                </Label>
                <Input
                  id="duration"
                  data-ocid="add_ride.duration.input"
                  type="number"
                  min="0"
                  value={form.durationMinutes}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, durationMinutes: e.target.value }))
                  }
                  placeholder="0"
                  className="bg-background border-border focus:border-primary transition-colors"
                />
                {errors.durationMinutes && (
                  <p className="text-xs text-destructive">
                    {errors.durationMinutes}
                  </p>
                )}
              </div>
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Rating
              </Label>
              <StarRatingInput
                value={form.rating}
                onChange={(v) => setForm((f) => ({ ...f, rating: v }))}
                data-ocid="add_ride.rating.select"
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label
                htmlFor="notes"
                className="text-xs font-medium uppercase tracking-widest text-muted-foreground"
              >
                Notes
              </Label>
              <Textarea
                id="notes"
                data-ocid="add_ride.notes.textarea"
                value={form.notes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notes: e.target.value }))
                }
                placeholder="Route conditions, highlights, memorable moments..."
                rows={4}
                className="bg-background border-border focus:border-primary transition-colors resize-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              type="submit"
              data-ocid="add_ride.submit_button"
              disabled={isPending}
              className="font-display font-bold uppercase tracking-wide bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-sm hover:shadow-glow transition-all flex-1 md:flex-none"
            >
              {isPending ? (
                <Loader2 size={16} className="mr-2 animate-spin" />
              ) : (
                <Save size={16} className="mr-2" />
              )}
              {isPending ? "Saving..." : isEdit ? "Update Ride" : "Save Ride"}
            </Button>
            <Button
              type="button"
              variant="outline"
              data-ocid="add_ride.cancel_button"
              onClick={handleCancel}
              disabled={isPending}
              className="border-border hover:bg-muted font-medium"
            >
              <X size={16} className="mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
