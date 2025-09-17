import { http, HttpResponse, delay } from 'msw';
import { setupWorker } from 'msw/browser';
import { generateSeedJobs } from '@/utils/seedData';
import { generateSeedCandidates } from '@/utils/candidateSeedData';
import { createSampleAssessments } from '@/utils/assessmentSeedData';
import { Job } from '@/store/useJobStore';
import { Candidate } from '@/store/useCandidateStore';
import { Assessment } from '@/types/assessment';
import { idbBulkPut, idbGetAll, idbGetKV, idbPut, idbSetKV } from '@/lib/idb';

// Seed data into IndexedDB once
async function ensureSeeded() {
  const seeded = await idbGetKV<boolean>('seeded');
  if (seeded) return;
  const now = new Date();
  const seedJobs: Job[] = generateSeedJobs().slice(0, 25).map((j, idx) => ({
    title: j.title,
    slug: j.slug,
    department: j.department,
    location: j.location,
    type: j.type,
    status: j.status,
    description: j.description,
    requirements: j.requirements,
    tags: j.tags,
    salary: j.salary,
    company: j.company,
    contact: j.contact,
    id: crypto.randomUUID(),
    createdAt: new Date(now.getTime() - idx * 86400000),
    updatedAt: new Date(now.getTime() - idx * 3600000),
    applicantCount: Math.floor(Math.random() * 50),
  }));
  const seedCandidates: Candidate[] = generateSeedCandidates(1000);
  const seedAssessments: Assessment[] = createSampleAssessments().map(a => ({ ...a } as any));
  await Promise.all([
    idbBulkPut('jobs', seedJobs as any),
    idbBulkPut('candidates', seedCandidates as any),
    idbBulkPut('assessments', seedAssessments as any),
  ]);
  await idbSetKV('seeded', true);
}

// Utilities
const withLatencyAndErrors = async (fn: () => any, isWrite = false) => {
  await delay(200 + Math.random() * 1000);
  if (isWrite && Math.random() < 0.08) {
    return HttpResponse.json({ message: 'Randomized failure' }, { status: 500 });
  }
  return fn();
};

