# SCRIPT DE FALA - QualidadePIM
# Tempo total: ~17 minutos

Cada secao indica o slide correspondente e o tempo estimado.
Nao precisa decorar palavra por palavra - use como guia.
Os trechos entre [colchetes] sao acoes que voce faz (trocar slide, ir pro navegador, etc).


## SLIDE 1 - CAPA (~30s)

[Abrir no slide da capa]

"Boa tarde / Bom dia a todos. Meu nome e Aluizio, e hoje vou apresentar
o QualidadePIM, um sistema web para registro e acompanhamento de nao
conformidades de qualidade industrial. Esse e o projeto final do modulo
Full Stack aqui no INDT."


## SLIDE 2 - O PROBLEMA (~1min)

[Trocar pro slide do problema]

"Antes de mostrar o sistema, quero contextualizar o problema que ele resolve.

Na industria, especialmente aqui no Polo Industrial de Manaus, o controle
de qualidade e uma atividade critica. Quando algo sai do padrao - uma peca
com defeito, um procedimento que nao foi seguido, um material fora de
especificacao - isso precisa ser registrado, investigado e corrigido.

Hoje, em muitas fabricas, isso ainda e feito em planilhas Excel ou ate em
papel. O resultado e: prazos que vencem sem ninguem perceber, falta de
rastreabilidade de quem abriu e quem e responsavel por resolver, e os
gestores nao tem uma visao clara de quantos problemas estao abertos
ou quais tipos de desvio sao mais recorrentes."


## SLIDE 3 - O QUE E UMA NC (~45s)

[Trocar pro slide de NC]

"Pra quem nao esta familiarizado: uma Nao Conformidade, ou NC, e qualquer
desvio em relacao ao padrao esperado. Por exemplo: uma peca que saiu com
dimensao fora da tolerancia, um operador que nao seguiu o procedimento
operacional padrao, um material que chegou do fornecedor com certificado
vencido, ou um EPI em uso sem certificado de aprovacao valido.

Cada NC precisa ser registrada, ter um responsavel atribuido, ser
investigada, ter acoes corretivas, e ser encerrada com evidencias."


## SLIDE 4 - A SOLUCAO (~45s)

[Trocar pro slide da solucao]

"O QualidadePIM digitaliza todo esse processo em 4 pilares:

Primeiro, o Registro: o inspetor abre a NC informando titulo, descricao,
tipo do desvio, gravidade, setor e linha de producao.

Segundo, o Acompanhamento: a NC segue um ciclo de vida controlado, com
transicoes de status que eu vou mostrar daqui a pouco.

Terceiro, o Tratamento: sao criadas acoes corretivas vinculadas a NC,
cada uma com responsavel, prazo e exigencia de evidencia para conclusao.

E quarto, a Visualizacao: um dashboard com indicadores em tempo real
e ranking dos tipos de desvio mais recorrentes no mes."


## SLIDE 5 - STACK (~30s)

[Trocar pro slide de tecnologias]

"Em termos de tecnologia: o frontend foi construido com Angular 21 e
Tailwind CSS. O backend e uma API REST com Node.js, Express 5 e
TypeScript. O banco de dados e PostgreSQL 15 rodando em Docker.
Usei TypeORM como ORM, Zod pra validacao de dados, e JWT com
bcrypt pra autenticacao."


## SLIDE 6 - ARQUITETURA (~1min)

[Trocar pro slide de arquitetura]

"A arquitetura segue o padrao classico de tres camadas. O frontend Angular
roda na porta 4200 e se comunica via HTTP com a API Express na porta 3000,
que por sua vez acessa o PostgreSQL via TypeORM.

No backend, organizei o codigo em camadas: as rotas definem os endpoints
e aplicam o middleware de autenticacao. Os controllers validam a entrada
com Zod. Os services contem toda a logica de negocio. E as entities
fazem o mapeamento com o banco.

A autenticacao funciona com JWT: o usuario faz login, recebe um token,
e esse token e enviado automaticamente em todas as requisicoes seguintes
pelo interceptor do Angular."


## SLIDE 7 - MODELO DE DADOS (~45s)

[Trocar pro slide de entidades]

"O sistema tem tres entidades principais.

O Usuario, que tem nome, email, senha criptografada e um perfil que pode
ser inspetor, gestor ou responsavel.

A NaoConformidade, que e o registro central - tem um numero gerado
automaticamente, titulo, descricao, tipo, gravidade, status, setor,
linha de producao, e campos como causa raiz e prazo.

