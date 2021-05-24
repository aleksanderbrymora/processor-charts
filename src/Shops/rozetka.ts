import pptr from 'puppeteer';
import { ProcessorData, ShopData } from '../types';

export class Rozetka {
	private name = 'rozetka';
	private page!: pptr.Page;
	async start(page: pptr.Page): Promise<ShopData> {
		this.page = page;
		await this.page.goto(
			'https://hard.rozetka.com.ua/processors/c80083/sort=popularity/',
		);
		await this.page.waitForSelector('span.goods-tile__title');
		const data: ProcessorData[] = await this.page.evaluate(() => {
			const processors = document.querySelectorAll<HTMLDivElement>(
				'span.goods-tile__title',
			);
			const d: ProcessorData[] = [];
			processors.forEach((p, i) => {
				const name = p.innerText.trim().replace(/ ?Процессор ?/gi, '');
				d.push({ name, place: i + 1 });
			});
			return d;
		});
		await this.page.close();
		console.log(this.name + ' done');
		return { name: this.name, data: data.slice(0, 10) };
	}
}
