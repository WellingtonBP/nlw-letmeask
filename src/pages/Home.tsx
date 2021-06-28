import { FormEvent, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { database } from '../services/firebase'
import { authContext } from '../store/auth-context'
import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImg from '../assets/images/google-icon.svg'
import '../styles/auth.scss'
import { Button } from '../components/Button'

export function Home() {
  const [roomCode, setRoomCode] = useState('')
  const history = useHistory()
  const { user, sign } = useContext(authContext)

  const handleCreateRoom = async () => {
    if (!user) {
      await sign()
    }

    history.push('/rooms/new')
  }

  const handleJoinRoom = async (event: FormEvent) => {
    event.preventDefault()
    if (roomCode.trim() === '') return
    const room = await database.ref(`rooms/${roomCode}`).get()
    if (!room.exists()) {
      alert('Room doesnt exists.')
      return
    }
    if (room.val().endedAt) {
      alert('Room already closed.')
      return
    }
    const url = room.val().authorId === user?.id ? '/admin/rooms/' : '/rooms/'
    history.push(url + roomCode)
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao vivo</strong>
        <p>Tire dúvidas de sua audiência em tempo real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Let me ask" />
          <button className="create-room" onClick={handleCreateRoom}>
            <img src={googleIconImg} alt="Logo do google" />
            Crie sua sala com o google
          </button>
          <div className="separator">Ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={evt => setRoomCode(evt.target.value)}
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  )
}