E a AcaoCorretiva, que e vinculada a uma NC e tem descricao, responsavel,
prazo, status e um campo de evidencia que e obrigatorio pra concluir a acao."


## SLIDE 8 - CICLO DE VIDA (~1min)

[Trocar pro slide da maquina de estados]

"Esse e um ponto importante do sistema: o ciclo de vida da NC e controlado
por uma maquina de estados.

Uma NC comeca como Aberta. Quando um responsavel e atribuido, ela vai
automaticamente pra Em Tratamento. Depois de investigada, vai pra
Aguardando Verificacao. E finalmente pode ser Encerrada.

Tem regras de negocio importantes aqui: pra encerrar uma NC, e obrigatorio
ter a causa raiz preenchida. A NC tambem pode ser cancelada a partir
de Em Tratamento. E se a verificacao falhar, ela pode voltar pra
Em Tratamento. Uma vez encerrada ou cancelada, nao muda mais.

Essas regras estao implementadas tanto no backend, que rejeita transicoes
invalidas, quanto no frontend, que so mostra os botoes de status
permitidos pro estado atual."


## SLIDE 9 - DEMONSTRACAO (~7-8min)

[Trocar pro slide de demonstracao, depois ir pro navegador]

"Agora vou mostrar o sistema funcionando. Vou abrir no navegador."

