const DIFFICULTY_ORDER = ['easy', 'medium', 'hard'];
const ALLOWED_QUESTION_TYPES = [
  'mcq',
  'fill_blank',
  'fill_in_the_blank',
  'drag_sort',
  'drag_and_drop',
];
const QUESTION_TYPES = [...ALLOWED_QUESTION_TYPES];
const CONCEPT_UNLOCK_RULES = {
  masteryThreshold: 0.65,
  // When true, concept completion/unlock happens as soon as mastery threshold is reached.
  unlockOnMasteryOnly: true,
  minAttemptsPerConcept: 6,
  minCorrectPerConcept: 4,
  minAccuracy: 0.65,
  requireLevel: 2,
  singleActiveConcept: true,
};
const MASTERY_UNLOCK_THRESHOLD = CONCEPT_UNLOCK_RULES.masteryThreshold;
const MASTERY_UPDATE_RULES = {
  defaultPrior: 0.2,
  bkt: {
    slip: 0.05,
    guess: 0.2,
    transition: 0.1,
  },
  behaviorBlendWeight: 0.28,
  maxDeltaPerAttempt: 0.12,
  smoothingFactor: 0.94,
  context: {
    difficultyGain: {
      easy: 0.92,
      medium: 1,
      hard: 1.08,
    },
    difficultyLoss: {
      easy: 1.04,
      medium: 1,
      hard: 0.96,
    },
    fastTimeBonus: 0.05,
    slowTimePenalty: 0.04,
    fastWrongPenalty: 0.03,
    calibratedBonus: 0.04,
    overconfidencePenalty: 0.05,
    underconfidencePenalty: 0.02,
    minWeight: 0.9,
    maxWeight: 1.22,
    maxBoostCap: 1.18,
  },
};

const CONCEPT_GRAPH = [
  {
    id: 'expressions_foundation',
    label: 'Expressions',
    prerequisites: [],
    subtopic: 'algebraic_expressions',
    skills: ['identify_like_terms', 'combine_coefficients', 'identify_variables', 'add_expressions', 'subtract_expressions'],
  },
  {
    id: 'multiplication_expressions',
    label: 'Multiplication & Identities',
    prerequisites: ['expressions_foundation'],
    subtopic: 'algebraic_expressions',
    skills: ['multiply_monomials', 'distributive_property', 'foil_method', 'algebraic_identities'],
  },
  {
    id: 'equation_basics',
    label: 'Equation Basics',
    prerequisites: ['expressions_foundation'],
    subtopic: 'linear_equations',
    skills: ['identify_equation', 'lhs_rhs', 'balance_method', 'check_solution'],
  },
  {
    id: 'equation_solving',
    label: 'Solving Equations',
    prerequisites: ['equation_basics'],
    subtopic: 'linear_equations',
    skills: ['transposition', 'solve_brackets', 'cross_multiplication', 'clear_fractions'],
  },
  {
    id: 'advanced_equations',
    label: 'Advanced Equations',
    prerequisites: ['equation_solving'],
    subtopic: 'linear_equations',
    skills: ['collect_variables', 'variables_both_sides', 'special_cases'],
  },
  {
    id: 'word_problems_basic',
    label: 'Word Problems',
    prerequisites: ['equation_solving'],
    subtopic: 'word_problems',
    skills: ['equation_translation', 'age_problems', 'perimeter_problems', 'speed_problems', 'money_problems'],
  },
  {
    id: 'word_problems_advanced',
    label: 'Advanced Word Problems',
    prerequisites: ['word_problems_basic', 'advanced_equations'],
    subtopic: 'word_problems',
    skills: ['digit_problems', 'ratio_problems', 'mixture_problems'],
  },
];

const CONCEPT_TO_SUBTOPIC = Object.fromEntries(
  CONCEPT_GRAPH.map((c) => [c.id, c.subtopic])
);

const MISCONCEPTION_GRAPH = {
  sign_error: 'integer_sign_understanding',
  concept_error: 'structure_and_balance_concept',
  careless_error: 'attention_and_verification_habit',
  equation_error: 'balance_concept',
};

module.exports = {
  DIFFICULTY_ORDER,
  ALLOWED_QUESTION_TYPES,
  QUESTION_TYPES,
  CONCEPT_UNLOCK_RULES,
  MASTERY_UNLOCK_THRESHOLD,
  MASTERY_UPDATE_RULES,
  CONCEPT_GRAPH,
  CONCEPT_TO_SUBTOPIC,
  MISCONCEPTION_GRAPH,
};
