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

- [Généralités](#Généralités)
- [Commentaires](#Commentaires)
- [Variables](#Variables)
- [Conditions](#Conditions)
- [Boucles](#Boucles)
- [Méthodes](#Méthodes)

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

### Généralités

- Une instruction par ligne.
- Une déclaration par ligne.
- Utiliser l'indentation par défaut.
- Laisser une ligne vide entre les méthodes et les propriétés.
- Éviter les lignes de plus de 130 caractères.
- Utiliser un nommage explicite, signifiant et homogène pour les variables, les méthodes.
- Éviter les abréviations. En particulier, proscrire les noms de moins de 3 caractères. (Sauf incrément de boucle etc.).
- Ne pas utiliser de caractères spéciaux dans les noms.
- Les variables, méthodes et propriétés booléennes doivent être une phrase affirmative. Cela se fait en utilisant un préfixe comme : Is, Has, Can, Allows, Supports, etc.
- Principe de [responsabilité unique](https://fr.wikipedia.org/wiki/Principe_de_responsabilit%C3%A9_unique) : une classe ne doit changer que pour une seule raison.

### Commentaires

- Placer le commentaire sur une ligne à part.
- Préférer le // au /\* \*/
- Mettre un espace entre // et le commentaire.
- Commencer le commentaire par une majuscule. Cela améliore la lisibilité en cas de commentaire sur plusieurs lignes.
- Décrire les grandes étapes des algorithmes plutôt que chaque ligne de code.
- Préciser les références le cas échéant (clickup, contraintes BDD...).
- Au lieu de sauter une ligne entre les différentes parties d'une méthode, mettre un commentaire.
- Systématiser les descriptions de méthodes. Permet notamment de générer la documentation.
- Supprimer le code en commentaire : Tout code en commentaire est une source de confusion et doit être supprimé.
- Ajouter des commentaires uniquement pour une partie complexe, au-dessus d’une boucle par ex pour expliquer pourquoi on fait ça et ce qu’on fait à l’intérieur.

### Variables

#### Nom des variables

- L'utilisation de var/const/let est à proscrire car nuit à la compréhension du code (pour l'auteur et le lecteur) dans la grande majorité des cas.
- Les noms de variables doivent être en entier, il ne faut pas les abréger.
- Ne pas utiliser “List” “string” “int” mais plutôt le pluriel / “districtName” / “districtNumber”.
- Eviter les comparaison avec des strings, créer des enums, exemple :

```
var SizeEnum = {
  SMALL: 1,
  MEDIUM: 2,
  LARGE: 3,
};
```

- Utiliser le pluriel uniquement pour les ensembles (tableau, liste, etc).

#### Initialisation des objets et des collections

- Favoriser l'initialisation via une instruction plutôt qu'élément par élément.
- Proscrire les [magic numbers](https://en.wikipedia.org/wiki/Magic_number_%28programming%29).
- Utiliser des constantes bien nommées et commentées.

### Conditions

#### Généralités

- Éviter la double négation : comme dans le langage parlé, la double négation est source de confusion.
- Éviter de comparer explicitement avec true et false.

```
if (condition === false) // KO
if (!condition) // OK
```

#### Accolades

Il faut systématiser l'utilisation des accolades. L'absence d'accolades nuit à la lisibilité du code.
L'utilisation des conditions sans accolades mène fréquemment à des dérives avec plusieurs instructions sur une ligne.

#### Switch

A partir de 5 éléments, le switch est plus rapide qu'une suite de if else if.
Il faut toujours définir une instruction par défaut. Cela permet de traiter la totalité des autres cas. Si aucun autre cas, utiliser default pour lancer une exception/alerte.
De la même manière terminer une liste de if else if avec un else.

### Méthodes

Utiliser un verbe à l'infinitif suivi (ou pas) d'un nom commun. Une méthode réalise une opération. Si vous sentez le besoin de rajouter un "Et", c'est que la méthode ne répond pas au principe de responsabilité unique.
showDeputy, deleteMap, etc.

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
