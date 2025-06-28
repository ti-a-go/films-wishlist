# GET /wishlist

Retorna todos os filmes da lista de desejos do usuário.

# Pre carregar user no pipe de autenticação

Fazer isso para a rota POST /films que adiciona um filme na lista de desejos de um usuário.

# Recomendação de filmes com base na 'wishlist' de um usuário.

Quando um usuário cria uma lista de desejos e adiciona um filme à essa lista, o sistema gera uma lista de recomendações com base em alguns dados do título e da sinópse dos filmes dessa lista.

## Solução técnica

Extrair entidades nomeadas do título e do resumo dos filmes. Em seguida, pesquisar no TMDB por novos filmes usando essas entidades encontradas como query.

## Extração de Entidades Nomeadas

## Classificação e Similaridade entre Textos


# Backlog

## Mover endpoint que atualiza o status de um ítem da lista de desejos

[FilmsController.updateStatus()](./src/films/films.controller.ts)

Esse endpoint deveria está no [módulo de usuários](./src/users/users.controller.ts).

## Make case insensitive query to find film by name

https://github.com/typeorm/typeorm/issues/1231


## Update endpoint to change film status

Endpoint: `PUT /films/:id/status`

Nowadays this endpoint only changes status from TO_WATCH to WATCHED. 

Changes:
- Allow to rate a WATCHED film
- Allow to recommend a RATED film
