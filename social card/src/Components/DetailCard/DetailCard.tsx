/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
import { Button, Drawer } from 'antd'
import { Cards } from '~/@type/cards.type'
import styles from './detailCard.module.scss'
import img_no_avt_detail from '../../assets/img_no_avt_detail.svg'
import icon_more from '../../assets/icon_more.svg'
import icon_heart_detail from '../../assets/icon_heart_detail.svg'
import icon_heart_detail_handled from '../../assets/icon_heart_detail_handled.svg'

interface Props {
  detailCard: Cards | null
  openModal: (action: string, id: string) => void
  closeDetailCard: () => void
  isDetailCardOpen: boolean
  currentCards: Cards | null
  clickReaction: (id: string) => void
}
export default function DetailCard(props: Props) {
  const { closeDetailCard, isDetailCardOpen, openModal, detailCard, clickReaction } = props
  return (
    <>
      <Drawer
        width={604}
        closable={false}
        onClose={closeDetailCard}
        open={isDetailCardOpen}
        footer={
          <div className={styles.footer_btn_comment}>
            <button className={styles.btn_comment}>Write Comment</button>
          </div>
        }
      >
        <div className={styles.header_detail}>
          <img
            className={styles.img_avatar_header}
            alt='example'
            src={detailCard?.url ? detailCard.url : img_no_avt_detail}
          />
          <div className={styles.dropdown} style={{ float: 'right' }}>
            <img className={`${styles.icon_more}`} src={icon_more} alt='_blank' />
            <div className={styles.dropdown_content}>
              <a onClick={() => openModal('edit', detailCard?.id as string)}>Edit</a>
              <a onClick={() => openModal('delete', detailCard?.id as string)}>Delete</a>
            </div>
          </div>
          <div className={styles.detail_content}>
            <p className={styles.detail_name}>{detailCard?.name}</p>
            <p className={styles.detail_description}>{detailCard?.description}</p>
          </div>
          <div className={styles.border_top}></div>

          <div className={styles.card_action}>
            <div className={styles.card_action_item}>
              <img
                onClick={() => clickReaction(detailCard?.id as string)}
                className={styles.card_icon_heart}
                src={(detailCard?.reactions as number) > 0 ? icon_heart_detail_handled : icon_heart_detail}
                alt=''
              />
              <span className={styles.count_reaction}>{detailCard?.reactions}</span>
            </div>
          </div>

          <div className={styles.card_comment}>
            <span>Comment</span>
            <span className={styles.count_comment}>({detailCard?.comments.length})</span>
          </div>
        </div>
      </Drawer>
    </>
  )
}
