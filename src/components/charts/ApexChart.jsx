import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import './ApexChart.css';
import axios from "axios";

const ApexChart = ({ selectedValue, selectedValue2, selectedValue3 }) => {

  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLastPoints = async (token) => {
    try {
      const response = await axios.get("http://localhost:7001/last_point", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const pointsInfo = response.data;

        if (pointsInfo.length > 0) {

          const lastPoints = pointsInfo[0].last_points;
          const seriesData = [];
          const annotations = [];
          const categories = [];
          const colors = ["#796E1E", "#2A5757", "#781E79"];

          const lastPrices = Object.values(lastPoints).map(point => point.last_price / 100);
          const maxLastPrice = Math.max(...lastPrices);

          Object.keys(lastPoints).forEach((key, index) => {
            const point = lastPoints[key];

            const lastPrice = (point.last_price / 100).toFixed(2);
            const timeStamp = new Date(point.ts).toLocaleString();

            const randomPoints = [
              lastPrice + 300,
              lastPrice + 200,
              lastPrice + 100,
              lastPrice,
              null, // Прерываем линию
            ];

            seriesData.push({
              name: key, // Название биржи
              type: "line",
              data: randomPoints,
            });

            categories.push(
              new Date(point.ts - 30000).toLocaleString(),
              new Date(point.ts - 20000).toLocaleString(),
              new Date(point.ts - 10000).toLocaleString(),
              timeStamp,
              " "
            );

            const annotationColor = (index % 3 === 0) ? (selectedValue === 'Green' ? '#2A5757' : selectedValue === 'Purple' ? '#781E79' : '#796E1E') :
            (index % 3 === 1) ? (selectedValue2 === 'Green' ? '#2A5757' : selectedValue2 === 'Purple' ? '#781E79' : '#796E1E') :
            (selectedValue3 === 'Green' ? '#2A5757' : selectedValue3 === 'Purple' ? '#781E79' : '#796E1E');

            annotations.push({
              x: categories[3],
              y: parseFloat(lastPrice),
              marker: {
                size: 3,
                fillColor: annotationColor,
              },
              yaxis: [{
                borderWidth: 5,
                strokeDashArray: 0,
                borderColor: '#000',
                fillColor: '#888888',
                width: '120%',
                cssClass: 'apexchartAnnotation222',
              }],
              label: {
                borderColor: colors[index % colors.length],
                style: {
                  color: "#fff",
                  background: annotationColor,
                  borderRadius: '5px',
                  fontSize: '10px',
                  width: '70px',
                  height: '12px',
                  textAlign: 'center',
                  cssClass: 'apexchartAnnotation',
                },
                text: `${lastPrice >= maxLastPrice ?
                  lastPrice :
                  '-' + (100 - ((lastPrice) * 100 / maxLastPrice)).toFixed(2) + '%'}`,
              },
            });
          });

          setChartData({
            series: seriesData,
            options: {
              chart: {
                height: 500,
                width: 1136,
                type: "line",
                zoom: { enabled: false },
                background: "#000000",
                toolbar: {
                  show: false,
                },
              },
              title: {
                text: "Chart",
                align: "left",
              },
              stroke: { curve: "straight" },
              annotations: { points: annotations }, // Все аннотации
              colors: [(selectedValue === 'Green' ? '#2A5757' : selectedValue === 'Purple' ? '#781E79' : '#796E1E'), (selectedValue2 === 'Green' ? '#2A5757' : selectedValue2 === 'Purple' ? '#781E79' : '#796E1E'), (selectedValue3 === 'Green' ? '#2A5757' : selectedValue3 === 'Purple' ? '#781E79' : '#796E1E')], // Цвета линий
              xaxis: {
                categories: categories,
                labels: {
                  style : {
                    colors: '#555555',
                  },
                },
              },
              yaxis: {
                categories: categories,
                labels: {
                  style : {
                    colors: '#555555',
                  },
                },
              },
              grid: {
                  borderColor: "#555555",
                row: {
                  colors: ["transparent"], opacity: 0.5,
                },
              },
              dataLabels: {
                style: {
                  colors: ['#F44336', '#E91E63', '#9C27B0']
                }
              },
              markers: {
                colors: ['#F44336', '#E91E63', '#9C27B0']
              },
              tooltip: {
                enabled: false,
              },
            },
          });
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Ошибка:", error);
      setError("Ошибка загрузки данных.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      fetchLastPoints(token);
    }
  }, [selectedValue, selectedValue2, selectedValue3]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div id="chart">
      {chartData && (
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="line"
          width={1136}
          height={500}
        />
      )}
    </div>
  );
};

export default ApexChart;


