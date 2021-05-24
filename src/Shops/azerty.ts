import pptr from 'puppeteer';
import { ProcessorData, ShopData } from '../types';

export class Azerty {
	private name = 'azerty';
	private page!: pptr.Page;
	async start(page: pptr.Page): Promise<ShopData> {
		this.page = page;
		await this.page.goto(
			'https://azerty.nl/category/componenten/cpu?__cf_chl_jschl_tk__=50b7c9f63fcab525a3ea0808789b8e581c5db5d1-1621774906-0-ASN9W2ufhj4_ljzU3O3RjSkisiUhaHM5vCHWyweIAiVU-qwasWUVaDCPzhUEk8bI9_OmRXcJjCPJQ3Kp8Ek077maSWEWJScKA_FtPpWQaky-cUfXTgE-7Mc3nOpfWRJbVol6FFlAaA3Zqrxk0tWzRq_WxpOsFxY_I0yo6rDHisCGxoejfrlx3jxSaT15Kx47Bu89CrGDhUKgbbFwpM_SmbmT9H7S34BFeIi5_7l7wZDq85F48f06OEVZMTAvSl6oPJEf-Sc3InRE45kLVvzC0I6wC0lpJboy6CgYWdndyZVCRNAXIqc1ZhuROzB-zPJQP-wMCANaC2_DHfZHgBTu6lTwL8ZZCe4SoWHcisyHdHPFhq7sGiCKVhT42JCOkzs29Qkgm4LzJFibnqgOdqaPMw5wSdQl2CYVgqGDRRJjpqN1itS_bwWWE_lkAHRJL_FFzT_7zufXNDrkzbEWZ2vr4Xh8pFAUDOwnfCuCtkx76HSA#!sorting=15&limit=12&view=grid',
		);
		// lots of time because of ddos protection of theirs
		await this.page.waitForSelector('div.item h3', { timeout: 60000 });
		const data: ProcessorData[] = await this.page.evaluate(() => {
			const processors =
				document.querySelectorAll<HTMLDivElement>('div.item h3');
			const d: ProcessorData[] = [];
			processors.forEach((p, i) => {
				const name = p.innerText.trim() || '';
				d.push({ name, place: i + 1 });
			});
			return d;
		});
		await this.page.close();
		console.log(this.name + ' done');
		return { name: this.name, data: data.slice(0, 10) };
	}
}
