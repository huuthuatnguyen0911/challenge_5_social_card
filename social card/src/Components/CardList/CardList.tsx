import styles from './cardList.module.scss'
import { Col, Row, Pagination, PaginationProps, Input } from 'antd'
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
import { useState } from 'react'

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
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const cardsToDisplay = cards.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const itemRender: PaginationProps['itemRender'] = (_, type, originalElement) => {
    if (type === 'prev') {
      return (
        <a className='prev'>
          <img src={arrowLeftIcon} alt='arrow-right-icon' />
          <div>Previous</div>
        </a>
      )
    }
    if (type === 'next') {
      return (
        <>
          <a className='next'>
            <div>Next</div> <img src={arrowRightIcon} alt='arrow-right-icon' />
          </a>
        </>
      )
    }

    return originalElement
  }

  const onChange = (page: number) => {
    setCurrentPage(page)
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
                    <div className={styles.dropdown} style={{ float: 'right' }}>
                      <img className={`${styles.icon_more}`} src={icon_more} alt='_blank' />
                      <div className={styles.dropdown_content}>
                        <a onClick={() => openModal('edit', card.id)}>Edit</a>
                        <a onClick={() => openModal('delete', card.id)}>Delete</a>
                      </div>
                    </div>
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
                      <span className={handleClickHeart === card.id ? styles.span_purple : card.reactions > 0 ? styles.span_purple : ''}>
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
              pageSizeOptions={['10', '20', '30', '40']}
            />
            <span className={styles.span_pagination}>
              Page &nbsp;
              <Input
                className={styles.input_pagination}
                type='number'
                min={1}
                max={Math.ceil(cards.length / 10)}
                value={currentPage}
                onChange={(e) => setCurrentPage(parseInt(e.target.value, 10))}
              />
              &nbsp;of {Math.ceil(cards.length / 10)}
            </span>
          </>
        ) : (
          ''
        )}
      </div>
    </>
  )
}
