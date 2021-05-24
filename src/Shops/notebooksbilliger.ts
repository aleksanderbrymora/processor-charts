import pptr from 'puppeteer';
import { ProcessorData, ShopData } from '../types';

export class NotebooksBilliger {
	private name = 'notebooksbilliger';
	private page!: pptr.Page;
	async start(page: pptr.Page): Promise<ShopData> {
		this.page = page;
		await this.page.goto(
			'https://www.notebooksbilliger.de/pc+hardware/prozessoren+pc+hardware',
			{ timeout: 30000 },
		);
		await this.page.waitForSelector('a.listing_product_title');
		const data: ProcessorData[] = await this.page.evaluate(() => {
			const processors = document.querySelectorAll<HTMLAnchorElement>(
				'a.listing_product_title',
			);
			const d: ProcessorData[] = [];
			processors.forEach((p, i) => {
				const name = p.innerText.trim().replace(/ ?,.*/gi, '');
				d.push({ name, place: i + 1 });
			});
			return d;
		});
		await this.page.close();
		console.log(this.name + ' done');
		return { name: this.name, data: data.slice(0, 10) };
	}
}
