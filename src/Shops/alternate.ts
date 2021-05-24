import pptr from 'puppeteer';
import { ProcessorData, ShopData } from '../types';

export class Alternate {
	private name = 'alternate';
	private page!: pptr.Page;
	async start(page: pptr.Page): Promise<ShopData> {
		this.page = page;
		await this.page.goto(
			'https://www.alternate.nl/Pc-componenten/CPUs/html/listings/1458213741910?s=relevance',
		);
		await this.page.waitForSelector('div.product-name', { timeout: 60000 });
		const data: ProcessorData[] = await this.page.evaluate(() => {
			const processors =
				document.querySelectorAll<HTMLDivElement>('div.product-name');
			const d: ProcessorData[] = [];
			processors.forEach((p, i) => {
				const company = p.querySelector('span')?.textContent?.trim() || '';
				const title = p.innerHTML.replace(/<span.*<\/span>/, '').trim() + '';
				console.log({ company, title });
				const name = company + ' ' + title;
				d.push({ name, place: i + 1 });
			});
			return d;
		});
		await this.page.close();
		console.log(this.name + ' done');
		return { name: this.name, data: data.slice(0, 10) };
	}
}
