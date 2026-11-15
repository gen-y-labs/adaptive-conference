import {test,expect} from '@playwright/test';import AxeBuilder from '@axe-core/playwright';

test('kiosk match screen presents sample visitor paths without using a camera',async({page})=>{
 await page.goto('/');await expect(page.getByRole('heading',{name:'Welcome. Your day, your way.'})).toBeVisible();
 await expect(page.getByRole('img',{name:/welcome desk.*green and blue floor paths/i})).toBeVisible();
 await expect(page.getByText('NOVEMBER 10 · DENVER')).toBeVisible();
 await expect(page.getByRole('heading',{name:'Choose a sample match'})).toBeVisible();
 await expect(page.getByText(/does not use a camera or identify anyone/)).toBeVisible();
 await expect(page.getByRole('link',{name:/Maya Picture path/})).toHaveAttribute('href','/demo/maya');
 await expect(page.getByRole('link',{name:/Jordan ASL first/})).toHaveAttribute('href','/demo/jordan');
 await expect(page.getByRole('link',{name:/Sam Quiet text/})).toHaveAttribute('href','/demo/sam');
});

test('Maya opens the transformed picture experience without in-view navigation',async({page})=>{
 await page.goto('/demo/maya');await expect(page.getByRole('heading',{name:'Inclusive Design Summit'})).toBeVisible();
 await expect(page.locator('main')).toHaveAttribute('data-experience','pictures');
 await expect(page.getByRole('tab',{name:/Session 1/})).toBeVisible();
 await expect(page.getByRole('button',{name:'Remember these settings on this device'})).toHaveCount(0);
 await expect(page.getByRole('button',{name:/American Sign Language/})).toHaveCount(0);
 await expect(page.getByRole('button',{name:/Accessible text/})).toHaveCount(0);
 await expect(page.getByRole('link',{name:/Start over|kiosk start|welcome kiosk/i})).toHaveCount(0);
 await expect(page.getByText('Do next: Follow the green floor markers to Main Hall before 9:00 AM.')).toBeHidden();
 await expect(page.getByText('See the steps')).toBeHidden();
 await expect(page.getByRole('heading',{name:'Start with the people: an inclusive design foundation'})).toHaveCount(0);
 await expect(page.locator('.visually-hidden')).toContainText('Start with the people: an inclusive design foundation');
 await expect(page.getByRole('img',{name:/group plans together around a table/i})).toBeVisible();
 await page.setViewportSize({width:390,height:844});
 for(const [index,alt] of [[1,/group plans together around a table/i],[2,/person uses a computer and keyboard/i],[3,/people consult a map/i]] as const){
  if(index>1)await page.getByRole('tab',{name:new RegExp(`Session ${index}`)}).click();
  const image=page.getByRole('img',{name:alt});await expect(image).toBeVisible();
  await image.evaluate(element=>(element as HTMLImageElement).decode());
  const fit=await image.evaluate(element=>{const box=element.parentElement!.getBoundingClientRect(),style=getComputedStyle(element);return {width:box.width,height:box.height,ratio:box.width/box.height,objectFit:style.objectFit,complete:(element as HTMLImageElement).complete};});
  expect(fit.width).toBeGreaterThan(250);expect(fit.ratio).toBeCloseTo(1600/893,1);expect(fit.objectFit).toBe('contain');expect(fit.complete).toBeTruthy();
 }
 await page.getByRole('tab',{name:/Session 2/}).click();
 await expect(page.getByRole('img',{name:/person uses a computer and keyboard/i})).toBeVisible();
 await expect(page.getByRole('img',{name:/person uses a computer and keyboard/i})).toHaveAttribute('src',/ids_image_session_2\.jpg/);
 await page.getByRole('tab',{name:/Session 3/}).click();
 await expect(page.getByRole('img',{name:/people consult a map/i})).toBeVisible();
});

test('Jordan can play the combined local ASL draft with its review status disclosed',async({page})=>{
 await page.goto('/demo/jordan');
 const video=page.locator('video[aria-label="Combined American Sign Language conference recording"]');
 await expect(video).toBeVisible();
 await expect(video.locator('source').first()).toHaveAttribute('src','/demo-media/ids_asl_video.webm');
 await expect(video).not.toHaveAttribute('muted','');
 await expect(page.getByText(/Combined conference recording · draft for fluent review/)).toBeVisible();
 const clip=await page.request.get('/demo-media/ids_asl_video.webm');
 expect(clip.ok()).toBeTruthy();
 expect(clip.headers()['content-type']).toContain('video/webm');
 expect((await clip.body()).byteLength).toBeGreaterThan(100000);
 await expect.poll(()=>video.evaluate((element:HTMLVideoElement)=>element.readyState)).toBeGreaterThanOrEqual(1);
 const mediaState=await video.evaluate((element:HTMLVideoElement)=>({duration:element.duration,muted:element.muted,volume:element.volume}));
 expect(mediaState.duration).toBeGreaterThan(9);expect(mediaState.muted).toBe(false);expect(mediaState.volume).toBeGreaterThan(0);
 await video.evaluate((element:HTMLVideoElement)=>element.play());
 await expect.poll(()=>video.evaluate((element:HTMLVideoElement)=>element.currentTime)).toBeGreaterThan(0.25);
 const audio=page.locator('#conference-audio');
 await expect(audio).toBeVisible();
 await expect(audio.locator('source')).toHaveAttribute('src','/demo-media/ids_asl_audio.mp3');
 const audioResponse=await page.request.get('/demo-media/ids_asl_audio.mp3');
 expect(audioResponse.ok()).toBeTruthy();expect(audioResponse.headers()['content-type']).toContain('audio/mpeg');
 const audioState=await audio.evaluate((element:HTMLAudioElement)=>({muted:element.muted,volume:element.volume,duration:element.duration}));
 expect(audioState.muted).toBe(false);expect(audioState.volume).toBeGreaterThan(0);expect(audioState.duration).toBeGreaterThan(9);
 await audio.evaluate((element:HTMLAudioElement)=>element.play());
 await expect.poll(()=>audio.evaluate((element:HTMLAudioElement)=>element.currentTime)).toBeGreaterThan(0.25);
});

test('general visitor opens a focused, full agenda view',async({page})=>{
 await page.goto('/kiosk');
 await expect(page.getByRole('link',{name:/Continue as a general visitor/})).toBeVisible();
 await page.getByRole('link',{name:/Continue as a general visitor/}).click();
 await expect(page.getByRole('heading',{name:'Today’s agenda'})).toBeVisible();
 await expect(page.locator('main')).toHaveAttribute('data-experience','text');
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
 await page.getByLabel('Show pictures alongside my main view').check();
 await expect(page.getByRole('checkbox',{name:'Show pictures alongside my main view'})).toBeChecked();
});
