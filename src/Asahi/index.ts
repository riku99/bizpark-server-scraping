import puppeteer from 'puppeteer';
import { runPage } from './runPage';

const economicPolicyUrl =
  'https://www.asahi.com/politics/list/economicpolicy.html?iref=pc_gnavi'; // 経済政策

const r = async () => {
  const browser = await puppeteer.launch();

  await Promise.all([
    runPage({
      url: economicPolicyUrl,
      genre: 'ECONOMY',
      browser,
    }),
  ]);

  await browser.close();
};

r();
