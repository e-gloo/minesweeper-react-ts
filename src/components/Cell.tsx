import React from 'react';
import CellStates from '../helpers/CellStates'
import Coordinates from '../helpers/Coordinates'
import './Cell.css'

interface Props {
  state: CellStates,
  coordinates: Coordinates,
  value: number,
  onClick: Function
}

const Cell: React.FC<Props> = ({ state, value, coordinates, onClick }) => {
  const handleClick = (e: React.MouseEvent<HTMLTableDataCellElement,
    MouseEvent>) => {
    e.preventDefault();
    onClick(coordinates, e.type)
  }
  const displayContent = () => {
    let className: string = ""
    let content = ""
    switch (state) {
      case CellStates.Hidden:
        className = "hidden-cell"
        break
      case CellStates.Empty:
        className = "cell"
        break
      case CellStates.Value:
        className = `cell value-${value}`
        content = value.toString()
        break
      case CellStates.Flag:
        className = "hidden-cell background-cell flag-cell"
        break
      case CellStates.Possibility:
        className = "hidden-cell background-cell possibility-cell"
        break
      case CellStates.IsMine:
        className = "hidden-cell background-cell mine-cell"
        break
      case CellStates.IsClickedMine:
        className = "hidden-cell background-cell mine-cell clicked-mine"
        break
      case CellStates.WrongFlag:
        className = "hidden-cell background-cell wrong-flag"
        break
    }
    return (
      <td id={`${coordinates.y}${coordinates.x}`}
        onClick={handleClick} onContextMenu={handleClick} className={className}>
        {content}
      </td>
    )
  }
  return displayContent();
}

export default Cell;
