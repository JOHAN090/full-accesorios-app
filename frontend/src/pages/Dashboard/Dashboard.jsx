import React, { useState, useEffect } from 'react';
import { HiOutlineCube, HiOutlineCollection, HiOutlineExclamation, HiOutlineCurrencyDollar, HiOutlineDocumentDownload } from 'react-icons/hi';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { toast } from 'react-toastify';
import productosService from '../../services/productosService';
import categoriasService from '../../services/categoriasService';
import reportesService from '../../services/reportesService';
import './Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    lowStock: 0,
    totalValue: 0,
  });
  const [chartData, setChartData] = useState(null);
  const [topProductsData, setTopProductsData] = useState(null);
  const [offersData, setOffersData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          productosService.getAll({ limit: 1000 }),
          categoriasService.getAll(),
        ]);

        const prodData = prodRes.data;
        const catData = catRes.data;
        const productos = prodData.data || prodData || [];
        const categorias = catData.data || catData || [];
        const prodArray = Array.isArray(productos) ? productos : [];
        const catArray = Array.isArray(categorias) ? categorias : [];

        // Calculate stats
        const lowStock = prodArray.filter((p) => p.stock <= 5 && p.stock > 0).length;
        const totalValue = prodArray.reduce((sum, p) => sum + (Number(p.precio) * Number(p.stock)), 0);

        setStats({
          totalProducts: prodArray.length,
          totalCategories: catArray.length,
          lowStock,
          totalValue,
        });

        // Chart data - products per category
        const catCounts = {};
        catArray.forEach((cat) => {
          catCounts[cat.nombre] = 0;
        });
        prodArray.forEach((prod) => {
          const catName = prod.categoria?.nombre || prod.categoria_nombre || 'Sin categoría';
          catCounts[catName] = (catCounts[catName] || 0) + 1;
        });

        setChartData({
          labels: Object.keys(catCounts),
          datasets: [
            {
              label: 'Cantidad de Productos',
              data: Object.values(catCounts),
              backgroundColor: [
                'rgba(124, 58, 237, 0.8)',
                'rgba(167, 139, 250, 0.8)',
                'rgba(192, 132, 252, 0.8)',
                'rgba(139, 92, 246, 0.8)',
                'rgba(109, 40, 217, 0.8)',
              ],
              borderWidth: 0,
              borderRadius: 6,
            },
          ],
        });

        // Top 5 most expensive products
        const sortedProducts = [...prodArray].sort((a, b) => Number(b.precio) - Number(a.precio)).slice(0, 5);
        setTopProductsData({
          labels: sortedProducts.map(p => p.nombre.length > 20 ? p.nombre.substring(0, 20) + '...' : p.nombre),
          datasets: [{
            label: 'Precio (Bs)',
            data: sortedProducts.map(p => Number(p.precio)),
            backgroundColor: 'rgba(16, 185, 129, 0.8)',
            borderRadius: 4,
          }]
        });

        // Offers distribution (doughnut)
        const onOffer = prodArray.filter(p => p.en_oferta).length;
        const regular = prodArray.length - onOffer;
        setOffersData({
          labels: ['En Oferta', 'Precio Regular'],
          datasets: [{
            data: [onOffer, regular],
            backgroundColor: ['rgba(245, 158, 11, 0.8)', 'rgba(59, 130, 246, 0.8)'],
            borderWidth: 0,
            hoverOffset: 4
          }]
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      await reportesService.downloadInventarioPDF();
      toast.success('Reporte descargado exitosamente');
    } catch (error) {
      toast.error('Error al descargar el reporte');
      console.error(error);
    } finally {
      setDownloading(false);
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Productos por Categoría',
        color: '#a78bfa',
        font: {
          size: 16,
          weight: '700',
          family: 'Inter',
        },
        padding: { bottom: 20 },
      },
      tooltip: {
        backgroundColor: 'rgba(26, 26, 46, 0.95)',
        titleColor: '#fffffe',
        bodyColor: '#a1a1aa',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        titleFont: { family: 'Inter', weight: '600' },
        bodyFont: { family: 'Inter' },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#71717a',
          font: { family: 'Inter', size: 12 },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.04)',
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#71717a',
          font: { family: 'Inter', size: 12 },
          stepSize: 1,
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.04)',
        },
      },
    },
  };

  const topProductsOptions = {
    ...chartOptions,
    indexAxis: 'y',
    plugins: {
      ...chartOptions.plugins,
      title: { ...chartOptions.plugins.title, text: 'Top 5 Productos Más Caros', color: '#10b981' }
    }
  };

  const offersOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: { ...chartOptions.plugins.title, text: 'Distribución de Ofertas', color: '#f59e0b' },
      legend: { display: true, position: 'bottom', labels: { color: '#a1a1aa', font: { family: 'Inter' } } }
    },
    scales: {}
  };

  const statCards = [
    {
      icon: <HiOutlineCube />,
      label: 'Total Productos',
      value: stats.totalProducts,
      color: '#7c3aed',
    },
    {
      icon: <HiOutlineCollection />,
      label: 'Categorías',
      value: stats.totalCategories,
      color: '#a78bfa',
    },
    {
      icon: <HiOutlineExclamation />,
      label: 'Stock Bajo',
      value: stats.lowStock,
      color: '#f59e0b',
    },
    {
      icon: <HiOutlineCurrencyDollar />,
      label: 'Valor Total',
      value: `Bs. ${stats.totalValue.toFixed(2)}`,
      color: '#10b981',
    },
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p className="loading-text">Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page" id="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Resumen general de tu tienda</p>
        </div>
        <button
          className="btn btn-primary"
          id="dashboard-download-pdf"
          onClick={handleDownloadPDF}
          disabled={downloading}
        >
          <HiOutlineDocumentDownload />
          {downloading ? 'Descargando...' : 'Descargar Reporte'}
        </button>
      </div>

      {/* Stats */}
      <div className="dashboard-stats">
        {statCards.map((stat, index) => (
          <div key={index} className="dashboard-stat-card glass-card" id={`stat-card-${index}`}>
            <div className="dashboard-stat-icon" style={{ color: stat.color, backgroundColor: `${stat.color}15` }}>
              {stat.icon}
            </div>
            <div className="dashboard-stat-info">
              <span className="dashboard-stat-value">{stat.value}</span>
              <span className="dashboard-stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="dashboard-charts-grid">
        <div className="dashboard-chart glass-card">
          {chartData && (
            <div className="dashboard-chart-wrapper">
              <Bar data={chartData} options={chartOptions} />
            </div>
          )}
        </div>
        
        <div className="dashboard-chart glass-card">
          {topProductsData && (
            <div className="dashboard-chart-wrapper">
              <Bar data={topProductsData} options={topProductsOptions} />
            </div>
          )}
        </div>
        
        <div className="dashboard-chart glass-card">
          {offersData && (
            <div className="dashboard-chart-wrapper">
              <Doughnut data={offersData} options={offersOptions} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
