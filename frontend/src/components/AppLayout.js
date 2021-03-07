import React from "react";
import NavigationLayout from "./NavigationLayout/NavigationLayout";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SignInComponent from "./SignIn/SignInComponent";
import PrivateRoute from "./PrivateRoute";

/**
 * The main application layout.
 *
 * In case a user is not logged in, they are redirected to the login page.
 *
 * In case a user is logged in, they are redirected to the page from which
 * they logged out from (in the current session).
 */
const AppLayout = () => {
  return (
    <Router>
      <Switch>
        <Route path="/login">
          <SignInComponent />
        </Route>
        <PrivateRoute
          path="/"
          requiredRoles={["view-only", "planner", "administrator"]}
        >
          <NavigationLayout />
        </PrivateRoute>
      </Switch>
    </Router>
  );
};

export default AppLayout;
