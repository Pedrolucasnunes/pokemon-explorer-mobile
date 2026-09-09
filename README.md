# Pokémon Explorer

Aplicativo móvel de exploração da [PokéAPI](https://pokeapi.co), com listagem
paginada, busca por nome, filtro por tipo e telas de detalhe encadeadas.

A aplicação principal é feita em **React Native (Expo)**. O repositório inclui
também a **reimplementação de uma das telas em Flutter**, para comparação entre
os dois frameworks partindo do mesmo desenho de interface.

```
Splash ──replace──▶ Listagem ──push──▶ Detalhe do Pokémon ──push──▶ Detalhe do movimento
                        ◀────── goBack ──────  ◀────── goBack ──────
```

## Stack

| | |
|---|---|
| **App principal** | React Native 0.86 · React 19.2 · Expo SDK 57 |
| **Navegação** | React Navigation 7 (native stack) |
| **Tela comparativa** | Flutter · Dart SDK ≥ 3.4 |
| **API** | PokéAPI v2 — pública, sem autenticação |
| **Dependências de UI** | nenhuma — ícones e formatação são próprios |

## Funcionalidades

- **Listagem paginada** — 20 itens por vez, com botão "Carregar mais".
- **Busca por nome** — debounce de 400 ms, filtro local sobre um índice de nomes
  em cache, com contador de resultados.
- **Filtro por tipo** — régua horizontal montada a partir da API; o chip
  selecionado assume a cor do próprio tipo.
- **Filtros combináveis** — a busca por nome atua sobre o conjunto já restrito
  pelo tipo escolhido.
- **Filtro por método de aprendizado** na lista de movimentos (Nível, MT/HM,
  Ovo, Tutor).
- **Estados de interface** — skeleton no carregamento, tela de erro com código
  HTTP e botão de repetir, e estado vazio distinto do estado de erro.

## Como executar

### React Native (aplicação principal)

Requer Node.js 20+ e um emulador Android/iOS configurado.

```bash
cd react-native-pokemon-explorer
npm install
npx expo start
```

Com o Metro rodando, pressione `a` para Android ou `i` para iOS — ou leia o QR
code com o app Expo Go.

> Se o `npm install` reclamar de incompatibilidade de versões, rode
> `npx expo install --fix` para alinhar as dependências ao SDK instalado.

### Flutter (tela comparativa)

```bash
cd flutter-tela-pokemon
flutter create .     # regenera as plataformas ausentes
flutter pub get
flutter run
```

Só a pasta `android/` está versionada. O `flutter create .` regenera `ios/`,
`web/` e desktop a partir do SDK — são artefatos gerados, sem código autoral.

## Arquitetura

```
react-native-pokemon-explorer/src/
├── api/
│   ├── client.js          fetch com timeout, cache de promessas e ApiError
│   ├── adapters.js        JSON bruto da API → modelos da interface
│   └── pokeApi.js         um método por endpoint
├── components/            12 componentes reutilizáveis
├── hooks/
│   ├── useDebouncedValue.js   debounce da busca
│   ├── usePokemonList.js      paginação, busca e filtro por tipo
│   └── useResource.js         carregamento das telas de detalhe
├── navigation/AppNavigator.js
├── screens/               as 4 rotas do aplicativo
├── theme/                 paleta e tabela de tipos
└── utils/                 formatação de nomes, números e medidas

flutter-tela-pokemon/lib/
├── main.dart
├── data/mock_pokemon.dart           dados em memória
├── models/pokemon_detail.dart       modelos e enum LearnMethod
├── theme/                           paleta e tabela de tipos
├── widgets/                         TypeChip, StatBox, MoveTile, cabeçalho
└── screens/pokemon_detail_screen.dart
```

Os modelos do Flutter têm a mesma forma dos objetos produzidos pelos adaptadores
da versão React Native, de modo que a tela seria plugável a uma camada de rede
sem alteração no widget.

### Endpoints consumidos

| Endpoint | Usado em |
|---|---|
| `GET /pokemon?limit=20&offset={n}` | paginação da listagem e pré-carga do splash |
| `GET /pokemon/{nome}` | imagem e tipos de cada card; detalhe e movimentos |
| `GET /pokemon?limit=100000` | índice de nomes para a busca parcial |
| `GET /type?limit=50` | régua de filtros por tipo |
| `GET /type/{nome}` | Pokémon de um tipo e índice de tipos dos movimentos |
| `GET /pokemon-species/{nome}` | categoria da espécie no cabeçalho do detalhe |
| `GET /move/{nome}` | detalhe do movimento |

## Decisões técnicas

**Cache de promessas, não de resultados.** O cliente HTTP guarda a *promessa* de
cada requisição. É isso que permite ao splash disparar
`GET /pokemon?limit=20&offset=0` e a listagem encontrar o dado já pronto, sem
repetir a chamada nem precisar de estado global compartilhado.

**Lógica fora das telas.** A regra de paginação e filtragem vive em
`usePokemonList`, e o carregamento das telas de detalhe em `useResource`. As
telas cuidam apenas da apresentação.

**Um componente, dois usos.** `ChipRail` atende tanto o filtro por tipo da
listagem quanto o filtro por método da tela de detalhes, mudando apenas os dados
recebidos.

**Sem dependências desnecessárias.** Os ícones foram desenhados com `View` e
`Text`, e a formatação numérica é manual em vez de `Intl` — o motor Hermes nem
sempre embarca a tabela de locales completa, o que faria "1.302" virar "1302"
em alguns dispositivos.

**Requisições concorrentes descartadas.** Cada carga da listagem recebe um
identificador; se o usuário troca o filtro antes da resposta chegar, o resultado
antigo é ignorado em vez de sobrescrever a tela.

**Navegação que preserva contexto.** O splash usa `replace` para que o botão
voltar não retorne à abertura. As demais transições empilham, então voltar
preserva rolagem e filtros, porque a tela permanece montada na pilha.

## Limitações da PokéAPI contornadas

**Número da MT.** A resposta de `/pokemon/{nome}` informa que o movimento é
aprendido por `machine`, mas não devolve o número da MT — obtê-lo exigiria uma
chamada a `/machine` por movimento. A listagem exibe `machine · MT/HM`.

**Flags de movimento.** A v2 da API não expõe as flags, então não há dado de
contato físico. O chip foi substituído por um de efeito colateral, alimentado
por `meta.ailment` (Paralisia, Queimadura, Sono…) — informação real e mais útil
ao usuário. Quando o movimento não causa efeito, o chip é omitido.

**Tipo de cada movimento.** A resposta de `/pokemon/{nome}` lista os movimentos
sem informar o tipo, e Bulbasaur tem 81 movimentos — uma chamada por linha seria
inviável. O tipo é resolvido por um índice construído a partir de `/type/{nome}`,
que já devolve todos os movimentos daquele tipo: 18 requisições feitas uma única
vez por sessão, reaproveitando o cache da régua de filtros. O índice carrega em
paralelo à tela, que é exibida sem esperar por ele.

---

Projeto desenvolvido originalmente como trabalho acadêmico da disciplina de
Desenvolvimento de Sistemas Mobile, por Pedro Lucas Fonseca Nunes.
