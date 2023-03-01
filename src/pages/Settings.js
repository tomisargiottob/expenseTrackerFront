import { message, Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import Spinner from "../components/Spinner";
import "../resources/transactions.css";
import {
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import AddEditAccount from "../components/AddEditAccount";

function Settings() {
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddEditAccountModal, setShowAddEditAccountModal] = useState(false);
  const [selectedItemForEdit, setSelectedItemForEdit] = useState(null);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [accountsData, setAccountsData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const getAccounts = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("expense-tracker-user"));
      console.log(user)
      setLoadingAccounts(true);
      const response = await axios.get(
        `/api/organizations/${user.organization}/accounts`,
        {
          organization: user.organization,
        }
      );
      setAccountsData(response.data);
      setLoadingAccounts(false);
    } catch (error) {
        setLoadingAccounts(false);
      message.error("Something went wrong");
    }
  };
  const getCategories = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("expense-tracker-user"));

      setLoadingCategories(true);
      const response = await axios.get(
        `/api/organizations/${user.organization}/categories`,
      );
      setCategoriesData(response.data);
      setLoadingCategories(false);
    } catch (error) {
        setLoadingCategories(false);
      message.error("Something went wrong");
    }
  };

  const deleteAccount = async (record) => {
    try {
      const user = JSON.parse(localStorage.getItem("expense-tracker-user"));
      setLoadingAccounts(true);
      await axios.delete(`/api/organizations/${user.organization}/account/${record._id}`)
      message.success("Transaction Deleted successfully");
      getAccounts();
      setLoadingAccounts(false);
    } catch (error) {
      setLoadingAccounts(false);
      message.error("Something went wrong");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => {
        return (
          <div>
            <EditOutlined
              onClick={() => {
                setSelectedItemForEdit(record);
                setShowAddEditAccountModal(true);
              }}
            />
            <DeleteOutlined
              className="mx-3"
              onClick={() => deleteAccount(record)}
            />
          </div>
        );
      },
    },
  ];
  const getPaginationConfiguration = (data, pageSize) => data.length > pageSize ? {pageSize} : false
  console.log(showAddEditAccountModal)
  useEffect(() => {
    getAccounts();
    getCategories();
  }, []);

  return (
    <DefaultLayout>
      {loadingAccounts && <Spinner />}
      <div className="d-flex justify-content-between mb-3">
        <h2>Accounts</h2>
        <button
          className="primary"
          onClick={() => setShowAddEditAccountModal(true)}
        >
          ADD NEW
        </button>
      </div>
      <div className="filter d-flex justify-content-between align-items-center">
        <div className="d-flex">
          <div className="table-analtics">  
            <div className="table">
              <Table columns={columns} dataSource={accountsData} pagination={getPaginationConfiguration(accountsData,10)}/>
            </div> 
          </div>
        </div>
      </div>

      {showAddEditAccountModal && (
        <AddEditAccount
          showAddEditAccountModal={showAddEditAccountModal}
          setShowAddEditAccountModal={setShowAddEditAccountModal}
          selectedItemForEdit={selectedItemForEdit}
          getAccounts={getAccounts}
          setSelectedItemForEdit={setSelectedItemForEdit}
        />
      )}
    </DefaultLayout>
  );
}

export default Settings;
