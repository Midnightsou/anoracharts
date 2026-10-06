const DATA_KEY = 'anorachartsData';
const DATA_VERSION = 2;

const artistNames = [
  'Nia Vale','Kairo Saint','Mira Sol','Northside Juno','Lena Grey','Tayo Rivers','Ari Bloom','Jett Nova','Sena Ray','Milo Chase',
  'Zuri Lane','Dane Kells','Ivy Stone','Rex Monte','Ama Grey','Sol Kade','Nora Vee','Theo Mars','Kemi Lux','Rio Ash'
];
const albumNames = [
  'Midnight Cinema','Neon Lagos','Velvet Hours','No Sleep','Silverline','Palmwine Radio','Electric Blue','After Hours','Glass City','Wild Signal',
  'Moon Hotel','Night Drive','Soft Static','Red Room','Golden Noise','Last Summer','Black Roses','Parallel Lines','Cloud Nine','Open Late'
];
const songWordsA = ['Afterglow','No Signal','Slow Motion','Streetlights','Paper Moons','Palmwine','Cinema Blue','Mainland','Velvet','Overtime','Static Hearts','Waterline','Lowkey','Gravity','Replay','Night Shift','Headlights','Stay Close','Energy','Frequency'];
const songWordsB = ['Again','Tonight','Forever','Downtown','On Me','Dreams','Season','Rush','Outside','Echoes','Blue','Gold','Motion','Heat','Lights','Radio','Signs','High','Away','Closer'];

function buildSeed(){
  const artists = artistNames.map((name,i)=>({
    id:`a${i+1}`,name,genre:['Alt Pop','Afrofusion','R&B','Hip-Hop','Pop','Afrobeats'][i%6],
    country:['Nigeria','United Kingdom','United States','Ghana','South Africa'][i%5],
    bio:`${name} is an independent artist tracked by Anoracharts.`,
    image:`https://picsum.photos/seed/anora-artist-${i+1}/700/700`
  }));
  const albums = albumNames.map((title,i)=>({
    id:`al${i+1}`,title,artistId:artists[i].id,cover:`https://picsum.photos/seed/anora-album-${i+1}/700/700`,year:2026,genre:artists[i].genre,type:'Album'
  }));
  const songs=[];
  for(let i=0;i<100;i++){
    const artistIndex=i%20;
    const albumIndex=i%20;
    const title = i<20 ? songWordsA[i] : `${songWordsA[i%20]} ${songWordsB[Math.floor(i/20)%20]}`;
    songs.push({id:`s${i+1}`,title,artistId:artists[artistIndex].id,albumId:albums[albumIndex].id,artwork:'',releaseDate:`2026-${String((i%9)+1).padStart(2,'0')}-${String((i%27)+1).padStart(2,'0')}`,genre:artists[artistIndex].genre});
  }
  const entries=songs.map((s,i)=>{
    const rank=i+1;
    const prev = rank===1?1:Math.max(1,Math.min(100,rank + ((i%7)-3)));
    return {songId:s.id,rank,previousRank:i%13===0?null:prev,points:Math.max(1100,12850-i*105),peak:Math.min(rank,prev||rank),weeks:1+(i%34)};
  });
  return {
    version:DATA_VERSION,
    artists,albums,songs,
    chartWeeks:[{id:'w1',date:'2026-10-04',status:'published',name:'Anoracharts Hot 100',entries}],
    awards:[
      {category:'Song of the Year',winnerType:'song',winnerId:'s1'},
      {category:'Artist of the Year',winnerType:'artist',winnerId:'a2'},
      {category:'Album of the Year',winnerType:'album',winnerId:'al3'},
      {category:'Best New Artist',winnerType:'artist',winnerId:'a6'}
    ],
    stories:[
      {headline:'Nia Vale keeps the crown with “Afterglow”',text:'The alt-pop standout logs another week at No. 1.'},
      {headline:'No Signal surges near the summit',text:'Kairo Saint continues one of the strongest chart runs of the week.'},
      {headline:'Fresh entries reshape the Hot 100',text:'New releases arrive across the full 100-position ranking.'}
    ]
  };
}
function loadData(){
  const raw=localStorage.getItem(DATA_KEY);
  if(raw){try{const parsed=JSON.parse(raw);if(parsed.version===DATA_VERSION)return parsed;}catch(e){}}
  const seed=buildSeed(); localStorage.setItem(DATA_KEY,JSON.stringify(seed)); return seed;
}
let data=loadData();
const app=document.getElementById('app');
const byId=(list,id)=>list.find(x=>x.id===id);
const esc=(v='')=>String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const latestWeek=()=>data.chartWeeks.filter(w=>w.status==='published').sort((a,b)=>b.date.localeCompare(a.date))[0];
const artistForSong=s=>s?byId(data.artists,s.artistId):null;
const albumForSong=s=>s?byId(data.albums,s.albumId):null;
const artForSong=s=>s?(s.artwork||albumForSong(s)?.cover||''):'';
const movement=e=>{if(e.previousRank==null)return '<span class="movement new">NEW</span>';const diff=e.previousRank-e.rank;if(diff>0)return `<span class="movement up">▲ ${diff}</span>`;if(diff<0)return `<span class="movement down">▼ ${Math.abs(diff)}</span>`;return '<span class="movement">—</span>'};
const fmtDate=d=>new Date(d+'T12:00:00').toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'});

