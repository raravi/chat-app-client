import React from 'react';

/**
 * Header component
 * contains Title text & Logout button.
 */
export const Header = (props) => {
  return (
    <header className={props.userAuthenticated
                    ? "header header--loggedin"
                    : "header"}>
      <h1 className={props.userAuthenticated
                      ? "header__title header__title--loggedin"
                      : "header__title"}>texter</h1>
      <h3 className={props.userAuthenticated
                      ? "header__logout header__logout--loggedin"
                      : "header__logout"}
          onClick={props.logout}
      >logout</h3>
    </header>
  )
}
