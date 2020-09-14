import React from 'react';
import GameStates from '../helpers/GameStates'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-solid-svg-icons'
import './Stats.css'

interface Props {
  mines: number
  cleanGame: Function
}

type StatStates = {
  seconds: number,
  mines: number,
  timer: NodeJS.Timeout,
  gameState: GameStates
}

class Stats extends React.Component<Props> {

  constructor(props: Props) {
    super(props)
    this.clean = this.clean.bind(this)
  }

  state: StatStates = {
    mines: this.props.mines,
    seconds: 0,
    timer: setInterval(() => { }, 1000),
    gameState: GameStates.ToInit,
  }

  addMine() {
    this.setState({
      mines: this.state.mines + 1
    })
  }

  removeMine() {
    this.setState((state) => ({
      mines: this.state.mines - 1
    }))
  }

  startTimer() {
    this.setState({
      gameState: GameStates.OnGoing
    })
    clearInterval(this.state.timer)
    this.setState({
      timer: setInterval(() => {
        this.setState({
          seconds: this.state.seconds + 1
        })
      }, 1000)
    })
  }

  win() {
    clearInterval(this.state.timer)
    this.setState({
      gameState: GameStates.Win
    })
  }

  lose() {
    clearInterval(this.state.timer)
    this.setState({
      gameState: GameStates.Lost
    })
  }

  clean() {
    this.props.cleanGame()
    this.setState({
      mines: this.props.mines,
      seconds: 0,
      timer: setInterval(() => { }, 1000),
      gameState: GameStates.ToInit,
    })
  }

  render() {
    return (
      <div id="stats" className="stats">
        <span className="remaining-mines">
          <img src="mine.png" alt="mine" className="icon-lg"></img>
          {this.state.mines}
        </span>
        <span className="game-over">
          {this.state.gameState === GameStates.Win ?
            <span><span className="win">Congratulations!</span> <button>Retry</button></span>
            : this.state.gameState === GameStates.Lost ?
              <span><span className="lose">Try again!</span> <button onClick={this.clean}>Retry</button></span>
              : <></>
          }
        </span>
        <span className="timer">
          <FontAwesomeIcon icon={faClock} className="icon-lg" />{this.state.seconds}
        </span>
      </div>
    )
  }
}

export default Stats