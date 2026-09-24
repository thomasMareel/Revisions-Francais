export const meta = {
  name: 'revisions-francais-propositions',
  description: 'Idéation multi-angles + critique des propositions de révision, et échantillons vérifiés (français-philo PT*)',
  phases: [
    { title: 'Idéation', detail: '5 angles indépendants' },
    { title: 'Synthèse', detail: 'catalogue PROPOSITIONS.md' },
    { title: 'Critique', detail: '3 critiques adversariales' },
    { title: 'Révision', detail: 'PROPOSITIONS.md final + FEUILLE_DE_ROUTE.md' },
    { title: 'Échantillons', detail: 'rédaction de 6 prototypes' },
    { title: 'Vérification', detail: 'contrôle factuel + pédagogique' },
    { title: 'Correction', detail: 'application des corrections' },
  ],
}

const REPO = '/home/user/Revisions-Francais'
const SCRATCH = '/tmp/claude-0/-home-user-Revisions-Francais/eb699ce7-3ac5-56b4-9e44-32b3bda4aa90/scratchpad'

const CONTEXTE = `
CONTEXTE (à lire attentivement)
- Utilisateur : étudiant en 2e année de CPGE, filière PT* (PT étoile), année 2026-2027 ; concours au printemps 2027, principalement la Banque PT. Date du jour : 24/09/2026.
- Il veut organiser ses révisions de français-philosophie et générer un maximum de documents qui l'aident à assimiler simplement et efficacement les points de l'année. Il veut que le travail soit organisé et laisse un maximum de traces.
- Référence unique sur le programme et l'épreuve : ${REPO}/00_pilotage/PROGRAMME.md (LIS-LE EN PREMIER). Résumé : deux thèmes au programme du concours 2027 : (1) « Expériences de la nature » (Canguilhem, La Connaissance de la vie [intro, I Méthode, III ch. 2-5] ; Verne, Vingt mille lieues sous les mers ; Haushofer, Le Mur invisible), déjà étudié en PTSI l'an dernier ; (2) « Les arcanes de la création » (Platon, Ion + République X 595a-608b ; Zola, L'Œuvre ; Woolf, Un lieu à soi trad. Darrieussecq), nouveau. Épreuve Banque PT Français B : 4 h, résumé (8 pts, ±10 % de mots, décompte faux lourdement sanctionné) + dissertation (12 pts) dont le sujet est tiré du texte résumé, appuyée sur les œuvres.
- Environnement : une session Claude Code dans un conteneur cloud, travaillant dans un dépôt Git/GitHub (${REPO}). Capacités réelles :
  * fichiers Markdown (rendus sur GitHub et dans l'app Claude : tableaux, diagrammes Mermaid : cartes mentales, frises, graphes) ; historique Git = traces de tout le travail ;
  * HTML autonome et interactif (quiz, frises cliquables, cartes mentales, fonctionne hors ligne sur téléphone) ;
  * PDF imprimables (HTML -> PDF via Chromium headless / Playwright), documents LibreOffice (docx, odt, pptx) ;
  * decks Anki .apkg (bibliothèque genanki installée) ou fichiers TSV importables dans Anki ;
  * Artefacts claude.ai : pages web privées publiables, partageables, pouvant garder un état persistant (ex. appli de révision qui mémorise la progression) ;
  * Routines planifiées : une session Claude peut être déclenchée à heure fixe (ex. chaque dimanche soir) pour générer et commiter un sujet d'entraînement, un quiz de la semaine, un bilan, avec notification ;
  * correction de copies : l'étudiant dépose le texte, la photo ou le scan de ses résumés et dissertations dans le dépôt ; Claude corrige avec une grille type jury et tient un suivi de progression ;
  * entraînement interactif dans le chat : colle simulée, questions de cours, contradicteur sur une problématique, dictée de plan ;
  * recherche web possible, MAIS la plupart des sites sont bloqués en lecture directe dans cette session ; pas d'accès aux éditions au programme.
- Limites à respecter : droits d'auteur (pas de reproduction de larges extraits des traductions au programme ni des textes récents) ; le modèle peut se tromper sur des détails (numéros de chapitres, citations) : toute citation littérale doit être vérifiée dans l'édition de l'étudiant ; pas de synthèse vocale / audio disponible.
`

