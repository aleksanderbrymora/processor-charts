import pptr from 'puppeteer';
import { ProcessorData, ShopData } from '../types';

export class Inet {
	private name = 'inet';
	private page!: pptr.Page;
	async start(page: pptr.Page): Promise<ShopData> {
		this.page = page;
		await this.page.goto(
			'https://www.inet.se/kategori/52/processor-cpu?sortColumn=rank&sortDirection=desc',
		);
		await this.page.waitForSelector('div.product-text h4');
		const data: ProcessorData[] = await this.page.evaluate(() => {
			const processors = document.querySelectorAll<HTMLDivElement>(
				'div.product-text h4',
			);
			console.log({ processors });
			const d: ProcessorData[] = [];
			processors.forEach((p, i) => {
				const name = p.innerText.trim() || '';
				d.push({ name, place: i + 1 });
			});
			return d;
		});
		await this.page.close();
		console.log(this.name + ' done');
		return { name: this.name, data: data.slice(0, 10) };
	}
}
