import axiosClient from "./axiosClient";

const expensesApi = {
  getAllExpensesByUserId: (startDate, endDate) => {
    return axiosClient.get(`/expenses?startDate=${startDate}&endDate=${endDate}`);
  },

  createExpenses: (payload) => {
    return axiosClient.post("/expenses", payload);
  },

  updateExpenseStatus: (payload) => {
    return axiosClient.post('/expenses/status', payload)
  }
}

export default expensesApi;