const REGLES = `
RÈGLES DE RÉDACTION (impératives)
- Français impeccable, niveau prépa, ton direct et bienveillant (tutoiement), dense mais lisible ; titres clairs, listes, tableaux ; pas de remplissage.
- JAMAIS de citation inventée. Privilégie la paraphrase + une localisation stable : Stephanus pour Platon (ex. Rép. 597b), chapitre pour Zola / Verne (partie + chapitre) / Woolf, section pour Canguilhem, moment du récit pour Haushofer (le roman n'a pas de chapitres). Si tu cites littéralement une formule très courte et célèbre, ajoute « [à vérifier dans ton édition] ». Si tu n'es pas sûr d'un numéro de chapitre ou d'une référence, donne une fourchette ou écris « [réf. à vérifier] » plutôt que d'inventer.
- En tête de chaque document : un encadré (blockquote) avec : type de document, thème, œuvre(s), statut « ÉCHANTILLON / prototype — généré le 24/09/2026, à valider », et comment l'utiliser (2 lignes).
- En fin de document : une section « Points à vérifier » listant honnêtement les incertitudes (peut être courte).
- N'écris QUE dans les fichiers qu'on te demande. Brouillons et scripts de test : dans ${SCRATCH}, jamais dans le dépôt. Ne fais aucun commit git.
`

// ---------------- PROPOSITIONS ----------------

const IDEAS_SCHEMA = {
  type: 'object',
  properties: {
    ideas: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          titre: { type: 'string' },
          description: { type: 'string', description: 'ce que c est, concrètement, 2-4 phrases' },
          format: { type: 'string', description: 'format de fichier / support' },
          exemple_concret: { type: 'string', description: 'exemple précis tiré des œuvres ou de l épreuve' },
          benefice: { type: 'string', description: 'pourquoi ça aide à assimiler / réussir' },
          effort: { type: 'string', enum: ['faible', 'moyen', 'élevé'] },
          priorite: { type: 'integer', minimum: 1, maximum: 3, description: '1 = indispensable' },
          limites: { type: 'string' },
        },
        required: ['titre', 'description', 'format', 'exemple_concret', 'benefice', 'effort', 'priorite', 'limites'],
      },
    },
  },
  required: ['ideas'],
}

const LENSES = [
  { key: 'memorisation', prompt: `ANGLE : sciences cognitives de l'apprentissage. Propose des documents et dispositifs fondés sur ce qui marche vraiment pour retenir durablement : récupération active (se tester plutôt que relire), répétition espacée, entrelacement (mélanger œuvres et thèmes), double codage (texte + schéma), élaboration (se demander pourquoi / comment), exemples concrets, test-feedback immédiat. Pense à ce qu'on retient pour une dissertation : références précises aux œuvres, arguments, concepts, personnages, scènes, distinctions conceptuelles. Adapte au rythme d'un PT* surchargé (sessions courtes, téléphone, transports).` },
  { key: 'concours', prompt: `ANGLE : réussir l'épreuve Banque PT Français B (résumé + dissertation, 4 h). Propose des documents et entraînements ciblés : méthode du résumé (fidélité, énonciation, décompte des mots, gestion du temps), méthode de la dissertation sur sujet tiré d'une citation (analyse du sujet, problématique, plan, exemples tirés des 3 œuvres du thème, transitions, introduction et conclusion), banques de sujets, corrigés, grilles d'autocorrection inspirées des rapports de jury, entraînements chronométrés fractionnés (ex. 20 min pour une problématique), correction de copies et suivi. Pense aussi à la langue (orthographe, syntaxe, connecteurs) qui pèse dans la note.` },
  { key: 'contenu', prompt: `ANGLE : maîtrise du contenu des 6 œuvres et des 2 thèmes. Propose des documents de contenu : fiches d'œuvre à plusieurs niveaux de détail (1 page, détaillée), résumés par chapitre ou par mouvement, personnages, concepts clés (mimèsis, enthousiasme, milieu, normativité, vitalisme, naturalisme, esprit androgyne…), scènes et passages clés localisés, contextes (Cézanne et Zola, conférences de Woolf à Cambridge, Canguilhem et la biologie), notions transversales de chaque thème, tableaux de croisement entre œuvres, lexique philosophique, citations de critiques et philosophes utiles (avec prudence sur l'exactitude). Traite séparément ce qui sert à RÉVISER le thème 1 (déjà vu l'an dernier : consolider, condenser les notes de l'élève) et à DÉCOUVRIR le thème 2 (accompagner la lecture, suivre le cours).` },
  { key: 'outils', prompt: `ANGLE : ce qu'une session Claude Code apporte de spécifique par rapport à un manuel ou une IA en chat simple. Exploite les capacités réelles décrites dans le contexte : dépôt Git comme mémoire et historique de progression, génération industrielle de formats variés (Anki .apkg, quiz HTML hors ligne, PDF imprimables, cartes Mermaid), Artefacts claude.ai avec état persistant (appli de révision perso), Routines planifiées (sujet de la semaine, quiz auto, bilan mensuel), correction de copies déposées, scripts réutilisables pour régénérer tout un corpus, tableaux de bord de progression, conventions (CLAUDE.md) pour que chaque future session reprenne le travail au bon endroit. Sois inventif mais réaliste : ne promets rien d'impossible (pas d'audio, accès web limité, pas d'accès aux éditions).` },
  { key: 'organisation', prompt: `ANGLE : organisation, planning et traçabilité sur 7 mois (fin septembre 2026 -> écrits fin avril/mai 2027). Propose : feuille de route de production des documents, planning de révision hebdomadaire réaliste pour un PT* (le français pèse ~15 % des coefficients d'écrit Banque PT), articulation avec le cours du professeur et les DS/khôlles, journal de bord, tableau de bord de progression (notes, temps, points faibles), rituels (15 min/jour ? 1 h/semaine ?), jalons (DS blancs, concours blancs), gestion des deux thèmes (consolidation du thème 1 vs apprentissage du thème 2), méthode pour garder des traces exploitables (commits, décisions, sources). Propose aussi comment l'étudiant et Claude se répartissent le travail.` },
]

