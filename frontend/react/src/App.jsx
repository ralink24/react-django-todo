import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './AuthContext'

import TodoPage from './TodoPage'
import LoginPage from './LoginPage'
import Header from './Header'
import PrivateRoute from './PrivateRoute'

function App() {
    return (
        <div className="App">
            <Router>
              <AuthProvider>
                <Header/>
                <Routes>
                    <Route path="/" element={<PrivateRoute><TodoPage/></PrivateRoute>} />
                    <Route path="/login" element={<LoginPage/>}/>
                </Routes>
                </AuthProvider>
            </Router>
        </div>
    );
}

export default App;