export const handlers = [
  // Jobs
  http.get('/jobs', async ({ request }) => withLatencyAndErrors(async () => {
    await ensureSeeded();
    const all = await idbGetAll<Job>('jobs');
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() || '';
    const status = url.searchParams.get('status');
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10);
    const sort = url.searchParams.get('sort') || 'createdAt:desc';

    let filtered = all.filter(j =>
      (!status || j.status === status) &&
      (!search || j.title.toLowerCase().includes(search) || j.slug.toLowerCase().includes(search))
    );

    const [sortKey, sortDir] = sort.split(':');
    filtered = filtered.sort((a: any, b: any) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });

    const start = (page - 1) * pageSize;
    const paged = filtered.slice(start, start + pageSize);
    return HttpResponse.json({ items: paged, total: filtered.length });
  })),

  http.post('/jobs', async ({ request }) => withLatencyAndErrors(async () => {
    const body = await request.json() as Record<string, any>;
    const job: Job = {
      id: crypto.randomUUID(),
      title: body.title,
      slug: body.slug,
      department: body.department ?? body.company?.name ?? 'General',
      location: body.location ?? 'Remote',
      type: body.type,
      status: body.status,
      description: body.description ?? '',
      requirements: body.requirements ?? [],
      tags: body.tags ?? [],
      salary: body.salary,
      company: body.company,
      contact: body.contact,
      createdAt: new Date(),
      updatedAt: new Date(),
      applicantCount: 0,
    };
    await idbPut('jobs', job as any);
    return HttpResponse.json(job, { status: 201 });
  }, true)),

  http.patch('/jobs/:id', async ({ params, request }) => withLatencyAndErrors(async () => {
    const { id } = params as { id: string };
    const updates = await request.json() as Partial<Job> & Record<string, any>;
    const all = await idbGetAll<Job>('jobs');
    const current = all.find(j => j.id === id);
    if (!current) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    const next = { ...current, ...updates, updatedAt: new Date() } as Job;
    await idbPut('jobs', next as any);
    return HttpResponse.json(next);
  }, true)),

  http.patch('/jobs/:id/reorder', async ({ request }) => withLatencyAndErrors(async () => {
    const { fromOrder, toOrder } = await request.json() as { fromOrder: number; toOrder: number };
    if (fromOrder === undefined || toOrder === undefined) {
      return HttpResponse.json({ message: 'Invalid order' }, { status: 400 });
    }
    const newJobs = await idbGetAll<Job>('jobs');
    const [dragged] = newJobs.splice(fromOrder, 1);
    newJobs.splice(toOrder, 0, dragged);
    newJobs.forEach((j, idx) => (j as any).order = idx);
    await idbBulkPut('jobs', newJobs as any);
    return HttpResponse.json({ success: true });
  }, true)),

  // Candidates
  http.get('/candidates', async ({ request }) => withLatencyAndErrors(async () => {
    await ensureSeeded();
    const all = await idbGetAll<Candidate>('candidates');
    const url = new URL(request.url);
    const search = (url.searchParams.get('search') || '').toLowerCase();
    const stage = url.searchParams.get('stage');
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const pageSize = 25;
    let filtered = all.filter(c =>
      (!stage || c.stage === stage) &&
      (!search || c.name.toLowerCase().includes(search) || c.email.toLowerCase().includes(search))
    );
    const start = (page - 1) * pageSize;
    return HttpResponse.json({ items: filtered.slice(start, start + pageSize), total: filtered.length });
  })),

  http.post('/candidates', async ({ request }) => withLatencyAndErrors(async () => {
    const body = await request.json() as Record<string, any>;
    const newCandidate: Candidate = {
      id: crypto.randomUUID(),
      name: body.name,
      email: body.email,
      phone: body.phone ?? '',
      location: body.location ?? 'Remote',
      position: body.position ?? 'Unknown',
      stage: body.stage,
      experience: body.experience ?? 0,
      education: body.education ?? '',
      skills: body.skills ?? [],
      avatar: body.avatar,
      appliedDate: body.appliedDate ?? new Date().toISOString(),
      lastActivity: body.lastActivity ?? new Date().toISOString(),
      rating: body.rating ?? 3,
      notes: body.notes ?? [],
      resume: body.resume,
      linkedin: body.linkedin,
      portfolio: body.portfolio,
      statusHistory: body.statusHistory ?? [],
    };
    await idbPut('candidates', newCandidate as any);
    return HttpResponse.json(newCandidate, { status: 201 });
  }, true)),

  http.patch('/candidates/:id', async ({ params, request }) => withLatencyAndErrors(async () => {
    const { id } = params as { id: string };
    const updates = await request.json() as Partial<Candidate> & Record<string, any>;
    const all = await idbGetAll<Candidate>('candidates');
    const current = all.find(c => c.id === id);
    if (!current) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    const next = { ...current, ...updates } as Candidate;
    await idbPut('candidates', next as any);
    return HttpResponse.json(next);
  }, true)),

  http.get('/candidates/:id/timeline', async ({ params }) => withLatencyAndErrors(async () => {
    const { id } = params as { id: string };
    const all = await idbGetAll<Candidate>('candidates');
    const candidate = all.find(c => c.id === id);
    if (!candidate) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    const timeline = [
      { id: 't1', type: 'applied', date: new Date(), description: 'Candidate applied' },
      { id: 't2', type: 'screen', date: new Date(), description: 'Screening call' },
    ];
    return HttpResponse.json(timeline);
  })),

  // Assessments
  http.get('/assessments/:jobId', async ({ params }) => withLatencyAndErrors(async () => {
    const { jobId } = params as { jobId: string };
    await ensureSeeded();
    const all = await idbGetAll<Assessment>('assessments');
    const list = all.filter(a => (a as any).jobId === jobId || !(a as any).jobId);
    return HttpResponse.json(list);
  })),

  http.put('/assessments/:jobId', async ({ params, request }) => withLatencyAndErrors(async () => {
    const { jobId } = params as { jobId: string };
    const body = await request.json();
    const all = await idbGetAll<Assessment>('assessments');
    const remaining = all.filter(a => (a as any).jobId !== jobId);
    const next = (body as Assessment[]).map(a => ({ ...a, jobId } as any));
    await idbBulkPut('assessments', [...remaining, ...next] as any);
    return HttpResponse.json({ success: true });
  }, true)),

  http.post('/assessments/:jobId/submit', async ({ params, request }) => withLatencyAndErrors(async () => {
    const { jobId } = params as { jobId: string };
    const submission = await request.json();
    await idbSetKV(`assessment_submission_${jobId}`, submission);
    return HttpResponse.json({ success: true });
  }, true)),
];

export const worker = setupWorker(...handlers);


