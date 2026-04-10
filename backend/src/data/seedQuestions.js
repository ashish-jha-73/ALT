// Helper to build a question object concisely
function q(text, opts, answer, concept, level, diff, type, skills, misc, hints, explanation, depth) {
  return {
    question_text: text,
    options: opts,
    correct_answer: answer,
    concept,
    level,
    difficulty: diff,
    question_type: type || 'mcq',
    skills: skills || [],
    misconception_target: misc || 'concept_error',
    cognitive_level: diff === 'hard' ? 'analyze' : diff == 'medium' ? 'apply' : 'recall',
    story_based: false,
    time_expected: diff === 'easy' ? 45 : diff === 'medium' ? 60 : 90,
    hints: hints || ['Think step by step.', 'Check your operations.', 'Verify with substitution.'],
    explanation: explanation || '',
    explanation_depth: depth || (diff === 'easy' ? 'short' : diff === 'medium' ? 'medium' : 'deep'),
  };
}


const questions = [
  {
    "question_text": "Which of the following is a monomial?",
    "options": [
      "x + y",
      "2x²",
      "3a + 4b",
      "p + q + r"
    ],
    "correct_answer": "2x²",
    "concept": "expressions_foundation",
    "level": 1,
    "difficulty": "easy",
    "question_type": "mcq",
    "skills": [
      "identify_variables",
      "identify_like_terms"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "recall",
    "story_based": false,
    "time_expected": 45,
    "hints": [
      "Read the question carefully before checking options.",
      "Eliminate obviously wrong options first.",
      "Substitute your answer back to verify."
    ],
    "explanation": "A monomial has only one term. 2x² is a single term.",
    "explanation_depth": "short"
  },
  {
    "question_text": "Which pair consists of like terms?",
    "options": [
      "3x and 3y",
      "5xy and 5x",
      "7x² and −2x²",
      "4xy and 4x²y"
    ],
    "correct_answer": "7x² and −2x²",
    "concept": "expressions_foundation",
    "level": 1,
    "difficulty": "easy",
    "question_type": "mcq",
    "skills": [
      "identify_variables",
      "identify_like_terms"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "recall",
    "story_based": false,
    "time_expected": 45,
    "hints": [
      "Read the question carefully before checking options.",
      "Eliminate obviously wrong options first.",
      "Substitute your answer back to verify."
    ],
    "explanation": "Like terms share the same variable(s) with the same exponents. Both have x².",
    "explanation_depth": "short"
  },
  {
    "question_text": "What is the coefficient of xy in the term 7xy?",
    "options": [
      "x",
      "y",
      "7",
      "7xy"
    ],
    "correct_answer": "7",
    "concept": "expressions_foundation",
    "level": 1,
    "difficulty": "easy",
    "question_type": "mcq",
    "skills": [
      "identify_variables",
      "identify_like_terms"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "recall",
    "story_based": false,
    "time_expected": 45,
    "hints": [
      "Read the question carefully before checking options.",
      "Eliminate obviously wrong options first.",
      "Substitute your answer back to verify."
    ],
    "explanation": "The numerical factor of a term is its coefficient. In 7xy, the coefficient is 7.",
    "explanation_depth": "short"
  },
  {
    "question_text": "The result of adding (3x + 2y) and (5x − 4y) is:",
    "options": [
      "8x − 2y",
      "8x + 6y",
      "2x − 2y",
      "8x − 6y"
    ],
    "correct_answer": "8x − 2y",
    "concept": "expressions_foundation",
    "level": 2,
    "difficulty": "medium",
    "question_type": "mcq",
    "skills": [
      "identify_variables",
      "identify_like_terms"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Identify what the question is asking for.",
      "Write out the key information.",
      "Check your arithmetic step by step."
    ],
    "explanation": "3x + 5x = 8x and 2y − 4y = −2y.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Subtract (3x − 5) from (7x + 2):",
    "options": [
      "4x + 7",
      "4x − 3",
      "10x − 3",
      "4x + 3"
    ],
    "correct_answer": "4x + 7",
    "concept": "expressions_foundation",
    "level": 2,
    "difficulty": "medium",
    "question_type": "mcq",
    "skills": [
      "identify_variables",
      "identify_like_terms"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Identify what the question is asking for.",
      "Write out the key information.",
      "Check your arithmetic step by step."
    ],
    "explanation": "(7x + 2) − (3x − 5) = 7x + 2 − 3x + 5 = 4x + 7.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "What is the coefficient of xy in the expression 4x²y − 3xy + 2xy²?",
    "options": [
      "4",
      "−3",
      "2",
      "3"
    ],
    "correct_answer": "−3",
    "concept": "expressions_foundation",
    "level": 3,
    "difficulty": "hard",
    "question_type": "mcq",
    "skills": [
      "identify_variables",
      "identify_like_terms"
    ],
    "misconception_target": "equation_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Look for key words: \"increased by\", \"times\", \"ratio\".",
      "Set up the equation before solving.",
      "Verify your answer satisfies all conditions."
    ],
    "explanation": "The term with xy (not x²y or xy²) is −3xy, so the coefficient of xy is −3.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "How many terms does the expression 5x² − 3x + 7 have?",
    "options": [
      "1",
      "2",
      "3",
      "4"
    ],
    "correct_answer": "3",
    "concept": "expressions_foundation",
    "level": 1,
    "difficulty": "easy",
    "question_type": "mcq",
    "skills": [
      "identify_variables",
      "identify_like_terms"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "recall",
    "story_based": false,
    "time_expected": 45,
    "hints": [
      "Read the question carefully before checking options.",
      "Eliminate obviously wrong options first.",
      "Substitute your answer back to verify."
    ],
    "explanation": "The three terms are 5x², −3x, and 7. An expression with three terms is a trinomial.",
    "explanation_depth": "short"
  },
  {
    "question_text": "Which of the following is NOT a like term to 4ab?",
    "options": [
      "−9ab",
      "ab",
      "2ab",
      "4a²b"
    ],
    "correct_answer": "4a²b",
    "concept": "expressions_foundation",
    "level": 2,
    "difficulty": "medium",
    "question_type": "mcq",
    "skills": [
      "identify_variables",
      "identify_like_terms"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Identify what the question is asking for.",
      "Write out the key information.",
      "Check your arithmetic step by step."
    ],
    "explanation": "4a²b has a² (power 2), while 4ab has a (power 1). Different powers means they are unlike terms.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "If P = 3x² + 5x − 1 and Q = x² − 2x + 4, what is P − Q?",
    "options": [
      "2x² + 7x − 5",
      "2x² + 3x + 3",
      "4x² + 3x + 3",
      "2x² + 7x + 3"
    ],
    "correct_answer": "2x² + 7x − 5",
    "concept": "expressions_foundation",
    "level": 3,
    "difficulty": "hard",
    "question_type": "mcq",
    "skills": [
      "identify_variables",
      "identify_like_terms"
    ],
    "misconception_target": "equation_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Look for key words: \"increased by\", \"times\", \"ratio\".",
      "Set up the equation before solving.",
      "Verify your answer satisfies all conditions."
    ],
    "explanation": "P − Q = (3x²−x²) + (5x−(−2x)) + (−1−4) = 2x² + 7x − 5.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "An expression with exactly two terms is called a ________.",
    "correct_answer": "binomial",
    "concept": "expressions_foundation",
    "level": 1,
    "difficulty": "easy",
    "question_type": "fill_blank",
    "options": ["binomial", "polynomial"],
    "skills": [
      "identify_like_terms",
      "combine_coefficients"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "recall",
    "story_based": false,
    "time_expected": 45,
    "hints": [
      "Isolate the unknown on one side.",
      "Use inverse operations to undo each step.",
      "Check your answer by substituting back."
    ],
    "explanation": "Monomial=1 term, Binomial=2 terms, Trinomial=3 terms.",
    "explanation_depth": "short"
  },
  {
    "question_text": "7x and 14x are ________ terms because they have the same variable raised to the same power.",
    "correct_answer": "like",
    "concept": "expressions_foundation",
    "level": 1,
    "difficulty": "easy",
    "question_type": "fill_blank",
    "options": ["like", "unlike"],
    "skills": [
      "identify_like_terms",
      "combine_coefficients"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "recall",
    "story_based": false,
    "time_expected": 45,
    "hints": [
      "Isolate the unknown on one side.",
      "Use inverse operations to undo each step.",
      "Check your answer by substituting back."
    ],
    "explanation": "Like terms share the same variable(s) with the same exponents.",
    "explanation_depth": "short"
  },
  {
    "question_text": "In the expression 7xy − 5x, the coefficient of the first term is ________.",
    "correct_answer": "7",
    "concept": "expressions_foundation",
    "level": 1,
    "difficulty": "easy",
    "question_type": "fill_blank",
    "options": ["7", "-7"],
    "skills": [
      "identify_like_terms",
      "combine_coefficients"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "recall",
    "story_based": false,
    "time_expected": 45,
    "hints": [
      "Isolate the unknown on one side.",
      "Use inverse operations to undo each step.",
      "Check your answer by substituting back."
    ],
    "explanation": "The numerical factor of 7xy is 7.",
    "explanation_depth": "short"
  },
  {
    "question_text": "Adding 3x + 2y and 5x − 4y gives ________.",
    "correct_answer": "8x − 2y",
    "concept": "expressions_foundation",
    "level": 2,
    "difficulty": "medium",
    "question_type": "fill_blank",
    "options": ["8x − 2y", "8x + 2y"],
    "skills": [
      "identify_like_terms",
      "combine_coefficients"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Write the equation first, then solve.",
      "Transpose terms carefully — signs flip when crossing =.",
      "Simplify step by step."
    ],
    "explanation": "3x + 5x = 8x and 2y − 4y = −2y.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Subtracting 3x from 7x gives ________.",
    "correct_answer": "4x",
    "concept": "expressions_foundation",
    "level": 2,
    "difficulty": "medium",
    "question_type": "fill_blank",
    "options": ["4x", "-4x"],
    "skills": [
      "identify_like_terms",
      "combine_coefficients"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Write the equation first, then solve.",
      "Transpose terms carefully — signs flip when crossing =.",
      "Simplify step by step."
    ],
    "explanation": "7x − 3x = (7 − 3)x = 4x.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "The sum of 7x² − 4x + 5 and 9x − 10 is ________.",
    "correct_answer": "7x² + 5x − 5",
    "concept": "expressions_foundation",
    "level": 3,
    "difficulty": "hard",
    "question_type": "fill_blank",
    "options": ["7x² + 5x − 5", "7x² + 5x + 5"],
    "skills": [
      "identify_like_terms",
      "combine_coefficients"
    ],
    "misconception_target": "equation_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Identify the operation applied to the unknown.",
      "Apply the inverse operation to both sides.",
      "Verify with substitution."
    ],
    "explanation": "7x² stays, −4x + 9x = 5x, 5 − 10 = −5.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "The expression 2x + 3y − 5 has ________ terms.",
    "correct_answer": "3",
    "concept": "expressions_foundation",
    "level": 2,
    "difficulty": "medium",
    "question_type": "fill_blank",
    "options": ["3", "2"],
    "skills": [
      "identify_like_terms",
      "combine_coefficients"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Write the equation first, then solve.",
      "Transpose terms carefully — signs flip when crossing =.",
      "Simplify step by step."
    ],
    "explanation": "The terms are 2x, 3y, and −5 — three terms, so it is a trinomial.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "When (4a − 3b) is subtracted from (2a + 5b), the result is ________.",
    "correct_answer": "−2a + 8b",
    "concept": "expressions_foundation",
    "level": 3,
    "difficulty": "hard",
    "question_type": "fill_blank",
    "options": ["-2a + 8b", "2a - 8b"],
    "skills": [
      "identify_like_terms",
      "combine_coefficients"
    ],
    "misconception_target": "equation_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Identify the operation applied to the unknown.",
      "Apply the inverse operation to both sides.",
      "Verify with substitution."
    ],
    "explanation": "(2a + 5b) − (4a − 3b) = 2a + 5b − 4a + 3b = −2a + 8b.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "Classify each expression by dragging it to the correct box: 'Monomial', 'Binomial', or 'Trinomial'.",
    "options": [
      "CAT:Monomial",
      "CAT:Binomial",
      "CAT:Trinomial",
      "1:5xy",
      "2:x + y",
      "3:a + b + c",
      "4:7z",
      "5:2x − 3y",
      "6:p + q + r"
    ],
    "correct_answer": "Monomial: [1,4] | Binomial: [2,5] | Trinomial: [3,6]",
    "concept": "expressions_foundation",
    "level": 1,
    "difficulty": "easy",
    "question_type": "drag_sort",
    "skills": [
      "classify_expressions",
      "identify_like_terms"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "recall",
    "story_based": false,
    "time_expected": 45,
    "hints": [
      "Think about what logically comes first.",
      "Each step should follow from the previous one.",
      "Read all steps before arranging."
    ],
    "explanation": "1 term=monomial, 2 terms=binomial, 3 terms=trinomial.",
    "explanation_depth": "short"
  },
  {
    "question_text": "Group the following terms by dragging them into the correct like-terms category.",
    "options": [
      "CAT:x terms",
      "CAT:y terms",
      "CAT:xy terms",
      "1:3x",
      "2:5y",
      "3:−7x",
      "4:2xy",
      "5:9y",
      "6:−4xy"
    ],
    "correct_answer": "x terms: [1,3] | y terms: [2,5] | xy terms: [4,6]",
    "concept": "expressions_foundation",
    "level": 2,
    "difficulty": "medium",
    "question_type": "drag_sort",
    "skills": [
      "classify_expressions",
      "identify_like_terms"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Identify the starting condition.",
      "What operation comes next?",
      "Does your sequence lead to the stated answer?"
    ],
    "explanation": "Like terms must have the same variable(s) with the same power.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Arrange the following steps to simplify (5x + 3y) − (2x − y).",
    "options": [
      "1:Write original: (5x + 3y) − (2x − y)",
      "2:Remove brackets: 5x + 3y − 2x + y",
      "3:Group x-terms: 5x − 2x = 3x",
      "4:Group y-terms: 3y + y = 4y",
      "5:Result: 3x + 4y"
    ],
    "correct_answer": "order: [1,2,3,4,5]",
    "concept": "expressions_foundation",
    "level": 3,
    "difficulty": "hard",
    "question_type": "drag_sort",
    "skills": [
      "classify_expressions",
      "identify_like_terms"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Arrange by cause and effect.",
      "Mathematical steps follow a strict order.",
      "Verify by reading your arrangement from top to bottom."
    ],
    "explanation": "Distribute the negative sign, then collect like terms.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "What is the product of 5x and 3y?",
    "options": [
      "8xy",
      "15xy",
      "15x²y²",
      "8x+y"
    ],
    "correct_answer": "15xy",
    "concept": "multiplication_expressions",
    "level": 1,
    "difficulty": "easy",
    "question_type": "mcq",
    "skills": [
      "apply_identities",
      "multiply_polynomials"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "recall",
    "story_based": false,
    "time_expected": 45,
    "hints": [
      "Read the question carefully before checking options.",
      "Eliminate obviously wrong options first.",
      "Substitute your answer back to verify."
    ],
    "explanation": "5 × 3 = 15; x × y = xy.",
    "explanation_depth": "short"
  },
  {
    "question_text": "Which identity gives (a + b)(a − b)?",
    "options": [
      "a² + b²",
      "a² − b²",
      "a² + 2ab + b²",
      "a² − 2ab + b²"
    ],
    "correct_answer": "a² − b²",
    "concept": "multiplication_expressions",
    "level": 1,
    "difficulty": "easy",
    "question_type": "mcq",
    "skills": [
      "apply_identities",
      "multiply_polynomials"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "recall",
    "story_based": false,
    "time_expected": 45,
    "hints": [
      "Read the question carefully before checking options.",
      "Eliminate obviously wrong options first.",
      "Substitute your answer back to verify."
    ],
    "explanation": "Difference of squares: (a+b)(a−b) = a² − b².",
    "explanation_depth": "short"
  },
  {
    "question_text": "What is the product of (2x + 3) and (x − 4)?",
    "options": [
      "2x² − 5x − 12",
      "2x² + 5x − 12",
      "2x² − 11x − 12",
      "2x² − 8x − 12"
    ],
    "correct_answer": "2x² − 5x − 12",
    "concept": "multiplication_expressions",
    "level": 2,
    "difficulty": "medium",
    "question_type": "mcq",
    "skills": [
      "apply_identities",
      "multiply_polynomials"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Identify what the question is asking for.",
      "Write out the key information.",
      "Check your arithmetic step by step."
    ],
    "explanation": "(2x+3)(x−4) = 2x² − 8x + 3x − 12 = 2x² − 5x − 12.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Using (a + b)², find the value of (103)².",
    "options": [
      "10509",
      "10609",
      "10406",
      "10909"
    ],
    "correct_answer": "10609",
    "concept": "multiplication_expressions",
    "level": 2,
    "difficulty": "medium",
    "question_type": "mcq",
    "skills": [
      "apply_identities",
      "multiply_polynomials"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Identify what the question is asking for.",
      "Write out the key information.",
      "Check your arithmetic step by step."
    ],
    "explanation": "(100+3)² = 10000 + 600 + 9 = 10609.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Using (a+b)(a−b) = a²−b², evaluate 97 × 103.",
    "options": [
      "9991",
      "9801",
      "10201",
      "9909"
    ],
    "correct_answer": "9991",
    "concept": "multiplication_expressions",
    "level": 2,
    "difficulty": "medium",
    "question_type": "mcq",
    "skills": [
      "apply_identities",
      "multiply_polynomials"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Identify what the question is asking for.",
      "Write out the key information.",
      "Check your arithmetic step by step."
    ],
    "explanation": "(100−3)(100+3) = 10000 − 9 = 9991.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Find the product of (x + 4)(x + 3) using (x+a)(x+b) = x² + (a+b)x + ab.",
    "options": [
      "x² + 7x + 12",
      "x² + 12x + 7",
      "x² + 7x + 7",
      "x² + 12x + 12"
    ],
    "correct_answer": "x² + 7x + 12",
    "concept": "multiplication_expressions",
    "level": 3,
    "difficulty": "hard",
    "question_type": "mcq",
    "skills": [
      "apply_identities",
      "multiply_polynomials"
    ],
    "misconception_target": "equation_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Look for key words: \"increased by\", \"times\", \"ratio\".",
      "Set up the equation before solving.",
      "Verify your answer satisfies all conditions."
    ],
    "explanation": "a=4, b=3: x² + (4+3)x + (4×3) = x² + 7x + 12.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "What is the product of 4xy × 5x²y²?",
    "options": [
      "9x³y³",
      "20x³y³",
      "20x²y²",
      "9x²y²"
    ],
    "correct_answer": "20x³y³",
    "concept": "multiplication_expressions",
    "level": 3,
    "difficulty": "hard",
    "question_type": "mcq",
    "skills": [
      "apply_identities",
      "multiply_polynomials"
    ],
    "misconception_target": "equation_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Look for key words: \"increased by\", \"times\", \"ratio\".",
      "Set up the equation before solving.",
      "Verify your answer satisfies all conditions."
    ],
    "explanation": "4×5=20; x×x²=x³; y×y²=y³. Product = 20x³y³.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "Using (a − b)², find the value of (98)².",
    "options": [
      "9400",
      "9604",
      "9800",
      "9204"
    ],
    "correct_answer": "9604",
    "concept": "multiplication_expressions",
    "level": 1,
    "difficulty": "easy",
    "question_type": "mcq",
    "skills": [
      "apply_identities",
      "multiply_polynomials"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "recall",
    "story_based": false,
    "time_expected": 45,
    "hints": [
      "Read the question carefully before checking options.",
      "Eliminate obviously wrong options first.",
      "Substitute your answer back to verify."
    ],
    "explanation": "(100−2)² = 10000 − 400 + 4 = 9604.",
    "explanation_depth": "short"
  },
  {
    "question_text": "Which of the following equals (3x − 2y)²?",
    "options": [
      "9x² − 4y²",
      "9x² + 12xy − 4y²",
      "9x² − 12xy + 4y²",
      "9x² + 4y²"
    ],
    "correct_answer": "9x² − 12xy + 4y²",
    "concept": "multiplication_expressions",
    "level": 2,
    "difficulty": "medium",
    "question_type": "mcq",
    "skills": [
      "apply_identities",
      "multiply_polynomials"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Identify what the question is asking for.",
      "Write out the key information.",
      "Check your arithmetic step by step."
    ],
    "explanation": "Using (a−b)² = a²−2ab+b²: (3x)² − 2(3x)(2y) + (2y)² = 9x² − 12xy + 4y².",
    "explanation_depth": "medium"
  },
  {
    "question_text": "If (x + k)(x − 3) = x² + x − 12, find k.",
    "options": [
      "3",
      "4",
      "−3",
      "−4"
    ],
    "correct_answer": "4",
    "concept": "multiplication_expressions",
    "level": 3,
    "difficulty": "hard",
    "question_type": "mcq",
    "skills": [
      "apply_identities",
      "multiply_polynomials"
    ],
    "misconception_target": "equation_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Look for key words: \"increased by\", \"times\", \"ratio\".",
      "Set up the equation before solving.",
      "Verify your answer satisfies all conditions."
    ],
    "explanation": "Using (x+a)(x+b) = x² + (a+b)x + ab: a+b = 1 → k−3 = 1 → k = 4. Also ab = k×(−3) = −12 → k = 4.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "(a + b)² = a² + ________ + b²",
    "correct_answer": "2ab",
    "concept": "multiplication_expressions",
    "level": 1,
    "difficulty": "easy",
    "question_type": "fill_in_the_blank",
    "skills": [
      "apply_identities",
      "expand_expressions"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "recall",
    "story_based": false,
    "time_expected": 45,
    "hints": [
      "Isolate the unknown on one side.",
      "Use inverse operations to undo each step.",
      "Check your answer by substituting back."
    ],
    "explanation": "(a+b)² = a² + 2ab + b².",
    "explanation_depth": "short"
  },
  {
    "question_text": "(a − b)² = a² − 2ab + ________",
    "correct_answer": "b²",
    "concept": "multiplication_expressions",
    "level": 1,
    "difficulty": "easy",
    "question_type": "fill_in_the_blank",
    "skills": [
      "apply_identities",
      "expand_expressions"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "recall",
    "story_based": false,
    "time_expected": 45,
    "hints": [
      "Isolate the unknown on one side.",
      "Use inverse operations to undo each step.",
      "Check your answer by substituting back."
    ],
    "explanation": "(a−b)² = a² − 2ab + b².",
    "explanation_depth": "short"
  },
  {
    "question_text": "(a + b)(a − b) = ________",
    "correct_answer": "a² − b²",
    "concept": "multiplication_expressions",
    "level": 2,
    "difficulty": "medium",
    "question_type": "fill_in_the_blank",
    "skills": [
      "apply_identities",
      "expand_expressions"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Write the equation first, then solve.",
      "Transpose terms carefully — signs flip when crossing =.",
      "Simplify step by step."
    ],
    "explanation": "Difference of squares identity.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "The product of 5x and 3x is ________.",
    "correct_answer": "15x²",
    "concept": "multiplication_expressions",
    "level": 2,
    "difficulty": "medium",
    "question_type": "fill_in_the_blank",
    "skills": [
      "apply_identities",
      "expand_expressions"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Write the equation first, then solve.",
      "Transpose terms carefully — signs flip when crossing =.",
      "Simplify step by step."
    ],
    "explanation": "5 × 3 = 15; x × x = x².",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Using (a−b)², the expansion of (2x − 3)² is ________.",
    "correct_answer": "4x² − 12x + 9",
    "concept": "multiplication_expressions",
    "level": 3,
    "difficulty": "hard",
    "question_type": "fill_in_the_blank",
    "skills": [
      "apply_identities",
      "expand_expressions"
    ],
    "misconception_target": "equation_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Identify the operation applied to the unknown.",
      "Apply the inverse operation to both sides.",
      "Verify with substitution."
    ],
    "explanation": "(2x)² − 2(2x)(3) + 3² = 4x² − 12x + 9.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "Using (x+a)(x+b) = x²+(a+b)x+ab, expand (x+5)(x−2): ________",
    "correct_answer": "x² + 3x − 10",
    "concept": "multiplication_expressions",
    "level": 3,
    "difficulty": "hard",
    "question_type": "fill_in_the_blank",
    "skills": [
      "apply_identities",
      "expand_expressions"
    ],
    "misconception_target": "equation_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Identify the operation applied to the unknown.",
      "Apply the inverse operation to both sides.",
      "Verify with substitution."
    ],
    "explanation": "a=5, b=−2: x² + (5−2)x + (5×−2) = x² + 3x − 10.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "Using (a−b)², expand (x − 5)²: ________",
    "correct_answer": "x² − 10x + 25",
    "concept": "multiplication_expressions",
    "level": 2,
    "difficulty": "medium",
    "question_type": "fill_in_the_blank",
    "skills": [
      "apply_identities",
      "expand_expressions"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Write the equation first, then solve.",
      "Transpose terms carefully — signs flip when crossing =.",
      "Simplify step by step."
    ],
    "explanation": "x² − 2(x)(5) + 5² = x² − 10x + 25.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Using (a+b)², expand (3x + 4)²: ________",
    "correct_answer": "9x² + 24x + 16",
    "concept": "multiplication_expressions",
    "level": 3,
    "difficulty": "hard",
    "question_type": "fill_in_the_blank",
    "skills": [
      "apply_identities",
      "expand_expressions"
    ],
    "misconception_target": "equation_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Identify the operation applied to the unknown.",
      "Apply the inverse operation to both sides.",
      "Verify with substitution."
    ],
    "explanation": "(3x)² + 2(3x)(4) + 4² = 9x² + 24x + 16.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "Arrange the terms to correctly expand (a + b)².",
    "options": [
      "1:a²",
      "2:2ab",
      "3:b²"
    ],
    "correct_answer": "order: [1,2,3]",
    "concept": "multiplication_expressions",
    "level": 2,
    "difficulty": "medium",
    "question_type": "drag_sort",
    "skills": [
      "expand_expressions",
      "apply_identities"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Identify the starting condition.",
      "What operation comes next?",
      "Does your sequence lead to the stated answer?"
    ],
    "explanation": "(a+b)² = a² + 2ab + b².",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Arrange the steps to expand (3x + 2)(x − 5) correctly.",
    "options": [
      "1:Write: (3x + 2)(x − 5)",
      "2:3x × x = 3x²",
      "3:3x × (−5) = −15x",
      "4:2 × x = 2x",
      "5:2 × (−5) = −10",
      "6:Combine: 3x² − 15x + 2x − 10 = 3x² − 13x − 10"
    ],
    "correct_answer": "order: [1,2,3,4,5,6]",
    "concept": "multiplication_expressions",
    "level": 3,
    "difficulty": "hard",
    "question_type": "drag_sort",
    "skills": [
      "expand_expressions",
      "apply_identities"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Arrange by cause and effect.",
      "Mathematical steps follow a strict order.",
      "Verify by reading your arrangement from top to bottom."
    ],
    "explanation": "Multiply each term in the first bracket with each term in the second (FOIL).",
    "explanation_depth": "deep"
  },
  {
    "question_text": "Arrange the terms to correctly expand (a − b)².",
    "options": [
      "1:a²",
      "2:−2ab",
      "3:b²"
    ],
    "correct_answer": "order: [1,2,3]",
    "concept": "multiplication_expressions",
    "level": 2,
    "difficulty": "medium",
    "question_type": "drag_sort",
    "skills": [
      "expand_expressions",
      "apply_identities"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Identify the starting condition.",
      "What operation comes next?",
      "Does your sequence lead to the stated answer?"
    ],
    "explanation": "(a−b)² = a² − 2ab + b².",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Arrange the steps to verify that (99)² = 9801 using an identity.",
    "options": [
      "1:Write 99 = 100 − 1",
      "2:Apply (a−b)²: (100)² − 2(100)(1) + (1)²",
      "3:= 10000 − 200 + 1",
      "4:= 9801"
    ],
    "correct_answer": "order: [1,2,3,4]",
    "concept": "multiplication_expressions",
    "level": 3,
    "difficulty": "hard",
    "question_type": "drag_sort",
    "skills": [
      "expand_expressions",
      "apply_identities"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Arrange by cause and effect.",
      "Mathematical steps follow a strict order.",
      "Verify by reading your arrangement from top to bottom."
    ],
    "explanation": "Using (a−b)² identity makes mental arithmetic much faster.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "Which of the following is a linear equation in one variable?",
    "options": [
      "x² + 3 = 7",
      "2x + 3 = 9",
      "xy + 5 = 0",
      "x² − y = 4"
    ],
    "correct_answer": "2x + 3 = 9",
    "concept": "equation_basics",
    "level": 1,
    "difficulty": "easy",
    "question_type": "mcq",
    "skills": [
      "identify_linear_equations",
      "transposition"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "recall",
    "story_based": false,
    "time_expected": 45,
    "hints": [
      "Read the question carefully before checking options.",
      "Eliminate obviously wrong options first.",
      "Substitute your answer back to verify."
    ],
    "explanation": "A linear equation in one variable has one variable with highest power 1.",
    "explanation_depth": "short"
  },
  {
    "question_text": "What is transposition in solving equations?",
    "options": [
      "Multiplying both sides by the variable",
      "Moving a term from one side to the other with a sign change",
      "Adding the same number to both sides",
      "Squaring both sides"
    ],
    "correct_answer": "Moving a term from one side to the other with a sign change",
    "concept": "equation_basics",
    "level": 1,
    "difficulty": "easy",
    "question_type": "mcq",
    "skills": [
      "identify_linear_equations",
      "transposition"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "recall",
    "story_based": false,
    "time_expected": 45,
    "hints": [
      "Read the question carefully before checking options.",
      "Eliminate obviously wrong options first.",
      "Substitute your answer back to verify."
    ],
    "explanation": "Transposition moves a term across the equality sign, flipping its sign.",
    "explanation_depth": "short"
  },
  {
    "question_text": "In the equation 4x − 7 = 9, what is the LHS?",
    "options": [
      "9",
      "4x",
      "4x − 7",
      "−7"
    ],
    "correct_answer": "4x − 7",
    "concept": "equation_basics",
    "level": 1,
    "difficulty": "easy",
    "question_type": "mcq",
    "skills": [
      "identify_linear_equations",
      "transposition"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "recall",
    "story_based": false,
    "time_expected": 45,
    "hints": [
      "Read the question carefully before checking options.",
      "Eliminate obviously wrong options first.",
      "Substitute your answer back to verify."
    ],
    "explanation": "LHS is everything to the left of the '=' sign.",
    "explanation_depth": "short"
  },
  {
    "question_text": "Which value of x satisfies 3x + 2 = 11?",
    "options": [
      "2",
      "3",
      "4",
      "5"
    ],
    "correct_answer": "3",
    "concept": "equation_basics",
    "level": 2,
    "difficulty": "medium",
    "question_type": "mcq",
    "skills": [
      "identify_linear_equations",
      "transposition"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Identify what the question is asking for.",
      "Write out the key information.",
      "Check your arithmetic step by step."
    ],
    "explanation": "3x = 9 → x = 3. Verify: 3(3)+2 = 11 ✓.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Solve: x/4 + 3 = 7. What is x?",
    "options": [
      "12",
      "16",
      "20",
      "28"
    ],
    "correct_answer": "16",
    "concept": "equation_basics",
    "level": 2,
    "difficulty": "medium",
    "question_type": "mcq",
    "skills": [
      "identify_linear_equations",
      "transposition"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Identify what the question is asking for.",
      "Write out the key information.",
      "Check your arithmetic step by step."
    ],
    "explanation": "x/4 = 4 → x = 16.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Which equation has x = −2 as its solution?",
    "options": [
      "3x + 8 = 2",
      "2x − 5 = 1",
      "5x + 12 = −2",
      "4x + 9 = 3"
    ],
    "correct_answer": "3x + 8 = 2",
    "concept": "equation_basics",
    "level": 3,
    "difficulty": "hard",
    "question_type": "mcq",
    "skills": [
      "identify_linear_equations",
      "transposition"
    ],
    "misconception_target": "equation_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Look for key words: \"increased by\", \"times\", \"ratio\".",
      "Set up the equation before solving.",
      "Verify your answer satisfies all conditions."
    ],
    "explanation": "3(−2) + 8 = −6 + 8 = 2 ✓.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "What does it mean to 'verify' a solution?",
    "options": [
      "Guess the answer",
      "Substitute the answer back into the original equation",
      "Rewrite the equation",
      "Divide both sides by 2"
    ],
    "correct_answer": "Substitute the answer back into the original equation",
    "concept": "equation_basics",
    "level": 1,
    "difficulty": "easy",
    "question_type": "mcq",
    "skills": [
      "identify_linear_equations",
      "transposition"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "recall",
    "story_based": false,
    "time_expected": 45,
    "hints": [
      "Read the question carefully before checking options.",
      "Eliminate obviously wrong options first.",
      "Substitute your answer back to verify."
    ],
    "explanation": "Verification confirms correctness by substituting back and checking both sides are equal.",
    "explanation_depth": "short"
  },
  {
    "question_text": "Solve: 5 − 2x = 1. What is x?",
    "options": [
      "1",
      "2",
      "3",
      "4"
    ],
    "correct_answer": "2",
    "concept": "equation_basics",
    "level": 2,
    "difficulty": "medium",
    "question_type": "mcq",
    "skills": [
      "identify_linear_equations",
      "transposition"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Identify what the question is asking for.",
      "Write out the key information.",
      "Check your arithmetic step by step."
    ],
    "explanation": "−2x = 1 − 5 = −4 → x = 2.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "If 4(x + 3) = 2(x + 9), what is x?",
    "options": [
      "3",
      "6",
      "9",
      "12"
    ],
    "correct_answer": "3",
    "concept": "equation_basics",
    "level": 3,
    "difficulty": "hard",
    "question_type": "mcq",
    "skills": [
      "identify_linear_equations",
      "transposition"
    ],
    "misconception_target": "equation_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Look for key words: \"increased by\", \"times\", \"ratio\".",
      "Set up the equation before solving.",
      "Verify your answer satisfies all conditions."
    ],
    "explanation": "4x + 12 = 2x + 18 → 2x = 6 → x = 3.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "In the equation 5x − 3 = 12, the RHS is ________.",
    "correct_answer": "12",
    "concept": "equation_basics",
    "level": 1,
    "difficulty": "easy",
    "question_type": "fill_in_the_blank",
    "skills": [
      "transposition",
      "inverse_operations"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "recall",
    "story_based": false,
    "time_expected": 45,
    "hints": [
      "Isolate the unknown on one side.",
      "Use inverse operations to undo each step.",
      "Check your answer by substituting back."
    ],
    "explanation": "RHS stands for Right Hand Side — the expression to the right of the '=' sign.",
    "explanation_depth": "short"
  },
  {
    "question_text": "If we move '+7' from the LHS to the RHS, it becomes ________.",
    "correct_answer": "−7",
    "concept": "equation_basics",
    "level": 1,
    "difficulty": "easy",
    "question_type": "fill_in_the_blank",
    "skills": [
      "transposition",
      "inverse_operations"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "recall",
    "story_based": false,
    "time_expected": 45,
    "hints": [
      "Isolate the unknown on one side.",
      "Use inverse operations to undo each step.",
      "Check your answer by substituting back."
    ],
    "explanation": "Transposition changes the sign: +7 becomes −7 when moved across the equality.",
    "explanation_depth": "short"
  },
  {
    "question_text": "Solve: 4x = 28. The value of x is ________.",
    "correct_answer": "7",
    "concept": "equation_basics",
    "level": 2,
    "difficulty": "medium",
    "question_type": "fill_in_the_blank",
    "skills": [
      "transposition",
      "inverse_operations"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Write the equation first, then solve.",
      "Transpose terms carefully — signs flip when crossing =.",
      "Simplify step by step."
    ],
    "explanation": "x = 28 ÷ 4 = 7.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Solve: 7x − 3 = 4x + 9. The value of x is ________.",
    "correct_answer": "4",
    "concept": "equation_basics",
    "level": 2,
    "difficulty": "medium",
    "question_type": "fill_in_the_blank",
    "skills": [
      "transposition",
      "inverse_operations"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Write the equation first, then solve.",
      "Transpose terms carefully — signs flip when crossing =.",
      "Simplify step by step."
    ],
    "explanation": "3x = 12 → x = 4.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Solve: 3(2x − 1) = 2(x + 5) + 1. The value of x is ________.",
    "correct_answer": "7/2",
    "concept": "equation_basics",
    "level": 3,
    "difficulty": "hard",
    "question_type": "fill_in_the_blank",
    "skills": [
      "transposition",
      "inverse_operations"
    ],
    "misconception_target": "equation_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Identify the operation applied to the unknown.",
      "Apply the inverse operation to both sides.",
      "Verify with substitution."
    ],
    "explanation": "6x − 3 = 2x + 10 + 1 = 2x + 11 → 4x = 14 → x = 7/2.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "Solve: 3 + x = 17. The value of x is ________.",
    "correct_answer": "14",
    "concept": "equation_basics",
    "level": 2,
    "difficulty": "medium",
    "question_type": "fill_in_the_blank",
    "skills": [
      "transposition",
      "inverse_operations"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Write the equation first, then solve.",
      "Transpose terms carefully — signs flip when crossing =.",
      "Simplify step by step."
    ],
    "explanation": "x = 17 − 3 = 14.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Solve: 2(x + 4) = 3(x − 2). The value of x is ________.",
    "correct_answer": "14",
    "concept": "equation_basics",
    "level": 3,
    "difficulty": "hard",
    "question_type": "fill_in_the_blank",
    "skills": [
      "transposition",
      "inverse_operations"
    ],
    "misconception_target": "equation_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Identify the operation applied to the unknown.",
      "Apply the inverse operation to both sides.",
      "Verify with substitution."
    ],
    "explanation": "2x + 8 = 3x − 6 → 14 = x → x = 14.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "Sort the following expressions into 'Linear' or 'Not Linear'.",
    "options": [
      "CAT:Linear",
      "CAT:Not Linear",
      "1:3x + 5",
      "2:x² + 1",
      "3:7 − 2y",
      "4:y² + y",
      "5:5z",
      "6:1 + z + z²"
    ],
    "correct_answer": "Linear: [1,3,5] | Not Linear: [2,4,6]",
    "concept": "equation_basics",
    "level": 1,
    "difficulty": "easy",
    "question_type": "drag_sort",
    "skills": [
      "solve_step_by_step",
      "transposition"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "recall",
    "story_based": false,
    "time_expected": 45,
    "hints": [
      "Think about what logically comes first.",
      "Each step should follow from the previous one.",
      "Read all steps before arranging."
    ],
    "explanation": "Linear expressions have the highest power of the variable equal to 1.",
    "explanation_depth": "short"
  },
  {
    "question_text": "Arrange the steps to solve 3x + 6 = 18.",
    "options": [
      "1:Write: 3x + 6 = 18",
      "2:Subtract 6: 3x = 12",
      "3:Divide by 3: x = 4",
      "4:Verify: 3(4)+6 = 18 ✓"
    ],
    "correct_answer": "order: [1,2,3,4]",
    "concept": "equation_basics",
    "level": 2,
    "difficulty": "medium",
    "question_type": "drag_sort",
    "skills": [
      "solve_step_by_step",
      "transposition"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Identify the starting condition.",
      "What operation comes next?",
      "Does your sequence lead to the stated answer?"
    ],
    "explanation": "Write → transpose → divide → verify.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Arrange the steps to solve 4(x + 3) = 2(x + 9).",
    "options": [
      "1:Expand LHS: 4x + 12",
      "2:Expand RHS: 2x + 18",
      "3:4x + 12 = 2x + 18",
      "4:4x − 2x = 18 − 12",
      "5:2x = 6 → x = 3"
    ],
    "correct_answer": "order: [1,2,3,4,5]",
    "concept": "equation_basics",
    "level": 3,
    "difficulty": "hard",
    "question_type": "drag_sort",
    "skills": [
      "solve_step_by_step",
      "transposition"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Arrange by cause and effect.",
      "Mathematical steps follow a strict order.",
      "Verify by reading your arrangement from top to bottom."
    ],
    "explanation": "Expand both sides, collect x-terms on one side, constants on the other.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "What is the solution of 5x = 35?",
    "options": [
      "5",
      "6",
      "7",
      "8"
    ],
    "correct_answer": "7",
    "concept": "equation_solving",
    "level": 1,
    "difficulty": "easy",
    "question_type": "mcq",
    "skills": [
      "solve_linear",
      "transposition"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "recall",
    "story_based": false,
    "time_expected": 45,
    "hints": [
      "Read the question carefully before checking options.",
      "Eliminate obviously wrong options first.",
      "Substitute your answer back to verify."
    ],
    "explanation": "x = 35 ÷ 5 = 7.",
    "explanation_depth": "short"
  },
  {
    "question_text": "Solve: y + 3 = 10",
    "options": [
      "y = 6",
      "y = 7",
      "y = 13",
      "y = 3"
    ],
    "correct_answer": "y = 7",
    "concept": "equation_solving",
    "level": 1,
    "difficulty": "easy",
    "question_type": "mcq",
    "skills": [
      "solve_linear",
      "transposition"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "recall",
    "story_based": false,
    "time_expected": 45,
    "hints": [
      "Read the question carefully before checking options.",
      "Eliminate obviously wrong options first.",
      "Substitute your answer back to verify."
    ],
    "explanation": "y = 10 − 3 = 7.",
    "explanation_depth": "short"
  },
  {
    "question_text": "Solve: (2x + 3)/5 = 3",
    "options": [
      "x = 4",
      "x = 6",
      "x = 5",
      "x = 3"
    ],
    "correct_answer": "x = 6",
    "concept": "equation_solving",
    "level": 2,
    "difficulty": "medium",
    "question_type": "mcq",
    "skills": [
      "solve_linear",
      "transposition"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Identify what the question is asking for.",
      "Write out the key information.",
      "Check your arithmetic step by step."
    ],
    "explanation": "2x + 3 = 15 → 2x = 12 → x = 6.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Solve: 14y − 8 = 13",
    "options": [
      "y = 1",
      "y = 3/2",
      "y = 2",
      "y = 5/2"
    ],
    "correct_answer": "y = 3/2",
    "concept": "equation_solving",
    "level": 2,
    "difficulty": "medium",
    "question_type": "mcq",
    "skills": [
      "solve_linear",
      "transposition"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Identify what the question is asking for.",
      "Write out the key information.",
      "Check your arithmetic step by step."
    ],
    "explanation": "14y = 21 → y = 21/14 = 3/2.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Solve: 17 + 6p = 9",
    "options": [
      "p = −4/3",
      "p = 4/3",
      "p = −3/4",
      "p = 26/6"
    ],
    "correct_answer": "p = −4/3",
    "concept": "equation_solving",
    "level": 3,
    "difficulty": "hard",
    "question_type": "mcq",
    "skills": [
      "solve_linear",
      "transposition"
    ],
    "misconception_target": "equation_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Look for key words: \"increased by\", \"times\", \"ratio\".",
      "Set up the equation before solving.",
      "Verify your answer satisfies all conditions."
    ],
    "explanation": "6p = 9 − 17 = −8 → p = −8/6 = −4/3.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "Solve: 3x − 5 = x + 11",
    "options": [
      "x = 6",
      "x = 7",
      "x = 8",
      "x = 9"
    ],
    "correct_answer": "x = 8",
    "concept": "equation_solving",
    "level": 3,
    "difficulty": "hard",
    "question_type": "mcq",
    "skills": [
      "solve_linear",
      "transposition"
    ],
    "misconception_target": "equation_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Look for key words: \"increased by\", \"times\", \"ratio\".",
      "Set up the equation before solving.",
      "Verify your answer satisfies all conditions."
    ],
    "explanation": "3x − x = 11 + 5 → 2x = 16 → x = 8.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "Solve: (3x − 1)/2 = 7. What is x?",
    "options": [
      "x = 5",
      "x = 4",
      "x = 3",
      "x = 6"
    ],
    "correct_answer": "x = 5",
    "concept": "equation_solving",
    "level": 2,
    "difficulty": "medium",
    "question_type": "mcq",
    "skills": [
      "solve_linear",
      "transposition"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Identify what the question is asking for.",
      "Write out the key information.",
      "Check your arithmetic step by step."
    ],
    "explanation": "3x − 1 = 14 → 3x = 15 → x = 5.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Solve: t − 15 = 4. What is t?",
    "options": [
      "11",
      "19",
      "15",
      "4"
    ],
    "correct_answer": "19",
    "concept": "equation_solving",
    "level": 1,
    "difficulty": "easy",
    "question_type": "mcq",
    "skills": [
      "solve_linear",
      "transposition"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "recall",
    "story_based": false,
    "time_expected": 45,
    "hints": [
      "Read the question carefully before checking options.",
      "Eliminate obviously wrong options first.",
      "Substitute your answer back to verify."
    ],
    "explanation": "t = 4 + 15 = 19.",
    "explanation_depth": "short"
  },
  {
    "question_text": "Solve: 2(y − 3) = 3(y + 1) − 13",
    "options": [
      "y = 2",
      "y = 4",
      "y = 6",
      "y = 0"
    ],
    "correct_answer": "y = 4",
    "concept": "equation_solving",
    "level": 3,
    "difficulty": "hard",
    "question_type": "mcq",
    "skills": [
      "solve_linear",
      "transposition"
    ],
    "misconception_target": "equation_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Look for key words: \"increased by\", \"times\", \"ratio\".",
      "Set up the equation before solving.",
      "Verify your answer satisfies all conditions."
    ],
    "explanation": "2y − 6 = 3y + 3 − 13 = 3y − 10 → −y = −4 → y = 4.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "The solution of the equation x − 2 = 7 is x = ________.",
    "correct_answer": "9",
    "concept": "equation_solving",
    "level": 1,
    "difficulty": "easy",
    "question_type": "fill_in_the_blank",
    "skills": [
      "solve_linear",
      "transposition"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "recall",
    "story_based": false,
    "time_expected": 45,
    "hints": [
      "Isolate the unknown on one side.",
      "Use inverse operations to undo each step.",
      "Check your answer by substituting back."
    ],
    "explanation": "x = 7 + 2 = 9.",
    "explanation_depth": "short"
  },
  {
    "question_text": "If 6x = 12, then x = ________.",
    "correct_answer": "2",
    "concept": "equation_solving",
    "level": 1,
    "difficulty": "easy",
    "question_type": "fill_in_the_blank",
    "skills": [
      "solve_linear",
      "transposition"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "recall",
    "story_based": false,
    "time_expected": 45,
    "hints": [
      "Isolate the unknown on one side.",
      "Use inverse operations to undo each step.",
      "Check your answer by substituting back."
    ],
    "explanation": "x = 12 ÷ 6 = 2.",
    "explanation_depth": "short"
  },
  {
    "question_text": "Solving 2x − 3 = 7, the value of x is ________.",
    "correct_answer": "5",
    "concept": "equation_solving",
    "level": 2,
    "difficulty": "medium",
    "question_type": "fill_in_the_blank",
    "skills": [
      "solve_linear",
      "transposition"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Write the equation first, then solve.",
      "Transpose terms carefully — signs flip when crossing =.",
      "Simplify step by step."
    ],
    "explanation": "2x = 10 → x = 5.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "If (2x + 1)/3 = 5, then x = ________.",
    "correct_answer": "7",
    "concept": "equation_solving",
    "level": 2,
    "difficulty": "medium",
    "question_type": "fill_in_the_blank",
    "skills": [
      "solve_linear",
      "transposition"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Write the equation first, then solve.",
      "Transpose terms carefully — signs flip when crossing =.",
      "Simplify step by step."
    ],
    "explanation": "2x + 1 = 15 → 2x = 14 → x = 7.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "The solution of 7x − 9 = 5x + 7 is x = ________.",
    "correct_answer": "8",
    "concept": "equation_solving",
    "level": 3,
    "difficulty": "hard",
    "question_type": "fill_in_the_blank",
    "skills": [
      "solve_linear",
      "transposition"
    ],
    "misconception_target": "equation_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Identify the operation applied to the unknown.",
      "Apply the inverse operation to both sides.",
      "Verify with substitution."
    ],
    "explanation": "2x = 16 → x = 8.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "Solve: y + 3 = 10. The value of y is ________.",
    "correct_answer": "7",
    "concept": "equation_solving",
    "level": 1,
    "difficulty": "easy",
    "question_type": "fill_in_the_blank",
    "skills": [
      "solve_linear",
      "transposition"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "recall",
    "story_based": false,
    "time_expected": 45,
    "hints": [
      "Isolate the unknown on one side.",
      "Use inverse operations to undo each step.",
      "Check your answer by substituting back."
    ],
    "explanation": "y = 10 − 3 = 7.",
    "explanation_depth": "short"
  },
  {
    "question_text": "Solve: 4(x − 2) = 16. The value of x is ________.",
    "correct_answer": "6",
    "concept": "equation_solving",
    "level": 2,
    "difficulty": "medium",
    "question_type": "fill_in_the_blank",
    "skills": [
      "solve_linear",
      "transposition"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Write the equation first, then solve.",
      "Transpose terms carefully — signs flip when crossing =.",
      "Simplify step by step."
    ],
    "explanation": "x − 2 = 4 → x = 6.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Solve: 3(2x + 5) = 2(3x + 7) + 1. The value of x is ________.",
    "correct_answer": "no unique solution",
    "concept": "equation_solving",
    "level": 3,
    "difficulty": "hard",
    "question_type": "fill_in_the_blank",
    "skills": [
      "solve_linear",
      "transposition"
    ],
    "misconception_target": "equation_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Identify the operation applied to the unknown.",
      "Apply the inverse operation to both sides.",
      "Verify with substitution."
    ],
    "explanation": "6x + 15 = 6x + 15 — both sides are identical. This is an identity (true for all x), so there is no unique solution.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "Arrange the steps in the correct order to solve 2x + 4 = 12.",
    "options": [
      "1:Write the equation: 2x + 4 = 12",
      "2:Subtract 4 from both sides: 2x = 8",
      "3:Divide both sides by 2: x = 4",
      "4:Verify: 2(4) + 4 = 12 ✓"
    ],
    "correct_answer": "order: [1,2,3,4]",
    "concept": "equation_solving",
    "level": 1,
    "difficulty": "easy",
    "question_type": "drag_sort",
    "skills": [
      "solve_step_by_step",
      "verify_solution"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "recall",
    "story_based": false,
    "time_expected": 45,
    "hints": [
      "Think about what logically comes first.",
      "Each step should follow from the previous one.",
      "Read all steps before arranging."
    ],
    "explanation": "Write → transpose → simplify → verify.",
    "explanation_depth": "short"
  },
  {
    "question_text": "Arrange the steps in the correct order to solve (x + 1)/3 = 4.",
    "options": [
      "1:Write: (x+1)/3 = 4",
      "2:Multiply both sides by 3: x+1 = 12",
      "3:Subtract 1: x = 11",
      "4:Check: (11+1)/3 = 4 ✓"
    ],
    "correct_answer": "order: [1,2,3,4]",
    "concept": "equation_solving",
    "level": 2,
    "difficulty": "medium",
    "question_type": "drag_sort",
    "skills": [
      "solve_step_by_step",
      "verify_solution"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Identify the starting condition.",
      "What operation comes next?",
      "Does your sequence lead to the stated answer?"
    ],
    "explanation": "Clear the fraction first, then isolate the variable.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Arrange the steps to solve 4x − 8 = 0.",
    "options": [
      "1:Write: 4x − 8 = 0",
      "2:Add 8 to both sides: 4x = 8",
      "3:Divide by 4: x = 2",
      "4:Verify: 4(2)−8 = 0 ✓"
    ],
    "correct_answer": "order: [1,2,3,4]",
    "concept": "equation_solving",
    "level": 2,
    "difficulty": "medium",
    "question_type": "drag_sort",
    "skills": [
      "solve_step_by_step",
      "verify_solution"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Identify the starting condition.",
      "What operation comes next?",
      "Does your sequence lead to the stated answer?"
    ],
    "explanation": "Transpose the constant, then divide by the coefficient.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Arrange the steps to solve 3x − 5 = x + 11.",
    "options": [
      "1:Write: 3x − 5 = x + 11",
      "2:Move x-terms left: 3x − x = 11 + 5",
      "3:Simplify: 2x = 16",
      "4:Divide: x = 8",
      "5:Verify: 3(8)−5 = 19 and 8+11 = 19 ✓"
    ],
    "correct_answer": "order: [1,2,3,4,5]",
    "concept": "equation_solving",
    "level": 3,
    "difficulty": "hard",
    "question_type": "drag_sort",
    "skills": [
      "solve_step_by_step",
      "verify_solution"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Arrange by cause and effect.",
      "Mathematical steps follow a strict order.",
      "Verify by reading your arrangement from top to bottom."
    ],
    "explanation": "Collect variable terms on one side, constants on the other.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "Solve: z / (z + 15) = 4/9",
    "options": [
      "z = 10",
      "z = 12",
      "z = 15",
      "z = 20"
    ],
    "correct_answer": "z = 12",
    "concept": "advanced_equations",
    "level": 2,
    "difficulty": "medium",
    "question_type": "mcq",
    "skills": [
      "cross_multiplication",
      "clear_fractions"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Identify what the question is asking for.",
      "Write out the key information.",
      "Check your arithmetic step by step."
    ],
    "explanation": "9z = 4(z+15) = 4z+60 → 5z = 60 → z = 12.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Solve: (x + 1) / (2x + 3) = 3/8",
    "options": [
      "x = 1/2",
      "x = 1",
      "x = 2",
      "x = −1/2"
    ],
    "correct_answer": "x = 1/2",
    "concept": "advanced_equations",
    "level": 3,
    "difficulty": "hard",
    "question_type": "mcq",
    "skills": [
      "cross_multiplication",
      "clear_fractions"
    ],
    "misconception_target": "equation_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Look for key words: \"increased by\", \"times\", \"ratio\".",
      "Set up the equation before solving.",
      "Verify your answer satisfies all conditions."
    ],
    "explanation": "8(x+1) = 3(2x+3) → 8x+8 = 6x+9 → 2x = 1 → x = 1/2.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "Solve: (8x − 3) / (3x) = 2",
    "options": [
      "x = 1",
      "x = 3",
      "x = 3/2",
      "x = 2"
    ],
    "correct_answer": "x = 3/2",
    "concept": "advanced_equations",
    "level": 3,
    "difficulty": "hard",
    "question_type": "mcq",
    "skills": [
      "cross_multiplication",
      "clear_fractions"
    ],
    "misconception_target": "equation_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Look for key words: \"increased by\", \"times\", \"ratio\".",
      "Set up the equation before solving.",
      "Verify your answer satisfies all conditions."
    ],
    "explanation": "8x − 3 = 6x → 2x = 3 → x = 3/2.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "Solve: 2x/3 + 1 = 7x/15 + 3",
    "options": [
      "x = 5",
      "x = 10",
      "x = 15",
      "x = 3"
    ],
    "correct_answer": "x = 10",
    "concept": "advanced_equations",
    "level": 3,
    "difficulty": "hard",
    "question_type": "mcq",
    "skills": [
      "cross_multiplication",
      "clear_fractions"
    ],
    "misconception_target": "equation_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Look for key words: \"increased by\", \"times\", \"ratio\".",
      "Set up the equation before solving.",
      "Verify your answer satisfies all conditions."
    ],
    "explanation": "Multiply by 15: 10x + 15 = 7x + 45 → 3x = 30 → x = 10.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "Solve: (7y + 4)/(y + 2) = −4/3",
    "options": [
      "y = −4/5",
      "y = −4",
      "y = 2",
      "y = 4"
    ],
    "correct_answer": "y = −4/5",
    "concept": "advanced_equations",
    "level": 3,
    "difficulty": "hard",
    "question_type": "mcq",
    "skills": [
      "cross_multiplication",
      "clear_fractions"
    ],
    "misconception_target": "equation_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Look for key words: \"increased by\", \"times\", \"ratio\".",
      "Set up the equation before solving.",
      "Verify your answer satisfies all conditions."
    ],
    "explanation": "3(7y+4) = −4(y+2) → 21y+12 = −4y−8 → 25y = −20 → y = −4/5.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "Solve: 9x = 15(7 − 6x)",
    "options": [
      "x = 1",
      "x = 105/99",
      "x = 35/33",
      "x = 5/3"
    ],
    "correct_answer": "x = 35/33",
    "concept": "advanced_equations",
    "level": 2,
    "difficulty": "medium",
    "question_type": "mcq",
    "skills": [
      "cross_multiplication",
      "clear_fractions"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Identify what the question is asking for.",
      "Write out the key information.",
      "Check your arithmetic step by step."
    ],
    "explanation": "9x = 105 − 90x → 99x = 105 → x = 105/99 = 35/33.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Which is the first step when solving (3x − 1)/4 = 5?",
    "options": [
      "Subtract 1 from both sides",
      "Multiply both sides by 4",
      "Divide both sides by 3",
      "Add 1 to both sides"
    ],
    "correct_answer": "Multiply both sides by 4",
    "concept": "advanced_equations",
    "level": 2,
    "difficulty": "medium",
    "question_type": "mcq",
    "skills": [
      "cross_multiplication",
      "clear_fractions"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Identify what the question is asking for.",
      "Write out the key information.",
      "Check your arithmetic step by step."
    ],
    "explanation": "Clearing the denominator first simplifies all subsequent steps: 3x − 1 = 20.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Solve: (x − 3)/5 − (x − 5)/3 = 1/5. What is x?",
    "options": [
      "x = 13/2",
      "x = 5",
      "x = −5",
      "x = 10"
    ],
    "correct_answer": "x = 13/2",
    "concept": "advanced_equations",
    "level": 3,
    "difficulty": "hard",
    "question_type": "mcq",
    "skills": [
      "cross_multiplication",
      "clear_fractions"
    ],
    "misconception_target": "equation_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Look for key words: \"increased by\", \"times\", \"ratio\".",
      "Set up the equation before solving.",
      "Verify your answer satisfies all conditions."
    ],
    "explanation": "Multiply by 15: 3(x−3) − 5(x−5) = 3 → 3x−9−5x+25 = 3 → −2x+16 = 3 → −2x = −13 → x = 13/2.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "The solution of 2x/3 = 18 is x = ________.",
    "correct_answer": "27",
    "concept": "advanced_equations",
    "level": 2,
    "difficulty": "medium",
    "question_type": "fill_in_the_blank",
    "skills": [
      "cross_multiplication",
      "clear_fractions"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Write the equation first, then solve.",
      "Transpose terms carefully — signs flip when crossing =.",
      "Simplify step by step."
    ],
    "explanation": "x = 18 × 3/2 = 27.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Solving (x+1)/(2x+3) = 3/8, cross-multiplying gives 8x+8 = 6x+9, so x = ________.",
    "correct_answer": "1/2",
    "concept": "advanced_equations",
    "level": 3,
    "difficulty": "hard",
    "question_type": "fill_in_the_blank",
    "skills": [
      "cross_multiplication",
      "clear_fractions"
    ],
    "misconception_target": "equation_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Identify the operation applied to the unknown.",
      "Apply the inverse operation to both sides.",
      "Verify with substitution."
    ],
    "explanation": "2x = 1 → x = 1/2.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "If z/(z+15) = 4/9, then z = ________.",
    "correct_answer": "12",
    "concept": "advanced_equations",
    "level": 3,
    "difficulty": "hard",
    "question_type": "fill_in_the_blank",
    "skills": [
      "cross_multiplication",
      "clear_fractions"
    ],
    "misconception_target": "equation_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Identify the operation applied to the unknown.",
      "Apply the inverse operation to both sides.",
      "Verify with substitution."
    ],
    "explanation": "9z = 4z + 60 → 5z = 60 → z = 12.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "Solve: 2x − 5 = −11. The value of x is ________.",
    "correct_answer": "−3",
    "concept": "advanced_equations",
    "level": 2,
    "difficulty": "medium",
    "question_type": "fill_in_the_blank",
    "skills": [
      "cross_multiplication",
      "clear_fractions"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Write the equation first, then solve.",
      "Transpose terms carefully — signs flip when crossing =.",
      "Simplify step by step."
    ],
    "explanation": "2x = −11 + 5 = −6 → x = −3.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "After multiplying (3x−1)/4 − (2x+3)/6 = 1 by LCM 12, we get 9x−3−4x−6 = 12, so x = ________.",
    "correct_answer": "21/5",
    "concept": "advanced_equations",
    "level": 3,
    "difficulty": "hard",
    "question_type": "fill_in_the_blank",
    "skills": [
      "cross_multiplication",
      "clear_fractions"
    ],
    "misconception_target": "equation_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Identify the operation applied to the unknown.",
      "Apply the inverse operation to both sides.",
      "Verify with substitution."
    ],
    "explanation": "5x = 21 → x = 21/5.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "Solve: 3x/4 = 9. The value of x is ________.",
    "correct_answer": "12",
    "concept": "advanced_equations",
    "level": 2,
    "difficulty": "medium",
    "question_type": "fill_in_the_blank",
    "skills": [
      "cross_multiplication",
      "clear_fractions"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Write the equation first, then solve.",
      "Transpose terms carefully — signs flip when crossing =.",
      "Simplify step by step."
    ],
    "explanation": "x = 9 × 4/3 = 12.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Solving 5(x − 2)/3 = 2(x + 1)/2, the value of x is ________.",
    "correct_answer": "13/2",
    "concept": "advanced_equations",
    "level": 3,
    "difficulty": "hard",
    "question_type": "fill_in_the_blank",
    "skills": [
      "cross_multiplication",
      "clear_fractions"
    ],
    "misconception_target": "equation_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Identify the operation applied to the unknown.",
      "Apply the inverse operation to both sides.",
      "Verify with substitution."
    ],
    "explanation": "Multiply by LCM 6: 10(x−2) = 6(x+1) → 10x−20 = 6x+6 → 4x = 26 → x = 13/2.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "Arrange steps to solve (x+1)/(2x+3) = 3/8.",
    "options": [
      "1:Write: (x+1)/(2x+3) = 3/8",
      "2:Cross-multiply: 8(x+1) = 3(2x+3)",
      "3:Expand: 8x+8 = 6x+9",
      "4:Simplify: 2x = 1 → x = 1/2",
      "5:Verify: (1/2+1)/(2×1/2+3) = (3/2)/4 = 3/8 ✓"
    ],
    "correct_answer": "order: [1,2,3,4,5]",
    "concept": "advanced_equations",
    "level": 3,
    "difficulty": "hard",
    "question_type": "drag_sort",
    "skills": [
      "solve_step_by_step",
      "cross_multiplication"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Arrange by cause and effect.",
      "Mathematical steps follow a strict order.",
      "Verify by reading your arrangement from top to bottom."
    ],
    "explanation": "Cross-multiply → expand → simplify → verify.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "Arrange steps to solve 2x/3 + 1 = 7x/15 + 3.",
    "options": [
      "1:Multiply all terms by 15 (LCM of 3 and 15)",
      "2:10x + 15 = 7x + 45",
      "3:10x − 7x = 45 − 15",
      "4:3x = 30 → x = 10"
    ],
    "correct_answer": "order: [1,2,3,4]",
    "concept": "advanced_equations",
    "level": 2,
    "difficulty": "medium",
    "question_type": "drag_sort",
    "skills": [
      "solve_step_by_step",
      "cross_multiplication"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Identify the starting condition.",
      "What operation comes next?",
      "Does your sequence lead to the stated answer?"
    ],
    "explanation": "Clear fractions first with LCM, then solve.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Arrange steps to solve (3x−1)/4 − (2x+3)/6 = 1.",
    "options": [
      "1:Find LCM of 4 and 6 = 12",
      "2:Multiply all terms by 12: 3(3x−1) − 2(2x+3) = 12",
      "3:Expand: 9x − 3 − 4x − 6 = 12",
      "4:5x − 9 = 12 → 5x = 21 → x = 21/5"
    ],
    "correct_answer": "order: [1,2,3,4]",
    "concept": "advanced_equations",
    "level": 3,
    "difficulty": "hard",
    "question_type": "drag_sort",
    "skills": [
      "solve_step_by_step",
      "cross_multiplication"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Arrange by cause and effect.",
      "Mathematical steps follow a strict order.",
      "Verify by reading your arrangement from top to bottom."
    ],
    "explanation": "LCM clears all fractions in one step.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "The sum of three consecutive integers is 48. What are the integers?",
    "options": [
      "14, 15, 16",
      "15, 16, 17",
      "16, 17, 18",
      "13, 14, 15"
    ],
    "correct_answer": "15, 16, 17",
    "concept": "word_problems_basic",
    "level": 1,
    "difficulty": "easy",
    "question_type": "mcq",
    "skills": [
      "equation_translation",
      "word_to_algebra"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "recall",
    "story_based": false,
    "time_expected": 45,
    "hints": [
      "Read the question carefully before checking options.",
      "Eliminate obviously wrong options first.",
      "Substitute your answer back to verify."
    ],
    "explanation": "n + (n+1) + (n+2) = 48 → 3n+3 = 48 → n = 15.",
    "explanation_depth": "short"
  },
  {
    "question_text": "A number increased by 12 is 29. What is the number?",
    "options": [
      "15",
      "17",
      "19",
      "21"
    ],
    "correct_answer": "17",
    "concept": "word_problems_basic",
    "level": 1,
    "difficulty": "easy",
    "question_type": "mcq",
    "skills": [
      "equation_translation",
      "word_to_algebra"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "recall",
    "story_based": false,
    "time_expected": 45,
    "hints": [
      "Read the question carefully before checking options.",
      "Eliminate obviously wrong options first.",
      "Substitute your answer back to verify."
    ],
    "explanation": "x + 12 = 29 → x = 17.",
    "explanation_depth": "short"
  },
  {
    "question_text": "When 4 is subtracted from twice a number, the result is 10. Find the number.",
    "options": [
      "5",
      "6",
      "7",
      "8"
    ],
    "correct_answer": "7",
    "concept": "word_problems_basic",
    "level": 1,
    "difficulty": "easy",
    "question_type": "mcq",
    "skills": [
      "equation_translation",
      "word_to_algebra"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "recall",
    "story_based": false,
    "time_expected": 45,
    "hints": [
      "Read the question carefully before checking options.",
      "Eliminate obviously wrong options first.",
      "Substitute your answer back to verify."
    ],
    "explanation": "2x − 4 = 10 → 2x = 14 → x = 7.",
    "explanation_depth": "short"
  },
  {
    "question_text": "The perimeter of a rectangle is 40 cm. If the length is 5 more than the width, find the width.",
    "options": [
      "7.5 cm",
      "10 cm",
      "12.5 cm",
      "15 cm"
    ],
    "correct_answer": "7.5 cm",
    "concept": "word_problems_basic",
    "level": 2,
    "difficulty": "medium",
    "question_type": "mcq",
    "skills": [
      "equation_translation",
      "word_to_algebra"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Identify what the question is asking for.",
      "Write out the key information.",
      "Check your arithmetic step by step."
    ],
    "explanation": "2(w + w+5) = 40 → 4w+10 = 40 → 4w = 30 → w = 7.5 cm.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "If the sum of two consecutive even numbers is 46, what are the numbers?",
    "options": [
      "20 and 26",
      "22 and 24",
      "18 and 28",
      "21 and 25"
    ],
    "correct_answer": "22 and 24",
    "concept": "word_problems_basic",
    "level": 2,
    "difficulty": "medium",
    "question_type": "mcq",
    "skills": [
      "equation_translation",
      "word_to_algebra"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Identify what the question is asking for.",
      "Write out the key information.",
      "Check your arithmetic step by step."
    ],
    "explanation": "n + (n+2) = 46 → 2n = 44 → n = 22.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Raju has ₹5 and ₹10 notes totalling ₹110. He has 16 notes. How many ₹5 notes?",
    "options": [
      "6",
      "8",
      "10",
      "12"
    ],
    "correct_answer": "10",
    "concept": "word_problems_basic",
    "level": 2,
    "difficulty": "medium",
    "question_type": "mcq",
    "skills": [
      "equation_translation",
      "word_to_algebra"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Identify what the question is asking for.",
      "Write out the key information.",
      "Check your arithmetic step by step."
    ],
    "explanation": "Let ₹5 notes = x. 5x + 10(16−x) = 110 → −5x = −50 → x = 10.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "A train covers a certain distance at 60 km/h and returns at 40 km/h. If the total time is 5 hours, what is the one-way distance?",
    "options": [
      "100 km",
      "120 km",
      "150 km",
      "180 km"
    ],
    "correct_answer": "120 km",
    "concept": "word_problems_basic",
    "level": 3,
    "difficulty": "hard",
    "question_type": "mcq",
    "skills": [
      "equation_translation",
      "word_to_algebra"
    ],
    "misconception_target": "equation_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Look for key words: \"increased by\", \"times\", \"ratio\".",
      "Set up the equation before solving.",
      "Verify your answer satisfies all conditions."
    ],
    "explanation": "d/60 + d/40 = 5 → (2d+3d)/120 = 5 → 5d = 600 → d = 120 km.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "The sum of the digits of a two-digit number is 9. If the digits are reversed, the new number is 27 more than the original. Find the original number.",
    "options": [
      "36",
      "45",
      "27",
      "63"
    ],
    "correct_answer": "36",
    "concept": "word_problems_basic",
    "level": 3,
    "difficulty": "hard",
    "question_type": "mcq",
    "skills": [
      "equation_translation",
      "word_to_algebra"
    ],
    "misconception_target": "equation_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Look for key words: \"increased by\", \"times\", \"ratio\".",
      "Set up the equation before solving.",
      "Verify your answer satisfies all conditions."
    ],
    "explanation": "Let tens = t, units = u; t+u=9. Reversed: (10u+t)−(10t+u)=27 → 9(u−t)=27 → u−t=3. Solving: t=3, u=6. Number=36.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "A shopkeeper sold an item for ₹540, gaining 8%. What was the cost price?",
    "options": [
      "₹480",
      "₹500",
      "₹520",
      "₹560"
    ],
    "correct_answer": "₹500",
    "concept": "word_problems_basic",
    "level": 1,
    "difficulty": "easy",
    "question_type": "mcq",
    "skills": [
      "equation_translation",
      "word_to_algebra"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "recall",
    "story_based": false,
    "time_expected": 45,
    "hints": [
      "Read the question carefully before checking options.",
      "Eliminate obviously wrong options first.",
      "Substitute your answer back to verify."
    ],
    "explanation": "SP = CP × (1 + 8/100) → 540 = CP × 1.08 → CP = 500.",
    "explanation_depth": "short"
  },
  {
    "question_text": "If the sum of two consecutive integers is 31, then the smaller integer is ________.",
    "correct_answer": "15",
    "concept": "word_problems_basic",
    "level": 1,
    "difficulty": "easy",
    "question_type": "fill_in_the_blank",
    "skills": [
      "equation_translation",
      "word_to_algebra"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "recall",
    "story_based": false,
    "time_expected": 45,
    "hints": [
      "Isolate the unknown on one side.",
      "Use inverse operations to undo each step.",
      "Check your answer by substituting back."
    ],
    "explanation": "n + (n+1) = 31 → 2n = 30 → n = 15.",
    "explanation_depth": "short"
  },
  {
    "question_text": "A number when doubled and then increased by 3 gives 11. The number is ________.",
    "correct_answer": "4",
    "concept": "word_problems_basic",
    "level": 1,
    "difficulty": "easy",
    "question_type": "fill_in_the_blank",
    "skills": [
      "equation_translation",
      "word_to_algebra"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "recall",
    "story_based": false,
    "time_expected": 45,
    "hints": [
      "Isolate the unknown on one side.",
      "Use inverse operations to undo each step.",
      "Check your answer by substituting back."
    ],
    "explanation": "2x + 3 = 11 → 2x = 8 → x = 4.",
    "explanation_depth": "short"
  },
  {
    "question_text": "Three times a number minus 7 equals 14. The number is ________.",
    "correct_answer": "7",
    "concept": "word_problems_basic",
    "level": 2,
    "difficulty": "medium",
    "question_type": "fill_in_the_blank",
    "skills": [
      "equation_translation",
      "word_to_algebra"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Write the equation first, then solve.",
      "Transpose terms carefully — signs flip when crossing =.",
      "Simplify step by step."
    ],
    "explanation": "3x − 7 = 14 → 3x = 21 → x = 7.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "A father is 30 years older than his son. In 5 years, he will be twice as old as his son. The son's present age is ________.",
    "correct_answer": "25",
    "concept": "word_problems_basic",
    "level": 2,
    "difficulty": "medium",
    "question_type": "fill_in_the_blank",
    "skills": [
      "equation_translation",
      "word_to_algebra"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Write the equation first, then solve.",
      "Transpose terms carefully — signs flip when crossing =.",
      "Simplify step by step."
    ],
    "explanation": "x+30+5 = 2(x+5) → x+35 = 2x+10 → x = 25.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "The product of 6 and a number is 54. The number is ________.",
    "correct_answer": "9",
    "concept": "word_problems_basic",
    "level": 1,
    "difficulty": "easy",
    "question_type": "fill_in_the_blank",
    "skills": [
      "equation_translation",
      "word_to_algebra"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "recall",
    "story_based": false,
    "time_expected": 45,
    "hints": [
      "Isolate the unknown on one side.",
      "Use inverse operations to undo each step.",
      "Check your answer by substituting back."
    ],
    "explanation": "6x = 54 → x = 9.",
    "explanation_depth": "short"
  },
  {
    "question_text": "The sum of three consecutive odd numbers is 51. The middle number is ________.",
    "correct_answer": "17",
    "concept": "word_problems_basic",
    "level": 2,
    "difficulty": "medium",
    "question_type": "fill_in_the_blank",
    "skills": [
      "equation_translation",
      "word_to_algebra"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Write the equation first, then solve.",
      "Transpose terms carefully — signs flip when crossing =.",
      "Simplify step by step."
    ],
    "explanation": "Let middle = n. (n−2)+n+(n+2) = 51 → 3n = 51 → n = 17.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Two numbers are in ratio 3:5. Their sum is 64. The larger number is ________.",
    "correct_answer": "40",
    "concept": "word_problems_basic",
    "level": 3,
    "difficulty": "hard",
    "question_type": "fill_in_the_blank",
    "skills": [
      "equation_translation",
      "word_to_algebra"
    ],
    "misconception_target": "equation_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Identify the operation applied to the unknown.",
      "Apply the inverse operation to both sides.",
      "Verify with substitution."
    ],
    "explanation": "3x + 5x = 64 → 8x = 64 → x = 8. Larger = 5 × 8 = 40.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "Arrange the steps to solve: 'A number increased by 12 is 29. Find the number.'",
    "options": [
      "1:Let the number = x",
      "2:Write equation: x + 12 = 29",
      "3:Subtract 12: x = 17",
      "4:The number is 17."
    ],
    "correct_answer": "order: [1,2,3,4]",
    "concept": "word_problems_basic",
    "level": 1,
    "difficulty": "easy",
    "question_type": "drag_sort",
    "skills": [
      "solve_step_by_step",
      "equation_translation"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "recall",
    "story_based": false,
    "time_expected": 45,
    "hints": [
      "Think about what logically comes first.",
      "Each step should follow from the previous one.",
      "Read all steps before arranging."
    ],
    "explanation": "Define → form → solve → state.",
    "explanation_depth": "short"
  },
  {
    "question_text": "Hari's age is 5 years more than twice Raju's age. Hari is 25. Find Raju's age.",
    "options": [
      "1:Let Raju's age = x",
      "2:Form equation: 2x + 5 = 25",
      "3:Simplify: 2x = 20",
      "4:Solve: x = 10. Raju is 10 years old."
    ],
    "correct_answer": "order: [1,2,3,4]",
    "concept": "word_problems_basic",
    "level": 2,
    "difficulty": "medium",
    "question_type": "drag_and_drop",
    "skills": [
      "solve_step_by_step",
      "equation_translation"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Identify the starting condition.",
      "What operation comes next?",
      "Does your sequence lead to the stated answer?"
    ],
    "explanation": "Define variable → form equation → simplify → state answer.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Arrange the steps to solve: 'A train goes 120 km at 60 km/h and returns at 40 km/h. Find total time.'",
    "options": [
      "1:Time going = 120/60 = 2 hours",
      "2:Time returning = 120/40 = 3 hours",
      "3:Total time = 2 + 3 = 5 hours",
      "4:Average speed = Total distance / Total time = 240/5 = 48 km/h"
    ],
    "correct_answer": "order: [1,2,3,4]",
    "concept": "word_problems_basic",
    "level": 3,
    "difficulty": "hard",
    "question_type": "drag_sort",
    "skills": [
      "solve_step_by_step",
      "equation_translation"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Arrange by cause and effect.",
      "Mathematical steps follow a strict order.",
      "Verify by reading your arrangement from top to bottom."
    ],
    "explanation": "Use time = distance ÷ speed for each leg, then add.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "The present ages of Anu and Raj are in ratio 4:5. Eight years from now, the ratio becomes 5:6. What is Anu's present age?",
    "options": [
      "24 years",
      "32 years",
      "40 years",
      "16 years"
    ],
    "correct_answer": "32 years",
    "concept": "word_problems_advanced",
    "level": 2,
    "difficulty": "medium",
    "question_type": "mcq",
    "skills": [
      "ratio_problems",
      "age_problems",
      "digit_problems"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Identify what the question is asking for.",
      "Write out the key information.",
      "Check your arithmetic step by step."
    ],
    "explanation": "Let ages = 4x and 5x. (4x+8)/(5x+8) = 5/6 → x = 8. Anu = 32.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Hari's age four years from now will be three times his age four years ago. How old is Hari now?",
    "options": [
      "8 years",
      "10 years",
      "12 years",
      "16 years"
    ],
    "correct_answer": "8 years",
    "concept": "word_problems_advanced",
    "level": 3,
    "difficulty": "hard",
    "question_type": "mcq",
    "skills": [
      "ratio_problems",
      "age_problems",
      "digit_problems"
    ],
    "misconception_target": "equation_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Look for key words: \"increased by\", \"times\", \"ratio\".",
      "Set up the equation before solving.",
      "Verify your answer satisfies all conditions."
    ],
    "explanation": "x+4 = 3(x−4) → x+4 = 3x−12 → 16 = 2x → x = 8.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "The denominator of a rational number exceeds numerator by 8. Numerator increased by 17, denominator decreased by 1 gives 3/2. Find the original number.",
    "options": [
      "13/21",
      "11/19",
      "13/19",
      "5/13"
    ],
    "correct_answer": "13/21",
    "concept": "word_problems_advanced",
    "level": 3,
    "difficulty": "hard",
    "question_type": "mcq",
    "skills": [
      "ratio_problems",
      "age_problems",
      "digit_problems"
    ],
    "misconception_target": "equation_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Look for key words: \"increased by\", \"times\", \"ratio\".",
      "Set up the equation before solving.",
      "Verify your answer satisfies all conditions."
    ],
    "explanation": "(x+17)/(x+7) = 3/2 → 2x+34 = 3x+21 → x = 13. Fraction = 13/21.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "Ages of Hari and Harry are in ratio 5:7. Four years from now ratio will be 3:4. Their present ages are:",
    "options": [
      "Hari=20, Harry=28",
      "Hari=10, Harry=14",
      "Hari=15, Harry=21",
      "Hari=25, Harry=35"
    ],
    "correct_answer": "Hari=20, Harry=28",
    "concept": "word_problems_advanced",
    "level": 2,
    "difficulty": "medium",
    "question_type": "mcq",
    "skills": [
      "ratio_problems",
      "age_problems",
      "digit_problems"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Identify what the question is asking for.",
      "Write out the key information.",
      "Check your arithmetic step by step."
    ],
    "explanation": "5x and 7x. (5x+4)/(7x+4) = 3/4 → 20x+16 = 21x+12 → x = 4. Ages: 20 and 28.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "A two-digit number is 4 times the sum of its digits. If 27 is added, the digits are reversed. Find the number.",
    "options": [
      "36",
      "24",
      "48",
      "12"
    ],
    "correct_answer": "36",
    "concept": "word_problems_advanced",
    "level": 3,
    "difficulty": "hard",
    "question_type": "mcq",
    "skills": [
      "ratio_problems",
      "age_problems",
      "digit_problems"
    ],
    "misconception_target": "equation_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Look for key words: \"increased by\", \"times\", \"ratio\".",
      "Set up the equation before solving.",
      "Verify your answer satisfies all conditions."
    ],
    "explanation": "Let tens = t, units = u. 10t+u = 4(t+u) → u = 2t. 10t+u+27 = 10u+t → u−t = 3. So t=3, u=6. Number=36.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "A sum of ₹700 is in ₹10 and ₹50 notes. Total notes = 22. How many ₹50 notes are there?",
    "options": [
      "7",
      "8",
      "12",
      "15"
    ],
    "correct_answer": "12",
    "concept": "word_problems_advanced",
    "level": 3,
    "difficulty": "hard",
    "question_type": "mcq",
    "skills": [
      "ratio_problems",
      "age_problems",
      "digit_problems"
    ],
    "misconception_target": "equation_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Look for key words: \"increased by\", \"times\", \"ratio\".",
      "Set up the equation before solving.",
      "Verify your answer satisfies all conditions."
    ],
    "explanation": "Let ₹50 notes = x. 50x + 10(22−x) = 700 → 40x = 480 → x = 12.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "A boat travels 24 km upstream and 28 km downstream in 6 hours. If the stream speed is 4 km/h, find the boat's speed in still water.",
    "options": [
      "8 km/h",
      "10 km/h",
      "12 km/h",
      "6 km/h"
    ],
    "correct_answer": "10 km/h",
    "concept": "word_problems_advanced",
    "level": 3,
    "difficulty": "hard",
    "question_type": "mcq",
    "skills": [
      "ratio_problems",
      "age_problems",
      "digit_problems"
    ],
    "misconception_target": "equation_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Look for key words: \"increased by\", \"times\", \"ratio\".",
      "Set up the equation before solving.",
      "Verify your answer satisfies all conditions."
    ],
    "explanation": "Let boat speed = v. 24/(v−4) + 28/(v+4) = 6. At v=10: 24/6 + 28/14 = 4 + 2 = 6 ✓. Boat speed = 10 km/h.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "The denominator of a rational number is greater than its numerator by 8. After changes, fraction = 3/2. The original numerator is ________.",
    "correct_answer": "13",
    "concept": "word_problems_advanced",
    "level": 3,
    "difficulty": "hard",
    "question_type": "fill_in_the_blank",
    "skills": [
      "age_problems",
      "ratio_problems"
    ],
    "misconception_target": "equation_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Identify the operation applied to the unknown.",
      "Apply the inverse operation to both sides.",
      "Verify with substitution."
    ],
    "explanation": "(x+17)/(x+7) = 3/2 → x = 13.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "Present ages of Anu and Raj are in ratio 4:5. Eight years later ratio is 5:6. Raj's present age is ________.",
    "correct_answer": "40",
    "concept": "word_problems_advanced",
    "level": 2,
    "difficulty": "medium",
    "question_type": "fill_in_the_blank",
    "skills": [
      "age_problems",
      "ratio_problems"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Write the equation first, then solve.",
      "Transpose terms carefully — signs flip when crossing =.",
      "Simplify step by step."
    ],
    "explanation": "5x; x = 8. Raj = 5 × 8 = 40 years.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Hari's age 4 years from now = 3 times his age 4 years ago. Hari's present age is ________.",
    "correct_answer": "8",
    "concept": "word_problems_advanced",
    "level": 3,
    "difficulty": "hard",
    "question_type": "fill_in_the_blank",
    "skills": [
      "age_problems",
      "ratio_problems"
    ],
    "misconception_target": "equation_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Identify the operation applied to the unknown.",
      "Apply the inverse operation to both sides.",
      "Verify with substitution."
    ],
    "explanation": "x+4 = 3(x−4) → 16 = 2x → x = 8.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "Hari and Harry's ages are in ratio 5:7. Four years later ratio is 3:4. Hari's present age is ________.",
    "correct_answer": "20",
    "concept": "word_problems_advanced",
    "level": 2,
    "difficulty": "medium",
    "question_type": "fill_in_the_blank",
    "skills": [
      "age_problems",
      "ratio_problems"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Write the equation first, then solve.",
      "Transpose terms carefully — signs flip when crossing =.",
      "Simplify step by step."
    ],
    "explanation": "5x and 7x. x = 4. Hari = 20.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Hari and Harry's ages are in ratio 5:7. Four years from now ratio is 3:4. Harry's present age is ________.",
    "correct_answer": "28",
    "concept": "word_problems_advanced",
    "level": 3,
    "difficulty": "hard",
    "question_type": "fill_in_the_blank",
    "skills": [
      "age_problems",
      "ratio_problems"
    ],
    "misconception_target": "equation_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Identify the operation applied to the unknown.",
      "Apply the inverse operation to both sides.",
      "Verify with substitution."
    ],
    "explanation": "7x; x = 4. Harry = 7 × 4 = 28.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "A two-digit number is 4 times the sum of its digits. If 27 is added, digits are reversed. The tens digit of the original number is ________.",
    "correct_answer": "3",
    "concept": "word_problems_advanced",
    "level": 3,
    "difficulty": "hard",
    "question_type": "fill_in_the_blank",
    "skills": [
      "age_problems",
      "ratio_problems"
    ],
    "misconception_target": "equation_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Identify the operation applied to the unknown.",
      "Apply the inverse operation to both sides.",
      "Verify with substitution."
    ],
    "explanation": "u = 2t and u−t = 3 → t = 3.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "Arrange the steps to solve the age-ratio problem: 'Anu and Raj's ages are in ratio 4:5. Eight years later ratio is 5:6.'",
    "options": [
      "1:Let Anu = 4x, Raj = 5x",
      "2:After 8 years: (4x+8)/(5x+8) = 5/6",
      "3:Cross-multiply: 6(4x+8) = 5(5x+8)",
      "4:24x + 48 = 25x + 40 → x = 8",
      "5:Anu = 32 years, Raj = 40 years"
    ],
    "correct_answer": "order: [1,2,3,4,5]",
    "concept": "word_problems_advanced",
    "level": 3,
    "difficulty": "hard",
    "question_type": "drag_sort",
    "skills": [
      "solve_step_by_step",
      "ratio_problems"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Arrange by cause and effect.",
      "Mathematical steps follow a strict order.",
      "Verify by reading your arrangement from top to bottom."
    ],
    "explanation": "Define ratio variable → future ratio → cross-multiply → solve → state ages.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "Arrange the steps to solve the fraction problem: 'Denominator is 8 more than numerator; after changes, fraction = 3/2.'",
    "options": [
      "1:Let numerator = x, denominator = x + 8",
      "2:After changes: (x+17)/(x+7) = 3/2",
      "3:Cross-multiply: 2(x+17) = 3(x+7)",
      "4:2x + 34 = 3x + 21 → x = 13",
      "5:Original fraction = 13/21"
    ],
    "correct_answer": "order: [1,2,3,4,5]",
    "concept": "word_problems_advanced",
    "level": 3,
    "difficulty": "hard",
    "question_type": "drag_sort",
    "skills": [
      "solve_step_by_step",
      "ratio_problems"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Arrange by cause and effect.",
      "Mathematical steps follow a strict order.",
      "Verify by reading your arrangement from top to bottom."
    ],
    "explanation": "Define num/den → set up changed fraction → cross-multiply → solve → state.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "Arrange the steps to solve: 'Hari & Harry ages ratio 5:7. Four years later ratio 3:4.'",
    "options": [
      "1:Let Hari = 5x, Harry = 7x",
      "2:After 4 years: (5x+4)/(7x+4) = 3/4",
      "3:Cross-multiply: 4(5x+4) = 3(7x+4)",
      "4:20x+16 = 21x+12 → x = 4",
      "5:Hari = 20 years, Harry = 28 years"
    ],
    "correct_answer": "order: [1,2,3,4,5]",
    "concept": "word_problems_advanced",
    "level": 2,
    "difficulty": "medium",
    "question_type": "drag_sort",
    "skills": [
      "solve_step_by_step",
      "ratio_problems"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Identify the starting condition.",
      "What operation comes next?",
      "Does your sequence lead to the stated answer?"
    ],
    "explanation": "Define ratio variable → future ratio → cross-multiply → solve → state.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Solve: (x + 3)/4 = (x − 1)/2. What is x?",
    "options": [
      "x = 5",
      "x = 7",
      "x = −5",
      "x = −7"
    ],
    "correct_answer": "x = 5",
    "concept": "advanced_equations",
    "level": 2,
    "difficulty": "medium",
    "question_type": "mcq",
    "skills": [
      "cross_multiplication",
      "clear_fractions"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Identify what the question is asking for.",
      "Write out the key information.",
      "Check your arithmetic step by step."
    ],
    "explanation": "Multiply by 4: x+3 = 2(x−1) → x+3 = 2x−2 → 5 = x.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Arrange the steps to simplify the expression 4a + 3b − 2a + b.",
    "options": [
      "1:Write original: 4a + 3b − 2a + b",
      "2:Group a-terms: 4a − 2a = 2a",
      "3:Group b-terms: 3b + b = 4b",
      "4:Result: 2a + 4b"
    ],
    "correct_answer": "order: [1,2,3,4]",
    "concept": "expressions_foundation",
    "level": 2,
    "difficulty": "medium",
    "question_type": "drag_sort",
    "skills": [
      "identify_like_terms",
      "combine_coefficients"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Identify like terms first.",
      "Group same variables together.",
      "Combine coefficients of each group."
    ],
    "explanation": "Collect a-terms and b-terms separately, then combine.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Arrange the steps to evaluate 3x² − 2x + 1 when x = 2.",
    "options": [
      "1:Substitute x = 2: 3(2²) − 2(2) + 1",
      "2:Evaluate powers: 3(4) − 4 + 1",
      "3:Multiply: 12 − 4 + 1",
      "4:Add and subtract left to right: 9"
    ],
    "correct_answer": "order: [1,2,3,4]",
    "concept": "expressions_foundation",
    "level": 2,
    "difficulty": "medium",
    "question_type": "drag_sort",
    "skills": [
      "evaluate_expressions",
      "identify_variables"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Always substitute before simplifying.",
      "Apply BODMAS: powers before multiplication.",
      "Work left to right for addition and subtraction."
    ],
    "explanation": "Substitute → powers → multiply → add/subtract. Result = 9.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Group the following terms by dragging them into the correct like-terms category.",
    "options": [
      "CAT:x terms",
      "CAT:x² terms",
      "CAT:constant terms",
      "1:5x",
      "2:3x²",
      "3:−2x",
      "4:7",
      "5:x²",
      "6:−9"
    ],
    "correct_answer": "x terms: [1,3] | x² terms: [2,5] | constant terms: [4,6]",
    "concept": "expressions_foundation",
    "level": 1,
    "difficulty": "easy",
    "question_type": "drag_sort",
    "skills": [
      "identify_like_terms",
      "classify_expressions"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "recall",
    "story_based": false,
    "time_expected": 45,
    "hints": [
      "Like terms must have exactly the same variable and power.",
      "Constants have no variable part.",
      "x and x² are NOT like terms."
    ],
    "explanation": "5x and −2x are x-terms; 3x² and x² are x²-terms; 7 and −9 are constants.",
    "explanation_depth": "short"
  },
  {
    "question_text": "Arrange the steps to add the expressions (2x² + 3x − 1) and (x² − 5x + 4).",
    "options": [
      "1:Write side by side: (2x² + 3x − 1) + (x² − 5x + 4)",
      "2:Group x²-terms: 2x² + x² = 3x²",
      "3:Group x-terms: 3x − 5x = −2x",
      "4:Group constants: −1 + 4 = 3",
      "5:Result: 3x² − 2x + 3"
    ],
    "correct_answer": "order: [1,2,3,4,5]",
    "concept": "expressions_foundation",
    "level": 3,
    "difficulty": "hard",
    "question_type": "drag_sort",
    "skills": [
      "identify_like_terms",
      "combine_coefficients"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Remove brackets, then collect like terms systematically.",
      "Group by term type: x², x, constants.",
      "Verify by substituting a value."
    ],
    "explanation": "Combine each type of like term in order. Result: 3x² − 2x + 3.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "The degree of the expression 5x³y² is ________.",
    "correct_answer": "5",
    "concept": "expressions_foundation",
    "level": 3,
    "difficulty": "hard",
    "question_type": "fill_in_the_blank",
    "skills": [
      "classify_expressions",
      "identify_variables"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Add the exponents of ALL variables in the term.",
      "5x³y² means x has power 3 and y has power 2.",
      "Degree = sum of all exponents."
    ],
    "explanation": "Degree = 3 + 2 = 5. Add all variable exponents in one term.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "The value of 2x² + 3 when x = −2 is ________.",
    "correct_answer": "11",
    "concept": "expressions_foundation",
    "level": 2,
    "difficulty": "medium",
    "question_type": "fill_in_the_blank",
    "skills": [
      "evaluate_expressions",
      "identify_variables"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Substitute x = −2 carefully.",
      "(−2)² = 4, not −4.",
      "Multiply by 2 then add 3."
    ],
    "explanation": "2(−2)² + 3 = 2(4) + 3 = 8 + 3 = 11.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Arrange the steps to expand and simplify (2x + 3)².",
    "options": [
      "1:Write: (2x + 3)²",
      "2:Apply (a + b)²: (2x)² + 2(2x)(3) + 3²",
      "3:Evaluate: 4x² + 12x + 9",
      "4:Verify at x = 1: (2+3)² = 25 and 4+12+9 = 25 ✓"
    ],
    "correct_answer": "order: [1,2,3,4]",
    "concept": "multiplication_expressions",
    "level": 2,
    "difficulty": "medium",
    "question_type": "drag_sort",
    "skills": [
      "apply_identities",
      "expand_expressions"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Identify a and b first.",
      "Apply the identity step by step.",
      "Always verify with a numeric value."
    ],
    "explanation": "(a+b)² with a=2x, b=3: 4x² + 12x + 9.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Arrange the steps to verify that 105² = 11025 using an identity.",
    "options": [
      "1:Write 105 = 100 + 5",
      "2:Apply (a + b)²: (100)² + 2(100)(5) + (5)²",
      "3:Evaluate: 10000 + 1000 + 25",
      "4:Result: 11025"
    ],
    "correct_answer": "order: [1,2,3,4]",
    "concept": "multiplication_expressions",
    "level": 2,
    "difficulty": "medium",
    "question_type": "drag_sort",
    "skills": [
      "apply_identities",
      "expand_expressions"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Rewrite as (100 + 5) to use a standard identity.",
      "Expand term by term.",
      "Add the three parts."
    ],
    "explanation": "Using (a+b)²=a²+2ab+b² with a=100, b=5: 10000+1000+25=11025.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Arrange the steps to multiply (x + 2)(x − 3) using FOIL.",
    "options": [
      "1:First: x × x = x²",
      "2:Outer: x × (−3) = −3x",
      "3:Inner: 2 × x = 2x",
      "4:Last: 2 × (−3) = −6",
      "5:Combine: x² − 3x + 2x − 6 = x² − x − 6"
    ],
    "correct_answer": "order: [1,2,3,4,5]",
    "concept": "multiplication_expressions",
    "level": 3,
    "difficulty": "hard",
    "question_type": "drag_sort",
    "skills": [
      "multiply_polynomials",
      "expand_expressions"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "FOIL stands for First, Outer, Inner, Last.",
      "Keep track of signs carefully.",
      "Collect like terms at the end."
    ],
    "explanation": "FOIL: x²−3x+2x−6 = x²−x−6. Verify at x=3: 5×0=0 and 9−3−6=0 ✓.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "Arrange the steps to evaluate (3 + 4)² using the identity (a + b)².",
    "options": [
      "1:Identify a = 3, b = 4",
      "2:Apply identity: a² + 2ab + b² = 9 + 24 + 16",
      "3:Add: 9 + 24 + 16 = 49",
      "4:Verify: 7² = 49 ✓"
    ],
    "correct_answer": "order: [1,2,3,4]",
    "concept": "multiplication_expressions",
    "level": 1,
    "difficulty": "easy",
    "question_type": "drag_sort",
    "skills": [
      "apply_identities",
      "expand_expressions"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "recall",
    "story_based": false,
    "time_expected": 45,
    "hints": [
      "Name a and b clearly.",
      "Apply each part of the identity.",
      "Add and verify."
    ],
    "explanation": "(a+b)² with a=3, b=4: 9+24+16=49=7². ✓",
    "explanation_depth": "short"
  },
  {
    "question_text": "(x + 7)(x − 7) = x² − ________",
    "correct_answer": "49",
    "concept": "multiplication_expressions",
    "level": 1,
    "difficulty": "easy",
    "question_type": "fill_in_the_blank",
    "skills": [
      "apply_identities",
      "expand_expressions"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "recall",
    "story_based": false,
    "time_expected": 45,
    "hints": [
      "Use the difference-of-squares identity (a+b)(a−b)=a²−b².",
      "Here a=x and b=7.",
      "b²=7²=49."
    ],
    "explanation": "(x+7)(x−7)=x²−7²=x²−49.",
    "explanation_depth": "short"
  },
  {
    "question_text": "The expansion of (5x)² is ________",
    "correct_answer": "25x²",
    "concept": "multiplication_expressions",
    "level": 1,
    "difficulty": "easy",
    "question_type": "fill_in_the_blank",
    "skills": [
      "apply_identities",
      "expand_expressions"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "recall",
    "story_based": false,
    "time_expected": 45,
    "hints": [
      "Square both the coefficient and the variable separately.",
      "5²=25 and x²=x².",
      "Combine: 25x²."
    ],
    "explanation": "(5x)²=5²×x²=25x².",
    "explanation_depth": "short"
  },
  {
    "question_text": "Arrange the steps to solve 5x + 2 = 22.",
    "options": [
      "1:Write: 5x + 2 = 22",
      "2:Subtract 2 from both sides: 5x = 20",
      "3:Divide by 5: x = 4",
      "4:Verify: 5(4) + 2 = 22 ✓"
    ],
    "correct_answer": "order: [1,2,3,4]",
    "concept": "equation_basics",
    "level": 1,
    "difficulty": "easy",
    "question_type": "drag_sort",
    "skills": [
      "solve_step_by_step",
      "transposition"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "recall",
    "story_based": false,
    "time_expected": 45,
    "hints": [
      "Start by undoing the addition.",
      "Then undo the multiplication.",
      "Always verify your answer."
    ],
    "explanation": "Subtract → divide → verify. x = 4.",
    "explanation_depth": "short"
  },
  {
    "question_text": "Arrange the steps to solve x/4 − 3 = 2.",
    "options": [
      "1:Write: x/4 − 3 = 2",
      "2:Add 3 to both sides: x/4 = 5",
      "3:Multiply both sides by 4: x = 20",
      "4:Verify: 20/4 − 3 = 5 − 3 = 2 ✓"
    ],
    "correct_answer": "order: [1,2,3,4]",
    "concept": "equation_basics",
    "level": 2,
    "difficulty": "medium",
    "question_type": "drag_sort",
    "skills": [
      "solve_step_by_step",
      "transposition"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Clear the constant term first.",
      "Then clear the denominator by multiplying.",
      "Verify the answer."
    ],
    "explanation": "Add 3 → multiply by 4 → verify. x = 20.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Arrange the steps to verify whether x = 3 satisfies 4x − 5 = 7.",
    "options": [
      "1:Substitute x = 3 into LHS: 4(3) − 5",
      "2:Evaluate: 12 − 5 = 7",
      "3:Compare with RHS: 7 = 7 ✓",
      "4:Conclusion: x = 3 is the correct solution"
    ],
    "correct_answer": "order: [1,2,3,4]",
    "concept": "equation_basics",
    "level": 1,
    "difficulty": "easy",
    "question_type": "drag_sort",
    "skills": [
      "verify_solution",
      "transposition"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "recall",
    "story_based": false,
    "time_expected": 45,
    "hints": [
      "Substitute the value into the original equation.",
      "Evaluate both sides.",
      "If LHS = RHS, the solution is correct."
    ],
    "explanation": "Substitute → evaluate → compare → conclude.",
    "explanation_depth": "short"
  },
  {
    "question_text": "Arrange the steps to solve 3(x − 4) = 9.",
    "options": [
      "1:Write: 3(x − 4) = 9",
      "2:Divide both sides by 3: x − 4 = 3",
      "3:Add 4 to both sides: x = 7",
      "4:Verify: 3(7 − 4) = 3(3) = 9 ✓"
    ],
    "correct_answer": "order: [1,2,3,4]",
    "concept": "equation_basics",
    "level": 2,
    "difficulty": "medium",
    "question_type": "drag_sort",
    "skills": [
      "solve_step_by_step",
      "transposition"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Divide by the bracket coefficient first (or expand — both work).",
      "Then add 4 to isolate x.",
      "Verify by substituting back."
    ],
    "explanation": "Divide by 3 → add 4 → verify. x = 7.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Solve: 9x = 63. The value of x is ________.",
    "correct_answer": "7",
    "concept": "equation_basics",
    "level": 1,
    "difficulty": "easy",
    "question_type": "fill_in_the_blank",
    "skills": [
      "solve_linear",
      "transposition"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "recall",
    "story_based": false,
    "time_expected": 45,
    "hints": [
      "Divide both sides by 9.",
      "x = 63 ÷ 9.",
      "Verify: 9 × 7 = 63 ✓."
    ],
    "explanation": "x = 63 ÷ 9 = 7.",
    "explanation_depth": "short"
  },
  {
    "question_text": "Solve: 2x + 7 = 19. The value of x is ________.",
    "correct_answer": "6",
    "concept": "equation_basics",
    "level": 2,
    "difficulty": "medium",
    "question_type": "fill_in_the_blank",
    "skills": [
      "solve_linear",
      "transposition"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Subtract 7 from both sides: 2x = 12.",
      "Then divide by 2.",
      "Verify: 2(6)+7=19 ✓."
    ],
    "explanation": "2x = 12 → x = 6.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Arrange the steps to solve 4x − 3 = 2x + 9.",
    "options": [
      "1:Write: 4x − 3 = 2x + 9",
      "2:Subtract 2x from both sides: 2x − 3 = 9",
      "3:Add 3 to both sides: 2x = 12",
      "4:Divide by 2: x = 6",
      "5:Verify: 4(6)−3 = 21 and 2(6)+9 = 21 ✓"
    ],
    "correct_answer": "order: [1,2,3,4,5]",
    "concept": "equation_solving",
    "level": 2,
    "difficulty": "medium",
    "question_type": "drag_sort",
    "skills": [
      "solve_step_by_step",
      "transposition"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Collect variable terms on one side.",
      "Collect constant terms on the other.",
      "Divide by the coefficient last."
    ],
    "explanation": "Subtract 2x → add 3 → divide by 2 → verify. x = 6.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Arrange the steps to solve 3(2x − 1) = 5x + 4.",
    "options": [
      "1:Expand LHS: 6x − 3 = 5x + 4",
      "2:Subtract 5x from both sides: x − 3 = 4",
      "3:Add 3 to both sides: x = 7",
      "4:Verify: 3(2×7−1) = 3(13) = 39 and 5(7)+4 = 39 ✓"
    ],
    "correct_answer": "order: [1,2,3,4]",
    "concept": "equation_solving",
    "level": 3,
    "difficulty": "hard",
    "question_type": "drag_sort",
    "skills": [
      "solve_step_by_step",
      "transposition"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Expand the bracket first.",
      "Collect x-terms, then constants.",
      "Verify using the original equation."
    ],
    "explanation": "Expand → collect x → collect constant → verify. x = 7.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "Arrange the steps to solve (x + 3)/2 = (2x − 1)/3.",
    "options": [
      "1:Cross-multiply: 3(x + 3) = 2(2x − 1)",
      "2:Expand: 3x + 9 = 4x − 2",
      "3:Collect x-terms: 9 + 2 = 4x − 3x",
      "4:Result: x = 11",
      "5:Verify: (11+3)/2 = 7 and (22−1)/3 = 7 ✓"
    ],
    "correct_answer": "order: [1,2,3,4,5]",
    "concept": "equation_solving",
    "level": 3,
    "difficulty": "hard",
    "question_type": "drag_sort",
    "skills": [
      "solve_step_by_step",
      "clear_fractions"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Cross-multiply to clear both fractions at once.",
      "Expand carefully — watch signs.",
      "Collect variable terms on one side."
    ],
    "explanation": "Cross-multiply → expand → collect → verify. x = 11.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "Arrange the steps to verify that x = 3 satisfies 5x − 2 = 3(x + 1) + 1.",
    "options": [
      "1:Substitute x = 3 into LHS: 5(3) − 2 = 13",
      "2:Expand RHS: 3(3+1)+1 = 3(4)+1 = 13",
      "3:Compare: LHS = RHS = 13 ✓",
      "4:Conclusion: x = 3 is correct"
    ],
    "correct_answer": "order: [1,2,3,4]",
    "concept": "equation_solving",
    "level": 2,
    "difficulty": "medium",
    "question_type": "drag_sort",
    "skills": [
      "verify_solution",
      "transposition"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Evaluate LHS and RHS independently.",
      "Compare the two values.",
      "State your conclusion clearly."
    ],
    "explanation": "Evaluate LHS → evaluate RHS → compare → conclude.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Solve: 11x = 143. The value of x is ________.",
    "correct_answer": "13",
    "concept": "equation_solving",
    "level": 1,
    "difficulty": "easy",
    "question_type": "fill_in_the_blank",
    "skills": [
      "solve_linear",
      "transposition"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "recall",
    "story_based": false,
    "time_expected": 45,
    "hints": [
      "Divide both sides by 11.",
      "x = 143 ÷ 11.",
      "Verify: 11 × 13 = 143 ✓."
    ],
    "explanation": "x = 143 ÷ 11 = 13.",
    "explanation_depth": "short"
  },
  {
    "question_text": "Solve: 3x − 4 = 2x + 9. The value of x is ________.",
    "correct_answer": "13",
    "concept": "equation_solving",
    "level": 2,
    "difficulty": "medium",
    "question_type": "fill_in_the_blank",
    "skills": [
      "solve_linear",
      "transposition"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Move x-terms to one side: 3x − 2x = 9 + 4.",
      "Simplify: x = 13.",
      "Verify: 3(13)−4=35 and 2(13)+9=35 ✓."
    ],
    "explanation": "3x − 2x = 9 + 4 → x = 13.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Arrange the steps to solve x/3 + x/4 = 7.",
    "options": [
      "1:Find LCM of 3 and 4: LCM = 12",
      "2:Multiply all terms by 12: 4x + 3x = 84",
      "3:Combine: 7x = 84",
      "4:Divide: x = 12",
      "5:Verify: 12/3 + 12/4 = 4 + 3 = 7 ✓"
    ],
    "correct_answer": "order: [1,2,3,4,5]",
    "concept": "advanced_equations",
    "level": 3,
    "difficulty": "hard",
    "question_type": "drag_sort",
    "skills": [
      "solve_step_by_step",
      "clear_fractions"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Find the LCM of all denominators first.",
      "Multiply every term by the LCM.",
      "Solve and verify."
    ],
    "explanation": "LCM=12 → 4x+3x=84 → x=12.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "Arrange the steps to solve (2x + 1)/3 = (x + 4)/2.",
    "options": [
      "1:Cross-multiply: 2(2x + 1) = 3(x + 4)",
      "2:Expand: 4x + 2 = 3x + 12",
      "3:Subtract 3x: x + 2 = 12",
      "4:Subtract 2: x = 10",
      "5:Verify: (21)/3 = 7 and (14)/2 = 7 ✓"
    ],
    "correct_answer": "order: [1,2,3,4,5]",
    "concept": "advanced_equations",
    "level": 3,
    "difficulty": "hard",
    "question_type": "drag_sort",
    "skills": [
      "solve_step_by_step",
      "cross_multiplication"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Cross-multiply the proportion.",
      "Expand both sides.",
      "Collect like terms then solve."
    ],
    "explanation": "Cross-multiply → expand → collect → verify. x = 10.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "Arrange the steps to solve 1/(x + 1) = 2/(x + 4).",
    "options": [
      "1:Cross-multiply: (x + 4) = 2(x + 1)",
      "2:Expand RHS: x + 4 = 2x + 2",
      "3:Collect: 4 − 2 = 2x − x",
      "4:Result: x = 2",
      "5:Verify: 1/3 = 2/6 = 1/3 ✓"
    ],
    "correct_answer": "order: [1,2,3,4,5]",
    "concept": "advanced_equations",
    "level": 3,
    "difficulty": "hard",
    "question_type": "drag_sort",
    "skills": [
      "solve_step_by_step",
      "cross_multiplication"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Cross-multiply to remove both fractions.",
      "Expand the right side.",
      "Collect x-terms on one side."
    ],
    "explanation": "Cross-multiply → expand → collect → verify. x = 2.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "Arrange the steps to solve 5x/6 − x/4 = 1.",
    "options": [
      "1:Find LCM of 6 and 4: LCM = 12",
      "2:Multiply all terms by 12: 10x − 3x = 12",
      "3:Combine: 7x = 12",
      "4:Result: x = 12/7",
      "5:Verify: 5(12/7)/6 − (12/7)/4 = 10/7 − 3/7 = 7/7 = 1 ✓"
    ],
    "correct_answer": "order: [1,2,3,4,5]",
    "concept": "advanced_equations",
    "level": 3,
    "difficulty": "hard",
    "question_type": "drag_sort",
    "skills": [
      "solve_step_by_step",
      "clear_fractions"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "LCM(6,4)=12.",
      "Multiply: 12×5x/6=10x; 12×x/4=3x.",
      "Solve and verify."
    ],
    "explanation": "LCM=12 → 10x−3x=12 → x=12/7.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "Solve: (5x − 1)/3 = 3. The value of x is ________.",
    "correct_answer": "2",
    "concept": "advanced_equations",
    "level": 2,
    "difficulty": "medium",
    "question_type": "fill_in_the_blank",
    "skills": [
      "cross_multiplication",
      "clear_fractions"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Multiply both sides by 3: 5x − 1 = 9.",
      "Add 1: 5x = 10.",
      "Divide by 5: x = 2."
    ],
    "explanation": "5x − 1 = 9 → 5x = 10 → x = 2.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Cross-multiplying (x − 2)/4 = 3/2 gives 2(x − 2) = 12, so x = ________.",
    "correct_answer": "8",
    "concept": "advanced_equations",
    "level": 2,
    "difficulty": "medium",
    "question_type": "fill_in_the_blank",
    "skills": [
      "cross_multiplication",
      "clear_fractions"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Expand: 2x − 4 = 12.",
      "Add 4: 2x = 16.",
      "Divide by 2: x = 8."
    ],
    "explanation": "2x − 4 = 12 → 2x = 16 → x = 8.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Arrange the steps to solve: 'A man is 3 times as old as his son. In 12 years he will be twice as old. Find their present ages.'",
    "options": [
      "1:Let son's age = s; father's age = 3s",
      "2:In 12 years: 3s + 12 = 2(s + 12)",
      "3:Expand: 3s + 12 = 2s + 24",
      "4:Solve: s = 12; father = 36",
      "5:Verify: 36 + 12 = 48 = 2(12 + 12) ✓"
    ],
    "correct_answer": "order: [1,2,3,4,5]",
    "concept": "word_problems_basic",
    "level": 3,
    "difficulty": "hard",
    "question_type": "drag_sort",
    "skills": [
      "solve_step_by_step",
      "equation_translation"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Define variables for both ages.",
      "Write the future-age condition as an equation.",
      "Solve and verify both ages."
    ],
    "explanation": "Define → future equation → expand → solve → verify. Son=12, Father=36.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "Arrange the steps to solve: 'Perimeter of a triangle with sides x, x+3, 2x−1 equals 30.'",
    "options": [
      "1:Write perimeter equation: x + (x + 3) + (2x − 1) = 30",
      "2:Simplify: 4x + 2 = 30",
      "3:Subtract 2: 4x = 28",
      "4:Divide by 4: x = 7",
      "5:Sides: 7, 10, 13. Verify: 7+10+13 = 30 ✓"
    ],
    "correct_answer": "order: [1,2,3,4,5]",
    "concept": "word_problems_basic",
    "level": 2,
    "difficulty": "medium",
    "question_type": "drag_sort",
    "skills": [
      "solve_step_by_step",
      "equation_translation"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Write the perimeter equation by adding all sides.",
      "Collect like terms.",
      "Solve and name all three sides."
    ],
    "explanation": "Sum sides → simplify → solve → verify. x=7.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Arrange the steps to solve the speed problem: 'A car travels at (x + 10) km/h and covers 120 km in 2 hours.'",
    "options": [
      "1:Write distance equation: 2(x + 10) = 120",
      "2:Divide by 2: x + 10 = 60",
      "3:Subtract 10: x = 50 km/h",
      "4:Verify: 2(50 + 10) = 2(60) = 120 km ✓"
    ],
    "correct_answer": "order: [1,2,3,4]",
    "concept": "word_problems_basic",
    "level": 2,
    "difficulty": "medium",
    "question_type": "drag_sort",
    "skills": [
      "solve_step_by_step",
      "equation_translation"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Use Distance = Speed × Time.",
      "Write the equation and solve for x.",
      "Verify the answer."
    ],
    "explanation": "2(x+10)=120 → x=50 km/h.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Arrange the steps to solve: 'The angles of a triangle are x, 2x, and 3x degrees. Find each angle.'",
    "options": [
      "1:Use angle sum property: x + 2x + 3x = 180",
      "2:Simplify: 6x = 180",
      "3:Solve: x = 30°",
      "4:Angles: 30°, 60°, 90° — a right-angled triangle ✓"
    ],
    "correct_answer": "order: [1,2,3,4]",
    "concept": "word_problems_basic",
    "level": 2,
    "difficulty": "medium",
    "question_type": "drag_sort",
    "skills": [
      "solve_step_by_step",
      "equation_translation"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Use the angle sum property: all three angles add to 180°.",
      "Collect like terms and solve for x.",
      "State all three angles."
    ],
    "explanation": "x+2x+3x=180 → 6x=180 → x=30 → angles: 30°, 60°, 90°.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "The sum of two consecutive integers is 41. The smaller integer is ________.",
    "correct_answer": "20",
    "concept": "word_problems_basic",
    "level": 1,
    "difficulty": "easy",
    "question_type": "fill_in_the_blank",
    "skills": [
      "equation_translation",
      "word_to_algebra"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "recall",
    "story_based": false,
    "time_expected": 45,
    "hints": [
      "Let the integers be n and n+1.",
      "n + (n+1) = 41 → 2n = 40 → n = 20.",
      "Verify: 20 + 21 = 41 ✓."
    ],
    "explanation": "n + (n+1) = 41 → 2n+1 = 41 → n = 20.",
    "explanation_depth": "short"
  },
  {
    "question_text": "A number decreased by 9 is 17. The number is ________.",
    "correct_answer": "26",
    "concept": "word_problems_basic",
    "level": 1,
    "difficulty": "easy",
    "question_type": "fill_in_the_blank",
    "skills": [
      "equation_translation",
      "word_to_algebra"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "recall",
    "story_based": false,
    "time_expected": 45,
    "hints": [
      "Translate: x − 9 = 17.",
      "Add 9 to both sides.",
      "x = 26."
    ],
    "explanation": "x − 9 = 17 → x = 26.",
    "explanation_depth": "short"
  },
  {
    "question_text": "Arrange the steps to solve: 'Ages of A and B are in ratio 3:5. In 10 years ratio is 7:9. Find present ages.'",
    "options": [
      "1:Let A = 3x, B = 5x",
      "2:In 10 years: (3x + 10)/(5x + 10) = 7/9",
      "3:Cross-multiply: 9(3x + 10) = 7(5x + 10)",
      "4:Expand: 27x + 90 = 35x + 70 → 8x = 20 → x = 2.5",
      "5:Present ages: A = 7.5, B = 12.5. Verify: 17.5/22.5 = 7/9 ✓"
    ],
    "correct_answer": "order: [1,2,3,4,5]",
    "concept": "word_problems_advanced",
    "level": 3,
    "difficulty": "hard",
    "question_type": "drag_sort",
    "skills": [
      "solve_step_by_step",
      "ratio_problems"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Define both ages using the ratio variable x.",
      "Set up the future ratio as a fraction equation.",
      "Cross-multiply and solve."
    ],
    "explanation": "Define → future ratio → cross-multiply → solve → verify.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "Arrange the steps to solve: 'A is 4 years older than B. Five years ago A was twice as old as B.'",
    "options": [
      "1:Let B = x; then A = x + 4",
      "2:Five years ago: (x + 4 − 5) = 2(x − 5)",
      "3:Simplify: x − 1 = 2x − 10",
      "4:Solve: 9 = x; B = 9, A = 13",
      "5:Verify: 5 years ago A was 8, B was 4: 8 = 2 × 4 ✓"
    ],
    "correct_answer": "order: [1,2,3,4,5]",
    "concept": "word_problems_advanced",
    "level": 3,
    "difficulty": "hard",
    "question_type": "drag_sort",
    "skills": [
      "solve_step_by_step",
      "age_problems"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Define ages in terms of one variable.",
      "Set up the past-age condition.",
      "Solve and verify."
    ],
    "explanation": "Define → past-age equation → simplify → solve → verify. B=9, A=13.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "Arrange the steps to solve the digit problem: 'A two-digit number: tens digit is twice units digit; digit sum = 9.'",
    "options": [
      "1:Let units digit = u; tens digit = 2u",
      "2:Digit sum: 2u + u = 9 → 3u = 9 → u = 3",
      "3:Tens digit = 6; number = 63",
      "4:Verify: 6 + 3 = 9 ✓ and 6 = 2 × 3 ✓"
    ],
    "correct_answer": "order: [1,2,3,4]",
    "concept": "word_problems_advanced",
    "level": 2,
    "difficulty": "medium",
    "question_type": "drag_sort",
    "skills": [
      "solve_step_by_step",
      "digit_problems"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Let units = u and express tens in terms of u.",
      "Use the digit-sum condition to find u.",
      "Form the number and verify both conditions."
    ],
    "explanation": "u=3, t=6, number=63.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "Arrange the steps to solve: 'Two numbers differ by 7. Three times the smaller equals twice the larger minus 1. Find both numbers.'",
    "options": [
      "1:Let smaller = a; larger = a + 7",
      "2:Form equation: 3a = 2(a + 7) − 1",
      "3:Expand: 3a = 2a + 13",
      "4:Solve: a = 13; larger = 20",
      "5:Verify: 3(13) = 39 and 2(20) − 1 = 39 ✓"
    ],
    "correct_answer": "order: [1,2,3,4,5]",
    "concept": "word_problems_advanced",
    "level": 3,
    "difficulty": "hard",
    "question_type": "drag_sort",
    "skills": [
      "solve_step_by_step",
      "equation_translation"
    ],
    "misconception_target": "sequence_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "Define the two numbers using one variable.",
      "Translate the second condition into an equation.",
      "Solve and verify both conditions."
    ],
    "explanation": "Smaller=13, larger=20. Both conditions satisfied.",
    "explanation_depth": "deep"
  },
  {
    "question_text": "The present ages of Anu and Raj are in ratio 4:5. Eight years from now the ratio is 5:6. Anu's present age is ________.",
    "correct_answer": "32",
    "concept": "word_problems_advanced",
    "level": 2,
    "difficulty": "medium",
    "question_type": "fill_in_the_blank",
    "skills": [
      "age_problems",
      "ratio_problems"
    ],
    "misconception_target": "concept_error",
    "cognitive_level": "apply",
    "story_based": false,
    "time_expected": 60,
    "hints": [
      "Let Anu=4x, Raj=5x. (4x+8)/(5x+8)=5/6.",
      "Cross-multiply: 24x+48=25x+40 → x=8.",
      "Anu = 4×8 = 32."
    ],
    "explanation": "(4x+8)/(5x+8)=5/6 → x=8 → Anu=32.",
    "explanation_depth": "medium"
  },
  {
    "question_text": "The sum of the digits of a two-digit number is 9. The number is 4 times the sum of its digits. The number is ________.",
    "correct_answer": "36",
    "concept": "word_problems_advanced",
    "level": 3,
    "difficulty": "hard",
    "question_type": "fill_in_the_blank",
    "skills": [
      "digit_problems",
      "equation_translation"
    ],
    "misconception_target": "equation_error",
    "cognitive_level": "analyze",
    "story_based": false,
    "time_expected": 90,
    "hints": [
      "4 × (digit sum) = 4 × 9 = 36.",
      "Check: 3+6=9 ✓ and 36=4×9 ✓.",
      "The number is 36."
    ],
    "explanation": "Number = 4 × 9 = 36. Verify: digit sum=9 ✓.",
    "explanation_depth": "deep"
  }
];


const diagnosticQuestions = [
  { id: 'd1', question_text: 'If x + 3 = 7, what is x?', options: ['2', '3', '4', '5'], correct_answer: '4', diagnostic_level: 'novice', difficulty_weight: 1 },
  { id: 'd2', question_text: 'Which of these is a linear equation?', options: ['x² = 4', '2x + 1 = 7', 'x³ = 8', '√x = 2'], correct_answer: '2x + 1 = 7', diagnostic_level: 'novice', difficulty_weight: 1 },
  { id: 'd3', question_text: "What does 'solving an equation' mean?", options: ['Finding a pattern', 'Finding the value of the unknown', 'Drawing a graph', 'Counting terms'], correct_answer: 'Finding the value of the unknown', diagnostic_level: 'novice', difficulty_weight: 1 },
  { id: 'd4', question_text: 'Solve: 2x = 10. What is x?', options: ['2', '5', '10', '20'], correct_answer: '5', diagnostic_level: 'beginner', difficulty_weight: 2 },
  { id: 'd5', question_text: 'Solve: x – 4 = 9. What is x?', options: ['5', '13', '4', '9'], correct_answer: '13', diagnostic_level: 'beginner', difficulty_weight: 2 },
  { id: 'd6', question_text: 'If 3x + 2 = 11, what is x?', options: ['3', '4', '9', '2'], correct_answer: '3', diagnostic_level: 'beginner', difficulty_weight: 2 },
  { id: 'd7', question_text: 'What operation undoes multiplication?', options: ['Addition', 'Subtraction', 'Division', 'Squaring'], correct_answer: 'Division', diagnostic_level: 'beginner', difficulty_weight: 2 },
  { id: 'd8', question_text: 'Solve: 2x + 5 = 15. What is x?', options: ['5', '10', '7', '4'], correct_answer: '5', diagnostic_level: 'intermediate', difficulty_weight: 3 },
  { id: 'd9', question_text: 'Solve: 4(x – 2) = 12. What is x?', options: ['5', '4', '3', '7'], correct_answer: '5', diagnostic_level: 'intermediate', difficulty_weight: 3 },
  { id: 'd10', question_text: 'Solve: 3x = x + 8. What is x?', options: ['2', '4', '8', '3'], correct_answer: '4', diagnostic_level: 'intermediate', difficulty_weight: 3 },
  { id: 'd11', question_text: 'A number doubled then reduced by 3 equals 11. What is the number?', options: ['4', '7', '8', '5'], correct_answer: '7', diagnostic_level: 'intermediate', difficulty_weight: 3 },
  { id: 'd12', question_text: 'Solve: x/3 + 2 = 5. What is x?', options: ['6', '9', '3', '12'], correct_answer: '9', diagnostic_level: 'intermediate', difficulty_weight: 3 },
  { id: 'd13', question_text: 'Solve: 5x + 2 = 3x + 10. What is x?', options: ['3', '4', '5', '6'], correct_answer: '4', diagnostic_level: 'advanced', difficulty_weight: 4 },
  { id: 'd14', question_text: 'Solve: 2(x + 3) = 3(x – 1). What is x?', options: ['6', '9', '3', '12'], correct_answer: '9', diagnostic_level: 'advanced', difficulty_weight: 4 },
  { id: 'd15', question_text: 'If 2/x = 4/6, what is x?', options: ['2', '3', '4', '6'], correct_answer: '3', diagnostic_level: 'advanced', difficulty_weight: 4 },
  { id: 'd16', question_text: "A father is 4 times as old as his son. In 6 years he'll be twice as old. Son's current age?", options: ['6', '8', '9', '12'], correct_answer: '6', diagnostic_level: 'advanced', difficulty_weight: 4 },
  { id: 'd17', question_text: 'Solve: 3(2x – 1) – 2(x + 4) = 1. What is x?', options: ['2', '3', '4', '5'], correct_answer: '3', diagnostic_level: 'advanced', difficulty_weight: 4 },
];

module.exports = { questions, diagnosticQuestions };
