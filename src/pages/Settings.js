import { DatePicker, message, Select, Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import AddEditTransaction from "../components/AddEditTransaction";
import DefaultLayout from "../components/DefaultLayout";
import Spinner from "../components/Spinner";
import "../resources/transactions.css";
import {
  UnorderedListOutlined,
  AreaChartOutlined,
} from "@ant-design/icons";
const { RangePicker } = DatePicker;
function Home() {
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
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
        `/api/organizations/${user.organization._id}/accounts`,
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
        `/api/organizations/${user.organization._id}/categories`,
      );
      setCategoriesData(response.data);
      setLoadingCategories(false);
    } catch (error) {
        setLoadingCategories(false);
      message.error("Something went wrong");
    }
  };

  useEffect(() => {
    getAccounts();
    getCategories();
  }, []);

  return (
    <DefaultLayout>
      {loadingAccounts && <Spinner />}
      <div className="filter d-flex justify-content-between align-items-center">
        <div className="d-flex">
        </div>
      </div>

      {showAddCategoryModal && (
        <AddEditTransaction
          showAddEditTransactionModal={showAddCategoryModal}
          setShowAddEditTransactionModal={setShowAddCategoryModal}
          selectedItemForEdit={selectedItemForEdit}
          getTransactions={getAccounts}
          setSelectedItemForEdit={setSelectedItemForEdit}
        />
      )}
    </DefaultLayout>
  );
}

export default Home;
