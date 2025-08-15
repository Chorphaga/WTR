import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ToastProvider } from './context/ToastContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </React.StrictMode>
);

export { StyleUtils } from './components/common/StyleUtils';
export { DataUtils } from './components/common/DataUtils';
export { Theme } from './components/common/Theme';
export {
  StatCard,
  StatusBadge,
  ActionButton,
  FilterTab
} from './components/common/ComponentUtils';
