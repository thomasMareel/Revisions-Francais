#!/usr/bin/env python3
"""Construit le paquet Anki de l'étudiant à partir des fichiers TSV de cartes du dépôt.

Sorties :
    exports/anki/francais-PT.apkg          LE fichier à importer dans AnkiDroid (toutes les cartes
                                            hors échantillons), à réimporter après chaque mise à jour
    exports/anki/echantillons/<nom>.apkg    un paquet d'essai par fichier de echantillons/

Format d'un fichier TSV (importable tel quel dans Anki 2.1.55+, ou transformé ici en .apkg) :

    #separator:tab
    #html:true
    #tags column:3
    #guid column:4
    #deck:Français PT*::Thème 1 Nature::Verne
    Recto<TAB>Verso<TAB>tags séparés par des espaces<TAB>identifiant (ex. ver-001)

Identifiants : l'identifiant du fichier devient celui de la note, comme lors d'un import direct
du .tsv dans Anki. Réimporter le paquet met donc à jour les cartes existantes (même si la question
est corrigée ou le fichier renommé) sans doublon et sans perdre l'historique de révision, TANT QUE
L'IDENTIFIANT NE CHANGE PAS. Sans colonne #guid, l'identifiant est dérivé du paquet et du recto.

Ordre des nouvelles cartes : dans le paquet principal, les cartes des différents fichiers sont
alternées (une carte de chaque fichier à tour de rôle, dans l'ordre des fichiers), en respectant
l'ordre d'apprentissage de chaque fichier ; les jeux « Croisements » ne commencent qu'après les
premières cartes des œuvres. Dans AnkiDroid, régler « Ordre de collecte des nouvelles cartes » sur
« Position croissante » pour suivre cet ordre (voir exports/anki/README.md).

Retirer une carte déjà importée : ne pas effacer sa ligne ; lui ajouter le tag `retiree`. La carte
est alors suspendue dans les nouveaux imports et l'étudiant la supprime chez lui en cherchant
« tag:retiree ». Un identifiant n'est jamais réutilisé.

Usage :
    python3 outils/construire_anki.py            # construit tout
Dépendance : pip install genanki
"""

import hashlib
import pathlib
import sys

try:
    import genanki
except ImportError:
    sys.exit("genanki manquant : lance d'abord  pip install -r outils/requirements.txt")

RACINE = pathlib.Path(__file__).resolve().parent.parent
SORTIE = RACINE / "exports" / "anki"
DECK_RACINE = "Français PT*"
PAQUET_PRINCIPAL = "francais-PT.apkg"
# Décalage (en « tours » d'alternance) avant l'arrivée des cartes transversales.
DECALAGE_CROISEMENTS = 8

