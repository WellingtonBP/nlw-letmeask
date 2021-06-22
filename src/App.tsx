import { BrowserRouter, Route } from 'react-router-dom'

import { AuthProvider } from './store/authProvider'
import { Home } from './pages/Home'
import { NewRoom } from './pages/NewRoom'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Route path="/" exact component={Home} />
        <Route path="/new-room" component={NewRoom} />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
