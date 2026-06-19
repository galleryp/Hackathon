import { useState } from 'react'
import { Search, ChevronDown, ChevronUp, BookOpen } from 'lucide-react'

const SHEETS = {
  Mathematics: {
    icon: '∑',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    sections: [
      {
        title: 'Number Theory',
        items: [
          { name: 'Euler\'s Totient', formula: 'φ(n) = n∏(1 - 1/p) for prime p|n', note: 'Counts integers ≤ n coprime to n' },
          { name: 'Fermat\'s Little Theorem', formula: 'aᵖ ≡ a (mod p) for prime p', note: 'Useful for modular inverses' },
          { name: 'Chinese Remainder Theorem', formula: 'x ≡ aᵢ (mod nᵢ), gcd(nᵢ,nⱼ)=1 → unique solution mod ∏nᵢ', note: '' },
          { name: 'Legendre\'s Formula', formula: 'vₚ(n!) = ∑⌊n/pᵏ⌋', note: 'Largest power of prime p dividing n!' },
          { name: 'Sum of Divisors', formula: 'σ(p₁^a₁ · p₂^a₂) = ∏(pᵢ^(aᵢ+1)-1)/(pᵢ-1)', note: '' },
          { name: 'Wilson\'s Theorem', formula: '(p-1)! ≡ -1 (mod p) iff p is prime', note: '' },
        ],
      },
      {
        title: 'Combinatorics',
        items: [
          { name: 'Binomial Coefficient', formula: 'C(n,k) = n! / (k!(n-k)!)', note: '' },
          { name: 'Stars and Bars', formula: 'C(n+k-1, k-1) ways to put n items in k bins', note: 'Non-negative integer solutions to x₁+...+xₖ=n' },
          { name: 'Inclusion-Exclusion', formula: '|A∪B∪C| = Σ|Aᵢ| - Σ|Aᵢ∩Aⱼ| + |A∩B∩C|', note: '' },
          { name: 'Burnside\'s Lemma', formula: '|X/G| = (1/|G|) Σ|Xᵍ|', note: 'Number of distinct colorings under symmetry' },
          { name: 'Catalan Numbers', formula: 'Cₙ = C(2n,n)/(n+1)', note: 'Counts valid bracket sequences, BSTs, paths' },
          { name: 'Derangements', formula: 'Dₙ = n! Σ(-1)ᵏ/k! ≈ n!/e', note: 'Permutations with no fixed points' },
        ],
      },
      {
        title: 'Algebra & Inequalities',
        items: [
          { name: 'AM-GM Inequality', formula: '(a₁+...+aₙ)/n ≥ (a₁·...·aₙ)^(1/n)', note: 'Equality when all aᵢ equal' },
          { name: 'Cauchy-Schwarz', formula: '(Σaᵢbᵢ)² ≤ (Σaᵢ²)(Σbᵢ²)', note: 'Engel form: Σaᵢ²/bᵢ ≥ (Σaᵢ)²/Σbᵢ' },
          { name: 'Vieta\'s Formulas', formula: 'For xⁿ+a₁xⁿ⁻¹+...+aₙ: Σrᵢ=-a₁, Σrᵢrⱼ=a₂, ...', note: '' },
          { name: 'Sophie Germain', formula: 'a⁴+4b⁴ = (a²+2b²+2ab)(a²+2b²-2ab)', note: 'Useful factoring identity' },
          { name: 'Newton\'s Sums', formula: 'pₖ = eₖ₋₁·(roots) - eₖ₋₂·... (power sums)', note: '' },
          { name: 'Sum of Powers', formula: 'Σk² = n(n+1)(2n+1)/6, Σk³ = [n(n+1)/2]²', note: '' },
        ],
      },
      {
        title: 'Geometry',
        items: [
          { name: 'Law of Cosines', formula: 'c² = a² + b² - 2ab·cos(C)', note: '' },
          { name: 'Law of Sines', formula: 'a/sin(A) = b/sin(B) = c/sin(C) = 2R', note: 'R = circumradius' },
          { name: 'Heron\'s Formula', formula: 'Area = √(s(s-a)(s-b)(s-c)), s=(a+b+c)/2', note: '' },
          { name: 'Power of a Point', formula: 'PA·PB = PC·PD for chords; (PT)² = PA·PB for secant', note: '' },
          { name: 'Ptolemy\'s Theorem', formula: 'AC·BD = AB·CD + AD·BC for cyclic quadrilateral', note: '' },
          { name: 'Extended Law of Sines', formula: 'R = abc/(4·Area)', note: 'R = circumradius' },
          { name: 'Inradius', formula: 'r = Area/s where s = semi-perimeter', note: '' },
        ],
      },
    ],
  },
  Physics: {
    icon: 'ϕ',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    sections: [
      {
        title: 'Mechanics',
        items: [
          { name: 'Newton\'s Second Law', formula: 'F = ma, F = dp/dt', note: '' },
          { name: 'Work-Energy Theorem', formula: 'W_net = ΔKE = Δ(½mv²)', note: '' },
          { name: 'Rotational KE', formula: 'KE_rot = ½Iω²', note: 'I = moment of inertia' },
          { name: 'Parallel Axis Theorem', formula: 'I = I_cm + Md²', note: '' },
          { name: 'Angular Momentum', formula: 'L = Iω = r × p, τ = dL/dt', note: '' },
          { name: 'Center of Mass', formula: 'r_cm = Σmᵢrᵢ/Σmᵢ', note: '' },
          { name: 'Gravitational PE', formula: 'U = -GMm/r, g = GM/R²', note: '' },
          { name: 'Reduced Mass', formula: 'μ = m₁m₂/(m₁+m₂)', note: 'For two-body problems' },
        ],
      },
      {
        title: 'Oscillations & Waves',
        items: [
          { name: 'SHM', formula: 'x = A cos(ωt + φ), ω = √(k/m)', note: 'Period T = 2π/ω' },
          { name: 'Simple Pendulum', formula: 'T = 2π√(L/g)', note: 'Small angle approximation' },
          { name: 'Wave Speed', formula: 'v = fλ = λ/T', note: '' },
          { name: 'Doppler Effect', formula: 'f_obs = f_s(v±v_obs)/(v∓v_s)', note: '' },
          { name: 'Standing Waves', formula: 'λₙ = 2L/n (string), fₙ = nv/2L', note: '' },
        ],
      },
      {
        title: 'Electromagnetism',
        items: [
          { name: 'Coulomb\'s Law', formula: 'F = kq₁q₂/r², k = 8.99×10⁹ N·m²/C²', note: '' },
          { name: 'Gauss\'s Law', formula: '∮E·dA = Q_enc/ε₀', note: 'ε₀ = 8.85×10⁻¹² C²/N·m²' },
          { name: 'Faraday\'s Law', formula: 'EMF = -dΦ_B/dt', note: '' },
          { name: 'Energy in Capacitor', formula: 'U = Q²/2C = CV²/2 = QV/2', note: '' },
          { name: 'Magnetic Force', formula: 'F = qv×B, F = IL×B', note: '' },
          { name: 'LC Oscillation', formula: 'ω = 1/√(LC), Z_L = iωL, Z_C = 1/iωC', note: '' },
        ],
      },
      {
        title: 'Thermodynamics',
        items: [
          { name: 'Ideal Gas Law', formula: 'PV = nRT = NkT', note: 'R = 8.314 J/mol·K, k = 1.38×10⁻²³ J/K' },
          { name: 'First Law', formula: 'ΔU = Q - W', note: '' },
          { name: 'Entropy', formula: 'dS = dQ/T, ΔS ≥ 0 (isolated)', note: '' },
          { name: 'Carnot Efficiency', formula: 'η = 1 - T_cold/T_hot', note: 'Maximum possible efficiency' },
          { name: 'RMS Speed', formula: 'v_rms = √(3RT/M) = √(3kT/m)', note: '' },
        ],
      },
    ],
  },
  Biology: {
    icon: '🧬',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    sections: [
      {
        title: 'Cell Biology',
        items: [
          { name: 'Cell Cycle', formula: 'G1 → S (DNA rep) → G2 → M (mitosis) → cytokinesis', note: '' },
          { name: 'Membrane Transport', formula: 'Simple diffusion, facilitated diffusion, active transport (ATP)', note: 'Osmosis = water through semipermeable membrane' },
          { name: 'ATP Production', formula: 'Glycolysis: 2 ATP net; TCA: 2 GTP; ETC: ~32-34 ATP', note: 'Total: ~36-38 ATP per glucose' },
          { name: 'Signal Transduction', formula: 'Ligand → receptor → 2nd messenger (cAMP, IP3, Ca²⁺) → kinase cascade', note: '' },
        ],
      },
      {
        title: 'Genetics & Molecular Biology',
        items: [
          { name: 'Central Dogma', formula: 'DNA → (transcription) → mRNA → (translation) → Protein', note: '' },
          { name: 'Genetic Code', formula: '3 nucleotides = 1 codon = 1 amino acid, 64 codons total', note: '3 stop codons: UAA, UAG, UGA' },
          { name: 'Hardy-Weinberg', formula: 'p² + 2pq + q² = 1, p + q = 1', note: 'Assumptions: no selection, mutation, migration, drift' },
          { name: 'Linkage', formula: 'Recombination frequency = (# recombinants / total) × 100%', note: '<50% = linked loci' },
          { name: 'DNA Replication', formula: 'Semiconservative; needs primer; 5\'→3\' synthesis; leading/lagging strand', note: '' },
        ],
      },
      {
        title: 'Physiology',
        items: [
          { name: 'Nernst Equation', formula: 'E = (RT/zF) ln([X]_out/[X]_in) ≈ (61.5/z) log([X]_out/[X]_in) at 37°C', note: '' },
          { name: 'Action Potential', formula: 'Resting: -70mV → Threshold: -55mV → Peak: +40mV', note: 'Na⁺ in (depol.), K⁺ out (repol.)' },
          { name: 'Cardiac Output', formula: 'CO = Heart Rate × Stroke Volume', note: 'Normal CO ≈ 5 L/min' },
          { name: 'Ventilation', formula: 'Minute ventilation = Tidal Volume × Breathing Rate', note: 'Normal TV = 500 mL' },
        ],
      },
    ],
  },
  Chemistry: {
    icon: '⚗',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    sections: [
      {
        title: 'Thermochemistry',
        items: [
          { name: 'Hess\'s Law', formula: 'ΔH_rxn = Σ ΔH_f(products) - Σ ΔH_f(reactants)', note: '' },
          { name: 'Gibbs Free Energy', formula: 'ΔG = ΔH - TΔS; ΔG° = -RT ln K', note: 'Spontaneous if ΔG < 0' },
          { name: 'Van\'t Hoff Equation', formula: 'ln(K₂/K₁) = -ΔH°/R (1/T₂ - 1/T₁)', note: '' },
          { name: 'Bond Enthalpies', formula: 'ΔH ≈ Σ(bonds broken) - Σ(bonds formed)', note: '' },
        ],
      },
      {
        title: 'Kinetics & Equilibrium',
        items: [
          { name: 'Arrhenius Equation', formula: 'k = A·e^(-Ea/RT)', note: 'Ea = activation energy' },
          { name: 'Integrated Rate Laws', formula: '0th: [A]=kt | 1st: ln[A]=-kt | 2nd: 1/[A]=kt', note: '' },
          { name: 'Equilibrium Constant', formula: 'K = [products]^n / [reactants]^m (at equilibrium)', note: 'K_p = K_c(RT)^Δn' },
          { name: 'Le Chatelier\'s Principle', formula: 'System shifts to counteract any imposed change', note: '' },
          { name: 'Henderson-Hasselbalch', formula: 'pH = pKa + log([A⁻]/[HA])', note: '' },
        ],
      },
      {
        title: 'Electrochemistry',
        items: [
          { name: 'Standard Cell Potential', formula: 'E°_cell = E°_cathode - E°_anode', note: '' },
          { name: 'Nernst Equation', formula: 'E = E° - (RT/nF) ln Q ≈ E° - (0.0592/n) log Q at 25°C', note: '' },
          { name: 'Faraday\'s Laws', formula: 'm = (M·I·t)/(n·F), F = 96485 C/mol', note: '' },
          { name: 'Gibbs-Cell Potential', formula: 'ΔG° = -nFE°_cell', note: '' },
        ],
      },
    ],
  },
  'Computer Science': {
    icon: '</> ',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    sections: [
      {
        title: 'Complexity & Algorithms',
        items: [
          { name: 'Binary Search', formula: 'O(log n) — halve search space each step', note: 'Works on sorted arrays' },
          { name: 'BFS/DFS', formula: 'O(V+E) — explore graphs layer by layer / depth first', note: 'BFS: shortest path in unweighted graphs' },
          { name: 'Dijkstra\'s', formula: 'O((V+E) log V) with priority queue', note: 'Single-source shortest path, no negative edges' },
          { name: 'DP Recurrence', formula: 'dp[i] = min/max over transitions from dp[i-1], dp[i-2], etc.', note: 'Memoize overlapping subproblems' },
          { name: 'Sorting', formula: 'Merge/Heap sort: O(n log n) | Quick sort: O(n log n) avg', note: 'Comparison sort lower bound: Ω(n log n)' },
        ],
      },
      {
        title: 'Graph Theory',
        items: [
          { name: 'Trees', formula: 'n vertices, n-1 edges, connected, no cycles', note: '' },
          { name: 'Spanning Tree', formula: 'Minimum: Kruskal\'s O(E log E), Prim\'s O(E log V)', note: '' },
          { name: 'Topological Sort', formula: 'O(V+E) — Kahn\'s algorithm (BFS with in-degree)', note: 'Only valid for DAGs' },
          { name: 'Euler Path/Circuit', formula: 'Euler path: exactly 2 odd-degree vertices; circuit: all even', note: '' },
          { name: 'Bipartite Check', formula: 'BFS coloring: 2-colorable ↔ no odd cycles', note: '' },
        ],
      },
    ],
  },
}

