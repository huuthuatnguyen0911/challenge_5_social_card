/* eslint-disable @typescript-eslint/no-unused-vars */

import styles from './createsearchInput.module.scss'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Flex, Input, Tooltip } from 'antd'

interface Props {
  openModal: () => void
}

export default function CreateSearchInput(props: Props) {
  const { openModal } = props
  return (
    <Flex className='' justify='space-between' align='flex-start'>
      <button className={styles.button_create} id={styles.add_task} onClick={() => openModal()}>
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
        <Input className={styles.input} style={{ width: 364, height: 44, padding: 12 }} placeholder='Search..' />
        <Button
          className={styles.button_search}
          style={{ width: 44, height: 44 }}
          icon={<SearchOutlined style={{}} className={styles.icon_search} />}
        />
      </div>
    </Flex>
  )
}
