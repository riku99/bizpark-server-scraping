import axios from 'axios';
import { parse } from 'date-fns';
import puppeteer from 'puppeteer';
import { newsProvider } from '../constants';
import { NewsGenre } from '../types';

export const scrape = async ({
  url,
  genre,
}: {
  url: string;
  genre: NewsGenre;
}) => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });

  const page = await browser.newPage();
  await page.goto(url);

  const topLinkSelector = 'div.CategoryTopPhoto a';
  const topLinkElem = await page.waitForSelector(topLinkSelector);

  if (topLinkElem) {
    await topLinkElem.click();
    await page.waitForNavigation();

    let articleCreatedAt: Date | undefined;
    let title: string | undefined;
    let image: string | undefined;

    const dateElem = await page.$('p.ArticleTitleData');
    if (dateElem) {
      const dateStr = await (
        await dateElem.getProperty('textContent')
      ).jsonValue();

      if (typeof dateStr === 'string') {
        articleCreatedAt = parse(dateStr, 'yyyy年MM月dd日HH時mm分', new Date());
      }
    }

    const titleElem = await page.$('div.ArticleTitle h1');
    if (titleElem) {
      const titleStr = await (
        await titleElem.getProperty('textContent')
      ).jsonValue();

      if (typeof titleStr === 'string') {
        title = titleStr;
      }
    }

    const imageElem = await page.$('div.ArticleFigureWrapper img');
    if (imageElem) {
      const imageUrl = await (
        await imageElem.getProperty('currentSrc')
      ).jsonValue();

      if (typeof imageUrl === 'string') {
        image = imageUrl;
      }
    }

    const link = page.url();

    if (title && link) {
      try {
        const data = {
          title,
          link,
          articleCreatedAt,
          image,
          genre,
          provider: newsProvider.jiji,
        };

        await axios.post(process.env.NEWS_SAVE_ENDPOINT as string, data, {
          headers: {
            Authorization: `Bearer ${process.env.NEWS_SAVE_ENDPOINT_ACCESS_TOKEN}`,
          },
        });

        console.log('作成されるデータ ↓');
        console.log(JSON.stringify(data));
      } catch (e) {
        console.log(e);
      }
    }
  }

  await browser.close();
};
