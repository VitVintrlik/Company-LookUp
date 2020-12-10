import React from "react";
import './App.css';
import './materialStyles.css';

function App() {
  return (
      <div className="container">
          <h2>Vyhledávání firmy</h2>
          <form>
              <div className="group">
                  <input type="text" required/>
                  <span className="highlight"/>
                  <span className="bar"/>
                  <label>Název firmy</label>
              </div>
              <div className="group">
                  <input type="text" required/>
                  <span className="highlight"/>
                  <span className="bar"/>
                  <label>IČO</label>
              </div>
              <button className="materialButton" value="Vyhledat">Vyhledat</button>
          </form>
      </div>
  );
}

export default App;
