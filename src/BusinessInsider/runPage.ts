import puppeteer from 'puppeteer';
import { newsProvider } from '../constants';
import { postToNewsSaveEndpoint } from '../helpers/postToNewsSaveEndpoint';
import { NewsGenre } from '../types';

const getArticleCreatedAt = async ({
  page,
}: {
  page: puppeteer.Page;
}): Promise<Date | void> => {
  const dateElem = await page.$('li.p-post-bylineDate');

  if (!dateElem) {
    return;
  }

  const dateElemStr = (await (
    await dateElem.getProperty('textContent')
  ).jsonValue()) as string;

  const dateStr = dateElemStr.split(' ').slice(0, -1).join(' ');
  const date = new Date(dateStr);

  return date;
};

const getTitle = async ({ page }: { page: puppeteer.Page }) => {
  const titleElem = await page.waitForSelector('h1.p-post-title');

  if (!titleElem) {
    return;
  }

  const title = (await (
    await titleElem.getProperty('textContent')
  ).jsonValue()) as string;

  return title;
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
    await page.goto(url, {
      timeout: 70000,
    });

    const topContentElem = await page.waitForSelector('div.p-cardList-card');

    if (!topContentElem) {
      return;
    }

    // 「有料会員限定」ラベル
    const primeLabelElem = await topContentElem.$('div.p-label-primeLabel');
    if (primeLabelElem) {
      return;
    }

    const imageElem = await topContentElem.$('img');
    let image: string | undefined;

    if (imageElem) {
      image = await (await imageElem.getProperty('currentSrc')).jsonValue();
    }

    const contentLinkElem = await topContentElem.$('a');

    if (!contentLinkElem) {
      return;
    }

    await contentLinkElem.click();
    await page.waitForNavigation({
      timeout: 70000,
    });

    const [articleCreatedAt, title] = await Promise.all([
      getArticleCreatedAt({ page }),
      getTitle({ page }),
    ]);

    const link = page.url();

    if (title && link) {
      const data = {
        title,
        link,
        articleCreatedAt,
        image,
        genre,
        provider: newsProvider.businessInsider,
      };

      await postToNewsSaveEndpoint(data);
    }
  } catch (e) {
    console.log(`⚠️ビジネスインサイダーの${url}でエラー発生`);
    console.log(e);
  }
};
