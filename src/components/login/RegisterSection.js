import React from 'react';
import {
  Link
} from "react-router-dom";
import { useLoginContext } from './context';

/**
 * RegisterSection component
 * contains the Register 'page'.
 */
export const RegisterSection = (props) => {
  let { registerState } = useLoginContext();

  return (
    <section className="register">
      <div className="register__header-group">
        <Link to="/"
              className="register__header"
              data-testid="register-login">
          Login
        </Link>
        <h2 className="register__header register__header--selected">Register</h2>
      </div>
      <input type="username" name="username" className="register__username" placeholder="Username" /><br />
      <label className="register__username-error">{registerState.usernameError}</label>
      <input type="email" name="email" className="register__email" placeholder="Email" /><br />
      <label className="register__email-error">{registerState.emailError}</label>
      <input type="password" name="password" className="register__password" placeholder="Password"/>
      <label className="register__password-error">{registerState.passwordError}</label>
      <input type="password" name="password2" className="register__password2" placeholder="Confirm password"/>
      <label className="register__password2-error">{registerState.password2Error}</label>
      <label className="register__success">{registerState.success}</label><br />
      <button type="button" className="register__submit" data-testid="register-button" onClick={props.registerCallback}>Submit</button>
    </section>
  )
}
