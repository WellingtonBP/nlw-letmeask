// import { useContext } from 'react'
import { Link } from 'react-router-dom'

// import { authContext } from '../store/auth-context'
import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import '../styles/auth.scss'
import { Button } from '../components/Button'

export function NewRoom() {
  // const {user} = useContext(authContext)

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
          <h2>Criar uma nova sala</h2>
          <form>
            <input type="text" placeholder="Nome da sala" />
            <Button type="submit">Criar sala</Button>
          </form>
          <p>
            Quer entrar em uma sala existente? <Link to="/">click aqui</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
