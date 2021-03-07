const puppeteer = require('puppeteer');

describe('React App', () => {

  const username = "test";
  const password = "test";


  it('shall output an error on invalid accounts', async () => {

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('http://localhost:3000');

    await page.waitForSelector('#basic_username');

    await page.type('#basic_username', 'Oswald John');
    await page.type('#basic_password', 'Invalid Password');

    await page.click('.ant-btn-primary');

    await page.waitForSelector('.ant-message-custom-content.ant-message-info');
    const ErrorMessage = await page.$eval('.ant-message-custom-content.ant-message-info', element => element.textContent);

    expect(ErrorMessage).toEqual('Account not valid');
    await browser.close();
  }, 120000);

  it('shall redirect to correct page on successful login', async () => {


    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('http://localhost:3000');
    

    await page.waitForSelector('#basic_username');

    await page.type('#basic_username', username);
    await page.type('#basic_password', password);

    await page.click('.ant-btn-primary');

    await page.waitForSelector('.ant-layout-sider');
    await browser.close();

  }, 120000);
});
