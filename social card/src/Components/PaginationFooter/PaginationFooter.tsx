/* eslint-disable @typescript-eslint/no-unused-vars */
import { Pagination, PaginationProps } from 'antd'
import './pagination.scss'
import arrowLeftIcon from '../../assets/icon_arrow_left.svg'
import arrowRightIcon from '../../assets/icon_arrow_right.svg'
import { Cards } from '~/@type/cards.type'
import { useState } from 'react'

interface Props {
  cards: Cards[]
}
export default function PaginationFooter(props: Props) {
  const { cards } = props
  const [cardsPerPage, setCardsPerPage] = useState<Cards[]>([])

  const onChange = (page: number, pageSize: number) => {
    const start = (page - 1) * pageSize
    const end = start + pageSize
    setCardsPerPage(cards.slice(start, end))
  }
  return (
    <></>
  )
}
