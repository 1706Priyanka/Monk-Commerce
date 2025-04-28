import './App.css'
import { ProductProvider } from './context/ProductContext';
import './index.css'
import { ProductPage } from './pages/ProductPage'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {
 

  return (
    <>
    <ProductProvider>
    <DndProvider backend={HTML5Backend}>
      <ProductPage/>
    </DndProvider>
    </ProductProvider>
    
    </>
  )
}

export default App
