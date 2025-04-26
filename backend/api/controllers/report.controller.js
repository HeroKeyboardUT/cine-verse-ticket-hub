import reportModel from '../models/report.model.js';

class ReportController {
    async getStatisticReport(req, res) {
        try {
            const report = await reportModel.getStatisticReport();
            res.status(200).json(report);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching statistic report', error });
        }
    }
    async getMonthlyRevenueReport(req, res) {
        try {
            const report = await reportModel.getMonthlyRevenueReport();
            res.status(200).json(report);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching monthly revenue report', error });
        }
    }
    async getDailyRevenueReport(req, res) {
        try {
            const report = await reportModel.getDailyRevenueReport();
            res.status(200).json(report);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching daily revenue report', error });
        }
    }
    async getMovieRevenueReport(req, res) {
        try {
            const report = await reportModel.getMovieRevenueReport();
            res.status(200).json(report);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching movie revenue report', error });
        }
    }
    async getTopCustomerReport(req, res) {
        try {
            const limit = parseInt(req.headers['customerlimit']) || 10;
            const report = await reportModel.getTopCustomerReport(limit);
            res.status(200).json(report);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching top customer report', error });
        }
    }
};

export default new ReportController();