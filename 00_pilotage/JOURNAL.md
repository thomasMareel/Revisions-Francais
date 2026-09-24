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
