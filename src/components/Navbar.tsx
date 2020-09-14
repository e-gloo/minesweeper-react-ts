import React, { useState, useEffect } from 'react'
import './Navbar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { Link, useHistory } from 'react-router-dom'
import Levels from '../helpers/Levels'

function Navbar() {
  const [navClass, setNavClass] = useState<string>("topnav")
  const [level, setLevel] = useState<Levels>()
  const history = useHistory()

  const handleMenuClick = () => {
    if (navClass === "topnav") {
      setNavClass("topnav responsive")
    } else {
      setNavClass("topnav")
    }
  }

  const handleLevelClick = () => {
    if (navClass === "topnav responsive"){
      setNavClass("topnav")
    }
  }

  useEffect(() => {
    const path = history.location.pathname.replace('/', '')
    setLevel(path === "easy" ? Levels.Easy
      : path === "medium" ? Levels.Medium : Levels.Hard)

    return history.listen((location) => {
      const path = location.pathname.replace('/', '')
      setLevel(path === "easy" ? Levels.Easy
        : path === "medium" ? Levels.Medium : Levels.Hard)
    })
  }, [history, setLevel])

  return (
    <nav className={navClass}>
      <div className="menu">
        <span>Minesweeper</span>
        <span className="icon" onClick={handleMenuClick}>
          <FontAwesomeIcon icon={faBars} />
        </span>
      </div>
      <Link to="/easy" onClick={handleLevelClick} className={level === Levels.Easy ? "active" : ""}>Easy</Link>
      <Link to="/medium" onClick={handleLevelClick} className={level === Levels.Medium ? "active" : ""}>Medium</Link>
      <Link to="/hard" onClick={handleLevelClick} className={level === Levels.Hard ? "active" : ""}>Hard</Link>
    </nav>
  )
}

export default Navbar