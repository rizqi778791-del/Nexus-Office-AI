import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const app=express(); const PORT=process.env.PORT||3000;
const __dirname=path.dirname(fileURLToPath(import.meta.url));
app.use(express.json({limit:'30kb'}));
app.use(express.static(path.join(__dirname,'public')));
app.get('/api/health',(_req,res)=>res.json({ok:true,provider:process.env.GEMINI_API_KEY?'gemini':'not-configured'}));
app.post('/api/meeting',async(req,res)=>{
 try{
  const brief=String(req.body?.brief||'').trim();
  if(!brief)return res.status(400).json({error:'Brief wajib diisi.'});
  if(brief.length>1200)return res.status(413).json({error:'Brief terlalu panjang (maksimum 1200 karakter).'});
  const key=process.env.GEMINI_API_KEY;
  if(!key)return res.status(503).json({error:'GEMINI_API_KEY belum diatur di file .env.'});
  const team=Array.isArray(req.body?.team)?req.body.team.slice(0,6):[];
  const prompt=`Kamu adalah Nexus Office AI, koordinator tim kreatif virtual. Buat output kerja yang nyata dan spesifik berdasarkan brief. Jangan mengklaim telah membuat file, mengirim pesan, membuka aplikasi, atau melakukan aksi eksternal. Agen yang tersedia: ${team.map(a=>`${String(a.name).slice(0,30)} (${String(a.role).slice(0,50)}): ${String(a.desc||'').slice(0,160)}`).join('; ')}.\n\nFormat jawaban:\n1. RINGKASAN BRIEF\n2. RENCANA TIAP AGEN (sebut nama agen dan tugas/hasil spesifik masing-masing)\n3. HASIL KERJA / DRAF UTAMA\n4. CHECKLIST DAN HAL YANG PERLU DIKONFIRMASI\nBila brief kurang detail, sebutkan asumsi yang digunakan. Jawab dalam Bahasa Indonesia santai-profesional.\n\nBRIEF USER:\n${brief}`;
  const model=process.env.GEMINI_MODEL||'gemini-2.5-flash';
  const upstream=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{temperature:0.7,maxOutputTokens:2200}})});
  const payload=await upstream.json();
  if(!upstream.ok){console.error('Gemini error',upstream.status,payload?.error?.message);return res.status(502).json({error:'Provider AI menolak permintaan. Cek API key, kuota, dan nama model.'});}
  const result=(payload.candidates||[]).flatMap(c=>c.content?.parts||[]).map(p=>p.text||'').join('\n').trim();
  if(!result)return res.status(502).json({error:'Model AI tidak mengembalikan teks.'});
  res.json({result,model});
 }catch(err){console.error(err);res.status(500).json({error:'Gagal menghubungi AI provider.'});}
});
app.listen(PORT,()=>console.log(`Nexus Office AI aktif: http://localhost:${PORT}`));
