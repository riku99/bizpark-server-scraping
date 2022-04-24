import type { Request, Response } from 'express';
import { verifyGcpOidcTokenForCloudScheduler } from '../helpers/verifyGcpOidcTokenForCloudScheduler';
import { isDevelopment } from '../utils';
import { scrape } from './scrape';

const polUrl = 'https://www.jiji.com/jc/c?g=pol';

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

  res.sendStatus(200);
};
