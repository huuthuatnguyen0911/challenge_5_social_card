import { useEffect, useState } from 'react'
import HeaderLogo from '../HeaderLogo'
import CreateSearchInput from '../CreateSeachInput'
import CardList from '../CardList'
import CreateCardModal from '../CreateCardModal'
import { Cards } from '~/@type/cards.type'
import DetailCard from '../DetailCard'
import { SearchHistory } from '~/@type/history.type'
import { cardListDefault } from '~/api/cartListdefault'

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
  const [searchText, setSearchText] = useState('')
  const [handleClickHeart, setHandleClickHeart] = useState('')
  const [historySearch, sethistorySearch] = useState<SearchHistory[]>([])

  useEffect(() => {
    const historyString = localStorage.getItem('searchHistory')
    const historyObject: SearchHistory[] = historyString ? JSON.parse(historyString) : []
    sethistorySearch(historyObject)

    const cardString = localStorage.getItem('cards')
    if (!cardString) {
      setCards(cardListDefault)
      localStorage.setItem('cards', JSON.stringify(cardListDefault))
    } else {
      const cardObject: Cards[] = cardString ? JSON.parse(cardString) : []
      setCards(cardObject)
    }
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
    setHandleClickHeart(id)
    setTimeout(() => {
      setHandleClickHeart('')
    }, 1000)
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
  const formatReactions = (reactions: number) => {
    if (reactions >= 1000) {
      const formattedReactions = (reactions / 1000).toFixed(1)
      return `${formattedReactions}k`
    }
    return reactions.toString()
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
            comments: [
              {
                id: new Date().toISOString(),
                name,
                content,
                created_at: new Date().toISOString()
              },
              ...card.comments
            ]
          }
        }
        return card
      })
    setDetailCard((prev) => {
      if (prev) {
        return {
          ...prev,
          comments: [
            {
              id: new Date().toISOString(),
              name,
              content,
              created_at: new Date().toISOString()
            },
            ...prev.comments
          ]
        }
      }
      return null
    })
    syncReactToLocal(handler)
    setCards(handler)
  }
  const handleChangedSearchText = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSearchText(e.target.value)
    if (e.target.value === '') {
      const cardString = localStorage.getItem('cards')
      const cardObject: Cards[] = cardString ? JSON.parse(cardString) : []
      setCards(cardObject)
    }
    console.log(e.target.value)
  }
  const searchCard = (cards: Cards[], searchText: string) => {
    if (searchText && !historySearch.some((item) => item.searchText === searchText)) {
      const historyItem: SearchHistory = {
        id: new Date().toISOString(),
        searchText
      }
      const newHistorySearch = historySearch.filter((item) => item.searchText !== searchText)
      sethistorySearch(newHistorySearch)

      sethistorySearch((prevHistory) => [historyItem, ...prevHistory])
      const historyString = localStorage.getItem('searchHistory')
      const historyObject: SearchHistory[] = historyString ? JSON.parse(historyString) : []
      const newHistoryObject = [historyItem, ...historyObject]
      localStorage.setItem('searchHistory', JSON.stringify(newHistoryObject))
    }

    const result = cards.filter((card) => card.name.toLowerCase().includes(searchText.toLowerCase()))
    setCards(result)
    if (result.length === 0 || searchText === '') {
      setCards([])
    }
    setSearchText('')
    return result
  }
  const deleteHistorySearch = (searchText: string) => {
    const updatedHistory = historySearch.filter((item) => item.searchText !== searchText)
    sethistorySearch(updatedHistory)
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory))
  }

  return (
    <div>
      <HeaderLogo openModal={openModal} />
      <CreateSearchInput
        openModal={openModal}
        searchCard={searchCard}
        cards={cards}
        searchText={searchText}
        historySearch={historySearch}
        handleChangedSearchText={handleChangedSearchText}
        deleteHistorySearch={deleteHistorySearch}
      />
      <CardList
        clickReaction={clickReaction}
        searchText={searchText}
        openModal={openModal}
        cards={cards}
        openDetailCard={openDetailCard}
        handleClickHeart={handleClickHeart}
        formatReactions={formatReactions}
      />
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
        handleClickHeart={handleClickHeart}
        hanledClickComment={hanledClickComment}
        handlePostComment={handlePostComment}
        formatReactions={formatReactions}
      />
    </div>
  )
}
