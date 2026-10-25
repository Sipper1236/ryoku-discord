const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');const fs=require('node:fs');
const out=process.env.RYOKU_BENCH_OUTPUT || '/tmp/ryoku-channel-switch.json';
const paths=process.argv.slice(2);
if(paths.length!==2||paths.some(p=>!/^\/channels\/\d+\/\d+$/.test(p))||paths[0]===paths[1]){console.error('Usage: node tools/benchmark-channel-switching.cjs /channels/GUILD/CHANNEL_A /channels/GUILD/CHANNEL_B');process.exit(1)}
const count=Number(process.env.RYOKU_SWITCHES_PER_BATCH || 4);
if(!Number.isInteger(count)||count<2||count%2){throw Error('RYOKU_SWITCHES_PER_BATCH must be a positive even integer >= 2')}
let original;
(async()=>{const b=await chromium.connectOverCDP(process.env.RYOKU_CDP_URL || 'http://127.0.0.1:9224');let p;const samples=[];try{
p=b.contexts()[0].pages().find(p=>p.url().includes('discord.com'));p.setDefaultTimeout(30000);await p.keyboard.press('Escape');await p.setViewportSize({width:1600,height:1000});
original=await p.evaluate(()=>({path:location.pathname,themes:[...Vencord.Settings.enabledThemes]}));
const config={targets:paths.map(path=>({id:path.split('/').at(-1),path}))};
const c=await p.context().newCDPSession(p);await c.send('Performance.enable');const metrics=async()=>Object.fromEntries((await c.send('Performance.getMetrics')).metrics.map(x=>[x.name,x.value]));
async function navigate(target,measure=false){
if(measure&&await p.evaluate(path=>location.pathname===path,target.path))throw Error('Measurement would not switch channels');const before=measure?await metrics():null;
await p.evaluate(path=>{window.__ryokuRecordFrames=false;window.__ryokuSwitchStart=performance.now();Vencord.Webpack.Common.NavigationRouter.transitionTo(path)},target.path);
await p.waitForFunction(id=>{const ol=document.querySelector('ol[data-list-id="chat-messages"]');return ol&&ol.querySelector(`[id^="chat-messages-${id}-"]`)},target.id);
const ready=await p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve({readyMs:performance.now()-window.__ryokuSwitchStart,messages:document.querySelectorAll('ol[data-list-id="chat-messages"] > li').length})))));
await p.locator('ol[data-list-id="chat-messages"]').evaluate(async el=>{await Promise.allSettled(el.getAnimations().map(a=>a.finished))});
await p.waitForTimeout(100);
const result=await p.evaluate(()=>({settledMs:performance.now()-window.__ryokuSwitchStart}));
if(!measure)return;
const after=await metrics();return {...ready,...result,...Object.fromEntries(['TaskDuration','ScriptDuration','RecalcStyleDuration','LayoutDuration','RecalcStyleCount','LayoutCount'].map(k=>[k,+(after[k]-before[k]).toFixed(6)]))};}
console.log('Warming both text channels before measurement.');for(const t of config.targets)await navigate(t);let index=0;
for(const [batch,label]of ['upstream','optimized','optimized','upstream'].entries()){
 await p.evaluate(theme=>Vencord.Settings.enabledThemes=[theme],label==='upstream'?'Ryoku Upstream Control.theme.css':'Ryoku Optimized.theme.css');await p.waitForTimeout(1800);await p.evaluate(()=>document.fonts.ready);for(const target of config.targets)await navigate(target);index=1;await p.waitForTimeout(250);
 for(let i=0;i<count;i++){index=(index+1)%2;const result=await navigate(config.targets[index],true);const row={label,batch,transition:i,...result};samples.push(row);fs.writeFileSync(out,JSON.stringify({samples},null,2));console.log(JSON.stringify(row));}
}
await p.evaluate(()=>Vencord.Settings.enabledThemes=['Ryoku Optimized.theme.css']);await p.waitForTimeout(1000);
console.log('Channel comparison complete; restoring prior profile selection.');
}finally{if(p&&original)await p.evaluate(o=>{Vencord.Settings.enabledThemes=o.themes;Vencord.Webpack.Common.NavigationRouter.transitionTo(o.path)},original).catch(()=>{});await b.close()}})().catch(e=>{console.error(e.message);process.exit(1)});
