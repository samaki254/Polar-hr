import React,{useEffect,useState,useMemo} from 'react';
import {onAuthStateChanged,signInWithEmailAndPassword,signOut,sendPasswordResetEmail} from 'firebase/auth';
import {collection,doc,onSnapshot,setDoc,addDoc,updateDoc,deleteDoc,getDoc,getDocs,getCountFromServer,serverTimestamp,writeBatch} from 'firebase/firestore';
import {auth,db} from './firebase';import {BOARDS} from './boards';
const uid=()=>Math.random().toString(36).slice(2,9);
const canSee=(role,id)=>id!=='finance'||['admin','finance','manager'].includes(role);

function Login(){const[e,setE]=useState(''),[p,setP]=useState(''),[m,setM]=useState('');
 const go=async()=>{try{await signInWithEmailAndPassword(auth,e,p)}catch{setM('Invalid email or password.')}};
 const reset=async()=>{if(!e)return setM('Enter your email first.');try{await sendPasswordResetEmail(auth,e);setM('Password reset email sent.')}catch{setM('Could not send reset email.')}};
 return <div className="login"><img src="/logo.png" width="100%"/><input placeholder="Email" value={e} onChange={x=>setE(x.target.value)}/><input type="password" placeholder="Password" value={p} onChange={x=>setP(x.target.value)} onKeyDown={x=>x.key==='Enter'&&go()}/><button className="p" onClick={go}>Sign in</button><button className="l" onClick={reset}>Forgot password?</button><div className="err">{m}</div></div>}

function Dashboard({profile,open}){const[c,setC]=useState({});
 useEffect(()=>{BOARDS.filter(b=>canSee(profile.role,b.id)).forEach(async b=>{try{const s=await getCountFromServer(collection(db,'boards',b.id,'items'));setC(o=>({...o,[b.id]:s.data().count}))}catch{}})},[profile.role]);
 return <><div className="top"><h2>Dashboard</h2></div><div className="cards">{BOARDS.filter(b=>canSee(profile.role,b.id)).map(b=><div key={b.id} className="card" onClick={()=>open(b.id)}><b>{c[b.id]??'–'}</b>{b.name}</div>)}</div></>}

function Cell({col,v,set}){
 if(col.type==='status'){const o=(col.options||[]).find(x=>x.id===v);return <select className="badge" style={{background:o?.color||'#9ca3af'}} value={v||''} onChange={x=>set(x.target.value)}><option value="">—</option>{(col.options||[]).map(x=><option key={x.id} value={x.id}>{x.label}</option>)}</select>}
 if(col.type==='checkbox')return <input type="checkbox" checked={!!v} onChange={x=>set(x.target.checked)}/>;
 const t={number:'number',currency:'number',date:'date',email:'email',phone:'tel',url:'url'}[col.type]||'text';
 return <input type={t} defaultValue={v||''} onBlur={x=>x.target.value!==(v||'')&&set(t==='number'?Number(x.target.value):x.target.value)}/>}

