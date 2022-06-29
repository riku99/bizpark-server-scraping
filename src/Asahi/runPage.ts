import { parse } from 'date-fns';
import puppeteer from 'puppeteer';
import { newsProvider } from '../constants';
import { postToNewsSaveEndpoint } from '../helpers/postToNewsSaveEndpoint';
import { NewsGenre } from '../types';

const getArticleCreatedAt = async ({ page }: { page: puppeteer.Page }) => {
  const dateElem = await page.$('div.mhPng time');

  if (!dateElem) {
    return;
  }

  const dateStr = (await (
    await dateElem.getProperty('textContent')
  ).jsonValue()) as string;

  if (!dateStr) {
    return;
  }

  const date = parse(dateStr, 'yyyy年MM月dd日 HH時mm分', new Date());
  return date;
};

const getTitle = async ({ page }: { page: puppeteer.Page }) => {
  const titleElem = await page.$('div.y_Qv3 h1');

  if (!titleElem) {
    return;
  }

  const title = await (await titleElem.getProperty('textContent')).jsonValue();

  return title;
};

const getImage = async ({ page }: { page: puppeteer.Page }) => {
  const imageElem = await page.$('div.w8Bsl img');

  if (!imageElem) {
    return;
  }

  const image = await (await imageElem.getProperty('currentSrc')).jsonValue();

  console.log(image);

  return image;
};

export const runPage = async ({
  url,
  genre,
  browser,
}: {
  url: string;
  genre: NewsGenre;
  browser: puppeteer.Browser;
}) => {
  try {
    const page = await browser.newPage();
    await page.goto(url);

    const topLinkElem = await page.waitForSelector('ul.List a');

    if (!topLinkElem) {
      return;
    }

    const keyElem = await topLinkElem.$('span.KeyGold');

    if (keyElem) {
      return;
    }

    await topLinkElem.click();
    await page.waitForNavigation();

    const [articleCreatedAt, title, image] = await Promise.all([
      getArticleCreatedAt({ page }),
      getTitle({ page }),
      getImage({ page }),
    ]);

    const link = page.url();

    if (title && link) {
      const data = {
        title,
        link,
        articleCreatedAt,
        image,
        genre,
        provider: newsProvider.asahi,
      };

      await postToNewsSaveEndpoint(data);
    }
  } catch (e) {
    console.log(`⚠️朝日の${url}でエラー発生`);
    console.log(e);
  }
};
