var axios = require('axios');

var csv2Json = require('../../utils/csv2Json');

var MARKET_STATUS_URL = require('../constant').MARKET_STATUS_URL;
var INDICES_WATCH_URL = require('../constant').INDICES_WATCH_URL;
var SECTORS_LIST = require('../constant').SECTORS_LIST;
var QUOTE_INFO_URL = require('../constant').QUOTE_INFO_URL;
var GET_QUOTE_URL = require('../constant').GET_QUOTE_URL;
var GAINERS_URL = require('../constant').GAINERS_URL;
var LOSERS_URL = require('../constant').LOSERS_URL;
var ADVANCES_DECLINES_URL = require('../constant').ADVANCES_DECLINES_URL;
var INDEX_STOCKS_URL = require('../constant').INDEX_STOCKS_URL;
var INTRADAY_URL = require('../constant').INTRADAY_URL;
var INDEX_CHARTDATA_URL = require('../constant').INDEX_CHARTDATA_URL;
var SEARCH_URL = require('../constant').SEARCH_URL;
var STOCK_OPTIONS_URL = require('../constant').STOCK_OPTIONS_URL;
var YEAR_HIGH_URL = require('../constant').YEAR_HIGH_URL;
var YEAR_LOW_URL = require('../constant').YEAR_LOW_URL;
var TOP_VALUE_URL = require('../constant').TOP_VALUE_URL;
var TOP_VOLUME_URL = require('../constant').TOP_VOLUME_URL;
var NEW_CHART_DATA_URL = require('../constant').NEW_CHART_DATA_URL;

function getTime(periodType, time) {
  if (periodType === 1) {
    switch (time) {
      case 'week':
        return 2;
      case 'month':
        return 3;
      case 'year':
        return 1;
      default:
        return 2;
    }
  } else {
    switch (time) {
      case 1:
        return 1;
      case 5:
        return 2;
      case 15:
        return 3;
      case 30:
        return 4;
      case 60:
        return 5;
      default:
        return 1;
    }
  }
}

function stripTags(string) {
  return string.replace(/<(.|\n)*?>/g, '').trim();
}

function searchTransformer(isIndex) {
  var matcher = '';
  if (isIndex) {
    matcher = /underlying=(.*?)&/;
  } else {
    matcher = /symbol=(.*?)&/;
  }

  return function (data) {
    var matches = data.match(/<li>(.*?)<\/li>/g);
    return matches.map(function (value1) {
      var symbol = value1.match(matcher);
      value1 = stripTags(value1).replace(symbol[1], '');
      return {
        name: value1 || '',
        symbol: symbol[1] || ''
      }
    });
  }
}

function axiosCSV(url) {
  return axios.get(url, {
    transformResponse: function (data) {
      return csv2Json(data);
    }
  });
}

async function getMarketStatus() {
  let data = await axios.get(MARKET_STATUS_URL);
  data = data.data.NormalMktStatus;
  const resp = {
    status: data,
  }
  return resp;
}

async function getIndices() {
  const data = await axios.get(INDICES_WATCH_URL);
  return data.data.data;
}

function getSectorsList() {
  return axios.get(SECTORS_LIST);
}

async function getQuotes(symbol) {
  let data = await axios.get(GET_QUOTE_URL + encodeURIComponent(symbol),
    {
      headers: {
        Referer: GET_QUOTE_URL + encodeURIComponent(symbol),
        'X-Requested-With': 'XMLHttpRequest'
      }
    }
  );
  return data.data;
}

async function getQuoteInfo(symbol) {
  let data = await axios.get(QUOTE_INFO_URL + encodeURIComponent(symbol), {
    headers: {
      Referer: GET_QUOTE_URL + encodeURIComponent(symbol),
      'X-Requested-With': 'XMLHttpRequest'
    }
  });
  return data.data;
}

async function getGainers() {
  let data = await axios.get(GAINERS_URL);
  return data.data;
}

async function getLosers() {
  let data = await axios.get(LOSERS_URL);
  return data.data;
}

async function getInclineDecline() {
  let data = await axios.get(ADVANCES_DECLINES_URL);
  return data.data;
}

