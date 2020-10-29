# Contribuer au projet Augora

:+1::tada: Avant toutes choses, merci de prendre le temps de contribuer ! :tada::+1:

Ce document est un regroupement des directives pour contribuer au projet Augora.

#### Table des matières

[Code De Conduite](#Code-De-Conduite)

[Qu'est-ce que je dois savoir avant de contribuer ?](#Comment-puis-je-contribuer-)

[Comment puis-je contribuer ?](#Comment-puis-je-contribuer-)

- [Signaler une erreur](#Signaler-une-erreur)
- [Suggérer une idée](#Suggérer-une-idée)
- [Pull Requests](#pull-requests)

[Nomenclature](#Nomenclature)

[Normes de développement](#Normes-de-développement)

[Guide de style](#Guide-de-style)

- [Règles pour les commits](#Règles-pour-les-commits)
- [Règles pour le nom des branches](#Règles-pour-le-nom-des-branches)
- [Nommage au sein du projet](#Nommage-au-sein-du-projet)
- [Style du code](#Style-du-code)
- [Documentation](#documentation)

## Code De Conduite

Ce projet et toutes les personnes qui y participent sont régis par le **Code De Conduite** ([Français](CODE_OF_CONDUCT.french.md), [Anglais](CODE_OF_CONDUCT.md)). Pour participer à ce projet, vous devez respecter ce code. Veuillez signaler tout comportement innacceptable à l'adresse : [contact@augora.fr](mailto:contact@augora.fr).

## Comment puis-je contribuer ?

### Signaler une erreur

Si vous rencontrez un bug, vous pouvez aller dans la partie [Signaler une erreur](https://github.com/Augora/Augora/issues/new?assignees=KevinBacas%2C+pierretusseau&labels=bug&template=signaler-une-erreur.md&title=). Vous y trouverez un template permettant de définir le problème rencontré.

### Suggérer une idée

Si vous souhaitez proposer une amélioration pour le projet, vous pouvez aller dans la partie [Proposition](https://github.com/Augora/Augora/issues/new?assignees=KevinBacas%2C+pierretusseau&labels=proposition&template=proposition.md&title=). Vous y trouverez un template permettant de définir l'amélioration.

### Pull Requests

Merci de suivre les étapes ci-dessous pour qu'une pull request soit considérée :

1. Suivez toutes les instructions de [ce template](https://github.com/Augora/Augora/blob/develop/.github/pull_request_template.md)
2. Suivez le [guide de style](#Guide-de-style)
3. Une fois la pull request créée, assurez-vous que les tests sont opérationnels au niveau des [GitHub Actions](https://github.com/Augora/Augora/actions)

## Nomenclature

Cette partie détaille le contenu du répertoire [src](https://github.com/Augora/Augora/tree/develop/src) du projet.

### Components

### Context

Contient les informations de contexte de React, notamment les filtres pour les députés.

### Fonts

Fonts utilisées sur le site.

### Hooks

<A compléter>

### Images

Stockage de toutes les images utilisées sur le site.

### Pages

Il s'agit des pages statiques créées via Gatsby. Il doit y avoir un fichier "js" par page.

### Static

Ce répertoire reprend l'ensemble des fichiers qui doivent être accessibles pour plusieurs composants. Notamment, les données geojson

### Styles

### Templates

Ce répertoire regroupe l'ensemble des templates typescript. Pour chaque type de template, il faut faire un répertoire.

Exemple : un template des deputés "deputy", contenant le fichier deputy.tsx

### Utils

Ce répertoire contient les fonctionnalités qui n'ont pas de valeur métier, mais utilisable n'importe où.

## Normes de développement

- Les noms de variables doivent être en entier, il ne faut pas les abréger.
- Ne pas utiliser “List” “string” “int” mais plutôt le pluriel / “districtName” / “districtNumber”
- Préférer les switch / case
- Eviter les comparaison avec des strings, créer des enums, ex :

```
var SizeEnum = {
  SMALL: 1,
  MEDIUM: 2,
  LARGE: 3,
};
```

- Enums à sortir de la classe, créer un nouveau fichier
- Ajouter des commentaires aux méthodes / fonctions (si c’est du métier, faire référence à la maquette et ou numéro de la règle, attention, choisir le nom qui est inchangeable dans le temps, voire même un numéro de ticket CU)
- Ne pas ajouter de commentaire inutile
- Ajouter des commentaires uniquement pour une partie complexe, au-dessus d’une boucle par ex pour expliquer pourquoi on fait ça et ce qu’on fait à l’intérieur

## Guide de style

### Règles pour les commits

- Ne pas dépasser 72 caractères
- Utiliser l'impératif pour décrire les actions

### Règles pour le nom des branches

- Commencer par feature/
- Être uniquement en minuscule
- Ne pas comporter de "tiret du bas" (underscore) : **\_**

Exemple : feature/ma-nouvelle-branche

### Nommage au sein du projet

Pour les dossiers : kebab-case
Pour les fichiers :

- En général : lowercase
- Pour les composants : PascalCase
- Pour les fichiers CSS / SCSS : kebab-case

Pour le contenu des fichiers :

- Variable : camelCase
- Fonction : camelCase

### Style du code

Nous utilisons [Prettier](https://prettier.io/) pour garder une uniformité sur le style appliqué au code.

### Documentation

La documentation doit être rédigée en [Markdown](https://daringfireball.net/projects/markdown).
