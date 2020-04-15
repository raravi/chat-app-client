import React from 'react';
import {
  Link
} from "react-router-dom";

/**
 * LoginSection component
 * contains the Login 'page'.
 */
export const LoginSection = (props) => {
  return (
    <section className="login">
      <div className="login__header-group">
      <h2 className="login__header login__header--selected">Login</h2>
      <Link to="/register"
            className="login__header"
            data-testid="login-register">
        Register
      </Link>
      </div>
      <input type="email" name="email" className="login__email" placeholder="Email" /><br />
      <label className="login__email-error">{props.loginEmailError}</label>
      <input type="password" name="password" className="login__password" placeholder="Password"/>
      <label className="login__password-error">{props.loginPasswordError}</label><br />
      <button type="button" className="login__submit" data-testid="login-button" onClick={props.login}>Submit</button>
      <div className="login__forgot-passwordblock">
        <Link to="/forgot-password"
              className="login__forgot-password"
              data-testid="login-forgotpassword">
          Forgot Password
        </Link>
      </div>
    </section>
  )
}
