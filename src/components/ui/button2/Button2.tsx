import React from 'react'
import './Button2.css'

function Button2({title,onClick, color, className ="", type}) {
  return (
    <button onClick={onClick} className={`Button2 ${className}`} type={type}>{title}</button>
  )
}
export default Button2
