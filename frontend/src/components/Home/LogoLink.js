import React from "react";
import { Button, Image, Layout, Typography } from "antd";
import { Link } from "react-router-dom";
const { Text } = Typography;

/**
 * Displays a logo with a title and a description.
 *
 * Next to the logo is button which links to a component.
 *
 * @param image: Image to display with the link.
 * @param title: Title to display next to the image.
 * @param description: Text to display under the title.
 * @param to: Link to which the button should redirect the user to.
 */
export default function LogoLink({ image, title, description, to }) {
  return (
    <Layout
      style={{
        flexDirection: "row",
        alignItems: "center",
        display: "flex",
        marginBottom: 50,
        width: "100%",
        backgroundColor: "white",
      }}
    >
      <Image
        style={{ marginRight: 20 }}
        preview={false}
        width={100}
        src={image}
      />
      <Layout style={{ flexDirection: "column", backgroundColor: "white" }}>
        <Text style={{ fontWeight: "bold", fontSize: "18" }}>{title}</Text>
        <Text style={{ fontSize: " 14" }}>{description}</Text>
      </Layout>
      <Layout
        style={{
          alignItems: "flex-end",
          backgroundColor: "white",
          marginLeft: 20,
        }}
      >
        <Button id="dataButton" type="primary">
          <Link to={to}>Go</Link>
        </Button>
      </Layout>
    </Layout>
  );
}
