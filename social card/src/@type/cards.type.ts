import { Comment } from "./comments.type"

export interface Card {
  id: string
  name: string
  description: string
  url: string
  comments: Comment[]
}
