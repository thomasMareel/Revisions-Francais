export const meta = {
  name: 'cartes-anki-theme1-methode',
  description: 'Premier paquet Anki maintenu par Claude : thème 1 (Verne, Canguilhem, Haushofer, croisements) + méthode, rédigé puis doublement vérifié',
  phases: [
    { title: 'Rédaction', detail: '5 jeux de cartes' },
    { title: 'Vérification', detail: 'faits + qualité Anki/pédagogie' },
    { title: 'Correction', detail: 'application des corrections + contrôle de format' },
    { title: 'Cohérence', detail: 'doublons et contradictions entre jeux' },
  ],
}

const REPO = '/home/user/Revisions-Francais'
const SCRATCH = '/tmp/claude-0/-home-user-Revisions-Francais/eb699ce7-3ac5-56b4-9e44-32b3bda4aa90/scratchpad/cartes'

const CONTEXTE = `
CONTEXTE
- Étudiant de PT* (2e année de CPGE), concours 2027, vise d'abord les Arts et Métiers (Banque PT, épreuve Français B : résumé 8 pts + dissertation 12 pts, 4 h). Niveau en français : moyen à faible (environ 9/20). Temps disponible : environ 15 minutes par semaine de travail régulier, soit environ 2 minutes d'Anki par jour, plus des entraînements ponctuels. Téléphone Android, AnkiDroid.
- Il a demandé que Claude « s'occupe lui-même de mettre en place les flashcards » : Claude rédige et maintient le paquet, l'étudiant importe un seul fichier .apkg.
- Thème 1 « Expériences de la nature » : étudié l'an dernier en PTSI, à réactiver. Œuvres : Canguilhem, La Connaissance de la vie (au programme : Introduction « La pensée et le vivant » ; I « Méthode » = « L'expérimentation en biologie animale » ; III « Philosophie », chapitres 2 à 5 : « Machine et organisme », « Le vivant et son milieu », « Le normal et le pathologique », « La monstruosité et le monstrueux » ; HORS programme : II « Histoire » et III ch. 1) ; Verne, Vingt mille lieues sous les mers (1869-1870 ; 2 parties : 24 + 23 chapitres) ; Haushofer, Le Mur invisible (Die Wand, 1963, trad. Liselotte Bodo et Jacqueline Chambon, Actes Sud ; roman sans chapitres).
- Référence unique sur le programme et l'épreuve : ${REPO}/00_pilotage/PROGRAMME.md. Règles du dépôt : ${REPO}/CLAUDE.md (lis les sections Exactitude et Format). Méthode du résumé déjà rédigée : ${REPO}/echantillons/03_methode_resume-Banque-PT.md ; plan de dissertation modèle sur le thème 1 : ${REPO}/echantillons/06_dissertation-plan-detaille_Experiences-de-la-nature.md ; exemple de jeu de cartes au bon format : ${REPO}/echantillons/02_flashcards_Platon_Ion-Republique-X.tsv et .md.
- TEXTE INTÉGRAL de Verne (édition Hetzel, domaine public) disponible : ${REPO}/ressources/textes/Verne_Vingt-mille-lieues_partie1_gutenberg-5095.txt et ..._partie2_gutenberg-5096.txt (UTF-8 ; titres de chapitres en chiffres romains centrés). Pour Verne, TOUTE référence de chapitre doit être vérifiée par recherche (grep) dans ce texte. Note : cette édition écrit la devise « MOBILIS IN MOBILE » (I, 8) ; d'autres éditions écrivent « Mobilis in mobili ».
- Pas de texte intégral pour Canguilhem ni Haushofer (sous droits) : s'appuyer sur des connaissances sûres, la recherche web (WebSearch fonctionne ; WebFetch est bloqué sur la plupart des sites), et marquer ce qui n'est pas certain.
`

