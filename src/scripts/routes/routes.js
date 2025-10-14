import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import AddStoryPage from '../pages/add-story/add-story-page';
import DetailPage from '../pages/detail/detail-page';
import LoginPage from '../pages/login/login-page';
import RegisterPage from '../pages/register/register-page'; 

const routes = {
  '/': new HomePage(),
  '/about': new AboutPage(),
  '/add': new AddStoryPage(),
  '/story/:id': new DetailPage(),
  '/login': new LoginPage(),
  '/register': new RegisterPage(),
};

export default routes;