/* eslint-disable @typescript-eslint/no-unused-vars */
import styles from './cardList.module.scss'
import { Col, Row } from 'antd'
import icon_more from '../../assets/icon_more.svg'
import icon_heart from '../../assets/icon_heart.svg'
import icon_comment from '../../assets/icon_comment.svg'
import { Cards } from '~/@type/cards.type'
import img_no_avt from '../../assets/img_no_avt.svg'
import icon_heart_handled from '../../assets/icon_heart_handled.svg'
import img_search_no_result from '../../assets/img_search_no_result.svg'

interface Props {
  cards: Cards[]
  openModal: (action: string, id: string) => void
  openDetailCard: (id: string) => void
  clickReaction: (id: string) => void
  searchText: string
}
export default function CardList(props: Props) {
  const { cards, openModal, openDetailCard, clickReaction } = props

  return (
    <div className={styles.cardList}>
      {cards.length === 0 ? (
        <div className={styles.container_no_result}>
          <img src={img_search_no_result} alt='_blank' />
          <p>Sorry, no result found</p>
          <p>Try adjusting your search to find what you’re looking for.</p>
        </div>
      ) : (
        <Row gutter={16}>
          {cards.map((card) => (
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
                      src={card.reactions > 0 ? icon_heart_handled : icon_heart}
                      alt=''
                    />
                    <span>{card.reactions}</span>
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
  )
}
