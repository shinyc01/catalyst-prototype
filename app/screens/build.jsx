/* Build: idea overview (Shape).
   Loaded by index.html as text/babel, in order: ui → map → screens → flows → tour → main. Globals are shared across files. */
/* ============================================================ Screen 5 — Build (idea, Shaping) — Figma 43:65022 "Idea overview / Investment owner review" */
// Alternatives are the idea investment's real Whistler alternatives (spend, value, dates); BCR is [Added] via bcrOf()
const ALTERNATIVES = IDEA_ALTS.map(a => ({ id: a.id, name: a.name, desc: ALT_DESC[a.name], bcr: bcrOf(a.valueTotal, a.spendTotal), value: a.valueTotal,
  cost: fmtMoney(a.spendTotal), time: spanYears(a), valueLabel: fmtValue(a.valueTotal), valueByMeasure: a.valueByMeasure, recommendedInData: a.isRecommended }));
// The portfolio to compare against: the other real Whistler investments with spend and value
const PORTFOLIO = WHISTLER_INVESTMENTS.map(i => ({ id: i.id, name: i.name, bcr: bcrOf(i.totalValue, i.totalSpend), value: i.totalValue }))
  ;
const BINS = {
  bcr: [[0, 0.5, '< 0.5'], [0.5, 1, '0.5–1'], [1, 1.5, '1–1.5'], [1.5, 2, '1.5–2'], [2, 3, '2–3'], [3, 5, '3–5'], [5, 1e9, '5+']],
  value: [[0, 2e3, '< 2K'], [2e3, 5e3, '2K–5K'], [5e3, 15e3, '5K–15K'], [15e3, 30e3, '15K–30K'], [30e3, 60e3, '30K–60K'], [60e3, 150e3, '60K–150K'], [150e3, 1e12, '150K+']],
};
// Strategic relevance = share of the recommended alternative's value by measure category (cost measures excluded)
function relevance(alt) {
  const cats = ['Reliability', 'Financial', 'Environment', 'Social', 'Governance'], tot = Object.fromEntries(cats.map(c => [c, 0]));
  (alt.valueByMeasure || []).forEach(m => { const c = MEASURE_CATEGORY[m.measure]; if (c && m.value > 0) tot[c] += m.value; });
  const sum = Object.values(tot).reduce((a, b) => a + b, 0) || 1;
  return cats.map(c => [c, Math.round(tot[c] / sum * 100)]);
}

// Card with the Figma header: H4 title (DS 2.0.1, was uppercase) (+ optional extra) on the left, Cooper icon-button on the right
const Sec = ({ title, extra, actions, children, style, cooper }) => (
  <ContentCard style={style} className={cooper ? 'build-sec--cooper' : undefined} top={
    <div className="row" style={{ width: '100%', justifyContent: 'space-between', padding: 'var(--space-100) var(--space-150) 0' }}>
      <div className="row" style={{ gap: 'var(--space-400)' }}><span className="t-heading-h4-semibold">{title}</span>{extra}</div>
      <div className="row" style={{ gap: 'var(--space-100)' }}>{actions}
      <IconButton icon="cooper-system-icon" type="tertiary" shape="circle" size="s" label="Ask Cooper" onClick={() => toast({ title: `Cooper: ${title}` })} /></div>
    </div>} bottom={<div style={{ width: '100%' }}>{children}</div>} />
);
const SubHead = ({ children }) => <span className="t-label-m-medium" style={{ display: 'block', padding: 'var(--space-100) 0 var(--space-200)' }}>{children}</span>;

