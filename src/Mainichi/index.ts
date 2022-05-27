// 毎日新聞

import type { Request, Response } from 'express';
import puppeteer from 'puppeteer';
import { verifyGcpOidcTokenForCloudScheduler } from '../helpers/verifyGcpOidcTokenForCloudScheduler';
import { isDevelopment } from '../utils';
import { runPage } from './scrape';

const bizUrl = 'https://mainichi.jp/enterprise';
const polUrl = 'https://mainichi.jp/seiji/';
const stockUrl = 'https://mainichi.jp/stock/';

export const scrapeMainichi = async (req: Request, res: Response) => {
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
    runPage({ url: bizUrl, genre: 'BUSINESS', browser }),
    runPage({ url: polUrl, genre: 'POLITICS', browser }),
    runPage({ url: stockUrl, genre: 'ECONOMY', browser }),
  ]);

  await browser.close();
  res.sendStatus(200);
};
