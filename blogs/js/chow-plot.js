/*
 * NOTICE: This is AI generated code from Claude's Opus 5.5 Extra.
 *
 * Per Anthropic's Commercial Terms of Service
 * (https://www.anthropic.com/legal/commercial-terms):
 *
 *   As between the parties and to the extent permitted by applicable law,
 *   Anthropic agrees that Customer (a) retains all rights to its Inputs, and
 *   (b) owns its Outputs. Anthropic disclaims any rights it receives to the
 *   Customer Content under these Terms. Subject to Customer’s compliance with
 *   these Terms, Anthropic hereby assigns to Customer its right, title and
 *   interest (if any) in and to Outputs. Anthropic may not train models on
 *   Customer Content from Services. “Inputs” means submissions to the
 *   Services by Customer or its Users and “Outputs” means responses generated
 *   by the Services to Inputs (Inputs and Outputs together are “Customer
 *   Content”).
 */

/*
 * Interactive plot of the modified Chow's rule from "Make or Buy:
 * The Economics of Decision Models".
 *
 *   Answer when:  p_max × NX_errcost(max) / C'  >  1 − NX_err − NX_price / C'
 *
 * The curve is the right-hand side, plotted against C' (the ticket's average
 * cost of a mistake, log scale). Above the curve: answer. Below: hand on.
 *
 * Usage (anywhere in the page body):
 *   <div id="chow-plot"></div>
 *   <script src="./js/chow-plot.js"></script>
 *
 * No dependencies. Text and lines use currentColor, so the plot follows the
 * page's text color (works in light and dark themes).
 */
