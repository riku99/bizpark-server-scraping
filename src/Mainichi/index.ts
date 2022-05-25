// 毎日新聞

import { scrape } from './scrape';

const bizUrl = 'https://mainichi.jp/enterprise';

// export const scrapeMainichi = async (req: Request, res: Response) => {
//   if (!isDevelopment) {
//     const verificationResult = await verifyGcpOidcTokenForCloudScheduler(
//       req,
//       res
//     );

//     if (!verificationResult) {
//       return;
//     }
//   }

//   await scrape({ url: bizUrl, genre: 'BUSINESS' });

//   res.sendStatus(200);
// };

const run = async () => {
  await scrape({ url: bizUrl, genre: 'BUSINESS' });
};

run();