function chartRows(entries,limit){
  return [...entries].sort((a,b)=>a.rank-b.rank).slice(0,limit||entries.length).map(e=>{
    const s=byId(data.songs,e.songId); if(!s)return '';
    const a=artistForSong(s);
    return `<div class="chart-row" data-song="${esc(s.id)}">
      <div class="rank">${String(e.rank).padStart(2,'0')}</div>
      <img class="cover" src="${esc(artForSong(s))}" alt="${esc(s.title)}">
      <div><div class="song-title">${esc(s.title)}</div><div class="song-artist">${esc(a?.name||'Unknown artist')}</div></div>
      <div class="movement-col">${movement(e)}</div>
      <div class="optional"><div class="metric-label">Peak</div><div class="metric-value">#${e.peak}</div></div>
      <div class="optional"><div class="metric-label">Weeks</div><div class="metric-value">${e.weeks}</div></div>
      <div class="optional"><div class="metric-label">Points</div><div class="metric-value">${Number(e.points||0).toLocaleString()}</div></div>
    </div>`;
  }).join('');
}

function home(){
  const w=latestWeek(); if(!w){app.innerHTML='<div class="section empty">No published chart yet.</div>';return;}
  const entries=[...w.entries].sort((a,b)=>a.rank-b.rank);
  const top=entries[0],song=byId(data.songs,top?.songId),artist=artistForSong(song);
  const biggestClimber=entries.filter(e=>e.previousRank).sort((a,b)=>(b.previousRank-b.rank)-(a.previousRank-a.rank))[0];
  const debut=entries.find(e=>e.previousRank==null);
  const longest=[...entries].sort((a,b)=>b.weeks-a.weeks)[0];
  const h=(e,label)=>{const s=byId(data.songs,e?.songId);return `<div class="highlight"><div class="highlight-label">${label}</div><div><div class="highlight-value">${esc(s?.title||'—')}</div><div class="highlight-sub">${esc(artistForSong(s)?.name||'')}</div></div></div>`};
  app.innerHTML=`
    <section class="hero"><div class="hero-grid">
      <div><div class="hero-kicker eyebrow">This week's #1</div><div class="hero-rank">01</div><h1 class="hero-title">${esc(song?.title||'')}</h1><div class="hero-artist">${esc(artist?.name||'')}</div><div class="hero-stats"><span class="stat-pill">Peak #${top?.peak||1}</span><span class="stat-pill">${top?.weeks||1} weeks</span><span class="stat-pill">${Number(top?.points||0).toLocaleString()} pts</span><span class="stat-pill">Week of ${fmtDate(w.date)}</span></div><a class="hero-cta" href="#hot100">View full Hot 100</a></div>
      <div class="hero-art"><img src="${esc(artForSong(song))}" alt="${esc(song?.title||'')}"></div>
    </div></section>
    <section class="section"><div class="section-head"><div><div class="eyebrow">The chart</div><h2 class="section-title">Top 10</h2></div><a class="section-link" href="#hot100">See all 100</a></div><div class="chart-list top10">${chartRows(entries,10)}</div></section>
    <section class="section"><div class="section-head"><div><div class="eyebrow">This week</div><h2 class="section-title">Chart highlights</h2></div></div><div class="highlight-grid">${h(biggestClimber,'Biggest climber')}${h(debut,'Highest debut')}${h(longest,'Longest charting')}</div></section>
    <section class="section"><div class="section-head"><div><div class="eyebrow">Editorial</div><h2 class="section-title">Chart stories</h2></div></div><div class="story-grid">${data.stories.slice(0,3).map(s=>`<article class="story"><h3>${esc(s.headline)}</h3><p>${esc(s.text)}</p></article>`).join('')}</div></section>`;
}
function hot100(){
  const weeks=data.chartWeeks.filter(w=>w.status==='published').sort((a,b)=>b.date.localeCompare(a.date));
  const current=weeks[0];
  app.innerHTML=`<section class="page-hero"><div class="eyebrow">Weekly ranking</div><h1>HOT 100</h1><p>All 100 positions. Updated from the latest published chart week.</p><div class="controls"><select class="select" id="weekSelect">${weeks.map(w=>`<option value="${w.id}">${fmtDate(w.date)}</option>`).join('')}</select></div></section><section class="section"><div class="section-head"><div><div class="eyebrow">${current?`Week of ${fmtDate(current.date)}`:''}</div><h2 class="section-title">100 songs</h2></div></div><div class="chart-list" id="fullChart">${current?chartRows(current.entries):'<div class="empty">No chart available.</div>'}</div></section>`;
  const sel=document.getElementById('weekSelect'); if(sel)sel.onchange=()=>{const w=byId(data.chartWeeks,sel.value);document.getElementById('fullChart').innerHTML=chartRows(w.entries)};
}
function artistsPage(){
  const w=latestWeek(); const scores={}; (w?.entries||[]).forEach(e=>{const s=byId(data.songs,e.songId);if(s)scores[s.artistId]=(scores[s.artistId]||0)+Number(e.points||0)});
  const ranked=[...data.artists].sort((a,b)=>(scores[b.id]||0)-(scores[a.id]||0));
  app.innerHTML=`<section class="page-hero"><div class="eyebrow">Current ranking</div><h1>ARTISTS</h1><p>Artists ranked by current chart performance.</p></section><section class="section"><div class="grid-cards">${ranked.map((a,i)=>`<article class="entity-card"><div class="entity-rank">${String(i+1).padStart(2,'0')}</div><img src="${esc(a.image)}" alt="${esc(a.name)}"><h3>${esc(a.name)}</h3><p>${esc(a.genre||'')} · ${(scores[a.id]||0).toLocaleString()} pts</p></article>`).join('')}</div></section>`;
}
function albumsPage(){
  const w=latestWeek(); const scores={}; (w?.entries||[]).forEach(e=>{const s=byId(data.songs,e.songId);if(s?.albumId)scores[s.albumId]=(scores[s.albumId]||0)+Number(e.points||0)});
  const ranked=[...data.albums].sort((a,b)=>(scores[b.id]||0)-(scores[a.id]||0));
  app.innerHTML=`<section class="page-hero"><div class="eyebrow">Current ranking</div><h1>ALBUMS</h1><p>Albums powered by the songs charting this week.</p></section><section class="section"><div class="grid-cards">${ranked.map((al,i)=>`<article class="entity-card"><div class="entity-rank">${String(i+1).padStart(2,'0')}</div><img src="${esc(al.cover)}" alt="${esc(al.title)}"><h3>${esc(al.title)}</h3><p>${esc(byId(data.artists,al.artistId)?.name||'')} · ${(scores[al.id]||0).toLocaleString()} pts</p></article>`).join('')}</div></section>`;
}
function recordsPage(){
  const w=latestWeek(), entries=w?.entries||[];
  const mostWeeks=[...entries].sort((a,b)=>b.weeks-a.weeks)[0];
  const highestPoints=[...entries].sort((a,b)=>b.points-a.points)[0];
  const biggestJump=[...entries].filter(e=>e.previousRank).sort((a,b)=>(b.previousRank-b.rank)-(a.previousRank-a.rank))[0];
  const card=(title,e,val)=>{const s=byId(data.songs,e?.songId);return `<div class="record-card"><div class="record-title">${title}</div><div class="record-holder">${esc(s?.title||'—')}</div><div class="record-value">${val}</div><div class="meta">${esc(artistForSong(s)?.name||'')}</div></div>`};
  app.innerHTML=`<section class="page-hero"><div class="eyebrow">All-time and current</div><h1>RECORDS</h1><p>Notable Anoracharts achievements.</p></section><section class="section"><div class="record-list">${card('Longest charting',mostWeeks,`${mostWeeks?.weeks||0} weeks`)}${card('Highest weekly points',highestPoints,Number(highestPoints?.points||0).toLocaleString())}${card('Biggest jump',biggestJump,`+${Math.max(0,(biggestJump?.previousRank||0)-(biggestJump?.rank||0))}`)}${card('Current No. 1',entries.find(e=>e.rank===1),'#1')}</div></section>`;
}
function awardsPage(){
  const imageFor=(a)=>{if(a.winnerType==='artist')return byId(data.artists,a.winnerId)?.image;if(a.winnerType==='album')return byId(data.albums,a.winnerId)?.cover;const s=byId(data.songs,a.winnerId);return artForSong(s)};
  const labelFor=(a)=>{const list=a.winnerType==='artist'?data.artists:a.winnerType==='album'?data.albums:data.songs;const x=byId(list,a.winnerId);return x?.name||x?.title||'Unknown'};
  app.innerHTML=`<section class="page-hero"><div class="eyebrow">Anoracharts</div><h1>AWARDS</h1><p>Recognizing the artists, songs and albums that defined the year.</p></section><section class="section"><div class="awards-grid">${data.awards.map(a=>`<article class="award-card"><small>Winner</small><h3>${esc(a.category)}</h3><div class="winner"><img src="${esc(imageFor(a)||'')}" alt=""><div><strong>${esc(labelFor(a))}</strong><div class="meta">${esc(a.winnerType)}</div></div></div></article>`).join('')}</div></section>`;
}
function archivePage(){const weeks=data.chartWeeks.filter(w=>w.status==='published').sort((a,b)=>b.date.localeCompare(a.date));app.innerHTML=`<section class="page-hero"><div class="eyebrow">History</div><h1>ARCHIVE</h1></section><section class="section"><div class="record-list">${weeks.map(w=>`<div class="record-card"><div class="record-title">Published chart</div><div class="record-holder">${fmtDate(w.date)}</div><div class="record-value">${w.entries.length}</div><div class="meta">songs ranked</div></div>`).join('')}</div></section>`}
function render(){data=loadData();const route=(location.hash||'#home').slice(1).split('/')[0];({home,hot100,artists:artistsPage,albums:albumsPage,records:recordsPage,awards:awardsPage,archive:archivePage}[route]||home)();window.scrollTo(0,0)}
window.addEventListener('hashchange',render);window.addEventListener('storage',e=>{if(e.key===DATA_KEY)render()});render();

