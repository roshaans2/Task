import React from 'react';
import {BrowserRouter,Routes,Route} from "react-router-dom"

import FirstPage from './FirstPage';
import SecondPage from './SecondPage';

const App = () => {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/cves/:id' element={<SecondPage/>}></Route>
        <Route path='/' element={<FirstPage/>}></Route>
      </Routes>
    </BrowserRouter>
  </>
  );
};

export default App;
