# Introdução

Nos últimos anos, o **comércio eletrônico** tem se consolidado como um dos principais canais de compra e venda de produtos, impulsionado pela popularização da internet e pela facilidade de acesso a dispositivos móveis. Plataformas como *Mercado Livre*, *Amazon* e *Shopee* demonstram que consumidores buscam cada vez mais **praticidade**, **variedade de produtos** e **segurança nas transações**.
Paralelamente, **pequenos e médios fornecedores** enfrentam desafios para competir com grandes marcas, especialmente no que diz respeito à:  
- 📢 **Divulgação**  
- 📦 **Gestão de estoque**  
- 📊 **Análise de vendas**  
Nesse cenário, **soluções tecnológicas** que conectem vendedores e compradores de forma **simples**, **escalável** e **segura** tornam-se cada vez mais necessárias.


## Problema
Apesar do crescimento do **e-commerce**, muitos fornecedores  principalmente pequenos empreendedores e comerciantes locais  encontram dificuldades para ingressar ou se manter no mercado digital [(CARTA CAPITAL, 2023)](../docs/references.md).  

Entre os principais desafios estão:  
- Falta de infraestrutura tecnológica para gerenciar produtos e vendas.  
- Baixa visibilidade de seus produtos frente a grandes marcas.  
- Ausência de ferramentas de análise que auxiliem na tomada de decisão.  
- Dificuldade em integrar múltiplos canais de venda de forma centralizada.  

Por outro lado, compradores muitas vezes enfrentam a limitação de encontrar produtos diversificados e competitivos em uma única plataforma, o que os leva a utilizar diversos aplicativos e sites, aumentando o tempo e o esforço para realizar uma compra.


## Objetivos

### Objetivo Geral
Desenvolver uma plataforma de e-commerce, chamada **ConectaShop**, que conecte fornecedores e compradores, oferecendo um ambiente digital seguro, escalável e com recursos de análise de vendas para fornecedores.

### Objetivos Específicos
- Permitir o cadastro de fornecedores e seus produtos de forma simples e intuitiva.  
- Disponibilizar um painel (dashboard) para acompanhamento e análise das vendas.  
- Oferecer um ambiente de compra eficiente, com filtragem e busca de produtos.  
- Garantir segurança nas transações e proteção dos dados dos usuários.  
- Suportar acesso via web e dispositivos móveis.


## Justificativa

A criação da ConectaShop busca atender a uma necessidade crescente do mercado digital: proporcionar oportunidades para pequenos e médios fornecedores competirem em condições mais equilibradas com grandes empresas. As Micro, Pequenas e Médias Empresas (MPMEs) têm um papel relevante na economia, sendo responsáveis por grande parte do emprego e da produção local, o que fortalece o impacto social e produtivo do projeto [(BRASIL, 2021)](../docs/references.md).

Além disso, o e-commerce surge como uma solução acessível e eficiente, especialmente para empreendedores que enfrentam barreiras financeiras ou logísticas para expandir seus negócios de forma tradicional. Esse modelo digital permite superar limitações físicas e alcançar novos mercados com menores custos [(SILVA; PEREIRA, 2020)](../docs/references.md).

O potencial de expansão e internacionalização das plataformas digitais já foi demonstrado por diversos empreendedores e estudos, como o relatório da FedEx, que evidencia o crescimento de negócios que adotam o comércio eletrônico para ampliar suas operações globalmente [(FEDEX, 2023)](../docs/references.md).

A importância dessas soluções digitais se torna ainda mais crítica em contextos de crise ou isolamento físico, como observado durante a pandemia, quando o comércio tradicional foi fortemente impactado, evidenciando a necessidade de alternativas robustas e seguras para manter a atividade econômica [(OLIVEIRA, 2021)](../docs/references.md).

A ConectaShop também contribui para a inclusão digital e a capacitação tecnológica dos pequenos e médios empreendedores, ajudando a reduzir a disparidade no uso das Tecnologias da Informação e Comunicação (TICs) por MPMEs, fator essencial para a competitividade no mercado atual [(MINISTÉRIO DA ECONOMIA, 2022)](../docs/references.md).

Finalmente, a plataforma se apoia nas estratégias de marketing digital, que oferecem baixo custo e alto retorno, potencializando a visibilidade dos fornecedores e o alcance de novos clientes [(GONÇALVES; MARTINS, 2020)](../docs/references.md).

Assim, o projeto ConectaShop se posiciona como uma iniciativa que fortalece o ecossistema do comércio eletrônico e promove a inclusão digital, contribuindo para o desenvolvimento econômico e social dos empreendedores.


## Público-Alvo

O público-alvo do projeto é composto por:  

- **Fornecedores:** pequenos e médios empreendedores, comerciantes locais e marcas que desejam ampliar seu alcance no comércio digital.  
- **Compradores:** consumidores finais que buscam praticidade, variedade e segurança ao realizar compras online.


Descreva quem serão as pessoas que usarão a sua aplicação indicando os diferentes perfis. O objetivo aqui não é definir quem serão os clientes ou quais serão os papéis dos usuários na aplicação. A ideia é, dentro do possível, conhecer um pouco mais sobre o perfil dos usuários: conhecimentos prévios, relação com a tecnologia, relações
hierárquicas, etc.

Adicione informações sobre o público-alvo por meio de uma descrição textual, diagramas de personas e mapa de stakeholders.

