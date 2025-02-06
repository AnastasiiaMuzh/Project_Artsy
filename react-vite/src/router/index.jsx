import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import FavoritesPage from '../components/FavoritesPage';
import Layout from './Layout';
import HomePage from '../components/HomePage';
import ProductDetails from '../components/ProductDetails/ProductDetails';
import ManageProducts from '../components/ManageProducts';
import CreateProductForm from '../components/CreateProductForm/CreateProductForm';



export const router = createBrowserRouter([

  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/products/:productId",
        element: <ProductDetails />,
      },
      {
        path: "/products/new",
        element: <CreateProductForm />
      },
      {
        path: "/products/current",
        elements: <ManageProducts />
      },
      {
        path: "/products/:productId/edit",
        elements: <CreateProductForm />
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "favorites",
        element: <FavoritesPage />,
      },
    ],
  },
]);