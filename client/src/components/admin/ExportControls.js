import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

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

// 1. Terima referensi grafik sebagai props
const ExportControls = ({ statsData, filters, visitorChartRef, topicChartRef }) => {
    const [isExporting, setIsExporting] = useState(false);

    const getFormattedDate = () => {
        const date = new Date();
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    const exportToExcel = () => {
        // Logika Excel tetap sama, tidak ada perubahan
        const wb = XLSX.utils.book_new();
        const summaryData = [
            ["Laporan Statistik Kang Agam", ""],
            ["Tanggal Ekspor", getFormattedDate()],
            [],
            ["Statistik Utama", "Nilai"],
            ["Total Kunjungan", statsData.totalVisitors],
            ["Topik Favorit", getTopicName(statsData.favoriteTopic?.name)],
            ["Domisili Terbanyak", statsData.mostfrequentcity?.name || 'N/A'],
        ];
        const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, wsSummary, "Ringkasan");
        const topicData = (statsData.topicDistribution || []).map(topic => ({
            "Nama Topik": getTopicName(topic.name),
            "Jumlah Kunjungan": topic.count,
        }));
        const wsTopics = XLSX.utils.json_to_sheet(topicData);
        XLSX.utils.book_append_sheet(wb, wsTopics, "Distribusi Topik");
        XLSX.writeFile(wb, `Statistik_KangAgam_${getFormattedDate()}.xlsx`);
    };

    const exportToPdf = () => {
        const doc = new jsPDF();
        const periodText = filters.visitorsPeriod.charAt(0).toUpperCase() + filters.visitorsPeriod.slice(1);

        doc.setFontSize(18);
        doc.text("Laporan Statistik Kang Agam", 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Periode Laporan: ${periodText}`, 14, 30);
        doc.text(`Tanggal Ekspor: ${getFormattedDate()}`, 14, 36);

        autoTable(doc, {
            startY: 50,
            head: [['Statistik Utama', 'Nilai']],
            body: [
                ['Total Kunjungan', statsData.totalVisitors],
                ['Topik Favorit', getTopicName(statsData.favoriteTopic?.name)],
                ['Domisili Terbanyak', statsData.mostfrequentcity?.name || 'N/A'],
            ],
            theme: 'grid',
        });
        
        // --- PERBAIKAN: Tambahkan grafik ke PDF ---
        doc.addPage();
        doc.setFontSize(14);
        doc.text("Visualisasi Data", 14, 22);

        // 2. Ambil gambar dari referensi grafik kunjungan
        if (visitorChartRef.current) {
            const visitorChartImg = visitorChartRef.current.toBase64Image();
            doc.setFontSize(11);
            doc.text("Grafik Total Kunjungan", 14, 35);
            doc.addImage(visitorChartImg, 'PNG', 14, 40, 180, 90); // (gambar, format, x, y, width, height)
        }

        // 3. Ambil gambar dari referensi grafik topik
        if (topicChartRef.current) {
            const topicChartImg = topicChartRef.current.toBase64Image();
            doc.setFontSize(11);
            doc.text("Grafik Topik Favorit", 14, 145);
            doc.addImage(topicChartImg, 'PNG', 14, 150, 180, 90);
        }
        // ------------------------------------------

        doc.save(`Statistik_KangAgam_${getFormattedDate()}.pdf`);
    };

    const handleExport = (format) => {
        setIsExporting(true);
        if (format === 'pdf') {
            exportToPdf();
        } else if (format === 'excel') {
            exportToExcel();
        }
        setTimeout(() => setIsExporting(false), 1000);
    };

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={() => handleExport('pdf')}
                disabled={isExporting}
                className="bg-red-500 text-white font-bold px-4 py-2 rounded-lg text-sm hover:bg-red-600 disabled:opacity-50"
            >
                {isExporting ? 'Memproses...' : 'Export PDF'}
            </button>
            <button
                onClick={() => handleExport('excel')}
                disabled={isExporting}
                className="bg-green-500 text-white font-bold px-4 py-2 rounded-lg text-sm hover:bg-green-600 disabled:opacity-50"
            >
                {isExporting ? 'Memproses...' : 'Export Excel'}
            </button>
        </div>
    );
};

export default ExportControls;