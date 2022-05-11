import React, { useState, useEffect } from 'react';
import WaterfallGrid from './pages/waterfallGrid';
import WaterfallAbsolute from './pages/waterfallAbsolute';
import WaterfallFlex from './pages/waterfallFlex';
import './waterfall-flow.css';

const ComponentMap = {
  'VERTICAL': <WaterfallAbsolute />,
  'PC_VERTICAL': <WaterfallGrid />,
  'HORIZONTAL': <WaterfallFlex baseHeight={100} />,
  'PC_HORIZONTAL': <WaterfallFlex />,
  'TEST_GITHUB_ACTION': <div>测试 Github Action 构建 no.1</div>
}
const App = () => {
  const [type, setType] = useState('');

  useEffect(() => {
    const query = window.location.href.split('?')[1];
    const params = query && query.split('&');
    const typeArr = params && params.find(item => item.split('=')[0] === 'type');
    const typeVal = typeArr ? typeArr.split('=')[1] : undefined;

    // 用来测试 Github Action
    if (typeVal === 'TEST_GITHUB_ACTION') {
      setType(typeVal);
      return;
    };

    const realType = ['HORIZONTAL', 'VERTICAL'].includes(typeVal) ? typeVal : 'VERTICAL';
    if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) {
      setType(realType);
    } else {
      setType(`PC_${realType}`);
    }
  }, [])

  return (
    <main>
      { ComponentMap[type] }
    </main>
  );
}

export default App;
