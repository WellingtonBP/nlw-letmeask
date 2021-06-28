import { useParams, useHistory } from 'react-router-dom'

import { useRoom } from '../hooks/useRoom'
import { database } from '../services/firebase'
import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'
import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { Question } from '../components/Question'
import '../styles/room.scss'

type RoomParams = {
  id: string
}

export function AdminRoom() {
  const roomId = useParams<RoomParams>().id
  const history = useHistory()
  const { title, questions } = useRoom(roomId)

  const handleEndRoom = async () => {
    await database.ref(`rooms/${roomId}`).update({ endedAt: new Date() })
    history.push('/')
  }

  const handleDeleteQuestion = async (questionId: string) => {
    if (window.confirm('Tem certeza que você deseja excluir esta pergunta')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
    }
  }

  const handleCheckQuestionAsAnswered = async (questionId: string) => {
    await database
      .ref(`rooms/${roomId}/questions/${questionId}`)
      .update({ isAnswered: true })
  }

  const handleHighlightQuestion = async (questionId: string) => {
    await database
      .ref(`rooms/${roomId}/questions/${questionId}`)
      .update({ isHighlighted: true })
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>
      <main className="content">
        <div className="room-title">
          <h1>{title}</h1>
          {questions.length > 0 && <span>{questions.length} perguntas</span>}
        </div>
        <div className="question-list">
          {questions.map(question => (
            <Question
              key={question.id}
              author={question.author}
              content={question.content}
              isAnswered={question.isAnswered}
              isHighlighted={question.isHighlighted}
            >
              {!question.isAnswered && (
                <>
                  <button
                    onClick={handleCheckQuestionAsAnswered.bind(
                      null,
                      question.id
                    )}
                  >
                    <img src={checkImg} alt="Marcar como respondida" />
                  </button>
                  <button
                    onClick={handleHighlightQuestion.bind(null, question.id)}
                  >
                    <img src={answerImg} alt="Dar destaque a pergunta" />
                  </button>
                </>
              )}
              <button onClick={handleDeleteQuestion.bind(null, question.id)}>
                <img src={deleteImg} alt="Remover pergunta" />
              </button>
            </Question>
          ))}
        </div>
      </main>
    </div>
  )
}
