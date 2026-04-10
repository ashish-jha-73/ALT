const lessons = {
  expressions_foundation: {
    1: {
      title: 'Expressions Basics',
      objective: 'Understand variable terms, like terms, and combining expressions.',
      steps: [
        'A term can be a number, variable, or product like 3x.',
        'Like terms have the same variable part (x with x, y with y).',
        'Only coefficients are combined for like terms.',
        'Constants are numbers without variables (e.g., the 5 in 2x + 5).',
      ],
      worked_example: '2x + 5x = 7x (add coefficients: 2+5=7, keep x)',
      checkpoint: 'Can you identify which terms are like terms in 3x + 5y + 2x?',
    },
    2: {
      title: 'Adding & Subtracting Expressions',
      objective: 'Combine positive and negative coefficients. Add and subtract expressions.',
      steps: [
        'To add expressions: remove brackets and combine like terms.',
        'To subtract: change the sign of each term being subtracted.',
        'Rewrite subtraction as adding a negative number.',
        'Add integer coefficients carefully, keeping the variable unchanged.',
      ],
      worked_example: '(5x + 2) + (3x + 4) = 8x + 6; (7x + 4) − (3x + 1) = 4x + 3',
      checkpoint: 'What is (9x + 6) − (4x + 2)?',
    },
    3: {
      title: 'Challenge: Multi-Term Simplification',
      objective: 'Group variable terms and constants in complex expressions.',
      steps: [
        'Collect variable terms (x-terms, y-terms) together.',
        'Collect constants together.',
        'Handle negative coefficients carefully (include the sign).',
        'Simplify each group and combine.',
      ],
      worked_example: '6x − 2y + 4x + 5y = 10x + 3y',
      checkpoint: 'Can you simplify 3x + 2 − x − 5?',
    },
  },
  multiplication_expressions: {
    1: {
      title: 'Multiplying Monomials & Distributive Law',
      objective: 'Multiply monomials and expand brackets using the distributive property.',
      steps: [
        'Monomial × Monomial: multiply numbers, add exponents. 3x × 4x² = 12x³.',
        'Distributive Law: a(b + c) = ab + ac. Multiply outside by each inside term.',
        'Preserve signs when distributing.',
      ],
      worked_example: '2a(3b + 4) = 6ab + 8a',
      checkpoint: 'What is 4(2x + 3)?',
    },
    2: {
      title: 'Binomial × Binomial (FOIL Method)',
      objective: 'Use FOIL to multiply two binomials.',
      steps: [
        'FOIL: First, Outer, Inner, Last.',
        'Multiply each pair and add all results.',
        'Combine any like terms at the end.',
      ],
      worked_example: '(x+2)(x+3) = x² + 3x + 2x + 6 = x² + 5x + 6',
      checkpoint: 'Expand (y+4)² using FOIL.',
    },
    3: {
      title: 'Algebraic Identities',
      objective: 'Apply standard algebraic identities for quick expansion.',
      steps: [
        '(a+b)² = a² + 2ab + b²',
        '(a−b)² = a² − 2ab + b²',
        '(a+b)(a−b) = a² − b² (Difference of Squares)',
        'Identify the pattern first, then apply the identity.',
      ],
      worked_example: '(2x+3)(2x−3) = 4x² − 9',
      checkpoint: 'What is (x+5)(x−5)?',
    },
  },
  equation_basics: {
    1: {
      title: 'What is an Equation?',
      objective: 'Understand equations vs expressions, LHS, RHS, and solutions.',
      steps: [
        'An equation has an = sign. An expression does not.',
        'LHS = left of equals. RHS = right of equals.',
        'A solution makes both sides equal.',
        'Linear means the variable has power 1 (not x², x³).',
      ],
      worked_example: 'x + 3 = 7 → x = 4 (because 4 + 3 = 7)',
      checkpoint: 'Is 3x + 5 an equation or an expression?',
    },
    2: {
      title: 'The Balance Method',
      objective: 'Use inverse operations to solve equations.',
      steps: [
        'Think of an equation as a balanced scale.',
        'Whatever you do to one side, do to the other.',
        'Addition undoes subtraction. Division undoes multiplication.',
        'Always check your answer by substituting back.',
      ],
      worked_example: '3x + 2 = 11 → 3x = 9 → x = 3. Check: 3(3)+2=11 ✓',
      checkpoint: 'Solve x + 6 = 10.',
    },
    3: {
      title: 'Two-Step Equations',
      objective: 'Solve equations requiring two operations.',
      steps: [
        'First remove the constant from the variable side.',
        'Then divide by the coefficient.',
        'Order matters: undo addition/subtraction before multiplication/division.',
      ],
      worked_example: '2x + 5 = 17 → 2x = 12 → x = 6',
      checkpoint: 'Solve 4x + 3 = 19.',
    },
  },
  equation_solving: {
    1: {
      title: 'Transposition Method',
      objective: 'Solve equations by moving terms across the equals sign.',
      steps: [
        'Transposition: move a term to the other side and flip its sign.',
        '+ becomes −, − becomes +, × becomes ÷, ÷ becomes ×.',
        'Collect all variable terms on one side, constants on the other.',
      ],
      worked_example: 'x − 5 = 8 → x = 8 + 5 = 13',
      checkpoint: 'Solve 4x − 2 = 14.',
    },
    2: {
      title: 'Equations with Brackets',
      objective: 'Expand brackets then solve.',
      steps: [
        'Expand brackets using distributive law first.',
        'Collect like terms.',
        'Solve the resulting simple equation.',
      ],
      worked_example: '2(x+3) = 10 → 2x + 6 = 10 → 2x = 4 → x = 2',
      checkpoint: 'Solve 3(2x − 1) = 9.',
    },
    3: {
      title: 'Equations with Fractions',
      objective: 'Clear fractions and solve.',
      steps: [
        'Find the LCM of all denominators.',
        'Multiply every term by the LCM to clear fractions.',
        'Solve the resulting whole-number equation.',
        'Cross-multiplication works for proportion equations.',
      ],
      worked_example: 'x/3 + x/4 = 7 → multiply by 12: 4x + 3x = 84 → 7x = 84 → x = 12',
      checkpoint: 'Solve x/3 = 4.',
    },
  },
  advanced_equations: {
    1: {
      title: 'Variables on Both Sides',
      objective: 'Solve equations where x appears on both sides.',
      steps: [
        'Collect all x-terms on one side (usually the left).',
        'Collect all constants on the other side.',
        'Move the smaller coefficient term to keep numbers positive.',
      ],
      worked_example: '3x = x + 6 → 3x − x = 6 → 2x = 6 → x = 3',
      checkpoint: 'Solve 5x + 1 = 3x + 9.',
    },
    2: {
      title: 'Brackets on Both Sides',
      objective: 'Expand brackets then collect terms.',
      steps: [
        'Expand brackets on both sides.',
        'Collect variable terms on one side.',
        'Collect constants on the other side.',
        'Solve as a simple equation.',
      ],
      worked_example: '2(x+1) = x+5 → 2x+2 = x+5 → x = 3',
      checkpoint: 'Solve 3(x+2) = 2(x+4).',
    },
    3: {
      title: 'Special Cases & Complex Equations',
      objective: 'Handle identities, contradictions, and complex forms.',
      steps: [
        'If simplifying gives 0 = 0, the equation is an identity (infinite solutions).',
        'If simplifying gives a false statement like 5 = 3, there is no solution.',
        'For decimals, multiply to remove decimal points first.',
        'For fractions on both sides, cross-multiply.',
      ],
      worked_example: 'x + 4 = x + 4 → 0 = 0 → Infinite solutions!',
      checkpoint: 'Does 5(x+1) − 3(x−2) = 2(x+4) have a solution?',
    },
  },
  word_problems_basic: {
    1: {
      title: 'Translate Story to Equation',
      objective: 'Convert verbal statements into algebra equations.',
      steps: [
        'Identify the unknown quantity and assign a variable.',
        'Translate phrases: "sum" = +, "difference" = −, "twice" = 2×, "product" = ×.',
        'Build the equation and solve it.',
      ],
      worked_example: '"A number plus 5 is 12" → x + 5 = 12 → x = 7',
      checkpoint: 'Translate: "Twice a number minus 3 is 11."',
    },
    2: {
      title: 'Age, Perimeter & Money Problems',
      objective: 'Set up equations from real-world scenarios.',
      steps: [
        'Age problems: use relationships like "father is 3× son".',
        'Perimeter: P = 2(l+w) for rectangles, P = 4s for squares.',
        'Money: cost = price × quantity. D = S × T for speed problems.',
      ],
      worked_example: 'Father 3× son, sum=32: son=x, 3x+x=32, x=8, father=24',
      checkpoint: 'A square has perimeter 28. Find the side.',
    },
    3: {
      title: 'Multi-Step & Speed Problems',
      objective: 'Solve complex word problems with multiple relationships.',
      steps: [
        'Break down the problem into known and unknown parts.',
        'Use formulas: Distance = Speed × Time.',
        'For approaching objects, add speeds. For same direction, subtract.',
      ],
      worked_example: 'Two trains 200km apart, 40+60=100km/h, t=200/100=2 hours',
      checkpoint: 'Cost of 5 items = cost of 2 items + Rs.18. Find cost per item.',
    },
  },
  word_problems_advanced: {
    1: {
      title: 'Digit & Ratio Problems',
      objective: 'Solve problems involving two-digit numbers and ratios.',
      steps: [
        'Two-digit number = 10×(tens digit) + units digit.',
        'Reversed number = 10×(units) + tens.',
        'Ratio a:b means quantities are ax and bx.',
      ],
      worked_example: 'Ratio 2:3, sum=25 → 2x+3x=25 → 5x=25 → x=5. Numbers: 10 and 15.',
      checkpoint: 'Ratio 1:3, sum=20. Smaller?',
    },
    2: {
      title: 'Mixture & Proportion Problems',
      objective: 'Set up weighted average equations.',
      steps: [
        'Mixture: Total cost = sum of (quantity × rate) for each part.',
        'Proportion: cross-multiply to solve.',
        'Check that your answer satisfies all given conditions.',
      ],
      worked_example: '30kg mix: x@6, (30-x)@9, avg 7 → 6x+9(30-x)=210 → x=20',
      checkpoint: 'If x/4 = 3/6, what is x?',
    },
    3: {
      title: 'Advanced Problem Solving',
      objective: 'Handle complex multi-constraint problems.',
      steps: [
        'Read carefully, identify ALL constraints.',
        'Set up one or more equations.',
        'Solve step by step, checking each constraint.',
        'Validate the answer against the original problem.',
      ],
      worked_example: 'Selling price 540, profit 8% → CP×1.08=540 → CP=500',
      checkpoint: 'Sum of 3 consecutive odd numbers is 57. Find the middle one.',
    },
  },
};

module.exports = lessons;
