import type { Request, Response } from 'express';
import puppeteer from 'puppeteer';
import { verifyGcpOidcTokenForCloudScheduler } from '../helpers/verifyGcpOidcTokenForCloudScheduler';
import { isDevelopment } from '../utils';
import { runPage } from './runPage';

const economicPolicyUrl =
  'https://www.asahi.com/politics/list/economicpolicy.html?iref=pc_gnavi'; // 経済政策
const financeUrl =
  'https://www.asahi.com/business/list/finance.html?iref=pc_gnavi'; // 金融財政
const governmentUrl =
  'https://www.asahi.com/politics/list/government.html?iref=pc_gnavi'; // 国政
const diplomacyUrl =
  'https://www.asahi.com/politics/list/diplomacy.html?iref=pc_gnavi'; // 外交
const senkyoUrl = 'https://www.asahi.com/senkyo/?iref=pc_gnavi'; // 選挙

export const scrapeAsahi = async (req: Request, res: Response) => {
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
      url: economicPolicyUrl,
      genre: 'ECONOMY',
      browser,
    }),
    runPage({
      url: financeUrl,
      genre: 'ECONOMY',
      browser,
    }),
    runPage({
      url: governmentUrl,
      genre: 'POLITICS',
      browser,
    }),
    runPage({
      url: diplomacyUrl,
      genre: 'POLITICS',
      browser,
    }),
    runPage({
      url: senkyoUrl,
      genre: 'POLITICS',
      browser,
    }),
  ]);

  await browser.close();

  res.sendStatus(200);

  return;
};
