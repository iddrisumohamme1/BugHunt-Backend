const Bug = require('../models/bug.models.js');
const mongoose = require('mongoose');

/*const reportchartall =  async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear, 11, 31);

    const bugs = await Bug.find({
      createdAt: { $gte: startDate, $lte: endDate }
    });

    const reporterData = {};

    bugs.forEach(bug => {
      const month = bug.createdAt.getMonth();
      const reporter = bug.reporter;

      if (!reporterData[reporter]) {
        reporterData[reporter] = Array(12).fill().map(() => ({ reported: 0, closed: 0 }));
      }

      reporterData[reporter][month].reported++;
      if (bug.status === 'Closed') {
        reporterData[reporter][month].closed++;
      }
    });

    const chartData = {
      series: Object.entries(reporterData).map(([reporter, data]) => ({
        name: reporter,
        data: data.map(m => m.reported)
      })),
      categories: Array(12).fill().map((_, index) => 
        new Date(currentYear, index, 1).toISOString()
      )
    };

    res.json(chartData);
  } catch (error) {
    console.error('Error fetching chart data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; */

const reportchart =async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear, 11, 31);

    const bugs = await Bug.find({
      reporter: req.user.email, // Fetch data based on the logged-in user's email
      createdAt: { $gte: startDate, $lte: endDate }
    });

    const monthlyData = Array(12).fill().map(() => ({ reported: 0, closed: 0 }));

    bugs.forEach(bug => {
      const month = bug.createdAt.getMonth();
      monthlyData[month].reported++;
      if (bug.status === 'Closed') {
        monthlyData[month].closed++;
      }
    });

    const chartData = {
      series: [
        {
          name: 'Closed Bugs',
          data: monthlyData.map(m => m.closed)
        },
        {
          name: 'Reported Bugs',
          data: monthlyData.map(m => m.reported)
        }
      ],
      categories: monthlyData.map((_, index) => 
        new Date(currentYear, index, 1).toISOString()
      )
    };

    res.json(chartData);
  } catch (error) {
    console.error('Error fetching chart data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  reportchart
};
