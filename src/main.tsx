import { createRoot } from 'react-dom/client';
import './index.css';
import Proto from './Proto';
import { installTheme } from './themes';

installTheme();

createRoot(document.getElementById('root')!).render(<Proto />);
