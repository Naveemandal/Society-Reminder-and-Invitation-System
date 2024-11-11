import React, { useEffect } from 'react'
import Home from './Pages/Home'
import { BrowserRouter as Router ,Routes , Route  } from "react-router-dom"
import Login from './Pages/Login'
import SignUp from './Pages/SignUp'
import PageNotFound from './Pages/PageNotFound'


const routes =(
  <Router>
    <Routes>
      <Route path="/dashboard" exact element={<Home />}></Route>
      <Route path="/" exact element={<Login />}></Route>
      <Route path="/SignUp" exact element={<SignUp  />}></Route>
      <Route path="*" exact element={<PageNotFound  />}></Route>

    </Routes>
  </Router>
)

const App = () => {
 
  return (
    <>
<div>{routes}</div>
    </>
  )
}

export default App