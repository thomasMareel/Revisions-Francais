# Consignes pour Claude : dépôt de révisions de français-philosophie (PT*, concours 2027)

Ce dépôt appartient à un étudiant de PT* qui prépare l'épreuve de français-philosophie (Banque PT, « Français B » : résumé + dissertation). Chaque session Claude doit **reprendre le travail là où il s'est arrêté** et **laisser des traces**.

## En début de session : lire dans cet ordre
1. `00_pilotage/PROGRAMME.md` : thèmes, œuvres, traductions, format de l'épreuve. C'est la **source de vérité** : ne jamais le contredire sans le corriger (avec une entrée au journal).
2. `00_pilotage/DECISIONS.md` : choix déjà faits par l'étudiant et questions encore ouvertes.
3. `00_pilotage/FEUILLE_DE_ROUTE.md` : ce qui est fait (cases cochées) et ce qui reste.
4. Les 2 ou 3 dernières entrées de `00_pilotage/JOURNAL.md`.

## En fin de session : obligatoire
- Ajouter une entrée **en haut** de `00_pilotage/JOURNAL.md` (modèle dans le fichier) : demande, ce qui a été fait, fichiers créés ou modifiés, décisions, points à vérifier, suite prévue.
- Cocher les cases concernées dans `FEUILLE_DE_ROUTE.md` ; reporter toute nouvelle décision dans `DECISIONS.md`.
- Régénérer les exports concernés (voir « Outils »), puis faire un commit au message explicite, en français, et un push.

## Langue et ton
- Tout en **français**, tutoiement, niveau prépa : clair, dense, sans remplissage.
- Noms de fichiers en ASCII, sans accents ni espaces : `NN_type_Auteur_Titre.ext` (ex. `01_fiche-oeuvre_Zola_L-Oeuvre.md`).

## Exactitude : règles non négociables
- **Aucune citation inventée.** On paraphrase et on localise avec des références stables : Stephanus pour Platon (*Rép.* 597b), partie et chapitre pour Verne, chapitre pour Zola et Woolf, section pour Canguilhem, moment du récit pour Haushofer (pas de chapitres).
- Une citation littérale n'est admise que très courte et marquée **« [à vérifier dans ton édition] »**, tant que l'étudiant ne l'a pas confirmée dans la traduction au programme (Canto-Sperber / Leroux pour Platon, Darrieussecq pour Woolf, Bodo et Chambon pour Haushofer).
- En cas de doute sur un détail (chapitre, nom, chronologie) : donner une fourchette ou écrire « [réf. à vérifier] ». Jamais de précision inventée.
- **Droits d'auteur** : ne pas reproduire de larges extraits des traductions au programme, ni de Canguilhem, Haushofer ou Woolf (traduction de 2016). Pour les textes d'entraînement au résumé : textes originaux rédigés par Claude, textes du domaine public, ou textes fournis par l'étudiant.
- Tout document de contenu passe par une **relecture de vérification factuelle** (idéalement un agent vérificateur indépendant) avant le commit.

## Format des documents
- En tête, un encadré `>` qui donne : type de document, thème, œuvre(s), **statut**, date, mode d'emploi en 2 lignes.
- Statuts possibles : `ÉCHANTILLON` (prototype à valider) → `BROUILLON` → `VÉRIFIÉ` (contrôle factuel fait) → `VALIDÉ` (l'étudiant a confirmé les références dans son édition).
- En fin de document, une section **« Points à vérifier »**, même courte.
- Pour l'auto-interrogation sur téléphone, les réponses vont dans des blocs `<details><summary>Question</summary>Réponse</details>`.
- Flashcards : fichier `.tsv` importable dans Anki, avec les en-têtes `#separator:tab`, `#html:true`, `#tags column:3`, puis `Recto<TAB>Verso<TAB>tags`, et une version `.md` lisible avec les **mêmes cartes**.
- Quiz HTML : un seul fichier, autonome (aucune ressource externe), thème clair et sombre, lisible à 375 px, questions séparées du moteur (moteur réutilisable).

## Arborescence
```
00_pilotage/      PROGRAMME, PROPOSITIONS, FEUILLE_DE_ROUTE, DECISIONS, JOURNAL
echantillons/     prototypes de formats, à valider par l'étudiant
theme1_nature/    (à créer au besoin) canguilhem/ verne/ haushofer/ transversal/
theme2_creation/  (à créer au besoin) platon/ zola/ woolf/ transversal/
methode/          résumé, dissertation, langue
entrainement/     sujets, textes à résumer, corrigés
copies/           copies de l'étudiant + corrections + suivi.md
ressources/       rapports de jury, notes de cours déposées par l'étudiant
outils/           scripts d'export
exports/          PDF et paquets Anki générés (à commiter : l'étudiant les télécharge depuis GitHub)
```

## Outils
- Paquets Anki : `pip install -r outils/requirements.txt` puis `python3 outils/construire_anki.py` → `exports/anki/*.apkg`. Les identifiants de notes sont stables : les réimportations mettent les cartes à jour sans doublons.
- PDF : `cd outils && npm install` (une fois par session) puis, depuis la racine, `node outils/exporter_pdf.mjs [fichiers.md]` → `exports/pdf/...`. Les blocs `<details>` sont dépliés et les diagrammes Mermaid sont rendus.
- Réseau : dans ces sessions cloud, la recherche web fonctionne mais la lecture directe de la plupart des sites (BO, banquept.fr…) est bloquée. Tout fait non vérifiable reste marqué « à vérifier ».
