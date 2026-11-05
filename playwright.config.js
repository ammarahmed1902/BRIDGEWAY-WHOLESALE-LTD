import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests',testMatch:'**/*.spec.js',timeout:60000,workers:1,reporter:[['list'],['json',{outputFile:'artifacts/test-results.json'}]],use:{baseURL:'http://127.0.0.1:3000',headless:true,launchOptions:{executablePath:'/usr/bin/chromium',args:['--no-sandbox']}}});
