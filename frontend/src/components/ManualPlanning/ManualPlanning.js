import React, { Component } from "react";
import {
  Layout,
  Button,
  Row,
  Col,
  Select,
  Menu,
  Input,
  Checkbox,
  Dropdown,
  Modal,
  Form,
  message,
  Popconfirm,
} from "antd";
import axios from "axios";
import EditableTableOrder from "./EditableTableOrder";
import AddOrdersLayout from "./AddOrdersLayout";
import AddTruckLayout from "./AddTruckLayout";
import EditableTableTruck from "./EditableTableTruck";
import "./ManualPlanning.css";
import { getColumnTruck } from "./columnDataTruck";
import { getColumnOrder } from "./columnDataOrder";

const { Option } = Select;

export default class ManualPlanning extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOrdersRowKeys: [],
      selectedTrucksRowKeys: [],
      columnFilter: [],
      columnTruckFilter: [],
      isVisible: false,
      isTruckVisible: false,
      departure_time: "",
      columns: getColumnOrder(),
      columns2: getColumnTruck(),

      data: [],
      data2: [],
      startingColumns: [],
      startingTruckColumns: [],
      AOVisible: false,
      ATVisible: false,
      AssignModal: false,
      magnifyOrders: false,
      magnifyTrucks: false,
      status: "",
      newOrder: {
        order_number: "",
        inl: "",
        latest_dept_time: "",
        truck_type: "",
        hierarchy: "",
        delivery_deadline: "",
        driving_time: "",
        process_time: "",
        service_time: "",
      },
      newTruck: {
        truck_id: "",
        truck_snumber: "",
        availability: "",
        truck_type: "",
        terminal: "",
        hierarchy: "",
        use_cost: "",
        starting: "",
        date: "",
        owner: "",
        driver: "",
        remarks: "",
        business_type: "",
      },
      temp: [],
      originalOrders: [],
      originalTrucks: [],
    };
  }

  handleChangeDepartureTime = (event) => {
    this.setState({
      departure_time: event.target.value,
    });
  };

  componentDidMount() {
    this.setState({ startingColumns: this.state.columns });
    this.setState({ startingTruckColumns: this.state.columns2 });
    this.getOrderList("latest");
    this.getTruckList("latest");
  }

  setData = (e) => {
    this.setState({ data: e });
  };

  setData2 = (e) => {
    this.setState({ data2: e });
  };

  changeVisibility = (isTrue) => {
    this.setState({ isVisible: isTrue });
  };

  changeTruckVisibility = (isTrue) => {
    this.setState({ isTruckVisible: isTrue });
  };

  filterColumns = (e) => {
    var columnFilter = this.state.columnFilter;
    if (e.target.checked) {
      columnFilter = columnFilter.filter((current) => {
        return current !== e.target.id;
      });
    } else if (!e.target.checked) {
      columnFilter.push(e.target.id);
    }
    var final = this.state.startingColumns;
    for (let i = 0; i < columnFilter.length; i++)
      final = final.filter((current) => {
        return current.dataIndex !== columnFilter[i];
      });
    this.setState({ columns: final, columnFilter: columnFilter });
  };

  filterTruckColumns = (e) => {
    var columnTruckFilter = this.state.columnTruckFilter;
    if (e.target.checked) {
      columnTruckFilter = columnTruckFilter.filter((current) => {
        return current !== e.target.id;
      });
    } else if (!e.target.checked) {
      columnTruckFilter.push(e.target.id);
    }
    var final = this.state.startingTruckColumns;
    for (let i = 0; i < columnTruckFilter.length; i++)
      final = final.filter((current) => {
        return current.dataIndex !== columnTruckFilter[i];
      });
    this.setState({ columns2: final, columnFilter: columnTruckFilter });
  };

  changeDataOrders = (d) => {
    if (d === "Both") {
      this.setState({
        data: this.state.originalOrders,
        data2: this.state.originalTrucks,
      });
    } else if (d === "ITV") {
      this.getItvOrder(this.state.originalOrders);
      this.getItvTruck(this.state.originalTrucks);
    } else if (d === "KAT") {
      this.getKatOrder(this.state.originalOrders);
      this.getKatTruck(this.state.originalTrucks);
    }
  };

  getItvTruck = (e) => {
    let itvDataTruck = [];
    e.forEach((element) => {
      if (element.terminal === "ITV") {
        itvDataTruck.push(element);
      }
    });
    this.setState({ data2: itvDataTruck });
  };

  getKatTruck = (e) => {
    let katDataTruck = [];
    e.forEach((element) => {
      if (element.terminal === "KAT") {
        katDataTruck.push(element);
      }
    });
    this.setState({ data2: katDataTruck });
  };

  getItvOrder = (e) => {
    let itvData = [];
    e.forEach((element) => {
      if (element.inl_terminal === "ITV") {
        itvData.push(element);
      }
    });
    this.setState({ data: itvData });
  };

  getKatOrder = (e) => {
    let katData = [];
    e.forEach((element) => {
      if (element.inl_terminal === "KAT") {
        katData.push(element);
      }
    });
    this.setState({ data: katData });
  };

  selectOrdersRow = (record) => {
    const selectedOrdersRowKeys = [...this.state.selectedOrdersRowKeys];
    if (selectedOrdersRowKeys.indexOf(record.key) >= 0) {
      selectedOrdersRowKeys.splice(
        selectedOrdersRowKeys.indexOf(record.key),
        1
      );
    } else {
      selectedOrdersRowKeys.push(record.key);
    }
    const selectedOrderType = record.truck_type;
    this.setState({ selectedOrdersRowKeys, selectedOrderType });
  };

  onSelectedOrdersRowKeysChange = (
    selectedOrdersRowKeys,
    selectedOrderType
  ) => {
    this.setState({ selectedOrdersRowKeys, selectedOrderType });
  };

  selectTrucksRow = (record) => {
    const selectedTrucksRowKeys = [...this.state.selectedTrucksRowKeys];
    if (selectedTrucksRowKeys.indexOf(record.key) >= 0) {
      selectedTrucksRowKeys.splice(
        selectedTrucksRowKeys.indexOf(record.key),
        1
      );
    } else {
      selectedTrucksRowKeys.push(record.key);
    }
    const selectedTruckType = record.truck_type;
    this.setState({ selectedTrucksRowKeys, selectedTruckType });
  };

  onSelectedTrucksRowKeysChange = (
    selectedTrucksRowKeys,
    selectedTruckType
  ) => {
    this.setState({ selectedTrucksRowKeys, selectedTruckType });
  };

  showAssignModal = () => {
    if (this.state.selectedTrucksRowKeys.length === 0) {
      message.error("Please select a truck to assign an order to.");
    } else if (this.state.selectedTrucksRowKeys.length > 1) {
      message.error(
        "You have selected more than 1 truck. Please select only 1 truck."
      );
    } else if (this.state.selectedOrdersRowKeys.length > 1) {
      message.error(
        "You have selected more than 1 order. Please select only 1 order."
      );
    } else if (this.state.selectedOrdersRowKeys.length === 0) {
      message.error("Please select one or more orders.");
    } else if (
      (this.state.selectedOrderType[0].truck_type === "port" &&
        this.state.selectedTruckType[0].truck_type === "terminal") ||
      (this.state.selectedOrderType[0].truck_type === "regional" &&
        this.state.selectedTruckType[0].truck_type === "terminal") ||
      (this.state.selectedOrderType[0].truck_type === "port" &&
        this.state.selectedTruckType[0].truck_type === "regional")
    ) {
      message.error("Truck type cannot execute the selected order type.");
    } else {
      this.setState({
        AssignModal: true,
      });
    }
  };
  ShowTruckModal = () => {
    this.setState({
      ATVisible: true,
    });
  };
  showOrdersModal = () => {
    this.setState({
      AOVisible: true,
    });
  };
  magnifyOrdersModal = () => {
    this.setState({
      magnifyOrders: true,
    });
  };
  magnifyTrucksModal = () => {
    this.setState({
      magnifyTrucks: true,
    });
  };
  handleOk = () => {
    this.setState({
      AOVisible: false,
      ATVisible: false,
    });
  };
  handleCancel = (e) => {
    this.setState({
      AOVisible: false,
      ATVisible: false,
      AssignModal: false,
    });
  };
  okMagnify = (e) => {
    this.setState({ magnifyOrders: false, magnifyTrucks: false });
  };
  cancelMagnify = (e) => {
    this.setState({ magnifyOrders: false, magnifyTrucks: false });
  };
  truckRowColor = (e) => {
    if (e === "regional") {
      return "table-row-regional";
    } else if (e === "terminal") {
      return "table-row-terminal";
    } else if (e === "port") {
      return "table-row-port";
    }
  };

  //API Calls ============================================================>

  deleteOrder = (value) => {
    return axios
      .delete(`/api/orders/${value}`)
      .then((res) => {
        if (res.status === 204) {
          message.success("Order succesfully deleted");
        }
        return true;
      })
      .catch((error) => {
        this.setState((state) => ({
          ...state,
          status: "error",
          error: error,
        }));
        if (error.response.status === 404) {
          message.error("Not Found: " + error.response.data.message);
        } else {
          if (error.response.status === 401) {
            message.error(
              "Unauthorized Action: " + error.response.data.message
            );
          } else {
            message.error(
              "Service Unavailable: " + error.response.data.message
            );
          }
        }
        return false;
      });
  };
  deleteOrderById = (info) => {
    info.forEach((id) => {
      this.deleteOrder(id);
      const filteredData = this.state.data.filter((item) => item.id !== id);
      this.setState({ data: filteredData });
    });
    this.getOrderList("latest");
  };
  deleteTruck = (value) => {
    return axios
      .delete(`/api/trucks/${value}`)
      .then((res) => {
        if (res.status === 204) {
          message.success("Truck succesfully deleted");
        }
        this.getTruckList("latest");
        return true;
      })
      .catch((error) => {
        this.setState((state) => ({
          ...state,
          status: "error",
          error: error,
        }));
        if (error.response.status === 404) {
          message.error("Not Found: " + error.response.data.message);
        }
        if (error.response.status === 401) {
          message.error("Unauthorized Action: " + error.response.data.message);
        } else {
          message.error("Service Unavailable: " + error.response.data.message);
        }
        return false;
      });
  };
  deleteTruckById = (data) => {
    data.forEach((id) => {
      this.deleteTruck(id);
      const filteredData = this.state.data2.filter((item) => item.id !== id);
      this.setState({ data2: filteredData });
    });
    this.getTruckList("latest");
  };

  //Adding the truck and the order
  addTruck = (value) => {
    this.getTruckInfo();
    const data = this.refs.addTrucks.createTruckData();
    return axios
      .post(`/api/trucks/sheet/${value}`, data)
      .then((res) => {
        if (res.status === 200) {
          message.success("Truck: added succesfully");
        }
        this.getTruckList("latest");
        this.handleOk();
        return true;
      })
      .catch((error) => {
        this.setState((state) => ({
          ...state,
          status: "error",
          error: error,
        }));
        if (error.response.status === 401) {
          message.error("Unauthorized: " + error.response.data.message);
        } else {
          if (error.response.status === 404) {
            message.error("Not Found: " + error.response.data.message);
          } else {
            if (error.response.status === 422) {
              message.error(
                "	Unprocessable Entity: " + error.response.data.message
              );
            } else {
              message.error(error.response.data.message);
            }
          }
        }
        return false;
      });
  };
  addOrder = (value) => {
    this.getOrderInfo();
    const data = this.refs.addOrders.createOrderData();
    return axios
      .post(`/api/orders/sheet/${value}`, data)
      .then((res) => {
        if (res.status === 200) {
          message.success("Order:  added succesfully");
        }
        this.handleOk();
        this.getOrderList("latest");
        return true;
      })
      .catch((error) => {
        this.setState((state) => ({
          ...state,
          status: "error",
          error: error,
        }));
        if (error.response.status === 401) {
          message.error("Unauthorized: " + error.response.data.message);
        } else {
          if (error.response.status === 404) {
            message.error("Not Found: " + error.response.data.message);
          } else {
            if (error.response.status === 422) {
              message.error(
                "	Unprocessable Entity: " + error.response.data.message
              );
            } else {
              message.error(error.response.data.message);
            }
          }
        }
        return false;
      });
  };

  getOrderList = async (value) => {
    return axios
      .get(`/api/orders/sheet/${value}`)
      .then((res) => {
        var outarray = [];
        for (var i = 0; i < res.data.orders.length; i++) {
          var temp = {
            key: res.data.orders[i]["order_number"],
            Container: res.data.orders[i]["Container"],
            "Unit type": res.data.orders[i]["Unit type"],
            Booking: res.data.orders[i]["Booking"],
            "Ship. comp.": res.data.orders[i]["Ship. comp."],
            Terminal: res.data.orders[i]["Terminal"],
            Truck: res.data.orders[i]["Truck"],
            Pickup: res.data.orders[i]["Pickup"],
            order_number: res.data.orders[i]["order_number"],
            Status: res.data.orders[i]["Status"],
            inl_terminal: res.data.orders[i]["inl_terminal"],
            Gate: res.data.orders[i]["Gate"],
            Time: res.data.orders[i]["Time"],
            "Max. departure": res.data.orders[i]["Max. departure"],
            "Time (1)": res.data.orders[i]["Time (1)"],
            latest_dep_time: res.data.orders[i]["latest_dep_time"],
            "Truck Used": res.data.orders[i]["Truck Used"],
            truck_type: res.data.orders[i]["truck_type"],
            hierarchy: res.data.orders[i]["hierarchy"],
            City: res.data.orders[i]["City"],
            "L/D": res.data.orders[i]["L/D"],
            Date: res.data.orders[i]["Date"],
            "Time (2)": res.data.orders[i]["Time (2)"],
            delivery_deadline: res.data.orders[i]["delivery_deadline"],
            driving_time: res.data.orders[i]["driving_time"],
            process_time: res.data.orders[i]["process_time"],
            service_time: res.data.orders[i]["service_time"],
            Reference: res.data.orders[i]["Reference"],
            "Truck (1)": res.data.orders[i]["Truck (1)"],
            "Gate (1)": res.data.orders[i]["Gate (1)"],
            "Time (3)": res.data.orders[i]["Time (3)"],
            "Inl. ter. (1)": res.data.orders[i]["Inl. ter. (1)"],
            "Gross (kgs)": res.data.orders[i]["Gross (kgs)"],
            "Temperature °C": res.data.orders[i]["Temperature °C"],
            Seal: res.data.orders[i]["Seal"],
            "Truck (2)": res.data.orders[i]["Truck (2)"],
            "Voyage/inland carrier":
              res.data.orders[i]["Voyage/inland carrier"],
            "Terminal (1)": res.data.orders[i]["Terminal (1)"],
            Closing: res.data.orders[i]["Closing"],
            POD: res.data.orders[i]["POD"],
            "Invoice reference": res.data.orders[i]["Invoice reference"],
            "Tariff type": res.data.orders[i]["Tariff type"],
            G: res.data.orders[i]["G"],
            F: res.data.orders[i]["F"],
            Positie: res.data.orders[i]["Positie"],
            Delay: res.data.orders[i]["Delay"],
            Weight: res.data.orders[i]["Weight"],
            departure_time: res.data.orders[i]["departure_time"],
            truck_id: res.data.orders[i]["truck_id"],
          };
          outarray.push(temp);
        }
        this.setState((state) => ({
          ...state,
          data: outarray,
          originalOrders: outarray,
          status: "success",
        }));
        return true;
      })
      .catch((error) => {
        this.setState((state) => ({
          ...state,
          status: "error",
          error: error,
        }));
        return false;
      });
  };
  getTruckList = async (value) => {
    return axios
      .get(`/api/trucks/sheet/${value}`)
      .then((res) => {
        var outarray = [];
        for (var i = 0; i < res.data.trucks.length; i++) {
          var temp = {
            key: res.data.trucks[i]["s_number"],
            truck_id: res.data.trucks[i]["truck_id"],
            s_number: res.data.trucks[i]["s_number"],
            availability: res.data.trucks[i]["availability"],
            truck_type: res.data.trucks[i]["truck_type"],
            business_type: res.data.trucks[i]["business_type"],
            Driver: res.data.trucks[i]["Driver"],
            terminal: res.data.trucks[i]["terminal"],
            Owner: res.data.trucks[i]["Owner"],
            hierarchy: res.data.trucks[i]["hierarchy"],
            use_cost: res.data.trucks[i]["use_cost"],
            date: res.data.trucks[i]["date"],
            starting_time: res.data.trucks[i]["starting_time"],
            Remarks: res.data.trucks[i]["Remarks"],
          };
          outarray.push(temp);
        }

        this.setState((state) => ({
          ...state,
          data2: outarray,
          originalTrucks: outarray,
          status: "success",
        }));
        return true;
      })
      .catch((error) => {
        this.setState((state) => ({
          ...state,
          status: "error",
          error: error,
        }));
        return false;
      });
  };

  //setting the new orders and the new truck
  setNewOrder = (vON, vInl, vLDT, vTT, vH, vDD, vDT, vPT, vST) => {
    this.setState((prevState) => {
      let newOrder = Object.assign({}, prevState.newOrder); // creating copy of state variable newOrder
      newOrder.order_number = vON;
      newOrder.inl = vInl;
      newOrder.latest_dept_time = vLDT;
      newOrder.truck_type = vTT;
      newOrder.hierarchy = vH;
      newOrder.delivery_deadline = vDD;
      newOrder.driving_time = vDT;
      newOrder.process_time = vPT;
      newOrder.service_time = vST;
      return { newOrder }; // return new object newOrder object
    });
  };
  setNewTruck = (vON, vInl, vLDT, vTT, vH, vDD, vDT, vPT, vST) => {
    this.setState((prevState) => {
      let newTruck = Object.assign({}, prevState.newTruck); // creating copy of state variable newOrder
      newTruck.truck_id = vON;
      newTruck.truck_snumber = vInl;
      newTruck.availability = vLDT;
      newTruck.truck_type = vTT;
      newTruck.hierarchy = vH;
      newTruck.terminal = vDD;
      newTruck.use_cost = vDT;
      newTruck.starting_time = vPT;
      newTruck.date = vST;
      return { newTruck }; // return new object newOrder object
    });
  };

  //Getting the new order's and new truck's information from their modals
  getOrderInfo = () => {
    var temp = [];
    temp = this.refs.addOrders.getFormOrderData();
    this.setNewOrder(
      temp[0],
      temp[1],
      temp[2],
      temp[3],
      temp[4],
      temp[5],
      temp[6],
      temp[7],
      temp[8]
    );
  };
  getTruckInfo = () => {
    var temp = [];
    temp = this.refs.addTrucks.getFormTruckData();
    this.setNewTruck(
      temp[0],
      temp[1],
      temp[2],
      temp[3],
      temp[4],
      temp[5],
      temp[6],
      temp[7],
      temp[8]
    );
  };

  // Assigning , editing and Unassigning orders
  assign_unassignOrder = (orderId, truckId, dpt, assigning) => {
    return axios
      .patch(`/api/orders/${orderId}`, {
        truck_s_number: truckId,
        departure_time: dpt,
      })
      .then((res) => {
        if (assigning === false) {
          if (res.status === 200) {
            message.success("Truck successfully unassigned");
          }
        } else {
          if (res.status === 200) {
            message.success("Order successfully assigned");
          }
        }
        this.getOrderList("latest");
        this.getTruckList("latest");
        this.setState({
          selectedOrdersRowKeys: [],
          selectedTrucksRowKeys: [],
        });
        return true;
      })
      .catch((error) => {
        this.setState((state) => ({
          ...state,
          status: "error",
          error: error,
        }));
        if (error.response.status === 400) {
          message.error("Bad Request: " + error.response.data.message);
        }
        if (error.response.status === 401) {
          message.error("Unauthorized: " + error.response.data.message);
        }
        if (error.response.status === 404) {
          message.error("Not found: " + error.response.data.message);
        }
        if (error.response.status === 422) {
          message.error("Unprocessable Entity: " + error.response.data.message);
        }
        return false;
      });
  };

  render() {
    const showHideMenu = (
      <Menu Scrollable style={{ maxHeight: "50vh", overflowY: "scroll" }}>
        <Menu.ItemGroup title="Columns">
          <Menu.Item key="Booking">
            <Checkbox id="Booking" onChange={this.filterColumns} defaultChecked>
              Booking
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="inl_terminal">
            <Checkbox
              id="inl_terminal"
              onChange={this.filterColumns}
              defaultChecked
            >
              inl_terminal
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="latest_dep_time">
            <Checkbox
              id="latest_dep_time"
              onChange={this.filterColumns}
              defaultChecked
            >
              latest_dep_time
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="truck_type">
            <Checkbox
              id="truck_type"
              onChange={this.filterColumns}
              defaultChecked
            >
              truck_type
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="hierarchy">
            <Checkbox
              id="hierarchy"
              onChange={this.filterColumns}
              defaultChecked
            >
              hierarchy
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="delivery_deadline">
            <Checkbox
              id="delivery_deadline"
              onChange={this.filterColumns}
              defaultChecked
            >
              delivery_deadline
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="driving_time">
            <Checkbox
              id="driving_time"
              onChange={this.filterColumns}
              defaultChecked
            >
              driving_time
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="process_time">
            <Checkbox
              id="process_time"
              onChange={this.filterColumns}
              defaultChecked
            >
              process_time
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="service_time">
            <Checkbox
              id="service_time"
              onChange={this.filterColumns}
              defaultChecked
            >
              service_time
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="Container">
            <Checkbox
              id="Container"
              onChange={this.filterColumns}
              defaultChecked
            >
              Container
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="Unit type">
            <Checkbox
              id="Unit type"
              onChange={this.filterColumns}
              defaultChecked
            >
              Unit type
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="Ship. comp.">
            <Checkbox
              id="Ship. comp."
              onChange={this.filterColumns}
              defaultChecked
            >
              Ship. comp.
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="Terminal">
            <Checkbox
              id="Terminal"
              onChange={this.filterColumns}
              defaultChecked
            >
              Terminal
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="Truck">
            <Checkbox id="Truck" onChange={this.filterColumns} defaultChecked>
              Truck
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="Pickup">
            <Checkbox id="Pickup" onChange={this.filterColumns} defaultChecked>
              Pickup
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="Status">
            <Checkbox id="Status" onChange={this.filterColumns} defaultChecked>
              Status
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="Gate">
            <Checkbox id="Gate" onChange={this.filterColumns} defaultChecked>
              Gate
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="Time">
            <Checkbox id="Time" onChange={this.filterColumns} defaultChecked>
              Time
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="Max. departure">
            <Checkbox
              id="Max. departure"
              onChange={this.filterColumns}
              defaultChecked
            >
              Max. departure
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="Time (1)">
            <Checkbox
              id="Time (1)"
              onChange={this.filterColumns}
              defaultChecked
            >
              Time (1)
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="Truck Used">
            <Checkbox
              id="Truck Used"
              onChange={this.filterColumns}
              defaultChecked
            >
              Truck Used
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="City">
            <Checkbox id="City" onChange={this.filterColumns} defaultChecked>
              City
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="L/D">
            <Checkbox id="L/D" onChange={this.filterColumns} defaultChecked>
              L/D
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="Date">
            <Checkbox id="Date" onChange={this.filterColumns} defaultChecked>
              Date
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="Time (2)">
            <Checkbox
              id="Time (2)"
              onChange={this.filterColumns}
              defaultChecked
            >
              Time (2)
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="Reference">
            <Checkbox
              id="Reference"
              onChange={this.filterColumns}
              defaultChecked
            >
              Reference
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="Truck (1)">
            <Checkbox
              id="Truck (1)"
              onChange={this.filterColumns}
              defaultChecked
            >
              Truck (1)
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="Gate (1)">
            <Checkbox
              id="Gate (1)"
              onChange={this.filterColumns}
              defaultChecked
            >
              Gate (1)
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="Time(3)">
            <Checkbox
              id="Time (3)"
              onChange={this.filterColumns}
              defaultChecked
            >
              Time (3)
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="Inl. ter. (1)">
            <Checkbox
              id="Inl. ter. (1)"
              onChange={this.filterColumns}
              defaultChecked
            >
              Inl. ter. (1)
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="Gross (kgs)">
            <Checkbox
              id="Gross (kgs)"
              onChange={this.filterColumns}
              defaultChecked
            >
              Gross (kgs)
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="Temperature °C">
            <Checkbox
              id="Temperature °C"
              onChange={this.filterColumns}
              defaultChecked
            >
              Temperature °C
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="Seal">
            <Checkbox id="Seal" onChange={this.filterColumns} defaultChecked>
              Seal
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="Truck (2)">
            <Checkbox
              id="Truck (2)"
              onChange={this.filterColumns}
              defaultChecked
            >
              Truck (2)
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="Voyage/inland carrier">
            <Checkbox
              id="Voyage/inland carrier"
              onChange={this.filterColumns}
              defaultChecked
            >
              Voyage/inland carrier
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="Terminal (1)">
            <Checkbox
              id="Terminal (1)"
              onChange={this.filterColumns}
              defaultChecked
            >
              Terminal (1)
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="Closing">
            <Checkbox id="Closing" onChange={this.filterColumns} defaultChecked>
              Closing
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="POD">
            <Checkbox id="POD" onChange={this.filterColumns} defaultChecked>
              POD
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="Invoice reference">
            <Checkbox
              id="Invoice reference"
              onChange={this.filterColumns}
              defaultChecked
            >
              Invoice reference
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="Tariff type">
            <Checkbox
              id="Tariff type"
              onChange={this.filterColumns}
              defaultChecked
            >
              Tariff type
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="G">
            <Checkbox id="G" onChange={this.filterColumns} defaultChecked>
              G
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="F">
            <Checkbox id="F" onChange={this.filterColumns} defaultChecked>
              F
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="Positie">
            <Checkbox id="Positie" onChange={this.filterColumns} defaultChecked>
              Positie
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="Delay">
            <Checkbox id="Delay" onChange={this.filterColumns} defaultChecked>
              Delay
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="Weight">
            <Checkbox id="Weight" onChange={this.filterColumns} defaultChecked>
              Weight
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="departure_time">
            <Checkbox
              id="departure_time"
              onChange={this.filterColumns}
              defaultChecked
            >
              departure_time
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="truck_id">
            <Checkbox
              id="truck_id"
              onChange={this.filterColumns}
              defaultChecked
            >
              truck_id
            </Checkbox>
          </Menu.Item>
        </Menu.ItemGroup>
      </Menu>
    );
    const showHideTruckMenu = (
      <Menu>
        <Menu.ItemGroup title="truck_id">
          <Menu.Item key="truck_id">
            <Checkbox
              id="truck_id"
              onChange={this.filterTruckColumns}
              defaultChecked
            >
              truck_id
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="s_number">
            <Checkbox
              id="s_number"
              onChange={this.filterTruckColumns}
              defaultChecked
            >
              s_number
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="availability">
            <Checkbox
              id="availability"
              onChange={this.filterTruckColumns}
              defaultChecked
            >
              availability
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="truck_type">
            <Checkbox
              id="truck_type"
              onChange={this.filterTruckColumns}
              defaultChecked
            >
              truck_type
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="business_type">
            <Checkbox
              id="business_type"
              onChange={this.filterTruckColumns}
              defaultChecked
            >
              business_type
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="Driver">
            <Checkbox
              id="Driver"
              onChange={this.filterTruckColumns}
              defaultChecked
            >
              Driver
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="terminal">
            <Checkbox
              id="terminal"
              onChange={this.filterTruckColumns}
              defaultChecked
            >
              terminal
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="Owner">
            <Checkbox
              id="Owner"
              onChange={this.filterTruckColumns}
              defaultChecked
            >
              Owner
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="hierarchy">
            <Checkbox
              id="hierarchy"
              onChange={this.filterTruckColumns}
              defaultChecked
            >
              hierarchy
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="use_cost">
            <Checkbox
              id="use_cost"
              onChange={this.filterTruckColumns}
              defaultChecked
            >
              use_cost
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="date">
            <Checkbox
              id="date"
              onChange={this.filterTruckColumns}
              defaultChecked
            >
              date
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="starting_time">
            <Checkbox
              id="starting_time"
              onChange={this.filterTruckColumns}
              defaultChecked
            >
              starting_time
            </Checkbox>
          </Menu.Item>
          <Menu.Item key="Remarks">
            <Checkbox
              id="Remarks"
              onChange={this.filterTruckColumns}
              defaultChecked
            >
              Remarks
            </Checkbox>
          </Menu.Item>
        </Menu.ItemGroup>
      </Menu>
    );
    const { selectedOrdersRowKeys, selectedOrderType } = this.state;
    const { selectedTrucksRowKeys, selectedTruckType } = this.state;
    const ordersRowSelection = {
      selectedRowKeys: selectedOrdersRowKeys,
      selectedOrderType,
      onChange: this.onSelectedOrdersRowKeysChange,
    };
    const trucksRowSelection = {
      selectedRowKeys: selectedTrucksRowKeys,
      selectedTruckType,
      onChange: this.onSelectedTrucksRowKeysChange,
    };
    return (
      <Layout style={{ width: "100%", backgroundColor: "white" }}>
        <Row gutter={[0, 10]}>
          <Col span={8}>
            <Select
              defaultValue="Both"
              onChange={this.changeDataOrders}
              style={{ width: 120 }}
            >
              <Option value="Both">Both</Option>
              <Option value="ITV">ITV</Option>
              <Option value="KAT">KAT</Option>
            </Select>
            &nbsp;
            <Dropdown
              overlay={showHideMenu}
              onVisibleChange={this.changeVisibility}
              visible={this.state.isVisible}
              style={{ height: "50vh" }}
            >
              <Button>Show/Hide</Button>
            </Dropdown>
          </Col>
          <Col span={2} offset={12}>
            <Dropdown
              Scrollable
              overlay={showHideTruckMenu}
              onVisibleChange={this.changeTruckVisibility}
              visible={this.state.isTruckVisible}
              style={{ maxHeight: "50px" }}
            >
              <Button>Show/Hide</Button>
            </Dropdown>
          </Col>
          <Col span={2}>
            <Button onClick={() => window.open("/data")}>
              Data visualisation
            </Button>
          </Col>
        </Row>
        <Row gutter={[24, 8]} justify="space-around" align="middle">
          <Col span={12}>
            <EditableTableOrder
              rowSelection={ordersRowSelection}
              dataSource={this.state.data}
              columns={this.state.columns}
              setData={this.setData}
              onRow={(record) => ({
                onClick: () => {
                  this.selectOrdersRow(record);
                },
              })}
            />
            <br />
            <Button onClick={() => this.showOrdersModal()}>Add order</Button>
            <Popconfirm
              title="Are you sure you want to delete the selected orders？"
              okText="Yes"
              cancelText="No"
              onConfirm={() =>
                this.deleteOrderById(this.state.selectedOrdersRowKeys)
              }
            >
              <Button>Delete order</Button>
            </Popconfirm>
            &nbsp;&nbsp;
            <Button onClick={this.magnifyOrdersModal}>Magnify</Button>
          </Col>
          <Col span={3}>
            <Row>
              <Button
                style={{ width: "100%" }}
                onClick={() => this.showAssignModal()}
              >
                Assign
              </Button>
            </Row>
            <br />
            <Row>
              <Button
                style={{ width: "100%" }}
                onClick={() => {
                  var orderLength = this.state.selectedOrdersRowKeys.length;
                  this.assign_unassignOrder(
                    this.state.selectedOrdersRowKeys[orderLength - 1],
                    null,
                    null,
                    false
                  );
                }}
              >
                Unassign
              </Button>
            </Row>
            <br />
            <Row>
              <Button style={{ width: "100%" }}>Auto Plan</Button>
            </Row>
          </Col>
          <Col span={9}>
            <EditableTableTruck
              rowSelection={trucksRowSelection}
              rowClassName={(record, index) =>
                this.truckRowColor(record.truck_type)
              }
              dataSource={this.state.data2}
              columns={this.state.columns2}
              setData={this.setData2}
              onRow={(record) => ({
                onClick: () => {
                  this.selectOrdersRow(record);
                },
              })}
            />
            <br />
            <Button onClick={this.ShowTruckModal}>Add truck</Button>
            <Popconfirm
              title="Are you sure you want to delete the selected trucks？"
              okText="Yes"
              cancelText="No"
              onConfirm={() =>
                this.deleteTruckById(this.state.selectedTrucksRowKeys)
              }
            >
              <Button>Delete truck</Button>
            </Popconfirm>
            &nbsp;&nbsp;
            <Button onClick={this.magnifyTrucksModal}>Magnify</Button>
          </Col>
        </Row>

        <Modal
          style={{
            width: "100vh",
            display: "flex",
            alignItems: "center",
            marginLeft: 280,
          }}
          title="Add Order"
          visible={this.state.AOVisible}
          onCancel={this.handleCancel}
          onOk={() => {
            this.addOrder("latest");
          }}
        >
          {this.state.AOVisible && <AddOrdersLayout ref="addOrders" />}
        </Modal>

        <Modal
          title="Add departure time"
          visible={this.state.AssignModal}
          onOk={() => {
            var orderLength = this.state.selectedOrdersRowKeys.length;
            var truckLength = this.state.selectedTrucksRowKeys.length;
            this.assign_unassignOrder(
              this.state.selectedOrdersRowKeys[orderLength - 1],
              this.state.selectedTrucksRowKeys[truckLength - 1],
              this.state.departure_time,
              true
            );
            this.handleCancel();
          }}
          onCancel={this.handleCancel}
        >
          {this.state.AssignModal && (
            <Form>
              <Form.Item
                name={"departureTime"}
                label={"Departure Time:"}
                rules={[{ required: true }]}
              >
                <Input
                  value={this.state.departure_time}
                  onChange={this.handleChangeDepartureTime}
                />
              </Form.Item>
            </Form>
          )}
        </Modal>

        <Modal
          width="100vh"
          title="Add Truck"
          visible={this.state.ATVisible}
          onOk={() => {
            this.addTruck("latest");
          }}
          onCancel={this.handleCancel}
        >
          {this.state.ATVisible && <AddTruckLayout ref="addTrucks" />}
        </Modal>
        <Modal
          title="Order List"
          visible={this.state.magnifyOrders}
          onOk={this.okMagnify}
          onCancel={this.cancelMagnify}
          width={"100%"}
          style={{ top: 20 }}
        >
          {this.state.magnifyOrders && (
            <Layout style={{ width: "100%", backgroundColor: "white" }}>
              <EditableTableOrder
                rowSelection={ordersRowSelection}
                dataSource={this.state.data}
                columns={this.state.columns}
                setData={this.setData}
                onRow={(record) => ({
                  onClick: () => {
                    this.selectOrdersRow(record);
                  },
                })}
              />
            </Layout>
          )}
        </Modal>
        <Modal
          title="Truck List"
          visible={this.state.magnifyTrucks}
          onOk={this.okMagnify}
          onCancel={this.cancelMagnify}
          width={"100%"}
          style={{ top: 20 }}
        >
          {this.state.magnifyTrucks && (
            <Layout style={{ width: "100%", backgroundColor: "white" }}>
              <EditableTableTruck
                rowSelection={trucksRowSelection}
                dataSource={this.state.data2}
                columns={this.state.columns2}
                setData={this.setData2}
                onRow={(record) => ({
                  onClick: () => {
                    this.selectOrdersRow(record);
                  },
                })}
              />
            </Layout>
          )}
        </Modal>
      </Layout>
    );
  }
}
