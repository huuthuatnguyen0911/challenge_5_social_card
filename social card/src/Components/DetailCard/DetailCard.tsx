/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react'
import { Button, Drawer, Input } from 'antd'
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
  formComment: boolean
  hanledClickComment: () => void
  handlePostComment: (name: string, content: string) => void
}
export default function DetailCard(props: Props) {
  const {
    closeDetailCard,
    isDetailCardOpen,
    openModal,
    detailCard,
    clickReaction,
    formComment,
    hanledClickComment,
    handlePostComment
  } = props
  const [checked, setChecked] = useState(false)
  const [nameComment, setNameComment] = useState('')
  const [contentComment, setContentComment] = useState('')

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    value = value.charAt(0).toUpperCase() + value.slice(1)
    setNameComment(value)
  }
  const handleChangeContent = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    value = value.charAt(0).toUpperCase() + value.slice(1)
    setContentComment(value)
  }
  const handleChangeCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked)
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      if (checked) {
        setNameComment('unknown')
        handlePostComment(nameComment, contentComment)
      } else {
        handlePostComment(nameComment, contentComment)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const isDisable: boolean = (!checked && nameComment.length === 0) || contentComment.length === 0
  return (
    <>
      <Drawer width={604} closable={false} onClose={closeDetailCard} open={isDetailCardOpen}>
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
          {detailCard?.comments.map((comment, index) => (
            <div className={styles.list_comment} key={index}>
              <h4>{comment.name}</h4>
              <h4>{comment.content}</h4>
              <h4>{comment.created_at}</h4>
            </div>
          ))}
        </div>
        {!formComment ? (
          <div className={styles.footer_btn_comment}>
            <button onClick={() => hanledClickComment()} className={styles.btn_comment}>
              Write Comment
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className={styles.form_comment} style={{ textAlign: 'left' }}>
              <div className={styles.checkbox_comment}>
                <input type='checkbox' name='' checked={checked} onChange={handleChangeCheckbox} />
                <span>Comment as Unknown</span>
              </div>
              <div className={styles.input_content}>
                <Input
                  value={nameComment}
                  onChange={handleChangeName}
                  maxLength={50}
                  autoComplete='true'
                  status={nameComment.length == 50 ? 'error' : ''}
                  className={`${styles.form_comment_input} ${checked ? styles.form_comment_input_disable : ''}`}
                  type='text'
                  placeholder='Your name'
                  disabled={checked}
                  onKeyPress={(event) => {
                    if (/[0-9]/.test(event.key)) {
                      event.preventDefault()
                    }
                  }}
                />
                <Input
                  value={contentComment}
                  onChange={handleChangeContent}
                  maxLength={50}
                  className={styles.form_comment_input}
                  type='text'
                  placeholder='Type your comment here'
                  status={contentComment.length == 50 ? 'error' : ''}
                  onKeyPress={(event) => {
                    if (event.key === ' ' && contentComment.length === 0) {
                      event.preventDefault()
                    }
                  }}
                />
              </div>
              <button
                disabled={isDisable}
                type='submit'
                className={isDisable ? styles.btn_comment_disable : styles.btn_comment}
              >
                Post comment
              </button>
            </div>
          </form>
        )}
      </Drawer>
    </>
  )
}
