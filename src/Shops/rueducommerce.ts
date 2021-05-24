import pptr from 'puppeteer';
import { ProcessorData, ShopData } from '../types';

export class RueduCommerce {
	private name = 'rueducommerce';
	private page!: pptr.Page;
	async start(page: pptr.Page): Promise<ShopData> {
		this.page = page;
		await this.page.goto(
			'https://www.rueducommerce.fr/rayon/composants-16/processeur-246',
		);
		await this.page.waitForSelector('h2.item__title');
		const data: ProcessorData[] = await this.page.evaluate(() => {
			const processors =
				document.querySelectorAll<HTMLDivElement>('h2.item__title');
			console.log(processors);
			const d: ProcessorData[] = [];
			processors.forEach((p, i) => {
				const name = p.innerText
					.trim()
					.replace(/[\h]*[--][\h]*/gi, ' ')
					.replace(/\h{2,}/gi, '');
				d.push({ name, place: i + 1 });
			});
			return d;
		});
		await this.page.close();
		console.log(this.name + ' done');
		return { name: this.name, data: data.slice(0, 10) };
	}
}
