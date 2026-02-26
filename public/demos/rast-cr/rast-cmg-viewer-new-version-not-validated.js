const el = (id) => document.getElementById(id);
    const setStatus = (msg) => { el('status').textContent = msg; };

    // -------- Sample CMG (small) --------
    const sampleCmg = {
      cmg_id: "uuid-patient-8842",
      version: "1.4",
      timestamp: "2025-10-27T10:00:00Z",
      provenance: {
        session_id: "sess-05",
        sensor_suite: ["IMU_x6", "HR_Polar", "ForcePlate"],
        ioc_confidence_score: 0.85,
      },
      layer_1_structural: {
        model_type: "opensim_compatible",
        model_ref: "uri/to/patient_scaled_model.osim",
        constraints: {
          hard_rom_limits: {
            shoulder_flexion_left: { max: 90, unit: "deg" },
            knee_extension_right: { max: 0, unit: "deg" },
          },
        },
      },
      layer_3_metabolic_uthpc: {
        baseline_envelope: {
          vo2_max_estimate: 28.5,
          hr_rest: 65,
          hr_max_safe: 140,
          recovery_slope_threshold: 12,
        },
        dynamic_state: {
          current_hr_zone: "stable_zone",
          fatigue_index: 0.4,
          perceived_exertion_scale: "Borg_CR10",
        },
        motor_modulation: {
          description: "Function f(M(t)) mapping fatigue to motor limits",
          fatigue_impact_on_stability: "high",
        },
      },
      layer_4_intent_optimization: {
        description: "Inferred Cost Function Weights",
        weights: [
          {
            term: "w_effort",
            value: 0.8,
            variance: 0.05,
            classification: "trait",
            transferability: "high",
            description: "Stable preference for energy conservation",
          },
          {
            term: "w_smoothness",
            value: 0.72,
            variance: 0.03,
            classification: "trait",
            transferability: "high",
            description: "Jerk minimization preference (Kinematic Invariant)",
          },
          {
            term: "w_stability",
            value: 0.95,
            variance: 0.2,
            classification: "state",
            transferability: "low",
            context_dependency: ["surface_friction", "fatigue"],
            description: "High fear of falling, varies with context",
          },
          {
            term: "w_speed",
            value: 0.3,
            variance: 0.15,
            classification: "state",
            transferability: "low",
            description: "Task-dependent urgency",
          },
        ],
      },
      layer_5_action_bank: {
        primitives: [
          {
            id: "sit_to_stand",
            type: "ProMP",
            parameters: "uri/to/weights.npy",
            feasibility_check: "metabolic_feasible AND motor_feasible",
          },
        ],
      },
    };

    // -------- Semantic categories & edge types --------
    const categories = [
      { id: "identity", label: "Identity", color: "var(--cardiac)" },
      { id: "provenance", label: "Provenance", color: "var(--accent2)" },

      { id: "structural", label: "Structural", color: "rgba(15,23,42,.80)" },
      { id: "constraint", label: "Constraints", color: "var(--bad)" },

      { id: "metabolic", label: "Metabolic", color: "var(--warn)" },
      { id: "task", label: "Task & Workload", color: "#0ea5e9" },
      { id: "capability", label: "Motor Capability", color: "#64748b" },
      { id: "psychology", label: "PE & Psychology", color: "#9333ea" },

      { id: "intent", label: "Intent / Objective", color: "var(--accent)" },
      { id: "phase", label: "Phase Graph", color: "#334155" },
      { id: "longitudinal", label: "Longitudinal", color: "#16a34a" },

      { id: "action", label: "Action Bank", color: "var(--ok)" }
    ];

    const edgeTypes = [
      { id: "HAS", label: "HAS", stroke: "rgba(15,23,42,0.30)", dash: "" },
      { id: "USES", label: "USES", stroke: "rgba(124,58,237,0.70)", dash: "6,4" },
      { id: "CONSTRAINED_BY", label: "CONSTRAINED_BY", stroke: "rgba(190,18,60,0.70)", dash: "2,4" },
      { id: "PARAMETERIZES", label: "PARAMETERIZES", stroke: "rgba(37,99,235,0.70)", dash: "" },
      { id: "MODULATES", label: "MODULATES", stroke: "rgba(180,83,9,0.85)", dash: "10,4" },
      { id: "DEPENDS_ON", label: "DEPENDS_ON", stroke: "rgba(15,23,42,0.22)", dash: "2,2" },
      { id: "SUPPORTS_INFERENCE", label: "SUPPORTS_INFERENCE", stroke: "rgba(5,150,105,0.85)", dash: "" },
    ];

    let enabledGroups = new Set(categories.map((c) => c.id));
    let enabledEdgeTypes = new Set(edgeTypes.map((t) => t.id));
    let searchQuery = "";
    // Level of Detail (LOD): 1=overview, 2=layers, 3=full recursive expansion
    // let lodLevel = Number(e.target.value || 2); // 2;
    let lodLevel = 2;
    let lastCmg = null;
    let selectedId = null;
    let current = { nodes: [], links: [] };

    const color = (group) => {
      const c = categories.find((x) => x.id === group);
      return c ? c.color : "var(--accent)";
    };
    const edgeStyle = (type) => {
      const t = edgeTypes.find((x) => x.id === type);
      return t || { stroke: "rgba(15,23,42,0.25)", dash: "" };
    };

    const escapeHtml = (s) =>
      String(s)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");

    function formatPayloadHtml(payload){
      const esc = (s) => escapeHtml(String(s ?? "—"));
      const toShort = (v) => {
        if (v == null) return "—";
        const t = typeof v;
        if (t === "string") return v.length > 120 ? v.slice(0,117) + "…" : v;
        if (t === "number" || t === "boolean") return String(v);
        if (Array.isArray(v)) {
          const head = v.slice(0, 3).map(toShort).join(", ");
          return `[${v.length}] ${head}${v.length > 3 ? ", …" : ""}`;
        }
        if (t === "object") {
          const keys = Object.keys(v);
          return `{${keys.length} keys}`;
        }
        return String(v);
      };

      if (payload == null) {
        return `<div class="kv"><div class="kvRow"><div class="kvKey">payload</div><div class="kvVal">—</div></div></div>`;
      }

      const obj = (typeof payload === "object" && !Array.isArray(payload)) ? payload : { value: payload };
      const keys = Object.keys(obj);
      const limit = Math.min(keys.length, 14);
      const rows = [];
      for (let i=0; i<limit; i++){
        const k = keys[i];
        rows.push(`<div class="kvRow"><div class="kvKey">${esc(k)}</div><div class="kvVal">${esc(toShort(obj[k]))}</div></div>`);
      }
      if (keys.length > limit){
        rows.push(`<div class="kvRow"><div class="kvKey">more</div><div class="kvVal">+${keys.length - limit} fields</div></div>`);
      }
      return `<div class="kv">${rows.join("")}</div>`;
    }
    // ===== Legend Icons (safe, no hard-coded CMG fields) =====
    function iconSvg(kind, size=16){
        // small, single-color, inline SVGs (use currentColor)
        const svg = (path) => `
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
            ${path}
            </svg>`;

        switch((kind || "").toLowerCase()){
            case "identity":
            case "person":
            return svg(`<circle cx="12" cy="8" r="3" fill="currentColor"></circle>
                        <path d="M5 20c1.5-4 12.5-4 14 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`);

            case "kinematics":
            case "motion":
            return svg(`<path d="M4 16c3-6 6-6 9 0s6 6 7-2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`);

            case "kinetics":
            case "forces":
            return svg(`<path d="M4 14h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <path d="M12 10l4 4-4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`);

            case "metabolic":
            case "physiology":
            return svg(`<path d="M12 21s-7-4.5-7-11a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 6.5-7 11-7 11z"
                            fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`);

            case "constraints":
            case "safety":
            return svg(`<path d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z"
                            fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`);

            case "intent":
            case "optimization":
            return svg(`<path d="M12 2v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <path d="M20 12h-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <path d="M12 22v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <path d="M4 12h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/>`);

            case "measurements":
            case "sensors":
            return svg(`<rect x="6" y="3" width="12" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>
                        <path d="M9 8h6M9 12h6M9 16h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`);

            case "session":
            case "provenance":
              return svg(`<path d="M7 2v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2Z" fill="none" stroke="currentColor" stroke-width="2"/>
                          <path d="M5 10h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`);

            case "structural":
              return svg(`<path d="M4 8h8v4H4zM12 8h8v4h-8zM4 12h8v4H4zM12 12h8v4h-8z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`);

            case "task":
            case "workload":
              return svg(`<path d="M8.5 3c2.2 0 4 1.8 4 4v3h-4c-2.2 0-4-1.8-4-4V3Zm7 11c2.2 0 4 1.8 4 4v3h-4c-2.2 0-4-1.8-4-4v-3Zm-7 0h4v3c0 2.2-1.8 4-4 4h-4v-3c0-2.2 1.8-4 4-4Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`);

            case "constraint":
            case "constraints":
              return svg(`<path d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`);

            case "capability":
            case "motor":
              return svg(`<path d="M7 10V8h2V6h2v12H9v-2H7v-2H5v-4Zm10 0h2v4h-2v2h-2v2h-2V6h2v2h2Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`);

            case "psychology":
            case "pe":
              return svg(`<path d="M9 4c-2.2 0-4 1.8-4 4v1c0 1 .4 2 1.2 2.7C5.4 12.4 5 13.4 5 14.5 5 16.4 6.6 18 8.5 18H9v2h6v-2h.5c1.9 0 3.5-1.6 3.5-3.5 0-1.1-.4-2.1-1.2-2.8.8-.7 1.2-1.7 1.2-2.7V8c0-2.2-1.8-4-4-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`);

            case "phase":
              return svg(`<path d="M4 18V6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                          <path d="M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                          <path d="M6 14l4-4 3 3 5-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`);

            case "longitudinal":
            case "tttc":
            case "trend":
              return svg(`<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2"/>
                          <path d="M12 7v5l3 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`);

            case "action":
            case "action bank":
              return svg(`<path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`);

            default:
            // generic node icon
            return svg(`<circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" stroke-width="2"/>`);
        }
    }

    function renderLegend(){
      // Render compact legend into the sidebar (HTML), not into the SVG graph.
      const root = d3.select('#legend');
      if (root.empty()) return;
      root.html('');

      const items = [
        { key:'Person',        kind:'person',     color: color('identity'),   desc:'patient + baseline' },
        { key:'Session',       kind:'session',    color: color('provenance'), desc:'time context' },
        { key:'Sensor Suite',  kind:'sensors',    color: color('provenance'), desc:'sources + quality' },
        { key:'Metabolic',     kind:'metabolic',  color: color('metabolic'),  desc:'HR/RPE/METS state' },
        { key:'Task/Workload', kind:'task',       color: color('task'),       desc:'dose + protocol' },
        { key:'Constraints',   kind:'constraint', color: color('constraint'), desc:'limits + safety cage' },
        { key:'Intent/Cost',   kind:'intent',     color: color('intent'),     desc:'objective + trade-offs' }
      ];

      const row = root.selectAll('div.legend-item')
        .data(items)
        .join('div')
        .attr('class','legend-item');

      row.append('span')
        .attr('class','legendIcon')
        .style('color', d => d.color)
        .html(d => iconSvg(d.kind, 16));

      const text = row.append('div')
        .style('display','grid')
        .style('gap','2px');

      text.append('div')
        .style('font-weight','800')
        .style('font-size','12px')
        .text(d => d.key);

      text.append('div')
        .attr('class','micro')
        .style('margin','0')
        .text(d => d.desc);
    }

    const renderToggles = () => {
      // Node groups
      const gRoot = d3.select('#groupToggles');
      gRoot.html('');
      const g = gRoot
        .selectAll('div')
        .data(categories)
        .join('div')
        .attr('class', 'toggleRow');

      g.append('input')
        .attr('type', 'checkbox')
        .attr('id', (d) => `grp-${d.id}`)
        .property('checked', (d) => enabledGroups.has(d.id))
        .on('change', (event, d) => {
          if (event.target.checked) enabledGroups.add(d.id);
          else enabledGroups.delete(d.id);
          if (lastCmg) renderCmgGraph(lastCmg);
        });

      g.append('span')
        .attr('class', 'legendIcon')
        .style('color', (d) => d.color)
        .html((d) => iconSvg(d.id));

      g.append('label')
        .attr('for', (d) => `grp-${d.id}`)
        .text((d) => d.label);

      // Edge types
      const eRoot = d3.select('#edgeToggles');
      eRoot.html('');
      const e = eRoot
        .selectAll('div')
        .data(edgeTypes)
        .join('div')
        .attr('class', 'toggleRow');

      e.append('input')
        .attr('type', 'checkbox')
        .attr('id', (d) => `edge-${d.id}`)
        .property('checked', (d) => enabledEdgeTypes.has(d.id))
        .on('change', (event, d) => {
          if (event.target.checked) enabledEdgeTypes.add(d.id);
          else enabledEdgeTypes.delete(d.id);
          if (lastCmg) renderCmgGraph(lastCmg);
        });

      e.append('span')
        .attr('class', 'rule')
        .style('border-top-color', (d) => d.stroke)
        .style('border-top-style', 'solid')
        .style('border-top-width', '3px')
        .style('border-top-left-radius', '999px')
        .style('border-top-right-radius', '999px')
        .style('border-top-width', '3px')
        .style('border-top', (d) => `3px solid ${d.stroke}`)
        .style('border-top-style', 'solid')
        .style('border-top-width', '3px')
        .style('border-top', (d) => `3px solid ${d.stroke}`)
        .style('border-top-style', 'solid')
        .style('border-top-width', '3px');

      e.append('label')
        .attr('for', (d) => `edge-${d.id}`)
        .text((d) => d.label);
    };

    const filterGraph = (graph) => {
      let links = graph.links.filter((l) => enabledEdgeTypes.has(l.type));
      let nodes = graph.nodes.filter((n) => enabledGroups.has(n.group));
      const allowed = new Set(nodes.map((n) => n.id));
      links = links.filter((l) => allowed.has(l.source) && allowed.has(l.target));

      if (searchQuery) {
        const match = new Set(
          nodes
            .filter((n) => {
              const labelHit = (n.label || '').toLowerCase().includes(searchQuery);
              const payloadHit = JSON.stringify(n.payload || {}).toLowerCase().includes(searchQuery);
              return labelHit || payloadHit;
            })
            .map((n) => n.id)
        );

        const keep = new Set(match);
        links.forEach((l) => {
          if (match.has(l.source)) keep.add(l.target);
          if (match.has(l.target)) keep.add(l.source);
        });
        nodes = nodes.filter((n) => keep.has(n.id));
        const allowed2 = new Set(nodes.map((n) => n.id));
        links = links.filter((l) => allowed2.has(l.source) && allowed2.has(l.target));
      }

      return { nodes, links };
    };

    // -------- Build semantic graph from CMG JSON --------
    // -------- Build semantic graph from CMG JSON (LOD-controlled; no hard-coded layer fields) --------
    const buildSemanticGraph = (cmg) => {
      const nodes = [];
      const links = [];
      const nodeIndex = new Map();

      const limitsByLod = {
        LOD1: { MAX_NODES: 250,  MAX_DEPTH: 3,  MAX_ARRAY_ITEMS: 6  },
        LOD2: { MAX_NODES: 700,  MAX_DEPTH: 6,  MAX_ARRAY_ITEMS: 20 },
        LOD3: { MAX_NODES: 2500, MAX_DEPTH: 10, MAX_ARRAY_ITEMS: 120 }
      };

      const L = limitsByLod[lod] || limitsByLod.LOD2;
      const MAX_NODES = L.MAX_NODES;
      const MAX_DEPTH = L.MAX_DEPTH;
      const MAX_ARRAY_ITEMS = L.MAX_ARRAY_ITEMS;

      const addNode = (id, label, group, payload) => {
        if (nodes.length >= MAX_NODES) return;
        if (!nodeIndex.has(id)) {
          nodeIndex.set(id, nodes.length);
          nodes.push({ id, label, group, payload });
        }
      };
      const addLink = (source, target, type) => {
        if (links.length >= MAX_NODES * 2) return;
        links.push({ source, target, type });
      };

      const pretty = (k) => String(k)
        .replace(/^layer_\d+_?/i, "layer_")
        .replace(/^layer_/i, "")
        .replaceAll("_", " ")
        .trim();

      const inferGroupFromKey = (k) => {
        const s = String(k || "").toLowerCase();
        if (s.includes("constraint") || s.includes("limit") || s.includes("rom")) return "constraint";
        if (s.includes("metabolic") || s.includes("uthpc") || s.includes("vo2") || s.includes("hr") || s.includes("bp") || s.includes("spo2")) return "metabolic";
        if (s.includes("task") || s.includes("workload") || s.includes("protocol") || s.includes("treadmill") || s.includes("bike") || s.includes("modality")) return "task";
        if (s.includes("capability") || s.includes("kinematic") || s.includes("kinetic") || s.includes("motor") || s.includes("feasible")) return "capability";
        if (s.includes("psych") || s.includes("perceived") || s.includes("rpe") || s.includes("dyspnea") || s.includes("angina")) return "psychology";
        if (s.includes("intent") || s.includes("objective") || s.includes("optimization") || s.includes("cost") || s.includes("weight")) return "intent";
        if (s.includes("phase") || s.includes("graph") || s.includes("transition")) return "phase";
        if (s.includes("longitudinal") || s.includes("tttc") || s.includes("forecast") || s.includes("trend")) return "longitudinal";
        if (s.includes("action") || s.includes("primitive") || s.includes("bank")) return "action";
        if (s.includes("provenance") || s.includes("session") || s.includes("sensor") || s.includes("calibration")) return "provenance";
        return "structural";
      };

      const typeOf = (v) => {
        if (v === null) return "null";
        if (Array.isArray(v)) return "array";
        return typeof v;
      };

      // Recursive expansion for LOD3
      const expand = (parentId, key, value, depth) => {
        if (nodes.length >= MAX_NODES) return;
        if (depth > MAX_DEPTH) return;

        const t = typeOf(value);
        const id = `${parentId}/${key}`;

        if (t === "object") {
          addNode(id, pretty(key), inferGroupFromKey(key), value);
          addLink(parentId, id, "HAS");
          Object.keys(value).forEach((k2) => expand(id, k2, value[k2], depth + 1));
          return;
        }

        if (t === "array") {
          addNode(id, `${pretty(key)} [${value.length}]`, inferGroupFromKey(key), { count: value.length });
          addLink(parentId, id, "HAS");
          const n = Math.min(value.length, MAX_ARRAY_ITEMS);
          for (let i = 0; i < n; i++) {
            const item = value[i];
            const itemKey = `#${i}`;
            const itemType = typeOf(item);
            if (itemType === "object" || itemType === "array") {
              expand(id, itemKey, item, depth + 1);
            } else {
              const leafId = `${id}/${itemKey}`;
              addNode(leafId, `${itemKey}: ${String(item)}`, inferGroupFromKey(key), { value: item });
              addLink(id, leafId, "HAS");
            }
          }
          if (value.length > n) {
            const moreId = `${id}/more`;
            addNode(moreId, `… +${value.length - n} more`, inferGroupFromKey(key), { omitted: value.length - n });
            addLink(id, moreId, "HAS");
          }
          return;
        }

        // Primitive leaf
        addNode(id, `${pretty(key)}`, inferGroupFromKey(key), { value });
        addLink(parentId, id, "HAS");
      };

      // --- Core canonical nodes (always present) ---
      addNode("cmg", "CMG", "identity", { cmg_id: cmg?.cmg_id, version: cmg?.version, timestamp: cmg?.timestamp });
      addNode("person", "Person", "identity", { person_id: cmg?.cmg_id });
      addLink("person", "cmg", "HAS");

      // Provenance/session (canonical; content remains generic)
      if (cmg?.provenance) {
        addNode("provenance", "Provenance", "provenance", cmg.provenance);
        addLink("cmg", "provenance", "HAS");

        // Convenience surfacing if those fields exist (still data-driven)
        if (cmg.provenance.session_id || cmg.provenance.ioc_confidence_score != null) {
          addNode("session", "Session", "provenance", {
            session_id: cmg.provenance.session_id,
            ioc_confidence_score: cmg.provenance.ioc_confidence_score
          });
          addLink("provenance", "session", "HAS");
        }
        if (Array.isArray(cmg.provenance.sensor_suite)) {
          addNode("sensors", "Sensor Suite", "provenance", { sensors: cmg.provenance.sensor_suite });
          addLink("provenance", "sensors", "USES");
        }

        if (lodLevel === 3) {
          Object.keys(cmg.provenance).forEach((k) => {
            if (k === "sensor_suite") return; // already surfaced as convenience node
            expand("provenance", k, cmg.provenance[k], 1);
          });
        }
      }

      // LOD1: only canonical overview nodes
      if (lodLevel === 1) return { nodes, links };

      // LOD2+: one node per top-level key (no hard-coded layer list)
      const topLevelKeys = Object.keys(cmg || {});
      const skipTop = new Set(["cmg_id", "version", "timestamp", "provenance"]);

      topLevelKeys.forEach((k) => {
        if (skipTop.has(k)) return;

        const id = `top:${k}`;
        addNode(id, pretty(k) || k, inferGroupFromKey(k), cmg[k]);
        addLink("cmg", id, "HAS");

        if (lodLevel === 3) {
          const v = cmg[k];
          const t = typeOf(v);
          if (t === "object") {
            Object.keys(v).forEach((k2) => expand(id, k2, v[k2], 1));
          } else if (t === "array") {
            expand("cmg", k, v, 1);
          }
        }
      });

      return { nodes, links };
    };
    // -------- Rendering --------
    const clearSvg = () => d3.select('#graph').selectAll('*').remove();

    const renderMetadata = (cmg) => {
      el('metadata').innerHTML =
        `<div><strong>CMG ID</strong>: ${escapeHtml(cmg.cmg_id || '—')}</div>` +
        `<div><strong>Version</strong>: ${escapeHtml(cmg.version || '—')}</div>` +
        `<div><strong>Timestamp</strong>: ${escapeHtml(cmg.timestamp || '—')}</div>` +
        `<div style="margin-top:6px;"><strong>Session</strong>: ${escapeHtml(cmg.provenance?.session_id || '—')}</div>` +
        `<div><strong>IOC confidence</strong>: ${escapeHtml(cmg.provenance?.ioc_confidence_score ?? '—')}</div>`;
    };

    const renderSelectionInline = (html) => {
      el('selectionInline').innerHTML = `<div class="selCard">${html}</div>`;
    };

    const renderCmgGraph = (cmg) => {
      lastCmg = cmg;
      setStatus('Rendering…');

      clearSvg();
      renderLegend();
      renderToggles();
      renderMetadata(cmg);
      selectedId = null;
      renderSelectionInline('None (click a node or edge)');

      const full = buildSemanticGraph(cmg);
      current = filterGraph(full);
      const nodes = current.nodes;
      const links = current.links;

      el('statsPill').innerHTML = `<strong>${nodes.length}</strong> nodes • <strong>${links.length}</strong> edges`;

      const svg = d3.select('#graph');
      const tooltip = d3.select('#tooltip');

      const g = svg.append('g').attr('class', 'zoomLayer');
      const linkLayer = g.append('g');
      const nodeLayer = g.append('g');

      // Zoom & pan
      svg.call(
        d3.zoom()
          .scaleExtent([0.25, 2.5])
          .on('zoom', (event) => {
            g.attr('transform', event.transform);
          })
      );

      const simulation = d3
        .forceSimulation(nodes)
        .force('link', d3.forceLink(links).id((d) => d.id).distance(120).strength(0.85))
        .force('charge', d3.forceManyBody().strength(-560))
        .force('center', d3.forceCenter(450, 300))
        .force('collision', d3.forceCollide().radius(46));

      const link = linkLayer
        .attr('stroke-width', 1.6)
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('stroke', (d) => edgeStyle(d.type).stroke)
        .attr('stroke-dasharray', (d) => edgeStyle(d.type).dash)
        .attr('opacity', 0.95)
        .on('mouseenter', (event, d) => {
          const s = typeof d.source === 'object' ? d.source.label : d.source;
          const t = typeof d.target === 'object' ? d.target.label : d.target;
          tooltip
            .style('opacity', 1)
            .style('left', `${event.pageX + 12}px`)
            .style('top', `${event.pageY - 12}px`)
            .html(`<strong>${d.type}</strong><br/>${escapeHtml(s)} → ${escapeHtml(t)}`);
        })
        .on('mouseleave', () => tooltip.style('opacity', 0))
        .on('click', (event, d) => {
          event.stopPropagation();
          const sId = typeof d.source === 'object' ? d.source.id : d.source;
          const tId = typeof d.target === 'object' ? d.target.id : d.target;
          const sLabel = typeof d.source === 'object' ? d.source.label : String(d.source);
          const tLabel = typeof d.target === 'object' ? d.target.label : String(d.target);
          renderSelectionInline(
            `<div class="selTitle">${escapeHtml(d.type || 'edge')}: ${escapeHtml(sLabel)} → ${escapeHtml(tLabel)}</div>` +
            `${formatPayloadHtml({ source: sId, target: tId, type: d.type })}`
          );
        });
const node = nodeLayer
        .selectAll('g')
        .data(nodes)
        .join('g')
        .style('cursor', 'pointer')
        .call(
          d3.drag()
            .on('start', (event, d) => {
              if (!event.active) simulation.alphaTarget(0.3).restart();
              d.fx = d.x;
              d.fy = d.y;
            })
            .on('drag', (event, d) => {
              d.fx = event.x;
              d.fy = event.y;
            })
            .on('end', (event, d) => {
              if (!event.active) simulation.alphaTarget(0);
              d.fx = null;
              d.fy = null;
            })
        );

      // Faint badge behind the icon (keeps group color semantics without overpowering)
      node.append('circle')
        .attr('class','nodeBadge')
        .attr('r', (d) => (d.group === 'identity' ? 22 : 14))
        .attr('fill', (d) => color(d.group))
        .attr('fill-opacity', 0.14)
        .attr('stroke', (d) => color(d.group))
        .attr('stroke-opacity', 0.55)
        .attr('stroke-width', 2.2);

      // Icon glyph (same icon-set as the legend; rendered as inline SVG)
      node.append('g')
        .attr('class','nodeGlyph')
        .style('color', (d) => color(d.group))
        .attr('pointer-events','none')
        .attr('transform', (d) => {
          const r = nodeRadius(d);
          const s = Math.max(0.95, Math.min(1.55, (r * 0.78) / 12));
          return `translate(${-(12*s)},${-(12*s)}) scale(${s})`;
        })
        .html((d) => iconSvg(iconKindForGroup(d.group, d), 24));

      node.append('text')
        .text((d) => d.label)
        .attr('x', d => nodeRadius(d) + 10)
        .attr('y', 4)
        .attr('font-size', '12px')
        .attr('font-weight', (d) => (d.group === 'identity' ? 800 : 600))
        .attr('fill', 'var(--text)');

      const neighbors = () => {
        const s = new Set();
        if (!selectedId) return s;
        links.forEach((l) => {
          const a = typeof l.source === 'object' ? l.source.id : l.source;
          const b = typeof l.target === 'object' ? l.target.id : l.target;
          if (a === selectedId) s.add(b);
          if (b === selectedId) s.add(a);
        });
        return s;
      };

      const applyHighlight = () => {
        const n = neighbors();
        node.selectAll('circle').attr('opacity', (d) => {
          if (!selectedId) return 0.96;
          return d.id === selectedId || n.has(d.id) ? 0.98 : 0.18;
        });
        link.attr('opacity', (d) => {
          if (!selectedId) return 0.95;
          const a = typeof d.source === 'object' ? d.source.id : d.source;
          const b = typeof d.target === 'object' ? d.target.id : d.target;
          return a === selectedId || b === selectedId ? 0.98 : 0.10;
        });
      };

      node
        .on('mouseenter', (event, d) => {
          tooltip
            .style('opacity', 1)
            .style('left', `${event.pageX + 12}px`)
            .style('top', `${event.pageY - 12}px`)
            .html(`<strong>${escapeHtml(d.label)}</strong><br/>${formatPayloadHtml(d.payload)}`);
        })
        .on('mouseleave', () => tooltip.style('opacity', 0))
        .on('click', (event, d) => {
          event.stopPropagation();
          selectedId = d.id === selectedId ? null : d.id;

          if (!selectedId) {
            renderSelectionInline(`<div class="selTitle">Selection</div>` + formatPayloadHtml(null));
          } else {
            renderSelectionInline(
              `<div class="selTitle">${escapeHtml(d.label)}</div>` +
              `${formatPayloadHtml(d.payload)}`
            );
          }

          applyHighlight();
        })

      // Click empty space = clear selection
      svg.on('click', () => {
        selectedId = null;
        renderSelectionInline('None (click a node or edge)');
        applyHighlight();
      });

      simulation.on('tick', () => {
        link
          .attr('x1', (d) => d.source.x)
          .attr('y1', (d) => d.source.y)
          .attr('x2', (d) => d.target.x)
          .attr('y2', (d) => d.target.y);
        node.attr('transform', (d) => `translate(${d.x},${d.y})`);
      });

      applyHighlight();
      setStatus('Rendered');
    };

    // -------- File loading --------
    const readJsonFile = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          try { resolve(JSON.parse(reader.result)); } catch (e) { reject(e); }
        };
        reader.onerror = reject;
        reader.readAsText(file);
      });
