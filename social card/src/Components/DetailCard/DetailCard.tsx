import { useState } from 'react'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { format } from 'date-fns'
import { Drawer, Input } from 'antd'
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
  handleClickHeart: string
  formatReactions: (reactions: number) => string
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
    handlePostComment,
    handleClickHeart,
    formatReactions
  } = props
  const [checked, setChecked] = useState(false)
  const [nameComment, setNameComment] = useState('')
  const [contentComment, setContentComment] = useState('')
  const isDisable: boolean =
    (!checked && nameComment.length === 0) ||
    contentComment.trim().length === 0 ||
    contentComment.length > 50 ||
    (!checked && nameComment.length > 50)

  const [currentPage, setCurrentPage] = useState(1)
  const commentsPerPage = 5
  const indexOfLastComment = currentPage * commentsPerPage
  const currentComments = detailCard?.comments.slice(0, indexOfLastComment)

  const formatDate = (dateString: string) => {
    const commentDate = new Date(dateString)
    const now = new Date()

    const hoursDifference = Math.abs((now.getTime() - commentDate.getTime()) / 36e5)

    if (hoursDifference < 24) {
      return `${Math.floor(hoursDifference)} hours ago`
    } else {
      return format(commentDate, 'dd-MM-yyyy')
    }
  }
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
      if (checked === true) {
        handlePostComment('unknown', contentComment)
        setNameComment('')
        setContentComment('')
      } else {
        handlePostComment(nameComment, contentComment)
        setNameComment('')
        setContentComment('')
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleShowMore = () => {
    setCurrentPage((prevPage) => prevPage + 1)
  }

  return (
    <>
      <Drawer
        {...(window.innerWidth < 600
          ? { title: 'Details', closable: true, closeIcon: <ArrowLeftOutlined style={{ width: '24px', height: '24px' }} />, width: 400 }
          : { closable: false })}
        width={604}
        onClose={closeDetailCard}
        open={isDetailCardOpen}
        zIndex={1000}
      >
        <div
          className={`${styles.header_detail} ${
            !formComment ? styles.margin_comment_btn : styles.margin_comment_form
          } `}
        >
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
                src={handleClickHeart ? icon_heart_detail_handled : icon_heart_detail}
                alt=''
              />
              <span
                className={`${styles.count_reaction} ${handleClickHeart === detailCard?.id ? styles.span_purple : ''} `}
              >
                {formatReactions(detailCard?.reactions ? detailCard.reactions : 0)}
              </span>
            </div>
          </div>
          <div className={styles.card_comment}>
            <span>Comment</span>
            <span className={styles.count_comment}>({detailCard?.comments.length})</span>
          </div>
          {currentComments?.map((comment, index) => (
            <div className={styles.list_comment} key={index}>
              <p className={`${styles.comment_name} ${comment.name === 'unknown' ? styles.name_unknown : ''}`}>
                {comment.name}
              </p>
              <p className={styles.comment_content}>{comment.content}</p>
              <p className={styles.comment_create_at}>{formatDate(comment.created_at)}</p>
            </div>
          ))}
          {(detailCard?.comments.length as number) < 5 ||
          (currentComments?.length as number) == (detailCard?.comments.length as number) ? (
            ''
          ) : (
            <div className={styles.btn_show_more}>
              <span onClick={handleShowMore}>More comments</span>
            </div>
          )}
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
                <input type='checkbox' name='' id='checkbox_1' checked={checked} onChange={handleChangeCheckbox} />
                <span>Comment as Unknown</span>
              </div>
              <div className={styles.input_content}>
                <Input
                  value={nameComment}
                  onChange={handleChangeName}
                  autoComplete='true'
                  status={nameComment.length > 50 ? 'error' : ''}
                  className={`${styles.form_comment_input} ${checked ? styles.form_comment_input_disable : ''}`}
                  type='text'
                  placeholder='Your name'
                  disabled={checked}
                  onPaste={(event) => {
                    event.preventDefault()
                  }}
                  onKeyPress={(event) => {
                    if (
                      /[0-9]/.test(event.key) ||
                      /["'`!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(event.key) ||
                      (event.key === ' ' && nameComment.length === 0)
                    ) {
                      event.preventDefault()
                    }
                  }}
                />
                <Input
                  value={contentComment}
                  onChange={handleChangeContent}
                  className={styles.form_comment_input}
                  type='text'
                  placeholder='Type your comment here'
                  status={contentComment.length > 50 ? 'error' : ''}
                  onPaste={(event) => {
                    event.preventDefault()
                  }}
                  // onKeyPress={(event) => {
                  //   if (event.key === ' ' && contentComment.length === 0) {
                  //     event.preventDefault()
                  //   }
                  // }}
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
