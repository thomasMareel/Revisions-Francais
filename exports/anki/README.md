# Ton paquet Anki « Français PT* »

> **Principe** : Claude rédige, vérifie et met à jour les cartes. Toi, tu importes **un seul fichier**, [`francais-PT.apkg`](francais-PT.apkg), puis tu révises environ 2 min par jour.
> Ce mode d'emploi est écrit pour **AnkiDroid** (Android). Les libellés peuvent varier légèrement selon ta version ; l'équivalent anglais est donné entre parenthèses.

## 1. Première installation (≈ 5 min, une seule fois)

1. **Installer AnkiDroid** (Play Store, gratuit).
2. **Télécharger le fichier** : ouvre [`francais-PT.apkg`](francais-PT.apkg) sur GitHub depuis ton téléphone, puis le bouton de téléchargement (*Download raw file*). Lien direct : `https://github.com/thomasMareel/Revisions-Francais/raw/main/exports/anki/francais-PT.apkg`. Si le dépôt est passé en privé, il faut être connecté à GitHub dans ton navigateur.
3. **Importer** : touche le fichier téléchargé et choisis « Ouvrir avec AnkiDroid », ou bien, dans AnkiDroid, menu **⋮ → Importer** (*Import*) puis choisis le fichier. Valide l'import en gardant les options par défaut.
4. **Régler le paquet** : appui long sur **Français PT*** → **Options** :
   - **Nouvelles cartes/jour** (*New cards/day*) : **2**. C'est ce qui tient ton budget d'environ 15 min par semaine. Tu pourras monter à 3 ou 4 si ça passe bien.
   - **Ordre de collecte des nouvelles cartes** (*New card gather order*) : **Position croissante** (*Ascending position*). Ainsi, méthode, Verne, Canguilhem et Haushofer arrivent à tour de rôle, l'essentiel d'abord, au lieu d'un paquet entier après l'autre.
   - Enregistre.

## 2. Chaque jour (≈ 2 min)

- Touche **Français PT*** (le paquet du haut, pas un sous-paquet) et fais les cartes du jour.
- Réponds honnêtement : **À revoir** (*Again*) si tu ne savais pas, **Correct** (*Good*) si tu savais, **Facile** (*Easy*) si c'était évident. Anki reprogramme tout seul.
- Avant un DS sur une œuvre, tu peux réviser un seul sous-paquet (ex. **Verne**).

## 3. Quand Claude met le paquet à jour

Claude te prévient dans le chat (et l'écrit dans le journal du dépôt). Tu **retélécharges `francais-PT.apkg` et tu l'importes à nouveau**, exactement comme la première fois :

- les **cartes déjà vues** gardent tout leur historique ;
- les **cartes corrigées** sont mises à jour, car chaque carte a un identifiant fixe (ex. `ver-012`) ;
- les **nouvelles cartes** s'ajoutent.

Ce comportement a été vérifié dans le code source d'Anki. Deux règles en découlent :

- **Ne modifie pas une carte sur ton téléphone** : ta modification serait écrasée au prochain import. Si une carte est fausse ou mal posée, copie sa question dans le chat : Claude la corrige pour tout le monde.
- **Cartes retirées** : quand Claude retire une carte, elle reçoit le tag `retiree`. Après l'import, dans AnkiDroid : **Parcourir** (*Browse*) → recherche `tag:retiree` → sélectionne tout → **Supprimer**.

## 4. Sauvegarde (conseillé)

Crée un compte gratuit sur AnkiWeb et utilise **Synchroniser** (*Sync*) dans AnkiDroid : ta progression est sauvegardée, même si tu changes de téléphone.

## 5. Ce que contient le paquet

<!-- tableau mis à jour par Claude à chaque construction du paquet -->
| Sous-paquet | Cartes | Contenu |
|---|---|---|
| *(rempli à la construction)* | | |

Les cartes Platon de l'échantillon P2 sont **à part** (`echantillons/`) : ne les importe pas pour l'instant. Elles rejoindront le paquet principal quand ton cours abordera Platon.

## 6. Si quelque chose cloche

- Message « certaines mises à jour ont été ignorées car le type de note a changé », doublons, carte illisible : dis-le à Claude dans le chat, avec une capture si possible.
- Les références entre crochets **[non vérifié]** signalent une localisation que Claude n'a pas pu contrôler sur le texte : fie-toi à ton édition et à ton cours.
