import ReactDOM from 'react-dom'
import {useState} from 'react'
import './eadi-main-style.scss'
import { render } from '../Hooks/index'
const EADI_SCREEN = () => {
    return(
        <div>
            <h1 id="text">EADI Main</h1>
        </div>
    )
}

render(<EADI_SCREEN />)