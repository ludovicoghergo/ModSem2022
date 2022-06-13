import logo from './logo.svg';
import './App.css';

/**
 * *ddd*
 * !rosso!
 * @param pippo ciao
 * ?dopmanda?
 * TODO: dddd 
 */

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";


import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Docs from './routes/docs';
import Home from './routes/home';
import UserResult from './routes/userResult';
import Users from './routes/Users';
import Professors from './routes/Professors';
import School from './routes/schoolResult';

/**
 * *Menu orizzontale che contiene le principali sezioni del sito : Documenti,Utenti,Professori*
 */

const myMenu =
  <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" id="home_nav">
    <Container>
      <Navbar.Brand href="/">Ducky Doc</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="/">Documents</Nav.Link>
          <Nav.Link href="/users">Users</Nav.Link>
          <Nav.Link href="/professors">Professors</Nav.Link>
        </Nav>

      </Navbar.Collapse>
    </Container>
  </Navbar>;










function App() {
  return (
    <div className="App">
      <header className="App-header">
        {myMenu}
      </header>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="docs" element={<Docs />} />
          <Route path="professors" element={<Professors />} />
          <Route path="user/*" element={<UserResult />} />
          <Route path='users' element={<Users />} />
          <Route path='school/*' element={<School />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
