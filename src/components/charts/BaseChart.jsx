import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './BaseChart.css'
import * as anychart from 'anychart';
import ChartsColor from "./ChartsColor.jsx";

const BaseChart = ({ selectedValue, selectedValue2, selectedValue3 }) => {

  const chartContainerRef = useRef(null);
  const [error, setError] = useState('');
  const [lastPoints, setLastPoints] = useState(null);
  const [ lastPrice, setLastPrice] = useState([]);
  const [ timeStamp, setTimeStamp] = useState();
  const [ exchange, setExchange] = useState([]);

  const lastPoint = async (token) => {
    try {
        const response = await axios.get('http://localhost:7001/last_point', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

      if (response.status === 200) {
          const pointsInfo = response.data;
          setLastPoints(pointsInfo);

          if (pointsInfo.length > 0) {
            const lastPoints = pointsInfo[0].last_points; // Получаем объект last_points из первого элемента

            Object.keys(lastPoints).forEach(key => {

                const point = lastPoints[key]; //Значение по ключу

                console.log(`${key}:`); //ключ (биржа?)
                console.log(`High: ${point.high}`)
                console.log(`Last Price: ${point.last_price}`);
                console.log(`Low: ${point.low}`);
                console.log(`ID: ${point.id}`);
                console.log(`Timestamp: ${point.ts}`);
                console.log('---------------------------------');

                setExchange(prev => [...prev, key]);
                setLastPrice(prev => [...prev, (point.last_price / 100).toFixed(2) ]);

                const normalDate = new Date(point.ts);
                // normalDate.setSeconds(normalDate.getSeconds() - 30);
                // normalDate.toLocaleString();
                console.log('TimeStamp', normalDate);

                setTimeStamp(normalDate);
                console.log("Updated lastPrice:", lastPrice);
            });
          }
        }
    } catch (error) {
        console.error('Ошибка обращения:', error);
        setError('Ошибка обращения.');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      lastPoint(token);
    }
  }, []);

  const isTooltipVisible = (index, dataLength) => {
    return index === dataLength - 2; // Условие для предпоследней точки
  };


  useEffect(() => {


    const getData2 = () => {
      if (lastPrice.length === 0) return [];
      // let forExample = Date.parse(timeStamp)/1000
      const forExample = timeStamp.toLocaleString();
      return [
        [timeStamp - 30, lastPrice[0], lastPrice[1], lastPrice[2]],
        [
          timeStamp - 20,
          lastPrice[0] - 100,
          lastPrice[1] - 100,
          lastPrice[2] - 100,
        ],
        [
          timeStamp - 10,
          lastPrice[0] + 100,
          lastPrice[1] + 100,
          lastPrice[2] + 100,
        ],
        [forExample, lastPrice[0], lastPrice[1], lastPrice[2]],
        [timeStamp + 10, null, null, null], // линия прерывается
      ];
    }


    if (lastPoints) {

    const dataSet = anychart.data.set(getData2());

    const firstSeriesData = dataSet.mapAs({ x: 0, value: 1 });
    const secondSeriesData = dataSet.mapAs({ x: 0, value: 2 });
    const thirdSeriesData = dataSet.mapAs({ x: 0, value: 3 });

    const chart = anychart.line();
    chart.animation(true);
    chart.padding([10, 20, 5, 20]);
    chart.crosshair().enabled(true).yLabel(false).yStroke(null);
    chart.tooltip()
      .positionMode('point')
      .displayMode("separated")

    chart.title('Линейный график');
    chart.yAxis().title('Prices');
    chart.xAxis().labels().padding(5);
    chart.background().fill('#000000');

    var firstSeries = chart.line(firstSeriesData);
    firstSeries.name(exchange[0]);
    firstSeries.color(selectedValue === 'Green' ? '#2A5757' : selectedValue === 'Purple' ? '#781E79' : '#796E1E');
    firstSeries.hovered().markers().enabled(true).type('circle').size(3);
    firstSeries
    .tooltip()
    .position('right')
    .anchor('left-center')
      .offsetX(5)
      .offsetY(5);

  // create second series with mapped data
  var secondSeries = chart.line(secondSeriesData);
  secondSeries.name(exchange[1]);
  secondSeries.color(selectedValue2 === 'Green' ? '#2A5757' : selectedValue2 === 'Purple' ? '#781E79' : '#796E1E'); //изменяем цвет
  secondSeries.hovered().markers().enabled(true).type('circle').size(3);
  secondSeries
    .tooltip()
    .position('right')
    .anchor('left-center')
    .offsetX(5)
    .offsetY(5);

  // create third series with mapped data
  var thirdSeries = chart.line(thirdSeriesData);
  thirdSeries.name(exchange[2]);
  thirdSeries.color(selectedValue3 === 'Green' ? '#2A5757' : selectedValue3 === 'Purple' ? '#781E79' : '#796E1E')
  thirdSeries.hovered().markers().enabled(true).type('circle').size(3);
  thirdSeries
    .tooltip()
    .position('right')
    .enabled(true)
    .displayMode('by-value')
    .anchor('left-center')
    .offsetX(5)
    .offsetY(5);

    const data = getData2();
    const dataLength = data.length;

    firstSeries.tooltip()
      .useHtml(true)
      .title(false)
      .separator(false)
      .enabled(true)
      .displayMode('by-value')
      .format((point) => {
        const index = point.index; //Берем текущий индекс поинта
        if (isTooltipVisible(index, dataLength)) {
            const maxLastPrice = Math.max(...lastPrice); // Учитываем max из lastPrice
            return `
            <div class="firstSeries" style="background-color: ${selectedValue === 'Green' ? '#2A5757' : selectedValue === 'Purple' ? '#781E79' : '#796E1E'}; color: black; border-radius: 5px; padding: 5px 10px; text-align: center;">
                <span>${lastPrice[0] >= maxLastPrice ?
                    lastPrice[0] :
                    '-' + (100 - ((lastPrice[0]) * 100 / maxLastPrice)).toFixed(2) + '%'}</span>
            </div>
            `;
        }
        return '';
    });

    var tooltip = firstSeries.tooltip();
    tooltip.hideDelay(Infinity);

    var tooltip2 = secondSeries.tooltip();
    tooltip2.hideDelay(Infinity);

    var tooltip3 = thirdSeries.tooltip();
    tooltip3.hideDelay(Infinity);

    secondSeries.tooltip()
      .useHtml(true)
      .separator(false)
      .enabled(true)
      .displayMode('by-value')
      .title(false)
      .format((point) => {
        const index = point.index;
        if (isTooltipVisible(index, dataLength)) {
            const maxLastPrice = Math.max(...lastPrice);
            return `
            <div class="secondSeries" style="background: ${selectedValue2 === 'Green' ? '#2A5757' : selectedValue2 === 'Purple' ? '#781E79' : '#796E1E'}; color: black; border-radius: 5px; padding: 5px 10px; text-align: center;">
                <span>${lastPrice[1] >= maxLastPrice ?
                    lastPrice[1] :
                    '-' + (100 - ((lastPrice[1]) * 100 / maxLastPrice)).toFixed(2) + '%'}</span>
            </div>
            `;
        }
        return '';
    });

    thirdSeries.tooltip()
      .useHtml(true)
      .title(false)
      .separator(false)
      .enabled(true)
      .displayMode('by-value')
      .format((point) => {
        const index = point.index;
        if (isTooltipVisible(index, dataLength)) {
            const maxLastPrice = Math.max(...lastPrice);
            return `
            <div class="thirdSeries" style="background: ${selectedValue3 === 'Green' ? '#2A5757' : selectedValue3 === 'Purple' ? '#781E79' : '#796E1E'}; color: black; border-radius: 5px; padding: 5px 10px; text-align: center;">
                <span>${lastPrice[2] >= maxLastPrice ?
                    lastPrice[2] :
                    '-' + (100 - ((lastPrice[2]) * 100 / maxLastPrice)).toFixed(2) + '%'}</span>
            </div>
            `;
        }
        return '';
    });

    chart.listenOnce('chartDraw', function () {
      const lastIndex = Math.max(0, dataLength - 2); // Индекс предпоследней точки

      // Выделяем предпоследние точки в каждой серии
      firstSeries.hover([lastIndex]);
      secondSeries.hover([lastIndex]);
      thirdSeries.hover([lastIndex]);

      setTimeout(() => {
        firstSeries.unhover();
        secondSeries.unhover();
        thirdSeries.unhover();
      }, 1000);
    });


    function simulateHover(series, index) {
      series.hover(index);
      setTimeout(() => {
        series.unhover(); // Снимаем наведение через 1 секунду
      }, 1000);
    }

    chart.listenOnce('chartDraw', function () {
      const lastIndex = Math.max(0, dataLength - 2);

      simulateHover(firstSeries, lastIndex);
      simulateHover(secondSeries, lastIndex);
      simulateHover(thirdSeries, lastIndex);

    });

    chart.legend().enabled(true).fontSize(15).padding([0, 0, 10, 0]);
    if (chartContainerRef.current) {
      chart.container(chartContainerRef.current);
      chart.draw();
    }

    return () => {
      chart.dispose(); // Важно очистить ресурсы AnyChart
    };

  }
  }, [lastPrice, lastPoints, selectedValue, selectedValue2, selectedValue3]);

  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{ width: '1136px', height: '500px'}} ref={chartContainerRef} />

    </div>
  );
};

export default BaseChart;
