import { createBrowserRouter } from 'react-router-dom';

import App from './App';
import Map from './pages/Map';
import Settings from './pages/Settings';
import CityDetails from './pages/CityDetails';
import FavouritesCiies from './pages/FavouritesCiies';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Map /> },
      {
        path: '/favouritesCiies',
        element: <FavouritesCiies />,
      },
      { path: 'settings', element: <Settings /> },
      { path: '/:cityName', element: <CityDetails /> },
    ],
  },
]);
