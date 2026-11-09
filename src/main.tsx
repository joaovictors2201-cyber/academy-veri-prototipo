import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { installTheme } from './themes';

installTheme();

createRoot(document.getElementById('root')!).render(<App />);
