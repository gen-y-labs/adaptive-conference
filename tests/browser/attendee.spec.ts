import {test,expect} from '@playwright/test';import AxeBuilder from '@axe-core/playwright';

test('kiosk home opens a focused picture view with no in-view format navigation',async({page})=>{
 await page.goto('/');await expect(page.getByRole('heading',{name:'Conference information that works for you.'})).toBeVisible();
 await expect(page.getByRole('heading',{name:'See the steps'})).toBeVisible();await expect(page.getByRole('heading',{name:'Watch signing'})).toBeVisible();
 await page.getByRole('link',{name:/Try the welcome kiosk/}).click();await expect(page.getByRole('heading',{name:'Welcome to Inclusive Design Summit.'})).toBeVisible();
 await page.getByRole('link',{name:/Use pictures/}).click();await expect(page.getByRole('heading',{name:'Inclusive Design Summit'})).toBeVisible();
 await page.getByRole('heading',{name:'Start with the people: an inclusive design foundation'}).waitFor();
 await expect(page.getByRole('button',{name:'Remember these settings on this device'})).toHaveCount(0);
 await expect(page.getByRole('button',{name:/American Sign Language/})).toHaveCount(0);
 await expect(page.getByRole('button',{name:/Accessible text/})).toHaveCount(0);
 await expect(page.getByRole('link',{name:/Start over|kiosk start|welcome kiosk/i})).toHaveCount(0);
 await expect(page.getByText('Do next: Follow the green floor markers to Main Hall before 9:00 AM.')).toBeVisible();
 await page.getByRole('tab',{name:/Session 2:/}).click();await expect(page.getByRole('heading',{name:'Make digital services usable by more people'})).toBeVisible();
});

test('standard kiosk default offers a general audience agenda without view navigation',async({page})=>{
 await page.goto('/kiosk');
 await expect(page.getByRole('link',{name:'Open standard view'})).toBeVisible();
 await page.getByRole('link',{name:'Open standard view'}).click();
 await expect(page.getByRole('heading',{name:'Today’s agenda'})).toBeVisible();
 await expect(page.getByRole('button',{name:'Accessible text'})).toHaveCount(0);
 await expect(page.getByRole('button',{name:/Picture-led|American Sign Language/})).toHaveCount(0);
 await expect(page.getByRole('heading',{name:'Start with the people: an inclusive design foundation'})).toBeVisible();
});

test('accessibility page stays minimal and provides a simple session selector',async({page})=>{
 await page.goto('/accessibility?session=accessible-digital-services');
 await expect(page.getByRole('heading',{name:'Conference sessions'})).toBeVisible();
 await expect(page.getByRole('button',{name:'Preferences'})).toHaveCount(0);
 await expect(page.getByRole('button',{name:'Picture-led'})).toHaveCount(0);
 await expect(page.getByRole('link',{name:/Back|Start over/i})).toHaveCount(0);
 await expect(page.getByLabel('Choose a session')).toBeVisible();
 await expect(page.getByLabel('Choose a session')).toHaveValue('accessible-digital-services');
 await expect(page.getByRole('heading',{name:'Make digital services usable by more people'})).toBeVisible();
 await expect(page.getByText('Need help? Ask the welcome desk for help finding a room or getting event information.')).toBeVisible();
});

test('organizer demo shows the Inclusive Design agenda and honest readiness',async({page})=>{
 await page.goto('/demo/priya');
 await expect(page.getByRole('heading',{name:'What comes with Inclusive Design?'})).toBeVisible();
 await expect(page.getByRole('listitem')).toHaveCount(6);
 await expect(page.getByText(/awaiting permitted media and fluent review/)).toBeVisible();
 await expect(page.getByRole('link')).toHaveCount(0);
});

test('guest preview has no axe violations in the main navigation state',async({page})=>{
 await page.goto('/preview');const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
 expect(result.violations.map(v=>`${v.id}: ${v.help}\n${v.nodes.map(n=>`${n.target.join(' ')} ${n.failureSummary}`).join('\n')}`)).toEqual([]);
});

test('blocked preference storage leaves choices usable',async({page})=>{
 await page.addInitScript(()=>{Object.defineProperty(window,'localStorage',{configurable:true,get(){throw new DOMException('Storage denied','SecurityError');}});});
 await page.goto('/preview');await page.getByRole('button',{name:'Preferences'}).click();
 await page.getByLabel('Remember these settings on this device').check();
 await expect(page.getByRole('status').filter({hasText:'blocked saved settings'})).toBeVisible();
 await page.getByLabel('ASL signing',{exact:true}).check();
 await expect(page.getByRole('heading',{name:'ASL content awaiting fluent review'})).toBeVisible();
});
