import type { Request, Response } from 'express';
import puppeteer from 'puppeteer';
import { verifyGcpOidcTokenForCloudScheduler } from '../helpers/verifyGcpOidcTokenForCloudScheduler';
import { isDevelopment } from '../utils';
import { runPage } from './runPage';

const bussinessUrl = 'https://www.businessinsider.jp/business/';

export const scrapeBusinessInsider = async (req: Request, res: Response) => {
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
      url: bussinessUrl,
      genre: 'BUSINESS',
      browser,
    }),
  ]);

  await browser.close();

  res.sendStatus(200);

  return;
};