function SectionAccordion({ section, color }) {
  const [open, setOpen] = useState(true)

  return (
    <div className="glass-card overflow-hidden mb-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/3 transition-colors"
      >
        <h3 className="text-white font-semibold flex items-center gap-2">
          <span className={color}>▸</span> {section.title}
        </h3>
        {open ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
      </button>

      {open && (
        <div className="border-t border-white/5">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-slate-500 text-xs px-4 py-2 font-medium w-36">Name</th>
                <th className="text-left text-slate-500 text-xs px-4 py-2 font-medium">Formula / Rule</th>
                <th className="text-left text-slate-500 text-xs px-4 py-2 font-medium hidden md:table-cell">Note</th>
              </tr>
            </thead>
            <tbody>
              {section.items.map((item, i) => (
                <tr key={i} className="border-b border-white/3 last:border-0 hover:bg-white/2 transition-colors">
                  <td className="px-4 py-3 text-slate-400 text-xs font-semibold align-top">{item.name}</td>
                  <td className="px-4 py-3 font-mono text-slate-200 text-xs leading-relaxed align-top">{item.formula}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs align-top hidden md:table-cell">{item.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default function ReferenceSheets() {
  const [activeSubject, setActiveSubject] = useState('Mathematics')
  const [search, setSearch] = useState('')

  const subject = SHEETS[activeSubject]

  const filteredSections = search
    ? subject.sections.map((s) => ({
        ...s,
        items: s.items.filter(
          (item) =>
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.formula.toLowerCase().includes(search.toLowerCase()) ||
            item.note.toLowerCase().includes(search.toLowerCase())
        ),
      })).filter((s) => s.items.length > 0)
    : subject.sections

  return (
    <div className="p-8 animate-slide-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-1">Reference Sheets</h1>
        <p className="text-slate-400">Quick-access formulas, theorems, and key concepts for every olympiad</p>
      </div>

      {/* Subject tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {Object.entries(SHEETS).map(([name, { icon, color, bg, border }]) => (
          <button
            key={name}
            onClick={() => { setActiveSubject(name); setSearch('') }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 ${
              activeSubject === name
                ? `${bg} ${color} ${border}`
                : 'bg-space-700 text-slate-400 border-white/8 hover:border-white/15 hover:text-white'
            }`}
          >
            <span className="text-base">{icon}</span>
            {name}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          className="input-field pl-10"
          placeholder={`Search in ${activeSubject}…`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Sections */}
      {filteredSections.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <BookOpen className="w-8 h-8 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500">No results for "{search}"</p>
        </div>
      ) : (
        filteredSections.map((section) => (
          <SectionAccordion key={section.title} section={section} color={subject.color} />
        ))
      )}
    </div>
  )
}
