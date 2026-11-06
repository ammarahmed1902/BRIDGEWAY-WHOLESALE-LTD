import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const pages=['/','/about','/our-business','/products','/contact','/privacy','/terms'];
for(const path of pages)test(`accessibility and company identity ${path}`,async({page})=>{
 await page.goto(path);await page.locator('footer').scrollIntoViewIfNeeded();
 const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
 expect(results.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
 await expect(page.locator('footer')).toContainText('17555644');await expect(page.locator('footer a[href="mailto:info@bridgewaywholesale.co.uk"]')).toBeVisible();await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://www.bridgewaywholesale.co.uk'+path);
});
test('confirmed fulfilment, billing, returns and privacy content is consistent',async({page})=>{
 await page.goto('/our-business');await expect(page.locator('#fulfilment')).toContainText(/weekly or monthly/i);await expect(page.locator('#fulfilment')).toContainText('United Kingdom only');await expect(page.locator('#fulfilment')).toContainText('WhatsApp');
 await page.goto('/terms');await expect(page.locator('main')).toContainText('15 calendar days of delivery');await expect(page.locator('main')).toContainText('change-of-mind');await expect(page.locator('main')).toContainText('postage');await expect(page.locator('main')).toContainText('4–8 hours');
 await page.goto('/privacy');await expect(page.locator('main')).not.toContainText('Before public launch');for(const text of ['Vercel','Resend','Hostinger','WhatsApp','order sheets','fixed automatic deletion'])await expect(page.locator('main')).toContainText(text);
});
test('all pages reflow with 200 percent text at narrow, tablet and desktop widths',async({page})=>{
 for(const path of pages){await page.goto(path);for(const width of[320,768,1440]){await page.setViewportSize({width,height:1000});await page.evaluate(()=>document.documentElement.style.fontSize='200%');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${path} overflow at ${width} with enlarged text`).toBeTruthy();await page.evaluate(()=>document.documentElement.style.fontSize='');}}
});
