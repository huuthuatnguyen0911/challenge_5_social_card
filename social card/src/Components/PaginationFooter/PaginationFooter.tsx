import { Pagination } from 'antd'
import styles from './pagination.module.scss'

export default function PaginationFooter() {
  return (
    <div className={styles.container}>
      <Pagination total={85} showSizeChanger showQuickJumper showTotal={(total) => `Total ${total} items`} />
    </div>
  )
}
