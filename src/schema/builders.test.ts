import {
  allow,
  and,
  chain,
  deny,
  generic,
  not,
  or,
  partial,
  race,
  rule,
  ruleType,
} from './builders';
import {
  BaseRule,
  RuleAnd,
  RuleChain,
  RuleFalse,
  RuleNot,
  RuleOr,
  RuleRace,
  RuleTrue,
  ShieldCache,
} from './rules';

describe('Builders Tests', () => {
  test('rule creates a BaseRule', () => {
    const result = rule()(() => true);

    expect(result).toBeInstanceOf(BaseRule);
  });

  test('rule creates a BaseRule with options', () => {
    const result = rule({ cache: ShieldCache.NO_CACHE, name: 'test' })(
      () => true
    );

    expect(result).toBeInstanceOf(BaseRule);
  });

  test('ruleType creates a BaseRule', () => {
    const result = ruleType({
      resolve: () => true,
    });

    expect(result).toBeInstanceOf(BaseRule);
  });

  test('ruleType creates a BaseRule with options', () => {
    const result = ruleType({
      name: 'test',
      cache: ShieldCache.NO_CACHE,
      resolve: () => true,
    });

    expect(result).toBeInstanceOf(BaseRule);
  });

  test('and creates a RuleAnd', () => {
    const result = and(allow);

    expect(result).toBeInstanceOf(RuleAnd);
  });

  test('chain creates a RuleChain', () => {
    const result = chain(allow);

    expect(result).toBeInstanceOf(RuleChain);
  });

  test('or creates a RuleOr', () => {
    const result = or(allow);

    expect(result).toBeInstanceOf(RuleOr);
  });

  test('race creates a RuleRace', () => {
    const result = race(allow);

    expect(result).toBeInstanceOf(RuleRace);
  });

  test('not creates a RuleNot', () => {
    const result = not(allow);

    expect(result).toBeInstanceOf(RuleNot);
  });

  test('allow is a RuleTrue', () => {
    expect(allow).toBeInstanceOf(RuleTrue);
  });

  test('deny is a RuleFalse', () => {
    expect(deny).toBeInstanceOf(RuleFalse);
  });

  test('partial returns a fonction that returns a rule', () => {
    const result = partial(rule()(() => true));

    expect(result).toBeInstanceOf(Function);
    expect(result()).toBeInstanceOf(BaseRule);
  });

  test('generic returns a fonction that returns a rule', () => {
    const result = generic(rule()(() => true));

    expect(result).toBeInstanceOf(Function);
    expect(result()).toBeInstanceOf(BaseRule);
  });
});