[Abrir http://localhost:4200 no navegador]

---

### DEMO 1 - LOGIN (~30s)

"Essa e a tela de login. Vou entrar como Carlos, que e um inspetor
de qualidade."

[Digitar: carlos@qualidade.com / 123456 -> clicar Entrar]

"O sistema validou as credenciais, gerou um token JWT e redirecionou
pro dashboard."

---

### DEMO 2 - DASHBOARD (~1min)

"Aqui no dashboard temos os 4 indicadores principais: quantas NCs estao
abertas, quantas sao criticas, quantas estao com prazo vencido, e quantas
foram encerradas neste mes.

Abaixo temos a lista das NCs mais recentes - da pra ver os badges de
gravidade e status, e quando tem uma NC com prazo vencido ela aparece
com a tag vermelha piscando.

E aqui a direita o ranking dos tipos de desvio mais recorrentes no mes,
que ajuda o gestor a identificar onde estao os problemas sistematicos."

---

### DEMO 3 - ABRIR NOVA NC (~1min30s)

[Clicar em "Abrir NC" na navbar]

"Vou abrir uma nova NC. Imagine que encontrei um problema na linha
de producao."

[Preencher o formulario:]
- Titulo: "Solda fria detectada em placa PCB"
- Descricao: "Lote 7890 apresentou 15 placas com solda fria no conector J5. Detectado na inspecao visual pos-reflow."
- Tipo: Produto
- Gravidade: Alta
- Linha/Processo: "Linha SMT-02"
- Setor: "SMT"

[Clicar em "Abrir NC"]

"A NC foi criada com numero automatico e status Aberta. O sistema
ja me trouxe pro detalhe dela."

---

### DEMO 4 - GESTAO DA NC (~2min)

"Agora vou mostrar a gestao. Aqui na lateral tenho os controles.

Vou atribuir um responsavel..."

[Selecionar "Pedro Operador" no dropdown de Responsavel]

"Percebam que ao atribuir o responsavel, o status mudou automaticamente
de Aberta pra Em Tratamento. Essa e a regra de negocio que mencionei.

Vou definir um prazo..."

[Selecionar uma data futura no campo de prazo]

"E registrar a causa raiz da investigacao..."

[Digitar no campo causa raiz: "Perfil termico do forno de reflow descalibrado. Temperatura de pico 10 graus abaixo do especificado."]
[Clicar Salvar]

"Agora vou avancar o status. Como estamos Em Tratamento, posso ir pra
Aguardando Verificacao."

[Clicar no botao "Ag. Verificacao"]

"E como ja tenho a causa raiz preenchida, posso encerrar."

[Clicar no botao "Encerrada"]

"NC encerrada. Se eu nao tivesse preenchido a causa raiz, o sistema
nao deixaria encerrar."

---

### DEMO 5 - LISTA COM FILTROS (~1min)

[Clicar em "NCs" na navbar]

"Na listagem, temos todos os registros. Posso filtrar por status..."

[Selecionar "Em Tratamento" no filtro de status]

"...por gravidade..."

[Limpar filtros, selecionar "Critica" em gravidade]

"...ou buscar por texto."

[Limpar filtros, digitar "forno" no campo de busca]

[Limpar filtros]

---

### DEMO 6 - MINHA FILA (~1min)

[Clicar em "Minha Fila" na navbar]

"Essa tela mostra as NCs atribuidas ao usuario logado. O Carlos e
inspetor, entao ele nao tem NCs na fila dele. Vou trocar de usuario
pra mostrar."

[Clicar em "Sair" -> fazer login como pedro@qualidade.com / 123456]
[Ir pra "Minha Fila"]

"Agora como Pedro, que e responsavel, vejo as NCs atribuidas a ele.
Reparem que as NCs com prazo vencido aparecem primeiro e com destaque
vermelho. Essa ordenacao ajuda o responsavel a priorizar o que e mais
urgente."

---

### DEMO 7 - RESPONSIVIDADE (OPCIONAL ~30s)

[Abrir DevTools do navegador -> Ctrl+Shift+M pra modo mobile]

"O sistema tambem e responsivo. No mobile, a tabela vira cards, o menu
vira hamburguer, e os paineis de gestao viram accordions."

[Fechar DevTools, voltar pro slide]

---


## SLIDE 10 - FUNCIONALIDADES (~30s)

[Voltar pros slides]

"Recapitulando as funcionalidades entregues: login com JWT, dashboard
com indicadores, abertura de NCs, listagem com filtros, gestao completa
com responsavel, prazo e causa raiz, ciclo de vida controlado, tela
Minha Fila, interface responsiva, e validacao de dados nas duas pontas."


## SLIDE 11 - DESTAQUES TECNICOS (~1min)

[Trocar pro slide de destaques]

"Alguns destaques tecnicos que gostaria de mencionar:

Em seguranca: uso do Helmet pra headers HTTP, bcrypt pra hash de senha,
JWT com expiracao, e validacao com Zod em todo input da API.

Em responsividade: o Tailwind CSS com abordagem mobile-first garante que
funciona bem em qualquer tela.

Em performance: as rotas do Angular usam lazy loading, as queries do
dashboard sao SQL otimizadas, e as respostas sao comprimidas com gzip.

E em qualidade de codigo: TypeScript strict nas duas camadas, arquitetura
organizada em camadas com separacao de responsabilidades, e tratamento
centralizado de erros."


## SLIDE 12 - ENCERRAMENTO (~30s)

[Trocar pro slide final]

"Esse foi o QualidadePIM. Um sistema que transforma o registro de nao
conformidades de um processo manual e fragil em um fluxo digital,
rastreavel e com visao gerencial.

Obrigado pela atencao. Estou aberto a perguntas."


---


# PERGUNTAS FREQUENTES - RESPOSTAS PREPARADAS

## "Por que Angular e nao React?"
"Angular e um framework completo que ja vem com roteamento, formularios,
HTTP client e injecao de dependencia integrados. Pra um sistema com
varias telas e regras de negocio como esse, ele oferece uma estrutura
mais organizada out-of-the-box."

## "Por que TypeORM e nao Prisma?"
"O TypeORM usa decorators que combinam bem com o estilo do TypeScript
e permitem definir as entidades de forma declarativa. Tambem tem boa
integracao com PostgreSQL e suporta migrations. Mas o Prisma tambem
seria uma otima escolha."

## "Tem testes?"
"O foco desse projeto foi entregar a aplicacao funcional. Numa proxima
etapa, adicionaria testes unitarios nos services com Vitest e testes
de integracao nos endpoints com Supertest."

## "Por que nao usou roles/permissoes mais granulares?"
"O sistema reconhece 3 perfis (inspetor, gestor, responsavel), mas nessa
versao nao restringe acoes por perfil. Seria uma evolucao natural
implementar RBAC pra controlar quem pode encerrar uma NC ou quem pode
cancelar, por exemplo."

## "Como funciona a seguranca da senha?"
"A senha nunca e armazenada em texto plano. Uso bcrypt com salt de 10
rounds pra gerar o hash. No login, o bcrypt.compare verifica a senha
informada contra o hash armazenado. O token JWT tem expiracao de 8 horas."

## "O que acontece se o token expirar?"
"O interceptor do Angular captura qualquer resposta 401 da API e
automaticamente faz logout do usuario, redirecionando pra tela de login."

## "Onde roda o banco de dados?"
"O PostgreSQL roda em um container Docker. O docker-compose.yaml sobe
o container com as configuracoes de usuario, senha e nome do banco.
O TypeORM com synchronize:true cria as tabelas automaticamente."
