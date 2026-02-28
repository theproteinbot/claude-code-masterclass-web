import fs from 'node:fs';
import path from 'node:path';
import { slugify, stripMarkdown, unique } from '@/lib/utils';

export type DocId =
  | 'overview'
  | 'learning-paths'
  | 'workshop'
  | 'labs'
  | 'rubrics'
  | 'capstone'
  | 'prompt-cards'
  | 'facilitator-guide'
  | 'references'
  | 'slide-outline';

export type DocMeta = {
  id: DocId;
  fileName: string;
  title: string;
  route: string;
  category: 'overview' | 'learning' | 'delivery' | 'assessment' | 'resources';
  description: string;
  listed: boolean;
};

export type MarkdownSection = {
  id: string;
  title: string;
  level: number;
  content: string;
  plainText: string;
  bullets: string[];
  urls: string[];
};

export type CurriculumDoc = {
  meta: DocMeta;
  raw: string;
  title: string;
  sections: MarkdownSection[];
  citations: string[];
  summary: string;
};

export type LearningPathCard = {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  intendedLearner: string[];
  outcomes: string[];
  sequence: string[];
  assessmentStandard?: string;
  tocCoverage?: string[];
  duration?: string;
  rawSection: MarkdownSection;
};

export type WorkshopAgendaItem = {
  id: string;
  timeLabel: string;
  title: string;
  bullets: string[];
  detailsMarkdown: string;
};

export type LabCard = {
  id: string;
  title: string;
  objective?: string;
  duration?: string;
  tasks: string[];
  checkpoints: string[];
  successCriteria: string[];
  troubleshooting: string[];
  promptStarter?: string;
  tocMapping: string[];
  detailsMarkdown: string;
};

export type PromptCard = {
  id: string;
  title: string;
  useWhen: string[];
  template: string;
  whyItWorks?: string;
  avoid: string[];
  tocMapping: string[];
  detailsMarkdown: string;
};

export type RubricDimension = {
  id: string;
  title: string;
  bullets: string[];
  detailsMarkdown: string;
};

export type RubricBlock = {
  id: string;
  title: string;
  intro: string;
  dimensions: RubricDimension[];
  rawSection: MarkdownSection;
};

export type ReferenceEntry = {
  id: string;
  url: string;
  label: string;
  whyTrusted?: string;
  usedFor?: string;
  group: string;
  subgroup?: string;
};

export type SearchItem = {
  id: string;
  title: string;
  docId: DocId;
  docTitle: string;
  route: string;
  kind: 'module' | 'activity' | 'section' | 'reference';
  tags: string[];
  snippet: string;
};

const DOCS: DocMeta[] = [
  {
    id: 'overview',
    fileName: 'MASTERCLASS_OVERVIEW.md',
    title: 'Learner Handbook Overview',
    route: '/',
    category: 'overview',
    description: 'Self-paced handbook overview, outcomes, study workflow, and TOC crosswalk.',
    listed: true,
  },
  {
    id: 'learning-paths',
    fileName: 'LEARNING_PATHS.md',
    title: 'Learning Paths',
    route: '/learning-paths',
    category: 'learning',
    description: 'Beginner, intermediate, and advanced paths with outcomes and sequencing.',
    listed: true,
  },
  {
    id: 'workshop',
    fileName: 'WORKSHOP_90MIN.md',
    title: '90-Minute Sprint',
    route: '/workshop',
    category: 'delivery',
    description: 'Self-paced 90-minute sprint plan with checkpoints, evidence capture, and reflection.',
    listed: true,
  },
  {
    id: 'labs',
    fileName: 'LABS.md',
    title: 'Labs',
    route: '/labs',
    category: 'learning',
    description: 'Hands-on lab activities, checkpoints, success criteria, and self-check loops.',
    listed: true,
  },
  {
    id: 'rubrics',
    fileName: 'RUBRICS.md',
    title: 'Self-Assessment Rubrics',
    route: '/rubrics',
    category: 'assessment',
    description: 'Self-assessment rubrics for workshop sprints, labs, and capstone practice.',
    listed: true,
  },
  {
    id: 'capstone',
    fileName: 'CAPSTONE.md',
    title: 'Capstone',
    route: '/capstone',
    category: 'assessment',
    description: 'Capstone scenario, deliverables, phased execution, and self-assessment workflow.',
    listed: true,
  },
  {
    id: 'prompt-cards',
    fileName: 'PROMPT_CARDS.md',
    title: 'Prompt Cards',
    route: '/prompt-cards',
    category: 'resources',
    description: 'Reusable prompt templates for planning, execution, review, context control, and recovery.',
    listed: true,
  },
  {
    id: 'facilitator-guide',
    fileName: 'FACILITATOR_GUIDE.md',
    title: 'Facilitator Guide (Optional)',
    route: '/facilitator-guide',
    category: 'delivery',
    description: 'Optional mentor/coaching runbook for group sessions (not required for solo study).',
    listed: true,
  },
  {
    id: 'references',
    fileName: 'REFERENCE_PACK.md',
    title: 'Reference Pack',
    route: '/references',
    category: 'resources',
    description: 'Trusted source list with rationale and usage mapping for course content.',
    listed: true,
  },
  {
    id: 'slide-outline',
    fileName: 'SLIDE_OUTLINE.md',
    title: 'Slide Outline',
    route: '/search',
    category: 'delivery',
    description: 'Deck outline and slide sequencing for the instructor deck.',
    listed: false,
  },
];

