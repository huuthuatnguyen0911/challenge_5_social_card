import logo from '../../assets/icon_logo.svg'
import styles from './headerLogo.module.scss'
interface Props {
  openModal: (action: string, id: string) => void
}
export default function HeaderLogo(props: Props) {
  const { openModal } = props
  return (
    <div className={styles.headerLogo}>
      <div className={styles.container}>
        <a href='#'>
          <img className={styles.headerLogo__logo} src={logo} alt='header logo' />
        </a>
        <button className={styles.btn_header} id={styles.add_task} onClick={() => openModal('add', '')}>
          <svg
            className={styles.icon_create}
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            viewBox='0 0 20 20'
            fill='none'
          >
            <path
              d='M9.66675 9.16666V4.16666H11.3334V9.16666H16.3334V10.8333H11.3334V15.8333H9.66675V10.8333H4.66675V9.16666H9.66675Z'
              fill='#FEFCFE'
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
