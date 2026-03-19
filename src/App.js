import { useState, useEffect, useCallback, useMemo, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════════════
   MATHS TERMINALE — Plateforme Prof / Élève
   Auth · Cours · Quiz · Exercices · Chat IA · Dépôt de fichiers · Messagerie
   Basé sur maths-et-tiques.fr (Yvan Monka) — 239 vidéos, 62 exercices, 48 quiz
   ═══════════════════════════════════════════════════════════════════════ */

const BASE = "https://www.maths-et-tiques.fr/index.php/cours-maths/niveau-terminale";
const T = "https://www.maths-et-tiques.fr/telech/";

// ─── RESSOURCES EXTERNES (autres profs reconnus) ─────────────
const EXT = {
  apmep: { name: "APMEP — Annales officielles", url: "https://www.apmep.fr/Annales-Terminale-Generale", icon: "" },
  annales2m: { name: "Annales2maths — Exercices par thème", base: "https://www.annales2maths.com", icon: "" },
  xymaths: { name: "XYMaths — Exercices corrigés détaillés", base: "https://xymaths.fr/Lycee/Terminale-generale-specialite-mathematiques", icon: "🎓" },
  math93: { name: "Math93 — Sujets BAC + DS corrigés", url: "https://www.math93.com/annales-du-bac/bac-specialite-mathematiques/annales-maths-2025.html", icon: "📊" },
  mathovore: { name: "Mathovore — Sujets et corrigés", base: "https://mathovore.fr", icon: "📘" },
};

const CHAPTERS = [
  { id: "suites", title: "Les suites", icon: "∑", color: "#6366f1", theme: "Analyse", metLink: `${BASE}#1`, coursePdf: [`${T}20SuitesTS1.pdf`, `${T}20SuitesTS2.pdf`], courseVideo: "https://youtu.be/MJv7_pkFcdA",
    methodVideos: [
      { cat: "Récurrence", title: "Effectuer une dém. par récurrence", url: "https://youtu.be/udGGlHdSAgc" },
      { cat: "Récurrence", title: "Utiliser le symbole Σ", url: "https://youtu.be/0zspJuzo7L8" },
      { cat: "Récurrence", title: "Dém. expression générale", url: "https://youtu.be/OIUi3MG8efY" },
      { cat: "Récurrence", title: "Dém. monotonie", url: "https://youtu.be/nMnLaE2RAGk" },
      { cat: "Limites de suites", title: "Limite avec opérations", url: "https://youtu.be/v7hD6s3thp8" },
      { cat: "Limites de suites", title: "Forme indéterminée (1)", url: "https://youtu.be/RQhdU7-KLMA" },
      { cat: "Limites de suites", title: "Forme indéterminée (2)", url: "https://youtu.be/wkMleHBnyqU" },
      { cat: "Limites de suites", title: "Forme indéterminée (3)", url: "https://youtu.be/loytWsU4pdQ" },
      { cat: "Limites de suites", title: "Forme indéterminée (4)", url: "https://youtu.be/9fEHRHdbnwQ" },
      { cat: "Comparaison", title: "Théorème de comparaison", url: "https://youtu.be/iQhh46LupN4" },
      { cat: "Comparaison", title: "Théorème d'encadrement", url: "https://youtu.be/OdzYjz_vQbw" },
      { cat: "Convergence", title: "Suite majorée ou minorée", url: "https://youtu.be/F1u_BVwiW8E" },
      { cat: "Convergence", title: "Convergence monotone", url: "https://youtu.be/gO-MQUlBAfo" },
      { cat: "Arithmético-géo", title: "Exprimer en fonction de n", url: "https://youtu.be/6-vFnQ6TghM" },
      { cat: "Arithmético-géo", title: "Sens de variation", url: "https://youtu.be/0CNt_fUuwEY" },
      { cat: "Arithmético-géo", title: "Limite", url: "https://youtu.be/EgYTH79sDfw" },
      { cat: "Suites géométriques", title: "Limite géo (1)", url: "https://youtu.be/F-PGmIK5Ypg" },
      { cat: "Suites géométriques", title: "Limite géo (2)", url: "https://youtu.be/2BueBAoPvvc" },
      { cat: "Suites géométriques", title: "Limite géo (3)", url: "https://youtu.be/XTftGHfnYMw" },
      { cat: "Suites géométriques", title: "Limite somme géo", url: "https://youtu.be/6QjMEzEn5X0" }
    ],
    demoVideos: [
      { title: "Inégalité de Bernoulli", url: "https://youtu.be/H6XJ2tB1_fg" },
      { title: "Divergence suite minorée", url: "https://youtu.be/qIBlhdofYFI" },
      { title: "Suite croissante non majorée → +∞", url: "https://youtu.be/rttQIYOKCRQ" },
      { title: "Limite de qⁿ", url: "https://youtu.be/aSBGk_GEEew" }
    ],
    exerciseVideos: [
      { title: "Somme suite arithmétique", url: "https://youtu.be/CDMol9f8vgc" },
      { title: "Dém. par récurrence", url: "https://youtu.be/LXSJB0BnPD4" },
      { title: "BAC Suites", url: "https://youtu.be/Iq0I4L_OX2s" },
      { title: "BAC Suites, pourcentages, algo", url: "https://youtu.be/d4ZLf-GqTVo" },
      { title: "BAC Suites, logarithme", url: "https://youtu.be/ZgEpJipajzc" }
    ],
    sections: ["Raisonnement par récurrence", "Limites de suites", "Comparaison et encadrement", "Convergence monotone", "Suites arithmético-géométriques", "Suites géométriques"],
    extraLinks: [
      { name: "Lycée d'Adultes — Cours Suites", url: "https://www.lyceedadultes.fr/sitepedagogique/documents/math/mathTermSpe/01_rappels_suites_algorithme/01_cours_rappels_suites_algorithme.pdf", icon: "" },
      { name: "Lycée d'Adultes — Exercices Suites", url: "https://www.lyceedadultes.fr/sitepedagogique/documents/math/mathTermSpe/01_rappels_suites_algorithme/01_exos_rappels_suites._algorithme.pdf", icon: "" },
      { name: "Lycée d'Adultes — Problèmes Suites", url: "https://www.lyceedadultes.fr/sitepedagogique/documents/math/mathTermSpe/01_rappels_suites_algorithme/01_pb_rappels_suites._algorithme.pdf", icon: "" },
      { name: "Lycée d'Adultes — Cours Récurrence & Limites", url: "https://www.lyceedadultes.fr/sitepedagogique/documents/math/mathTermSpe/02_raisonnement_recurrence_limite_suite/02_cours_raisonnement_recurrence_limite_suite.pdf", icon: "" },
      { name: "Lycée d'Adultes — Exercices Récurrence & Limites", url: "https://www.lyceedadultes.fr/sitepedagogique/documents/math/mathTermSpe/02_raisonnement_recurrence_limite_suite/02_exos_raisonnement_recurrence_limite_suite.pdf", icon: "" },
      { name: "Lycée d'Adultes — Contrôle Suites (corrigé)", url: "https://www.lyceedadultes.fr/sitepedagogique/documents/math/mathTermSpe/ctrle_2025_2026/01_ctrle_29_09_2025_correction.pdf", icon: "" },
      { name: "Lycée d'Adultes — Contrôle Récurrence (corrigé)", url: "https://www.lyceedadultes.fr/sitepedagogique/documents/math/mathTermSpe/ctrle_2025_2026/02_ctrle_15_10_2025_correction.pdf", icon: "" },
      { name: "XYMaths — Annales BAC Suites", url: "https://xymaths.fr/Lycee/Terminale-generale-specialite-mathematiques/exercices-bac-sujets-corriges/suites.php", icon: "🎓" },
      { name: "Annales2maths — Exercices Suites", url: "https://www.annales2maths.com/exercices-ts/", icon: "" },
      { name: "APMEP — Tous les sujets BAC", url: "https://www.apmep.fr/Annales-Terminale-Generale", icon: "" },
      { name: "Mathovore — Suites BAC corrigés", url: "https://mathovore.fr/les-suites-exercices-maths-terminale-corriges-en-pdf", icon: "📘" },
    ],
    keyFormulas: [{ name: "Suite arith.", formula: "uₙ = u₀ + n × r" }, { name: "Raison arith.", formula: "r = uₙ₊₁ − uₙ" }, { name: "Suite géo.", formula: "uₙ = u₀ × qⁿ" }, { name: "Raison géo.", formula: "q = [[uₙ₊₁|uₙ]]" }, { name: "Somme arith.", formula: "Sₙ = (n+1) × [[u₀ + uₙ|2]]" }, { name: "Somme 1+...+n", formula: "[[n(n+1)|2]]" }, { name: "Somme géo.", formula: "Sₙ = u₀ × [[1 − qⁿ⁺¹|1 − q]]" }, { name: "Récurrence", formula: "P(0) vraie + P(n) ⟹ P(n+1)" }, { name: "Convergence", formula: "Croissante + majorée ⟹ converge" }, { name: "Lim suite géo.", formula: "|q| < 1 ⟹ qⁿ → 0" }, { name: "Divergence", formula: "q > 1 ⟹ qⁿ → +∞" }],
    quiz: [
      { q: "uₙ₊₁=uₙ+3, u₀=2. Nature ?", choices: ["Arithmétique r=3", "Géométrique q=3", "Ni l'un ni l'autre", "Arithmétique r=2"], answer: 0, explanation: "uₙ₊₁=uₙ+3 → arithmétique de raison 3." },
      { q: "uₙ=(−1)ⁿ converge ?", choices: ["Non, diverge", "Oui vers 0", "Oui vers 1", "Oui vers −1"], answer: 0, explanation: "Alterne entre −1 et 1, pas de limite." },
      { q: "uₙ=5×2ⁿ, limite ?", choices: ["+∞", "0", "5", "2"], answer: 0, explanation: "q=2>1 → diverge vers +∞." },
      { q: "Prouver ∀n≥0, on utilise :", choices: ["Récurrence", "Limite", "Dérivation", "Tableau de signes"], answer: 0, explanation: "Récurrence pour prouver ∀n≥n₀." },
      { q: "1+2+...+100 = ?", choices: ["5050", "5000", "10000", "10100"], answer: 0, explanation: "[[100 × 101|2]] = 5050." },
      { q: "Suite croissante et majorée →", choices: ["Converge", "Diverge vers +∞", "On ne sait pas", "Oscille"], answer: 0, explanation: "Théorème de convergence monotone." }
    ],
    exercises: [
      { title: "Récurrence", statement: "Démontrer par récurrence que pour tout n ≥ 1 : 1 + 2 + ... + n = [[n(n+1)|2]].", hint: "Init n=1. Hérédité : supposez P(k).", solution: "Étape 1 — Initialisation (n=1) : On vérifie que 1 = 1×(1+1) ÷ 2 = 1 ✓\n\nÉtape 2 — Hérédité : On suppose que P(k) est vraie, c'est-à-dire 1+2+...+k = [[k(k+1)|2]].\n\nÉtape 3 — On montre P(k+1) : 1+2+...+k+(k+1) = [[k(k+1)|2]] + (k+1)\n\nOn factorise : (k+1) × ([[k|2]] + 1) = [[(k+1)(k+2)|2]] ✓\n\nConclusion : P(1) vraie et P(k)⇒P(k+1), donc ∀n≥1, P(n) est vraie." },
      { title: "Convergence", statement: "Soit la suite (uₙ) définie pour tout n ∈ ℕ par uₙ = [[3n+1|n+2]]. Déterminer la limite de cette suite quand n tend vers +∞.", hint: "Factorisez par n.", solution: "On factorise en haut et en bas par n :\nuₙ = [[3n+1|n+2]] = [[n(3 + 1/n)|n(1 + 2/n)]]\n\nOn simplifie les n : uₙ = [[3 + 1/n|1 + 2/n]]\nQuand n → +∞ : 1/n → 0 et 2/n → 0\n\nDonc uₙ → [[3|1]] = 3.\n\n La suite converge vers 3." },
      { title: "Arithmético-géo", statement: "Soit (uₙ) la suite définie par u₀ = 10 et pour tout n ∈ ℕ, uₙ₊₁ = ½uₙ + 3.\n1) Déterminer la valeur de ℓ telle que ℓ = ½ℓ + 3.\n2) On pose vₙ = uₙ − ℓ. Montrer que (vₙ) est géométrique.\n3) En déduire uₙ en fonction de n et sa limite.", hint: "ℓ = ½ℓ + 3 → ℓ = 6. vₙ géométrique.", solution: "Étape 1 — Trouver la limite ℓ : Si la suite converge, uₙ₊₁ → ℓ et uₙ → ℓ.\n\nDonc ℓ = ½ℓ + 3, ce qui donne ℓ − ½ℓ = 3, soit ½ℓ = 3, donc ℓ = 6.\n\nÉtape 2 — On pose vₙ = uₙ − 6.\nvₙ₊₁ = uₙ₊₁ − 6 = ½uₙ + 3 − 6 = ½uₙ − 3 = ½(uₙ − 6) = ½vₙ\n\nDonc (vₙ) est géométrique de raison q = ½.\n\nÉtape 3 — v₀ = u₀ − 6 = 10 − 6 = 4. Donc vₙ = 4 × (½)ⁿ.\n\nComme |½| < 1, vₙ → 0, donc uₙ = vₙ + 6 → 6. " },
      { title: "Somme géo", statement: "Calculer la somme S = 1 + 2 + 4 + 8 + ... + 2⁹.\nOn reconnaîtra une somme de termes d'une suite géométrique.", hint: "Suite géo u₀=1, q=2, 10 termes.", solution: "C'est une suite géométrique : u₀ = 1, q = 2, et on a 10 termes (de 2⁰ à 2⁹).\n\nFormule : S = u₀ × [[1 − qⁿ|1 − q]]\nS = 1 × [[1 − 2¹⁰|1 − 2]] = [[1 − 1024|−1]] = [[−1023|−1]] = 1023. " },
      { title: "Récurrence inégalité", statement: "Montrer par récurrence que pour tout entier n ≥ 1, on a 2ⁿ ≥ n + 1.", hint: "Init n=1: 2≥2 ✓. Hérédité: 2ᵏ⁺¹=2×2ᵏ≥2(k+1).", solution: "Initialisation (n=1) : 2¹ = 2 ≥ 1+1 = 2 ✓\n\nHérédité : On suppose 2ᵏ ≥ k+1 pour un certain k ≥ 1.\n\nOn veut montrer que 2ᵏ⁺¹ ≥ (k+1)+1 = k+2.\n2ᵏ⁺¹ = 2 × 2ᵏ ≥ 2 × (k+1) (car 2ᵏ ≥ k+1 par hypothèse)\n2(k+1) = 2k + 2\n\nOr 2k + 2 ≥ k + 2 car k ≥ 1 (on enlève k des deux côtés : k ≥ 0, vrai)\n\nDonc 2ᵏ⁺¹ ≥ k+2 ✓. La propriété est héréditaire." },
      { title: "Encadrement", statement: "Soit la suite (uₙ) définie pour tout n ≥ 1 par uₙ = [[sin(n)|n]].\nDéterminer la limite de cette suite en utilisant le théorème des gendarmes.", hint: "−1≤sin(n)≤1 donc −1/n≤uₙ≤1/n.", solution: "On sait que pour tout n : −1 ≤ sin(n) ≤ 1.\nEn divisant tout par n (positif) : −1/n ≤ sin(n)/n ≤ 1/n.\n\nOr quand n → +∞ : −1/n → 0 et 1/n → 0.\n\nPar le théorème des gendarmes (encadrement), uₙ = sin(n)/n → 0. " }
    ]
  },
  { id: "limites", title: "Limites de fonctions", icon: "→", color: "#8b5cf6", theme: "Analyse", metLink: `${BASE}#2`, coursePdf: [`${T}20LimitesFct1.pdf`, `${T}20LimitesFct2.pdf`], courseVideo: "https://youtu.be/YPwJyYDsmxM",
    methodVideos: [
      { cat: "Limites", title: "Limites graphiquement", url: "https://youtu.be/9nEJCL3s2eU" },
      { cat: "Limites", title: "Tracer courbe depuis tableau", url: "https://youtu.be/vkfpsiqMydY" },
      { cat: "Limites", title: "Limite avec opérations", url: "https://youtu.be/at6pFx-Umfs" },
      { cat: "Formes indéterminées", title: "FI (1)", url: "https://youtu.be/4NQbGdXThrk" },
      { cat: "Formes indéterminées", title: "FI (2)", url: "https://youtu.be/8tAVa4itblc" },
      { cat: "Formes indéterminées", title: "FI (3)", url: "https://youtu.be/pmWPfsQaRWI" },
      { cat: "Formes indéterminées", title: "FI (4)", url: "https://youtu.be/n3XapvUfXJQ" },
      { cat: "Formes indéterminées", title: "FI (5)", url: "https://youtu.be/y7Sbqkb9RoU" },
      { cat: "Asymptotes", title: "Asymptote horizontale", url: "https://youtu.be/0LDGK-QkL80" },
      { cat: "Asymptotes", title: "Asymptote verticale", url: "https://youtu.be/pXDhrx-nMto" },
      { cat: "Asymptotes", title: "Asymptote oblique", url: "https://youtu.be/zbyGXpKTI_k" },
      { cat: "Composées", title: "Limite composée", url: "https://youtu.be/DNU1M3Ii76k" },
      { cat: "Composées", title: "Limite composée (expo)", url: "https://youtu.be/f5i_u8XVMfc" },
      { cat: "Comparaison", title: "Théorème comparaison", url: "https://youtu.be/OAtkpYMdu7Y" },
      { cat: "Comparaison", title: "Théorème encadrement", url: "https://youtu.be/Eo1jvPphja0" },
      { cat: "Comparaison", title: "Croissance comparée exp/xⁿ", url: "https://youtu.be/GoLYLTZFaz0" }
    ],
    demoVideos: [{ title: "Limites en ±∞ de exp", url: "https://youtu.be/DDqgEz1Id2s" }, { title: "Croissance comparée xⁿ et exp", url: "https://youtu.be/_re6fVWD4b0" }],
    exerciseVideos: [],
        extraLinks: [
      { name: "Lycée d'Adultes — Cours Limites & Continuité", url: "https://www.lyceedadultes.fr/sitepedagogique/documents/math/mathTermSpe/03_limites_et_continuite/03_Cours_limites_et_continuite.pdf", icon: "" },
      { name: "Lycée d'Adultes — Exercices Limites & Continuité", url: "https://www.lyceedadultes.fr/sitepedagogique/documents/math/mathTermSpe/03_limites_et_continuite/03_exos_limites_et_continuite.pdf", icon: "" },
      { name: "XYMaths — Annales BAC Limites", url: "https://xymaths.fr/Lycee/Terminale-generale-specialite-mathematiques/exercices-bac-sujets-corriges/limites.php", icon: "🎓" },
      { name: "Annales2maths — Sujets BAC corrigés", url: "https://www.annales2maths.com/sujets-et-corrections-de-bac-specialite-mathematiques/", icon: "" },
      { name: "Math93 — Sujets BAC 2024-2025", url: "https://www.math93.com/annales-du-bac/bac-specialite-mathematiques/annales-maths-2025.html", icon: "📊" },
    ],
    sections: ["Limites en l'infini", "Limites en un point", "Asymptotes H/V/obliques", "Opérations sur les limites", "Formes indéterminées", "Fonctions composées", "Comparaison et encadrement", "Croissances comparées"],
    keyFormulas: [{ name: "Croiss. comparées", formula: "eˣ ≫ xⁿ ≫ ln(x)" }, { name: "lim xeˣ", formula: "lim(x→−∞) xeˣ = 0" }, { name: "Asympt. horiz.", formula: "lim f(x) = ℓ ⟹ y = ℓ" }, { name: "Asympt. vert.", formula: "lim f(x) = ±∞ ⟹ x = a" }, { name: "Asympt. oblique", formula: "lim f(x)−(ax+b) = 0 ⟹ y = ax+b" }, { name: "lim sin(x)/x", formula: "lim(x→0) [[sin(x)|x]] = 1" }, { name: "lim eˣ/x", formula: "lim(x→+∞) [[eˣ|x]] = +∞" }, { name: "lim ln(x)/x", formula: "lim(x→+∞) [[ln(x)|x]] = 0" }, { name: "lim (eˣ−1)/x", formula: "lim(x→0) [[eˣ−1|x]] = 1" }, { name: "Formes indét.", formula: "[[0|0]], [[∞|∞]], ∞−∞, 0×∞" }, { name: "Gendarmes", formula: "uₙ ≤ vₙ ≤ wₙ, uₙ→ℓ, wₙ→ℓ ⟹ vₙ→ℓ" }],
    quiz: [
      { q: "lim(x→+∞) (2x²−3x)/(x²+1) ?", choices: ["2", "+∞", "0", "−3"], answer: 0, explanation: "Factoriser par x²: → 2." },
      { q: "lim(x→+∞) ln(x)/x ?", choices: ["0", "1", "+∞", "ln(1)"], answer: 0, explanation: "Croissance comparée." },
      { q: "lim(x→2⁺) f(x)=+∞ →", choices: ["AV x=2", "AH y=2", "f(2)=+∞", "Continue en 2"], answer: 0, explanation: "Asymptote verticale x=2." },
      { q: "eˣ−x quand x→+∞ : FI ?", choices: ["+∞−∞ (oui)", "+∞ directement", "0", "−∞"], answer: 0, explanation: "FI +∞−∞, mais eˣ domine → +∞." }
    ],
    exercises: [
      { title: "Limites et asymptotes", statement: "Soit f la fonction définie par f(x) = [[x²+1|x−1]].\n1) Déterminer les limites de f en +∞, −∞ et en 1.\n2) En déduire les asymptotes de la courbe de f.", hint: "Division euclidienne.", solution: "Étape 1 — Division euclidienne de x²+1 par x−1 :\nx²+1 = (x−1)(x+1) + 2, donc f(x) = x+1 + [[2|x−1]].\n\nÉtape 2 — Quand x → ±∞ : 2/(x−1) → 0, donc f(x) ≈ x+1.\n→ Asymptote oblique y = x+1.\n\nÉtape 3 — Quand x → 1 : le dénominateur x−1 → 0, donc f(x) → ±∞.\n→ Asymptote verticale x = 1." },
      { title: "Forme indéterminée", statement: "Calculer la limite suivante : lim(x→+∞) [√(x²+x) − x].\nOn utilisera la technique de l'expression conjuguée.", hint: "Expression conjuguée.", solution: "Astuce : on multiplie par l'expression conjuguée.\n√(x²+x) − x = [√(x²+x) − x] × [√(x²+x) + x] ÷ [√(x²+x) + x]\n= (x²+x − x²) ÷ [√(x²+x) + x] = [[x|√(x²+x) + x]]\n\nOn factorise par x : = [[x|x(√(1+1/x) + 1)]] = [[1|√(1+1/x) + 1]]\nQuand x → +∞ : 1/x → 0, donc → [[1|2]] = 1/2. " },
      { title: "Croissance comparée", statement: "Déterminer la limite de (x²−1) × eˣ quand x tend vers +∞.\nOn pourra utiliser les croissances comparées.", hint: "eˣ domine tout polynôme.", solution: "On factorise : (x²−1) × eˣ.\nQuand x → +∞ : x²−1 → +∞ et eˣ → +∞.\nPas de forme indéterminée ici : c'est +∞ × +∞ = +∞.\nRetiens : l'exponentielle domine TOUT polynôme quand x → +∞. " },
      { title: "Asymptote verticale", statement: "Soit f(x) = [[1|x²−4]].\n1) Déterminer les valeurs interdites de f.\n2) Étudier les limites en ces valeurs et en déduire les asymptotes verticales.", hint: "Dénominateur nul en ±2.", solution: "Le dénominateur x²−4 = (x−2)(x+2) s'annule en x = 2 et x = −2.\n→ Ce sont des asymptotes verticales candidates.\nEn x = 2⁺ (par la droite) : x²−4 → 0⁺ (petit positif), donc f(x) → +∞.\nEn x = 2⁻ (par la gauche) : x²−4 → 0⁻ (petit négatif), donc f(x) → −∞.\nMême raisonnement en x = −2. " },
      { title: "Théorème des gendarmes", statement: "Déterminer la limite de [[cos(x)|x]] quand x tend vers +∞ en utilisant le théorème des gendarmes.", hint: "−1≤cos(x)≤1.", solution: "On sait que −1 ≤ cos(x) ≤ 1 pour tout x.\nEn divisant par x (positif pour x → +∞) : −1/x ≤ cos(x)/x ≤ 1/x.\n\nOr −1/x → 0 et 1/x → 0 quand x → +∞.\n\nPar le théorème des gendarmes : cos(x)/x → 0. " }
    ]
  },
  { id: "derivation", title: "Dérivation", icon: "f'", color: "#a855f7", theme: "Analyse", metLink: `${BASE}#3`, coursePdf: [`${T}20DerivT.pdf`], courseVideo: "https://youtu.be/XAgdHblbajE",
    methodVideos: [
      { cat: "Composées", title: "Identifier la composée", url: "https://youtu.be/08HgDgD6XL8" },
      { cat: "Composées", title: "Composer deux fonctions", url: "https://youtu.be/sZ2zqEz4hug" },
      { cat: "Composées", title: "Dérivée composée (1)", url: "https://youtu.be/lwcFgnbs0Ew" },
      { cat: "Composées", title: "Dérivée composée (2)", url: "https://youtu.be/kE32Ek8BXvs" },
      { cat: "Composées", title: "Dérivée composée (3)", url: "https://youtu.be/5G4Aa8gKH_o" },
      { cat: "Étude complète", title: "1/6 Ensemble de définition", url: "https://youtu.be/0MwFVTHZdpo" },
      { cat: "Étude complète", title: "2/6 Limites", url: "https://youtu.be/j-pKLxjHNJw" },
      { cat: "Étude complète", title: "3/6 Dérivabilité", url: "https://youtu.be/7c7HeV8cMvo" },
      { cat: "Étude complète", title: "4/6 Variations", url: "https://youtu.be/95eLAWaSwwc" },
      { cat: "Étude complète", title: "5/6 Asymptotes", url: "https://youtu.be/a1Z29PuSQ64" },
      { cat: "Étude complète", title: "6/6 Représentation", url: "https://youtu.be/mM24gzGuWcA" }
    ],
    demoVideos: [],
    exerciseVideos: [
      { title: "Position relative exp et y=x", url: "https://youtu.be/RA4ygCl3ViE" },
      { title: "Tangente horizontale", url: "https://youtu.be/9tWt9x4P3t0" },
      { title: "Fonction exp 1/3 Limites", url: "https://youtu.be/I4HkvkpqjNw" },
      { title: "Fonction exp 2/3 Variations", url: "https://youtu.be/Vx0H1DV3Yqc" },
      { title: "Fonction exp 3/3 Repr.", url: "https://youtu.be/2RIBQ1LiNYU" },
      { title: "BAC Expo convexité intégration", url: "https://youtu.be/cdUQhZtDAlE" },
      { title: "BAC Expo dérivation convexité", url: "https://youtu.be/fTLVwAIHawg" }
    ],
        extraLinks: [
      { name: "Lycée d'Adultes — Cours Dérivabilité & Convexité", url: "https://www.lyceedadultes.fr/sitepedagogique/documents/math/mathTermSpe/04_derivabilite_convexite/04_Cours_derivabilite_convexite.pdf", icon: "" },
      { name: "Lycée d'Adultes — Exercices Dérivabilité & Convexité", url: "https://www.lyceedadultes.fr/sitepedagogique/documents/math/mathTermSpe/04_derivabilite_convexite/04_exos_derivabilite_convexite.pdf", icon: "" },
      { name: "Lycée d'Adultes — QCM Convexité", url: "https://www.lyceedadultes.fr/sitepedagogique/documents/math/mathTermSpe/04_derivabilite_convexite/04_exos_qcm_convexite.pdf", icon: "" },
      { name: "Lycée d'Adultes — Contrôle Limites/Dérivation (corrigé)", url: "https://www.lyceedadultes.fr/sitepedagogique/documents/math/mathTermSpe/ctrle_2025_2026/03_04_ctrle_26_11_2025_correction.pdf", icon: "" },
      { name: "XYMaths — Exercices Dérivation", url: "https://xymaths.fr/Lycee/Terminale-generale-specialite-mathematiques/Exercices-corriges/liste-sujets/derivation/", icon: "🎓" },
      { name: "Annales2maths — Sujets BAC", url: "https://www.annales2maths.com/sujets-et-corrections-de-bac-specialite-mathematiques/", icon: "" },
    ],
    sections: ["Dérivées des composées", "Dérivée eᵘ, ln(u), uⁿ", "Étude complète", "Tableau de variation", "Extremums", "Tangente"],
    keyFormulas: [{ name: "(c)' = 0", formula: "Constante → dérivée nulle" }, { name: "(xⁿ)'", formula: "n × xⁿ⁻¹" }, { name: "(√x)'", formula: "[[1|2√(x)]]" }, { name: "(eˣ)'", formula: "eˣ" }, { name: "(ln x)'", formula: "[[1|x]]" }, { name: "(sin x)'", formula: "cos x" }, { name: "(cos x)'", formula: "−sin x" }, { name: "(tan x)'", formula: "1 + tan²x = [[1|cos²x]]" }, { name: "(αu+βv)'", formula: "αu' + βv'" }, { name: "(uv)'", formula: "u'v + uv'" }, { name: "(u/v)'", formula: "[[u'v − uv'|v²]]" }, { name: "(eᵘ)'", formula: "u' × eᵘ" }, { name: "(ln u)'", formula: "[[u'|u]]" }, { name: "(uⁿ)'", formula: "n × u' × uⁿ⁻¹" }, { name: "(√u)'", formula: "[[u'|2√(u)]]" }, { name: "(1/u)'", formula: "[[−u'|u²]]" }, { name: "Tangente", formula: "y = f'(a)(x − a) + f(a)" }, { name: "f croissante", formula: "f'(x) ≥ 0 sur I" }],
    quiz: [
      { q: "Dérivée de e^(2x+1) ?", choices: ["2e^(2x+1)", "e^(2x+1)", "(2x+1)e^(2x)", "2xe^(2x+1)"], answer: 0, explanation: "u'eᵘ = 2e^(2x+1)." },
      { q: "Dérivée de ln(x²+1) ?", choices: ["2x/(x²+1)", "1/(x²+1)", "2x·ln(x²+1)", "1/(2x)"], answer: 0, explanation: "u'/u = 2x/(x²+1)." },
      { q: "Dérivée de (3x−1)⁵ ?", choices: ["15(3x−1)⁴", "5(3x−1)⁴", "(3x−1)⁴", "15(3x)⁴"], answer: 0, explanation: "5×3×(3x−1)⁴ = 15(3x−1)⁴." },
      { q: "f'(x₀)=0 et f' change de signe →", choices: ["Extremum local", "f constante", "f non définie", "f croissante"], answer: 0, explanation: "Extremum local en x₀." }
    ],
    exercises: [
      { title: "Étude complète", statement: "Soit f la fonction définie sur ℝ par f(x) = x × e⁻ˣ.\n1) Calculer f'(x) en utilisant la formule du produit.\n2) Étudier le signe de f'(x) et dresser le tableau de variations de f.\n3) Déterminer le maximum de f.", hint: "(uv)'=u'v+uv'.", solution: "f(x) = x × e⁻ˣ. On utilise la formule (uv)' = u'v + uv'.\nu = x → u' = 1 ; v = e⁻ˣ → v' = −e⁻ˣ.\nf'(x) = 1 × e⁻ˣ + x × (−e⁻ˣ) = e⁻ˣ(1 − x).\nf'(x) = 0 ⟺ 1−x = 0 (car e⁻ˣ > 0 toujours) ⟺ x = 1.\nf' > 0 si x < 1 (croissante), f' < 0 si x > 1 (décroissante).\n\nMaximum en x = 1 : f(1) = 1 × e⁻¹ = [[1|e]] ≈ 0.37. " },
      { title: "Tangente", statement: "Soit f(x) = ln(x). Déterminer l'équation de la tangente à la courbe de f au point d'abscisse x = e.", hint: "T: y=f'(a)(x−a)+f(a).", solution: "Rappel : l'équation de la tangente en a est y = f'(a)(x − a) + f(a).\nf(x) = ln(x), donc f(e) = ln(e) = 1.\nf'(x) = 1/x, donc f'(e) = [[1|e]].\n\nTangente : y = (1/e)(x − e) + 1 = x/e − 1 + 1 = x/e.\n\n La tangente en x = e est y = [[x|e]]." },
      { title: "Composée", statement: "Soit f(x) = e^(x²−3x+1). Calculer la dérivée f'(x) en identifiant la forme eᵘ.", hint: "f=eᵘ, u=x²−3x+1.", solution: "f(x) = e^(x²−3x+1). C'est de la forme eᵘ avec u = x²−3x+1.\nRègle : (eᵘ)' = u' × eᵘ.\nu' = 2x − 3.\n\nDonc f'(x) = (2x−3) × e^(x²−3x+1). " },
      { title: "Extremum", statement: "Soit f(x) = [[x−1|x²+1]] définie sur ℝ.\n1) Calculer f'(x) en utilisant la formule du quotient.\n2) Résoudre f'(x) = 0 et en déduire les extremums de f.", hint: "f'=(u'v−uv')/v². Résoudre f'=0.", solution: "f(x) = (x−1) ÷ (x²+1). On utilise (u/v)' = [[u'v − uv'|v²]].\nu = x−1 → u' = 1 ; v = x²+1 → v' = 2x.\nf' = [1×(x²+1) − (x−1)×2x] ÷ (x²+1)²\n= (x²+1 − 2x²+2x) ÷ (x²+1)² = [[−x²+2x+1|(x²+1)²]].\nf' = 0 ⟺ −x²+2x+1 = 0 ⟺ x²−2x−1 = 0.\nΔ = 4+4 = 8, x = (2±2√2) ÷ 2 = 1±√2.\nMax en x = 1+√2 et min en x = 1−√2. " },
      { title: "Tangente horizontale", statement: "Soit f(x) = x³ − 3x + 1. Déterminer les points de la courbe de f où la tangente est horizontale (c'est-à-dire f'(x) = 0).", hint: "f'(x)=0.", solution: "Tangente horizontale signifie f'(x) = 0.\nf(x) = x³−3x+1, donc f'(x) = 3x²−3.\nf'(x) = 0 ⟺ 3x²−3 = 0 ⟺ x² = 1 ⟺ x = 1 ou x = −1.\nf(1) = 1−3+1 = −1 → point (1, −1).\nf(−1) = −1+3+1 = 3 → point (−1, 3). " }
    ]
  },
  { id: "continuite", title: "Continuité", icon: "↔", color: "#c084fc", theme: "Analyse", metLink: `${BASE}#4`, coursePdf: [`${T}20Cont.pdf`], courseVideo: "https://youtu.be/9SSEUoyHh2s",
    methodVideos: [
      { cat: "Continuité", title: "Continuité graphiquement", url: "https://youtu.be/XpjKserte6o" },
      { cat: "Continuité", title: "Étudier la continuité", url: "https://youtu.be/03WMLyc7rLE" },
      { cat: "TVI", title: "TVI (1)", url: "https://youtu.be/fkd7c3IAc3Y" },
      { cat: "TVI", title: "TVI (2)", url: "https://youtu.be/UmGQf7gkvLg" },
      { cat: "Algo", title: "Dichotomie", url: "https://youtu.be/V7mlMCSrq1U" },
      { cat: "Suites et fonctions", title: "Suite récurrente (1)", url: "https://youtu.be/L7bBL4z-r90" },
      { cat: "Suites et fonctions", title: "Suite récurrente (2)", url: "https://youtu.be/LDRx7aS9JsA" },
      { cat: "Suites et fonctions", title: "Variation avec fonction", url: "https://youtu.be/dPR3GyQycH0" }
    ],
    demoVideos: [], exerciseVideos: [{ title: "BAC Limite dérivée continuité convexité suites", url: "https://youtu.be/mmHtILuE5mU" }],
        extraLinks: [
      { name: "Lycée d'Adultes — Cours Limites & Continuité", url: "https://www.lyceedadultes.fr/sitepedagogique/documents/math/mathTermSpe/03_limites_et_continuite/03_Cours_limites_et_continuite.pdf", icon: "" },
      { name: "Lycée d'Adultes — Exercices Limites & Continuité", url: "https://www.lyceedadultes.fr/sitepedagogique/documents/math/mathTermSpe/03_limites_et_continuite/03_exos_limites_et_continuite.pdf", icon: "" },
      { name: "XYMaths — Annales BAC Continuité", url: "https://xymaths.fr/Lycee/Terminale-generale-specialite-mathematiques/exercices-bac-sujets-corriges/continuite-tvi.php", icon: "🎓" },
      { name: "APMEP — Annales Terminale", url: "https://www.apmep.fr/Annales-Terminale-Generale", icon: "" },
    ],
    sections: ["Définition continuité", "Continuité sur un intervalle", "TVI", "Existence de solutions", "Dichotomie", "Suites et fonctions"],
    keyFormulas: [{ name: "Continuité en a", formula: "lim(x→a) f(x) = f(a)" }, { name: "TVI", formula: "f continue, f(a)·f(b) < 0 ⟹ ∃c, f(c) = 0" }, { name: "TVI + stricte mono.", formula: "f continue + strictement monotone ⟹ unique solution" }, { name: "Bornes atteintes", formula: "f continue sur [a,b] ⟹ f atteint min et max" }, { name: "Dichotomie", formula: "Méthode pour encadrer la solution du TVI" }],
    quiz: [
      { q: "Le TVI sert à :", choices: ["Prouver existence solution", "Calculer dérivée", "Trouver limite", "Calculer intégrale"], answer: 0, explanation: "TVI ⇒ existence." },
      { q: "f continue [0,1], f(0)=−2, f(1)=3 →", choices: ["f s'annule (TVI)", "Pas assez d'info", "Si dérivable seulement", "Par la dérivée"], answer: 0, explanation: "0 entre f(0) et f(1), f continue ⇒ TVI." }
    ],
    exercises: [
      { title: "TVI", statement: "Montrer que l'équation eˣ = x + 2 admet au moins une solution sur l'intervalle [0, 2].\nOn posera g(x) = eˣ − x − 2 et on appliquera le TVI.", hint: "g(x)=eˣ−x−2.", solution: "On pose g(x) = eˣ − x − 2. On cherche un zéro de g.\ng(0) = e⁰ − 0 − 2 = 1 − 2 = −1 < 0.\ng(2) = e² − 2 − 2 ≈ 7.39 − 4 = 3.39 > 0.\ng est continue sur [0,2] (somme de fonctions continues).\ng(0) < 0 < g(2) : par le TVI, il existe c ∈ ]0,2[ tel que g(c) = 0.\n\nDonc eᶜ = c + 2. L'équation a bien une solution. " },
      { title: "TVI bis", statement: "Soit f(x) = x³ + x − 1.\n1) Montrer que f s'annule au moins une fois sur [0, 1] (existence par le TVI).\n2) Montrer que f est strictement croissante sur ℝ (unicité).", hint: "f continue, f(0)=−1, f(1)=1. Et f strictement croissante.", solution: "Existence : f(0) = 0+0−1 = −1 < 0 et f(1) = 1+1−1 = 1 > 0.\nf est continue (polynôme), et 0 est entre f(0) et f(1).\n\nPar le TVI : il existe c ∈ ]0,1[ tel que f(c) = 0. ✓\n\nUnicité : f'(x) = 3x²+1. Or 3x² ≥ 0 donc f' ≥ 1 > 0 pour tout x.\nf est strictement croissante sur ℝ, donc elle ne peut s'annuler qu'une seule fois. " },
      { title: "Dichotomie", statement: "Soit f(x) = x³ − 2. La racine cubique de 2 est la solution de f(x) = 0.\nEn utilisant la méthode de dichotomie, donner un encadrement de ∛2 à 0.5 près.", hint: "f(1)=−1<0, f(2)=6>0. Milieu m=1.5.", solution: "On cherche c tel que c³ = 2, c'est-à-dire la racine cubique de 2.\nf(1) = 1−2 = −1 < 0 ; f(2) = 8−2 = 6 > 0. Donc c ∈ ]1, 2[.\nMilieu m = 1.5 : f(1.5) = 3.375−2 = 1.375 > 0 → c ∈ ]1, 1.5[.\nMilieu m = 1.25 : f(1.25) = 1.953−2 ≈ −0.05 < 0 → c ∈ ]1.25, 1.5[.\n\nOn a encadré ∛2 à 0.25 près : 1.25 < ∛2 < 1.5.\nEn continuant : ∛2 ≈ 1.26. " }
    ]
  },
  { id: "convexite", title: "Convexité", icon: "∪", color: "#e879f9", theme: "Analyse", metLink: `${BASE}#5`, coursePdf: [`${T}20ConvexiteT.pdf`], courseVideo: "https://youtu.be/gge4xdn6cFA",
    methodVideos: [
      { cat: "Convexité", title: "Dérivée seconde", url: "https://youtu.be/W6rypabq8uA" },
      { cat: "Convexité", title: "Convexité graphiquement", url: "https://youtu.be/ERML85y_s6E" },
      { cat: "Convexité", title: "Étudier la convexité", url: "https://youtu.be/8H2aYKN8NGE" },
      { cat: "Convexité", title: "Point d'inflexion", url: "https://youtu.be/r8sYr6ToeLo" },
      { cat: "Convexité", title: "Résoudre un problème", url: "https://youtu.be/_XlgCeLcN1k" },
      { cat: "Convexité", title: "Prouver inégalité", url: "https://youtu.be/AaxQHlsxZkg" }
    ],
    demoVideos: [{ title: "f convexe si f' croissante", url: "https://youtu.be/-OG8l5Batuo" }],
    exerciseVideos: [{ title: "Convexité d'une fonction", url: "https://youtu.be/ji-0MWrZl_c" }, { title: "Fonction exponentielle", url: "https://youtu.be/Q4cqUJrTPZo" }, { title: "BAC convexité suites", url: "https://youtu.be/mmHtILuE5mU" }, { title: "BAC log convexité intégration", url: "https://youtu.be/dw-xgU8GAsM" }],
        extraLinks: [
      { name: "Lycée d'Adultes — Cours Dérivabilité & Convexité", url: "https://www.lyceedadultes.fr/sitepedagogique/documents/math/mathTermSpe/04_derivabilite_convexite/04_Cours_derivabilite_convexite.pdf", icon: "" },
      { name: "Lycée d'Adultes — Exercices Dérivabilité & Convexité", url: "https://www.lyceedadultes.fr/sitepedagogique/documents/math/mathTermSpe/04_derivabilite_convexite/04_exos_derivabilite_convexite.pdf", icon: "" },
      { name: "XYMaths — Exercices Convexité", url: "https://xymaths.fr/Lycee/Terminale-generale-specialite-mathematiques/Exercices-corriges/liste-sujets/convexite/", icon: "🎓" },
      { name: "Annales2maths — BAC Convexité", url: "https://www.annales2maths.com/sujets-et-corrections-de-bac-specialite-mathematiques/", icon: "" },
    ],
    sections: ["Convexe/concave", "f'' et convexité", "Point d'inflexion", "Courbe/tangentes", "Inégalités"],
    keyFormulas: [{ name: "Convexe", formula: "f''(x) ≥ 0 sur I" }, { name: "Concave", formula: "f''(x) ≤ 0 sur I" }, { name: "Pt inflexion", formula: "f''(a) = 0 et f'' change de signe" }, { name: "Convexe ⟺", formula: "Courbe au-dessus de ses tangentes" }, { name: "Concave ⟺", formula: "Courbe en dessous de ses tangentes" }],
    quiz: [
      { q: "f''>0 partout →", choices: ["Convexe", "Concave", "Décroissante", "Constante"], answer: 0, explanation: "f''>0 ⇒ convexe." },
      { q: "Point d'inflexion = f''", choices: ["Change de signe", "S'annule seulement", "Maximum", "Minimum"], answer: 0, explanation: "Changement de convexité." },
      { q: "f convexe ⇒ courbe", choices: ["Au-dessus tangentes", "En-dessous tangentes", "Décroissante", "Croissante"], answer: 0, explanation: "Propriété fondamentale." }
    ],
    exercises: [
      { title: "Convexité", statement: "Soit f(x) = x³ − 3x.\n1) Calculer f''(x).\n2) Déterminer les intervalles de convexité et concavité de f.\n3) En déduire les points d'inflexion.", hint: "f''=6x.", solution: "f(x) = x³−3x. On dérive deux fois.\nf'(x) = 3x²−3.\nf''(x) = 6x.\nf''(x) = 0 ⟺ x = 0.\n\nSi x < 0 : f''(x) < 0 → courbe concave (en forme de ∩).\n\nSi x > 0 : f''(x) > 0 → courbe convexe (en forme de ∪).\nf'' change de signe en x = 0 : c'est un point d'inflexion.\nf(0) = 0 → point d'inflexion en (0, 0). " },
      { title: "Tangente et convexité", statement: "Soit f(x) = eˣ.\n1) Montrer que f est convexe sur ℝ.\n2) Écrire l'équation de la tangente en x = 0.\n3) En déduire que eˣ ≥ x + 1 pour tout x ∈ ℝ.", hint: "T en 0 : y=x+1. f convexe⇒courbe au-dessus.", solution: "f(x) = eˣ. f'(x) = eˣ. f''(x) = eˣ > 0 pour tout x.\n\nDonc f est convexe sur ℝ (courbe en forme de ∪).\n\nTangente en x = 0 : T(x) = f'(0)(x−0) + f(0) = 1×x + 1 = x+1.\n\nPropriété clé : une courbe convexe est toujours AU-DESSUS de ses tangentes.\n\nDonc eˣ ≥ x+1 pour tout x ∈ ℝ. " },
      { title: "Point d'inflexion", statement: "Soit f(x) = x⁴ − 6x².\n1) Calculer f''(x).\n2) Résoudre f''(x) = 0.\n3) Étudier le changement de signe de f'' et déterminer les points d'inflexion.", hint: "f''=12x²−12=12(x²−1).", solution: "f(x) = x⁴−6x². On dérive deux fois.\nf'(x) = 4x³−12x.\nf''(x) = 12x²−12 = 12(x²−1) = 12(x−1)(x+1).\nf''(x) = 0 ⟺ x = 1 ou x = −1.\n\nTableau de signe de f'' :\nx < −1 : f'' > 0 (convexe) ; −1 < x < 1 : f'' < 0 (concave) ; x > 1 : f'' > 0 (convexe).\nf'' change de signe en x = −1 et x = 1 : ce sont des points d'inflexion.\nf(1) = 1−6 = −5 et f(−1) = 1−6 = −5.\n\nPoints d'inflexion : (1, −5) et (−1, −5). " }
    ]
  },
  { id: "logarithme", title: "Logarithme népérien", icon: "ln", color: "#f43f5e", theme: "Analyse", metLink: `${BASE}#6`, coursePdf: [`${T}20LogT1.pdf`, `${T}20LogT2.pdf`], courseVideo: "https://youtu.be/VJns0RfVWGg",
    methodVideos: [
      { cat: "Propriétés", title: "Formules logarithmes", url: "https://youtu.be/HGrK77-SCl4" },
      { cat: "Équations", title: "Équation ln (1)", url: "https://youtu.be/lCT-8ijhZiE" },
      { cat: "Équations", title: "Équation ln (2)", url: "https://youtu.be/GDt785E8TPE" },
      { cat: "Équations", title: "Résoudre avec ln", url: "https://youtu.be/RzX506TFBIA" },
      { cat: "Équations", title: "Inéquation ln", url: "https://youtu.be/_fpPphstjYw" },
      { cat: "Dérivation", title: "Dériver avec ln", url: "https://youtu.be/yiQ4Z5FdFQ8" },
      { cat: "Dérivation", title: "Dériver ln(u)", url: "https://youtu.be/-zrhBc9xdRs" },
      { cat: "Limites", title: "Croissance comparée (1)", url: "https://youtu.be/lA3W_j4p-c8" },
      { cat: "Limites", title: "Croissance comparée (2)", url: "https://youtu.be/OYcsChr8src" },
      { cat: "Étude", title: "Étudier f avec ln", url: "https://youtu.be/iT9C0BiOK4Y" },
      { cat: "Étude", title: "Position relative ln et y=x", url: "https://youtu.be/0hQnOs_hcss" },
      { cat: "Étude ln(u)", title: "ln(u) 1/3 Limites", url: "https://youtu.be/s9vyHsZoV-4" },
      { cat: "Étude ln(u)", title: "ln(u) 2/3 Variations", url: "https://youtu.be/3eI4-JRKYVo" },
      { cat: "Étude ln(u)", title: "ln(u) 3/3 Repr.", url: "https://youtu.be/CyOC-E7MnUw" }
    ],
    demoVideos: [{ title: "Dérivée de ln", url: "https://youtu.be/wmysrEq4XIg" }, { title: "Limite x·ln(x) en 0", url: "https://youtu.be/LxgQBYTaRaw" }],
    exerciseVideos: [{ title: "BAC Logarithme dérivation", url: "https://youtu.be/GmIueQ7MehA" }, { title: "BAC log convexité intégration", url: "https://youtu.be/dw-xgU8GAsM" }],
        extraLinks: [
      { name: "Lycée d'Adultes — Cours Exp & Logarithme", url: "https://www.lyceedadultes.fr/sitepedagogique/documents/math/mathTermSpe/05_rappels_exp_fnt_ln/05_cours_rappels_exp_fnt_ln.pdf", icon: "" },
      { name: "Lycée d'Adultes — Exercices Exp & Logarithme", url: "https://www.lyceedadultes.fr/sitepedagogique/documents/math/mathTermSpe/05_rappels_exp_fnt_ln/05_exos_rappels_exp_fnt_ln.pdf", icon: "" },
      { name: "Lycée d'Adultes — Exercices type BAC ln", url: "https://www.lyceedadultes.fr/sitepedagogique/documents/math/mathTermSpe/05_rappels_exp_fnt_ln/05_exos_rappels_exp_fnt_ln_bis.pdf", icon: "" },
      { name: "Lycée d'Adultes — Contrôle Exp/Ln (corrigé)", url: "https://www.lyceedadultes.fr/sitepedagogique/documents/math/mathTermSpe/ctrle_2025_2026/05_ctrle_17_12_2025_correction.pdf", icon: "" },
      { name: "XYMaths — Annales BAC Logarithme", url: "https://xymaths.fr/Lycee/Terminale-generale-specialite-mathematiques/exercices-bac-sujets-corriges/logarithme.php", icon: "🎓" },
      { name: "Mathovore — Logarithme corrigés", url: "https://mathovore.fr/le-logarithme-neperien-exercices-maths-terminale-corriges-en-pdf", icon: "📘" },
      { name: "Math93 — DS corrigés", url: "https://www.math93.com/annales-du-bac/bac-specialite-mathematiques/annales-maths-2025.html", icon: "📊" },
    ],
    sections: ["Définition ln", "Propriétés algébriques", "Dérivée ln et ln(u)", "Équations/inéquations", "Croissances comparées"],
    keyFormulas: [{ name: "Définition", formula: "y = ln(x) ⟺ x = eʸ" }, { name: "ln(ab)", formula: "ln(a) + ln(b)" }, { name: "ln(a/b)", formula: "ln(a) − ln(b)" }, { name: "ln(aⁿ)", formula: "n × ln(a)" }, { name: "ln(√a)", formula: "[[1|2]] × ln(a)" }, { name: "(ln x)'", formula: "[[1|x]]" }, { name: "(eˣ)'", formula: "eˣ" }, { name: "e^(a+b)", formula: "eᵃ × eᵇ" }, { name: "e^(ln x)", formula: "x (pour x > 0)" }, { name: "ln(eˣ)", formula: "x" }, { name: "ln(1) = 0", formula: "ln(e) = 1" }, { name: "Signe ln", formula: "x > 1 ⟹ ln(x) > 0 ; 0 < x < 1 ⟹ ln(x) < 0" }, { name: "lim ln", formula: "x→+∞ : +∞ ; x→0⁺ : −∞" }, { name: "lim eˣ", formula: "x→+∞ : +∞ ; x→−∞ : 0" }],
    quiz: [
      { q: "ln(1)=?", choices: ["0", "1", "e", "−1"], answer: 0, explanation: "e⁰=1." },
      { q: "ln(e³)=?", choices: ["3", "e³", "3e", "ln3"], answer: 0, explanation: "ln(eˣ)=x." },
      { q: "Domaine ln(2x−1):", choices: ["]1/2,+∞[", "ℝ", "]0,+∞[", "[1/2,+∞["], answer: 0, explanation: "2x−1>0⟺x>1/2." },
      { q: "lim(x→0⁺) ln(x)=?", choices: ["−∞", "0", "+∞", "1"], answer: 0, explanation: "ln tend vers −∞ en 0⁺." }
    ],
    exercises: [
      { title: "Équation", statement: "Résoudre dans ℝ l'équation : ln(x) + ln(x−1) = ln(2).\nOn commencera par déterminer l'ensemble de définition.", hint: "ln(ab)=ln(a)+ln(b).", solution: "Domaine : il faut x > 0 ET x−1 > 0, donc x > 1.\n\nOn utilise ln(a) + ln(b) = ln(a × b) :\nln(x) + ln(x−1) = ln(x(x−1)) = ln(2).\n\nComme ln est injective : x(x−1) = 2 → x² − x − 2 = 0.\nΔ = 1+8 = 9, √Δ = 3. x = (1+3) ÷ 2 = 2 ou x = (1−3) ÷ 2 = −1.\n\nOr x > 1, donc x = −1 est exclu.  Solution : x = 2." },
      { title: "Étude", statement: "Soit f définie sur ]0, +∞[ par f(x) = [[ln(x)|x]].\n1) Calculer f'(x) et étudier son signe.\n2) Dresser le tableau de variations.\n3) Déterminer la limite de f en +∞.", hint: "f'=(1−ln x)/x².", solution: "f(x) = ln(x) ÷ x. Domaine : x > 0. Dérivée avec la formule (u/v)' :\nf'(x) = (1/x × x − ln(x) × 1) ÷ x² = [[1 − ln(x)|x²]].\nf'(x) = 0 ⟺ 1 − ln(x) = 0 ⟺ ln(x) = 1 ⟺ x = e.\n\nSi x < e : ln(x) < 1, donc f' > 0 (croissante).\n\nSi x > e : ln(x) > 1, donc f' < 0 (décroissante).\n\nMaximum en x = e : f(e) = [[ln(e)|e]] = [[1|e]] ≈ 0.37.\n\nPar croissance comparée : ln(x) ÷ x → 0 quand x → +∞. " },
      { title: "Inéquation", statement: "Résoudre dans ℝ l'inéquation : ln(x − 1) > ln(3).\nOn déterminera d'abord l'ensemble de définition.", hint: "ln strictement croissante.", solution: "Domaine : il faut x−1 > 0 donc x > 1.\n\nComme ln est strictement croissante :\nln(x−1) > ln(3) ⟺ x−1 > 3 ⟺ x > 4.\n\nOn vérifie que x > 4 est bien dans le domaine (x > 1 : oui).\n\n Ensemble solution : S = ]4, +∞[." },
      { title: "Croissance comparée", statement: "Déterminer la limite de [[(ln x)²|x]] quand x tend vers +∞.\nOn pourra utiliser les croissances comparées.", hint: "Posez X=ln x → x=eˣ.", solution: "On sait par croissance comparée que ln(x) ÷ √x → 0 quand x → +∞.\n\nDonc (ln(x))² ÷ x = [ln(x) ÷ √x]² → 0² = 0.\nAutrement dit, même élevé au carré, ln(x) est 'écrasé' par x.\n\n La limite vaut 0." }
    ]
  },
  { id: "trigo", title: "Fonctions trigonométriques", icon: "π", color: "#06b6d4", theme: "Analyse", metLink: `${BASE}#7`, coursePdf: [`${T}20TrigoT.pdf`], courseVideo: "https://youtu.be/wJjb3CSS3cg",
    methodVideos: [
      { cat: "Équations", title: "Éq. trigo (1)", url: "https://youtu.be/p6U55YsS440" },
      { cat: "Équations", title: "Éq. trigo (2)", url: "https://youtu.be/PcgvyxU5FCc" },
      { cat: "Équations", title: "Inéq. trigo", url: "https://youtu.be/raU77Qb_-Iw" },
      { cat: "Parité/Périodicité", title: "Graphiquement", url: "https://youtu.be/RV3Bi06nQOs" },
      { cat: "Parité/Périodicité", title: "Étudier parité", url: "https://youtu.be/hrbgxnCZW_I" },
      { cat: "Parité/Périodicité", title: "Compléter graphique", url: "https://youtu.be/KbCpqXSvR8M" },
      { cat: "Étude complète", title: "1/4 Parité", url: "https://youtu.be/uOXv5XnAiNk" },
      { cat: "Étude complète", title: "2/4 Périodicité", url: "https://youtu.be/s3S85RL06ks" },
      { cat: "Étude complète", title: "3/4 Variations", url: "https://youtu.be/X6vJog_xQRY" },
      { cat: "Étude complète", title: "4/4 Représentation", url: "https://youtu.be/ol6UtCpFDQM" }
    ],
    demoVideos: [], exerciseVideos: [],
        extraLinks: [
      { name: "Lycée d'Adultes — Cours Sinus & Cosinus", url: "https://www.lyceedadultes.fr/sitepedagogique/documents/math/mathTermSpe/06_fnts_sinus_cosinus/06_cours_fnts_sinus_cosinus.pdf", icon: "" },
      { name: "Lycée d'Adultes — Exercices Sinus & Cosinus", url: "https://www.lyceedadultes.fr/sitepedagogique/documents/math/mathTermSpe/06_fnts_sinus_cosinus/06_exos_fnts_sinus_cosinus.pdf", icon: "" },
      { name: "Lycée d'Adultes — Résumé Équations Trigo", url: "https://www.lyceedadultes.fr/sitepedagogique/documents/math/mathTermSpe/06_fnts_sinus_cosinus/06_resume_equations_trigo.pdf", icon: "" },
      { name: "XYMaths — Exercices Trigo", url: "https://xymaths.fr/Lycee/Terminale-generale-specialite-mathematiques/Exercices-corriges/liste-sujets/trigonometrie/", icon: "🎓" },
      { name: "APMEP — Annales BAC", url: "https://www.apmep.fr/Annales-Terminale-Generale", icon: "" },
    ],
    sections: ["sin/cos dérivées", "Parité/périodicité", "Formules d'addition", "Formules duplication", "Éq./inéq. trigo"],
    keyFormulas: [{ name: "cos(a+b)", formula: "cos a·cos b − sin a·sin b" }, { name: "sin(a+b)", formula: "sin a·cos b + cos a·sin b" }, { name: "cos(2a)", formula: "2cos²a − 1 = 1 − 2sin²a" }, { name: "sin(2a)", formula: "2 sin a·cos a" }, { name: "(sin x)'", formula: "cos x" }, { name: "(cos x)'", formula: "−sin x" }, { name: "Identité", formula: "cos²x + sin²x = 1" }, { name: "π/6", formula: "cos = [[√(3)|2]], sin = [[1|2]]" }, { name: "π/4", formula: "cos = sin = [[√(2)|2]]" }, { name: "π/3", formula: "cos = [[1|2]], sin = [[√(3)|2]]" }],
    quiz: [
      { q: "cos(π/3)=?", choices: ["1/2", "√3/2", "0", "√2/2"], answer: 0, explanation: "cos(60°)=1/2." },
      { q: "(sin x)'=?", choices: ["cos x", "−cos x", "sin x", "−sin x"], answer: 0, explanation: "Dérivée classique." },
      { q: "cos²x+sin²x=?", choices: ["1", "0", "2", "cos(2x)"], answer: 0, explanation: "Identité fondamentale." }
    ],
    exercises: [
      { title: "Éq. trigo", statement: "Résoudre sur [0, 2π] l'équation : cos(2x) = cos(x).\nOn utilisera la propriété : cos(A) = cos(B) ⟺ A = ±B + 2kπ.", hint: "cos A=cos B ⟺ A=±B+2kπ.", solution: "cos(A) = cos(B) a deux familles de solutions :\n1) A = B + 2kπ → 2x = x + 2kπ → x = 2kπ. Sur [0,2π] : x = 0 et x = 2π.\n2) A = −B + 2kπ → 2x = −x + 2kπ → 3x = 2kπ → x = 2kπ/3.\nSur [0,2π] : x = 0, x = 2π/3, x = 4π/3, x = 2π.\n\n Solutions : {0, 2π/3, 4π/3, 2π}." },
      { title: "Étude trigo", statement: "Soit f(x) = 2sin(x) + sin(2x). Calculer la dérivée f'(x).\nOn pourra simplifier en utilisant la formule cos(2x) = 2cos²(x) − 1.", hint: "f'=2cos x+2cos(2x).", solution: "f(x) = 2sin(x) + sin(2x).\n\nOn dérive terme par terme :\n(2sin(x))' = 2cos(x).\n(sin(2x))' = 2cos(2x) (dérivée de sin(u) = u'cos(u) avec u = 2x).\n\nDonc f'(x) = 2cos(x) + 2cos(2x).\nPour simplifier, on utilise cos(2x) = 2cos²(x) − 1 :\nf'(x) = 2cos(x) + 2(2cos²(x) − 1) = 4cos²(x) + 2cos(x) − 2. " },
      { title: "Formule duplication", statement: "Simplifier l'expression cos²(x) − sin²(x) en utilisant une formule de duplication.", hint: "Formule de cos(2x).", solution: "C'est directement la formule de duplication du cosinus :\ncos(2x) = cos²(x) − sin²(x).\nPas besoin de calcul : il suffit de reconnaître la formule ! " },
      { title: "Inéquation", statement: "Résoudre sur [0, 2π] l'inéquation : sin(x) ≥ [[1|2]].\nOn cherchera d'abord les valeurs où sin(x) = [[1|2]].", hint: "Quand sin(x)=1/2 sur le cercle?", solution: "On cherche d'abord quand sin(x) = 1/2 sur [0, 2π] :\nsin(x) = 1/2 ⟺ x = π/6 (30°) ou x = 5π/6 (150°).\nSur le cercle trigo, sin(x) ≥ 1/2 entre ces deux valeurs (la partie haute).\n\n Solution : x ∈ [π/6, 5π/6]." }
    ]
  },
  { id: "primitives", title: "Primitives & Éq. diff.", icon: "∫'", color: "#fb923c", theme: "Analyse", metLink: `${BASE}#8`, coursePdf: [`${T}20Prim-EdT.pdf`], courseVideo: "https://youtu.be/bQ-eS1zZCdw",
    methodVideos: [
      { cat: "Primitives", title: "Vérifier primitive", url: "https://youtu.be/7tQqY9Vkmss" },
      { cat: "Primitives", title: "Calculer LA primitive", url: "https://youtu.be/-q9M7oJ9gkI" },
      { cat: "Primitives", title: "Primitive (1)", url: "https://youtu.be/GA6jMgLd_Cw" },
      { cat: "Primitives", title: "Primitive (2)", url: "https://youtu.be/82HYI4xuClw" },
      { cat: "Primitives", title: "Primitive (3)", url: "https://youtu.be/gxRpmHWnoGQ" },
      { cat: "Primitives", title: "Primitive (4)", url: "https://youtu.be/iiq6eUQee9g" },
      { cat: "Éq. diff.", title: "Vérifier solution", url: "https://youtu.be/LX8PxR-ScfM" },
      { cat: "Éq. diff.", title: "y'=ay", url: "https://youtu.be/YJNHTq85tJA" },
      { cat: "Éq. diff.", title: "y'=ay+b (1)", url: "https://youtu.be/F_LQLZ8rUhg" },
      { cat: "Éq. diff.", title: "y'=ay+b (2)", url: "https://youtu.be/CFZr44vny3w" },
      { cat: "Éq. diff.", title: "y'=ay+f", url: "https://youtu.be/QeGvVncvyLc" },
      { cat: "Éq. diff.", title: "Cours éq. diff. vidéo", url: "https://youtu.be/qHF5kiDFkW8" }
    ],
    demoVideos: [{ title: "Deux primitives diffèrent d'une cte", url: "https://youtu.be/oloWk2F4bI8" }, { title: "Solutions de y'=ay", url: "https://youtu.be/FQlxi8JKmg4" }],
    exerciseVideos: [{ title: "BAC Éq. diff, expo, suites", url: "https://youtu.be/VMRsAkKAVZo" }],
        extraCourseLinks: [
      { name: "Lycée d'Adultes — Cours Primitives & Éq. diff.", url: "https://www.lyceedadultes.fr/sitepedagogique/documents/math/mathTermSpe/07_primitives-eq_diff/07_cours_primitives_eq_diff.pdf", icon: "📖" },
      { name: "Mathoutils — Cours Primitives & Éq. diff.", url: "https://www.mathoutils.fr/cours-et-exercices/terminale-generale/primitives-et-equations-differentielles/", icon: "📖" },
    ],
    extraLinks: [
      { name: "Lycée d'Adultes — Exercices Primitives & Éq. diff.", url: "https://www.lyceedadultes.fr/sitepedagogique/documents/math/mathTermSpe/07_primitives-eq_diff/07_exos_primitives_eq_diff.pdf", icon: "📝" },
      { name: "Mathoutils — Exercices corrigés Primitives & Éq. diff.", url: "https://www.mathoutils.fr/cours-et-exercices/terminale-generale/primitives-et-equations-differentielles-exercices-corriges/", icon: "📝" },
      { name: "XYMaths — Annales Primitives/Intégrales", url: "https://xymaths.fr/Lycee/Terminale-generale-specialite-mathematiques/exercices-bac-sujets-corriges/integrales.php", icon: "🎓" },
      { name: "Annales2maths — BAC corrigés", url: "https://www.annales2maths.com/sujets-et-corrections-de-bac-specialite-mathematiques/", icon: "🎓" },
    ],
    sections: ["Primitives usuelles", "Condition initiale", "y'=ay", "y'=ay+b", "Modélisation"],
    formulaLinks: [
      { name: "Tableau des primitives (référence)", url: "https://www.lyceedadultes.fr/sitepedagogique/documents/math/mathTermSpe/07_primitives-eq_diff/07_tableau_primitives.pdf" }
    ],
    keyFormulas: [
{ name: "∫ k (constante)", formula: "kx + C" },
{ name: "∫ xⁿ (n≠−1)", formula: "[[xⁿ⁺¹|n+1]] + C" },
{ name: "∫ [[1|x]]", formula: "ln│x│ + C" },
{ name: "∫ [[1|x²]]", formula: "−[[1|x]] + C" },
{ name: "∫ [[1|√(x)]]", formula: "2√(x) + C" },
{ name: "∫ eˣ", formula: "eˣ + C" },
{ name: "∫ e^(ax)", formula: "[[1|a]] × e^(ax) + C" },
{ name: "∫ e^(ax+b)", formula: "[[1|a]] × e^(ax+b) + C" },
{ name: "∫ cos(x)", formula: "sin(x) + C" },
{ name: "∫ sin(x)", formula: "−cos(x) + C" },
{ name: "∫ cos(ax+b)", formula: "[[1|a]] × sin(ax+b) + C" },
{ name: "∫ sin(ax+b)", formula: "−[[1|a]] × cos(ax+b) + C" },
{ name: "∫ [[1|cos²(x)]]", formula: "tan(x) + C" },
{ name: "∫ u'×uⁿ", formula: "[[uⁿ⁺¹|n+1]] + C" },
{ name: "∫ [[u'|u]]", formula: "ln│u│ + C" },
{ name: "∫ u'×eᵘ", formula: "eᵘ + C" },
{ name: "∫ u'×cos(u)", formula: "sin(u) + C" },
{ name: "∫ u'×sin(u)", formula: "−cos(u) + C" },
{ name: "y' = ay", formula: "y = C × e^(ax)" },
{ name: "y' = ay + b", formula: "y = C × e^(ax) − [[b|a]]" },
{ name: "Sol. part. y'=ay+b", formula: "y₀ = −[[b|a]] (constante)" },
{ name: "Méthode éq. diff.", formula: "1) Sol. gén. 2) Condition init. → C" },
{ name: "Vérification", formula: "Toujours dériver F pour vérifier F' = f" },
],
    traps: [
      { mistake: "Oublier le + C", correct: "∫ 2x dx = x² + C", wrong: "∫ 2x dx = x²", tip: "Une primitive n'est jamais unique ! Il y a toujours une constante C. Sans condition initiale → garder + C." },
      { mistake: "Oublier le [[1|a]] devant", correct: "∫ e³ˣ dx = [[1|3]]e³ˣ + C", wrong: "∫ e³ˣ dx = e³ˣ + C", tip: "Quand on a f(ax+b), on divise toujours par a. Vérifier en dérivant : ([[1|3]]e³ˣ)' = e³ˣ ✓" },
      { mistake: "Primitive de sin = cos (sans le −)", correct: "∫ sin(x) dx = −cos(x) + C", wrong: "∫ sin(x) dx = cos(x) + C", tip: "Moyen mnémotechnique : Sin Commence par S = Signe change (le − apparaît)." },
      { mistake: "Confondre y'=ay et y'=ay+b", correct: "y'=2y−6 → y = Ce²ˣ + 3", wrong: "y'=2y−6 → y = Ce²ˣ − 6", tip: "y₀ = −b/a (pas juste b !). Ici −(−6)/2 = 3. Toujours vérifier : si y=3, y'=0 et 2×3−6=0 ✓" },
      { mistake: "Mauvais signe dans e^(ax)", correct: "y'=−3y → y = Ce⁻³ˣ", wrong: "y'=−3y → y = Ce³ˣ", tip: "Le coefficient a dans y'=ay passe directement dans l'exposant. Si a est négatif, l'exposant l'est aussi." },
      { mistake: "Oublier de déterminer C", correct: "y(0)=5 → C+y₀=5 → C=...", wrong: "y = Ce^(ax) + y₀ (sans calculer C)", tip: "La condition initiale sert à trouver C. Remplacer x=0, résoudre l'équation en C." },
      { mistake: "Primitive de [[1|x]] = [[1|x²]]", correct: "∫ [[1|x]] dx = ln│x│ + C", wrong: "∫ [[1|x]] dx = [[1|x²]] + C", tip: "[[1|x²]] = −(x⁻¹)', c'est la DÉRIVÉE de −[[1|x]], pas sa primitive. ∫[[1|x]] = ln│x│." },
      { mistake: "Ne pas reconnaître la forme u'/u", correct: "∫ [[2x|x²+1]] = ln(x²+1) + C", wrong: "Je ne sais pas faire cette primitive", tip: "Toujours regarder si le numérateur est la dérivée du dénominateur → c'est un ln !" },
      { mistake: "Confondre primitive et dérivée", correct: "Primitive = l'opération inverse de dériver", wrong: "F' = f donc F est la dérivée de f", tip: "F est primitive de f signifie F' = f. C'est f qui est la dérivée, F est la primitive." },
    ],
    quiz: [
      { q: "Primitive de 3x²:", choices: ["x³+C", "6x+C", "x³", "3x³+C"], answer: 0, explanation: "3x²→x³+C." },
      { q: "Primitive de sin(x) :", choices: ["−cos(x)+C", "cos(x)+C", "sin(x)+C", "−sin(x)+C"], answer: 0, explanation: "(−cos x)' = sin x." },
      { q: "Primitive de e³ˣ :", choices: ["[[1|3]]e³ˣ+C", "3e³ˣ+C", "e³ˣ+C", "[[1|3]]eˣ+C"], answer: 0, explanation: "∫e^(ax) = [[1|a]]e^(ax)+C, ici a=3." },
      { q: "Primitive de [[1|x]] (x>0) :", choices: ["ln(x)+C", "−[[1|x²]]+C", "eˣ+C", "x+C"], answer: 0, explanation: "(ln x)' = [[1|x]]." },
      { q: "F primitive de f, F(0)=2, f(x)=4x. F(x)=?", choices: ["2x²+2", "2x²", "4x²+2", "2x+2"], answer: 0, explanation: "F(x)=2x²+C, F(0)=C=2 → F(x)=2x²+2." },
      { q: "Primitive de 2x·eˣ² :", choices: ["eˣ²+C", "2eˣ²+C", "x²eˣ²+C", "[[eˣ²|2x]]+C"], answer: 0, explanation: "Forme u'eᵘ avec u=x² → eˣ²+C." },
      { q: "y'=2y →", choices: ["y=Ce²ˣ", "y=2x+C", "y=e²ˣ", "y=C·2x"], answer: 0, explanation: "y'=ay → y=Ce^(ax), ici a=2." },
      { q: "y'=−y, y(0)=5 →", choices: ["5e⁻ˣ", "−5eˣ", "5eˣ", "e⁻⁵ˣ"], answer: 0, explanation: "Sol gén: y=Ce⁻ˣ. y(0)=C=5 → y=5e⁻ˣ." },
      { q: "Solution particulière de y'=3y−6 :", choices: ["y=2", "y=6", "y=3", "y=−2"], answer: 0, explanation: "y₀=−b/a=−(−6)/3=2." },
      { q: "y'=−2y+10, y(0)=3 →", choices: ["−2e⁻²ˣ+5", "3e⁻²ˣ+5", "3e²ˣ−5", "−2e²ˣ+5"], answer: 0, explanation: "Sol gén: Ce⁻²ˣ+5. y(0)=C+5=3 → C=−2. y=−2e⁻²ˣ+5." },
      { q: "Deux primitives d'une même fonction diffèrent de :", choices: ["Une constante", "Un facteur", "La variable x", "Rien"], answer: 0, explanation: "Si F et G sont primitives de f, alors F−G=constante." },
      { q: "∫ cos(2x) dx =", choices: ["[[sin(2x)|2]]+C", "sin(2x)+C", "2sin(2x)+C", "−[[sin(2x)|2]]+C"], answer: 0, explanation: "∫cos(ax+b)=[[1|a]]sin(ax+b)+C, ici a=2." }
    ],
    exercises: [
      { title: "Éq. diff.", statement: "Résoudre l'équation différentielle y' = −3y + 6 avec la condition initiale y(0) = 1.\nOn écrira d'abord la solution générale, puis on déterminera la constante.", hint: "y=Ce⁻³ˣ+2.", solution: "L'équation y' = −3y + 6 se réécrit y' = −3(y − 2).\nC'est la forme y' = a(y − b) avec a = −3 et b = 2.\nSolution générale : y = Ce⁻³ˣ + 2 (avec C une constante).\nCondition initiale y(0) = 1 : C × e⁰ + 2 = 1, donc C + 2 = 1, donc C = −1.\n\n Solution : y(x) = −e⁻³ˣ + 2." },
      { title: "Primitives", statement: "Soit f(x) = 2x × e^(x²). Déterminer la primitive F de f telle que F(0) = 3.", hint: "Remarquer que (eˣ²)'=2xeˣ².", solution: "On remarque que f(x) = 2x × eˣ² a la forme u' × eᵘ avec u = x² (car u' = 2x).\n\nOr la primitive de u' × eᵘ est eᵘ.\n\nDonc F(x) = eˣ² + C.\nCondition F(0) = 3 : e⁰ + C = 1 + C = 3, donc C = 2.\n\n F(x) = eˣ² + 2." },
      { title: "Modélisation", statement: "Une population P vérifie l'équation P'(t) = 0.02 × P(t) avec P(0) = 1000 individus.\nDéterminer P(t) en fonction de t et interpréter le résultat.", hint: "y'=ay avec a=0.02.", solution: "P' = 0.02 × P est de la forme y' = ay avec a = 0.02.\nSolution : P(t) = P(0) × e^(at) = 1000 × e^(0.02t).\nCela signifie que la population croît de 2% par unité de temps.\n\n P(t) = 1000 × e^(0.02t)." },
      { title: "Éq. diff. 2", statement: "Résoudre l'équation différentielle y' = 2y − 4 avec la condition initiale y(0) = 5.", hint: "Sol. gén: y=Ce²ˣ+2.", solution: "y' = 2y − 4 se réécrit y' = 2(y − 2).\nC'est la forme y' = a(y − b) avec a = 2 et b = 2.\nSolution générale : y = Ce²ˣ + 2.\ny(0) = 5 : C × e⁰ + 2 = C + 2 = 5, donc C = 3.\n\n y(x) = 3e²ˣ + 2." },
      { title: "Primitive composée", statement: "Déterminer une primitive de f(x) = [[6x|(x²+1)²]].", hint: "Poser u = x²+1, que vaut u' ?", solution: "On pose u = x² + 1, donc u' = 2x.\nOn remarque que f(x) = [[6x|(x²+1)²]] = 3 × [[2x|(x²+1)²]] = 3 × u' × u⁻².\n\nOr ∫ u' × uⁿ = [[uⁿ⁺¹|n+1]] + C. Ici n = −2, donc n+1 = −1.\n\n∫ 3 × u' × u⁻² = 3 × [[u⁻¹|−1]] + C = −[[3|u]] + C.\n\n F(x) = −[[3|x²+1]] + C." },
      { title: "Primitive trigo", statement: "Déterminer la primitive F de f(x) = sin(3x + π/4) telle que F(0) = 1.", hint: "∫sin(ax+b) = −[[1|a]]cos(ax+b)+C.", solution: "On utilise la formule ∫ sin(ax+b) = −[[1|a]] cos(ax+b) + C avec a = 3, b = π/4.\n\nF(x) = −[[1|3]] cos(3x + π/4) + C.\n\nCondition F(0) = 1 :\n−[[1|3]] cos(π/4) + C = 1\n−[[1|3]] × [[√2|2]] + C = 1\nC = 1 + [[√2|6]]\n\n F(x) = −[[1|3]] cos(3x + π/4) + 1 + [[√2|6]]." },
      { title: "Vérifier une primitive", statement: "On donne F(x) = (2x+1)eˣ. Vérifier que F est une primitive de f(x) = (2x+3)eˣ.", hint: "Dériver F avec la formule (uv)' = u'v + uv'.", solution: "On dérive F(x) = (2x+1)eˣ avec la formule du produit :\nF'(x) = (2x+1)' × eˣ + (2x+1) × (eˣ)'\nF'(x) = 2 × eˣ + (2x+1) × eˣ\nF'(x) = eˣ(2 + 2x + 1)\nF'(x) = (2x+3)eˣ = f(x). ✓\n\n F'(x) = f(x), donc F est bien une primitive de f." },
      { title: "Éq. diff. y'=ay", statement: "La température T d'un objet refroidit selon T'(t) = −0.5 T(t). À t = 0, T = 80°C.\n1) Résoudre l'équation.\n2) Quelle est la température après 2 minutes ?", hint: "y'=ay avec a=−0.5.", solution: "1) T' = −0.5T est de la forme y' = ay avec a = −0.5.\nSolution : T(t) = C × e⁻⁰·⁵ᵗ.\nT(0) = 80 : C = 80.\n T(t) = 80e⁻⁰·⁵ᵗ.\n\n2) T(2) = 80 × e⁻¹ = 80 × 0.368 ≈ 29.4°C.\n\n Après 2 min, la température est d'environ 29.4°C." },
      { title: "Éq. diff. y'=ay+b complète", statement: "Une population de bactéries vérifie P'(t) = 0.1P(t) − 200, avec P(0) = 3000.\n1) Déterminer P(t).\n2) Vers quelle valeur tend P(t) quand t → +∞ ?", hint: "Sol. part: P₀ = −b/a = 200/0.1 = 2000.", solution: "1) P' = 0.1P − 200 est de la forme y' = ay + b avec a = 0.1, b = −200.\nSolution particulière : P₀ = −[[b|a]] = −[[−200|0.1]] = 2000.\nSolution générale : P(t) = Ce⁰·¹ᵗ + 2000.\nP(0) = 3000 : C + 2000 = 3000 → C = 1000.\n P(t) = 1000e⁰·¹ᵗ + 2000.\n\n2) Quand t → +∞, e⁰·¹ᵗ → +∞, donc P(t) → +∞.\nLa population croît sans borne car a > 0 et C > 0." },
      { title: "Primitive de u'/u", statement: "Déterminer une primitive de f(x) = [[2x + 1|x² + x + 3]].", hint: "Que vaut la dérivée du dénominateur ?", solution: "Posons u(x) = x² + x + 3.\nAlors u'(x) = 2x + 1.\n\nOn reconnaît f(x) = [[u'(x)|u(x)]].\n\nOr ∫ [[u'|u]] = ln|u| + C.\n\nDe plus, u(x) = x² + x + 3 > 0 pour tout x (discriminant = 1 − 12 < 0).\n\n F(x) = ln(x² + x + 3) + C." },
      { title: "Éq. diff. + vérification", statement: "1) Résoudre y' + 5y = 15 avec y(0) = 0.\n2) Vérifier que la solution trouvée satisfait bien l'équation.", hint: "Réécrire : y' = −5y + 15.", solution: "1) On réécrit : y' = −5y + 15 = −5(y − 3).\nForme y' = a(y − b) avec a = −5, b = 3.\nSolution générale : y = Ce⁻⁵ˣ + 3.\ny(0) = 0 : C + 3 = 0 → C = −3.\n y(x) = −3e⁻⁵ˣ + 3 = 3(1 − e⁻⁵ˣ).\n\n2) Vérification :\ny' = −3 × (−5)e⁻⁵ˣ = 15e⁻⁵ˣ.\ny' + 5y = 15e⁻⁵ˣ + 5(−3e⁻⁵ˣ + 3) = 15e⁻⁵ˣ − 15e⁻⁵ˣ + 15 = 15. ✓" }
    ]
  },
  { id: "integration", title: "Calcul intégral", icon: "∫", color: "#ef4444", theme: "Analyse", metLink: `${BASE}#9`, coursePdf: [`${T}20IntegT1.pdf`, `${T}20IntegT2.pdf`], courseVideo: "https://youtu.be/pFKzXZrMVxs",
    methodVideos: [
      { cat: "Calcul", title: "Aire (1)", url: "https://youtu.be/jkxNKkmEXZA" },
      { cat: "Calcul", title: "Aire (2)", url: "https://youtu.be/l2zuaZukc0g" },
      { cat: "Calcul", title: "Fonction définie par intégrale", url: "https://youtu.be/6DHXw5TRzN4" },
      { cat: "Calcul", title: "Intégrale (1)", url: "https://youtu.be/Z3vKJJE57Uw" },
      { cat: "Calcul", title: "Intégrale (2)", url: "https://youtu.be/8ci1RrNH1L0" },
      { cat: "Calcul", title: "Intégrale (3)", url: "https://youtu.be/uVMRZSmYcQE" },
      { cat: "Calcul", title: "Linéarité", url: "https://youtu.be/B9n_AArwjKw" },
      { cat: "Calcul", title: "Encadrer intégrale", url: "https://youtu.be/VK0PvzWBIso" },
      { cat: "Applications", title: "Aire entre courbes", url: "https://youtu.be/oRSAYNwUiHQ" },
      { cat: "Applications", title: "Valeur moyenne", url: "https://youtu.be/oVFHojz5y50" },
      { cat: "Par parties", title: "IPP (1)", url: "https://youtu.be/uNIpYeaNfsg" },
      { cat: "Par parties", title: "IPP (2)", url: "https://youtu.be/vNQeSEb2mj8" },
      { cat: "Par parties", title: "IPP (3)", url: "https://youtu.be/xbb3vnzF3EA" },
      { cat: "Suites", title: "Suite d'intégrales", url: "https://youtu.be/8I0jA4lClKM" }
    ],
    demoVideos: [{ title: "F(x)=∫f(t)dt est primitive", url: "https://youtu.be/p2W6FYBxTlo" }, { title: "∫f=F(b)−F(a)", url: "https://youtu.be/S3reCPS4dq4" }, { title: "Formule IPP", url: "https://youtu.be/v3TdIdu0sgk" }],
    exerciseVideos: [{ title: "BAC Expo intégration algo", url: "https://youtu.be/JpdTZYEJBpA" }, { title: "BAC Expo dérivation intégration", url: "https://youtu.be/vaRkqrCCWPY" }, { title: "BAC Log dérivation intégration", url: "https://youtu.be/akJabWOn3jU" }, { title: "BAC Log convexité intégration", url: "https://youtu.be/dw-xgU8GAsM" }],
        extraLinks: [
      { name: "Lycée d'Adultes — Cours Calcul intégral", url: "https://www.lyceedadultes.fr/sitepedagogique/documents/math/mathTermSpe/08_calcul_integral/08_cours_calcul_integral.pdf", icon: "" },
      { name: "Lycée d'Adultes — Exercices Calcul intégral", url: "https://www.lyceedadultes.fr/sitepedagogique/documents/math/mathTermSpe/08_calcul_integral/08_exos_calcul_integral.pdf", icon: "" },
      { name: "XYMaths — Annales BAC Intégration", url: "https://xymaths.fr/Lycee/Terminale-generale-specialite-mathematiques/exercices-bac-sujets-corriges/integrales.php", icon: "🎓" },
      { name: "Mathovore — Intégrales corrigés", url: "https://mathovore.fr/les-integrales-exercices-maths-terminale-corriges-en-pdf", icon: "📘" },
      { name: "Math93 — Sujets BAC", url: "https://www.math93.com/annales-du-bac/bac-specialite-mathematiques/annales-maths-2025.html", icon: "📊" },
    ],
    sections: ["Intégrale et aire", "Propriétés", "Calcul avec primitives", "Encadrement", "Aire entre courbes", "Valeur moyenne", "IPP"],
    keyFormulas: [{ name: "Fondamental", formula: "∫ₐᵇ f(x)dx = F(b) − F(a)" }, { name: "IPP", formula: "∫ₐᵇ u'v = [uv]ₐᵇ − ∫ₐᵇ uv'" }, { name: "Val. moyenne", formula: "μ = [[1|b−a]] × ∫ₐᵇ f(x)dx" }, { name: "Linéarité", formula: "∫(αf + βg) = α∫f + β∫g" }, { name: "Chasles", formula: "∫ₐᵇ f + ∫ᵇᶜ f = ∫ₐᶜ f" }, { name: "Positivité", formula: "f ≥ 0 ⟹ ∫ₐᵇ f ≥ 0" }, { name: "Aire", formula: "A = ∫ₐᵇ |f(x) − g(x)| dx" }, { name: "Unité aire", formula: "1 u.a. = |OI⃗| × |OJ⃗|" }],
    quiz: [
      { q: "∫₀¹ 2x dx=?", choices: ["1", "2", "0", "1/2"], answer: 0, explanation: "[x²]₀¹=1." },
      { q: "∫₁ᵉ 1/x dx=?", choices: ["1", "e", "0", "e−1"], answer: 0, explanation: "[ln x]₁ᵉ=1." },
      { q: "Valeur moyenne de f sur [a,b]:", choices: ["[[∫f|b−a]]", "∫f", "f((a+b)/2)", "(f(a)+f(b))/2"], answer: 0, explanation: "Définition." }
    ],
    exercises: [
      { title: "Aire", statement: "Calculer l'aire, en unités d'aire, du domaine compris entre la courbe de f(x) = x², l'axe des abscisses et les droites x = 0 et x = 3.", hint: "∫₀³ x²dx.", solution: "Une primitive de x² est x³ ÷ 3.\n∫₀³ x² dx = [[x³|3]] de 0 à 3 = 3³ ÷ 3 − [[0³|3]] = [[27|3]] − 0 = 9.\n\n L'aire sous la courbe y = x² entre 0 et 3 vaut 9 unités d'aire." },
      { title: "IPP", statement: "Calculer l'intégrale ∫₀¹ x × eˣ dx en utilisant une intégration par parties (IPP).\nOn posera u = x et v' = eˣ.", hint: "u=x, v'=eˣ.", solution: "Intégration par parties (IPP) : ∫uv' = [uv] − ∫u'v.\n\nOn pose u = x (facile à dériver) et v' = eˣ (facile à intégrer).\n\nDonc u' = 1 et v = eˣ.\n∫₀¹ xeˣ dx = [x × eˣ]₀¹ − ∫₀¹ 1 × eˣ dx\n= (1×e¹ − 0×e⁰) − [eˣ]₀¹\n= e − (e − 1) = e − e + 1 = 1. " },
      { title: "Valeur moyenne", statement: "Calculer la valeur moyenne de la fonction f(x) = x² sur l'intervalle [0, 3].\nFormule : μ = [[1|b−a]] × ∫ₐᵇ f(x) dx.", hint: "μ = [[1|3]] × ∫₀³ x²dx.", solution: "La valeur moyenne de f sur [a,b] est μ = [1 ÷ (b−a)] × ∫ₐᵇ f(x)dx.\nIci a = 0, b = 3, f(x) = x².\nμ = [[1|3]] × ∫₀³ x² dx = (1 ÷ 3) × 9 = 3.\n\n La valeur moyenne de x² sur [0,3] est 3." },
      { title: "Aire entre courbes", statement: "Calculer l'aire du domaine compris entre les courbes y = x et y = x² sur l'intervalle [0, 1].\nOn déterminera d'abord quelle courbe est au-dessus.", hint: "∫₀¹(x−x²)dx.", solution: "L'aire entre deux courbes = ∫ (courbe du haut − courbe du bas) dx.\nSur [0,1] : x ≥ x² (car 0 ≤ x ≤ 1), donc la courbe du haut est y = x.\nAire = ∫₀¹ (x − x²) dx = ([[x²|2]] − [[x³|3]]) de 0 à 1\n= (1/2 − 1/3) − (0 − 0) = [[3|6]] − [[2|6]] = [[1|6]].\n\n L'aire entre les deux courbes vaut 1/6 unité d'aire." },
      { title: "IPP double", statement: "Calculer ∫₀¹ x² × eˣ dx.\nOn effectuera deux intégrations par parties successives.", hint: "u=x², v'=eˣ. Puis IPP à nouveau.", solution: "1ère IPP : u = x², v' = eˣ → u' = 2x, v = eˣ.\n∫₀¹ x²eˣ dx = [x²eˣ]₀¹ − ∫₀¹ 2xeˣ dx = e − 2∫₀¹ xeˣ dx.\n\n2ème IPP pour ∫xeˣ : u = x, v' = eˣ → u' = 1, v = eˣ.\n∫₀¹ xeˣ dx = [xeˣ]₀¹ − ∫₀¹ eˣ dx = e − [eˣ]₀¹ = e − (e−1) = 1.\n\nDonc ∫₀¹ x²eˣ dx = e − 2×1 = e − 2 ≈ 0.72. " }
    ]
  },
  { id: "combinatoire", title: "Combinatoire", icon: "n!", color: "#facc15", theme: "Probabilités & Statistiques", metLink: `${BASE}#10`, coursePdf: [`${T}20Combi.pdf`], courseVideo: "https://youtu.be/VVY4K-OT4FI",
    methodVideos: [
      { cat: "Dénombrement", title: "Diagramme", url: "https://youtu.be/xwRvGbbu7PY" },
      { cat: "Dénombrement", title: "Principe multiplicatif", url: "https://youtu.be/wzo1XXXaaqY" },
      { cat: "Dénombrement", title: "p-uplets", url: "https://youtu.be/rlEbdewplHI" },
      { cat: "Arrangements", title: "Arrangements", url: "https://youtu.be/2fKdO9t8wfo" },
      { cat: "Permutations", title: "Permutations", url: "https://youtu.be/kWEFtcWl_xU" },
      { cat: "Combinaisons", title: "Combinaisons", url: "https://youtu.be/_ip2dV_BUTM" },
      { cat: "Combinaisons", title: "Lequel choisir ?", url: "https://youtu.be/hWkIwXXEECc" },
      { cat: "Coeff. binomiaux", title: "C(n,k) (1)", url: "https://youtu.be/-gvlrfFdaS8" },
      { cat: "Coeff. binomiaux", title: "C(n,k) (2)", url: "https://youtu.be/mfcBNlUuGaw" },
      { cat: "Coeff. binomiaux", title: "Triangle Pascal", url: "https://youtu.be/6JGrHD5nAoc" }
    ],
    demoVideos: [{ title: "Triangle de Pascal", url: "https://youtu.be/xVNjVABYOno" }, { title: "Parties d'un ensemble", url: "https://youtu.be/8MVCbhQF2ak" }],
    exerciseVideos: [],
        extraLinks: [
      { name: "Lycée d'Adultes — Cours Dénombrement", url: "https://www.lyceedadultes.fr/sitepedagogique/documents/math/mathTermSpe/09_denombrement/09_cours_denombrement.pdf", icon: "" },
      { name: "Lycée d'Adultes — Exercices Dénombrement", url: "https://www.lyceedadultes.fr/sitepedagogique/documents/math/mathTermSpe/09_denombrement/09_exos_denombrement.pdf", icon: "" },
      { name: "XYMaths — Exercices Dénombrement", url: "https://xymaths.fr/Lycee/Terminale-generale-specialite-mathematiques/Exercices-corriges/liste-sujets/denombrement/", icon: "🎓" },
      { name: "Annales2maths — Exercices Combinatoire", url: "https://www.annales2maths.com/exercices-ts/", icon: "" },
    ],
    sections: ["Principe multiplicatif", "p-uplets", "Arrangements", "Permutations", "Combinaisons", "Triangle de Pascal"],
    keyFormulas: [{ name: "n!", formula: "1 × 2 × 3 × … × n" }, { name: "Arrangements", formula: "A(n,p) = [[n!|(n−p)!]]" }, { name: "Combinaisons", formula: "C(n,p) = [[n!|p! × (n−p)!]]" }, { name: "Pascal", formula: "C(n,p) = C(n−1,p−1) + C(n−1,p)" }, { name: "Binôme Newton", formula: "(a+b)ⁿ = Σ C(n,k) aᵏ bⁿ⁻ᵏ" }],
    quiz: [
      { q: "C(6,2)=?", choices: ["15", "12", "30", "6"], answer: 0, explanation: "[[6 × 5|2]] = 15." },
      { q: "Anagrammes ABC:", choices: ["6", "3", "9", "8"], answer: 0, explanation: "3!=6." },
      { q: "3 parmi 10, sans ordre:", choices: ["Combinaison", "Arrangement", "Permutation", "p-uplet"], answer: 0, explanation: "Pas d'ordre→combinaison." }
    ],
    exercises: [
      { title: "Code", statement: "On compose un code de 4 chiffres distincts choisis parmi 0, 1, 2, ..., 9 (l'ordre compte).\nCombien de codes différents peut-on former ?", hint: "Arrangement.", solution: "On choisit 4 chiffres DISTINCTS parmi 0 à 9, et l'ORDRE compte (1234 ≠ 4321).\nPour le 1er chiffre : 10 choix (0,1,...,9).\nPour le 2ème : 9 choix (on retire celui déjà pris).\nPour le 3ème : 8 choix. Pour le 4ème : 7 choix.\nTotal = 10 × 9 × 8 × 7 = 5040 codes possibles. " },
      { title: "Comité", statement: "On souhaite former un comité de 3 personnes parmi 8 candidats. L'ordre ne compte pas. Combien de comités différents peut-on former ?", hint: "Ordre sans importance → combinaison.", solution: "On choisit 3 personnes parmi 8, et l'ORDRE ne compte pas (c'est un comité, pas un classement).\n→ C'est une combinaison.\nC(8,3) = 8! ÷ (3! × 5!) = [[8×7×6|3×2×1]] = [[336|6]] = 56.\n\n Il y a 56 comités possibles." },
      { title: "Mots", statement: "Combien de mots de 5 lettres peut-on former avec les 26 lettres de l'alphabet si les répétitions sont autorisées ?", hint: "p-uplet avec répétitions.", solution: "Chaque position du mot peut être n'importe quelle lettre (répétitions permises).\nPosition 1 : 26 choix. Position 2 : 26 choix. Etc.\nTotal = 26 × 26 × 26 × 26 × 26 = 26⁵ = 11 876 376 mots possibles. " },
      { title: "Pascal", statement: "Calculer C(10,3) + C(10,4) et vérifier que le résultat est égal à C(11,4).\nQuelle propriété des combinaisons utilise-t-on ?", hint: "Triangle de Pascal.", solution: "Par la formule de Pascal : C(n,p) + C(n,p+1) = C(n+1,p+1).\n\nDonc C(10,3) + C(10,4) = C(11,4).\nC(11,4) = [[11×10×9×8|4×3×2×1]] = [[7920|24]] = 330. " }
    ]
  },
  { id: "probabilites", title: "Loi binomiale", icon: "P", color: "#f97316", theme: "Probabilités & Statistiques", metLink: `${BASE}#14`, coursePdf: [`${T}20VA1.pdf`], courseVideo: "https://youtu.be/xMmfPUoBTtM",
    methodVideos: [
      { cat: "Probas cond.", title: "P conditionnelle", url: "https://youtu.be/SWmkdKxXf_I" },
      { cat: "Probas cond.", title: "P totales", url: "https://youtu.be/qTpTBoZA7zY" },
      { cat: "Probas cond.", title: "Indépendance", url: "https://youtu.be/wdiMq_lTk1w" },
      { cat: "Loi binomiale", title: "Arbre (loi bino)", url: "https://youtu.be/b18_r8r4K2s" },
      { cat: "Loi binomiale", title: "Coeff. binomial", url: "https://youtu.be/-gvlrfFdaS8" },
      { cat: "Loi binomiale", title: "C(n,k) formules", url: "https://youtu.be/mfcBNlUuGaw" },
      { cat: "Loi binomiale", title: "Pascal", url: "https://youtu.be/6JGrHD5nAoc" },
      { cat: "Loi binomiale", title: "P avec loi bino", url: "https://youtu.be/1gMq2TJwSh0" }
    ],
    demoVideos: [{ title: "Expression loi binomiale", url: "https://youtu.be/R45L_2gS8lU" }],
    exerciseVideos: [
      { title: "P arbre loi bino", url: "https://youtu.be/I51aPG_layY" },
      { title: "P loi binomiale", url: "https://youtu.be/ehoo0PSLWwM" },
      { title: "BAC Loi binomiale", url: "https://youtu.be/tNmiZYMG-5A" },
      { title: "BAC Probas cond. 1", url: "https://youtu.be/7V7zRFislOQ" },
      { title: "BAC Probas cond. 2", url: "https://youtu.be/8QoucS-A3SE" },
      { title: "BAC Probas cond. 3", url: "https://youtu.be/GufeEqAeav8" }
    ],
        extraLinks: [
      { name: "Lycée d'Adultes — Cours Proba & Loi binomiale", url: "https://www.lyceedadultes.fr/sitepedagogique/documents/math/mathTermSpe/10_rappels_probabilite_loi_binomiale/10_cours_rappels_probabilite_loi_binomiale.pdf", icon: "" },
      { name: "Lycée d'Adultes — Exercices Proba & Loi binomiale", url: "https://www.lyceedadultes.fr/sitepedagogique/documents/math/mathTermSpe/10_rappels_probabilite_loi_binomiale/10_exos_rappels_probabilite_loi_binomiale.pdf", icon: "" },
      { name: "Lycée d'Adultes — Contrôle Proba (corrigé)", url: "https://www.lyceedadultes.fr/sitepedagogique/documents/math/mathTermSpe/ctrle_2025_2026/10_ctrle_28_01_2026_correction.pdf", icon: "" },
      { name: "XYMaths — Annales BAC Probabilités", url: "https://xymaths.fr/Lycee/Terminale-generale-specialite-mathematiques/exercices-bac-sujets-corriges/probabilites.php", icon: "🎓" },
      { name: "Mathovore — Probabilités corrigés", url: "https://mathovore.fr/les-probabilites-exercices-maths-terminale-corriges-en-pdf", icon: "📘" },
      { name: "APMEP — Annales officielles", url: "https://www.apmep.fr/Annales-Terminale-Generale", icon: "" },
    ],
    sections: ["P conditionnelles", "Indépendance", "P totales", "Épreuves indépendantes", "Loi B(n,p)", "E(X), V(X)"],
    keyFormulas: [{ name: "P(A|B)", formula: "[[P(A∩B)|P(B)]]" }, { name: "Probas totales", formula: "P(A) = Σ P(Bᵢ)×P(A ∣Bᵢ)" }, { name: "P(X=k)", formula: "C(n,k) × pᵏ × (1−p)ⁿ⁻ᵏ" }, { name: "E(X)", formula: "n × p" }, { name: "V(X)", formula: "n × p × (1−p)" }, { name: "σ(X)", formula: "√(n×p×(1−p))" }, { name: "P(Ā)", formula: "1 − P(A)" }, { name: "Indépendance", formula: "P(A∩B) = P(A) × P(B)" }],
    quiz: [
      { q: "P(A∩B)=0.3, P(B)=0.5. P(A ∣B)?", choices: ["0.6", "0.15", "0.8", "0.3"], answer: 0, explanation: "[[0.3|0.5]] = 0.6." },
      { q: "X~B(10,0.3). E(X)?", choices: ["3", "0.3", "10", "7"], answer: 0, explanation: "n × p = 3." },
      { q: "A et B indép. ssi:", choices: ["P(A∩B)=P(A)P(B)", "P(A∩B)=0", "P(A ∣B)=P(B)", "P(A)=P(B)"], answer: 0, explanation: "Définition." },
      { q: "C(5,2)=?", choices: ["10", "20", "5", "25"], answer: 0, explanation: "[[5 × 4|2]] = 10." }
    ],
    exercises: [
      { title: "Bayes", statement: "Un test médical a une sensibilité de 95%, une spécificité de 90%. La prévalence de la maladie est de 2%. Calculer la probabilité d'être malade sachant test positif (formule de Bayes).", hint: "Arbre+Bayes.", solution: "On construit un arbre :\nP(Malade) = 0.02, P(Sain) = 0.98.\nP(+ ∣Malade) = 0.95 (sensibilité), P(+ ∣Sain) = 0.10 (1 − spécificité).\n\nFormule des P totales : P(+) = P(M)×P(+ ∣M) + P(S)×P(+ ∣S)\n= 0.02×0.95 + 0.98×0.10 = 0.019 + 0.098 = 0.117.\n\nBayes : P(M ∣+) = P(M)×P(+ ∣M) ÷ P(+) = [[0.019|0.117]] ≈ 0.162.\n\n Même testé positif, la probabilité d'être malade n'est que 16.2% !" },
      { title: "Loi bino", statement: "On lance 8 fois une pièce truquée avec P(pile) = 0.6. Calculer la probabilité d'obtenir exactement 5 piles.", hint: "X~B(8,0.6).", solution: "X suit une loi binomiale B(8, 0.6) : 8 lancers, P(pile) = 0.6.\nP(X = 5) = C(8,5) × 0.6⁵ × 0.4³.\nC(8,5) = C(8,3) = [[8×7×6|3×2×1]] = 56.\n0.6⁵ ≈ 0.07776 et 0.4³ = 0.064.\nP(X=5) = 56 × 0.07776 × 0.064 ≈ 0.279.\n\n Il y a environ 27.9% de chances d'obtenir exactement 5 piles." },
      { title: "P totales", statement: "L'urne A contient 3 boules rouges et 2 bleues. L'urne B contient 1 rouge et 4 bleues. On choisit l'urne A avec probabilité 0.4, l'urne B sinon. Calculer la probabilité de tirer une boule rouge.", hint: "P(R)=P(A)P(R ∣A)+P(B)P(R ∣B).", solution: "On tire de l'urne A avec P = 0.4, de l'urne B avec P = 0.6.\nP(R ∣A) = 3 rouges sur 5 boules = [[3|5]].\nP(R ∣B) = 1 rouge sur 5 boules = [[1|5]].\n\nFormule des probabilités totales :\nP(R) = P(A) × P(R ∣A) + P(B) × P(R ∣B)\n= 0.4 × [[3|5]] + 0.6 × [[1|5]] = 0.24 + 0.12 = 0.36.\n\n La probabilité de tirer une boule rouge est 0.36 (36%)." },
      { title: "Indépendance", statement: "On donne P(A) = 0.3, P(B) = 0.5 et P(A∩B) = 0.15. Les événements A et B sont-ils indépendants ? Justifier.", hint: "Vérifier P(A∩B)=P(A)×P(B).", solution: "A et B sont indépendants si et seulement si P(A∩B) = P(A) × P(B).\n\nOn calcule P(A) × P(B) = 0.3 × 0.5 = 0.15.\n\nOn compare avec P(A∩B) = 0.15.\n\nComme 0.15 = 0.15, les événements A et B sont indépendants. " },
      { title: "E et V", statement: "La variable aléatoire X suit une loi binomiale de paramètres n = 20 et p = 0.3.\nCalculer l'espérance E(X), la variance V(X) et l'écart-type σ(X).", hint: "E=np, V=np(1−p).", solution: "X suit B(20, 0.3). Les formules directes sont :\nE(X) = n × p = 20 × 0.3 = 6 (en moyenne, 6 succès sur 20).\nV(X) = n × p × (1−p) = 20 × 0.3 × 0.7 = 4.2.\nσ(X) = √V(X) = √4.2 ≈ 2.05.\n\n Espérance 6, variance 4.2, écart-type ≈ 2.05." }
    ]
  },
  { id: "grands_nombres", title: "Loi des grands nombres", icon: "μ", color: "#ea580c", theme: "Probabilités & Statistiques", metLink: `${BASE}#15`, coursePdf: [`${T}20VA2.pdf`, `${T}20GrandN.pdf`], courseVideo: "https://youtu.be/GweMOVratYI",
    methodVideos: [
      { cat: "Somme VA", title: "Loi somme VA", url: "https://youtu.be/0l7tz8oGh-s" },
      { cat: "Somme VA", title: "VA de transition", url: "https://youtu.be/ljITvCBExVY" },
      { cat: "Somme VA", title: "E et V somme (1)", url: "https://youtu.be/19nVXFHbmjU" },
      { cat: "Somme VA", title: "E et V somme (2)", url: "https://youtu.be/fRYVMQk3bQQ" },
      { cat: "Loi bino", title: "E bino", url: "https://youtu.be/95t19fznDOU" },
      { cat: "Loi bino", title: "V et σ bino", url: "https://youtu.be/MvCZw9XIZ4Q" },
      { cat: "Concentration", title: "E, V, σ VA moyenne", url: "https://youtu.be/o67OOavrbHQ" },
      { cat: "Concentration", title: "Bienaymé-Tchebychev", url: "https://youtu.be/4XMvq1FnYwU" },
      { cat: "Concentration", title: "Inég. concentration", url: "https://youtu.be/7Nk9U-zwWOA" },
      { cat: "Grands nombres", title: "Loi des grands nombres", url: "https://youtu.be/fzuNxQSDTb8" }
    ],
    demoVideos: [{ title: "E et V loi binomiale", url: "https://youtu.be/ljWJfGLRgJE" }],
    exerciseVideos: [{ title: "E V σ loi binomiale", url: "https://youtu.be/W98SSzPSAtQ" }],
        extraLinks: [
      { name: "Lycée d'Adultes — Cours Variables aléatoires & Grands nombres", url: "https://www.lyceedadultes.fr/sitepedagogique/documents/math/mathTermSpe/11_somme_VA_concentration_grands_nbres/11_cours_somme_VA_concentration_grands_nbres.pdf", icon: "" },
      { name: "Lycée d'Adultes — Exercices Variables aléatoires & Grands nombres", url: "https://www.lyceedadultes.fr/sitepedagogique/documents/math/mathTermSpe/11_somme_VA_concentration_grands_nbres/11_exos_somme_VA_concentration_grands_nbres.pdf", icon: "" },
      { name: "XYMaths — Exercices VA / Grands nombres", url: "https://xymaths.fr/Lycee/Terminale-generale-specialite-mathematiques/Exercices-corriges/liste-sujets/probabilites/", icon: "🎓" },
      { name: "Annales2maths — BAC Probas", url: "https://www.annales2maths.com/sujets-et-corrections-de-bac-specialite-mathematiques/", icon: "" },
    ],
    sections: ["Somme de VA", "E et V somme", "VA moyenne", "Bienaymé-Tchebychev", "Concentration", "Loi des grands nombres"],
    keyFormulas: [{ name: "E(X+Y)", formula: "E(X) + E(Y)" }, { name: "V(X+Y) indép.", formula: "V(X) + V(Y)" }, { name: "Bienaymé-Tcheb.", formula: "P(│X−E(X)│ ≥ δ) ≤ [[V(X)|δ²]]" }, { name: "Concentration", formula: "P(│Mₙ−μ│ ≥ δ) ≤ [[σ²|nδ²]]" }, { name: "Loi grands nbres", formula: "Mₙ → μ quand n → +∞" }],
    quiz: [
      { q: "E(X₁+X₂)=?", choices: ["E(X₁)+E(X₂)", "E(X₁)×E(X₂)", "E/2", "max"], answer: 0, explanation: "Linéarité." },
      { q: "Mₙ converge vers:", choices: ["E(X)", "0", "1", "V(X)"], answer: 0, explanation: "Loi des grands nombres." }
    ],
    exercises: [
      { title: "Échantillon", statement: "X suit une loi de Bernoulli de paramètre p = 0.5. Déterminer le nombre minimal n d'observations pour que P(│Mₙ − 0.5│ ≥ 0.05) ≤ 0.05.", hint: "Concentration: V/(nδ²)≤α.", solution: "X suit B(1, 0.5), donc E(X) = 0.5 et V(X) = 0.5×0.5 = 0.25.\n\nPar l'inégalité de concentration : P(│Mₙ−0.5│ ≥ 0.05) ≤ [[V(X)|n × 0.05²]].\n= 0.25 ÷ (n × 0.0025).\n\nOn veut que ce soit ≤ 0.05 :\n[[0.25|0.0025n]] ≤ 0.05 → [[100|n]] ≤ 0.05 → n ≥ [[100|0.05]] = 2000.\n\n Il faut au minimum n = 2000 observations." },
      { title: "E et V somme", statement: "On lance 10 dés. Xᵢ est le résultat du dé i, et S = X₁ + X₂ + ... + X₁₀. Calculer E(S) et V(S).", hint: "E(Xi)=3.5, V(Xi)=35/12.", solution: "Pour un dé : les faces vont de 1 à 6.\nE(Xi) = (1+2+3+4+5+6) ÷ 6 = 21 ÷ 6 = 3.5.\nV(Xi) = E(Xi²) − [E(Xi)]² = 91/6 − 12.25 = 35/12.\nPour S = X₁+...+X₁₀ (somme de 10 dés indépendants) :\nE(S) = 10 × E(Xi) = 10 × 3.5 = 35.\nV(S) = 10 × V(Xi) = 10 × 35/12 ≈ 29.2.\n\n Espérance 35, variance ≈ 29.2." },
      { title: "Bienaymé-Tchebychev", statement: "Soit X une variable aléatoire avec E(X) = 100 et V(X) = 25. En utilisant l'inégalité de Bienaymé-Tchebychev, majorer P(│X − 100│ ≥ 10).", hint: "B-T: P≤V/δ².", solution: "Inégalité de Bienaymé-Tchebychev : P(│X − E(X)│ ≥ δ) ≤ V(X) ÷ δ².\nIci E(X) = 100, V(X) = 25, δ = 10.\nP(│X−100│ ≥ 10) ≤ [[25|10²]] = [[25|100]] = 0.25.\n\n La probabilité que X s'éloigne de plus de 10 de sa moyenne est au plus 25%." }
    ]
  },
  { id: "geometrie", title: "Géométrie dans l'espace", icon: "◇", color: "#14b8a6", theme: "Géométrie", metLink: `${BASE}#11`, coursePdf: [`${T}20Esp1.pdf`, `${T}20Esp2.pdf`, `${T}20Esp3.pdf`], courseVideo: "https://youtu.be/EoT48VtnUJ4",
    methodVideos: [
      { cat: "Vecteurs", title: "Combinaisons linéaires", url: "https://youtu.be/Z83z54pkGqA" },
      { cat: "Vecteurs", title: "Exprimer un vecteur", url: "https://youtu.be/l4FeV0-otP4" },
      { cat: "Vecteurs", title: "Plans parallèles", url: "https://youtu.be/6B1liGkQL8E" },
      { cat: "Vecteurs", title: "4 pts coplanaires", url: "https://youtu.be/9baU60ZNioo" },
      { cat: "Vecteurs", title: "Base de l'espace", url: "https://youtu.be/5a9pE6XQna4" },
      { cat: "Vecteurs", title: "Coordonnées", url: "https://youtu.be/PZeBXIhNBAk" },
      { cat: "Orthogonalité", title: "Produit scalaire", url: "https://youtu.be/vp3ICG3rRQk" },
      { cat: "Orthogonalité", title: "Vecteurs orthogonaux", url: "https://youtu.be/N1IA15sKH-E" },
      { cat: "Orthogonalité", title: "Orthogonalité (PS)", url: "https://youtu.be/8Obh6cIZeEw" },
      { cat: "Orthogonalité", title: "Droites orthogonales", url: "https://youtu.be/qKWghhaQJUs" },
      { cat: "Orthogonalité", title: "Vecteur normal", url: "https://youtu.be/aAnz_cP72Q4" },
      { cat: "Orthogonalité", title: "Déterminer normal", url: "https://youtu.be/IDBEI6thBPU" },
      { cat: "Orthogonalité", title: "Distance pt-plan", url: "https://youtu.be/1b9FtX4sCmQ" },
      { cat: "Éq. / Repr.", title: "Repr. param. droite", url: "https://youtu.be/smCUbzJs9xo" },
      { cat: "Éq. / Repr.", title: "Éq. cart. plan", url: "https://youtu.be/s4xqI6IPQBY" },
      { cat: "Éq. / Repr.", title: "Intersection droite/plan", url: "https://youtu.be/BYBMauyizhE" },
      { cat: "Éq. / Repr.", title: "Projeté orth. sur droite", url: "https://youtu.be/RoacrySlUAU" },
      { cat: "Éq. / Repr.", title: "Intersection 2 plans", url: "https://youtu.be/4dkZ0OQQwaQ" },
      { cat: "Éq. / Repr.", title: "Plans orthogonaux", url: "https://youtu.be/okvo1SUtHUc" }
    ],
    demoVideos: [{ title: "Projeté orth. = plus proche", url: "https://youtu.be/c7mxA0TbVFU" }, { title: "Éq. cart. avec normal", url: "https://youtu.be/GKsHtrImI_o" }],
    exerciseVideos: [{ title: "BAC Vecteurs repr. param.", url: "https://youtu.be/gYNat8r4XRE" }, { title: "BAC PS droite plan algo", url: "https://youtu.be/dQd3SbhoPF4" }],
        extraLinks: [
      { name: "Lycée d'Adultes — Cours Vecteurs & Plans", url: "https://www.lyceedadultes.fr/sitepedagogique/documents/math/mathTermSpe/12_vecteurs_droites_et_plans_dans_l_espace/12_cours_vecteurs_droites_et_plans_dans_l_espace.pdf", icon: "" },
      { name: "Lycée d'Adultes — Exercices Vecteurs & Plans", url: "https://www.lyceedadultes.fr/sitepedagogique/documents/math/mathTermSpe/12_vecteurs_droites_et_plans_dans_l_espace/12_exos_vecteurs_droites_et_plans_dans_l_espace.pdf", icon: "" },
      { name: "Lycée d'Adultes — Cours Produit scalaire & Plans", url: "https://www.lyceedadultes.fr/sitepedagogique/documents/math/mathTermSpe/13_produit_scalaire_plans_espace/13_cours_produit_scalaire_plans_espace.pdf", icon: "" },
      { name: "Lycée d'Adultes — Exercices Produit scalaire", url: "https://www.lyceedadultes.fr/sitepedagogique/documents/math/mathTermSpe/13_produit_scalaire_plans_espace/13_exos_produit_scalaire_plans_espace.pdf", icon: "" },
      { name: "Lycée d'Adultes — Annales 2021 Géométrie espace", url: "https://www.lyceedadultes.fr/sitepedagogique/documents/math/mathTermSpe/13_produit_scalaire_plans_espace/13_exos_produit_scalaire_plans_espace_annales.pdf", icon: "" },
      { name: "Lycée d'Adultes — Annales 2022 Géométrie espace", url: "https://www.lyceedadultes.fr/sitepedagogique/documents/math/mathTermSpe/13_produit_scalaire_plans_espace/13_exos_produit_scalaire_plans_espace_annales_2022.pdf", icon: "" },
      { name: "XYMaths — Annales BAC Géométrie espace", url: "https://xymaths.fr/Lycee/Terminale-generale-specialite-mathematiques/exercices-bac-sujets-corriges/geometrie-dans-l-espace.php", icon: "🎓" },
      { name: "Mathovore — Géométrie espace corrigés", url: "https://mathovore.fr/la-geometrie-dans-l-espace-exercices-maths-terminale-corriges-en-pdf", icon: "📘" },
      { name: "Math93 — DS et BAC", url: "https://www.math93.com/annales-du-bac/bac-specialite-mathematiques/annales-maths-2025.html", icon: "📊" },
    ],
    sections: ["Vecteurs espace", "Coplanaires", "Positions relatives", "Produit scalaire", "Orthogonalité", "Repr. param. droites", "Éq. cart. plans", "Intersection", "Distance"],
    keyFormulas: [{ name: "Éq. plan", formula: "ax + by + cz + d = 0" }, { name: "Vecteur normal", formula: "n⃗(a, b, c)" }, { name: "Produit scalaire", formula: "u⃗ · v⃗ = x₁x₂ + y₁y₂ + z₁z₂" }, { name: "u⃗ · v⃗ (angle)", formula: "‖u⃗‖ × ‖v⃗‖ × cos(u⃗,v⃗)" }, { name: "Distance", formula: "d = [[ax₀+by₀+cz₀+d|√(a²+b²+c²)]]" }, { name: "Param. droite", formula: "(x,y,z) = A + t×u⃗" }, { name: "Norme", formula: "‖u⃗‖ = √(x²+y²+z²)" }, { name: "Milieu", formula: "M = ([[x₁+x₂|2]], [[y₁+y₂|2]], [[z₁+z₂|2]])" }, { name: "Plans ∥", formula: "n⃗₁ et n⃗₂ colinéaires" }, { name: "Plans ⊥", formula: "n⃗₁ · n⃗₂ = 0" }, { name: "Droite ⊥ plan", formula: "u⃗ colinéaire à n⃗" }, { name: "Volume tétra.", formula: "V = [[1|3]] × aire base × h" }],
    quiz: [
      { q: "Normal de 2x−y+3z=5:", choices: ["(2,−1,3)", "(2,1,3)", "(−2,1,−3)", "(5,0,0)"], answer: 0, explanation: "n⃗=(a,b,c)." },
      { q: "Plans // ⟺ normales:", choices: ["Colinéaires", "Orthogonales", "Égales", "Même norme"], answer: 0, explanation: "Normales colinéaires." },
      { q: "Droite⊥plan ⟺ directeur:", choices: ["Colinéaire au normal", "Orthogonal", "Nul", "Dans le plan"], answer: 0, explanation: "Directeur colinéaire au normal." }
    ],
    exercises: [
      { title: "Intersection", statement: "Déterminer l'intersection du plan d'équation x + y + z = 6 et de la droite passant par A(1,0,2) de vecteur directeur u⃗(1,1,1).", hint: "Substituer.", solution: "La droite passe par (1,0,2) avec vecteur directeur (1,1,1) :\nx = 1+t, y = 0+t = t, z = 2+t.\n\nOn substitue dans l'équation du plan x+y+z = 6 :\n(1+t) + t + (2+t) = 6 → 3 + 3t = 6 → 3t = 3 → t = 1.\n\nPoint d'intersection : x=2, y=1, z=3.\n\n Le point d'intersection est (2, 1, 3)." },
      { title: "Distance", statement: "Calculer la distance du point A(3, −1, 2) au plan d'équation 2x − y + 2z − 1 = 0.", hint: "Formule.", solution: "Formule de distance d'un point A(x₀,y₀,z₀) à un plan ax+by+cz+d=0 :\nd = |ax₀+by₀+cz₀+d| ÷ √(a²+b²+c²).\nA = (3,−1,2), plan : 2x−y+2z−1 = 0 (a=2, b=−1, c=2, d=−1).\nd = |2×3 + (−1)×(−1) + 2×2 + (−1)| ÷ √(4+1+4)\n= |6+1+4−1| ÷ √9 = [[10|3]].\n\n La distance est 10/3 ≈ 3.33." },
      { title: "Éq. plan", statement: "Déterminer l'équation cartésienne du plan passant par A(1, 0, 0) et de vecteur normal n⃗(2, −1, 3).", hint: "2(x−1)−1(y)+3(z)=0.", solution: "Un plan passant par A(x₀,y₀,z₀) avec normal n⃗(a,b,c) a pour équation :\na(x−x₀) + b(y−y₀) + c(z−z₀) = 0.\nIci A = (1,0,0) et n⃗ = (2,−1,3) :\n2(x−1) + (−1)(y−0) + 3(z−0) = 0\n2x − 2 − y + 3z = 0\n\n Équation du plan : 2x − y + 3z − 2 = 0." },
      { title: "Repr. param.", statement: "Déterminer une représentation paramétrique de la droite passant par A(1, 2, 3) de vecteur directeur u⃗(1, −1, 2).", hint: "(x,y,z)=A+tu⃗.", solution: "La représentation paramétrique d'une droite passant par A(a,b,c) de vecteur u⃗(α,β,γ) est :\nx = a + αt ; y = b + βt ; z = c + γt.\nIci A = (1,2,3) et u⃗ = (1,−1,2) :\n\n x = 1+t, y = 2−t, z = 3+2t (t ∈ ℝ)." },
      { title: "Projeté", statement: "Déterminer les coordonnées du projeté orthogonal H du point M(1, 1, 1) sur le plan d'équation x + y + z = 0.", hint: "H=M+tn⃗ avec H dans le plan.", solution: "Le projeté H de M sur le plan est sur la droite perpendiculaire au plan passant par M.\nLe normal du plan x+y+z=0 est n⃗(1,1,1).\nDroite MH : x=1+t, y=1+t, z=1+t (M + t×n⃗).\nH est dans le plan : (1+t)+(1+t)+(1+t) = 0 → 3+3t = 0 → t = −1.\nH = (1−1, 1−1, 1−1) = (0,0,0).\n\n Le projeté orthogonal est l'origine (0,0,0)." }
    ]
  },
  { id: "complexes", title: "Nombres complexes", icon: "ℂ", color: "#0ea5e9", theme: "Géométrie", metLink: `${BASE}#27`, coursePdf: [`${T}20NC1.pdf`, `${T}20NC2.pdf`, `${T}20NC3.pdf`, `${T}20NC4.pdf`], courseVideo: "https://youtu.be/ABo2m52oEYw",
    methodVideos: [
      { cat: "Algébrique", title: "Forme algébrique (1)", url: "https://youtu.be/-aaSfL2fhTY" },
      { cat: "Algébrique", title: "Forme algébrique (2)", url: "https://youtu.be/1KQIUqzVGqQ" },
      { cat: "Algébrique", title: "Conjugué", url: "https://youtu.be/WhKHo9YwafE" },
      { cat: "Algébrique", title: "Éq. avec conjugué", url: "https://youtu.be/qu7zGL5y4vI" },
      { cat: "Algébrique", title: "Binôme", url: "https://youtu.be/UsYH9PvppPo" },
      { cat: "Algébrique", title: "Éq. 2nd degré ℂ", url: "https://youtu.be/KCnorHy5FE4" },
      { cat: "Géométrique", title: "Affixe vecteur", url: "https://youtu.be/D_yFqcCy3iE" },
      { cat: "Géométrique", title: "Affixe en géométrie", url: "https://youtu.be/m9yM6kw1ZzU" },
      { cat: "Géométrique", title: "Module (1)", url: "https://youtu.be/Hu0jjS5O2u4" },
      { cat: "Géométrique", title: "Module (2)", url: "https://youtu.be/i85d2fKv34w" },
      { cat: "Géométrique", title: "Argument", url: "https://youtu.be/NX3pzPL2gwc" },
      { cat: "Formes", title: "Trigo→algébrique", url: "https://youtu.be/kmb3-hNiBq8" },
      { cat: "Formes", title: "Algébrique→trigo (1)", url: "https://youtu.be/zIbpXlgISc4" },
      { cat: "Formes", title: "Algébrique→trigo (2)", url: "https://youtu.be/RqRQ2m-9Uhw" },
      { cat: "Formes", title: "Forme expo (1)", url: "https://youtu.be/WSW6DIbCS_0" },
      { cat: "Formes", title: "Forme expo (2)", url: "https://youtu.be/tEKJVKKQazA" },
      { cat: "Formes", title: "Expo→algébrique", url: "https://youtu.be/zdxRt5poJp0" },
      { cat: "Formes", title: "Utiliser expo", url: "https://youtu.be/8EVfyqyVBKc" },
      { cat: "Trigo", title: "cos/sin addition", url: "https://youtu.be/WcTWAazcXds" },
      { cat: "Trigo", title: "cos/sin duplication", url: "https://youtu.be/RPtAUl3oLco" },
      { cat: "Trigo", title: "Moivre", url: "https://youtu.be/RU2C4i3n5Ik" },
      { cat: "Trigo", title: "Euler linéariser", url: "https://youtu.be/p6TncUjPKfQ" },
      { cat: "Applications géo.", title: "Complexes en géom.", url: "https://youtu.be/NjLZfbqRFB0" },
      { cat: "Applications géo.", title: "Ensemble pts (1)", url: "https://youtu.be/WTXu19XC9Lw" },
      { cat: "Applications géo.", title: "Ensemble pts (2)", url: "https://youtu.be/5puq7tzMZAo" },
      { cat: "Applications géo.", title: "Ensemble pts (3)", url: "https://youtu.be/r6RO4ifOf70" },
      { cat: "Racines", title: "Racines de l'unité", url: "https://youtu.be/PZWgjj_7G7c" },
      { cat: "Racines", title: "Racines n-ièmes", url: "https://youtu.be/cqK_IGw_0fE" }
    ],
    demoVideos: [],
    exerciseVideos: [{ title: "Éq. trigo (addition)", url: "https://youtu.be/sCUNjZ6yqac" }, { title: "Moivre", url: "https://youtu.be/7z7s6NVSyj0" }, { title: "Euler", url: "https://youtu.be/rsrDqzMtu6M" }, { title: "BAC Complexes", url: "https://youtu.be/SeyMF4uikOI" }],
        extraLinks: [
      { name: "Lycée d'Adultes — BAC Blanc 2026", url: "https://www.lyceedadultes.fr/sitepedagogique/documents/math/mathTermSpe/ctrle_2025_2026/2026_BB_03_03.pdf", icon: "" },
      { name: "Lycée d'Adultes — Révisions Suites 2025", url: "https://www.lyceedadultes.fr/sitepedagogique/documents/math/mathTermSpe/16_revision/2025_seance_21_05.pdf", icon: "" },
      { name: "Lycée d'Adultes — Révisions Géo/Proba 2025", url: "https://www.lyceedadultes.fr/sitepedagogique/documents/math/mathTermSpe/16_revision/2025_seance_26_05.pdf", icon: "" },
      { name: "XYMaths — Exercices Complexes", url: "https://xymaths.fr/Lycee/Terminale-generale-specialite-mathematiques/Exercices-corriges/liste-sujets/nombres-complexes/", icon: "🎓" },
      { name: "Mathovore — Complexes corrigés", url: "https://mathovore.fr/les-nombres-complexes-exercices-maths-terminale-corriges-en-pdf", icon: "📘" },
      { name: "APMEP — Annales BAC", url: "https://www.apmep.fr/Annales-Terminale-Generale", icon: "" },
    ],
    sections: ["Forme algébrique", "Conjugué/module", "Forme trigo", "Forme expo", "Euler/Moivre", "Résolution ℂ", "Géométrie", "Racines n-ièmes"],
    keyFormulas: [{ name: "Forme algébrique", formula: "z = a + bi" }, { name: "|z|", formula: "√(a² + b²)" }, { name: "z × z̄", formula: "|z|²" }, { name: "Conjugué", formula: "z̄ = a − bi" }, { name: "Forme expo", formula: "z = |z| × eⁱᶿ" }, { name: "Euler", formula: "eⁱᶿ = cos θ + i sin θ" }, { name: "Moivre", formula: "(cos θ + i sin θ)ⁿ = cos(nθ) + i sin(nθ)" }, { name: "arg(z₁z₂)", formula: "arg(z₁) + arg(z₂)" }, { name: "Milieu", formula: "z_M = [[z₁ + z₂|2]]" }, { name: "i²", formula: "−1" }],
    quiz: [
      { q: "|3+4i|=?", choices: ["5", "7", "1", "√7"], answer: 0, explanation: "√(9+16)=5." },
      { q: "Conjugué de 2−3i:", choices: ["2+3i", "−2+3i", "−2−3i", "3−2i"], answer: 0, explanation: "Conjugué de a+bi=a−bi." },
      { q: "e^(iπ)=?", choices: ["−1", "1", "i", "0"], answer: 0, explanation: "Euler." },
      { q: "arg(i)=?", choices: ["π/2", "π", "0", "−π/2"], answer: 0, explanation: "i=e^(iπ/2)." }
    ],
    exercises: [
      { title: "Forme algébrique", statement: "Mettre le nombre complexe z = [[1+i|1−i]] sous forme algébrique a + bi.", hint: "Conjugué du dénominateur.", solution: "Pour diviser par un complexe, on multiplie par le conjugué du dénominateur.\nConjugué de 1−i est 1+i.\n(1+i) ÷ (1−i) = [[(1+i)(1+i)|(1−i)(1+i)]]\n\nNumérateur : (1+i)² = 1 + 2i + i² = 1 + 2i − 1 = 2i.\n\nDénominateur : (1−i)(1+i) = 1 − i² = 1+1 = 2.\n\nRésultat = [[2i|2]] = i.\n|z| = |i| = 1, arg(i) = π/2.\n\n Sous forme algébrique : z = i." },
      { title: "Racines", statement: "Résoudre dans ℂ l'équation z² = −4.\nOn écrira −4 sous forme exponentielle pour trouver les deux racines carrées.", hint: "z²=4e^(iπ).", solution: "z² = −4. On cherche z tel que z² = −4.\n−4 = 4 × (−1) = 4 × e^(iπ). Donc |z|² = 4, soit |z| = 2.\nz² = 4e^(iπ) → z = 2e^(iπ/2) = 2i ou z = 2e^(i(π/2+π)) = 2e^(i3π/2) = −2i.\n\nVérification : (2i)² = 4i² = −4 ✓ et (−2i)² = 4i² = −4 ✓.\n\n Solutions : z = 2i ou z = −2i." },
      { title: "Module/argument", statement: "Soit z = −1 + i√(3). Déterminer le module et l'argument de z.", hint: "|z|=√(1+3)=2. Rechercher θ.", solution: "z = −1 + i√3. Module : |z| = √((-1)² + (√3)²) = √(1+3) = √4 = 2.\nArgument θ : cos(θ) = [[Re(z)||z|]] = −[[1|2]] et sin(θ) = [[Im(z)||z|]] = [[√3|2]].\nQuel angle a cos = −1/2 et sin = √3/2 ?\nC'est θ = 2π/3 (= 120°), dans le 2ème quadrant.\n\n |z| = 2, arg(z) = 2π/3." },
      { title: "Eq. 2nd degré", statement: "Résoudre dans ℂ l'équation z² − 2z + 5 = 0.\nOn calculera le discriminant Δ et on utilisera le fait que Δ < 0.", hint: "Δ=4−20=−16.", solution: "z²−2z+5 = 0. On calcule le discriminant :\nΔ = b²−4ac = (−2)²−4×1×5 = 4−20 = −16.\nΔ < 0 : pas de solution réelle, mais 2 solutions complexes.\n√Δ = √(−16) = 4i (car i² = −1, donc (4i)² = 16i² = −16).\nz = (−b ± √Δ) ÷ 2a = [[2 ± 4i|2]] = 1 ± 2i.\n\n Solutions : z₁ = 1+2i et z₂ = 1−2i (elles sont conjuguées)." },
      { title: "Géométrie", statement: "Dans le plan complexe, on considère les points A d'affixe 2+i et B d'affixe −1+3i. Calculer l'affixe du milieu de [AB] et la distance AB.", hint: "Milieu=(zA+zB)/2. Distance=|zB−zA|.", solution: "Milieu : M a pour affixe [[zA + zB|2]] = (2+i + (−1+3i)) ÷ 2 = (1+4i) ÷ 2 = [[1|2]] + 2i.\nDistance : AB = |zB − zA| = |(−1+3i) − (2+i)| = |−3+2i|.\n|−3+2i| = √((−3)² + 2²) = √(9+4) = √13 ≈ 3.61.\n\n Milieu M d'affixe [[1|2]] + 2i, distance AB = √13." },
      { title: "Forme expo", statement: "Soit z = 1 + i. Déterminer le module et l'argument de z, puis écrire z sous forme exponentielle z = r × e^(iθ).", hint: "|z|=√2, arg(z)=π/4.", solution: "z = 1+i. Module : |z| = √(1²+1²) = √2.\nArgument : cos(θ) = [[1|√2]] et sin(θ) = [[1|√2]].\nL'angle qui vérifie ça est θ = π/4 (= 45°).\nForme exponentielle : z = |z| × e^(iθ) = √2 × e^(iπ/4).\n\n z = √2·e^(iπ/4)." }
    ]
  }
];
const THEMES = [...new Set(CHAPTERS.map(c => c.theme))];
const TC = {"Analyse":"#8b5cf6","Probabilités & Statistiques":"#f97316","Géométrie":"#0ea5e9"};
const CONFIG = {prof:{name:"Imran",pin:"030405"},eleve:{name:"Sami",pin:"280205"},appTitle:"Maths Terminale"};

// ─── PARCOURS GUIDÉ ─────────────────────────────────────────
const LEARNING_PATH = [
  { id: "suites", step: 1, bloc: "Fondations", prerequis1ere: "Suites arithmétiques et géométriques (1ère)", prerequisLink: "https://www.maths-et-tiques.fr/index.php/cours-maths/niveau-premiere#suite" },
  { id: "limites", step: 2, bloc: "Fondations", prerequis1ere: "Fonctions de référence, tableau de variations (1ère)", prerequisLink: "https://www.maths-et-tiques.fr/index.php/cours-maths/niveau-premiere#second" },
  { id: "derivation", step: 3, bloc: "Fondations", prerequis1ere: "Dérivation en 1ère (nombre dérivé, tangente)", prerequisLink: "https://www.maths-et-tiques.fr/index.php/cours-maths/niveau-premiere#derivation" },
  { id: "continuite", step: 4, bloc: "Analyse approfondie", prerequis1ere: null },
  { id: "convexite", step: 5, bloc: "Analyse approfondie", prerequis1ere: null },
  { id: "logarithme", step: 6, bloc: "Fonctions avancées", prerequis1ere: "Fonction exponentielle (1ère)", prerequisLink: "https://www.maths-et-tiques.fr/index.php/cours-maths/niveau-premiere#exponentielle" },
  { id: "trigo", step: 7, bloc: "Fonctions avancées", prerequis1ere: "Trigonométrie (1ère) : cercle trigo, cos/sin", prerequisLink: "https://www.maths-et-tiques.fr/index.php/cours-maths/niveau-premiere#trigo" },
  { id: "primitives", step: 8, bloc: "Calcul intégral", prerequis1ere: null },
  { id: "integration", step: 9, bloc: "Calcul intégral", prerequis1ere: null },
  { id: "combinatoire", step: 10, bloc: "Probabilités", prerequis1ere: "Probabilités (1ère) : arbres, indépendance", prerequisLink: "https://www.maths-et-tiques.fr/index.php/cours-maths/niveau-premiere#proba" },
  { id: "probabilites", step: 11, bloc: "Probabilités", prerequis1ere: null },
  { id: "grands_nombres", step: 12, bloc: "Probabilités", prerequis1ere: null },
  { id: "geometrie", step: 13, bloc: "Géométrie", prerequis1ere: "Produit scalaire (1ère), vecteurs (2nde)", prerequisLink: "https://www.maths-et-tiques.fr/index.php/cours-maths/niveau-premiere#scalaire" },
  { id: "complexes", step: 14, bloc: "Géométrie", prerequis1ere: null },
];
const PATH_MAP = Object.fromEntries(LEARNING_PATH.map(p => [p.id, p]));

// ─── SUPABASE (remplir plus tard) ─────────────────────────
const SB_URL = "https://gxaeajqgpbyobiepntdk.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4YWVhanFncGJ5b2JpZXBudGRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MTg4MDAsImV4cCI6MjA4ODk5NDgwMH0.JE0diFb68PU-6Y4KdpQ3VSJa9kLGcBw65jDT_OYfw0A";

// ─── STORAGE (Supabase → window.storage → localStorage) ────
const useSB = SB_URL && SB_KEY;
async function dbGet(k){
  if(useSB){try{const r=await fetch(SB_URL+"/rest/v1/kv_store?key=eq."+encodeURIComponent(k)+"&select=value",{headers:{apikey:SB_KEY,Authorization:"Bearer "+SB_KEY}});const d=await r.json();return d&&d[0]&&d[0].value?JSON.parse(d[0].value):null;}catch{}}
  try{if(window.storage){const r=await window.storage.get(k);return r&&r.value?JSON.parse(r.value):null;}}catch{}
  try{const v=localStorage.getItem(k);return v?JSON.parse(v):null;}catch{return null;}
}
async function dbSet(k,v){
  const s=JSON.stringify(v);
  if(useSB){try{await fetch(SB_URL+"/rest/v1/kv_store",{method:"POST",headers:{apikey:SB_KEY,Authorization:"Bearer "+SB_KEY,"Content-Type":"application/json",Prefer:"resolution=merge-duplicates"},body:JSON.stringify({key:k,value:s})});return;}catch{}}
  try{if(window.storage){await window.storage.set(k,s);return;}}catch{}
  try{localStorage.setItem(k,s);}catch{}
}

// ─── DESIGN SYSTEM ──────────────────────────────────────────
const CSS=`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500&display=swap');
*{box-sizing:border-box;margin:0}
:root{--bg:#0c0f1a;--bg2:#141829;--bg3:#1c2039;--bg4:#252a45;--tx:#e8eaf0;--tx2:#9499b3;--tx3:#626885;--ac:#7c5cfc;--ac2:#a78bfa;--gn:#34d399;--rd:#f87171;--or:#fbbf24;--bd:rgba(255,255,255,.06)}
body{background:var(--bg);color:var(--tx);font-family:'DM Sans',system-ui,sans-serif;margin:0;-webkit-text-size-adjust:100%}
@keyframes enter{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
.e{animation:enter .4s cubic-bezier(.22,1,.36,1) both}
.c{background:var(--bg2);border:1px solid var(--bd);border-radius:16px;transition:all .25s cubic-bezier(.22,1,.36,1)}
.c:hover{border-color:rgba(124,92,252,.2);box-shadow:0 6px 24px rgba(124,92,252,.07)}
@media(max-width:700px){
  body{font-size:15px}
  input,button,select,textarea{font-size:16px!important}
}
`;
const A={minHeight:"100vh",background:"var(--bg)",color:"var(--tx)",fontFamily:"'DM Sans',system-ui,sans-serif"};
const C={maxWidth:1050,margin:"0 auto",padding:"16px 14px"};
const mono={fontFamily:"'JetBrains Mono',monospace"};
const btn={display:"inline-flex",alignItems:"center",gap:6,padding:"10px 18px",borderRadius:10,border:"1px solid var(--bd)",background:"var(--bg3)",color:"var(--tx)",fontSize:13,fontWeight:600,cursor:"pointer",transition:"all .2s",fontFamily:"inherit"};
const inp={width:"100%",padding:"12px 16px",borderRadius:10,border:"1px solid var(--bd)",background:"var(--bg3)",color:"var(--tx)",fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"inherit",transition:"border .2s"};
const nbtn=(a)=>({flex:"0 0 auto",padding:"10px 16px",border:"none",borderRadius:10,cursor:"pointer",fontSize:13,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:7,transition:"all .2s",fontFamily:"inherit",background:a?"var(--ac)":"var(--bg3)",color:a?"#fff":"var(--tx2)",boxShadow:a?"0 3px 12px rgba(124,92,252,.3)":"none",whiteSpace:"nowrap"});
const qo=(s,ok,bad,d)=>({display:"block",width:"100%",textAlign:"left",padding:"12px 16px",marginBottom:6,borderRadius:10,cursor:d?"default":"pointer",fontSize:14,fontWeight:500,border:"1px solid "+(d&&ok?"rgba(52,211,153,.4)":d&&bad?"rgba(248,113,113,.4)":s?"rgba(124,92,252,.5)":"var(--bd)"),background:d&&ok?"rgba(52,211,153,.08)":d&&bad?"rgba(248,113,113,.08)":s?"rgba(124,92,252,.1)":"var(--bg3)",color:"var(--tx)",transition:"all .15s",fontFamily:"inherit"});
const fmtTime=(s)=>{const n=Number(s)||0;if(n<60)return n>0?n+"s":"0m";const h=Math.floor(n/3600),m=Math.floor((n%3600)/60);return h>0?h+"h"+(m>0?m+"m":""):m+"m";};

function Ring({p=0,sz=48,sw=4,c="var(--ac)"}){const r=(sz-sw)/2,ci=2*Math.PI*r,o=ci-((Number(p)||0)/100)*ci;return<svg width={sz} height={sz} style={{transform:"rotate(-90deg)"}}><circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke="var(--bg4)" strokeWidth={sw}/><circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={c} strokeWidth={sw} strokeDasharray={ci} strokeDashoffset={o} strokeLinecap="round" style={{transition:"stroke-dashoffset .7s cubic-bezier(.22,1,.36,1)"}}/><text x={sz/2} y={sz/2} textAnchor="middle" dominantBaseline="central" style={{transform:"rotate(90deg)",transformOrigin:"center",fontSize:sz*.28,fill:"var(--tx)",fontWeight:700,...mono}}>{Math.round(Number(p)||0)}%</text></svg>;}
function Tag({children,color}){return<span style={{display:"inline-flex",padding:"2px 9px",borderRadius:6,fontSize:11,fontWeight:600,letterSpacing:".3px",textTransform:"uppercase",background:color+"18",color,border:"1px solid "+color+"30"}}>{children}</span>;}
function VL({v,bg}){return<a href={v.url} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:11,padding:"10px 14px",marginBottom:5,borderRadius:12,background:bg||"rgba(248,113,113,.06)",border:"1px solid rgba(248,113,113,.12)",textDecoration:"none",color:"var(--tx)",fontSize:13,transition:"all .2s"}}><span style={{width:30,height:30,borderRadius:8,background:"rgba(248,113,113,.1)",color:"var(--rd)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,flexShrink:0}}>→</span><span style={{fontWeight:500}}>{v.title}</span></a>;}
function Sec({children,style}){return<div className="e" style={{background:"var(--bg2)",border:"1px solid var(--bd)",borderRadius:16,padding:20,marginBottom:14,...(style||{})}}>{children}</div>;}

function MathText({text}){
  if(!text||typeof text!=="string")return text||null;
  // Split on fractions [[a|b]], roots √(...), and superscripts like e^(...)
  const parts=text.split(/(\[\[.*?\]\]|√\([^)]*\)|[a-zA-Z0-9]\^\([^)]*\)|[a-zA-Z0-9]\^[a-zA-Z0-9])/g);
  return<span>{parts.map((p,i)=>{
    // Fractions [[num|den]]
    const fm=p.match(/^\[\[(.*?)\|(.*?)\]\]$/);
    if(fm)return<span key={i} style={{display:"inline-flex",flexDirection:"column",alignItems:"center",verticalAlign:"middle",margin:"0 3px",lineHeight:1.2}}><span style={{borderBottom:"1.5px solid currentColor",padding:"0 3px 2px",fontSize:".9em"}}><MathText text={fm[1]}/></span><span style={{padding:"2px 3px 0",fontSize:".9em"}}><MathText text={fm[2]}/></span></span>;
    // Square roots √(...)
    const rm=p.match(/^√\(([^)]*)\)$/);
    if(rm)return<span key={i} style={{display:"inline-flex",alignItems:"stretch",verticalAlign:"middle",margin:"0 2px"}}><span style={{fontSize:"1.1em",lineHeight:1}}>√</span><span style={{borderTop:"1.5px solid currentColor",padding:"0 3px",marginTop:1}}><MathText text={rm[1]}/></span></span>;
    // Superscripts: e^(2x+1) or x^2
    const sm=p.match(/^([a-zA-Z0-9])\^\(([^)]*)\)$/);
    if(sm)return<span key={i}>{sm[1]}<sup style={{fontSize:".75em",verticalAlign:"super"}}><MathText text={sm[2]}/></sup></span>;
    const sm2=p.match(/^([a-zA-Z0-9])\^([a-zA-Z0-9])$/);
    if(sm2)return<span key={i}>{sm2[1]}<sup style={{fontSize:".75em",verticalAlign:"super"}}>{sm2[2]}</sup></span>;
    return<span key={i}>{p}</span>;
  })}</span>;
}

