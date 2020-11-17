# Augora

## Le projet

Augora, c'est un projet qui a pour vocation de mettre à disposition des outils d'informations statistiques sur les députés via notre site : https://augora.fr

## Les technologies et outils utilisés

- <a href="https://yarnpkg.com" target="_blank">Yarn</a>
- <a href="https://nodejs.org" target="_blank">Node</a>
- <a href="https://nextjs.org" target="_blank">NextJS</a>
- <a href="https://reactjs.org" target="_blank">React</a>
- <a href="https://www.mapbox.com" target="_blank">Mapbox</a>
- <a href="https://prettier.io" target="_blank">Prettier</a>

## Installation de l'environnement

### Pré-requis

Récupérez les packages suivants :

- <a href="https://nodejs.org/en/download/" target="_blank">Node (version LTS ou Current)</a>
- <a href="https://classic.yarnpkg.com/en/docs/install/#windows-stable" target="_blank">Yarn (version Stable)</a>

### Installation

Installer **Node**, **Yarn**

### Récupération du projet

`git clone https://github.com/Augora/Augora`

### Tester le site en local

Une fois le projet disponible, il suffit de faire les actions suivantes :

```
yarn
yarn start
```

Une fois fait, le site est accessible sur l'adresse : http://localhost:8000

### Variables d'environnement

Pour faciliter le déploiement, nous utilisons un fichier <strong>.env.local</strong>.

Pour l'utiliser, il suffit de copier le contenu du fichier :

```
.env.sample
```

dans le fichier :

```
.env.local
```
