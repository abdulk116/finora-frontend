import axiosClient from "./axiosClient";

const expensesApi = {
  getAllExpensesByUserId: () => {
    return axiosClient.get('/expenses');
  },

  createExpenses: (payload) => {
    return axiosClient.post("/expenses", payload);
  },

  updateExpenseStatus: (payload) => {
    return axiosClient.post('/expenses/status', payload)
  }
}

export default expensesApi;