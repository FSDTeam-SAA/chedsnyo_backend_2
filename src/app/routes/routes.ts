import { Router } from 'express';
import { userRoutes } from '../modules/user/user.routes';
import { authRoutes } from '../modules/auth/auth.routes';
import { industryRouter } from '../modules/industry/industry.routes';
import { assigmentRouter } from '../modules/assigment/assigment.routes';
import { courseRouter } from '../modules/course/course.routes';
import { blogRoutes } from '../modules/blog/blog.routes';
import { conversationRoutes } from '../modules/conversation/conversation.routes';
import { messageRoutes } from '../modules/message/message.routes';
import { paymentRouter } from '../modules/payment/payment.routes';
import { reviewRouter } from '../modules/reviews/reviews.routes';
import { leaderBoardRouter } from '../modules/leaderBoard/leaderBoard.routes';
import { dashboardRouter } from '../modules/dashboard/dashboard.routes';

const router = Router();

const moduleRoutes = [
  {
    path: '/user',
    route: userRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/industry',
    route: industryRouter,
  },
  {
    path: '/assigment',
    route: assigmentRouter,
  },
  {
    path: '/course',
    route: courseRouter,
  },
  {
    path: '/blog',
    route: blogRoutes,
  },
  {
    path: '/conversation',
    route: conversationRoutes,
  },
  {
    path: '/message',
    route: messageRoutes,
  },
  {
    path: '/payment',
    route: paymentRouter,
  },
  {
    path: '/review',
    route: reviewRouter,
  },
  {
    path: '/leaderboard',
    route: leaderBoardRouter,
  },
  {
    path: '/dashboard',
    route: dashboardRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
