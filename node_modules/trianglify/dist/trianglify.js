'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Delaunator = _interopDefault(require('delaunator'));
var chroma = _interopDefault(require('chroma-js'));
var canvas = require('canvas');

/*
 * colorbrewer.js
 *
 * Colorbrewer colors, by Cindy Brewer
 */
var colorbrewer = {
  YlGn: ['#ffffe5', '#f7fcb9', '#d9f0a3', '#addd8e', '#78c679', '#41ab5d', '#238443', '#006837', '#004529'],
  YlGnBu: ['#ffffd9', '#edf8b1', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#253494', '#081d58'],
  GnBu: ['#f7fcf0', '#e0f3db', '#ccebc5', '#a8ddb5', '#7bccc4', '#4eb3d3', '#2b8cbe', '#0868ac', '#084081'],
  BuGn: ['#f7fcfd', '#e5f5f9', '#ccece6', '#99d8c9', '#66c2a4', '#41ae76', '#238b45', '#006d2c', '#00441b'],
  PuBuGn: ['#fff7fb', '#ece2f0', '#d0d1e6', '#a6bddb', '#67a9cf', '#3690c0', '#02818a', '#016c59', '#014636'],
  PuBu: ['#fff7fb', '#ece7f2', '#d0d1e6', '#a6bddb', '#74a9cf', '#3690c0', '#0570b0', '#045a8d', '#023858'],
  BuPu: ['#f7fcfd', '#e0ecf4', '#bfd3e6', '#9ebcda', '#8c96c6', '#8c6bb1', '#88419d', '#810f7c', '#4d004b'],
  RdPu: ['#fff7f3', '#fde0dd', '#fcc5c0', '#fa9fb5', '#f768a1', '#dd3497', '#ae017e', '#7a0177', '#49006a'],
  PuRd: ['#f7f4f9', '#e7e1ef', '#d4b9da', '#c994c7', '#df65b0', '#e7298a', '#ce1256', '#980043', '#67001f'],
  OrRd: ['#fff7ec', '#fee8c8', '#fdd49e', '#fdbb84', '#fc8d59', '#ef6548', '#d7301f', '#b30000', '#7f0000'],
  YlOrRd: ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026'],
  YlOrBr: ['#ffffe5', '#fff7bc', '#fee391', '#fec44f', '#fe9929', '#ec7014', '#cc4c02', '#993404', '#662506'],
  Purples: ['#fcfbfd', '#efedf5', '#dadaeb', '#bcbddc', '#9e9ac8', '#807dba', '#6a51a3', '#54278f', '#3f007d'],
  Blues: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'],
  Greens: ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b'],
  Oranges: ['#fff5eb', '#fee6ce', '#fdd0a2', '#fdae6b', '#fd8d3c', '#f16913', '#d94801', '#a63603', '#7f2704'],
  Reds: ['#fff5f0', '#fee0d2', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#a50f15', '#67000d'],
  Greys: ['#ffffff', '#f0f0f0', '#d9d9d9', '#bdbdbd', '#969696', '#737373', '#525252', '#252525', '#000000'],
  PuOr: ['#7f3b08', '#b35806', '#e08214', '#fdb863', '#fee0b6', '#f7f7f7', '#d8daeb', '#b2abd2', '#8073ac', '#542788', '#2d004b'],
  BrBG: ['#543005', '#8c510a', '#bf812d', '#dfc27d', '#f6e8c3', '#f5f5f5', '#c7eae5', '#80cdc1', '#35978f', '#01665e', '#003c30'],
  PRGn: ['#40004b', '#762a83', '#9970ab', '#c2a5cf', '#e7d4e8', '#f7f7f7', '#d9f0d3', '#a6dba0', '#5aae61', '#1b7837', '#00441b'],
  PiYG: ['#8e0152', '#c51b7d', '#de77ae', '#f1b6da', '#fde0ef', '#f7f7f7', '#e6f5d0', '#b8e186', '#7fbc41', '#4d9221', '#276419'],
  RdBu: ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#f7f7f7', '#d1e5f0', '#92c5de', '#4393c3', '#2166ac', '#053061'],
  RdGy: ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#ffffff', '#e0e0e0', '#bababa', '#878787', '#4d4d4d', '#1a1a1a'],
  RdYlBu: ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee090', '#ffffbf', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695'],
  Spectral: ['#9e0142', '#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#e6f598', '#abdda4', '#66c2a5', '#3288bd', '#5e4fa2'],
  RdYlGn: ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850', '#006837']
};

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function getScalingRatio (ctx) {
  // adapted from https://gist.github.com/callumlocke/cc258a193839691f60dd
  const backingStoreRatio = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
  const devicePixelRatio = typeof window !== 'undefined' && window.devicePixelRatio || 1;
  const drawRatio = devicePixelRatio / backingStoreRatio;
  return drawRatio;
}

const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
const doc = isBrowser && document; // utility for building up SVG node trees with the DOM API

const sDOM = (tagName, attrs = {}, children, existingRoot) => {
  const elem = existingRoot || doc.createElementNS('http://www.w3.org/2000/svg', tagName);
  Object.keys(attrs).forEach(k => attrs[k] !== undefined && elem.setAttribute(k, attrs[k]));
  children && children.forEach(c => elem.appendChild(c));
  return elem;
}; // serialize attrs object to XML attributes. Assumes everything is already
// escaped (safe input).


const serializeAttrs = attrs => Object.entries(attrs).filter(([_, v]) => v !== undefined).map(([k, v]) => `${k}='${v}'`).join(' '); // minimal XML-tree builder for use in Node


const sNode = (tagName, attrs = {}, children) => ({
  tagName,
  attrs,
  children,
  toString: () => `<${tagName} ${serializeAttrs(attrs)}>${children ? children.join('') : ''}</${tagName}>`
});

class Pattern {
  constructor(_points, _polys, _opts) {
    _defineProperty(this, "_toSVG", (serializer, destSVG, _svgOpts = {}) => {
      const s = serializer;
      const defaultSVGOptions = {
        includeNamespace: true,
        coordinateDecimals: 1
      };
      const svgOpts = { ...defaultSVGOptions,
        ..._svgOpts
      };
      const {
        points,
        opts,
        polys
      } = this;
      const {
        width,
        height
      } = opts; // only round points if the coordinateDecimals option is non-negative
      // set coordinateDecimals to -1 to disable point rounding

      const roundedPoints = svgOpts.coordinateDecimals < 0 ? points : points.map(p => p.map(x => +x.toFixed(svgOpts.coordinateDecimals)));
      const paths = polys.map(poly => {
        const xys = poly.vertexIndices.map(i => `${roundedPoints[i][0]},${roundedPoints[i][1]}`);
        const d = 'M' + xys.join('L') + 'Z';
        const hasStroke = opts.strokeWidth > 0; // shape-rendering crispEdges resolves the antialiasing issues, at the
        // potential cost of some visual degradation. For the best performance
        // *and* best visual rendering, use Canvas.

        return s('path', {
          d,
          fill: opts.fill ? poly.color.css() : undefined,
          stroke: hasStroke ? poly.color.css() : undefined,
          'stroke-width': hasStroke ? opts.strokeWidth : undefined,
          'stroke-linejoin': hasStroke ? 'round' : undefined,
          'shape-rendering': opts.fill ? 'crispEdges' : undefined
        });
      });
      const svg = s('svg', {
        xmlns: svgOpts.includeNamespace ? 'http://www.w3.org/2000/svg' : undefined,
        width,
        height
      }, paths, destSVG);
      return svg;
    });

    _defineProperty(this, "toSVGTree", svgOpts => this._toSVG(sNode, null, svgOpts));

    _defineProperty(this, "toSVG", isBrowser ? (destSVG, svgOpts) => this._toSVG(sDOM, destSVG, svgOpts) : (destSVG, svgOpts) => this.toSVGTree(svgOpts));

    _defineProperty(this, "toCanvas", (destCanvas, _canvasOpts = {}) => {
      const defaultCanvasOptions = {
        scaling: isBrowser ? 'auto' : false,
        applyCssScaling: !!isBrowser
      };
      const canvasOpts = { ...defaultCanvasOptions,
        ..._canvasOpts
      };
      const {
        points,
        polys,
        opts
      } = this;
      const canvas$1 = destCanvas || canvas.createCanvas(opts.width, opts.height); // doc.createElement('canvas')

      const ctx = canvas$1.getContext('2d');

      if (canvasOpts.scaling) {
        const drawRatio = canvasOpts.scaling === 'auto' ? getScalingRatio(ctx) : canvasOpts.scaling;

        if (drawRatio !== 1) {
          // set the 'real' canvas size to the higher width/height
          canvas$1.width = opts.width * drawRatio;
          canvas$1.height = opts.height * drawRatio;

          if (canvasOpts.applyCssScaling) {
            // ...then scale it back down with CSS
            canvas$1.style.width = opts.width + 'px';
            canvas$1.style.height = opts.height + 'px';
          }
        } else {
          // this is a normal 1:1 device: don't apply scaling
          canvas$1.width = opts.width;
          canvas$1.height = opts.height;

          if (canvasOpts.applyCssScaling) {
            canvas$1.style.width = '';
            canvas$1.style.height = '';
          }
        }

        ctx.scale(drawRatio, drawRatio);
      }

      const drawPoly = (poly, fill, stroke) => {
        const vertexIndices = poly.vertexIndices;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(points[vertexIndices[0]][0], points[vertexIndices[0]][1]);
        ctx.lineTo(points[vertexIndices[1]][0], points[vertexIndices[1]][1]);
        ctx.lineTo(points[vertexIndices[2]][0], points[vertexIndices[2]][1]);
        ctx.closePath();

        if (fill) {
          ctx.fillStyle = fill.color.css();
          ctx.fill();
        }

        if (stroke) {
          ctx.strokeStyle = stroke.color.css();
          ctx.lineWidth = stroke.width;
          ctx.stroke();
        }
      };

      if (opts.fill && opts.strokeWidth < 1) {
        // draw background strokes at edge bounds to solve for white gaps due to
        // canvas antialiasing. See https://stackoverflow.com/q/19319963/381299
        polys.forEach(poly => drawPoly(poly, null, {
          color: poly.color,
          width: 2
        }));
      } // draw visible fills and strokes


      polys.forEach(poly => drawPoly(poly, opts.fill && {
        color: poly.color
      }, opts.strokeWidth > 0 && {
        color: poly.color,
        width: opts.strokeWidth
      }));
      return canvas$1;
    });

    this.points = _points;
    this.polys = _polys;
    this.opts = _opts;
  }

}

// Fast seeded RNG adapted from the public-domain implementation
// by @byrc: https://github.com/bryc/code/blob/master/jshash/PRNGs.md
//
// Usage:
// const randFn = mulberry32('string seed')
// const randomNumber = randFn() // [0, 1] random float
function mulberry32(seed) {
  if (!seed) {
    seed = Math.random().toString(36);
  } // support no-seed usage


  var a = xmur3(seed)();
  return function () {
    a |= 0;
    a = a + 0x6D2B79F5 | 0;
    var t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function xmur3(str) {
  for (var i = 0, h = 1779033703 ^ str.length; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = h << 13 | h >>> 19;
  }

  return function () {
    h = Math.imul(h ^ h >>> 16, 2246822507);
    h = Math.imul(h ^ h >>> 13, 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

// Given an array of coordinates representing a triangle, find the centroid
// of the triangle and return it as an {x, y} object
// Accepts a single [[x, y], [x, y], [x, y]] argument
const getCentroid = d => {
  return {
    x: (d[0][0] + d[1][0] + d[2][0]) / 3,
    y: (d[0][1] + d[1][1] + d[2][1]) / 3
  };
};

//
// Usage example:
//
// const pattern = trianglify({
//  width: 300,
//  height: 200,
//  colorFunction: trianglify.colorFunctions.sparkle(0.2)
// })
//
// the snippet above gives you a trianglify pattern with a 20% random
// jitter applied to the x and y gradient scales
// Linear interpolation of two gradients, one for the x and one for the y
// axis. This is the default Trianglify color function.
// The bias parameter controls how prevalent the y axis is versus the x axis

const interpolateLinear = (bias = 0.5) => ({
  xPercent,
  yPercent,
  xScale,
  yScale,
  opts
}) => chroma.mix(xScale(xPercent), yScale(yPercent), bias, opts.colorSpace); // Give the pattern a 'sparkle' effect by introducing random noise into the
// x and y gradients, making for higher contrast between cells.

const sparkle = (jitterFactor = 0.15) => ({
  xPercent,
  yPercent,
  xScale,
  yScale,
  opts,
  random
}) => {
  const jitter = () => (random() - 0.5) * jitterFactor;

  const a = xScale(xPercent + jitter());
  const b = yScale(yPercent + jitter());
  return chroma.mix(a, b, 0.5, opts.colorSpace);
}; // This is similar to the sparkle effect, but instead of swapping colors around
// it darkens cells by a random amount. The shadowIntensity parameter controls
// how dark the darkest shadows are.

const shadows = (shadowIntensity = 0.8) => {
  return ({
    xPercent,
    yPercent,
    xScale,
    yScale,
    opts,
    random
  }) => {
    const a = xScale(xPercent);
    const b = yScale(yPercent);
    const color = chroma.mix(a, b, 0.5, opts.colorSpace);
    return color.darken(shadowIntensity * random());
  };
};

var colorFunctions = /*#__PURE__*/Object.freeze({
  __proto__: null,
  interpolateLinear: interpolateLinear,
  sparkle: sparkle,
  shadows: shadows
});

/*
 * Trianglify.js
 * by @qrohlf
 *
 * Licensed under the GPLv3
 */
const defaultOptions = {
  width: 600,
  height: 400,
  cellSize: 75,
  variance: 0.75,
  seed: null,
  xColors: 'random',
  yColors: 'match',
  palette: colorbrewer,
  colorSpace: 'lab',
  colorFunction: interpolateLinear(0.5),
  fill: true,
  strokeWidth: 0,
  points: null
}; // This function does the "core" render-independent work:
//
// 1. Parse and munge options
// 2. Setup cell geometry
// 3. Generate random points within cell geometry
// 4. Use the Delaunator library to run the triangulation
// 5. Do color interpolation to establish the fundamental coloring of the shapes

function trianglify(_opts = {}) {
  Object.keys(_opts).forEach(k => {
    if (defaultOptions[k] === undefined) {
      throw TypeError(`Unrecognized option: ${k}`);
    }
  });
  const opts = { ...defaultOptions,
    ..._opts
  };

  if (!(opts.height > 0)) {
    throw TypeError(`invalid height: ${opts.height}`);
  }

  if (!(opts.width > 0)) {
    throw TypeError(`invalid width: ${opts.width}`);
  } // standard randomizer, used for point gen and layout


  const rand = mulberry32(opts.seed);

  const randomFromPalette = () => {
    if (opts.palette instanceof Array) {
      return opts.palette[Math.floor(rand() * opts.palette.length)];
    }

    const keys = Object.keys(opts.palette);
    return opts.palette[keys[Math.floor(rand() * keys.length)]];
  }; // The first step here is to set up our color scales for the X and Y axis.
  // First, munge the shortcut options like 'random' or 'match' into real color
  // arrays. Then, set up a Chroma scale in the appropriate color space.


  const processColorOpts = colorOpt => {
    switch (true) {
      case Array.isArray(colorOpt):
        return colorOpt;

      case !!opts.palette[colorOpt]:
        return opts.palette[colorOpt];

      case colorOpt === 'random':
        return randomFromPalette();

      default:
        throw TypeError(`Unrecognized color option: ${colorOpt}`);
    }
  };

  const xColors = processColorOpts(opts.xColors);
  const yColors = opts.yColors === 'match' ? xColors : processColorOpts(opts.yColors);
  const xScale = chroma.scale(xColors).mode(opts.colorSpace);
  const yScale = chroma.scale(yColors).mode(opts.colorSpace); // Our next step is to generate a pseudo-random grid of {x, y} points,
  // (or to simply utilize the points that were passed to us)

  const points = opts.points || getPoints(opts, rand); // Once we have the points array, run the triangulation

  var geomIndices = Delaunator.from(points).triangles; // ...and then generate geometry and color data:
  // use a different (salted) randomizer for the color function so that
  // swapping out color functions doesn't change the pattern geometry itself

  const salt = 42;
  const cRand = mulberry32(opts.seed ? opts.seed + salt : null);
  const polys = [];

  for (let i = 0; i < geomIndices.length; i += 3) {
    // convert shallow array-packed vertex indices into 3-tuples
    const vertexIndices = [geomIndices[i], geomIndices[i + 1], geomIndices[i + 2]]; // grab a copy of the actual vertices to use for calculations

    const vertices = vertexIndices.map(i => points[i]);
    const {
      width,
      height
    } = opts;

    const norm = num => Math.max(0, Math.min(1, num));

    const centroid = getCentroid(vertices);
    const xPercent = norm(centroid.x / width);
    const yPercent = norm(centroid.y / height);
    const color = opts.colorFunction({
      centroid,
      // centroid of polygon, non-normalized
      xPercent,
      // x-coordinate of centroid, normalized to [0, 1]
      yPercent,
      // y-coordinate of centroid, normalized to [0, 1]
      vertexIndices,
      // vertex indices of the polygon
      vertices,
      // [x, y] vertices of the polygon
      xScale,
      // x-colors scale for the pattern
      yScale,
      // y-colors scale for the pattern
      points,
      // array of generated points for the pattern
      opts,
      // options used to initialize the pattern
      random: cRand // seeded randomization function for use by color functions

    });
    polys.push({
      vertexIndices,
      centroid,
      color // chroma color object

    });
  }

  return new Pattern(points, polys, opts);
}

const getPoints = (opts, random) => {
  const {
    width,
    height,
    cellSize,
    variance
  } = opts; // pad by 2 cells outside the visible area on each side to ensure we fully
  // cover the 'artboard'

  const colCount = Math.floor(width / cellSize) + 4;
  const rowCount = Math.floor(height / cellSize) + 4; // determine bleed values to ensure that the grid is centered within the
  // artboard

  const bleedX = (colCount * cellSize - width) / 2;
  const bleedY = (rowCount * cellSize - height) / 2; // apply variance to cellSize to get cellJitter in pixels

  const cellJitter = cellSize * variance;

  const getJitter = () => (random() - 0.5) * cellJitter;

  const pointCount = colCount * rowCount;
  const halfCell = cellSize / 2;
  const points = Array(pointCount).fill(null).map((_, i) => {
    const col = i % colCount;
    const row = Math.floor(i / colCount); // [x, y, z]

    return [-bleedX + col * cellSize + halfCell + getJitter(), -bleedY + row * cellSize + halfCell + getJitter()];
  });
  return points;
}; // tweak some of the exports here


trianglify.utils = {
  mix: chroma.mix,
  colorbrewer
};
trianglify.colorFunctions = colorFunctions;
trianglify.Pattern = Pattern;
trianglify.defaultOptions = defaultOptions;

module.exports = trianglify;
