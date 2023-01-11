import {
  Link,
  HashRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import AddEditNote from "./AddEditNote";
import NoteList from "./NoteList";
import './App.css';

function App() {
  return (
      <div className="App">
        <Router>
          <Routes>
            <Route exact path="/" element={
              <ul>
                <li>
                  <Link to="/note-list">List Notes</Link>
                </li>
                <li>
                  <Link to="/edit-note">Create Note</Link>
                </li>
              </ul>
            }/>
            <Route path="/note-list" element={<NoteList/>}/>
            <Route path="/edit-note" element={<AddEditNote/>}/>
            <Route path="/edit-note/:noteId" element={<AddEditNote/>}/>
          </Routes>
        </Router>
      </div>
  );
}

export default App;
