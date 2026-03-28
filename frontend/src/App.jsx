import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <div className="flex">
        {count}
      </div>
    </>
  );
}

export default App;
