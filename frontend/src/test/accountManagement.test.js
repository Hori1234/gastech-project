const puppeteer = require('puppeteer');

const username = 'test';
const password = 'test';

describe('React App', () => {

    
    it('shall succesfully create an account', async () => {

        const browser = await puppeteer.launch({ 
            headless: true,
            defaultViewport: null,
            args: [`--window-size=${1920},${1080}`]
        });
        const page = await browser.newPage();
        await page.goto('http://localhost:3000');
    
        await page.waitForSelector('#basic_username');
    
        await page.type('#basic_username', username);
        await page.type('#basic_password', password);
    
        await page.click('.ant-btn-primary');
    
        await page.waitForSelector('.ant-menu-item.ant-menu-item-only-child:nth-child(2)');
        await page.click('.ant-menu-item.ant-menu-item-only-child:nth-child(2)');
        await page.waitFor(300);
        const currentPage = page.url();
        expect(currentPage).toEqual('http://localhost:3000/account');

        await page.waitFor(1000);
        await page.click('.ant-btn.ant-btn-primary');

        await page.waitForSelector('.ant-modal-content');
        await page.type('#nest-messages_user_name', 'Oswald');
        await page.type('#nest-messages_user_password', 'pOswald');

        await page.click('.ant-select.ant-select-single.ant-select-allow-clear.ant-select-show-arrow');
        
        await page.waitFor(1000);
        await page.click('body > div:nth-child(9) > div > div > div > div.rc-virtual-list > div > div > div > div.ant-select-item.ant-select-item-option:nth-child(1) > div');
        
        await page.waitFor(2000);

        await page.click('#nest-messages > div:nth-child(5) > div > div > div > button');

        // await page.waitForSelector('.ant-message-custom-content.ant-message-success');
        // const ErrorMessage = await page.$eval('.ant-message-custom-content.ant-message-success', element => element.textContent);

        // expect(ErrorMessage).toEqual(`Account created !`);
        await browser.close();
      }, 120000);
      

      it('shall succesfully display error message on empty fields an account creation', async () => {

        const browser = await puppeteer.launch({ 
            headless: true,
            defaultViewport: null,
            args: [`--window-size=${1920},${1080}`]
        });
        const page = await browser.newPage();
        await page.goto('http://localhost:3000');
    
        await page.waitForSelector('#basic_username');
    
        await page.type('#basic_username', username);
        await page.type('#basic_password', password);
    
        await page.click('.ant-btn-primary');
    
        await page.waitForSelector('.ant-menu-item.ant-menu-item-only-child:nth-child(2)');
        await page.click('.ant-menu-item.ant-menu-item-only-child:nth-child(2)');
        await page.waitFor(300);
        const currentPage = page.url();
        expect(currentPage).toEqual('http://localhost:3000/account');

        
        await page.click('.ant-btn.ant-btn-primary');

        await page.waitFor(1000);

        await page.click('#nest-messages > div:nth-child(5) > div > div > div > button');

        await page.waitForSelector('.ant-message-custom-content.ant-message-error');
        const ErrorMessage = await page.$eval('.ant-message-custom-content.ant-message-error', element => element.textContent);

        expect(ErrorMessage).toEqual('Failed: Please complete all the required fields');
        await browser.close();
      }, 120000);

      
      it('shall succesfully edit an account', async () => {

        const browser = await puppeteer.launch({ 
            headless: true,
            defaultViewport: null,
            args: [`--window-size=${1920},${1080}`]
        });
        const page = await browser.newPage();
        await page.goto('http://localhost:3000');
    
        await page.waitForSelector('#basic_username');
    
        await page.type('#basic_username', username);
        await page.type('#basic_password', password);
    
        await page.click('.ant-btn-primary');
    
        await page.waitForSelector('.ant-menu-item.ant-menu-item-only-child:nth-child(2)');
        await page.click('.ant-menu-item.ant-menu-item-only-child:nth-child(2)');
        await page.waitFor(300);
        const currentPage = page.url();
        expect(currentPage).toEqual('http://localhost:3000/account');

        await page.waitFor(1000);
        await page.click('#root > section > section > section > section > main > section > section > section:nth-child(3) > section > div > div > div > div > div > ul > li:nth-child(4) > div:nth-child(2) > button:nth-child(1)');

        await page.waitForSelector('.ant-modal-content');
        await page.type('#nest-messages_user_Username', 'OswaldChange');
        await page.type('#nest-messages_user_Password', 'pOswaldChange');

        await page.click('.ant-select.ant-select-single.ant-select-allow-clear.ant-select-show-arrow');
        
        await page.waitFor(1000);
        await page.click('body > div:nth-child(9) > div > div > div > div.rc-virtual-list > div > div > div > div:nth-child(1) > div');

        

        await page.waitFor(2000);

        await page.click('#nest-messages > div:nth-child(5) > div > div > div > button');

        await page.waitForSelector('.ant-message-custom-content.ant-message-success');
        const ErrorMessage = await page.$eval('.ant-message-custom-content.ant-message-success', element => element.textContent);

        expect(ErrorMessage).toEqual(`Account updated succesfully`);
        await browser.close();
      }, 120000);


      it('shall succesfully display error message on empty fields an account editing', async () => {

        const browser = await puppeteer.launch({ 
            headless: true,
            defaultViewport: null,
            args: [`--window-size=${1920},${1080}`]
        });
        const page = await browser.newPage();
        await page.goto('http://localhost:3000');
    
        await page.waitForSelector('#basic_username');
    
        await page.type('#basic_username', username);
        await page.type('#basic_password', password);
    
        await page.click('.ant-btn-primary');
    
        await page.waitForSelector('.ant-menu-item.ant-menu-item-only-child:nth-child(2)');
        await page.click('.ant-menu-item.ant-menu-item-only-child:nth-child(2)');
        await page.waitFor(300);
        const currentPage = page.url();
        expect(currentPage).toEqual('http://localhost:3000/account');

        await page.waitFor(1000);
        await page.click('#root > section > section > section > section > main > section > section > section:nth-child(3) > section > div > div > div > div > div > ul > li:nth-child(4) > div:nth-child(2) > button:nth-child(1)');



        await page.click('#nest-messages > div:nth-child(5) > div > div > div > button');

        await page.waitForSelector('.ant-message-custom-content.ant-message-error');
        const ErrorMessage = await page.$eval('.ant-message-custom-content.ant-message-error', element => element.textContent);

        expect(ErrorMessage).toEqual('Failed: Please complete all the required fields');
        await browser.close();
      }, 120000);



      it('shall successfully delete an account', async () => {

        const browser = await puppeteer.launch({ 
            headless: true,
            defaultViewport: null,
            args: [`--window-size=${1920},${1080}`]
        });
        const page = await browser.newPage();
        await page.goto('http://localhost:3000');
    
        await page.waitForSelector('#basic_username');
    
        await page.type('#basic_username', username);
        await page.type('#basic_password', password);
    
        await page.click('.ant-btn-primary');
    
        await page.waitForSelector('.ant-menu-item.ant-menu-item-only-child:nth-child(2)');
        await page.click('.ant-menu-item.ant-menu-item-only-child:nth-child(2)');
        await page.waitFor(300);
        const currentPage = page.url();
        expect(currentPage).toEqual('http://localhost:3000/account');

        await page.waitFor(1000);
        await page.click('#root > section > section > section > section > main > section > section > section:nth-child(3) > section > div > div > div > div > div > ul > li:nth-child(4) > div:nth-child(2) > button:nth-child(2)');

        await page.waitFor(1000);
        //await page.click('body > div:nth-child(6) > div > div.ant-modal-wrap > div > div.ant-modal-content > div.ant-modal-footer > button.ant-btn.ant-btn-primary > span');
        await page.click('.ant-modal-footer > button:nth-child(2)');

        await page.waitForSelector('.ant-message-custom-content.ant-message-success');
        const ErrorMessage = await page.$eval('.ant-message-custom-content.ant-message-success', element => element.textContent);

        expect(ErrorMessage).toEqual(`Account successfully deleted`);
        await browser.close();
      }, 120000);

});



