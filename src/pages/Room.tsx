import { FormEvent, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'

import { useRoom } from '../hooks/useRoom'
import { database } from '../services/firebase'
import { authContext } from '../store/auth-context'
import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import '../styles/room.scss'

type RoomParams = {
  id: string
}

export function Room() {
  const { user } = useContext(authContext)
  const roomId = useParams<RoomParams>().id
  const [newQuestion, setNewQuestion] = useState('')
  const { title, questions } = useRoom(roomId)

  const handleCreateQuestion = async (evt: FormEvent) => {
    evt.preventDefault()
    if (newQuestion.trim() === '') return
    if (!user) {
      throw new Error('You must be logged in')
    }
    const question = {
      content: newQuestion,
      author: { ...user },
      isHighlighted: false,
      isAnswered: false
    }
    await database.ref(`rooms/${roomId}/questions`).push(question)
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <RoomCode code={roomId} />
        </div>
      </header>
      <main className="content">
        <div className="room-title">
          <h1>{title}</h1>
          {questions.length > 0 && <span>{questions.length} perguntas</span>}
        </div>
        <form onSubmit={handleCreateQuestion}>
          <textarea
            placeholder="O que você quer perguntar?"
            onChange={evt => setNewQuestion(evt.target.value)}
            value={newQuestion}
          />
          <footer className="form-footer">
            {user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>
                Para enviar uma pergunta, <button>faça seu login</button>
              </span>
            )}
            <Button type="submit" disabled={!user}>
              Enviar pergunta
            </Button>
          </footer>
        </form>
        {JSON.stringify(questions)}
      </main>
    </div>
  )
}
