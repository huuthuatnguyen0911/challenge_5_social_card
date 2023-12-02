/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react'
import HeaderLogo from '../HeaderLogo'
import CreateSearchInput from '../CreateSeachInput'
import CardList from '../CardList'
import PaginationFooter from '../PaginationFooter'
import CreateCardModal from '../CreateCardModal'
import { Cards } from '~/@type/cards.type'
import DetailCard from '../DetailCard'
import {Comment} from '~/@type/comments.type.ts'

interface HandleNewCards {
  (cards: Cards[]): Cards[]
}
const syncReactToLocal = (HandleNewTodos: HandleNewCards) => {
  const cardString = localStorage.getItem('cards')
  const cardObject: Cards[] = cardString ? JSON.parse(cardString) : []
  const newCardObject = HandleNewTodos(cardObject)
  localStorage.setItem('cards', JSON.stringify(newCardObject))
}

export default function LayoutSocial() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [cards, setCards] = useState<Cards[]>([])
  const [currentCards, setCurrentCards] = useState<Cards | null>(null)
  const [modalAction, setModalAction] = useState('')
  const [isDetailCardOpen, setIsDetailCardOpen] = useState(false)
  const [detailCard, setDetailCard] = useState<Cards | null>(null)
  const [formComment, setFormComment] = useState(false)

  useEffect(() => {
    const cardString = localStorage.getItem('cards')
    const cardObject: Cards[] = cardString ? JSON.parse(cardString) : []
    setCards(cardObject)
  }, [])

  const hanledClickComment = () => {
    setFormComment(true)
  }
  const clickReaction = (id: string) => {
    const handler = (cardObject: Cards[]) =>
      cardObject.map((card) => {
        if (card.id === id) {
          return {
            ...card,
            reactions: card.reactions + 1
          }
        }
        return card
      })
    setDetailCard((prev) => {
      if (prev?.id === id) {
        return {
          ...prev,
          reactions: prev.reactions + 1
        }
      }
      return prev
    })
    setCards(handler)
    syncReactToLocal(handler)
  }
  const addCards = (name: string, description: string, url: string) => {
    const handler = (cardObject: Cards[]) => [card, ...cardObject]
    const card: Cards = {
      name,
      description,
      url,
      id: new Date().toISOString(),
      comments: [],
      reactions: 0
    }
    setCards((prev) => [card, ...prev])

    syncReactToLocal(handler)
  }
  const startEditCard = (id: string) => {
    const findedCard = cards.find((card) => card.id === id)
    if (findedCard) {
      setCurrentCards(findedCard)
      setDetailCard(findedCard)
    }
  }
  const editCard = (name: string, description: string, url: string) => {
    setCurrentCards((prev) => {
      if (prev) {
        return {
          ...prev,
          name,
          description,
          url
        }
      }
      return null
    })
  }
  const finishEditCard = (url: string) => {
    const hanlder = (cardObject: Cards[]) =>
      cardObject.map((card) => {
        if (card.id === currentCards?.id) {
          return {
            ...card,
            name: currentCards?.name,
            description: currentCards?.description,
            url: url
          }
        }
        return card
      })
    setCards(hanlder)
    setDetailCard((prev) => {
      if (prev) {
        return {
          ...prev,
          name: currentCards?.name || prev.name,
          description: currentCards?.description || prev.description,
          url: url
        }
      }
      return null
    })
    setCurrentCards(null)
    syncReactToLocal(hanlder)
  }
  const startDeleteCard = (id: string) => {
    const findedCard = cards.find((card) => card.id === id)
    if (findedCard) {
      setCurrentCards(findedCard)
    }
  }
  const delelteCard = (id: string) => {
    if (currentCards?.id === id) {
      setCurrentCards(null)
    }
    const handler = (cardObj: Cards[]) => {
      const finedIndexCard = cardObj.findIndex((card) => card.id === id)
      if (finedIndexCard !== -1) {
        const result = [...cardObj]
        result.splice(finedIndexCard, 1)
        return result
      }
      return cardObj
    }
    setIsModalOpen(false)
    setIsDetailCardOpen(false)
    setCards(handler)
    syncReactToLocal(handler)
  }
  const openModal = (action: string, id: string) => {
    setModalAction(action)
    setIsModalOpen(true)
    setCurrentCards(null)
    if (action === 'edit') {
      startEditCard(id)
    } else if (action === 'delete') {
      startDeleteCard(id)
    }
  }
  const closeModal = () => {
    setModalAction('')
    setIsModalOpen(false)
  }
  const openDetailCard = (id: string) => {
    const findedCard = cards.find((card) => card.id === id)
    if (findedCard) {
      setDetailCard(findedCard)
      setIsDetailCardOpen(true)
    }
  }
  const closeDetailCard = () => {
    setDetailCard(null)
    setIsDetailCardOpen(false)
    setFormComment(false)
  }
  const handleEditImageCard = () => {
    setCurrentCards((prev) => {
      if (prev) {
        return {
          ...prev,
          url: ''
        }
      }
      return null
    })
  }
  const handlePostComment = (name: string, content: string) => {
    const handler = (cardObject: Cards[]) =>
      cardObject.map((card) => {
        if (card.id === detailCard?.id) {
          return {
            ...card,
            comments : [
              ...card.comments,
              {
                id: new Date().toISOString(),
                name,
                content,
                created_at: new Date().toISOString()
              }
            ]
          }
        }
        return card
      })
      syncReactToLocal(handler)
      setDetailCard((prev) => {
        if (prev) {
          return {
            ...prev,
            comments : [
              {
                id: new Date().toISOString(),
                name,
                content,
                created_at: new Date().toISOString()
              },
              ...prev.comments,
            ]
          }
        }
        return null
      })
  }

  return (
    <div>
      <HeaderLogo />
      <CreateSearchInput openModal={openModal} />
      <CardList clickReaction={clickReaction} openModal={openModal} cards={cards} openDetailCard={openDetailCard} />
      <PaginationFooter />
      <CreateCardModal
        action={modalAction}
        currentCards={currentCards}
        addCards={addCards}
        isOpen={isModalOpen}
        closeModal={closeModal}
        editCard={editCard}
        finishEditCard={finishEditCard}
        delelteCard={delelteCard}
        handleEditImageCard={handleEditImageCard}
      />
      <DetailCard
        openModal={openModal}
        detailCard={detailCard}
        isDetailCardOpen={isDetailCardOpen}
        closeDetailCard={closeDetailCard}
        currentCards={currentCards}
        clickReaction={clickReaction}
        formComment={formComment}
        hanledClickComment={hanledClickComment}
        handlePostComment={handlePostComment}
      />
    </div>
  )
}
