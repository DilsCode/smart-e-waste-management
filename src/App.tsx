import { useData } from './context/DataContext';
import Login from './components/shared/Login';
import Dashboard from './components/Dashboard';

function App() {
  const { state } = useData();
  const currentUser = state?.currentUser;

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen text-gray-900 dark:text-gray-100 font-sans">
      {currentUser ? <Dashboard /> : <Login />}
    </div>
  );
}

export default App;