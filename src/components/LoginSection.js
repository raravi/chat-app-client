import React from 'react';

/**
 * LoginSection component
 * contains the Login 'page'.
 */
export const LoginSection = (props) => {
  return (
    <section className="login">
      <div className="login__header-group">
      <h2 className="login__header login__header--selected">Login</h2>
      <h2 className="login__header" onClick={props.toggleNewUser}>Register</h2>
      </div>
      <input type="email" name="email" className="login__email" placeholder="Email" /><br />
      <label className="login__email-error">{props.loginEmailError}</label>
      <input type="password" name="password" className="login__password" placeholder="Password"/>
      <label className="login__password-error">{props.loginPasswordError}</label><br />
      <button type="button" className="login__submit" onClick={props.login}>Submit</button>
      <div className="login__forgot-passwordblock">
        <span className="login__forgot-password" onClick={props.onClickForgotPassword}>Forgot Password</span>
      </div>
    </section>
  )
}