// Clean LaTeX from AI responses
function cleanLatex(t){
  if(!t)return t;
  // Remove $$ and $ wrappers
  t=t.replace(/\$\$([^$]+)\$\$/g,'$1');
  t=t.replace(/\$([^$]+)\$/g,'$1');
  // Fractions with braces: \frac{a}{b} → [[a|b]]
  t=t.replace(/\\(?:d)?frac\{([^}]+)\}\{([^}]+)\}/g,'[[$1|$2]]');
  // Fractions without braces: \frac ab or \frac12 → [[a|b]]
  t=t.replace(/\\(?:d)?frac\s*([a-zA-Z0-9]+)\s*([a-zA-Z0-9]+)/g,'[[$1|$2]]');
  // Remaining \frac just remove
  t=t.replace(/\\(?:d)?frac/g,'');
  // Sqrt with braces
  t=t.replace(/\\sqrt\{([^}]+)\}/g,'√($1)');
  // Sqrt without braces: \sqrtx → √(x)
  t=t.replace(/\\sqrt([a-zA-Z0-9])/g,'√($1)');
  t=t.replace(/\\sqrt/g,'√');
  // Limits
  t=t.replace(/\\lim_\{([^}]+)\}/g,'lim($1)');
  t=t.replace(/\\lim_([a-zA-Z0-9→∞+\-]+)/g,'lim($1)');
  t=t.replace(/\\lim/g,'lim');
  // Symbols
  t=t.replace(/\\infty/g,'∞');
  t=t.replace(/\\times/g,'×');
  t=t.replace(/\\cdot/g,'·');
  t=t.replace(/\\div/g,'÷');
  t=t.replace(/\\pm/g,'±');
  t=t.replace(/\\leq/g,'≤');
  t=t.replace(/\\geq/g,'≥');
  t=t.replace(/\\neq/g,'≠');
  t=t.replace(/\\approx/g,'≈');
  t=t.replace(/\\in/g,'∈');
  t=t.replace(/\\notin/g,'∉');
  t=t.replace(/\\forall/g,'∀');
  t=t.replace(/\\exists/g,'∃');
  t=t.replace(/\\Rightarrow/g,'⟹');
  t=t.replace(/\\Leftrightarrow/g,'⟺');
  t=t.replace(/\\rightarrow/g,'→');
  t=t.replace(/\\leftarrow/g,'←');
  t=t.replace(/\\to/g,'→');
  t=t.replace(/\\sum/g,'∑');
  t=t.replace(/\\int/g,'∫');
  t=t.replace(/\\pi/g,'π');
  t=t.replace(/\\theta/g,'θ');
  t=t.replace(/\\alpha/g,'α');
  t=t.replace(/\\beta/g,'β');
  t=t.replace(/\\gamma/g,'γ');
  t=t.replace(/\\delta/g,'δ');
  t=t.replace(/\\Delta/g,'Δ');
  t=t.replace(/\\mathbb\{R\}/g,'ℝ');t=t.replace(/\\mathbb R/g,'ℝ');
  t=t.replace(/\\mathbb\{C\}/g,'ℂ');t=t.replace(/\\mathbb C/g,'ℂ');
  t=t.replace(/\\mathbb\{N\}/g,'ℕ');t=t.replace(/\\mathbb N/g,'ℕ');
  t=t.replace(/\\mathbb\{Z\}/g,'ℤ');t=t.replace(/\\mathbb Z/g,'ℤ');
  // Cleanup
  t=t.replace(/\\text\{([^}]+)\}/g,'$1');
  t=t.replace(/\\quad/g,' ');
  t=t.replace(/\\,/g,' ');
  t=t.replace(/\\;/g,' ');
  t=t.replace(/\\\\/g,'\n');
  t=t.replace(/\\left/g,'');
  t=t.replace(/\\right/g,'');
  t=t.replace(/\\big/g,'');
  t=t.replace(/\\Big/g,'');
  t=t.replace(/\\bigg/g,'');
  // Remove remaining backslash commands
  t=t.replace(/\\[a-zA-Z]+/g,'');
  // Remove stray braces (but keep [[]])
  t=t.replace(/(?<!\[)\{/g,'');
  t=t.replace(/\}(?!\])/g,'');
  // Superscripts and subscripts
  t=t.replace(/\^(\d)/g,(m,d)=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[d]);
  t=t.replace(/\^n/g,'ⁿ');
  t=t.replace(/\^x/g,'ˣ');
  t=t.replace(/_(\d)/g,(m,d)=>'₀₁₂₃₄₅₆₇₈₉'[d]);
  t=t.replace(/_n/g,'ₙ');
  t=t.replace(/_k/g,'ₖ');
  // Bold markdown
  t=t.replace(/\*\*([^*]+)\*\*/g,'$1');
  return t;
}

