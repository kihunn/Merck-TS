// React imports
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

// Redux imports
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import reducers from './redux/reducers/index';

// Page imports
import SamplesPage from './pages/SamplesPage/SamplesPage';
import RootPage from './pages/RootPage/RootPage';
import CreateSamplePage from './pages/CreateSamplePage/CreateSamplePage';
import PCreateSamplePage from './pages/PharmaTeamPage/PCreateSamplePage/PCreateSamplePage';
import PSamplesPage from './pages/PharmaTeamPage/PSamplePage/PSamplesPage';

import { ThemeProvider } from '@mui/material/styles';
import { theme } from './styles';

const store = configureStore({
    reducer: reducers,
    middleware: [thunk],
});

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootPage />,
    },
    {
        path: "/samples",
        element: <SamplesPage />,
        // Buggin
        // children: [
        //     {
        //         path: "create",
        //         element: <CreateSamplePage />,
        //     }
        // ]
    },
    // Ideally I would like this route to be a child of /samples but there is some error with it
    {
        path: "/samples/create",
        element: <CreateSamplePage />,
    },
    {
        path: "/Psamples",
        element: <PSamplesPage />,
    },
    {
        path: "/Psamples/Pcreate",
        element: <PCreateSamplePage />,
    }
]);

ReactDOM.createRoot(document.getElementById('root') as (Element | DocumentFragment)).render(
    <React.StrictMode>
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <RouterProvider router={router} />
            </ThemeProvider>
        </Provider>
    </React.StrictMode>
)