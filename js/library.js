/* PDPA control library.
   Source texts: Personal Data Protection Act, No. 9 of 2022 and Personal Data Protection (Amendment) Act, No. 22 of 2025.
   Commencement: Extraordinary Gazette No. 2498/16 (Order of 13 July 2026, published 22 July 2026).
   Statutory text in `text` is quoted from the Acts. `look`, `q` and `fix` are TechNeura wording. */
window.PDPA = (function () {
  'use strict';

  var VERIFIED = '16 November 2026';
  var ACT = 'Personal Data Protection Act, No. 9 of 2022';
  var AMD = 'Personal Data Protection (Amendment) Act, No. 22 of 2025';

  var COMM = {
    inforce: { label: 'In operation 1 Jan 2027', short: 'In operation', desc: 'Sections 2 and 3, Part I and Part III come into operation on 1 January 2027 under Extraordinary Gazette No. 2498/16.' },
    rules: { label: 'In operation 1 Jan 2027, details await rules', short: 'Awaits rules', desc: 'The obligation comes into operation on 1 January 2027. Its form, thresholds or time periods are left to rules, regulations, guidelines or directives. No final gazetted version was located when this library was verified.' },
    counsel: { label: 'In operation 1 Jan 2027, counsel to confirm', short: 'Counsel to confirm', desc: 'The provision comes into operation on 1 January 2027 but refers to Part II, which Gazette No. 2498/16 does not bring into operation. Legal counsel should confirm how it applies meanwhile.' },
    future: { label: 'Not yet in operation', short: 'Not yet in operation', desc: 'Part II (rights of data subjects) and Part IV (solicited messages) are not brought into operation by Gazette No. 2498/16. Assessed here as future readiness.' }
  };

  var DOMAINS = [
    { id: 'lawful', name: 'Lawful processing', refs: 's.5, Schedules I to IV', marginal: 'Obligation to process personal data in a lawful manner' },
    { id: 'principles', name: 'Purpose, minimisation, accuracy and retention', refs: 'ss.6 to 9', marginal: 'Obligations to define a purpose, confine processing to it, ensure accuracy and limit the period of retention' },
    { id: 'security', name: 'Integrity and confidentiality', refs: 's.10', marginal: 'Obligation to maintain integrity and confidentiality' },
    { id: 'transparency', name: 'Transparency', refs: 's.11, Schedule V', marginal: 'Obligation to process personal data in a transparent manner' },
    { id: 'dpmp', name: 'Data Protection Management Programme', refs: 's.12', marginal: 'Accountability in the processing of personal data' },
    { id: 'dpo', name: 'Data Protection Officer', refs: 's.20', marginal: 'Designation or appointment of the Data Protection Officer' },
    { id: 'processors', name: 'Processors and joint controllers', refs: 'ss.21 to 22', marginal: 'Additional obligations of a controller; additional obligations of the processors' },
    { id: 'breach', name: 'Personal data breach', refs: 's.23', marginal: 'Personal data breach notifications' },
    { id: 'dpia', name: 'Impact assessments', refs: 'ss.24 to 25', marginal: 'Personal data protection impact assessments; measures to mitigate risks of harm' },
    { id: 'xborder', name: 'Cross-border data flow', refs: 's.26', marginal: 'Cross-border data flow' },
    { id: 'rights', name: 'Rights of data subjects', refs: 'Part II, ss.13 to 19', marginal: 'Rights of data subjects', future: true },
    { id: 'marketing', name: 'Solicited messages', refs: 'Part IV, s.27', marginal: 'Solicited messages to data subjects by controllers', future: true }
  ];

  var TDOMS = {
    disc: 'Personal data discovery and system mapping',
    acc: 'Access control and identity management',
    sto: 'Data storage and protection controls',
    app: 'Application and platform security',
    log: 'Logging, monitoring and audit trails',
    ret: 'Data retention and secure disposal',
    brd: 'Incident and breach detection capability',
    tp: 'Third-party and cloud technical controls',
    dsr: 'Data subject rights: technical enablement',
    aln: 'Alignment with cybersecurity controls'
  };

  var DOCS = [
    { id: 'ropa', g: 'gov', name: 'Record of processing activities', desc: 'What personal data is processed, why, on which lawful basis and who receives it. If there is none, build it in the Processing register and this item completes itself.' },
    { id: 'notice', g: 'gov', name: 'Privacy notices', desc: 'Every notice given to individuals when their data is collected: website, app, forms, customer and employee notices.' },
    { id: 'consent', g: 'gov', name: 'Consent wording and consent records', desc: 'The wording used to ask for consent and how each consent is recorded.' },
    { id: 'forms', g: 'gov', name: 'Data collection forms', desc: 'Samples of the forms, screens or scripts used to collect personal data. Blank copies only.' },
    { id: 'lia', g: 'gov', name: 'Legitimate interest assessments', desc: 'The written reasoning for each activity that relies on legitimate interests.' },
    { id: 'retention', g: 'gov', name: 'Retention schedule', desc: 'How long each category of personal data is kept, or the criteria used to decide.' },
    { id: 'accuracy', g: 'gov', name: 'Data accuracy and correction procedure', desc: 'How personal data is kept accurate and how errors are corrected or erased.' },
    { id: 'dppolicy', g: 'gov', name: 'Data protection policy or programme document', desc: 'The internal controls and procedures that make up the Data Protection Management Programme.' },
    { id: 'governance', g: 'gov', name: 'Governance records', desc: 'Committee terms of reference, reporting lines and minutes that show oversight of data protection.' },
    { id: 'complaints', g: 'gov', name: 'Complaints and inquiries procedure', desc: 'How complaints about personal data are received and inquired into.' },
    { id: 'monitoring', g: 'gov', name: 'Monitoring and review records', desc: 'Internal audits, reviews or assessments of the programme and the changes that followed.' },
    { id: 'dpo', g: 'gov', name: 'Data Protection Officer appointment', desc: 'Appointment letter, terms of reference, qualifications and where the contact details are published.' },
    { id: 'processors', g: 'gov', name: 'List of processors', desc: 'Every organisation that processes personal data on your behalf, and what each one does.' },
    { id: 'vendordd', g: 'gov', name: 'Processor due diligence records', desc: 'How each processor was checked for technical and organisational measures before use.' },
    { id: 'contracts', g: 'gov', name: 'Processor agreements', desc: 'Signed agreements or the standard template, with a sample of each type.' },
    { id: 'joint', g: 'gov', name: 'Joint controller arrangements', desc: 'Agreements or records showing how joint controllers share responsibility.' },
    { id: 'breach', g: 'gov', name: 'Personal data breach procedure', desc: 'How a breach is identified, escalated, recorded and notified.' },
    { id: 'dpia', g: 'gov', name: 'Data protection impact assessments', desc: 'Completed assessments and the procedure that triggers them.' },
    { id: 'xborder', g: 'gov', name: 'Cross-border transfer records', desc: 'Countries and recipients for each flow, with the section 26 ground or instrument relied on.' },
    { id: 'criminal', g: 'gov', name: 'Authority for criminal investigation processing', desc: 'The written law relied on and the safeguards applied.' },
    { id: 'instructions', g: 'gov', name: 'Controller instructions', desc: 'Contracts or written instructions from the controllers you process for.' },
    { id: 'confidentiality', g: 'gov', name: 'Staff confidentiality undertakings', desc: 'The confidentiality and secrecy terms that bind employees, consultants and agents. Template only.' },
    { id: 'subproc', g: 'gov', name: 'Sub-processor agreements', desc: 'Agreements with any processor you engage for your controller clients.' },
    { id: 'datamap', g: 'tech', name: 'System inventory and data flow map', desc: 'Systems that hold personal data and how it moves between them and to third parties.' },
    { id: 'secpolicy', g: 'tech', name: 'Information security policy and standards', desc: 'The approved security policy and any framework certificates or mappings (for example ISO 27001).' },
    { id: 'access', g: 'tech', name: 'Access control standard and latest access review', desc: 'Joiner, mover and leaver process, role definitions, MFA coverage and the most recent review. Remove names before uploading.' },
    { id: 'crypto', g: 'tech', name: 'Encryption and key management standard', desc: 'What is encrypted at rest and in transit, and how keys are handled.' },
    { id: 'logging', g: 'tech', name: 'Logging and monitoring standard', desc: 'What access to personal data is logged, how long logs are kept and what is alerted on.' },
    { id: 'backup', g: 'tech', name: 'Backup, retention and disposal procedure', desc: 'Backup protection, retention periods, purge and secure disposal.' },
    { id: 'cloud', g: 'tech', name: 'Cloud and vendor access summary', desc: 'Hosting regions, public exposure settings, vendor access paths and data exchange methods.' },
    { id: 'appsec', g: 'tech', name: 'Application security standard or latest test report', desc: 'How applications mask, validate and limit personal data, and how sessions are managed.' },
    { id: 'incident', g: 'tech', name: 'Security incident response procedure', desc: 'Detection, evidence preservation and escalation steps.' },
    { id: 'rights', g: 'future', name: 'Data subject rights procedure', desc: 'How access, withdrawal, objection, rectification and erasure requests are received, decided and answered.' },
    { id: 'marketing', g: 'future', name: 'Marketing consent and opt-out samples', desc: 'Consent wording for promotional messages and a sample of each message type showing the opt-out.' },
    { id: 'adm', g: 'future', name: 'Automated decision review procedure', desc: 'How an individual can ask for a solely automated decision to be reviewed.' }
  ];

  /* ---------- profile helpers ---------- */
  function unk(v) { return v === undefined || v === null || v === '' || v === 'u'; }
  function yes(v) { return unk(v) || v === 'y'; }
  function anyOf(arr) {
    if (!arr || !arr.length || arr.indexOf('u') >= 0) return true;
    for (var i = 1; i < arguments.length; i++) if (arr.indexOf(arguments[i]) >= 0) return true;
    return false;
  }
  function isCtrl(p) { return p.role !== 'processor'; }
  function isProc(p) { return p.role === undefined || p.role === 'processor' || p.role === 'both'; }
  function hasSpecial(p) { return !p.special || !p.special.length || p.special.indexOf('none') < 0; }
  function hasChild(p) { return !p.special || !p.special.length || p.special.indexOf('child') >= 0; }
  function consent(p) { return anyOf(p.bases, 'a'); }
  function dpiaOn(p) { return !p.dpia || !p.dpia.length || p.dpia.indexOf('none') < 0; }
  function isPA(p) { return ['ministry', 'govdept', 'provcouncil', 'localauth', 'pcbody'].indexOf(p.entity) >= 0; }
  function dpoReq(p) { return p.entity === 'ministry' || p.entity === 'govdept'; }
  function dpoOn(p) {
    return dpoReq(p) || p.dpohas === undefined || p.dpohas === 'y' || p.coremon === 'y' || p.coremon === 'u' || p.corespecial === 'y' || p.corespecial === 'u';
  }
  var NOT_CTRL = 'This obligation falls on controllers. The organisation acts only as a processor.';
  var NOT_PROC = 'This obligation falls on processors. The organisation acts only as a controller.';
  function W(role, cond, y, n) {
    return function (p) {
      if (role === 'c' && !isCtrl(p)) return [false, NOT_CTRL];
      if (role === 'p' && !isProc(p)) return [false, NOT_PROC];
      if (cond && !cond(p)) return [false, n];
      return [true, y];
    };
  }
  var EVERY = 'Applies to every controller.';

  /* ---------- scoping questions ---------- */
  var YN = [{ v: 'y', label: 'Yes' }, { v: 'n', label: 'No' }];
  var YNU = [{ v: 'y', label: 'Yes' }, { v: 'n', label: 'No' }, { v: 'u', label: 'Not sure yet' }];
  var QUESTIONS = [
    { id: 'entity', g: 'The organisation', type: 'one', text: 'What kind of organisation is this?', ref: 's.56 "public authority" (as amended); s.20(1)(a)',
      options: [
        { v: 'company', label: 'Company incorporated under the Companies Act, No. 07 of 2007' },
        { v: 'pubcorp', label: 'Public corporation' },
        { v: 'ministry', label: 'Ministry' },
        { v: 'govdept', label: 'Government department' },
        { v: 'provcouncil', label: 'Provincial Council' },
        { v: 'pcbody', label: 'Ministry or Department of a Provincial Council' },
        { v: 'localauth', label: 'Local authority', hint: 'Municipal Council, Urban Council or Pradeshiya Sabha' },
        { v: 'other', label: 'Another body or entity', hint: 'For example a non-governmental organisation, partnership or statutory body' }
      ] },
    { id: 'nexus', g: 'The organisation', type: 'many', text: 'Which of these describe it?', ref: 's.2(1)',
      options: [
        { v: 'sl', label: 'Processes personal data wholly or partly within Sri Lanka', hint: 's.2(1)(a)' },
        { v: 'resident', label: 'Is domiciled or ordinarily resident in Sri Lanka', hint: 's.2(1)(b)(i)' },
        { v: 'incorporated', label: 'Is incorporated or established under any written law of Sri Lanka', hint: 's.2(1)(b)(ii)' },
        { v: 'offers', label: 'Offers goods or services to data subjects in Sri Lanka', hint: 's.2(1)(b)(iii)' },
        { v: 'monitors', label: 'Specifically monitors the behaviour of data subjects in Sri Lanka', hint: 's.2(1)(b)(iv)' }
      ] },
    { id: 'role', g: 'The organisation', type: 'one', text: 'For the personal data in scope, what does it do?', ref: 's.56 "controller", "processor"',
      options: [
        { v: 'controller', label: 'Decides the purposes and means of processing', hint: 'Controller' },
        { v: 'processor', label: 'Processes personal data on behalf of another organisation', hint: 'Processor' },
        { v: 'both', label: 'Both, for different processing' }
      ] },
    { id: 'group', g: 'The organisation', type: 'one', text: 'Is it part of a group of entities?', ref: 's.20(3)', options: YN },
    { id: 'scale', g: 'The organisation', type: 'one', text: 'About how many individuals does it hold personal data on?', ref: 'Used for risk rating only. Not a statutory threshold.',
      options: [{ v: 'a', label: 'Fewer than 1,000' }, { v: 'b', label: '1,000 to 100,000' }, { v: 'c', label: 'More than 100,000' }, { v: 'u', label: 'Not known yet' }] },

    { id: 'special', g: 'What it processes', type: 'many', none: 'none', text: 'Does it process any special categories of personal data?', ref: 's.56 "special categories of personal data"',
      options: [
        { v: 'health', label: 'Data concerning health' },
        { v: 'biometric', label: 'Biometric data for the purpose of uniquely identifying a natural person' },
        { v: 'genetic', label: 'Genetic data' },
        { v: 'child', label: 'Personal data relating to a child', hint: 'A natural person below the age of sixteen years' },
        { v: 'offences', label: 'Personal data relating to offences, criminal proceedings and convictions' },
        { v: 'race', label: 'Personal data revealing racial or ethnic origin' },
        { v: 'religion', label: 'Religious or philosophical beliefs' },
        { v: 'political', label: 'Political opinions' },
        { v: 'sexlife', label: 'Data concerning a natural person\'s sex life or sexual orientation' },
        { v: 'none', label: 'None of these' }
      ] },
    { id: 'bases', g: 'What it processes', type: 'many', none: 'u', text: 'Which conditions for lawful processing does it rely on?', ref: 's.5(a), Schedule I',
      show: isCtrl,
      options: [
        { v: 'a', label: 'Consent of the data subject', hint: 'Schedule I(a), or Schedule II(a) for special categories' },
        { v: 'b', label: 'Performance of a contract with the data subject', hint: 'Schedule I(b)' },
        { v: 'c', label: 'Compliance with a legal obligation under any written law', hint: 'Schedule I(c)' },
        { v: 'd', label: 'Responding to an emergency that threatens life, health or safety', hint: 'Schedule I(d)' },
        { v: 'e', label: 'A task in the public interest, or powers, functions or duties under any written law', hint: 'Schedule I(e)' },
        { v: 'f', label: 'Legitimate interests of the controller or a third party', hint: 'Schedule I(f)' },
        { v: 'u', label: 'Not identified yet' }
      ] },
    { id: 'criminv', g: 'What it processes', type: 'one', text: 'Does it process personal data in respect of criminal investigations?', ref: 's.5(d), Schedule IV', show: isCtrl, options: YN },
    { id: 'indirect', g: 'What it processes', type: 'one', text: 'Does it obtain personal data other than through direct interaction with the data subject?', hint: 'For example from another organisation or a publicly accessible source.', ref: 'Schedule V, items 4 and 5', show: isCtrl, options: YNU },

    { id: 'dpia', g: 'How it processes', type: 'many', none: 'none', text: 'Does it carry out, or intend to carry out, any of this processing?', ref: 's.24(1)', show: isCtrl,
      options: [
        { v: 'eval', label: 'A systematic and extensive evaluation of personal data or special categories of personal data, including profiling', hint: 's.24(1)(a)' },
        { v: 'monitor', label: 'A systematic monitoring of publicly accessible areas or telecommunication networks', hint: 's.24(1)(b)' },
        { v: 'none', label: 'Neither' }
      ] },
    { id: 'natsec', g: 'How it processes', type: 'one', text: 'Is that processing carried out in relation to national security, public order and public health?', ref: 's.25(7)',
      show: function (p) { return isCtrl(p) && p.dpia && p.dpia.length && p.dpia.indexOf('none') < 0; }, options: YN },
    { id: 'coremon', g: 'How it processes', type: 'one', text: 'Do its core activities require regular and systematic monitoring of data subjects?', ref: 's.20(1)(b)(i)', options: YNU },
    { id: 'corespecial', g: 'How it processes', type: 'one', text: 'Do its core activities consist of processing special categories of personal data?', ref: 's.20(1)(b)(ii)',
      show: function (p) { return p.special && p.special.length && p.special.indexOf('none') < 0; }, options: YNU },
    { id: 'adm', g: 'How it processes', type: 'one', text: 'Does it take decisions about individuals based solely on automated processing?', ref: 's.18; Schedule V, item 1(m)', show: isCtrl, options: YNU },
    { id: 'marketing', g: 'How it processes', type: 'one', text: 'Does it send messages that promote goods, services, a person or an organisation?', hint: 'By post, telephone, SMS, email or similar means.', ref: 's.27', show: isCtrl, options: YN },
    { id: 'archive', g: 'How it processes', type: 'one', text: 'Does it further process personal data for archiving in the public interest, scientific research, historical research or statistical purposes?', ref: 's.6(2); s.9 proviso', show: isCtrl, options: YN },

    { id: 'processors', g: 'Who else is involved', type: 'one', text: 'Does another organisation process personal data on its behalf?', hint: 'For example a cloud host, payroll provider or outsourced contact centre.', ref: 's.21(1)', show: isCtrl, options: YNU },
    { id: 'joint', g: 'Who else is involved', type: 'one', text: 'Does it decide the purposes and means of any processing jointly with another organisation?', ref: 's.21(2)', show: isCtrl, options: YNU },
    { id: 'subproc', g: 'Who else is involved', type: 'one', text: 'Does it engage another processor to carry out processing for its controller clients?', ref: 's.22(3)', show: function (p) { return p.role === 'processor' || p.role === 'both'; }, options: YNU },
    { id: 'xborder', g: 'Who else is involved', type: 'one', text: 'Does personal data move out of Sri Lanka for processing in another country?', hint: 'For example data hosted on servers outside Sri Lanka, or sent to an overseas group company or vendor.', ref: 's.26; s.56 "cross-border data flow"', options: YNU },
    { id: 'dpohas', g: 'Who else is involved', type: 'one', text: 'Has it designated or appointed a Data Protection Officer?', ref: 's.20', options: YN }
  ];

  /* ---------- determinations ---------- */
  function determinations(p) {
    var out = [];
    var limbs = { sl: 's.2(1)(a)', resident: 's.2(1)(b)(i)', incorporated: 's.2(1)(b)(ii)', offers: 's.2(1)(b)(iii)', monitors: 's.2(1)(b)(iv)' };
    if (p.nexus && p.nexus.length) {
      out.push({ id: 'app', title: 'Application of the Act', ref: 's.2(1)', tone: 'ok', text: 'On the answers given, the Act applies under ' + p.nexus.map(function (n) { return limbs[n]; }).join(', ') + '.' });
    } else {
      out.push({ id: 'app', title: 'Application of the Act', ref: 's.2(1)', tone: 'warn', text: 'No limb of s.2(1) has been selected. Legal counsel should confirm whether the Act applies.' });
    }
    if (p.role === 'controller') out.push({ id: 'role', title: 'Role', ref: 's.56', tone: 'ok', text: 'Controller. Part I and sections 20, 21 and 23 to 26 are assessed.' });
    else if (p.role === 'processor') out.push({ id: 'role', title: 'Role', ref: 's.56; s.22(2)', tone: 'ok', text: 'Processor. Sections 20, 22 and 26 are assessed. A processor that determines the purposes and means of processing by itself is deemed to be a controller in respect of that processing (s.22(2)).' });
    else if (p.role === 'both') out.push({ id: 'role', title: 'Role', ref: 's.56', tone: 'ok', text: 'Controller and processor. Controller and processor obligations are both assessed.' });
    else out.push({ id: 'role', title: 'Role', ref: 's.56', tone: 'warn', text: 'Not answered. Controller obligations are assumed until confirmed.' });

    if (p.entity) {
      if (isPA(p)) out.push({ id: 'pa', title: 'Public authority', ref: 's.56 (as amended)', tone: 'info', text: 'Within the amended definition of "public authority".' });
      else if (p.entity === 'other') out.push({ id: 'pa', title: 'Public authority', ref: 's.56 (as amended)', tone: 'warn', text: 'Not one of the bodies listed in the amended definition of "public authority". Legal counsel should confirm status.' });
      else out.push({ id: 'pa', title: 'Public authority', ref: 's.56 (as amended)', tone: 'ok', text: 'Not a public authority. The amended definition excludes a public corporation and a company incorporated under the Companies Act, No. 07 of 2007.' });
    }

    var dpo;
    if (dpoReq(p)) dpo = { tone: 'warn', text: 'Required. Processing is carried out by a Ministry or government department (s.20(1)(a)).' };
    else if (p.coremon === 'y' || p.corespecial === 'y') dpo = { tone: 'warn', text: 'May be required under s.20(1)(b). The scale and magnitude for s.20(1)(b)(i) and (ii) are to be prescribed, and the categories under s.20(1)(b)(iii) are to be determined by guidelines of the Authority.' };
    else dpo = { tone: 'info', text: 'Not required by s.20(1)(a) on the answers given. Whether s.20(1)(b) applies depends on thresholds to be prescribed and on guidelines of the Authority.' };
    if (p.entity === 'pcbody') dpo.text += ' Legal counsel should confirm whether s.20(1)(a) covers a Ministry or Department of a Provincial Council.';
    out.push({ id: 'dpo', title: 'Data Protection Officer', ref: 's.20(1) (as amended)', tone: dpo.tone, text: dpo.text });

    if (isCtrl(p)) {
      if (p.dpia && p.dpia.length && p.dpia.indexOf('none') < 0) out.push({ id: 'dpia', title: 'Impact assessment', ref: 's.24(1)', tone: 'warn', text: 'Required before the processing is carried out, under ' + p.dpia.map(function (d) { return d === 'eval' ? 's.24(1)(a)' : 's.24(1)(b)'; }).join(' and ') + '.' });
      else if (p.dpia && p.dpia.length) out.push({ id: 'dpia', title: 'Impact assessment', ref: 's.24(1)', tone: 'info', text: 'Not required by s.24(1)(a) or (b) on the answers given. Further processing activities may be determined by rules under s.24(1)(c).' });
    }

    if (p.xborder === 'y') out.push({ id: 'xb', title: 'Cross-border data flow', ref: 's.26 (as amended)', tone: 'warn', text: 'Section 26 applies to these flows.' + (isPA(p) ? ' A public authority shall not engage in cross-border data flows in respect of categories of personal data prescribed under s.26(5).' : '') });
    else if (p.xborder === 'n') out.push({ id: 'xb', title: 'Cross-border data flow', ref: 's.26 (as amended)', tone: 'ok', text: 'No cross-border data flow reported.' });
    else if (p.xborder === 'u') out.push({ id: 'xb', title: 'Cross-border data flow', ref: 's.26 (as amended)', tone: 'warn', text: 'Not known. Section 26 is treated as applicable until confirmed.' });

    if (p.special && p.special.length) {
      if (p.special.indexOf('none') >= 0) out.push({ id: 'sp', title: 'Special categories', ref: 's.5(b), Schedule II', tone: 'ok', text: 'None reported.' });
      else out.push({ id: 'sp', title: 'Special categories', ref: 's.5(b), Schedule II', tone: 'warn', text: 'Processed. A Schedule II condition is needed for each.' });
    }
    return out;
  }

  /* ---------- controls ---------- */
  var C = [];
  function L(o) { o.track = 'legal'; if (!o.aud) o.aud = 'legal'; C.push(o); }
  function T(o) { o.track = 'tech'; o.aud = 'it'; C.push(o); }

  /* s.5 and Schedules I to IV */
  L({ id: 's5-a', ref: 's.5(a)', dom: 'lawful', w: 3, comm: 'inforce', title: 'A Schedule I condition is identified for each processing activity',
    text: 'The processing of personal data shall be lawful if a controller is in compliance with— (a) any condition specified in Schedule I hereto;',
    q: 'Is a lawful basis recorded for each activity that uses personal data?', look: 'A record of processing that names the Schedule I condition relied on for each activity.',
    fix: 'Record the Schedule I condition relied on for every processing activity and keep the record current.', ev: ['ropa'], when: W('c', null, EVERY) });
  L({ id: 's5-b', ref: 's.5(b)', dom: 'lawful', w: 3, comm: 'inforce', title: 'A Schedule II condition is identified for special categories',
    text: 'The processing of personal data shall be lawful if a controller is in compliance with— … (b) any condition specified in Schedule II hereto in the case of processing special categories of personal data;',
    q: 'Is a Schedule II condition recorded for each activity that uses special categories of personal data?', look: 'The Schedule II condition recorded against each activity that uses special categories.',
    fix: 'Identify and record the Schedule II condition for each activity that processes special categories of personal data.', ev: ['ropa'],
    when: W('c', hasSpecial, 'Special categories of personal data are processed.', 'No special categories of personal data are processed.') });
  L({ id: 'sch2-a', ref: 'Schedule II(a)', dom: 'lawful', w: 3, comm: 'inforce', title: 'Consent for a child\'s data is given by the parent or legal guardian',
    text: '(a) the data subject has given consent, to the processing of special categories of personal data for one or more purposes specified by the controller at the time of processing, unless any other written law prohibits the processing of such personal data notwithstanding the consent of the data subject concerned. In the case of a child, consent shall mean the consent of the parent or legal guardian of such child;',
    q: 'Where consent is relied on for a child\'s data, is it obtained from the parent or legal guardian?', look: 'Consent wording and records showing the parent or legal guardian consents for a child below sixteen.',
    fix: 'Where consent is the condition relied on for a child\'s personal data, obtain and record the consent of the parent or legal guardian.', ev: ['consent'],
    note: 'Applies where consent is the Schedule II condition relied on. "Child" means a natural person below the age of sixteen years (s.56).',
    when: W('c', function (p) { return hasChild(p) && consent(p); }, 'Personal data relating to a child is processed and consent is relied on.', 'Either no personal data relating to a child is processed, or consent is not relied on.') });
  L({ id: 's56-consent', ref: 's.56 "consent"', dom: 'lawful', w: 2, comm: 'inforce', title: 'Consent is a written declaration or an affirmative action',
    text: '"consent" means, any freely given, specific, informed and unambiguous indication by way of a written declaration or an affirmative action signifying a data subject\'s agreement to the processing of his personal data;',
    q: 'Is consent always given by a written declaration or a clear affirmative action?', look: 'Consent journeys with no pre-ticked boxes, silence or inactivity treated as consent.',
    fix: 'Redesign consent capture so that agreement is given by a written declaration or an affirmative action that is specific to the processing.', ev: ['consent', 'forms'],
    when: W('c', consent, 'Consent is relied on as a lawful basis.', 'Consent is not relied on.') });
  L({ id: 'sch3-a', ref: 'Schedule III(a)', dom: 'lawful', w: 3, comm: 'inforce', title: 'Consent can be demonstrated',
    text: '(a) the controller shall demonstrate that the data subject has consented to processing of the personal data relating to such data subject;',
    q: 'Can you show a record of each individual\'s consent?', look: 'Consent records showing who consented, to what and when.',
    fix: 'Keep a retrievable record of each consent: who gave it, the wording shown and the date.', ev: ['consent'],
    when: W('c', consent, 'Consent is relied on as a lawful basis.', 'Consent is not relied on.') });
  L({ id: 'sch3-b', ref: 'Schedule III(b)', dom: 'lawful', w: 2, comm: 'inforce', title: 'The request for consent is clearly distinguishable from other matters',
    text: '(b) if the consent of the data subject is given in the context of a written declaration which also concerns other matters, the request for consent shall be presented in a manner which is clearly distinguishable from the other matters, in an intelligible and easily accessible form, using clear and plain language:',
    q: 'Where consent sits inside a longer form or terms, is the consent request set apart and in plain language?', look: 'Forms and terms in which the consent request is separate from other matters and written in clear and plain language.',
    fix: 'Separate the consent request from other terms and rewrite it in clear and plain language.', ev: ['consent', 'forms'],
    when: W('c', consent, 'Consent is relied on as a lawful basis.', 'Consent is not relied on.') });
  L({ id: 'sch3-c', ref: 'Schedule III(c)', dom: 'lawful', w: 2, comm: 'inforce', title: 'Consent is not made a condition of a contract where the data is not needed for it',
    text: '(c) when assessing whether consent is freely given, special consideration shall be taken of whether, inter alia, the performance of a contract, including the provision of a service, is conditional on consent to the processing of personal data that is not necessary for the performance of that contract; and',
    q: 'Can people use your service without consenting to processing the service does not need?', look: 'Service journeys in which consent to processing that is not necessary for the contract is optional.',
    fix: 'Unbundle consent from service terms where the processing is not necessary for the contract.', ev: ['consent', 'forms'],
    when: W('c', consent, 'Consent is relied on as a lawful basis.', 'Consent is not relied on.') });
  L({ id: 'sch3-d', ref: 'Schedule III(d)', dom: 'lawful', w: 2, comm: 'inforce', title: 'Data subjects are told beforehand that consent can be withdrawn',
    text: '(d) prior to giving consent, the data subject shall be informed thereof that consent can be withdrawn anytime subject to the provisions of this Act.',
    q: 'Before consenting, are people told they can withdraw consent at any time?', look: 'Consent wording that states, before consent is given, that it can be withdrawn at any time.',
    fix: 'Add a statement to every consent request that consent can be withdrawn at any time.', ev: ['consent'],
    when: W('c', consent, 'Consent is relied on as a lawful basis.', 'Consent is not relied on.') });
  L({ id: 'sch1-f', ref: 'Schedule I(f)', dom: 'lawful', w: 2, comm: 'inforce', title: 'Legitimate interests are weighed against the interests of the data subject',
    text: '(f) processing is necessary for the purposes of the legitimate interests pursued by the controller or by a third party, except where such interests are overridden by the interests of the data subject which require protection of personal data, in particular where the data subject is a child.',
    q: 'For each activity based on legitimate interests, is there a written assessment of why those interests are not overridden?', look: 'A written assessment for each such activity naming the interest pursued and why it is not overridden by the interests of the data subject.',
    fix: 'Document an assessment for each activity that relies on legitimate interests, with particular care where the data subject is a child.', ev: ['lia'],
    when: W('c', function (p) { return anyOf(p.bases, 'f'); }, 'Legitimate interests are relied on as a lawful basis.', 'Legitimate interests are not relied on.') });
  L({ id: 'sch4', ref: 's.5(d), Schedule IV(a)', dom: 'lawful', w: 3, comm: 'rules', title: 'Criminal investigation processing follows applicable written laws with safeguards',
    text: '(a) processing of personal data relating to lawful investigations of offences or related security measures shall be carried out only in accordance with applicable written laws, whilst providing for appropriate safeguards for the rights and freedoms of data subjects;',
    q: 'Is the written law that permits this processing identified, with safeguards in place?', look: 'The written law relied on and the safeguards applied to the rights and freedoms of data subjects.',
    fix: 'Identify the written law that authorises each such activity and document the safeguards applied.', ev: ['criminal'],
    note: 'Schedule IV(c) allows conditions for appropriate safeguards to be prescribed.',
    when: W('c', function (p) { return p.criminv === undefined || p.criminv === 'y'; }, 'Personal data is processed in respect of criminal investigations.', 'No processing in respect of criminal investigations.') });

  /* ss.6 to 9 */
  L({ id: 's6-1', ref: 's.6(1)', dom: 'principles', w: 2, comm: 'inforce', title: 'Purposes are specified, explicit and legitimate',
    text: 'Every controller shall, ensure that personal data is processed for a— (a) specified; (b) explicit; and (c) legitimate, purposes and such personal data shall not be further processed in a manner which is incompatible with such purposes.',
    q: 'Is the purpose of each use of personal data written down, and is data kept to those purposes?', look: 'Purposes recorded for each processing activity and a control that stops incompatible further use.',
    fix: 'Record a specified and explicit purpose for each processing activity and review new uses of data against it before they start.', ev: ['ropa', 'notice'], when: W('c', null, EVERY) });
  L({ id: 's6-2', ref: 's.6(2)', dom: 'principles', w: 1, comm: 'inforce', title: 'Further processing for archiving, research or statistics is subject to section 10 measures',
    text: 'Subject to the provisions of section 10 of this Act, further processing of such personal data by a controller for archiving purposes in the public interest, scientific research, historical research or statistical purposes shall not be considered to be incompatible with the initial purposes referred to in paragraphs (a), (b) and (c) of subsection (1).',
    q: 'Is data that is reused for archiving, research or statistics protected by security measures?', look: 'A record of the data further processed for these purposes and the section 10 measures applied to it.',
    fix: 'List the data further processed for archiving, research or statistics and apply section 10 measures such as pseudonymisation.', ev: ['ropa', 'retention'],
    when: W('c', function (p) { return p.archive === undefined || p.archive === 'y'; }, 'Personal data is further processed for archiving, research or statistical purposes.', 'No further processing for archiving, research or statistical purposes.') });
  L({ id: 's7', ref: 's.7', dom: 'principles', w: 2, comm: 'inforce', title: 'Personal data is adequate, relevant and proportionate to the purpose',
    text: 'Every controller shall ensure that personal data that is processed shall be— (a) adequate; (b) relevant; and (c) proportionate, to the extent as is necessary in relation to the purpose for which such data shall be collected or processed.',
    q: 'Have collection forms and data fields been reviewed so that only what the purpose needs is collected?', look: 'A review of forms and data fields against the stated purpose, with unnecessary fields removed or justified.',
    fix: 'Review each collection point against its purpose and remove or justify fields that are not necessary.', ev: ['forms', 'ropa'], when: W('c', null, EVERY) });
  L({ id: 's8', ref: 's.8', dom: 'principles', w: 2, comm: 'inforce', title: 'Personal data is accurate and kept up to date',
    text: 'Every controller shall ensure that personal data that is processed shall be— (a) accurate; and (b) kept up to date, with every reasonable step being taken to erase or rectify any inaccurate or outdated personal data, without undue delay.',
    q: 'Is there a procedure to keep personal data accurate and to correct or erase errors promptly?', look: 'A procedure for keeping data accurate and for rectifying or erasing inaccurate or outdated data without undue delay.',
    fix: 'Adopt a procedure for checking accuracy and for rectifying or erasing inaccurate or outdated personal data without undue delay.', ev: ['accuracy'], when: W('c', null, EVERY) });
  L({ id: 's9', ref: 's.9', dom: 'principles', w: 2, comm: 'inforce', title: 'Personal data is kept in identifiable form only for as long as necessary',
    text: 'Every controller shall ensure that personal data that is being processed shall be kept in a form which permits identification of data subjects only for such period as may be necessary or required for the purposes for which such personal data is processed:',
    q: 'Is there a retention schedule that sets how long each category of personal data is kept?', look: 'A retention schedule giving a period, or the criteria for setting it, for each category of personal data.',
    fix: 'Adopt a retention schedule covering every category of personal data and apply it to live systems, archives and backups.', ev: ['retention'], when: W('c', null, EVERY) });
  L({ id: 's9-prov', ref: 's.9 proviso', dom: 'principles', w: 1, comm: 'inforce', title: 'Longer storage for archiving, research or statistics is subject to section 10 measures',
    text: 'Provided however, subject to the provisions of section 10 of this Act, a controller may store personal data for longer periods in so far as the personal data shall be processed further for archiving purposes in the public interest, scientific research, historical research or statistical purposes.',
    q: 'Where data is kept longer for archiving, research or statistics, is that recorded and protected?', look: 'The retention schedule identifies data kept longer for these purposes and the section 10 measures applied.',
    fix: 'Record in the retention schedule which data is kept longer for these purposes and the section 10 measures applied.', ev: ['retention'],
    when: W('c', function (p) { return p.archive === undefined || p.archive === 'y'; }, 'Personal data is further processed for archiving, research or statistical purposes.', 'No further processing for archiving, research or statistical purposes.') });

  /* s.10 */
  L({ id: 's10', ref: 's.10', dom: 'security', w: 3, comm: 'inforce', title: 'Appropriate technical and organizational measures protect personal data',
    text: 'Every controller shall ensure integrity and confidentiality of personal data that is being processed, by using appropriate technical and organizational measures including encryption, pseudonymisation, anonymisation or access controls or such other measures as may be prescribed so as to prevent the – (a) unauthorized or unlawful processing of personal data; or (b) loss, destruction or damage of personal data.',
    q: 'Is there an approved information security policy that covers personal data?', look: 'An approved, current information security policy and standards that cover personal data.',
    fix: 'Approve an information security policy and standards that cover personal data, and assign ownership for keeping them current.', ev: ['secpolicy'],
    note: 'The technical criteria listed under this section are TechNeura assessment criteria that support section 10. The Act names encryption, pseudonymisation, anonymisation and access controls and leaves other measures to be prescribed.', when: W('c', null, EVERY) });

  var S10 = 'Supports s.10: "appropriate technical and organizational measures including encryption, pseudonymisation, anonymisation or access controls".';
  var S10P = 'A controller shall use only processors who ensure the provision of appropriate technical and organizational measures (s.21(1)(a)).';
  function techWhen(p) { return isCtrl(p) ? [true, 'Supports the controller\'s section 10 obligation.'] : [true, S10P]; }

  T({ id: 't-disc-1', ref: 's.10', tdom: 'disc', dom: 'security', w: 2, comm: 'inforce', title: 'Locations of personal data are identified',
    text: 'Personal data is identified across applications, databases, endpoints, file shares, collaboration tools and cloud services, including any use in dev/test environments.', basis: 'Supports s.12(1)(a) records and s.10.',
    q: 'Do you have a current inventory of every system and store that holds personal data, including test environments?', look: 'System inventory showing where personal data resides, including dev/test.',
    fix: 'Build and maintain an inventory of every system, store and environment that holds personal data.', ev: ['datamap'], when: techWhen });
  T({ id: 't-disc-2', ref: 's.10', tdom: 'disc', dom: 'security', w: 2, comm: 'inforce', title: 'Data flows are mapped',
    text: 'Data flows are mapped across web and mobile channels, APIs, batch jobs and vendor exchanges.', basis: 'Supports s.12(1)(a) records and s.10.',
    q: 'Are the flows of personal data between systems and to third parties mapped?', look: 'Data flow map covering channels, interfaces, batch transfers and vendor exchanges.',
    fix: 'Map how personal data moves between internal systems and to third parties, and mark cross-border and manual transfers.', ev: ['datamap'], when: techWhen });
  T({ id: 't-disc-3', ref: 's.10', tdom: 'disc', dom: 'security', w: 2, comm: 'inforce', title: 'Unapproved tools holding personal data are identified',
    text: 'Unapproved tools used to store or exchange personal data, such as spreadsheets and messaging apps, are surfaced.', basis: S10,
    q: 'Do you know where personal data is kept or shared outside approved systems, such as spreadsheets or messaging apps?', look: 'Findings from discovery of personal data in unapproved tools and the action taken.',
    fix: 'Identify personal data held or exchanged through unapproved tools and move it to controlled systems.', ev: ['datamap'], when: techWhen });

  T({ id: 't-acc-1', ref: 's.10', tdom: 'acc', dom: 'security', w: 2, comm: 'inforce', title: 'Joiner, mover and leaver process controls access',
    text: 'Access to systems holding personal data is granted, changed and removed through a joiner–mover–leaver process.', basis: S10,
    q: 'Is access granted, changed and removed through a defined joiner, mover and leaver process?', look: 'The process and evidence that leavers and movers lose access promptly.',
    fix: 'Operate a joiner, mover and leaver process for every system that holds personal data.', ev: ['access'], when: techWhen });
  T({ id: 't-acc-2', ref: 's.10', tdom: 'acc', dom: 'security', w: 3, comm: 'inforce', title: 'Access is role-based and limited to least privilege',
    text: 'Role-based access and least-privilege enforcement apply to systems holding personal data.', basis: S10,
    q: 'Is access to personal data limited by role to those who need it?', look: 'Role definitions and entitlement reports for systems holding personal data.',
    fix: 'Define roles for each system that holds personal data and remove entitlements that exceed them.', ev: ['access'], when: techWhen });
  T({ id: 't-acc-3', ref: 's.10', tdom: 'acc', dom: 'security', w: 3, comm: 'inforce', title: 'Multi-factor authentication covers access to personal data',
    text: 'MFA coverage extends to accounts with access to personal data, including remote and administrative access.', basis: S10,
    q: 'Is multi-factor authentication enforced for accounts that can reach personal data?', look: 'MFA coverage report for user, remote and administrative accounts.',
    fix: 'Enforce multi-factor authentication for all accounts with access to personal data, starting with administrative and remote access.', ev: ['access'], when: techWhen });
  T({ id: 't-acc-4', ref: 's.10', tdom: 'acc', dom: 'security', w: 2, comm: 'inforce', title: 'Privileged, service and shared accounts are controlled',
    text: 'Privileged, service and shared accounts are identified, owned and controlled.', basis: S10,
    q: 'Are privileged, service and shared accounts inventoried, owned and controlled?', look: 'Inventory of these accounts with owners and the controls applied.',
    fix: 'Inventory privileged, service and shared accounts, assign owners and replace shared credentials where possible.', ev: ['access'], when: techWhen });
  T({ id: 't-acc-5', ref: 's.10', tdom: 'acc', dom: 'security', w: 2, comm: 'inforce', title: 'Access is reviewed periodically',
    text: 'Periodic access reviews detect orphaned accounts and excessive entitlements.', basis: S10,
    q: 'Are access rights reviewed on a set schedule, with orphaned accounts and excess rights removed?', look: 'The latest access review and the removals that followed.',
    fix: 'Run periodic access reviews for systems holding personal data and remove orphaned accounts and excess entitlements.', ev: ['access'], when: techWhen });

  T({ id: 't-sto-1', ref: 's.10', tdom: 'sto', dom: 'security', w: 3, comm: 'inforce', title: 'Personal data is encrypted at rest and in transit',
    text: 'Encryption at rest and in transit is applied to personal data, with no plaintext storage.', basis: S10,
    q: 'Is personal data encrypted where it is stored and when it is transmitted?', look: 'Encryption standard and configuration evidence for databases, files and network transfers.',
    fix: 'Encrypt personal data at rest and in transit across databases, file stores, endpoints and interfaces.', ev: ['crypto'], when: techWhen });
  T({ id: 't-sto-2', ref: 's.10', tdom: 'sto', dom: 'security', w: 2, comm: 'inforce', title: 'Encryption keys are managed securely',
    text: 'Key management practices cover generation, storage, rotation and access to keys.', basis: S10,
    q: 'Are encryption keys generated, stored, rotated and accessed under a defined standard?', look: 'Key management standard and evidence of key storage and rotation.',
    fix: 'Adopt a key management standard covering generation, storage, rotation and access.', ev: ['crypto'], when: techWhen });
  T({ id: 't-sto-3', ref: 's.10', tdom: 'sto', dom: 'security', w: 2, comm: 'inforce', title: 'Environments and tenants are segregated',
    text: 'Production and test environments are segregated and tenants are separated.', basis: S10,
    q: 'Are production and test environments separated, and is live personal data kept out of test?', look: 'Environment architecture and the rule on using live personal data in test.',
    fix: 'Separate production from test and stop using live personal data in test unless it is masked.', ev: ['datamap', 'secpolicy'], when: techWhen });
  T({ id: 't-sto-4', ref: 's.10', tdom: 'sto', dom: 'security', w: 3, comm: 'inforce', title: 'Backups are protected',
    text: 'Backups are secured, with no unencrypted or exposed backups.', basis: 'Supports s.10(b): prevention of "loss, destruction or damage of personal data".',
    q: 'Are backups encrypted, access-controlled and tested?', look: 'Backup procedure, encryption settings and the most recent restore test.',
    fix: 'Encrypt backups, restrict access to them and test restoration.', ev: ['backup'], when: techWhen });
  T({ id: 't-sto-5', ref: 's.10', tdom: 'sto', dom: 'security', w: 3, comm: 'inforce', title: 'Storage is not exposed by misconfiguration',
    text: 'Storage is checked for misconfiguration such as open buckets and open shares.', basis: S10,
    q: 'Are cloud buckets and file shares checked so that none are open to the public or to everyone internally?', look: 'Configuration review of storage buckets and file shares.',
    fix: 'Review storage buckets and shares for public or organisation-wide access and close any exposure.', ev: ['cloud'], when: techWhen });

  T({ id: 't-app-1', ref: 's.10', tdom: 'app', dom: 'security', w: 2, comm: 'inforce', title: 'Applications mask, minimise and validate personal data',
    text: 'Applications handle personal data in forms, screens, exports and APIs with masking, minimisation and validation.', basis: 'Supports s.10 and s.7 (adequate, relevant and proportionate).',
    q: 'Do applications mask sensitive fields, limit exports and validate inputs?', look: 'Application standard or test report covering masking, export limits and input validation.',
    fix: 'Apply masking, export limits and input validation in applications that display or exchange personal data.', ev: ['appsec'], when: techWhen });
  T({ id: 't-app-2', ref: 's.10', tdom: 'app', dom: 'security', w: 2, comm: 'inforce', title: 'Sessions are managed securely',
    text: 'Session management is in place for portals and back-office tools.', basis: S10,
    q: 'Do portals and back-office tools enforce session timeouts and secure session handling?', look: 'Session settings for customer portals and back-office tools.',
    fix: 'Enforce session timeouts and secure session handling in portals and back-office tools.', ev: ['appsec'], when: techWhen });

  T({ id: 't-log-1', ref: 's.10', tdom: 'log', dom: 'security', w: 2, comm: 'inforce', title: 'Access to personal data is logged',
    text: 'Event logging records access to personal data: who, what and when.', basis: 'Supports s.10 and s.12(1)(e) internal oversight mechanisms.',
    q: 'Is access to personal data logged with who accessed what and when?', look: 'Logging standard and sample log configuration for key systems.',
    fix: 'Log access to personal data in key systems with user, record and time.', ev: ['logging'], when: techWhen });
  T({ id: 't-log-2', ref: 's.10', tdom: 'log', dom: 'security', w: 1, comm: 'inforce', title: 'Log integrity and retention are protected',
    text: 'Log integrity and retention are maintained.', basis: S10,
    q: 'Are logs protected from alteration and kept for a defined period?', look: 'Log retention settings and controls against tampering.',
    fix: 'Protect logs from alteration and set a retention period.', ev: ['logging'], when: techWhen });
  T({ id: 't-log-3', ref: 's.10', tdom: 'log', dom: 'security', w: 2, comm: 'inforce', title: 'Anomalous access is monitored',
    text: 'Monitoring detects anomalous behaviour such as bulk downloads and privileged misuse.', basis: 'Supports s.10 and s.12(1)(f): a mechanism "to identify personal data breaches".',
    q: 'Are bulk downloads and unusual privileged activity detected and alerted on?', look: 'Alert rules and recent alert handling records.',
    fix: 'Add alerting for bulk downloads and unusual privileged access to personal data.', ev: ['logging'], when: techWhen });

  T({ id: 't-ret-1', ref: 's.9', tdom: 'ret', dom: 'principles', w: 2, comm: 'inforce', title: 'Retention rules are enforced in systems',
    text: 'Retention rules are enforced technically, with deletion that is complete across replicas and environments and verifiable.', basis: 'Supports s.9: kept "only for such period as may be necessary".',
    q: 'Do systems delete or anonymise personal data when its retention period ends, including copies?', look: 'Deletion jobs or procedures and evidence that deletion reaches replicas and other environments.',
    fix: 'Implement deletion or anonymisation at the end of each retention period and verify it across replicas and environments.', ev: ['backup', 'retention'],
    when: function (p) { return isCtrl(p) ? [true, 'Supports the controller\'s section 9 obligation.'] : [false, NOT_CTRL]; } });
  T({ id: 't-ret-2', ref: 's.9', tdom: 'ret', dom: 'principles', w: 1, comm: 'inforce', title: 'Backup retention and purge are defined',
    text: 'Backup retention and purge mechanisms are defined and operate.', basis: 'Supports s.9.',
    q: 'Do backups have a retention period after which they are purged?', look: 'Backup retention settings and purge records.',
    fix: 'Set a retention period for backups and purge them when it ends.', ev: ['backup'],
    when: function (p) { return isCtrl(p) ? [true, 'Supports the controller\'s section 9 obligation.'] : [false, NOT_CTRL]; } });
  T({ id: 't-ret-3', ref: 's.10', tdom: 'ret', dom: 'security', w: 1, comm: 'inforce', title: 'Anonymisation or pseudonymisation is available',
    text: 'Capabilities for anonymisation or pseudonymisation exist to reduce risk while meeting business needs.', basis: 'Supports s.10, which names pseudonymisation and anonymisation.',
    q: 'Can you anonymise or pseudonymise personal data for analytics, testing or long-term storage?', look: 'Anonymisation or pseudonymisation method and where it is used.',
    fix: 'Introduce anonymisation or pseudonymisation for analytics, testing and long-term storage.', ev: ['secpolicy', 'backup'], when: techWhen });

  T({ id: 't-brd-1', ref: 's.23', tdom: 'brd', dom: 'breach', w: 3, comm: 'inforce', title: 'Potential personal data breaches can be detected',
    text: 'The organisation can detect potential personal data breaches, including unauthorised access, exfiltration and ransomware.', basis: 'Supports s.23(1) and s.12(1)(f): a mechanism "to identify personal data breaches".',
    q: 'Can you detect unauthorised access, data exfiltration and ransomware affecting personal data?', look: 'Detection tooling and coverage for systems holding personal data.',
    fix: 'Extend detection coverage to every system that holds personal data.', ev: ['incident', 'logging'],
    when: function (p) { return isCtrl(p) ? [true, 'Supports the controller\'s section 23 obligation.'] : [true, S10P]; } });
  T({ id: 't-brd-2', ref: 's.23', tdom: 'brd', dom: 'breach', w: 2, comm: 'inforce', title: 'Evidence is preserved and incidents are escalated to privacy contacts',
    text: 'Evidence is preserved and incidents are escalated through privacy-specific channels.', basis: 'Supports s.23(1).',
    q: 'When an incident involves personal data, is evidence preserved and the privacy lead told?', look: 'Incident procedure showing evidence preservation and escalation to the privacy lead.',
    fix: 'Add evidence preservation steps and a privacy escalation path to the incident procedure.', ev: ['incident', 'breach'],
    when: function (p) { return isCtrl(p) ? [true, 'Supports the controller\'s section 23 obligation.'] : [true, S10P]; } });

  T({ id: 't-tp-1', ref: 's.21(1)(a)', tdom: 'tp', dom: 'processors', w: 2, comm: 'inforce', title: 'Vendor access paths are controlled',
    text: 'Vendor access paths such as VPN, remote administration and APIs are controlled.', basis: 'Supports s.21(1)(a) and s.10.',
    q: 'Is vendor access to your systems limited, authenticated and logged?', look: 'List of vendor access paths with the controls applied to each.',
    fix: 'Inventory vendor access paths and apply authentication, restriction and logging to each.', ev: ['cloud'],
    when: W('c', function (p) { return yes(p.processors); }, 'Processors are engaged.', 'No processors are engaged.') });
  T({ id: 't-tp-2', ref: 's.10; s.26', tdom: 'tp', dom: 'xborder', w: 2, comm: 'inforce', title: 'Cloud region, access and exposure are configured deliberately',
    text: 'Cloud configurations are evaluated for region, access controls and public exposure.', basis: 'Supports s.10, and identifies cross-border data flows for s.26.',
    q: 'Do you know which regions your cloud services store personal data in, and are they access-controlled?', look: 'Cloud configuration summary showing hosting regions, access controls and public exposure.',
    fix: 'Record the hosting region of each cloud service that holds personal data and correct access and exposure settings.', ev: ['cloud'], when: techWhen });
  T({ id: 't-tp-3', ref: 's.10', tdom: 'tp', dom: 'security', w: 2, comm: 'inforce', title: 'Data is exchanged through secure mechanisms',
    text: 'Secure data exchange mechanisms such as SFTP, API gateways and encryption are used.', basis: S10,
    q: 'Is personal data exchanged with third parties only through secure channels?', look: 'List of exchange mechanisms used with third parties.',
    fix: 'Move personal data exchanges to secure channels and retire email attachments and shared links.', ev: ['cloud'], when: techWhen });
  T({ id: 't-aln-1', ref: 's.10', tdom: 'aln', dom: 'security', w: 1, comm: 'inforce', title: 'Existing security controls are mapped to PDPA obligations',
    text: 'Existing security controls (for example ISO 27001, NIST, OWASP) are mapped to PDPA-specific obligations.', basis: S10,
    q: 'Have your existing security framework controls been mapped to PDPA obligations?', look: 'A mapping of framework controls to PDPA obligations, showing where security does not yet cover privacy.',
    fix: 'Map existing security framework controls to PDPA obligations and close the gaps the mapping shows.', ev: ['secpolicy'], when: techWhen });

  /* s.11 and Schedule V */
  var SV1 = 'Schedule V, item 1: "where the personal data relating to a data subject is collected from the data subject, the controller shall provide the data subject with the following information, at the time of collection of such personal data".';
  L({ id: 's11', ref: 's.11', dom: 'transparency', w: 2, comm: 'inforce', title: 'Information is given in writing or electronically, in a concise and intelligible form',
    text: 'A controller shall, provide data subjects— (a) the information referred to in Schedule V; and (b) the information regarding any decision taken pursuant to a request made under PART II of this Act, in writing or by electronic means and in a concise, transparent, intelligible and easily accessible form.',
    q: 'Do you give people a privacy notice that is short, clear and easy to find?', look: 'Privacy notices that are in writing or electronic, concise, intelligible and easy to reach from each collection point.',
    fix: 'Publish privacy notices in plain language and link them from every point where personal data is collected.', ev: ['notice'],
    note: 'Paragraph (b) refers to decisions on requests under Part II, which is not yet in operation.', when: W('c', null, EVERY) });
  L({ id: 'sv1-time', ref: 'Schedule V, item 1', dom: 'transparency', w: 2, comm: 'inforce', title: 'The notice is given at the time of collection',
    text: 'where the personal data relating to a data subject is collected from the data subject, the controller shall provide the data subject with the following information, at the time of collection of such personal data -',
    q: 'Is the privacy notice shown or handed over at the moment personal data is collected?', look: 'Each collection point (form, app screen, call script) presents or links the notice when data is collected.',
    fix: 'Present or link the privacy notice at each collection point at the time of collection.', ev: ['notice', 'forms'],
    note: 'Items 3 and 6 of Schedule V set out when the information need not be provided.', when: W('c', null, EVERY) });
  function SV(id, item, w, title, text, q, look, fix, cond, y, n, comm, note) {
    L({ id: id, ref: 'Schedule V, item 1(' + item + ')', dom: 'transparency', w: w, comm: comm || 'inforce', title: title, text: '(' + item + ') ' + text, basis: SV1, q: q, look: look, fix: fix, ev: ['notice'], note: note, notice: true,
      when: W('c', cond, y || 'Applies to every controller that collects personal data from data subjects.', n) });
  }
  SV('sv1a', 'a', 2, 'Notice gives the identity and contact details of the controller', 'the identity and contact details of the controller and where applicable of the controller\'s representative;', 'Does the notice name your organisation and give contact details?', 'Notice states the controller\'s identity and contact details and, where applicable, those of its representative.', 'Add the controller\'s identity and contact details to the notice.');
  SV('sv1b', 'b', 1, 'Notice gives the contact details of the Data Protection Officer', 'the contact details of the Data Protection Officer, where applicable;', 'Does the notice give the Data Protection Officer\'s contact details?', 'Notice states the Data Protection Officer\'s contact details.', 'Add the Data Protection Officer\'s contact details to the notice.', dpoOn, 'A Data Protection Officer is required or has been designated.', 'No Data Protection Officer is required or designated on the answers given.');
  SV('sv1c', 'c', 2, 'Notice states the purposes and the legal basis', 'the intended purposes for which the personal data is processed and the legal basis for the processing;', 'Does the notice say why the data is processed and the legal basis for it?', 'Notice states each intended purpose and the legal basis for the processing.', 'State each purpose of processing and its legal basis in the notice.');
  SV('sv1d', 'd', 1, 'Notice states the legitimate interest pursued', 'the legitimate interest pursued by the controller or by a third party where processing is based on item (f) of Schedule 1;', 'Where you rely on legitimate interests, does the notice say what the interest is?', 'Notice describes the legitimate interest pursued for each activity based on Schedule I(f).', 'Describe in the notice the legitimate interest pursued for each activity based on Schedule I(f).', function (p) { return anyOf(p.bases, 'f'); }, 'Legitimate interests are relied on as a lawful basis.', 'Legitimate interests are not relied on.');
  SV('sv1e', 'e', 2, 'Notice lists the categories of personal data collected', 'the categories of personal data being collected;', 'Does the notice list the kinds of personal data collected?', 'Notice lists the categories of personal data being collected.', 'List the categories of personal data collected in the notice.');
  SV('sv1f', 'f', 2, 'Notice explains the right to withdraw consent and how', 'where processing is intended to be based on consent pursuant to item (a) of Schedule I and item (a) of Schedule II, the existence of the right of the data subject to withdraw his consent, and the procedure for such withdrawal, without affecting the lawfulness of processing based on consent before its withdrawal;', 'Does the notice say consent can be withdrawn and explain how?', 'Notice states the right to withdraw consent and the procedure for doing so.', 'State in the notice that consent can be withdrawn and give the procedure.', consent, 'Consent is relied on as a lawful basis.', 'Consent is not relied on.');
  SV('sv1g', 'g', 2, 'Notice names recipients or third parties the data may be shared with', 'recipients or third parties with whom such personal data may be shared, if applicable;', 'Does the notice say who the data may be shared with?', 'Notice identifies recipients or third parties with whom personal data may be shared.', 'Identify in the notice the recipients or third parties with whom personal data may be shared.');
  SV('sv1h', 'h', 2, 'Notice gives information on cross-border transfers', 'information regarding any cross-border transfer of the personal data that the controller intends to carry out, if applicable;', 'Does the notice say if data is sent outside Sri Lanka?', 'Notice gives information on any intended cross-border transfer.', 'Add information on intended cross-border transfers to the notice.', function (p) { return yes(p.xborder); }, 'Personal data moves out of Sri Lanka, or this is not yet confirmed.', 'No cross-border data flow reported.');
  SV('sv1i', 'i', 2, 'Notice states the retention period or the criteria for it', 'the period for which the personal data shall be retained in terms of section 9 or where such period is not known, the criteria for determining such period;', 'Does the notice say how long the data is kept?', 'Notice states the retention period or, where not known, the criteria for determining it.', 'State the retention period, or the criteria for setting it, in the notice.');
  SV('sv1j', 'j', 2, 'Notice explains data subject rights and how to exercise them', 'the existence of and procedure for the exercise of rights of the data subject referred to in Part II;', 'Does the notice explain people\'s rights over their data and how to use them?', 'Notice states the rights in Part II and the procedure for exercising them.', 'Describe in the notice the rights in Part II and how a data subject can exercise them.', null, null, null, 'counsel', 'Refers to the rights in Part II, which is not yet in operation.');
  SV('sv1k', 'k', 1, 'Notice states the right to complain to the Authority', 'the existence of a right to file complaints to the Authority;', 'Does the notice say people can complain to the Data Protection Authority?', 'Notice states the right to file complaints to the Authority.', 'Add the right to file complaints to the Authority to the notice.');
  SV('sv1l', 'l', 1, 'Notice says whether providing the data is required and what happens if it is not', 'whether the provision of personal data by the data subject is a statutory or contractual requirement, or a requirement necessary to enter into a contract, as well as whether the data subject is obliged to provide the personal data and of the possible consequences of failure to provide such data; and', 'Does the notice say whether people must provide the data and what happens if they do not?', 'Notice states whether provision is a statutory or contractual requirement and the consequences of not providing the data.', 'State in the notice whether providing the data is required and the consequences of not providing it.');
  SV('sv1m', 'm', 2, 'Notice discloses automated decision-making and its logic', 'the existence of automated individual decision-making referred to in section 18, including profiling, and, at least in those cases, reasonably meaningful information about the logic involved, as well as the significance and the envisaged consequences of such processing for the data subject.', 'Does the notice say when decisions are automated and explain how they are made?', 'Notice discloses automated individual decision-making, with meaningful information about the logic, significance and consequences.', 'Disclose automated decision-making in the notice, with meaningful information about the logic, significance and consequences.', function (p) { return yes(p.adm); }, 'Decisions are taken solely by automated processing, or this is not yet confirmed.', 'No decisions are based solely on automated processing.', 'counsel', 'Refers to section 18, which is in Part II and not yet in operation.');
  L({ id: 'sv2', ref: 'Schedule V, item 2', dom: 'transparency', w: 2, comm: 'inforce', title: 'Data subjects are told before data is used for a new purpose',
    text: 'Where the controller intends to further process the personal data for a purpose other than for which it was originally collected, the controller shall provide the data subject detailed information on the further processing in the manner provided in item 1 of this Schedule and the purpose thereof.',
    q: 'Before using personal data for a new purpose, do you tell the people concerned?', look: 'A step in change or project approval that issues an updated notice before personal data is used for a new purpose.',
    fix: 'Add a step to project approval that gives data subjects the item 1 information before data is used for a new purpose.', ev: ['notice', 'dppolicy'], when: W('c', null, EVERY) });
  L({ id: 'sv4', ref: 'Schedule V, item 4', dom: 'transparency', w: 2, comm: 'inforce', title: 'Data subjects are told the source of data obtained indirectly',
    text: 'Where the personal data of the data subject has been obtained other than through a direct interaction with the data subject, the controller shall provide the data subject, the source from which the personal data originate, and whether or not it came from publicly accessible source, where applicable in addition to the information required under item 1 of this Schedule.',
    q: 'When you get personal data from someone other than the individual, do you tell the individual where it came from?', look: 'Notice to data subjects naming the source of indirectly obtained data and whether it was publicly accessible.',
    fix: 'Tell data subjects the source of personal data obtained indirectly and whether it came from a publicly accessible source.', ev: ['notice'],
    note: 'Item 6 of Schedule V sets out when items 1 to 4 do not apply.',
    when: W('c', function (p) { return yes(p.indirect); }, 'Personal data is obtained other than through direct interaction, or this is not yet confirmed.', 'Personal data is obtained only through direct interaction with data subjects.') });
  L({ id: 'sv5', ref: 'Schedule V, item 5', dom: 'transparency', w: 2, comm: 'inforce', title: 'Indirect-collection notice is given within the Schedule V time limits',
    text: 'Where the personal data of the data subject has been obtained other than through a direct interaction with the data subject, the controller shall provide the information under items 1 and 4 of this Schedule – (a) within a reasonable period of time after obtaining the personal data, but at least within one month, having regard to the specific circumstances in which the personal data is processed; (b) if the personal data is to be used for communication with the data subject, at least at the time of the first communication to that data subject; or (c) if a disclosure to another recipient is envisaged, at least when the personal data is first disclosed.',
    q: 'Is that notice given within one month, or at first contact or first disclosure if earlier?', look: 'Procedure and records showing notice within one month, at first communication, or at first disclosure.',
    fix: 'Set a procedure to give the notice within one month of obtaining the data, or at first communication or first disclosure.', ev: ['notice', 'dppolicy'],
    when: W('c', function (p) { return yes(p.indirect); }, 'Personal data is obtained other than through direct interaction, or this is not yet confirmed.', 'Personal data is obtained only through direct interaction with data subjects.') });

  /* s.12 */
  var S12 = 'It shall be the duty of every controller to implement internal controls and procedures, (hereinafter referred to as the "Data Protection Management Programme") that— ';
  var S12N = 'Section 12(2) was repealed by Act No. 22 of 2025. The Authority may issue guidelines on the Data Protection Management Programme under section 51A.';
  function DP(item, w, title, text, q, look, fix, ev, comm, note) {
    L({ id: 's12-' + item, ref: 's.12(1)(' + item + ')', dom: 'dpmp', w: w, comm: comm || 'inforce', title: title, text: S12 + (item === 'a' ? '' : '… ') + '(' + item + ') ' + text, q: q, look: look, fix: fix, ev: ev, note: note || S12N, when: W('c', null, EVERY) });
  }
  DP('a', 3, 'Catalogued records demonstrate compliance with sections 5 to 11', 'establishes and maintains duly catalogued records to demonstrate the manner in which the implementation of the data protection obligations referred to in sections 5, 6, 7, 8, 9, 10 and 11 are carried out by the controller;', 'Do you keep organised records that show how you meet the data protection obligations?', 'A catalogued set of records covering sections 5 to 11: processing record, notices, consent records, retention schedule and security measures.', 'Establish a catalogued record set that demonstrates compliance with sections 5 to 11 and assign an owner.', ['ropa', 'dppolicy']);
  DP('b', 2, 'The programme is designed for the structure, scale, volume and sensitivity of processing', 'is designed on the basis of structure, scale, volume and sensitivity of processing activities of the controller;', 'Was your data protection programme designed around the size and sensitivity of your processing?', 'Programme document that explains its scope by reference to the structure, scale, volume and sensitivity of processing.', 'Document how the programme is scaled to the structure, scale, volume and sensitivity of processing.', ['dppolicy']);
  DP('c', 2, 'The programme provides safeguards based on impact assessments', 'provides for appropriate safeguards based on data protection impact assessments specified in section 24;', 'Do the safeguards in your programme come from impact assessments?', 'Safeguards in the programme traced to the findings of impact assessments.', 'Link the safeguards in the programme to the findings of impact assessments.', ['dppolicy', 'dpia']);
  DP('d', 2, 'The programme is integrated into the governance structure', 'is integrated into the governance structure of the controller;', 'Is data protection part of your governance structure, with defined reporting to senior management?', 'Governance documents showing responsibility for data protection and reporting to senior management or the board.', 'Assign data protection responsibility within the governance structure and set regular reporting to senior management.', ['governance']);
  DP('e', 2, 'Internal oversight mechanisms are established', 'establishes internal oversight mechanisms;', 'Is there an internal body or function that oversees data protection?', 'Terms of reference and records of an internal oversight body or function.', 'Establish an internal oversight mechanism with terms of reference and records of its work.', ['governance']);
  DP('f', 3, 'A mechanism receives complaints, conducts inquiries and identifies personal data breaches', 'has a mechanism to receive complaints, conduct of inquiries and to identify personal data breaches;', 'Can you receive complaints, look into them and spot personal data breaches?', 'A complaints channel, an inquiry procedure and a way to identify personal data breaches.', 'Set up a complaints channel, an inquiry procedure and a mechanism to identify personal data breaches.', ['complaints', 'breach']);
  DP('g', 2, 'The programme is updated from periodic monitoring and assessments', 'is updated based on periodic monitoring and assessments; and', 'Is the programme reviewed on a schedule and updated from the results?', 'Monitoring or audit reports and the programme changes that followed.', 'Schedule periodic monitoring of the programme and record the updates made from it.', ['monitoring']);
  DP('h', 2, 'The programme facilitates the exercise of data subject rights', 'facilitates the exercise of rights of data subjects under sections 13, 14, 15, 16 and 18,', 'Does the programme help people exercise their rights over their data?', 'A rights request procedure within the programme.', 'Include a rights request procedure in the programme.', ['rights', 'dppolicy'], 'counsel', 'Refers to rights under sections 13, 14, 15, 16 and 18 in Part II, which is not yet in operation.');

  /* s.20 */
  L({ id: 's20-1', ref: 's.20(1)', dom: 'dpo', w: 3, amended: true, title: 'A Data Protection Officer is designated or appointed where required',
    comm: function (p) { return dpoReq(p) ? 'inforce' : 'rules'; },
    text: 'Every controller and processor shall designate or appoint a Data Protection Officer, to ensure compliance with the provisions of this Act, in the following circumstances:– (a) where the processing is carried out by a Ministry or government department, except for judiciary acting in their judicial capacity; or (b) where the core activities of processing carried out by the controller or processor consist of the following:– (i) operations which, by virtue of their nature, their scope or their purposes, require regular and systematic monitoring of data subjects on a scale and magnitude as may be prescribed; or (ii) processing of special categories of personal data on a scale and magnitude as may be prescribed; or (iii) categories of processing which results in a risk of harm affecting the rights of the data subjects protected under this Act, based on the nature of processing and its impact on the data subjects, as may be determined by the Authority by way of guidelines made under this Act.',
    q: 'Has a Data Protection Officer been designated or appointed?', look: 'Appointment letter or resolution designating the Data Protection Officer.',
    fix: 'Designate or appoint a Data Protection Officer and record the appointment.', ev: ['dpo'],
    note: 'Paragraph (a) and sub-paragraph (b)(iii) are as amended by Act No. 22 of 2025. The scale and magnitude for (b)(i) and (ii) are to be prescribed, and the categories in (b)(iii) are to be determined by guidelines of the Authority.',
    when: function (p) {
      if (dpoReq(p)) return [true, 'Processing is carried out by a Ministry or government department (s.20(1)(a)).'];
      if (p.coremon === 'y' || p.coremon === 'u' || p.corespecial === 'y' || p.corespecial === 'u') return [true, 'Core activities may fall within s.20(1)(b). Thresholds are to be prescribed.'];
      if (p.dpohas === 'y') return [true, 'A Data Protection Officer has been designated.'];
      if (p.entity === undefined && p.coremon === undefined) return [true, 'Not yet answered. Treated as applicable.'];
      return [false, 'Not required by s.20(1)(a) on the answers given, and core activities are not reported to fall within s.20(1)(b). Revisit when thresholds are prescribed.'];
    } });
  L({ id: 's20-2', ref: 's.20(2)', dom: 'dpo', w: 2, comm: 'rules', title: 'The Data Protection Officer has relevant qualifications and competency',
    text: 'A Data Protection Officer shall possess relevant academic and professional qualifications as may be prescribed which may include academic background, knowledge and technical skills in matters relating to data protection having competency and capacity to implement strategies and mechanisms to respond to inquiries and incidents related to processing of personal data.',
    q: 'Does the Data Protection Officer have data protection qualifications and experience?', look: 'The officer\'s qualifications and experience in data protection.',
    fix: 'Confirm the Data Protection Officer\'s qualifications and plan training against the qualifications once prescribed.', ev: ['dpo'],
    note: 'Qualifications are "as may be prescribed".', when: W(null, dpoOn, 'A Data Protection Officer is required or has been designated.', 'No Data Protection Officer is required or designated on the answers given.') });
  L({ id: 's20-3', ref: 's.20(3)', dom: 'dpo', w: 1, comm: 'inforce', title: 'A group Data Protection Officer is easily accessible to each entity',
    text: 'Where the controller is a group of entities, such controller may appoint a single Data Protection Officer who is easily accessible by each entity. Where a controller or a processor is a Public Authority, a single Data Protection Officer may be designated for several such public authorities, taking into account their organizational structures.',
    q: 'If one Data Protection Officer serves the group, can each entity reach them easily?', look: 'How each entity reaches the group Data Protection Officer.',
    fix: 'Document how each entity in the group reaches the single Data Protection Officer.', ev: ['dpo'],
    when: W(null, function (p) { return dpoOn(p) && (p.group === undefined || p.group === 'y' || isPA(p)); }, 'A Data Protection Officer is in scope and the organisation is part of a group or is a public authority.', 'Not part of a group and not a public authority, or no Data Protection Officer is in scope.') });
  L({ id: 's20-4', ref: 's.20(4)', dom: 'dpo', w: 2, comm: 'inforce', title: 'The Data Protection Officer\'s contact details are published and given to the Authority',
    text: 'A controller or processor shall publish the contact details of the Data Protection Officer and communicate such details to the Authority.',
    q: 'Are the Data Protection Officer\'s contact details published and sent to the Data Protection Authority?', look: 'Where the contact details are published, and the communication to the Authority.',
    fix: 'Publish the Data Protection Officer\'s contact details and communicate them to the Authority.', ev: ['dpo'],
    when: W(null, dpoOn, 'A Data Protection Officer is required or has been designated.', 'No Data Protection Officer is required or designated on the answers given.') });
  L({ id: 's20-5', ref: 's.20(5)', dom: 'dpo', w: 2, comm: 'inforce', amended: true, title: 'The Data Protection Officer\'s responsibilities match section 20(5)',
    text: 'The responsibility of the Data Protection Officer shall be to– (a) advise the controller or processor and their employees on data processing obligations or requirements, as the case may be, under this Act or any other written law; (b) advise the controller or processor on how to comply with the provisions of this Act; (c) facilitate capacity building of staff involved in data processing operations; (d) provide advice on personal data protection impact assessments; and (e) co-operate and comply with all directives and instructions issued by the Authority on matters relating to personal data protection.',
    q: 'Do the Data Protection Officer\'s terms of reference cover advising, staff capacity building, impact assessments and working with the Authority?', look: 'Terms of reference that cover each of paragraphs (a) to (e).',
    fix: 'Align the Data Protection Officer\'s terms of reference with section 20(5)(a) to (e).', ev: ['dpo'],
    note: 'Paragraphs (a), (b) and (e) are as amended by Act No. 22 of 2025.',
    when: W(null, dpoOn, 'A Data Protection Officer is required or has been designated.', 'No Data Protection Officer is required or designated on the answers given.') });

  /* s.21 */
  var usesProc = function (p) { return yes(p.processors); };
  L({ id: 's21-1a', ref: 's.21(1)(a)', dom: 'processors', w: 3, comm: 'inforce', title: 'Only processors with appropriate measures are used',
    text: 'Where processing is to be carried out by a processor on behalf of a controller, the controller shall– (a) use only processors who ensure the provision of appropriate technical and organizational measures to give effect to the provisions of this Act and ensure the protection of rights of the data subjects under this Act; and',
    q: 'Before using a processor, do you check its technical and organisational measures?', look: 'Due diligence records for each processor.',
    fix: 'Carry out and record due diligence on each processor\'s technical and organisational measures before use and periodically after.', ev: ['vendordd', 'processors'],
    when: W('c', usesProc, 'Processors are engaged, or this is not yet confirmed.', 'No processors are engaged.') });
  var S21B = 'Where processing is to be carried out by a processor on behalf of a controller, the controller shall– … (b) ensure that such processor is bound by a contract or provisions of any written law which sets out the subject-matter and duration of the processing, the nature and purpose of the processing, the type of personal data and categories of the data subjects and the obligations of the controller.';
  function PC(n, title, q, look, fix) {
    L({ id: 's21-1b-' + n, ref: 's.21(1)(b)', dom: 'processors', w: 2, comm: 'inforce', title: title, text: S21B, q: q, look: look, fix: fix, ev: ['contracts'], contract: true,
      when: W('c', usesProc, 'Processors are engaged, or this is not yet confirmed.', 'No processors are engaged.') });
  }
  PC(1, 'Processor contracts set out the subject-matter and duration of the processing', 'Do your processor contracts state what the processing covers and for how long?', 'Contract clause setting out the subject-matter and duration of the processing.', 'Amend processor contracts to set out the subject-matter and duration of the processing.');
  PC(2, 'Processor contracts set out the nature and purpose of the processing', 'Do your processor contracts state the nature and purpose of the processing?', 'Contract clause setting out the nature and purpose of the processing.', 'Amend processor contracts to set out the nature and purpose of the processing.');
  PC(3, 'Processor contracts set out the type of personal data', 'Do your processor contracts state the types of personal data involved?', 'Contract clause or schedule setting out the type of personal data.', 'Amend processor contracts to set out the type of personal data.');
  PC(4, 'Processor contracts set out the categories of data subjects', 'Do your processor contracts state whose personal data is involved?', 'Contract clause or schedule setting out the categories of data subjects.', 'Amend processor contracts to set out the categories of data subjects.');
  PC(5, 'Processor contracts set out the obligations of the controller', 'Do your processor contracts state your obligations as controller?', 'Contract clause setting out the obligations of the controller.', 'Amend processor contracts to set out the obligations of the controller.');
  L({ id: 's21-2', ref: 's.21(2)', dom: 'processors', w: 2, comm: 'inforce', title: 'Joint controllers have arranged how they discharge their joint responsibility',
    text: 'Where two or more controllers jointly determine the purposes and means of processing, such controllers shall be referred to as "joint controllers" who shall be jointly responsible for discharging the obligations stipulated under this Act.',
    q: 'Where you decide purposes and means jointly with another organisation, is it written down who does what?', look: 'An arrangement recording how the joint controllers discharge the obligations under the Act.',
    fix: 'Record in an arrangement how the joint controllers discharge each obligation under the Act.', ev: ['joint'],
    when: W('c', function (p) { return yes(p.joint); }, 'Purposes and means are decided jointly with another organisation, or this is not yet confirmed.', 'No joint controllers reported.') });

  /* s.22 */
  var S22 = 'Where a processor is engaged in processing activities on behalf of the controller, the processor shall– ';
  L({ id: 's22-1a', ref: 's.22(1)(a)', dom: 'processors', w: 3, comm: 'inforce', title: 'Processing is carried out only on the controller\'s written instructions',
    text: S22 + '(a) ensure that processing activities are carried out only on the written instructions of the controller;',
    q: 'Do you process personal data only on written instructions from the controller?', look: 'Written instructions from each controller and a control that stops processing outside them.',
    fix: 'Obtain written instructions from each controller and restrict processing to them.', ev: ['instructions'],
    note: 'Under s.22(2), a processor that fails to comply with this paragraph, or determines the purposes and means of processing by itself, is deemed to be a controller in respect of such processing.',
    when: W('p', null, 'Applies to every processor.') });
  L({ id: 's22-1b', ref: 's.22(1)(b)', dom: 'processors', w: 2, comm: 'inforce', title: 'Personnel are bound by confidentiality and secrecy obligations',
    text: S22 + '… (b) ensure that its personnel are bound by contractual obligations on confidentiality and secrecy by the implementation of appropriate technical and organizational measures;',
    q: 'Are your employees, consultants and agents contractually bound to confidentiality?', look: 'Confidentiality terms binding employees, consultants, agents and affiliates who process personal data.',
    fix: 'Bind all personnel who process personal data to contractual confidentiality and secrecy obligations.', ev: ['confidentiality'],
    note: '"Personnel" means any employee, consultant, agent, affiliate or any person who is contracted by the processor to process personal data (s.22(5)).',
    when: W('p', null, 'Applies to every processor.') });
  L({ id: 's22-1c', ref: 's.22(1)(c)', dom: 'processors', w: 2, comm: 'inforce', title: 'Controllers can carry out compliance audits and inspections',
    text: S22 + '… (c) facilitate the controller to carry out compliance audits, including inspections upon the written request of the controller, taking into account the nature of processing and the information available to the processor; and',
    q: 'Can controllers audit or inspect your processing on written request?', look: 'Contract terms and a procedure for handling controller audit and inspection requests.',
    fix: 'Adopt a procedure for facilitating controller compliance audits and inspections on written request.', ev: ['instructions'],
    when: W('p', null, 'Applies to every processor.') });
  L({ id: 's22-1d', ref: 's.22(1)(d)', dom: 'processors', w: 2, comm: 'inforce', title: 'Personal data is erased or returned when services end',
    text: S22 + '… (d) upon the written instructions of the controller, erase existing copies of personal data or return all personal data to the controller after the completion of the provisions of services relating to processing.',
    q: 'When a service ends, do you erase or return the controller\'s personal data on written instruction?', look: 'Exit procedure and records of erasure or return at the end of services.',
    fix: 'Adopt an exit procedure to erase or return personal data on the controller\'s written instructions, and keep a record.', ev: ['instructions', 'backup'],
    when: W('p', null, 'Applies to every processor.') });
  L({ id: 's22-3', ref: 's.22(3), (4)', dom: 'processors', w: 2, comm: 'inforce', title: 'Sub-processors are held to the same obligations',
    text: '(3) Where a processor engages another processor (hereinafter referred to as the "sub processor") for carrying out specific processing activities, the provisions of this section shall apply to and in relation to such sub processor. (4) Where a sub processor fails to fulfil its obligations under subsection (3), the processor shall be liable to the controller for the performance or carrying out of the obligations of such sub processor.',
    q: 'Are your sub-processors bound to the same obligations you owe the controller?', look: 'Sub-processor agreements that pass down the section 22 obligations.',
    fix: 'Amend sub-processor agreements to pass down the section 22 obligations.', ev: ['subproc'],
    when: W('p', function (p) { return yes(p.subproc); }, 'Sub-processors are engaged, or this is not yet confirmed.', 'No sub-processors are engaged.') });

  /* s.23 */
  L({ id: 's23-1', ref: 's.23(1)', dom: 'breach', w: 3, comm: 'rules', title: 'Personal data breaches are notified to the Authority',
    text: 'In the event of a personal data breach, a controller shall notify the Authority, regarding such personal data breach in such form, manner and within such period of time as may be determined by rules made under this Act.',
    q: 'Do you have a breach procedure that includes notifying the Data Protection Authority?', look: 'A breach procedure with a step to notify the Authority, roles and a decision record.',
    fix: 'Adopt a breach procedure that includes notifying the Authority, and complete the form, manner and time period once rules are made.', ev: ['breach'],
    note: 'The form, manner and time period are to be determined by rules. Draft rules of the Authority propose notification within 72 hours. No final gazetted version was located when this library was verified, so no time period is stated here as law.',
    when: W('c', null, EVERY) });
  L({ id: 's23-2', ref: 's.23(2)(b)', dom: 'breach', w: 2, comm: 'rules', title: 'Affected data subjects are notified where rules require',
    text: 'The Authority shall provide for– (a) the circumstances where the Authority shall be notified of such data breach; (b) the circumstances where the affected data subject shall be notified; and (c) the form, and manner of making such notification, and information which shall be provided in such notification relating to the data breach, by way of rules made under this Act.',
    q: 'Does the breach procedure include telling affected individuals?', look: 'A step in the breach procedure for notifying affected data subjects.',
    fix: 'Add a step for notifying affected data subjects, and complete the circumstances once rules are made.', ev: ['breach'],
    note: 'The circumstances are to be provided by rules made under the Act.', when: W('c', null, EVERY) });

  /* ss.24 to 25 */
  var dpiaY = 'Processing within s.24(1)(a) or (b) is carried out or intended, or this is not yet confirmed.';
  var dpiaN = 'No processing within s.24(1)(a) or (b) on the answers given. Further activities may be determined by rules under s.24(1)(c).';
  L({ id: 's24-1', ref: 's.24(1)', dom: 'dpia', w: 3, comm: 'rules', title: 'An impact assessment is carried out before the processing',
    text: 'Where a Controller intends to carry out any processing which involves– (a) a systematic and extensive evaluation of personal data or special categories of personal data including profiling; (b) a systematic monitoring of publicly accessible areas or telecommunication networks; or (c) a processing activity as may be determined by way of rules taking into consideration the scope and associated risks of that processing, such controller shall, prior to such processing, carry out a personal data protection impact assessment in a form and manner as may be prescribed, to ascertain the impact of the intended processing on the obligations imposed on the controller under Part I of this Act and the rights of data subjects under Part II of this Act.',
    q: 'Was an impact assessment completed before this processing started?', look: 'A completed impact assessment for each such activity, dated before the processing began.',
    fix: 'Carry out an impact assessment for each such activity before it starts, and adopt the prescribed form once made.', ev: ['dpia'],
    note: 'The form and manner are "as may be prescribed". The assessment is measured against Part I and against Part II, which is not yet in operation.',
    when: W('c', dpiaOn, dpiaY, dpiaN) });
  L({ id: 's24-2', ref: 's.24(2)', dom: 'dpia', w: 2, comm: 'inforce', title: 'The assessment records measures and safeguards',
    text: 'The personal data protection impact assessment shall contain such information and particulars including any measures and safeguards taken by the controller to mitigate any risk of harm caused to the data subject by the processing referred to in subsection (1).',
    q: 'Does each impact assessment record the measures and safeguards taken?', look: 'Assessments that list the measures and safeguards taken to mitigate risk of harm.',
    fix: 'Record in each assessment the measures and safeguards taken to mitigate risk of harm to data subjects.', ev: ['dpia'], when: W('c', dpiaOn, dpiaY, dpiaN) });
  L({ id: 's24-3', ref: 's.24(3)', dom: 'dpia', w: 1, comm: 'inforce', amended: true, title: 'The Data Protection Officer assists with each assessment',
    text: 'The controller shall seek the assistance of the Data Protection Officer, when carrying out a personal data protection impact assessment under subsection (1).',
    q: 'Is the Data Protection Officer involved in each impact assessment?', look: 'Assessment records showing the Data Protection Officer\'s input.',
    fix: 'Record the Data Protection Officer\'s assistance in each impact assessment.', ev: ['dpia'],
    note: 'As amended by Act No. 22 of 2025, which removed the words "where designated".', when: W('c', dpiaOn, dpiaY, dpiaN) });
  L({ id: 's24-4', ref: 's.24(4)', dom: 'dpia', w: 2, comm: 'inforce', title: 'A fresh assessment follows any change in methodology, technology or process',
    text: 'The controller shall conduct a fresh personal data protection impact assessment in accordance with this section whenever there is any change in the methodology, technology or process adopted in the processing for which a personal data protection impact assessment has already been carried out.',
    q: 'Is a new impact assessment done when the method, technology or process changes?', look: 'A trigger in change management that requires a fresh assessment.',
    fix: 'Add a trigger to change management that requires a fresh assessment when methodology, technology or process changes.', ev: ['dpia'], when: W('c', dpiaOn, dpiaY, dpiaN) });
  L({ id: 's24-5', ref: 's.24(5)', dom: 'dpia', w: 1, comm: 'inforce', amended: true, title: 'Assessments can be submitted to the Authority on written request',
    text: 'Upon a written request from the Authority, the controller shall submit to the Authority the personal data protection impact assessment required to be carried out under this section and provide any other information relating to such assessment, as may be required by the Authority.',
    q: 'Are impact assessments filed so they can be produced if the Authority asks?', look: 'A register of assessments that are retained and retrievable.',
    fix: 'Keep a register of impact assessments so each can be submitted to the Authority on written request.', ev: ['dpia'],
    note: 'As amended by Act No. 22 of 2025.', when: W('c', dpiaOn, dpiaY, dpiaN) });
  L({ id: 's25-1', ref: 's.25(1)', dom: 'dpia', w: 3, comm: 'inforce', amended: true, title: 'Risks of harm are mitigated before processing starts',
    text: 'Where a personal data protection impact assessment carried out under section 24 indicates that the processing is likely to result in a risk of harm to the rights of the data subjects guaranteed under this Act, a controller shall take such measures to mitigate such risk of harm, prior to any processing of personal data.',
    q: 'Where an assessment found a risk of harm, were measures taken before processing began?', look: 'Evidence that mitigation measures were in place before the processing started.',
    fix: 'Implement and evidence the mitigation measures identified by each assessment before processing starts.', ev: ['dpia'],
    note: 'As amended by Act No. 22 of 2025, which also repealed subsections (2) to (6) on prior consultation.', when: W('c', dpiaOn, dpiaY, dpiaN) });
  L({ id: 's25-7', ref: 's.25(7)', dom: 'dpia', w: 3, comm: 'inforce', amended: true, title: 'The Authority is consulted on national security, public order and public health processing',
    text: 'Notwithstanding anything to the contrary in any other written law, whenever the controller engages in processing of personal data referred to in section 24 (1) where such processing is carried out by a controller in relation to national security, public order and public health, the controller shall consult the Authority.',
    q: 'Has the Data Protection Authority been consulted on this processing?', look: 'Record of consultation with the Authority.',
    fix: 'Consult the Authority on this processing and keep a record of the consultation.', ev: ['dpia'],
    note: 'As amended by Act No. 22 of 2025.',
    when: W('c', function (p) { return dpiaOn(p) && (p.natsec === undefined || p.natsec === 'y'); }, 'Section 24(1) processing is carried out in relation to national security, public order and public health.', 'No section 24(1) processing in relation to national security, public order and public health.') });

  /* s.26 */
  var xbY = 'Personal data moves out of Sri Lanka, or this is not yet confirmed.';
  var xbN = 'No cross-border data flow reported.';
  var xb = function (p) { return yes(p.xborder); };
  L({ id: 's26-1', ref: 's.26(1)', dom: 'xborder', w: 3, comm: 'counsel', amended: true, title: 'Cross-border data flows comply with Part I, Part II and sections 20 to 25',
    text: 'A controller or processor may engage in cross-border data flows, only where such controller or processor, ensures compliance with the provisions of Part I, Part II and sections 20, 21, 22, 23, 24 and 25, as the case may be.',
    q: 'Do you keep a list of every transfer of personal data outside Sri Lanka?', look: 'A register of cross-border data flows: the data, the country, the recipient and the purpose.',
    fix: 'Keep a register of every cross-border data flow and confirm for each that the listed provisions are met.', ev: ['xborder'],
    note: 'Section 26 was replaced by Act No. 22 of 2025. It refers to Part II, which is not yet in operation. "Third country" now means any other territory or country other than Sri Lanka.', when: W(null, xb, xbY, xbN) });
  L({ id: 's26-2', ref: 's.26(2)', dom: 'xborder', w: 3, comm: 'rules', amended: true, title: 'Instruments specified by the Authority bind the overseas recipient',
    text: 'For the purpose of ensuring compliance under subsection (1), a controller or processor shall adopt such instruments as may be specified by a directive issued by the Authority under paragraph (c) of section 33, to ensure binding and enforceable commitments of the recipient in the third country to ensure appropriate safeguards to the rights of the data subjects and remedies available under this Act.',
    q: 'Do contracts with overseas recipients include binding data protection commitments?', look: 'Binding commitments from each overseas recipient, in the instrument specified by the Authority once issued.',
    fix: 'Identify each overseas recipient and adopt the instrument specified by the Authority once the directive is issued.', ev: ['xborder', 'contracts'],
    note: 'The instruments are to be specified by a directive of the Authority under s.33(c).', when: W(null, xb, xbY, xbN) });
  L({ id: 's26-3', ref: 's.26(3)', dom: 'xborder', w: 2, comm: 'inforce', amended: true, title: 'Any reliance on a section 26(3) ground is recorded',
    text: 'Notwithstanding the provisions of subsection (1), a controller or processor may engage in cross-border data flows, if- (a) the data subject has explicitly consented to the proposed cross-border data flow, after having been informed of the possible risks of such processing for the data subject; (b) the transfer is necessary for the performance of a contract between the data subject and the controller or the implementation of any pre contractual measures taken by the controller at the request of the data subject; (c) the transfer is necessary for the establishment, exercise or defence of legal claims relating to the data subject; (d) the transfer is necessary for reasons of public interest as defined in item (g) of Schedule I to this Act; (e) the transfer is necessary to respond to an emergency that threatens the life, health or safety of the data subject or where his legal guardian is physically or legally incapable of giving consent; (f) the transfer constitutes only a transit of personal data through Sri Lanka; or (g) such processing is permitted under any other conditions as may be prescribed under this Act.',
    q: 'Where a transfer relies on consent, contract or another exception, is that recorded for each transfer?', look: 'For each flow that relies on s.26(3), the paragraph relied on and its supporting record, such as explicit consent wording that informs of the possible risks.',
    fix: 'Record for each cross-border data flow whether a s.26(3) ground is relied on, and keep the supporting evidence.', ev: ['xborder', 'consent'], when: W(null, xb, xbY, xbN) });
  L({ id: 's26-4', ref: 's.26(4)', dom: 'xborder', w: 3, comm: 'rules', amended: true, title: 'A public authority does not transfer prescribed categories of personal data',
    text: 'A controller or processor who is a public authority shall not engage in cross-border data flows in respect of the categories of personal data as may be prescribed under subsection (5).',
    q: 'Do you check transfers against the categories of data a public authority may not send abroad?', look: 'A control that checks cross-border data flows against the categories prescribed by the Minister.',
    fix: 'Add a check of cross-border data flows against the categories prescribed under s.26(5) once prescribed.', ev: ['xborder'],
    note: 'The categories are to be prescribed by the Minister under s.26(5).',
    when: W(null, function (p) { return xb(p) && (p.entity === undefined || isPA(p)); }, 'A public authority with cross-border data flows.', 'Not a public authority, or no cross-border data flow reported.') });

  /* Part II */
  var RY = 'Applies to every controller once Part II is in operation.';
  function RT(o) { o.dom = 'rights'; o.comm = 'future'; if (!o.ev) o.ev = ['rights']; if (!o.when) o.when = W('c', null, RY); L(o); }
  RT({ id: 's13', ref: 's.13', w: 2, title: 'Access requests are answered with confirmation and Schedule V information',
    text: '(1) Every data subject shall have the right to access to personal data of such data subject and to be provided with a confirmation as to whether such personal data has been processed and such information referred to in Schedule V, upon a written request made by such data subject to the controller. (2) The controller shall, upon receipt of a written request made by the data subject under subsection (1), provide the data subject with such information required to be provided under Schedule V, subject to section 17.',
    q: 'Can you answer a written request from someone to see their personal data?', look: 'A procedure for access requests that provides confirmation, the personal data and the Schedule V information.', fix: 'Adopt a procedure for written access requests that provides confirmation and the Schedule V information.' });
  RT({ id: 's14-1', ref: 's.14(1)', w: 2, title: 'Consent can be withdrawn at any time on written request',
    text: 'Every data subject shall have the right to withdraw his consent at any time upon a written request made by such data subject if such processing is based on the grounds specified in item (a) of Schedule I or item (a) of Schedule II of this Act:',
    q: 'Can people withdraw consent, and does processing stop when they do?', look: 'A withdrawal route and a process that stops consent-based processing once consent is withdrawn.', fix: 'Provide a route for withdrawing consent and stop the consent-based processing when it is used.',
    when: W('c', consent, 'Consent is relied on as a lawful basis.', 'Consent is not relied on.') });
  RT({ id: 's14-2', ref: 's.14(2)', w: 2, title: 'Requests to refrain from further processing are handled',
    text: 'Every data subject shall have the right to request a controller in writing, to refrain from further processing of personal data relating to such data subject, if such processing is based on the grounds specified in items (e) or (f) of Schedule I or item (f) of Schedule II.',
    q: 'Can you act on a written request to stop processing someone\'s data?', look: 'A procedure for handling requests to refrain from further processing based on Schedule I(e) or (f) or Schedule II(f).', fix: 'Adopt a procedure for requests to refrain from further processing.',
    when: W('c', function (p) { return anyOf(p.bases, 'e', 'f') || hasSpecial(p); }, 'Processing is based on Schedule I(e) or (f), or special categories are processed and may rest on Schedule II(f).', 'Processing is not based on Schedule I(e) or (f) and no special categories are processed.') });
  RT({ id: 's15', ref: 's.15', w: 2, title: 'Inaccurate or incomplete data is rectified or completed without undue delay',
    text: 'Every data subject shall have the right to request a controller in writing to rectify or complete the personal data relating to such data subject which is either inaccurate or incomplete, and the controller shall, upon such a written request made by the data subject, rectify or complete the personal data without undue delay subject to the provisions of section 17:',
    q: 'Can you correct or complete someone\'s personal data promptly when they ask in writing?', look: 'A rectification procedure and the ability to correct data in each system.', fix: 'Adopt a rectification and completion procedure that reaches every system holding the data.', ev: ['rights', 'accuracy'] });
  RT({ id: 's16', ref: 's.16', w: 2, title: 'Erasure requests are handled in the section 16 circumstances',
    text: 'Every data subject shall have the right to make a written request to the controller to have his personal data erased, under the following circumstances where– (a) the processing of personal data is carried out in contravention of the obligations referred to in sections 5,6,7,8,9,10 and 11; (b) the data subject withdraws his consent upon which the processing is based, in accordance with item (a) of Schedule I or item (a) of Schedule II; (c) the requirement to erase personal data is required by any written law or on an order of a competent court to which the data subject or controller is subject to.',
    q: 'Can you erase someone\'s personal data when they are entitled to ask for it?', look: 'An erasure procedure covering the three circumstances and the ability to erase in each system.', fix: 'Adopt an erasure procedure covering the section 16 circumstances.' });
  RT({ id: 's17-1', ref: 's.17(1)', w: 3, amended: true, title: 'Requests are answered in writing within one month',
    text: 'Where a controller receives a written request from a data subject under section 13, 14, 15, 16 or 18, such controller shall inform in writing to the data subject, without undue delay and within one month of the receipt of such request, whether- (a) such request was granted; or (b) such request was refused, with reasons therefor, unless the disclosure of such reasons is prohibited by any written law.',
    q: 'Do you reply in writing to rights requests within one month?', look: 'A request log with receipt and response dates and written responses.', fix: 'Log every request on receipt and respond in writing without undue delay and within one month.',
    note: 'As amended by Act No. 22 of 2025. The original period was twenty-one working days.' });
  RT({ id: 's17-1a', ref: 's.17(1A), (1B)', w: 1, amended: true, title: 'Any extension is limited and the data subject is told within the first month',
    text: '(1A) Where a controller requires an extension of the time period referred to in subsection (1) for reasons assigned, such period may be extended for a further period of two months, which shall not exceed three months from the date of the receipt of the request. (1B) In the event of extension of time period under subsection (1), the controller shall inform the data subject, regarding such extension, prior to the expiry of the period of one month referred to in subsection (1).',
    q: 'If you need more time, do you tell the person within the first month and finish within three months?', look: 'Procedure and letters for extensions, sent before the first month expires.', fix: 'Add an extension step that informs the data subject before the first month expires and closes within three months of receipt.',
    note: 'Inserted by Act No. 22 of 2025.' });
  RT({ id: 's17-1c', ref: 's.17(1C)', w: 2, amended: true, title: 'Refusals tell the data subject about the right of appeal',
    text: 'A controller shall inform the data subject on the availability of the right of appeal to the Authority in respect of the refusal of a request made under section 13, 14, 15, 16 or 18.',
    q: 'When you refuse a request, do you tell the person they can appeal to the Authority?', look: 'Refusal letter template that states the right of appeal to the Authority.', fix: 'State the right of appeal to the Authority in every refusal.',
    note: 'Inserted by Act No. 22 of 2025.' });
  RT({ id: 's17-3', ref: 's.17(3)', w: 2, title: 'Reasons for refusal are recorded',
    text: 'A controller shall, record the reasons for any refusal under subsection (2) and submit such records to the Authority upon a written request from the Authority.',
    q: 'Do you keep a record of why each request was refused?', look: 'A refusal register with the s.17(2) reason for each refusal.', fix: 'Record the reason for every refusal so the record can be submitted to the Authority on written request.' });
  RT({ id: 's17-4', ref: 's.17(4)', w: 1, amended: true, title: 'Identity is verified before acting on a request',
    text: 'Where a controller is unable to establish the identity of a data subject making a request under section 13, 14, 15, 16 or 18, such controller may, request the data subject to provide additional information to enable the controller to carry out such requests.',
    q: 'Do you check the identity of the person making a request?', look: 'Identity verification steps in the rights procedure.', fix: 'Add identity verification steps to the rights procedure.',
    note: 'As amended by Act No. 22 of 2025 to include section 18.' });
  RT({ id: 's17-5', ref: 's.17(5)', w: 1, amended: true, title: 'Requests from parents, guardians, authorised persons and heirs are handled',
    text: 'Any right conferred on a data subject under this Part may be exercised– (a) where the data subject is a minor, by parents or a person who has the parental authority over the minor or who has been appointed as his legal guardian; or (b) where the data subject is physically or mentally unfit, by a person who has been appointed as his guardian or administrator by a Court; or (c) by a person duly authorized in writing by the data subject to make a request under this Part except in the cases referred to in paragraphs (a) and (b); or (d) by an heir to exercise a deceased data subject\'s rights within a period of ten years from the date of demise of such data subject, in the manner prescribed by regulations.',
    q: 'Can a parent, guardian, authorised person or heir make a request on someone\'s behalf?', look: 'Procedure for verifying and handling requests made on behalf of a data subject.', fix: 'Add steps for requests made by parents, guardians, authorised persons and heirs.',
    note: 'Paragraph (d) is as amended by Act No. 22 of 2025. The manner is to be prescribed by regulations.' });
  RT({ id: 's17-6', ref: 's.17(6)', w: 2, amended: true, title: 'Requests are complied with free of charge',
    text: 'A request made by a data subject under section 13, 14, 15, 16 or 18 shall be complied with by the controller free of charge: Provided however, the Authority may determine by way of rules, the criteria or circumstances under which a fee may be charged by a controller to give effect to such requests.',
    q: 'Are rights requests handled without charging a fee?', look: 'Procedure confirming that no fee is charged.', fix: 'Remove any fee for rights requests unless rules of the Authority allow one.',
    note: 'Substituted by Act No. 22 of 2025.' });
  RT({ id: 's18', ref: 's.18(1)', w: 2, amended: true, title: 'Solely automated decisions can be reviewed on request', ev: ['adm', 'rights'],
    text: 'Subject to section 19, every data subject shall have the right to request a controller to review a decision of such controller based solely on automated processing, which has created or which is likely to create an irreversible and continuous impact on the rights and freedoms of the data subject under the Constitution or any written law.',
    q: 'Can someone ask for an automated decision about them to be reviewed?', look: 'A procedure for reviewing decisions based solely on automated processing.', fix: 'Adopt a procedure for reviewing solely automated decisions on request.',
    note: 'As amended by Act No. 22 of 2025. Section 18(2) lists decisions to which this does not apply.',
    when: W('c', function (p) { return yes(p.adm); }, 'Decisions are taken solely by automated processing, or this is not yet confirmed.', 'No decisions are based solely on automated processing.') });
  T({ id: 't-dsr-1', ref: 'Part II', tdom: 'dsr', dom: 'rights', w: 2, comm: 'future', title: 'Personal data can be located, corrected, deleted and restricted across systems',
    text: 'The organisation can technically locate, access, correct, delete and restrict processing of personal data across systems in response to rights requests.', basis: 'Supports sections 13 to 16.',
    q: 'Can you find, correct, delete and restrict one person\'s data across all your systems?', look: 'Evidence of how one data subject\'s records are located and acted on in each system, including manual workarounds.',
    fix: 'Build the ability to locate, correct, delete and restrict a data subject\'s records in every system.', ev: ['datamap', 'rights'], when: W('c', null, RY) });
  T({ id: 't-dsr-2', ref: 'Part II', tdom: 'dsr', dom: 'rights', w: 1, comm: 'future', title: 'Actions taken on rights requests are traceable',
    text: 'Audit trails record and trace the actions taken on rights requests.', basis: 'Supports section 17.',
    q: 'Is there an audit trail of what was done for each rights request?', look: 'Audit trail of actions taken for each request.',
    fix: 'Keep an audit trail of the actions taken on each rights request.', ev: ['rights', 'logging'], when: W('c', null, RY) });

  /* Part IV */
  var mk = function (p) { return p.marketing === undefined || p.marketing === 'y'; };
  var mkY = 'Promotional messages are sent.', mkN = 'No promotional messages are sent.';
  function MK(o) { o.dom = 'marketing'; o.comm = 'future'; o.ev = ['marketing']; o.when = W('c', mk, mkY, mkN); L(o); }
  MK({ id: 's27-1', ref: 's.27(1)', w: 3, title: 'Promotional messages are sent only with consent',
    text: 'Subject to section 14, a controller may use postal services, telecommunication services, electronic means or any other similar means for the purposes of disseminating messages only if a data subject has given consent to receive such messages (hereinafter referred to as "solicited messages").',
    q: 'Do you send promotional messages only to people who have consented to receive them?', look: 'Consent records for each recipient of promotional messages.', fix: 'Send promotional messages only to data subjects who have consented, and suppress the rest.' });
  MK({ id: 's27-2', ref: 's.27(2)', w: 2, title: 'Marketing consent meets the Schedule III conditions',
    text: 'For the purpose of subsection (1), consent shall be obtained by a controller in accordance with the conditions of Schedule III of this Act.',
    q: 'Is marketing consent requested separately, in plain language, with the right to withdraw explained?', look: 'Marketing consent wording that meets Schedule III.', fix: 'Align marketing consent capture with the Schedule III conditions.' });
  MK({ id: 's27-3', ref: 's.27(3)', w: 2, title: 'Every message explains how to opt out free of charge',
    text: 'When obtaining a consent under subsection (1), the controller shall, at the time of collecting contact information and each time where a message is sent, provide to the data subject details on how to opt-out of receiving solicited messages free of charge.',
    q: 'Does every promotional message, and the sign-up form, say how to opt out for free?', look: 'Sample messages and collection forms showing free opt-out details.', fix: 'Add free opt-out details to the collection point and to every message.' });
  MK({ id: 's27-4', ref: 's.27(4)', w: 1, title: 'Messages state their nature and who they are sent for',
    text: 'A controller using postal, electronic, telecommunication or any other similar means to disseminate any solicited message, shall inform the data subjects, to whom such messages are intended, of the nature of the message and the identity of the controller or third party on behalf of whom the message is disseminated by the controller.',
    q: 'Does each message make clear it is promotional and who it is from?', look: 'Sample messages that state their nature and the identity of the controller or third party.', fix: 'State in each message its nature and the identity of the controller or third party it is sent for.',
    note: 'Under s.27(5) the Authority may determine by rules a code or prefix to identify categories of solicited messages.' });

  /* ---------- reference data ---------- */
  var COUNSEL_POINTS = [
    'Schedules I to V are not named in Gazette No. 2498/16. Sections 5 and 11 operate through them.',
    'Provisions in operation from 1 January 2027 that refer to Part II while Part II is not in operation: s.11(b), s.12(1)(h), s.24(1), s.26(1) and Schedule V item 1(j). Schedule V item 1(m) also refers to section 18.',
    'Obligations that depend on rules, regulations, guidelines or directives not yet final: breach notification details (s.23), form and manner of impact assessments (s.24), Data Protection Officer thresholds (s.20(1)(b)), and cross-border instruments (s.26(2)). Draft breach rules propose notification to the Authority within 72 hours. No final gazetted version was located as of ' + VERIFIED + '.',
    'Enforcement: inquiries and binding directives under s.35, including compensation under s.35(2)(c), sit in Part V, which is in operation. Penalties for failing to comply with a directive (s.38) sit in Part VII, which is not in operation. This is a reading of the Act text only.'
  ];
  var SOURCES = [
    { t: ACT, n: 'Certified 19 March 2022' },
    { t: AMD, n: 'Certified 30 October 2025' },
    { t: 'Extraordinary Gazette No. 2498/16', n: 'Published 22 July 2026. Appoints 1 January 2027 for sections 2 and 3, Part I and Part III.', u: 'https://documents.gov.lk/view/egz/2026/7/2498-16_E.pdf' },
    { t: 'TechNeura Labs, PDPA Technical and Legal Readiness Assessment scope', n: 'Source of the technical assessment criteria and the deliverables.' }
  ];
  var S1 = { a: 'Schedule I(a) consent', b: 'Schedule I(b) contract', c: 'Schedule I(c) legal obligation', d: 'Schedule I(d) emergency', e: 'Schedule I(e) public interest or statutory function', f: 'Schedule I(f) legitimate interests' };
  var S2 = { a: 'Schedule II(a) consent', b: 'Schedule II(b) employment, social security, public health', c: 'Schedule II(c) emergency', d: 'Schedule II(d) manifestly made public', e: 'Schedule II(e) legal claims', f: 'Schedule II(f) written law or public interest', g: 'Schedule II(g) medical purposes', h: 'Schedule II(h) archiving, research, statistics' };
  var S26 = { inst: 's.26(2) instrument specified by the Authority', a: 's.26(3)(a) explicit consent', b: 's.26(3)(b) contract with the data subject', c: 's.26(3)(c) legal claims', d: 's.26(3)(d) public interest', e: 's.26(3)(e) emergency', f: 's.26(3)(f) transit only' };

  return {
    VERIFIED: VERIFIED, ACT: ACT, AMD: AMD, COMM: COMM, DOMAINS: DOMAINS, TDOMS: TDOMS, DOCS: DOCS, QUESTIONS: QUESTIONS, CONTROLS: C,
    COUNSEL_POINTS: COUNSEL_POINTS, SOURCES: SOURCES, S1: S1, S2: S2, S26: S26,
    determinations: determinations, isCtrl: isCtrl, isProc: isProc, isPA: isPA, hasSpecial: hasSpecial
  };
})();
