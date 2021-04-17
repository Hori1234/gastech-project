/**
 * Create the Order table columns.
 */
export const getColumnOrder = () => {
  return [
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
      sorter: (a, b) => (a.driving_time || "|||") - (b.driving_time || "|||"),
    },
    {
      title: "Process time",
      dataIndex: "process_time",
      width: 150,
      editable: true,
      sorter: (a, b) => (a.process_time || "|||") - (b.process_time || "|||"),
    },
    {
      title: "Service time",
      dataIndex: "service_time",
      width: 150,
      editable: true,
      sorter: (a, b) => (a.service_time || "|||") - (b.service_time || "|||"),
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
          .localeCompare((b["Voyage/inland carrier"] || "|||").toUpperCase()),
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
      sorter: (a, b) => a.truck_id - b.truck_id,
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
  ];
};
