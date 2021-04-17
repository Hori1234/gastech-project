import React, { Component } from "react";
import { AuthContext } from "../contextConfig.js";
import { Layout, Divider } from "antd";
import LogoLink from "./LogoLink";
import "antd/dist/antd.css";

/**
 * Displays the main menu component.
 *
 * The main menu displays a set of links with logo,
 * which redirect to other places in the application.
 *
 * Which links are displayed depends on the currently logged in user.
 */
export default class Home extends Component {
  render() {
    return (
      <AuthContext.Consumer>
        {(context) => (
          <Layout
            style={{
              flexDirection: "row",
              alignItems: "center",
              display: "flex",
              justifyContent: "space-around",
              backgroundColor: "white",
            }}
          >
            <Layout
              style={{
                alignItems: "flex-start",
                display: "flex",
                justifyContent: "space-around",
                marginBottom: 50,
                marginRight: 100,
                backgroundColor: "white",
                marginLeft: 30,
              }}
            >
              <LogoLink
                image={require("../Images/view-planning.svg")}
                title={"View Planning"}
                description={"View the planning that was created for today"}
                to={"/view"}
              />
              <LogoLink
                image={require("../Images/Data Analytics.webp")}
                title={"Monthly Data Analytics"}
                description={
                  "View statistical data about this and past plannings"
                }
                to={"/monthly"}
              />
              {(context.state.user.role === "planner" ||
                context.state.user.role === "administrator") && (
                <>
                  <LogoLink
                    image={require("../Images/Data Visualisation.webp")}
                    title={"Data Visualisation"}
                    description={"View charts of the supplied data"}
                    to={"/data"}
                  />
                </>
              )}
            </Layout>
            <Layout
              style={{
                height: "50vh",
                alignItems: "flex-end",
                backgroundColor: "white",
              }}
            >
              <Divider
                type="vertical"
                style={{ height: "50vh", marginRight: 20 }}
              />
            </Layout>
            <Layout
              style={{
                justifyContent: "space-around",
                marginBottom: 50,
                display: "flex",
                alignItems: "flex-start",
                backgroundColor: "white",
                marginRight: 30,
              }}
            >
              {(context.state.user.role === "planner" ||
                context.state.user.role === "administrator") && (
                <>
                  <LogoLink
                    image={require("../Images/upload-file.svg")}
                    title={"Upload Documents"}
                    description={
                      "Upload the documents for the creation of the plannings"
                    }
                    to={"/upload"}
                  />
                  <LogoLink
                    image={require("../Images/23_generate_value_for_investors_rapid_growth_planning-512.svg")}
                    title={"Create Planning"}
                    description={"Manual and automatic creation of a planning"}
                    to={"/planning"}
                  />
                </>
              )}
              {context.state.user.role === "administrator" && (
                <LogoLink
                  image={require("../Images/1635626-200.png")}
                  title={"Account Management"}
                  description={
                    "Manage roles, usernames, and passwords for all users"
                  }
                  to={"/account"}
                />
              )}
            </Layout>
          </Layout>
        )}
      </AuthContext.Consumer>
    );
  }
}
