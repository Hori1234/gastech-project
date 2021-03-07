import React, { Component } from "react";
import "../Css/DataVisualization.css";
import { Button} from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import axios from "axios";

/**
 * Export the first ride reports class.
 */
export default class FirstRideButton extends Component {
  
  /**
   * Download first ride reports of selected planning.
   * @param {Id} value 
   */
  downloadFile = (value) => {
      console.log(value);
    return axios
      .get(`/api/reports/firstrides/${value}`, { responseType: 'arraybuffer' })
      .then((response) => {
       const url = window.URL.createObjectURL(new Blob([response.data]));
       const link = document.createElement("a");
       link.href = url;
       link.setAttribute("download", response.headers["content-disposition"].split("filename=")[1]);
       document.body.appendChild(link);
       link.click();
    });
  }

  /**
   * Renders the download first rides report button.
   */
  render() {
    return (
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              size={"large"}
              style={{ width: "100%" }}
              onClick={() => this.downloadFile(this.props.orderNumber)}
            >
              Download First-Rides
            </Button>
    );
  }
}
