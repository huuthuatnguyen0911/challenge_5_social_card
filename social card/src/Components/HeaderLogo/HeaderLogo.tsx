import React from 'react'
import logo from '../../assets/icon_logo.svg'
import styles from './headerLogo.module.scss'

export default function HeaderLogo() {
  return (
    <div className={styles.headerLogo}>
      <div className={styles.container}>
        <a href='#'>
          <img className={styles.headerLogo__logo} src={logo} alt='header logo' />
        </a>
      </div>
    </div>
  )
}
