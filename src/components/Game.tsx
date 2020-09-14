import React, { useState, useEffect, useRef } from 'react';
import Levels from '../helpers/Levels'
import GameStates from '../helpers/GameStates'
import CellStates from '../helpers/CellStates'
import Coordinates from '../helpers/Coordinates'
import CellComponent from './Cell'
import StatsComponent from './Stats'
import './Game.css'
import './Cell.css'

interface Props {
  height: number,
  width: number,
  nbMines: number
  level: Levels
}

type Cell = {
  state: CellStates,
  isMine: boolean,
  value: number
}

const neighbourhood: Coordinates[] = [
  { y: -1, x: -1 },
  { y: -1, x: 0 },
  { y: -1, x: 1 },
  { y: 0, x: -1 },
  { y: 0, x: 1 },
  { y: 1, x: -1 },
  { y: 1, x: 0 },
  { y: 1, x: 1 },
]

const Game: React.FC<Props> = ({ height, width, nbMines, level }) => {
  const [board, setBoard] = useState<Cell[][]>([])
  const [remainingCells, setRemainingCells] = useState<number>(height * width - nbMines)
  const [gameState, setGameState] = useState<GameStates>(GameStates.ToInit)
  const statsRef = useRef<any | null>(null)

  const getNeighbours = (coordinates: Coordinates): Coordinates[] => {
    const neighbours: Coordinates[] = []
    for (const neighbour of neighbourhood) {
      const tmp_x: number = coordinates.x + neighbour.x
      const tmp_y: number = coordinates.y + neighbour.y
      if (tmp_x >= 0 && tmp_x < width && tmp_y >= 0 && tmp_y < height) {
        neighbours.push({ y: tmp_y, x: tmp_x })
      }
    }
    return neighbours
  }

  const countNearByMines = (neighbours: Coordinates[]): number => {
    let count: number = 0;
    for (const neighbour of neighbours) {
      if (board[neighbour.y][neighbour.x].isMine) {
        ++count;
      }
    }
    return count
  }

  const revealMines = () => {
    for (const rows of board) {
      for (const cell of rows) {
        if (cell.isMine && cell.state === CellStates.Hidden) {
          cell.state = CellStates.IsMine
        } else if (!cell.isMine && cell.state === CellStates.Flag) {
          cell.state = CellStates.WrongFlag
        }
      }
    }
  }

  const revealCell = (coordinates: Coordinates): number => {
    let revealed: number = 0
    const currentCell: Cell = board[coordinates.y][coordinates.x]
    if (currentCell.state === CellStates.Hidden) {
      if (currentCell.isMine) {
        currentCell.state = CellStates.IsClickedMine
        revealMines()
        setGameState(GameStates.Lost)
        return -1
      }
      else {
        revealed += 1
        const neighbours = getNeighbours(coordinates)
        const value: number = countNearByMines(neighbours)
        if (value === 0) {
          currentCell.state = CellStates.Empty
          for (const neighbour of neighbours) {
            if (!board[neighbour.y][neighbour.x].isMine) {
              revealed += revealCell(neighbour)
            }
          }
        }
        else {
          currentCell.state = CellStates.Value
        }
        currentCell.value = value
      }
    }
    return revealed
  }

  const init = (cellCoordinates: Coordinates) => {
    const coordinates: Coordinates[] = []

    const toIgroreCells: Coordinates[] = getNeighbours(cellCoordinates)
    toIgroreCells.push(cellCoordinates)
    for (let row: number = 0; row < height; row++) {
      for (let col: number = 0; col < width; col++) {
        let add: boolean = true
        for (const toIgroreCell of toIgroreCells) {
          if (toIgroreCell.y === row && toIgroreCell.x === col) {
            add = false
            break
          }
        }
        if (add) coordinates.push({ x: col, y: row })
      }
    }

    let mineCtr: number = nbMines
    while (mineCtr-- > 0) {
      const pairIndex: number = Math.floor(Math.random() * Math.floor(coordinates.length))
      const pair: Coordinates = coordinates.splice(pairIndex, 1)[0]
      board[pair.y][pair.x].isMine = true
    }
    setBoard(board)
  }

  const handleCellCliked = (coordinates: Coordinates, type: string) => {
    if (type === "click") {
      if (gameState === GameStates.ToInit) {
        init(coordinates)
        setGameState(GameStates.OnGoing)
      }
      if (gameState === GameStates.OnGoing || gameState === GameStates.ToInit) {
        const revealed: number = revealCell(coordinates)
        setRemainingCells(remainingCells - revealed)
        setBoard([...board])
      }
    }
    else if (type === "contextmenu" &&
      (gameState === GameStates.OnGoing || gameState === GameStates.ToInit)) {
      const currentCell: Cell = board[coordinates.y][coordinates.x]
      if (currentCell.state === CellStates.Hidden) {
        currentCell.state = CellStates.Flag
        statsRef.current.removeMine()
      } else if (currentCell.state === CellStates.Flag) {
        currentCell.state = CellStates.Possibility
        statsRef.current.addMine()
      } else if (currentCell.state === CellStates.Possibility) {
        currentCell.state = CellStates.Hidden
      }
      setBoard([...board])
    }
  }

  const clean = () => {
    const rows: Cell[][] = []
    for (let row: number = 0; row < height; row++) {
      const cols: Cell[] = []
      for (let col: number = 0; col < width; col++) {
        cols.push({ state: CellStates.Hidden, isMine: false, value: 0 })
      }
      rows.push(cols)
    }
    setBoard(rows)
    setGameState(GameStates.ToInit)
    setRemainingCells(height * width - nbMines)
  }

  useEffect(() => {
    if (board.length === 0) {
      const rows: Cell[][] = []
      for (let row: number = 0; row < height; row++) {
        const cols: Cell[] = []
        for (let col: number = 0; col < width; col++) {
          cols.push({ state: CellStates.Hidden, isMine: false, value: 0 })
        }
        rows.push(cols)
      }
      setBoard(rows)
    }
  }, [height, width, board, setBoard])

  useEffect(() => {
    if (remainingCells === 0) {
      setGameState(GameStates.Win)
    }
  }, [remainingCells, setGameState])

  useEffect(() => {
    if (gameState === GameStates.OnGoing) {
      statsRef.current.startTimer()
    } else if (gameState === GameStates.Win) {
      statsRef.current.win()
    } else if (gameState === GameStates.Lost) {
      statsRef.current.lose()
    }
  }, [gameState])

  return (
    <div id="game" className={`game ${level}-game`}>
      <StatsComponent ref={statsRef} mines={nbMines} cleanGame={clean} />
      <div id="board" className={`board ${level}-board`}>
        <table>
          <tbody>
            {board.map((row: Cell[], rowIndex: number) => {
              return <tr key={rowIndex * height} className="board-row">
                {row.map((col: Cell, colIndex: number) => {
                  return <CellComponent
                    key={rowIndex * height + colIndex}
                    state={col.state}
                    value={col.value}
                    coordinates={{ y: rowIndex, x: colIndex }}
                    onClick={handleCellCliked}
                  />
                })}
              </tr>
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Game;
