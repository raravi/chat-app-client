import React from 'react';
import { act, render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axiosMock from 'axios';
import jwtDecodeMock from 'jwt-decode';
import App from './App';

jest.mock('axios');
jest.mock('jwt-decode');
console.error = jest.fn();

let loginData = {
      token: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlNDVmNzUzZWNkNzRkYzUxODc1ZDNkOSIsIm5hbWUiOiJBbWl0aCBSYXJhdmkiLCJpYXQiOjE1ODYxMzMyNTQsImV4cCI6MTYxNzY5MDE4MH0.rlS_1QxEHh5BU1DeJOIoaZmvpfzSn3qmpNV4mAP1LWg',
      tokenDecoded: {
        id: "5e45f753ecd74dc51875d3d9",
        name: "Amith Raravi",
        iat: 1586133254,
        exp: 1617690180
      },
      url: 'http://localhost:8000/api/users/login',
      options: {"email": "", "password": ""},
      successResponse: null
    };

beforeEach(() => {
  loginData.successResponse = {
    data: {
      success: true
    }
  };
});

afterEach(() => {
  axiosMock.post.mockReset();
  jwtDecodeMock.mockReset();
});

/**
 * LOGIN page
 */
describe('Login Page', () => {
  it('submit button is present', () => {
    const { getByTestId } = render(<App />);

    expect(getByTestId('login-button')).toBeInTheDocument();
  });

  it('login is successful', async () => {
    loginData.successResponse.data.token = loginData.token;
    axiosMock.post.mockResolvedValueOnce(loginData.successResponse);
    jwtDecodeMock.mockImplementation(() => loginData.tokenDecoded);
    const { getByTestId, findByTestId } = render(<App />);

    act(() => {
      fireEvent.click(getByTestId('login-button'));
    });

    const dashboardNoteElement = await findByTestId('message-section');
    expect(axiosMock.post).toHaveBeenCalledTimes(1);
    expect(axiosMock.post).toHaveBeenCalledWith(loginData.url, loginData.options);
  });

  it('Register link is clicked', () => {
    const { getByTestId } = render(<App />);

    fireEvent.click(getByTestId('login-register'));

    expect(getByTestId('register-button')).toBeInTheDocument();
  });

  it('Forgot Password is clicked', () => {
    const { getByTestId } = render(<App />);

    fireEvent.click(getByTestId('login-forgotpassword'));

    expect(getByTestId('forgotpassword-button')).toBeInTheDocument();
  });
});
