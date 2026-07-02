# CurvionBH Simu

Simulador didático de computação gráfica para visualizar, na prática, como
curvas de **Bézier** e **Hermite** são construídas a partir de pontos de
controle. Projeto desenvolvido durante a faculdade, usando [Paper.js](http://paperjs.org/)
para o desenho vetorial no `<canvas>`.

🔗 **Demo ao vivo:** https://gustavomrv.github.io/Bezier_and_Hermite_Curves/

## Funcionalidades

- **6 tipos de curva**, cada um em sua própria tela:
  - Bézier Linear (grau 1)
  - Bézier Quadrática (grau 2)
  - Bézier Cúbica (grau 3)
  - Hermite 2 Pontos
  - Hermite 3 Pontos (spline com 2 segmentos)
  - Hermite 4 Pontos (spline com 3 segmentos)
- **Coordenadas via formulário** — informe X/Y de cada ponto de controle em
  campos na barra lateral, sem precisar editar código.
- **Desenho sob demanda** — a curva só é desenhada ao clicar em "Desenhar
  Curva"; a tela abre em branco.
- **Grade numerada e rótulos de coordenadas** desenhados diretamente no
  canvas, além de um indicador ao vivo da posição do mouse, para facilitar
  encontrar as coordenadas certas.
- **Exportação em PNG** — baixa uma imagem com a curva, a grade e as
  coordenadas de cada ponto.
- Tema visual verde/preto/ciano/amarelo, com as telas de Bézier e Hermite
  separadas na tela inicial.

## Como usar

É um site **100% estático**, sem build nem dependências de servidor. Basta
abrir `index.html` diretamente no navegador, ou publicar a pasta em qualquer
servidor de arquivos estáticos (é assim que o GitHub Pages já publica este
repositório).

## Estrutura do projeto

```
index.html          Tela inicial (apresentação + navegação)
grau1.html           Bézier Linear
quadratica.html       Bézier Quadrática
cubica.html            Bézier Cúbica
hermite2.html      Hermite 2 Pontos
hermite3.html      Hermite 3 Pontos
hermite4.html      Hermite 4 Pontos

curvion.css          Tema visual e layout (sidebar, formulários, cards)
curvion.js            Matemática das curvas e helpers de desenho (Paper.js)
paper.js               Biblioteca Paper.js (desenho vetorial)
```

Os arquivos `jquery.js`, `codemirror.js`, `scripts.js` e o `style.css`
original fazem parte da versão anterior do projeto (baseada no site de
documentação do Paper.js, com um editor de código embutido) e não são mais
referenciados pelas telas atuais — mantidos no repositório apenas por
histórico.

## Matemática por trás das curvas

Cada curva é calculada manualmente (sem usar as primitivas de curva nativas
do Paper.js), amostrando o parâmetro `t` de 0 a 1:

- **Bézier**: combinação dos pontos de controle pelos polinômios de
  Bernstein (grau 1, 2 ou 3).
- **Hermite**: combinação de dois pontos e duas tangentes pelas funções de
  blending cúbicas de Hermite (`h00`, `h10`, `h01`, `h11`).

## Licença

Projeto acadêmico, sem licença formal definida.
