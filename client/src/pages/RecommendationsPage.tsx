import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Star, TrendingUp, Zap, Heart, Code, Gamepad2, Filter, ArrowRight, Search, User, Lightbulb } from 'lucide-react';
import { LayoutWithStats } from '../types';

type PreferenceType = 'comfort' | 'speed' | 'gaming' | 'programming' | 'pinky_strain';

interface Preference {
  id: PreferenceType;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface RecommendationError {
  message: string;
  details?: string;
}

interface OccupationMapping {
  keywords: string[];
  priority: PreferenceType;
  baseConfidence: number;
  keywordWeights?: { [keyword: string]: number }; // Optional individual keyword weights
  categoryWeight?: number; // Weight for this entire category
}

interface OccupationAnalysis {
  preference: PreferenceType;
  confidence: number;
  matchDetails: {
    exactMatches: string[];
    partialMatches: string[];
    categoryScores: { [category: string]: number };
    totalKeywords: number;
    matchedKeywords: number;
  };
}

// Occupation to preference mapping algorithm
const occupationMappings: OccupationMapping[] = [
  // Programming & Tech
  { keywords: [
    // Core programming roles
    'developer', 'programmer', 'engineer', 'software', 'coder', 'tech', 'web', 'app', 'frontend', 'backend', 'fullstack', 'devops', 'sysadmin', 'architect', 'analyst',
    'coding', 'programming', 'development', 'javascript', 'python', 'java', 'react', 'node', 'angular', 'vue', 'typescript', 'php', 'ruby', 'go', 'rust', 'c++', 'c#',
    'database', 'sql', 'api', 'cloud', 'aws', 'azure', 'docker', 'kubernetes', 'git', 'github', 'linux', 'unix', 'bash', 'terminal', 'cli', 'ide', 'vscode', 'vim',
    'machine learning', 'ai', 'data science', 'ml', 'artificial intelligence', 'algorithms', 'data structures', 'computer science', 'cs', 'it', 'information technology',
    'cybersecurity', 'security', 'network', 'system admin', 'database admin', 'qa', 'quality assurance', 'testing', 'automation', 'ci/cd', 'agile', 'scrum',
    // Additional tech roles and specializations
    'mobile developer', 'ios developer', 'android developer', 'game developer', 'embedded systems', 'firmware', 'hardware engineer', 'robotics engineer',
    'blockchain developer', 'cryptocurrency', 'smart contracts', 'solidity', 'ethereum', 'defi', 'nft', 'crypto', 'bitcoin',
    'ui/ux designer', 'product manager', 'technical product manager', 'scrum master', 'tech lead', 'engineering manager', 'cto', 'technical director',
    'site reliability engineer', 'sre', 'platform engineer', 'infrastructure engineer', 'cloud architect', 'solutions architect', 'enterprise architect',
    'penetration tester', 'ethical hacker', 'security analyst', 'forensics', 'incident response', 'compliance', 'risk assessment',
    'technical writer', 'developer advocate', 'evangelist', 'community manager', 'documentation', 'api documentation',
    'freelance developer', 'consultant', 'contractor', 'startup founder', 'entrepreneur', 'indie developer', 'open source maintainer',
    // Technologies and frameworks
    'swift', 'kotlin', 'dart', 'flutter', 'xamarin', 'unity', 'unreal', 'godot', 'blender', '3d modeling',
    'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy', 'jupyter', 'r language', 'matlab', 'stata',
    'django', 'flask', 'fastapi', 'express', 'nestjs', 'spring', 'laravel', 'rails', 'asp.net',
    'redis', 'mongodb', 'postgresql', 'mysql', 'sqlite', 'elasticsearch', 'cassandra', 'neo4j',
    'jenkins', 'gitlab ci', 'github actions', 'travis ci', 'circleci', 'terraform', 'ansible', 'puppet', 'chef'
  ], priority: 'programming', baseConfidence: 0.95 },
  
  // Gaming
  { keywords: [
    // Core gaming terms
    'gamer', 'esports', 'streamer', 'gaming', 'twitch', 'youtube gaming', 'competitive', 'fps', 'moba', 'mmo', 'rpg', 'rts', 'battle royale',
    'pro gamer', 'professional gamer', 'gaming content creator', 'gaming youtuber', 'gaming influencer', 'gaming coach', 'esports player',
    'esports coach', 'tournament player', 'competitive player', 'gaming analyst', 'shoutcaster', 'commentator', 'gaming journalist',
    // Popular games - FPS
    'valorant', 'csgo', 'counter-strike', 'cs2', 'apex legends', 'cod', 'call of duty', 'warzone', 'modern warfare', 'black ops',
    'overwatch', 'overwatch 2', 'rainbow six', 'r6', 'siege', 'battlefield', 'destiny', 'destiny 2', 'halo', 'titanfall', 'paladins',
    'team fortress', 'tf2', 'quake', 'doom', 'unreal tournament', 'tribes', 'insurgency', 'hunt showdown', 'escape from tarkov',
    // MOBA and strategy
    'league of legends', 'lol', 'dota', 'dota2', 'heroes of newerth', 'hon', 'heroes of the storm', 'hots', 'smite',
    'starcraft', 'starcraft 2', 'age of empires', 'aoe', 'civilization', 'civ', 'total war', 'command and conquer', 'warcraft',
    'crusader kings', 'europa universalis', 'hearts of iron', 'stellaris', 'cities skylines',
    // Battle Royale
    'fortnite', 'pubg', 'playerunknowns battlegrounds', 'apex legends', 'warzone', 'fall guys', 'among us', 'stumble guys',
    // MMO and RPG
    'wow', 'world of warcraft', 'final fantasy xiv', 'ffxiv', 'elder scrolls online', 'eso', 'guild wars', 'gw2', 'new world',
    'lost ark', 'black desert', 'bdo', 'archeage', 'path of exile', 'poe', 'diablo', 'diablo 4', 'torchlight', 'grim dawn',
    'elder scrolls', 'skyrim', 'fallout', 'witcher', 'cyberpunk', 'mass effect', 'dragon age', 'baldurs gate', 'divinity',
    // Sports and racing
    'fifa', 'nba 2k', 'madden', 'nhl', 'mlb the show', 'pes', 'pro evolution soccer', 'rocket league', 'gran turismo',
    'forza', 'f1', 'assetto corsa', 'dirt rally', 'need for speed', 'burnout',
    // Fighting games
    'tekken', 'street fighter', 'mortal kombat', 'smash bros', 'super smash bros', 'dragon ball fighterz', 'guilty gear',
    'king of fighters', 'injustice', 'soul calibur', 'blazblue', 'marvel vs capcom',
    // Sandbox and simulation
    'minecraft', 'roblox', 'terraria', 'stardew valley', 'animal crossing', 'the sims', 'cities skylines', 'kerbal space program',
    'factorio', 'satisfactory', 'subnautica', 'no mans sky', 'rust', 'ark survival', 'green hell', 'the forest',
    // Action and adventure
    'gta', 'grand theft auto', 'red dead', 'red dead redemption', 'assassins creed', 'far cry', 'watch dogs', 'tomb raider',
    'uncharted', 'god of war', 'horizon', 'spider-man', 'batman arkham', 'metal gear', 'resident evil', 'silent hill',
    // Indie and popular titles
    'hollow knight', 'celeste', 'hades', 'dead cells', 'ori and the blind forest', 'cuphead', 'shovel knight', 'undertale',
    'stardew valley', 'terraria', 'dont starve', 'the binding of isaac', 'super meat boy', 'spelunky',
    // Gaming platforms and services
    'steam', 'epic games', 'origin', 'battle.net', 'uplay', 'gog', 'itch.io', 'humble bundle', 'game pass', 'xbox game pass',
    'playstation plus', 'nintendo online', 'geforce now', 'stadia', 'luna', 'xbox', 'playstation', 'nintendo', 'switch',
    'pc gaming', 'console gaming', 'mobile gaming', 'handheld gaming', 'retro gaming', 'emulation',
    // Gaming community and culture
    'streaming', 'obs', 'streamlabs', 'discord', 'teamspeak', 'ventrilo', 'mumble', 'clan', 'guild', 'team', 'squad',
    'tournament', 'championship', 'league', 'ladder', 'ranked', 'competitive', 'casual', 'hardcore', 'tryhard',
    'speedrun', 'speedrunning', 'tas', 'tool assisted', 'world record', 'wr', 'personal best', 'pb', 'grinding', 'farming',
    'meta', 'tier list', 'patch notes', 'balance', 'nerf', 'buff', 'op', 'overpowered', 'broken', 'cheese',
    // Gaming hardware and peripherals
    'gaming mouse', 'gaming keyboard', 'mechanical keyboard', 'cherry mx', 'rgb', 'gaming headset', 'gaming monitor',
    '144hz', '240hz', 'gsync', 'freesync', 'gaming chair', 'controller', 'gamepad', 'joystick', 'racing wheel',
    'vr', 'virtual reality', 'oculus', 'valve index', 'psvr', 'htc vive'
  ], priority: 'gaming', baseConfidence: 0.9 },
  
  // Speed-focused roles
  { keywords: [
    // Core speed-typing roles
    'data entry', 'transcription', 'secretary', 'assistant', 'clerk', 'typist', 'journalist', 'reporter', 'court reporter', 'translator', 'copywriter',
    'administrative', 'admin', 'receptionist', 'customer service', 'call center', 'support', 'helpdesk', 'virtual assistant', 'va',
    'stenographer', 'scribe', 'note taker', 'minutes', 'documentation', 'fast typing', 'speed typing', 'typing speed', 'wpm', 'words per minute',
    'transcriptionist', 'captioning', 'subtitles', 'live captioning', 'real time', 'court stenographer', 'medical transcription',
    // Expanded administrative and support roles
    'executive assistant', 'personal assistant', 'office manager', 'office administrator', 'administrative coordinator',
    'scheduling coordinator', 'appointment setter', 'dispatch', 'dispatcher', 'logistics coordinator', 'operations coordinator',
    'records clerk', 'filing clerk', 'accounts clerk', 'billing clerk', 'payroll clerk', 'inventory clerk',
    'medical secretary', 'legal secretary', 'school secretary', 'government clerk', 'court clerk', 'city clerk',
    // Customer service and communication roles
    'customer support', 'technical support', 'help desk', 'call center agent', 'phone support', 'email support',
    'chat support', 'live chat agent', 'customer success', 'account manager', 'client relations', 'customer relations',
    'social media manager', 'community manager', 'content moderator', 'chat moderator', 'forum moderator',
    'online moderator', 'digital marketing', 'email marketing', 'lead generation', 'sales support',
    // Media and communication
    'news reporter', 'sports reporter', 'weather reporter', 'broadcast journalist', 'radio host', 'podcast host',
    'news anchor', 'correspondent', 'freelance journalist', 'staff writer', 'beat reporter', 'investigative reporter',
    'editor', 'copy editor', 'proofreader', 'fact checker', 'researcher', 'news researcher', 'content researcher',
    'captioner', 'closed captioner', 'subtitler', 'interpreter', 'simultaneous interpreter', 'conference interpreter',
    // Translation and localization
    'translator', 'interpreter', 'linguist', 'localization specialist', 'bilingual assistant', 'multilingual support',
    'language teacher', 'esl teacher', 'foreign language teacher', 'tutor', 'language tutor', 'conversation partner',
    // Finance and accounting speed roles
    'bookkeeper', 'accounting clerk', 'accounts payable', 'accounts receivable', 'payroll specialist', 'tax preparer',
    'financial data entry', 'invoice processing', 'expense reporting', 'budget analyst', 'financial analyst',
    'bank teller', 'teller', 'banker', 'banking', 'loan officer', 'mortgage specialist', 'credit analyst',
    'investment banker', 'commercial banker', 'retail banker', 'private banker', 'wealth manager',
    'financial advisor', 'portfolio manager', 'relationship manager', 'account manager', 'branch manager',
    'compliance officer', 'risk analyst', 'underwriter', 'loan processor', 'mortgage processor',
    // Healthcare administration
    'medical coder', 'medical biller', 'medical records clerk', 'health information technician', 'patient coordinator',
    'appointment scheduler', 'medical receptionist', 'insurance specialist', 'claims processor', 'prior authorization',
    // Legal support
    'paralegal', 'legal assistant', 'court reporter', 'legal transcriptionist', 'litigation support', 'document review',
    'contract specialist', 'compliance officer', 'legal researcher', 'case manager', 'discovery specialist',
    // Real estate and sales support
    'real estate agent', 'listing agent', 'buyers agent', 'real estate assistant', 'property manager',
    'leasing agent', 'mortgage processor', 'loan officer', 'underwriter', 'title clerk', 'escrow officer',
    'sales assistant', 'sales coordinator', 'inside sales', 'telemarketing', 'lead qualifier', 'appointment setter',
    // Digital and online work
    'virtual assistant', 'remote assistant', 'online assistant', 'freelance assistant', 'gig worker',
    'micro-task worker', 'crowdsource worker', 'amazon mechanical turk', 'clickworker', 'lionbridge', 'appen',
    'content creator', 'blog writer', 'article writer', 'seo writer', 'web content writer', 'product description writer'
  ], priority: 'speed', baseConfidence: 0.85 },
  
  // Comfort-focused (long hours)
  { keywords: [
    // Writing and content creation
    'writer', 'author', 'editor', 'blogger', 'content creator', 'novelist', 'freelance writer', 'technical writer', 'copywriter',
    'ghostwriter', 'screenwriter', 'playwright', 'poet', 'journalism', 'journalist', 'columnist', 'essayist', 'critic',
    'proofreader', 'copy editor', 'line editor', 'developmental editor', 'content editor', 'managing editor', 'senior editor',
    'manuscript', 'publishing', 'self-publishing', 'indie author', 'kindle', 'ebook', 'audiobook', 'book reviewer',
    'fiction writer', 'non-fiction', 'biography', 'memoir', 'autobiography', 'travel writer', 'food writer', 'lifestyle writer',
    'health writer', 'science writer', 'business writer', 'grant writer', 'proposal writer', 'white paper writer',
    'blog writer', 'article writer', 'web writer', 'seo writer', 'marketing writer', 'advertising copywriter',
    'social media writer', 'newsletter writer', 'press release writer', 'speech writer', 'content strategist',
    // Academic and research
    'researcher', 'student', 'academic', 'professor', 'instructor', 'lecturer', 'teacher', 'educator', 'tutor',
    'research', 'thesis', 'dissertation', 'phd', 'masters', 'doctorate', 'graduate student', 'undergraduate', 'postdoc',
    'college', 'university', 'scholar', 'fellow', 'research fellow', 'visiting scholar', 'emeritus professor',
    'librarian', 'archivist', 'curator', 'information specialist', 'research librarian', 'digital librarian',
    'historian', 'archaeologist', 'anthropologist', 'sociologist', 'psychologist', 'political scientist', 'economist',
    'philosopher', 'linguist', 'literature professor', 'english professor', 'writing professor', 'composition teacher',
    'graduate teaching assistant', 'teaching assistant', 'research assistant', 'lab coordinator', 'department chair',
    // Legal profession
    'lawyer', 'attorney', 'barrister', 'solicitor', 'counsel', 'advocate', 'legal counsel', 'in-house counsel',
    'law firm', 'legal assistant', 'legal secretary', 'paralegal', 'law student', 'law school', 'law clerk',
    'judge', 'magistrate', 'arbitrator', 'mediator', 'public defender', 'district attorney', 'prosecutor',
    'contract attorney', 'patent attorney', 'immigration lawyer', 'family lawyer', 'criminal lawyer', 'corporate lawyer',
    'intellectual property', 'ip lawyer', 'trademark attorney', 'estate planning', 'tax attorney', 'employment lawyer',
    // Finance and accounting
    'accountant', 'bookkeeper', 'cpa', 'certified public accountant', 'tax preparer', 'tax advisor', 'tax consultant',
    'auditor', 'internal auditor', 'external auditor', 'financial analyst', 'finance', 'financial advisor',
    'financial planner', 'investment advisor', 'wealth manager', 'portfolio manager', 'fund manager',
    'controller', 'cfo', 'chief financial officer', 'treasurer', 'budget analyst', 'cost accountant',
    'forensic accountant', 'management accountant', 'public accountant', 'staff accountant', 'senior accountant',
    // Healthcare and therapy
    'therapist', 'psychologist', 'counselor', 'social worker', 'psychiatrist', 'psychotherapist',
    'marriage counselor', 'family therapist', 'substance abuse counselor', 'grief counselor', 'career counselor',
    'clinical psychologist', 'school psychologist', 'child psychologist', 'neuropsychologist',
    'mental health counselor', 'licensed clinical social worker', 'lcsw', 'licensed professional counselor', 'lpc',
    // Consulting and analysis
    'consultant', 'business consultant', 'management consultant', 'strategy consultant', 'financial consultant',
    'it consultant', 'technology consultant', 'marketing consultant', 'hr consultant', 'organizational consultant',
    'policy analyst', 'research analyst', 'data analyst', 'business analyst', 'systems analyst', 'market analyst',
    'investment analyst', 'credit analyst', 'risk analyst', 'operations analyst', 'program analyst',
    // Remote and flexible work
    'long hours', 'extended typing', 'marathon typing', 'all day typing', 'work from home', 'remote work',
    'telecommuting', 'digital nomad', 'freelancer', 'independent contractor', 'consultant', 'solopreneur',
    'home office', 'remote worker', 'distributed team', 'virtual team', 'flexible schedule', 'part-time',
    // Creative and design (writing-heavy)
    'ux writer', 'content designer', 'information architect', 'documentation specialist', 'technical communicator',
    'grant writer', 'proposal writer', 'bid writer', 'rfo writer', 'compliance writer', 'policy writer',
    'training material developer', 'curriculum developer', 'instructional designer', 'e-learning developer',
    // Non-profit and government
    'non-profit', 'nonprofit', 'ngo', 'charity', 'foundation', 'grant writer', 'program coordinator',
    'policy analyst', 'government worker', 'civil servant', 'public administrator', 'city planner',
    'legislative aide', 'congressional aide', 'policy researcher', 'think tank', 'advocacy'
  ], priority: 'comfort', baseConfidence: 0.8 },
  
  // Pinky strain relief
  { keywords: [
    // Medical conditions affecting typing
    'arthritis', 'rheumatoid arthritis', 'osteoarthritis', 'juvenile arthritis', 'psoriatic arthritis',
    'rsi', 'repetitive strain injury', 'repetitive stress injury', 'overuse injury', 'cumulative trauma disorder',
    'carpal tunnel', 'carpal tunnel syndrome', 'cts', 'cubital tunnel syndrome', 'ulnar nerve entrapment',
    'tendonitis', 'tendinitis', 'de quervain tendinitis', 'trigger finger', 'stenosing tenosynovitis',
    'chronic pain', 'joint pain', 'finger pain', 'hand pain', 'wrist pain', 'forearm pain', 'elbow pain',
    'fibromyalgia', 'chronic fatigue syndrome', 'cfs', 'myalgic encephalomyelitis', 'lupus', 'systemic lupus erythematosus',
    'multiple sclerosis', 'ms', 'parkinsons', 'parkinson disease', 'essential tremor', 'hand tremor', 'finger tremor',
    'dystonia', 'focal dystonia', 'writers cramp', 'occupational dystonia', 'task-specific dystonia',
    'neuropathy', 'peripheral neuropathy', 'diabetic neuropathy', 'nerve damage', 'nerve compression',
    // Age-related and mobility issues
    'elderly', 'senior', 'senior citizen', 'elderly person', 'retirement', 'retired', 'golden years',
    'older adult', 'mature adult', 'aging', 'age-related', 'geriatric', 'over 65', 'over 70', 'octogenarian',
    'limited mobility', 'reduced mobility', 'motor impairment', 'fine motor skills', 'dexterity issues',
    'weak fingers', 'weak hands', 'finger weakness', 'hand weakness', 'grip strength', 'grip weakness',
    'stiff joints', 'joint stiffness', 'morning stiffness', 'inflammation', 'swollen joints', 'joint swelling',
    'pinky weakness', 'pinky problems', 'little finger weakness', 'outer finger weakness',
    // Disabilities and accessibility needs
    'disability', 'disabled', 'handicapped', 'accessibility', 'accessible', 'adaptive technology',
    'assistive technology', 'adaptive equipment', 'ergonomic equipment', 'special needs', 'accommodation',
    'ada compliance', 'americans with disabilities act', 'reasonable accommodation', 'workplace accommodation',
    'visual impairment', 'low vision', 'blind', 'partially sighted', 'hearing impairment', 'deaf', 'hard of hearing',
    'cognitive impairment', 'learning disability', 'dyslexia', 'adhd', 'attention deficit', 'autism', 'aspergers',
    'cerebral palsy', 'spina bifida', 'muscular dystrophy', 'amyotrophic lateral sclerosis', 'als', 'lou gehrigs',
    'spinal cord injury', 'sci', 'quadriplegia', 'paraplegia', 'tetraplegia', 'hemiplegia',
    // Therapy and rehabilitation
    'occupational therapy', 'physical therapy', 'pt', 'ot', 'rehabilitation', 'rehab', 'recovery',
    'hand therapy', 'hand therapist', 'certified hand therapist', 'cht', 'ergonomic assessment',
    'ergonomic evaluation', 'workplace ergonomics', 'computer ergonomics', 'typing ergonomics',
    'adaptive training', 'assistive training', 'rehabilitation training', 'therapeutic exercise',
    // Workplace and injury prevention
    'ergonomics', 'ergonomic', 'workplace injury', 'work-related injury', 'occupational injury',
    'workers compensation', 'workers comp', 'workplace safety', 'injury prevention', 'safety training',
    'overuse', 'strain injury', 'typing injury', 'computer injury', 'keyboard injury', 'mouse injury',
    'cumulative trauma', 'microtrauma', 'repetitive motion', 'repetitive use', 'overuse syndrome',
    // Health conditions requiring accommodation
    'chronic illness', 'autoimmune disease', 'inflammatory condition', 'connective tissue disorder',
    'ehlers danlos syndrome', 'eds', 'hypermobility syndrome', 'marfan syndrome', 'osteogenesis imperfecta',
    'diabetes', 'diabetic complications', 'thyroid disorder', 'hypothyroid', 'hyperthyroid',
    'vitamin deficiency', 'b12 deficiency', 'vitamin d deficiency', 'nutritional deficiency',
    'medication side effects', 'steroid effects', 'chemotherapy effects', 'radiation effects',
    // Recovery and adaptation
    'recovering from injury', 'post-surgical', 'post-surgery', 'healing', 'convalescent', 'recuperating',
    'returning to work', 'modified duties', 'light duty', 'restricted duty', 'work hardening',
    'adaptive strategies', 'compensation techniques', 'alternative methods', 'modified technique'
  ], priority: 'pinky_strain', baseConfidence: 0.95 },
  
  // General productivity and efficiency
  { keywords: [
    // Productivity and efficiency terms
    'productivity', 'efficiency', 'fast typing', 'speed', 'quick typing', 'rapid typing', 'typing practice', 'touch typing',
    'time management', 'task management', 'workflow optimization', 'process improvement', 'automation',
    'lean methodology', 'six sigma', 'continuous improvement', 'best practices', 'optimization',
    // Business and corporate roles
    'business', 'corporate', 'office work', 'professional', 'white collar', 'desk job', 'office job',
    'executive', 'manager', 'supervisor', 'team lead', 'team leader', 'director', 'vice president', 'vp',
    'chief executive', 'ceo', 'president', 'senior manager', 'middle management', 'project manager',
    'program manager', 'operations manager', 'general manager', 'regional manager', 'branch manager',
    'department head', 'division head', 'unit manager', 'site manager', 'facility manager',
    'business owner', 'entrepreneur', 'startup', 'startup founder', 'co-founder', 'small business owner',
    'franchise owner', 'business partner', 'investor', 'venture capitalist', 'angel investor',
    // Professional services
    'consultant', 'freelancer', 'contractor', 'independent contractor', 'self-employed', 'sole proprietor',
    'professional services', 'consulting services', 'advisory services', 'expert witness', 'subject matter expert',
    'business advisor', 'strategy advisor', 'financial advisor', 'technology advisor', 'marketing advisor',
    // Communication and documentation
    'email', 'communication', 'correspondence', 'business communication', 'professional communication',
    'meetings', 'conference calls', 'video calls', 'presentations', 'reports', 'documentation',
    'proposal writing', 'contract writing', 'business writing', 'professional writing',
    'memo writing', 'policy writing', 'procedure writing', 'manual writing', 'guide writing',
    // Sales and marketing
    'sales', 'sales manager', 'account manager', 'business development', 'bd', 'relationship manager',
    'client manager', 'customer success manager', 'sales representative', 'sales exec', 'account executive',
    'marketing', 'marketing manager', 'brand manager', 'product manager', 'campaign manager',
    'digital marketing', 'content marketing', 'email marketing', 'social media marketing',
    'market research', 'competitive analysis', 'lead generation', 'pipeline management',
    // Operations and logistics
    'operations', 'logistics', 'supply chain', 'procurement', 'purchasing', 'vendor management',
    'inventory management', 'warehouse management', 'distribution', 'shipping', 'receiving',
    'quality control', 'quality assurance', 'compliance', 'audit', 'risk management',
    // Human resources
    'human resources', 'hr', 'recruiting', 'talent acquisition', 'staffing', 'hiring',
    'employee relations', 'compensation', 'benefits', 'payroll', 'training', 'development',
    'performance management', 'organizational development', 'change management'
  ], priority: 'speed', baseConfidence: 0.7 },
  
  // General comfort and wellness
  { keywords: [
    // Comfort and ergonomics
    'comfort', 'comfortable', 'ergonomic', 'ergonomics', 'health', 'wellness', 'wellbeing', 'well-being',
    'healthy typing', 'comfortable typing', 'relaxed typing', 'natural typing', 'effortless typing',
    'posture', 'good posture', 'proper posture', 'neutral posture', 'typing posture', 'sitting posture',
    'workplace ergonomics', 'office ergonomics', 'computer ergonomics', 'desk ergonomics',
    'ergonomic setup', 'ergonomic workspace', 'ergonomic workstation', 'ergonomic assessment',
    // Pain and discomfort prevention
    'pain prevention', 'injury prevention', 'strain prevention', 'discomfort prevention',
    'back pain', 'neck pain', 'shoulder pain', 'arm pain', 'wrist pain', 'hand pain', 'finger pain',
    'upper back pain', 'lower back pain', 'cervical pain', 'thoracic pain', 'lumbar pain',
    'tension headache', 'eye strain', 'computer vision syndrome', 'dry eyes', 'blurred vision',
    // Wellness and health consciousness
    'workplace wellness', 'occupational health', 'employee wellness', 'corporate wellness',
    'health conscious', 'wellness focused', 'preventive care', 'proactive health', 'holistic health',
    'self care', 'self-care', 'mindful typing', 'mindfulness', 'stress reduction', 'stress management',
    'relaxation', 'meditation', 'breathing exercises', 'stretching', 'yoga', 'pilates',
    // Work-life balance
    'work-life balance', 'work life balance', 'balanced lifestyle', 'healthy work habits',
    'sustainable work practices', 'long-term health', 'career longevity', 'professional longevity',
    'burnout prevention', 'fatigue management', 'energy management', 'stamina', 'endurance',
    // Specific health and wellness roles
    'wellness coach', 'health coach', 'fitness coach', 'personal trainer', 'yoga instructor',
    'massage therapist', 'chiropractor', 'physical therapist', 'occupational therapist',
    'ergonomist', 'safety specialist', 'workplace safety', 'occupational safety', 'osha',
    'employee health', 'corporate health', 'wellness program', 'fitness program', 'health program',
    // Alternative and holistic health
    'holistic medicine', 'integrative medicine', 'functional medicine', 'naturopathic medicine',
    'acupuncture', 'acupuncturist', 'massage therapy', 'chiropractic care', 'osteopathic medicine',
    'herbal medicine', 'homeopathy', 'ayurveda', 'traditional chinese medicine', 'tcm',
    'meditation instructor', 'mindfulness coach', 'stress management coach', 'relaxation therapist'
  ], priority: 'comfort', baseConfidence: 0.7 },
  
  // Typing difficulties and layout struggles - strong indicators for comfort priority
  { keywords: [
    'weaker', 'fatigue', 'strain', 'slow', 'slowdown', 'mistake', 'typo', 'inaccuracy', 'error', 'difficulty',
    'frustration', 'pain', 'discomfort', 'stress', 'uncomfortable', 'awkward', 'weak', 'inefficient', 'problematic',
    'low speed', 'unsteady', 'stop', 'hesitate', 'stumble', 'clumsy', 'hard', 'poor precision', 'incorrect',
    'miss', 'missed', 'challenge', 'difficulty', 'delay', 'lag', 'break', 'pause', 'fail',
    'struggling', 'struggle', 'tired', 'exhausted', 'sore', 'ache', 'aching', 'hurt', 'hurting', 'painful',
    'cramped', 'stiff', 'tight', 'tense', 'tension', 'burning', 'numb', 'numbness', 'tingling',
    'inconsistent', 'unreliable', 'unpredictable', 'erratic', 'jerky', 'choppy', 'rough', 'bumpy',
    'difficult layout', 'bad layout', 'poor layout', 'hate my layout', 'layout problems', 'layout issues',
    'need better layout', 'looking for alternatives', 'switching layouts', 'layout change', 'improvement needed',
    'not working well', 'doesnt work', "doesn't work", 'not comfortable', 'hard to use', 'hard to type'
  ], priority: 'comfort', baseConfidence: 0.9 },
  
  // Speed struggles - users wanting to type faster or having speed issues
  { keywords: [
    'too slow', 'typing too slow', 'slow typing', 'low wpm', 'bad wpm', 'poor speed', 'slow speed',
    'need faster', 'want faster', 'speed up', 'type faster', 'faster typing', 'improve speed',
    'increase wpm', 'boost speed', 'speed improvement', 'typing speed issues', 'speed problems',
    'bottlenecked', 'held back', 'limited speed', 'speed ceiling', 'plateau', 'stuck at speed',
    'flow problems', 'no flow', 'choppy typing', 'broken flow', 'interrupted flow', 'stop-start',
    'rhythm issues', 'no rhythm', 'broken rhythm', 'awkward sequences', 'difficult combinations',
    'same finger', 'finger collision', 'finger conflict', 'finger jam', 'finger clash',
    'rolls not working', 'bad rolls', 'no rolls', 'alternation issues', 'hand coordination',
    'momentum loss', 'losing momentum', 'breaks momentum', 'flow killer', 'rhythm killer',
    'need efficiency', 'efficiency issues', 'wasted motion', 'too much movement', 'inefficient movement'
  ], priority: 'speed', baseConfidence: 0.85 },
  
  // Gaming struggles - users having issues with gaming performance
  { keywords: [
    'gaming problems', 'bad for gaming', 'gaming issues', 'cant game', "can't game", 'gaming performance',
    'wasd problems', 'wasd issues', 'wasd uncomfortable', 'movement keys', 'arrow keys problems',
    'gaming lag', 'input lag', 'key lag', 'response time', 'reaction time', 'slow response',
    'gaming fatigue', 'hand fatigue gaming', 'tired while gaming', 'sore from gaming',
    'reaching keys', 'keys too far', 'hard to reach', 'stretching fingers', 'awkward reach',
    'gaming accuracy', 'missing keys', 'wrong keys', 'misclicks', 'fat fingering',
    'hotkey problems', 'hotkey issues', 'keybind problems', 'macro issues', 'shortcut problems',
    'competitive disadvantage', 'losing games', 'performance drop', 'rank drop', 'skill ceiling',
    'esports performance', 'tournament performance', 'competitive edge', 'pro gaming',
    'streaming issues', 'while streaming', 'on stream', 'viewer complaints', 'chat complaints'
  ], priority: 'gaming', baseConfidence: 0.85 },
  
  // Programming struggles - users having coding-specific issues
  { keywords: [
    'coding problems', 'programming issues', 'development problems', 'coding fatigue', 'programming pain',
    'symbols hard', 'special characters', 'brackets problems', 'bracket hell', 'nested brackets',
    'reaching symbols', 'symbols too far', 'number row', 'function keys', 'modifier keys',
    'brace problems', 'parentheses issues', 'curly braces', 'square brackets', 'angle brackets',
    'semicolon problems', 'colon issues', 'underscore hard', 'dash problems', 'pipe symbol',
    'shift problems', 'too much shift', 'shift fatigue', 'shift strain', 'modifier strain',
    'vim problems', 'vim keys', 'editor shortcuts', 'ide shortcuts', 'hotkeys programming',
    'terminal problems', 'command line', 'shell commands', 'bash problems', 'cli issues',
    'stretching code', 'lateral stretch', 'finger stretching', 'hand stretching', 'wrist strain coding',
    'coding speed', 'slow coding', 'typing code slow', 'development speed', 'productivity coding'
  ], priority: 'programming', baseConfidence: 0.85 },
  
  // Pinky strain struggles - users specifically having pinky issues
  { keywords: [
    'pinky problems', 'pinky pain', 'pinky strain', 'pinky fatigue', 'pinky weakness', 'weak pinky',
    'pinky hurts', 'pinky sore', 'pinky ache', 'pinky tired', 'pinky uncomfortable',
    'little finger', 'little finger pain', 'little finger strain', 'little finger problems',
    'shift problems', 'shift pain', 'shift strain', 'shift fatigue', 'too much shift',
    'enter problems', 'enter pain', 'enter strain', 'enter key hard', 'enter uncomfortable',
    'backspace problems', 'backspace pain', 'backspace strain', 'backspace hard', 'backspace far',
    'ctrl problems', 'control key', 'ctrl strain', 'ctrl pain', 'modifier problems',
    'outer keys', 'edge keys', 'corner keys', 'far keys', 'reaching edges',
    'pinky overuse', 'pinky overwork', 'pinky too much', 'pinky heavy', 'pinky load',
    'avoid pinky', 'reduce pinky', 'minimize pinky', 'less pinky', 'pinky relief',
    'small hands', 'short fingers', 'finger length', 'reach problems', 'stretch problems',
    'finger independence', 'weak fingers', 'finger strength', 'grip issues', 'dexterity problems'
  ], priority: 'pinky_strain', baseConfidence: 0.9 },
  
  // Creative and media professionals (comfort-focused)
  { keywords: [
    // Creative writing and media
    'creative writer', 'creative writing', 'fiction writer', 'fantasy writer', 'sci-fi writer', 'romance writer',
    'mystery writer', 'thriller writer', 'horror writer', 'young adult writer', 'childrens book writer',
    'screenwriter', 'screenplay writer', 'script writer', 'television writer', 'tv writer', 'film writer',
    'documentary writer', 'video game writer', 'narrative designer', 'story designer', 'dialogue writer',
    'comic book writer', 'graphic novel writer', 'manga writer', 'webcomic creator', 'comic creator',
    // Publishing and editorial
    'publisher', 'book publisher', 'magazine publisher', 'digital publisher', 'indie publisher',
    'literary agent', 'book agent', 'publishing agent', 'manuscript reader', 'first reader', 'slush reader',
    'book reviewer', 'literary critic', 'book blogger', 'bookstagram', 'booktok', 'book influencer',
    'editorial assistant', 'editorial coordinator', 'publishing coordinator', 'production editor',
    'acquisitions editor', 'commissioning editor', 'series editor', 'anthology editor',
    // Digital content and social media
    'content creator', 'digital creator', 'influencer', 'social media influencer', 'youtuber',
    'blogger', 'vlogger', 'podcaster', 'newsletter writer', 'substack writer', 'medium writer',
    'instagram creator', 'tiktok creator', 'twitter creator', 'linkedin creator', 'facebook creator',
    'twitch streamer', 'youtube streamer', 'content strategist', 'social media strategist',
    // Photography and visual arts (with writing components)
    'photographer', 'photo journalist', 'wedding photographer', 'portrait photographer', 'travel photographer',
    'art critic', 'art reviewer', 'gallery curator', 'museum curator', 'exhibition curator',
    'art historian', 'art teacher', 'art instructor', 'creative director', 'artistic director'
  ], priority: 'comfort', baseConfidence: 0.75 },
  
  // Education and training (comfort and speed)
  { keywords: [
    // Teaching and education
    'teacher', 'educator', 'instructor', 'professor', 'lecturer', 'tutor', 'trainer', 'coach',
    'elementary teacher', 'middle school teacher', 'high school teacher', 'college professor', 'university professor',
    'kindergarten teacher', 'preschool teacher', 'daycare teacher', 'early childhood educator',
    'special education teacher', 'sped teacher', 'resource teacher', 'inclusion teacher',
    'english teacher', 'math teacher', 'science teacher', 'history teacher', 'social studies teacher',
    'art teacher', 'music teacher', 'pe teacher', 'physical education teacher', 'health teacher',
    'foreign language teacher', 'esl teacher', 'bilingual teacher', 'immersion teacher',
    'substitute teacher', 'supply teacher', 'relief teacher', 'guest teacher', 'student teacher',
    // Educational support and administration
    'principal', 'vice principal', 'assistant principal', 'dean', 'superintendent', 'provost',
    'academic advisor', 'guidance counselor', 'school counselor', 'career counselor',
    'school psychologist', 'school social worker', 'school nurse', 'school librarian',
    'curriculum coordinator', 'instructional coordinator', 'department chair', 'grade level chair',
    'literacy coach', 'reading specialist', 'math coach', 'instructional coach',
    // Online and distance education
    'online teacher', 'online instructor', 'distance education', 'remote teaching', 'virtual teacher',
    'e-learning developer', 'instructional designer', 'curriculum developer', 'course developer',
    'educational technology', 'edtech', 'learning management system', 'lms administrator',
    'online course creator', 'udemy instructor', 'coursera instructor', 'skillshare teacher',
    // Training and corporate education
    'corporate trainer', 'business trainer', 'sales trainer', 'technical trainer', 'safety trainer',
    'compliance trainer', 'diversity trainer', 'leadership trainer', 'management trainer',
    'professional development', 'continuing education', 'adult education', 'vocational training'
  ], priority: 'comfort', baseConfidence: 0.75 },
  
  // Healthcare professionals (comfort-focused)
  { keywords: [
    // Medical professionals
    'doctor', 'physician', 'md', 'medical doctor', 'family doctor', 'primary care physician',
    'specialist', 'internist', 'pediatrician', 'geriatrician', 'psychiatrist', 'radiologist',
    'pathologist', 'anesthesiologist', 'surgeon', 'cardiologist', 'neurologist', 'oncologist',
    'nurse', 'registered nurse', 'rn', 'nurse practitioner', 'np', 'clinical nurse specialist',
    'charge nurse', 'head nurse', 'nurse manager', 'nurse supervisor', 'nurse educator',
    'icu nurse', 'er nurse', 'operating room nurse', 'surgical nurse', 'recovery nurse',
    // Allied health professionals
    'physician assistant', 'pa', 'medical assistant', 'clinical assistant', 'nursing assistant',
    'medical scribe', 'medical secretary', 'medical receptionist', 'medical clerk',
    'health information technician', 'medical records technician', 'medical coder', 'medical biller',
    'pharmacy technician', 'lab technician', 'radiology technician', 'surgical technician',
    'respiratory therapist', 'occupational therapist', 'physical therapist', 'speech therapist',
    // Mental health professionals
    'psychologist', 'therapist', 'counselor', 'social worker', 'case manager', 'care coordinator',
    'clinical psychologist', 'licensed psychologist', 'licensed therapist', 'licensed counselor',
    'marriage and family therapist', 'substance abuse counselor', 'addiction counselor',
    // Healthcare administration
    'healthcare administrator', 'hospital administrator', 'clinic manager', 'practice manager',
    'medical office manager', 'patient coordinator', 'insurance specialist', 'prior authorization',
    'healthcare quality', 'patient safety', 'risk management', 'compliance officer'
  ], priority: 'comfort', baseConfidence: 0.8 },
  
  // Additional programming related
  { keywords: [
    'open source', 'github', 'stackoverflow', 'stack overflow', 'hackathon', 'bootcamp', 'coding bootcamp',
    'software development', 'web development', 'mobile development', 'game development', 'app development',
    // Programming communities and culture
    'tech meetup', 'developer meetup', 'programming meetup', 'code review', 'pair programming',
    'code kata', 'programming challenge', 'coding interview', 'technical interview',
    'tech conference', 'developer conference', 'programming conference', 'tech talk', 'lightning talk',
    'tech blog', 'programming blog', 'developer blog', 'technical blog', 'coding tutorial',
    'tech podcast', 'programming podcast', 'developer podcast', 'coding podcast',
    // Programming education and learning
    'learn to code', 'coding tutorial', 'programming course', 'computer science degree',
    'software engineering degree', 'coding certification', 'tech certification', 'aws certification',
    'google certification', 'microsoft certification', 'oracle certification', 'cisco certification',
    'self-taught programmer', 'autodidact', 'career changer', 'coding career', 'tech career'
  ], priority: 'programming', baseConfidence: 0.8 }
];

const RecommendationsPage: React.FC = () => {
  const [selectedPreference, setSelectedPreference] = useState<PreferenceType>('comfort');
  const [recommendations, setRecommendations] = useState<LayoutWithStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [allLayouts, setAllLayouts] = useState<LayoutWithStats[]>([]);
  const [error, setError] = useState<RecommendationError | null>(null);
  const [occupationQuery, setOccupationQuery] = useState('');
  const [suggestedPreference, setSuggestedPreference] = useState<{preference: PreferenceType, confidence: number} | null>(null);

  const preferences: Preference[] = [
    {
      id: 'comfort',
      name: 'comfort',
      description: 'minimize finger strain and maximize typing comfort',
      icon: <Heart className="w-5 h-5" />,
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 'speed',
      name: 'speed',
      description: 'optimize for maximum typing speed and flow',
      icon: <Zap className="w-5 h-5" />,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'gaming',
      name: 'gaming',
      description: 'best layouts for gaming performance',
      icon: <Gamepad2 className="w-5 h-5" />,
      color: 'from-blue-500 to-indigo-500'
    },
    {
      id: 'programming',
      name: 'programming',
      description: 'optimized for coding and special characters',
      icon: <Code className="w-5 h-5" />,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'pinky_strain',
      name: 'pinky relief',
      description: 'minimize pinky finger usage and strain',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'from-purple-500 to-violet-500'
    }
  ];

  useEffect(() => {
    fetchAllLayouts();
  }, []);

  const fetchAllLayouts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/layouts');
      if (response.ok) {
        const data = await response.json();
        setAllLayouts(data);
      } else {
        const errorMessage = response.status === 404 
          ? 'Layout data not found. Please ensure the backend is running.'
          : `Failed to fetch layouts (${response.status})`;
        setError({ 
          message: errorMessage,
          details: 'Unable to load keyboard layout data from the server.'
        });
      }
    } catch (error) {
      console.error('Error fetching layouts:', error);
      setError({ 
        message: 'Unable to connect to the server',
        details: 'Please check your internet connection and try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = async () => {
    if (allLayouts.length === 0) return;
    
    setLoading(true);
    setError(null);
    
    // Temporarily disable API to test client-side scoring
    console.log('Using client-side scoring for preference:', selectedPreference);
    
    // try {
    //   // Try to get recommendations from API first
    //   const response = await fetch('/api/recommendations', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ preferences: selectedPreference }),
    //   });
    //   
    //   if (response.ok) {
    //     const data = await response.json();
    //     setRecommendations(data);
    //     setLoading(false);
    //     return;
    //   }
    // } catch (error) {
    //   console.log('API recommendations not available, using client-side scoring:', error);
    // }
    
    // Fallback to client-side scoring if API is not available
    try {
      const scored = scoreLayouts(allLayouts, selectedPreference);
      setRecommendations(scored.slice(0, 8)); // Show top 8 recommendations
    } catch (error) {
      console.error('Error generating recommendations:', error);
      setError({ 
        message: 'Failed to generate recommendations',
        details: 'Unable to analyze layout data. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const scoreLayouts = (layouts: LayoutWithStats[], preference: PreferenceType): LayoutWithStats[] => {
    const weights = {
      comfort: {
        // Primary comfort metrics - focus on minimizing strain
        effort: -0.3,                    // Highest priority on low effort
        distance: -0.25,                 // Minimize finger travel
        same_finger_bigrams_pct: -0.2,   // Avoid awkward same-finger sequences
        lateral_stretch_pct: -0.2,      // Minimize uncomfortable stretches
        // Pinky comfort (but not as extreme as pinky_strain priority)
        pinky_distance: -0.15,
        pinky_off_home_pct: -0.1,
        // Gentle flow preferences for sustainable typing
        trigram_alt_pct: 0.1,           // Light preference for alternation
        roll_in_pct: 0.05,              // Very light preference for inward rolls
        // Avoid problematic patterns
        two_row_jumps_pct: -0.1,        // Minimize row jumping
        skip_bigrams_pct: -0.05         // Light penalty for skips
      },
      speed: {
        // Primary speed metrics - maximize typing flow and efficiency
        roll_in_pct: 0.35,              // Strong preference for fast inward rolls
        roll_out_pct: 0.25,             // Good outward rolls for rhythm
        trigram_alt_pct: 0.3,           // High alternation for speed
        // Heavily penalize flow-breaking patterns
        same_finger_bigrams_pct: -0.3,  // Major penalty for flow killers
        skip_bigrams_pct: -0.2,         // Penalize inefficient movements
        // Moderate comfort considerations (speed over comfort)
        effort: -0.15,                  // Some effort consideration
        lateral_stretch_pct: -0.1,      // Light penalty for stretches
        // Avoid slow patterns
        two_row_jumps_pct: -0.15,       // Row jumps slow typing down
        pinky_scissors_pct: -0.1        // Scissors slow down flow
      },
      gaming: {
        // Primary gaming metrics - focus on WASD area and common keys
        effort: -0.25,                  // Important for long gaming sessions
        distance: -0.2,                 // Quick key access
        col5_6_pct: -0.25,             // Avoid outer columns (bad for WASD)
        two_row_jumps_pct: -0.2,       // Minimize row jumping (bad for gaming)
        pinky_scissors_pct: -0.15,     // Avoid awkward pinky movements
        // Gaming-specific flow (different from typing)
        roll_in_pct: 0.2,              // Good for common key combinations
        trigram_alt_pct: 0.15,         // Moderate alternation
        // Moderate penalties for gaming-unfriendly patterns
        same_finger_bigrams_pct: -0.1,  // Less critical than typing
        lateral_stretch_pct: -0.1,      // Some stretch penalty
        pinky_off_home_pct: -0.1,       // Moderate pinky usage penalty
        skip_bigrams_pct: -0.05         // Light skip penalty
      },
      programming: {
        // Primary programming metrics - symbol accessibility and comfort
        lateral_stretch_pct: -0.25,     // Critical for reaching symbols
        skip_bigrams_pct: -0.2,         // Important for symbol combinations
        effort: -0.25,                  // Long coding sessions need comfort
        same_finger_bigrams_pct: -0.2,  // Awkward for complex code
        // Flow metrics for coding efficiency
        trigram_alt_pct: 0.2,           // Good alternation helps with coding
        roll_in_pct: 0.15,              // Moderate roll preference
        roll_out_pct: 0.1,              // Some outward roll benefit
        // Programming-specific considerations
        distance: -0.15,                // Moderate distance penalty
        two_row_jumps_pct: -0.1,        // Light row jump penalty
        pinky_off_home_pct: -0.05,      // Very light pinky penalty
        col5_6_pct: -0.05               // Very light outer column penalty
      },
      pinky_strain: {
        // Primary pinky metrics - heavily weighted
        pinky_distance: -0.4,
        pinky_off_home_pct: -0.35,
        pinky_scissors_pct: -0.3,
        col5_6_pct: -0.35,
        // Completely different approach from programming - focus on comfort over efficiency
        effort: -0.25,  // Much higher weight on low effort
        distance: -0.2,  // Prefer shorter finger travel
        // Avoid metrics that programming focuses on
        // skip_bigrams_pct: not used (programming uses this heavily)
        // Instead focus on flow and alternation to reduce pinky load
        trigram_alt_pct: 0.2,  // Higher alternation reduces pinky overuse
        roll_out_pct: 0.15,    // Different roll direction preference than programming
        // Penalize stretches more heavily
        lateral_stretch_pct: -0.25,
        // Small bonus for lower same finger bigrams (comfort focus)
        same_finger_bigrams_pct: -0.05
      }
    };

    const selectedWeights = weights[preference];

    return layouts.map(layout => {
      let score = 0;
      
      for (const [metric, weight] of Object.entries(selectedWeights)) {
        const value = (layout as any)[metric];
        if (value !== null && value !== undefined) {
          let normalizedValue = value;
          if (metric.endsWith('_pct')) {
            normalizedValue = value / 100;
          }
          score += normalizedValue * weight;
        }
      }
      
      return {
        ...layout,
        recommendation_score: score
      };
    }).sort((a, b) => (b.recommendation_score || 0) - (a.recommendation_score || 0));
  };

  const getMetricColor = (value: number | undefined, good: number, bad: number, lowerIsBetter: boolean = true) => {
    if (value === undefined) return 'text-gray-400';
    if (lowerIsBetter) {
      return value <= good ? 'text-green-500' : value >= bad ? 'text-red-500' : 'text-yellow-500';
    } else {
      return value >= good ? 'text-green-500' : value <= bad ? 'text-red-500' : 'text-yellow-500';
    }
  };

  // Enhanced occupation priority detection algorithm
  const analyzeOccupation = useCallback((query: string) => {
    if (!query.trim()) {
      setSuggestedPreference(null);
      return;
    }

    const lowercaseQuery = query.toLowerCase().trim();
    const queryWords = lowercaseQuery.split(/\s+/);
    
    // Initialize scoring data for each preference
    const preferenceScores: { [key in PreferenceType]: {
      totalScore: number;
      exactMatches: string[];
      partialMatches: string[];
      categoryCount: number;
      totalKeywords: number;
      matchedKeywords: number;
      highConfidenceKeywords: number;
    } } = {
      comfort: { totalScore: 0, exactMatches: [], partialMatches: [], categoryCount: 0, totalKeywords: 0, matchedKeywords: 0, highConfidenceKeywords: 0 },
      speed: { totalScore: 0, exactMatches: [], partialMatches: [], categoryCount: 0, totalKeywords: 0, matchedKeywords: 0, highConfidenceKeywords: 0 },
      gaming: { totalScore: 0, exactMatches: [], partialMatches: [], categoryCount: 0, totalKeywords: 0, matchedKeywords: 0, highConfidenceKeywords: 0 },
      programming: { totalScore: 0, exactMatches: [], partialMatches: [], categoryCount: 0, totalKeywords: 0, matchedKeywords: 0, highConfidenceKeywords: 0 },
      pinky_strain: { totalScore: 0, exactMatches: [], partialMatches: [], categoryCount: 0, totalKeywords: 0, matchedKeywords: 0, highConfidenceKeywords: 0 }
    };

    // Analyze each mapping category
    for (const mapping of occupationMappings) {
      const preferenceData = preferenceScores[mapping.priority];
      preferenceData.categoryCount++;
      preferenceData.totalKeywords += mapping.keywords.length;
      
      let categoryScore = 0;
      let categoryMatches = 0;
      let categoryExactMatches = 0;
      let categoryPartialMatches = 0;
      const categoryExactMatchList: string[] = [];
      const categoryPartialMatchList: string[] = [];

      for (const keyword of mapping.keywords) {
        const keywordLower = keyword.toLowerCase();
        let matchScore = 0;
        let matchType: 'none' | 'partial' | 'exact' = 'none';

        // Check for exact word boundary matches (highest priority)
        // Escape special regex characters in the keyword
        const escapedKeyword = keywordLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const exactWordRegex = new RegExp(`\\b${escapedKeyword}\\b`);
        if (exactWordRegex.test(lowercaseQuery)) {
          matchScore = 2.0;
          matchType = 'exact';
          categoryExactMatches++;
          categoryExactMatchList.push(keyword);
        }
        // Check for partial matches within the query
        else if (lowercaseQuery.includes(keywordLower)) {
          matchScore = 1.0;
          matchType = 'partial';
          categoryPartialMatches++;
          categoryPartialMatchList.push(keyword);
        }
        // Check for fuzzy matches (any word in query contains keyword or vice versa)
        else {
          for (const queryWord of queryWords) {
            if (queryWord.includes(keywordLower) || keywordLower.includes(queryWord)) {
              if (queryWord.length >= 3 && keywordLower.length >= 3) { // Avoid tiny word matches
                matchScore = 0.3;
                matchType = 'partial';
                categoryPartialMatches++;
                categoryPartialMatchList.push(keyword);
                break;
              }
            }
          }
        }

        if (matchScore > 0) {
          categoryMatches++;
          preferenceData.matchedKeywords++;
          
          // Apply keyword weighting based on specificity and importance
          let keywordWeight = 1.0;
          
          // Higher weight for highly specific technical terms
          if (keyword.length > 8 || keyword.includes(' ')) {
            keywordWeight *= 1.3;
          }
          
          // Higher weight for core role identifiers
          const coreRoles = ['developer', 'programmer', 'gamer', 'writer', 'banker', 'accountant', 'designer', 'analyst', 'manager'];
          if (coreRoles.some(role => keyword.includes(role))) {
            keywordWeight *= 1.5;
          }
          
          // Higher weight for direct struggle indicators
          if (keyword.includes('pain') || keyword.includes('strain') || keyword.includes('problem') || keyword.includes('difficulty')) {
            keywordWeight *= 2.0;
          }
          
          // Apply the keyword weight to the match score
          const weightedScore = matchScore * keywordWeight;
          categoryScore += weightedScore;
        }
      }

      // Aggregate category results into preference data
      if (categoryMatches > 0) {
        // Apply category confidence multiplier
        const categoryMultiplier = mapping.baseConfidence;
        const adjustedCategoryScore = categoryScore * categoryMultiplier;
        
        preferenceData.totalScore += adjustedCategoryScore;
        preferenceData.exactMatches.push(...categoryExactMatchList);
        preferenceData.partialMatches.push(...categoryPartialMatchList);
        
        if (categoryExactMatches > 0) {
          preferenceData.highConfidenceKeywords += categoryExactMatches;
        }
      }
    }

    // Calculate final confidence scores for each preference
    let bestPreference: PreferenceType | null = null;
    let bestConfidence = 0;
    let bestAnalysis: OccupationAnalysis | null = null;

    for (const [preference, data] of Object.entries(preferenceScores)) {
      if (data.totalScore > 0) {
        const prefType = preference as PreferenceType;
        
        // Calculate various confidence factors
        const rawScore = data.totalScore;
        const matchRatio = data.matchedKeywords / Math.max(data.totalKeywords, 1);
        const exactMatchBonus = Math.min(data.exactMatches.length * 0.2, 1.0);
        const highConfidenceBonus = Math.min(data.highConfidenceKeywords * 0.15, 0.8);
        const diversityBonus = Math.min(data.categoryCount * 0.1, 0.5);
        
        // Base confidence calculation
        let confidence = rawScore * 0.1; // Scale down the raw score
        confidence += exactMatchBonus;
        confidence += highConfidenceBonus;
        confidence += diversityBonus;
        
        // Apply match ratio boost for high-coverage matches
        if (matchRatio > 0.05) {
          confidence *= (1 + matchRatio);
        }
        
        // Cap confidence to reasonable range
        confidence = Math.min(confidence, 1.0);
        
        // Apply minimum threshold - only suggest if confidence is meaningful
        if (confidence >= 0.15) {
          if (confidence > bestConfidence) {
            bestConfidence = confidence;
            bestPreference = prefType;
            bestAnalysis = {
              preference: prefType,
              confidence: confidence,
              matchDetails: {
                exactMatches: data.exactMatches,
                partialMatches: data.partialMatches,
                categoryScores: { [prefType]: data.totalScore },
                totalKeywords: data.totalKeywords,
                matchedKeywords: data.matchedKeywords
              }
            };
          }
        }
      }
    }

    // Set the best match result
    if (bestPreference && bestAnalysis) {
      setSuggestedPreference({
        preference: bestPreference,
        confidence: bestConfidence
      });
    } else {
      setSuggestedPreference(null);
    }
  }, []);

  // Handle occupation search input
  const handleOccupationSearch = (query: string) => {
    setOccupationQuery(query);
    analyzeOccupation(query);
  };

  // Apply suggested preference
  const applySuggestion = () => {
    if (suggestedPreference) {
      setSelectedPreference(suggestedPreference.preference);
      setSuggestedPreference(null); // Clear suggestion after applying
    }
  };

  useEffect(() => {
    if (allLayouts.length > 0) {
      generateRecommendations();
    }
  }, [selectedPreference, allLayouts, generateRecommendations]);


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Lightbulb className="w-10 h-10 text-purple-400" />
            <h1 className="text-4xl font-bold gradient-text">
              layout recommendations
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            get personalized keyboard layout recommendations based on your typing preferences and use case
          </p>
        </div>

        {/* Occupation Priority Search */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Search className="text-purple-500" size={20} />
            <h2 className="text-lg font-bold gradient-purple-pink">priority detection</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            tell us about your occupation or interests, and we'll detect the best priority for you
          </p>
          
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="e.g., software developer, gamer, writer, data entry clerk, student..."
              value={occupationQuery}
              onChange={(e) => handleOccupationSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
            />
          </div>
          
          {/* Priority Suggestion Display */}
          {suggestedPreference && (
            <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${preferences.find(p => p.id === suggestedPreference.preference)?.color} flex items-center justify-center text-white`}>
                      {preferences.find(p => p.id === suggestedPreference.preference)?.icon}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                        🎯 detected priority:
                      </span>
                      <span className="font-bold gradient-text">
                        {preferences.find(p => p.id === suggestedPreference.preference)?.name}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {preferences.find(p => p.id === suggestedPreference.preference)?.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={applySuggestion}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 text-sm font-medium flex items-center gap-2"
                >
                  <ArrowRight size={14} />
                  apply
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Preference Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="text-purple-500" size={20} />
            <h2 className="text-lg font-bold gradient-text">choose your priority</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {preferences.map((pref) => (
              <button
                key={pref.id}
                onClick={() => setSelectedPreference(pref.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedPreference === pref.id
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                }`}
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${pref.color} flex items-center justify-center text-white mb-3 mx-auto`}>
                  {pref.icon}
                </div>
                <h3 className="font-semibold mb-1">{pref.name}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">{pref.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="text-red-600 dark:text-red-400 font-semibold">{error.message}</div>
            </div>
            {error.details && (
              <p className="text-red-600 dark:text-red-400 text-sm">{error.details}</p>
            )}
              <button
                onClick={() => {
                  setError(null);
                  fetchAllLayouts();
                }}
                className="mt-3 px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-700 hover:to-pink-700 transition-all duration-200 text-sm"
              >
                try again
              </button>
          </div>
        )}

        {/* Recommendations */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">
              {allLayouts.length === 0 ? 'Loading keyboard layouts...' : 'Generating recommendations...'}
            </p>
          </div>
        ) : error ? null : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Star className="text-yellow-500" size={20} />
                <h2 className="text-xl font-bold gradient-text">recommended for {preferences.find(p => p.id === selectedPreference)?.name}</h2>
              </div>
              {allLayouts.length > 0 && (
                <Link
                  to="/layouts"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-600 rounded-lg transition-all duration-200 text-sm font-medium"
                >
                  <Search size={14} />
                  browse all layouts
                  <ArrowRight size={14} />
                </Link>
              )}
            </div>
            
            {recommendations.length > 0 ? (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {recommendations.map((layout, index) => (
                    <Link
                      key={layout.id}
                      to={`/layouts/${encodeURIComponent(layout.slug)}`}
                      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] border-2 hover:border-purple-300 dark:hover:border-purple-700"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <span className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 text-sm font-bold px-2 py-1 rounded">
                          #{index + 1}
                        </span>
                        <h3 className="text-xl font-bold gradient-purple-pink">{layout.name.toLowerCase()}</h3>
                      </div>

                      {/* Key Metrics */}
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">effort</div>
                          <div className={`font-semibold ${getMetricColor(layout.effort, 8.5, 12.0)}`}>
                            {layout.effort?.toFixed(2) || 'N/A'}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">sfbs</div>
                          <div className={`font-semibold ${getMetricColor(layout.same_finger_bigrams_pct, 4.0, 10.0)}`}>
                            {layout.same_finger_bigrams_pct?.toFixed(1)}%
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">roll in</div>
                          <div className={`font-semibold ${getMetricColor(layout.roll_in_pct, 25, 15, false)}`}>
                            {layout.roll_in_pct?.toFixed(1)}%
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">alt</div>
                          <div className={`font-semibold ${getMetricColor(layout.trigram_alt_pct, 35, 25, false)}`}>
                            {layout.trigram_alt_pct?.toFixed(1)}%
                          </div>
                        </div>
                      </div>

                    </Link>
                  ))}
                </div>
                
                {/* Browse All Layouts Section */}
                <div className="mt-12 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-8 text-center border border-purple-200 dark:border-purple-700">
                  <h3 className="text-lg font-bold gradient-text mb-2">want to explore more?</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    browse our complete collection of {allLayouts.length} keyboard layouts with detailed analysis and comparisons
                  </p>
                  <Link
                    to="/layouts"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 font-medium"
                  >
                    <Search size={18} />
                    browse all layouts
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <h3 className="text-lg font-semibold gradient-text mb-2">
                    no recommendations available
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {allLayouts.length === 0 
                      ? 'no layout data available. please check your server connection.'
                      : 'unable to generate recommendations with the current data. try exploring all layouts instead.'
                    }
                  </p>
                  {allLayouts.length > 0 && (
                    <Link
                      to="/layouts"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 font-medium"
                    >
                      <Search size={18} />
                      browse all layouts
                      <ArrowRight size={18} />
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

};

export default RecommendationsPage;
