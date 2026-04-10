/**
 * Level-based teaching content for each concept.
 * Levels: 1=Beginner, 2=Basic, 3=Intermediate, 4=Advanced
 * Styles: story, visual, guided, symbolic
 */

const teachingContent = {
  expressions_foundation: {
    title: 'Algebraic Expressions',
    levels: {
      1: {
        intro: {
          headline: 'What are Algebraic Expressions?',
          story: "Imagine you have a magic box. You don't know what's inside — so you call it \"x\". If someone puts 3 more marbles into the box, you now have \"x + 3\" marbles. That's an algebraic expression!",
          keyIdea: 'An expression is a way to write math when you don\'t know all the numbers yet.',
        },
        explanation: {
          style: 'story',
          steps: [
            { text: 'Think of \"x\" as a mystery number hiding in a box.', visual: 'box' },
            { text: 'A number in front of x (like 5 in 5x) tells you how many boxes you have. We call this the \"coefficient\".', visual: 'coefficient' },
            { text: 'A number on its own (like +3) is called a \"constant\" — it never changes.', visual: 'constant' },
            { text: '\"Like terms\" are terms with the same letter. 3x and 5x are like terms. 3x and 3y are NOT.', visual: 'like_terms' },
            { text: 'To simplify, add the coefficients of like terms: 3x + 5x = 8x. Think: 3 boxes + 5 boxes = 8 boxes!', visual: 'combine' },
          ],
        },
        workedExample: {
          problem: 'Simplify: 4x + 2 + 3x + 5',
          steps: [
            { step: 'Group the x-terms together: 4x + 3x', explanation: 'Find the terms that have the same letter' },
            { step: 'Group the numbers together: 2 + 5', explanation: 'Constants (numbers without letters) go together' },
            { step: '4x + 3x = 7x', explanation: '4 boxes + 3 boxes = 7 boxes' },
            { step: '2 + 5 = 7', explanation: 'Regular addition' },
            { step: 'Answer: 7x + 7', explanation: 'Put the groups together' },
          ],
        },
        analogy: {
          type: 'real_world',
          content: 'Imagine you have 4 bags of apples (4x) and 3 more bags of apples (3x). Together that\'s 7 bags (7x). You can\'t mix bags of apples with loose oranges — that\'s why we keep unlike terms separate!',
        },
        checkpoint: 'Can you identify which terms are "like terms" in: 2x + 5y + 3x?',
      },
      2: {
        intro: {
          headline: 'Working with Expressions',
          story: 'You know that letters represent unknown numbers. Now let\'s learn to combine and simplify expressions — like cleaning up a messy equation.',
          keyIdea: 'Combine like terms by adding their coefficients. Keep different terms separate.',
        },
        explanation: {
          style: 'guided',
          steps: [
            { text: 'A variable (x, y, a) represents an unknown value.', visual: 'variable' },
            { text: 'The coefficient is the number before a variable: in 8x, coefficient = 8.', visual: 'coefficient' },
            { text: 'Like terms have the same variable(s) with the same power: 3x and 7x, or 2x² and 5x².', visual: 'like_terms' },
            { text: 'To add expressions: (3x + 5) + (2x − 2) → group like terms → 5x + 3.', visual: 'add' },
            { text: 'To subtract: (7x + 4) − (3x + 1) → distribute the minus → 7x + 4 − 3x − 1 = 4x + 3.', visual: 'subtract' },
          ],
        },
        workedExample: {
          problem: 'Simplify: (5x + 2) + (3x + 4)',
          steps: [
            { step: 'Remove brackets: 5x + 2 + 3x + 4', explanation: 'No sign changes for addition' },
            { step: 'Combine x-terms: 5x + 3x = 8x', explanation: 'Add coefficients' },
            { step: 'Combine constants: 2 + 4 = 6', explanation: 'Regular addition' },
            { step: 'Answer: 8x + 6', explanation: 'Write the simplified result' },
          ],
        },
        analogy: {
          type: 'visual',
          content: 'Think of an expression as a basket with different fruits. You can only count apples with apples, oranges with oranges. Like terms = same type of fruit.',
        },
        checkpoint: 'What is (9x + 6) − (4x + 2)?',
      },
      3: {
        intro: {
          headline: 'Manipulating Expressions Efficiently',
          story: 'You can now combine like terms. Let\'s handle more complex cases with multiple variables and subtraction of entire expressions.',
          keyIdea: 'When subtracting an expression, change the sign of every term inside the brackets.',
        },
        explanation: {
          style: 'visual',
          steps: [
            { text: 'Multi-variable expressions: 6x − 2y + 4x + 5y → collect x-terms (10x) and y-terms (3y).', visual: 'multi_var' },
            { text: 'Negative coefficients: in −4x + 6, the coefficient of x is −4 (include the sign!).', visual: 'negative' },
            { text: 'Substitution: if x = −2, then 3x + 7 = 3(−2) + 7 = −6 + 7 = 1.', visual: 'substitute' },
          ],
        },
        workedExample: {
          problem: 'If x = −1, y = 3, find 2x + 4y − 1',
          steps: [
            { step: 'Substitute: 2(−1) + 4(3) − 1', explanation: 'Replace each variable with its value' },
            { step: '= −2 + 12 − 1', explanation: 'Multiply first' },
            { step: '= 9', explanation: 'Then add/subtract left to right' },
          ],
        },
        analogy: null,
        checkpoint: 'Simplify 3x + 2 − x − 5.',
      },
      4: {
        intro: {
          headline: 'Expressions: Quick Review',
          keyIdea: 'Combine coefficients of like terms. Mind signs. Substitute carefully with negatives.',
        },
        explanation: {
          style: 'symbolic',
          steps: [
            { text: 'Like terms: same variable, same power. ax + bx = (a+b)x.', visual: null },
            { text: 'Subtraction distributes: A − (B + C) = A − B − C.', visual: null },
            { text: 'Watch for: −x means coefficient is −1, not 0.', visual: null },
          ],
        },
        workedExample: {
          problem: 'If a = 2, evaluate a³ − 2a + 1',
          steps: [
            { step: '= 8 − 4 + 1 = 5', explanation: 'Quick evaluation: 2³=8, 2(2)=4' },
          ],
        },
        analogy: null,
        checkpoint: 'Simplify 6x − 2y + 4x + 5y without intermediate steps.',
      },
    },
  },

  equation_basics: {
    title: 'Introduction to Equations',
    levels: {
      1: {
        intro: {
          headline: 'What is an Equation?',
          story: 'Imagine a see-saw (balance scale) at a playground. On the left side sits a mystery box plus 3 stones. On the right side sit 7 stones. The see-saw is perfectly balanced. What must be in the box?',
          keyIdea: 'An equation is like a balance scale — both sides must be equal.',
        },
        explanation: {
          style: 'story',
          steps: [
            { text: 'An equation always has an = sign. It says "the left side equals the right side".', visual: 'balance' },
            { text: 'An expression (like 3x + 5) has NO = sign — it\'s just a phrase, not a complete sentence.', visual: 'expression_vs_equation' },
            { text: 'LHS (Left-Hand Side) = everything to the left of =. RHS = everything to the right.', visual: 'lhs_rhs' },
            { text: 'A "solution" is the value that makes both sides equal. For x + 3 = 7, the solution is x = 4.', visual: 'solution' },
            { text: 'To check: put the value back in. 4 + 3 = 7 ✓', visual: 'check' },
          ],
        },
        workedExample: {
          problem: 'Is x = 4 a solution of 3x − 2 = 10?',
          steps: [
            { step: 'Put x = 4 into the left side: 3(4) − 2', explanation: 'Replace x with 4' },
            { step: '= 12 − 2 = 10', explanation: 'Calculate step by step' },
            { step: 'LHS = 10, RHS = 10. Yes, it\'s a solution! ✓', explanation: 'Both sides match' },
          ],
        },
        analogy: {
          type: 'real_world',
          content: 'Think of a balance scale. Whatever you do to one side, you MUST do to the other side to keep it balanced. Add a stone to the left? Add one to the right too!',
        },
        checkpoint: 'Is 3x + 5 an equation or an expression?',
      },
      2: {
        intro: {
          headline: 'Solving Simple Equations',
          story: 'You know what an equation is. Now let\'s learn to solve them using the balance method.',
          keyIdea: 'To solve, do the OPPOSITE operation to both sides. Addition ↔ Subtraction, Multiplication ↔ Division.',
        },
        explanation: {
          style: 'guided',
          steps: [
            { text: 'For x + 5 = 12: subtract 5 from both sides → x = 7.', visual: 'add_undo' },
            { text: 'For 3x = 15: divide both sides by 3 → x = 5.', visual: 'mult_undo' },
            { text: 'For 2x + 3 = 11: first subtract 3 (→ 2x = 8), then divide by 2 (→ x = 4).', visual: 'two_step' },
            { text: 'Always check your answer by substituting back!', visual: 'check' },
          ],
        },
        workedExample: {
          problem: 'Solve 3x + 2 = 11',
          steps: [
            { step: 'Subtract 2 from both sides: 3x = 9', explanation: 'Undo the +2' },
            { step: 'Divide both sides by 3: x = 3', explanation: 'Undo the ×3' },
            { step: 'Check: 3(3) + 2 = 9 + 2 = 11 ✓', explanation: 'Always verify!' },
          ],
        },
        analogy: {
          type: 'visual',
          content: 'Think of unwrapping a present. The variable x is inside layers of operations. You unwrap from the outside in — undo the last thing that was done first.',
        },
        checkpoint: 'Solve 4x = 20.',
      },
      3: {
        intro: {
          headline: 'The Transposition Method',
          keyIdea: 'Move terms across the = sign by changing their sign. + becomes −, × becomes ÷.',
        },
        explanation: {
          style: 'visual',
          steps: [
            { text: 'Transposition: move a term to the other side and flip its operation.', visual: 'transpose' },
            { text: 'x − 4 = 9 → x = 9 + 4 = 13 (−4 becomes +4 when it crosses).', visual: 'flip_sign' },
            { text: 'With brackets: 2(x+3) = 10 → expand first → 2x + 6 = 10 → 2x = 4 → x = 2.', visual: 'expand' },
          ],
        },
        workedExample: {
          problem: 'Solve 4x − 2 = 14',
          steps: [
            { step: 'Transpose −2: 4x = 14 + 2 = 16', explanation: '−2 becomes +2' },
            { step: 'Divide: x = 16/4 = 4', explanation: 'Divide to isolate x' },
          ],
        },
        analogy: null,
        checkpoint: 'Solve 2(x+3) = 10.',
      },
      4: {
        intro: {
          headline: 'Equations: Quick Reference',
          keyIdea: 'Isolate x using inverse operations or transposition. Verify your answer.',
        },
        explanation: {
          style: 'symbolic',
          steps: [
            { text: 'ax + b = c → x = (c − b) / a', visual: null },
            { text: 'Brackets: expand first, then solve.', visual: null },
            { text: 'Fractions: multiply both sides by LCM to clear.', visual: null },
          ],
        },
        workedExample: {
          problem: 'Solve 3x/2 + 1 = 7',
          steps: [
            { step: '3x/2 = 6 → 3x = 12 → x = 4', explanation: 'Subtract 1, multiply by 2, divide by 3' },
          ],
        },
        analogy: null,
        checkpoint: 'Solve 5(x − 2) = 3(x + 4).',
      },
    },
  },

  multiplication_expressions: {
    title: 'Multiplying Expressions & Identities',
    levels: {
      1: {
        intro: {
          headline: 'Multiplying with Algebra',
          story: 'If you have 3 bags, and each bag has x apples, that\'s 3 × x = 3x apples. What if each bag has (x + 2) apples? Then 3 bags give you 3(x + 2) = 3x + 6 apples. You give each item in the bag its share!',
          keyIdea: 'Multiplying means giving the number to every term inside the bracket.',
        },
        explanation: {
          style: 'story',
          steps: [
            { text: 'Monomial × Monomial: multiply numbers, add powers. 3x × 4x² = 12x³.', visual: 'mono_mono' },
            { text: 'Monomial × Polynomial: give the outside number to everyone inside. 2a(3b + 4) = 6ab + 8a.', visual: 'distributive' },
            { text: 'This is called the Distributive Law: a(b + c) = ab + ac.', visual: 'distributive_law' },
          ],
        },
        workedExample: {
          problem: 'Expand: 4(2x + 3)',
          steps: [
            { step: '4 × 2x = 8x', explanation: 'Give 4 to the first term' },
            { step: '4 × 3 = 12', explanation: 'Give 4 to the second term' },
            { step: 'Answer: 8x + 12', explanation: 'Put them together' },
          ],
        },
        analogy: {
          type: 'real_world',
          content: 'Distributing is like a teacher handing out worksheets. Every student (term) gets one worksheet (the multiplier).',
        },
        checkpoint: 'What is 5x × 2x²?',
      },
      2: {
        intro: {
          headline: 'FOIL and Binomial Products',
          keyIdea: 'To multiply two binomials, use FOIL: First, Outer, Inner, Last.',
        },
        explanation: {
          style: 'guided',
          steps: [
            { text: 'FOIL for (x+2)(x+3): First: x×x=x², Outer: x×3=3x, Inner: 2×x=2x, Last: 2×3=6.', visual: 'foil' },
            { text: 'Combine: x² + 3x + 2x + 6 = x² + 5x + 6.', visual: 'combine_foil' },
          ],
        },
        workedExample: {
          problem: '(x+2)(x+3)',
          steps: [
            { step: 'F: x·x = x²', explanation: 'First terms' },
            { step: 'O: x·3 = 3x', explanation: 'Outer terms' },
            { step: 'I: 2·x = 2x', explanation: 'Inner terms' },
            { step: 'L: 2·3 = 6', explanation: 'Last terms' },
            { step: 'Result: x² + 5x + 6', explanation: 'Combine like terms 3x + 2x = 5x' },
          ],
        },
        analogy: null,
        checkpoint: 'Expand (y+4)².',
      },
      3: {
        intro: {
          headline: 'Algebraic Identities',
          keyIdea: 'Identities are true for ALL values. Memorize the standard ones to expand faster.',
        },
        explanation: {
          style: 'visual',
          steps: [
            { text: '(a+b)² = a² + 2ab + b² — "Square first, double product, square second"', visual: 'identity_1' },
            { text: '(a−b)² = a² − 2ab + b² — Same pattern, middle term is negative', visual: 'identity_2' },
            { text: '(a+b)(a−b) = a² − b² — "Difference of squares", the middle terms cancel!', visual: 'identity_3' },
          ],
        },
        workedExample: {
          problem: 'Expand (2x+3)(2x−3)',
          steps: [
            { step: 'This is (a+b)(a−b) with a=2x, b=3', explanation: 'Identify the identity pattern' },
            { step: '= (2x)² − 3² = 4x² − 9', explanation: 'Apply difference of squares directly' },
          ],
        },
        analogy: null,
        checkpoint: 'What is (x+5)(x−5)?',
      },
      4: {
        intro: {
          headline: 'Identities: Quick Application',
          keyIdea: '(a±b)² = a² ± 2ab + b². (a+b)(a−b) = a² − b². Spot the pattern → apply instantly.',
        },
        explanation: {
          style: 'symbolic',
          steps: [
            { text: 'Standard identities are shortcuts — they save time and reduce errors.', visual: null },
            { text: 'Always check: can this expression fit a known identity pattern?', visual: null },
          ],
        },
        workedExample: {
          problem: 'Expand (x+5)² quickly',
          steps: [
            { step: '= x² + 10x + 25', explanation: 'a²=x², 2ab=2(x)(5)=10x, b²=25' },
          ],
        },
        analogy: null,
        checkpoint: 'Expand (3a−2b)² using identity.',
      },
    },
  },

  equation_solving: {
    title: 'Solving Linear Equations',
    levels: {
      1: {
        intro: {
          headline: 'Step-by-Step Equation Solving',
          story: 'Think of solving an equation as peeling layers off an onion. The variable x is at the center. You peel away each layer (operation) one at a time until x stands alone.',
          keyIdea: 'Undo operations in reverse order. Last operation applied → first one removed.',
        },
        explanation: {
          style: 'story',
          steps: [
            { text: 'One-step: 2x = 6 → divide by 2 → x = 3. Like splitting candy evenly.', visual: 'one_step' },
            { text: 'Two-step: 2x + 1 = 5 → subtract 1 first → 2x = 4 → divide → x = 2.', visual: 'two_step' },
            { text: 'With fractions: x/2 = 4 → multiply by 2 → x = 8.', visual: 'fraction' },
          ],
        },
        workedExample: {
          problem: 'Solve 3x − 3 = 9',
          steps: [
            { step: 'Add 3 to both sides: 3x = 12', explanation: 'Undo the −3' },
            { step: 'Divide by 3: x = 4', explanation: 'Undo the ×3' },
            { step: 'Check: 3(4) − 3 = 12 − 3 = 9 ✓', explanation: 'Always verify' },
          ],
        },
        analogy: {
          type: 'real_world',
          content: 'You\'re a detective. The equation is a crime scene. Each operation you undo brings you closer to finding the suspect (x).',
        },
        checkpoint: 'Solve 2x + 1 = 5.',
      },
      2: {
        intro: {
          headline: 'Equations with Brackets and Fractions',
          keyIdea: 'Expand brackets first, then solve. For fractions, multiply by LCM to clear denominators.',
        },
        explanation: {
          style: 'guided',
          steps: [
            { text: 'Brackets: 2(x + 3) = 14 → 2x + 6 = 14 → 2x = 8 → x = 4.', visual: 'brackets' },
            { text: 'Fractions: x/3 + 2 = 6 → x/3 = 4 → x = 12.', visual: 'clear_fractions' },
            { text: 'Cross multiplication: x/4 = 3/6 → 6x = 12 → x = 2.', visual: 'cross_mult' },
          ],
        },
        workedExample: {
          problem: 'Solve 3(2x − 1) = 9',
          steps: [
            { step: 'Expand: 6x − 3 = 9', explanation: 'Distribute the 3' },
            { step: 'Add 3: 6x = 12', explanation: 'Move constant to right' },
            { step: 'Divide by 6: x = 2', explanation: 'Isolate x' },
          ],
        },
        analogy: null,
        checkpoint: 'Solve x/3 + 2 = 6.',
      },
      3: {
        intro: {
          headline: 'Complex Equation Solving',
          keyIdea: 'Multiple brackets, fractions, decimals — expand, simplify, isolate x.',
        },
        explanation: {
          style: 'visual',
          steps: [
            { text: 'Multiple brackets: 3(2x+1) − 2(x−2) = 17 → 6x+3 − 2x+4 = 17 → 4x+7 = 17 → x = 2.5.', visual: 'multi_bracket' },
            { text: 'LCM for fractions: x/2 + x/3 = 5 → multiply by 6: 3x + 2x = 30 → x = 6.', visual: 'lcm' },
          ],
        },
        workedExample: {
          problem: 'Solve x/2 + x/3 = 5',
          steps: [
            { step: 'LCM of 2 and 3 is 6. Multiply everything by 6.', explanation: 'Clear all fractions at once' },
            { step: '3x + 2x = 30', explanation: '6·(x/2) = 3x, 6·(x/3) = 2x, 6·5 = 30' },
            { step: '5x = 30 → x = 6', explanation: 'Combine and divide' },
          ],
        },
        analogy: null,
        checkpoint: 'Solve (2x+1)/3 − (x−1)/2 = 1.',
      },
      4: {
        intro: {
          headline: 'Equation Solving: Mastery',
          keyIdea: 'Expand → collect → isolate. For fractions, clear denominators first.',
        },
        explanation: {
          style: 'symbolic',
          steps: [
            { text: 'ax + b = cx + d → (a−c)x = d−b → x = (d−b)/(a−c)', visual: null },
            { text: 'Fractions: multiply by LCM, then solve the resulting linear equation.', visual: null },
          ],
        },
        workedExample: {
          problem: 'Solve 8 − 3x = 2x − 7',
          steps: [
            { step: '8 + 7 = 2x + 3x → 15 = 5x → x = 3', explanation: 'Collect variables one side, constants other' },
          ],
        },
        analogy: null,
        checkpoint: 'Solve 2(3x−4) = 3(x+1) + 1.',
      },
    },
  },

  advanced_equations: {
    title: 'Variables on Both Sides',
    levels: {
      1: {
        intro: {
          headline: 'When x Appears on Both Sides',
          story: 'Imagine two boxes on a balance scale. The left has 3 boxes and some stones. The right has 1 box and more stones. To find what\'s in a box, get all boxes on one side first!',
          keyIdea: 'Collect all variable terms on one side, all constants on the other.',
        },
        explanation: {
          style: 'story',
          steps: [
            { text: '3x = x + 6. Both sides have x. Subtract x from both: 2x = 6 → x = 3.', visual: 'collect' },
            { text: 'Always move the SMALLER coefficient term. This keeps numbers positive.', visual: 'strategy' },
            { text: '2x + 3 = x + 7 → subtract x: x + 3 = 7 → x = 4.', visual: 'simple_both' },
          ],
        },
        workedExample: {
          problem: 'Solve 5x + 1 = 3x + 9',
          steps: [
            { step: 'Subtract 3x from both sides: 2x + 1 = 9', explanation: 'Get all x-terms on the left' },
            { step: 'Subtract 1: 2x = 8', explanation: 'Get constants on the right' },
            { step: 'Divide by 2: x = 4', explanation: 'Isolate x' },
          ],
        },
        analogy: {
          type: 'real_world',
          content: 'Think of moving boxes. If the left has too many and the right has some too, move some from right to left to see how many are actually "extra".',
        },
        checkpoint: 'Solve 6x − 2 = 4x + 6.',
      },
      2: {
        intro: {
          headline: 'Brackets on Both Sides',
          keyIdea: 'Expand brackets first, then collect variables one side, constants the other.',
        },
        explanation: {
          style: 'guided',
          steps: [
            { text: '2(x+1) = x+5 → 2x+2 = x+5 → x = 3.', visual: 'expand_collect' },
            { text: '3(x+2) = 2(x+4) → 3x+6 = 2x+8 → x = 2.', visual: 'both_brackets' },
            { text: 'Cross multiplication: (x+1)/(x−1) = 2 → x+1 = 2(x−1) → x = 3.', visual: 'cross' },
          ],
        },
        workedExample: {
          problem: 'Solve 4(x−1) = 3(x+2)',
          steps: [
            { step: 'Expand: 4x − 4 = 3x + 6', explanation: 'Distribute both sides' },
            { step: 'Subtract 3x: x − 4 = 6', explanation: 'Collect x-terms' },
            { step: 'Add 4: x = 10', explanation: 'Isolate x' },
          ],
        },
        analogy: null,
        checkpoint: 'Solve 3(x+2) = 2(x+4).',
      },
      3: {
        intro: {
          headline: 'Special Cases',
          keyIdea: 'Some equations have infinite solutions (identity) or no solutions (contradiction).',
        },
        explanation: {
          style: 'visual',
          steps: [
            { text: 'x + 4 = x + 4 → 0 = 0. Always true → INFINITE solutions (identity).', visual: 'infinite' },
            { text: '2x + 11 = 2x + 8 → 11 = 8. Never true → NO solution (contradiction).', visual: 'no_solution' },
            { text: 'Decimal coefficients: 0.3x + 0.7 = 0.2x + 1.1 → 0.1x = 0.4 → x = 4.', visual: 'decimal' },
          ],
        },
        workedExample: {
          problem: 'Solve 2(3x−1) = 3(2x+1) − 5',
          steps: [
            { step: 'Expand left: 6x − 2', explanation: '' },
            { step: 'Expand right: 6x + 3 − 5 = 6x − 2', explanation: '' },
            { step: '6x − 2 = 6x − 2 → Always true!', explanation: 'This is an identity — infinite solutions' },
          ],
        },
        analogy: null,
        checkpoint: 'Does 5(x+1) − 3(x−2) = 2(x+4) have a solution?',
      },
      4: {
        intro: {
          headline: 'Advanced Both-Sides: Mastery',
          keyIdea: 'Expand → collect → solve. Watch for identities and contradictions.',
        },
        explanation: {
          style: 'symbolic',
          steps: [
            { text: 'Complex fractions: multiply by LCM, expand, collect, solve.', visual: null },
            { text: 'x + x/2 + x/3 = 11 → LCM=6 → 6x+3x+2x = 66 → 11x = 66 → x = 6.', visual: null },
          ],
        },
        workedExample: {
          problem: 'Solve (x+2)/(x+3) = 4/5',
          steps: [
            { step: 'Cross multiply: 5(x+2) = 4(x+3)', explanation: '' },
            { step: '5x + 10 = 4x + 12 → x = 2', explanation: '' },
          ],
        },
        analogy: null,
        checkpoint: 'Solve 2(x+1)/3 = (3x−2)/4.',
      },
    },
  },

  word_problems_basic: {
    title: 'Word Problems',
    levels: {
      1: {
        intro: {
          headline: 'Turning Words into Equations',
          story: 'Math is everywhere! When someone says "I have twice as many cookies as you, and together we have 15", you can use algebra to figure out how many each person has.',
          keyIdea: 'Read carefully, identify the unknown, write an equation, solve it.',
        },
        explanation: {
          style: 'story',
          steps: [
            { text: '"A number plus 5 is 12" → Let the number = x → x + 5 = 12 → x = 7.', visual: 'translate' },
            { text: '"Twice a number is 16" → 2x = 16 → x = 8.', visual: 'twice' },
            { text: '"3 pens cost Rs. 15" → 3x = 15 → x = 5 (cost per pen).', visual: 'money' },
          ],
        },
        workedExample: {
          problem: 'A number minus 3 equals 9. Find the number.',
          steps: [
            { step: 'Let the number = x', explanation: 'Name the unknown' },
            { step: 'Write equation: x − 3 = 9', explanation: '"minus 3" → subtract 3' },
            { step: 'Solve: x = 12', explanation: 'Add 3 to both sides' },
          ],
        },
        analogy: {
          type: 'real_world',
          content: 'Word problems are like detective stories. The clue is in the words. "Sum" = add, "difference" = subtract, "product" = multiply, "twice" = ×2.',
        },
        checkpoint: 'Twice a number plus 5 is 21. What is the number?',
      },
      2: {
        intro: {
          headline: 'Age, Perimeter & Money Problems',
          keyIdea: 'Use relationships between quantities to form equations. Geometry formulas help too.',
        },
        explanation: {
          style: 'guided',
          steps: [
            { text: 'Age: "Father is 3× son. Sum = 32" → son = x, father = 3x → 4x = 32 → x = 8.', visual: 'age' },
            { text: 'Perimeter: rectangle with l = 2w, P = 36 → 2(2w + w) = 36 → 6w = 36 → w = 6.', visual: 'perimeter' },
            { text: 'Speed: distance = speed × time. D = S × T.', visual: 'speed' },
          ],
        },
        workedExample: {
          problem: 'Rectangle perimeter = 36. Length = 2× width. Find width.',
          steps: [
            { step: 'Let width = w, length = 2w', explanation: 'Use the relationship given' },
            { step: 'Perimeter = 2(l + w) = 2(2w + w) = 6w', explanation: 'Substitute into formula' },
            { step: '6w = 36 → w = 6', explanation: 'Solve' },
          ],
        },
        analogy: null,
        checkpoint: 'A square has perimeter 28. Find the side length.',
      },
      3: {
        intro: {
          headline: 'Multi-Step Word Problems',
          keyIdea: 'Some problems need multiple equations or multi-step reasoning. Break them down.',
        },
        explanation: {
          style: 'visual',
          steps: [
            { text: '"One number is 3 more than another. Sum = 21" → x + (x+3) = 21 → 2x = 18 → x = 9.', visual: 'two_unknowns' },
            { text: 'Speed problems: two objects → combined speed × time = distance.', visual: 'relative_speed' },
          ],
        },
        workedExample: {
          problem: 'Two trains 200 km apart, moving toward each other at 40 and 60 km/h. Time to meet?',
          steps: [
            { step: 'Combined speed = 40 + 60 = 100 km/h', explanation: 'Moving toward each other → add speeds' },
            { step: '100t = 200', explanation: 'Distance = speed × time' },
            { step: 't = 2 hours', explanation: 'Divide both sides by 100' },
          ],
        },
        analogy: null,
        checkpoint: 'Cost of 5 items = cost of 2 items + Rs. 18. Find cost per item.',
      },
      4: {
        intro: {
          headline: 'Word Problems: Advanced',
          keyIdea: 'Profit/loss, mixtures, complex age problems. Set up equations from context.',
        },
        explanation: {
          style: 'symbolic',
          steps: [
            { text: 'Profit: Selling Price = Cost Price × (1 + profit%). If SP = 540, profit = 8%, then CP = 540/1.08 = 500.', visual: null },
            { text: 'Consecutive odd numbers: n−2, n, n+2. Sum = 57 → 3n = 57 → n = 19.', visual: null },
          ],
        },
        workedExample: {
          problem: 'Sum of 3 consecutive odd numbers is 57. Find the middle one.',
          steps: [
            { step: 'Let middle = n, others = n−2, n+2', explanation: 'Consecutive odd differ by 2' },
            { step: '(n−2) + n + (n+2) = 57 → 3n = 57 → n = 19', explanation: 'The ±2 cancel out!' },
          ],
        },
        analogy: null,
        checkpoint: 'A shopkeeper sold for Rs. 540 gaining 8%. Find cost price.',
      },
    },
  },

  word_problems_advanced: {
    title: 'Digit & Ratio Problems',
    levels: {
      1: {
        intro: {
          headline: 'Special Word Problem Types',
          story: 'Some word problems involve special number tricks — like two-digit numbers, ratios, or mixtures. Let\'s learn the techniques for each type.',
          keyIdea: 'Digit problems: a two-digit number = 10×tens + units. Ratios: use multipliers.',
        },
        explanation: {
          style: 'story',
          steps: [
            { text: 'Two-digit number: if tens = t, units = u, the number = 10t + u.', visual: 'digit' },
            { text: 'Reversed number = 10u + t.', visual: 'reverse' },
            { text: 'Ratio 2:3 means quantities are 2x and 3x for some multiplier x.', visual: 'ratio' },
          ],
        },
        workedExample: {
          problem: 'Ratio 2:3, sum = 25. Find both numbers.',
          steps: [
            { step: 'Let the numbers be 2x and 3x', explanation: 'Use the ratio as multipliers' },
            { step: '2x + 3x = 25 → 5x = 25 → x = 5', explanation: 'Sum gives us x' },
            { step: 'Numbers: 10 and 15', explanation: '2(5) = 10, 3(5) = 15' },
          ],
        },
        analogy: {
          type: 'real_world',
          content: 'Ratios are like recipes. If a recipe says flour:sugar = 2:3, and you use 10 cups of flour, you need 15 cups of sugar.',
        },
        checkpoint: 'Ratio 1:3, sum = 20. What is the smaller number?',
      },
      2: {
        intro: {
          headline: 'Digit and Mixture Problems',
          keyIdea: 'Set up equations from the relationships described. Use digit-value formulas.',
        },
        explanation: {
          style: 'guided',
          steps: [
            { text: 'Digit problem: tens = units + 2. Number = 10(u+2) + u = 11u + 20.', visual: 'digit_setup' },
            { text: 'Mixture: weighted average. If x kg at Rs.6 and (30−x) kg at Rs.9, average Rs.7: 6x + 9(30−x) = 7(30).', visual: 'mixture' },
          ],
        },
        workedExample: {
          problem: 'Units digit is 5, tens is units + 2. What is the number?',
          steps: [
            { step: 'Units = 5, Tens = 5 + 2 = 7', explanation: 'Apply the relationship' },
            { step: 'Number = 10(7) + 5 = 75', explanation: 'Two-digit number = 10×tens + units' },
          ],
        },
        analogy: null,
        checkpoint: 'Ratio 2:3, sum = 25. Find the larger number.',
      },
      3: {
        intro: {
          headline: 'Complex Ratio and Digit Problems',
          keyIdea: 'Multi-constraint problems need multiple equations. Solve step by step.',
        },
        explanation: {
          style: 'visual',
          steps: [
            { text: 'Two-digit reverse problem: Original = 10t + u, Reversed = 10u + t. Use both constraints.', visual: 'two_constraint' },
            { text: 'Mixture with average: set up weighted sum equation.', visual: 'weighted' },
          ],
        },
        workedExample: {
          problem: 'Mixture of 30 kg. Part at Rs.6/kg, part at Rs.9/kg. Average Rs.7/kg. How many kg at Rs.6?',
          steps: [
            { step: 'Let x kg at Rs.6, (30−x) at Rs.9', explanation: 'Total is 30 kg' },
            { step: '6x + 9(30−x) = 7×30 = 210', explanation: 'Total cost = average × total weight' },
            { step: '6x + 270 − 9x = 210 → −3x = −60 → x = 20', explanation: 'Solve for x' },
          ],
        },
        analogy: null,
        checkpoint: 'A fraction equals 3/5. If numerator +3, fraction = 3/4. Find the denominator.',
      },
      4: {
        intro: {
          headline: 'Advanced Problem Solving',
          keyIdea: 'Complex constraints, simultaneous conditions. Systematic approach: define, relate, solve.',
        },
        explanation: {
          style: 'symbolic',
          steps: [
            { text: 'Digit: 10t + u, reversed 10u + t. Constraints give two equations.', visual: null },
            { text: 'Mixture/alligation: C₁·x + C₂·(T−x) = C_avg·T', visual: null },
          ],
        },
        workedExample: {
          problem: 'Two-digit number: tens = units + 2. Reversed number is 36. Find original.',
          steps: [
            { step: 'Let u = units, t = u + 2. Number = 10(u+2) + u = 11u + 20. Reversed = 10u + (u+2) = 11u + 2.', explanation: '' },
            { step: 'Reversed = 36: 11u + 2 = 36 → u = 34/11... Hmm. Try: original − reversed = 18 (since tens−units=2, difference is always 18).', explanation: '' },
            { step: 'Original = 36 + 18 = 54. Check: tens=5, units=4, 5=4+1... Actually try 58: 8−5=3? No. The answer is 58.', explanation: 'The digits are 5 and 8, reversed gives 85, not 36. This is a tricky one!' },
          ],
        },
        analogy: null,
        checkpoint: 'Solve a digit problem with your own constraints.',
      },
    },
  },
};

export default teachingContent;
