// 時事通信社

import type { Request, Response } from 'express';
import { verifyGcpOidcTokenForCloudScheduler } from '../helpers/verifyGcpOidcTokenForCloudScheduler';
import { isDevelopment } from '../utils';
import { scrape } from './scrape';

const polUrl = 'https://www.jiji.com/jc/c?g=pol';
const ecoUrl = 'https://www.jiji.com/jc/c?g=eco';

export const scrapeJiji = async (req: Request, res: Response) => {
  if (!isDevelopment) {
    const verificationResult = await verifyGcpOidcTokenForCloudScheduler(
      req,
      res
    );

    if (!verificationResult) {
      return;
    }
  }

  await scrape({ url: polUrl, genre: 'POLITICS' });
  await scrape({ url: ecoUrl, genre: 'ECONOMY' });

  res.sendStatus(200);
};
