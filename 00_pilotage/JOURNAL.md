# Journal de bord

> Une entrée par session, **la plus récente en haut**. Chaque entrée dit : la demande, ce qui a été fait, les fichiers touchés, les décisions, les points à vérifier et la suite prévue. Le détail technique est dans l'historique Git (`git log`) et dans `traces/`.

<!-- Modèle d'entrée (à copier en haut) :

## AAAA-MM-JJ : titre court

**Demande** : …
**Fait** : …
**Fichiers** : créés … ; modifiés …
**Décisions** : … (reportées dans DECISIONS.md)
**Points à vérifier** : …
**Suite prévue** : …
**Commits** : …
-->

## 2026-09-26 : plan adapté à tes réponses et premier paquet Anki (136 cartes)

**Demande** (réponses de l'étudiant aux 4 questions) : « 1) [L'année] vient à peine de commencer. Je n'en sais pour l'instant rien. 2) Disons 15 mins par semaine au moins. Et plus pour les entraînements. 3) Android. Je peux avoir Anki. J'ai accès à une imprimante. Tu serais capable de mettre à jour un Anki (afin que tu t'occupes toi-même de mettre en place les flashcards) ? 4) Je suis plutôt moyen, voire mauvais en français… je tourne sur la moyenne de classe avec environ 9 de moyenne. Je vise les Arts et Métiers plus que tout le reste. »

**Fait** :
1. **Réponses reportées** dans `DECISIONS.md` (Q3, Q4, Q5, Q10, Q12 tranchées ; Q1 et Q13 à redemander dans 2 ou 3 semaines). **Plan resserré** : `FEUILLE_DE_ROUTE.md` § 0 (Anki 2 min par jour comme socle, un entraînement toutes les 2 semaines, priorités pour passer de 9 à 12, semaine type) ; vague 1 recentrée ; bandeau dans `PROPOSITIONS.md` ; profil de l'étudiant dans `CLAUDE.md`.
2. **Arts et Métiers** : d'après un extrait du Livret PT 2026, le Français B compte pour l'admission avec un coefficient 5 (à confirmer) → `PROGRAMME.md`.
3. **Faisabilité d'un Anki « tenu par Claude »** vérifiée dans le code source d'Anki (dépôt public ankitects/anki, importeur `.apkg`) : à la réimport, une note de même identifiant est mise à jour si le fichier est plus récent, l'historique est conservé ; les cartes existantes ne changent ni de paquet ni d'état → procédure de retrait par tag `retiree`.
4. **Outils** : `construire_anki.py` produit désormais **un seul fichier** `exports/anki/francais-PT.apkg` (cartes alternées entre jeux, échantillons à part) ; nouveau `outils/verifier_cartes.py` (format, identifiants uniques dans tout le dépôt, jumeaux .md) ; mode d'emploi `exports/anki/README.md` (installation AnkiDroid, 2 nouvelles cartes par jour, ordre « Position croissante », mises à jour).
5. **Texte intégral de Verne** (domaine public, Gutenberg 5095-5096 via GITenberg) déposé dans `ressources/textes/` pour vérifier les chapitres.
6. **Workflow de 21 agents** (0 échec) : 5 jeux de cartes (Méthode 28, Verne 32, Canguilhem 31, Haushofer 27, Croisements 18), chacun rédigé, vérifié par deux agents (faits, avec grep sur le texte de Verne ; qualité Anki), corrigé, puis contrôle de cohérence (17 doublons, contradictions et écarts de terminologie traités). Trace : `traces/2026-09-26_workflow-cartes.md`.
7. **Finitions** : échantillon P6 aligné sur les cartes (signaux de la tique, « récit », alpage, formulation excessive retirée), graphie Maelstrom, histoire éditoriale de Canguilhem ; relecture des 136 cartes par la session principale ; paquet construit et contrôlé (136 notes, identifiants uniques, alternance) ; PDF imprimables des cartes.

**Fichiers** : créés : `theme1_nature/{verne,canguilhem,haushofer,transversal}/10_cartes_*.{tsv,md}`, `methode/10_cartes_Methode_resume-dissertation.{tsv,md}`, `outils/verifier_cartes.py`, `exports/anki/README.md`, `exports/anki/francais-PT.apkg`, `exports/anki/echantillons/02_…apkg`, `exports/pdf/{theme1_nature,methode}/…`, `ressources/textes/*`, `traces/2026-09-26_*` ; modifiés : `DECISIONS.md`, `FEUILLE_DE_ROUTE.md`, `PROGRAMME.md`, `PROPOSITIONS.md`, `CLAUDE.md`, `README.md`, `outils/construire_anki.py`, `echantillons/06_…md` ; supprimés : `exports/anki/02_…apkg` et `francais-PT-tout.apkg` (remplacés).

**Décisions** : Anki tenu par Claude, un seul fichier à importer ; 2 nouvelles cartes par jour ; thème 1 + méthode d'abord, thème 2 au fil du cours ; marqueur [non vérifié] partout tant que l'étudiant n'a pas validé ; tags d'œuvre sur les cartes transversales ; graphie Maelstrom.

**Points à vérifier** :
- **Le dépôt est toujours public** (vérifié le 26/09) : à passer en privé avant tout dépôt de copie.
- Coefficient du Français B aux Arts et Métiers et rôle du Français A : Livret PT 2027.
- Libellés exacts des options d'AnkiDroid (selon la version) ; premier import réel à confirmer par l'étudiant.
- Canguilhem et Haushofer : toutes les références sont [non vérifié] (pas de texte intégral) ; les formules entre guillemets sont à vérifier dans l'édition.

