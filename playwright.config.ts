import {defineConfig,devices} from '@playwright/test';
export default defineConfig({testDir:'./tests/browser',fullyParallel:true,reporter:'list',use:{baseURL:'http://127.0.0.1:3171',trace:'retain-on-failure',...devices['Desktop Chrome']},
 webServer:{command:'npm run dev -- --hostname 127.0.0.1 --port 3171',url:'http://127.0.0.1:3171/api/health/live',reuseExistingServer:!process.env.CI,timeout:45_000}});
