const loginApiDetails = {
  url: 'https://awq5psvwb3.execute-api.eu-central-1.amazonaws.com/dev',
  // url: 'http://localhost:4000/dev',
  endpoints: {
    login: '/api/users/login',
    register: '/api/users/register',
    validate: '/api/users/validate',
    forgotPassword: '/api/users/forgotpassword',
    resetPassword: '/api/users/resetpassword'
  }
};

const appApiDetails = {
  url: 'https://blooming-mesa-51462.herokuapp.com',
  // url: 'http://localhost:8000'
};

export { loginApiDetails, appApiDetails };
