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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    searchCard(cards, searchText)
  }
  const renderOption = (inputValue: any, option: any) => {
    const startIdx = option.value.toLowerCase().indexOf(inputValue.toLowerCase())
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
        <form onSubmit={handleSubmit}>
          <AutoComplete
            options={historySearch.slice(0, 5).map((item) => ({ value: item.searchText }))}
            maxLength={50}
            filterOption={(inputValue, option) => option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
            notFoundContent={searchText.length > 0 ? <span className={styles.no_result}>No result</span> : null}
            optionRender={(option) => {
              return (
                <span style={{ display: 'flex', justifyContent: 'space-between'}}>
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
              {...(window.innerWidth < 600
                ? {
                    prefix: (
                      <Button htmlType='submit' style={{ padding: '0px', border: 'none', boxShadow: 'none' }}>
                        <SearchOutlined style={{ marginInlineEnd: 8, fontSize: 20 }} />
                      </Button>
                    )
                  }
                : { prefix: null })}
              value={searchText}
              onKeyPress={(event) => {
                if (
                  /[0-9]/.test(event.key) ||
                  /['"`!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(event.key) ||
                  (event.key === ' ' && searchText.length === 0)
                ) {
                  event.preventDefault()
                }
              }}
              className={styles.input}
              maxLength={50}
              status={searchText.length > 50 ? 'error' : ''}
              style={{ width: 364, height: 44, padding: 12 }}
              placeholder='Search..'
              onChange={handleChangedSearchText}
            />
          </AutoComplete>
          <Button
            htmlType='submit'
            className={styles.button_search}
            style={{ width: 'auto', height: 44 }}
            icon={<SearchOutlined style={{ padding: 12, fontSize: 20 }} className={styles.icon_search} />}
          />
        </form>
      </div>
    </Flex>
  )
}
