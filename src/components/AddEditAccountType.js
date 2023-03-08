import React, { useState } from "react";
import { Form, Input, message, Modal } from "antd";
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

function AddEditAccountType({
  setShowAddEditAccountTypeModal,
  showAddEditAccountTypeModal,
  selectedItemForEdit,
  setSelectedItemForEdit,
  getAccountTypes,
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
        await axios.put(`/api/organizations/${user.organization}/accountTypes/${selectedItemForEdit._id}`, 
          values,
        );
        await getAccountTypes();
        message.success("Account type Updated successfully");
      } else {
        await axios.post(`/api/organizations/${user.organization}/accountTypes`, values);
        await getAccountTypes();
        message.success("Account type added successfully");
      }
      setShowAddEditAccountTypeModal(false);
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
      title={selectedItemForEdit ? 'Edit Account type' : 'Add Account type'}
      visible={showAddEditAccountTypeModal}
      onCancel={() => setShowAddEditAccountTypeModal(false)}
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

        <div className="d-flex justify-content-end">
          <button className="primary" type="submit">
            SAVE
          </button>
        </div>
      </Form>
    </Modal>
  );
}

export default AddEditAccountType;
