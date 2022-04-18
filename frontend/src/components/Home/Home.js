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
                marginLeft: 10,
              }}
            >
              {(context.state.user.role === "planner" ||
                context.state.user.role === "administrator") && (
                <>
                  <LogoLink
                    image={require("../Images/Data Visualisation.webp")}
                    title={"Information panel"}
                    description={
                      "This view contains all the redable information related to this data challenge."
                    }
                    to={"/stats"}
                  />
                  <LogoLink
                    image={require("../Images/view-planning.svg")}
                    title={"Daily Overview"}
                    description={
                      "This page contains visualizaitons based on the daily connections and similarities between the employees."
                    }
                    to={"/expl"}
                  />
                  <LogoLink
                    image={require("../Images/Data Analytics.webp")}
                    title={"General Overview"}
                    description={
                      "This page contains visualizaitons based on the general connections between the employees."
                    }
                    to={"/hierarch"}
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
                marginRight: 20,
              }}
            >
              
              {context.state.user.role === "administrator" && (
                <LogoLink
                  image={require("../Images/1635626-200.png")}
                  title={"Account Management"}
                  description={
                    "Modify/add/delete of the accounts"
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
