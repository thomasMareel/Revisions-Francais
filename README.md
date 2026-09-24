# Révisions de français-philosophie : PT*, concours 2027

Dépôt de travail pour préparer l'épreuve de français-philosophie de la **Banque PT** (Français B : résumé + dissertation) avec Claude Code. Les deux thèmes au programme sont **« Expériences de la nature »** (Canguilhem, Verne, Haushofer) et **« Les arcanes de la création »** (Platon, Zola, Woolf).

> **Principe** : tu écris, Claude interroge, corrige et garde les traces. Tout ce qui est produit, décidé ou corrigé est enregistré ici (fichiers de pilotage et historique Git).

## Par où commencer (15 min)

1. **Étape 0 : rendre le dépôt privé.** Il est public aujourd'hui. Sur github.com : *Settings → General → Danger Zone → Change repository visibility → Make private*. Tant que ce n'est pas fait, on n'y dépose ni copie ni note de cours.
2. **Lire le haut de [`00_pilotage/PROPOSITIONS.md`](00_pilotage/PROPOSITIONS.md)** (10 min) : « En bref », « Cette semaine », le Top 10, les 4 questions. Le catalogue complet (55 idées) est replié en dessous.
3. **Répondre aux 4 questions** dans le chat, une ligne chacune, puis ouvrir les échantillons ci-dessous et dire ce que tu gardes.

## Les échantillons (formats à juger sur pièce)

| Réf. | Document | Lire | Imprimer / utiliser |
|------|----------|------|---------------------|
| P1 | Fiche œuvre : Zola, *L'Œuvre* | [Markdown](echantillons/01_fiche-oeuvre_Zola_L-Oeuvre.md) | [PDF](exports/pdf/echantillons/01_fiche-oeuvre_Zola_L-Oeuvre.pdf) |
| P2 | 59 flashcards : Platon, *Ion* et *République* X | [Markdown](echantillons/02_flashcards_Platon_Ion-Republique-X.md) | [Paquet Anki `.apkg`](exports/anki/02_flashcards_Platon_Ion-Republique-X.apkg) · [PDF](exports/pdf/echantillons/02_flashcards_Platon_Ion-Republique-X.pdf) · [`.tsv`](echantillons/02_flashcards_Platon_Ion-Republique-X.tsv) |
| P3 | Méthode du résumé (Banque PT) + exercice corrigé | [Markdown](echantillons/03_methode_resume-Banque-PT.md) | [PDF](exports/pdf/echantillons/03_methode_resume-Banque-PT.pdf) |
| P4 | Quiz interactif : Woolf, *Un lieu à soi* (23 questions) | [fichier HTML](echantillons/04_quiz_Woolf_Un-lieu-a-soi.html) : à télécharger puis ouvrir dans un navigateur (GitHub n'en montre que le code) | hors ligne, sur téléphone |
| P5 | Carte des croisements : « Les arcanes de la création » | [Markdown](echantillons/05_carte-croisements_Arcanes-de-la-creation.md) | [PDF](exports/pdf/echantillons/05_carte-croisements_Arcanes-de-la-creation.pdf) |
| P6 | Plan détaillé de dissertation : « Expériences de la nature » | [Markdown](echantillons/06_dissertation-plan-detaille_Experiences-de-la-nature.md) | [PDF](exports/pdf/echantillons/06_dissertation-plan-detaille_Experiences-de-la-nature.pdf) |

Tous sont au statut **ÉCHANTILLON** : relus par des agents vérificateurs, mais les références (chapitres, Stephanus, citations) restent à confirmer dans **ton** édition. Chaque document finit par une section « Points à vérifier ».

## Le pilotage (les traces)

| Fichier | Rôle |
|---------|------|
| [`00_pilotage/PROGRAMME.md`](00_pilotage/PROGRAMME.md) | Programme officiel, éditions prescrites, format de l'épreuve, sources : **la référence** |
| [`00_pilotage/PROPOSITIONS.md`](00_pilotage/PROPOSITIONS.md) | Ce que Claude Code peut t'apporter : 55 idées, Top 10, ta semaine, questions |
| [`00_pilotage/FEUILLE_DE_ROUTE.md`](00_pilotage/FEUILLE_DE_ROUTE.md) | Production en vagues (cases à cocher), calendrier jusqu'aux écrits, semaine type |
| [`00_pilotage/DECISIONS.md`](00_pilotage/DECISIONS.md) | Questions ouvertes (Q0 à Q15) et décisions prises, avec qui et pourquoi |
| [`00_pilotage/JOURNAL.md`](00_pilotage/JOURNAL.md) | Journal de bord : une entrée par session |
| [`00_pilotage/traces/`](00_pilotage/traces/) | Comptes rendus détaillés des workflows multi-agents (critiques, vérifications, rejets motivés) |
| [`CLAUDE.md`](CLAUDE.md) | Consignes lues par chaque session Claude : conventions, exactitude, formats |

## Travailler avec Claude

Ouvre une session Claude Code sur ce dépôt (web ou appli), puis par exemple :

- « **ma semaine** » : Claude fait le point et te donne 3 ou 4 tâches pour la semaine ;
- « **interroge-moi** sur *L'Œuvre*, ch. 1 à 6, une question à la fois » ;
- « **voici mon plan** (photo) sur tel sujet, corrige-le » ; « **corrige mon résumé** » (photo + ton décompte) ;
- « **fais-moi une colle** sur *République* X, sois exigeant ».

## Outils

```bash
pip install -r outils/requirements.txt && python3 outils/construire_anki.py   # paquets Anki -> exports/anki/
cd outils && npm install && cd .. && node outils/exporter_pdf.mjs            # PDF -> exports/pdf/
python3 outils/compter_mots.py resume.txt --cible 200 --declare 198 --source texte.txt   # compteur de mots
```
