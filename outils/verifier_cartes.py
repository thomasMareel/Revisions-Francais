#!/usr/bin/env python3
"""Vérifie les fichiers de cartes Anki du dépôt (format .tsv + version lisible .md jumelle).

Contrôles :
- en-têtes obligatoires (#separator:tab, #html:true, #tags column:3, #guid column:4, #deck:...) ;
- exactement 4 colonnes par carte, aucun champ vide, identifiants uniques (dans le fichier ET dans tout le dépôt),
  identifiants au format préfixe-NNN (ex. ver-001) avec un seul préfixe par fichier ;
- longueur raisonnable : recto <= 30 mots, verso <= 70 mots (hors balises et référence <small>) ;
- fichier .md jumeau (même nom) présent, avec autant de blocs <details> que de cartes et chaque recto retrouvé.

Usage :
    python3 outils/verifier_cartes.py                  # tous les .tsv du dépôt
    python3 outils/verifier_cartes.py chemin/a.tsv     # fichiers précis
Code de sortie 1 s'il y a au moins une erreur (les avertissements ne bloquent pas).
"""

import html
import pathlib
import re
import sys

RACINE = pathlib.Path(__file__).resolve().parent.parent
ENTETES = ["#separator:tab", "#html:true", "#tags column:3", "#guid column:4"]
MAX_RECTO, MAX_VERSO = 30, 70


def texte_brut(s: str) -> str:
    s = re.sub(r"<small>.*?</small>", " ", s, flags=re.S)
    s = re.sub(r"<[^>]+>", " ", s)
    return re.sub(r"\s+", " ", html.unescape(s).replace(" ", " ")).strip()


def nb_mots(s: str) -> int:
    return len([m for m in re.split(r"[\s'’]+", texte_brut(s)) if any(c.isalnum() for c in m)])


def tous_les_tsv():
    return sorted(p for p in RACINE.rglob("*.tsv") if not {"node_modules", "exports"} & set(p.parts))


def verifier(chemin: pathlib.Path, guids_depot: dict):
    erreurs, avertissements = [], []
    lignes = chemin.read_text(encoding="utf-8").splitlines()
    entetes = [l for l in lignes if l.startswith("#")]
    for e in ENTETES:
        if e not in entetes:
            erreurs.append(f"en-tête manquant : {e}")
    if not any(l.startswith("#deck:") for l in entetes):
        erreurs.append("en-tête manquant : #deck:...")
    cartes, prefixes = [], set()
    for num, l in enumerate(lignes, start=1):
        if not l.strip() or l.startswith("#"):
            continue
        champs = l.split("\t")
        if len(champs) != 4 or not all(c.strip() for c in champs):
            erreurs.append(f"ligne {num} : {len(champs)} colonne(s) ou champ vide")
            continue
        recto, verso, tags, guid = champs
        m = re.fullmatch(r"([a-z]{2,4})-(\d{3})", guid.strip())
        if not m:
            erreurs.append(f"ligne {num} : identifiant mal formé {guid!r} (attendu ex. ver-001)")
        else:
            prefixes.add(m.group(1))
        if guid in guids_depot and guids_depot[guid] != (chemin, num):
            autre = guids_depot[guid]
            erreurs.append(f"ligne {num} : identifiant {guid} déjà utilisé ({autre[0].relative_to(RACINE)}:{autre[1]})")
        guids_depot.setdefault(guid, (chemin, num))
        if nb_mots(recto) > MAX_RECTO:
            avertissements.append(f"ligne {num} ({guid}) : recto long ({nb_mots(recto)} mots)")
        if nb_mots(verso) > MAX_VERSO:
            avertissements.append(f"ligne {num} ({guid}) : verso long ({nb_mots(verso)} mots)")
        cartes.append((recto, guid))
    if len(prefixes) > 1:
        avertissements.append(f"plusieurs préfixes d'identifiant dans le même fichier : {sorted(prefixes)}")
    jumeau = chemin.with_suffix(".md")
    if not jumeau.exists():
        erreurs.append(f"version lisible absente : {jumeau.name}")
    else:
        md = jumeau.read_text(encoding="utf-8")
        md_brut = texte_brut(md)
        n_details = len(re.findall(r"<details>", md))
        if n_details != len(cartes):
            erreurs.append(f"{jumeau.name} : {n_details} blocs <details> pour {len(cartes)} cartes")
        absents = [g for r, g in cartes if texte_brut(r) not in md_brut]
        if absents:
            erreurs.append(f"{jumeau.name} : recto introuvable pour {', '.join(absents[:8])}{'…' if len(absents) > 8 else ''}")
    return len(cartes), erreurs, avertissements


def main():
    fichiers = [pathlib.Path(a).resolve() for a in sys.argv[1:]] or tous_les_tsv()
    # Les identifiants de tout le dépôt sont chargés d'abord, pour détecter les collisions entre fichiers.
    guids_depot = {}
    for autre in tous_les_tsv():
        if autre not in fichiers:
            for num, l in enumerate(autre.read_text(encoding="utf-8").splitlines(), start=1):
                champs = l.split("\t")
                if not l.startswith("#") and len(champs) == 4:
                    guids_depot.setdefault(champs[3], (autre, num))
    total_erreurs = 0
    for f in fichiers:
        n, erreurs, avertissements = verifier(f, guids_depot)
        statut = "✓" if not erreurs else "✗"
        print(f"{statut} {f.relative_to(RACINE)} : {n} cartes, {len(erreurs)} erreur(s), {len(avertissements)} avertissement(s)")
        for e in erreurs:
            print(f"   ✗ {e}")
        for a in avertissements:
            print(f"   ⚠ {a}")
        total_erreurs += len(erreurs)
    sys.exit(1 if total_erreurs else 0)


if __name__ == "__main__":
    main()
