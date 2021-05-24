import pptr from 'puppeteer';
import { ProcessorData, ShopData } from '../types';

export class Digitec {
	private name = 'digitec';
	private page!: pptr.Page;

	async start(page: pptr.Page): Promise<ShopData> {
		this.page = page;
		await this.page.goto(
			'https://www.digitec.ch/de/s1/producttype/prozessor-83?tagIds=76&take=84',
		);
		// await this.page.waitForSelector('div.panelProduct');
		// await this.autoScroll();

		const data: ProcessorData[] = await this.page.evaluate(() => {
			const processors = document
				.querySelector('div.productList')!
				.querySelectorAll('article div.productName');

			console.log({ processors });

			// const processors =
			// 	document.querySelectorAll<HTMLDivElement>('a.per-item');
			const d: ProcessorData[] = [];
			processors.forEach((p, i) => {
				const name = p.querySelector('h3')?.innerText?.trim() || '';
				d.push({ name, place: i + 1 });
			});
			return d;
		});
		// await this.page.close();
		console.log(this.name + ' done');
		return { name: this.name, data: data.slice(0, 10) };
	}

	async autoScroll() {
		await this.page.evaluate(() => {
			const height = document.body.scrollHeight;
			window.scrollBy(0, height);
			console.log({ height });
		});
	}
}
