import { useEffect, useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'

import { database } from '../services/firebase'
import { authContext } from '../store/auth-context'

type FirebaseQuestions = Record<
  string,
  {
    author: {
      name: string
      avatar: string
    }
    content: string
    isAnswered: boolean
    isHighlighted: boolean
    likes: Record<string, { authorId: string }>
  }
>

type Question = {
  id: string
  author: {
    name: string
    avatar: string
  }
  content: string
  isAnswered: boolean
  isHighlighted: boolean
  likeCount: number
  likeId: string | undefined
}

type RoomProps = {
  title: string
  questions: Question[]
}

export function useRoom(roomId: string): RoomProps {
  const history = useHistory()
  const user = useContext(authContext).user
  const [questions, setQuestions] = useState<Question[]>([])
  const [title, setTitle] = useState('')

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`)
    roomRef.get().then(room => {
      if (room.exists()) {
        roomRef.on('value', room => {
          const databaseRoom = room.val()
          const firebaseQuestions: FirebaseQuestions =
            databaseRoom.questions ?? {}
          const questions = Object.entries(firebaseQuestions).map(
            ([key, value]) => {
              return {
                id: key,
                content: value.content,
                author: value.author,
                isHighlighted: value.isHighlighted,
                isAnswered: value.isAnswered,
                likeCount: Object.values(value.likes ?? {}).length,
                likeId: Object.entries(value.likes ?? {}).find(
                  ([, like]) => like.authorId === user?.id
                )?.[0]
              }
            }
          )
          setTitle(databaseRoom.title)
          setQuestions(questions)

          return () => roomRef.off('value')
        })
      } else {
        history.push('/')
      }
    })
  }, [roomId, user?.id, history])

  return { title, questions }
}
