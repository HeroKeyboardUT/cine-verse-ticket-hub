import API_REPORT from "./API_lib/API_REPORT";

export interface StatisticsData {
    TotalRevenue: number;
    TotalTickets: number;
    TotalMovies: number;
}
export interface MonthlyRevenueItem {
    Month: string;
    Revenue: number;
}
export interface DailyRevenueItem {
    Date: string;
    Revenue: number;
}
export interface MovieRevenueItem {
    MovieTitle: string;
    Revenue: number;
}

export async function getStatistics(): Promise<StatisticsData> {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Authentication required");
        }
        const response = await fetch(API_REPORT.GET_STATISTICS, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch statistics");
        }
        const data = await response.json();
        return {
            TotalRevenue: data.TotalRevenue,
            TotalTickets: data.TotalTicket,
            TotalMovies: data.TotalMovie,
        };
    } catch (error) {
        console.error("Error fetching statistics:", error);
        throw error;
    }
}

export async function getMonthlyRevenue(): Promise<MonthlyRevenueItem[]> {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Authentication required");
        }
        const response = await fetch(API_REPORT.GET_MONTHLY_REVENUE, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch monthly revenue");
        }
        const data = await response.json();
        return data.map((item: any) => ({
            Month: item.Month,
            Revenue: item.MonthlyRevenue,
        }));
    } catch (error) {
        console.error("Error fetching monthly revenue:", error);
        throw error;
    }
}
export async function getDailyRevenue(): Promise<DailyRevenueItem[]> {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Authentication required");
        }
        const response = await fetch(API_REPORT.GET_DAILY_REVENUE, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch daily revenue");
        }
        const data = await response.json();
        return data.map((item: any) => ({
            Date: item.Date,
            Revenue: item.DailyRevenue,
        }));
    } catch (error) {
        console.error("Error fetching daily revenue:", error);
        throw error;
    }
}
export async function getMovieRevenue(): Promise<MovieRevenueItem[]> {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Authentication required");
        }
        const response = await fetch(API_REPORT.GET_MOVIE_REVENUE, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch movie revenue");
        }
        const data = await response.json();
        return data.map((item: any) => ({
            MovieTitle: item.Title,
            Revenue: item.MovieRevenue,
        }));
    } catch (error) {
        console.error("Error fetching movie revenue:", error);
        throw error;
    }
}

