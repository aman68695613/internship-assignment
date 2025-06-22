import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AddItem from './pages/AddItem';
import ViewItems from './pages/ViewItems';
import Home from "./pages/Home";
import { Toaster } from "@/components/ui/sonner";
export default function App() {
  return (
    <BrowserRouter>
        <Toaster richColors position="top-center" />
      <Routes>
          <Route path="/" element={<Home />} />
        <Route path="/view-items" element={<ViewItems />} />
        <Route path="/add" element={<AddItem />} />
      </Routes>
    </BrowserRouter>
  );
}