const CRIT_SCHEMA = {
  type: 'object',
  properties: {
    verdict_global: { type: 'string' },
    problemes: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          gravite: { type: 'string', enum: ['bloquant', 'important', 'mineur'] },
          localisation: { type: 'string' },
          probleme: { type: 'string' },
          correction_proposee: { type: 'string' },
        },
        required: ['gravite', 'localisation', 'probleme', 'correction_proposee'],
      },
    },
    idees_manquantes: { type: 'array', items: { type: 'string' } },
  },
  required: ['verdict_global', 'problemes', 'idees_manquantes'],
}

const CRITICS = [
  { key: 'prof', prompt: `Tu es professeur de français-philosophie en PT* depuis 15 ans et correcteur de l'épreuve Banque PT Français B. Critique sans complaisance ce catalogue de propositions : pertinence réelle pour le concours, justesse méthodologique (résumé, dissertation), risques de dérive (trop de fiches passives, bachotage de citations, contenus qui remplacent la lecture des œuvres), exactitude de ce qui est dit du programme et de l'épreuve (compare avec PROGRAMME.md), articulation avec le cours. Dis ce qui est superflu, ce qui manque, ce qui est faux.` },
  { key: 'etudiant', prompt: `Tu es un étudiant de PT* très chargé (maths, physique, SI, khôlles, DS chaque samedi). Critique ce catalogue du point de vue de l'usage réel : qu'est-ce que tu utiliserais vraiment ? qu'est-ce qui est trop long, trop ambitieux, mal priorisé ? le « Top 10 » est-il le bon ? le démarrage est-il simple (que faire cette semaine en 30 min) ? les formats sont-ils pratiques (téléphone, transports, impression) ? la charge demandée à l'étudiant est-elle réaliste ?` },
  { key: 'completude', prompt: `Tu es un auditeur de complétude et d'exactitude. Vérifie : (a) chaque affirmation factuelle sur le programme, les œuvres, l'épreuve, par rapport à PROGRAMME.md et à tes connaissances (utilise WebSearch si besoin ; WebFetch est bloqué sur la plupart des domaines) ; (b) chaque promesse sur les capacités de Claude Code : est-elle réaliste dans l'environnement décrit ? (c) ce qui manque : un type de document, un angle, une limite non dite, une question à poser à l'étudiant, un risque (droits d'auteur, citations fausses, dépendance à l'outil). (d) la cohérence interne (numérotation des idées, liens vers les échantillons, doublons).` },
]

