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
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import moment from "moment";
import Analytics from "../components/Analytics";
const { RangePicker } = DatePicker;
function Home() {
  const [showAddEditTransactionModal, setShowAddEditTransactionModal] =
    useState(false);
  const [selectedItemForEdit, setSelectedItemForEdit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transactionsData, setTransactionsData] = useState([]);
  const [frequency, setFrequency] = useState("7");
  const [type, setType] = useState("all");
  const [selectedRange, setSelectedRange] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("all")
  const [selectedAccountType, setSelectedAccountType] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")


  const [viewType, setViewType] = useState("table");
  const [accountsData, setAccountsData] = useState([])
  const [categoriesData, setCategoriesData] = useState([])
  const [accountTypesData, setAccountTypesData] = useState([])

  const getTransactions = async (frequency, selectedRange, type, selectedAccount, selectedCategory, selectedAccountType) => {
    try {
      const user = JSON.parse(localStorage.getItem("expense-tracker-user"));
      const selectionFilter = {
        account: selectedAccount === 'all' ? undefined : selectedAccount,
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        accountType: selectedAccountType === 'all' ? undefined : selectedAccountType
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
    console.log('busco transactions')
    getTransactions(frequency, selectedRange, type, selectedAccount, selectedCategory, selectedAccountType);
  }, [frequency, selectedRange, type,selectedAccount, selectedCategory, selectedAccountType]);

  useEffect(()=> {
    console.log('ejecuto')
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
      {loading && <Spinner />}
      <div className="filter d-flex justify-content-between align-items-center">
        <div className="d-flex">
          <div className="d-flex flex-column">
            <h6>Select Frequency</h6>
            <Select value={frequency} onChange={(value) => setFrequency(value)}>
              <Select.Option value="7">Last 1 Week</Select.Option>
              <Select.Option value="30">Last 1 Month</Select.Option>
              <Select.Option value="365">Last 1 Year</Select.Option>
              <Select.Option value="custom">Custom</Select.Option>
            </Select>

            {frequency === "custom" && (
              <div className="mt-2">
                <RangePicker
                  value={selectedRange}
                  onChange={(values) => setSelectedRange(values)}
                />
              </div>
            )}
          </div>
          <div className="d-flex flex-column mx-5">
            <h6>Select Type</h6>
            <Select value={type} onChange={(value) => setType(value)}>
              <Select.Option value="all">All</Select.Option>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </div>
          <div className="d-flex flex-column mx-5">
            <h6>Select Account</h6>
            <Select 
              showSearch={true} 
              placeholder='Select account'
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onSelect={(values) => setSelectedAccount(values)}
              >
              <Select.Option value="all">All</Select.Option>
              {accountsData.map((account) => {
                return (<Select.Option key={account._id} value={account._id}>{account.name}</Select.Option>)             
              })}
            </Select>
          </div>
          <div className="d-flex flex-column mx-5">
            <h6>Select Account Type</h6>
            <Select 
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onSelect={(values) => setSelectedAccountType(values)}
              placeholder="Search Account Type">
              <Select.Option value="all">All</Select.Option>
              {accountTypesData.map((account) => {
                return (<Select.Option key={account._id} value={account._id}>{account.name}</Select.Option>)             
              })}
            </Select>
          </div>
          <div className="d-flex flex-column mx-5">
            <h6>Select Category</h6>
            <Select
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              placeholder='Select category type'
              onSelect={(values) => setSelectedCategory(values)}
            >
            <Select.Option value="all">All</Select.Option>
            {categoriesData.map((category) => {
                return (<Select.Option title={category.description} key={category._id} value={category._id}>{category.name}</Select.Option>)             
              })}
            </Select>
          </div>
        </div>

        <div className="d-flex">
          <div>
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
          <Analytics transactions={transactionsData} categories={categoriesData} type={type}/>
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
