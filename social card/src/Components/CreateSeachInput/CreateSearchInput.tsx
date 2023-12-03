/* eslint-disable @typescript-eslint/no-unused-vars */

import styles from './createsearchInput.module.scss'
import { SearchOutlined } from '@ant-design/icons'
import { AutoComplete, Button, Flex, Input } from 'antd'
import { useState } from 'react'
import { Cards } from '~/@type/cards.type'

interface Props {
  openModal: (action: string, id: string) => void
  handleChangedSearchText: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  searchText: string
  seachCard: (cards: Cards[], searchText: string) => Cards[]
  cards: Cards[]
}

export default function CreateSearchInput(props: Props) {
  const { openModal, handleChangedSearchText, searchText, seachCard, cards } = props

  const handleSubmut = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    seachCard(cards, searchText)
  }
  const options = [{ value: 'Burns Bay Road' }, { value: 'Downing Street' }, { value: 'Wall Street' }]

  return (
    <Flex className='' justify='space-between' align='flex-start'>
      <button className={styles.button_create} id={styles.add_task} onClick={() => openModal('add', '')}>
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
        Create new card
      </button>

      <div className={styles.search_input}>
        <form onSubmit={handleSubmut}>
          <AutoComplete
            options={options}
            filterOption={(inputValue, option) => option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
          >
            <Input
              value={searchText}
              maxLength={50}
              onKeyPress={(event) => {
                if (/[0-9]/.test(event.key)) {
                  event.preventDefault()
                }
              }}
              className={styles.input}
              style={{ width: 364, height: 44, padding: 12 }}
              placeholder='Search..'
              onChange={handleChangedSearchText}
            />
          </AutoComplete>
          <Button
            htmlType='submit'
            className={styles.button_search}
            style={{ width: 44, height: 44 }}
            icon={<SearchOutlined style={{}} className={styles.icon_search} />}
          />
        </form>
      </div>
    </Flex>
  )
}