const PROTOS = [
  {
    id: 'P1', label: 'fiche Zola',
    fichiers: [`${REPO}/echantillons/01_fiche-oeuvre_Zola_L-Oeuvre.md`],
    oeuvre: "Zola, L'Œuvre (1886)",
    consigne: `Rédige une FICHE ŒUVRE « express » (1 200 à 2 000 mots) sur Zola, L'Œuvre, pour le thème « Les arcanes de la création ». Contenu : (1) carte d'identité (date, place dans les Rougon-Macquart, filiation de Claude Lantier, genèse et lien avec Cézanne et Manet, prudence sur l'identification) ; (2) l'intrigue en grands mouvements (regroupe les 12 chapitres en 4 ou 5 mouvements avec les numéros de chapitres ; ne donne un détail chapitre par chapitre que si tu en es sûr) ; (3) personnages (Claude, Christine, Jacques, Sandoz, Dubuche, Fagerolles, Bongrand, Mahoudeau, Jory, Irma Bécot, etc. : 1 ligne chacun, fonction dans la réflexion sur la création) ; (4) 6 à 8 scènes clés localisées (chapitre) et ce qu'elles permettent de dire ; (5) « Ce que L'Œuvre permet de dire en dissertation » : 6 à 8 idées-arguments sur la création (travail/inspiration, génie et impuissance, l'œuvre et la vie, rivalité de l'œuvre et de la femme, réception et marché, échec, naturalisme, peinture de plein air), chacune avec sa référence ; (6) croisements avec Platon (Ion, Rép. X) et Woolf (Un lieu à soi) ; (7) contresens et pièges à éviter ; (8) mini-autotest de 6 questions avec réponses en fin de fiche (dans un bloc <details>).`,
  },
  {
    id: 'P2', label: 'flashcards Platon',
    fichiers: [`${REPO}/echantillons/02_flashcards_Platon_Ion-Republique-X.tsv`, `${REPO}/echantillons/02_flashcards_Platon_Ion-Republique-X.md`],
    oeuvre: 'Platon, Ion et République X (595a-608b)',
    consigne: `Crée un jeu de 30 FLASHCARDS sur Platon, Ion et République X (595a-608b), pour le thème « Les arcanes de la création ». Couvre : notions (rhapsode, enthousiasme / possession divine, technè, mimèsis, « trois lits » et trois artisans, imitation au troisième rang après la vérité, miroir, usage / fabrication / imitation, partie inférieure de l'âme, illusions des sens, effet de la poésie tragique sur l'âme, exclusion des poètes et exception des hymnes aux dieux et éloges des gens de bien, « ancien différend » entre philosophie et poésie, possibilité d'une défense de la poésie) ; Ion (Ion d'Éphèse, compétence limitée à Homère, image de l'aimant et des anneaux, poète « chose légère, ailée, sacrée », Tynnichos, émotion du rhapsode et du spectateur, examen des arts représentés chez Homère, Ion stratège, conclusion : divin plutôt que technicien) ; et 4 à 5 cartes de mise en relation dissertation (« À quoi sert Ion dans un sujet sur l'inspiration ? »). Chaque carte : recto = question précise et courte ; verso = réponse en 1 à 3 phrases + référence Stephanus entre parenthèses (fourchette si doute ; « [réf. à vérifier] » si incertain). FICHIER 1 (TSV pour import Anki) : première ligne « #separator:tab », deuxième « #html:true », troisième « #tags column:3 », puis une carte par ligne : Recto<TAB>Verso<TAB>tags (tags séparés par des espaces, ex. « platon ion notion »), aucun retour à la ligne dans un champ (utilise <br> si besoin), aucune tabulation dans le texte. Pas d'encadré d'en-tête dans le TSV. FICHIER 2 (Markdown) : l'encadré d'en-tête habituel, puis les mêmes cartes lisibles, groupées par rubrique, la réponse cachée dans des blocs <details><summary>question</summary>réponse</details> pour pouvoir s'auto-interroger sur téléphone, puis la section « Points à vérifier ». Vérifie avec un petit script (dans ${SCRATCH}) que le TSV a exactement 3 colonnes sur chaque ligne de carte et 30 cartes.`,
  },
  {
    id: 'P3', label: 'méthode résumé',
    fichiers: [`${REPO}/echantillons/03_methode_resume-Banque-PT.md`],
    oeuvre: 'Méthode — résumé de texte, Banque PT Français B',
    consigne: `Rédige une FICHE MÉTHODE du résumé pour l'épreuve Banque PT Français B (1 500 à 2 200 mots hors exercice). Contenu : (1) ce que le jury attend (fidélité à la pensée et à l'ordre du texte, reformulation, énonciation : on résume à la place de l'auteur, pas de « l'auteur dit », pas d'avis personnel ; tolérance ±10 % ; décompte honnête : un décompte faux est lourdement sanctionné) ; présente les règles de décompte des mots usuelles aux concours (un mot = unité typographique séparée par un espace ou une apostrophe, etc.) en précisant qu'il faut vérifier la règle exacte dans les consignes de l'épreuve ; (2) méthode en étapes chronométrées pour ~1 h 30 (lecture, repérage de la thèse et de la structure, tableau des idées, rédaction, relecture, décompte) ; (3) techniques de condensation (supprimer exemples, fusionner, nominaliser, connecteurs logiques) avec mini-exemples ; (4) les 10 erreurs fréquentes ; (5) une grille d'autocorrection sur 8 points (critères pondérés) ; (6) le lien avec la dissertation (le sujet est tiré du texte : repérer pendant le résumé la phrase qui pourrait faire sujet) ; (7) EXERCICE : écris toi-même un texte argumentatif ORIGINAL d'environ 400 mots sur un sujet lié au thème « Les arcanes de la création » (par ex. inspiration et travail), style essai, puis propose un résumé modèle d'environ 100 mots (±10 %) avec son décompte réel, en indiquant le décompte tous les 25 mots par une barre « / » et le total. VÉRIFIE les décomptes avec un script (dans ${SCRATCH}) : compte les mots du texte et du résumé selon la règle que tu as énoncée et assure-toi que les nombres affichés sont exacts. Termine par un corrigé commenté (pourquoi ce résumé est bon).`,
  },
  {
    id: 'P4', label: 'quiz Woolf HTML',
    fichiers: [`${REPO}/echantillons/04_quiz_Woolf_Un-lieu-a-soi.html`],
    oeuvre: "Woolf, Un lieu à soi (A Room of One's Own, 1929), trad. M. Darrieussecq",
    consigne: `Crée un QUIZ INTERACTIF en un seul fichier HTML autonome (aucune ressource externe : ni CDN, ni police web ; doit marcher hors ligne sur téléphone) sur Woolf, Un lieu à soi. 20 questions à choix multiples (4 options) couvrant les 6 chapitres : contexte (conférences de 1928 dans deux collèges féminins de Cambridge, publication 1929, la traduction de Darrieussecq et le choix de « lieu »), dispositif de la narratrice aux noms multiples, Oxbridge et Fernham, la thèse des 500 livres de rente et de la pièce à soi, l'héritage de la tante, le British Museum et les livres écrits par des hommes sur les femmes, Judith Shakespeare, les écrivaines du passé (Lady Winchilsea, Margaret Cavendish, Aphra Behn, Jane Austen, Charlotte Brontë, George Eliot), la phrase et les formes littéraires, Mary Carmichael et « Chloé aimait Olivia », l'esprit androgyne (Coleridge), la conclusion. Chaque question : une explication de 1 à 3 phrases affichée après réponse + la référence (chapitre). Pas de citation littérale de la traduction (paraphrase). Fonctionnalités : mélange des questions et des options, retour immédiat (juste/faux + explication), barre de progression, score final, bouton « Revoir mes erreurs » qui relance uniquement les questions ratées, bouton recommencer ; meilleur score mémorisé via localStorage entouré de try/catch (la page doit marcher sans) ; accessible (vrais <button>, focus visible, contrastes) ; thème clair et sombre automatique (prefers-color-scheme) avec variables CSS sur :root et fond explicite sur body ; mise en page mobile d'abord (lisible à 375 px, pas de défilement horizontal) ; en-tête indiquant « Échantillon — généré le 24/09/2026 » ; en pied de page une courte note « Points à vérifier ». Structure le code pour que le tableau de questions soit en haut du script, séparé du moteur, afin de réutiliser le moteur pour d'autres œuvres. TESTE avec Playwright (script dans ${SCRATCH}, lancé par : NODE_PATH=/opt/node22/lib/node_modules node script.js ; chromium est déjà installé ; si le lancement échoue, passe executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome') : chargement sans erreur console, répondre à toutes les questions, vérifier le score, le mode « revoir mes erreurs », l'absence de défilement horizontal à 375 px, et le mode sombre (emulateMedia colorScheme dark). Pour ce fichier HTML, l'encadré d'en-tête et les points à vérifier sont intégrés dans la page.`,
  },
  {
    id: 'P5', label: 'croisements création',
    fichiers: [`${REPO}/echantillons/05_carte-croisements_Arcanes-de-la-creation.md`],
    oeuvre: 'Thème « Les arcanes de la création » : Platon, Zola, Woolf',
    consigne: `Rédige une CARTE DES CROISEMENTS du thème « Les arcanes de la création » (2 000 à 3 000 mots). Contenu : (1) une carte mentale en Mermaid (bloc de code mermaid, type mindmap ; syntaxe simple et valide : pas de parenthèses ni de caractères spéciaux non échappés dans les nœuds) des grandes questions du thème ; (2) un TABLEAU notions × œuvres (lignes : origine de la création : inspiration ou travail / technique ; création et vérité, imitation ; la figure du créateur : génie, folie, possession, impuissance ; les conditions matérielles et sociales de la création ; la création et la vie : ce qu'elle coûte ; l'œuvre inachevée, l'échec ; le public, la réception, le jugement ; création et genre / exclusion ; création et morale / cité) avec pour chaque case une idée + une référence précise (Stephanus / chapitre) ; (3) 3 sujets d'entraînement sous forme de questions (« Créer, est-ce travailler ? », « L'artiste est-il maître de son œuvre ? », « La création a-t-elle besoin de conditions matérielles ? ») : pour chacun, analyse des termes, paradoxe, problématique, plan détaillé en 3 parties avec pour chaque sous-partie un argument et un exemple précis tiré d'au moins deux œuvres ; (4) 5 « confrontations » fécondes entre deux œuvres (ex. l'enthousiasme de l'Ion face au labeur de Claude Lantier) ; (5) une liste de 8 à 10 références culturelles complémentaires sûres (auteurs, œuvres, concepts : ex. Kant et le génie dans la Critique de la faculté de juger, Valéry, Baudelaire et Constantin Guys, Balzac, Le Chef-d'œuvre inconnu, Rilke, Lettres à un jeune poète), chacune avec l'idée mobilisable et sans citation littérale non sûre.`,
  },
  {
    id: 'P6', label: 'plan détaillé nature',
    fichiers: [`${REPO}/echantillons/06_dissertation-plan-detaille_Experiences-de-la-nature.md`],
    oeuvre: 'Thème « Expériences de la nature » : Canguilhem, Verne, Haushofer',
    consigne: `Rédige un CORRIGÉ DE DISSERTATION en plan détaillé sur le thème « Expériences de la nature » (2 500 à 3 500 mots) sur le sujet : « Faire l'expérience de la nature, est-ce la connaître ? ». Contenu : (1) le travail de brouillon montré étape par étape (analyse des termes : les sens d'« expérience » — expérimentation scientifique, exploration, épreuve vécue — de « nature » et de « connaître » ; tension ; problématique) ; (2) introduction entièrement rédigée (accroche, analyse, problématique, annonce du plan) ; (3) plan détaillé en 3 parties, 2 à 3 sous-parties chacune, chaque sous-partie avec argument + exemple précis localisé tiré des œuvres (Canguilhem : L'expérimentation en biologie animale, Machine et organisme, Le vivant et son milieu, Le normal et le pathologique, La monstruosité et le monstrueux ; Verne : Aronnax savant naturaliste, classifications de Conseil, le Nautilus comme machine et comme milieu, Nemo, Ned Land le harponneur ; Haushofer : la narratrice seule derrière le mur, survie, animaux, travail agricole, alpage, le temps, l'écriture du récit) et transitions rédigées ; (4) conclusion entièrement rédigée ; (5) « Ce qu'un correcteur valoriserait » et « Erreurs à éviter sur ce sujet » ; (6) 5 sujets voisins pour s'entraîner. Rappel : l'étudiant a étudié ce thème l'an dernier en PTSI, ce document sert à consolider. Localise sans inventer : Verne en partie + chapitre seulement si sûr ; Haushofer par moment du récit.`,
  },
]

