var NSEAPI = require('./service/API');
var merge = require('lodash/merge');


/**
 * Returns market status
 * true => market Close
 * false => market Open
 * @returns {boolean}
 */
async function getMarketStatus() {
  const data = await NSEAPI.getMarketStatus();
  return data;
}


/**
 * API returning indices list
 * @returns {*}
 */
async function getIndices() {
  const data = await NSEAPI.getIndices();
  return data;
}


/**
 * Return list of companies with their sector name
 * [{
      sector: "NIFTY IT ", //Sector name
      symbol: "TRIGYN", //company symbol
      PE: "0", // Symbol P/E value
      date: "08-Jun-2018 06:45:10", // last date
      sectorPE: "19.53" // Sectoral Index P/E value
    }],
 * @returns {array}
 */
async function getSectorsList() {
  let data = await NSEAPI.getSectorsList();
  return data;
}


async function getQuotes(symbol) {
  let data = await NSEAPI.getQuotes(symbol);
  return data;
}


/**
 * Get info about a stock
 * @param symbol {string} symbol of company
 *
 * @returns {object}
 */
async function getQuoteInfo(symbol) {
  let data = await NSEAPI.getQuoteInfo(symbol);
  return data;
}


/**
 * Get List of Gainers
 * @returns {*}
 */
async function getGainers() {
  let data = await NSEAPI.getGainers();
  return data;
}


/**
 * Get List of Losers
 * @returns {*}
 */
async function getLosers() {
  let data = await NSEAPI.getLosers();
  return data;
}


/**
 * Get Incline and Decline values
 * @returns {*}
 */
async function getInclineDecline() {
  let data = await NSEAPI.getInclineDecline();
  return data;
}


/**
 * Return stocks list for specified index slug
 * @param slug
 * @returns {*}
 */
async function getIndexStocks(slug) {
  let data = await NSEAPI.getIndexStocks(slug);
  return data;
}


/**
 * Intra-day Stocks data
 * @param symbol = stock symbol
 * @param time [1, 5, 15, 30, 60, 'week', 'month', 'year'] minutes
 * @returns {*}
 */
async function getIntraDayData(symbol, time) {
  let data = await NSEAPI.getIntraDayData(symbol, time);
  return data;
}


/**
 * Chart Data for Stocks and indexs
 * @param symbol = stock symbol
 * @param time [1, 5, 15, 30, 60, 'week', 'month', 'year'] minutes
 * @returns {*}
 */
async function getChartDataNew(symbol, time) {
  let data = await NSEAPI.getChartDataNew(symbol, time);
  return data;
}


/**
 * Search NSE Stocks by symbol or name
 * @param symbol {string} min 3 chars
 * @returns {[{name, symbol]}
 */
async function searchStocks(symbol) {
  let data = await NSEAPI.searchStocks(symbol);
  return data;
}


/**
 * Get Stock Futures Data
 * @param symbol
 * @param expiryDate
 * @param isIndex {boolean}
 * @returns {*}
 */
async function getStockFuturesData(symbol, expiryDate, isIndex) {
  let data = await NSEAPI.getStockFuturesData(symbol, expiryDate, isIndex);
  return data;
}


async function get52WeekHigh() {
  let data = await NSEAPI.get52WeekHigh();
  return data;
}


async function get52WeekLow() {
  let data = await NSEAPI.get52WeekLow();
  return data;
}


async function getTopValueStocks() {
  let data = await NSEAPI.getTopValueStocks();
  return data;
}


async function getTopVolumeStocks() {
  let data = await NSEAPI.getTopVolumeStocks();
  return data;
}


var nse = {
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
  searchStocks: searchStocks,
  getStockFuturesData: getStockFuturesData,
  get52WeekHigh: get52WeekHigh,
  get52WeekLow: get52WeekLow,
  getTopValueStocks: getTopValueStocks,
  getTopVolumeStocks: getTopVolumeStocks,
  getChartDataNew: getChartDataNew
};

module.exports = nse;
