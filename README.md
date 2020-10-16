# Sobre

Este documento README tem como objetivo fornecer as informações necessárias para realização do projeto de avaliação de 
candidatos.


# 🏗 O que fazer?

- Deve realizar um fork deste repositório e, ao finalizar, enviar o _link_ do seu repositório para nós. 
  Lembre-se, **NÃO é necessário** criar um Pull Request para isso, nós iremos avaliar e retornar por email o resultado 
  do seu teste.


# 🚨 Requisitos

- Implementar autenticação e deverá seguir o padrão **JWT** _(o token deverá ser no formato **Bearer**)_.
- A API deverá seguir os padrões REST na construção das rotas e retornos.
- Implementar casos de usos descritos na seção [Casos de Uso](#-casos-de-uso).


# 🕵🏻 Itens a serem avaliados

- Estrutura do Projeto.
- Segurança da API, como autenticação, senhas salvas no banco, SQL Injection e outros.
- Boas práticas da Linguagem/Framework.
- Os requisitos acima.


# 🎁 Extra

Esses itens não são obrigatórios, porém desejados:
- Testes unitários
- Linter
- Code Formatter


# 🖥 Casos de Uso

Esta API é uma versão simplificada do site [IMDb](https://www.imdb.com/), 
o mesmo deve conter os seguintes casos de uso:

- Eu como usuário gostaria de autenticar no sistema.
- Eu como usuário gostaria de votar num filme.
  - O voto é um valor de 0 a 10.
  - Quando listado o filme, exibir média dos votos.
  - O usuário só poderá votar uma única vez.
  - Administradores não podem votar nos filmes.
- Eu como sistema devo aplicar regras de permissões.
  - Apenas administradores podem cadastrar, editar e excluir filmes.
