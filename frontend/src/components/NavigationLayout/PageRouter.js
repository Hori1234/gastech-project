import React, { Suspense, lazy } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import PrivateRoute from "../PrivateRoute";
import { Spin } from "antd";
const UploadButton = lazy(() => import("../UploadButton/UploadButton"));
const AccountManagementLayout = lazy(() =>
  import("../AccountManagerLayout/AccountManagementLayout")
);
const Logout = lazy(() => import("../Logout/Logout"));
const ManualPlanning = lazy(() => import("../ManualPlanning/ManualPlanning"));
const ViewPlanning = lazy(() =>
  import("../ViewPlanningPageLayout/ViewPlanning")
);
const DataVisualization = lazy(() =>
  import("../DataVisualization/DataVisualization")
);
const MonthlyDataAnalytics = lazy(() =>
  import("../MonthlyDataAnalytics/MonthlyDataAnalytics")
);
const Home = lazy(() => import("../Home/Home"));
const WoocomerceComponent = lazy(() =>
  import("../WooComerceLayout/WoocomerceComponent")
);
const WoocomerceOTMDcn = lazy(() =>
  import("../WooComerceLayout/WoocomerceOTMDcn")
);
const WoocomerceOTMDse = lazy(() =>
  import("../WooComerceLayout/WoocomerceOTMDse")
);

/**
 * Defines the routing for the pages in the NavigationLayout component.
 *
 * A private route only shows the component if the logged in user has the correct role.
 *
 * If a url is not matched with one of the routes, the user is redirected to the homepage.
 */
export default function PageRouter() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: "flex",
            height: "100%",
            width: "100%",
            background: "white",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spin size="large" />
        </div>
      }
    >
      <Switch>
        <PrivateRoute
          path="/upload"
          requiredRoles={["planner", "administrator"]}
        >
          <UploadButton />
        </PrivateRoute>
        <PrivateRoute path="/account" requiredRoles={["administrator"]}>
          <AccountManagementLayout />
        </PrivateRoute>
        <Route path="/logout">
          <Logout />
        </Route>
        <PrivateRoute
          path="/planning"
          requiredRoles={["planner", "administrator"]}
        >
          <ManualPlanning />
        </PrivateRoute>
        <PrivateRoute
          path="/view"
          requiredRoles={["view-only", "planner", "administrator"]}
        >
          <ViewPlanning />
        </PrivateRoute>
        <PrivateRoute path="/data" requiredRoles={["planner", "administrator"]}>
          <DataVisualization />
        </PrivateRoute>
        <PrivateRoute
          path="/monthly"
          requiredRoles={["view-only", "planner", "administrator"]}
        >
          <MonthlyDataAnalytics />
        </PrivateRoute>
        <PrivateRoute
          path="/"
          exact
          requiredRoles={["view-only", "planner", "administrator"]}
        >
          <Home />
        </PrivateRoute>
        <PrivateRoute
          path="/woocomcn"
          exact
          requiredRoles={["planner", "administrator"]}
        >
          <WoocomerceOTMDcn />
        </PrivateRoute>
        <PrivateRoute
          path="/woocomse"
          exact
          requiredRoles={["planner", "administrator"]}
        >
          <WoocomerceOTMDse />
        </PrivateRoute>
        <PrivateRoute
          path="/woocom"
          exact
          requiredRoles={["planner", "administrator"]}
        >
          <WoocomerceComponent />
        </PrivateRoute>
        <Route>
          <Redirect to="/" />
        </Route>
      </Switch>
    </Suspense>
  );
}