const FORMAT = `
FORMAT DES CARTES (impératif)
- Fichier TSV (séparateur tabulation), en-têtes exactement dans cet ordre :
  #separator:tab
  #html:true
  #tags column:3
  #guid column:4
  #deck:<nom du paquet indiqué>
  puis une carte par ligne : Recto<TAB>Verso<TAB>tags<TAB>identifiant. Aucune tabulation ni retour à la ligne dans un champ (utiliser <br>). Identifiants : préfixe indiqué + numéro sur 3 chiffres, dans l'ordre (ex. ver-001, ver-002…), jamais réutilisés.
- L'ORDRE des lignes est l'ordre d'apprentissage : d'abord l'essentiel (qui, quoi, thèse centrale), puis les notions, les scènes ou passages clés, enfin les cartes « usage en dissertation ».
- Recto : une question courte (idéalement 8 à 20 mots), qui n'appelle QU'UNE réponse possible ; pas de question oui/non ; pas d'énumération longue à restituer (3 éléments au plus, sinon découper en plusieurs cartes) ; formulation claire pour un élève moyen.
- Verso : <b>réponse essentielle en 15 mots au plus</b><br>explication ou précision en 30 mots au plus<br><small>Réf. : localisation</small>. Localisation : pour Verne, partie et chapitre en chiffres romains (ex. « II, 12 ») vérifiés dans le texte intégral ; pour Canguilhem, la section (ex. « III, 4, Le normal et le pathologique ») ; pour Haushofer, le moment du récit (ex. « fin du récit, à l'alpage »). Si la référence ou un détail n'est pas vérifié sur un texte, ajouter « [non vérifié] » dans le <small>. Cartes de méthode : Réf. = le document source (ex. « PROGRAMME.md, § 3 » ou « fiche méthode P3, § 1.2 »).
- Tags (espace entre les tags, minuscules, sans accents) : theme1 ou methode, l'œuvre (verne, canguilhem, haushofer, croisements), et un type parmi : essentiel, notion, scene, personnage, dissertation, resume, methode-dissertation, langue.
- JAMAIS de citation inventée : paraphrase. Une formule très courte et célèbre peut apparaître entre guillemets avec « [à vérifier dans ton édition] ».
- Fichier Markdown jumeau (même nom, extension .md) contenant EXACTEMENT les mêmes cartes, dans le même ordre : en tête un encadré (blockquote) avec : Type (cartes Anki), Thème, Œuvre, Statut (BROUILLON à la rédaction ; RELU (IA) après correction), date 26/09/2026, Mode d'emploi en 2 lignes (importer exports/anki/francais-PT.apkg dans AnkiDroid ; cette page sert à relire sur téléphone ou à imprimer) ; puis les cartes groupées par rubriques (### Essentiel, ### Notions, ### Scènes ou passages clés, ### En dissertation…), chacune sous la forme :
  <details><summary>RECTO (texte identique au TSV)</summary>
  (ligne vide)
  VERSO (même contenu ; le HTML simple est accepté) · <code>identifiant</code>
  (ligne vide)
  </details>
  et en fin de fichier une section « ## Points à vérifier ».
- Contrôle de format OBLIGATOIRE avant de rendre la main : python3 ${REPO}/outils/verifier_cartes.py <chemin du .tsv> doit afficher ✓ (0 erreur). Ne lance PAS outils/construire_anki.py. N'écris que dans tes fichiers ; brouillons et scripts dans ${SCRATCH}. Aucun commit git.
`

