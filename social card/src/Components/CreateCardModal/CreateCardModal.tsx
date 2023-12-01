/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
import { Button, Modal, message, Tooltip } from 'antd'
import styles from './createModal.module.scss'
import img_add from '../../assets/img_add_card.svg'
import { Flex, Input } from 'antd'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Cards } from '~/@type/cards.type'
import icon_delete_image from '../../assets/icon_delete_image.svg'

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
  const [url, setUrl] = useState('')

  const saveImage = async () => {
    console.log(image)
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
        toast.success('Successfully create!', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored'
        })
      }
      return cloudData.url
    } catch (error) {
      console.log(error)
    }
  }
  const onChangeName = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let newValue = e.target.value
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
        setInputValueName('')
        setInputValueDesc('')
        setImage(null)
        closeModal()
      }
    } catch (error) {
      console.error('Error while handling form submission:', error)
    }
  }

  const isDisabled: boolean = inputValueName.length === 0 || inputValueDesc.length === 0 || image === null
  const isDisabledEdit: boolean =
    currentCards?.description.length === 0 || currentCards?.name.length === 0 || (image === null && !currentCards?.url)
  const defaultImage: boolean = (image &&
    image?.size < 1024 * 1024 &&
    ['image/png', 'image/jpeg', 'image/svg+xml'].includes(image.type)) as boolean
  if (image && image?.size > 1024 * 1024) {
    toast.error('This file is too large.')
    setImage(null)
  }

  return (
    <>
      <ToastContainer
        position='top-center'
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='colored'
      />

      {action === 'add' ? (
        <Modal width={594} centered open={isOpen} onCancel={() => closeModal()} closeIcon={false} footer={null}>
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
                      <img className={styles.img_upload} src={image ? URL.createObjectURL(image) : ''} alt='img' />
                    ) : (
                      <Tooltip placement='right' title="Please use a square image that's less than 5MB.">
                        <img src={img_add} alt='_blank' />
                      </Tooltip>
                    )}
                    <br />
                    <span className={styles.btn_upload}>Upload image</span>
                  </label>
                </div>

                <div className={styles.input_name}>
                  <div className={styles.label_custom}>
                    <label htmlFor=''>Name</label>
                    <span>{inputValueName.length}/50</span>
                  </div>

                  <Input
                    value={inputValueName}
                    status={inputValueName.length == 50 ? 'error' : ''}
                    maxLength={50}
                    onChange={onChangeName}
                    placeholder='Enter your name'
                    style={{ padding: 12, resize: 'none' }}
                    onKeyPress={(event) => {
                      if (/[0-9]/.test(event.key)) {
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
                    status={inputValueDesc.length == 200 ? 'error' : ''}
                    maxLength={200}
                    onChange={onChangeDesc}
                    placeholder='Type description here'
                    style={{ resize: 'none', height: 96 }}
                    onKeyPress={(event) => {
                      if (event.key === ' ' && inputValueDesc.length === 0) {
                        event.preventDefault()
                      }
                    }}
                  />
                </div>
              </div>
              <div className={styles.modal_footer}>
                <button
                  disabled={isDisabled}
                  type='submit'
                  className={isDisabled ? styles.btn_create_disable : styles.btn_create}
                >
                  Create
                </button>
                <span onClick={closeModal} className={styles.btn_cancel}>
                  Cancle
                </span>
              </div>
            </form>
          </div>
        </Modal>
      ) : // EDIT CARD
      action === 'edit' ? (
        <Modal
          width={598}
          style={{}}
          centered
          open={isOpen}
          onCancel={() => closeModal()}
          closeIcon={false}
          footer={null}
        >
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
                    {currentCards?.url ? (
                      <>
                        <img className={styles.img_upload} src={currentCards?.url} alt='_blank' />
                      </>
                    ) : (defaultImage as boolean) ? (
                      <img className={styles.img_upload} src={image ? URL.createObjectURL(image) : ''} alt='img' />
                    ) : (
                      <>
                        <img className={styles.img_upload} src={img_add} alt='img' />
                        <br />
                        <span className={styles.btn_upload}>Upload image</span>
                      </>
                    )}
                  </label>
                  <img
                    onClick={() => handleEditImageCard(currentCards?.url as string)}
                    className={styles.icon_delete_image}
                    src={icon_delete_image}
                    alt='_blank'
                  />
                </div>

                <div className={styles.input_name}>
                  <div className={styles.label_custom}>
                    <label htmlFor=''>Name</label>
                    <span>{currentCards?.name.length}/50</span>
                  </div>

                  <Input
                    value={currentCards?.name}
                    status={inputValueNameEdit.length == 50 ? 'error' : ''}
                    maxLength={50}
                    onChange={onChangeNameEdit}
                    placeholder='Enter your name'
                    style={{ padding: 12, resize: 'none' }}
                    onKeyPress={(event) => {
                      if (/[0-9]/.test(event.key)) {
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
                    status={inputValueDescEdit.length == 200 ? 'error' : ''}
                    maxLength={200}
                    onChange={onChangeDescEdit}
                    placeholder='Type description here'
                    style={{ resize: 'none', height: 96 }}
                    onKeyPress={(event) => {
                      if (event.key === ' ' && inputValueDescEdit.length === 0) {
                        event.preventDefault()
                      }
                    }}
                  />
                </div>
              </div>
              <div className={styles.modal_footer}>
                <button
                  disabled={isDisabledEdit}
                  type='submit'
                  className={isDisabledEdit ? styles.btn_create_disable : styles.btn_create}
                >
                  Save
                </button>
                <span onClick={closeModal} className={styles.btn_cancel}>
                  Cancle
                </span>
              </div>
            </form>
          </div>
        </Modal>
      ) : (
        <Modal width={594} centered open={isOpen} onCancel={() => closeModal()} closeIcon={false} footer={null}>
          <div className={styles.container}>
            <div className={styles.modal_title_delete}>Delete card?</div>
            <p className={styles.p_title_delete}>You will not be able to restore the card after taking this action.</p>
            <div className={styles.modal_footer}>
              <button className={styles.btn_delete} onClick={() => delelteCard(currentCards?.id as string)}>
                Delete
              </button>
              <span onClick={closeModal} className={styles.btn_cancel}>
                Cancle
              </span>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