function Board({id,profile}){
 const[cfg,setCfg]=useState(null),[items,setItems]=useState([]),[q,setQ]=useState(''),[sort,setSort]=useState('');
 const ref=doc(db,'boards',id),isMgr=['admin','manager'].includes(profile.role);
 useEffect(()=>{const a=onSnapshot(ref,s=>setCfg(s.data()||null));const b=onSnapshot(collection(db,'boards',id,'items'),s=>setItems(s.docs.map(d=>({id:d.id,...d.data()}))));return()=>{a();b()}},[id]);
 const save=(patch)=>updateDoc(ref,patch);
 const shown=useMemo(()=>{let r=items.filter(i=>!q||JSON.stringify(i).toLowerCase().includes(q.toLowerCase()));if(sort)r=[...r].sort((a,b)=>String(a[sort]??a.values?.[sort]??'').localeCompare(String(b[sort]??b.values?.[sort]??''),undefined,{numeric:true}));return r},[items,q,sort]);
 if(!cfg)return <p>Loading… (if this persists, an administrator must run "Seed workspace" from the Dashboard menu.)</p>;
 const addItem=(g)=>addDoc(collection(db,'boards',id,'items'),{name:'New '+cfg.item,groupId:g,values:{},createdAt:serverTimestamp(),createdBy:auth.currentUser.uid});
 const setVal=(i,c,v)=>updateDoc(doc(db,'boards',id,'items',i.id),{['values.'+c]:v,updatedAt:serverTimestamp()});
 const addGroup=()=>{const n=prompt('Group name');if(n)save({groups:[...cfg.groups,{id:uid(),name:n,color:'#1e2a78'}]})};
 const renameGroup=(g)=>{const n=prompt('Rename group',g.name);if(n)save({groups:cfg.groups.map(x=>x.id===g.id?{...x,name:n}:x)})};
 const delGroup=(g)=>confirm('Delete group "'+g.name+'" ? This action cannot be undone.')&&save({groups:cfg.groups.filter(x=>x.id!==g.id)});
 const addCol=()=>{const name=prompt('Column name');if(!name)return;const type=prompt('Type: text, longtext, number, date, phone, email, url, checkbox, status','text');let options;if(type==='status'){options=(prompt('Labels, comma separated','Open,Done')||'').split(',').filter(Boolean).map((l,k)=>({id:uid(),label:l.trim(),color:['#c9a227','#2e9e5b','#d64545','#1e2a78'][k%4]}))}save({columns:[...cfg.columns,{id:uid(),name,type,options}]})};
 const delCol=(c)=>confirm('Delete column "'+c.name+'"? This action cannot be undone.')&&save({columns:cfg.columns.filter(x=>x.id!==c.id)});
 const addLabel=(c)=>{const l=prompt('New label for '+c.name);if(l)save({columns:cfg.columns.map(x=>x.id===c.id?{...x,options:[...x.options,{id:uid(),label:l,color:prompt('Color hex','#1e2a78')||'#1e2a78'}]}:x)})};
 const csv=()=>{const rows=[['Name',...cfg.columns.map(c=>c.name)],...items.map(i=>[i.name,...cfg.columns.map(c=>{const v=i.values?.[c.id];return c.type==='status'?c.options.find(o=>o.id===v)?.label||'':v??''})])];const b=new Blob([rows.map(r=>r.map(x=>'"'+String(x).replace(/"/g,'""')+'"').join(',')).join('\n')],{type:'text/csv'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=id+'.csv';a.click()};
 return <><div className="top"><h2>{cfg.name}</h2><input placeholder="Quick find…" value={q} onChange={e=>setQ(e.target.value)}/><select value={sort} onChange={e=>setSort(e.target.value)}><option value="">Sort: none</option><option value="name">Name</option>{cfg.columns.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select><button onClick={csv}>Export CSV</button>{isMgr&&<button onClick={addCol}>+ Add Column</button>}</div>
 {cfg.groups.map(g=>{const rows=shown.filter(i=>i.groupId===g.id);return <div className="grp" key={g.id}><div className="gh" style={{borderColor:g.color}}>{g.name} <small>({rows.length})</small>{isMgr&&<><button className="l" onClick={()=>renameGroup(g)}>Rename</button><button className="l d" onClick={()=>delGroup(g)}>Delete</button></>}</div>
 {rows.length===0?<p style={{padding:'0 14px'}}>No {cfg.item.toLowerCase()}s yet.</p>:<table><thead><tr><th>Name</th>{cfg.columns.map(c=><th key={c.id}>{c.name}{c.type==='status'&&isMgr&&<button className="l" onClick={()=>addLabel(c)}>+label</button>}{isMgr&&<button className="l d" onClick={()=>delCol(c)}>×</button>}</th>)}<th/></tr></thead><tbody>{rows.map(i=><tr key={i.id}><td><input defaultValue={i.name} onBlur={e=>e.target.value!==i.name&&updateDoc(doc(db,'boards',id,'items',i.id),{name:e.target.value})}/></td>{cfg.columns.map(c=><td key={c.id}><Cell col={c} v={i.values?.[c.id]} set={v=>setVal(i,c.id,v)}/></td>)}<td>{profile.role!=='staff'&&<button className="l d" onClick={()=>confirm('Delete '+cfg.item+'? This action cannot be undone.')&&deleteDoc(doc(db,'boards',id,'items',i.id))}>Delete</button>}</td></tr>)}</tbody></table>}
 <div style={{padding:8}}><button className="l" onClick={()=>addItem(g.id)}>+ Add {cfg.item}</button></div></div>})}
 {isMgr&&<button onClick={addGroup}>+ Add Group</button>}</>}

export default function App(){
 const[user,setUser]=useState(undefined),[profile,setProfile]=useState(null),[view,setView]=useState('dash'),[online,setOnline]=useState(navigator.onLine),[msg,setMsg]=useState('');
 useEffect(()=>onAuthStateChanged(auth,async u=>{setUser(u);setProfile(null);if(u){const s=await getDoc(doc(db,'users',u.uid));setProfile(s.exists()?s.data():{role:'none'})}}),[]);
 useEffect(()=>{const f=()=>setOnline(navigator.onLine);addEventListener('online',f);addEventListener('offline',f);return()=>{removeEventListener('online',f);removeEventListener('offline',f)}},[]);
 if(user===undefined)return <p>Loading…</p>;if(!user)return <Login/>;if(!profile)return <p>Loading…</p>;
 if(profile.role==='none'||profile.active===false)return <div className="login"><p>Your account has not been set up. Please contact a Polar HR administrator.</p><button onClick={()=>signOut(auth)}>Sign out</button></div>;
 const seed=async()=>{if(!confirm('Create the default Polar HR boards and sample data? Existing boards are skipped.'))return;for(const b of BOARDS){const r=doc(db,'boards',b.id);if((await getDoc(r)).exists())continue;const{sample,...cfg}=b;await setDoc(r,cfg);if(sample){const w=writeBatch(db);Object.entries(sample).forEach(([gi,names])=>names.forEach(n=>w.set(doc(collection(db,'boards',b.id,'items')),{name:n,groupId:b.groups[gi].id,values:{},createdAt:serverTimestamp()})));await w.commit()}}setMsg('Workspace seeded.')};
 return <div className="app">{!online&&<div className="bar">Offline — changes will sync when connection is restored.</div>}
 <nav className="side"><img src="/logo.png"/><h6>WORKSPACE</h6><a className={view==='dash'?'on':''} onClick={()=>setView('dash')}>Dashboard</a>{BOARDS.filter(b=>canSee(profile.role,b.id)).map(b=><a key={b.id} className={view===b.id?'on':''} onClick={()=>setView(b.id)}>{b.name}</a>)}
 <h6>{profile.name||user.email} · {profile.role}</h6>{profile.role==='admin'&&<a onClick={seed}>Seed workspace</a>}<a onClick={()=>signOut(auth)}>Sign out</a></nav>
 <main className="main">{msg&&<p>{msg}</p>}{view==='dash'?<Dashboard profile={profile} open={setView}/>:<Board key={view} id={view} profile={profile}/>}</main></div>}