const ITEMS = [
  {
    id: 'ver', label: 'Verne', n: '28 à 32',
    tsv: `${REPO}/theme1_nature/verne/10_cartes_Verne_Vingt-mille-lieues.tsv`,
    deck: 'Français PT*::Thème 1 Nature::Verne',
    contenu: `Verne, Vingt mille lieues sous les mers. À couvrir : carte d'identité (dates, Voyages extraordinaires, Hetzel, structure en deux parties) ; le narrateur Aronnax (savant du Muséum, point de vue) ; Conseil (classer) ; Ned Land (harponneur, désir de terre et de liberté) ; Nemo (rupture avec l'humanité, liberté sous la mer, ambiguïtés) ; le Nautilus (électricité, autonomie, la mer qui fournit tout, milieu artificiel dans le milieu marin) ; la devise du Nautilus ; épisodes clés utiles au thème, chacun localisé et vérifié dans le texte : forêt sous-marine et chasse de l'île Crespo, Vanikoro et La Pérouse, cimetière de corail, pêcherie de perles de Ceylan, Atlantide, cachalots et baleines, banquise et pôle Sud, prisonniers des glaces (faute d'air), poulpes, hécatombe, Maelström et conclusion ; notions pour le thème (connaître en classant ou en éprouvant, émerveillement et maîtrise technique, exploitation ou respect, limites de la maîtrise) ; 5 à 6 cartes « En dissertation » (quelle scène pour montrer que… ?).`,
  },
  {
    id: 'can', label: 'Canguilhem', n: '28 à 32',
    tsv: `${REPO}/theme1_nature/canguilhem/10_cartes_Canguilhem_Connaissance-de-la-vie.tsv`,
    deck: 'Français PT*::Thème 1 Nature::Canguilhem',
    contenu: `Canguilhem, La Connaissance de la vie, UNIQUEMENT les textes au programme. Pour chaque texte : la question posée, la thèse, 1 ou 2 distinctions ou concepts, 1 exemple ou auteur discuté. Introduction « La pensée et le vivant » (le rapport entre connaître et vivre) ; « L'expérimentation en biologie animale » (difficultés propres à l'expérimentation sur le vivant, Claude Bernard, prudence dans le passage d'une espèce à l'autre, problème moral de l'expérimentation sur l'homme) ; « Machine et organisme » (critique de l'animal-machine cartésien, renversement : comprendre la machine à partir de l'organisme, la technique comme prolongement de la vie) ; « Le vivant et son milieu » (histoire de la notion de milieu, Uexküll et la tique, le vivant comme centre qui structure son milieu, Goldstein) ; « Le normal et le pathologique » (normativité : la santé comme capacité d'instituer de nouvelles normes, la maladie comme norme de vie rétrécie, le normal n'est pas la moyenne) ; « La monstruosité et le monstrueux » (le monstre comme valeur négative de la vie, la tératologie, le monstrueux comme catégorie de l'imaginaire). 5 à 6 cartes « En dissertation ». Beaucoup de formulations circulent : n'écris comme certain que ce qui l'est ; marque [non vérifié] sur toutes les localisations (pas de texte intégral) et [à vérifier dans ton édition] sur toute formule entre guillemets.`,
  },
  {
    id: 'hau', label: 'Haushofer', n: '24 à 28',
    tsv: `${REPO}/theme1_nature/haushofer/10_cartes_Haushofer_Le-Mur-invisible.tsv`,
    deck: 'Français PT*::Thème 1 Nature::Haushofer',
    contenu: `Haushofer, Le Mur invisible. À couvrir : carte d'identité (1963, titre original, traduction au programme) ; situation initiale (la narratrice au chalet de chasse de son cousin, le mur invisible apparu pendant la nuit, les êtres figés de l'autre côté) ; forme du récit (un « rapport » écrit après coup, rétrospectif, sans chapitres ; pourquoi elle écrit) ; les animaux et la responsabilité (Lynx le chien, Bella la vache, le veau devenu taureau, la chatte et ses petits : ne nomme que ceux dont tu es sûr) ; la survie et le travail (cultures, foin, chasse, bois) ; l'alpage en été (rapport au temps et au moi) ; la fin (l'irruption d'un homme, les morts, la réaction de la narratrice ; vérifie l'enchaînement exact par recherche) ; notions pour le thème (nature sans société, travail et soin, temps cyclique, dissolution du moi, violence humaine, écrire pour ne pas se perdre) ; 5 à 6 cartes « En dissertation ». Toutes les localisations sont des moments du récit, marquées [non vérifié] ; tout détail incertain (noms des petits chats, durée exacte, qui tue qui et comment) doit être vérifié par recherche ou omis.`,
  },
  {
    id: 'nat', label: 'Croisements thème 1', n: '14 à 18',
    tsv: `${REPO}/theme1_nature/transversal/10_cartes_Nature_notions-et-croisements.tsv`,
    deck: 'Français PT*::Thème 1 Nature::Croisements',
    contenu: `Thème « Expériences de la nature », cartes TRANSVERSALES seulement (les cartes propres à chaque œuvre sont faites ailleurs : ne les duplique pas). À couvrir : l'analyse de l'intitulé (le pluriel « expériences » : expérience vécue, expérimentation, épreuve ; « de la nature » : la nature qu'on éprouve ou ce qu'elle nous fait éprouver) ; 6 à 8 notions-pivots avec pour chacune une carte « quelle œuvre, quel exemple ? » confrontant au moins deux œuvres (milieu ; normes et normativité ; connaître ou maîtriser ; classer ou vivre ; l'animal ; la technique ; la solitude ; le temps) ; 3 à 4 cartes de confrontation directe (ex. le Nautilus et le chalet comme milieux ; Conseil qui classe et la narratrice qui soigne ; la maîtrise de Nemo et la critique de l'animal-machine) ; 2 à 3 cartes « types de sujets » (quelles tensions reviennent). Références : œuvre + localisation courte, [non vérifié] sauf pour Verne vérifié dans le texte intégral.`,
  },
  {
    id: 'met', label: 'Méthode', n: '24 à 28',
    tsv: `${REPO}/methode/10_cartes_Methode_resume-dissertation.tsv`,
    deck: 'Français PT*::Méthode',
    contenu: `Méthode de l'épreuve Banque PT Français B, pour un élève à environ 9/20 : les règles qui rapportent le plus de points. RÉSUMÉ (environ 12 cartes) : ce qu'on demande ; fourchette de ± 10 % et comment la calculer ; pénalités de décompte (d'après PROGRAMME.md, avec la prudence qui y figure) ; « corrige le texte, jamais le chiffre » ; énonciation (on résume à la place de l'auteur, jamais « l'auteur dit ») ; respecter l'ordre et les proportions ; supprimer les exemples mais garder l'idée ; reformuler, ne pas recopier ; les connecteurs logiques ; la règle usuelle de décompte (blanc et apostrophe) ; répartition du temps (1 h 30 / 2 h 30) ; repérer pendant le résumé la phrase qui pourrait fournir le sujet. DISSERTATION (environ 12 cartes) : le sujet vient d'une phrase du texte ; analyser les termes ; qu'est-ce qu'une problématique (une tension, pas une question plate) ; les parties d'une introduction ; le paragraphe type (idée, exemple précis, analyse, retour au sujet) ; exemple analysé et non raconté ; confronter au moins deux œuvres dans chaque partie ; les transitions ; la conclusion ; les titres d'œuvres soulignés ; les 10 dernières minutes. LANGUE (2 à 4 cartes) : fautes très fréquentes en copie de concours (par ex. accord du participe passé avec avoir, « quoique / quoi que », ponctuation autour de « c'est-à-dire »). Tout doit être cohérent avec PROGRAMME.md et l'échantillon P3 ; si quelque chose n'est qu'une pratique courante et non une règle du jury, dis-le.`,
  },
]

