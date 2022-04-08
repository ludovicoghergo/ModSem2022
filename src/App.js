import logo from './logo.svg';
import './App.css';


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



const myMenu =
  <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" id="home_nav">
    <Container>
      <Navbar.Brand href="#home">Ducky Doc</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="/docs">Documents</Nav.Link>
          <Nav.Link href="#pricing">Users</Nav.Link>
          <Nav.Link href="#pricing">Professors</Nav.Link>
        </Nav>
        <Nav>
          <NavDropdown title="More" id="collasible-nav-dropdown">
            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action/3.4">Admin</NavDropdown.Item>
          </NavDropdown>
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
        </Routes>
      </BrowserRouter>,
    </div>
  );
}

export default App;
