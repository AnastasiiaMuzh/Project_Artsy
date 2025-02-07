import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import FavoritesPage from '../components/FavoritesPage';
import Layout from './Layout';
import HomePage from '../components/HomePage';
import ProductDetails from '../components/ProductDetails/ProductDetails';
import UserReviews from '../components/Reviews/ManageReviews';
import UserProducts from '../components/ManageProducts/ManageProducts';
import CreateProduct from '../components/CreateProductForm/CreateProductForm';


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
        path: "reviews",
        element: <UserReviews />,
      },
      {
        path: "products",
        element: <UserProducts />,
      },
      {
        path: "products/new",
        element: <CreateProduct />,
      },
    ],
  },
]);