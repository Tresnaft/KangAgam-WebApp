import React, { useState, useEffect, useCallback, useRef } from 'react';
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
    const visitorChartRef = useRef(null);
    const topicChartRef = useRef(null);
    const uniqueVisitorChartRef = useRef(null);
    const cityChartRef = useRef(null);

    const [stats, setStats] = useState({
        totalVisitors: 0,
        totalUniqueVisitors: 0,
        visitorDistribution: [],
        uniqueVisitorDistribution: [],
        favoriteTopic: {},
        topicDistribution: [],
        cityDistribution: [],
        mostfrequentcity: {}
    });
    const [filters, setFilters] = useState({
        visitorsPeriod: 'monthly',
        topicPeriod: 'monthly',
        cityPeriod: 'monthly',
    });
    // ✅ 1. Tambahkan state terpisah untuk loading awal dan loading saat filter
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        if (!user?.token) return;
        setIsFetching(true); // Tampilkan loading di dalam kartu
        try {
            const data = await getDashboardData(filters, user.token);
            setStats(data);
            setError(null);
        } catch (err) {
            setError('Gagal memuat data statistik.');
            console.error(err);
        } finally {
            setIsInitialLoading(false); // Sembunyikan loading halaman penuh
            setIsFetching(false); // Sembunyikan loading di dalam kartu
        }
    }, [user, filters]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // ... (Konfigurasi Chart Data tetap sama)
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

    const uniqueVisitorChartData = {
        labels: stats.uniqueVisitorDistribution?.map(d => d.label) || [],
        datasets: [{
            label: 'Pengunjung Unik',
            data: stats.uniqueVisitorDistribution?.map(d => d.count) || [],
            backgroundColor: (context) => {
                const { ctx, chartArea } = context.chart;
                if (!chartArea) return null;
                const secondaryColor = '16, 185, 129';
                return createGradient(ctx, chartArea, `rgba(${secondaryColor}, 0.2)`, `rgba(${secondaryColor}, 0.8)`);
            },
            borderColor: 'rgb(16, 185, 129)',
            borderWidth: 1,
            borderRadius: 8,
        }],
    };

    const cityChartData = {
        labels: stats.cityDistribution?.map(d => d.label) || [],
        datasets: [{
            label: 'Jumlah Pengunjung',
            data: stats.cityDistribution?.map(d => d.count) || [],
            backgroundColor: (context) => {
                const { ctx, chartArea } = context.chart;
                if (!chartArea) return null;
                const purpleColor = '168, 85, 247';
                return createGradient(ctx, chartArea, `rgba(${purpleColor}, 0.2)`, `rgba(${purpleColor}, 0.8)`);
            },
            borderColor: 'rgb(168, 85, 247)',
            borderWidth: 1,
            borderRadius: 8,
        }],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: { beginAtZero: true, grid: { display: false }, ticks: { color: 'rgb(var(--color-text-secondary))', precision: 0 } },
            x: { grid: { display: false }, ticks: { color: 'rgb(var(--color-text-secondary))' } },
        },
    };

    const mostFrequentCityName = stats.cityDistribution && stats.cityDistribution.length > 0
        ? stats.cityDistribution[0].label
        : 'N/A';

    // ✅ 2. Tampilkan loading halaman penuh hanya saat pertama kali
    if (isInitialLoading) return <div className="flex items-center justify-center h-96"><LoadingIndicator /></div>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div>
            <PageHeader title="Statistik Pengguna">
                <ExportControls 
                    statsData={stats} 
                    filters={filters}
                    visitorChartRef={visitorChartRef}
                    topicChartRef={topicChartRef}
                    uniqueVisitorChartRef={uniqueVisitorChartRef}
                    cityChartRef={cityChartRef}
                />
            </PageHeader>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* ✅ 3. Terapkan loading di dalam setiap kartu */}
                {/* Card Total Kunjungan */}
                <div className="bg-background-secondary p-6 rounded-xl shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-text">Total Kunjungan</h3>
                        <select name="visitorsPeriod" value={filters.visitorsPeriod} onChange={handleFilterChange} className="bg-background text-text-secondary rounded-lg px-3 py-1 text-sm">
                            <option value="daily">Harian</option>
                            <option value="weekly">Mingguan</option>
                            <option value="monthly">Bulanan</option>
                            <option value="yearly">Tahunan</option>
                        </select>
                    </div>
                    {isFetching ? (
                        <div className="h-72 flex items-center justify-center"><LoadingIndicator /></div>
                    ) : (
                        <>
                            <p className="text-5xl font-bold text-text">{stats.totalVisitors.toLocaleString('id-ID')}</p>
                            <div className="mt-4 h-60">
                                <Bar ref={visitorChartRef} options={chartOptions} data={visitorChartData} />
                            </div>
                        </>
                    )}
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
                    {isFetching ? (
                        <div className="h-72 flex items-center justify-center"><LoadingIndicator /></div>
                    ) : (
                        <>
                            <p className="text-3xl font-bold text-text">{getTopicName(stats.favoriteTopic?.name)}</p>
                             <div className="mt-4 h-60">
                                <Bar ref={topicChartRef} options={chartOptions} data={topicChartData} />
                            </div>
                        </>
                    )}
                </div>

                {/* Card Pengunjung Unik */}
                <div className="bg-background-secondary p-6 rounded-xl shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-text">Pengunjung Unik</h3>
                        <select name="visitorsPeriod" value={filters.visitorsPeriod} onChange={handleFilterChange} className="bg-background text-text-secondary rounded-lg px-3 py-1 text-sm">
                            <option value="daily">Harian</option>
                            <option value="weekly">Mingguan</option>
                            <option value="monthly">Bulanan</option>
                            <option value="yearly">Tahunan</option>
                        </select>
                    </div>
                    {isFetching ? (
                        <div className="h-72 flex items-center justify-center"><LoadingIndicator /></div>
                    ) : (
                        <>
                            <p className="text-5xl font-bold text-text">{stats.totalUniqueVisitors.toLocaleString('id-ID')}</p>
                            <div className="mt-4 h-60">
                                <Bar ref={uniqueVisitorChartRef} options={chartOptions} data={uniqueVisitorChartData} />
                            </div>
                        </>
                    )}
                </div>

                {/* Card Asal Domisili */}
                <div className="bg-background-secondary p-6 rounded-xl shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-text">Domisili Pengunjung Aktif</h3>
                        <select name="cityPeriod" value={filters.cityPeriod} onChange={handleFilterChange} className="bg-background text-text-secondary rounded-lg px-3 py-1 text-sm">
                            <option value="daily">Harian</option>
                            <option value="weekly">Mingguan</option>
                            <option value="monthly">Bulanan</option>
                            <option value="yearly">Tahunan</option>
                        </select>
                    </div>
                    {isFetching ? (
                        <div className="h-72 flex items-center justify-center"><LoadingIndicator /></div>
                    ) : (
                        <>
                            <p className="text-3xl font-bold text-text capitalize">{mostFrequentCityName}</p>
                            <div className="mt-4 h-60">
                                <Bar ref={cityChartRef} options={chartOptions} data={cityChartData} />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StatisticsPage;