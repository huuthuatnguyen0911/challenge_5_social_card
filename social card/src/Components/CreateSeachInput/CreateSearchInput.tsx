/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import styles from './createsearchInput.module.scss'
import { SearchOutlined } from '@ant-design/icons'
import { AutoComplete, Button, Flex, Input, Tag } from 'antd'
import { Cards } from '~/@type/cards.type'
import { CloseCircleOutlined } from '@ant-design/icons'
import { useState } from 'react'

interface Props {
  openModal: (action: string, id: string) => void
  handleChangedSearchText: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  searchText: string
  seachCard: (cards: Cards[], searchText: string) => Cards[]
  cards: Cards[]
  searchHistory: string[]
}

export default function CreateSearchInput(props: Props) {
  const { openModal, handleChangedSearchText, searchText, seachCard, cards, searchHistory } = props
  const [options, setOptions] = useState<string[]>([])

  const handleSubmut = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    seachCard(cards, searchText)
  }
  const renderOptions = () => {
    if (!searchText && searchHistory.length !== 0) {
      // Hiển thị lịch sử tìm kiếm nếu không có nội dung nhập vào
      return searchHistory.map((item) => ({
        value: item,
        label: (
          <div>
            <span style={{ marginRight: '8px' }}>{item}</span>
            <Tag closable onClose={() => false}></Tag>
          </div>
        )
      }))
    } else if (!searchText && searchHistory.length === 0) {
      return [{ value: 'no result', label: <div>Abc</div> }]
    } else if (searchText && options.length === 0) {
      return [{ value: 'no result', label: <div>No result</div> }]
    }

    return options.map((name: any) => ({
      value: name
    }))
  }
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
            options={renderOptions()}
            maxLength={50}
            filterOption={(inputValue, option) => option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
          >
            <Input
              value={searchText}
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
