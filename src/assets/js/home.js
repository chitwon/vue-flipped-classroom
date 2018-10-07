/**
 * Created by Peter on 1/7/2018.
 */
export function text (Katex) {
  let text = simpleRoot(Katex)
  return text
}

export function factorABC (Katex) {
  reduce(40, 4)
  return writeFractionReduced(Katex, 40, 4)
}

function simpleRoot (Katex) {
  let base = Math.floor((Math.random() * 20) + 2)
  let base2 = base * base
  let ques = 'This is an example of a solution using random dynamic numbers. Problems are generated with variations ' +
    'so students can practice as many problems as desired.'
  ques += '<h3>Simplify: ' + Katex.renderToString('\\sqrt{\\color{red}{' + base2 + ' }}') + '</h3>'
  ques += '<br><p>Factor the inside to make a pair</p>'
  ques += '<p>' + Katex.renderToString('\\sqrt{\\color{red}{(' + base + ')(' + base + ') }}') + '</p>'
  ques += '<br><p>Simplify the expression</p>'
  ques += '<p>' + Katex.renderToString('\\sqrt{\\color{red}{' + base2 + ' }} = \\sqrt{\\color{red}{(' + base + ')(' + base + ') }} = ' + base) + '</p>'
  return ques
}

function gcd (a, b) {
  return b ? gcd(b, a % b) : a
}
// let eqtext0 = returnEqText0()
export function reduce (numerator, denominator) {
  let cd = gcd(numerator, denominator)
  return [numerator / cd, denominator / cd]
}

function writeFractionReduced (Katex, num, den, colorNum, colorDen) {
  let frac = reduce(num, den)
  return Katex.renderToString('\\frac{' + frac[0] + '}{' + frac[1] + '}')
}