document.getElementById('year').textContent=new Date().getFullYear();
const menu=document.getElementById('mobileMenu');document.getElementById('menuBtn').onclick=()=>menu.classList.toggle('open');menu.querySelectorAll('a').forEach(a=>a.onclick=()=>menu.classList.remove('open'));
const overlay=document.getElementById('searchOverlay'),search=document.getElementById('globalSearch'),results=document.getElementById('searchResults');
document.getElementById('searchBtn').onclick=()=>{overlay.classList.add('open');overlay.setAttribute('aria-hidden','false');setTimeout(()=>search.focus(),50)};
document.getElementById('closeSearch').onclick=()=>{overlay.classList.remove('open');overlay.setAttribute('aria-hidden','true')};
search.oninput=()=>{const q=search.value.trim().toLowerCase();if(!q){results.innerHTML='';return;}const rows=[];data.songs.filter(s=>s.title.toLowerCase().includes(q)).slice(0,6).forEach(s=>rows.push({name:s.title,type:'Song',img:artForSong(s),sub:artistForSong(s)?.name||''}));data.artists.filter(a=>a.name.toLowerCase().includes(q)).slice(0,4).forEach(a=>rows.push({name:a.name,type:'Artist',img:a.image,sub:a.genre||''}));data.albums.filter(a=>a.title.toLowerCase().includes(q)).slice(0,4).forEach(a=>rows.push({name:a.title,type:'Album',img:a.cover,sub:byId(data.artists,a.artistId)?.name||''}));results.innerHTML=rows.length?rows.map(r=>`<div class="search-result"><img src="${esc(r.img)}"><div><strong>${esc(r.name)}</strong><span>${esc(r.type)} · ${esc(r.sub)}</span></div></div>`).join(''):'<div class="empty">No results.</div>'};
