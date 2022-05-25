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
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    headless: false,
  });
  try {
    const page = await browser.newPage();
    await page.goto(url, {
      timeout: 60000, // 毎日新聞のレスポンスがクソ遅い時あるので長めに設定
    });

    // 大きく「ピックアップ」と「新着記事」に別れている場合があるが、新着記事を取得。別れていない場合はそのままリスト取得
    const sectionElem = await page.$('ul.js-morelist');

    if (sectionElem) {
      const itemElems = await sectionElem.$$('ul.articlelist li');

      if (itemElems.length) {
        const firstElem = itemElems[0];

        // 対象の要素をページに表示させないと no_image を取得することになる
        await page.evaluate((element) => {
          element.scrollIntoView();
        }, firstElem);

        // 会員限定記事の場合はスルー
        const lockedElem = await firstElem.$('span.is-limited');
        if (lockedElem) {
          await browser.close();
          return;
        }

        let articleCreatedAt: Date | undefined;
        let title: string | undefined;
        let image: string | undefined;
        let link: string | undefined;

        // 日付取得
        const dateElem = await firstElem.$('span.articletag-date');
        if (dateElem) {
          const dateStr = await (
            await dateElem.getProperty('textContent')
          ).jsonValue();

          if (typeof dateStr === 'string') {
            articleCreatedAt = parse(dateStr, 'yyyy/M/dd HH:mm', new Date());
          }
        }

        // タイトル取得
        const titleElem = await firstElem.$('h3.articlelist-title');
        if (titleElem) {
          const titleStr = await (
            await titleElem.getProperty('textContent')
          ).jsonValue();

          if (typeof titleStr === 'string') {
            title = titleStr;
          }
        }

        // サムネイル取得
        const imageElem = await firstElem.$(
          'div.articlelist-image img.lazyload'
        );
        if (imageElem) {
          const imageStr = await (
            await imageElem.getProperty('src')
          ).jsonValue();

          if (typeof imageStr === 'string') {
            image = imageStr;
          }
        }

        // リンク取得
        const linkElem = await firstElem.$('a');
        if (linkElem) {
          const linkStr = await (
            await linkElem.getProperty('href')
          ).jsonValue();

          if (typeof linkStr === 'string') {
            link = linkStr;
          }
        }

        if (title && link) {
          const data = {
            title,
            link,
            image,
            articleCreatedAt,
            genre,
            provider: newsProvider.mainichi,
          };

          await axios.post(process.env.NEWS_SAVE_ENDPOINT as string, data, {
            headers: {
              Authorization: `Bearer ${process.env.NEWS_SAVE_ENDPOINT_ACCESS_TOKEN}`,
            },
          });

          console.log('作成されるデータ ↓');
          console.log(JSON.stringify(data));
        } else {
          console.log('title is ' + title);
          console.log('link is ' + link);
        }
      }
    } else {
      console.log('sectionElemが存在しません');
    }
  } catch (e) {
    console.log('予期せぬエラー');
    console.log(e);
  } finally {
    await browser.close();
  }
};
