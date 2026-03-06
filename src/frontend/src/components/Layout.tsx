import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@tanstack/react-router";
import { BarChart2, Bike, List, Plus } from "lucide-react";
import { motion } from "motion/react";

const navItems = [
  { to: "/", label: "Dashboard", icon: Bike, ocid: "nav.dashboard.link" },
  { to: "/rides", label: "Ride Log", icon: List, ocid: "nav.rides.link" },
  { to: "/stats", label: "Stats", icon: BarChart2, ocid: "nav.stats.link" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = router.state.location.pathname;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <img
                  src="/assets/generated/mride-logo-transparent.dim_120x120.png"
                  alt="M Ride"
                  className="w-9 h-9 object-contain"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span
                  className="font-display font-black text-xl tracking-tight text-foreground"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  M <span className="text-primary">RIDE</span>
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                  Track Every Mile
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.to === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    data-ocid={item.ocid}
                    className={`
                      flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-150 relative
                      ${
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }
                    `}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute inset-0 bg-primary/10 border border-primary/20"
                        style={{ borderRadius: "var(--radius)" }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                    <Icon size={15} />
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* CTA button */}
            <Link to="/rides/new">
              <Button
                size="sm"
                className="hidden md:flex items-center gap-2 font-display font-bold tracking-wide uppercase text-xs bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-sm transition-shadow hover:shadow-glow"
              >
                <Plus size={14} />
                Log a Ride
              </Button>
            </Link>

            {/* Mobile nav */}
            <div className="md:hidden flex items-center gap-2">
              <Link to="/rides/new">
                <Button
                  size="icon"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 w-8"
                >
                  <Plus size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile bottom nav */}
        <div className="md:hidden border-t border-border">
          <div className="flex items-center justify-around">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.to === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  data-ocid={item.ocid}
                  className={`
                    flex flex-col items-center gap-1 px-4 py-3 text-xs font-medium transition-colors
                    ${isActive ? "text-primary" : "text-muted-foreground"}
                  `}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container max-w-6xl mx-auto px-4 py-8">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="container max-w-6xl mx-auto px-4">
          <p className="text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Built with ♥ using caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
