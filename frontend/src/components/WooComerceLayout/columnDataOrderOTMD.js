/**
 * Create the Order table columns.
 */
export const getColumnOrder = () => {
  return [
    {
      title: "Id",
      dataIndex: "id",
      width: 150,
      editable: true,
      sorter: (a, b) =>
        (a.id || "|||")
          .toUpperCase()
          .localeCompare((b.id || "|||").toUpperCase()),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 150,
      editable: true,
      sorter: (a, b) =>
        (a.status || "|||")
          .toUpperCase()
          .localeCompare((b.status || "|||").toUpperCase()),
    },
    {
      title: "Currency",
      dataIndex: "currency",
      sorter: (a, b) =>
        (a.currency || "|||")
          .toUpperCase()
          .localeCompare((b.currency || "|||").toUpperCase()),
      width: 150,
      editable: true,
    },
    {
      title: "Total",
      dataIndex: "total",
      width: 150,
      editable: true,
      sorter: (a, b) =>
        (a.total || "|||")
          .toUpperCase()
          .localeCompare((b.total || "|||").toUpperCase()),
    },
    {
      title: "Numar de Itemi",
      dataIndex: "number_of_items",
      width: 150,
      editable: true,
      sorter: (a, b) =>
        (a.number_of_items || "|||")
          .toUpperCase()
          .localeCompare((b.number_of_items || "|||").toUpperCase()),
    },
    {
      title: "Nume Item",
      dataIndex: "name_of_item",
      width: 350,
      editable: true,
      sorter: (a, b) =>
        (a.name_of_item || "|||")
          .toUpperCase()
          .localeCompare((b.name_of_item || "|||").toUpperCase()),
    },
    {
      title: "Data Creare",
      dataIndex: "date_created",
      width: 350,
      editable: true,
      sorter: (a, b) =>
        (a.date_created || "|||")
          .toUpperCase()
          .localeCompare((b.date_created || "|||").toUpperCase()),
    },
    {
      title: "Billing: Prenume",
      dataIndex: "billing_first_name",
      width: 350,
      editable: true,
      sorter: (a, b) =>
        (a.billing_first_name || "|||")
          .toUpperCase()
          .localeCompare((b.billing_first_name || "|||").toUpperCase()),
    },
    {
      title: "Billing: Nume",
      dataIndex: "billing_last_name",
      width: 350,
      editable: true,
      sorter: (a, b) =>
        (a.billing_last_name || "|||")
          .toUpperCase()
          .localeCompare((b.billing_last_name || "|||").toUpperCase()),
    },
    {
      title: "Billing: Nume Companie",
      dataIndex: "billing_company_name",
      width: 350,
      editable: true,
      sorter: (a, b) =>
        (a.billing_company_name || "|||")
          .toUpperCase()
          .localeCompare((b.billing_company_name || "|||").toUpperCase()),
    },
    {
      title: "Billing: Companie",
      dataIndex: "billing_company",
      width: 350,
      editable: true,
      sorter: (a, b) =>
        (a.billing_company || "|||")
          .toUpperCase()
          .localeCompare((b.billing_company || "|||").toUpperCase()),
    },
    {
      title: "Billing: Adresa 1",
      dataIndex: "billing_addr_1",
      width: 350,
      editable: true,
      sorter: (a, b) =>
        (a.billing_addr_1 || "|||")
          .toUpperCase()
          .localeCompare((b.billing_addr_1 || "|||").toUpperCase()),
    },
    {
      title: "Billing: Adresa 2",
      dataIndex: "billing_addr_2",
      width: 350,
      editable: true,
      sorter: (a, b) =>
        (a.billing_addr_2 || "|||")
          .toUpperCase()
          .localeCompare((b.billing_addr_2 || "|||").toUpperCase()),
    },
    {
      title: "Billing: Oras",
      dataIndex: "billing_city",
      width: 350,
      editable: true,
      sorter: (a, b) =>
        (a.billing_city || "|||")
          .toUpperCase()
          .localeCompare((b.billing_city || "|||").toUpperCase()),
    },
    {
      title: "Billing: Tara",
      dataIndex: "billing_country",
      width: 150,
      editable: true,
      sorter: (a, b) =>
        (a.billing_country || "|||")
          .toUpperCase()
          .localeCompare((b.billing_country || "|||").toUpperCase()),
    },
    {
      title: "Billing: Email",
      dataIndex: "billing_email",
      width: 350,
      editable: true,
      sorter: (a, b) =>
        (a.billing_email || "|||")
          .toUpperCase()
          .localeCompare((b.billing_email || "|||").toUpperCase()),
    },
    {
      title: "Billing: Telefon",
      dataIndex: "billing_phone",
      width: 350,
      editable: true,
      sorter: (a, b) =>
        (a.billing_phone || "|||")
          .toUpperCase()
          .localeCompare((b.billing_phone || "|||").toUpperCase()),
    },
    {
      title: "Billing: Cod Postal",
      dataIndex: "billing_postcode",
      width: 150,
      editable: true,
      sorter: (a, b) =>
        (a.billing_postcode || "|||")
          .toUpperCase()
          .localeCompare((b.billing_postcode || "|||").toUpperCase()),
    },
    {
      title: "Billing: State",
      dataIndex: "billing_state",
      sorter: (a, b) =>
        (a.billing_state || "|||")
          .toUpperCase()
          .localeCompare((b.billing_state || "|||").toUpperCase()),
      width: 150,
      editable: true,
    },
    {
      title: "Billing: Nume Complet",
      dataIndex: "billing_first_name_and_last_name",
      width: 350,
      editable: true,
      sorter: (a, b) =>
        (a.billing_first_name_and_last_name || "|||")
          .toUpperCase()
          .localeCompare(
            (b.billing_first_name_and_last_name || "|||").toUpperCase()
          ),
    },
    {
      title: "Billing: Domeniu pentru Medii",
      dataIndex: "billing_domeniu_pentru_medii",
      width: 350,
      editable: true,
      sorter: (a, b) =>
        (a.billing_domeniu_pentru_medii || "|||")
          .toUpperCase()
          .localeCompare(
            (b.billing_domeniu_pentru_medii || "|||").toUpperCase()
          ),
    },
    {
      title: "Billing: Statutul Profesional",
      dataIndex: "billing_statutul_profesional_m",
      width: 350,
      editable: true,
      sorter: (a, b) =>
        (a.billing_statutul_profesional_m || "|||")
          .toUpperCase()
          .localeCompare(
            (b.billing_statutul_profesional_m || "|||").toUpperCase()
          ),
    },
    {
      title: "Billing: CIV",
      dataIndex: "billing_cod_de_identificare",
      width: 350,
      editable: true,
      sorter: (a, b) =>
        (a.billing_cod_de_identificare || "|||")
          .toUpperCase()
          .localeCompare(
            (b.billing_cod_de_identificare || "|||").toUpperCase()
          ),
    },
    {
      title: "Nota Aduagata",
      dataIndex: "customer_note",
      width: 350,
      editable: true,
      sorter: (a, b) =>
        (a.customer_note || "|||")
          .toUpperCase()
          .localeCompare((b.customer_note || "|||").toUpperCase()),
    },
    {
      title: "Shipping: Prenume",
      dataIndex: "shipping_first_name",
      width: 350,
      editable: true,
      sorter: (a, b) =>
        (a.shipping_first_name || "|||")
          .toUpperCase()
          .localeCompare((b.shipping_first_name || "|||").toUpperCase()),
    },
    {
      title: "Shipping: Nume",
      dataIndex: "shipping_last_name",
      width: 350,
      editable: true,
      sorter: (a, b) =>
        (a.shipping_last_name || "|||")
          .toUpperCase()
          .localeCompare((b.shipping_last_name || "|||").toUpperCase()),
    },
    {
      title: "Shipping: Nume Companie",
      dataIndex: "shipping_company_name",
      width: 350,
      editable: true,
      sorter: (a, b) =>
        (a.shipping_company_name || "|||")
          .toUpperCase()
          .localeCompare((b.shipping_company_name || "|||").toUpperCase()),
    },
    {
      title: "Shipping: Companie",
      dataIndex: "shipping_company",
      width: 350,
      editable: true,
      sorter: (a, b) =>
        (a.shipping_company || "|||")
          .toUpperCase()
          .localeCompare((b.shipping_company || "|||").toUpperCase()),
    },
    {
      title: "Shipping: Adresa 1",
      dataIndex: "shipping_addr_1",
      width: 350,
      editable: true,
      sorter: (a, b) =>
        (a.shipping_addr_1 || "|||")
          .toUpperCase()
          .localeCompare((b.shipping_addr_1 || "|||").toUpperCase()),
    },
    {
      title: "Shipping: Adresa 2",
      dataIndex: "shipping_addr_2",
      width: 350,
      editable: true,
      sorter: (a, b) =>
        (a.shipping_addr_2 || "|||")
          .toUpperCase()
          .localeCompare((b.shipping_addr_2 || "|||").toUpperCase()),
    },
    {
      title: "Shipping: Oras",
      dataIndex: "shipping_city",
      width: 350,
      editable: true,
      sorter: (a, b) =>
        (a.shipping_city || "|||")
          .toUpperCase()
          .localeCompare((b.shipping_city || "|||").toUpperCase()),
    },
    {
      title: "Shipping: Tara",
      dataIndex: "shipping_country",
      width: 350,
      editable: true,
      sorter: (a, b) =>
        (a.shipping_country || "|||")
          .toUpperCase()
          .localeCompare((b.shipping_country || "|||").toUpperCase()),
    },
    {
      title: "Shipping: Email",
      dataIndex: "shipping_email",
      width: 350,
      editable: true,
      sorter: (a, b) =>
        (a.shipping_email || "|||")
          .toUpperCase()
          .localeCompare((b.shipping_email || "|||").toUpperCase()),
    },
    {
      title: "Shipping: Telefon",
      dataIndex: "shipping_phone",
      width: 350,
      editable: true,
      sorter: (a, b) =>
        (a.shipping_phone || "|||")
          .toUpperCase()
          .localeCompare((b.shipping_phone || "|||").toUpperCase()),
    },
    {
      title: "Shipping: Cod Postal",
      dataIndex: "shipping_postcode",
      width: 350,
      editable: true,
      sorter: (a, b) =>
        (a.shipping_postcode || "|||")
          .toUpperCase()
          .localeCompare((b.shipping_postcode || "|||").toUpperCase()),
    },
    {
      title: "Shipping: State",
      dataIndex: "shipping_state",
      sorter: (a, b) =>
        (a.shipping_state || "|||")
          .toUpperCase()
          .localeCompare((b.shipping_state || "|||").toUpperCase()),
      width: 350,
      editable: true,
    },
  ];
};