> **Links Úteis**:
> - [Público-alvo](https://blog.hotmart.com/pt-br/publico-alvo/)
> - [Como definir o público alvo](https://exame.com/pme/5-dicas-essenciais-para-definir-o-publico-alvo-do-seu-negocio/)
> - [Público-alvo: o que é, tipos, como definir seu público e exemplos](https://klickpages.com.br/blog/publico-alvo-o-que-e/)
> - [Qual a diferença entre público-alvo e persona?](https://rockcontent.com/blog/diferenca-publico-alvo-e-persona/)

# Especificações do Projeto

## Requisitos

As tabelas que se seguem apresentam os requisitos funcionais e não funcionais que detalham o escopo do projeto. Para determinar a prioridade de requisitos, aplicar uma técnica de priorização de requisitos e detalhar como a técnica foi aplicada.

### Requisitos Funcionais

|ID    | Descrição do Requisito  | Prioridade |
|------|-----------------------------------------|----|
|RF-001| Permitir que o usuário cadastre tarefas | ALTA | 
|RF-002| Emitir um relatório de tarefas no mês   | MÉDIA |

### Requisitos não Funcionais

|ID     | Descrição do Requisito  |Prioridade |
|-------|-------------------------|----|
|RNF-001| O sistema deve ser responsivo para rodar em um dispositivos móvel | MÉDIA | 
|RNF-002| Deve processar requisições do usuário em no máximo 3s |  BAIXA | 

Com base nas Histórias de Usuário, enumere os requisitos da sua solução. Classifique esses requisitos em dois grupos:

- [Requisitos Funcionais
 (RF)](https://pt.wikipedia.org/wiki/Requisito_funcional):
 correspondem a uma funcionalidade que deve estar presente na
  plataforma (ex: cadastro de usuário).
- [Requisitos Não Funcionais
  (RNF)](https://pt.wikipedia.org/wiki/Requisito_n%C3%A3o_funcional):
  correspondem a uma característica técnica, seja de usabilidade,
  desempenho, confiabilidade, segurança ou outro (ex: suporte a
  dispositivos iOS e Android).
Lembre-se que cada requisito deve corresponder à uma e somente uma
característica alvo da sua solução. Além disso, certifique-se de que
todos os aspectos capturados nas Histórias de Usuário foram cobertos.

## Restrições

O projeto está restrito pelos itens apresentados na tabela a seguir.

|ID| Restrição                                             |
|--|-------------------------------------------------------|
|01| O projeto deverá ser entregue até o final do semestre |
|02| Não pode ser desenvolvido um módulo de backend        |

Enumere as restrições à sua solução. Lembre-se de que as restrições geralmente limitam a solução candidata.

> **Links Úteis**:
> - [O que são Requisitos Funcionais e Requisitos Não Funcionais?](https://codificar.com.br/requisitos-funcionais-nao-funcionais/)
> - [O que são requisitos funcionais e requisitos não funcionais?](https://analisederequisitos.com.br/requisitos-funcionais-e-requisitos-nao-funcionais-o-que-sao/)

# Catálogo de Serviços

Descreva aqui todos os serviços que serão disponibilizados pelo seu projeto, detalhando suas características e funcionalidades.

# Arquitetura da Solução

Definição de como o software é estruturado em termos dos componentes que fazem parte da solução e do ambiente de hospedagem da aplicação.

![arq](https://github.com/user-attachments/assets/b9402e05-8445-47c3-9d47-f11696e38a3d)


## Tecnologias Utilizadas

Descreva aqui qual(is) tecnologias você vai usar para resolver o seu problema, ou seja, implementar a sua solução. Liste todas as tecnologias envolvidas, linguagens a serem utilizadas, serviços web, frameworks, bibliotecas, IDEs de desenvolvimento, e ferramentas.

Apresente também uma figura explicando como as tecnologias estão relacionadas ou como uma interação do usuário com o sistema vai ser conduzida, por onde ela passa até retornar uma resposta ao usuário.

## Hospedagem

Explique como a hospedagem e o lançamento da plataforma foi feita.

# Planejamento

##  Quadro de tarefas

> Apresente a divisão de tarefas entre os membros do grupo e o acompanhamento da execução, conforme o exemplo abaixo.

### Semana 1

Atualizado em: 21/04/2024

| Responsável   | Tarefa/Requisito | Iniciado em    | Prazo      | Status | Terminado em    |
| :----         |    :----         |      :----:    | :----:     | :----: | :----:          |
| AlunaX        | Introdução | 01/02/2024     | 07/02/2024 | ✔️    | 05/02/2024      |
| AlunaZ        | Objetivos    | 03/02/2024     | 10/02/2024 | 📝    |                 |
| AlunoY        | Histórias de usuário  | 01/01/2024     | 07/01/2005 | ⌛     |                 |
| AlunoK        | Personas 1  |    01/01/2024        | 12/02/2005 | ❌    |       |

#### Semana 2

Atualizado em: 21/04/2024

| Responsável   | Tarefa/Requisito | Iniciado em    | Prazo      | Status | Terminado em    |
| :----         |    :----         |      :----:    | :----:     | :----: | :----:          |
| AlunaX        | Página inicial   | 01/02/2024     | 07/03/2024 | ✔️    | 05/02/2024      |
| AlunaZ        | CSS unificado    | 03/02/2024     | 10/03/2024 | 📝    |                 |
| AlunoY        | Página de login  | 01/02/2024     | 07/03/2024 | ⌛     |                 |
| AlunoK        | Script de login  |  01/01/2024    | 12/03/2024 | ❌    |       |

Legenda:
- ✔️: terminado
- 📝: em execução
- ⌛: atrasado
- ❌: não iniciado