CSS = """
.card { font-family: Charter, Georgia, serif; font-size: 20px; line-height: 1.45;
        text-align: left; color: #1d1d1f; background: #fbfaf7; padding: 12px; }
.recto { font-weight: 600; }
.verso { margin-top: 10px; }
.verso small { color: #6b6b6b; font-size: 14px; }
.tags  { margin-top: 14px; font-size: 13px; color: #6b6b6b; font-family: sans-serif; }
hr#answer { border: 0; border-top: 1px solid #d0cec8; margin: 14px 0; }
.nightMode .card, .card.nightMode { color: #ecebe8; background: #1f1f22; }
.nightMode .tags, .nightMode .verso small { color: #a5a5a5; }
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
    """Lit un fichier TSV de cartes.

    Renvoie (en-têtes, cartes, erreurs) ; chaque carte est un tuple (recto, verso, tags, guid ou None).
    """
    entetes = {"tags": None, "guid": None, "deck": None}
    cartes, erreurs, guids_vus = [], [], set()
    for num, ligne in enumerate(chemin.read_text(encoding="utf-8").splitlines(), start=1):
        if not ligne.strip():
            continue
        if ligne.startswith("#"):
            cle, _, valeur = ligne[1:].partition(":")
            cle, valeur = cle.strip().lower(), valeur.strip()
            if cle in ("tags column", "guid column") and valeur.isdigit():
                entetes[cle.split()[0]] = int(valeur) - 1
            elif cle == "deck" and valeur:
                entetes["deck"] = valeur
            continue
        champs = ligne.split("\t")
        attendu = max(2, *(i + 1 for i in (entetes["tags"], entetes["guid"]) if i is not None))
        if len(champs) != attendu or not champs[0].strip() or not champs[1].strip():
            erreurs.append(f"{chemin.name}:{num} : {len(champs)} colonne(s) au lieu de {attendu}, ou champ vide")
            continue
        tags = champs[entetes["tags"]].split() if entetes["tags"] is not None else []
        guid = champs[entetes["guid"]].strip() if entetes["guid"] is not None else None
        if entetes["guid"] is not None:
            if not guid or guid in guids_vus:
                erreurs.append(f"{chemin.name}:{num} : identifiant vide ou en double ({guid!r})")
                continue
            guids_vus.add(guid)
        cartes.append((champs[0].strip(), champs[1].strip(), tags, guid))
    return entetes, cartes, erreurs


def nom_paquet(chemin: pathlib.Path, entetes) -> str:
    return entetes["deck"] or f"{DECK_RACINE}::{chemin.stem.replace('_', ' ')}"


def fichiers_tsv():
    tous = sorted(p for p in RACINE.rglob("*.tsv") if not {"node_modules", "exports"} & set(p.parts))
    echantillons = [p for p in tous if "echantillons" in p.parts]
    principaux = [p for p in tous if p not in echantillons]
    # Ordre d'alternance : la méthode d'abord, puis les œuvres, les croisements en dernier.
    principaux.sort(key=lambda p: ("methode" not in p.parts, "transversal" in p.parts, str(p)))
    return principaux, echantillons


def construire_paquet(fichiers, cible: pathlib.Path, alterner: bool):
    """Écrit un .apkg ; renvoie (nombre de notes, erreurs, détail par sous-paquet)."""
    decks, erreurs, guids, detail = {}, [], {}, {}
    file_attente = []  # (clé d'ordre, deck, note)
    for rang_fichier, chemin in enumerate(fichiers):
        entetes, cartes, err = lire_tsv(chemin)
        erreurs += err
        nom = nom_paquet(chemin, entetes)
        decks.setdefault(nom, genanki.Deck(ident_stable(nom), nom))
        decalage = DECALAGE_CROISEMENTS if alterner and "transversal" in chemin.parts else 0
        for rang, (recto, verso, tags, guid) in enumerate(cartes):
            guid = guid or genanki.guid_for(nom, recto)
            if guid in guids:
                erreurs.append(f"{chemin.name} : identifiant {guid} déjà utilisé dans {guids[guid]}")
                continue
            guids[guid] = chemin.name
            retiree = "retiree" in tags
            cle = (rang + decalage, rang_fichier) if alterner else (rang_fichier, rang)
            file_attente.append((cle, nom, recto, verso, tags, guid, retiree))
            detail[nom] = detail.get(nom, 0) + (0 if retiree else 1)
    for position, (_, nom, recto, verso, tags, guid, retiree) in enumerate(sorted(file_attente), start=1):
        note = genanki.Note(model=MODELE, fields=[recto, verso], tags=tags, guid=guid, due=position)
        if retiree:
            for carte in note.cards:
                carte.suspend = True
        decks[nom].add_note(note)
    cible.parent.mkdir(parents=True, exist_ok=True)
    genanki.Package(list(decks.values())).write_to_file(str(cible))
    return len(file_attente), erreurs, detail


def main():
    principaux, echantillons = fichiers_tsv()
    toutes_erreurs = []
    if principaux:
        cible = SORTIE / PAQUET_PRINCIPAL
        n, err, detail = construire_paquet(principaux, cible, alterner=True)
        toutes_erreurs += err
        print(f"✓ {cible.relative_to(RACINE)} : {n} cartes")
        for nom, k in sorted(detail.items()):
            print(f"    {nom} : {k}")
    for chemin in echantillons:
        cible = SORTIE / "echantillons" / f"{chemin.stem}.apkg"
        n, err, _ = construire_paquet([chemin], cible, alterner=False)
        toutes_erreurs += err
        print(f"✓ {cible.relative_to(RACINE)} : {n} cartes (échantillon, à part)")
    for e in toutes_erreurs:
        print(f"⚠ ignoré — {e}")
    sys.exit(1 if toutes_erreurs else 0)


if __name__ == "__main__":
    main()
