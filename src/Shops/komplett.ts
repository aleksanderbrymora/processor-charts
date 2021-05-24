import pptr from 'puppeteer';
import { ProcessorData, ShopData } from '../types';

export class Komplett {
	private name = 'komplett';
	private page!: pptr.Page;
	async start(page: pptr.Page): Promise<ShopData> {
		this.page = page;
		await this.page.goto(
			'https://www.komplett.no/category/11204/datautstyr/pc-komponenter/prosessorer?nlevel=10000%C2%A728003%C2%A711204&sort=OrderedTimes_bf%3ADESCENDING',
		);
		await this.page.waitForSelector('a.product-link h2');
		const data: ProcessorData[] = await this.page.evaluate(() => {
			const processors =
				document.querySelectorAll<HTMLDivElement>('a.product-link h2');
			const d: ProcessorData[] = [];
			processors.forEach((p, i) => {
				const name = p.innerText.trim().replace(' Prosessor', '');
				d.push({ name, place: i + 1 });
			});
			return d;
		});
		await this.page.close();
		console.log(this.name + ' done');
		return { name: this.name, data: data.slice(0, 10) };
	}
}
