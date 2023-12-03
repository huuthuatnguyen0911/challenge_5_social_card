/* eslint-disable @typescript-eslint/no-unused-vars */
import type { PaginationProps } from 'antd'
import { Pagination } from 'antd'
import styles from './pagination.module.scss'
import { Cards } from '~/@type/cards.type'

interface Props {
  cards: Cards[]
}
export default function PaginationFooter(props: Props) {
  const { cards } = props

  const itemRender: PaginationProps['itemRender'] = (_, type, originalElement) => {
    if (type === 'prev') {
      return <a>{'<'} Prev</a>
    }
    if (type === 'next') {
      return <a>Next {'>'}</a>
    }
    return originalElement
  }

  return (
    <div className={styles.container}>
      {cards.length > 1 ? <Pagination total={85} itemRender={itemRender} showSizeChanger /> : ''}
    </div>
  )
}