const OUT_FULL_DIR = path.resolve(process.cwd(), '..', 'out_full');
const DOC_CACHE = new Map<DocId, CurriculumDoc>();

function readFile(meta: DocMeta) {
  const filePath = path.join(OUT_FULL_DIR, meta.fileName);
  return fs.readFileSync(filePath, 'utf8');
}

function extractUrls(text: string) {
  const matches = text.match(/https?:\/\/[^\s)\]]+/g) ?? [];
  return unique(matches.map((u) => u.replace(/[.,;]+$/, '')));
}

function extractBullets(content: string) {
  return content
    .split(/\n/)
    .map((line) => line.match(/^\s*(?:[-*]|\d+\.)\s+(.*)$/)?.[1]?.trim())
    .filter((v): v is string => Boolean(v));
}

function parseMarkdownSections(raw: string): MarkdownSection[] {
  const normalized = raw.replace(/\r\n/g, '\n').trim();
  const lines = normalized.split('\n');
  const sections: Array<{ title: string; level: number; lines: string[] }> = [];
  let current = { title: 'Overview', level: 0, lines: [] as string[] };

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      if (current.lines.length || sections.length === 0) sections.push(current);
      current = {
        title: headingMatch[2].trim(),
        level: headingMatch[1].length,
        lines: [],
      };
      continue;
    }
    current.lines.push(line);
  }
  sections.push(current);

  return sections
    .map((section, index) => {
      const content = section.lines.join('\n').trim();
      const plainText = stripMarkdown(content);
      const baseId = section.level === 1 && index === 1 ? 'document-title' : slugify(section.title || `section-${index}`);
      return {
        id: `${baseId}-${index}`,
        title: section.title || `Section ${index + 1}`,
        level: section.level,
        content,
        plainText,
        bullets: extractBullets(content),
        urls: extractUrls(content),
      } satisfies MarkdownSection;
    })
    .filter((section) => section.title || section.content);
}

function getDocMeta(id: DocId) {
  const meta = DOCS.find((doc) => doc.id === id);
  if (!meta) throw new Error(`Unknown doc id: ${id}`);
  return meta;
}

export function getListedDocsMeta() {
  return DOCS.filter((doc) => doc.listed);
}

export function getDocById(id: DocId): CurriculumDoc {
  const cached = DOC_CACHE.get(id);
  if (cached) return cached;

  const meta = getDocMeta(id);
  const raw = readFile(meta);
  const sections = parseMarkdownSections(raw);
  const title = sections.find((s) => s.level === 1)?.title ?? meta.title;
  const citations = unique(extractUrls(raw));
  const summary = sections
    .filter((s) => s.level >= 1)
    .slice(1, 4)
    .map((s) => s.plainText)
    .join(' ')
    .slice(0, 280);

  const doc: CurriculumDoc = { meta, raw, title, sections, citations, summary };
  DOC_CACHE.set(id, doc);
  return doc;
}

