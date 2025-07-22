import React, { useState, useEffect, useCallback } from 'react';
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

const StatisticsPage = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalVisitors: 0,
        visitorDistribution: [],
        favoriteTopic: {},
        topicDistribution: [],
        mostFrequentcity: {} 
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
            backgroundColor: '#A3BFFA',
            borderRadius: 8,
        }],
    };

    const topicChartData = {
        labels: stats.topicDistribution?.map(d => getTopicName(d.name)) || [],
        datasets: [{
            label: 'Jumlah Kunjungan',
            data: stats.topicDistribution?.map(d => d.count) || [],
            backgroundColor: '#FBD38D',
            borderRadius: 8,
        }],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { display: false },
                ticks: { color: '#6b7280' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#6b7280' }
            },
        },
    };

    if (isLoading) return <LoadingIndicator />;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div>
            <PageHeader title="Statistik Pengguna">
                <ExportControls statsData={stats} filters={filters} />
            </PageHeader>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Card Total Kunjungan */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-700 dark:text-gray-300">Total Kunjungan Pengguna</h3>
                        <select name="visitorsPeriod" value={filters.visitorsPeriod} onChange={handleFilterChange} className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded-lg px-3 py-1 text-sm">
                            <option value="daily">Harian</option>
                            <option value="weekly">Mingguan</option>
                            <option value="monthly">Bulanan</option>
                            <option value="yearly">Tahunan</option>
                        </select>
                    </div>
                    <p className="text-5xl font-bold text-gray-800 dark:text-white">{stats.totalVisitors.toLocaleString('id-ID')}</p>
                    <div className="mt-4 h-40">
                        <Bar options={chartOptions} data={visitorChartData} />
                    </div>
                </div>

                {/* Card Topik Favorit */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-700 dark:text-gray-300">Topik Favorit</h3>
                         <select name="topicPeriod" value={filters.topicPeriod} onChange={handleFilterChange} className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded-lg px-3 py-1 text-sm">
                            <option value="daily">Harian</option>
                            <option value="weekly">Mingguan</option>
                            <option value="monthly">Bulanan</option>
                            <option value="yearly">Tahunan</option>
                        </select>
                    </div>
                    <p className="text-5xl font-bold text-gray-800 dark:text-white">{getTopicName(stats.favoriteTopic?.name)}</p>
                     <div className="mt-4 h-40">
                        <Bar options={chartOptions} data={topicChartData} />
                    </div>
                </div>

                {/* Card Asal Domisili */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md lg:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-700 dark:text-gray-300">Asal Domisili Terbanyak</h3>
                        <select name="cityPeriod" value={filters.cityPeriod} onChange={handleFilterChange} className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded-lg px-3 py-1 text-sm">
                            <option value="daily">Harian</option>
                            <option value="weekly">Mingguan</option>
                            <option value="monthly">Bulanan</option>
                            <option value="yearly">Tahunan</option>
                        </select>
                    </div>
                    {/* --- PERBAIKAN 2: Gunakan key yang benar dari state (semua huruf kecil) --- */}
                    <p className="text-2xl font-semibold text-gray-600 dark:text-gray-400 capitalize">{stats.mostFrequentcity?.name || 'N/A'}</p>
                    <p className="text-5xl font-bold text-gray-800 dark:text-white">{stats.mostFrequentcity?.count?.toLocaleString('id-ID') || 0}</p>
                </div>
            </div>
        </div>
    );
};

export default StatisticsPage;