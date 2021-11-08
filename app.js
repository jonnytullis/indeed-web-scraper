const axios = require('axios');
const HTMLParser = require('node-html-parser');

function getRandomUserAgent() {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 12_0_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 15_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/95.0.4638.50 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.50 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 10; LM-Q720) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.50 Mobile Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:94.0) Gecko/20100101 Firefox/94.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 12.0; rv:94.0) Gecko/20100101 Firefox/94.0',
    'Mozilla/5.0 (X11; Linux i686; rv:94.0) Gecko/20100101 Firefox/94.0',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/39.0 Mobile/15E148 Safari/605.1.15'
  ]

  let random_number = Math.floor(Math.random() * userAgents.length);
  return userAgents[random_number];
}

function getRandomCompany() {
  const companies = ['apple', 'microsoft', 'amazon', 'taco bell', 'family dollar', 'starbucks',
    'ally bank', 'fed ex', '7-eleven', 'uber', 'lyft', 'kfc', 'mcdonalds', 'northrop', 'state farm',
    'geico', 'dunkin donuts', 'sonic', 'walmart', 'target', 'alorica', 'wells fargo', 'ups', 'macys',
    'chase', 'autozone', 'vivian', 'walgreens', 'cvs', 'kroger', 'sprouts', 'winn dixie', 'publix',
    'safeway', 'albertsons', 'meijer', 'fresh thyme market'];

  const rand_index = Math.floor(Math.random() * companies.length);
  return companies[rand_index];
}

function getIndeedRequest() {
  // See https://proxy.webshare.io/proxy/rotating?
  const username = '';
  const password = '';

  const proxy = {
    host: 'p.webshare.io',
    port: 80,
    auth: { username, password }
  };

  const url = `https://www.indeed.com/companies/search?q=${getRandomCompany()}`;
  const options = {
    proxy,
    headers: {
      'User-Agent': getRandomUserAgent()
    }
  }

  try {
    return axios.get(url, options);
  } catch (e) {
    console.log("Error scraping site, please try again");
    return null;
  }
}

async function testLargeLoadScrape() {
  const requests = [];
  for (let i = 0; i < 200; i++) {
    requests.push(getIndeedRequest());
    await new Promise((resolve) => setTimeout(resolve, 500)); // Wait 500ms
  }

  const responses = await Promise.allSettled(requests);

  responses.forEach((res) => {
    if (res.status === 'fulfilled' && res.value?.data) {
      const root = HTMLParser.parse(res.value.data);
      const textEl = root.querySelector('#main > div > div.css-1aehwuu-Box.eu4oa1w0 > section > h2');
      console.log('TEXT:', textEl?.text);
    } else {
      console.log('FAILED', res.reason?.response?.statusText)
    }
  })
}

testLargeLoadScrape();
