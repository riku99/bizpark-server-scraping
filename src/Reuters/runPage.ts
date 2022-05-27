import axios from 'axios';
import { parse } from 'date-fns';
import puppeteer from 'puppeteer';
import { newsProvider } from '../constants';
import { NewsGenre } from '../types';

export const runPage = async ({
  url,
  genre,
  topSelectorType,
  browser,
}: {
  url: string;
  genre: NewsGenre;
  topSelectorType?: 'section';
  browser: puppeteer.Browser;
}) => {
  try {
    const page = await browser.newPage();
    await page.goto(url);

    const topSelector =
      topSelectorType === 'section' ? 'section.top-section' : 'div.topStory';

    const topElem = await page.waitForSelector(topSelector);

    const getArticleCreatedAt = async (): Promise<Date | void> => {
      const dateElem = await page.$$('time.TextLabel__text-label___3oCVw');

      // 2022年2月22日
      const dateStr = await (
        await dateElem[0]?.getProperty('textContent')
      ).jsonValue();

      // 6:29 午後
      const timeStr = await (
        await dateElem[1]?.getProperty('textContent')
      ).jsonValue();

      if (typeof dateStr === 'string' && typeof timeStr === 'string') {
        const timeAndAmPm = timeStr.split(' '); // [ '6:29', '午後' ]

        let time: string | undefined = timeAndAmPm[0];

        const hm = timeAndAmPm[0].split(':');

        if (timeAndAmPm[1] === '午後' && Number(hm[0]) < 12) {
          time = (Number(hm[0]) + 12).toString() + ':' + hm[1];
        } else if (timeAndAmPm[1] === '午前' && Number(timeAndAmPm[0]) === 12) {
          time = '0';
        }

        const _date = parse(dateStr + time, 'yyyy年M月dd日H:mm', new Date());

        return _date;
      } else if (typeof dateStr === 'string') {
        return parse(dateStr, 'yyyy年M月dd日', new Date());
      }
    };

    const getTitile = async (): Promise<string | void> => {
      const titleElem = await page.waitForSelector(
        'h1.Headline-headline-2FXIq'
      );
      if (titleElem) {
        const title = await (
          await titleElem.getProperty('textContent')
        ).jsonValue();

        if (typeof title === 'string') {
          return title;
        }
      }
    };

    // 一番上にある記事
    if (topElem) {
      const imageElem = await topElem.$('img');

      let image: string | undefined;

      if (imageElem) {
        image = await (await imageElem.getProperty('currentSrc')).jsonValue();
      }

      const linkElem = await topElem.$('h2 a');
      await linkElem?.click();
      await page.waitForNavigation();

      const link = page.url();

      const [articleCreatedAt, title] = await Promise.all([
        getArticleCreatedAt(),
        getTitile(),
      ]);

      if (title && link) {
        const data = {
          title,
          link,
          articleCreatedAt: articleCreatedAt ?? undefined,
          image,
          genre,
          provider: newsProvider.reuters,
        };

        await axios.post(process.env.NEWS_SAVE_ENDPOINT as string, data, {
          headers: {
            Authorization: `Bearer ${process.env.NEWS_SAVE_ENDPOINT_ACCESS_TOKEN}`,
          },
        });

        console.log('作成されるデータ ↓');
        console.log(JSON.stringify(data));
      }
    }
  } catch (e) {
    console.log(`Reutersの${url}で何かしらのエラー`);
    console.log(e);
  }
};