export function getAllDocs() {
  return DOCS.map((doc) => getDocById(doc.id));
}

function splitBySubheadings(markdown: string) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const blocks: Array<{ title: string; level: number; content: string }> = [];
  let current: { title: string; level: number; lines: string[] } = { title: 'Overview', level: 0, lines: [] };

  for (const line of lines) {
    const m = line.match(/^(#{3,6})\s+(.*)$/);
    if (m) {
      if (current.lines.length) {
        blocks.push({ title: current.title, level: current.level, content: current.lines.join('\n').trim() });
      }
      current = { title: m[2].trim(), level: m[1].length, lines: [] };
    } else {
      current.lines.push(line);
    }
  }

  if (current.lines.length) blocks.push({ title: current.title, level: current.level, content: current.lines.join('\n').trim() });
  return blocks;
}

function getSubsectionBullets(section: MarkdownSection, titleStartsWith: string) {
  const blocks = splitBySubheadings(section.content);
  const block = blocks.find((b) => b.title.toLowerCase().startsWith(titleStartsWith.toLowerCase()));
  return block ? extractBullets(block.content) : [];
}

function getSubsectionParagraph(section: MarkdownSection, titleStartsWith: string) {
  const blocks = splitBySubheadings(section.content);
  const block = blocks.find((b) => b.title.toLowerCase().startsWith(titleStartsWith.toLowerCase()));
  if (!block) return undefined;
  return stripMarkdown(block.content).split('\n').filter(Boolean).join(' ').trim();
}

function getSubsectionMarkdown(section: MarkdownSection, titleStartsWith: string) {
  const blocks = splitBySubheadings(section.content);
  return blocks.find((b) => b.title.toLowerCase().startsWith(titleStartsWith.toLowerCase()))?.content;
}

export function getLearningPathCards(): LearningPathCard[] {
  const doc = getDocById('learning-paths');
  const pathSections = doc.sections.filter((s) => s.level === 2 && /^Path\s+[A-Z]:/i.test(s.title));

  return pathSections.map((section) => {
    const nameMatch = section.title.match(/^Path\s+[A-Z]:\s*(.*)$/i);
    const name = nameMatch?.[1]?.trim() ?? section.title;
    const lower = name.toLowerCase();
    const level = lower.includes('beginner') ? 'beginner' : lower.includes('intermediate') ? 'intermediate' : 'advanced';

    const sub = splitBySubheadings(section.content);
    const byTitle = (prefix: string) => sub.find((x) => x.title.toLowerCase().startsWith(prefix.toLowerCase()));
    const intendedLearner = extractBullets(byTitle('Intended Learner')?.content ?? '');
    const outcomes = extractBullets(byTitle('Outcomes')?.content ?? '');
    const sequence = extractBullets(byTitle('Recommended Sequence')?.content ?? '');
    const tocCoverage = extractBullets(byTitle('TOC Module Coverage')?.content ?? '');
    const assessmentStandard = stripMarkdown(byTitle('Assessment Standard')?.content ?? '').trim() || undefined;
    const duration = byTitle('Recommended Sequence')?.content.match(/\(([^)]+hours[^)]*)\)/i)?.[1];

    return {
      id: slugify(name),
      name,
      level,
      intendedLearner,
      outcomes,
      sequence,
      tocCoverage,
      assessmentStandard,
      duration,
      rawSection: section,
    };
  });
}

export function getWorkshopAgenda(): WorkshopAgendaItem[] {
  const doc = getDocById('workshop');
  const items = doc.sections.filter((s) => s.level === 3 && /min\s+[—-]/i.test(s.title));
  return items.map((section) => {
    const m = section.title.match(/^(.+?min)\s+[—-]\s+(.*)$/i);
    return {
      id: slugify(section.title),
      timeLabel: m?.[1]?.trim() ?? section.title,
      title: m?.[2]?.trim() ?? section.title,
      bullets: section.bullets,
      detailsMarkdown: section.content,
    };
  });
}

