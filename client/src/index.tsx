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
import AuditTable from './components/AuditTable/AuditTable';
import PSamplesPage from './pages/PharmaTeamPage/PSamplePage/PSamplesPage';
import PCreateSamplePage from './pages/PharmaTeamPage/PCreateSamplePage/PCreateSamplePage';

import { Team } from './components/AuditTable/AuditTable';

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
    },
    {
        path: "/samples/create",
        element: <CreateSamplePage />,
    },
    {
        path: "/samples/audit/:id",
        element: <AuditTable team={Team.ARD} />
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
        path: "/psamples/audit/:id",
        element: <AuditTable team={Team.PSCS} />
    }
]);

ReactDOM.createRoot(document.getElementById('root') as (Element | DocumentFragment)).render(
    <React.StrictMode>
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    </React.StrictMode>
)