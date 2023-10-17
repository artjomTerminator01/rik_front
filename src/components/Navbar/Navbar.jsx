import React from "react";
import styles from "./navbar.module.scss";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  return (
    <div className={styles.wrapper}>
      <div className={classNames("container", styles.linksWrapper)}>
        {location.pathname !== "/" && (
          <Link className={styles.link} to="/">
            Home
          </Link>
        )}
        {location.pathname !== "/create-company" && (
          <Link className={styles.link} to="/create-company">
            Create company
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
