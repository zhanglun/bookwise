import ReactDOM from 'react-dom/client';
import App from './App';
import { migrate } from './db/migrate';

migrate().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
});
