import React, { useState } from "react";
import { Table, Input, InputNumber, Popconfirm, Form, message } from "antd";
import axios from "axios";
import "./ManualPlanning.css";

/**
 * Make a cell editable.
 * @param {Boolean to see if currently editiong or not} editing
 * @param {Index of the data} dataIndex 
 * @param {Name of the field} title 
 * @param {Type of the input} inputType 
 * @param {Instance} record 
 * @param {Index} index  
 */
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

/**
 * Create an editable instance of the row.
 * @param {Instance} props 
 */
const EditableTableTruck = (props) => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.key === editingKey;

  /**
   * Set initial values of the editable row.
   * @param {Editable row} record 
   */
  const edit = (record) => {
    form.setFieldsValue({
      truck_id: "",
      availability: "",
      truck_type: "",
      business_type: "",
      Driver: "",
      terminal: "",
      Owner: "",
      hierarchy: "",
      use_cost: "",
      date: "",
      starting_time: "",
      Remarks: "",
      ...record,
    });
    setEditingKey(record.key);
  };

  /**
   * Handles the cancel button during the edit.
   */
  const cancel = () => {
    setEditingKey("");
  };


  /**
   * Handles account editing process.
   * @param {Id of the truck to be edited} truck_id 
   * @param {New data for the order} Data 
   */
  const editAccount = (truck_id, Data) => {
    return axios
      .patch(`/api/trucks/${truck_id}`, Data)
      .then((res) => {
          message.success("Truck updated successfully");
          return true;
      })
      .catch((error) => {
        if (error.status === 401) {
          message.error("Bad request: " + error.data.message);
        } else if (error.status === 404) {
          message.error("Not Found: " + error.data.message);
        } else if (error.status === 422) {
          message.error("Unprocessable Entity: " + error.data.message);
        } else if (error.status === 503) {
          message.warning("Server not Found: " + error.data.message);
        } else {
          message.error(error.data.message);
        }
        return false;
      });
  };

  /**
   * Handles the click on the save button.
   * @param {Id of the row} key 
   */
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...props.dataSource];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        props.setData(newData);
        setEditingKey("");
        let dataToSend = {};
        for (var val of Object.keys(newData[index])) {
          if (val !== "s_number" && val !== "key") {
            dataToSend[val] = newData[index][val];
          }
        }
        editAccount(key, dataToSend);
      } else {
        newData.push(row);
        props.setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  /**
   * Renders save/cancel buttons and text fields.
   */
  const columnsOrder = [
    ...props.columns,
    {
      title: "Edit Row",
      dataIndex: "editRow",
      fixed: "right",
      width: 110,
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a
              href="#Container"
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </a>
            <Popconfirm
              title="Are you sure you want to cancel?"
              onConfirm={cancel}
            >
              <a href="#Container">Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <a
            href="#Container"
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Edit
          </a>
        );
      },
    },
  ];

  /**
   * Renders the edit form.
   */
  const mergedColumns = columnsOrder.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  /**
   * Renders the edit form.
   */
  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered={true}
        rowSelection={props.rowSelection}
        rowClassName={props.rowClassName}
        dataSource={props.dataSource}
        columns={mergedColumns}
        scroll={{ x: "max-content", y: "50vh" }}
        pagination={{
          onChange: cancel,
        }}
        onRow={props.onRow}
      />
    </Form>
  );
};
export default EditableTableTruck;
