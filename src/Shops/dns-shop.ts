import pptr from 'puppeteer';
import { ProcessorData, ShopData } from '../types';

export class DnsShop {
	private name = 'DnsShop';
	private page!: pptr.Page;
	async start(page: pptr.Page): Promise<ShopData> {
		this.page = page;
		await this.page.goto(
			'https://www.dns-shop.ru/catalog/17a899cd16404e77/processory/?order=6&groupBy=none&stock=2',
		);
		await this.page.waitForSelector('a.catalog-product__name');
		const data: ProcessorData[] = await this.page.evaluate(() => {
			const processors = document.querySelectorAll<HTMLAnchorElement>(
				'a.catalog-product__name',
			);
			const d: ProcessorData[] = [];
			processors.forEach((p) => {
				const name = p.innerText
					.trim()
					.replace(/ ?Процессор ?/, '')
					.replace(/ ?(OEM|BOX) ?\[.*\].*/gi, '');
				d.push({ name, place: d.length + 1 });
			});
			return d;
		});
		await this.page.close();
		console.log(this.name + ' done');
		return { name: this.name, data: data.slice(0, 10) };
	}
}
