#!/usr/bin/env python3
"""Construit des paquets Anki (.apkg) à partir des fichiers TSV de flashcards du dépôt.

Format attendu d'un fichier TSV (importable tel quel dans Anki, ou transformé ici en .apkg) :

    #separator:tab
    #html:true
    #tags column:3
    Recto<TAB>Verso<TAB>tags séparés par des espaces

Usage :
    python3 outils/construire_anki.py                 # tous les *.tsv du dépôt
    python3 outils/construire_anki.py chemin/a.tsv    # un ou plusieurs fichiers précis

Sorties : exports/anki/<nom>.apkg (un paquet par fichier) + exports/anki/francais-PT-tout.apkg.
Les identifiants de notes sont stables (dérivés du recto) : réimporter un paquet mis à jour
dans Anki met à jour les cartes existantes au lieu de créer des doublons, et conserve
l'historique de révision.

Dépendance : pip install genanki
"""

import argparse
import hashlib
import pathlib
import sys

try:
    import genanki
except ImportError:
    sys.exit("genanki manquant : lance d'abord  pip install genanki")

RACINE = pathlib.Path(__file__).resolve().parent.parent
SORTIE = RACINE / "exports" / "anki"
DECK_RACINE = "Français PT*"

CSS = """
.card { font-family: Charter, Georgia, serif; font-size: 20px; line-height: 1.45;
        text-align: left; color: #1d1d1f; background: #fbfaf7; padding: 12px; }
.recto { font-weight: 600; }
.verso { margin-top: 10px; }
.tags  { margin-top: 14px; font-size: 13px; color: #6b6b6b; font-family: sans-serif; }
hr#answer { border: 0; border-top: 1px solid #d0cec8; margin: 14px 0; }
.nightMode .card, .card.nightMode { color: #ecebe8; background: #1f1f22; }
.nightMode .tags { color: #a5a5a5; }
"""


def ident_stable(texte: str) -> int:
    """Entier stable sur 31 bits dérivé d'un texte (ids de modèle et de paquet)."""
    return int(hashlib.sha1(texte.encode("utf-8")).hexdigest()[:8], 16) & 0x7FFFFFFF


MODELE = genanki.Model(
    ident_stable("revisions-francais/modele-recto-verso/v1"),
    "Révisions français — recto/verso",
    fields=[{"name": "Recto"}, {"name": "Verso"}],
    templates=[{
        "name": "Carte 1",
        "qfmt": '<div class="recto">{{Recto}}</div>',
        "afmt": '<div class="recto">{{Recto}}</div><hr id="answer"><div class="verso">{{Verso}}</div>'
                '<div class="tags">{{Tags}}</div>',
    }],
    css=CSS,
)


def lire_tsv(chemin: pathlib.Path):
    """Renvoie la liste (recto, verso, tags) d'un fichier TSV ; signale les lignes mal formées."""
    cartes, erreurs = [], []
    for num, ligne in enumerate(chemin.read_text(encoding="utf-8").splitlines(), start=1):
        if not ligne.strip() or ligne.startswith("#"):
            continue
        champs = ligne.split("\t")
        if len(champs) not in (2, 3) or not champs[0].strip() or not champs[1].strip():
            erreurs.append(f"{chemin.name}:{num} : {len(champs)} colonne(s) ou champ vide")
            continue
        tags = champs[2].split() if len(champs) == 3 else []
        cartes.append((champs[0].strip(), champs[1].strip(), tags))
    return cartes, erreurs


def nom_paquet(chemin: pathlib.Path) -> str:
    return f"{DECK_RACINE}::{chemin.stem.replace('_', ' ')}"


def construire(fichiers):
    SORTIE.mkdir(parents=True, exist_ok=True)
    tous_les_paquets, total, toutes_erreurs = [], 0, []
    for chemin in fichiers:
        cartes, erreurs = lire_tsv(chemin)
        toutes_erreurs += erreurs
        nom = nom_paquet(chemin)
        paquet = genanki.Deck(ident_stable(nom), nom)
        for recto, verso, tags in cartes:
            paquet.add_note(genanki.Note(
                model=MODELE, fields=[recto, verso], tags=tags,
                guid=genanki.guid_for(nom, recto),
            ))
        cible = SORTIE / f"{chemin.stem}.apkg"
        genanki.Package(paquet).write_to_file(str(cible))
        print(f"✓ {cible.relative_to(RACINE)} : {len(cartes)} cartes")
        tous_les_paquets.append(paquet)
        total += len(cartes)
    if tous_les_paquets:
        cible = SORTIE / "francais-PT-tout.apkg"
        genanki.Package(tous_les_paquets).write_to_file(str(cible))
        print(f"✓ {cible.relative_to(RACINE)} : {total} cartes au total")
    for e in toutes_erreurs:
        print(f"⚠ ligne ignorée — {e}")
    return 1 if toutes_erreurs else 0


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("fichiers", nargs="*", type=pathlib.Path)
    args = parser.parse_args()
    fichiers = args.fichiers or sorted(
        p for p in RACINE.rglob("*.tsv") if "node_modules" not in p.parts and "exports" not in p.parts
    )
    if not fichiers:
        sys.exit("Aucun fichier .tsv trouvé.")
    sys.exit(construire([p.resolve() for p in fichiers]))


if __name__ == "__main__":
    main()