const WRITE_SCHEMA = { type: 'object', properties: { nb_cartes: { type: 'integer' }, resume: { type: 'string' }, doutes: { type: 'array', items: { type: 'string' } } }, required: ['nb_cartes', 'resume', 'doutes'] }
const VERIF_SCHEMA = {
  type: 'object',
  properties: {
    verdict: { type: 'string' },
    problemes: { type: 'array', items: { type: 'object', properties: {
      identifiant: { type: 'string' }, gravite: { type: 'string', enum: ['bloquant', 'important', 'mineur'] },
      probleme: { type: 'string' }, correction_proposee: { type: 'string' }, certitude: { type: 'string', enum: ['certain', 'probable', 'doute'] },
    }, required: ['identifiant', 'gravite', 'probleme', 'correction_proposee', 'certitude'] } },
    cartes_manquantes: { type: 'array', items: { type: 'string' } },
  },
  required: ['verdict', 'problemes', 'cartes_manquantes'],
}
const FIX_SCHEMA = { type: 'object', properties: {
  nb_cartes: { type: 'integer' }, changements: { type: 'array', items: { type: 'string' } },
  rejets: { type: 'array', items: { type: 'string' } }, points_a_verifier: { type: 'array', items: { type: 'string' } },
  controle_format: { type: 'string' },
}, required: ['nb_cartes', 'changements', 'rejets', 'points_a_verifier', 'controle_format'] }

const md = t => t.replace(/\.tsv$/, '.md')

