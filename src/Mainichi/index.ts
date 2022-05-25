// 毎日新聞

import type { Request, Response } from 'express';
import { verifyGcpOidcTokenForCloudScheduler } from '../helpers/verifyGcpOidcTokenForCloudScheduler';
import { isDevelopment } from '../utils';
import { scrape } from './scrape';

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

  await scrape({ url: bizUrl, genre: 'BUSINESS' });
  await scrape({ url: polUrl, genre: 'POLITICS' });
  await scrape({ url: stockUrl, genre: 'ECONOMY' });

  res.sendStatus(200);
};