**Suite prévue** : l'étudiant importe le paquet et dit si tout marche ; grille de correction (E1) avant sa première photo de résumé ; trois sujets de plans express sur le thème 1 ; cartes du thème 2 dès que le cours commence une œuvre (redemander Q1 et Q13 vers le 10 octobre).

**Commits** : `26e3273` (plan adapté, outils, Verne), puis le commit de ce paquet.

## 2026-09-24 : lancement, propositions et six échantillons

**Demande** (texte de l'étudiant) : « Je suis étudiant en 2ème année de classe préparatoire PT*. Je veux organiser mes révisions de français. Je veux générer un maximum de documents permettant d'assimiler de façon simple et efficace les différents points de cette année en français. Propose-moi tes idées sur ce que cette session Claude Code pourrait m'apporter. Organise ton travail en gardant un maximum de traces. » Puis, en cours de session : « Tu peux travailler directement sur le main. Je te fais confiance. »

**Fait** :
1. **Recherche du programme** (recherche web ; lecture directe du BO et de banquept.fr bloquée par le réseau de la session) : deux thèmes au concours 2027, « Expériences de la nature » (reconduit) et « Les arcanes de la création » (nouveau) ; œuvres, traductions et éditions prescrites ; épreuve Banque PT Français B (4 h, résumé sur 8 et dissertation sur 12, ± 10 %, pénalités de décompte) ; existence d'un Français A (dissertation seule de 4 h, à confirmer). → `PROGRAMME.md`.
2. **Cadre de travail** : `00_pilotage/`, `CLAUDE.md` (consignes pour les sessions futures), registre `DECISIONS.md`, outils d'export Anki et PDF.
3. **Workflow multi-agents** (34 agents, 0 échec) :
   - propositions : 5 angles d'idéation (96 idées brutes) → synthèse (52 idées) → 3 critiques adversariales (professeur, étudiant, complétude : 86 problèmes relevés, dont 8 bloquants) → révision : **55 idées** en 7 familles, Top 10, « ta semaine », budget-temps, 16 questions ; + `FEUILLE_DE_ROUTE.md` ;
   - 6 échantillons, chacun rédigé, vérifié par deux agents indépendants (faits ; pédagogie et format), puis corrigé. Les vérificateurs ont recoupé les faits sur des textes intégraux (grec de Platon, traduction anglaise de *L'Œuvre*, original de Woolf). Principales corrections : des chapitres de Zola, un biais de longueur dans le quiz (la bonne réponse était presque toujours la plus longue : 18 fois sur 20), des décomptes de mots erronés.
   - Trace complète : `traces/2026-09-24_workflow_propositions-echantillons.md` (+ JSON brut et script).
4. **Finitions par la session principale** (tâches laissées par les agents) :
   - `outils/compter_mots.py` créé. Testé sur la fiche méthode P3, il a **repéré 7 mots recopiés** du texte dans le résumé modèle : reformulation à nombre de mots égal (105 mots, repères inchangés).
   - `outils/construire_anki.py` : identifiants de cartes explicites (`#guid`) et nom de paquet (`#deck`) ; P2 reçoit les identifiants `pla-001` à `pla-059` ; paquets `.apkg` générés et vérifiés (59 notes).
   - PDF des cinq échantillons Markdown générés ; quiz P4 re-testé dans Chromium (375 px, clair et sombre, aucune erreur, aucune ressource externe).
   - `PROGRAMME.md` complété : éditions prescrites (Platon GF ; Woolf Folio classique n° 6764 ; Zola Folio ou GF), pénalités, ordres de grandeur, Français A, sources ; historique des modifications.
   - `DECISIONS.md` aligné sur les questions Q0 à Q15 ; `CLAUDE.md` passé en version 2 (statuts RELU (IA) et VALIDÉ, règles du jeu, arborescence) ; `README.md` page d'accueil ; cases cochées dans la feuille de route.
5. **Branche** : PR #1 (fusionnée par l'étudiant), puis travail directement sur `main`.

**Fichiers** : créés : `README.md` (réécrit), `CLAUDE.md`, `.gitignore`, `00_pilotage/{PROGRAMME,PROPOSITIONS,FEUILLE_DE_ROUTE,DECISIONS,JOURNAL}.md`, `00_pilotage/traces/*`, `echantillons/01…06`, `outils/{construire_anki.py,exporter_pdf.mjs,compter_mots.py,package.json,package-lock.json,requirements.txt}`, `exports/pdf/echantillons/*.pdf`, `exports/anki/*.apkg`.

**Décisions** : travail sur `main` (étudiant) ; principe « tu écris, Claude corrige » ; deux thèmes préparés toute l'année ; statuts jusqu'à VALIDÉ ; identifiants Anki explicites (Claude, à valider). Détail dans `DECISIONS.md`.

**Points à vérifier** :
- **Le dépôt est public** : à passer en privé (Q0) avant tout dépôt personnel.
- Périmètre de l'épreuve 2027 (un thème ou l'autre), Français A, dates des écrits, règle exacte de décompte : cahier des charges et Livret PT 2027.
- Références des échantillons (chapitres de Zola 9, 10 et 12 ; Stephanus ; formulations des traductions) : à confirmer dans les éditions de l'étudiant (voir la section « Points à vérifier » de chaque échantillon).
- Estimations de temps et dates de vacances : valeurs par défaut.

**Suite prévue** : réponses de l'étudiant aux 4 questions et avis sur les échantillons (Q9) → vague 1 de la feuille de route (kit de diagnostic du thème 1, sujets de plans express, grille de correction, méthode du résumé en une page, page d'accueil par lien).

**Commits** : `ff6021a` (pilotage et outils), `6c4506e` (décision : `main`), puis le commit de clôture de cette session.
