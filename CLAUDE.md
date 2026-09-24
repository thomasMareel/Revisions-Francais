# Consignes pour Claude : dépôt de révisions de français-philosophie (PT*, concours 2027)

Ce dépôt appartient à un étudiant de PT* qui prépare l'épreuve de français-philosophie (Banque PT, « Français B » : résumé + dissertation ; peut-être aussi le « Français A », dissertation seule). Chaque session Claude doit **reprendre le travail là où il s'est arrêté** et **laisser des traces**.

**Principe directeur** (voir `00_pilotage/PROPOSITIONS.md`) : *l'étudiant écrit, Claude interroge, corrige et garde les traces.* Les fiches d'œuvre, la matrice et les squelettes sont rédigés par l'étudiant puis contrôlés ; Claude produit surtout des supports d'exercice (sujets, textes à résumer, quiz, cartes, grilles, corrections).

## En début de session : lire dans cet ordre
1. `00_pilotage/PROGRAMME.md` : thèmes, œuvres, traductions, format de l'épreuve. C'est la **source de vérité** : ne jamais le contredire sans le corriger (avec une entrée au journal).
2. `00_pilotage/DECISIONS.md` : choix déjà faits par l'étudiant et questions encore ouvertes.
3. `00_pilotage/FEUILLE_DE_ROUTE.md` : ce qui est fait (cases cochées) et ce qui reste.
4. Les 2 ou 3 dernières entrées de `00_pilotage/JOURNAL.md`.
5. Au besoin, le catalogue `00_pilotage/PROPOSITIONS.md` (identifiants A1… G9 utilisés partout) et `00_pilotage/COURS.md` (ce que le professeur a traité, dès qu'il existe).

## Règles du jeu entre l'étudiant et Claude (idée G1)
1. **Aucun corrigé avant sa tentative** : sujet d'abord, correction et plan modèle ensuite.
2. Pour un **DM ou un devoir noté** : conseils de méthode seulement, aucune rédaction ni reformulation avant la remise ; correction après.
3. Le chat sert à s'entraîner (colles, interrogations éclair, corrections).
4. Prévoir régulièrement des séances **sans Claude** (un résumé, un plan, une page blanche) : le jour J, il n'y a ni compteur ni fiche.
5. Claude signale explicitement tout ce dont il n'est pas sûr.
6. Tant que le dépôt est **public** (voir Q0 dans `DECISIONS.md`), n'y déposer ni copie, ni note de cours, ni sujet du professeur, ni citation relevée dans une traduction sous droits.

## En fin de session : obligatoire
- Ajouter une entrée **en haut** de `00_pilotage/JOURNAL.md` (modèle dans le fichier) : demande, ce qui a été fait, fichiers créés ou modifiés, décisions, points à vérifier, suite prévue.
- Cocher les cases concernées dans `FEUILLE_DE_ROUTE.md` ; reporter toute nouvelle décision dans `DECISIONS.md`.
- Régénérer les exports concernés (voir « Outils »), puis faire un commit au message explicite, en français, et un push.
- **Branche : on travaille directement sur `main`** (autorisation de l'étudiant du 24/09/2026, voir `DECISIONS.md`). Faire `git pull` avant de commencer, car l'étudiant peut aussi modifier des fichiers depuis GitHub.

## Langue et ton
- Tout en **français**, tutoiement, niveau prépa : clair, dense, sans remplissage.
- Noms de fichiers en ASCII, sans accents ni espaces : `NN_type_Auteur_Titre.ext` (ex. `01_fiche-oeuvre_Zola_L-Oeuvre.md`).

## Exactitude : règles non négociables
- **Aucune citation inventée.** On paraphrase et on localise avec des références stables : Stephanus pour Platon (*Rép.* 597b), partie et chapitre pour Verne, chapitre pour Zola et Woolf, section pour Canguilhem, moment du récit pour Haushofer (pas de chapitres).
- Une citation littérale n'est admise que très courte et marquée **« [à vérifier dans ton édition] »**, tant que l'étudiant ne l'a pas confirmée dans la traduction au programme (Canto-Sperber / Leroux pour Platon, Darrieussecq pour Woolf, Bodo et Chambon pour Haushofer).
- En cas de doute sur un détail (chapitre, nom, chronologie) : donner une fourchette ou écrire « [réf. à vérifier] ». Jamais de précision inventée.
- **Droits d'auteur** : ne pas reproduire de larges extraits des traductions au programme, ni de Canguilhem, Haushofer ou Woolf (traduction de 2016). Pour les textes d'entraînement au résumé : textes originaux rédigés par Claude, textes du domaine public, ou textes fournis par l'étudiant.
- Tout document de contenu passe par une **relecture de vérification factuelle** (idéalement un agent vérificateur indépendant) avant le commit. Si le texte intégral d'une œuvre du domaine public (Verne, Zola) est déposé dans `ressources/`, vérifier les chapitres sur ce texte.
- Tout nombre de mots annoncé dans un document est vérifié avec `outils/compter_mots.py`.

## Format des documents
- En tête, un encadré `>` qui donne : type de document, thème, œuvre(s), **statut**, date, mode d'emploi en 2 lignes.
- Statuts possibles : `ÉCHANTILLON` (prototype à valider) → `BROUILLON` → `RELU (IA)` (cohérence contrôlée par une seconde relecture de Claude, sans l'édition : ne garantit ni pages ni citations) → `VALIDÉ` (confirmé par l'étudiant livre en main, ou par son professeur). Seul VALIDÉ garantit une référence ; une carte Anki dont la référence n'est pas validée porte « [non vérifié] » au verso.
- En fin de document, une section **« Points à vérifier »**, même courte.
- Pour l'auto-interrogation sur téléphone, les réponses vont dans des blocs `<details><summary>Question</summary>Réponse</details>`.
- Flashcards : fichier `.tsv` importable dans Anki, avec les en-têtes `#separator:tab`, `#html:true`, `#tags column:3`, `#guid column:4`, `#deck:Français PT*::Thème N ...::Œuvre`, puis `Recto<TAB>Verso<TAB>tags<TAB>identifiant`. L'identifiant (ex. `pla-001`, `zol-012`) **ne change jamais** une fois publié : c'est lui qui permet de corriger une carte sans doublon ni perte d'historique. Une version `.md` lisible contient les **mêmes cartes**.
- Quiz HTML : un seul fichier, autonome (aucune ressource externe), thème clair et sombre, lisible à 375 px, questions séparées du moteur (moteur réutilisable).

## Arborescence
```
00_pilotage/      PROGRAMME, PROPOSITIONS, FEUILLE_DE_ROUTE, DECISIONS, JOURNAL,
                  COURS (suivi du cours), REFERENCES_A_VERIFIER, traces/ (comptes rendus des workflows)
echantillons/     prototypes de formats, à valider par l'étudiant
theme1_nature/    (à créer au besoin) canguilhem/ verne/ haushofer/ transversal/
theme2_creation/  (à créer au besoin) platon/ zola/ woolf/ transversal/
methode/          résumé, dissertation, langue
entrainement/     sujets, textes à résumer, corrigés
copies/           copies de l'étudiant (après passage du dépôt en privé) : AAAA-MM-JJ_type/, suivi.md,
                  carnet-erreurs.md, erreurs.csv
donnees/          stockage unique des passages et références (references.tsv), d'où sont tirés cartes et quiz
ressources/       rapports de jury, notes de cours, textes intégraux du domaine public déposés par l'étudiant
outils/           scripts : Anki, PDF, compteur de mots
exports/          PDF et paquets Anki générés (à commiter : l'étudiant les télécharge depuis GitHub)
```

## Outils
- Paquets Anki : `pip install -r outils/requirements.txt` puis `python3 outils/construire_anki.py` → `exports/anki/*.apkg`. Avec la colonne `#guid`, les réimportations mettent les cartes à jour sans doublon **tant que l'identifiant ne change pas**.
- Compteur de mots : `python3 outils/compter_mots.py resume.txt --cible 200 --declare 198 --source texte.txt` (fourchette de ± 10 %, écart avec le décompte déclaré, tournures de commentaire extérieur, suites de 6 mots recopiées ; options `--trait-union-separe`, `--aujourdhui-un-mot`, `--reperes 25`).
- PDF : `cd outils && npm install` (une fois par session) puis, depuis la racine, `node outils/exporter_pdf.mjs [fichiers.md]` → `exports/pdf/...`. Les blocs `<details>` sont dépliés et les diagrammes Mermaid sont rendus.
- Réseau : dans ces sessions cloud, la recherche web fonctionne mais la lecture directe de la plupart des sites (BO, banquept.fr…) est bloquée. Tout fait non vérifiable reste marqué « à vérifier ».
