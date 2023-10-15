import React from "react";
import styles from "./navbar.module.scss";
import classNames from "classnames";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className={styles.wrapper}>
      <div className={classNames("container", styles.linksWrapper)}>
        <Link className={styles.link} to="/">
          Home
        </Link>
        <Link className={styles.link} to="/create-company">
          Create company
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
