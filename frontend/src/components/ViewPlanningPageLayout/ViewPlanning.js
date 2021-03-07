import React, {Component} from "react";
import {
    Table,
    Layout,
    Button,
    Row,
    Col,
    Select,
    Menu,
    Checkbox,
    Dropdown,
    Modal,
} from "antd";
import axios from "axios";
import "../ManualPlanning/ManualPlanning.css";
import Timeline from "../DataVisualization/Timeline"
import FirstRideButton from "../DataVisualization/FirstRideButton"

const {Option} = Select;

export default class ManualPlanning extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOrdersRowKeys: [],
            selectedPlanningsRowKeys: [],
            columnFilter: [],
            isVisible: false,
            columns: [
                {
                    title: "Container",
                    dataIndex: "Container",
                    width: 150,
                    editable: true,
                    sorter: (a, b) =>
                        (a.Container || "|||")
                            .toUpperCase()
                            .localeCompare((b.Container || "|||").toUpperCase()),
                },
                {
                    title: "Unit type",
                    dataIndex: "Unit type",
                    width: 150,
                    editable: true,
                    sorter: (a, b) =>
                        (a["Unit type"] || "|||")
                            .toUpperCase()
                            .localeCompare((b["Unit type"] || "|||").toUpperCase()),
                },
                {
                    title: "Booking",
                    dataIndex: "Booking",
                    sorter: (a, b) =>
                        (a.Booking || "|||")
                            .toUpperCase()
                            .localeCompare((b.Booking || "|||").toUpperCase()),
                    width: 150,
                    editable: true,
                },
                {
                    title: "Ship. comp.",
                    dataIndex: "Ship. comp.",
                    width: 150,
                    editable: true,
                    sorter: (a, b) =>
                        (a["Ship. comp."] || "|||")
                            .toUpperCase()
                            .localeCompare((b["Ship. comp."] || "|||").toUpperCase()),
                },
                {
                    title: "Terminal",
                    dataIndex: "Terminal",
                    width: 150,
                    editable: true,
                    sorter: (a, b) =>
                        (a.Terminal || "|||")
                            .toUpperCase()
                            .localeCompare((b.Terminal || "|||").toUpperCase()),
                },
                {
                    title: "Truck",
                    dataIndex: "Truck",
                    width: 150,
                    editable: true,
                    sorter: (a, b) =>
                        (a.Truck || "|||")
                            .toUpperCase()
                            .localeCompare((b.Truck || "|||").toUpperCase()),
                },
                {
                    title: "Pickup",
                    dataIndex: "Pickup",
                    width: 150,
                    editable: true,
                    sorter: (a, b) =>
                        (a.Pickup || "|||")
                            .toUpperCase()
                            .localeCompare((b.Pickup || "|||").toUpperCase()),
                },
                {
                    title: "Status",
                    dataIndex: "Status",
                    width: 150,
                    editable: true,
                    sorter: (a, b) =>
                        (a.Status || "|||")
                            .toUpperCase()
                            .localeCompare((b.Status || "|||").toUpperCase()),
                },
                {
                    title: "Inl. Terminal",
                    dataIndex: "inl_terminal",
                    width: 150,
                    editable: true,
                    sorter: (a, b) =>
                        (a.inl_terminal || "|||")
                            .toUpperCase()
                            .localeCompare((b.inl_terminal || "|||").toUpperCase()),
                },
                {
                    title: "Gate",
                    dataIndex: "Gate",
                    width: 150,
                    editable: true,
                    sorter: (a, b) =>
                        (a.Gate || "|||")
                            .toUpperCase()
                            .localeCompare((b.Gate || "|||").toUpperCase()),
                },
                {
                    title: "Time",
                    dataIndex: "Time",
                    width: 150,
                    editable: true,
                    sorter: (a, b) =>
                        (a.Gate || "|||")
                            .toUpperCase()
                            .localeCompare((b.Gate || "|||").toUpperCase()),
                },
                {
                    title: "Max. departure",
                    dataIndex: "Max. departure",
                    width: 150,
                    editable: true,
                    sorter: (a, b) =>
                        (a["Max. departure"] || "|||")
                            .toUpperCase()
                            .localeCompare((b["Max. departure"] || "|||").toUpperCase()),
                },
                {
                    title: "Time (1)",
                    dataIndex: "Time (1)",
                    width: 150,
                    editable: true,
                    sorter: (a, b) =>
                        (a["Time (1)"] || "|||")
                            .toUpperCase()
                            .localeCompare((b["Time (1)"] || "|||").toUpperCase()),
                },
                {
                    title: "Latest departure time",
                    dataIndex: "latest_dep_time",
                    width: 150,
                    editable: true,
                    sorter: (a, b) =>
                        (a.latest_dep_time || "|||")
                            .toUpperCase()
                            .localeCompare((b.latest_dep_time || "|||").toUpperCase()),
                },
                {
                    title: "Truck Used",
                    dataIndex: "Truck Used",
                    width: 150,
                    editable: true,
                    sorter: (a, b) =>
                        (a["Truck Used"] || "|||")
                            .toUpperCase()
                            .localeCompare((b["Truck Used"] || "|||").toUpperCase()),
                },
                {
                    title: "Truck Type",
                    dataIndex: "truck_type",
                    width: 150,
                    editable: true,
                    sorter: (a, b) =>
                        (a.truck_type || "|||")
                            .toUpperCase()
                            .localeCompare((b.truck_type || "|||").toUpperCase()),
                },
                {
                    title: "Hierarchy",
                    dataIndex: "hierarchy",
                    width: 150,
                    editable: true,
                    sorter: (a, b) => (a.hierarchy || "|||") - (b.hierarchy || "|||"),
                },
                {
                    title: "City",
                    dataIndex: "City",
                    sortDirections: ["descend", "ascend"],
                    sorter: (a, b) =>
                        (a.City || "|||")
                            .toUpperCase()
                            .localeCompare((b.City || "|||").toUpperCase()),
                    width: 150,
                    editable: true,
                },
                {
                    title: "L/D",
                    dataIndex: "L/D",
                    width: 150,
                    editable: true,
                    sorter: (a, b) =>
                        (a["L/D"] || "|||")
                            .toUpperCase()
                            .localeCompare((b["L/D"] || "|||").toUpperCase()),
                },
                {
                    title: "Date",
                    dataIndex: "Date",
                    width: 150,
                    editable: true,
                    sorter: (a, b) =>
                        (a.Date || "|||")
                            .toUpperCase()
                            .localeCompare((b.Date || "|||").toUpperCase()),
                },
                {
                    title: "Time (2)",
                    dataIndex: "Time (2)",
                    width: 150,
                    editable: true,
                    sorter: (a, b) =>
                        (a["Time (2)"] || "|||")
                            .toUpperCase()
                            .localeCompare((b["Time (2)"] || "|||").toUpperCase()),
                },
                {
                    title: "Delivery Deadline",
                    dataIndex: "delivery_deadline",
                    width: 150,
                    editable: true,
                    sorter: (a, b) =>
                        (a.delivery_deadline || "|||")
                            .toUpperCase()
                            .localeCompare((b.delivery_deadline || "|||").toUpperCase()),
                },
                {
                    title: "Driving time",
                    dataIndex: "driving_time",
                    width: 150,
                    editable: true,
                    sorter: (a, b) =>
                        (a.driving_time || "|||") - (b.driving_time || "|||"),
                },
                {
                    title: "Process time",
                    dataIndex: "process_time",
                    width: 150,
                    editable: true,
                    sorter: (a, b) =>
                        (a.process_time || "|||") - (b.process_time || "|||"),
                },
                {
                    title: "Service time",
                    dataIndex: "service_time",
                    width: 150,
                    editable: true,
                    sorter: (a, b) =>
                        (a.service_time || "|||") - (b.service_time || "|||"),
                },
                {
                    title: "Reference",
                    dataIndex: "Reference",
                    width: 150,
                    editable: true,
                    sorter: (a, b) =>
                        (a.Reference || "|||")
                            .toUpperCase()
                            .localeCompare((b.Reference || "|||").toUpperCase()),
                },
                {
                    title: "Truck (1)",
                    dataIndex: "Truck (1)",
                    width: 150,
                    editable: true,
                    sorter: (a, b) =>
                        (a["Truck (1)"] || "|||")
                            .toUpperCase()
                            .localeCompare((b["Truck (1)"] || "|||").toUpperCase()),
                },
                {
                    title: "Gate (1)",
                    dataIndex: "Gate (1)",
                    width: 150,
                    editable: true,
                    sorter: (a, b) =>
                        (a["Gate (1)"] || "|||")
                            .toUpperCase()
                            .localeCompare((b["Gate (1)"] || "|||").toUpperCase()),
                },
                {
                    title: "Time (3)",
                    dataIndex: "Time (3)",
                    width: 150,
                    editable: true,
                    sorter: (a, b) =>
                        (a["Time (3)"] || "|||")
                            .toUpperCase()
                            .localeCompare((b["Time (3)"] || "|||").toUpperCase()),
                },
                {
                    title: "Inl. ter. (1)",
                    dataIndex: "Inl. ter. (1)",
                    width: 150,
                    editable: true,
                    sorter: (a, b) =>
                        (a["Inl. ter. (1)"] || "|||")
                            .toUpperCase()
                            .localeCompare((b["Inl. ter. (1)"] || "|||").toUpperCase()),
                },
                {
                    title: "Gross (kgs)",
                    dataIndex: "Gross (kgs)",
                    width: 150,
                    editable: true,
                    sorter: (a, b) =>
                        (a["Gross (kgs)"] || "|||") - (b["Gross (kgs)"] || "|||"),
                },
                {
                    title: "Temperature °C",
                    dataIndex: "Temperature °C",
                    width: 150,
                    editable: true,
                    sorter: (a, b) =>
                        (a["Temperature °C"] || "|||")
                            .toUpperCase()
                            .localeCompare((b["Temperature °C"] || "|||").toUpperCase()),
                },
                {
                    title: "Seal",
                    dataIndex: "Seal",
                    width: 150,
                    editable: true,
                    sorter: (a, b) =>
                        (a.Seal || "|||")
                            .toUpperCase()
                            .localeCompare((b.Seal || "|||").toUpperCase()),
                },
                {
                    title: "Truck (2)",
                    dataIndex: "Truck (2)",
                    width: 150,
                    editable: true,
                    sorter: (a, b) =>
                        (a["Truck (2)"] || "|||")
                            .toUpperCase()
                            .localeCompare((b["Truck (2)"] || "|||").toUpperCase()),
                },
                {
                    title: "Voyage/inland carrier",
                    dataIndex: "Voyage/inland carrier",
                    width: 250,
                    editable: true,
                    sorter: (a, b) =>
                        (a["Voyage/inland carrier"] || "|||")
                            .toUpperCase()
                            .localeCompare(
                                (b["Voyage/inland carrier"] || "|||").toUpperCase()
                            ),
                },
                {
                    title: "Terminal (1)",
                    dataIndex: "Terminal (1)",
                    width: 150,
                    editable: true,
                    sorter: (a, b) =>
                        (a["Terminal (1)"] || "|||")
                            .toUpperCase()
                            .localeCompare((b["Terminal (1)"] || "|||").toUpperCase()),
                },
                {
                    title: "Closing",
                    dataIndex: "Closing",
                    sortDirections: ["descend", "ascend"],
                    width: 150,
                    editable: true,
                    sorter: (a, b) =>
                        (a.Closing || "|||")
                            .toUpperCase()
                            .localeCompare((b.Closing || "|||").toUpperCase()),
                },
                {
                    title: "POD",
                    dataIndex: "POD",
                    width: 150,
                    editable: true,
                    sorter: (a, b) =>
                        (a.POD || "|||")
                            .toUpperCase()
                            .localeCompare((b.POD || "|||").toUpperCase()),
                },
                {
                    title: "Invoice reference",
                    dataIndex: "Invoice reference",
                    width: 150,
                    editable: true,
                    sorter: (a, b) =>
                        (a["Invoice reference"] || "|||") - (b["Terminal (1)"] || "|||"),
                },
                {
                    title: "Tariff type",
                    dataIndex: "Tariff type",
                    width: 150,
                    editable: true,
                    sorter: (a, b) =>
                        (a["Tariff type"] || "|||")
                            .toUpperCase()
                            .localeCompare((b["Tariff type"] || "|||").toUpperCase()),
                },
                {
                    title: "G",
                    dataIndex: "G",
                    width: 150,
                    editable: true,
                    sorter: (a, b) =>
                        (a.G || "|||")
                            .toUpperCase()
                            .localeCompare((b.G || "|||").toUpperCase()),
                },
                {
                    title: "F",
                    dataIndex: "F",
                    width: 150,
                    editable: true,
                    sorter: (a, b) =>
                        (a.F || "|||")
                            .toUpperCase()
                            .localeCompare((b.F || "|||").toUpperCase()),
                },
                {
                    title: "Positie",
                    dataIndex: "Positie",
                    width: 150,
                    editable: true,
                    sorter: (a, b) =>
                        (a.Positie || "|||")
                            .toUpperCase()
                            .localeCompare((b.Positie || "|||").toUpperCase()),
                },
                {
                    title: "Delay",
                    dataIndex: "Delay",
                    width: 150,
                    editable: true,
                    sorter: (a, b) =>
                        (a.Delay || "|||")
                            .toUpperCase()
                            .localeCompare((b.Delay || "|||").toUpperCase()),
                },

                {
                    title: "Weight",
                    dataIndex: "Weight",
                    width: 150,
                    editable: true,
                    sorter: (a, b) =>
                        (a.Weight || "|||")
                            .toUpperCase()
                            .localeCompare((b.Weight || "|||").toUpperCase()),
                },
                {
                    title: "Truck ID",
                    dataIndex: "truck_id",
                    width: 150,
                    editable: true,
                    sorter: (a, b) =>
                        (a.truck_id) - (b.truck_id),
                },
                {
                    title: "Departure time",
                    dataIndex: "departure_time",
                    width: 150,
                    editable: true,
                    sorter: (a, b) =>
                        (a.departure_time || "|||")
                            .toUpperCase()
                            .localeCompare((b.departure_time || "|||").toUpperCase()),
                },
            ],
            columns2: [
                {
                    title: "Order Sheet Id",
                    dataIndex: "order_sheet_id",
                    width: 150,
                    editable: true,
                    sorter: (a, b) =>
                        (a.order_sheet_id) - (b.order_sheet_id),
                },
                {
                    title: "Published On",
                    dataIndex: "published_on",
                    width: 150,
                    editable: true,
                    sorter: (a, b) =>
                        (a.published_on || "|||")
                            .toUpperCase()
                            .localeCompare((b.published_on || "|||").toUpperCase()),
                },
                {
                    title: "Truck Sheet Id",
                    dataIndex: "truck_sheet_id",
                    sorter: (a, b) =>
                        (a.truck_sheet_id) - (b.truck_sheet_id),
                    width: 150,
                    editable: true,
                },
                {
                    title: "User Id",
                    dataIndex: "user_id",
                    width: 150,
                    editable: true,
                    sorter: (a, b) =>
                        (a.user_id) - (b.user_id),
                },
            ],
            data: [],
            data2: [],
            data3: [],
            startingColumns: [],
            startingPlanningColumns: [],
            magnifyOrders: false,
            magnifyPlannings: false,
            status: "",
            temp: [],
            originalOrders: [],
            originalTrucks: [],
        };
    }

    componentDidMount() {
        this.setState({startingColumns: this.state.columns});
        this.setState({startingPlanningColumns: this.state.columns2});
        this.getPlanning("latest", "latest");
        this.getPlanningList(1, 10);
    }

    changeVisibility = (isTrue) => {
        this.setState({isVisible: isTrue});
    };
    changeTruckVisibility = (isTrue) => {
        this.setState({isTruckVisible: isTrue});
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
        this.setState({columns: final, columnFilter: columnFilter});
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
    getItvOrder = (e) => {
        let itvData = [];
        e.forEach((element) => {
            if (element.inl_terminal === "ITV") {
                itvData.push(element);
            }
        });
        this.setState({data: itvData});
    };
    getKatOrder = (e) => {
        let katData = [];
        e.forEach((element) => {
            if (element.inl_terminal === "KAT") {
                katData.push(element);
            }
        });
        this.setState({data: katData});
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
        this.setState({selectedOrdersRowKeys});
    };
    onSelectedOrdersRowKeysChange = (selectedOrdersRowKeys) => {
        this.setState({selectedOrdersRowKeys});
        console.log("orders", selectedOrdersRowKeys);
    };
    selectPlanningsRow = (record) => {
        const selectedPlanningsRowKeys = [...this.state.selectedPlanningsRowKeys];
        if (selectedPlanningsRowKeys.indexOf(record.key) >= 0) {
            selectedPlanningsRowKeys.splice(
                selectedPlanningsRowKeys.indexOf(record.key),
                1
            );
        } else {
            selectedPlanningsRowKeys.push(record.key);
        }
        this.setState({selectedPlanningsRowKeys});
        console.log(selectedPlanningsRowKeys);
    };
    onSelectedPlanningRowKeysChange = (selectedPlanningsRowKeys) => {
        this.setState({selectedPlanningsRowKeys});
        console.log("sheet id:", selectedPlanningsRowKeys);
    };
    magnifyOrdersModal = () => {
        this.setState({
            magnifyOrders: true,
        });
    };
    magnifyPlanningsModal = () => {
        this.setState({
            magnifyPlannings: true,
        });
    };
    magnifyTimelineModal = () => {
        this.setState({
            magnifyTimeline: true,
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
        this.setState({magnifyOrders: false, magnifyTimeline: false});
    };
    okPlanningSelected = (e) => {
        this.getOrderList(this.state.selectedPlanningsRowKeys);
        this.setState({magnifyPlannings: false});
    };
    cancelMagnify = (e) => {
        this.setState({magnifyOrders: false, magnifyPlannings: false, magnifyTimeline: false});
    };


    //API Calls ============================================================>
    getPlanningList = async (vPage, VPageSize) => {
        return axios
            .get(`/api/plannings/`, {
                params: {
                    page: vPage,
                    page_size: VPageSize,
                },
            })
            .then((res) => {
                var outarray = [];
                for (var i = 0; i < res.data.length; i++) {
                    var temp = {
                        key: res.data[i]["order_sheet_id"],
                        order_sheet_id: res.data[i]["order_sheet_id"],
                        published_on: res.data[i]["published_on"],
                        truck_sheet_id: res.data[i]["truck_sheet_id"],
                        user_id: res.data[i]["user_id"],
                    };
                    outarray.push(temp);
                }

                this.setState((state) => ({
                    ...state,
                    data2: outarray,
                    originalOrders: outarray,
                    status: "success",
                }));
                console.log(this.state.data2);
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
    getPlanning = async (tid, oid) => {
        return axios
            .get(`/api/plannings/${tid}/${oid}`)
            .then((res) => {
                var outarray = [];
                for (var i = 0; i < res.data.orders.length; i++) {
                    var temp = {
                        key: res.data[i]["order_sheet_id"],
                        order_sheet_id: res.data[i]["order_sheet_id"],
                        published_on: res.data[i]["published_on"],
                        truck_sheet_id: res.data[i]["truck_sheet_id"],
                        user_id: res.data[i]["user_id"],
                    };
                    outarray.push(temp);
                }

                this.setState((state) => ({
                    ...state,
                    data2: outarray,
                    originalOrders: outarray,
                    status: "success",
                }));
                console.log(this.state.data2);
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
                console.log(outarray);
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


    render() {
        const showHideMenu = (
            <Menu Scrollable style={{maxHeight: "50vh", overflowY: "scroll"}}>
                <Menu.ItemGroup title="Columns">
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
        const {selectedOrdersRowKeys} = this.state;
        const {selectedPlanningsRowKeys} = this.state;
        const ordersRowSelection = {
            selectedOrdersRowKeys,
            onChange: this.onSelectedOrdersRowKeysChange,
        };
        const planningRowSelection = {
            selectedPlanningsRowKeys,
            onChange: this.onSelectedPlanningRowKeysChange,
        };
        return (
            <Layout style={{width: "100%", backgroundColor: "white"}}>
                <Row gutter={[0, 10]}>
                    <Col span={12}>
                        <Select
                            defaultValue="Both"
                            onChange={this.changeDataOrders}
                            style={{width: 120}}
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
                            style={{height: "50vh"}}
                        >
                            <Button>Show/Hide</Button>
                        </Dropdown>
                    </Col>
                </Row>
                <Row gutter={[24, 8]} justify="space-around" align="middle">
                    <Col span={24}>
                        <Table

                            bordered={true}
                            rowSelection={ordersRowSelection}
                            dataSource={this.state.data}
                            columns={this.state.columns}
                            scroll={{x: "max-content", y: "50vh"}}
                            pagination={false}
                            onRow={(record) => ({
                                onClick: () => {
                                    this.selectOrdersRow(record);
                                },
                            })}
                        />

                        <br/>
                        <Button onClick={this.magnifyOrdersModal}>Magnify</Button>
                        &nbsp;
                        <Button onClick={this.magnifyPlanningsModal}>Plannings</Button>
                        &nbsp;
                        <Button onClick={this.magnifyTimelineModal}>Timeline</Button>
                    </Col>
                </Row>

                <Modal
                    title="Order List"
                    visible={this.state.magnifyOrders}
                    onOk={this.okMagnify}
                    onCancel={this.cancelMagnify}
                    width={"100%"}
                    style={{top: 20}}
                >
                    {this.state.magnifyOrders && (
                        <Layout style={{width: "100%", backgroundColor: "white"}}>
                            <Table

                                bordered={true}
                                rowSelection={ordersRowSelection}
                                dataSource={this.state.data}
                                columns={this.state.columns}
                                scroll={{x: "max-content", y: "50vh"}}
                                pagination={false}
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
                    title="Planning List"
                    visible={this.state.magnifyPlannings}
                    onOk={this.okPlanningSelected}
                    onCancel={this.cancelMagnify}
                    width={"100%"}
                    style={{top: 20}}
                >
                    {this.state.magnifyPlannings && (
                        <Layout style={{width: "100%", backgroundColor: "white"}}>
                            <Table
                                rowSelection={{type: 'radio', ...planningRowSelection}}
                                dataSource={this.state.data2}
                                columns={this.state.columns2}
                                onRow={(record) => ({
                                    onClick: () => {
                                        console.log(record);
                                    },
                                })}
                            />
                        </Layout>
                    )}
                </Modal>

                <Modal
                    title="Timeline"
                    visible={this.state.magnifyTimeline}
                    onOk={this.okMagnify}
                    onCancel={this.cancelMagnify}
                    width={"100%"}
                    style={{top: 20}}
                >
                    {this.state.magnifyTimeline && (
                        <Layout style={{width: "100%", backgroundColor: "white"}}>
                            <Layout
                                style={{
                                    display: "flex",
                                    height: "100%",
                                    width: "100%",
                                    background: "white"
                                }}
                            >
                                <Timeline timeline={this.state.selectedPlanningsRowKeys}/>
                                <Row>
                                    <Col span={6}>
                                        <FirstRideButton orderNumber={this.state.selectedPlanningsRowKeys}/>
                                    </Col>
                                </Row>
                            </Layout>
                        </Layout>
                    )}
                </Modal>
            </Layout>
        );
    }
}
