import React, {Component} from "react";
import Timeline from "./Timeline"
import FirstRideButton from "./FirstRideButton"
import "../Css/DataVisualization.css";
import {Row, Col, Layout, Button, message, Popconfirm} from "antd";
import "antd/dist/antd.css";
import axios from "axios";

/**
 * Export the data visualisation class.
 */
export default class DataVisualization extends Component {

    /**
     * Publish planning.
     * @param {Truck sheet Id} value 
     * @param {Order sheet Id} value1 
     */
    publishLatest = (value, value1) => {
        return axios
            .post(`/api/plannings/${value}/${value1}`)
            .then((res) => {
                if (res.status === 200) {
                    message.success("Planning: Published successfully");
                }
                return true;
            })
            .catch((error) => {
                this.setState((state) => ({
                    ...state,
                    status: "error",
                    error: error,
                }));
                message.error("Unauthorized: " + error.response.data.message);
                return false;
            });
    };

    /**
     * Renders the data visualisation page
     */
    render() {
        return (
            <Layout
                style={{
                    display: "flex",
                    height: "100%",
                    width: "100%",
                    background: "white"
                }}
            >
                <Timeline timeline="latest"/>
                <Row>
                    <Col span={6}>
                        <FirstRideButton orderNumber="latest"/>
                    </Col>
                    <Col span={4} offset={14}>
                        <Popconfirm
                            title="Are you sure you want to publish this planning?"
                            onConfirm={() => this.publishLatest('latest', 'latest')}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="primary" size={"large"} style={{width: "100%"}}>
                                Publish
                            </Button>
                        </Popconfirm>
                    </Col>
                </Row>
            </Layout>
        );
    }
}
