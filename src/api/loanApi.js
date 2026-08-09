import axiosClient from './axiosClient';

const loanApi = {

  createNewLoan: (loanData) => {
    return axiosClient.post('/loans', loanData);
  },

  getAllNewLoans: (params = {}) => {
    return axiosClient.get('/loans', { params });
  },

  getNewLoanById: (loanId) => {
    return axiosClient.get(`/loans/${loanId}`);
  },

  getTransactionByLoanId: (loanId) => {
    return axiosClient.get(`/loans/${loanId}/transactions`);
  },

  addTransactionByLoanId: (loanId, transactionData) => {
    return axiosClient.post(`/loans/${loanId}/transactions`, transactionData);
  },

  markEmiAsPaid: (loanId, installmentNo, paymentData) => {
    return axiosClient.patch(`/loans/${loanId}/emi/${installmentNo}/pay`, paymentData);
  }
};

export default loanApi;