// weatherstack.com user: idsidaveg@gmail.com

const request = require('request');

const forecast = (latitude, longitude, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=a95c4d514899d7b85003632bc1156998&query=${latitude},${longitude}&units=f`;
  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback('Unable to connect to weather service.', undefined);
    } else if (body.error) {
      callback('Unable to find location', undefined);
    } else {
      data = {
        message: `${body.current.weather_descriptions[0]}. It is currently ${body.current.temperature} degres out. It feels like ${body.current.feelslike} degrees out.`,
      };
      callback(undefined, data);
    }
  });
};

module.exports = forecast;
