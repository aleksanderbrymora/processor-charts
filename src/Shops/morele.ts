import pptr from 'puppeteer';
import { ProcessorData, ShopData } from '../types';

export class Morele {
	private name = 'morele';
	private page!: pptr.Page;

	async start(page: pptr.Page): Promise<ShopData> {
		this.page = page;
		await this.page.goto('https://www.morele.net/kategoria/procesory-45/');
		// need to wait for the dropdown to appear and then change to popular
		await this.page.waitForSelector(
			'.morele-dropdown.cat-sorting-dropdown button',
		);
		await this.page.click('.morele-dropdown.cat-sorting-dropdown button');
		await this.page.waitForSelector(
			'li[data-dropdown-label="Po popularności"]',
		);
		await this.page.click('li[data-dropdown-label="Po popularności"]');
		await this.page.waitForSelector('.cat-product.card');
		const data: ProcessorData[] = await this.page.evaluate(() => {
			const processors =
				document.querySelectorAll<HTMLDivElement>('.cat-product.card');
			const d: ProcessorData[] = [];
			processors.forEach((p, i) => {
				const name =
					p
						.querySelector('p.cat-product-name a')
						?.textContent?.replace(/procesor /gi, '')
						.replace(/,.*/, '')
						.trim() || '';
				d.push({ name, place: i + 1 });
			});
			return d;
		});
		await this.page.close();
		console.log(this.name + ' done');
		return { name: this.name, data: data.slice(0, 10) };
	}
}
