import ShopPersonal from './pages/ShopPersonal';
import ShopChina from './pages/ShopChina';
import About from './pages/About';
import Contacts from './pages/Contacts';
import AdminProductEdit from './pages/AdminProductEdit';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import Home from './pages/Home';
import ProductPage from './pages/ProductPage';
import Shop from './pages/Shop';
import __Layout from './Layout.jsx';


export const PAGES = {
    "ShopPersonal": ShopPersonal,
    "ShopChina": ShopChina,
    "About": About,
    "Contacts": Contacts,
    "AdminProductEdit": AdminProductEdit,
    "AdminDashboard": AdminDashboard,
    "AdminProducts": AdminProducts,
    "Home": Home,
    "ProductPage": ProductPage,
    "Shop": Shop,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};