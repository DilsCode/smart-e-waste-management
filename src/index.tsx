
import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import App from './App';
import { DataProvider } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <StrictMode>
    <ThemeProvider>
      <DataProvider>
        <App />
      </DataProvider>
    </ThemeProvider>
  </StrictMode>
);
