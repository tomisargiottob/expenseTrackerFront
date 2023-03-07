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
import AddEditCategory from "../components/AddEditCategory";

function Settings() {
  const [showAddEditCategoryModal, setShowAddEditCategoryModal] = useState(false);
  const [showAddEditAccountModal, setShowAddEditAccountModal] = useState(false);
  const [selectedItemForEdit, setSelectedItemForEdit] = useState(null);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [accountsData, setAccountsData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const getAccounts = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("expense-tracker-user"));
      setLoadingAccounts(true);
      const response = await axios.get(
        `/api/organizations/${user.organization}/accounts`,
        {
          organization: user.organization,
        }
      );
      const accounts = response.data.map((account) => ({...account, key: account._id}))
      setAccountsData(accounts);
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
      const categories = response.data.map((category) => ({...category, key: category._id}))
      setCategoriesData(categories);
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
      await axios.delete(`/api/organizations/${user.organization}/accounts/${record._id}`)
      message.success("Account Deleted successfully");
      await getAccounts();
      setLoadingAccounts(false);
    } catch (error) {
      setLoadingAccounts(false);
      message.error("Something went wrong");
    }
  };

  const deleteCategory = async (record) => {
    try {
      const user = JSON.parse(localStorage.getItem("expense-tracker-user"));
      setLoadingCategories(true);
      await axios.delete(`/api/organizations/${user.organization}/categories/${record._id}`)
      message.success("Category Deleted successfully");
      await getCategories();
      setLoadingCategories(false);
    } catch (error) {
      setLoadingCategories(false);
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

  const categoryColumns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
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
              onClick={() => deleteCategory(record)}
            />
          </div>
        );
      },
    },
  ];


  const getPaginationConfiguration = (data, pageSize) => data.length > pageSize ? {pageSize} : false
  useEffect(() => {
    getAccounts();
    getCategories();
  }, []);

  return (
    <DefaultLayout>
      {loadingAccounts ? <Spinner /> : (
        <>
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
        </>
      )}

      {loadingCategories ? <Spinner /> : (
        <>
          <div className="d-flex justify-content-between mb-3 mt-5">
            <h2>Categories</h2>
            <button
              className="primary"
              onClick={() => setShowAddEditCategoryModal(true)}
            >
              ADD NEW
            </button>
          </div>
          <div className="filter d-flex justify-content-between align-items-center">
            <div className="d-flex">
              <div className="table-analtics">  
                <div className="table">
                  <Table columns={categoryColumns} dataSource={categoriesData} pagination={getPaginationConfiguration(accountsData,10)}/>
                </div> 
              </div>
            </div>
          </div>
        </>
      )}

      {showAddEditAccountModal && (
        <AddEditAccount
          showAddEditAccountModal={showAddEditAccountModal}
          setShowAddEditAccountModal={setShowAddEditAccountModal}
          selectedItemForEdit={selectedItemForEdit}
          getAccounts={getAccounts}
          setSelectedItemForEdit={setSelectedItemForEdit}
        />
      )}

      {showAddEditCategoryModal && (
        <AddEditCategory
          showAddEditCategoryModal={showAddEditCategoryModal}
          setShowAddEditCategoryModal={setShowAddEditCategoryModal}
          selectedItemForEdit={selectedItemForEdit}
          getCategories={getCategories}
          setSelectedItemForEdit={setSelectedItemForEdit}
        />
      )}
    </DefaultLayout>
  );
}

export default Settings;
