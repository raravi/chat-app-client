import React from 'react';
import { useLoginContext } from './context';

/**
 * ForgotPassword component
 * contains the Forgot Password 'page'.
 */
export const ResetPassword = (props) => {
  let { resetPasswordState } = useLoginContext();

  return (
    <section className="reset">
      <h2 className="reset__header">Reset Password</h2>
      <p className="reset__text">Please enter the details below to reset your account.</p>
      <input type="text" name="email" className="reset__email" placeholder="Registered email" />
      <label className="reset__email-error">{resetPasswordState.emailError}</label>
      <input type="text" name="code" className="reset__code" placeholder="Reset code" />
      <label className="reset__code-error">{resetPasswordState.resetCodeError}</label>
      <input type="password" name="password" className="reset__password" placeholder="New password"/>
      <label className="reset__password-error">{resetPasswordState.passwordError}</label>
      <input type="password" name="password2" className="reset__password2" placeholder="Confirm password"/>
      <label className="reset__password2-error">{resetPasswordState.password2Error}</label>
      <label className="reset__code-success">{resetPasswordState.success}</label><br />
      <button type="button" className="reset__submit" data-testid="resetpassword-button" onClick={props.resetPasswordCallback}>Submit</button>
    </section>
  )
}
