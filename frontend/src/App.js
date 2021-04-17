import "./App.css";
import React, { Component } from "react";
import "antd/dist/antd.css";

import AppLayout from "./components/AppLayout";
import { AuthProvider } from "./components/contextConfig";

/**
 * The main react component for the application.
 */
export default class App extends Component {
  render() {
    return (
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    );
  }
}
