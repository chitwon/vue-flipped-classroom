export function gcd (a, b) {
  return b ? gcd(b, a % b) : a
}
// let eqtext0 = returnEqText0()
export function reduce (numerator, denominator) {
  let cd = gcd(numerator, denominator)
  return [numerator / cd, denominator / cd]
}

export function returnRandomPrime (max) {
  let PrimeNumbers = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]
  if (!(max > 0)) max = 4
  if (max > PrimeNumbers.length) max = PrimeNumbers.length
  return PrimeNumbers[Math.floor(Math.random() * max)]
}

export function factorToPrimes (Katex) {
  let a = returnRandomPrime()
  let b = returnRandomPrime()
  let pa = (1 + Math.floor(Math.random() * 4))
  let pb = (1 + Math.floor(Math.random() * 4))
  let steps = []
  let product = null
  let step = null
  // let pow = null
  if (a === b) {
    pa = pa + pb
    pb = 1
    if (pa > 4) pa = 4
    step = Katex.renderToString(' \\color{red}{' + a.toString() + '} ') + ' is a factor of' + Katex.renderToString(Math.pow(a, pa).toString())
    product = Math.pow(a, pa)
  } else {
    step = 'Both ' + Katex.renderToString(' \\color{red}{' + a.toString() + '} ') + ' and ' + Katex.renderToString(b.toString()) + ' are factors of' + Katex.renderToString(Math.pow(a, pa).toString())
    product = Math.pow(a, pa) * Math.pow(b, pb)
  }
  steps.push({step: step, hint: 'Try to think of what can divide ' + Katex.renderToString(product.toString()) + ' into an integer.'})
  let ques = '<p> Factor to primes ' + ' a ' + a + ' b ' + b + ' pa ' + pa + ' pb ' + pb + ' pr ' + Katex.renderToString(product.toString()) + '</p>'
  let sol = '<p>' + Katex.renderToString(product.toString()) + '</p>'
  let r = product   // at first write a*r
  let f1 = ''
  for (let i = 0; i < pa; i++) {
    steps.push({step: 'Divide ' + Katex.renderToString(r.toString()) + ' by ' + Katex.renderToString(' \\color{red}{' + a.toString() + '} ')})
    f1 += Katex.renderToString(' \\times \\color{red}{' + a.toString() + '} ')
    r = r / a
    let string = Katex.renderToString(r.toString()) + f1
    sol += '<p>' + Katex.renderToString(' = ') + string + '</p>'
  }
  // f1 = Katex.renderToString((r / b).toString() + ' \\times ') + f1
  // let f2 = Katex.renderToString(b.toString())
  // r = r * a
  for (let i = 0; i < pb - 1; i++) {
    r = r / b
    let times = ' \\times '
    if (i === 0) times = ''
    f1 = Katex.renderToString(b.toString() + times) + f1
    let string = Katex.renderToString(r.toString() + '\\times ') + f1
    sol += '<p>' + Katex.renderToString(' = ') + string + '</p>'
  }
  let ansb = ''
  let ansa = ''
  if (pa === 1) {
    ansa = Katex.renderToString(' \\color{red}{' + a.toString() + '} ')
  } else {
    ansa = Katex.renderToString(' \\color{red}{' + a.toString() + '}^{' + pa + '}')
  }
  if (pb === 1) {
    ansb = Katex.renderToString(b.toString() + ' \\times ')
  } else if (pb !== 0) {
    ansb = Katex.renderToString('{' + b.toString() + '}^{' + pb + '}' + ' \\times ')
  }
  return {ques: ques, sol: sol + '<p>Answer: ' + ansb + ansa + '</p>', hint: 'hint', steps: steps}
}
