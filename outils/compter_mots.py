#!/usr/bin/env python3
"""Compteur de mots pour l'entraînement au résumé (Banque PT, Français B).

Il sert à FIABILISER ton comptage manuel, pas à le remplacer : le jour de l'épreuve,
il n'y a pas de compteur. Compte d'abord à la main, puis compare.

Règle par défaut (celle de la fiche méthode, echantillons/03_methode_resume-Banque-PT.md § 1.2) :
un mot est une unité typographique séparée des autres par un blanc ou par une apostrophe ;
la ponctuation ne compte pas. « l'œuvre » = 2 mots ; « un lieu à soi » = 4 mots.
Les cas litigieux sont réglables : trait d'union, « aujourd'hui ». Vérifie la règle exacte
dans les consignes de ton sujet.

Exemples :
    python3 outils/compter_mots.py resume.txt
    python3 outils/compter_mots.py resume.txt --cible 200 --declare 198
    python3 outils/compter_mots.py resume.txt --reperes 25          # texte avec une barre / tous les 25 mots
    python3 outils/compter_mots.py resume.txt --source texte.txt     # suites de 6 mots ou plus recopiées
    echo "Certes, l'inspiration semble venir d'ailleurs" | python3 outils/compter_mots.py -
"""

import argparse
import re
import sys
import unicodedata

APOSTROPHES = "'’"
TIRETS = "-‐‑"  # trait d'union ASCII et variantes typographiques
# Tournures de commentaire extérieur, interdites dans un résumé (erreur n° 3 de la fiche méthode).
ENONCIATION = [
    r"\bl['’]auteur\b", r"\ble texte\b", r"\bce texte\b", r"\bselon (lui|elle)\b",
    r"\bdans un (premier|second|dernier) temps\b", r"\bnous allons\b",
]


def mots(texte: str, trait_union_separe: bool = False, aujourdhui_un_mot: bool = False):
    """Découpe le texte en mots selon la convention choisie ; renvoie la liste des mots."""
    if aujourdhui_un_mot:
        texte = re.sub(r"\baujourd[" + APOSTROPHES + r"]hui\b", "aujourdhui", texte, flags=re.IGNORECASE)
    separateurs = r"\s" + re.escape(APOSTROPHES + (TIRETS if trait_union_separe else ""))
    jetons = re.split("[" + separateurs + "]+", texte)
    # Un « mot » doit contenir au moins une lettre ou un chiffre : « : », « — », « … » ne comptent pas.
    return [j for j in jetons if any(c.isalnum() for c in j)]


def normaliser(mot: str) -> str:
    sans_accents = unicodedata.normalize("NFD", mot.lower())
    return "".join(c for c in sans_accents if c.isalnum())


def suites_recopiees(resume, source, longueur=6):
    """Suites d'au moins `longueur` mots du résumé présentes telles quelles dans le texte source."""
    r = [normaliser(m) for m in resume]
    s = [normaliser(m) for m in source]
    empreintes = {tuple(s[i:i + longueur]) for i in range(len(s) - longueur + 1)}
    trouvees, i = [], 0
    while i <= len(r) - longueur:
        if tuple(r[i:i + longueur]) in empreintes:
            j = i + longueur
            while j < len(r) and tuple(r[j - longueur + 1:j + 1]) in empreintes:
                j += 1
            trouvees.append(" ".join(resume[i:j]))
            i = j
        else:
            i += 1
    return trouvees


def avec_reperes(texte, pas, **regle):
    """Réécrit le texte en insérant « /N/ » après chaque tranche de `pas` mots."""
    sortie, compte = [], 0
    for morceau in re.split(r"(\s+)", texte):
        sortie.append(morceau)
        if morceau.strip():
            avant = compte
            compte += len(mots(morceau, **regle))
            if compte // pas > avant // pas:
                sortie.append(f" /{(compte // pas) * pas}/")
    return "".join(sortie)


def lire(chemin):
    if chemin == "-":
        return sys.stdin.read()
    with open(chemin, encoding="utf-8") as f:
        return f.read()


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("fichier", help="texte du résumé (ou - pour l'entrée standard)")
    p.add_argument("--cible", type=int, help="nombre de mots imposé : affiche la fourchette de ± 10 %%")
    p.add_argument("--declare", type=int, help="ton propre décompte, à comparer")
    p.add_argument("--reperes", type=int, metavar="N", help="réaffiche le texte avec un repère tous les N mots")
    p.add_argument("--source", help="texte à résumer : signale les suites recopiées")
    p.add_argument("--longueur-copie", type=int, default=6, help="longueur minimale d'une suite recopiée (défaut 6)")
    p.add_argument("--trait-union-separe", action="store_true", help="« c'est-à-dire » = 4 mots au lieu de 2")
    p.add_argument("--aujourdhui-un-mot", action="store_true", help="« aujourd'hui » = 1 mot au lieu de 2")
    p.add_argument("--liste", action="store_true", help="affiche la liste numérotée des mots comptés")
    a = p.parse_args()

    regle = {"trait_union_separe": a.trait_union_separe, "aujourdhui_un_mot": a.aujourdhui_un_mot}
    texte = lire(a.fichier)
    liste = mots(texte, **regle)
    n = len(liste)
    print(f"Mots : {n}   (règle : blanc + apostrophe"
          f"{' + trait d’union' if a.trait_union_separe else ''}"
          f"{', aujourd’hui = 1' if a.aujourdhui_un_mot else ''} ; ponctuation non comptée)")

    litigieux = sorted({m for m in liste if any(t in m for t in TIRETS) or m.isdigit()})
    if litigieux:
        print(f"⚠ Mots litigieux (selon la consigne) : {', '.join(litigieux)}")

    code = 0
    if a.cible:
        bas, haut = round(a.cible * 0.9), round(a.cible * 1.1)
        dedans = bas <= n <= haut
        print(f"Fourchette pour {a.cible} mots : {bas} à {haut} → {'✓ dans la fourchette' if dedans else '✗ HORS fourchette'}")
        code |= 0 if dedans else 1
    if a.declare is not None:
        ecart = a.declare - n
        print(f"Ton décompte : {a.declare} → " + ("✓ exact" if ecart == 0 else
              f"✗ écart de {ecart:+d} : recompte TON ORIGINAL avant de conclure (la transcription peut aussi se tromper)"))
        code |= 0 if ecart == 0 else 2

    tournures = [m.group(0) for motif in ENONCIATION for m in re.finditer(motif, texte, flags=re.IGNORECASE)]
    if tournures:
        print(f"⚠ Commentaire extérieur probable (on résume à la place de l'auteur) : {', '.join(tournures)}")
    if a.source:
        copies = suites_recopiees(liste, mots(lire(a.source), **regle), a.longueur_copie)
        if copies:
            print(f"⚠ {len(copies)} suite(s) d'au moins {a.longueur_copie} mots reprise(s) du texte :")
            for c in copies:
                print(f"   « {c} »")
        else:
            print(f"✓ Aucune suite de {a.longueur_copie} mots reprise du texte.")
    if a.reperes:
        print("\n" + avec_reperes(texte.strip(), a.reperes, **regle))
    if a.liste:
        print("\n" + "  ".join(f"{i}:{m}" for i, m in enumerate(liste, start=1)))
    sys.exit(code)


if __name__ == "__main__":
    main()
