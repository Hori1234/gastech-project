/**
 * Create the Order table columns.
 */
export const getColumnOrder = () => {
    return [
      {
            title: "ID",
            dataIndex: "ID",
            key: "1",
            width: 150,
            editable: false,
            sorter: (a, b) =>
              (a.key || "|||")
                .toUpperCase()
                .localeCompare((b.key || "|||").toUpperCase()),
          },
          {
            title: "LastName",
            dataIndex: "LastName",
            key: "2",
            width: 150,
            editable: true,
            sorter: (a, b) =>
              (a.LastName || "|||")
                .toUpperCase()
                .localeCompare((b.LastName || "|||").toUpperCase()),
          },
          {
            title: "FirstName",
            dataIndex: "FirstName",
            key: "3",
            width: 150,
            editable: true,
            sorter: (a, b) =>
              (a.FirstName || "|||")
                .toUpperCase()
                .localeCompare((b.FirstName || "|||").toUpperCase()),
          },
          {
            title: "BirthDate",
            dataIndex: "BirthDate",
            key: "4",
            sorter: (a, b) =>
              (a.BirthDate || "|||")
                .toUpperCase()
                .localeCompare((b.BirthDate || "|||").toUpperCase()),
            width: 150,
            editable: true,
          },
          {
            title: "BirthCountry",
            dataIndex: "BirthCountry",
            key: "5",
            width: 150,
            editable: true,
            sorter: (a, b) =>
              (a.BirthCountry || "|||")
                .toUpperCase()
                .localeCompare((b.BirthCountry || "|||").toUpperCase()),
          },
          {
            title: "Gender",
            dataIndex: "Gender",
            key: "6",
            width: 150,
            editable: true,
            sorter: (a, b) =>
              (a.Gender || "|||")
                .toUpperCase()
                .localeCompare((b.Gender || "|||").toUpperCase()),
          },
          {
            title: "CitizenshipCountry",
            dataIndex: "CitizenshipCountry",
            key: "7",
            width: 150,
            editable: true,
            sorter: (a, b) =>
              (a.CitizenshipCountry || "|||")
                .toUpperCase()
                .localeCompare((b.CitizenshipCountry || "|||").toUpperCase()),
          },
          {
            title: "CitizenshipBasis",
            dataIndex: "CitizenshipBasis",
            key: "8",
            width: 150,
            editable: true,
            sorter: (a, b) =>
              (a.CitizenshipBasis || "|||")
                .toUpperCase()
                .localeCompare((b.CitizenshipBasis || "|||").toUpperCase()),
          },
          {
            title: "CitizenshipStartDate",
            dataIndex: "CitizenshipStartDate",
            key: "9",
            width: 150,
            editable: true,
            sorter: (a, b) =>
              (a.CitizenshipStartDate || "|||")
                .toUpperCase()
                .localeCompare((b.CitizenshipStartDate || "|||").toUpperCase()),
          },
          {
            title: "PassportCountry",
            dataIndex: "PassportCountry",
            key: "10",
            width: 150,
            editable: true,
            sorter: (a, b) =>
              (a.PassportCountry || "|||")
                .toUpperCase()
                .localeCompare((b.PassportCountry || "|||").toUpperCase()),
          },
          {
            title: "PassportIssueDate",
            dataIndex: "PassportIssueDate",
            key: "11",
            width: 150,
            editable: true,
            sorter: (a, b) =>
              (a.PassportIssueDate || "|||")
                .toUpperCase()
                .localeCompare((b.PassportIssueDate || "|||").toUpperCase()),
          },
          {
            title: "PassportExpirationDate",
            dataIndex: "PassportExpirationDate",
            key: "12",
            width: 150,
            editable: true,
            sorter: (a, b) =>
              (a.PassportExpirationDate || "|||")
                .toUpperCase()
                .localeCompare((b.PassportExpirationDate || "|||").toUpperCase()),
          },
          {
            title: "CurrentEmploymentType",
            dataIndex: "CurrentEmploymentType",
            key: "13",
            width: 150,
            editable: true,
            sorter: (a, b) =>
              (a.CurrentEmploymentType || "|||")
                .toUpperCase()
                .localeCompare((b.CurrentEmploymentType || "|||").toUpperCase()),
          },
          {
            title: "CurrentEmploymentTitle",
            dataIndex: "CurrentEmploymentTitle",
            key: "14",
            width: 150,
            editable: true,
            sorter: (a, b) =>
              (a.CurrentEmploymentTitle || "|||")
                .toUpperCase()
                .localeCompare((b.CurrentEmploymentTitle || "|||").toUpperCase()),
          },
          {
            title: "CurrentEmploymentStartDate",
            dataIndex: "CurrentEmploymentStartDate",
            key: "15",
            width: 150,
            editable: true,
            sorter: (a, b) =>
              (a.CurrentEmploymentStartDate || "|||")
                .toUpperCase()
                .localeCompare((b.CurrentEmploymentStartDate || "|||").toUpperCase()),
          },
          {
            title: "EmailAddress",
            dataIndex: "EmailAddress",
            key: "16",
            width: 150,
            editable: true,
            sorter: (a, b) =>
              (a.EmailAddress || "|||")
                .toUpperCase()
                .localeCompare((b.EmailAddress || "|||").toUpperCase()),
          },
          {
            title: "MilitaryServiceBranch",
            dataIndex: "MilitaryServiceBranch",
            key: "17",
            width: 150,
            editable: true,
            sorter: (a, b) =>
              (a.MilitaryServiceBranch || "|||")
                .toUpperCase()
                .localeCompare((b.MilitaryServiceBranch || "|||").toUpperCase()),
          },
          {
            title: "MilitaryDischargeType",
            dataIndex: "MilitaryDischargeType",
            key: "18",
            width: 150,
            editable: true,
            sorter: (a, b) => (a.MilitaryDischargeType || "|||") - (b.MilitaryDischargeType || "|||"),
          },
          {
            title: "MilitaryDischargeDate",
            dataIndex: "MilitaryDischargeDate",
            key: "19",
            sortDirections: ["descend", "ascend"],
            sorter: (a, b) =>
              (a.MilitaryDischargeDate || "|||")
                .toUpperCase()
                .localeCompare((b.MilitaryDischargeDate || "|||").toUpperCase()),
            width: 150,
            editable: true,
          },
    ]
};