import styles from './cardList.module.scss'
import { Col, Row, Pagination, PaginationProps, Input, Popover, Button } from 'antd'
import icon_more from '../../assets/icon_more.svg'
import icon_heart from '../../assets/icon_heart.svg'
import icon_comment from '../../assets/icon_comment.svg'
import { Cards } from '~/@type/cards.type'
import img_no_avt from '../../assets/img_no_avt.svg'
import icon_heart_handled from '../../assets/icon_heart_handled.svg'
import img_search_no_result from '../../assets/img_search_no_result.svg'
import arrowLeftIcon from '../../assets/icon_arrow_left.svg'
import arrowRightIcon from '../../assets/icon_arrow_right.svg'
import '../custom_antd.scss'
import '../PaginationFooter/pagination.scss'
import { useState, useRef, useEffect } from 'react'

interface Props {
  cards: Cards[]
  openModal: (action: string, id: string) => void
  openDetailCard: (id: string) => void
  clickReaction: (id: string) => void
  searchText: string
  handleClickHeart: string
  formatReactions: (reactions: number) => string
}

export default function CardList(props: Props) {
  const { cards, openModal, openDetailCard, clickReaction, formatReactions, handleClickHeart } = props
  const [hoveredCard, setHoveredCard] = useState(null)
  const [clickedCard, setClickedCard] = useState(null)
  const [inputValue, setInputValue] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  let pageSize = 10
  if (window.innerWidth < 415) {
    pageSize = 5
  }
  const cardsToDisplay = cards.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const itemRender: PaginationProps['itemRender'] = (_, type, originalElement) => {
    if (type === 'prev') {
      return (
        <a className='prev'>
          <img src={arrowLeftIcon} alt='arrow-right-icon' />
          <div>Prev</div>
        </a>
      )
    }
    if (type === 'next') {
      return (
        <a className='next'>
          <div>Next</div>
          <img src={arrowRightIcon} alt='arrow-right-icon' />
        </a>
      )
    }

    return originalElement
  }

  const onChange = (page: number) => {
    setCurrentPage(page)
    setInputValue(page)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (inputValue > Math.ceil(cards.length / 10)) {
      setInputValue(Math.ceil(cards.length / 10))
      setCurrentPage(Math.ceil(cards.length / 10))
    } else if (inputValue < 1) {
      setInputValue(1)
      setCurrentPage(1)
    } else {
      setCurrentPage(inputValue ? inputValue : 1)
    }
  }

  const handleHoverChange = (cardId: any, isOpen: any) => {
    if (isOpen) {
      setHoveredCard(cardId)
      setClickedCard(null)
    } else {
      setHoveredCard(null)
    }
  }

  const handleClickChange = (cardId: any, isOpen: any) => {
    if (isOpen) {
      setClickedCard(cardId)
      setHoveredCard(null)
    } else {
      setClickedCard(null)
    }
  }

  return (
    <>
      <div className={styles.cardList}>
        {cards.length === 0 ? (
          <div className={styles.container_no_result}>
            <img src={img_search_no_result} alt='_blank' />
            <p>Sorry, no result found</p>
            <p>Try adjusting your search to find what you’re looking for.</p>
          </div>
        ) : (
          <Row gutter={16}>
            {cardsToDisplay.map((card) => (
              <Col span={12} className={styles.card} key={card.id}>
                <div className={styles.card_container}>
                  <div className={styles.card_content}>
                    <img
                      onClick={() => openDetailCard(card.id)}
                      className={styles.img_avatar}
                      alt='example'
                      src={card.url ? card.url : img_no_avt}
                    />
                    <div className={styles.card_body} onClick={() => openDetailCard(card.id)}>
                      <div className={styles.card_title}>{card.name}</div>
                      <div className={styles.card_description}>{card.description}</div>
                    </div>

                    <Popover
                      style={{ width: 500 }}
                      content={
                        <div className={styles.dropdown_content}>
                          <a
                            onClick={() => {
                              openModal('edit', card.id)
                              setHoveredCard(null)
                            }}
                          >
                            Edit
                          </a>
                          <a
                            onClick={() => {
                              openModal('delete', card.id)
                              setHoveredCard(null)
                            }}
                          >
                            Delete
                          </a>
                        </div>
                      }
                      trigger='hover'
                      visible={hoveredCard === card.id}
                      onVisibleChange={(visible) => handleHoverChange(card.id, visible)}
                      placement='bottomRight'
                    >
                      <Popover
                        content={
                          <div className={styles.dropdown_content}>
                            <a
                              onClick={() => {
                                setClickedCard(null)
                                openModal('edit', card.id)
                              }}
                            >
                              Edit
                            </a>
                            <a
                              onClick={() => {
                                openModal('delete', card.id)
                                setClickedCard(null)
                              }}
                            >
                              Delete
                            </a>
                          </div>
                        }
                        trigger='click'
                        visible={clickedCard === card.id}
                        onVisibleChange={(visible) => handleClickChange(card.id, visible)}
                        placement='bottomRight'
                      >
                        <img
                          className={`${styles.icon_more} ${clickedCard === card.id ? styles.bg_icon_more : ''} `}
                          src={icon_more}
                          alt='_blank'
                        />
                      </Popover>
                    </Popover>
                  </div>
                  <div className={styles.border_top} onClick={() => openDetailCard(card.id)}></div>

                  <div className={styles.card_action}>
                    <div className={styles.card_action_item} style={{ marginRight: 24 }}>
                      <img
                        onClick={() => clickReaction(card.id)}
                        className={styles.card_icon_heart}
                        src={handleClickHeart === card.id ? icon_heart_handled : icon_heart}
                        alt=''
                      />
                      <span
                        className={
                          handleClickHeart === card.id
                            ? styles.span_purple
                            : card.reactions > 0
                              ? styles.span_purple
                              : ''
                        }
                      >
                        {formatReactions(card.reactions)}
                      </span>
                    </div>

                    <div className={styles.card_action_item} onClick={() => openDetailCard(card.id)}>
                      <img src={icon_comment} alt='' />
                      <span style={{ marginRight: 8 }}>{card.comments.length}</span>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </div>
      <div className={styles.wrap_pagination}>
        {cards.length > 10 ? (
          <>
            <Pagination
              showQuickJumper
              showSizeChanger
              current={currentPage}
              defaultCurrent={1}
              showLessItems
              total={cards.length}
              itemRender={itemRender}
              onChange={onChange}
            />
            <form onSubmit={handleSubmit}>
              <span className={styles.span_pagination}>
                Page &nbsp;
                <Input
                  className={styles.input_pagination}
                  type='number'
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(parseInt(e.target.value))
                    let value = parseInt(e.target.value)
                    if (value > Math.ceil(cards.length / 10)) {
                      setCurrentPage(Math.ceil(cards.length / 10))
                    } else if (value < 1) {
                      setCurrentPage(1)
                    } else if (!value) {
                      setCurrentPage((prev) => prev)
                    } else {
                      setCurrentPage(value)
                    }
                  }}
                />
                &nbsp;of {Math.ceil(cards.length / 10)}
              </span>
            </form>
          </>
        ) : (
          ''
        )}
      </div>
    </>
  )
}
