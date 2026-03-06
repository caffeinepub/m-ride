import { Star } from "lucide-react";

interface StarRatingDisplayProps {
  rating: number;
  size?: number;
}

export function StarRatingDisplay({
  rating,
  size = 14,
}: StarRatingDisplayProps) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= rating
              ? "text-primary fill-primary"
              : "text-muted-foreground/30"
          }
        />
      ))}
    </div>
  );
}

interface StarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
  "data-ocid"?: string;
}

export function StarRatingInput({
  value,
  onChange,
  "data-ocid": ocid,
}: StarRatingInputProps) {
  return (
    <div className="flex items-center gap-1" data-ocid={ocid}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="p-1 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-primary"
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
        >
          <Star
            size={24}
            className={
              star <= value
                ? "text-primary fill-primary"
                : "text-muted-foreground/40 hover:text-primary/60"
            }
          />
        </button>
      ))}
    </div>
  );
}
