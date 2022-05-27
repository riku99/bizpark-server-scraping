// ロイター

import type { Request, Response } from 'express';
import puppeteer from 'puppeteer';
import { verifyGcpOidcTokenForCloudScheduler } from '../helpers/verifyGcpOidcTokenForCloudScheduler';
import { isDevelopment } from '../utils';
import { runPage } from './runPage';

const bitcoinUrl = 'https://jp.reuters.com/news/technology/bitcoin';
const bizUrl = 'https://jp.reuters.com/news/business';
const gloEcoUrl = 'https://jp.reuters.com/news/global-economy';
const polUrl = 'https://jp.reuters.com/news/politics';
const techUrl = 'https://jp.reuters.com/news/technology';

export const scrapeReuters = async (req: Request, res: Response) => {
  if (!isDevelopment) {
    const verificationResult = await verifyGcpOidcTokenForCloudScheduler(
      req,
      res
    );

    if (!verificationResult) {
      return;
    }
  }

  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
  });

  await Promise.all([
    runPage({
      url: bitcoinUrl,
      genre: 'ECONOMY',
      topSelectorType: 'section',
      browser,
    }),
    runPage({ url: bizUrl, genre: 'BUSINESS', browser }),
    runPage({ url: gloEcoUrl, genre: 'ECONOMY', browser }),
    runPage({
      url: polUrl,
      genre: 'POLITICS',
      topSelectorType: 'section',
      browser,
    }),
    runPage({ url: techUrl, genre: 'TECHNOLOGY', browser }),
  ]);

  await browser.close();

  res.sendStatus(200);

  return;
};

// const run = async () => {
//   const browser = await puppeteer.launch({
//     args: ['--no-sandbox'],
//   });

//   await Promise.all([
//     runPage({
//       url: bitcoinUrl,
//       genre: 'ECONOMY',
//       topSelectorType: 'section',
//       browser,
//     }),
//     runPage({ url: bizUrl, genre: 'BUSINESS', browser }),
//     runPage({ url: gloEcoUrl, genre: 'ECONOMY', browser }),
//     runPage({
//       url: polUrl,
//       genre: 'POLITICS',
//       topSelectorType: 'section',
//       browser,
//     }),
//     runPage({ url: techUrl, genre: 'TECHNOLOGY', browser }),
//   ]);

//   await browser.close();
// };

// run();
