const puppeteer = require('puppeteer');
const path = require('path');


describe('React App', () => {

  
  it('shall display correct error message after failed upload', async () => {

    const browser = await puppeteer.launch({ 
        headless: true,
        defaultViewport: null,
        args: [`--window-size=${1920},${1080}`]
    });
    const page = await browser.newPage();
    await page.goto('http://localhost:3000');

    await page.waitForSelector('#basic_username');

    await page.type('#basic_username', 'test');
    await page.type('#basic_password', 'test');

    await page.click('.ant-btn-primary');

    await page.waitForSelector('#uploadButton');
    await page.click('#uploadButton');
    const currentPage = page.url();
    expect(currentPage).toEqual('http://localhost:3000/upload');

    const fileToUpload = 'order_sheet_wrong_numbers.xlsx';
    const filePath = path.relative(process.cwd(), __dirname + '/order_sheet_wrong_numbers.xlsx');

    await page.waitForSelector('input[type=file]');
    await page.waitFor(1000);

    const inputUploadHandle = await page.$('input[type=file]');

    inputUploadHandle.uploadFile(filePath);

    
    await page.waitForSelector('.ant-message-custom-content.ant-message-error');
    
    const ErrorMessage = await page.$eval('.ant-message-custom-content.ant-message-error:nth-of-type(1)', element => element.textContent);

    expect(ErrorMessage).toEqual(`${fileToUpload} file upload failed.`);

    await browser.close();

  }, 120000);



  it('shall display correct response message after successful upload', async () => {

    const browser = await puppeteer.launch({ 
        headless: true,
        defaultViewport: null,
        args: [`--window-size=${1920},${1080}`]
    });
    const page = await browser.newPage();
    await page.goto('http://localhost:3000');

    await page.waitForSelector('#basic_username');

    await page.type('#basic_username', 'test');
    await page.type('#basic_password', 'test');

    await page.click('.ant-btn-primary');

    await page.waitForSelector('#uploadButton');
    await page.click('#uploadButton');
    const currentPage = page.url();
    expect(currentPage).toEqual('http://localhost:3000/upload');

    const fileToUpload = 'truck_availability_test.xlsx';
    const filePath = path.relative(process.cwd(), __dirname + '/truck_availability_test.xlsx');

    await page.waitForSelector('input[type=file]');
    await page.waitFor(1000);
    const inputUploadHandle = await page.$('input[type=file]');

    inputUploadHandle.uploadFile(filePath);

    
    await page.waitForSelector('.ant-message-custom-content.ant-message-success');
    
    const ErrorMessage = await page.$eval('.ant-message-custom-content.ant-message-success:nth-of-type(1)', element => element.textContent);


    
    expect(ErrorMessage).toEqual(`${fileToUpload} file uploaded successfully.`);
    await browser.close();
  }, 120000);
});


