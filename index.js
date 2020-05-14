const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');

const scrapeRes = {
    mangaName: 'String',
    rank: 0,
    score: 0,
    info: 0,
    mangUrl: 'String'
}

// primary page
async function scrapeMangaLists(page) {
    const data = [];
    var count = 0;

    for (var i = 0; i <= 26; i++) {
        await page.goto('https://myanimelist.net/topmanga.php?limit=' + count);

        const html = await page.content();
        const $ = cheerio.load(html);
        // TEST
        // fs.writeFileSync('./test' + i + '.html', html);

        $('.ranking-list').each((i, el) => {
            const mangaNameEl = $(el).find('.detail a:nth-child(2)');
            const rankEl = $(el).find('.rank');
            const scoreEl = $(el).find('.score .score-label');
            const infoEl = $(el).find('.detail .information');

            const mangaName = $(mangaNameEl).text();
            const rank = +($(rankEl).text());
            const score = +($(scoreEl).text());
            const info = $(infoEl).text();
            const mangUrl = $(mangaNameEl).attr('href');

            const dataRow = {
                mangaName,
                rank,
                score,
                info,
                mangUrl
            };
            data.push(dataRow);
        })
        count += 50;
        await sleep(1000);
    }
    return data;
}

// sleep
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// writeFile
async function writeFile(mangaLists) {
    fs.writeFile('./data.json', JSON.stringify(mangaLists, null, 4), (err) => {
        console.log('Write-file success');
    });
};

// main
async function main(){
    const browser = await puppeteer.launch({
        headless: false
    })
    const page = await browser.newPage();

    const mangaLists = await scrapeMangaLists(page);
    // console.log(mangaLists);
    writeFile(mangaLists);
}
main();