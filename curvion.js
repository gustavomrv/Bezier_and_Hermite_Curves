// curvion.js
// Utilidades compartilhadas de matematica e desenho para o Curvion,
// usadas pelas 6 paginas de curvas (Bezier grau 1/2/3 e Hermite 2/3/4 pontos).

const Curvion = (() => {
  let canvasEl;

  function setup(canvasId, readoutId) {
    canvasEl = document.getElementById(canvasId);
    paper.setup(canvasEl);
    resize();
    window.addEventListener('resize', resize);

    if (readoutId) {
      const readout = document.getElementById(readoutId);
      canvasEl.addEventListener('mousemove', (e) => {
        const rect = canvasEl.getBoundingClientRect();
        const x = Math.round(e.clientX - rect.left);
        const y = Math.round(e.clientY - rect.top);
        readout.textContent = 'X: ' + x + '   Y: ' + y;
      });
      canvasEl.addEventListener('mouseleave', () => {
        readout.textContent = '';
      });
    }
  }

  function resize() {
    paper.view.viewSize = new paper.Size(canvasEl.clientWidth, canvasEl.clientHeight);
  }

  function clear() {
    paper.project.activeLayer.removeChildren();
  }

  function readPoint(prefix) {
    const x = parseFloat(document.getElementById(prefix + '-x').value);
    const y = parseFloat(document.getElementById(prefix + '-y').value);
    return [x, y];
  }

  function allValid(points) {
    return points.every(([x, y]) => Number.isFinite(x) && Number.isFinite(y));
  }

  function sample(fn, steps = 40) {
    const points = [];
    for (let i = 0; i <= steps; i++) {
      points.push(fn(i / steps));
    }
    return points;
  }

  function bezierLinear(t, P0, P1) {
    return [
      P0[0] * (1 - t) + P1[0] * t,
      P0[1] * (1 - t) + P1[1] * t,
    ];
  }

  function bezierQuadratic(t, P0, P1, P2) {
    const a = (1 - t) * (1 - t), b = 2 * (1 - t) * t, c = t * t;
    return [
      P0[0] * a + P1[0] * b + P2[0] * c,
      P0[1] * a + P1[1] * b + P2[1] * c,
    ];
  }

  function bezierCubic(t, P0, P1, P2, P3) {
    const mt = 1 - t;
    const a = mt * mt * mt, b = 3 * mt * mt * t, c = 3 * mt * t * t, d = t * t * t;
    return [
      P0[0] * a + P1[0] * b + P2[0] * c + P3[0] * d,
      P0[1] * a + P1[1] * b + P2[1] * c + P3[1] * d,
    ];
  }

  // Hermite cubica: P0, P1 sao os pontos inicial/final; T0, T1 sao usados
  // como no projeto original (coordenadas do "ponto" de tangencia, nao um
  // vetor delta) -- mantido igual ao calculo original do projeto.
  function hermite(t, P0, P1, T0, T1) {
    const t2 = t * t, t3 = t2 * t;
    const h00 = 2 * t3 - 3 * t2 + 1;
    const h10 = t3 - 2 * t2 + t;
    const h01 = -2 * t3 + 3 * t2;
    const h11 = t3 - t2;
    return [
      P0[0] * h00 + T0[0] * h10 + P1[0] * h01 + T1[0] * h11,
      P0[1] * h00 + T0[1] * h10 + P1[1] * h01 + T1[1] * h11,
    ];
  }

  function drawPoint(pos, color, radius = 8) {
    const circle = new paper.Path.Circle(new paper.Point(pos[0], pos[1]), radius);
    circle.fillColor = color;
    return circle;
  }

  function drawLabel(pos, text, color = '#123a22') {
    const label = new paper.PointText(new paper.Point(pos[0] + 12, pos[1] - 10));
    label.content = text;
    label.fillColor = color;
    label.fontSize = 11;
    label.fontFamily = 'Consolas, "Courier New", monospace';
    label.fontWeight = 'bold';
    return label;
  }

  // Grade numerada (regua) desenhada nas coordenadas reais do canvas, para
  // que o usuario consiga localizar visualmente onde cada X/Y cai. Tambem
  // pinta um fundo solido primeiro, para que a exportacao em PNG (que le o
  // canvas diretamente) nao saia com fundo transparente.
  function drawGrid(step = 50) {
    const w = paper.view.size.width;
    const h = paper.view.size.height;
    const lineColor = '#1f7a46';
    const textColor = '#4c6b57';

    const background = new paper.Path.Rectangle(new paper.Point(0, 0), new paper.Size(w, h));
    background.fillColor = '#f3fff6';

    for (let x = 0; x <= w; x += step) {
      const line = new paper.Path.Line(new paper.Point(x, 0), new paper.Point(x, h));
      line.strokeColor = lineColor;
      line.strokeWidth = 1;
      line.opacity = 0.25;
      if (x > 0) {
        const label = new paper.PointText(new paper.Point(x + 3, 12));
        label.content = String(x);
        label.fillColor = textColor;
        label.fontSize = 10;
        label.fontFamily = 'Consolas, "Courier New", monospace';
      }
    }
    for (let y = 0; y <= h; y += step) {
      const line = new paper.Path.Line(new paper.Point(0, y), new paper.Point(w, y));
      line.strokeColor = lineColor;
      line.strokeWidth = 1;
      line.opacity = 0.25;
      if (y > 0) {
        const label = new paper.PointText(new paper.Point(3, y - 3));
        label.content = String(y);
        label.fillColor = textColor;
        label.fontSize = 10;
        label.fontFamily = 'Consolas, "Courier New", monospace';
      }
    }
  }

  function drawLine(pA, pB, color, width = 2) {
    const path = new paper.Path(new paper.Point(pA[0], pA[1]), new paper.Point(pB[0], pB[1]));
    path.strokeColor = color;
    path.strokeWidth = width;
    return path;
  }

  function drawPolyline(points, color, width = 3) {
    const path = new paper.Path();
    path.strokeColor = color;
    path.strokeWidth = width;
    points.forEach(([x, y]) => path.add(new paper.Point(x, y)));
    return path;
  }

  // Exporta o canvas atual (curva + grade + rotulos de coordenadas ja
  // desenhados nele) como um arquivo PNG, disparando o download no navegador.
  function exportPNG(filename = 'curva.png') {
    if (!canvasEl) return;
    const dataUrl = canvasEl.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return {
    setup, clear, readPoint, allValid, sample,
    bezierLinear, bezierQuadratic, bezierCubic, hermite,
    drawPoint, drawLine, drawPolyline, drawLabel, drawGrid, exportPNG,
  };
})();
