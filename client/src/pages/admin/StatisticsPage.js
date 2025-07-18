import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getDashboardData } from '../../services/dashboardService';
import PageHeader from '../../components/ui/PageHeader';
import LoadingIndicator from '../../components/ui/LoadingIndicator';

// Import Chart.js dan komponennya
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

// Daftarkan komponen Chart.js yang akan digunakan
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// --- PERBAIKAN 1: Tambahkan fungsi helper ---
// Fungsi ini akan mengekstrak nama topik yang benar dari array
const getTopicName = (nameData) => {
    if (!nameData) return 'N/A';
    // Jika nameData adalah string (untuk data lama/sederhana), kembalikan langsung
    if (typeof nameData === 'string') return nameData;
    // Jika ini adalah array, cari yang bahasa Indonesia atau ambil yang pertama
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
        mostFrequentInstitution: {}
    });
    const [filters, setFilters] = useState({
        visitorsPeriod: 'monthly',
        topicPeriod: 'monthly',
        institutionPeriod: 'monthly',
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
        // --- PERBAIKAN 2: Gunakan helper di sini juga untuk label grafik ---
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
                grid: {
                    display: false,
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
    };

    if (isLoading) return <LoadingIndicator />;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div>
            <PageHeader title="Statistik Pengguna" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Card Total Kunjungan */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-700">Total Kunjungan Pengguna</h3>
                        <select name="visitorsPeriod" value={filters.visitorsPeriod} onChange={handleFilterChange} className="bg-gray-100 rounded-lg px-3 py-1 text-sm">
                            <option value="daily">Harian</option>
                            <option value="monthly">Bulanan</option>
                            <option value="yearly">Tahunan</option>
                        </select>
                    </div>
                    <p className="text-5xl font-bold text-gray-800">{stats.totalVisitors.toLocaleString('id-ID')}</p>
                    <div className="mt-4 h-40">
                        <Bar options={chartOptions} data={visitorChartData} />
                    </div>
                </div>

                {/* Card Topik Favorit */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-700">Topik Favorit Bulan Ini</h3>
                         <select name="topicPeriod" value={filters.topicPeriod} onChange={handleFilterChange} className="bg-gray-100 rounded-lg px-3 py-1 text-sm">
                            <option value="monthly">Bulanan</option>
                            <option value="yearly">Tahunan</option>
                        </select>
                    </div>
                    {/* --- PERBAIKAN 3: Gunakan helper untuk menampilkan nama topik --- */}
                    <p className="text-5xl font-bold text-gray-800">{getTopicName(stats.favoriteTopic?.name)}</p>
                     <div className="mt-4 h-40">
                        <Bar options={chartOptions} data={topicChartData} />
                    </div>
                </div>

                {/* Card Asal Instansi */}
                <div className="bg-white p-6 rounded-xl shadow-md lg:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-700">Asal Instansi Terbanyak</h3>
                        <select name="institutionPeriod" value={filters.institutionPeriod} onChange={handleFilterChange} className="bg-gray-100 rounded-lg px-3 py-1 text-sm">
                            <option value="daily">Harian</option>
                            <option value="monthly">Bulanan</option>
                            <option value="yearly">Tahunan</option>
                        </select>
                    </div>
                    <p className="text-2xl font-semibold text-gray-600 capitalize">{stats.mostFrequentInstitution?.name || 'N/A'}</p>
                    <p className="text-5xl font-bold text-gray-800">{stats.mostFrequentInstitution?.count?.toLocaleString('id-ID') || 0}</p>
                </div>
            </div>
        </div>
    );
};

export default StatisticsPage;