import React, { useState, useEffect, useCallback, useRef } from 'react'; // 1. Import useRef
import { useAuth } from '../../context/AuthContext';
import { getDashboardData } from '../../services/dashboardService';
import PageHeader from '../../components/ui/PageHeader';
import LoadingIndicator from '../../components/ui/LoadingIndicator';
import ExportControls from '../../components/admin/ExportControls';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const getTopicName = (nameData) => {
    if (!nameData) return 'N/A';
    if (typeof nameData === 'string') return nameData;
    if (Array.isArray(nameData)) {
        const idName = nameData.find(n => n.lang === 'id');
        if (idName) return idName.value;
        return nameData.length > 0 ? nameData[0].value : 'N/A';
    }
    return 'N/A';
};

const createGradient = (ctx, area, colorStart, colorEnd) => {
    const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);
    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(1, colorEnd);
    return gradient;
};

const StatisticsPage = () => {
    const { user } = useAuth();
    // 2. Buat referensi untuk setiap grafik
    const visitorChartRef = useRef(null);
    const topicChartRef = useRef(null);

    const [stats, setStats] = useState({
        totalVisitors: 0,
        visitorDistribution: [],
        favoriteTopic: {},
        topicDistribution: [],
        mostfrequentcity: {}
    });
    const [filters, setFilters] = useState({
        visitorsPeriod: 'monthly',
        topicPeriod: 'monthly',
        cityPeriod: 'monthly',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        if (!user?.token) return;
        setIsLoading(true);
        try {
            const data = await getDashboardData(filters, user.token);
            setStats(data);
            setError(null);
        } catch (err) {
            setError('Gagal memuat data statistik.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [user, filters]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const visitorChartData = {
        labels: stats.visitorDistribution?.map(d => d.label) || [],
        datasets: [{
            label: 'Total Kunjungan',
            data: stats.visitorDistribution?.map(d => d.count) || [],
            backgroundColor: (context) => {
                const { ctx, chartArea } = context.chart;
                if (!chartArea) return null;
                const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim();
                const colorWithCommas = primaryColor.replace(/ /g, ',');
                return createGradient(ctx, chartArea, `rgba(${colorWithCommas}, 0.2)`, `rgba(${colorWithCommas}, 0.8)`);
            },
            borderColor: (context) => {
                const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim();
                const colorWithCommas = primaryColor.replace(/ /g, ',');
                return `rgba(${colorWithCommas}, 1)`;
            },
            borderWidth: 1,
            borderRadius: 8,
        }],
    };

    const topicChartData = {
        labels: stats.topicDistribution?.map(d => getTopicName(d.name)) || [],
        datasets: [{
            label: 'Jumlah Kunjungan',
            data: stats.topicDistribution?.map(d => d.count) || [],
            backgroundColor: (context) => {
                const { ctx, chartArea } = context.chart;
                if (!chartArea) return null;
                const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim();
                const colorWithCommas = accentColor.replace(/ /g, ',');
                return createGradient(ctx, chartArea, `rgba(${colorWithCommas}, 0.2)`, `rgba(${colorWithCommas}, 0.8)`);
            },
            borderColor: (context) => {
                const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim();
                const colorWithCommas = accentColor.replace(/ /g, ',');
                return `rgba(${colorWithCommas}, 1)`;
            },
            borderWidth: 1,
            borderRadius: 8,
        }],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { display: false },
                ticks: {
                    color: 'rgb(var(--color-text-secondary))',
                    precision: 0, 
                }
            },
            x: {
                grid: { display: false },
                ticks: { 
                    color: 'rgb(var(--color-text-secondary))',
                }
            },
        },
    };

    if (isLoading) return <LoadingIndicator />;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div>
            <PageHeader title="Statistik Pengguna">
                {/* 3. Kirim referensi sebagai props */}
                <ExportControls 
                    statsData={stats} 
                    filters={filters}
                    visitorChartRef={visitorChartRef}
                    topicChartRef={topicChartRef}
                />
            </PageHeader>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Card Total Kunjungan */}
                <div className="bg-background-secondary p-6 rounded-xl shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-text">Total Kunjungan Pengguna</h3>
                        <select name="visitorsPeriod" value={filters.visitorsPeriod} onChange={handleFilterChange} className="bg-background text-text-secondary rounded-lg px-3 py-1 text-sm">
                            <option value="daily">Harian</option>
                            <option value="weekly">Mingguan</option>
                            <option value="monthly">Bulanan</option>
                            <option value="yearly">Tahunan</option>
                        </select>
                    </div>
                    <p className="text-5xl font-bold text-text">{stats.totalVisitors.toLocaleString('id-ID')}</p>
                    <div className="mt-4 h-60">
                        {/* 4. Terapkan referensi ke komponen Bar */}
                        <Bar ref={visitorChartRef} options={chartOptions} data={visitorChartData} />
                    </div>
                </div>

                {/* Card Topik Favorit */}
                <div className="bg-background-secondary p-6 rounded-xl shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-text">Topik Favorit</h3>
                         <select name="topicPeriod" value={filters.topicPeriod} onChange={handleFilterChange} className="bg-background text-text-secondary rounded-lg px-3 py-1 text-sm">
                            <option value="daily">Harian</option>
                            <option value="weekly">Mingguan</option>
                            <option value="monthly">Bulanan</option>
                            <option value="yearly">Tahunan</option>
                        </select>
                    </div>
                    <p className="text-5xl font-bold text-text">{getTopicName(stats.favoriteTopic?.name)}</p>
                     <div className="mt-4 h-60">
                        {/* 4. Terapkan referensi ke komponen Bar */}
                        <Bar ref={topicChartRef} options={chartOptions} data={topicChartData} />
                    </div>
                </div>

                {/* Card Asal Domisili */}
                <div className="bg-background-secondary p-6 rounded-xl shadow-md lg:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-text">Asal Domisili Terbanyak</h3>
                        <select name="cityPeriod" value={filters.cityPeriod} onChange={handleFilterChange} className="bg-background text-text-secondary rounded-lg px-3 py-1 text-sm">
                            <option value="daily">Harian</option>
                            <option value="weekly">Mingguan</option>
                            <option value="monthly">Bulanan</option>
                            <option value="yearly">Tahunan</option>
                        </select>
                    </div>
                    <p className="text-2xl font-semibold text-text-secondary capitalize">{stats.mostfrequentcity?.name || 'N/A'}</p>
                    <p className="text-5xl font-bold text-text">{stats.mostfrequentcity?.count?.toLocaleString('id-ID') || 0}</p>
                </div>
            </div>
        </div>
    );
};

export default StatisticsPage;