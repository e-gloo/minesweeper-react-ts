import React from 'react'
import './HomeScreen.css'
import Game from '../components/Game'
import Levels from '../helpers/Levels'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import Navbar from '../components/Navbar'

function HomeScreen() {
  return (
    <Router>
      <Navbar/>
      <div className="home">
        <div>
          <Switch>
            <Route exact path="/">
              <Redirect to="/hard" />
            </Route>
            <Route exact path="/easy" component={
              () => <Game nbMines={10} width={9} height={9} level={Levels.Easy} />
            } />
            <Route exact path="/medium" component={
              () => <Game nbMines={40} width={16} height={16} level={Levels.Medium} />
            } />
            <Route exact path="/hard" component={
              () => <Game nbMines={99} width={30} height={16} level={Levels.Hard} />
            } />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default HomeScreen;
