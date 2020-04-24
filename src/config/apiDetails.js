const apiDetails = {
  url: 'http://localhost:8000',
  endpoints: {
    login: '/api/users/login',
    register: '/api/users/register',
    forgotPassword: '/api/users/forgotpassword',
    resetPassword: '/api/users/resetpassword'
  }
};

export { apiDetails };
