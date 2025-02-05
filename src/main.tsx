import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Tabs, Tab } from 'react-bootstrap';
import Crypto from './components/Crypto/Crypto';
import Stocks from './components/Stocks/Stocks';
import './index.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('stocks');
  return (
    <StrictMode>
    <div className="container mt-4">
      <Tabs
        id="controlled-tabs"
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k || 'crypto')}
        className="mb-3">
        <Tab eventKey="crypto" title="Crypto Leverage">
          <Crypto />
        </Tab>
        <Tab eventKey="stocks" title="Stocks Shares">
          <Stocks />
        </Tab>
      </Tabs>
    </div>
  </StrictMode>
  );
};

export default App;

createRoot(document.getElementById('root')!).render(<App />);
