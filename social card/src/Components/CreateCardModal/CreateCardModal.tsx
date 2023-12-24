import React, { useEffect, useState } from 'react'
import { Modal, Tooltip, Input, message } from 'antd'
import styles from './createModal.module.scss'
import img_add from '../../assets/img_add_card.svg'
import 'react-toastify/dist/ReactToastify.css'
import { Cards } from '~/@type/cards.type'
import icon_delete_image from '../../assets/icon_delete_image.svg'
import icon_edit_image_fill from '../../assets/icon_edit_image_fill.svg'
import icon_edit_image_app from '../../assets/icon_edit_image_app.svg'
import icon_question_app from '../../assets/icon_question_app.svg'
import errorIcon from '../../assets/img_err_warning.svg'
import checkFill from '../../assets/img_check_fill.svg'
import { EMOJI_REGEX } from '~/constants'
import '../custom_antd.scss'

const { TextArea } = Input
interface Props {
  isOpen: boolean
  closeModal: () => void
  addCards: (name: string, description: string, url: string) => void
  currentCards: Cards | null
  action: string
  editCard: (name: string, description: string, url: string) => void
  finishEditCard: (url: string) => void
  delelteCard: (id: string) => void
  handleEditImageCard: (url: string) => void
}
export default function CreateCardModal(props: Props) {
  const {
    isOpen,
    closeModal,
    addCards,
    action,
    currentCards,
    editCard,
    finishEditCard,
    delelteCard,
    handleEditImageCard
  } = props

  const [inputValueName, setInputValueName] = useState('')
  const [inputValueDesc, setInputValueDesc] = useState('')
  const [inputValueNameEdit, setInputValueNameEdit] = useState('')
  const [inputValueDescEdit, setInputValueDescEdit] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [, setUrl] = useState('')
  const [disableButtonAdd, setDisableButtonAdd] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()

  const error = () => {
    messageApi.open({
      type: 'error',
      content: 'This file is too large.',
      className: 'error-message',
      duration: 3,
      icon: <img src={errorIcon} alt='error-warning-icon' />
    })
  }
  const success = () => {
    messageApi.open({
      type: "success",
      content: `Successfully create`,
      className: "success-message",
      duration: 3,
      icon: <img src={checkFill}></img>,
    });
  };
  const saveImage = async () => {
    const data = new FormData()
    data.append('file', image as File)
    data.append('upload_preset', 'huuthuat')
    data.append('cloud_name', 'dya4as3kz')

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/dya4as3kz/image/upload', {
        method: 'POST',
        body: data
      })
      const cloudData = await res.json()
      setUrl(cloudData.url)
      if (cloudData.url) {
        success()
      }
      return cloudData.url
    } catch (error) {
      console.log(error)
    }
  }
  const onChangeName = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let newValue = e.target.value.replace(EMOJI_REGEX, '')
    newValue = newValue.charAt(0).toUpperCase() + newValue.slice(1)
    setInputValueName(newValue)
  }
  const onChangeDesc = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let newValue = e.target.value
    newValue = newValue.charAt(0).toUpperCase() + newValue.slice(1)
    setInputValueDesc(newValue)
  }
  const onChangeNameEdit = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let newValue = e.target.value
    newValue = newValue.charAt(0).toUpperCase() + newValue.slice(1)
    setInputValueNameEdit(newValue)
    editCard(newValue, currentCards?.description as string, currentCards?.url as string)
  }
  const onChangeDescEdit = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let newValue = e.target.value
    newValue = newValue.charAt(0).toUpperCase() + newValue.slice(1)
    setInputValueDescEdit(newValue)
    editCard(currentCards?.name as string, newValue, currentCards?.url as string)
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setDisableButtonAdd(true)
    try {
      if (currentCards) {
        if (!currentCards.url) {
          const url = await saveImage()
          editCard(inputValueNameEdit, inputValueDescEdit, url)
          finishEditCard(url)
          setInputValueName('')
          setInputValueDesc('')
          setImage(null)
          closeModal()
        } else if (currentCards.url && image) {
          const url = await saveImage()
          editCard(inputValueNameEdit, inputValueDescEdit, url)
          finishEditCard(url)
          setInputValueName('')
          setInputValueDesc('')
          setImage(null)
          closeModal()
        } else {
          editCard(inputValueNameEdit, inputValueDescEdit, currentCards.url)
          finishEditCard(currentCards.url)
          setInputValueName('')
          setInputValueDesc('')
          setImage(null)
          closeModal()
        }
      } else {
        const url = await saveImage()
        addCards(inputValueName, inputValueDesc, url)
        setDisableButtonAdd(false)
        setInputValueName('')
        setInputValueDesc('')
        setImage(null)
        closeModal()
      }
    } catch (error) {
      setDisableButtonAdd(false)
      console.error('Error while handling form submission:', error)
    }
  }
  const hanledEditImageAddCard = () => {
    setImage(null)
  }

  const isDisabled: boolean =
    inputValueName.trim().length === 0 ||
    inputValueDesc.trim().length === 0 ||
    image === null ||
    inputValueName.length > 50 ||
    inputValueDesc.length > 200

  const isDisabledEdit: boolean =
    currentCards?.description.trim().length === 0 ||
    currentCards?.name.trim().length === 0 ||
    (image === null && !currentCards?.url) ||
    (currentCards?.description.length as number) > 200 ||
    (currentCards?.name.length as number) > 50
  const defaultImage: boolean = (image &&
    image?.size < 1024 * 1024 * 5 &&
    ['image/png', 'image/jpeg', 'image/svg+xml'].includes(image.type)) as boolean

  useEffect(() => {
    if (image && image?.size > 1024 * 1024 * 5) {
      setImage(null)
      error()
    } else if (image && !['image/png', 'image/jpeg', 'image/svg+xml'].includes(image.type)) {
      setImage(null)
    }
  })

  return (
    <>
      {action === 'add' ? (
        <Modal width={594} centered open={isOpen} onCancel={() => closeModal()} closeIcon={false} footer={null}>
          {contextHolder}
          <div className={styles.container}>
            <div className={styles.modal_title}>Create card</div>
            <form action='' onSubmit={handleSubmit}>
              <div className={styles.modal_content}>
                <div className={styles.content_upload}>
                  <input
                    onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                    type='file'
                    id='html'
                    name='fav_language'
                    style={{ display: 'none' }}
                  />
                  <label className={styles.title_upload} htmlFor='html'>
                    {(defaultImage as boolean) ? (
                      <>
                        <img className={styles.img_upload} src={image ? URL.createObjectURL(image) : ''} alt='img' />
                        <div className={styles.container_hover_image}>
                          <div className={styles.layout_hover_edit}>
                            <img src={icon_edit_image_fill} alt='_blank' />
                            <span className={styles.text}>Edit</span>
                          </div>
                        </div>
                        <img src={icon_edit_image_app} className={styles.icon_edit_image_app} alt='_blank' />
                      </>
                    ) : (
                      <>
                        <Tooltip
                          {...(window.innerWidth > 600
                            ? { placement: 'right', title: "Please use a square image that's less than 5MB." }
                            : '')}
                        >
                          <img src={img_add} alt='_blank' />
                        </Tooltip>
                        <br />
                        <span className={styles.btn_upload}>Upload image</span>
                      </>
                    )}
                  </label>
                  {(defaultImage as boolean) ? (
                    <img
                      onClick={() => hanledEditImageAddCard()}
                      className={styles.icon_delete_image}
                      src={icon_delete_image}
                      alt='_blank'
                    />
                  ) : (
                    <Tooltip
                      {...(window.innerWidth < 600
                        ? { placement: 'top', title: "Please use a square image that's less than 5MB." }
                        : '')}
                    >
                      <img src={icon_question_app} className={styles.icon_question_app} alt='_blank' />
                    </Tooltip>
                  )}
                </div>

                <div className={styles.input_name}>
                  <div className={styles.label_custom}>
                    <label htmlFor=''>Name</label>
                    <span>{inputValueName.length}/50</span>
                  </div>

                  <Input
                    className={styles.input_enter_name}
                    autoComplete='true'
                    value={inputValueName}
                    status={inputValueName.length > 50 ? 'error' : ''}
                    onChange={onChangeName}
                    placeholder='Enter your name'
                    style={{ padding: 12, resize: 'none' }}
                    onPaste={(event) => event.preventDefault()}
                    onKeyPress={(event) => {
                      if (
                        /[0-9]/.test(event.key) ||
                        /["'!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(event.key) ||
                        (event.key === ' ' && inputValueName.length === 0) ||
                        /\p{Emoji}/u.test(event.key)
                      ) {
                        event.preventDefault()
                      }
                    }}
                  />
                </div>

                <div className={styles.input_desc}>
                  <div className={styles.label_custom}>
                    <label htmlFor=''>Description</label>
                    <span>{inputValueDesc.length}/200</span>
                  </div>

                  <TextArea
                    value={inputValueDesc}
                    status={inputValueDesc.length > 200 ? 'error' : ''}
                    className={styles.input_enter_desc}
                    onChange={onChangeDesc}
                    placeholder='Type description here'
                    style={{ resize: 'none', height: 96 }}
                    onPaste={(event) => event.preventDefault()}
                    // onKeyPress={(event) => {
                    //   if (event.key === ' ' && inputValueDesc.length === 0) {
                    //     event.preventDefault()
                    //   }
                    // }}
                  />
                </div>
              </div>
              <div className={styles.modal_footer}>
                <button
                  disabled={disableButtonAdd ? disableButtonAdd : isDisabled}
                  type='submit'
                  className={isDisabled ? styles.btn_create_disable : styles.btn_create}
                >
                  Create
                </button>
                <span onClick={closeModal} className={styles.btn_cancel}>
                  Cancel
                </span>
              </div>
            </form>
          </div>
        </Modal>
      ) : // EDIT CARD
      action === 'edit' ? (
        <Modal
          width={594}
          centered
          open={isOpen}
          onCancel={() => closeModal()}
          closeIcon={false}
          footer={null}
          zIndex={1001}
        >
          {contextHolder}
          <div className={styles.container}>
            <div className={styles.modal_title}>Edit Card</div>
            <form action='' onSubmit={handleSubmit}>
              <div className={styles.modal_content}>
                <div className={styles.content_upload}>
                  <input
                    onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                    type='file'
                    id='html'
                    name='image_upload'
                    style={{ display: 'none' }}
                  />
                  <label className={styles.title_upload} htmlFor='html'>
                    {currentCards?.url && !image ? (
                      <>
                        <img className={styles.img_upload} src={currentCards?.url} alt='_blank' />
                        <div className={styles.container_hover_image}>
                          <div className={styles.layout_hover_edit}>
                            <img src={icon_edit_image_fill} alt='_blank' />
                            <span className={styles.text}>Edit</span>
                          </div>
                        </div>
                        <img src={icon_edit_image_app} className={styles.icon_edit_image_app} alt='_blank' />
                      </>
                    ) : (defaultImage as boolean) ? (
                      <>
                        <img className={styles.img_upload} src={image ? URL.createObjectURL(image) : ''} alt='img' />
                        <img src={icon_edit_image_app} className={styles.icon_edit_image_app} alt='_blank' />
                      </>
                    ) : (
                      <>
                        <img src={img_add} alt='img' />
                        <br />
                        <span className={styles.btn_upload}>Upload image</span>
                      </>
                    )}
                  </label>
                  {currentCards?.url ? (
                    <>
                      <img
                        onClick={() => handleEditImageCard(currentCards?.url as string)}
                        className={styles.icon_delete_image}
                        src={icon_delete_image}
                        alt='_blank'
                      />
                    </>
                  ) : image ? (
                    <>
                      <img
                        onClick={() => hanledEditImageAddCard()}
                        className={styles.icon_delete_image}
                        src={icon_delete_image}
                        alt='_blank'
                      />
                    </>
                  ) : (
                    ''
                  )}
                </div>

                <div className={styles.input_name}>
                  <div className={styles.label_custom}>
                    <label htmlFor=''>Name</label>
                    <span>{currentCards?.name.length}/50</span>
                  </div>

                  <Input
                    value={currentCards?.name}
                    autoComplete='true'
                    status={inputValueNameEdit.length > 50 ? 'error' : ''}
                    className={styles.input_enter_name}
                    onChange={onChangeNameEdit}
                    placeholder='Enter your name'
                    style={{ padding: 12, resize: 'none' }}
                    onPaste={(event) => event.preventDefault()}
                    onKeyPress={(event) => {
                      if (
                        /[0-9]/.test(event.key) ||
                        /['"`!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(event.key) ||
                        (event.key === ' ' && inputValueNameEdit.length === 0)
                      ) {
                        event.preventDefault()
                      }
                    }}
                  />
                </div>

                <div className={styles.input_desc}>
                  <div className={styles.label_custom}>
                    <label htmlFor=''>Description</label>
                    <span>{currentCards?.description.length}/200</span>
                  </div>

                  <TextArea
                    value={currentCards?.description}
                    status={inputValueDescEdit.length > 200 ? 'error' : ''}
                    className={styles.input_enter_desc}
                    onChange={onChangeDescEdit}
                    placeholder='Type description here'
                    style={{ resize: 'none', height: 96 }}
                    onPaste={(event) => event.preventDefault()}
                    // onKeyPress={(event) => {
                    //   if (event.key === ' ' && inputValueDescEdit.length === 0) {
                    //     event.preventDefault()
                    //   }
                    // }}
                  />
                </div>
              </div>
              <div className={styles.modal_footer}>
                <button
                  disabled={isDisabledEdit}
                  type='submit'
                  className={`${isDisabledEdit ? styles.btn_create_disable : styles.btn_create} ${styles.btn_save}`}
                >
                  Save
                </button>
                <span onClick={closeModal} className={styles.btn_cancel}>
                  Cancel
                </span>
              </div>
            </form>
          </div>
        </Modal>
      ) : (
        <Modal
          width={594}
          zIndex={1001}
          centered
          open={isOpen}
          onCancel={() => closeModal()}
          closeIcon={false}
          footer={null}
        >
          <div className={styles.container}>
            <div className={styles.modal_title_delete}>Delete card?</div>
            <p className={styles.p_title_delete}>You will not be able to restore the card after taking this action.</p>
            <div className={`${styles.modal_footer} ${styles.modal_footer_delete}`}>
              <button className={styles.btn_delete} onClick={() => delelteCard(currentCards?.id as string)}>
                Delete
              </button>
              <span onClick={closeModal} className={styles.btn_cancel}>
                Cancel
              </span>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
