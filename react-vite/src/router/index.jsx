import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import FavoritesPage from '../components/FavoritesPage';
import Layout from './Layout';
import ShoppingCartPage from '../components/ShoppingCartPage/ShoppingCart/ShoppingCart';
import HomePage from '../components/HomePage';
import ProductDetails from '../components/ProductDetails/ProductDetails';
import ManageProducts from '../components/ManageProducts';
import CreateProductForm from '../components/CreateProductForm/CreateProductForm';
import { ManageReviews } from '../components/Reviews';
import OrdersPage from '../components/OrdersPage';



export const router = createBrowserRouter([

  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/products/new",
        element: <CreateProductForm />
      },
      {
        path: "/products/:productId",
        element: <ProductDetails />,
      },
      {
        path: "/products/current",
        element: <ManageProducts />
      },
      {
        path: "/products/:productId/edit",
        element: <CreateProductForm />
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
      {
        path: '/reviews/current',
        element: <ManageReviews />
      },
      {
        path: "products/new",
        element: <CreateProductForm />,
      },
      {
        path: "cart",
        element: <ShoppingCartPage />,
      },
      {
        path: "orders",
        element: <OrdersPage />,
      },
    ],
  },
]);
