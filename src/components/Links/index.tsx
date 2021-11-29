import React, { Component } from 'react'
import styles from "./links.module.css"
import { NavLink } from 'react-router-dom'
export default class index extends Component {
  public render() {
    return (
      <div className={styles.allLinks}>
        <div className={styles.link}><NavLink exact activeClassName={styles.linkActive} to="/">{"Info"}</NavLink></div>
        <div className={styles.link}><NavLink exact activeClassName={styles.linkActive} to="/bank">{"BANK"}</NavLink></div>
        <div className={styles.link}><NavLink exact activeClassName={styles.linkActive} to="/gov">{"GOV"}</NavLink></div>
        <div className={styles.link}><NavLink exact activeClassName={styles.linkActive} to="/bonds">{"Bonds"}</NavLink></div>
        <div className={styles.link}><NavLink exact activeClassName={styles.linkActive} to="/loan">Loan</NavLink></div>
        <div className={styles.link}><NavLink exact activeClassName={styles.linkActive} to="/ref">Ref</NavLink></div>
      </div>
    )
  }
}
