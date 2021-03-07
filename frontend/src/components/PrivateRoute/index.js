import React from 'react'
import { Spin } from "antd"
import { Route, Redirect } from 'react-router-dom'
import { useAuth } from "../contextConfig";

/**
 * Protects a component from being accessed by users that are not logged in
 * or do not have the correct role.
 *
 * In case a user is not logged in, the user is redirected to the login page.
 *
 * In case a user is logged in but does not have the correct role,
 * the user is redirect to the home page.
 *
 * @param children: The component(s) that need to be protected.
 * @param requiredRoles: A list of roles that can access the route.
 * @param rest: Props that are send to the React Router Route component.
 */
export default function PrivateRoute({children, requiredRoles, ...rest}) {
    // Get authentication status
    const auth = useAuth();

    /**
     * Gets the component that will be rendered based on the user status.
     * @param location: The url location from where this route is redirected from.
     */
    const getComponent = ({location}) => {
        if (auth.verifyRole(requiredRoles)) {
            // The user is logged in and has the correct role
            return children;
        } else if (auth.state.status === 'pending') {
            // The user status is currently being requested from the backend server
            return (
                <div
                  style={{
                    display: "flex",
                    height: "100%",
                    width: "100%",
                    background: "white",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                    <Spin size="large" />
                </div>
            )
        } else if (auth.state.user === null) {
            // The user is logged out
            return (
                <Redirect
                    to={{
                        pathname: "/login",
                        state: { from: location }
                    }}
                />
            )
        } else {
            // The user does not have the correct roles
            return (
               <Redirect
                    to={{
                        pathname: "/",
                        state: { from: location }
                    }}
                />
            )
        }
    }

    return (
        <Route
            {...rest}
            render={( location ) =>
                getComponent(location)
            }
        />
    );
}