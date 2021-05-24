import pptr from 'puppeteer';
import { ProcessorData, ShopData } from '../types';

export class Ldlc {
	private name = 'ldlc';
	private page!: pptr.Page;
	async start(page: pptr.Page): Promise<ShopData> {
		this.page = page;
		await this.page.goto(
			'https://www.ldlc.com/informatique/pieces-informatique/processeur/c4300/?sort=4',
		);
		await this.page.waitForSelector('h3.title-3');
		const data: ProcessorData[] = await this.page.evaluate(() => {
			const processors =
				document.querySelectorAll<HTMLDivElement>('h3.title-3');
			const d: ProcessorData[] = [];
			processors.forEach((p, i) => {
				const name = p.innerText.trim();
				d.push({ name, place: i + 1 });
			});
			return d;
		});
		await this.page.close();
		console.log(this.name + ' done');
		return { name: this.name, data: data.slice(0, 10) };
	}
}
