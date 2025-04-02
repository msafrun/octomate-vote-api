import { Router } from 'express';
import { apiV1RateLimiter } from '../../../middlewares/api-rate-limit.middleware';
import voteRouter from './vote.route';

const apiV1Router = Router();

const defaultRoutes = [
  {
    path: '/vote',
    route: voteRouter,
  },
];

defaultRoutes.forEach((route) => {
  apiV1Router.use(apiV1RateLimiter);
  apiV1Router.use(route.path, route.route);
});

export default apiV1Router;
