/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
import { Button, Modal, Upload } from 'antd'
import styles from './createModal.module.scss'
import img_add from '../../assets/img_add_card.svg'
import { Flex, Input } from 'antd'

const { TextArea } = Input

interface Props {
  isOpen: boolean
  closeModal: () => void
  addCards: (name: string, description: string, url: string) => void
}
export default function CreateCardModal(props: Props) {
  const { isOpen, closeModal, addCards } = props
  const [inputValueName, setInputValueName] = useState('')
  const [inputValueDesc, setInputValueDesc] = useState('')

  const [image, setImage] = useState<File | null>(null)
  const [url, setUrl] = useState('')

  const saveImage = async () => {
    const data = new FormData()
    data.append('file', image as File)
    data.append('upload_preset', 'huuthuat')
    data.append('cloud_name', 'dya4as3kz')

    try {
      if (image === null) {
        return console.log('Please Upload image')
      }

      const res = await fetch('https://api.cloudinary.com/v1_1/dya4as3kz/image/upload', {
        method: 'POST',
        body: data
      })

      const cloudData = await res.json()
      setUrl(cloudData.url)
      console.log(cloudData.url)
      console.log('Image Upload Successfully')
    } catch (error) {
      console.log(error)
    }
  }

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setInputValueName(newValue)
  }
  const onChangeDesc = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setInputValueDesc(newValue)
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    saveImage()
    addCards(inputValueName, inputValueDesc, url)
    closeModal()
  }

  return (
    <>
      <Modal
        width={598}
        style={{}}
        centered
        open={isOpen}
        onOk={() => closeModal()}
        onCancel={() => closeModal()}
        closeIcon={false}
        footer={null}
      >
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
                  {image ? (
                    <img className={styles.img_upload} src={image ? URL.createObjectURL(image) : ''} alt='img' />
                  ) : (
                    <img src={img_add} alt='_blank' />
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
                  maxLength={50}
                  onChange={onChangeName}
                  placeholder='Enter your name'
                  style={{ padding: 12, resize: 'none' }}
                />
              </div>

              <div className={styles.input_desc}>
                <div className={styles.label_custom}>
                  <label htmlFor=''>Description</label>
                  <span>{inputValueDesc.length}/200</span>
                </div>

                <TextArea
                  maxLength={200}
                  onChange={onChangeDesc}
                  placeholder='Type description here'
                  style={{ resize: 'none', height: 96 }}
                />
              </div>
            </div>
            <div className={styles.modal_footer}>
              <button type='submit' className={styles.btn_create}>
                Create
              </button>
              <button className={styles.btn_cancel} onClick={() => closeModal()}>
                Cancle
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  )
}
