import React from 'react';
import {
  Chart,
  Line,
  Area,
  VerticalAxis,
  HorizontalAxis,
  Tooltip,
} from 'react-native-responsive-linechart';
import COLORS from '../../const/colors';
import FONTS from '../../const/fonts';
import formatPrice from '../../helper/formatPrice';
const CustomChart = ({dataList, style, label}) => {
  const oneHourInMilSec = 3600 * 1000;
  const oneDayInMillSec = oneHourInMilSec * 24;
  const sevenDaysInMilSec = oneDayInMillSec * 7;
  const startingSpikeTime = new Date().getTime() - sevenDaysInMilSec;

  const chartData = dataList?.map((data, index) => {
    return {
      y: data,
      x: startingSpikeTime + (index + 1) * oneHourInMilSec,
    };
  });

  return (
    dataList && (
      <Chart
        style={style}
        data={chartData}
        padding={{
          left: label ? 60 : 0,
          top: label ? 20 : 0,
          bottom: label ? 30 : 0,
        }}>
        <Line
          tooltipComponent={
            label && (
              <Tooltip
                theme={{
                  label: {color: COLORS.dark},
                  shape: {color: COLORS.white, width: 80, height: 25},
                  formatter: value => formatPrice(value.y),
                }}
              />
            )
          }
          smoothing={'bezier'}
          theme={{
            stroke: {color: COLORS.orange, width: 1},
          }}
        />
        {label && (
          <VerticalAxis
            tickCount={5}
            theme={{
              labels: {
                formatter: v => formatPrice(v),
                visible: true,
                label: {
                  color: COLORS.white,
                  fontSize: 8,
                  fontFamily: FONTS.regular,
                },
              },
              axis: {
                visible: false,
              },
              ticks: {
                visible: false,
              },
              grid: {visible: false},
            }}
          />
        )}
        {label && (
          <Area
            theme={{
              gradient: {
                from: {color: COLORS.orange, opacity: 0.2},
                to: {color: COLORS.orange, opacity: 0.02},
              },
            }}
          />
        )}
        {label && (
          <HorizontalAxis
            tickCount={5}
            theme={{
              labels: {
                formatter: date => {
                  const newDate = new Date(date);
                  const formatterDate = `${newDate.getDate()}/${
                    newDate.getMonth() + 1
                  }/${newDate.getFullYear() + 1} `;

                  return formatterDate;
                },

                visible: true,
                label: {
                  color: COLORS.white,
                  fontSize: 8,
                  fontFamily: FONTS.regular,
                  textAnchor: 'end',
                },
              },
              axis: {
                visible: true,
              },
              ticks: {
                visible: false,
              },
              grid: {visible: false},
            }}
          />
        )}
      </Chart>
    )
  );
};

export default CustomChart;
