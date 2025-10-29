import Payment from '../payment/payment.model';
import { userRole } from '../user/user.constant';
import User from '../user/user.model';

const dashboardOverview = async () => {
  const revenue = await Payment.aggregate([
    { $match: { status: 'approved' } },
    { $group: { _id: null, totalRevenue: { $sum: '$adminFree' } } },
  ]);
  const business = await User.countDocuments({ role: userRole.business });
  const sele = await User.countDocuments({ role: userRole.seles });

  return {
    revenue: revenue.length > 0 ? revenue[0].totalRevenue : 0,
    business,
    sele,
  };
};

const getMonthlyEarnings = async (year: number) => {
  const earnings = await Payment.aggregate([
    {
      $match: {
        status: 'approved',
        paymentDate: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$paymentDate' },
        totalEarnings: { $sum: '$adminFree' },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  // convert month number to name and fill missing months
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const monthlyData = months.map((month, index) => {
    const found = earnings.find((e) => e._id === index + 1);
    return {
      month,
      totalEarnings: found ? found.totalEarnings : 0,
    };
  });

  return monthlyData;
};

export const dashboardService = {
  dashboardOverview,
  getMonthlyEarnings,
};