const LDA="https://www.lyceedadultes.fr/sitepedagogique/documents/math/mathTermSpe";
const EXAMS={
  suites:[
    {name:"Contrôle Suites — Lycée d'Adultes 2025",url:LDA+"/ctrle_2025_2026/01_ctrle_29_09_2025.pdf"},
    {name:"Correction Contrôle Suites",url:LDA+"/ctrle_2025_2026/01_ctrle_29_09_2025_correction.pdf",corr:true},
    {name:"Contrôle Récurrence & Limites suites 2025",url:LDA+"/ctrle_2025_2026/02_ctrle_15_10_2025.pdf"},
    {name:"Correction Récurrence & Limites suites",url:LDA+"/ctrle_2025_2026/02_ctrle_15_10_2025_correction.pdf",corr:true},
  ],
  limites:[
    {name:"Contrôle Limites, continuité & dérivation 2025",url:LDA+"/ctrle_2025_2026/03_04_ctrle_26_11_2025.pdf"},
    {name:"Correction Limites, continuité & dérivation",url:LDA+"/ctrle_2025_2026/03_04_ctrle_26_11_2025_correction.pdf",corr:true},
  ],
  derivation:[
    {name:"Contrôle Limites, continuité & dérivation 2025",url:LDA+"/ctrle_2025_2026/03_04_ctrle_26_11_2025.pdf"},
    {name:"Correction",url:LDA+"/ctrle_2025_2026/03_04_ctrle_26_11_2025_correction.pdf",corr:true},
    {name:"QCM Dérivée et convexité",url:LDA+"/04_derivabilite_convexite/04_exos_qcm_convexite.pdf"},
  ],
  continuite:[
    {name:"Contrôle Limites & continuité 2025",url:LDA+"/ctrle_2025_2026/03_04_ctrle_26_11_2025.pdf"},
    {name:"Correction",url:LDA+"/ctrle_2025_2026/03_04_ctrle_26_11_2025_correction.pdf",corr:true},
  ],
  convexite:[
    {name:"QCM Dérivée et convexité",url:LDA+"/04_derivabilite_convexite/04_exos_qcm_convexite.pdf"},
    {name:"Contrôle dérivation & convexité 2025",url:LDA+"/ctrle_2025_2026/03_04_ctrle_26_11_2025.pdf"},
    {name:"Correction",url:LDA+"/ctrle_2025_2026/03_04_ctrle_26_11_2025_correction.pdf",corr:true},
  ],
  logarithme:[
    {name:"Contrôle Exp & Logarithme 2025",url:LDA+"/ctrle_2025_2026/05_ctrle_17_12_2025.pdf"},
    {name:"Correction Exp & Logarithme",url:LDA+"/ctrle_2025_2026/05_ctrle_17_12_2025_correction.pdf",corr:true},
    {name:"Exercices type BAC fonction ln",url:LDA+"/05_rappels_exp_fnt_ln/05_exos_rappels_exp_fnt_ln_bis.pdf"},
  ],
  trigo:[
    {name:"Résumé Équations trigo (auto-évaluation)",url:LDA+"/06_fnts_sinus_cosinus/06_resume_equations_trigo.pdf"},
    {name:"Exercices complets Sinus & Cosinus",url:LDA+"/06_fnts_sinus_cosinus/06_exos_fnts_sinus_cosinus.pdf"},
  ],
  primitives:[
    {name:"Révision Fonctions, suites, éq. diff., intégrales (avec corrigé)",url:LDA+"/16_revision/2025_seance_21_05.pdf",corr:true},
  ],
  integration:[
    {name:"Exercices Calcul intégral",url:LDA+"/08_calcul_integral/08_exos_calcul_integral.pdf"},
    {name:"Méthode des trapèzes (algorithme)",url:LDA+"/08_calcul_integral/08_algorithme_integrale_trapeze.pdf"},
  ],
  combinatoire:[
    {name:"Exercices Dénombrement complets",url:LDA+"/09_denombrement/09_exos_denombrement.pdf"},
  ],
  probabilites:[
    {name:"Contrôle Probas conditionnelles & Binomiale 2026",url:LDA+"/ctrle_2025_2026/10_ctrle_28_01_2026.pdf"},
    {name:"Correction Probas & Binomiale",url:LDA+"/ctrle_2025_2026/10_ctrle_28_01_2026_correction.pdf",corr:true},
    {name:"Autres exercices proba conditionnelles 2026",url:LDA+"/10_rappels_probabilite_loi_binomiale/10_autres_exos_proba.pdf"},
  ],
  grands_nombres:[
    {name:"Exercices Variables aléatoires & Grands nombres",url:LDA+"/11_somme_VA_concentration_grands_nbres/11_exos_somme_VA_concentration_grands_nbres.pdf"},
  ],
  geometrie:[
    {name:"Exercices & QCM Géo espace",url:LDA+"/12_vecteurs_droites_et_plans_dans_l_espace/12_exos_vecteurs_droites_et_plans_dans_l_espace_autres.pdf"},
    {name:"Annales BAC 2021 — Géométrie espace",url:LDA+"/13_produit_scalaire_plans_espace/13_exos_produit_scalaire_plans_espace_annales.pdf"},
    {name:"Annales BAC 2022 — Géométrie espace",url:LDA+"/13_produit_scalaire_plans_espace/13_exos_produit_scalaire_plans_espace_annales_2022.pdf"},
  ],
  complexes:[
    {name:"BAC Blanc complet Mars 2026",url:LDA+"/ctrle_2025_2026/2026_BB_03_03.pdf"},
    {name:"Révision Fonctions, suites, éq diff, intégrales",url:LDA+"/16_revision/2025_seance_21_05.pdf"},
    {name:"Révision Géo espace, suites, probas",url:LDA+"/16_revision/2025_seance_26_05.pdf"},
    {name:"Révision Dénombrement",url:LDA+"/16_revision/2025_seance_19_05.pdf"},
  ],
};

