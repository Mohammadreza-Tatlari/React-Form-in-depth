import { Routes, Route, Link } from 'react-router-dom';
import './App.css'
import CheckoutForm from './components/CheckoutForm'
import EmailValidation from './components/EmailValidation'

function App() {

  return (
    <>
    <nav>
        <ul>
        <li><Link to={'/'}><button>Form</button></Link></li>
        <li><Link to={'/emailcheck'}><button>Email Check</button></Link></li>
        </ul>
        </nav>
    <Routes>
      
      <Route path='/' Component={CheckoutForm}/>
      <Route path='/emailcheck' Component={EmailValidation}/>
    </Routes>
    </>
  )
}

export default App
