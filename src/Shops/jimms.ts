import pptr from 'puppeteer';
import { ProcessorData, ShopData } from '../types';

export class Jimms {
	private name = 'jimms';
	private page!: pptr.Page;
	async start(page: pptr.Page): Promise<ShopData> {
		this.page = page;
		await this.page.goto(
			'https://www.jimms.fi/fi/Product/List/000-00R/komponentit--prosessorit',
		);
		await this.page.waitForSelector('div.p_name');
		const data: ProcessorData[] = await this.page.evaluate(() => {
			const processors =
				document.querySelectorAll<HTMLDivElement>('div.p_name');
			const d: ProcessorData[] = [];
			processors.forEach((p, i) => {
				const make = p.querySelector('span')?.innerText.trim();
				const model = p.querySelector('b')?.innerText.trim();

				const name = make + ' ' + model;
				d.push({ name, place: i + 1 });
			});
			return d;
		});
		await this.page.close();
		console.log(this.name + ' done');
		return { name: this.name, data: data.slice(0, 10) };
	}
}
