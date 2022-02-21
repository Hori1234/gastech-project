import React, { Suspense, lazy } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import PrivateRoute from "../PrivateRoute";
import { Spin } from "antd";
const UploadButton = lazy(() => import("../UploadButton/UploadButton"));
const AccountManagementLayout = lazy(() =>
  import("../AccountManagerLayout/AccountManagementLayout")
);
const Logout = lazy(() => import("../Logout/Logout"));
const Home = lazy(() => import("../Home/Home"));

const HierarchicalLayout = lazy(() =>
  import("../HierarchicalLayout/hierarchicallayout")
);

const ExploratoryLayout = lazy(() =>
  import("../ExploratoryLayout/exploratorylayout")
);

const StatisticsLayout = lazy(() =>
  import("../StatisticsLayout/statisticslayout")
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
          path="/"
          exact
          requiredRoles={["view-only", "planner", "administrator"]}
        >
          <Home />
        </PrivateRoute>
        <PrivateRoute
          path="/expl"
          exact
          requiredRoles={["planner", "administrator"]}
        >
          <ExploratoryLayout />
        </PrivateRoute>
        <PrivateRoute
          path="/hierarch"
          exact
          requiredRoles={["planner", "administrator"]}
        >
          <HierarchicalLayout />
        </PrivateRoute>
        <PrivateRoute
          path="/stats"
          exact
          requiredRoles={["planner", "administrator"]}
        >
          <StatisticsLayout />
        </PrivateRoute>
        <Route>
          <Redirect to="/" />
        </Route>
      </Switch>
    </Suspense>
  );
}
