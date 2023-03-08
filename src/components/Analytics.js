import { Progress, message } from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../resources/analytics.css";
function Analytics({ transactions, type }) {
  const [categories, setCategories] =useState([])

  const totalTransactions = transactions.length;
  const totalIncomeTransactions = transactions.filter(
    (transaction) => transaction.type === "income"
  );
  const totalExpenseTransactions = transactions.filter(
    (transaction) => transaction.type === "expense"
  );
  const totalIncomeTransactionsPercentage =
    ((totalIncomeTransactions.length / totalTransactions) || 0) * 100;
  const totalExpenseTransactionsPercentage =
    ((totalExpenseTransactions.length / totalTransactions) || 0) * 100;

  const totalTurnover = transactions.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );
  const totalIncomeTurnover = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((acc, transaction) => acc + transaction.amount, 0);
  const totalExpenseTurnover = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((acc, transaction) => acc + transaction.amount, 0);
  console.log(totalExpenseTurnover);
  const totalIncomeTurnoverPercentage =
    ((totalIncomeTurnover / totalTurnover) || 0) * 100;
  const totalExpenseTurnoverPercentage =
    ((totalExpenseTurnover / totalTurnover) || 0) * 100;

  const getCategories = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("expense-tracker-user"));
      const response = await axios.get(
        `/api/organizations/${user.organization}/categories`,
      );
      setCategories(response.data);
    } catch (error) {
      message.error("Something went wrong");
    }
  };
  const EmptyPlaceholder = ({message}) => <div className="empty-placeholder">{message}</div>

  const CategoryWiseTransactionChart = ({transactionType, totalTurnOver}) => {
    const incomeList = []
    categories.forEach((category) => {
      const amount = transactions
        .filter((t) => t.type === transactionType && t.category._id === category._id)
        .reduce((acc, t) => acc + t.amount, 0);
      amount > 0 && incomeList.push(
        <div className="category-card">
          <h5>{category.name}</h5>
          <Progress strokeColor="#0B5AD9" percent={((amount / totalTurnOver) * 100).toFixed( 0 )} />
        </div>
      );
    })
    return incomeList.length ? incomeList : <EmptyPlaceholder message={`No ${transactionType} found for the selected duration and type`}/>
  }

  useEffect(() =>{
    getCategories()
  },[])

  return (
    <div className="analytics">
      <div className="row">
        <div className="col-md-4 mt-3">
          <div className="transactions-count">
            <h4>Total Transactions : {totalTransactions}</h4>
            <hr />
            <h5>Income : {totalIncomeTransactions.length}</h5>
            <h5>Expense : {totalExpenseTransactions.length}</h5>

            <div className="progress-bars">
              <Progress
                className="mx-5"
                strokeColor="#5DD64F"
                type="circle"
                percent={totalIncomeTransactionsPercentage.toFixed(0)}
              />
              <Progress
                strokeColor="#E5572F"
                type="circle"
                percent={totalExpenseTransactionsPercentage.toFixed(0)}
              />
            </div>
          </div>
        </div>

        <div className="col-md-4 mt-3">
          <div className="transactions-count">
            <h4>Total Turnover : {totalTurnover}</h4>
            <hr />
            <h5>Income : {totalIncomeTurnover}</h5>
            <h5>Expense : {totalExpenseTurnover}</h5>

            <div className="progress-bars">
              <Progress
                className="mx-5"
                strokeColor="#5DD64F"
                type="circle"
                percent={totalIncomeTurnoverPercentage.toFixed(0)}
              />
              <Progress
                strokeColor="#E5572F"
                type="circle"
                percent={totalExpenseTurnoverPercentage.toFixed(0)}
              />
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="row">
      {(type === 'all' || type === 'income') &&(
          <div className="col-md-6">
            <div className="category-analysis">
              <h4 className="category-analysis-header">Income - Category Wise</h4>
              <CategoryWiseTransactionChart transactionType="income" totalTurnOver={totalIncomeTurnover}/>
            </div>
          </div>
        )}

        {(type === 'all' || type === 'expense') && (
          <div className="col-md-6">
            <div className="category-analysis">
              <h4 className="category-analysis-header">Expense - Category Wise</h4>
              <CategoryWiseTransactionChart transactionType="expense" totalTurnOver={totalExpenseTurnover}/>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Analytics;
