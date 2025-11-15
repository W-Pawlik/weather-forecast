import { createBrowserRouter } from 'react-router-dom';

import App from './App';
import Home from './pages/Home';
import Map from './pages/Map';
import Settings from './pages/Settings';
import CityDetails from './pages/CityDetails';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      {
        path: 'map',
        element: <Map />,
      },
      { path: 'settings', element: <Settings /> },
      { path: '/:cityName', element: <CityDetails /> },
    ],
  },
]);
