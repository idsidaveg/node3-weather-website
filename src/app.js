// documentation can be found at express.js.com

const path = require('path');
const express = require('express');
const hbs = require('hbs');

const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

console.log(__dirname);
console.log(path.join(__dirname, '../public'));

const app = express();
const port = process.env.PORT || 3000;

// define paths for Express config
const publicDirectory = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath); // where the partials are

// setup static directory to serve
app.use(express.static(publicDirectory));

// set up a route for the home page, this will use handlebars
app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather',
    name: 'Dave Galligher',
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Me',
    name: 'Dave Galligher',
  });
});

app.get('/help', (req, res) => {
  res.render('help', {
    message: 'Press reboot to restart the computer',
    title: 'Help',
    name: 'Dave Galligher',
  });
});

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: 'You must provide an address!',
    });
  }

  let message;
  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }

      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({ error });
        }

        res.send({
          forecast: forecastData,
          location,
          address: req.query.address,
        });
      });
    }
  );
});

app.get('/products', (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: 'You must provide a search term',
    });
  }

  console.log(req.query.search);
  res.send({
    products: [],
  });
});

app.get('/help/*', (req, res) => {
  res.render('404', {
    title: '404 Help',
    name: 'Dave Galligher',
    errorMessage: 'Help article not found',
  });
});

// this will be the 404
app.get('*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'Dave Galligher',
    errorMessage: 'Page not found',
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
});
