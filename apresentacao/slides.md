# SLIDES - QualidadePIM

Monte cada "## SLIDE" como um slide no PowerPoint / Google Slides.
As anotacoes entre parenteses sao dicas visuais de como montar.

---

## SLIDE 1 - CAPA

**QualidadePIM**
Sistema de Registro de Não Conformidades

Projeto Final - Modulo Full Stack | INDT
Aluizio Neto

---

## SLIDE 2 - O PROBLEMA

**Titulo:** O problema na industria

(Coloque 3-4 icones ou imagens representando cada ponto)

- Desvios de qualidade registrados em planilhas ou papel
- Sem rastreabilidade: quem abriu? quem e responsavel?
- Prazos vencem e ninguem percebe
- Gestores sem visao geral: quantas NCs abertas? quais tipos mais recorrentes?

(Opcional: imagem de uma planilha bagunçada vs o sistema organizado)

---

## SLIDE 3 - O QUE E UMA NC?

**Titulo:** O que e uma Nao Conformidade?

Uma NC é qualquer desvio em relação ao padrao esperado de qualidade.

**Exemplos reais:**
- Peca com dimensao fora da tolerancia
- Operador que nao seguiu o procedimento
- Material recebido com certificado vencido
- EPI em uso sem certificado de aprovacao

(Pode colocar fotos ilustrativas de chao de fabrica)

---

## SLIDE 4 - A SOLUCAO

**Titulo:** QualidadePIM

(Coloque 4 blocos ou icones lado a lado)

1. **Registrar** - Abertura de NCs com tipo, gravidade, setor e linha
2. **Acompanhar** - Ciclo de vida controlado com transicoes de status
3. **Tratar** - Acoes corretivas com responsavel, prazo e evidencia
4. **Visualizar** - Dashboard com indicadores e ranking de desvios

---

## SLIDE 5 - STACK TECNOLOGICA

**Titulo:** Tecnologias Utilizadas

(Coloque os logos de cada tecnologia)

| Camada       | Tecnologia                       |
|-------------|----------------------------------|
| Frontend    | Angular 21 + Tailwind CSS 4      |
| Backend     | Node.js + Express 5 + TypeScript |
| Banco       | PostgreSQL 15 (Docker)           |
| ORM         | TypeORM                          |
| Validacao   | Zod                              |
| Autenticacao| JWT + bcrypt                     |

---

## SLIDE 6 - ARQUITETURA

**Titulo:** Arquitetura do Sistema

(Diagrama com 3 blocos e setas entre eles)

```
[Frontend Angular]  --HTTP/JSON-->  [API Express]  --TypeORM-->  [PostgreSQL]
    :4200                             :3000                        :5432
```

Padroes:
- API REST com camadas: Routes > Controllers > Services > Entities
- Autenticacao via JWT (token no header Authorization)
- Validacao de entrada com Zod
- Tratamento centralizado de erros

---

## SLIDE 7 - MODELO DE DADOS

**Titulo:** Entidades do Sistema

(Diagrama ER simplificado - 3 caixas com setas)

```
[Usuario] 1---N [NaoConformidade] 1---N [AcaoCorretiva]
```

- **Usuario**: nome, email, senha_hash, perfil (inspetor/gestor/responsavel)
- **NaoConformidade**: numero, titulo, descricao, tipo, gravidade, status, setor, causa_raiz
- **AcaoCorretiva**: descricao, responsavel, prazo, status, evidencia

---

## SLIDE 8 - CICLO DE VIDA DA NC

**Titulo:** Maquina de Estados

(Diagrama com blocos e setas - use cores para cada status)

```
[Aberta]  -->  [Em Tratamento]  -->  [Ag. Verificacao]  -->  [Encerrada]
   (azul)        (roxo)                  (amarelo)            (verde)

                  Em Tratamento  -->  [Cancelada]
                                        (cinza)

              Ag. Verificacao  -->  Em Tratamento (pode voltar)
```

Regras:
- Atribuir responsavel move automaticamente para "Em Tratamento"
- Encerrar exige causa raiz preenchida
- Encerrada e Cancelada sao estados finais

---

## SLIDE 9 - DEMONSTRACAO

**Titulo:** Demonstracao ao Vivo

(Slide simples, so para marcar a transicao antes de ir pro navegador)

Roteiro:
1. Login
2. Dashboard
3. Abrir nova NC
4. Listar e filtrar
5. Gestao da NC (responsavel, prazo, status)
6. Minha Fila

---

## SLIDE 10 - FUNCIONALIDADES ENTREGUES

**Titulo:** Funcionalidades

(Checklist visual - tudo marcado com check verde)

- [x] Login com JWT
- [x] Dashboard com 4 indicadores + ranking de desvios
- [x] Abertura de NCs com dados completos
- [x] Listagem com filtros (status, gravidade, tipo, busca)
- [x] Detalhe com gestao: responsavel, prazo, causa raiz
- [x] Ciclo de vida com transicoes controladas
- [x] Minha Fila ordenada por prioridade
- [x] Interface responsiva (desktop e mobile)
- [x] Validacao de dados no frontend e backend

---

## SLIDE 11 - DESTAQUES TECNICOS

**Titulo:** Destaques Tecnicos

(3-4 cards com titulo + descricao curta)

**Seguranca**
Helmet, bcrypt (salt 10), JWT com expiracao, validacao Zod em todo input

**Responsividade**
Tailwind CSS mobile-first, tabela no desktop, cards no mobile, menu hamburguer

**Performance**
Lazy loading nas rotas Angular, queries SQL otimizadas no dashboard, compression gzip

**Qualidade de Codigo**
TypeScript strict em ambas camadas, arquitetura em camadas, tratamento centralizado de erros

---

## SLIDE 12 - ENCERRAMENTO

**Titulo:** Obrigado!

QualidadePIM - Sistema de Registro de Nao Conformidades

Aluizio Neto
aluizioneto.dev@gmail.com
github.com/aluizio-n/sistema-nao-conformidades

(Espaco para perguntas)
