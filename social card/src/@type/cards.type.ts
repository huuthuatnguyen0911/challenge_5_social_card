import { Comment } from "./comments.type"

export interface Cards {
  id: string
  name: string
  description: string
  url: string
  reactions: number
  comments: Comment[]
}
