import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import CatalogPersonal from "./pages/CatalogPersonal";
import CatalogChina from "./pages/CatalogChina";
import ProductPage from "./pages/ProductPage";
import About from "./pages/About";
import Contacts from "./pages/Contacts";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Wishlist from "./pages/Wishlist";
import AdminPanel from "./pages/AdminPanel";
import __Layout from "./Layout.jsx";

export const PAGES = {
  Home: Home,
  Catalog: Catalog,
  CatalogPersonal: CatalogPersonal,
  CatalogChina: CatalogChina,
  ProductPage: ProductPage,
  About: About,
  Contacts: Contacts,
  Cart: Cart,
  Orders: Orders,
  Wishlist: Wishlist,
  AdminPanel: AdminPanel,
};

export const pagesConfig = {
  mainPage: "Home",
  Pages: PAGES,
  Layout: __Layout,
};
