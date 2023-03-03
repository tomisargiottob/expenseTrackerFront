import React, { useEffect, useState } from "react";
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

function AddEditTransaction({
  setShowAddEditTransactionModal,
  showAddEditTransactionModal,
  selectedItemForEdit,
  setSelectedItemForEdit,
  getTransactions,
}) {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const [accountsData, setAccountsData] = useState([])
  const [open, setOpen] = useState(false);
  const [dialog, setDialog] = useState({title: '', content: ''})

  const handleChange = (event) => {
    setValue(event.target.value);

    if (event.target.value < 0) {
      setDialog({ title: ' Error', content: 'Value of amount cannot be negative' });
      setOpen(true);
      document.getElementById("myForm").reset();
    }
  };

  const getAccounts = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("expense-tracker-user"));
      const response = await axios.get(
        `/api/organizations/${user.organization}/accounts`,
      );
      setAccountsData(response.data);
    } catch (error) {
      message.error("Something went wrong");
    }
  };


  const onFinish = async (values) => {
    const isValid = validateFormInput(values)
    if(!isValid) return;
    try {
      const user = JSON.parse(localStorage.getItem("expense-tracker-user"));
      setLoading(true);
      if (selectedItemForEdit) {
        await axios.patch(`/api/organizations/${user.organization}/transactions/${selectedItemForEdit._id}`, {
          ...values,
          organization: user.organization,
        });
        getTransactions();
        message.success("Transaction Updated successfully");
      } else {
        await axios.post(`/api/organizations/${user.organization}/transactions`, {
          ...values,
          organization: user.organization,
        });
        getTransactions();
        message.success("Transaction added successfully");
      }
      setShowAddEditTransactionModal(false);
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


  const validateDate = (_, value) => {
    const pickedDate = new Date(value)
    const currentDate = new Date()
    return currentDate.valueOf() < pickedDate.valueOf() ? Promise.reject(new Error('Not accepted')) : Promise.resolve()
  }

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

  useEffect(() => {
    getAccounts()
  },[])

  return (
    <Modal
      title={selectedItemForEdit ? 'Edit Transaction' : 'Add Transaction'}
      visible={showAddEditTransactionModal}
      onCancel={() => setShowAddEditTransactionModal(false)}
      footer={false}
    >
      <CustomDialog open={open} onClose={resetDialog} title={dialog.title} content={dialog.content} />
      {loading && <Spinner />}
      <Form
        layout="vertical"
        className="transaction-form"
        onFinish={onFinish}
        initialValues={selectedItemForEdit}
        id="myForm"
      >
        <Form.Item label="Account" name="account" id="account" value={value} onBlur={handleChange} >
          <Select>
            {accountsData.map((account) => {
              return (<Select.Option key={account._id} value={account._id}>{account.name}</Select.Option>)             
            })}
          </Select>
        </Form.Item>
        <Form.Item label="Account type" name="accountType" id="accountType" value={value} onBlur={handleChange}>
          <Select>
            <Select.Option value="salary">Banco</Select.Option>
            <Select.Option value="freelance">Zenrise</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Date" name="date" rules={[
          {message: 'Invalid Date!', validator: validateDate}
        ]}>
          <Input type="date" />
        </Form.Item>

        <Form.Item label="Amount" name="amount" id="value" value={value} onBlur={handleChange}>
          <Input type="text" />
        </Form.Item>

        <Form.Item label="Type" name="type">
          <Select>
            <Select.Option value="income">Income</Select.Option>
            <Select.Option value="expense">Expense</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Category" name="category">
          <Select>
            <Select.Option value="salary">Salary</Select.Option>
            <Select.Option value="freelance">Freelance</Select.Option>
            <Select.Option value="food">Food</Select.Option>
            <Select.Option value="entertainment">Entertainment</Select.Option>
            <Select.Option value="investment">Investment</Select.Option>
            <Select.Option value="travel">Travel</Select.Option>
            <Select.Option value="education">Education</Select.Option>
            <Select.Option value="medical">Medical</Select.Option>
            <Select.Option value="tax">Tax</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Reference" name="reference">
          <Input type="text" />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input type="text" />
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

export default AddEditTransaction;
