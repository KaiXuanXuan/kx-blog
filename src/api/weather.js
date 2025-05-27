import axios from 'axios';

const apiKey = '4540ed3711484d12afe877f726d41b8c';

const getWeatherData = async (longitude, latitude) => {
  const apiUrl = `https://m346gywa63.re.qweatherapi.com/v7/weather/now`;
  try {
    const response = await axios.get(apiUrl, {
      params: {
        lang: 'zh',
        unit: 'm',
        location: `${longitude},${latitude}`,
        key: apiKey,  
      },
      headers: {
        'X-QW-Api-Key': apiKey,
      },
    });
    return response.data;
  } catch (error) {
    console.error('获取天气数据时出错:', error);
    return null;
  }
};

const getWeatherReport = async (longitude, latitude) => {
  const apiUrl = 'https://m346gywa63.re.qweatherapi.com/v7/weather/3d'
  try {
    const response = await axios.get(apiUrl, {
      params: {
        lang: 'zh',
        unit:'m',
        location: `${longitude},${latitude}`,
        key: apiKey,
      },
      headers: {
        'X-QW-Api-Key': apiKey,
      },
    });
    return response.data;
  } catch (error) {
    console.error('获取天气预报时出错:', error);
    return null;
  }
}

export { getWeatherData, getWeatherReport };
