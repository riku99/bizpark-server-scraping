import type { Request, Response } from 'express';
import { verifyGcpOidcTokenForCloudScheduler } from '../helpers/verifyGcpOidcTokenForCloudScheduler';
import { isDevelopment } from '../utils';
import { scrape } from './scrape';

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

  await scrape({ url: 'https://www.jiji.com/jc/c?g=pol', genre: 'POLITICS' });

  res.sendStatus(200);
};
