import '@/styles/index.css';
import '@/styles/common.scss';

import { useState } from 'react';

import { tw } from './utils/helper';

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <div className={tw` bg-red-500 text-neutral-800`}>
      Hello - {count} - {process.env.BASE_URL}
      <button onClick={() => setCount((p) => p + 1)}>increment</button>
    </div>
  );
};

export default App;
