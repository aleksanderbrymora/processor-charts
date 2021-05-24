import pptr from 'puppeteer';
import { ProcessorData, ShopData } from '../types';

export class AmazonDe {
	private name = 'amazonde';
	private page!: pptr.Page;
	async start(page: pptr.Page): Promise<ShopData> {
		this.page = page;
		await this.page.goto(
			'https://www.amazon.de/-/en/gp/bestsellers/computers/430177031/ref=zg_bs_nav_computers_3_17453196031',
		);
		await this.page.waitForSelector('div.p13n-sc-truncated');
		const data: ProcessorData[] = await this.page.evaluate(() => {
			const processors = document.querySelectorAll<HTMLDivElement>(
				'div.p13n-sc-truncated',
			);
			const d: ProcessorData[] = [];
			processors.forEach((p) => {
				const name = p.innerText.trim();
				if (/AMD|Intel/gi.test(name)) {
					d.push({ name, place: d.length + 1 });
				}
			});
			return d;
		});
		await this.page.close();
		console.log(this.name + ' done');
		return { name: this.name, data: data.slice(0, 10) };
	}
}
