import pptr from 'puppeteer';
import { ProcessorData, ShopData } from '../types';

export class XCom {
	private name = 'x-kom';
	private page!: pptr.Page;
	async start(page: pptr.Page): Promise<ShopData> {
		this.page = page;
		await this.page.goto('https://www.x-kom.pl/g-5/c/11-procesory.html');
		// selects each div containing photo + desc(2nd div) + price(3d div)
		await this.page.waitForSelector(
			'div#listing-container > div > div > div:nth-child(2)',
			{ timeout: 45000 }, // cause my slow ass computer times out on js heavy websites, sigh.......
		);
		const data: ProcessorData[] = await this.page.evaluate(() => {
			const processors = document.querySelectorAll<HTMLDivElement>(
				'div#listing-container > div > div > div:nth-of-type(2)',
			);
			const d: ProcessorData[] = [];
			processors.forEach((p, i) => {
				const name =
					p.querySelector('div:nth-of-type(2) h3')?.textContent?.trim() || '';

				const processor = { name, place: i + 1 };
				d.push(processor);
			});
			return d;
		});
		await this.page.close();
		console.log(this.name + ' done');
		return { name: this.name, data: data.slice(0, 10) };
	}
}
