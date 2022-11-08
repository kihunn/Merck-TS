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
        path: "/samples/audit/:id",
        element: <AuditTable />
    }
]);

ReactDOM.createRoot(document.getElementById('root') as (Element | DocumentFragment)).render(
    <React.StrictMode>
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    </React.StrictMode>
)