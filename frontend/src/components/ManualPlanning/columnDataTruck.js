/**
 * Create the Truck table columns.
 */
export const getColumnTruck = () => {
    return [
        {
            title: "Truck ID",
            dataIndex: "truck_id",
            sorter: (a, b) =>
              (a.truck_id || "|||")
                .toUpperCase()
                .localeCompare((b.truck_id || "|||").toUpperCase()),
            width: 150,
            editable: true,
          },
          {
            title: "S Number",
            dataIndex: "s_number",
            sorter: (a, b) => (a.s_number || "|||") - (b.s_number || "|||"),
            width: 150,
            editable: true,
          },
          {
            title: "Availability",
            dataIndex: "availability",
            sorter: (a, b) =>
              (a.availability || "|||")
                .toUpperCase()
                .localeCompare((b.availability || "|||").toUpperCase()),
            width: 150,
            editable: true,
          },
          {
            title: "Truck type",
            dataIndex: "truck_type",
            width: 150,
            editable: true,
            sorter: (a, b) =>
              (a.truck_type || "|||")
                .toUpperCase()
                .localeCompare((b.truck_type || "|||").toUpperCase()),
          },
          {
            title: "Business type",
            dataIndex: "business_type",
            width: 150,
            editable: true,
            sorter: (a, b) =>
              (a.business_type || "|||")
                .toUpperCase()
                .localeCompare((b.business_type || "|||").toUpperCase()),
          },
          {
            title: "Driver",
            dataIndex: "Driver",
            width: 150,
            editable: true,
            sorter: (a, b) =>
              (a.Driver || "|||")
                .toUpperCase()
                .localeCompare((b.Driver || "|||").toUpperCase()),
          },
          {
            title: "Terminal",
            dataIndex: "terminal",
            width: 150,
            editable: true,
            sorter: (a, b) =>
              (a.terminal || "|||")
                .toUpperCase()
                .localeCompare((b.terminal || "|||").toUpperCase()),
          },
          {
            title: "Owner",
            dataIndex: "Owner",
            width: 150,
            editable: true,
            sorter: (a, b) =>
              (a.Owner || "|||")
                .toUpperCase()
                .localeCompare((b.Owner || "|||").toUpperCase()),
          },
          {
            title: "Hierarchy",
            dataIndex: "hierarchy",
            width: 150,
            editable: true,
            sorter: (a, b) => (a.hierarchy || "|||") - (b.hierarchy || "|||"),
          },
          {
            title: "Use cost",
            dataIndex: "use_cost",
            width: 150,
            editable: true,
            sorter: (a, b) => (a.use_cost || "|||") - (b.use_cost || "|||"),
          },
          {
            title: "Date",
            dataIndex: "date",
            width: 150,
            editable: true,
            sorter: (a, b) =>
              (a.date || "|||")
                .toUpperCase()
                .localeCompare((b.date || "|||").toUpperCase()),
          },
          {
            title: "Starting time",
            dataIndex: "starting_time",
            width: 150,
            editable: true,
            sorter: (a, b) =>
              (a.starting_time || "|||")
                .toUpperCase()
                .localeCompare((b.starting_time || "|||").toUpperCase()),
          },
          {
            title: "Remarks",
            dataIndex: "Remarks",
            width: 150,
            editable: true,
            sorter: (a, b) =>
              (a.Remarks || "|||")
                .toUpperCase()
                .localeCompare((b.Remarks || "|||").toUpperCase()),
          },
    ]
};