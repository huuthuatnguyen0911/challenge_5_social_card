/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import HeaderLogo from '../HeaderLogo'
import CreateSearchInput from '../CreateSeachInput'
import CardList from '../CardList'
import PaginationFooter from '../PaginationFooter'
import CreateCardModal from '../CreateCardModal'
import { Card } from '~/@type/cards.type'

interface HandleNewCards {
  (cards: Card[]): Card[]
}

const syncReactToLocal = (HandleNewTodos: HandleNewCards) => {
  const cardString = localStorage.getItem('cards')
  const cardObject: Card[] = cardString ? JSON.parse(cardString) : []
  const newCardObject = HandleNewTodos(cardObject)
  localStorage.setItem('cards', JSON.stringify(newCardObject))
}

export default function LayoutSocial() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [cards, setCards] = useState<Card[]>([])

  const addCards = (name: string, description: string, url: string) => {
    const handler = (cardObject: Card[]) => [card, ...cardObject]
    const card: Card = {
      name,
      description,
      url,
      id: new Date().toISOString(),
      comments: [],
    }
    setCards((prev) => [card, ...prev])

    syncReactToLocal(handler)
  }

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }
  return (
    <div>
      <HeaderLogo />
      <CreateSearchInput openModal={openModal} />
      <CardList />
      <PaginationFooter />
      <CreateCardModal addCards={addCards} isOpen={isModalOpen} closeModal={closeModal} />
    </div>
  )
}
