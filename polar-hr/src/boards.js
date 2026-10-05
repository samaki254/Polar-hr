const L=(a)=>a.map(([label,color],i)=>({id:'o'+i,label,color}));
const G=(a)=>a.map((name,i)=>({id:'g'+i,name,color:['#c9a227','#1e2a78','#2e9e5b','#d64545','#6b7280','#8b5cf6','#0ea5e9'][i%7]}));
const t=(id,name,type='text',options)=>({id,name,type,options});
const ST={shortlisted:['Shortlisted','#2e9e5b'],review:['Under Review','#c9a227'],no:['Not Shortlisted','#d64545'],int:['Interview Selected','#1e2a78']};
export const BOARDS=[
{id:'candidates',name:'Candidate Contacts',item:'Contact',groups:['3 - Phase Industrial Electricians','Site Supervisors','System Administrators','Flour Millers','Refrigeration and Air Conditioning'],
 columns:[t('title','Title / Position'),t('status','Status','status',L(Object.values(ST))),t('avail','Availability','status',L([['AVAILABLE','#2e9e5b'],['1 WEEK NOTICE','#c9a227'],['NOTIFY EARLY','#f08a24'],['UNAVAILABLE','#d64545']])),t('phone','Phone','phone'),t('email','Email','email'),t('notes','Notes','longtext')],
 sample:{0:['Alex Onyango Omondi','Ochieng Samwel','Margaret Njeri','Chrispus Katana Odongo','Saidi Tembe Chea','Philip Odhiambo Ongudi','John Kamau Macharia','David Muthui'],1:['Naomi Kiboss','Bahati Okotchi Ronald','Ephantus Ndungu Wanyeki','Learmstrong Mugendi Muriithi','James Onyango Odiembo'],2:['Brenda Ingumba Kihamba',"Michelle Mong'are",'Wycliff Omoro','Daniel Quenton Maina','Reuben Munga Chibanza']}},
{id:'clients',name:'Client Engagements & Services',item:'Client',groups:['New Leads','Contacted','Qualified','Proposal Sent','Negotiation','Won','Lost'],
 columns:[t('contact','Contact Person'),t('phone','Phone','phone'),t('email','Email','email'),t('service','Service Required','status',L(['Recruitment & Talent Acquisition','Manpower Outsourcing','HR Audits','Strategic Planning','Job Evaluation','Temporary Staffing','Training','Team Building','Career Services','VIP Candidate Placement'].map(s=>[s,'#1e2a78']))),t('follow','Follow-Up Date','date'),t('value','Estimated Value (KES)','number'),t('notes','Notes','longtext')]},
{id:'visits',name:'Client Visits & Check-In Register',item:'Visit',groups:['Today','Upcoming','Past'],
 columns:[t('org','Organization'),t('purpose','Purpose'),t('who','Person Visited'),t('date','Date','date'),t('in','Check-in Time'),t('out','Check-out Time'),t('status','Status','status',L([['Expected','#6b7280'],['Checked In','#2e9e5b'],['Meeting','#1e2a78'],['Checked Out','#c9a227'],['Cancelled','#d64545']]))]},
{id:'recruitment',name:'Recruitment & Placement',item:'Vacancy',groups:['New Vacancy','Candidate Sourcing','Screening','Shortlisting','Interview','Client Review','Offer','Placement','Closed'],
 columns:[t('client','Client'),t('position','Position'),t('req','Number Required','number'),t('recruiter','Assigned Recruiter'),t('open','Opening Date','date'),t('close','Closing Date','date'),t('priority','Priority','status',L([['Low','#6b7280'],['Medium','#c9a227'],['High','#f08a24'],['Urgent','#d64545']]))]},
{id:'tasks',name:'Task / Work Management',item:'Task',groups:['To Do','In Progress','Waiting','Completed'],
 columns:[t('assignee','Assigned To'),t('priority','Priority','status',L([['Low','#6b7280'],['Medium','#c9a227'],['High','#f08a24'],['Urgent','#d64545']])),t('start','Start Date','date'),t('due','Due Date','date'),t('client','Related Client'),t('notes','Notes','longtext')]},
{id:'daily',name:'Daily Work Updates',item:'Update',groups:['This Week','Earlier'],
 columns:[t('date','Date','date'),t('done','Work Completed','longtext'),t('contacts','Clients / Candidates Contacted','longtext'),t('challenges','Challenges','longtext'),t('pending','Pending Work','longtext'),t('next','Next-Day Priorities','longtext')]},
{id:'marketing',name:'Marketing Update',item:'Activity',groups:['Active','Completed'],
 columns:[t('platform','Platform','status',L(['Facebook','Instagram','TikTok','LinkedIn','YouTube','Website','WhatsApp'].map(s=>[s,'#1e2a78']))),t('campaign','Campaign'),t('date','Date','date'),t('results','Results','longtext')]},
{id:'comms',name:'Communications & Follow-Ups',item:'Communication',groups:['Follow-Up Due','Done'],
 columns:[t('org','Organization'),t('type','Communication Type','status',L(['Phone Call','WhatsApp','Email','Meeting','SMS','Other'].map(s=>[s,'#1e2a78']))),t('date','Date','date'),t('purpose','Purpose'),t('outcome','Outcome','longtext'),t('next','Next Follow-Up','date')]},
{id:'finance',name:'Finance – Accounts Payable',item:'Payable',groups:['Pending Approval','Approved – Awaiting Payment','Due This Week','Overdue Payments','Paid'],
 columns:[t('amount','Amount Due (KES)','number'),t('due','Due Date','date'),t('pay','Payment Status','status',L([['PENDING APPROVAL','#c9a227'],['NOT PAID','#6b7280'],['OVERDUE','#d64545'],['PAID','#2e9e5b']])),t('by','Approved By'),t('paid','Payment Date','date'),t('ref','Reference Number')]},
{id:'social',name:'Social Media Schedule',item:'Post',groups:['This Week','Next Week','Upcoming & Ideas Pool'],
 columns:[t('owner','Owner'),t('platform','Platform','status',L(['Facebook','Instagram','TikTok','LinkedIn','YouTube'].map(s=>[s,'#1e2a78']))),t('status','Status','status',L([['Scheduled','#1e2a78'],['Published','#2e9e5b'],['Needs Review','#c9a227'],['Stuck','#d64545'],['Draft','#6b7280']])),t('date','Publish Date','date'),t('caption','Caption','longtext')]}
].map(b=>({...b,groups:G(b.groups)}));
