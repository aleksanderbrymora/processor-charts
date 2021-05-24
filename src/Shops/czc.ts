import pptr from 'puppeteer';
import { ProcessorData, ShopData } from '../types';

export class Czc {
	private name = 'czc';
	private page!: pptr.Page;

	async start(page: pptr.Page): Promise<ShopData> {
		this.page = page;
		await this.page.goto('https://www.czc.cz/procesory/produkty');
		await this.page.waitForSelector(
			'button.btn.btn-link.toggle-per-items.btn--rtl',
		);
		await this.page.click('button.btn.btn-link.toggle-per-items.btn--rtl');
		await this.page.waitForSelector('a.per-item');
		const data: ProcessorData[] = await this.page.evaluate(() => {
			const processors =
				document.querySelectorAll<HTMLDivElement>('a.per-item');
			const d: ProcessorData[] = [];
			processors.forEach((p, i) => {
				const name = p.querySelector('h3')?.innerText?.trim() || '';
				d.push({ name, place: i + 1 });
			});
			return d;
		});
		await this.page.close();
		console.log(this.name + ' done');
		return { name: this.name, data: data.slice(0, 10) };
	}
}
