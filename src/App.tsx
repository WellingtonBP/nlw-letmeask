import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { AuthProvider } from './store/authProvider'
import { Home } from './pages/Home'
import { NewRoom } from './pages/NewRoom'
import { Room } from './pages/Room'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/rooms/new" exact component={NewRoom} />
          <Route path="/rooms/:id" component={Room} />
        </Switch>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
