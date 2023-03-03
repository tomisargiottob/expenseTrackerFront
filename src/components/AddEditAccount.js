import React, { useState } from "react";
import { Form, Input, message, Modal, Select } from "antd";
import Spinner from "./Spinner";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

function AddEditAccount({
  setShowAddEditAccountModal,
  showAddEditAccountModal,
  selectedItemForEdit,
  setSelectedItemForEdit,
  getAccounts,
}) {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [dialog, setDialog] = useState({title: '', content: ''})

  const handleChange = (event) => {
    setValue(event.target.value);
  };
  const onFinish = async (values) => {
    const isValid = validateFormInput(values)
    if(!isValid) return;
    try {
      const user = JSON.parse(localStorage.getItem("expense-tracker-user"));
      setLoading(true);
      if (selectedItemForEdit) {
        await axios.put(`/api/organizations/${user.organization}/accounts/${selectedItemForEdit._id}`, {
          payload: {
            ...values,
            userid: user._id,
          },
        });
        getAccounts();
        message.success("Account Updated successfully");
      } else {
        await axios.post(`/api/organizations/${user.organization}/accounts`, {
          ...values,
        });
        getAccounts();
        message.success("Account added successfully");
      }
      setShowAddEditAccountModal(false);
      setSelectedItemForEdit(null);
      setLoading(false);
    } catch (error) {
      message.error("Something went wrong");
      setLoading(false);
    }
  };

  const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

  const validateFormInput = (values) => {
    const fields = Object.keys(values);
    const emptyFields = fields.filter((field) => values[field] === undefined || values[field] === '');
    if (emptyFields.length === 0) return true;
    const messagePostfix = emptyFields.length > 1 ? 'fields cannot be empty!' : 'field cannot be empty!'
    const message = `${emptyFields.map(capitalizeFirstLetter).join(', ')} ${messagePostfix}`;
    setOpen(true);
    setDialog({ title: ' Validation Error', content: message });
    return false;
  };

  const resetDialog = () => {
    setOpen(false);
    setDialog({ title: '', content: '' });
  };


  const CustomDialog = ({ open, onClose, title, content }) => {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Modal
      title={selectedItemForEdit ? 'Edit Account' : 'Add Account'}
      visible={showAddEditAccountModal}
      onCancel={() => setShowAddEditAccountModal(false)}
      footer={false}
    >
      <CustomDialog open={open} onClose={resetDialog} title={dialog.title} content={dialog.content} />
      {loading && <Spinner />}
      <Form
        layout="vertical"
        className="transaction-form"
        onFinish={onFinish}
        initialValues={selectedItemForEdit}
        id="accountForm"
      >
        <Form.Item label="Name" name="name" id="name" value={value} onBlur={handleChange}>
          <Input type="text" />
        </Form.Item>

        <Form.Item label="Type" name="type">
          <Select>
            <Select.Option value="bank">Bank</Select.Option>
            <Select.Option value="zenrise">Zenrise</Select.Option>
            <Select.Option value="mercadopago">MercadoPago</Select.Option>
          </Select>
        </Form.Item>

        <div className="d-flex justify-content-end">
          <button className="primary" type="submit">
            SAVE
          </button>
        </div>
      </Form>
    </Modal>
  );
}

export default AddEditAccount;