const BAC_TYPES={
  suites:[
    {name:"Exercices BAC corrigés — Suites (xymaths.fr)",url:"https://xymaths.fr/Lycee/Terminale-generale-specialite-mathematiques/exercices-bac-sujets-corriges/suites.php",desc:"Récurrence, limites, suite auxiliaire géométrique, convergence"},
    {name:"Exercices BAC corrigés — Suites (annales2maths)",url:"https://www.annales2maths.com/ts-exercices-corriges-suites/",desc:"Tous les types de suites tombés au BAC"},
    {name:"Exercices BAC — Suites (maths-france.fr)",url:"https://maths-france.fr/terminales/problemes-du-bac-s/annales-thematiques/suites/",desc:"Exercices classés par difficulté avec corrigés"},
  ],
  probabilites:[
    {name:"Exercices BAC corrigés — Probabilités (xymaths.fr)",url:"https://xymaths.fr/Lycee/Terminale-generale-specialite-mathematiques/exercices-bac-sujets-corriges/probabilites.php",desc:"Probas conditionnelles, arbres, loi binomiale, Bayes"},
    {name:"Exercices BAC corrigés — Probabilités (annales2maths)",url:"https://www.annales2maths.com/ts-exercices-corriges-probabilites/",desc:"Tous les types de probas tombés au BAC"},
    {name:"Cours + exercices — Probabilités (spe-maths.fr)",url:"https://spe-maths.fr/probabilite/",desc:"Cours complet + exercices corrigés type BAC"},
  ],
  logarithme:[
    {name:"Exercices BAC corrigés — Fonctions ln et exp (xymaths.fr)",url:"https://xymaths.fr/Lycee/Terminale-generale-specialite-mathematiques/exercices-bac-sujets-corriges/exponentielle-logarithme-ln.php",desc:"Étude de fonctions exp/ln, dérivation, intégrale, aire"},
    {name:"Exercices BAC corrigés — Fonctions (annales2maths)",url:"https://www.annales2maths.com/ts-exercices-corriges-fonctions/",desc:"Tous les types d'études de fonctions tombés au BAC"},
  ],
  derivation:[
    {name:"Exercices BAC corrigés — Fonctions (xymaths.fr)",url:"https://xymaths.fr/Lycee/Terminale-generale-specialite-mathematiques/exercices-bac-sujets-corriges/exponentielle-logarithme-ln.php",desc:"Dérivation, tableau de variations, tangente, convexité"},
  ],
  primitives:[
    {name:"Exercices BAC corrigés — Intégrales & Primitives (xymaths.fr)",url:"https://xymaths.fr/Lycee/Terminale-generale-specialite-mathematiques/exercices-bac-sujets-corriges/integrales.php",desc:"Primitives, éq. diff., calcul d'aire — sujets BAC avec corrigés détaillés"},
    {name:"Cours + exercices corrigés — Primitives (spe-maths.fr)",url:"https://spe-maths.fr/primitives/",desc:"Cours complet + exercices corrigés type BAC sur les primitives"},
  ],
  integration:[
    {name:"Exercices BAC corrigés — Fonctions avec intégrales (xymaths.fr)",url:"https://xymaths.fr/Lycee/Terminale-generale-specialite-mathematiques/exercices-bac-sujets-corriges/exponentielle-logarithme-ln.php",desc:"Calcul d'aire, IPP, primitives"},
  ],
  geometrie:[
    {name:"Exercices BAC corrigés — Géométrie espace (xymaths.fr)",url:"https://xymaths.fr/Lycee/Terminale-generale-specialite-mathematiques/exercices-bac-sujets-corriges/geometrie-dans-l-espace.php",desc:"Plans, vecteur normal, produit scalaire, distance point-plan"},
    {name:"Exercices BAC corrigés — Géométrie (annales2maths)",url:"https://www.annales2maths.com/ts-exercices-corriges-geometrie/",desc:"Tous les types de géométrie dans l'espace tombés au BAC"},
  ],
};
const DIAG=[
{q:"La suite (uₙ) définie par uₙ = 3n − 5 est :",ch:["suites"],choices:["Arithmétique de raison 3","Géométrique de raison 3","Ni l'un ni l'autre","Arithmétique de raison −5"],answer:0,expl:"uₙ₊₁ − uₙ = 3(n+1)−5 − (3n−5) = 3. Différence constante donc arithmétique de raison 3."},
{q:"Si uₙ₊₁ = 2uₙ et u₀ = 3, alors u₃ vaut :",ch:["suites"],choices:["12","18","24","6"],answer:2,expl:"Suite géométrique de raison 2. u₃ = u₀ × 2³ = 3 × 8 = 24."},
{q:"La somme 1+2+3+...+100 vaut :",ch:["suites"],choices:["5050","5000","10000","10100"],answer:0,expl:"Formule : S = [[n(n+1)|2]] = [[100×101|2]] = 5050."},
{q:"Pour une suite géométrique de raison q et premier terme u₀, uₙ = :",ch:["suites"],choices:["u₀ × qⁿ","u₀ + nq","u₀ × n × q","qⁿ"],answer:0,expl:"Formule du terme général d'une suite géométrique : uₙ = u₀ × qⁿ."},
{q:"La suite uₙ = (−1)ⁿ est :",ch:["suites"],choices:["Ni convergente ni divergente vers ±∞","Convergente vers 0","Convergente vers 1","Croissante"],answer:0,expl:"La suite alterne entre 1 et −1, elle ne converge pas et ne tend pas vers ±∞."},
{q:"Si uₙ est croissante et majorée, alors :",ch:["suites"],choices:["Elle converge","Elle diverge vers +∞","Elle est constante","On ne peut rien dire"],answer:0,expl:"Théorème de convergence monotone : toute suite croissante et majorée converge."},
{q:"Pour prouver que uₙ ≥ 0 pour tout n ∈ ℕ, on utilise :",ch:["suites"],choices:["Le raisonnement par récurrence","La dérivation","Le TVI","Les probabilités"],answer:0,expl:"Le raisonnement par récurrence permet de montrer une propriété pour tout entier n."},
{q:"La somme des termes d'une suite géométrique de raison q ≠ 1 est :",ch:["suites"],choices:["u₀ × [[1−qⁿ|1−q]]","[[u₀|q]]","u₀ × qⁿ","n × u₀"],answer:0,expl:"Sₙ = u₀ × [[1−qⁿ|1−q]] quand q ≠ 1."},
{q:"Si uₙ = [[n+1|n]], alors lim uₙ = :",ch:["suites"],choices:["1","+∞","0","−1"],answer:0,expl:"[[n+1|n]] = 1 + [[1|n]]. Quand n→+∞, [[1|n]]→0, donc lim uₙ = 1."},
{q:"Une suite arithmétique de raison r < 0 est :",ch:["suites"],choices:["Décroissante","Croissante","Constante","Convergente"],answer:0,expl:"Si r < 0, chaque terme est plus petit que le précédent, donc la suite est décroissante."},
{q:"lim(x→+∞) [[3x²+1|x²−2]] vaut :",ch:["limites"],choices:["3","+∞","0","1"],answer:0,expl:"On factorise par x² : [[3+1/x²|1−2/x²]] → [[3|1]] = 3 quand x→+∞."},
{q:"lim(x→0⁺) [[1|x]] vaut :",ch:["limites"],choices:["+∞","0","−∞","1"],answer:0,expl:"Quand x→0⁺, le dénominateur tend vers 0 par valeurs positives, donc [[1|x]]→+∞."},
{q:"lim(x→+∞) (x² − x) vaut :",ch:["limites"],choices:["+∞","0","−∞","1"],answer:0,expl:"x²−x = x(x−1). Quand x→+∞, les deux facteurs tendent vers +∞, donc le produit aussi."},
{q:"lim(x→+∞) [[eˣ|x]] vaut :",ch:["limites"],choices:["+∞","0","1","e"],answer:0,expl:"Croissance comparée : l'exponentielle l'emporte sur toute puissance de x. Donc [[eˣ|x]]→+∞."},
{q:"lim(x→+∞) [[ln(x)|x]] vaut :",ch:["limites"],choices:["0","+∞","1","ln"],answer:0,expl:"Croissance comparée : x l'emporte sur ln(x). Donc [[ln(x)|x]]→0."},
{q:"La forme [[∞|∞]] est :",ch:["limites"],choices:["Une forme indéterminée","Toujours égale à 1","Toujours égale à 0","Toujours +∞"],answer:0,expl:"[[∞|∞]] est une forme indéterminée. Il faut factoriser ou simplifier pour lever l'indétermination."},
{q:"lim(x→1) [[x²−1|x−1]] vaut :",ch:["limites"],choices:["2","0","+∞","1"],answer:0,expl:"x²−1 = (x−1)(x+1). Donc [[x²−1|x−1]] = x+1. En x=1 : 1+1 = 2."},
{q:"Si lim f(x) = +∞ et lim g(x) = −∞, alors lim(f+g) est :",ch:["limites"],choices:["Forme indéterminée","+∞","−∞","0"],answer:0,expl:"+∞ + (−∞) est une forme indéterminée. Il faut étudier la vitesse de croissance de f et g."},
{q:"Une asymptote horizontale y = L signifie :",ch:["limites"],choices:["lim f(x) = L quand x→±∞","f(L) = 0","f'(L) = 0","f est définie en L"],answer:0,expl:"y = L est asymptote horizontale si lim(x→+∞) f(x) = L ou lim(x→−∞) f(x) = L."},
{q:"lim(x→0) [[sin(x)|x]] vaut :",ch:["limites"],choices:["1","0","+∞","sin"],answer:0,expl:"Limite classique à connaître : lim(x→0) [[sin(x)|x]] = 1."},
{q:"La dérivée de f(x) = x³ − 2x + 1 est :",ch:["derivation"],choices:["3x² − 2","3x² − 2x","x⁴ − x²","3x − 2"],answer:0,expl:"(x³)' = 3x², (−2x)' = −2, (1)' = 0. Donc f'(x) = 3x² − 2."},
{q:"Si f'(x) > 0 sur I, alors f est :",ch:["derivation"],choices:["Croissante sur I","Décroissante sur I","Constante","Convexe"],answer:0,expl:"f' > 0 sur I ⟹ f strictement croissante sur I."},
{q:"La dérivée de eˣ est :",ch:["derivation"],choices:["eˣ","xeˣ⁻¹","1","e"],answer:0,expl:"L'exponentielle est la seule fonction égale à sa propre dérivée : (eˣ)' = eˣ."},
{q:"La dérivée de ln(x) est :",ch:["derivation"],choices:["[[1|x]]","ln(x)","x","[[x|ln]]"],answer:0,expl:"(ln x)' = [[1|x]] pour x > 0. C'est une formule fondamentale."},
{q:"(u × v)' = :",ch:["derivation"],choices:["u'v + uv'","u'v'","u'v − uv'","(uv)²"],answer:0,expl:"Formule du produit : (uv)' = u'v + uv'."},
{q:"L'équation de la tangente à f en a est :",ch:["derivation"],choices:["y = f'(a)(x−a) + f(a)","y = f(a)x + f'(a)","y = f'(x)","y = ax + b"],answer:0,expl:"La tangente en a a pour équation y = f'(a)(x − a) + f(a)."},
{q:"La dérivée de sin(x) est :",ch:["derivation"],choices:["cos(x)","−cos(x)","sin(x)","−sin(x)"],answer:0,expl:"(sin x)' = cos x. Attention : (cos x)' = −sin x."},
{q:"Si f'(a) = 0 et f'' change de signe en a, alors a est :",ch:["derivation"],choices:["Un point d'inflexion","Un maximum","Un minimum","Un zéro"],answer:0,expl:"Si f''(a) = 0 et f'' change de signe en a, c'est un point d'inflexion (changement de convexité)."},
{q:"f est convexe sur I ⟺ :",ch:["derivation"],choices:["f'' ≥ 0 sur I","f' ≥ 0 sur I","f ≥ 0 sur I","f'' ≤ 0 sur I"],answer:0,expl:"f convexe ⟺ f'' ≥ 0. f concave ⟺ f'' ≤ 0."},
{q:"La dérivée de [[1|x]] est :",ch:["derivation"],choices:["[[−1|x²]]","[[1|x²]]","ln(x)","−x"],answer:0,expl:"([[1|x]])' = −x⁻² = [[−1|x²]]."},
{q:"f continue sur [a,b], f(a)<0, f(b)>0. D'après le TVI :",ch:["continuite"],choices:["∃ c ∈ ]a,b[ tel que f(c)=0","f est dérivable","f admet un maximum","f est croissante"],answer:0,expl:"TVI : si f est continue et change de signe, il existe c tel que f(c) = 0."},
{q:"Toute fonction dérivable est :",ch:["continuite"],choices:["Continue","Convexe","Croissante","Bornée"],answer:0,expl:"Dérivable ⟹ continue. Attention : la réciproque est fausse (ex : |x| est continue mais pas dérivable en 0)."},
{q:"Le TVI permet de :",ch:["continuite"],choices:["Prouver l'existence d'une solution","Calculer une dérivée","Trouver un maximum","Calculer une intégrale"],answer:0,expl:"Le TVI prouve qu'une équation f(x) = k admet au moins une solution sur un intervalle."},
{q:"f est continue sur [a,b]. Alors f atteint :",ch:["continuite"],choices:["Son maximum et son minimum","Sa dérivée","Son point d'inflexion","Sa limite"],answer:0,expl:"Théorème des bornes atteintes : f continue sur [a,b] (fermé borné) atteint ses bornes."},
{q:"Une fonction en escalier est-elle continue ?",ch:["continuite"],choices:["Non","Oui","Parfois","Seulement si croissante"],answer:0,expl:"Une fonction en escalier a des discontinuités aux points de saut, elle n'est donc pas continue."},
{q:"f convexe sur I signifie que la courbe est :",ch:["convexite"],choices:["Au-dessus de ses tangentes","En dessous de ses tangentes","Croissante","Décroissante"],answer:0,expl:"Caractérisation géométrique : f convexe ⟺ la courbe est au-dessus de chacune de ses tangentes."},
{q:"Si f'' > 0 sur I, alors f' est :",ch:["convexite"],choices:["Croissante sur I","Décroissante sur I","Nulle","Constante"],answer:0,expl:"f'' > 0 signifie que f' est croissante. C'est aussi la condition de convexité."},
{q:"Un point d'inflexion est un point où :",ch:["convexite"],choices:["La convexité change","f s'annule","f' s'annule","f atteint un extremum"],answer:0,expl:"Un point d'inflexion est un point où f'' s'annule en changeant de signe (passage convexe ↔ concave)."},
{q:"f concave sur I ⟺ :",ch:["convexite"],choices:["f'' ≤ 0 sur I","f'' ≥ 0 sur I","f' ≤ 0 sur I","f ≤ 0 sur I"],answer:0,expl:"f concave ⟺ f'' ≤ 0 sur I. La courbe est en dessous de ses tangentes."},
{q:"En un point d'inflexion, la tangente :",ch:["convexite"],choices:["Traverse la courbe","Est horizontale","N'existe pas","Est verticale"],answer:0,expl:"En un point d'inflexion, la tangente traverse la courbe (elle passe de dessous à dessus ou inversement)."},
{q:"ln(e³) vaut :",ch:["logarithme"],choices:["3","e³","3e","1"],answer:0,expl:"ln(eⁿ) = n. Donc ln(e³) = 3."},
{q:"ln(a) + ln(b) = :",ch:["logarithme"],choices:["ln(ab)","ln(a+b)","ln(a)×ln(b)","ln(a/b)"],answer:0,expl:"Propriété fondamentale : ln(a) + ln(b) = ln(a×b). Piège : ≠ ln(a+b)."},
{q:"ln(1) vaut :",ch:["logarithme"],choices:["0","1","e","−1"],answer:0,expl:"ln(1) = 0 car e⁰ = 1. C'est une valeur remarquable."},
{q:"ln(a) − ln(b) = :",ch:["logarithme"],choices:["ln([[a|b]])","ln(a−b)","[[ln(a)|ln(b)]]","ln(a)−b"],answer:0,expl:"ln(a) − ln(b) = ln([[a|b]]). C'est la propriété du quotient."},
{q:"La dérivée de ln(x) est :",ch:["logarithme"],choices:["[[1|x]]","ln(x)","x","eˣ"],answer:0,expl:"(ln x)' = [[1|x]] pour tout x > 0."},
{q:"L'ensemble de définition de ln(x) est :",ch:["logarithme"],choices:["]0, +∞[","ℝ","[0, +∞[","ℝ*"],answer:0,expl:"ln est défini uniquement pour x strictement positif : ]0, +∞[."},
{q:"ln(eˣ) = :",ch:["logarithme"],choices:["x","eˣ","x×e","ln(x)"],answer:0,expl:"ln et exp sont réciproques : ln(eˣ) = x pour tout x ∈ ℝ."},
{q:"Si ln(x) = 2, alors x = :",ch:["logarithme"],choices:["e²","2","ln(2)","2e"],answer:0,expl:"ln(x) = 2 ⟺ x = e². On applique l'exponentielle des deux côtés."},
{q:"ln(x²) = :",ch:["logarithme"],choices:["2ln(x)","(ln x)²","ln(2x)","2+ln(x)"],answer:0,expl:"ln(xⁿ) = n×ln(x). Donc ln(x²) = 2ln(x) (pour x > 0)."},
{q:"lim(x→0⁺) ln(x) = :",ch:["logarithme"],choices:["−∞","0","+∞","1"],answer:0,expl:"Quand x tend vers 0⁺, ln(x) tend vers −∞."},
{q:"cos(π) vaut :",ch:["trigo"],choices:["−1","0","1","π"],answer:0,expl:"cos(π) = −1. Sur le cercle trigo, π correspond au point (−1, 0)."},
{q:"cos(x) = 0 sur [0,2π] : x = :",ch:["trigo"],choices:["π/2 et 3π/2","0 et π","π/4 et 3π/4","π et 2π"],answer:0,expl:"cos(x) = 0 pour x = π/2 et x = 3π/2."},
{q:"sin(π/6) vaut :",ch:["trigo"],choices:["1/2","√2/2","√3/2","1"],answer:0,expl:"sin(π/6) = 1/2. Valeur remarquable à connaître."},
{q:"cos²(x) + sin²(x) = :",ch:["trigo"],choices:["1","0","2","cos(2x)"],answer:0,expl:"Identité fondamentale : cos²(x) + sin²(x) = 1 pour tout x."},
{q:"La dérivée de cos(x) est :",ch:["trigo"],choices:["−sin(x)","sin(x)","cos(x)","−cos(x)"],answer:0,expl:"(cos x)' = −sin x. Attention au signe moins."},
{q:"La période de sin(x) est :",ch:["trigo"],choices:["2π","π","π/2","4π"],answer:0,expl:"sin est 2π-périodique : sin(x + 2π) = sin(x)."},
{q:"cos(π/3) vaut :",ch:["trigo"],choices:["1/2","√3/2","√2/2","0"],answer:0,expl:"cos(π/3) = 1/2. À ne pas confondre avec cos(π/6) = √3/2."},
{q:"sin est une fonction :",ch:["trigo"],choices:["Impaire","Paire","Ni l'un ni l'autre","Constante"],answer:0,expl:"sin(−x) = −sin(x), donc sin est impaire. cos est paire : cos(−x) = cos(x)."},
{q:"Les solutions de sin(x) = 1 sur [0,2π] sont :",ch:["trigo"],choices:["x = π/2","x = 0","x = π","x = 3π/2"],answer:0,expl:"sin(x) = 1 ⟺ x = π/2 + 2kπ. Sur [0,2π], la seule solution est x = π/2."},
{q:"tan(x) = :",ch:["trigo"],choices:["[[sin(x)|cos(x)]]","sin(x) × cos(x)","sin(x) + cos(x)","[[cos(x)|sin(x)]]"],answer:0,expl:"tan(x) = [[sin(x)|cos(x)]]. Défini quand cos(x) ≠ 0."},
{q:"Une primitive de 2x est :",ch:["primitives"],choices:["x² + C","2","x²/2","2x²"],answer:0,expl:"(x²)' = 2x donc F(x) = x² + C est une primitive de 2x."},
{q:"∫₀¹ 3x² dx vaut :",ch:["integration"],choices:["1","3","0","1/3"],answer:0,expl:"Primitive de 3x² : x³. [x³]₀¹ = 1 − 0 = 1."},
{q:"Une primitive de eˣ est :",ch:["primitives"],choices:["eˣ + C","xeˣ","eˣ/x","ln(eˣ)"],answer:0,expl:"(eˣ)' = eˣ donc eˣ est sa propre primitive."},
{q:"∫ₐᵇ f(x)dx représente géométriquement :",ch:["integration"],choices:["L'aire algébrique sous la courbe","La dérivée","La tangente","Le maximum"],answer:0,expl:"L'intégrale donne l'aire algébrique entre la courbe, l'axe des x, et les droites x=a, x=b."},
{q:"Une primitive de [[1|x]] est :",ch:["primitives"],choices:["ln|x| + C","[[1|x²]]","−[[1|x²]]","eˣ"],answer:0,expl:"(ln|x|)' = [[1|x]], donc ln|x| + C est une primitive de [[1|x]]."},
{q:"∫ₐᵇ f(x)dx + ∫ᵇᶜ f(x)dx = :",ch:["integration"],choices:["∫ₐᶜ f(x)dx","0","∫ₐᵇ f(x)dx","∫ᵇᶜ f(x)dx"],answer:0,expl:"Relation de Chasles : on peut découper une intégrale en sous-intervalles."},
{q:"Si f ≥ 0 sur [a,b], alors ∫ₐᵇ f(x)dx est :",ch:["integration"],choices:["≥ 0","= 0","< 0","Indéterminé"],answer:0,expl:"Si f est positive, l'intégrale (aire sous la courbe) est positive ou nulle."},
{q:"La valeur moyenne de f sur [a,b] est :",ch:["integration"],choices:["[[1|b−a]] × ∫ₐᵇ f(x)dx","∫ₐᵇ f(x)dx","f(a)+f(b)","[[f(a)+f(b)|2]]"],answer:0,expl:"Valeur moyenne = [[1|b−a]] × ∫ₐᵇ f(x)dx."},
{q:"Une primitive de cos(x) est :",ch:["primitives"],choices:["sin(x) + C","−sin(x) + C","cos(x)","tan(x)"],answer:0,expl:"(sin x)' = cos x, donc sin(x) + C est une primitive de cos(x)."},
{q:"Une primitive de sin(x) est :",ch:["primitives"],choices:["−cos(x) + C","cos(x) + C","−sin(x) + C","sin(x)"],answer:0,expl:"(−cos x)' = sin x, donc −cos(x) + C est une primitive de sin(x). Attention au signe !"},
{q:"Une primitive de e²ˣ est :",ch:["primitives"],choices:["[[1|2]]e²ˣ + C","2e²ˣ + C","e²ˣ + C","xe²ˣ + C"],answer:0,expl:"∫e^(ax) = [[1|a]]e^(ax) + C. Ici a = 2, donc [[1|2]]e²ˣ + C."},
{q:"Une primitive de x³ est :",ch:["primitives"],choices:["[[x⁴|4]] + C","3x² + C","x⁴ + C","[[x³|3]] + C"],answer:0,expl:"∫xⁿ = [[xⁿ⁺¹|n+1]] + C. Ici n = 3, donc [[x⁴|4]] + C."},
{q:"Une primitive de cos(2x) est :",ch:["primitives"],choices:["[[sin(2x)|2]] + C","sin(2x) + C","2sin(2x) + C","−[[sin(2x)|2]] + C"],answer:0,expl:"∫cos(ax+b) = [[1|a]]sin(ax+b) + C. Ici a = 2."},
{q:"Deux primitives d'une même fonction diffèrent :",ch:["primitives"],choices:["D'une constante","D'un facteur","De la variable x","De rien"],answer:0,expl:"Théorème fondamental : si F et G sont primitives de f sur un intervalle, alors F − G = constante."},
{q:"F(x) = x² + 5 est primitive de f(x) = :",ch:["primitives"],choices:["2x","x² + 5","2x + 5","x²"],answer:0,expl:"On dérive : F'(x) = 2x. La constante 5 disparaît à la dérivation."},
{q:"y' = 3y a pour solution générale :",ch:["primitives"],choices:["y = Ce³ˣ","y = 3x + C","y = e³ˣ","y = C·3ˣ"],answer:0,expl:"y' = ay → y = Ce^(ax). Ici a = 3, donc y = Ce³ˣ."},
{q:"y' = −2y, y(0) = 4. La solution est :",ch:["primitives"],choices:["y = 4e⁻²ˣ","y = −2e⁴ˣ","y = 4e²ˣ","y = −4e⁻²ˣ"],answer:0,expl:"Sol gén : y = Ce⁻²ˣ. y(0) = C = 4. Donc y = 4e⁻²ˣ."},
{q:"La solution particulière constante de y' = 5y − 15 est :",ch:["primitives"],choices:["y = 3","y = 5","y = 15","y = −3"],answer:0,expl:"y₀ = −b/a = −(−15)/5 = 3. Vérif : si y = 3, y' = 0 et 5×3−15 = 0. ✓"},
{q:"y' = −y + 4, y(0) = 6 →",ch:["primitives"],choices:["y = 2e⁻ˣ + 4","y = 6e⁻ˣ + 4","y = 2eˣ + 4","y = 6eˣ − 4"],answer:0,expl:"Sol gén : y = Ce⁻ˣ + 4. y(0) = C + 4 = 6 → C = 2. y = 2e⁻ˣ + 4."},
{q:"Si y' = −0.5y et y(0) = 100, alors y(2) ≈ :",ch:["primitives"],choices:["36.8","50","60.7","13.5"],answer:0,expl:"y = 100e⁻⁰·⁵ˣ. y(2) = 100e⁻¹ ≈ 100 × 0.368 ≈ 36.8."},
{q:"Pour y' = ay + b, la solution particulière constante y₀ = :",ch:["primitives"],choices:["−b/a","b/a","a/b","−a/b"],answer:0,expl:"Si y est constante, y' = 0, donc 0 = ay₀ + b → y₀ = −b/a."},
{q:"∫ [[2x|x²+1]] dx = :",ch:["primitives"],choices:["ln(x²+1) + C","[[1|x²+1]] + C","2ln(x) + C","ln(2x) + C"],answer:0,expl:"Forme u'/u avec u = x²+1, u' = 2x → ln|u| + C = ln(x²+1) + C."},
{q:"L'IPP (intégration par parties) utilise la formule :",ch:["integration"],choices:["∫u'v = [uv] − ∫uv'","∫u'v = ∫uv'","∫uv = u×v","∫u+v = ∫u + ∫v"],answer:0,expl:"IPP : ∫ₐᵇ u'v = [uv]ₐᵇ − ∫ₐᵇ uv'. On choisit u' et v judicieusement."},
{q:"C(5,3) = le nombre de façons de choisir 3 parmi 5 :",ch:["combinatoire"],choices:["10","15","60","20"],answer:0,expl:"C(5,3) = [[5!|3!×2!]] = [[120|12]] = 10."},
{q:"P(A ∣B) se lit :",ch:["probabilites"],choices:["Probabilité de A∣B","Probabilité de A et B","P de A ou B","P de B sachant A"],answer:0,expl:"P(A ∣B) = [[P(A∩B)|P(B)]] : probabilité de A sachant que B est réalisé."},
{q:"X suit B(n,p). E(X) = :",ch:["probabilites"],choices:["np","n+p","n/p","p/n"],answer:0,expl:"Espérance de la loi binomiale : E(X) = np."},
{q:"5! (factorielle 5) vaut :",ch:["combinatoire"],choices:["120","25","60","720"],answer:0,expl:"5! = 5×4×3×2×1 = 120."},
{q:"Deux événements A et B sont indépendants si :",ch:["probabilites"],choices:["P(A∩B) = P(A)×P(B)","P(A∩B) = 0","P(A) = P(B)","P(A ∣B) = P(B)"],answer:0,expl:"A et B indépendants ⟺ P(A∩B) = P(A) × P(B)."},
{q:"V(X) pour X ~ B(n,p) vaut :",ch:["probabilites"],choices:["np(1−p)","np","n+p","p(1−p)"],answer:0,expl:"Variance de la loi binomiale : V(X) = np(1−p)."},
{q:"Le nombre d'arrangements de 3 parmi 5 est :",ch:["combinatoire"],choices:["60","10","15","120"],answer:0,expl:"A(5,3) = [[5!|(5−3)!]] = [[120|2]] = 60. L'ordre compte dans un arrangement."},
{q:"P(A∪B) = P(A) + P(B) si :",ch:["probabilites"],choices:["A et B sont incompatibles","A et B sont indépendants","P(A) = P(B)","Toujours"],answer:0,expl:"P(A∪B) = P(A)+P(B) uniquement si A∩B = ∅ (événements incompatibles)."},
{q:"La loi des grands nombres dit que :",ch:["probabilites"],choices:["La moyenne converge vers l'espérance","La variance tend vers 0","P tend vers 1","n tend vers ∞"],answer:0,expl:"Quand n augmente, la moyenne des observations converge vers E(X)."},
{q:"P(Ā) = :",ch:["probabilites"],choices:["1 − P(A)","P(A)","1/P(A)","0"],answer:0,expl:"L'événement contraire : P(Ā) = 1 − P(A). Très utile quand il est plus simple de calculer le contraire."},
{q:"Un vecteur normal au plan 2x−y+3z=5 est :",ch:["geometrie"],choices:["(2,−1,3)","(2,1,3)","(5,0,0)","(2,−1,5)"],answer:0,expl:"Pour ax+by+cz=d, le vecteur normal est (a,b,c) = (2,−1,3)."},
{q:"Deux plans sont parallèles si leurs vecteurs normaux sont :",ch:["geometrie"],choices:["Colinéaires","Orthogonaux","Égaux","Opposés"],answer:0,expl:"Plans parallèles ⟺ vecteurs normaux colinéaires (proportionnels)."},
{q:"Le produit scalaire u⃗·v⃗ = 0 signifie :",ch:["geometrie"],choices:["u⃗ ⊥ v⃗","u⃗ = v⃗","u⃗ ∥ v⃗","u⃗ = 0⃗"],answer:0,expl:"Produit scalaire nul ⟺ vecteurs orthogonaux (perpendiculaires)."},
{q:"La distance d'un point M₀ au plan ax+by+cz+d=0 est :",ch:["geometrie"],choices:["[[|ax₀+by₀+cz₀+d||√(a²+b²+c²)]]","ax₀+by₀+cz₀","√(a²+b²+c²)","0"],answer:0,expl:"Formule de distance point-plan : d = [[|ax₀+by₀+cz₀+d||√(a²+b²+c²)]]."},
{q:"Une droite est définie par :",ch:["geometrie"],choices:["Un point et un vecteur directeur","Deux vecteurs","Un seul point","Une équation"],answer:0,expl:"Une droite dans l'espace est définie par un point A et un vecteur directeur u⃗."},
{q:"Deux droites dans l'espace peuvent être :",ch:["geometrie"],choices:["Sécantes, parallèles ou non coplanaires","Uniquement sécantes ou parallèles","Toujours sécantes","Toujours parallèles"],answer:0,expl:"Dans l'espace (contrairement au plan), deux droites peuvent aussi être non coplanaires (ni sécantes ni parallèles)."},
{q:"u⃗·v⃗ = :",ch:["geometrie"],choices:["x₁x₂ + y₁y₂ + z₁z₂","x₁y₂ − x₂y₁","(x₁+x₂, y₁+y₂)","||u⃗|| × ||v⃗||"],answer:0,expl:"En coordonnées : u⃗·v⃗ = x₁x₂ + y₁y₂ + z₁z₂."},
{q:"||u⃗|| = √(x²+y²+z²) est :",ch:["geometrie"],choices:["La norme de u⃗","Le produit scalaire","Le vecteur normal","La distance"],answer:0,expl:"La norme (longueur) d'un vecteur u⃗(x,y,z) est ||u⃗|| = √(x²+y²+z²)."},
{q:"L'intersection de deux plans non parallèles est :",ch:["geometrie"],choices:["Une droite","Un point","Un plan","Vide"],answer:0,expl:"Deux plans non parallèles se coupent selon une droite."},
{q:"Le milieu de [A(1,2,3) ; B(5,4,1)] a pour coordonnées :",ch:["geometrie"],choices:["(3, 3, 2)","(6, 6, 4)","(4, 2, 2)","(2, 1, 1)"],answer:0,expl:"Milieu = ([[1+5|2]], [[2+4|2]], [[3+1|2]]) = (3, 3, 2)."},
{q:"|z| pour z = 3+4i vaut :",ch:["complexes"],choices:["5","7","√7","25"],answer:0,expl:"|z| = √(3²+4²) = √(9+16) = √25 = 5."},
{q:"L'argument de z = −1+i est :",ch:["complexes"],choices:["3π/4","π/4","−π/4","π"],answer:0,expl:"z est dans le 2ème quadrant. |z|=√2, cos(θ)=[[−1|√2]], sin(θ)=[[1|√2]], donc θ=3π/4."},
{q:"La forme algébrique de z = 2(cos(π/3)+i×sin(π/3)) est :",ch:["complexes"],choices:["1 + i√3","2 + 2i","√3 + i","1 + i"],answer:0,expl:"z = 2×[[1|2]] + 2i×[[√3|2]] = 1 + i√3."},
{q:"i² = :",ch:["complexes"],choices:["−1","1","i","−i"],answer:0,expl:"Par définition, i² = −1. C'est la propriété fondamentale du nombre imaginaire."},
{q:"Le conjugué de z = 3 − 2i est :",ch:["complexes"],choices:["3 + 2i","−3 + 2i","−3 − 2i","2 − 3i"],answer:0,expl:"Le conjugué de a+bi est a−bi. Donc le conjugué de 3−2i est 3+2i."},
{q:"z × z̄ = :",ch:["complexes"],choices:["|z|²","0","2z","z²"],answer:0,expl:"z × z̄ = (a+bi)(a−bi) = a²+b² = |z|². Très utile pour diviser des complexes."},
{q:"|z₁ × z₂| = :",ch:["complexes"],choices:["|z₁| × |z₂|","|z₁| + |z₂|","|z₁| − |z₂|","[[|z₁||z₂|]]"],answer:0,expl:"Le module d'un produit est le produit des modules."},
{q:"arg(z₁ × z₂) = :",ch:["complexes"],choices:["arg(z₁) + arg(z₂)","arg(z₁) × arg(z₂)","arg(z₁) − arg(z₂)","arg(z₁)/arg(z₂)"],answer:0,expl:"L'argument d'un produit est la somme des arguments (modulo 2π)."},
{q:"L'affixe du milieu de [A(z₁), B(z₂)] est :",ch:["complexes"],choices:["[[z₁+z₂|2]]","z₁ × z₂","z₁ − z₂","[[z₁|z₂]]"],answer:0,expl:"Le milieu a pour affixe [[z₁+z₂|2]], comme en géométrie classique."},
{q:"eⁱᶿ = :",ch:["complexes"],choices:["cos(θ) + i×sin(θ)","sin(θ) + i×cos(θ)","cos(θ) − i×sin(θ)","θ + i"],answer:0,expl:"Formule d'Euler : eⁱᶿ = cos(θ) + i×sin(θ). Fondamental pour la forme exponentielle."}
];
const DIAG_BLOCS=[
{name:"Suites",ids:["suites"],qs:[0,1,2,3,4,5,6,7,8,9]},
{name:"Limites",ids:["limites"],qs:[10,11,12,13,14,15,16,17,18,19]},
{name:"Dérivation",ids:["derivation"],qs:[20,21,22,23,24,25,26,27,28,29]},
{name:"Continuité & Convexité",ids:["continuite","convexite"],qs:[30,31,32,33,34,35,36,37,38,39]},
{name:"Logarithme",ids:["logarithme"],qs:[40,41,42,43,44,45,46,47,48,49]},
{name:"Trigonométrie",ids:["trigo"],qs:[50,51,52,53,54,55,56,57,58,59]},
{name:"Primitives & Intégration",ids:["primitives","integration"],qs:[60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82]},
{name:"Combinatoire & Probabilités",ids:["combinatoire","probabilites"],qs:[83,84,85,86,87,88,89,90,91,92]},
{name:"Géométrie dans l'espace",ids:["geometrie"],qs:[93,94,95,96,97,98,99,100,101,102]},
{name:"Nombres complexes",ids:["complexes"],qs:[103,104,105,106,107,108,109,110,111,112]}
];
// ─── APP ────────────────────────────────────────────────────
export default function App(){
const[user,setUser]=useState(null);const[pin,setPin]=useState("");const[loginErr,setLoginErr]=useState("");const[loginRole,setLoginRole]=useState(null);const[page,setPage]=useState("home");const[ch,setCh]=useState(null);const[tab,setTab]=useState("cours");const[filt,setFilt]=useState("all");const[qa,setQa]=useState({});const[qDone,setQDone]=useState(false);const[qIdx,setQIdx]=useState(0);const[hints,setHints]=useState({});const[sols,setSols]=useState({});const[prog,setProg]=useState({});const[msgs,setMsgs]=useState([]);const[msgDraft,setMsgDraft]=useState("");const[files,setFiles]=useState([]);const[fileComment,setFileComment]=useState("");
const[aiMsgs,setAiMsgs]=useState([{role:"assistant",content:"Salut Sami !  Je suis MathBot, ton tuteur perso. Tu peux me poser n'importe quelle question, même si tu penses qu'elle est bête — y a pas de question bête ici ! Par quoi tu veux commencer ?"}]);
const[aiInput,setAiInput]=useState("");const[aiLoading,setAiLoading]=useState(false);const[aiImage,setAiImage]=useState(null);const[fbIdx,setFbIdx]=useState(null);const[fbText,setFbText]=useState("");const[customExos,setCustomExos]=useState({});const[exoForm,setExoForm]=useState({title:"",statement:"",hint:"",solution:"",chapter:"",file:null,fileName:"",fileType:""});const[search,setSearch]=useState("");const[msgImage,setMsgImage]=useState(null);const[aiCorrection,setAiCorrection]=useState({});const[aiCorrLoading,setAiCorrLoading]=useState(null);const[chCopies,setChCopies]=useState({});const chCopyRef=useRef(null);const[copyEnonce,setCopyEnonce]=useState(null);const[copyWork,setCopyWork]=useState(null);const[copyCorrLoading,setCopyCorrLoading]=useState(false);
const[diagIdx,setDiagIdx]=useState(0);const[diagAns,setDiagAns]=useState({});const[diagDone,setDiagDone]=useState(false);const[diagResult,setDiagResult]=useState(null);const[diagBloc,setDiagBloc]=useState(null);const[weekGoals,setWeekGoals]=useState([]);const[goalDraft,setGoalDraft]=useState("");const[timeSpent,setTimeSpent]=useState({});const[samiChats,setSamiChats]=useState([]);const[showChats,setShowChats]=useState(false);const[samiDiag,setSamiDiag]=useState(null);const[showDiag,setShowDiag]=useState(false);const[quizLog,setQuizLog]=useState([]);const[showQuizLog,setShowQuizLog]=useState(false);
const chatRef=useRef(null);const fileRef=useRef(null);const exoFileRef=useRef(null);const aiFileRef=useRef(null);const msgImgRef=useRef(null);const chRef=useRef(null);const timerRef=useRef(0);const tsRef=useRef({});tsRef.current=timeSpent;

useEffect(()=>{(async()=>{try{const[p,m,f,c,ce,wg,ts,cc,dp]=await Promise.all([dbGet("mt-prog"),dbGet("mt-msgs"),dbGet("mt-files"),dbGet("mt-ai"),dbGet("mt-exos"),dbGet("mt-goals"),dbGet("mt-time"),dbGet("mt-copies"),dbGet("mt-diag-progress")]);if(p&&typeof p==="object"&&!Array.isArray(p))setProg(p);if(Array.isArray(m))setMsgs(m);if(Array.isArray(f))setFiles(f);if(ce&&typeof ce==="object"&&!Array.isArray(ce))setCustomExos(ce);if(Array.isArray(wg))setWeekGoals(wg);if(ts&&typeof ts==="object"&&!Array.isArray(ts))setTimeSpent(ts);if(cc&&typeof cc==="object"&&!Array.isArray(cc))setChCopies(cc);if(dp&&typeof dp==="object"&&!Array.isArray(dp))setDiagAns(dp);}catch(e){console.log("load err",e);}})();},[]);
const sv=useCallback((k,v)=>{dbSet(k,v);},[]);
const stopT=()=>{if(timerRef.current&&chRef.current){const e=Math.round((Date.now()-timerRef.current)/1000);if(e>5){const n={...tsRef.current,[chRef.current.id]:(tsRef.current[chRef.current.id]||0)+e};setTimeSpent(n);sv("mt-time",n);}}timerRef.current=0;};
const login=(role)=>{const c=CONFIG[role];if(pin===c.pin){setUser({name:c.name,role});setLoginErr("");setPin("");(async()=>{const chat=await dbGet("mt-ai-"+role);if(Array.isArray(chat)&&chat.length)setAiMsgs(chat);else setAiMsgs([{role:"assistant",content:role==="eleve"?"Salut Sami ! Je suis ton tuteur en maths. Pose-moi n'importe quelle question.":"Bonjour Imran. Comment puis-je vous aider ?"}]);})();}else setLoginErr("Code incorrect");};
const isProf=user?.role==="prof";
const openCh=(c)=>{stopT();setCh(c);chRef.current=c;setPage("chapter");setTab("cours");setQDone(false);setQIdx(0);setHints({});setSols({});dbGet("mt-quiz-qa-"+c.id).then(saved=>{if(saved&&typeof saved==="object"&&!Array.isArray(saved))setQa(saved);else setQa({});});if(user?.role==="eleve")timerRef.current=Date.now();};
const goHome=()=>{stopT();setPage("home");setCh(null);chRef.current=null;};
const navTo=(p)=>{stopT();setPage(p);};
const submitQ=()=>{if(!ch)return;let s=0;ch.quiz.forEach((q,i)=>{if(qa[i]===q.answer)s++;});const pct=Math.round(s/ch.quiz.length*100);setQDone(true);sv("mt-quiz-qa-"+ch.id,{});const np={...prog,[ch.id]:{best:Math.max((prog[ch.id]?.best)||0,pct),n:(prog[ch.id]?.n||0)+1,last:new Date().toISOString()}};setProg(np);sv("mt-prog",np);if(!isProf){const detail={chId:ch.id,chTitle:ch.title,score:pct,total:ch.quiz.length,correct:s,ts:new Date().toISOString(),answers:ch.quiz.map((q,i)=>({q:q.question,picked:q.choices[qa[i]]||"—",correct:q.choices[q.answer],ok:qa[i]===q.answer}))};dbGet("mt-quiz-log").then(old=>{const log=Array.isArray(old)?old:[];log.push(detail);if(log.length>50)log.splice(0,log.length-50);sv("mt-quiz-log",log);});}};
const sendMsg=()=>{if(!msgDraft.trim()&&!msgImage)return;const nm=[...msgs,{from:user.role,text:msgDraft.trim(),image:msgImage?.data||null,ts:new Date().toISOString()}];setMsgs(nm);setMsgDraft("");setMsgImage(null);if(msgImgRef.current)msgImgRef.current.value="";sv("mt-msgs",nm);};
const handleFile=(e)=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=(ev)=>{const nf=[...files,{name:f.name,size:f.size,type:f.type,data:ev.target.result,from:user.role,ts:new Date().toISOString(),comment:fileComment,feedback:""}];setFiles(nf);setFileComment("");sv("mt-files",nf);};r.readAsDataURL(f);};
const addFb=(idx,fb)=>{const nf=[...files];nf[idx]={...nf[idx],feedback:fb};setFiles(nf);sv("mt-files",nf);};
const handleExoFile=(e)=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=(ev)=>{setExoForm(p=>({...p,file:ev.target.result,fileName:f.name,fileType:f.type}));};r.readAsDataURL(f);};
const saveExo=()=>{if(!exoForm.title||!exoForm.chapter||(!exoForm.statement&&!exoForm.file))return;const id=exoForm.chapter;const ne={...customExos,[id]:[...(customExos[id]||[]),{title:exoForm.title,statement:exoForm.statement||"(voir document)",hint:exoForm.hint,solution:exoForm.solution,file:exoForm.file,fileName:exoForm.fileName,fileType:exoForm.fileType,byProf:true,ts:new Date().toISOString()}]};setCustomExos(ne);sv("mt-exos",ne);setExoForm({title:"",statement:"",hint:"",solution:"",chapter:"",file:null,fileName:"",fileType:""});if(exoFileRef.current)exoFileRef.current.value="";};
const delExo=(id,i)=>{const ne={...customExos,[id]:customExos[id].filter((_,j)=>j!==i)};setCustomExos(ne);sv("mt-exos",ne);};
const handleAiImage=(e)=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=(ev)=>{setAiImage({data:ev.target.result,name:f.name});};r.readAsDataURL(f);};
const handleAiDrop=(e)=>{e.preventDefault();e.stopPropagation();const f=e.dataTransfer?.files?.[0];if(f&&f.type.startsWith("image/")){const r=new FileReader();r.onload=(ev)=>{setAiImage({data:ev.target.result,name:f.name});};r.readAsDataURL(f);}};
const handleAiPaste=(e)=>{const items=e.clipboardData?.items;if(!items)return;for(const item of items){if(item.type.startsWith("image/")){e.preventDefault();const f=item.getAsFile();const r=new FileReader();r.onload=(ev)=>{setAiImage({data:ev.target.result,name:"capture.png"});};r.readAsDataURL(f);break;}}};
const mkDrop=(setter)=>(e)=>{e.preventDefault();e.stopPropagation();const f=e.dataTransfer?.files?.[0];if(f&&f.type.startsWith("image/")){const r=new FileReader();r.onload=(ev)=>{setter({data:ev.target.result,name:f.name,type:f.type});};r.readAsDataURL(f);}};
const mkPaste=(setter)=>(e)=>{const items=e.clipboardData?.items;if(!items)return;for(const item of items){if(item.type.startsWith("image/")){e.preventDefault();const f=item.getAsFile();const r=new FileReader();r.onload=(ev)=>{setter({data:ev.target.result,name:"capture.png",type:f.type});};r.readAsDataURL(f);break;}}};
const dragOver=(e)=>{e.preventDefault();e.stopPropagation();};
const sendAi=async()=>{if((!aiInput.trim()&&!aiImage)||aiLoading)return;const um=aiInput.trim()||"Analyse cette image.";setAiInput("");let uc;if(aiImage){uc=[{type:"text",text:um},{type:"image_url",image_url:{url:aiImage.data}}];}else{uc=um;}const dm={role:"user",content:um,image:aiImage?.data||null};const nm=[...aiMsgs,dm];setAiMsgs(nm);setAiLoading(true);setAiImage(null);if(aiFileRef.current)aiFileRef.current.value="";try{const sp=user.role==="eleve"?"Tu es MathBot, tuteur de Sami (Terminale Spé Maths).\n\nFORMAT OBLIGATOIRE :\n- JAMAIS de LaTeX ($, \\frac, \\sqrt, etc.)\n- Fractions TOUJOURS en [[numérateur|dénominateur]] — ex : [[5|(x+1)²]], [[6x+1|x+1]], [[5+√29|2]]\n- JAMAIS utiliser / pour les fractions\n- Racines : √(x+1)\n- Puissances : x², xⁿ, e⁻ˣ\n- Indices : uₙ, uₙ₊₁\n- Symboles : ∀ ∃ ∈ ℝ ℂ ℕ ⟹ ⟺ ≥ ≤ ≠ ∞ ∑ ∫ √ π\n\nSTYLE CORRIGÉ BAC :\n- Quand tu corriges ou résous un exercice, rédige EXACTEMENT comme un corrigé officiel du BAC\n- Chaque étape de calcul sur une NOUVELLE ligne\n- Utilise ⟺ entre les étapes d'équivalence\n- Utilise ⟹ pour les implications\n- Commence par 'La fonction f est...', 'Soit...', 'On a...'\n- Justifie chaque étape : 'car...', 'd'après le théorème...', 'or...'\n- Termine par 'Donc...' ou 'Conclusion :'\n- Cite les théorèmes par leur nom (TVI, convergence monotone, IPP...)\n\nExemple de style attendu :\nf(x) = x ⟺ 6 − [[5|x+1]] = x\n  ⟺ [[6(x+1)−5|x+1]] = x\n  ⟺ [[6x+1|x+1]] − x = 0\n  ⟺ [[−x²+5x+1|x+1]] = 0\n\nPÉDAGOGIE :\n- Après chaque explication, vérifie que Sami a compris\n- Si erreur, réexplique autrement\n- Rappels de 1ère si nécessaire\n- Réponds en français":"Tu es un assistant mathématiques pour Imran, professeur de maths. Aide-le à préparer exercices et corrections.\n\nFORMAT : JAMAIS de LaTeX. Fractions en [[a|b]]. Symboles Unicode. Concis et professionnel. Français.";const fm=[{role:"system",content:sp},...nm.map(m=>{if(m===dm&&m.image)return{role:"user",content:uc};return{role:m.role==="assistant"?"assistant":"user",content:typeof m.content==="string"?m.content:""};}).filter(m=>m.content||Array.isArray(m.content))];const r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:fm})});const d=await r.json();const reply=cleanLatex(d.choices?.[0]?.message?.content)||"Désolé, erreur.";const f=[...nm,{role:"assistant",content:reply}];setAiMsgs(f);sv("mt-ai-"+user.role,f);if(user.role==="eleve"&&useSB){try{await fetch(SB_URL+"/rest/v1/kv_store",{method:"POST",headers:{apikey:SB_KEY,Authorization:"Bearer "+SB_KEY,"Content-Type":"application/json",Prefer:"resolution=merge-duplicates"},body:JSON.stringify({key:"mt-ai-sami",value:JSON.stringify(f.map(m=>({role:m.role,content:m.content,ts:new Date().toISOString()})))})});}catch{}}}catch{setAiMsgs([...nm,{role:"assistant",content:"⚠️ Erreur de connexion."}]);}setAiLoading(false);};
useEffect(()=>{chatRef.current?.scrollTo(0,chatRef.current.scrollHeight);},[aiMsgs]);
const loadSamiChats=async()=>{if(!useSB)return;try{const r=await fetch(SB_URL+"/rest/v1/kv_store?key=eq.mt-ai-sami&select=value",{headers:{apikey:SB_KEY,Authorization:"Bearer "+SB_KEY}});const d=await r.json();if(d?.[0]?.value)setSamiChats(JSON.parse(d[0].value));}catch{}};
const loadSamiDiag=async()=>{try{const d=await dbGet("mt-diag");if(d)setSamiDiag(d);}catch{}};
const addGoal=()=>{if(!goalDraft.trim())return;const ng=[...weekGoals,{text:goalDraft.trim(),done:false}];setWeekGoals(ng);setGoalDraft("");sv("mt-goals",ng);};
const toggleGoal=(i)=>{const ng=[...weekGoals];ng[i]={...ng[i],done:!ng[i].done};setWeekGoals(ng);sv("mt-goals",ng);};
const delGoal=(i)=>{const ng=weekGoals.filter((_,j)=>j!==i);setWeekGoals(ng);sv("mt-goals",ng);};
const stats=useMemo(()=>{const a=CHAPTERS.filter(c=>prog[c.id]?.n>0).length,m=CHAPTERS.filter(c=>(prog[c.id]?.best||0)>=80).length,avg=CHAPTERS.length?Math.round(CHAPTERS.reduce((s,c)=>s+(prog[c.id]?.best||0),0)/CHAPTERS.length):0;return{a,m,avg};},[prog]);
const totalTime=useMemo(()=>{try{return Object.values(timeSpent).reduce((a,b)=>(Number(a)||0)+(Number(b)||0),0);}catch{return 0;}},[timeSpent]);
const streak=useMemo(()=>{try{const days=new Set();Object.values(prog).forEach(p=>{if(p?.last)days.add(String(p.last).slice(0,10));});let c=0,d=new Date();for(let i=0;i<365;i++){if(days.has(d.toISOString().slice(0,10))){c++;d.setDate(d.getDate()-1);}else break;}return c;}catch{return 0;}},[prog]);
const searchRes=useMemo(()=>{if(!search.trim())return[];const q=search.toLowerCase();return CHAPTERS.filter(c=>c.title.toLowerCase().includes(q)||c.sections.some(s=>s.toLowerCase().includes(q))||c.theme.toLowerCase().includes(q));},[search]);
const nextStep=useMemo(()=>LEARNING_PATH.find(lp=>(prog[lp.id]?.best||0)<60),[prog]);
const unread=Array.isArray(msgs)?msgs.filter(m=>m&&m.from!==(isProf?"prof":"eleve")).length:0;
const list=filt==="all"?CHAPTERS:CHAPTERS.filter(c=>c.theme===filt);

