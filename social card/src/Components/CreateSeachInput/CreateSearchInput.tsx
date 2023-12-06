/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import styles from './createsearchInput.module.scss'
import { SearchOutlined, CloseOutlined } from '@ant-design/icons'
import { AutoComplete, Button, Flex, Input } from 'antd'
import { Cards } from '~/@type/cards.type'
import { SearchHistory } from '~/@type/history.type'
import '../custom_antd.scss'

interface Props {
  openModal: (action: string, id: string) => void
  handleChangedSearchText: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  searchText: string
  searchCard: (cards: Cards[], searchText: string) => Cards[]
  cards: Cards[]
  historySearch: SearchHistory[]
  deleteHistorySearch: (id: string) => void
}

export default function CreateSearchInput(props: Props) {
  const { openModal, handleChangedSearchText, searchText, searchCard, cards, historySearch, deleteHistorySearch } =
    props

  const handleSubmut = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    searchCard(cards, searchText)
  }
  const renderOption = (inputValue: any, option: any) => {
    const startIdx = option.value.toUpperCase().indexOf(inputValue.toUpperCase())
    const endIdx = startIdx + inputValue.length

    return (
      <span>
        {option.value.substring(0, startIdx)}
        <span className={styles.matched}>{option.value.substring(startIdx, endIdx)}</span>
        {option.value.substring(endIdx)}
      </span>
    )
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
            options={historySearch.slice(0, 5).map((item) => ({ value: item.searchText }))}
            maxLength={50}
            filterOption={(inputValue, option) => option!.value.indexOf(inputValue) !== -1}
            notFoundContent={<span className={styles.no_result}>No result</span>}
            optionRender={(option) => {
              return (
                <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{renderOption(searchText, option)}</span>
                  <Button
                    size='small'
                    type='text'
                    icon={<CloseOutlined />}
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteHistorySearch(option?.value as string)
                    }}
                  />
                </span>
              )
            }}
            onSelect={(value) => {
              handleChangedSearchText({ target: { value } } as any)
            }}
          >
            <Input
              {...(window.innerWidth < 400 ? { prefix: <SearchOutlined /> } : { prefix: null })}
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
