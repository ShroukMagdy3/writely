import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Register from './pages/Register'
import { Routes, Route } from "react-router-dom";
import Layout from './layout/Layout'
import Login from './pages/Login'
import Home from './pages/Home'
import AddPost from './pages/AddPost'
import PostDetails from './pages/PostDetails'
import EditPost from './pages/EditPost'
import Bookmarks from './pages/Bookmarks'
import Profile from './pages/Profile'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="add-post" element={<AddPost />} />
        <Route path="/post/:id" element={<PostDetails />} />
        <Route path="/edit-post/:id" element={<EditPost />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  )
}

export default App