// ═══ LOGIN ══════════════════════════════════════════════════
if(!user)return(
<div style={A}><style>{CSS}</style>
<div style={{...C,display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh"}}>
<div className="e" style={{maxWidth:360,width:"100%"}}>
  <div style={{marginBottom:32}}>
    <h1 style={{fontSize:28,fontWeight:800,margin:"0 0 6px",letterSpacing:"-.04em",color:"var(--tx)"}}>{CONFIG.appTitle}</h1>
    <div style={{width:32,height:3,borderRadius:2,background:"var(--ac)",marginBottom:8}}/>
    <p style={{color:"var(--tx3)",fontSize:13}}>Plateforme de révision</p>
  </div>
  <div style={{background:"var(--bg2)",border:"1px solid var(--bd)",borderRadius:12,padding:24}}>
    {!loginRole?<>
      <label style={{fontSize:12,fontWeight:600,color:"var(--tx2)",display:"block",marginBottom:12,letterSpacing:".5px",textTransform:"uppercase"}}>Sélectionnez votre compte</label>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        <button onClick={()=>{setLoginRole("prof");setPin("");setLoginErr("");}} className="c" style={{padding:16,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",border:"1px solid var(--bd)",background:"var(--bg3)"}}><span style={{fontWeight:700,fontSize:15,color:"var(--tx)"}}>{CONFIG.prof.name}</span><span style={{fontSize:12,color:"var(--tx3)"}}>Professeur</span></button>
        <button onClick={()=>{setLoginRole("eleve");setPin("");setLoginErr("");}} className="c" style={{padding:16,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",border:"1px solid var(--bd)",background:"var(--bg3)"}}><span style={{fontWeight:700,fontSize:15,color:"var(--tx)"}}>{CONFIG.eleve.name}</span><span style={{fontSize:12,color:"var(--tx3)"}}>Élève</span></button>
      </div>
    </>:<>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
        <button onClick={()=>{setLoginRole(null);setPin("");setLoginErr("");}} style={{background:"none",border:"none",cursor:"pointer",color:"var(--tx2)",fontSize:14,fontFamily:"inherit"}}>←</button>
        <span style={{fontWeight:700,fontSize:15}}>{CONFIG[loginRole].name}</span>
        <span style={{fontSize:12,color:"var(--tx3)"}}>{loginRole==="prof"?"Professeur":"Élève"}</span>
      </div>
      <label style={{fontSize:12,fontWeight:600,color:"var(--tx2)",display:"block",marginBottom:8,letterSpacing:".5px",textTransform:"uppercase"}}>Code d'accès</label>
      <input type="password" maxLength={6} value={pin} onChange={e=>setPin(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&pin.length>=4)login(loginRole);}} placeholder="• • • • • •" style={{...inp,textAlign:"center",fontSize:22,letterSpacing:14,marginBottom:14}} autoFocus/>
      {loginErr?<p style={{color:"var(--rd)",fontSize:12,marginBottom:10}}>{loginErr}</p>:null}
      <button onClick={()=>login(loginRole)} style={{...btn,background:"var(--ac)",border:"none",color:"#fff",width:"100%",justifyContent:"center",padding:14,fontFamily:"inherit"}}>Se connecter</button>
    </>}
  </div>
</div>
</div>
</div>);

// ═══ SHARED ═════════════════════════════════════════════════
const W=<><style>{CSS}</style><div className="e" style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}><div><h1 style={{fontSize:22,fontWeight:800,letterSpacing:"-.03em"}}>{isProf?"Bonjour, "+CONFIG.prof.name:CONFIG.eleve.name}</h1><p style={{color:"var(--tx3)",fontSize:12,marginTop:2}}>{isProf?"Espace professeur":"Espace révision"}</p></div><Tag color={isProf?"var(--ac)":"var(--gn)"}>{user.role}</Tag></div></>;
const N=<div className="e" style={{display:"flex",gap:5,marginBottom:18,overflowX:"auto",WebkitOverflowScrolling:"touch",paddingBottom:4}}>
  <button onClick={goHome} style={nbtn(page==="home")}>Cours</button>
  <button onClick={()=>navTo("chatbot")} style={nbtn(page==="chatbot")}>Tuteur IA</button>
  <button onClick={()=>navTo("files")} style={nbtn(page==="files")}>Fichiers</button>
  <button onClick={()=>navTo("annales")} style={nbtn(page==="annales")}>Annales</button>
  <button onClick={()=>navTo("inbox")} style={nbtn(page==="inbox")}>Messages{unread>0?<span style={{background:"var(--rd)",color:"#fff",borderRadius:4,padding:"1px 5px",fontSize:10,fontWeight:700,marginLeft:4}}>{unread}</span>:null}</button>
  {isProf?<button onClick={()=>navTo("dashboard")} style={nbtn(page==="dashboard")}>Suivi</button>:null}
  {isProf?<button onClick={()=>navTo("create-exo")} style={nbtn(page==="create-exo")}>Créer</button>:null}
  <button onClick={()=>{stopT();setUser(null);setPage("home");setAiMsgs([{role:"assistant",content:"Salut ! Je suis ton tuteur en maths. Pose-moi n'importe quelle question."}]);}} style={{...nbtn(false),color:"var(--rd)"}}>Quitter</button>
</div>;

// ═══ DIAGNOSTIC ═════════════════════════════════════════════
if(page==="diagnostic")return(<div style={A}><style>{CSS}</style><div style={C}>{W}{N}
  {diagBloc===null&&!diagDone?<>
    <Sec style={{background:"rgba(124,92,252,.06)",border:"1px solid rgba(124,92,252,.15)"}}>
      <h3 style={{margin:"0 0 4px",fontSize:18,fontWeight:800}}>Test de positionnement</h3>
      <p style={{fontSize:12,color:"var(--tx2)",marginBottom:14}}>Choisis la notion que tu veux tester. Tu peux les faire dans l'ordre que tu veux.</p>
    </Sec>
    {DIAG_BLOCS.map((b,i)=>{const done=b.qs.every(qi=>diagAns[qi]!==undefined);const score=done?Math.round(b.qs.filter(qi=>diagAns[qi]===DIAG[qi].answer).length/b.qs.length*100):null;return<div key={i} onClick={()=>{setDiagBloc(i);setDiagIdx(0);}} className="c" style={{padding:16,marginBottom:8,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div>
        <div style={{fontWeight:700,fontSize:14}}>{b.name}</div>
        <div style={{fontSize:11,color:"var(--tx3)",...mono}}>{b.qs.length} question{b.qs.length>1?"s":""}</div>
      </div>
      {done?<span style={{fontSize:13,fontWeight:700,color:score>=80?"var(--gn)":score>=50?"var(--or)":"var(--rd)",...mono}}>{score}%</span>
      :<span style={{fontSize:12,color:"var(--tx3)"}}>Pas encore fait</span>}
    </div>;})}
    {Object.keys(diagAns).length===DIAG.length?<button onClick={()=>{const res=DIAG_BLOCS.map(b=>{const total=b.qs.length;const correct=b.qs.filter(qi=>diagAns[qi]===DIAG[qi].answer).length;return{...b,score:Math.round(correct/total*100),correct,total};});setDiagResult(res);setDiagDone(true);sv("mt-diag",{results:res,avg:Math.round(res.reduce((s,b)=>s+b.score,0)/res.length),ts:new Date().toISOString(),detail:DIAG.map((d,i)=>({q:d.q,picked:d.choices[diagAns[i]]||"—",correct:d.choices[d.answer],ok:diagAns[i]===d.answer,bloc:DIAG_BLOCS.find(b=>b.qs.includes(i))?.name||""}))});}} style={{...btn,background:"var(--gn)",border:"none",color:"#fff",width:"100%",justifyContent:"center",padding:14,fontSize:14,marginTop:8}}>Voir le bilan complet</button>
    :<p style={{fontSize:12,color:"var(--tx3)",textAlign:"center",marginTop:8,...mono}}>{Object.keys(diagAns).length}/{DIAG.length} questions complétées</p>}
  </>:null}

  {diagBloc!==null&&!diagDone?(()=>{const bloc=DIAG_BLOCS[diagBloc];const qis=bloc.qs;const qi=qis[diagIdx];return<>
    <Sec style={{background:"rgba(124,92,252,.06)",border:"1px solid rgba(124,92,252,.15)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <h3 style={{margin:0,fontSize:16,fontWeight:700}}>{bloc.name}</h3>
        <span style={{fontSize:12,color:"var(--tx3)",...mono}}>{diagIdx+1}/{qis.length}</span>
      </div>
      <div style={{display:"flex",gap:3}}>{qis.map((_,i)=><div key={i} style={{flex:1,height:3,borderRadius:2,background:diagAns[qis[i]]!==undefined?"var(--ac)":i===diagIdx?"var(--ac)":"var(--bg4)",opacity:diagAns[qis[i]]!==undefined?1:i===diagIdx?.6:.3}}/>)}</div>
    </Sec>
    <Sec>
      <p style={{fontSize:15,fontWeight:600,marginBottom:16,lineHeight:1.6}}><MathText text={DIAG[qi].q}/></p>
      {DIAG[qi].choices.map((c,ci)=><button key={ci} style={qo(diagAns[qi]===ci,false,false,false)} onClick={()=>{const na={...diagAns,[qi]:ci};setDiagAns(na);sv("mt-diag-progress",na);}}><span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:22,height:22,borderRadius:6,marginRight:10,background:diagAns[qi]===ci?"rgba(124,92,252,.15)":"var(--bg4)",color:diagAns[qi]===ci?"var(--ac)":"var(--tx3)",fontSize:11,fontWeight:700,...mono}}>{String.fromCharCode(65+ci)}</span><MathText text={c}/></button>)}
    </Sec>
    <div style={{display:"flex",justifyContent:"space-between"}}>
      <button onClick={()=>{if(diagIdx>0)setDiagIdx(diagIdx-1);else setDiagBloc(null);}} style={btn}>{diagIdx===0?"Retour":"Précédent"}</button>
      {diagIdx<qis.length-1?<button onClick={()=>setDiagIdx(diagIdx+1)} style={{...btn,background:"var(--ac)",border:"none",color:"#fff"}}>Suivant</button>
      :<button onClick={()=>{setDiagBloc(null);setDiagIdx(0);}} style={{...btn,background:"var(--gn)",border:"none",color:"#fff"}}>Terminé — choisir une autre notion</button>}
    </div>
  </>})():null}

  {diagDone?<>
    <Sec style={{textAlign:"center",padding:24}}>
      <h3 style={{margin:"0 0 4px",fontSize:22,fontWeight:800}}>Ton bilan</h3>
      <p style={{color:"var(--tx3)",fontSize:13,marginBottom:16}}>Voici tes résultats par bloc du programme</p>
      <Ring p={Math.round(diagResult.reduce((s,b)=>s+b.score,0)/diagResult.length)} sz={70} sw={6}/>
      <p style={{fontSize:13,color:"var(--tx2)",marginTop:8}}>{Math.round(diagResult.reduce((s,b)=>s+b.score,0)/diagResult.length)}% de moyenne</p>
    </Sec>
    {diagResult.map((b,i)=><Sec key={i} style={{borderColor:b.score>=80?"rgba(52,211,153,.2)":b.score>=50?"rgba(251,191,36,.2)":"rgba(248,113,113,.2)"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <div style={{fontWeight:700,fontSize:14}}>{b.name}</div>
          <div style={{fontSize:12,color:"var(--tx3)",...mono}}>{b.correct}/{b.total} correct{b.correct>1?"s":""}</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:14,fontWeight:800,color:b.score>=80?"var(--gn)":b.score>=50?"var(--or)":"var(--rd)",...mono}}>{b.score}%</span>
          <span style={{fontSize:12,color:b.score>=80?"var(--gn)":b.score>=50?"var(--or)":"var(--rd)"}}>{b.score>=80?"Acquis":b.score>=50?"À consolider":"À travailler"}</span>
        </div>
      </div>
    </Sec>)}
    <Sec>
      <h3 style={{margin:"0 0 10px",fontSize:14,fontWeight:700}}>Recommandation</h3>
      {diagResult.filter(b=>b.score<80).length===0?<p style={{fontSize:13,color:"var(--gn)"}}>Excellent niveau. Entraîne-toi sur les annales BAC pour viser la mention.</p>
      :<><p style={{fontSize:13,color:"var(--tx2)",marginBottom:8}}>Commence par revoir ces notions en priorité :</p>
      {diagResult.filter(b=>b.score<80).sort((a,b)=>a.score-b.score).map((b,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",marginBottom:4,borderRadius:8,background:"var(--bg3)",border:"1px solid var(--bd)"}}>
        <span style={{fontSize:13,fontWeight:700,color:b.score<50?"var(--rd)":"var(--or)",...mono}}>{i+1}.</span>
        <span style={{flex:1,fontSize:13,fontWeight:600}}>{b.name}</span>
        {b.ids.map(id=>{const c=CHAPTERS.find(x=>x.id===id);return c?<button key={id} onClick={()=>openCh(c)} style={{...btn,fontSize:11,padding:"4px 10px",background:c.color+"15",color:c.color,borderColor:c.color+"25"}}>Réviser</button>:null;})}
      </div>)}</>}
    </Sec>
    <div style={{display:"flex",gap:8}}>
      <button onClick={()=>{setDiagIdx(0);setDiagAns({});setDiagDone(false);setDiagResult(null);setDiagBloc(null);sv("mt-diag-progress",{});}} style={btn}>Refaire le test</button>
      <button onClick={goHome} style={{...btn,background:"var(--ac)",border:"none",color:"#fff",flex:1,justifyContent:"center"}}>Retour aux cours</button>
    </div>

    <Sec style={{marginTop:14}}>
      <h3 style={{margin:"0 0 14px",fontSize:16,fontWeight:700}}>Correction détaillée</h3>
      {DIAG.map((d,i)=>{const ok=diagAns[i]===d.answer;return<div key={i} style={{padding:"14px 16px",marginBottom:8,borderRadius:10,background:ok?"rgba(52,211,153,.04)":"rgba(248,113,113,.04)",border:"1px solid "+(ok?"rgba(52,211,153,.15)":"rgba(248,113,113,.15)")}}>
        <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:6}}>
          <span style={{fontSize:12,color:ok?"var(--gn)":"var(--rd)",fontWeight:700,...mono}}>Q{i+1}</span>
          <span style={{fontSize:11,color:ok?"var(--gn)":"var(--rd)"}}>{ok?"Correct":"Incorrect"}</span>
          <span style={{fontSize:10,color:"var(--tx3)",marginLeft:"auto",...mono}}>{d.ch.map(c=>CHAPTERS.find(x=>x.id===c)?.title).join(", ")}</span>
        </div>
        <p style={{fontSize:13,fontWeight:600,marginBottom:6,lineHeight:1.5}}><MathText text={d.q}/></p>
        {!ok?<div style={{fontSize:12,marginBottom:6}}>
          <span style={{color:"var(--rd)"}}>Ta réponse : {d.choices[diagAns[i]]}</span>
          <span style={{color:"var(--tx3)",margin:"0 6px"}}>—</span>
          <span style={{color:"var(--gn)"}}>Bonne réponse : {d.choices[d.answer]}</span>
        </div>:null}
        <div style={{fontSize:12,color:"var(--tx2)",lineHeight:1.7,padding:"8px 12px",borderRadius:8,background:"var(--bg3)",border:"1px solid var(--bd)"}}><MathText text={d.expl}/></div>
      </div>;})}
    </Sec>
  </>:null}
</div></div>);

// ═══ CHATBOT ════════════════════════════════════════════════
if(page==="chatbot")return(<div style={A}><div style={C} onDrop={handleAiDrop} onDragOver={e=>{e.preventDefault();e.stopPropagation();}}>{W}{N}
  <Sec style={{height:"52vh",overflowY:"auto",padding:14}}>
    <div ref={chatRef} style={{display:"flex",flexDirection:"column",gap:8,height:"100%",overflowY:"auto"}}>
    {aiMsgs.map((m,i)=><div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}><div style={{maxWidth:"80%",padding:"11px 15px",borderRadius:14,fontSize:14,lineHeight:1.7,whiteSpace:"pre-wrap",background:m.role==="user"?"var(--ac)":"var(--bg3)",border:"1px solid "+(m.role==="user"?"rgba(124,92,252,.4)":"var(--bd)"),color:m.role==="user"?"#fff":"var(--tx)"}}>{m.image?<img src={m.image} alt="" style={{maxWidth:"100%",maxHeight:180,borderRadius:10,marginBottom:6,display:"block"}}/>:null}<MathText text={m.content}/></div></div>)}
    {aiLoading?<div style={{padding:"11px 15px",borderRadius:14,background:"var(--bg3)",border:"1px solid var(--bd)",color:"var(--tx2)",fontSize:14,alignSelf:"flex-start"}}>Réflexion en cours...</div>:null}
    </div>
  </Sec>
  {aiImage?<div style={{display:"flex",alignItems:"center",gap:8,marginTop:6,padding:"8px 12px",background:"var(--bg3)",borderRadius:10,border:"1px solid var(--bd)"}}><img src={aiImage.data} alt="" style={{width:40,height:40,objectFit:"cover",borderRadius:6}}/><span style={{flex:1,fontSize:12,color:"var(--ac)",fontWeight:600}}>{aiImage.name}</span><button onClick={()=>{setAiImage(null);if(aiFileRef.current)aiFileRef.current.value="";}} style={{background:"none",border:"none",cursor:"pointer",color:"var(--rd)",fontSize:14}}>✕</button></div>:null}
  <div style={{display:"flex",gap:6,marginTop:6}}>
    <input ref={aiFileRef} type="file" accept="image/*" onChange={handleAiImage} style={{display:"none"}}/>
    <button onClick={()=>aiFileRef.current?.click()} style={{...btn,padding:"10px 12px",fontSize:14}} title="Joindre une image">+</button>
    <input value={aiInput} onChange={e=>setAiInput(e.target.value)} onPaste={handleAiPaste} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();sendAi();}}} placeholder={aiImage?"Question sur cette image...":"Poser une question..."} style={{...inp,flex:1}}/>
    <button onClick={sendAi} style={{...btn,background:"var(--ac)",border:"none",color:"#fff"}}>Envoyer</button>
  </div>
  <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>{["Suites et récurrence","Limites de fonctions","Dérivation et convexité","Calcul intégral","Probabilités conditionnelles"].map((q,i)=><button key={i} onClick={()=>setAiInput(q)} style={{padding:"5px 10px",borderRadius:8,border:"1px solid var(--bd)",background:"var(--bg3)",color:"var(--tx2)",fontSize:11,cursor:"pointer"}}>{q}</button>)}</div>
</div></div>);

// ═══ ANNALES BAC ════════════════════════════════════════════
if(page==="annales")return(<div style={A}><div style={C}>{W}{N}
  <Sec style={{background:"rgba(124,92,252,.06)",border:"1px solid rgba(124,92,252,.15)"}}>
    <h3 style={{margin:"0 0 4px",fontSize:18,fontWeight:800}}>Annales BAC Spécialité Maths</h3>
    <p style={{fontSize:12,color:"var(--tx2)",marginBottom:4}}>Sujets et corrigés des années précédentes — Métropole, Amérique du Nord, Centres étrangers, Asie, Polynésie...</p>
    <p style={{fontSize:12,color:"var(--or)"}}>Conseil : fais chaque sujet en 4h chrono sans cours, puis compare avec le corrigé.</p>
  </Sec>

  {[
    {year:"2025",color:"var(--or)",count:"19 sujets + 19 corrigés",links:[
      {name:"Math93 — Tous les sujets 2025",url:"https://www.math93.com/annales-du-bac/bac-specialite-mathematiques/annales-maths-2025.html"},
      {name:"APMEP — Annales 2025 avec corrigés",url:"https://www.apmep.fr/Annales-Terminale-Generale"},
      {name:"SujetDeBac — Session 2025",url:"https://www.sujetdebac.fr/annales/specialites/spe-mathematiques/"},
    ]},
    {year:"2024",color:"var(--ac)",count:"18 sujets + 18 corrigés",links:[
      {name:"Math93 — Tous les sujets 2024",url:"https://www.math93.com/annales-du-bac/bac-specialite-mathematiques/annales-maths-2024.html"},
      {name:"APMEP — Annales 2024 avec corrigés",url:"https://www.apmep.fr/Annales-Terminale-Generale"},
      {name:"Annales2maths — Sujets corrigés 2024",url:"https://www.annales2maths.com/sujets-et-corrections-de-bac-specialite-mathematiques/"},
    ]},
    {year:"2023",color:"var(--gn)",count:"21 sujets + 21 corrigés",links:[
      {name:"Math93 — Tous les sujets 2023",url:"https://www.math93.com/annales-du-bac/bac-specialite-mathematiques/annales-maths-2023.html"},
      {name:"APMEP — Annales 2023 avec corrigés",url:"https://www.apmep.fr/Annales-Terminale-Generale"},
      {name:"Annales2maths — Sujets corrigés 2023",url:"https://www.annales2maths.com/sujets-et-corrections-de-bac-specialite-mathematiques/"},
    ]},
    {year:"2022",color:"var(--tx2)",count:"19 sujets + 19 corrigés",links:[
      {name:"Math93 — Tous les sujets 2022",url:"https://www.math93.com/annales-du-bac/bac-specialite-mathematiques/annales-maths-2022.html"},
      {name:"APMEP — Annales 2022 avec corrigés",url:"https://www.apmep.fr/Annales-Terminale-Generale"},
    ]},
  ].map((session,i)=><Sec key={i}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
      <h3 style={{margin:0,fontSize:16,fontWeight:700,color:session.color}}>Session {session.year}</h3>
      <span style={{fontSize:11,color:"var(--tx3)",...mono}}>{session.count}</span>
    </div>
    {session.links.map((l,j)=><a key={j} href={l.url} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",marginBottom:5,borderRadius:10,background:"var(--bg3)",border:"1px solid var(--bd)",textDecoration:"none",color:"var(--tx)",fontSize:13,transition:"all .2s"}}>
      <span style={{width:28,height:28,borderRadius:7,background:"rgba(124,92,252,.1)",color:"var(--ac)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,flexShrink:0}}></span>
      <span style={{flex:1,fontWeight:500}}>{l.name}</span>
      <span style={{color:"var(--ac)",fontSize:12}}>→</span>
    </a>)}
  </Sec>)}

  <Sec>
    <h3 style={{margin:"0 0 8px",fontSize:14,fontWeight:700,color:"var(--ac)"}}>Sites de référence</h3>
    <p style={{fontSize:12,color:"var(--tx2)",marginBottom:10}}>Ces sites regroupent TOUS les sujets de BAC avec corrigés détaillés :</p>
    {[
      {name:"APMEP — 71 sujets + 71 corrigés (2021→2025)",url:"https://www.apmep.fr/Annales-Terminale-Generale",desc:"Le site officiel de l'Association des Profs de Maths"},
      {name:"SujetDeBac.fr — 89 sujets + 49 corrigés",url:"https://www.sujetdebac.fr/annales/specialites/spe-mathematiques/",desc:"Classés par session et par thème"},
      {name:"Math93.com — Annales par année",url:"https://www.math93.com/annales-du-bac/bac-specialite-mathematiques.html",desc:"Site d'un prof avec sujets et corrigés détaillés"},
      {name:"Mathsapiens — Corrections manuscrites",url:"https://mathsapiens.fr/bac-specialite.html",desc:"Corrections rédigées à la main, très pédagogiques"},
    ].map((l,i)=><a key={i} href={l.url} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",marginBottom:6,borderRadius:10,background:"var(--bg3)",border:"1px solid var(--bd)",textDecoration:"none",color:"var(--tx)",transition:"all .2s"}}>
      <span style={{width:32,height:32,borderRadius:8,background:"rgba(124,92,252,.1)",color:"var(--ac)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}></span>
      <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13}}>{l.name}</div><div style={{fontSize:11,color:"var(--tx3)"}}>{l.desc}</div></div>
      <span style={{color:"var(--ac)"}}>→</span>
    </a>)}
  </Sec>
</div></div>);

// ═══ INBOX ══════════════════════════════════════════════════
if(page==="inbox")return(<div style={A}><div style={C} onDrop={mkDrop(setMsgImage)} onDragOver={dragOver}>{W}{N}
  <Sec style={{height:"48vh",overflowY:"auto"}}>
    {msgs.length===0?<p style={{textAlign:"center",color:"var(--tx3)",padding:30}}>Aucun message.</p>:null}
    {msgs.map((m,i)=><div key={i} style={{display:"flex",justifyContent:m.from===user.role?"flex-end":"flex-start",marginBottom:6}}><div style={{maxWidth:"75%",padding:"10px 14px",borderRadius:12,fontSize:14,lineHeight:1.6,background:m.from==="prof"?"rgba(124,92,252,.08)":"rgba(52,211,153,.08)",border:"1px solid "+(m.from==="prof"?"rgba(124,92,252,.15)":"rgba(52,211,153,.15)"),color:"var(--tx)"}}><div style={{fontSize:10,color:"var(--tx3)",marginBottom:3}}>{m.from==="prof"?""+CONFIG.prof.name:""+CONFIG.eleve.name}</div>{m.image?<img src={m.image} alt="" style={{maxWidth:"100%",maxHeight:200,borderRadius:8,marginBottom:6,display:"block"}}/>:null}{m.text}</div></div>)}
  </Sec>
  {msgImage?<div style={{display:"flex",alignItems:"center",gap:8,marginTop:6,padding:"8px 12px",background:"var(--bg3)",borderRadius:10,border:"1px solid var(--bd)"}}><img src={msgImage.data} alt="" style={{width:40,height:40,objectFit:"cover",borderRadius:6}}/><span style={{flex:1,fontSize:12,color:"var(--ac)",fontWeight:600}}>{msgImage.name}</span><button onClick={()=>{setMsgImage(null);if(msgImgRef.current)msgImgRef.current.value="";}} style={{background:"none",border:"none",cursor:"pointer",color:"var(--rd)",fontSize:14}}>✕</button></div>:null}
  <div style={{display:"flex",gap:6,marginTop:6}}>
    <input ref={msgImgRef} type="file" accept="image/*" onChange={(e)=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=(ev)=>{setMsgImage({data:ev.target.result,name:f.name});};r.readAsDataURL(f);}} style={{display:"none"}}/>
    <button onClick={()=>msgImgRef.current?.click()} style={{...btn,padding:"10px 12px",fontSize:16}} title="Photo"></button>
    <input value={msgDraft} onChange={e=>setMsgDraft(e.target.value)} onPaste={mkPaste(setMsgImage)} onKeyDown={e=>{if(e.key==="Enter")sendMsg();}} placeholder="Message..." style={{...inp,flex:1}}/>
    <button onClick={sendMsg} style={{...btn,background:"var(--gn)",border:"none",color:"#fff"}}>→</button>
  </div>
</div></div>);

// ═══ FILES ══════════════════════════════════════════════════
if(page==="files")return(<div style={A}><div style={C} onDrop={(e)=>{e.preventDefault();e.stopPropagation();const f=e.dataTransfer?.files?.[0];if(f){const r=new FileReader();r.onload=(ev)=>{const nf=[...files,{name:f.name,size:f.size,type:f.type,data:ev.target.result,from:user.role,ts:new Date().toISOString(),comment:fileComment,feedback:""}];setFiles(nf);setFileComment("");sv("mt-files",nf);};r.readAsDataURL(f);}}} onDragOver={dragOver}>{W}{N}
  <Sec>
    <p style={{fontSize:13,color:"var(--ac)",fontWeight:600,marginBottom:10}}>{isProf?"Fichiers de "+CONFIG.eleve.name:"Dépose tes copies"}</p>
    {!isProf?<><input value={fileComment} onChange={e=>setFileComment(e.target.value)} placeholder="Commentaire..." style={{...inp,marginBottom:8}}/><input ref={fileRef} type="file" accept="image/*,.pdf" onChange={handleFile} style={{display:"none"}}/><button onClick={()=>fileRef.current?.click()} style={{...btn,background:"var(--ac)",border:"none",color:"#fff",width:"100%",justifyContent:"center"}}>Choisir un fichier</button></>:null}
  </Sec>
  {files.length===0?<Sec><p style={{textAlign:"center",color:"var(--tx3)",padding:16}}>Aucun fichier.</p></Sec>:null}
  {files.map((f,i)=><Sec key={i}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><strong style={{fontSize:14}}>{f.name}</strong><Tag color={f.from==="prof"?"var(--ac)":"var(--gn)"}>{f.from==="prof"?CONFIG.prof.name:CONFIG.eleve.name}</Tag></div>
    {f.comment?<p style={{fontSize:12,color:"var(--tx2)",marginBottom:6}}>{f.comment}</p>:null}
    {f.type?.startsWith("image/")?<img src={f.data} alt="" style={{maxWidth:"100%",maxHeight:280,borderRadius:10,border:"1px solid var(--bd)",marginBottom:6}}/>:null}
    {f.feedback?<div style={{padding:"10px 14px",borderRadius:10,background:"rgba(124,92,252,.08)",border:"1px solid rgba(124,92,252,.15)",fontSize:13,color:"var(--ac2)",marginTop:6}}>{f.feedback}</div>:null}
    {isProf&&!f.feedback?(fbIdx===i?<div style={{display:"flex",gap:6,marginTop:6}}><input value={fbText} onChange={e=>setFbText(e.target.value)} placeholder="Retour..." style={{...inp,flex:1}}/><button onClick={()=>{addFb(i,fbText);setFbIdx(null);setFbText("");}} style={{...btn,background:"var(--ac)",border:"none",color:"#fff"}}>✓</button></div>:<button onClick={()=>setFbIdx(i)} style={{...btn,marginTop:6,fontSize:12}}>Retour</button>):null}
  </Sec>)}
</div></div>);

// ═══ CREATE EXO ═════════════════════════════════════════════
if(page==="create-exo"&&isProf)return(<div style={A}><div style={C}>{W}{N}
  <Sec>
    <h3 style={{marginBottom:14,fontSize:18,fontWeight:700}}>Créer un exercice</h3>
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <select value={exoForm.chapter} onChange={e=>setExoForm({...exoForm,chapter:e.target.value})} style={inp}><option value="">-- Chapitre --</option>{CHAPTERS.map(c=><option key={c.id} value={c.id}>{c.icon} {c.title}</option>)}</select>
      <input value={exoForm.title} onChange={e=>setExoForm({...exoForm,title:e.target.value})} placeholder="Titre" style={inp}/>
      <textarea value={exoForm.statement} onChange={e=>setExoForm({...exoForm,statement:e.target.value})} placeholder="Énoncé (optionnel si fichier)" style={{...inp,minHeight:70,resize:"vertical"}}/>
      <div><input ref={exoFileRef} type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleExoFile} style={{display:"none"}}/><div style={{display:"flex",gap:8,alignItems:"center"}}><button onClick={()=>exoFileRef.current?.click()} style={{...btn,fontSize:12}}>Fichier</button>{exoForm.fileName?<span style={{fontSize:12,color:"var(--gn)"}}>✓ {exoForm.fileName}</span>:null}</div></div>
      <input value={exoForm.hint} onChange={e=>setExoForm({...exoForm,hint:e.target.value})} placeholder="Indice" style={inp}/>
      <textarea value={exoForm.solution} onChange={e=>setExoForm({...exoForm,solution:e.target.value})} placeholder="Solution" style={{...inp,minHeight:50,resize:"vertical"}}/>
      <button onClick={saveExo} style={{...btn,background:"var(--ac)",border:"none",color:"#fff",justifyContent:"center",width:"100%",padding:13}}>Enregistrer</button>
    </div>
  </Sec>
  {Object.entries(customExos).filter(([_,e])=>e?.length>0).map(([id,exos])=>{const c=CHAPTERS.find(x=>x.id===id);return<Sec key={id}><div style={{fontSize:13,fontWeight:700,color:c?.color,marginBottom:6}}>{c?.icon} {c?.title}</div>{exos.map((ex,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",marginBottom:3,borderRadius:8,background:"var(--bg3)",border:"1px solid var(--bd)"}}><span style={{flex:1,fontSize:12}}><strong>{ex.title}</strong>{ex.file?" ":""}</span><button onClick={()=>delExo(id,i)} style={{background:"rgba(248,113,113,.1)",border:"1px solid rgba(248,113,113,.2)",borderRadius:6,padding:"3px 8px",cursor:"pointer",fontSize:11,color:"var(--rd)"}}>×</button></div>)}</Sec>;})}
</div></div>);

// ═══ DASHBOARD ═══════════════════════════════════════════════
if(page==="dashboard"&&isProf)return(<div style={A}><div style={C}>{W}{N}
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10,marginBottom:20}}>
    <Sec style={{textAlign:"center",marginBottom:0}}><div style={{fontSize:28,fontWeight:800,color:"var(--ac)",...mono}}>{stats.a}/{CHAPTERS.length}</div><div style={{fontSize:11,color:"var(--tx3)"}}>Tentés</div></Sec>
    <Sec style={{textAlign:"center",marginBottom:0}}><div style={{fontSize:28,fontWeight:800,color:"var(--gn)",...mono}}>{stats.m}</div><div style={{fontSize:11,color:"var(--tx3)"}}>≥80%</div></Sec>
    <Sec style={{textAlign:"center",marginBottom:0}}><Ring p={stats.avg} sz={50} sw={5}/><div style={{fontSize:11,color:"var(--tx3)",marginTop:4}}>Moyenne</div></Sec>
    <Sec style={{textAlign:"center",marginBottom:0}}><div style={{fontSize:28,fontWeight:800,color:"var(--or)",...mono}}>{fmtTime(totalTime)}</div><div style={{fontSize:11,color:"var(--tx3)"}}>Temps</div></Sec>
    <Sec style={{textAlign:"center",marginBottom:0}}><div style={{fontSize:28,fontWeight:800,color:"var(--gn)",...mono}}>{streak}</div><div style={{fontSize:11,color:"var(--tx3)"}}>Streak</div></Sec>
  </div>
  <Sec>
    <h3 style={{marginBottom:12,fontSize:16,fontWeight:700,color:"var(--ac)"}}>{CONFIG.eleve.name}</h3>
    {CHAPTERS.map(c=>{const p=prog[c.id],t=timeSpent[c.id]||0;return<div key={c.id} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",marginBottom:3,borderRadius:8,background:"var(--bg3)",border:"1px solid var(--bd)",fontSize:13}}>
      <span style={{width:26,height:26,borderRadius:7,background:c.color+"15",color:c.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,flexShrink:0}}>{c.icon}</span>
      <span style={{flex:1,fontWeight:600}}>{c.title}</span>
      {p?.n>0?<><span style={{padding:"1px 7px",borderRadius:5,background:(p.best>=80?"var(--gn)":p.best>=50?"var(--or)":"var(--rd)")+"20",color:p.best>=80?"var(--gn)":p.best>=50?"var(--or)":"var(--rd)",fontWeight:700,fontSize:12,...mono}}>{p.best}%</span><span style={{color:"var(--tx3)",fontSize:11,...mono}}>{p.n}x</span></>:<span style={{color:"var(--tx3)",fontSize:11}}>—</span>}
      <span style={{color:"var(--tx3)",fontSize:11,...mono}}>{t>0?fmtTime(t):"—"}</span>
    </div>;})}
  </Sec>
  <Sec>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
      <h3 style={{margin:0,fontSize:16,fontWeight:700,color:"var(--ac)"}}>Erreurs aux quiz</h3>
      <button onClick={()=>{if(!showQuizLog){dbGet("mt-quiz-log").then(d=>{if(Array.isArray(d))setQuizLog(d);});}setShowQuizLog(!showQuizLog);}} style={{...btn,fontSize:12,background:showQuizLog?"var(--ac)":"var(--bg3)",color:showQuizLog?"#fff":"var(--ac)"}}>{showQuizLog?"Masquer":"Voir"}</button>
    </div>
    {showQuizLog?<div>{quizLog.length===0?<p style={{color:"var(--tx3)",fontSize:12,textAlign:"center",padding:16}}>Aucun quiz complété.</p>:quizLog.slice().reverse().map((ql,qi)=><div key={qi} style={{marginBottom:12,padding:"12px 14px",borderRadius:10,background:"var(--bg3)",border:"1px solid var(--bd)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <div><span style={{fontWeight:700,fontSize:13}}>{ql.chTitle}</span><span style={{fontSize:11,color:"var(--tx3)",marginLeft:8,...mono}}>{ql.score}% ({ql.correct}/{ql.total})</span></div>
        <span style={{fontSize:10,color:"var(--tx3)",...mono}}>{new Date(ql.ts).toLocaleDateString("fr")}</span>
      </div>
      {ql.answers.map((a,ai)=><div key={ai} style={{padding:"6px 8px",marginBottom:3,borderRadius:6,background:a.ok?"rgba(52,211,153,.05)":"rgba(248,113,113,.05)",border:"1px solid "+(a.ok?"rgba(52,211,153,.1)":"rgba(248,113,113,.1)"),fontSize:12}}>
        <div style={{fontWeight:600,marginBottom:2,color:"var(--tx)"}}>{a.q}</div>
        {a.ok?<span style={{color:"var(--gn)"}}>Correct : {a.correct}</span>
        :<><span style={{color:"var(--rd)"}}>Réponse : {a.picked}</span><span style={{color:"var(--tx3)",margin:"0 6px"}}>—</span><span style={{color:"var(--gn)"}}>Correct : {a.correct}</span></>}
      </div>)}
    </div>)}</div>:null}
  </Sec>
  <Sec>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
      <h3 style={{margin:0,fontSize:16,fontWeight:700,color:"var(--ac)"}}>Test de positionnement</h3>
      <button onClick={()=>{loadSamiDiag();setShowDiag(!showDiag);}} style={{...btn,fontSize:12,background:showDiag?"var(--ac)":"var(--bg3)",color:showDiag?"#fff":"var(--ac)"}}>{showDiag?"Masquer":"Voir"}</button>
    </div>
    {showDiag?<div>{!samiDiag?<p style={{color:"var(--tx3)",fontSize:12,textAlign:"center",padding:16}}>Sami n'a pas encore fait le test de positionnement.</p>:<div>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
        <Ring p={samiDiag.avg} sz={50} sw={5}/>
        <div><div style={{fontSize:18,fontWeight:800,...mono}}>{samiDiag.avg}%</div><div style={{fontSize:11,color:"var(--tx3)"}}>Moyenne — {new Date(samiDiag.ts).toLocaleDateString("fr")}</div></div>
      </div>
      {samiDiag.results.map((b,i)=><div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 10px",marginBottom:3,borderRadius:8,background:"var(--bg3)",border:"1px solid var(--bd)",fontSize:12}}>
        <span style={{fontWeight:600}}>{b.name}</span>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <span style={{fontWeight:700,color:b.score>=80?"var(--gn)":b.score>=50?"var(--or)":"var(--rd)",...mono}}>{b.score}%</span>
          <span style={{fontSize:10,color:b.score>=80?"var(--gn)":b.score>=50?"var(--or)":"var(--rd)"}}>{b.score>=80?"Acquis":b.score>=50?"Fragile":"Lacune"}</span>
        </div>
      </div>)}
      {samiDiag.results.filter(b=>b.score<50).length>0?<div style={{marginTop:8,padding:"8px 12px",borderRadius:8,background:"rgba(248,113,113,.06)",border:"1px solid rgba(248,113,113,.15)",fontSize:12,color:"var(--rd)"}}>Lacunes détectées : {samiDiag.results.filter(b=>b.score<50).map(b=>b.name).join(", ")}</div>:null}
      {samiDiag.detail?<div style={{marginTop:12}}><h4 style={{fontSize:13,fontWeight:700,marginBottom:8}}>Détail des réponses</h4>
        {samiDiag.detail.map((a,i)=><div key={i} style={{padding:"6px 8px",marginBottom:3,borderRadius:6,background:a.ok?"rgba(52,211,153,.05)":"rgba(248,113,113,.05)",border:"1px solid "+(a.ok?"rgba(52,211,153,.1)":"rgba(248,113,113,.1)"),fontSize:11}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{fontWeight:600,color:"var(--tx)",flex:1}}>{a.q}</span><span style={{fontSize:10,color:"var(--tx3)",flexShrink:0,marginLeft:8}}>{a.bloc}</span></div>
          {a.ok?<span style={{color:"var(--gn)"}}>Correct : {a.correct}</span>
          :<><span style={{color:"var(--rd)"}}>Réponse : {a.picked}</span><span style={{color:"var(--tx3)",margin:"0 6px"}}>—</span><span style={{color:"var(--gn)"}}>Correct : {a.correct}</span></>}
        </div>)}
      </div>:null}
    </div>}</div>:null}
  </Sec>
  <Sec>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
      <h3 style={{margin:0,fontSize:16,fontWeight:700,color:"var(--ac)"}}>Conversations MathBot</h3>
      <button onClick={()=>{loadSamiChats();setShowChats(!showChats);}} style={{...btn,fontSize:12,background:showChats?"var(--ac)":"var(--bg3)",color:showChats?"#fff":"var(--ac)"}}>{showChats?"Masquer":"Voir"}</button>
    </div>
    {showChats?<div>{samiChats.length===0?<p style={{color:"var(--tx3)",fontSize:12,textAlign:"center",padding:16}}>Aucune conversation.</p>:null}{samiChats.filter(m=>m.role!=="system").map((m,i)=><div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",marginBottom:4}}><div style={{maxWidth:"85%",padding:"8px 12px",borderRadius:10,fontSize:12,lineHeight:1.5,whiteSpace:"pre-wrap",background:m.role==="user"?"rgba(124,92,252,.08)":"var(--bg3)",border:"1px solid var(--bd)",color:"var(--tx)"}}><div style={{fontSize:9,color:"var(--tx3)",marginBottom:2}}>{m.role==="user"?"Sami":"MathBot"}</div><MathText text={m.content}/></div></div>)}</div>:null}
  </Sec>
</div></div>);

// ═══ HOME ═══════════════════════════════════════════════════
if(page==="home")return(<div style={A}><div style={C}>{W}{N}
  <div style={{position:"relative",marginBottom:14}}>
    <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher..." style={{...inp,fontSize:14}}/>
    {search&&searchRes.length>0?<div style={{position:"absolute",top:"100%",left:0,right:0,background:"var(--bg2)",border:"1px solid var(--bd)",borderRadius:12,boxShadow:"0 8px 24px rgba(0,0,0,.3)",zIndex:100,maxHeight:260,overflowY:"auto",marginTop:4}}>{searchRes.map(c=><div key={c.id} onClick={()=>{openCh(c);setSearch("");}} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",cursor:"pointer",borderBottom:"1px solid var(--bd)",transition:"background .15s"}}><span style={{width:26,height:26,borderRadius:7,background:c.color+"15",color:c.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800}}>{c.icon}</span><span style={{fontWeight:600,fontSize:13}}>{c.title}</span></div>)}</div>:null}
  </div>
  {!isProf?<Sec style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
    <div><div style={{fontWeight:700,fontSize:14}}>Test de positionnement</div><div style={{fontSize:12,color:"var(--tx3)"}}>100 questions pour identifier tes points forts et faibles</div></div>
    <button onClick={()=>{setPage("diagnostic");setDiagIdx(0);setDiagDone(false);setDiagResult(null);setDiagBloc(null);}} style={{...btn,background:"var(--ac)",border:"none",color:"#fff",fontSize:12}}>{Object.keys(diagAns).length>0?"Reprendre":"Commencer"}</button>
  </Sec>:null}
  <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:14}}>
    <Sec style={{flex:1,minWidth:180,textAlign:"center",marginBottom:0}}><div style={{display:"flex",gap:14,justifyContent:"center",alignItems:"center"}}>{[{v:stats.a+"/"+CHAPTERS.length,l:"Tentés"},{v:String(stats.m),l:"≥80%"}].map((s,i)=><div key={i}><div style={{fontSize:20,fontWeight:800,color:"var(--ac)",...mono}}>{s.v}</div><div style={{fontSize:10,color:"var(--tx3)"}}>{s.l}</div></div>)}<Ring p={stats.avg} sz={44} sw={4}/></div></Sec>
    <Sec style={{flex:"0 0 auto",minWidth:90,textAlign:"center",marginBottom:0}}><div style={{fontSize:26,fontWeight:800,color:"var(--gn)",...mono}}>{streak}</div><div style={{fontSize:10,color:"var(--tx3)"}}>streak</div></Sec>
  </div>
  {!isProf&&nextStep?<Sec style={{background:"rgba(124,92,252,.06)",border:"1px solid rgba(124,92,252,.15)"}}><h3 style={{margin:"0 0 6px",fontSize:14,fontWeight:700,color:"var(--ac)"}}>Suggestion — #{nextStep.step}</h3>{(()=>{const c=CHAPTERS.find(x=>x.id===nextStep.id);return c?<div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:36,height:36,borderRadius:10,background:c.color+"15",color:c.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800}}>{c.icon}</div><div style={{flex:1}}><div style={{fontWeight:700,fontSize:14}}>{c.title}</div><div style={{fontSize:11,color:"var(--tx3)",...mono}}>{prog[c.id]?.best||0}%</div></div><button onClick={()=>openCh(c)} style={{...btn,background:c.color,border:"none",color:"#fff",fontSize:12}}>Commencer</button></div>:null;})()}{nextStep.prerequis1ere?<div style={{marginTop:8,padding:"8px 12px",borderRadius:8,background:"rgba(251,191,36,.06)",border:"1px solid rgba(251,191,36,.15)",fontSize:11,color:"var(--or)"}}>⚠️ Prérequis 1ère : {nextStep.prerequis1ere}{nextStep.prerequisLink?<span> — <a href={nextStep.prerequisLink} target="_blank" rel="noopener noreferrer" style={{color:"var(--or)",fontWeight:600}}>Revoir ↗</a></span>:null}</div>:null}</Sec>:null}
  {weekGoals.length>0||isProf?<Sec><h3 style={{margin:"0 0 8px",fontSize:14,fontWeight:700}}>Objectifs{!isProf&&weekGoals.length>0?" ("+weekGoals.filter(g=>g.done).length+"/"+weekGoals.length+")":""}</h3>{weekGoals.map((g,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",marginBottom:3,borderRadius:8,background:g.done?"rgba(52,211,153,.06)":"var(--bg3)",border:"1px solid "+(g.done?"rgba(52,211,153,.15)":"var(--bd)")}}><button onClick={()=>toggleGoal(i)} style={{width:20,height:20,borderRadius:5,border:"2px solid "+(g.done?"var(--gn)":"var(--tx3)"),background:g.done?"var(--gn)":"transparent",cursor:"pointer",color:"#fff",fontSize:10,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{g.done?"✓":""}</button><span style={{flex:1,fontSize:13,color:g.done?"var(--gn)":"var(--tx)",textDecoration:g.done?"line-through":"none"}}>{g.text}</span>{isProf?<button onClick={()=>delGoal(i)} style={{background:"none",border:"none",cursor:"pointer",color:"var(--rd)",fontSize:12}}>✕</button>:null}</div>)}{isProf?<div style={{display:"flex",gap:6,marginTop:8}}><input value={goalDraft} onChange={e=>setGoalDraft(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")addGoal();}} placeholder="Objectif..." style={{...inp,flex:1,fontSize:12}}/><button onClick={addGoal} style={{...btn,background:"var(--ac)",border:"none",color:"#fff",fontSize:12}}>+</button></div>:null}</Sec>:null}
  <div style={{display:"flex",gap:6,justifyContent:"center",flexWrap:"wrap",marginBottom:16}}>
    {["all",...THEMES].map(t=>{const c=t==="all"?"var(--ac)":TC[t];return<button key={t} onClick={()=>setFilt(t)} style={{padding:"6px 14px",border:"1px solid "+(filt===t?c:"var(--bd)"),borderRadius:8,cursor:"pointer",fontSize:11,fontWeight:600,background:filt===t?c+"18":"var(--bg3)",color:filt===t?c:"var(--tx2)"}}>{t==="all"?"Tous":t}</button>;})}
  </div>
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12}}>
    {list.map(c=>{const p=prog[c.id]||{best:0,n:0},tv=(c.methodVideos?.length||0)+(c.exerciseVideos?.length||0)+(c.demoVideos?.length||0),ce=customExos[c.id]?.length||0,t=timeSpent[c.id]||0,pi=PATH_MAP[c.id];return(
      <div key={c.id} className="c" style={{padding:18,cursor:"pointer",position:"relative",overflow:"hidden"}} onClick={()=>openCh(c)}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${c.color},transparent)`}}/>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
          <div style={{width:42,height:42,borderRadius:11,background:c.color+"15",color:c.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800,border:"1px solid "+c.color+"22"}}>{c.icon}</div>
          <Ring p={p.best} sz={32} sw={3} c={c.color}/>
        </div>
        <h3 style={{margin:"0 0 5px",fontSize:15,fontWeight:700,letterSpacing:"-.01em"}}>{c.title}</h3>
        <div style={{display:"flex",gap:5,alignItems:"center",marginBottom:6}}><Tag color={TC[c.theme]}>{c.theme}</Tag>{pi?<span style={{fontSize:10,color:"var(--tx3)",...mono}}>#{pi.step}</span>:null}</div>
        <div style={{fontSize:11,color:"var(--tx3)",...mono}}>{c.quiz.length}q · {c.exercises.length+ce}ex · {tv}v{t>0?" · "+fmtTime(t):""}</div>
        {p.n>0?<div style={{marginTop:4,fontSize:11}}><span style={{color:p.best>=80?"var(--gn)":p.best>=50?"var(--or)":"var(--rd)",fontWeight:700,...mono}}>{p.best}%</span></div>:null}
      </div>);})}
  </div>
</div></div>);

// ═══ CHAPTER ════════════════════════════════════════════════
if(!ch)return null;
const qs=qDone?ch.quiz.reduce((s,q,i)=>s+(qa[i]===q.answer?1:0),0):null;
const cats=[...new Set(ch.methodVideos.map(v=>v.cat))];
const allExos=[...ch.exercises,...(customExos[ch.id]||[])];

return(<div style={A}><style>{CSS}</style><div style={C}>{N}
  <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
    <button onClick={goHome} style={btn}>←</button>
    <div style={{flex:1}}/>
    <Tag color={TC[ch.theme]}>{ch.theme}</Tag>
  </div>
  <div style={{position:"relative",padding:"20px 22px",borderRadius:16,background:"var(--bg2)",border:"1px solid var(--bd)",marginBottom:16,overflow:"hidden"}}>
    <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${ch.color},${ch.color}66,transparent)`}}/>
    <div style={{display:"flex",alignItems:"center",gap:14}}>
      <div style={{width:52,height:52,borderRadius:14,background:`linear-gradient(135deg,${ch.color}20,${ch.color}35)`,color:ch.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:800,border:"1px solid "+ch.color+"25",boxShadow:`0 4px 16px ${ch.color}15`}}>{ch.icon}</div>
      <div style={{flex:1}}>
        <h2 style={{margin:0,fontSize:22,fontWeight:800,letterSpacing:"-.02em"}}>{ch.title}</h2>
        <div style={{display:"flex",gap:8,alignItems:"center",marginTop:4}}>
          <span style={{fontSize:12,color:"var(--tx3)",...mono}}>{ch.methodVideos.length+(ch.exerciseVideos?.length||0)+(ch.demoVideos?.length||0)} vidéos</span>
          <span style={{color:"var(--tx3)"}}>·</span>
          <span style={{fontSize:12,color:"var(--tx3)",...mono}}>{ch.quiz.length} quiz</span>
          <span style={{color:"var(--tx3)"}}>·</span>
          <span style={{fontSize:12,color:"var(--tx3)",...mono}}>{allExos.length} exos</span>
        </div>
      </div>
      <Ring p={prog[ch.id]?.best||0} sz={44} sw={4} c={ch.color}/>
    </div>
  </div>
  <div style={{display:"flex",gap:3,marginBottom:16,borderBottom:"1px solid var(--bd)",overflowX:"auto"}}>
    {[["cours","Cours"],["formules","Formules"],["quiz","Quiz"],["exercices","Exos ("+allExos.length+")"],["examen","Examen"],["copie","Ma copie"]].map(([k,lb])=><button key={k} onClick={()=>{setTab(k);if(k==="quiz"&&!qDone&&Object.keys(qa).length===0){setQIdx(0);}}} style={{padding:"9px 16px",border:"none",borderRadius:"10px 10px 0 0",cursor:"pointer",background:tab===k?"var(--bg3)":"transparent",color:tab===k?"var(--tx)":"var(--tx3)",fontWeight:tab===k?700:500,fontSize:13,display:"flex",alignItems:"center",gap:5,whiteSpace:"nowrap",fontFamily:"inherit",borderBottom:tab===k?"2px solid var(--ac)":"2px solid transparent"}}>{lb}</button>)}
  </div>

  {tab==="cours"&&<div>
    <Sec><h3 style={{marginBottom:12,fontSize:16,fontWeight:700,color:"var(--ac)"}}>Notions clés</h3>{ch.sections.map((s,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",marginBottom:3,borderRadius:8,background:"var(--bg3)",border:"1px solid var(--bd)"}}><span style={{width:24,height:24,borderRadius:6,background:ch.color+"15",color:ch.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0,...mono}}>{i+1}</span><span style={{fontSize:13}}>{s}</span></div>)}</Sec>
    <Sec><h3 style={{marginBottom:8,fontSize:16,fontWeight:700,color:"var(--ac)"}}>Cours</h3><div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}><a href={ch.metLink} target="_blank" rel="noopener noreferrer" style={{...btn,background:ch.color+"18",color:ch.color,borderColor:ch.color+"30",textDecoration:"none"}}>Site</a><a href={ch.courseVideo} target="_blank" rel="noopener noreferrer" style={{...btn,background:"rgba(248,113,113,.08)",color:"var(--rd)",borderColor:"rgba(248,113,113,.2)",textDecoration:"none"}}>Vidéo du cours</a></div>{ch.coursePdf?.length>0?<div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{ch.coursePdf.map((pdf,i)=><a key={i} href={pdf} target="_blank" rel="noopener noreferrer" style={{padding:"6px 10px",borderRadius:8,textDecoration:"none",background:"var(--bg3)",color:"var(--tx2)",border:"1px solid var(--bd)",fontSize:12,fontWeight:600}}>PDF{ch.coursePdf.length>1?" ("+(i+1)+")":""}</a>)}</div>:null}{ch.extraCourseLinks?.length>0?<div style={{marginTop:10}}>{ch.extraCourseLinks.map((l,i)=><a key={i} href={l.url} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",marginBottom:4,borderRadius:8,background:"var(--bg3)",border:"1px solid var(--bd)",textDecoration:"none",color:"var(--tx)",fontSize:12}}><span>{l.icon}</span><span style={{fontWeight:600,flex:1}}>{l.name}</span><span style={{color:"var(--ac)",fontSize:12}}>PDF →</span></a>)}</div>:null}</Sec>
    <Sec><h3 style={{marginBottom:10,fontSize:16,fontWeight:700,color:"var(--ac)"}}>Méthodes ({ch.methodVideos.length})</h3>{cats.map(cat=><div key={cat} style={{marginBottom:10}}><div style={{fontSize:11,fontWeight:700,color:ch.color,marginBottom:4,textTransform:"uppercase",letterSpacing:.5,...mono}}>{cat}</div>{ch.methodVideos.filter(v=>v.cat===cat).map((v,i)=><VL key={i} v={v}/>)}</div>)}</Sec>
    {ch.demoVideos?.length>0?<Sec><h3 style={{marginBottom:8,fontSize:16,fontWeight:700,color:"var(--or)"}}>Démonstrations</h3>{ch.demoVideos.map((v,i)=><VL key={i} v={v} bg="rgba(251,191,36,.06)"/>)}</Sec>:null}
    {ch.exerciseVideos?.length>0?<Sec><h3 style={{marginBottom:8,fontSize:16,fontWeight:700,color:"var(--gn)"}}>Exercices vidéo</h3>{ch.exerciseVideos.map((v,i)=><VL key={i} v={v} bg="rgba(52,211,153,.06)"/>)}</Sec>:null}
  </div>}

  {tab==="formules"&&<Sec><h3 style={{marginBottom:12,fontSize:16,fontWeight:700,color:"var(--ac)"}}>Formules</h3>{ch.keyFormulas.map((f,i)=><div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",marginBottom:5,borderRadius:8,background:"var(--bg3)",border:"1px solid var(--bd)"}}><span style={{fontSize:12,fontWeight:600,color:"var(--tx2)"}}>{f.name}</span><span style={{fontSize:14,fontWeight:700,color:ch.color,...mono}}><MathText text={f.formula}/></span></div>)}{ch.formulaLinks?.length>0?<div style={{marginTop:14}}><h4 style={{fontSize:13,fontWeight:700,color:"var(--or)",marginBottom:8}}>Documents de référence</h4>{ch.formulaLinks.map((l,i)=><a key={i} href={l.url} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",marginBottom:5,borderRadius:8,background:"rgba(251,191,36,.06)",border:"1px solid rgba(251,191,36,.12)",textDecoration:"none",color:"var(--tx)",fontSize:13}}><span style={{fontSize:14}}>📋</span><span style={{fontWeight:600,flex:1}}>{l.name}</span><span style={{color:"var(--or)",fontSize:12}}>PDF →</span></a>)}</div>:null}{ch.traps?.length>0?<div style={{marginTop:18}}><h4 style={{fontSize:14,fontWeight:700,color:"var(--rd)",marginBottom:10}}>⚠ Pièges classiques à éviter</h4>{ch.traps.map((t,i)=><div key={i} style={{marginBottom:8,borderRadius:10,overflow:"hidden",border:"1px solid rgba(248,113,113,.15)"}}><div style={{padding:"10px 14px",background:"rgba(248,113,113,.06)",display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:12,fontWeight:700,color:"var(--rd)"}}>✗</span><span style={{fontSize:13,fontWeight:700,color:"var(--tx)"}}>{t.mistake}</span></div><div style={{padding:"10px 14px",fontSize:12,lineHeight:1.7}}><div style={{display:"flex",gap:8,marginBottom:4}}><span style={{color:"var(--rd)",fontWeight:700,flexShrink:0,...mono}}>✗</span><span style={{color:"var(--tx3)",textDecoration:"line-through"}}><MathText text={t.wrong}/></span></div><div style={{display:"flex",gap:8,marginBottom:6}}><span style={{color:"var(--gn)",fontWeight:700,flexShrink:0,...mono}}>✓</span><span style={{color:"var(--gn)",fontWeight:600}}><MathText text={t.correct}/></span></div><div style={{fontSize:11,color:"var(--or)",background:"rgba(251,191,36,.06)",padding:"6px 10px",borderRadius:6,lineHeight:1.6}}><MathText text={t.tip}/></div></div></div>)}</div>:null}</Sec>}

  {tab==="quiz"&&<div>{!qDone?<>
    <div style={{display:"flex",gap:3,marginBottom:14}}>{ch.quiz.map((_,i)=><div key={i} onClick={()=>setQIdx(i)} style={{flex:1,height:3,borderRadius:2,cursor:"pointer",background:qa[i]!==undefined?ch.color:i===qIdx?ch.color+"66":"var(--bg4)"}}/>)}</div>
    <div style={{fontSize:11,color:"var(--tx3)",marginBottom:5,...mono}}>Q{qIdx+1}/{ch.quiz.length}</div>
    <Sec><p style={{fontSize:14,fontWeight:600,marginBottom:14,lineHeight:1.6}}><MathText text={ch.quiz[qIdx].q}/></p>{ch.quiz[qIdx].choices.map((c,ci)=><button key={ci} style={qo(qa[qIdx]===ci,false,false,false)} onClick={()=>{const na={...qa,[qIdx]:ci};setQa(na);sv("mt-quiz-qa-"+ch.id,na);}}><span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:20,height:20,borderRadius:6,marginRight:8,background:qa[qIdx]===ci?"rgba(124,92,252,.15)":"var(--bg4)",color:qa[qIdx]===ci?"var(--ac)":"var(--tx3)",fontSize:11,fontWeight:700,...mono}}>{String.fromCharCode(65+ci)}</span><MathText text={c}/></button>)}</Sec>
    <div style={{display:"flex",justifyContent:"space-between",marginTop:10}}>
      <button onClick={()=>setQIdx(Math.max(0,qIdx-1))} disabled={qIdx===0} style={{...btn,opacity:qIdx===0?.3:1}}>←</button>
      {qIdx<ch.quiz.length-1?<button onClick={()=>setQIdx(qIdx+1)} style={{...btn,background:ch.color,border:"none",color:"#fff"}}>→</button>:<button onClick={submitQ} disabled={Object.keys(qa).length<ch.quiz.length} style={{...btn,background:Object.keys(qa).length<ch.quiz.length?"var(--bg4)":"var(--gn)",border:"none",color:Object.keys(qa).length<ch.quiz.length?"var(--tx3)":"#fff"}}>Valider ✓</button>}
    </div>
  </>:<>
    <Sec style={{textAlign:"center",padding:24}}>
      <Ring p={Math.round(qs/ch.quiz.length*100)} sz={66} sw={6} c={qs/ch.quiz.length>=.8?"var(--gn)":qs/ch.quiz.length>=.5?"var(--or)":"var(--rd)"}/>
      <h3 style={{margin:"12px 0 3px",fontSize:20,fontWeight:800,...mono}}>{qs}/{ch.quiz.length}</h3>
      <p style={{color:"var(--tx2)",fontSize:13}}>{qs===ch.quiz.length?"Parfait !":qs/ch.quiz.length>=.8?"Très bien !":qs/ch.quiz.length>=.5?"Continue":"À revoir"}</p>
      <button onClick={()=>{setQa({});setQDone(false);setQIdx(0);sv("mt-quiz-qa-"+ch.id,{});}} style={{...btn,marginTop:12,background:ch.color,border:"none",color:"#fff"}}>Recommencer</button>
    </Sec>
    {ch.quiz.map((q,i)=>{const ok=qa[i]===q.answer;return<Sec key={i} style={{borderColor:ok?"rgba(52,211,153,.3)":"rgba(248,113,113,.3)"}}><div style={{display:"flex",gap:6,marginBottom:6}}><span>{ok?"✓":"✗"}</span><span style={{fontWeight:600,fontSize:12,...mono}}>Q{i+1}</span></div><p style={{fontSize:13,marginBottom:6}}><MathText text={q.q}/></p>{q.choices.map((c,ci)=><div key={ci} style={{...qo(qa[i]===ci,ci===q.answer,qa[i]===ci&&ci!==q.answer,true),cursor:"default"}}><span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:20,height:20,borderRadius:6,marginRight:8,background:ci===q.answer?"rgba(52,211,153,.15)":qa[i]===ci?"rgba(248,113,113,.15)":"var(--bg4)",color:ci===q.answer?"var(--gn)":qa[i]===ci?"var(--rd)":"var(--tx3)",fontSize:11,fontWeight:700,...mono}}>{ci===q.answer?"✓":qa[i]===ci?"✗":String.fromCharCode(65+ci)}</span><MathText text={c}/></div>)}<div style={{marginTop:8,padding:"10px 14px",borderRadius:8,background:"rgba(124,92,252,.06)",border:"1px solid rgba(124,92,252,.12)",fontSize:13,color:"var(--ac2)",lineHeight:1.7,whiteSpace:"pre-wrap"}}><strong>Explication :</strong> <MathText text={q.explanation}/></div></Sec>;})}
  </>}</div>}

  {tab==="exercices"&&<div>
    {allExos.map((ex,i)=><Sec key={i}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><span style={{width:28,height:28,borderRadius:8,background:ch.color+"15",color:ch.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,...mono}}>{i+1}</span><h4 style={{margin:0,fontSize:14,fontWeight:700,flex:1}}>{ex.title}</h4>{ex.byProf?<Tag color="var(--ac)">Prof</Tag>:null}</div>
      <div style={{padding:"12px 14px",borderRadius:10,background:"var(--bg3)",border:"1px solid var(--bd)",fontSize:14,lineHeight:1.7,marginBottom:8,whiteSpace:"pre-wrap"}}><MathText text={ex.statement}/></div>
      {ex.file&&ex.fileType?.startsWith("image/")?<img src={ex.file} alt="" style={{maxWidth:"100%",borderRadius:10,border:"1px solid var(--bd)",marginBottom:8}}/>:null}
      {ex.file&&ex.fileType==="application/pdf"?<div style={{marginBottom:8}}><a href={ex.file} download={ex.fileName} style={{...btn,background:"rgba(124,92,252,.08)",color:"var(--ac)",borderColor:"rgba(124,92,252,.15)",fontSize:12,textDecoration:"none"}}>{ex.fileName||"PDF"}</a></div>:null}
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {ex.hint?<button onClick={()=>setHints(p=>({...p,[i]:!p[i]}))} style={{...btn,fontSize:12,background:hints[i]?"rgba(251,191,36,.08)":"var(--bg3)",borderColor:hints[i]?"rgba(251,191,36,.2)":"var(--bd)",color:hints[i]?"var(--or)":"var(--tx2)"}}>{hints[i]?"":""} Indice</button>:null}
        {ex.solution?<button onClick={()=>setSols(p=>({...p,[i]:!p[i]}))} style={{...btn,fontSize:12,background:sols[i]?"rgba(52,211,153,.08)":"var(--bg3)",borderColor:sols[i]?"rgba(52,211,153,.2)":"var(--bd)",color:sols[i]?"var(--gn)":"var(--tx2)"}}>{sols[i]?"":""} Solution</button>:null}
        {isProf&&ex.byProf?<button onClick={()=>delExo(ch.id,i-ch.exercises.length)} style={{...btn,fontSize:12,background:"rgba(248,113,113,.08)",borderColor:"rgba(248,113,113,.2)",color:"var(--rd)"}}>×</button>:null}
      </div>
      {hints[i]&&ex.hint?<div style={{marginTop:8,padding:"14px 16px",borderRadius:10,background:"rgba(251,191,36,.06)",border:"1px solid rgba(251,191,36,.12)",fontSize:14,color:"var(--or)",lineHeight:1.8,whiteSpace:"pre-wrap"}}><strong>Indice :</strong> <MathText text={ex.hint}/></div>:null}
      {sols[i]&&ex.solution?<div style={{marginTop:8,padding:"14px 16px",borderRadius:10,background:"rgba(52,211,153,.06)",border:"1px solid rgba(52,211,153,.12)",fontSize:14,color:"var(--gn)",lineHeight:1.8,whiteSpace:"pre-wrap"}}><strong>Solution :</strong>{"\n\n"}<MathText text={ex.solution}/></div>:null}
    </Sec>)}
    {ch.exerciseVideos?.length>0?<Sec><h3 style={{marginBottom:8,fontSize:16,fontWeight:700,color:"var(--gn)"}}>Exercices vidéo</h3>{ch.exerciseVideos.map((v,i)=><VL key={i} v={v} bg="rgba(52,211,153,.06)"/>)}</Sec>:null}
    {ch.extraLinks?.length>0?<Sec><h3 style={{marginBottom:8,fontSize:16,fontWeight:700,color:"var(--ac)"}}>Exercices BAC</h3>{ch.extraLinks.map((l,i)=><a key={i} href={l.url} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",marginBottom:4,borderRadius:8,background:"var(--bg3)",border:"1px solid var(--bd)",textDecoration:"none",color:"var(--tx)",fontSize:12}}><span>{l.icon}</span><span style={{fontWeight:600,flex:1}}>{l.name}</span><span style={{color:"var(--ac)"}}>→</span></a>)}</Sec>:null}
    {BAC_TYPES[ch.id]?.length>0?<Sec style={{background:"rgba(124,92,252,.04)",border:"1px solid rgba(124,92,252,.12)"}}>
      <h3 style={{marginBottom:4,fontSize:16,fontWeight:700,color:"var(--ac)"}}>Exercices types BAC avec corrigés</h3>
      <p style={{fontSize:11,color:"var(--tx3)",marginBottom:10}}>Les exercices qui tombent chaque année au BAC sur cette notion, avec corrections détaillées par des profs.</p>
      {BAC_TYPES[ch.id].map((l,i)=><a key={i} href={l.url} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",marginBottom:6,borderRadius:10,background:"var(--bg3)",border:"1px solid var(--bd)",textDecoration:"none",color:"var(--tx)",transition:"all .2s"}}>
        <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13}}>{l.name}</div><div style={{fontSize:11,color:"var(--tx3)",marginTop:2}}>{l.desc}</div></div>
        <span style={{color:"var(--ac)",fontSize:13}}>→</span>
      </a>)}
    </Sec>:null}
  </div>}

  {tab==="examen"&&<div>
    <Sec style={{background:"rgba(124,92,252,.06)",border:"1px solid rgba(124,92,252,.15)"}}>
      <h3 style={{margin:"0 0 6px",fontSize:16,fontWeight:700,color:"var(--ac)"}}>Examen — {ch.title}</h3>
      <p style={{fontSize:12,color:"var(--tx2)",marginBottom:14}}>Contrôles et sujets type BAC avec corrigés de professeurs. Fais l'examen d'abord SANS regarder la correction, puis compare.</p>
      {(EXAMS[ch.id]||[]).length===0?<p style={{color:"var(--tx3)",fontSize:13,textAlign:"center",padding:16}}>Pas encore d'examen pour ce chapitre.</p>:null}
      {(EXAMS[ch.id]||[]).map((ex,i)=>(
        <a key={i} href={ex.url} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",marginBottom:6,borderRadius:10,background:ex.corr?"rgba(52,211,153,.06)":"var(--bg3)",border:"1px solid "+(ex.corr?"rgba(52,211,153,.15)":"var(--bd)"),textDecoration:"none",color:"var(--tx)",fontSize:13,transition:"all .2s"}}>
          <span style={{width:32,height:32,borderRadius:8,background:ex.corr?"rgba(52,211,153,.12)":"rgba(124,92,252,.12)",color:ex.corr?"var(--gn)":"var(--ac)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{ex.corr?"✓":""}</span>
          <span style={{flex:1,fontWeight:600}}>{ex.name}</span>
          <span style={{color:ex.corr?"var(--gn)":"var(--ac)",fontSize:12}}>PDF →</span>
        </a>
      ))}
    </Sec>
    <Sec>
      <h3 style={{margin:"0 0 8px",fontSize:14,fontWeight:700,color:"var(--or)"}}>Méthode pour l'examen</h3>
      <div style={{fontSize:13,color:"var(--tx2)",lineHeight:1.7}}>
        1. Télécharge le sujet () et imprime-le<br/>
        2. Fais-le en conditions réelles : pas de cours, chrono 1h<br/>
        3. Rédige proprement comme au BAC<br/>
        4. Compare avec la correction () point par point<br/>
        5. Note ce que tu as raté et revois la notion
      </div>
    </Sec>
  </div>}

  {tab==="copie"&&<div>
    <Sec style={{background:"rgba(124,92,252,.06)",border:"1px solid rgba(124,92,252,.15)"}}>
      <h3 style={{margin:"0 0 6px",fontSize:16,fontWeight:700,color:"var(--ac)"}}>Correction IA — {ch.title}</h3>
      <p style={{fontSize:12,color:"var(--tx2)",marginBottom:14}}>Envoie l'énoncé puis ta copie. L'IA compare les deux et corrige en détail avec note, erreurs et conseils.</p>

      <div style={{display:"flex",gap:10,marginBottom:10}}>
        <div style={{flex:1}} onDrop={mkDrop(setCopyEnonce)} onDragOver={dragOver}>
          <div style={{fontSize:12,fontWeight:700,color:"var(--or)",marginBottom:6}}>① Énoncé (glisser ou cliquer)</div>
          <input id="enonce-input" type="file" accept="image/*,.pdf" onChange={(e)=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=(ev)=>{setCopyEnonce({data:ev.target.result,name:f.name,type:f.type});};r.readAsDataURL(f);}} style={{display:"none"}}/>
          <button onClick={()=>document.getElementById("enonce-input")?.click()} style={{...btn,width:"100%",justifyContent:"center",fontSize:12,background:copyEnonce?"rgba(52,211,153,.1)":"var(--bg3)",color:copyEnonce?"var(--gn)":"var(--tx2)",borderColor:copyEnonce?"rgba(52,211,153,.2)":"var(--bd)"}}>{copyEnonce?" "+copyEnonce.name:"Choisir l'énoncé"}</button>
        </div>
        <div style={{flex:1}} onDrop={mkDrop(setCopyWork)} onDragOver={dragOver}>
          <div style={{fontSize:12,fontWeight:700,color:"var(--ac)",marginBottom:6}}>② Ta copie (glisser ou cliquer)</div>
          <input id="copie-input" type="file" accept="image/*" onChange={(e)=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=(ev)=>{setCopyWork({data:ev.target.result,name:f.name});};r.readAsDataURL(f);}} style={{display:"none"}}/>
          <button onClick={()=>document.getElementById("copie-input")?.click()} style={{...btn,width:"100%",justifyContent:"center",fontSize:12,background:copyWork?"rgba(52,211,153,.1)":"var(--bg3)",color:copyWork?"var(--gn)":"var(--tx2)",borderColor:copyWork?"rgba(52,211,153,.2)":"var(--bd)"}}>{copyWork?" "+copyWork.name:"Choisir ta copie"}</button>
        </div>
      </div>

      {(copyEnonce||copyWork)?<div style={{display:"flex",gap:10,marginBottom:10}}>
        {copyEnonce?.type?.startsWith("image/")?<img src={copyEnonce.data} alt="Énoncé" style={{flex:1,maxHeight:140,objectFit:"contain",borderRadius:8,border:"1px solid var(--bd)"}}/>:copyEnonce?<div style={{flex:1,padding:12,borderRadius:8,background:"var(--bg3)",border:"1px solid var(--bd)",fontSize:12,color:"var(--or)",textAlign:"center"}}>{copyEnonce.name} (PDF)</div>:null}
        {copyWork?<img src={copyWork.data} alt="Copie" style={{flex:1,maxHeight:140,objectFit:"contain",borderRadius:8,border:"1px solid var(--bd)"}}/>:null}
      </div>:null}

      <button onClick={async()=>{if(!copyWork||copyCorrLoading)return;setCopyCorrLoading(true);try{const imgs=[{type:"text",text:`Corrige le travail de Sami sur "${ch.title}".

IMAGE 1 = énoncé, IMAGE 2 = copie de Sami.

RÉDIGE COMME UN CORRIGÉ OFFICIEL DU BAC :

Pour CHAQUE question (1.a, 1.b, 2.a, etc.) :
- Numérote clairement (1.a., 1.b., 2.a., etc.)
- Écris la correction COMPLÈTE, étape par étape
- CHAQUE ligne de calcul sur une NOUVELLE ligne
- Relie les étapes par ⟺ (équivalence) ou ⟹ (implication)
- Commence par "La fonction f est...", "Soit...", "On a..."
- Justifie CHAQUE étape : "car...", "d'après le théorème...", "or..."
- Termine par "Donc..." ou "Conclusion :"

FRACTIONS — OBLIGATOIRE :
- TOUJOURS écrire [[numérateur|dénominateur]]
- Exemples : [[5|(x+1)²]], [[6(x+1)−5|x+1]], [[−x²+5x+1|x+1]], [[5+√29|2]]
- JAMAIS utiliser /
- JAMAIS utiliser de LaTeX ($, \\frac, etc.)

CALCULS :
- f'(x) = −(−[[5|(x+1)²]]) = [[5|(x+1)²]] > 0
- Discriminant : Δ = b² − 4ac = 29 > 0
- x₁ = [[−5−√29|−2]] = [[5+√29|2]] > 0
- √(x+1), x², eˣ, uₙ, uₙ₊₁

STYLE — comme un vrai corrigé :
f(x) = x ⟺ 6 − [[5|x+1]] = x
  ⟺ [[6(x+1)−5|x+1]] = x
  ⟺ [[6x+1|x+1]] − x = 0
  ⟺ [[6x+1−x(x+1)|x+1]] = 0
  ⟺ [[−x²+5x+1|x+1]] = 0

À la fin : NOTE sur 20, barème par question, bilan (points forts, erreurs, conseils).`}];if(copyEnonce?.type?.startsWith("image/"))imgs.push({type:"image_url",image_url:{url:copyEnonce.data}});imgs.push({type:"image_url",image_url:{url:copyWork.data}});const resp=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:[{role:"system",content:`Tu es correcteur de maths Terminale Spé. Rédige comme un corrigé officiel du BAC. Chaque étape détaillée, théorèmes cités, phrases complètes avec "Soit...", "On a...", "Or...", "Donc...". Utilise ⟺ et ⟹ entre les étapes. Fractions TOUJOURS en [[a|b]]. JAMAIS de LaTeX. JAMAIS de $. Racines : √(). Puissances : x², xⁿ. Indices : uₙ.`},{role:"user",content:imgs}]})});const d=await resp.json();const reply=cleanLatex(d.choices?.[0]?.message?.content)||"Erreur.";const cid=ch.id;const entry={enonce:copyEnonce?.data||null,work:copyWork.data,enonceNm:copyEnonce?.name||"",workNm:copyWork.name,ts:new Date().toISOString(),correction:reply};const nc={...chCopies,[cid]:[...(chCopies[cid]||[]),entry]};setChCopies(nc);sv("mt-copies",nc);setCopyEnonce(null);setCopyWork(null);}catch{alert("Erreur");}setCopyCorrLoading(false);}} disabled={!copyWork||copyCorrLoading} style={{...btn,background:(!copyWork||copyCorrLoading)?"var(--bg4)":"var(--ac)",border:"none",color:(!copyWork||copyCorrLoading)?"var(--tx3)":"#fff",width:"100%",justifyContent:"center",padding:14,fontSize:14}}>{copyCorrLoading?"Correction en cours...":"Lancer la correction"}</button>
    </Sec>

    {(chCopies[ch.id]||[]).length===0?<Sec><p style={{textAlign:"center",color:"var(--tx3)",padding:16}}>Aucune correction. Dépose ton énoncé + ta copie !</p></Sec>:null}

    {(chCopies[ch.id]||[]).slice().reverse().map((copy,i)=><Sec key={i}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <strong style={{fontSize:13,color:"var(--ac)"}}>{copy.workNm||copy.name||"Copie"}</strong>
        <span style={{fontSize:10,color:"var(--tx3)",...mono}}>{new Date(copy.ts).toLocaleString("fr")}</span>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        {copy.enonce?<div style={{flex:1}}><div style={{fontSize:10,color:"var(--or)",fontWeight:600,marginBottom:3}}>Énoncé</div><img src={copy.enonce} alt="" style={{maxWidth:"100%",maxHeight:180,borderRadius:8,border:"1px solid var(--bd)"}}/></div>:null}
        <div style={{flex:1}}><div style={{fontSize:10,color:"var(--ac)",fontWeight:600,marginBottom:3}}>Ta copie</div><img src={copy.work||copy.data} alt="" style={{maxWidth:"100%",maxHeight:180,borderRadius:8,border:"1px solid var(--bd)"}}/></div>
      </div>
      {copy.correction?<div style={{padding:"16px 18px",borderRadius:12,background:"rgba(124,92,252,.06)",border:"1px solid rgba(124,92,252,.15)",fontSize:13,color:"var(--tx)",lineHeight:1.8,whiteSpace:"pre-wrap"}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}><strong style={{color:"var(--ac)",fontSize:15}}>Correction automatique</strong></div>
        <MathText text={copy.correction}/>
      </div>:copy.loading?<div style={{padding:"14px 16px",borderRadius:10,background:"rgba(124,92,252,.06)",border:"1px solid rgba(124,92,252,.15)",fontSize:13,color:"var(--ac)",textAlign:"center"}}>Correction en cours...</div>:null}
    </Sec>)}
  </div>}
</div></div>);
}
