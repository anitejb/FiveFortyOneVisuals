import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home, About } from './pages';
import { CongressMap } from './CongressMap';
import { LegCount } from './LegCount';
import { BillsActions } from './BillsActions';
import { PolicyArea } from './PolicyArea';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Logo from './LogoWithWords.png';

function App() {
  return (
    <Router>
      <div className="container">
        <div className="sidebar">
          <img src={Logo} />
          {/* <h1>FiveFortyOne Visuals</h1> */}
          <nav className="nav flex-column">
            {/* <Link to="/" className="nav-link" activeClassName="active">
              Home
            </Link> */}
            <Link to="/" className="nav-link" activeClassName="active">
              About
            </Link>
            <Link to="/congress" className="nav-link" activeClassName="active">
              Congressional Ages
            </Link>
            <Link to="/legcount" className="nav-link" activeClassName="active">
              Legislation Count
            </Link>
            <Link to="/bills_actions" className="nav-link" activeClassName="active">
              Bills over Time
            </Link>
            <Link to="/policy_area" className="nav-link" activeClassName="active">
              Policy Areas
            </Link>
          </nav>
        </div>

        <div className="content">
          <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/" element={<About />} />
            <Route path="/congress" element={<CongressMap />} />
            <Route path="/legcount" element={<LegCount />} />
            <Route path="/bills_actions" element={<BillsActions />} />
            <Route path="/policy_area" element={<PolicyArea />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;