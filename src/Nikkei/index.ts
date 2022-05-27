// 日経

import type { Request, Response } from 'express';
import puppeteer from 'puppeteer';
import { verifyGcpOidcTokenForCloudScheduler } from '../helpers/verifyGcpOidcTokenForCloudScheduler';
import { isDevelopment } from '../utils';
import { runPage } from './runPage';

const aiUrl = 'https://www.nikkei.com/technology/ai/';
const driverlessUrl = 'https://www.nikkei.com/technology/driverless/';
const fintechUrl = 'https://www.nikkei.com/financial/fintech/';
const internertUrl = 'https://www.nikkei.com/business/internet/';
const kinyuKeizaiUrl = 'https://www.nikkei.com/financial/monetary-policy/';
const ecoUrl = 'https://www.nikkei.com/economy/economic/';
const monetaryUrl = 'https://www.nikkei.com/financial/monetary/';
const polUrl = 'https://www.nikkei.com/politics/politics/';
const serveiceUrl = 'https://www.nikkei.com/business/services/';
const startupUrl = 'https://www.nikkei.com/business/startups/';

export const scrapeNikkei = async (req: Request, res: Response) => {
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
    // runPage({ url: aiUrl, genre: 'TECHNOLOGY', browser }),
    // runPage({ url: driverlessUrl, genre: 'TECHNOLOGY', browser }),
    // runPage({ url: fintechUrl, genre: 'ECONOMY', browser }),
    // runPage({ url: internertUrl, genre: 'BUSINESS', browser }),
    // runPage({ url: kinyuKeizaiUrl, genre: 'ECONOMY', browser }),
    // runPage({ url: ecoUrl, genre: 'ECONOMY', browser }),
    // runPage({ url: monetaryUrl, genre: 'ECONOMY', browser }),
    runPage({ url: polUrl, genre: 'POLITICS', browser }),
    // runPage({ url: serveiceUrl, genre: 'BUSINESS', browser }),
    // runPage({ url: startupUrl, genre: 'BUSINESS', browser }),
  ]);

  await browser.close();

  res.sendStatus(200);

  return;
};