/*
    el('cmgFile').addEventListener('change', async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setStatus(`Loading ${file.name}…`);

      let cmg;
      try {
        cmg = await readJsonFile(file);
      } catch (parseErr) {
        console.error(parseErr);
        setStatus(`Failed to parse JSON: ${parseErr?.message || 'Unknown error'}`);
        return;
      }

      try {
        renderCmgGraph(cmg);
        setStatus(`Loaded ${file.name}`);
      } catch (renderErr) {
        console.error(renderErr);
        setStatus(`Failed to render CMG: ${renderErr?.message || 'Unknown error'} (see DevTools console)`);
      }
    });

    // Make the Load label keyboard-activatable
    el('loadBtn')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        el('cmgFile')?.click();
      }
    });


    el('loadSample').addEventListener('click', () => renderCmgGraph(sampleCmg));

    el('lodSelect')?.addEventListener('change', (e) => {
      lodLevel = Number(e.target.value || 2);
      if (lastCmg) renderCmgGraph(lastCmg);
    });
    
    // Large CMG (file:// safe): prompt user to select the JSON (no fetch)
    el('loadLarge')?.addEventListener('click', () => {
      setStatus('Select RAST_CMG_VERY_LARGE.json to load the large CMG (file:// safe).');
      // Open the same file input used by "Load CMG"
      el('cmgFile')?.click();
    });

*/
    el('allOn').addEventListener('click', () => {
      enabledGroups = new Set(categories.map((c) => c.id));
      enabledEdgeTypes = new Set(edgeTypes.map((t) => t.id));
      if (lastCmg) renderCmgGraph(lastCmg);
    });
    el('reset').addEventListener('click', () => {
      enabledGroups = new Set(categories.map((c) => c.id));
      enabledEdgeTypes = new Set(edgeTypes.map((t) => t.id));
      searchQuery = '';
      el('search').value = '';
      if (lastCmg) renderCmgGraph(lastCmg);
    });

    el('search').addEventListener('input', (e) => {
      searchQuery = (e.target.value || '').trim().toLowerCase();
      if (lastCmg) renderCmgGraph(lastCmg);
    });

    // ===== Server CMG dropdown (no local file picker) =====

    // Location conventions (recommended):
    // /public/demos/rast-cr/
    //   rast-cmg-viewer.html
    //   rast-cmg-viewer.js
    //   index.json                  <-- CMG menu index (recommended)
    //   /cmg/*.json                 <-- CMG files
    //
    // We support BOTH:
    //   1) ./index.json
    //   2) ./cmg/index.json
    const CMG_INDEX_CANDIDATES = ["./index.json", "./cmg/index.json"];

    function normalizeHref(href) {
      if (!href) return href;
      // absolute or already-relative
      if (
        href.startsWith("http") ||
        href.startsWith("/") ||
        href.startsWith("./") ||
        href.startsWith("../")
      ) return href;
      // bare filename -> assume it lives under ./cmg/
      return `./${href}`;
    }

    async function fetchFirstOk(urls) {
      let lastErr;
      for (const u of urls) {
        try {
          const res = await fetch(u, { cache: "no-store" });
          if (res.ok) return { url: u, res };
          lastErr = new Error(`Fetch failed (${res.status}) for ${u}`);
        } catch (e) {
          lastErr = e;
        }
      }
      throw lastErr || new Error("Failed to fetch any index.json");
    }

    async function loadCmgFromServer(href) {
      const url = normalizeHref(href);
      setStatus(`Loading ${url}…`);
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`Fetch failed (${res.status}) for ${url}`);
      const cmg = await res.json();
      renderCmgGraph(cmg);
      setStatus(`Loaded ${url}`);
    }

    async function initCmgSelect() {
      const sel = el("cmgSelect");
      if (!sel) return;

      let index;
      let indexUrlUsed = "";
      try {
        const got = await fetchFirstOk(CMG_INDEX_CANDIDATES);
        indexUrlUsed = got.url;
        index = await got.res.json();
      } catch (e) {
        console.error(e);
        setStatus(`Failed to load index.json (tried: ${CMG_INDEX_CANDIDATES.join(", ")})`);
        return;
      }

      // Supported index.json shapes:
      // A) { "items": [{ "label":"...", "href":"cmg/foo.json" }, ...] }
      // B) { "items": [{ "label":"...", "file":"foo.json" }, ...] }
      // C) { "files": ["foo.json", ...] }
      // D) ["foo.json", ...]
      let items = [];
      if (Array.isArray(index)) {
        items = index.map((href) => ({ label: href, href }));
      } else if (Array.isArray(index.files)) {
        items = index.files.map((href) => ({ label: href, href }));
      } else if (Array.isArray(index.items)) {
        items = index.items.map((it) => ({
          label: it.label || it.title || it.file || it.href,
          href: it.href || it.file
        }));
      } else {
        setStatus(`index.json format not recognized (${indexUrlUsed})`);
        return;
      }

      // Render options
      sel.innerHTML = items
        .map((it, i) => `<option value="${it.href}">${it.label || `CMG ${i + 1}`}</option>`)
        .join("");

      async function onSelectChange() {
        const href = sel.value;
        try {
          await loadCmgFromServer(href);
        } catch (e) {
          console.error(e);
          setStatus(`Failed to load ${normalizeHref(href)}`);
        }
      }

      sel.addEventListener("change", onSelectChange);

      // Auto-load the first CMG
      if (items.length > 0) {
        await onSelectChange();
      }
    }

    // Init
    renderCmgGraph(sampleCmg); // fallback if index.json is missing
    initCmgSelect();           // server-driven dropdown


    // --- Icon helpers (graph nodes) ---
    function iconForGroup(groupOrLabel){
      const s = String(groupOrLabel || "").toLowerCase();
      if(!s) return "";
      if (s.includes("cmg")) return "🧬";
      if (s.includes("person") || s.includes("identity") || s.includes("patient")) return "👤";
      if (s.includes("session") || s.includes("time")) return "🗓️";
      if (s.includes("sensor")) return "📡";
      if (s.includes("metabolic") || s.includes("hr") || s.includes("rpe") || s.includes("mets")) return "❤️";
      if (s.includes("task") || s.includes("workload") || s.includes("dose") || s.includes("protocol")) return "🏃";
      if (s.includes("constraint") || s.includes("safety") || s.includes("cage") || s.includes("limit")) return "🛡️";
      if (s.includes("intent") || s.includes("objective") || s.includes("cost") || s.includes("trade")) return "🎯";
      if (s.includes("provenance") || s.includes("source") || s.includes("quality")) return "🔍";
      if (s.includes("structural") || s.includes("structure") || s.includes("type")) return "🧱";
      if (s.includes("motor") || s.includes("capability")) return "💪";
      if (s.includes("psych") || s.includes("pe")) return "🧠";
      if (s.includes("phase")) return "📈";
      if (s.includes("longitudinal") || s.includes("trend")) return "🕒";
      if (s.includes("action bank") || s.includes("action")) return "🗂️";
      return "";
    }
    
    // Maps a node/group name to the canonical icon "kind" used by iconSvg()
    // This creates the explicit linkage between legend icons and node glyphs.
    function iconKindForGroup(groupLike, d){
      const raw = String(groupLike || "").toLowerCase();
      // CMG core facets (left mini legend)
      if (raw.includes("person") || raw.includes("identity") || raw === "id") return "person";
      if (raw.includes("session") || raw.includes("time") || raw.includes("context")) return "session";
      if (raw.includes("sensor") || raw.includes("sensors") || raw.includes("suite") || raw.includes("provenance")) return raw.includes("provenance") ? "provenance" : "sensors";
      if (raw.includes("metabolic") || raw.includes("hr") || raw.includes("rpe") || raw.includes("mets")) return "metabolic";
      if (raw.includes("task") || raw.includes("workload") || raw.includes("dose") || raw.includes("protocol")) return "task";
      if (raw.includes("constraint") || raw.includes("safety") || raw.includes("guard")) return "constraints";
      if (raw.includes("intent") || raw.includes("objective") || raw.includes("cost") || raw.includes("optimization")) return "intent";

      // Additional node groups used in the right-side "Node groups" panel
      if (raw.includes("structural")) return "structural";
      if (raw.includes("motor")) return "motor";
      if (raw.includes("phase")) return "phase";
      if (raw.includes("longitudinal") || raw.includes("trend") || raw.includes("tttc")) return "longitudinal";
      if (raw.includes("action")) return "action";
      if (raw.includes("pe") || raw.includes("psych")) return "pe";
      if (raw.includes("value")) return "value";
      if (raw.includes("class")) return "classify";

      // Fallbacks: attempt based on label/id
      const alt = String(d?.label || d?.id || "").toLowerCase();
      if (alt && alt !== raw) return iconKindForGroup(alt, null);
      return "generic";
    }
function nodeIcon(d){
      // Prefer explicit group, fall back to label/id
      return iconForGroup(d?.group) || iconForGroup(d?.label) || iconForGroup(d?.id);
    }
    function nodeRadius(d){
      // Slight emphasis for Identity/Person nodes
      const g = String(d?.group || "").toLowerCase();
      return (g === "identity" || g === "person") ? 22 : 14;
    }