function Build({ navBar, lenses, idea, onBack, status = 'shaping', onDismiss, onSendForReview, recommendedId, persona = 'owner', review, setReview, onDecide, onOpenRefine, invId }) {
  // Any openable idea (shared/build-model.js canOpenIdea). The pad-mount idea keeps its study-driven content; others show their real record and alternatives
  const main = !invId || invId === CLUSTER.ideaInvestmentId, R = rfContext(invId), INV = R.inv;
  const ALTS = main ? ALTERNATIVES : R.alts.map(a => ({ id: a.id, name: a.name, desc: altDesc(a.name), bcr: a.bcr, value: a.value, cost: fmtMoney(a.cost), time: a.years,
    valueLabel: fmtValue(a.value), valueByMeasure: a.valueByMeasure, added: a.added }));
  const myAssets = main ? null : ASSETS.filter(a => a.investmentId === INV.id);
  // J11: the reviewer (Noah Lindgren, Finance Lead) sees the idea read-only with Cooper's Readiness Evaluation and Decide;
  // the owner sees the approval chain in place of the canvas while the idea is with the reviewers
  const rows = (review && review.rows) || REVIEWERS();
  const reviewer = main && persona === 'estimator' && status === 'review';
  const myRow = rows.find(r => r.id === 'NL') || {};
  const ownerChain = main && !reviewer && (['review', 'deferred', 'rejected', 'refining'].includes(status) || (status === 'shaping' && review && review.revisions && !review.reopened));
  const [decide, setDecide] = useState(null);       // 'proceed' | 'request' | 'park' | 'stop' while its dialog is open
  const [decideNote, setDecideNote] = useState('');
  const s = study(lenses, END);
  // J07: System confidence sidebar (Figma 43:76732): the kit's issue report, gates and open questions from shared/build-model.js
  const c = IFS.useIssueReport({ issues: useMemo(() => shapeIssuesFor(INV.id), [INV.id]), gates: SHAPE_GATES });
  const [panel, setPanel] = useState(false);
  const [dismiss, setDismiss] = useState(null);      // note text while the Dismiss modal is open
  // J07: edit types (Figma 43:68623): manual edit, or Edit with Cooper
  const needDefault = !main ? `${INV.description || INV.name}\n\nCooper compared ${ALTS.length} alternatives${ALTS.some(a => a.added) ? ' (one suggested by Cooper)' : ''}; the recommended one costs ${fmtMoney(R.rec.cost)} over ${R.rec.years}.` : `The 12 pad-mount transformers in Alpine Meadows have been in service since 1944–45 and are now at ${ASSETS.find(a => a.type === 'padmount').outlook['Normalized Age'][0]}× their design life. With the study’s ${s.act.length} lenses applied, ${s.now.over} of ${ASSETS.length} assets in the cluster cross their intervention tolerance by ${END}, the next new crossing in ${s.first ?? '—'}. Left alone, outages affect ~${CLUSTER.customers.toLocaleString()} Alpine Meadows customers.`;
  const [need, setNeed] = useState(needDefault);
  const [editNeed, setEditNeed] = useState(null);    // draft text while editing by hand
  const [askNeed, setAskNeed] = useState(false);     // Edit with Cooper bar open
  const [askText, setAskText] = useState('');
  const [cooperSaid, setCooperSaid] = useState(null);
  const ans = idea?.answers || [];
  // the recommended alternative is shared with Refine (Set as recommended there changes it here too)
  const recAlt = main ? (recommendedId && IDEA_ALTS.find(a => a.id === recommendedId)) || altForIntent(ans[0]) || IDEA_ALTS.find(a => a.isRecommended)
    : ALTS.find(a => a.id === recommendedId) || ALTS.find(a => a.id === R.rec.id);
  const rec = ALTS.find(a => a.id === recAlt.id), others = ALTS.filter(a => a.id !== rec.id);
  const overRows = s.now.rows.filter(r => r.over);
  const [metric, setMetric] = useState('bcr');
  const key = metric === 'bcr' ? 'bcr' : 'value', val = rec[key];
  const all = [...PORTFOLIO.filter(p => p.id !== INV.id && p.bcr !== null).map(p => ({ name: p.name, v: p[key] })), { name: INV.name, v: val, me: true }];
  const rank = 1 + all.filter(p => !p.me && p.v > val).length, pct = Math.round((1 - (rank - 1) / all.length) * 100);
  const standing = pct >= 75 ? 'Top quartile' : pct >= 50 ? 'Second quartile' : pct >= 25 ? 'Third quartile' : 'Bottom quartile';
  const counts = BINS[key].map(([lo, hi]) => all.filter(p => p.v >= lo && p.v < hi).length), maxC = Math.max(...counts, 1);
  const myBin = BINS[key].findIndex(([lo, hi]) => val >= lo && val < hi);
  const sorted = [...all].sort((a, b) => b.v - a.v), me = sorted.findIndex(p => p.me);
  const similar = sorted.slice(Math.max(0, me - 3), Math.max(0, me - 3) + 5);
  const unit = metric === 'bcr' ? 'BCR' : 'value';
  const fmtV = v => v == null ? "—" : metric === "bcr" ? v.toFixed(2) : fmtValue(v);

  const DECIDE = { proceed: { label: 'Proceed', description: 'The idea becomes an investment.' }, request: { label: 'Request info', description: 'Send it back to Shape with what you need.' },
    park: { label: 'Park', description: 'Revisit it after a set time.' }, stop: { label: 'Stop', description: 'Close the idea.' } };
  const header = <PageHeader title={INV.name} id={INV.code} onBack={onBack}
    status={<span className="row" style={{ gap: 'var(--space-150)' }}><Indicator type={IDEA_STATUS[status].type}>{IDEA_STATUS[status].label}</Indicator>{status === 'review' && <IFS.Counter>{reviewCount(rows)}</IFS.Counter>}</span>}
    center={reviewer ? <Stepper current={0} steps={[{ label: 'Review' }, { label: 'Refine' }, { label: 'Approve' }]} />
      : <Stepper current={ownerChain ? (status === 'refining' ? 2 : 1) : 0} steps={[{ label: 'Shape' }, { label: 'Review' }, { label: 'Refine' }, { label: 'Approve' }]} />}
    actions={reviewer ? <div className="row" style={{ gap: 'var(--space-200)' }}>
      <Button type="tertiary" size="s" iconLeft="users-group">3/5</Button>
      {myRow.status === 'success' ? <Button type="secondary" size="s" iconLeft="system-check" disabled>Proceed</Button>
        : <SplitButton size="s" onClick={() => setDecide('proceed')} menuLabel="More decisions" items={Object.entries(DECIDE).map(([k, d]) => ({ label: d.label, description: d.description, onClick: () => setDecide(k) }))}>Decide</SplitButton>}
    </div> : ownerChain ? <div className="row" style={{ gap: 'var(--space-200)' }}>
      <Button type="tertiary" size="s" iconLeft="users-group">3/5</Button>
      <Button type="secondary" size="s" onClick={() => setDismiss('')}>Dismiss</Button>
      <Button type="primary" size="s" disabled={status !== 'refining'} onClick={onOpenRefine}>Refine</Button>
    </div> : <div className="row" style={{ gap: 'var(--space-200)' }}>
      <Button type="tertiary" size="s" iconLeft="users-group">3/5</Button>
      <IconButton icon="system-comment" type="tertiary" size="s" label="Comments" onClick={() => toast({ title: 'Comments aren’t part of this flow' })} />
      <Button type="secondary" size="s" onClick={() => setDismiss('')}>Dismiss</Button>
      <Button type="primary" size="s" disabled={status === 'review'} onClick={() => onSendForReview ? onSendForReview() : toast({ title: 'Sent for review', description: 'Reviewers will be notified' })}>{status === 'review' ? 'Sent for review' : 'Send for review'}</Button>
    </div>} />;
  return (
    <AppShell navBar={navBar} header={header}
      bottom={<BottomSheet type="value" documents={{ label: '16 Documents', onClick: () => toast({ title: 'Cooper’s context: 16 documents' }) }} onUpload={() => toast({ title: 'Upload' })}
        prompts={['Find similar past ideas', 'What could block this idea?']} onPrompt={p => toast({ title: `Cooper: ${p}` })} />}>
      {ownerChain ? <div className="page">
        {status === 'shaping' && <IFS.Alert type="warning" title="Revisions required">{`${(rows.find(r => r.status === 'revisions') || {}).name || 'A reviewer'} asked for more information. Open Shape from their row, update the idea and send it for review again.`}</IFS.Alert>}
        {status === 'refining' && <IFS.Alert type="success" title="Approved by all reviewers">The idea is now an investment. Continue in Refine.</IFS.Alert>}
        <IFS.ApprovalChainPanel mode="full" title="Approval chain"><IFS.ApprovalChainTable view="full" currentUserId="HG" ownerId="HG"
          approvers={rows.map(r => r.status === 'revisions' ? { ...r, action: { label: 'Shape', icon: 'flag', onClick: () => setReview(v => ({ ...v, reopened: true })) } }
            : r.status === 'rejected' && status === 'deferred' ? { ...r, action: { label: 'Set reminder', icon: 'calendar-time', onClick: () => toast({ title: 'Reminder set', description: 'The idea comes back to your Command in 90 days' }) } } : r)}
          onChange={a => setReview(v => ({ ...v, rows: a.map(x => { const rest = { ...x }; delete rest.action; return rest; }) }))}
          onNoteChange={(a, note) => setReview(v => ({ ...v, rows: v.rows.map(x => x.id === a.id ? { ...x, note } : x) }))} /></IFS.ApprovalChainPanel>
      </div> : <div className="page-row">
        <div className="page">
          <Sec title="Idea Overview">
            <div className="col" style={{ gap: 'var(--space-150)', padding: '0 var(--space-150) var(--space-150)' }}>
              <span className="t-label-l-medium">{INV.name}</span>
              <span className="t-body-m-regular sec">{INV.description}</span>
            </div>
          </Sec>

          <div className="ifs-grid is-halves">
            <div className="page-col">
              <Sec title="The Need" cooper={askNeed}
                actions={editNeed !== null ? <Button type="secondary" size="s" iconLeft="cooper-system-icon" onClick={() => { setEditNeed(null); setAskNeed(true); }}>Edit with Cooper</Button>
                  : <IconButton icon="system-edit-rename" type="tertiary" size="s" label="Edit The Need" onClick={() => setEditNeed(need)} />}>
                {editNeed !== null ? <div className="col" style={{ gap: 'var(--space-200)', padding: '0 var(--space-150) var(--space-150)' }}>
                    <IFS.TextArea size="l" value={editNeed} onChange={e => setEditNeed(e.target ? e.target.value : e)} aria-label="The Need" />
                    <div className="row" style={{ gap: 'var(--space-200)', justifyContent: 'flex-end' }}>
                      <Button type="tertiary" size="s" onClick={() => setEditNeed(null)}>Cancel</Button>
                      <Button type="primary" size="s" onClick={() => { setNeed(editNeed.trim() || need); setEditNeed(null); toast({ title: 'The Need updated' }); }}>Save</Button>
                    </div></div>
                  : <p className="t-body-m-regular" style={{ margin: 0, padding: 'var(--space-100) var(--space-150) var(--space-150)', whiteSpace: 'pre-line' }}>{need}</p>}
              </Sec>
              <Sec title="Aligned Enterprise Goals">
                <div className="row" style={{ gap: 'var(--space-150)', flexWrap: 'wrap', padding: '0 var(--space-150) var(--space-150)' }}>
                  {ENTERPRISE_GOALS.map(g => <Badge key={g} size="s" color="white">{g}</Badge>)}
                </div>
              </Sec>
              <Sec title="Strategic Relevance">
                <div className="col" style={{ gap: 'var(--space-400)', padding: '0 var(--space-150) var(--space-150)' }}>
                  <div className="row" style={{ gap: 'var(--space-50)' }}>
                    {relevance(rec).map(([l, v], i) => v > 0 && <BarChartItem key={l} fill={`var(--data-viz-data-${[4, 5, 3, 6, 6][i]})`} style={{ flex: v }}>{v}%</BarChartItem>)}
                  </div>
                  <div className="row" style={{ gap: 'var(--space-400)', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {[['Reliability', 4], ['Financial', 5], ['Environment', 3], ['Social', 6], ['Governance', 6]].map(([l, c]) => <InfoHintItem key={l} label={l} color={`var(--data-viz-data-${c})`} />)}
                  </div>
                </div>
              </Sec>
            </div>
            <Sec title="Affected Assets & area" style={{ height: '100%' }}>
              <NDS label="3D map (MapLibre)" style={{ height: 'var(--proto-map-h)', borderRadius: 'var(--radius-radius-200)', overflow: 'hidden' }}>
                {main || myAssets.length ? <MapView labels={false} lenses={lenses} year={END} interactive={false} focus={main ? overRows.map(r => r.a.id) : myAssets.map(a => a.id)} />
                  : <EmptyState cause="empty-container" size="section" heading="No assets linked" body="The demo data links no assets to this idea, so there is nothing to map yet." />}
                <div style={{ position: 'absolute', right: 'var(--space-200)', top: 'var(--space-200)', zIndex: 'var(--proto-z-raised)' }}><IconButton icon="map" type="tertiary" size="s" label="Open in Explore" onClick={onBack} /></div>
              </NDS>
            </Sec>
          </div>

          <Sec title="Recommended Alternative">
            <div className="col" style={{ gap: 'var(--space-300)' }}>
              <ContentCard title={rec.name} description={rec.desc}
                bottom={<div style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-250)' }}>
                  <StatCard size="s" title="BCR" value={String(rec.bcr ?? "—")} /><StatCard size="s" title="Cost range" value={rec.cost} />
                  <StatCard size="s" title="Timing" value={rec.time} /><StatCard size="s" title="Potential value" value={rec.valueLabel} description="value score" />
                </div>} />
              <div>
                <SubHead>Other options</SubHead>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-300)' }}>
                  {others.map(o => <ContentCard key={o.name} title={o.name} onClick={() => toast({ title: o.name, description: `BCR ${o.bcr} · ${o.cost} · ${o.time} · value ${o.valueLabel}` })}
                    bottom={<div className="row" style={{ gap: 'var(--space-150)', alignItems: 'baseline' }}><span className="t-heading-h1-medium">{o.cost}</span><span className="t-body-s-regular sec">{o.time}</span></div>} />)}
                </div>
              </div>
            </div>
          </Sec>

          <Sec title="Compare to Other Investments" extra={<Select size="s" options={['Portfolio level', 'Region level', 'Asset class']} defaultValue="Portfolio level" clearable={false} onChange={v => toast({ title: `${v}`, description: 'Comparison scope is illustrative' })} />}>
            <div className="col" style={{ gap: 'var(--space-400)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
                {[['Rate', <><span className="t-heading-h2-medium">#{rank}</span> <span className="t-body-s-regular sec">of {all.length} investments</span></>], ['Percentile', `${pct}th`], ['Standing', standing], ['Alternative', rec.name]].map(([l, v], i) => (
                  <div key={l} className="col" style={{ gap: 'var(--space-100)', padding: 'var(--space-100) var(--space-500)', borderLeft: i ? 'var(--border-widths-border-100) solid var(--border-base)' : 'none' }}>
                    <span className="t-body-s-regular sec">{l}</span><span className="t-heading-h2-medium">{v}</span>
                  </div>))}
              </div>
              <DataVizCard title="Investment position" header={{ segments: [{ value: 'bcr', label: 'Value vs Cost' }, { value: 'eff', label: 'Efficiency' }], segmentValue: metric, onSegmentChange: setMetric }} onCooper={() => toast({ title: 'Cooper: Investment position' })}>
                <NDS label="Histogram (VerticalBarChartItem + axes)" className="col" style={{ gap: 'var(--space-200)', padding: 'var(--space-200) var(--space-300)' }}>
                  <div className="row" style={{ alignItems: 'flex-end', gap: 'var(--space-150)', height: 'var(--proto-bars-h)' }}>
                    {counts.map((c, i) => (
                      <div key={i} style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                        <VerticalBarChartItem width="100%" height={180} max={maxC} value={Math.max(c, 0.15)} segments={[{ value: 1, fill: i === myBin ? 'var(--data-viz-muted-purple-data-5)' : 'var(--background-elevation-1-tertiary)' }]} style={{ width: '100%' }} />
                      </div>))}
                  </div>
                  <div className="row" style={{ gap: 'var(--space-150)' }}>{BINS[key].map(b => <span key={b[2]} className="t-body-s-regular sec" style={{ flex: 1, textAlign: 'center' }}>{b[2]}</span>)}</div>
                  <span className="t-body-s-regular sec" style={{ textAlign: 'center' }}>{metric === 'bcr' ? 'Value / Benefit (BCR)' : 'Value score'}</span>
                </NDS>
              </DataVizCard>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-600)' }}>
                <div>
                  <SubHead>Why this investment matters</SubHead>
                  {!main ? <p className="t-body-m-regular" style={{ margin: 0 }}>{`${rec.name} costs ${rec.cost} over ${rec.time} for a value score of ${rec.valueLabel}. At a BCR of ${rec.bcr ?? '—'} it ranks #${rank} of ${all.length} Whistler investments, in the ${standing.toLowerCase()}.`}</p> :
                  <p className="t-body-m-regular" style={{ margin: 0 }}>This program replaces the oldest distribution equipment in Alpine Meadows, protecting ~{CLUSTER.customers.toLocaleString()} customers from outages. Acting before the next tolerance crossing in {s.first ?? '—'} reduces the cluster’s value at stake (${s.now.valueM}M by {END}) and lowers safety and environmental risk. At a BCR of {rec.bcr} it ranks #{rank} of {all.length} Whistler investments, in the {standing.toLowerCase()}.</p>}
                </div>
                <div style={{ borderLeft: 'var(--border-widths-border-100) solid var(--border-base)', paddingLeft: 'var(--space-300)' }}>
                  <SubHead>Similar investments by {metric === 'bcr' ? 'BCR' : 'value'}</SubHead>
                  <NDS label="List rows" className="col" style={{ gap: 'var(--space-100)' }}>
                    {similar.map(p => (
                      <div key={p.name} className="row box" style={{ justifyContent: 'space-between', padding: 'var(--space-400) var(--space-300)', background: p.me ? 'var(--background-elevation-1-tertiary)' : undefined }}>
                        <span className="t-body-m-regular">{p.name}</span><span className="t-body-m-regular">{fmtV(p.v)} {unit}</span>
                      </div>))}
                  </NDS>
                </div>
              </div>
            </div>
          </Sec>
        </div>
        <div className="page-dock" style={{ height: 'calc(100vh - var(--proto-sticky-offset))' }}>
          {reviewer ? (() => { const ev = readinessEvaluation(rows.filter(r => r.note && r.note.text).map(r => ({ name: r.name, text: r.note.text })));
            return <Panel title="Readiness evaluation" collapsible={false} style={{ height: '100%', width: 'var(--region-panel)' }}>
              <IFS.ReadinessEvaluation summary={ev.summary} defaultOpenSections={['notes']} sections={ev.sections.map(x => ({ id: x.id, title: x.title, badge: x.badge, count: x.count,
                content: x.rows ? <IFS.ReadinessFacts rows={x.rows} /> : <div className="col" style={{ gap: 'var(--space-200)' }}>{x.notes.length ? x.notes.map((n, k) => <div key={k} className="col rf-note" style={{ gap: 'var(--space-50)' }}><span className="t-label-m-medium">{n.name}</span><span className="t-body-m-regular sec">{`“${n.text}”`}</span></div>)
                  : <span className="t-body-m-regular muted">No notes from the owner.</span>}</div> }))} />
            </Panel>; })() :
          <Panel title="System confidence" expanded={panel} onExpandedChange={setPanel} dot={c.dot || undefined} onEvidence={() => toast({ title: 'Evidence chain' })}
            className={panel ? 'ifs-trc-panel' : undefined} style={{ height: '100%' }}>
            <ContentCard className="ifs-trc-card" title={<IFS.ConfidenceGates controller={c} label="Review readiness" />}
              bottom={<div className={`ifs-trc-card__issues ${c.present.length > 1 ? 'has-kinds' : ''}`}>
                {c.present.length > 1 && <div className="ifs-trc-card__kinds"><IFS.IssueKindSwitch controller={c} /></div>}
                <IFS.IssueNavigator controller={c} />
              </div>} />
          </Panel>}
        </div>
      </div>}
      <Modal open={decide !== null} onOpenChange={o => !o && setDecide(null)} title={decide === 'proceed' ? 'Proceed to Investment' : decide ? DECIDE[decide].label : ''}
        secondaryAction={{ label: 'Cancel', onClick: () => setDecide(null) }}
        primaryAction={{ label: decide === 'proceed' ? 'Approve investment' : decide ? DECIDE[decide].label : '', disabled: decide && decide !== 'proceed' && !decideNote.trim(),
          onClick: () => { const k = decide, n = decideNote.trim(); setDecide(null); setDecideNote(''); onDecide && onDecide(k, n); } }}>
        <div className="col" style={{ gap: 'var(--space-stack)' }}>
          <span className="t-body-m-regular sec">{decide === 'proceed' ? 'This idea will leave Shape and become an investment. Its context, history, and approvals stay attached.'
            : decide === 'request' ? 'The idea goes back to Shape. Say what the owner needs to add.' : decide === 'park' ? 'The idea is deferred. Say why and when to revisit it.' : 'The idea is closed. Say why.'}</span>
          <IFS.TextArea size="l" label={decide === 'proceed' ? 'Note' : 'Comment'} placeholder={decide === 'proceed' ? 'Add a short approval note for the investment record.' : 'Required'} value={decideNote} onChange={e => setDecideNote(e.target ? e.target.value : e)} />
        </div>
      </Modal>
      <Modal open={dismiss !== null} onOpenChange={o => !o && setDismiss(null)} title="Dismiss Idea"
        secondaryAction={{ label: 'Cancel', onClick: () => setDismiss(null) }}
        primaryAction={{ label: 'Dismiss idea', onClick: () => { const n = dismiss; setDismiss(null); onDismiss ? onDismiss(n) : toast({ title: 'The idea has been stopped.' }); } }}>
        <div className="col" style={{ gap: 'var(--space-stack)' }}>
          <span className="t-body-m-regular sec">Close this idea. No further work or approval is needed.</span>
          <IFS.TextArea size="l" label="Note" placeholder="Add a note explaining why this idea should not move forward." value={dismiss || ''} onChange={e => setDismiss(e.target ? e.target.value : e)} />
        </div>
      </Modal>
      {askNeed && <div className="build-askbar">
        {cooperSaid && <AgentWindow text={cooperSaid} onClose={() => { setCooperSaid(null); setAskNeed(false); }} onAsk={() => setCooperSaid(null)} />}
        {!cooperSaid && <IFS.ChatCollapsedBar type="text" autoFocus value={askText} onChange={v => setAskText(v && v.target ? v.target.value : v)} placeholder="What do you want to change?"
          onSend={() => { const t = (askText || '').trim() || 'Make it more specific'; setAskText('');
            setNeed(n => n.includes('Cooper’s recommended response') ? n : `${n}\n\nCooper’s recommended response: ${rec.name}, ${rec.cost} over ${rec.time}, which brings the at-risk units back within tolerance.`);
            setCooperSaid(`Done — I updated The Need (“${t}”). I added the recommended response and its cost, so reviewers see the ask and the answer together.`); }} />}
      </div>}
    </AppShell>
  );
}
