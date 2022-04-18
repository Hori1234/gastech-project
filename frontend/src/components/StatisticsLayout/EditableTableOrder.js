import React, { useState } from "react";
import { Table, Input, InputNumber, Popconfirm, Form, message } from "antd";
import axios from "axios";

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
const EditableTableOrder = (props) => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.key === editingKey;

  /**
   * Set initial values of the editable row.
   * @param {Editable row} record 
   */
  const edit = (record) => {
    form.setFieldsValue({
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
   * @param {Id of the order to be edited} order_id 
   * @param {New data for the order} Data 
   */

  /**
   * Handles the click on the save button.
   * @param {Id of the row} key 
   */


  /**
   * Renders save/cancel buttons and text fields.
   */
  const columnsOrder = [
    ...props.columns,
    
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
        dataSource={props.dataSource}
        columns={mergedColumns}
        scroll={{ x: "max-content", y: "50vh" }}
        pagination={{
          defaultPageSize: 6,
          pageSizeOptions:['6','10','50','100'],
          onChange: cancel,
        }}
      />
    </Form>
  );
};
export default EditableTableOrder;