export function getLabCards(): LabCard[] {
  const doc = getDocById('labs');
  const labSections = doc.sections.filter((s) => s.level === 2 && /^Lab\s+\d+/i.test(s.title));

  return labSections.map((section) => {
    const title = section.title;
    const promptStarter = getSubsectionMarkdown(section, 'Prompt Starter');
    return {
      id: slugify(title),
      title,
      objective: getSubsectionParagraph(section, 'Objective'),
      duration: getSubsectionParagraph(section, 'Duration'),
      tasks: getSubsectionBullets(section, 'Tasks'),
      checkpoints: getSubsectionBullets(section, 'Checkpoints'),
      successCriteria: getSubsectionBullets(section, 'Success Criteria'),
      troubleshooting: getSubsectionBullets(section, 'Troubleshooting'),
      promptStarter: promptStarter ? promptStarter.replace(/^"|"$/g, '').trim() : undefined,
      tocMapping: getSubsectionBullets(section, 'TOC Mapping'),
      detailsMarkdown: section.content,
    };
  });
}

export function getPromptCards(): PromptCard[] {
  const doc = getDocById('prompt-cards');
  const cardSections = doc.sections.filter((s) => s.level === 2 && /^Card\s+\d+/i.test(s.title));

  return cardSections.map((section) => {
    const sub = splitBySubheadings(section.content);
    const block = (name: string) => sub.find((x) => x.title.toLowerCase().startsWith(name.toLowerCase()))?.content ?? '';
    const template = block('Template').replace(/^"|"$/g, '').trim();
    return {
      id: slugify(section.title),
      title: section.title,
      useWhen: extractBullets(block('Use When')),
      template,
      whyItWorks: stripMarkdown(block('Why It Works')).trim() || undefined,
      avoid: extractBullets(block('Avoid')),
      tocMapping: extractBullets(doc.sections.find((s) => s.level === 2 && s.title.toLowerCase().includes('toc mapping'))?.content ?? ''),
      detailsMarkdown: section.content,
    };
  });
}

export function getRubricBlocks(): RubricBlock[] {
  const doc = getDocById('rubrics');
  const rubricSections = doc.sections.filter(
    (s) => s.level === 2 && /(Rubric|Scoring Scale|Assessment)/i.test(s.title),
  );

  return rubricSections.map((section) => {
    const intro = stripMarkdown(section.content).split('\n').find(Boolean) ?? '';
    const dims = splitBySubheadings(section.content)
      .filter((s) => s.title !== 'Overview')
      .map((sub) => ({
        id: slugify(`${section.title}-${sub.title}`),
        title: sub.title,
        bullets: extractBullets(sub.content),
        detailsMarkdown: sub.content,
      }));

    return {
      id: slugify(section.title),
      title: section.title,
      intro,
      dimensions: dims,
      rawSection: section,
    };
  });
}

export function getCapstoneDetails() {
  const doc = getDocById('capstone');
  const deliverablesSection = doc.sections.find((s) => s.level === 2 && /^Deliverables/i.test(s.title));
  const phases = doc.sections
    .filter((s) => s.level === 3 && /^Phase\s+\d+/i.test(s.title))
    .map((s) => ({ id: slugify(s.title), title: s.title, bullets: s.bullets, detailsMarkdown: s.content }));
  const successCriteria = doc.sections.find((s) => s.level === 2 && /^Success Criteria/i.test(s.title))?.bullets ?? [];

  return {
    doc,
    deliverables: deliverablesSection?.bullets ?? [],
    phases,
    successCriteria,
  };
}

export function getFacilitatorChecklists() {
  const doc = getDocById('facilitator-guide');
  const checklistSections = doc.sections.filter(
    (s) => s.level === 2 && /(Checklist|Teaching Flow|Demo Patterns|Failure Modes)/i.test(s.title),
  );
  return { doc, checklistSections };
}