(function () {
  "use strict";

  const CONFIG = {
    containerId: "chow-plot",
    errDefault: 0.05, // NX_err
    errMax: 0.5,
    priceDefault: 0.01, // NX_price
    priceLogMin: -3, // NX_price slider from 10^-3 ...
    priceLogMax: 1, // ... to 10^1
    xLogMin: -3, // C' axis from 10^-3 ...
    xLogMax: 3, // ... to 10^3
    answerColor: "#1D9E75",
    handOnColor: "#D85A30",
    fillOpacity: 0.15,
  };

  const container = document.getElementById(CONFIG.containerId);
  if (!container) return;

  const NS = "http://www.w3.org/2000/svg";
  const W = 680, H = 380;
  const M = { left: 64, right: 24, top: 18, bottom: 52 };
  const PW = W - M.left - M.right;
  const PH = H - M.top - M.bottom;

  const X = (c) => M.left + ((Math.log10(c) - CONFIG.xLogMin) / (CONFIG.xLogMax - CONFIG.xLogMin)) * PW;
  const Y = (q) => M.top + (1 - q) * PH;
  const fmt = (v) => String(Number(v.toPrecision(2)));

  // ---------- Controls ----------
  function makeSlider(labelHtml, min, max, step, value) {
    const row = document.createElement("div");
    row.style.cssText = "display:flex;align-items:center;gap:12px;margin:6px 0;";
    const label = document.createElement("label");
    label.innerHTML = labelHtml;
    label.style.cssText = "min-width:84px;";
    const input = document.createElement("input");
    input.type = "range";
    input.min = min;
    input.max = max;
    input.step = step;
    input.value = value;
    input.style.cssText = "flex:1;";
    const out = document.createElement("span");
    out.style.cssText = "min-width:56px;text-align:right;font-variant-numeric:tabular-nums;";
    row.append(label, input, out);
    container.appendChild(row);
    return { input, out };
  }

  const errCtl = makeSlider("NX<sub>err</sub>", 0, CONFIG.errMax, 0.01, CONFIG.errDefault);
  const priceCtl = makeSlider(
    "NX<sub>price</sub>",
    CONFIG.priceLogMin,
    CONFIG.priceLogMax,
    0.1,
    Math.log10(CONFIG.priceDefault)
  );

  // ---------- SVG ----------
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("role", "img");
  svg.setAttribute(
    "aria-label",
    "Answer threshold against C prime on a log scale. Above the curve, answer; below it, hand on to the next level."
  );
  svg.style.cssText = "display:block;width:100%;height:auto;margin-top:12px;font-family:inherit;";
  container.appendChild(svg);

  function el(tag, attrs, text) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (text !== undefined) e.textContent = text;
    svg.appendChild(e);
    return e;
  }

  // Text with subscripts: parts = [["NX", false], ["err", true], [" = 0.95", false]]
  function richText(attrs, parts, fontSize) {
    const t = el("text", Object.assign({ "font-size": fontSize }, attrs));
    let inSub = false;
    for (const [str, sub] of parts) {
      const span = document.createElementNS(NS, "tspan");
      span.textContent = str;
      if (sub && !inSub) span.setAttribute("dy", "4");
      if (!sub && inSub) span.setAttribute("dy", "-4");
      if (sub) span.setAttribute("font-size", Math.round(fontSize * 0.75));
      inSub = sub;
      t.appendChild(span);
    }
    return t;
  }

  function draw() {
    const err = parseFloat(errCtl.input.value);
    const price = Math.pow(10, parseFloat(priceCtl.input.value));
    errCtl.out.textContent = err.toFixed(2);
    priceCtl.out.textContent = fmt(price);

    while (svg.firstChild) svg.removeChild(svg.firstChild);

    // Curve: threshold = 1 − NX_err − NX_price / C', clamped to [0, 1]
    const pts = [];
    for (let i = 0; i <= 240; i++) {
      const lx = CONFIG.xLogMin + (i * (CONFIG.xLogMax - CONFIG.xLogMin)) / 240;
      const c = Math.pow(10, lx);
      const q = Math.max(0, Math.min(1, 1 - err - price / c));
      pts.push(`${X(c).toFixed(1)},${Y(q).toFixed(1)}`);
    }
    const line = pts.join(" ");
    const xl = X(Math.pow(10, CONFIG.xLogMin));
    const xr = X(Math.pow(10, CONFIG.xLogMax));

    // Regions
    el("polygon", {
      points: `${line} ${xr},${Y(1)} ${xl},${Y(1)}`,
      fill: CONFIG.answerColor,
      "fill-opacity": CONFIG.fillOpacity,
    });
    el("polygon", {
      points: `${line} ${xr},${Y(0)} ${xl},${Y(0)}`,
      fill: CONFIG.handOnColor,
      "fill-opacity": CONFIG.fillOpacity,
    });

    // Gridlines and y ticks
    [0, 0.25, 0.5, 0.75, 1].forEach((q) => {
      el("line", { x1: M.left, x2: W - M.right, y1: Y(q), y2: Y(q), stroke: "currentColor", "stroke-opacity": 0.15 });
      el("text", { x: M.left - 8, y: Y(q) + 4, "text-anchor": "end", fill: "currentColor", "fill-opacity": 0.7, "font-size": 12 }, q.toFixed(2));
    });

    // x ticks (decades)
    for (let d = CONFIG.xLogMin; d <= CONFIG.xLogMax; d++) {
      const c = Math.pow(10, d);
      el("line", { x1: X(c), x2: X(c), y1: Y(0), y2: Y(0) + 5, stroke: "currentColor", "stroke-opacity": 0.4 });
      el("text", { x: X(c), y: Y(0) + 19, "text-anchor": "middle", fill: "currentColor", "fill-opacity": 0.7, "font-size": 12 }, String(c));
    }

    // Asymptote: 1 − NX_err
    el("line", { x1: M.left, x2: W - M.right, y1: Y(1 - err), y2: Y(1 - err), stroke: "currentColor", "stroke-opacity": 0.6, "stroke-width": 1.2, "stroke-dasharray": "6 5" });
    richText(
      { x: W - M.right - 4, y: Y(1 - err) - 6, "text-anchor": "end", fill: "currentColor", "fill-opacity": 0.8 },
      [["1 − NX", false], ["err", true], [` = ${(1 - err).toFixed(2)}`, false]],
      12
    );

    // Crossover: C' = NX_price / NX_err (fee = mistakes)
    if (err > 0) {
      const cx = price / err;
      if (cx >= Math.pow(10, CONFIG.xLogMin) && cx <= Math.pow(10, CONFIG.xLogMax)) {
        el("line", { x1: X(cx), x2: X(cx), y1: Y(0), y2: Y(1), stroke: "currentColor", "stroke-opacity": 0.6, "stroke-width": 1.2, "stroke-dasharray": "2 4" });
        el("text", { x: X(cx) + 5, y: Y(0) - 8, fill: "currentColor", "fill-opacity": 0.8, "font-size": 12 }, `fee = mistakes, C′ = ${fmt(cx)}`);
      }
    }

    // Curve on top
    el("polyline", { points: line, fill: "none", stroke: "currentColor", "stroke-width": 2, "stroke-linejoin": "round", "stroke-linecap": "round" });

    // Region labels
    el("text", { x: M.left + 16, y: M.top + 22, fill: CONFIG.answerColor, "font-size": 14, "font-weight": 600 }, "Answer");
    el("text", { x: W - M.right - 16, y: Y(0.18), "text-anchor": "end", fill: CONFIG.handOnColor, "font-size": 14, "font-weight": 600 }, "Hand on");

    // Axis titles
    el("text", { x: M.left + PW / 2, y: H - 10, "text-anchor": "middle", fill: "currentColor", "fill-opacity": 0.8, "font-size": 13 }, "C′, this ticket’s average cost of a mistake (log scale)");
    const yMid = M.top + PH / 2;
    richText(
      { x: 16, y: yMid, "text-anchor": "middle", transform: `rotate(-90 16 ${yMid})`, fill: "currentColor", "fill-opacity": 0.8 },
      [["p", false], ["max", true], [" × NX", false], ["errcost", true], ["(max) / C′", false]],
      13
    );
  }

  errCtl.input.addEventListener("input", draw);
  priceCtl.input.addEventListener("input", draw);
  draw();
})();