const results = await pipeline(
  ITEMS,
  it => agent(`${CONTEXTE}\n\nTÂCHE : rédiger le jeu de cartes Anki « ${it.label} » (${it.n} cartes).\n${it.contenu}\n\nPréfixe des identifiants : ${it.id}- ; nom du paquet (#deck) : ${it.deck}.\nFichiers à écrire : ${it.tsv} et ${md(it.tsv)} (crée les dossiers au besoin).\n${FORMAT}\nAvant d'écrire, liste pour toi-même ce dont tu es sûr et ce dont tu doutes ; ne fais pas de carte sur un fait douteux que tu n'as pas pu vérifier. Retourne le nombre de cartes, un résumé et tes doutes.`,
    { label: `rédaction:${it.id}`, phase: 'Rédaction', schema: WRITE_SCHEMA }),
  (w, it) => parallel([
    () => agent(`${CONTEXTE}\n\nTu es un VÉRIFICATEUR FACTUEL exigeant pour le jeu de cartes « ${it.label} » : ${it.tsv} (et son jumeau .md). Doutes signalés par l'auteur : ${JSON.stringify(w ? w.doutes : [])}.\nContrôle CHAQUE carte : exactitude (faits, personnages, attribution des thèses et concepts, dates), localisation (pour Verne : vérifie CHAQUE chapitre cité par grep dans les deux fichiers du texte intégral, ressources/textes/ ; signale toute référence fausse), citations inventées ou non marquées, affirmations incertaines présentées comme sûres, marquage [non vérifié] manquant. Pour Canguilhem et Haushofer, utilise WebSearch pour trancher les doutes. Indique l'identifiant de la carte, la gravité et ta certitude. Si une carte est exacte, ne la signale pas. Ne modifie aucun fichier.`,
      { label: `vérif-faits:${it.id}`, phase: 'Vérification', schema: VERIF_SCHEMA }),
    () => agent(`${CONTEXTE}\n\nTu es un SPÉCIALISTE D'ANKI ET PROFESSEUR de français-philosophie en PT*. Évalue le jeu de cartes « ${it.label} » : ${it.tsv} (et son jumeau .md). Critères : principe d'information minimale (une seule chose par carte), recto sans ambiguïté (une seule bonne réponse), pas d'énumération trop longue, longueur (recto court, verso ≤ 45 mots hors référence), ordre d'apprentissage (l'essentiel d'abord), utilité réelle pour un élève à 9/20 qui n'a que 2 min par jour (chaque carte doit servir en copie), couverture (qu'est-ce qui manque d'indispensable ? qu'est-ce qui est superflu ?), qualité du français, cohérence avec la méthode de l'épreuve (PROGRAMME.md), respect du FORMAT. Lance aussi python3 ${REPO}/outils/verifier_cartes.py ${it.tsv}. Indique l'identifiant de chaque carte concernée. Ne modifie aucun fichier.\n${FORMAT}`,
      { label: `vérif-anki:${it.id}`, phase: 'Vérification', schema: VERIF_SCHEMA }),
  ]).then(vs => ({ w, verifs: vs.filter(Boolean) })),
  (r, it) => agent(`${CONTEXTE}\n\nTÂCHE : corriger le jeu de cartes « ${it.label} » (${it.tsv} et ${md(it.tsv)}) à partir de ces rapports de vérification indépendants (JSON) :\n${JSON.stringify(r.verifs)}\n\nRègles : corrige chaque erreur factuelle si tu es sûr de la correction (pour Verne, vérifie dans le texte intégral) ; sinon supprime la carte ou l'affirmation, ou marque-la [non vérifié]. Applique les remarques Anki et pédagogiques fondées (découpe, raccourcis, réordonne, ajoute les cartes indispensables manquantes, supprime le superflu) en restant dans la fourchette de ${it.n} cartes. IDENTIFIANTS : garde l'identifiant d'une carte que tu corriges ; une carte nouvelle reçoit le numéro libre suivant ; si tu supprimes une carte, son numéro n'est pas réutilisé (des trous dans la numérotation sont normaux) ; l'ordre des lignes reste l'ordre d'apprentissage même si les numéros ne se suivent plus. Garde le .md strictement synchronisé et passe son statut à « RELU (IA) ». Rejette explicitement (avec raison) ce qui n'est pas fondé ; si deux rapports se contredisent, tranche et dis pourquoi.\n${FORMAT}\nRetourne le nombre final de cartes, les changements, les rejets, les points restant à vérifier, et la sortie de verifier_cartes.py.`,
    { label: `correction:${it.id}`, phase: 'Correction', schema: FIX_SCHEMA })
    .then(fix => ({ id: it.id, label: it.label, tsv: it.tsv, redaction: r.w, verifications: r.verifs, correction: fix })),
)

const ok = results.filter(Boolean)
log(`Jeux corrigés : ${ok.map(r => `${r.id}=${r.correction ? r.correction.nb_cartes : '?'}`).join(', ')}`)

const coherence = await agent(`${CONTEXTE}\n\nTÂCHE : contrôle de COHÉRENCE GLOBALE du paquet. Fichiers : ${ok.map(r => r.tsv).join(' ; ')} (et leurs jumeaux .md).\n1) Repère les DOUBLONS entre jeux (même question ou même fait appris deux fois, surtout entre le jeu « Croisements » et les jeux par œuvre) : garde la meilleure carte, supprime ou reformule l'autre pour qu'elle apprenne autre chose.\n2) Repère les CONTRADICTIONS entre jeux (un même fait, une même localisation ou une même thèse énoncés différemment) : tranche (pour Verne, par le texte intégral dans ${REPO}/ressources/textes/) et harmonise.\n3) Vérifie que la terminologie est la même partout (ex. normativité, milieu, noms des personnages et des animaux).\nApplique les modifications toi-même dans les .tsv ET les .md (identifiants : ne jamais renuméroter ; un numéro supprimé n'est pas réutilisé). Termine par python3 ${REPO}/outils/verifier_cartes.py (tous les fichiers) : 0 erreur exigée.\n${FORMAT}\nRetourne la liste des doublons et contradictions traités et la sortie finale de verifier_cartes.py.`,
  { label: 'cohérence', phase: 'Cohérence', schema: { type: 'object', properties: { traitements: { type: 'array', items: { type: 'string' } }, sortie_verificateur: { type: 'string' } }, required: ['traitements', 'sortie_verificateur'] } })

return { jeux: ok, coherence }
