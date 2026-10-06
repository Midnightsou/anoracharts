const seed = {
  artists: [
    {id:'a1',name:'Nia Vale',image:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80',genre:'Alt Pop'},
    {id:'a2',name:'Kairo Saint',image:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',genre:'Afrofusion'},
    {id:'a3',name:'Mira Sol',image:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',genre:'R&B'},
    {id:'a4',name:'Northside Juno',image:'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80',genre:'Hip-Hop'},
    {id:'a5',name:'Lena Grey',image:'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80',genre:'Pop'},
    {id:'a6',name:'Tayo Rivers',image:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80',genre:'Afrobeats'}
  ],
  albums: [
    {id:'al1',title:'Midnight Cinema',artistId:'a1',cover:'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80',year:2026},
    {id:'al2',title:'Neon Lagos',artistId:'a2',cover:'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80',year:2026},
    {id:'al3',title:'Velvet Hours',artistId:'a3',cover:'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=900&q=80',year:2026},
    {id:'al4',title:'No Sleep',artistId:'a4',cover:'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=900&q=80',year:2026},
    {id:'al5',title:'Silverline',artistId:'a5',cover:'https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?auto=format&fit=crop&w=900&q=80',year:2026},
    {id:'al6',title:'Palmwine Radio',artistId:'a6',cover:'https://images.unsplash.com/photo-1524650359799-842906ca1c06?auto=format&fit=crop&w=900&q=80',year:2026}
  ],
  songs: [
    {id:'s1',title:'Afterglow',artistId:'a1',albumId:'al1'}, {id:'s2',title:'No Signal',artistId:'a2',albumId:'al2'},
    {id:'s3',title:'Slow Motion',artistId:'a3',albumId:'al3'}, {id:'s4',title:'Streetlights',artistId:'a4',albumId:'al4'},
    {id:'s5',title:'Paper Moons',artistId:'a5',albumId:'al5'}, {id:'s6',title:'Palmwine',artistId:'a6',albumId:'al6'},
    {id:'s7',title:'Cinema Blue',artistId:'a1',albumId:'al1'}, {id:'s8',title:'Mainland',artistId:'a2',albumId:'al2'},
    {id:'s9',title:'Velvet',artistId:'a3',albumId:'al3'}, {id:'s10',title:'Overtime',artistId:'a4',albumId:'al4'},
    {id:'s11',title:'Static Hearts',artistId:'a5',albumId:'al5'}, {id:'s12',title:'Waterline',artistId:'a6',albumId:'al6'}
  ],
  chartWeeks:[
    {id:'w1',date:'2026-10-04',status:'published',entries:[
      ['s1',1,1,12450],['s2',2,5,11820],['s3',3,2,11190],['s4',4,8,10870],['s5',5,4,10210],['s6',6,null,9850],['s7',7,10,9320],['s8',8,6,9010],['s9',9,7,8700],['s10',10,14,8400],['s11',11,11,8010],['s12',12,20,7720]
    ].map(([songId,rank,previousRank,points],i)=>({songId,rank,previousRank,points,peak:Math.min(rank,previousRank||rank),weeks:Math.max(1,15-i)}))}
  ],
  awards:[
    {category:'Song of the Year',winnerType:'song',winnerId:'s1'},
    {category:'Artist of the Year',winnerType:'artist',winnerId:'a2'},
    {category:'Album of the Year',winnerType:'album',winnerId:'al3'},
    {category:'Best New Artist',winnerType:'artist',winnerId:'a6'}
  ],
  stories:[
    {headline:'Nia Vale keeps the crown with “Afterglow”',text:'The alt-pop standout logs another week at No. 1 after holding off a fast-rising challenge from Kairo Saint.'},
    {headline:'No Signal jumps into the Top 2',text:'Kairo Saint posts the week’s biggest Top 5 climb.'},
    {headline:'Palmwine debuts at No. 6',text:'Tayo Rivers scores the strongest debut of the week.'}
  ]
};

function loadData(){const x=localStorage.getItem('anorachartsData');if(x){try{return JSON.parse(x)}catch(e){}} localStorage.setItem('anorachartsData',JSON.stringify(seed));return structuredClone(seed)}
let data=loadData();
const app=document.getElementById('app');
const byId=(list,id)=>list.find(x=>x.id===id);
const latestWeek=()=>data.chartWeeks.filter(w=>w.status==='published').sort((a,b)=>b.date.localeCompare(a.date))[0];
const artForSong=s=>{const album=byId(data.albums,s.albumId);return s.artwork||album?.cover||''};
const artistForSong=s=>byId(data.artists,s.artistId);
const albumForSong=s=>byId(data.albums,s.albumId);
const movement=e=>{if(e.previousRank==null)return '<span class="movement new">NEW</span>';const diff=e.previousRank-e.rank;if(diff>0)return `<span class="movement up">▲ ${diff}</span>`;if(diff<0)return `<span class="movement down">▼ ${Math.abs(diff)}</span>`;return '<span class="movement">—</span>'};
const fmtDate=d=>new Date(d+'T12:00:00').toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'});

function chartRows(entries,limit){return entries.slice(0,limit||entries.length).map(e=>{const s=byId(data.songs,e.songId),a=artistForSong(s);return `<div class="chart-row" data-song="${s.id}">
<div class="rank">${String(e.rank).padStart(2,'0')}</div><img class="cover" src="${artForSong(s)}" alt="${s.title}">
<div><div class="song-title">${s.title}</div><div class="song-artist">${a?.name||''}</div></div>
<div class="movement-col">${movement(e)}</div>
<div class="optional"><div class="metric-label">Peak</div><div class="metric-value">#${e.peak}</div></div>
<div class="optional"><div class="metric-label">Weeks</div><div class="metric-value">${e.weeks}</div></div>
<div class="optional"><div class="metric-label">Points</div><div class="metric-value">${e.points.toLocaleString()}</div></div>
</div>`}).join('')}

function home(){const w=latestWeek();if(!w)return emptyPage('No published chart yet.');const top=w.entries.find(e=>e.rank===1),s=byId(data.songs,top.songId),a=artistForSong(s);const biggest=w.entries.filter(e=>e.previousRank).sort((x,y)=>(y.previousRank-y.rank)-(x.previousRank-x.rank))[0];const debut=w.entries.find(e=>e.previousRank==null);const bSong=byId(data.songs,biggest.songId),dSong=debut?byId(data.songs,debut.songId):null;
return `<section class="hero"><div class="hero-grid"><div><div class="hero-kicker eyebrow">This Week's #1</div><div class="hero-rank">01</div><h1 class="hero-title">${s.title}</h1><div class="hero-artist">${a.name}</div><div class="hero-stats"><span class="stat-pill">Peak #${top.peak}</span><span class="stat-pill">${top.weeks} weeks charted</span><span class="stat-pill">${top.points.toLocaleString()} points</span><span class="stat-pill">Week of ${fmtDate(w.date)}</span></div><a class="hero-cta" href="#hot100">View Full Chart</a></div><div class="hero-art"><img src="${artForSong(s)}" alt="${s.title}"></div></div></section>
<section class="section"><div class="section-head"><div><div class="eyebrow">Weekly ranking</div><h2 class="section-title">Top 10</h2></div><a class="section-link" href="#hot100">See Hot 100 →</a></div><div class="chart-list top10">${chartRows(w.entries,10)}</div></section>
<section class="section"><div class="section-head"><div><div class="eyebrow">Movement</div><h2 class="section-title">This Week</h2></div></div><div class="highlight-grid"><div class="highlight"><div class="highlight-label">Biggest Climber</div><div><div class="highlight-value">${bSong.title}</div><div class="highlight-sub">${artistForSong(bSong).name} · ${movement(biggest)}</div></div></div><div class="highlight"><div class="highlight-label">Biggest Debut</div><div><div class="highlight-value">${dSong?dSong.title:'—'}</div><div class="highlight-sub">${dSong?artistForSong(dSong).name:'No debut'}${debut?` · #${debut.rank}`:''}</div></div></div><div class="highlight"><div class="highlight-label">Highest Points</div><div><div class="highlight-value">${top.points.toLocaleString()}</div><div class="highlight-sub">${s.title}</div></div></div></div></section>
<section class="section"><div class="section-head"><div><div class="eyebrow">Editorial</div><h2 class="section-title">Chart Stories</h2></div></div><div class="story-grid">${data.stories.map((st,i)=>`<article class="story"><h3>${st.headline}</h3><p>${st.text}</p></article>`).join('')}</div></section>`}

function hot100(){const w=latestWeek();return `<section class="page-hero"><div class="eyebrow">Official weekly chart</div><h1>HOT 100</h1><p>Week of ${fmtDate(w.date)}. Rankings are based on the chart points published for this week.</p><div class="controls"><button class="btn">← Previous Week</button><select class="select"><option>${fmtDate(w.date)}</option></select><button class="btn">Archive</button></div></section><section class="section"><div class="chart-list">${chartRows(w.entries)}</div></section>`}
function artists(){const w=latestWeek();const scores={};w.entries.forEach(e=>{const s=byId(data.songs,e.songId);scores[s.artistId]=(scores[s.artistId]||0)+e.points});const list=Object.entries(scores).sort((a,b)=>b[1]-a[1]);return `<section class="page-hero"><div class="eyebrow">Weekly performance</div><h1>ARTISTS</h1><p>The artists with the strongest combined chart performance this week.</p></section><section class="section"><div class="grid-cards">${list.map(([id,pts],i)=>{const a=byId(data.artists,id);return `<article class="entity-card"><div class="entity-rank">${String(i+1).padStart(2,'0')}</div><img src="${a.image}" alt="${a.name}"><h3>${a.name}</h3><p>${a.genre} · ${pts.toLocaleString()} points</p></article>`}).join('')}</div></section>`}
function albums(){const w=latestWeek();const scores={};w.entries.forEach(e=>{const s=byId(data.songs,e.songId);scores[s.albumId]=(scores[s.albumId]||0)+e.points});const list=Object.entries(scores).sort((a,b)=>b[1]-a[1]);return `<section class="page-hero"><div class="eyebrow">Weekly performance</div><h1>ALBUMS</h1><p>Albums ranked by combined song performance on the latest chart.</p></section><section class="section"><div class="grid-cards">${list.map(([id,pts],i)=>{const al=byId(data.albums,id),a=byId(data.artists,al.artistId);return `<article class="entity-card"><div class="entity-rank">${String(i+1).padStart(2,'0')}</div><img src="${al.cover}" alt="${al.title}"><h3>${al.title}</h3><p>${a.name} · ${pts.toLocaleString()} points</p></article>`}).join('')}</div></section>`}
function records(){const w=latestWeek();const top=w.entries[0],longest=[...w.entries].sort((a,b)=>b.weeks-a.weeks)[0],jump=[...w.entries].filter(e=>e.previousRank).sort((a,b)=>(b.previousRank-b.rank)-(a.previousRank-a.rank))[0];const items=[['Current No. 1',byId(data.songs,top.songId).title,'#1'],['Longest Charting',byId(data.songs,longest.songId).title,`${longest.weeks} weeks`],['Biggest Jump',byId(data.songs,jump.songId).title,`+${jump.previousRank-jump.rank}`],['Highest Weekly Points',byId(data.songs,top.songId).title,top.points.toLocaleString()]];return `<section class="page-hero"><div class="eyebrow">All-time and current benchmarks</div><h1>RECORDS</h1><p>Standout chart achievements generated from Anoracharts data.</p></section><section class="section"><div class="record-list">${items.map(x=>`<article class="record-card"><div class="record-title">${x[0]}</div><div class="record-holder">${x[1]}</div><div class="record-value">${x[2]}</div></article>`).join('')}</div></section>`}
function awards(){return `<section class="page-hero"><div class="eyebrow">2026 edition</div><h1>AWARDS</h1><p>The Anoracharts Awards celebrate the songs, artists and albums that defined the year.</p></section><section class="section"><div class="awards-grid">${data.awards.map(x=>{let name='',img='';if(x.winnerType==='song'){const s=byId(data.songs,x.winnerId);name=`${s.title} — ${artistForSong(s).name}`;img=artForSong(s)}if(x.winnerType==='artist'){const a=byId(data.artists,x.winnerId);name=a.name;img=a.image}if(x.winnerType==='album'){const al=byId(data.albums,x.winnerId);name=`${al.title} — ${byId(data.artists,al.artistId).name}`;img=al.cover}return `<article class="award-card"><small>Winner</small><h3>${x.category}</h3><div class="winner"><img src="${img}" alt=""><div><strong>${name}</strong><div class="meta">2026 Anoracharts Awards</div></div></div></article>`}).join('')}</div></section>`}
function emptyPage(msg){return `<section class="section"><div class="empty">${msg}</div></section>`}
function render(){data=loadData();const route=(location.hash||'#home').slice(1);const map={home,hot100,artists,albums,records,awards};app.innerHTML=(map[route]||home)();window.scrollTo({top:0,behavior:'instant'})}
window.addEventListener('hashchange',render);render();

document.getElementById('year').textContent=new Date().getFullYear();const menuBtn=document.getElementById('menuBtn'),mobileMenu=document.getElementById('mobileMenu');menuBtn.onclick=()=>mobileMenu.classList.toggle('open');mobileMenu.querySelectorAll('a').forEach(a=>a.onclick=()=>mobileMenu.classList.remove('open'));
const overlay=document.getElementById('searchOverlay'),searchBtn=document.getElementById('searchBtn'),closeSearch=document.getElementById('closeSearch'),input=document.getElementById('globalSearch'),results=document.getElementById('searchResults');searchBtn.onclick=()=>{overlay.classList.add('open');overlay.setAttribute('aria-hidden','false');setTimeout(()=>input.focus(),50)};closeSearch.onclick=()=>overlay.classList.remove('open');overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.classList.remove('open')});input.addEventListener('input',()=>{const q=input.value.trim().toLowerCase();if(!q){results.innerHTML='';return}const rows=[];data.songs.filter(x=>x.title.toLowerCase().includes(q)).forEach(s=>rows.push({name:s.title,sub:`Song · ${artistForSong(s).name}`,img:artForSong(s)}));data.artists.filter(x=>x.name.toLowerCase().includes(q)).forEach(a=>rows.push({name:a.name,sub:'Artist',img:a.image}));data.albums.filter(x=>x.title.toLowerCase().includes(q)).forEach(al=>rows.push({name:al.title,sub:`Album · ${byId(data.artists,al.artistId).name}`,img:al.cover}));results.innerHTML=rows.length?rows.slice(0,12).map(r=>`<div class="search-result"><img src="${r.img}" alt=""><div><strong>${r.name}</strong><span>${r.sub}</span></div></div>`).join(''):'<div class="empty">No results found.</div>'});
