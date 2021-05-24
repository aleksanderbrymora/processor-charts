import pptr from 'puppeteer';
import { ProcessorData, ShopData } from '../types';

export class Komputronik {
	private name = 'komputronik';
	private page!: pptr.Page;
	async start(page: pptr.Page): Promise<ShopData> {
		this.page = page;
		await this.page.goto(
			'https://www.komputronik.pl/category/401/procesory.html',
		);
		await this.page.waitForSelector('.product-entry2');
		const data: ProcessorData[] = await this.page.evaluate(() => {
			const processors =
				document.querySelectorAll<HTMLDivElement>('.product-entry2');
			const d: ProcessorData[] = [];
			processors.forEach((p, i) => {
				const name = p.querySelector('.pe2-head a')?.textContent?.trim() || '';
				d.push({ name, place: i + 1 });
			});
			return d;
		});
		await this.page.close();
		console.log(this.name + ' done');
		return { name: this.name, data: data.slice(0, 10) };
	}
}