export function getReferenceEntries(): { doc: CurriculumDoc; entries: ReferenceEntry[] } {
  const doc = getDocById('references');
  const lines = doc.raw.replace(/\r\n/g, '\n').split('\n');
  let group = 'General';
  let subgroup: string | undefined;
  const entries: ReferenceEntry[] = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const h2 = line.match(/^##\s+(.*)$/);
    const h3 = line.match(/^###\s+(.*)$/);
    if (h2) {
      group = h2[1].trim();
      subgroup = undefined;
      continue;
    }
    if (h3) {
      subgroup = h3[1].trim();
      continue;
    }

    const urlBullet = line.match(/^\s*-\s+`?(https?:\/\/[^`\s]+)`?\s*$/);
    if (!urlBullet) continue;

    const url = urlBullet[1];
    let whyTrusted: string | undefined;
    let usedFor: string | undefined;
    for (let j = i + 1; j < Math.min(i + 6, lines.length); j += 1) {
      const why = lines[j].match(/^\s*-\s+Why trusted:\s*(.*)$/i);
      const used = lines[j].match(/^\s*-\s+Used for:\s*(.*)$/i);
      if (why) whyTrusted = why[1].trim();
      if (used) usedFor = used[1].trim();
      if (/^\s*$/.test(lines[j])) break;
      if (/^\s*-\s+`?https?:\/\//.test(lines[j])) break;
      if (/^##\s+/.test(lines[j]) || /^###\s+/.test(lines[j])) break;
    }

    entries.push({
      id: slugify(`${group}-${subgroup ?? ''}-${url}`),
      url,
      label: new URL(url).hostname.replace(/^www\./, ''),
      whyTrusted,
      usedFor,
      group,
      subgroup,
    });
  }

  return { doc, entries };
}

function inferTags(title: string, snippet: string) {
  const text = `${title} ${snippet}`.toLowerCase();
  const tags: string[] = [];
  if (/lab|checkpoint|exercise|activity/.test(text)) tags.push('activity');
  if (/workshop|minute|agenda|schedule/.test(text)) tags.push('workshop');
  if (/rubric|score|assessment/.test(text)) tags.push('assessment');
  if (/capstone|deliverable|retro/.test(text)) tags.push('capstone');
  if (/prompt|template|clarify|plan/.test(text)) tags.push('prompting');
  if (/toc\s+[1-5]|module/.test(text)) tags.push('module');
  if (/reference|source|trusted/.test(text)) tags.push('reference');
  return unique(tags);
}

export function buildSearchIndex(): SearchItem[] {
  const docs = getAllDocs();
  const items: SearchItem[] = [];

  for (const doc of docs) {
    for (const section of doc.sections) {
      if (!section.plainText && !section.bullets.length) continue;
      const snippet = (section.plainText || section.bullets.join(' ')).replace(/\s+/g, ' ').slice(0, 220);
      items.push({
        id: `${doc.meta.id}:${section.id}`,
        title: section.title,
        docId: doc.meta.id,
        docTitle: doc.meta.title,
        route: doc.meta.route,
        kind: section.level <= 2 ? 'module' : 'activity',
        tags: inferTags(section.title, snippet),
        snippet,
      });
    }
  }

  const refs = getReferenceEntries().entries;
  for (const ref of refs) {
    const snippet = [ref.whyTrusted, ref.usedFor].filter(Boolean).join(' ').slice(0, 220);
    items.push({
      id: `reference:${ref.id}`,
      title: `${ref.subgroup ? `${ref.subgroup} · ` : ''}${ref.label}`,
      docId: 'references',
      docTitle: 'Reference Pack',
      route: '/references',
      kind: 'reference',
      tags: ['reference'],
      snippet,
    });
  }

  return items;
}

export function getHomeHighlights() {
  const overview = getDocById('overview');
  const workshop = getDocById('workshop');
  const labs = getDocById('labs');
  const promptCards = getDocById('prompt-cards');
  const learningPaths = getLearningPathCards();

  const outcomes = overview.sections.find((s) => s.level === 2 && /^Learning Outcomes/i.test(s.title))?.bullets ?? [];
  const formats = overview.sections.find((s) => s.level === 2 && /^Delivery Formats/i.test(s.title))?.bullets ?? [];

  return {
    overview,
    outcomes,
    formats,
    stats: [
      { label: 'Tracks', value: String(learningPaths.length) },
      { label: 'Workshop Minutes', value: '90' },
      { label: 'Hands-on Labs', value: String(getLabCards().length) },
      { label: 'Prompt Cards', value: String(getPromptCards().length) },
    ],
    featureDocs: [workshop.meta, labs.meta, promptCards.meta, getDocById('capstone').meta],
  };
}
