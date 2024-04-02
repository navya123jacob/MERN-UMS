import React from 'react'
import Header from './Components/Header'
import {Container} from 'react-bootstrap'
import { Outlet } from 'react-router-dom'
import './App.css'

const App = () => {
  return (
    <>
    <Header/>
    <Container className='my-2'>
    <Outlet/>
    </Container>
    </>
  )
}

export default App
