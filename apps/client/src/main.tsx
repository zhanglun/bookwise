import ReactDOM from 'react-dom/client';
import App from './App';
import { migrate } from './db/migrate';

import './index.css';

migrate().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
});
