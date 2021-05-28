import React, { Component } from "react";
import {
  Layout,
  Divider,
  Button,
  Image,
  Typography,
  Input,
  Col,
  Row,
  Progress,
} from "antd";
import { UserOutlined, UserSwitchOutlined } from "@ant-design/icons";
import CsvDownload from "react-json-to-csv";
import { getColumnOrder } from "./columnDataOrderOTMD";
import EditableTableOrder from "../ManualPlanning/EditableTableOrder";
import csvDownload from "json-to-csv-export";

const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;
const { Text } = Typography;
const converter = require("json-2-csv");
const writeFileP = require("write-file-p");

var currentpage = 1;
var perpage = 100;
var jsondata = [];

const WooCommerce = new WooCommerceRestApi({
  url: "https://otmd.ro/", // Your store URL
  consumerKey: "ck_fcfaa3cc125f86d2ee468f969adad3fd9066c509", // Your consumer key
  consumerSecret: "cs_b007e92159551cf6bf495b03e4f09c1b28419df7", // Your consumer secret
  version: "wc/v3", // WooCommerce WP REST API version
  queryStringAuth: true,
});
export default class WoocomerceOTMDcn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: getColumnOrder(),
      orderID: "",
      vpage: "",
      vperpage: "",
      mockData: {
        id: null,
        status: null,
        currency: null,
        total: null,
        number_of_items: null,
        name_of_item: null,
        date_created: null,
        billing_first_name: null,
        billing_last_name: null,
        billing_company_name: null,
        billing_addr_1: null,
        billing_addr_2: null,
        billing_city: null,
        billing_company: null,
        billing_country: null,
        billing_email: null,
        billing_phone: null,
        billing_postcode: null,
        billing_state: null,
        billing_first_name_and_last_name: null,
        billing_domeniu_pentru_medii: null,
        billing_statutul_profesional_m: null,
        billing_cod_de_identificare: null,
        customer_note: null,
        shipping_first_name: null,
        shipping_last_name: null,
        shipping_company_name: null,
        shipping_addr_1: null,
        shipping_addr_2: null,
        shipping_city: null,
        shipping_company: null,
        shipping_country: null,
        shipping_email: null,
        shipping_phone: null,
        shipping_postcode: null,
        shipping_state: null,
      },
      result: [],
      downloadabledata: [],
      number_of_pages: null,
      number_of_orders: null,
      progress_status: 0,
    };
  }

  componentDidMount() {
    //this.setState({ startingColumns: this.state.columns });
    //this.getOrderList(currentpage, perpage);
  }

  getAllOrdersToExcel = async (vpage, vperpage, nrpages) => {
    var current_status = 100 / nrpages;
    var status = 0;
    this.setState((state) => ({
      progress_status: status,
    }));
    while (vpage <= nrpages) {
      await WooCommerce.get("orders", {
        page: vpage,
        per_page: vperpage, // 20 products per page
      }).then((response) => {
        // Successful request
        jsondata = [];

        response.data.forEach((element) => {
          this.setState((prevState) => {
            let mockData = Object.assign({}, prevState.mockData); // creating copy of state variable Metadata
            mockData.id = element["id"];
            mockData.status = element["status"];
            mockData.currency = element["currency"];
            mockData.total = element["total"];
            mockData.number_of_items = element["line_items"][0]["quantity"];
            mockData.name_of_item = element["line_items"][0]["name"];
            mockData.date_created = element["date_created"];
            mockData.billing_first_name = element["billing"]["first_name"];
            mockData.billing_last_name = element["billing"]["last_name"];
            mockData.billing_company_name = element["billing"]["company_name"];
            mockData.billing_company = element["billing"]["company"];
            mockData.billing_addr_1 = element["billing"]["address_1"];
            mockData.billing_addr_2 = element["billing"]["address_2"];
            mockData.billing_city = element["billing"]["city"];
            mockData.billing_country = element["billing"]["country"];
            mockData.billing_email = element["billing"]["email"];
            mockData.billing_phone = element["billing"]["phone"];
            mockData.billing_postcode = element["billing"]["postcode"];
            mockData.billing_state = element["billing"]["state"];
            mockData.billing_first_name_and_last_name =
              element["meta_data"][0]["value"];
            mockData.billing_domeniu_pentru_medii =
              element["meta_data"][1]["value"];
            mockData.billing_statutul_profesional_m =
              element["meta_data"][2]["value"];
            mockData.billing_cod_de_identificare =
              element["meta_data"][3]["value"];
            mockData.customer_note = element["customer_note"];
            mockData.shipping_first_name = element["shipping"]["first_name"];
            mockData.shipping_last_name = element["shipping"]["last_name"];
            mockData.shipping_company_name =
              element["shipping"]["company_name"];
            mockData.shipping_company = element["shipping"]["company"];
            mockData.shipping_addr_1 = element["shipping"]["address_1"];
            mockData.shipping_addr_2 = element["shipping"]["address_2"];
            mockData.shipping_city = element["shipping"]["city"];
            mockData.shipping_country = element["shipping"]["country"];
            mockData.shipping_email = element["shipping"]["email"];
            mockData.shipping_phone = element["shipping"]["phone"];
            mockData.shipping_postcode = element["shipping"]["postcode"];
            mockData.shipping_state = element["shipping"]["state"];

            return { mockData }; // return new object Metadata object
          });
          //console.log(this.state.mockData);
          //console.log("push data in jsondata");
          jsondata.push(this.state.mockData);
        });
        const newData = this.state.downloadabledata.concat(jsondata);
        status = this.state.progress_status + current_status;
        this.setState((state) => ({
          downloadabledata: newData,
          progress_status: status,
        }));
      });
      vpage = vpage + 1;
    }

    csvDownload(this.state.downloadabledata);
  };

  getOrderList = async (vpage, vperpage) => {
    WooCommerce.get("orders", {
      page: vpage,
      per_page: vperpage, // 20 products per page
    })
      .then((response) => {
        // Successful request
        jsondata = [];
        console.log("Response Status:", response.status);
        console.log("Response Headers:", response.headers);
        console.log("Response Data:", response.data);
        console.log("Total of pages:", response.headers["x-wp-totalpages"]);
        console.log("Total of items:", response.headers["x-wp-total"]);
        console.log("Enter loop");

        response.data.forEach((element) => {
          this.setState((prevState) => {
            let mockData = Object.assign({}, prevState.mockData); // creating copy of state variable Metadata
            mockData.id = element["id"];
            mockData.status = element["status"];
            mockData.currency = element["currency"];
            mockData.total = element["total"];
            mockData.number_of_items = element["line_items"][0]["quantity"];
            mockData.name_of_item = element["line_items"][0]["name"];
            mockData.date_created = element["date_created"];
            mockData.billing_first_name = element["billing"]["first_name"];
            mockData.billing_last_name = element["billing"]["last_name"];
            mockData.billing_company_name = element["billing"]["company_name"];
            mockData.billing_company = element["billing"]["company"];
            mockData.billing_addr_1 = element["billing"]["address_1"];
            mockData.billing_addr_2 = element["billing"]["address_2"];
            mockData.billing_city = element["billing"]["city"];
            mockData.billing_country = element["billing"]["country"];
            mockData.billing_email = element["billing"]["email"];
            mockData.billing_phone = element["billing"]["phone"];
            mockData.billing_postcode = element["billing"]["postcode"];
            mockData.billing_state = element["billing"]["state"];
            mockData.billing_first_name_and_last_name =
              element["meta_data"][0]["value"];
            mockData.billing_domeniu_pentru_medii =
              element["meta_data"][1]["value"];
            mockData.billing_statutul_profesional_m =
              element["meta_data"][2]["value"];
            mockData.billing_cod_de_identificare =
              element["meta_data"][3]["value"];
            mockData.customer_note = element["customer_note"];
            mockData.shipping_first_name = element["shipping"]["first_name"];
            mockData.shipping_last_name = element["shipping"]["last_name"];
            mockData.shipping_company_name =
              element["shipping"]["company_name"];
            mockData.shipping_company = element["shipping"]["company"];
            mockData.shipping_addr_1 = element["shipping"]["address_1"];
            mockData.shipping_addr_2 = element["shipping"]["address_2"];
            mockData.shipping_city = element["shipping"]["city"];
            mockData.shipping_country = element["shipping"]["country"];
            mockData.shipping_email = element["shipping"]["email"];
            mockData.shipping_phone = element["shipping"]["phone"];
            mockData.shipping_postcode = element["shipping"]["postcode"];
            mockData.shipping_state = element["shipping"]["state"];

            return { mockData }; // return new object Metadata object
          });
          //console.log(this.state.mockData);
          //console.log("push data in jsondata");
          jsondata.push(this.state.mockData);
        });

        //console.log(jsondata);
        this.setState({
          result: jsondata,
          number_of_orders: response.headers["x-wp-total"],
          number_of_pages: response.headers["x-wp-totalpages"],
          vpage: vpage,
          vperpage: vperpage,
        });
      })
      .catch((error) => {
        // Invalid request, for 4xx and 5xx statuses
      })
      .finally(() => {
        // Always executed.
      });
  };

  getOrder = async (id) => {
    WooCommerce.get(`orders/${id}`)
      .then((response) => {
        // Successful request
        jsondata = [];
        console.log("Response Status:", response.status);
        console.log("Response Headers:", response.headers);
        console.log("Response Data:", response.data);
        console.log("Total of pages:", response.headers["x-wp-totalpages"]);
        console.log("Total of items:", response.headers["x-wp-total"]);
        console.log("Enter loop");
        var element = response.data;
        this.setState((prevState) => {
          let mockData = Object.assign({}, prevState.mockData); // creating copy of state variable Metadata
          mockData.id = element["id"];
          mockData.status = element["status"];
          mockData.currency = element["currency"];
          mockData.total = element["total"];
          mockData.number_of_items = element["line_items"][0]["quantity"];
          mockData.date_created = element["date_created"];
          mockData.billing_first_name = element["billing"]["first_name"];
          mockData.billing_last_name = element["billing"]["last_name"];
          mockData.billing_company_name = element["billing"]["company_name"];
          mockData.billing_company = element["billing"]["company"];
          mockData.billing_addr_1 = element["billing"]["address_1"];
          mockData.billing_addr_2 = element["billing"]["address_2"];
          mockData.billing_city = element["billing"]["city"];
          mockData.billing_country = element["billing"]["country"];
          mockData.billing_email = element["billing"]["email"];
          mockData.billing_phone = element["billing"]["phone"];
          mockData.billing_postcode = element["billing"]["postcode"];
          mockData.billing_state = element["billing"]["state"];
          mockData.billing_first_name_and_last_name =
            element["meta_data"][0]["value"];
          mockData.billing_domeniu_pentru_medii =
            element["meta_data"][1]["value"];
          mockData.billing_statutul_profesional_m =
            element["meta_data"][2]["value"];
          mockData.billing_cod_de_identificare =
            element["meta_data"][3]["value"];
          mockData.customer_note = element["customer_note"];
          mockData.shipping_first_name = element["shipping"]["first_name"];
          mockData.shipping_last_name = element["shipping"]["last_name"];
          mockData.shipping_company_name = element["shipping"]["company_name"];
          mockData.shipping_company = element["shipping"]["company"];
          mockData.shipping_addr_1 = element["shipping"]["address_1"];
          mockData.shipping_addr_2 = element["shipping"]["address_2"];
          mockData.shipping_city = element["shipping"]["city"];
          mockData.shipping_country = element["shipping"]["country"];
          mockData.shipping_email = element["shipping"]["email"];
          mockData.shipping_phone = element["shipping"]["phone"];
          mockData.shipping_postcode = element["shipping"]["postcode"];
          mockData.shipping_state = element["shipping"]["state"];

          return { mockData }; // return new object Metadata object
        });
        jsondata.push(this.state.mockData);

        //console.log(jsondata);
        this.setState({
          result: jsondata,
        });
      })
      .catch((error) => {})
      .finally(() => {
        // Always executed.
      });
  };

  handleChangeOrderID = (event) => {
    this.setState({
      orderID: event.target.value,
    });
  };
  handleChangePage = (event) => {
    this.setState({
      vpage: event.target.value,
    });
  };
  handleChangePerPage = (event) => {
    this.setState({
      vperpage: event.target.value,
    });
  };

  render() {
    return (
      <Layout style={{ width: "100%", height: "100%" }}>
        <Layout
          style={{
            justifyContent: "space-around",
            display: "flex",
            alignItems: "flex-start",
            backgroundColor: "white",
            width: "100%",
          }}
        >
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
              width={70}
              src={require("../Images/upload-file.svg")}
            />
            <Layout
              style={{ flexDirection: "column", backgroundColor: "white" }}
            >
              <Text style={{ fontWeight: "bold", fontSize: "18" }}>
                Get Order list
              </Text>
              <Text style={{ fontSize: " 14" }}>
                Prin aceasta functie vei putea descarca lista cu toti clientii
                website-ului din woocomerce
              </Text>
            </Layout>
            <Layout
              style={{
                alignItems: "flex-end",
                backgroundColor: "white",
                flexDirection: "row",
              }}
            >
              <Layout
                style={{
                  backgroundColor: "white",
                  marginRight: 15,
                }}
              >
                <Input
                  value={this.state.vpage}
                  onChange={this.handleChangePage}
                  placeholder="Numar pagina"
                  prefix={<UserOutlined />}
                />
                <Text
                  style={{
                    marginRight: 10,
                  }}
                >
                  Pagina curenta: {this.state.vpage} din{" "}
                  {this.state.number_of_pages}
                </Text>
              </Layout>

              <Layout
                style={{
                  backgroundColor: "white",
                  marginRight: 75,
                }}
              >
                <Input
                  value={this.state.vperpage}
                  onChange={this.handleChangePerPage}
                  placeholder="Itemi per pagina"
                  prefix={<UserOutlined />}
                />
                <Text
                  style={{
                    marginRight: 10,
                  }}
                >
                  Numarul maxim : {this.state.vperpage}
                </Text>
              </Layout>

              <Layout
                style={{
                  backgroundColor: "white",
                  flexDirection: "row",
                  marginBottom: 20,
                }}
              >
                <Button
                  id="dataButton"
                  type="primary"
                  onClick={() => {
                    this.getOrderList(this.state.vpage, this.state.vperpage);
                    csvDownload(this.state.result);
                  }}
                >
                  {" "}
                  Descarca Pagina Curent{" "}
                </Button>
                <Button
                  style={{
                    marginLeft: 10,
                  }}
                  id="dataButton"
                  type="primary"
                  onClick={() =>
                    this.getAllOrdersToExcel(
                      1,
                      perpage,
                      this.state.number_of_pages
                    )
                  }
                >
                  {" "}
                  Descarca Toate Paginile{" "}
                </Button>
              </Layout>

              {/* <CsvDownload data={this.state.downloadabledata} /> */}
            </Layout>
          </Layout>
          <Progress
            style={{ marginTop: -20 }}
            percent={this.state.progress_status}
          />
          <Divider />
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
              width={70}
              src={require("../Images/upload-file.svg")}
            />
            <Layout
              style={{ flexDirection: "column", backgroundColor: "white" }}
            >
              <Text style={{ fontWeight: "bold", fontSize: "18" }}>
                Get Order Info
              </Text>
              <Text style={{ fontSize: " 14" }}>
                Prin aceasta functie vei putea descarca toate datele clientului
                cu id-ul ales de tine din woocomerce{" "}
              </Text>
            </Layout>
            <Layout
              style={{
                alignItems: "flex-end",
                backgroundColor: "white",
                flexDirection: "row",
              }}
            >
              <Input
                style={{
                  marginRight: 30,
                }}
                value={this.state.orderID}
                onChange={this.handleChangeOrderID}
                placeholder="Id comanda"
                prefix={<UserOutlined />}
              />
              <Button
                id="dataButton"
                type="primary"
                onClick={() => this.getOrder(this.state.orderID)}
              >
                {" "}
                Date Comanda{" "}
              </Button>
              <Button
                id="dataButton"
                type="primary"
                style={{ marginLeft: 20 }}
                onClick={() =>
                  this.getOrderList(this.state.vpage, this.state.vperpage)
                }
              >
                {" "}
                Date Comenzi{" "}
              </Button>
            </Layout>
          </Layout>
        </Layout>

        <Layout>
          <EditableTableOrder
            dataSource={this.state.result}
            columns={this.state.columns}
            setData={this.setData}
          />
        </Layout>
      </Layout>
    );
  }
}