async function getIndexStocks(slug) {
  let data = await axios.get(INDEX_STOCKS_URL + encodeURI(slug) + 'StockWatch.json');
  return data.data;
}

async function getIntraDayData(symbol, time) {
  var periodType = typeof time === 'string' ? 1 : 2;
  var period = getTime(periodType, time);

  let data = await axios.get(INTRADAY_URL + encodeURIComponent(symbol) + '&Periodicity=' + period + '&PeriodType=' + periodType);
  return data.data;
}

async function getChartDataNew(symbol, time) {
  var periodType = typeof time === 'string' ? 1 : 2;
  var period = getTime(periodType, time);

  let data = await axios.post(NEW_CHART_DATA_URL,
    `Instrument=FUTSTK&CDSymbol=${symbol}&Segment=CM&Series=EQ&CDExpiryMonth=1&FOExpiryMonth=1&IRFExpiryMonth=&CDIntraExpiryMonth=&FOIntraExpiryMonth=&IRFIntraExpiryMonth=&CDDate1=&CDDate2=&PeriodType=${periodType}&Periodicity=${period}&ct0=g1|1|1&ct1=g2|2|1&ctcount=2&time=${new Date().getTime()}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Host: 'nseindia.com',
        Referer: 'https://nseindia.com/ChartApp/install/charts/mainpage.jsp'
      }
    }
  );
  return data.data;
}

async function getIndexChartData(symbol, time) {
  var periodType = typeof time === 'string' ? 1 : 2;
  var period = getTime(periodType, time);

  let data = await axios.get(INDEX_CHARTDATA_URL + encodeURIComponent(symbol) + '&Periodicity=' + period + '&PeriodType=' + periodType);
  return data.data;
}

async function searchStocks(searchString) {
  var options = {
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Referer': 'https://www.nseindia.com/ChartApp/install/charts/mainpage.jsp',
      Host: 'www.nseindia.com'
    },
    transformResponse: searchTransformer(false)
  };

  let data = await axios.get(SEARCH_URL + encodeURIComponent(searchString), options);
  return data.data;
}

async function getStockFuturesData(symbol, expiryDate, isIndex) {
  var params = {
    'underlying': symbol,
    'instrument': 'FUTSTK',
    'expiry': expiryDate,
    'type': 'SELECT',
    'strike': 'SELECT'
  };


  if (isIndex === true) {
    params['instrument'] = 'FUTIDX';
  }

  let data = await axios({
    method: 'GET',
    url: STOCK_OPTIONS_URL,
    params: params,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      Host: 'www.nseindia.com',
      'Referer': 'https://nseindia.com/live_market/dynaContent/live_watch/get_quote/GetQuoteFO.jsp?underlying=' + symbol + '&instrument=' + params['instrument'] + '&type=SELECT&strike=SELECT&expiry=' + expiryDate,
    }
  });
  return data.data;
}

async function get52WeekHigh() {
  let data = await axios.get(YEAR_HIGH_URL);
  return data.data;
}

async function get52WeekLow() {
  let data = await axios(YEAR_LOW_URL);
  return data.data;
}

async function getTopValueStocks() {
  let data = await axios(TOP_VALUE_URL);
  return data.data;
}

async function getTopVolumeStocks() {
  let data = await axios(TOP_VOLUME_URL);
  return data.data;
}

var NSEAPI = {
  getMarketStatus: getMarketStatus,
  getIndices: getIndices,
  getSectorsList: getSectorsList,
  getQuotes: getQuotes,
  getQuoteInfo: getQuoteInfo,
  getGainers: getGainers,
  getLosers: getLosers,
  getInclineDecline: getInclineDecline,
  getIndexStocks: getIndexStocks,
  getIntraDayData: getIntraDayData,
  getIndexChartData: getIndexChartData,
  searchStocks: searchStocks,
  getStockFuturesData: getStockFuturesData,
  get52WeekHigh: get52WeekHigh,
  get52WeekLow: get52WeekLow,
  getTopValueStocks: getTopValueStocks,
  getTopVolumeStocks: getTopVolumeStocks,
  getChartDataNew: getChartDataNew
};

module.exports = NSEAPI;
