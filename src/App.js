import React, { useState, useEffect } from 'react';
import WaterfallGrid from './pages/waterfallGrid';
import WaterfallAbsolute from './pages/waterfallAbsolute';
import './waterfall-flow.css';

const ComponentMap = {
  'ABSOLUTE_VERTICAL': <WaterfallAbsolute />,
  'GRID_VERTICAL': <WaterfallGrid />
}
const App = () => {
  const [type, setType] = useState('');

  useEffect(() => {
    const query = window.location.href.split('?')[1];
    const params = query.split('&');
    params.forEach(item => {
      const arr = item.split('=');
      if (arr[0] === 'type') setType(arr[1]);
    })
  }, [])

  return (
    <main>
      { ComponentMap[type] || <WaterfallGrid /> }
    </main>
  );
}

export default App;
