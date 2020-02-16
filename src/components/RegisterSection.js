import React from 'react';

/**
 * RegisterSection component
 * contains the Register 'page'.
 */
export const RegisterSection = (props) => {
  return (
    <section className="register">
      <div className="register__header-group">
        <h2 className="register__header"  onClick={props.toggleNewUser}>Login</h2>
        <h2 className="register__header register__header--selected">Register</h2>
      </div>
      <input type="username" name="username" className="register__username" placeholder="Username" /><br />
      <label className="register__username-error">{props.registerUsernameError}</label>
      <input type="email" name="email" className="register__email" placeholder="Email" /><br />
      <label className="register__email-error">{props.registerEmailError}</label>
      <input type="password" name="password" className="register__password" placeholder="Password"/>
      <label className="register__password-error">{props.registerPasswordError}</label>
      <input type="password" name="password2" className="register__password2" placeholder="Confirm password"/>
      <label className="register__password2-error">{props.registerPassword2Error}</label>
      <label className="register__success">{props.registerSuccess}</label><br />
      <button type="button" className="register__submit" onClick={props.register}>Submit</button>
    </section>
  )
}