const WRITE_SCHEMA = {
  type: 'object',
  properties: {
    fichiers: { type: 'array', items: { type: 'string' } },
    resume: { type: 'string' },
    points_a_verifier: { type: 'array', items: { type: 'string' } },
  },
  required: ['fichiers', 'resume', 'points_a_verifier'],
}
const VERIF_SCHEMA = {
  type: 'object',
  properties: {
    verdict: { type: 'string' },
    problemes: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          gravite: { type: 'string', enum: ['bloquant', 'important', 'mineur'] },
          localisation: { type: 'string' },
          probleme: { type: 'string' },
          correction_proposee: { type: 'string' },
          certitude: { type: 'string', enum: ['certain', 'probable', 'doute'] },
        },
        required: ['gravite', 'localisation', 'probleme', 'correction_proposee', 'certitude'],
      },
    },
  },
  required: ['verdict', 'problemes'],
}
const FIX_SCHEMA = {
  type: 'object',
  properties: {
    changements: { type: 'array', items: { type: 'string' } },
    critiques_rejetees: { type: 'array', items: { type: 'string' } },
    points_restant_a_verifier: { type: 'array', items: { type: 'string' } },
  },
  required: ['changements', 'critiques_rejetees', 'points_restant_a_verifier'],
}

async function propositionsFlow() {
  const ideasByLens = await parallel(LENSES.map(l => () =>
    agent(`${CONTEXTE}\n\nTÂCHE : génère 12 à 20 idées de documents, outils ou dispositifs que cette session Claude Code pourrait produire ou mettre en place pour cet étudiant.\n${l.prompt}\n\nSois concret et spécifique aux œuvres et à l'épreuve (pas de généralités applicables à n'importe quelle matière). Chaque idée doit être réalisable dans l'environnement décrit. Réponds en français. Tu peux lire ${REPO}/00_pilotage/PROGRAMME.md ; n'écris aucun fichier.`,
      { label: `idées:${l.key}`, phase: 'Idéation', schema: IDEAS_SCHEMA })
      .then(r => r ? { lens: l.key, ideas: r.ideas } : null)))
  const pools = ideasByLens.filter(Boolean)
  log(`Idéation : ${pools.reduce((n, p) => n + p.ideas.length, 0)} idées brutes sur ${pools.length} angles`)

  const protoList = PROTOS.map(p => `- ${p.id} (${p.label}) : ${p.fichiers.map(f => f.replace(REPO + '/', '')).join(' + ')} — ${p.oeuvre}`).join('\n')

  const synth = await agent(`${CONTEXTE}\n\nTÂCHE : tu es le rédacteur en chef. Voici les idées brutes produites par 5 agents d'angles différents (JSON) :\n${JSON.stringify(pools)}\n\nFusionne, dédoublonne, hiérarchise et rédige le fichier ${REPO}/00_pilotage/PROPOSITIONS.md : le livrable principal qui répond à la demande de l'étudiant « propose-moi tes idées sur ce que cette session Claude Code pourrait m'apporter ». Structure attendue :\n# titre\n> encadré : date (24/09/2026), statut (proposition à valider), comment lire ce document\n## En bref (5 à 7 puces)\n## Le cadre (2 thèmes, épreuve Banque PT : 5 lignes max, renvoi à PROGRAMME.md)\n## Principes qui guident les propositions (4 à 6 : récupération active > relecture, etc.)\n## Catalogue des idées : regroupées en familles (A. Comprendre et synthétiser les œuvres, B. Mémoriser activement, C. S'entraîner à l'épreuve (résumé, dissertation), D. Croiser les œuvres et problématiser, E. Faire corriger et suivre ses progrès, F. Outils, formats et automatisations propres à Claude Code, G. Organisation et traces — adapte si besoin). Chaque idée a un identifiant (A1, A2…), un titre en gras, puis : Quoi / Pourquoi / Format / Exemple / Effort (pour Claude et pour toi) / Priorité (★★★ indispensable, ★★ utile, ★ bonus). Vise 35 à 55 idées au total, sans remplissage : fusionne les idées proches.\n## Échantillons déjà produits : tableau reliant chaque échantillon à l'idée qu'il illustre, avec lien relatif Markdown (depuis 00_pilotage/, donc ../echantillons/...). Échantillons :\n${protoList}\n## Le Top 10 pour démarrer (ordre conseillé, avec pourquoi)\n## Ce qu'on peut faire dès cette semaine (3 actions de 30 min pour l'étudiant, 3 livrables pour Claude)\n## Limites et précautions (citations à vérifier, droits d'auteur, accès web limité, ne remplace ni la lecture des œuvres ni le cours, etc.)\n## Questions pour toi (les décisions à prendre : thème(s) traité(s) en cours, éditions possédées, concours visés, supports préférés, temps disponible, envoi de copies, etc.)\n\n${REGLES}\nRetourne un court résumé de ce que tu as écrit et le nombre d'idées.`,
    { label: 'synthèse', phase: 'Synthèse' })

  const critiques = await parallel(CRITICS.map(c => () =>
    agent(`${CONTEXTE}\n\n${c.prompt}\n\nDocument à critiquer : ${REPO}/00_pilotage/PROPOSITIONS.md (lis aussi ${REPO}/00_pilotage/PROGRAMME.md). Ne modifie aucun fichier. Sois précis : chaque problème avec localisation (identifiant d'idée ou section) et correction proposée.`,
      { label: `critique:${c.key}`, phase: 'Critique', schema: CRIT_SCHEMA })
      .then(r => r ? { critique: c.key, ...r } : null)))
  const crits = critiques.filter(Boolean)
  log(`Critique : ${crits.reduce((n, c) => n + c.problemes.length, 0)} problèmes relevés, ${crits.reduce((n, c) => n + c.idees_manquantes.length, 0)} idées manquantes suggérées`)

  const revision = await agent(`${CONTEXTE}\n\nTÂCHE : réviser ${REPO}/00_pilotage/PROPOSITIONS.md à partir de ces critiques indépendantes (JSON) :\n${JSON.stringify(crits)}\n\n1) Applique toutes les critiques fondées (les « bloquant » et « important » en priorité ; tranche quand deux critiques se contredisent, en privilégiant l'utilité réelle pour l'étudiant et l'exactitude). Intègre les idées manquantes pertinentes. Rejette explicitement ce qui n'est pas fondé. Garde la structure et les identifiants stables (si tu renumérotes, mets à jour toutes les références). Vérifie que les liens relatifs vers ../echantillons/ correspondent aux fichiers : ${PROTOS.flatMap(p => p.fichiers).map(f => f.replace(REPO + '/', '')).join(', ')}.\n2) Crée ${REPO}/00_pilotage/FEUILLE_DE_ROUTE.md : (a) plan de production des documents en vagues (Vague 0 = ce qui est déjà fait, Vague 1 = octobre, etc.) sous forme de cases à cocher « - [ ] » référencant les identifiants d'idées ; (b) calendrier de révision mois par mois de fin septembre 2026 aux écrits (fin avril/mai 2027, dates à vérifier), distinguant thème 1 (consolidation) et thème 2 (apprentissage au rythme du cours) ; (c) une semaine type réaliste pour un PT* (temps de français par jour/semaine, ce qu'on fait dans les transports, le dimanche, etc.) ; (d) jalons de contrôle (auto-évaluation, concours blancs) ; (e) une section « Comment on travaille ensemble » : ce que fait l'étudiant, ce que fait Claude à chaque session, comment on garde les traces (JOURNAL.md, DECISIONS.md, commits).\n\n${REGLES}\nRetourne la liste des changements appliqués et des critiques rejetées (avec raison).`,
    { label: 'révision', phase: 'Révision', schema: FIX_SCHEMA })

  return { pools, synth, crits, revision }
}

