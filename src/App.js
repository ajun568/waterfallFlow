import React, { useState, useEffect } from 'react';
import WaterfallGrid from './pages/waterfallGrid';
import WaterfallAbsolute from './pages/waterfallAbsolute';
import WaterfallFlex from './pages/waterfallFlex';
import './waterfall-flow.css';

const ComponentMap = {
  'ABSOLUTE_VERTICAL': <WaterfallAbsolute />,
  'GRID_VERTICAL': <WaterfallGrid />,
  'FLEX_HORIZONTAL': <WaterfallFlex />
}
const App = () => {
  const [type, setType] = useState('');

  useEffect(() => {
    const query = window.location.href.split('?')[1];
    const params = query && query.split('&');
    const type = params && params.find(item => item.split('=')[0] === 'type');
    const typeVal = type ? type.split('=')[1] : undefined;
    if (type && ComponentMap[typeVal]) {
      setType(typeVal);
    } else {
      setType('GRID_VERTICAL');
    }
  }, [])

  return (
    <main>
      { ComponentMap[type] }
    </main>
  );
}

export default App;
