import React, { Component } from "react";
import {
  Upload,
  message,
  Row,
  Col,
  Card,
  Layout,
  Typography,
  Image,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";

const { Dragger } = Upload;
const { Text } = Typography;

export default class UploadButton extends Component {

  render() {
    const props = {
      name: "file_1",
      multiple: false,
      action: "/api/sheets/",
      onChange(info) {
        const { status } = info.file;
        if (status !== "uploading") {
          console.log(info.file, info.fileList);
        }
        if (status === "done") {
          message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === "error") {
          message.error(`${info.file.name} file upload failed.`);
          if (info.file.response.code === 400) {
            message.error(info.file.response.message);
          } else {
            if (info.file.response.code === 422) {
              const object = JSON.parse(
                JSON.stringify(info.file.response.errors)
              );
              message.error(JSON.stringify(object));
            } else {
              message.error(`Bad Request.`);
            }
          }
        }
      },
    };

    return (
      <Layout style={{ backgroundColor: "white" }}>
        <Card>
          <Layout
            style={{
              flexDirection: "row",
              backgroundColor: "white",
            }}
          >
            <Image
              style={{ marginRight: 20 }}
              preview={false}
              width={100}
              src={require("../Images/upload-file.svg")}
            />
            <Layout
              style={{
                flexDirection: "column",
                backgroundColor: "white",
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: "18" }}>
                Upload Documents
                </Text>
              <Text style={{ fontSize: " 14" }}>
                Upload the documents for the creation of the plannings
                </Text>
            </Layout>
          </Layout>
        </Card>

        <Layout style={{ backgroundColor: "white" }}>
          <Row gutter={16}>
            <Col span={12}>
              <Card title="Upload Order List" bordered={false}>
                <Row gutter={[16, 24]}>
                  <Col className="gutter-row">
                    <Dragger id='dragger' {...props}>
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">
                        Click or drag file to this area to upload
                        </p>
                      <p className="ant-upload-hint">
                        Support for a single or bulk upload. Strictly
                        prohibit from uploading company data or other band
                        files
                        </p>
                    </Dragger>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Upload Truck Availibility" bordered={false}>
                <Row gutter={[16, 24]}>
                  <Col className="gutter-row">
                    <Dragger {...props}>
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">
                        Click or drag file to this area to upload
                        </p>
                      <p className="ant-upload-hint">
                        Support for a single or bulk upload. Strictly
                        prohibit from uploading company data or other band
                        files
                        </p>
                    </Dragger>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Layout>
      </Layout>
    );
  }
}