async function protosFlow() {
  return pipeline(
    PROTOS,
    p => agent(`${CONTEXTE}\n\nTÂCHE : produire un ÉCHANTILLON (prototype de haute qualité) pour montrer à l'étudiant un format de document possible. Œuvre / sujet : ${p.oeuvre}.\n${p.consigne}\n\nFichier(s) à écrire : ${p.fichiers.join(' ; ')}.\n\n${REGLES}\nAvant d'écrire, fais la liste de ce dont tu es sûr et de ce dont tu doutes ; n'écris pas comme certain ce dont tu doutes. Retourne les chemins écrits, un résumé et tes points de doute.`,
      { label: `rédaction:${p.id}`, phase: 'Échantillons', schema: WRITE_SCHEMA }),
    (w, p) => parallel([
      () => agent(`${CONTEXTE}\n\nTu es un VÉRIFICATEUR FACTUEL exigeant, spécialiste de : ${p.oeuvre}. Lis attentivement : ${p.fichiers.join(' ; ')}. Doutes signalés par l'auteur : ${JSON.stringify(w ? w.points_a_verifier : [])}.\nRelève toute erreur factuelle (intrigue, personnages, chronologie, numéros de chapitres, références Stephanus, dates, attribution de concepts ou de thèses, contresens philosophiques), toute citation littérale non signalée « à vérifier » ou suspecte d'être inventée, toute affirmation incertaine présentée comme certaine, tout décompte de mots faux (recompte avec un script dans ${SCRATCH} s'il y a un décompte). Utilise WebSearch pour trancher les points douteux (WebFetch est bloqué sur la plupart des domaines). Indique ta certitude pour chaque problème. Si un point te semble exact, ne le signale pas. Ne modifie aucun fichier.`,
        { label: `vérif-faits:${p.id}`, phase: 'Vérification', schema: VERIF_SCHEMA }),
      () => agent(`${CONTEXTE}\n\nTu es PROFESSEUR de français-philosophie en PT* et correcteur Banque PT. Évalue l'échantillon : ${p.fichiers.join(' ; ')} (${p.oeuvre}). Critères : utilité réelle pour réviser et pour l'épreuve (résumé + dissertation), justesse méthodologique, mobilisabilité des idées en dissertation, clarté et hiérarchie, densité (ni trop long ni creux), ergonomie (lisible sur téléphone, Markdown propre, tableaux lisibles), respect des consignes de format (encadré d'en-tête, points à vérifier). ${p.fichiers.some(f => f.endsWith('.html')) ? `Pour le fichier HTML : teste-le réellement avec Playwright (script dans ${SCRATCH}, NODE_PATH=/opt/node22/lib/node_modules node script.js ; executablePath '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' si besoin) : erreurs console, parcours complet, mode « revoir mes erreurs », 375 px sans défilement horizontal, mode sombre, accessibilité clavier.` : ''}${p.fichiers.some(f => f.endsWith('.tsv')) ? ' Pour le TSV : vérifie le format d’import Anki (en-têtes, 3 colonnes, pas de tabulation parasite).' : ''} Ne modifie aucun fichier. Signale les problèmes avec localisation et correction proposée.`,
        { label: `vérif-péda:${p.id}`, phase: 'Vérification', schema: VERIF_SCHEMA }),
    ]).then(vs => ({ w, verifs: vs.filter(Boolean) })),
    (r, p) => agent(`${CONTEXTE}\n\nTÂCHE : corriger l'échantillon ${p.fichiers.join(' ; ')} (${p.oeuvre}) à partir de ces rapports de vérification indépendants (JSON) :\n${JSON.stringify(r.verifs)}\n\nRègles : pour chaque problème factuel, corrige si tu es sûr de la correction ; si le doute persiste, supprime l'affirmation ou marque-la « [à vérifier] » et ajoute-la aux « Points à vérifier ». N'ajoute aucun contenu nouveau non vérifié. Applique les remarques pédagogiques fondées. Si deux rapports se contredisent, tranche et dis pourquoi. ${p.fichiers.some(f => f.endsWith('.html')) ? `Après modification du HTML, reteste-le avec Playwright (NODE_PATH=/opt/node22/lib/node_modules ; script dans ${SCRATCH}).` : ''}${p.fichiers.some(f => f.endsWith('.tsv')) ? ' Garde le TSV et le Markdown strictement synchronisés (mêmes cartes) et revérifie le format du TSV par script.' : ''}${p.id === 'P3' ? ` Revérifie par script (dans ${SCRATCH}) tous les décomptes de mots affichés.` : ''}\n\n${REGLES}\nRetourne les changements appliqués, les critiques rejetées (avec raison) et les points restant à vérifier.`,
      { label: `correction:${p.id}`, phase: 'Correction', schema: FIX_SCHEMA })
      .then(fix => ({ id: p.id, fichiers: p.fichiers, redaction: r.w, verifications: r.verifs, correction: fix })),
  )
}

const [props, protos] = await parallel([() => propositionsFlow(), () => protosFlow()])
return { propositions: props, echantillons: protos }
