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
import SamplesPage from './pages/SamplesPages/SamplesPage';
import RootPage from './pages/RootPage/RootPage';
import CreateSamplePage from './pages/CreateSamplePages/CreateSamplePage';
import AuditTable from './components/AuditTable/AuditTable';
import PSamplesPage from './pages/SamplesPages/PSamplesPage';
import PCreateSamplePage from './pages/CreateSamplePages/PCreateSamplePage';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import PrintersPage from './pages/PrintersPage/PrintersPage';
import { DeletedSamplesPage } from './pages/DeletedSamplesPage/DeletedSamplesPage';
import { Team } from './constants';
import { LabelEditorPage } from './pages/LabelEditorPage/LabelEditorPage';

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
        path: "/printers",
        element: <PrintersPage />,
    },
    {
        path: "/editor",
        element: <LabelEditorPage />,
    },
    {
        path: "/samples",
        element: <SamplesPage />,
    },

    {
        path: "/samples/create",
        element: <CreateSamplePage />,
    },
    {
        path: "samples/deleted",
        element: <DeletedSamplesPage team={Team.ARND} />,
    },
    {
        path: "/samples/audit/:id",
        element: <AuditTable team={Team.ARND} />
    },
    {
        path: "/psamples",
        element: <PSamplesPage />,
    },
    {
        path: "/psamples/create",
        element: <PCreateSamplePage />,
    },
    {
        path: "psamples/deleted",
        element: <DeletedSamplesPage team={Team.PSCS} />,
    },
    {
        path: "/psamples/audit/:id",
        element: <AuditTable team={Team.PSCS} />
    }
]);

const theme = createTheme({
    palette: {
        primary: {
            main: 'rgba(0, 133, 124, 1)'
        },
        secondary: {
            main: 'rgba(255, 255, 255, 1)'
        },
    },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <RouterProvider router={router} />
            </ThemeProvider>
        </Provider>
    </React.StrictMode>
)
