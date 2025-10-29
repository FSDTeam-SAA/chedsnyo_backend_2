import express from 'express';
import auth from '../../middlewares/auth';
import { userRole } from '../user/user.constant';
import { dashboardController } from './dashboard.controller';
const router = express.Router();

router.get(
  '/overview',
  auth(userRole.admin),
  dashboardController.dashboardOverview,
);

router.get(
  '/monthly-earnings',
  auth(userRole.admin),
  dashboardController.getMonthlyEarnings,
);

export const dashboardRouter = router;
