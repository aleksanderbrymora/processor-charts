import pptr from 'puppeteer';
import { ProcessorData, ShopData } from '../types';

export class PcGarage {
	private name = 'pcgarage';
	private page!: pptr.Page;
	async start(page: pptr.Page): Promise<ShopData> {
		this.page = page;
		await this.page.goto('https://www.pcgarage.ro/procesoare/');
		await this.page.waitForSelector('div.product_box_name h2');
		const data: ProcessorData[] = await this.page.evaluate(() => {
			const processors = document.querySelectorAll<HTMLDivElement>(
				'div.product_box_name h2',
			);
			const d: ProcessorData[] = [];
			processors.forEach((p, i) => {
				const name = p.innerText.trim();
				d.push({ name, place: i + 1 });
			});
			return d;
		});
		await this.page.close();
		console.log(this.name + ' done');
		return { name: this.name, data: data.slice(0, 10) };
	}
}
