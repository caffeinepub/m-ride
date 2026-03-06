import { Layout } from "@/components/Layout";
import { Toaster } from "@/components/ui/sonner";
import { Dashboard } from "@/pages/Dashboard";
import { RideDetail } from "@/pages/RideDetail";
import { RideForm } from "@/pages/RideForm";
import { RideLog } from "@/pages/RideLog";
import { Stats } from "@/pages/Stats";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

// Root route with layout
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Layout>
        <Outlet />
      </Layout>
      <Toaster
        theme="dark"
        toastOptions={{
          style: {
            background: "oklch(0.16 0.006 30)",
            border: "1px solid oklch(0.25 0.008 30)",
            color: "oklch(0.94 0.008 60)",
          },
        }}
      />
    </>
  ),
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Dashboard,
});

const ridesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/rides",
  component: RideLog,
});

const newRideRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/rides/new",
  component: () => <RideForm />,
});

const rideDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/rides/$rideId",
  component: () => {
    const { rideId } = rideDetailRoute.useParams();
    return <RideDetail rideId={BigInt(rideId)} />;
  },
});

const editRideRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/rides/$rideId/edit",
  component: () => {
    const { rideId } = editRideRoute.useParams();
    return <RideForm editId={BigInt(rideId)} />;
  },
});

const statsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/stats",
  component: Stats,
});

const routeTree = rootRoute.addChildren([
  dashboardRoute,
  ridesRoute,
  newRideRoute,
  rideDetailRoute,
  editRideRoute,
  statsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
