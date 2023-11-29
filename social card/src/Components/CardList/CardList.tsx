/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import styles from './cardList.module.scss'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons'
import { Avatar, Card, Col, Row } from 'antd'
import icon_more from '../../assets/icon_more.svg'
import icon_heart from '../../assets/icon_heart.svg'
import icon_comment from '../../assets/icon_comment.svg'
import { Dropdown, message, Space } from 'antd'
import type { MenuProps } from 'antd'


export default function CardList() {
  return (
    <div className={styles.cardList}>
      <Row gutter={16}>
        <Col span={12} className={styles.card}>
          <div className={styles.card_container}>
            <div className={styles.card_content}>
              <img
                className={styles.img_avatar}
                alt='example'
                src='https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'
              />
              <div className={styles.card_body}>
                <div className={styles.card_title}>Card title</div>
                <div className={styles.card_description}>This is the description</div>
              </div>
              <div className={styles.dropdown} style={{ float: 'right' }}>
                <img className={`${styles.icon_more}`} src={icon_more} alt='_blank' />
                <div className={styles.dropdown_content}>
                  <a href='#'>Edit</a>
                  <a href='#'>Delete</a>
                </div>
              </div>
            </div>
            <div className={styles.border_top}></div>

            <div className={styles.card_action}>
              <div className={styles.card_action_item} style={{ marginRight: 24 }}>
                <img className={styles.card_icon_hea} src={icon_heart} alt='' />
                <span>12.2k</span>
              </div>

              <div className={styles.card_action_item}>
                <img src={icon_comment} alt='' />
                <span style={{ marginRight: 8 }}>22</span>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}
