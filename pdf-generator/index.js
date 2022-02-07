import fs from 'fs';
import puppeteer from 'puppeteer';
import { Liquid } from 'liquidjs';
import path from 'path';
import TEST_DATA_LOC from './test-data/test-data.js';

const __dirname = path.resolve();
const ASSETS_DIR = path.join(__dirname, 'pdf-generator/templates');
const engine = new Liquid();

const generatePdf = (filename, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const filenamePrepped = filename.includes('.liquid')
        ? filename
        : `${filename}.liquid`;
      const template = fs.readFileSync(
        `${ASSETS_DIR}/${filenamePrepped}`,
        'utf-8'
      );
      if (!template) reject({ message: `'${filename}', template not found` });

      let preppedData = data;
      if (!preppedData) {
        preppedData = TEST_DATA_LOC
      }


      const tpl = engine.parse(template);
      const htmlContent = await engine.render(tpl, preppedData);

      const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        // args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      await page.emulateMediaType('print');

      const byteArray = await page.pdf({
        format: 'A4',
        printBackground: true,
      });

      const buffer = Buffer.from(byteArray, 'binary');
      browser.close();
      resolve(buffer);
    } catch (e) {
      reject(e);
    }
  });
};

export default generatePdf;

