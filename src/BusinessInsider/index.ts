import puppeteer from 'puppeteer';
import { runPage } from './runPage';

const bussinessUrl = 'https://www.businessinsider.jp/business/';
const l = 'https://www.businessinsider.jp/post-255836';

const run = async () => {
  const browser = await puppeteer.launch();

  await Promise.all([
    runPage({
      url: bussinessUrl,
      genre: 'BUSINESS',
      browser,
    }),
  ]);

  await browser.close();
};

run();
