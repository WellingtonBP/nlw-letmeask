import { useParams, useHistory } from 'react-router-dom'
import { useState } from 'react'

import { useRoom } from '../hooks/useRoom'
import { database } from '../services/firebase'
import xModalIcon from '../assets/images/x-modal-icon.svg'
import trashModalIcon from '../assets/images/trash-modal-icon.svg'
import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'
import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { Question } from '../components/Question'
import { Modal, ModalProps } from '../components/Modal'
import '../styles/room.scss'

type RoomParams = {
  id: string
}

type ModalState = ModalProps & {
  isOpen: boolean
  onConfirm?: (questionId?: string) => Promise<void>
}

export function AdminRoom() {
  const roomId = useParams<RoomParams>().id
  const history = useHistory()
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    confirmMessage: '',
    content: '',
    title: '',
    modalIcon: '',
    onClose: () => {}
  })
  const { title, questions } = useRoom(roomId)

  const handleEndRoom = async () => {
    await database.ref(`rooms/${roomId}`).update({ endedAt: new Date() })
    history.push('/')
  }

  const handleDeleteQuestion = async (questionId: string) => {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
  }

  const handleCloseModal = (confirm: boolean) => {
    setModal(prev => ({ ...prev, isOpen: false }))
    if (confirm) {
      modal.onConfirm?.()
    }
  }

  const handleOpenModal = (action: string, questionId?: string) => {
    if (action === 'deleteQuestion') {
      setModal({
        isOpen: true,
        modalIcon: trashModalIcon,
        title: 'Excluir Pergunta',
        content: 'Tem certeza que você deseja excluir esta pergunta?',
        confirmMessage: 'Sim, excluir',
        onClose: handleCloseModal,
        onConfirm: handleDeleteQuestion.bind(null, questionId!)
      })
    } else if (action === 'endRoom') {
      setModal({
        isOpen: true,
        modalIcon: xModalIcon,
        title: 'Encerrar sala',
        content: 'Tem certeza que você deseja encerrar esta sala?',
        confirmMessage: 'Sim, encerrar',
        onClose: handleCloseModal,
        onConfirm: handleEndRoom
      })
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
    <>
      {modal.isOpen && (
        <Modal
          modalIcon={modal.modalIcon}
          title={modal.title}
          content={modal.content}
          confirmMessage={modal.confirmMessage}
          onClose={handleCloseModal}
        />
      )}
      <div id="page-room">
        <header>
          <div className="content">
            <img src={logoImg} alt="Letmeask" />
            <div>
              <RoomCode code={roomId} />
              <Button isOutlined onClick={() => handleOpenModal('endRoom')}>
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
                <button
                  onClick={() => handleOpenModal('deleteQuestion', question.id)}
                >
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
              </Question>
            ))}
          </div>
        </main>
      </div>
    </>
  )
}
