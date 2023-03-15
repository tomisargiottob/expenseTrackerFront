import { DatePicker, message, Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import AddEditTransaction from "../components/AddEditTransaction";
import DefaultLayout from "../components/DefaultLayout";
import Spinner from "../components/Spinner";
import "../resources/transactions.css";
import {
  UnorderedListOutlined,
  AreaChartOutlined,
  EditOutlined,
  DeleteOutlined,
  FilterFilled,
} from "@ant-design/icons";
import moment from "moment";
import Analytics from "../components/Analytics";
import TableFilters from "../components/TableFilter";

function Home() {
  const [showAddEditTransactionModal, setShowAddEditTransactionModal] =
    useState(false);
  const [selectedItemForEdit, setSelectedItemForEdit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transactionsData, setTransactionsData] = useState([]);
  const [showFilters, setShowFilters] = useState(false)
  const [formValues, setFormValues] = useState({
    frequency: "30",
    selectedRange: null,
    type: 'all',
    account: 'all',
    category: 'all',
    accountType: 'all'
  })

  const [viewType, setViewType] = useState("table");
  const [accountsData, setAccountsData] = useState([])
  const [categoriesData, setCategoriesData] = useState([])
  const [accountTypesData, setAccountTypesData] = useState([])

  const getTransactions = async ({frequency, selectedRange, type, account, category, accountType}) => {
    try {
      const user = JSON.parse(localStorage.getItem("expense-tracker-user"));
      const selectionFilter = {
        account: account === 'all' ? undefined : account,
        category: category === 'all' ? undefined : category,
        accountType: accountType === 'all' ? undefined : accountType
      }
      setLoading(true);
      const response = await axios.get(
        `/api/organizations/${user.organization}/transactions`,
        {
          params: {
            frequency,
            ...(frequency === "custom" && { selectedRange }),
            type,
            ...selectionFilter
          }
        }
      );
      const transactions = response.data.map((transaction) => ({...transaction, key: transaction._id}))
      setTransactionsData(transactions);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Something went wrong");
    }
  };

  const onFinish = async (values) => {
    try {
      setShowFilters(false)
      setFormValues(values)
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  const deleteTransaction = async (record) => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("expense-tracker-user"));
      await axios.delete(`/api/organizations/${user.organization}/transactions/${record._id}`);
      message.success("Transaction Deleted successfully");
      await getTransactions();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Something went wrong");
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

  const getAccountTypes = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("expense-tracker-user"));
      const response = await axios.get(
        `/api/organizations/${user.organization}/accountTypes`,
      );
      setAccountTypesData(response.data);
    } catch (error) {
      message.error("Something went wrong");
    }
  };
  
  const getCategories = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("expense-tracker-user"));
      const response = await axios.get(
        `/api/organizations/${user.organization}/categories`,
      );
      setCategoriesData(response.data);
    } catch (error) {
      message.error("Something went wrong");
    }
  };


  useEffect(() => {
    getTransactions(formValues);
  }, [formValues]);

  useEffect(()=> {
    getAccountTypes()
    getAccounts()
    getCategories()
  },[])

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (text) => <span>{moment(text).format("YYYY-MM-DD")}</span>,
    },
    {
      title: "Account",
      dataIndex: "account",
      render: item => item.name,
    },
    {
      title: "Account Type",
      dataIndex: "accountType",
      render: item => item.name,
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Category",
      dataIndex: "category",
      render: item => item.name,
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Reference",
      dataIndex: "reference",
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
                setShowAddEditTransactionModal(true);
              }}
            />
            <DeleteOutlined
              className="mx-3"
              onClick={() => deleteTransaction(record)}
            />
          </div>
        );
      },
    },
  ];

  const getPaginationConfiguration = (pageSize) => transactionsData.length > pageSize ? {pageSize} : false

  return (
    <DefaultLayout>
      {showFilters && 
      <>
        <div className='modal-backdrop' onClick={() => setShowFilters(false)}></div>
        <TableFilters 
        accountTypesData={accountTypesData} 
        accountsData={accountsData} 
        categoriesData={categoriesData} 
        setShowFilters={setShowFilters}
        applyFilters={onFinish}
        filterValues={formValues}
        />
      </>
      }

      {loading && <Spinner />}

      <div className="filter d-flex justify-content-between align-items-center">
        <div className="view-switch mx-5">
          <UnorderedListOutlined
            className={`mx-3 ${
              viewType === "table" ? "active-icon" : "inactive-icon"
            } `}
            onClick={() => setViewType("table")}
            size={30}
          />
          <AreaChartOutlined
            className={`${
              viewType === "analytics" ? "active-icon" : "inactive-icon"
            } `}
            onClick={() => setViewType("analytics")}
            size={30}
          />
        </div>
        <div className="d-flex">
          <div className="filter-button"  onClick={() => setShowFilters(true)}>
            <FilterFilled
              size={30}
            />
          </div>
          <button
            className="primary"
            onClick={() => setShowAddEditTransactionModal(true)}
          >
            ADD NEW
          </button>
        </div>       
      </div>

      <div className="table-analtics">
        {viewType === "table" ? (
          <div className="table">
            <Table columns={columns} dataSource={transactionsData} pagination={getPaginationConfiguration(10)}/>
          </div>
        ) : (
          <Analytics transactions={transactionsData} categories={categoriesData} type={formValues.type}/>
        )}
      </div>

      {showAddEditTransactionModal && (
        <AddEditTransaction
          showAddEditTransactionModal={showAddEditTransactionModal}
          setShowAddEditTransactionModal={setShowAddEditTransactionModal}
          selectedItemForEdit={selectedItemForEdit}
          getTransactions={getTransactions}
          setSelectedItemForEdit={setSelectedItemForEdit}
          accountsData={accountsData}
          accountTypesData={accountTypesData}
          categoriesData = {categoriesData}
        />
      )}
    </DefaultLayout>
  );
}

export default Home;
