import pptr from 'puppeteer';
import { writeFile } from 'fs/promises';

import { ShopData } from '../types';
import { Alternate } from './alternate';
import { Alza } from './alza';
import { Azerty } from './azerty';
import { Czc } from './czc';
import { Digitec } from './digitec';
import { Evetech } from './evetech';
import { Inet } from './inet';
import { Jimms } from './jimms';
import { Komplett } from './komplett';
import { Komputronik } from './komputronik';
import { Ldlc } from './ldlc';
import { Morele } from './morele';
import { PcGarage } from './pcgarage';
import { Proshop } from './proshop';
import { Rozetka } from './rozetka';
import { RueduCommerce } from './rueducommerce';
import { XCom } from './x-kom';
import { NotebooksBilliger } from './notebooksbilliger';
import { AmazonDe } from './amazonde';
import { DnsShop } from './dns-shop';

export class Shops {
	private browser!: pptr.Browser;
	private shopData: ShopData[] = [];

	async start() {
		this.browser = await pptr.launch({
			// devtools: true,
			// headless: false,
		});

		// loops through all the shops supplying them with a new page
		(
			await Promise.allSettled(
				[
					Alternate,
					// Alza, // captcha blocks the access
					AmazonDe, // works, but amazon has horrible listing style
					// Azerty, // doesn't work becasue cloudflare
					Czc,
					// Digitec, // blocked me + weird scroll to load
					DnsShop,
					Evetech,
					Inet,
					Jimms,
					Komplett,
					Komputronik,
					Ldlc,
					Morele,
					// NotebooksBilliger, // apparently server died...
					PcGarage,
					Proshop,
					Rozetka,
					RueduCommerce, // the output needs some polishing
					XCom,
				].map(async (shop) => new shop().start(await this.genPage())),
			)
		).forEach((d) =>
			d.status === 'fulfilled'
				? this.shopData.push(d.value)
				: console.log(d.reason, d.status),
		);
		// console.log(JSON.stringify(this.shopData, null, 2));
		await writeFile(
			'./processors.json',
			JSON.stringify(this.shopData, null, 2),
			{ encoding: 'utf-8' },
		);
		await this.browser.close();
	}

	async genPage(): Promise<pptr.Page> {
		const p = await this.browser.newPage();
		await p.setViewport({
			height: 1080,
			width: 1920,
			deviceScaleFactor: 1,
		});
		return p;
	}
}
