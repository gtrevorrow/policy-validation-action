// Generated from Policy.g4 by ANTLR 4.13.2
// noinspection ES6UnusedImports,JSUnusedGlobalSymbols,JSUnusedLocalSymbols

import {
	ATN,
	ATNDeserializer, DecisionState, DFA, FailedPredicateException,
	RecognitionException, NoViableAltException, BailErrorStrategy,
	Parser, ParserATNSimulator,
	RuleContext, ParserRuleContext, PredictionMode, PredictionContextCache,
	TerminalNode, RuleNode,
	Token, TokenStream,
	Interval, IntervalSet
} from 'antlr4';
import PolicyListener from "./PolicyListener.js";
import PolicyVisitor from "./PolicyVisitor.js";

// for running tests with parameters, TODO: discuss strategy for typed parameters in CI
// eslint-disable-next-line no-unused-vars
type int = number;

export default class PolicyParser extends Parser {
	public static readonly T__0 = 1;
	public static readonly T__1 = 2;
	public static readonly T__2 = 3;
	public static readonly T__3 = 4;
	public static readonly T__4 = 5;
	public static readonly T__5 = 6;
	public static readonly T__6 = 7;
	public static readonly T__7 = 8;
	public static readonly T__8 = 9;
	public static readonly T__9 = 10;
	public static readonly T__10 = 11;
	public static readonly T__11 = 12;
	public static readonly T__12 = 13;
	public static readonly BEFORE = 14;
	public static readonly BETWEEN = 15;
	public static readonly NEWLINE = 16;
	public static readonly QUOTED_STRING = 17;
	public static readonly WS = 18;
	public static readonly ANYUSER = 19;
	public static readonly ANYTENANCY = 20;
	public static readonly ENDORSE = 21;
	public static readonly ALLOW = 22;
	public static readonly DEFINE = 23;
	public static readonly RESOURCE = 24;
	public static readonly TO = 25;
	public static readonly OF = 26;
	public static readonly IN = 27;
	public static readonly WHERE = 28;
	public static readonly WITH = 29;
	public static readonly DYNAMICGROUP = 30;
	public static readonly GROUP = 31;
	public static readonly SERVICE = 32;
	public static readonly COMPARTMENT = 33;
	public static readonly TENANCY = 34;
	public static readonly READ = 35;
	public static readonly INSPECT = 36;
	public static readonly MANAGE = 37;
	public static readonly ASSOCIATE = 38;
	public static readonly ADMIT = 39;
	public static readonly USE = 40;
	public static readonly ANY = 41;
	public static readonly AND = 42;
	public static readonly ALL = 43;
	public static readonly AS = 44;
	public static readonly ID = 45;
	public static readonly HCL_VAR = 46;
	public static readonly WORD = 47;
	public static override readonly EOF = Token.EOF;
	public static readonly RULE_policy = 0;
	public static readonly RULE_allowExpression = 1;
	public static readonly RULE_endorseExpression = 2;
	public static readonly RULE_defineExpression = 3;
	public static readonly RULE_admitExpression = 4;
	public static readonly RULE_endorseVerb = 5;
	public static readonly RULE_verb = 6;
	public static readonly RULE_permissionList = 7;
	public static readonly RULE_scope = 8;
	public static readonly RULE_endorseScope = 9;
	public static readonly RULE_subject = 10;
	public static readonly RULE_groupSubject = 11;
	public static readonly RULE_resourceSubject = 12;
	public static readonly RULE_serviceSubject = 13;
	public static readonly RULE_groupName = 14;
	public static readonly RULE_resourceSubjectId = 15;
	public static readonly RULE_serviceSubjectId = 16;
	public static readonly RULE_groupID = 17;
	public static readonly RULE_dynamicGroupSubject = 18;
	public static readonly RULE_tenancySubject = 19;
	public static readonly RULE_definedSubject = 20;
	public static readonly RULE_defined = 21;
	public static readonly RULE_resource = 22;
	public static readonly RULE_condition = 23;
	public static readonly RULE_comparison = 24;
	public static readonly RULE_variable = 25;
	public static readonly RULE_operator = 26;
	public static readonly RULE_value = 27;
	public static readonly RULE_valueList = 28;
	public static readonly RULE_timeWindow = 29;
	public static readonly RULE_comparisonList = 30;
	public static readonly RULE_logicalCombine = 31;
	public static readonly RULE_patternMatch = 32;
	public static readonly literalNames: (string | null)[] = [ null, "'{'", 
                                                            "','", "'}'", 
                                                            "':'", "'/'", 
                                                            "'''", "'.'", 
                                                            "'='", "'!'", 
                                                            "'('", "')'", 
                                                            "'*/'", "'/*'" ];
	public static readonly symbolicNames: (string | null)[] = [ null, null, 
                                                             null, null, 
                                                             null, null, 
                                                             null, null, 
                                                             null, null, 
                                                             null, null, 
                                                             null, null, 
                                                             "BEFORE", "BETWEEN", 
                                                             "NEWLINE", 
                                                             "QUOTED_STRING", 
                                                             "WS", "ANYUSER", 
                                                             "ANYTENANCY", 
                                                             "ENDORSE", 
                                                             "ALLOW", "DEFINE", 
                                                             "RESOURCE", 
                                                             "TO", "OF", 
                                                             "IN", "WHERE", 
                                                             "WITH", "DYNAMICGROUP", 
                                                             "GROUP", "SERVICE", 
                                                             "COMPARTMENT", 
                                                             "TENANCY", 
                                                             "READ", "INSPECT", 
                                                             "MANAGE", "ASSOCIATE", 
                                                             "ADMIT", "USE", 
                                                             "ANY", "AND", 
                                                             "ALL", "AS", 
                                                             "ID", "HCL_VAR", 
                                                             "WORD" ];
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"policy", "allowExpression", "endorseExpression", "defineExpression", 
		"admitExpression", "endorseVerb", "verb", "permissionList", "scope", "endorseScope", 
		"subject", "groupSubject", "resourceSubject", "serviceSubject", "groupName", 
		"resourceSubjectId", "serviceSubjectId", "groupID", "dynamicGroupSubject", 
		"tenancySubject", "definedSubject", "defined", "resource", "condition", 
		"comparison", "variable", "operator", "value", "valueList", "timeWindow", 
		"comparisonList", "logicalCombine", "patternMatch",
	];
	public get grammarFileName(): string { return "Policy.g4"; }
	public get literalNames(): (string | null)[] { return PolicyParser.literalNames; }
	public get symbolicNames(): (string | null)[] { return PolicyParser.symbolicNames; }
	public get ruleNames(): string[] { return PolicyParser.ruleNames; }
	public get serializedATN(): number[] { return PolicyParser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(this, PolicyParser._ATN, PolicyParser.DecisionsToDFA, new PredictionContextCache());
	}
	// @RuleVersion(0)
	public policy(): PolicyContext {
		let localctx: PolicyContext = new PolicyContext(this, this._ctx, this.state);
		this.enterRule(localctx, 0, PolicyParser.RULE_policy);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 70;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				this.state = 70;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case 22:
					{
					this.state = 66;
					this.allowExpression();
					}
					break;
				case 21:
					{
					this.state = 67;
					this.endorseExpression();
					}
					break;
				case 23:
					{
					this.state = 68;
					this.defineExpression();
					}
					break;
				case 39:
					{
					this.state = 69;
					this.admitExpression();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				this.state = 72;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (((((_la - 21)) & ~0x1F) === 0 && ((1 << (_la - 21)) & 262151) !== 0));
			this.state = 74;
			this.match(PolicyParser.EOF);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public allowExpression(): AllowExpressionContext {
		let localctx: AllowExpressionContext = new AllowExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 2, PolicyParser.RULE_allowExpression);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 76;
			this.match(PolicyParser.ALLOW);
			this.state = 77;
			this.subject();
			this.state = 88;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 4, this._ctx) ) {
			case 1:
				{
				this.state = 79;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===25) {
					{
					this.state = 78;
					this.match(PolicyParser.TO);
					}
				}

				this.state = 81;
				this.verb();
				this.state = 82;
				this.resource();
				}
				break;
			case 2:
				{
				this.state = 85;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===25) {
					{
					this.state = 84;
					this.match(PolicyParser.TO);
					}
				}

				this.state = 87;
				this.permissionList();
				}
				break;
			}
			this.state = 90;
			this.match(PolicyParser.IN);
			this.state = 91;
			this.scope();
			this.state = 94;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===28) {
				{
				this.state = 92;
				this.match(PolicyParser.WHERE);
				this.state = 93;
				this.condition();
				}
			}

			this.state = 97;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===16) {
				{
				this.state = 96;
				this.match(PolicyParser.NEWLINE);
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public endorseExpression(): EndorseExpressionContext {
		let localctx: EndorseExpressionContext = new EndorseExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 4, PolicyParser.RULE_endorseExpression);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 99;
			this.match(PolicyParser.ENDORSE);
			this.state = 100;
			this.subject();
			this.state = 109;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 8, this._ctx) ) {
			case 1:
				{
				this.state = 101;
				this.match(PolicyParser.TO);
				this.state = 102;
				this.endorseVerb();
				this.state = 103;
				this.resource();
				}
				break;
			case 2:
				{
				this.state = 106;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===25) {
					{
					this.state = 105;
					this.match(PolicyParser.TO);
					}
				}

				this.state = 108;
				this.permissionList();
				}
				break;
			}
			this.state = 111;
			this.match(PolicyParser.IN);
			this.state = 119;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 9, this._ctx) ) {
			case 1:
				{
				this.state = 112;
				this.endorseScope();
				}
				break;
			case 2:
				{
				{
				this.state = 113;
				this.scope();
				this.state = 114;
				this.match(PolicyParser.WITH);
				this.state = 115;
				this.resource();
				this.state = 116;
				this.match(PolicyParser.IN);
				this.state = 117;
				this.endorseScope();
				}
				}
				break;
			}
			this.state = 123;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===28) {
				{
				this.state = 121;
				this.match(PolicyParser.WHERE);
				this.state = 122;
				this.condition();
				}
			}

			this.state = 126;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===16) {
				{
				this.state = 125;
				this.match(PolicyParser.NEWLINE);
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public defineExpression(): DefineExpressionContext {
		let localctx: DefineExpressionContext = new DefineExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 6, PolicyParser.RULE_defineExpression);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 128;
			this.match(PolicyParser.DEFINE);
			this.state = 129;
			this.definedSubject();
			this.state = 130;
			this.match(PolicyParser.AS);
			this.state = 131;
			this.defined();
			this.state = 133;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===16) {
				{
				this.state = 132;
				this.match(PolicyParser.NEWLINE);
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public admitExpression(): AdmitExpressionContext {
		let localctx: AdmitExpressionContext = new AdmitExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 8, PolicyParser.RULE_admitExpression);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 135;
			this.match(PolicyParser.ADMIT);
			this.state = 136;
			this.subject();
			this.state = 139;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===26) {
				{
				this.state = 137;
				this.match(PolicyParser.OF);
				this.state = 138;
				this.endorseScope();
				}
			}

			this.state = 149;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 15, this._ctx) ) {
			case 1:
				{
				this.state = 141;
				this.match(PolicyParser.TO);
				this.state = 142;
				this.endorseVerb();
				this.state = 143;
				this.resource();
				}
				break;
			case 2:
				{
				this.state = 146;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===25) {
					{
					this.state = 145;
					this.match(PolicyParser.TO);
					}
				}

				this.state = 148;
				this.permissionList();
				}
				break;
			}
			this.state = 151;
			this.match(PolicyParser.IN);
			this.state = 152;
			this.scope();
			this.state = 158;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===29) {
				{
				this.state = 153;
				this.match(PolicyParser.WITH);
				this.state = 154;
				this.resource();
				this.state = 155;
				this.match(PolicyParser.IN);
				this.state = 156;
				this.endorseScope();
				}
			}

			this.state = 162;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===28) {
				{
				this.state = 160;
				this.match(PolicyParser.WHERE);
				this.state = 161;
				this.condition();
				}
			}

			this.state = 165;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===16) {
				{
				this.state = 164;
				this.match(PolicyParser.NEWLINE);
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public endorseVerb(): EndorseVerbContext {
		let localctx: EndorseVerbContext = new EndorseVerbContext(this, this._ctx, this.state);
		this.enterRule(localctx, 10, PolicyParser.RULE_endorseVerb);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 169;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 35:
			case 36:
			case 37:
			case 40:
				{
				this.state = 167;
				this.verb();
				}
				break;
			case 38:
				{
				this.state = 168;
				this.match(PolicyParser.ASSOCIATE);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public verb(): VerbContext {
		let localctx: VerbContext = new VerbContext(this, this._ctx, this.state);
		this.enterRule(localctx, 12, PolicyParser.RULE_verb);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 171;
			_la = this._input.LA(1);
			if(!(((((_la - 35)) & ~0x1F) === 0 && ((1 << (_la - 35)) & 39) !== 0))) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public permissionList(): PermissionListContext {
		let localctx: PermissionListContext = new PermissionListContext(this, this._ctx, this.state);
		this.enterRule(localctx, 14, PolicyParser.RULE_permissionList);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 173;
			this.match(PolicyParser.T__0);
			this.state = 174;
			this.match(PolicyParser.WORD);
			this.state = 179;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===2) {
				{
				{
				this.state = 175;
				this.match(PolicyParser.T__1);
				this.state = 176;
				this.match(PolicyParser.WORD);
				}
				}
				this.state = 181;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 182;
			this.match(PolicyParser.T__2);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public scope(): ScopeContext {
		let localctx: ScopeContext = new ScopeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 16, PolicyParser.RULE_scope);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 197;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 33:
				{
				{
				this.state = 184;
				this.match(PolicyParser.COMPARTMENT);
				this.state = 186;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===45) {
					{
					this.state = 185;
					this.match(PolicyParser.ID);
					}
				}

				}
				this.state = 188;
				_la = this._input.LA(1);
				if(!(_la===46 || _la===47)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 193;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===4) {
					{
					{
					this.state = 189;
					this.match(PolicyParser.T__3);
					this.state = 190;
					_la = this._input.LA(1);
					if(!(_la===46 || _la===47)) {
					this._errHandler.recoverInline(this);
					}
					else {
						this._errHandler.reportMatch(this);
					    this.consume();
					}
					}
					}
					this.state = 195;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
				break;
			case 34:
				{
				this.state = 196;
				this.match(PolicyParser.TENANCY);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public endorseScope(): EndorseScopeContext {
		let localctx: EndorseScopeContext = new EndorseScopeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 18, PolicyParser.RULE_endorseScope);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 202;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 20:
				{
				this.state = 199;
				this.match(PolicyParser.ANYTENANCY);
				}
				break;
			case 34:
				{
				this.state = 200;
				this.match(PolicyParser.TENANCY);
				this.state = 201;
				_la = this._input.LA(1);
				if(!(_la===46 || _la===47)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public subject(): SubjectContext {
		let localctx: SubjectContext = new SubjectContext(this, this._ctx, this.state);
		this.enterRule(localctx, 20, PolicyParser.RULE_subject);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 209;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 31:
				{
				this.state = 204;
				this.groupSubject();
				}
				break;
			case 32:
				{
				this.state = 205;
				this.serviceSubject();
				}
				break;
			case 30:
				{
				this.state = 206;
				this.dynamicGroupSubject();
				}
				break;
			case 24:
				{
				this.state = 207;
				this.resourceSubject();
				}
				break;
			case 19:
				{
				this.state = 208;
				this.match(PolicyParser.ANYUSER);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public groupSubject(): GroupSubjectContext {
		let localctx: GroupSubjectContext = new GroupSubjectContext(this, this._ctx, this.state);
		this.enterRule(localctx, 22, PolicyParser.RULE_groupSubject);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 211;
			this.match(PolicyParser.GROUP);
			this.state = 214;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 17:
			case 46:
			case 47:
				{
				this.state = 212;
				this.groupName();
				}
				break;
			case 45:
				{
				this.state = 213;
				this.groupID();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this.state = 223;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===2) {
				{
				{
				this.state = 216;
				this.match(PolicyParser.T__1);
				this.state = 219;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case 17:
				case 46:
				case 47:
					{
					this.state = 217;
					this.groupName();
					}
					break;
				case 45:
					{
					this.state = 218;
					this.groupID();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				}
				this.state = 225;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public resourceSubject(): ResourceSubjectContext {
		let localctx: ResourceSubjectContext = new ResourceSubjectContext(this, this._ctx, this.state);
		this.enterRule(localctx, 24, PolicyParser.RULE_resourceSubject);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 226;
			this.match(PolicyParser.RESOURCE);
			this.state = 227;
			this.resourceSubjectId();
			this.state = 231;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===46 || _la===47) {
				{
				{
				this.state = 228;
				this.resourceSubjectId();
				}
				}
				this.state = 233;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public serviceSubject(): ServiceSubjectContext {
		let localctx: ServiceSubjectContext = new ServiceSubjectContext(this, this._ctx, this.state);
		this.enterRule(localctx, 26, PolicyParser.RULE_serviceSubject);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 234;
			this.match(PolicyParser.SERVICE);
			this.state = 235;
			this.serviceSubjectId();
			this.state = 240;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===2) {
				{
				{
				this.state = 236;
				this.match(PolicyParser.T__1);
				this.state = 237;
				this.serviceSubjectId();
				}
				}
				this.state = 242;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public groupName(): GroupNameContext {
		let localctx: GroupNameContext = new GroupNameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 28, PolicyParser.RULE_groupName);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 255;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 31, this._ctx) ) {
			case 1:
				{
				this.state = 243;
				this.match(PolicyParser.WORD);
				}
				break;
			case 2:
				{
				this.state = 244;
				this.match(PolicyParser.QUOTED_STRING);
				this.state = 245;
				this.match(PolicyParser.T__4);
				this.state = 246;
				this.match(PolicyParser.QUOTED_STRING);
				}
				break;
			case 3:
				{
				this.state = 247;
				this.match(PolicyParser.QUOTED_STRING);
				}
				break;
			case 4:
				{
				this.state = 248;
				this.match(PolicyParser.WORD);
				this.state = 249;
				this.match(PolicyParser.T__4);
				this.state = 250;
				this.match(PolicyParser.WORD);
				}
				break;
			case 5:
				{
				this.state = 251;
				this.match(PolicyParser.WORD);
				this.state = 252;
				this.match(PolicyParser.T__4);
				this.state = 253;
				this.match(PolicyParser.QUOTED_STRING);
				}
				break;
			case 6:
				{
				this.state = 254;
				this.match(PolicyParser.HCL_VAR);
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public resourceSubjectId(): ResourceSubjectIdContext {
		let localctx: ResourceSubjectIdContext = new ResourceSubjectIdContext(this, this._ctx, this.state);
		this.enterRule(localctx, 30, PolicyParser.RULE_resourceSubjectId);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 257;
			_la = this._input.LA(1);
			if(!(_la===46 || _la===47)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			this.state = 266;
			this._errHandler.sync(this);
			_alt = 1 + 1;
			do {
				switch (_alt) {
				case 1 + 1:
					{
					this.state = 266;
					this._errHandler.sync(this);
					switch ( this._interp.adaptivePredict(this._input, 32, this._ctx) ) {
					case 1:
						{
						this.state = 258;
						this.match(PolicyParser.T__5);
						this.state = 259;
						_la = this._input.LA(1);
						if(!(_la===46 || _la===47)) {
						this._errHandler.recoverInline(this);
						}
						else {
							this._errHandler.reportMatch(this);
						    this.consume();
						}
						this.state = 260;
						this.match(PolicyParser.T__5);
						}
						break;
					case 2:
						{
						this.state = 261;
						this.match(PolicyParser.T__5);
						this.state = 262;
						_la = this._input.LA(1);
						if(!(_la===46 || _la===47)) {
						this._errHandler.recoverInline(this);
						}
						else {
							this._errHandler.reportMatch(this);
						    this.consume();
						}
						this.state = 263;
						this.match(PolicyParser.T__4);
						this.state = 264;
						_la = this._input.LA(1);
						if(!(_la===46 || _la===47)) {
						this._errHandler.recoverInline(this);
						}
						else {
							this._errHandler.reportMatch(this);
						    this.consume();
						}
						this.state = 265;
						this.match(PolicyParser.T__5);
						}
						break;
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 268;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 33, this._ctx);
			} while (_alt !== 1 && _alt !== ATN.INVALID_ALT_NUMBER);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public serviceSubjectId(): ServiceSubjectIdContext {
		let localctx: ServiceSubjectIdContext = new ServiceSubjectIdContext(this, this._ctx, this.state);
		this.enterRule(localctx, 32, PolicyParser.RULE_serviceSubjectId);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 270;
			_la = this._input.LA(1);
			if(!(_la===46 || _la===47)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public groupID(): GroupIDContext {
		let localctx: GroupIDContext = new GroupIDContext(this, this._ctx, this.state);
		this.enterRule(localctx, 34, PolicyParser.RULE_groupID);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 272;
			this.match(PolicyParser.ID);
			this.state = 273;
			_la = this._input.LA(1);
			if(!(_la===46 || _la===47)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public dynamicGroupSubject(): DynamicGroupSubjectContext {
		let localctx: DynamicGroupSubjectContext = new DynamicGroupSubjectContext(this, this._ctx, this.state);
		this.enterRule(localctx, 36, PolicyParser.RULE_dynamicGroupSubject);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 275;
			this.match(PolicyParser.DYNAMICGROUP);
			this.state = 277;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===45) {
				{
				this.state = 276;
				this.match(PolicyParser.ID);
				}
			}

			this.state = 279;
			_la = this._input.LA(1);
			if(!(_la===46 || _la===47)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public tenancySubject(): TenancySubjectContext {
		let localctx: TenancySubjectContext = new TenancySubjectContext(this, this._ctx, this.state);
		this.enterRule(localctx, 38, PolicyParser.RULE_tenancySubject);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 281;
			this.match(PolicyParser.TENANCY);
			this.state = 282;
			_la = this._input.LA(1);
			if(!(_la===46 || _la===47)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public definedSubject(): DefinedSubjectContext {
		let localctx: DefinedSubjectContext = new DefinedSubjectContext(this, this._ctx, this.state);
		this.enterRule(localctx, 40, PolicyParser.RULE_definedSubject);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 288;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 31:
				{
				this.state = 284;
				this.groupSubject();
				}
				break;
			case 30:
				{
				this.state = 285;
				this.dynamicGroupSubject();
				}
				break;
			case 32:
				{
				this.state = 286;
				this.serviceSubject();
				}
				break;
			case 34:
				{
				this.state = 287;
				this.tenancySubject();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public defined(): DefinedContext {
		let localctx: DefinedContext = new DefinedContext(this, this._ctx, this.state);
		this.enterRule(localctx, 42, PolicyParser.RULE_defined);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 290;
			_la = this._input.LA(1);
			if(!(_la===46 || _la===47)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public resource(): ResourceContext {
		let localctx: ResourceContext = new ResourceContext(this, this._ctx, this.state);
		this.enterRule(localctx, 44, PolicyParser.RULE_resource);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 292;
			_la = this._input.LA(1);
			if(!(_la===46 || _la===47)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public condition(): ConditionContext {
		let localctx: ConditionContext = new ConditionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 46, PolicyParser.RULE_condition);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 296;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 41:
			case 43:
				{
				this.state = 294;
				this.comparisonList();
				}
				break;
			case 46:
			case 47:
				{
				this.state = 295;
				this.comparison();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public comparison(): ComparisonContext {
		let localctx: ComparisonContext = new ComparisonContext(this, this._ctx, this.state);
		this.enterRule(localctx, 48, PolicyParser.RULE_comparison);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 298;
			this.variable();
			this.state = 299;
			this.operator();
			this.state = 304;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 37, this._ctx) ) {
			case 1:
				{
				this.state = 300;
				this.value();
				}
				break;
			case 2:
				{
				this.state = 301;
				this.valueList();
				}
				break;
			case 3:
				{
				this.state = 302;
				this.timeWindow();
				}
				break;
			case 4:
				{
				this.state = 303;
				this.patternMatch();
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public variable(): VariableContext {
		let localctx: VariableContext = new VariableContext(this, this._ctx, this.state);
		this.enterRule(localctx, 50, PolicyParser.RULE_variable);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 306;
			_la = this._input.LA(1);
			if(!(_la===46 || _la===47)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			this.state = 313;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===7) {
				{
				this.state = 309;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 307;
					this.match(PolicyParser.T__6);
					this.state = 308;
					_la = this._input.LA(1);
					if(!(_la===46 || _la===47)) {
					this._errHandler.recoverInline(this);
					}
					else {
						this._errHandler.reportMatch(this);
					    this.consume();
					}
					}
					}
					this.state = 311;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (_la===7);
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public operator(): OperatorContext {
		let localctx: OperatorContext = new OperatorContext(this, this._ctx, this.state);
		this.enterRule(localctx, 52, PolicyParser.RULE_operator);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 321;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 8:
				{
				this.state = 315;
				this.match(PolicyParser.T__7);
				}
				break;
			case 9:
				{
				this.state = 316;
				this.match(PolicyParser.T__8);
				this.state = 317;
				this.match(PolicyParser.T__7);
				}
				break;
			case 14:
				{
				this.state = 318;
				this.match(PolicyParser.BEFORE);
				}
				break;
			case 27:
				{
				this.state = 319;
				this.match(PolicyParser.IN);
				}
				break;
			case 15:
				{
				this.state = 320;
				this.match(PolicyParser.BETWEEN);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public value(): ValueContext {
		let localctx: ValueContext = new ValueContext(this, this._ctx, this.state);
		this.enterRule(localctx, 54, PolicyParser.RULE_value);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 339;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 42, this._ctx) ) {
			case 1:
				{
				this.state = 323;
				this.match(PolicyParser.WORD);
				}
				break;
			case 2:
				{
				this.state = 324;
				this.match(PolicyParser.QUOTED_STRING);
				}
				break;
			case 3:
				{
				this.state = 325;
				this.match(PolicyParser.QUOTED_STRING);
				this.state = 326;
				this.match(PolicyParser.T__4);
				this.state = 327;
				this.match(PolicyParser.WORD);
				}
				break;
			case 4:
				{
				this.state = 328;
				this.match(PolicyParser.QUOTED_STRING);
				this.state = 331;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 329;
					this.match(PolicyParser.WS);
					this.state = 330;
					this.match(PolicyParser.WORD);
					}
					}
					this.state = 333;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (_la===18);
				}
				break;
			case 5:
				{
				this.state = 335;
				this.match(PolicyParser.HCL_VAR);
				}
				break;
			case 6:
				{
				this.state = 336;
				this.match(PolicyParser.T__5);
				this.state = 337;
				this.match(PolicyParser.HCL_VAR);
				this.state = 338;
				this.match(PolicyParser.T__5);
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public valueList(): ValueListContext {
		let localctx: ValueListContext = new ValueListContext(this, this._ctx, this.state);
		this.enterRule(localctx, 56, PolicyParser.RULE_valueList);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 341;
			this.match(PolicyParser.T__9);
			this.state = 347;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 17:
				{
				this.state = 342;
				this.match(PolicyParser.QUOTED_STRING);
				}
				break;
			case 46:
				{
				this.state = 343;
				this.match(PolicyParser.HCL_VAR);
				}
				break;
			case 6:
				{
				this.state = 344;
				this.match(PolicyParser.T__5);
				this.state = 345;
				this.match(PolicyParser.HCL_VAR);
				this.state = 346;
				this.match(PolicyParser.T__5);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this.state = 359;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===2) {
				{
				{
				this.state = 349;
				this.match(PolicyParser.T__1);
				this.state = 355;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case 17:
					{
					this.state = 350;
					this.match(PolicyParser.QUOTED_STRING);
					}
					break;
				case 46:
					{
					this.state = 351;
					this.match(PolicyParser.HCL_VAR);
					}
					break;
				case 6:
					{
					this.state = 352;
					this.match(PolicyParser.T__5);
					this.state = 353;
					this.match(PolicyParser.HCL_VAR);
					this.state = 354;
					this.match(PolicyParser.T__5);
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				}
				this.state = 361;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 362;
			this.match(PolicyParser.T__10);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public timeWindow(): TimeWindowContext {
		let localctx: TimeWindowContext = new TimeWindowContext(this, this._ctx, this.state);
		this.enterRule(localctx, 58, PolicyParser.RULE_timeWindow);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 369;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 17:
				{
				this.state = 364;
				this.match(PolicyParser.QUOTED_STRING);
				}
				break;
			case 46:
				{
				this.state = 365;
				this.match(PolicyParser.HCL_VAR);
				}
				break;
			case 6:
				{
				this.state = 366;
				this.match(PolicyParser.T__5);
				this.state = 367;
				this.match(PolicyParser.HCL_VAR);
				this.state = 368;
				this.match(PolicyParser.T__5);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this.state = 371;
			this.match(PolicyParser.AND);
			this.state = 377;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 17:
				{
				this.state = 372;
				this.match(PolicyParser.QUOTED_STRING);
				}
				break;
			case 46:
				{
				this.state = 373;
				this.match(PolicyParser.HCL_VAR);
				}
				break;
			case 6:
				{
				this.state = 374;
				this.match(PolicyParser.T__5);
				this.state = 375;
				this.match(PolicyParser.HCL_VAR);
				this.state = 376;
				this.match(PolicyParser.T__5);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public comparisonList(): ComparisonListContext {
		let localctx: ComparisonListContext = new ComparisonListContext(this, this._ctx, this.state);
		this.enterRule(localctx, 60, PolicyParser.RULE_comparisonList);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 379;
			this.logicalCombine();
			this.state = 380;
			this.match(PolicyParser.T__0);
			this.state = 381;
			this.condition();
			this.state = 386;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===2) {
				{
				{
				this.state = 382;
				this.match(PolicyParser.T__1);
				this.state = 383;
				this.condition();
				}
				}
				this.state = 388;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 389;
			this.match(PolicyParser.T__2);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public logicalCombine(): LogicalCombineContext {
		let localctx: LogicalCombineContext = new LogicalCombineContext(this, this._ctx, this.state);
		this.enterRule(localctx, 62, PolicyParser.RULE_logicalCombine);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 391;
			_la = this._input.LA(1);
			if(!(_la===41 || _la===43)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public patternMatch(): PatternMatchContext {
		let localctx: PatternMatchContext = new PatternMatchContext(this, this._ctx, this.state);
		this.enterRule(localctx, 64, PolicyParser.RULE_patternMatch);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 402;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 49, this._ctx) ) {
			case 1:
				{
				this.state = 393;
				this.match(PolicyParser.T__4);
				this.state = 394;
				this.match(PolicyParser.WORD);
				this.state = 395;
				this.match(PolicyParser.T__11);
				}
				break;
			case 2:
				{
				this.state = 396;
				this.match(PolicyParser.T__12);
				this.state = 397;
				this.match(PolicyParser.WORD);
				this.state = 398;
				this.match(PolicyParser.T__4);
				}
				break;
			case 3:
				{
				this.state = 399;
				this.match(PolicyParser.T__4);
				this.state = 400;
				this.match(PolicyParser.WORD);
				this.state = 401;
				this.match(PolicyParser.T__4);
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public static readonly _serializedATN: number[] = [4,1,47,405,2,0,7,0,2,
	1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,6,2,7,7,7,2,8,7,8,2,9,7,9,2,
	10,7,10,2,11,7,11,2,12,7,12,2,13,7,13,2,14,7,14,2,15,7,15,2,16,7,16,2,17,
	7,17,2,18,7,18,2,19,7,19,2,20,7,20,2,21,7,21,2,22,7,22,2,23,7,23,2,24,7,
	24,2,25,7,25,2,26,7,26,2,27,7,27,2,28,7,28,2,29,7,29,2,30,7,30,2,31,7,31,
	2,32,7,32,1,0,1,0,1,0,1,0,4,0,71,8,0,11,0,12,0,72,1,0,1,0,1,1,1,1,1,1,3,
	1,80,8,1,1,1,1,1,1,1,1,1,3,1,86,8,1,1,1,3,1,89,8,1,1,1,1,1,1,1,1,1,3,1,
	95,8,1,1,1,3,1,98,8,1,1,2,1,2,1,2,1,2,1,2,1,2,1,2,3,2,107,8,2,1,2,3,2,110,
	8,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,3,2,120,8,2,1,2,1,2,3,2,124,8,2,1,2,
	3,2,127,8,2,1,3,1,3,1,3,1,3,1,3,3,3,134,8,3,1,4,1,4,1,4,1,4,3,4,140,8,4,
	1,4,1,4,1,4,1,4,1,4,3,4,147,8,4,1,4,3,4,150,8,4,1,4,1,4,1,4,1,4,1,4,1,4,
	1,4,3,4,159,8,4,1,4,1,4,3,4,163,8,4,1,4,3,4,166,8,4,1,5,1,5,3,5,170,8,5,
	1,6,1,6,1,7,1,7,1,7,1,7,5,7,178,8,7,10,7,12,7,181,9,7,1,7,1,7,1,8,1,8,3,
	8,187,8,8,1,8,1,8,1,8,5,8,192,8,8,10,8,12,8,195,9,8,1,8,3,8,198,8,8,1,9,
	1,9,1,9,3,9,203,8,9,1,10,1,10,1,10,1,10,1,10,3,10,210,8,10,1,11,1,11,1,
	11,3,11,215,8,11,1,11,1,11,1,11,3,11,220,8,11,5,11,222,8,11,10,11,12,11,
	225,9,11,1,12,1,12,1,12,5,12,230,8,12,10,12,12,12,233,9,12,1,13,1,13,1,
	13,1,13,5,13,239,8,13,10,13,12,13,242,9,13,1,14,1,14,1,14,1,14,1,14,1,14,
	1,14,1,14,1,14,1,14,1,14,1,14,3,14,256,8,14,1,15,1,15,1,15,1,15,1,15,1,
	15,1,15,1,15,1,15,4,15,267,8,15,11,15,12,15,268,1,16,1,16,1,17,1,17,1,17,
	1,18,1,18,3,18,278,8,18,1,18,1,18,1,19,1,19,1,19,1,20,1,20,1,20,1,20,3,
	20,289,8,20,1,21,1,21,1,22,1,22,1,23,1,23,3,23,297,8,23,1,24,1,24,1,24,
	1,24,1,24,1,24,3,24,305,8,24,1,25,1,25,1,25,4,25,310,8,25,11,25,12,25,311,
	3,25,314,8,25,1,26,1,26,1,26,1,26,1,26,1,26,3,26,322,8,26,1,27,1,27,1,27,
	1,27,1,27,1,27,1,27,1,27,4,27,332,8,27,11,27,12,27,333,1,27,1,27,1,27,1,
	27,3,27,340,8,27,1,28,1,28,1,28,1,28,1,28,1,28,3,28,348,8,28,1,28,1,28,
	1,28,1,28,1,28,1,28,3,28,356,8,28,5,28,358,8,28,10,28,12,28,361,9,28,1,
	28,1,28,1,29,1,29,1,29,1,29,1,29,3,29,370,8,29,1,29,1,29,1,29,1,29,1,29,
	1,29,3,29,378,8,29,1,30,1,30,1,30,1,30,1,30,5,30,385,8,30,10,30,12,30,388,
	9,30,1,30,1,30,1,31,1,31,1,32,1,32,1,32,1,32,1,32,1,32,1,32,1,32,1,32,3,
	32,403,8,32,1,32,1,268,0,33,0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,
	32,34,36,38,40,42,44,46,48,50,52,54,56,58,60,62,64,0,3,2,0,35,37,40,40,
	1,0,46,47,2,0,41,41,43,43,446,0,70,1,0,0,0,2,76,1,0,0,0,4,99,1,0,0,0,6,
	128,1,0,0,0,8,135,1,0,0,0,10,169,1,0,0,0,12,171,1,0,0,0,14,173,1,0,0,0,
	16,197,1,0,0,0,18,202,1,0,0,0,20,209,1,0,0,0,22,211,1,0,0,0,24,226,1,0,
	0,0,26,234,1,0,0,0,28,255,1,0,0,0,30,257,1,0,0,0,32,270,1,0,0,0,34,272,
	1,0,0,0,36,275,1,0,0,0,38,281,1,0,0,0,40,288,1,0,0,0,42,290,1,0,0,0,44,
	292,1,0,0,0,46,296,1,0,0,0,48,298,1,0,0,0,50,306,1,0,0,0,52,321,1,0,0,0,
	54,339,1,0,0,0,56,341,1,0,0,0,58,369,1,0,0,0,60,379,1,0,0,0,62,391,1,0,
	0,0,64,402,1,0,0,0,66,71,3,2,1,0,67,71,3,4,2,0,68,71,3,6,3,0,69,71,3,8,
	4,0,70,66,1,0,0,0,70,67,1,0,0,0,70,68,1,0,0,0,70,69,1,0,0,0,71,72,1,0,0,
	0,72,70,1,0,0,0,72,73,1,0,0,0,73,74,1,0,0,0,74,75,5,0,0,1,75,1,1,0,0,0,
	76,77,5,22,0,0,77,88,3,20,10,0,78,80,5,25,0,0,79,78,1,0,0,0,79,80,1,0,0,
	0,80,81,1,0,0,0,81,82,3,12,6,0,82,83,3,44,22,0,83,89,1,0,0,0,84,86,5,25,
	0,0,85,84,1,0,0,0,85,86,1,0,0,0,86,87,1,0,0,0,87,89,3,14,7,0,88,79,1,0,
	0,0,88,85,1,0,0,0,89,90,1,0,0,0,90,91,5,27,0,0,91,94,3,16,8,0,92,93,5,28,
	0,0,93,95,3,46,23,0,94,92,1,0,0,0,94,95,1,0,0,0,95,97,1,0,0,0,96,98,5,16,
	0,0,97,96,1,0,0,0,97,98,1,0,0,0,98,3,1,0,0,0,99,100,5,21,0,0,100,109,3,
	20,10,0,101,102,5,25,0,0,102,103,3,10,5,0,103,104,3,44,22,0,104,110,1,0,
	0,0,105,107,5,25,0,0,106,105,1,0,0,0,106,107,1,0,0,0,107,108,1,0,0,0,108,
	110,3,14,7,0,109,101,1,0,0,0,109,106,1,0,0,0,110,111,1,0,0,0,111,119,5,
	27,0,0,112,120,3,18,9,0,113,114,3,16,8,0,114,115,5,29,0,0,115,116,3,44,
	22,0,116,117,5,27,0,0,117,118,3,18,9,0,118,120,1,0,0,0,119,112,1,0,0,0,
	119,113,1,0,0,0,120,123,1,0,0,0,121,122,5,28,0,0,122,124,3,46,23,0,123,
	121,1,0,0,0,123,124,1,0,0,0,124,126,1,0,0,0,125,127,5,16,0,0,126,125,1,
	0,0,0,126,127,1,0,0,0,127,5,1,0,0,0,128,129,5,23,0,0,129,130,3,40,20,0,
	130,131,5,44,0,0,131,133,3,42,21,0,132,134,5,16,0,0,133,132,1,0,0,0,133,
	134,1,0,0,0,134,7,1,0,0,0,135,136,5,39,0,0,136,139,3,20,10,0,137,138,5,
	26,0,0,138,140,3,18,9,0,139,137,1,0,0,0,139,140,1,0,0,0,140,149,1,0,0,0,
	141,142,5,25,0,0,142,143,3,10,5,0,143,144,3,44,22,0,144,150,1,0,0,0,145,
	147,5,25,0,0,146,145,1,0,0,0,146,147,1,0,0,0,147,148,1,0,0,0,148,150,3,
	14,7,0,149,141,1,0,0,0,149,146,1,0,0,0,150,151,1,0,0,0,151,152,5,27,0,0,
	152,158,3,16,8,0,153,154,5,29,0,0,154,155,3,44,22,0,155,156,5,27,0,0,156,
	157,3,18,9,0,157,159,1,0,0,0,158,153,1,0,0,0,158,159,1,0,0,0,159,162,1,
	0,0,0,160,161,5,28,0,0,161,163,3,46,23,0,162,160,1,0,0,0,162,163,1,0,0,
	0,163,165,1,0,0,0,164,166,5,16,0,0,165,164,1,0,0,0,165,166,1,0,0,0,166,
	9,1,0,0,0,167,170,3,12,6,0,168,170,5,38,0,0,169,167,1,0,0,0,169,168,1,0,
	0,0,170,11,1,0,0,0,171,172,7,0,0,0,172,13,1,0,0,0,173,174,5,1,0,0,174,179,
	5,47,0,0,175,176,5,2,0,0,176,178,5,47,0,0,177,175,1,0,0,0,178,181,1,0,0,
	0,179,177,1,0,0,0,179,180,1,0,0,0,180,182,1,0,0,0,181,179,1,0,0,0,182,183,
	5,3,0,0,183,15,1,0,0,0,184,186,5,33,0,0,185,187,5,45,0,0,186,185,1,0,0,
	0,186,187,1,0,0,0,187,188,1,0,0,0,188,193,7,1,0,0,189,190,5,4,0,0,190,192,
	7,1,0,0,191,189,1,0,0,0,192,195,1,0,0,0,193,191,1,0,0,0,193,194,1,0,0,0,
	194,198,1,0,0,0,195,193,1,0,0,0,196,198,5,34,0,0,197,184,1,0,0,0,197,196,
	1,0,0,0,198,17,1,0,0,0,199,203,5,20,0,0,200,201,5,34,0,0,201,203,7,1,0,
	0,202,199,1,0,0,0,202,200,1,0,0,0,203,19,1,0,0,0,204,210,3,22,11,0,205,
	210,3,26,13,0,206,210,3,36,18,0,207,210,3,24,12,0,208,210,5,19,0,0,209,
	204,1,0,0,0,209,205,1,0,0,0,209,206,1,0,0,0,209,207,1,0,0,0,209,208,1,0,
	0,0,210,21,1,0,0,0,211,214,5,31,0,0,212,215,3,28,14,0,213,215,3,34,17,0,
	214,212,1,0,0,0,214,213,1,0,0,0,215,223,1,0,0,0,216,219,5,2,0,0,217,220,
	3,28,14,0,218,220,3,34,17,0,219,217,1,0,0,0,219,218,1,0,0,0,220,222,1,0,
	0,0,221,216,1,0,0,0,222,225,1,0,0,0,223,221,1,0,0,0,223,224,1,0,0,0,224,
	23,1,0,0,0,225,223,1,0,0,0,226,227,5,24,0,0,227,231,3,30,15,0,228,230,3,
	30,15,0,229,228,1,0,0,0,230,233,1,0,0,0,231,229,1,0,0,0,231,232,1,0,0,0,
	232,25,1,0,0,0,233,231,1,0,0,0,234,235,5,32,0,0,235,240,3,32,16,0,236,237,
	5,2,0,0,237,239,3,32,16,0,238,236,1,0,0,0,239,242,1,0,0,0,240,238,1,0,0,
	0,240,241,1,0,0,0,241,27,1,0,0,0,242,240,1,0,0,0,243,256,5,47,0,0,244,245,
	5,17,0,0,245,246,5,5,0,0,246,256,5,17,0,0,247,256,5,17,0,0,248,249,5,47,
	0,0,249,250,5,5,0,0,250,256,5,47,0,0,251,252,5,47,0,0,252,253,5,5,0,0,253,
	256,5,17,0,0,254,256,5,46,0,0,255,243,1,0,0,0,255,244,1,0,0,0,255,247,1,
	0,0,0,255,248,1,0,0,0,255,251,1,0,0,0,255,254,1,0,0,0,256,29,1,0,0,0,257,
	266,7,1,0,0,258,259,5,6,0,0,259,260,7,1,0,0,260,267,5,6,0,0,261,262,5,6,
	0,0,262,263,7,1,0,0,263,264,5,5,0,0,264,265,7,1,0,0,265,267,5,6,0,0,266,
	258,1,0,0,0,266,261,1,0,0,0,267,268,1,0,0,0,268,269,1,0,0,0,268,266,1,0,
	0,0,269,31,1,0,0,0,270,271,7,1,0,0,271,33,1,0,0,0,272,273,5,45,0,0,273,
	274,7,1,0,0,274,35,1,0,0,0,275,277,5,30,0,0,276,278,5,45,0,0,277,276,1,
	0,0,0,277,278,1,0,0,0,278,279,1,0,0,0,279,280,7,1,0,0,280,37,1,0,0,0,281,
	282,5,34,0,0,282,283,7,1,0,0,283,39,1,0,0,0,284,289,3,22,11,0,285,289,3,
	36,18,0,286,289,3,26,13,0,287,289,3,38,19,0,288,284,1,0,0,0,288,285,1,0,
	0,0,288,286,1,0,0,0,288,287,1,0,0,0,289,41,1,0,0,0,290,291,7,1,0,0,291,
	43,1,0,0,0,292,293,7,1,0,0,293,45,1,0,0,0,294,297,3,60,30,0,295,297,3,48,
	24,0,296,294,1,0,0,0,296,295,1,0,0,0,297,47,1,0,0,0,298,299,3,50,25,0,299,
	304,3,52,26,0,300,305,3,54,27,0,301,305,3,56,28,0,302,305,3,58,29,0,303,
	305,3,64,32,0,304,300,1,0,0,0,304,301,1,0,0,0,304,302,1,0,0,0,304,303,1,
	0,0,0,305,49,1,0,0,0,306,313,7,1,0,0,307,308,5,7,0,0,308,310,7,1,0,0,309,
	307,1,0,0,0,310,311,1,0,0,0,311,309,1,0,0,0,311,312,1,0,0,0,312,314,1,0,
	0,0,313,309,1,0,0,0,313,314,1,0,0,0,314,51,1,0,0,0,315,322,5,8,0,0,316,
	317,5,9,0,0,317,322,5,8,0,0,318,322,5,14,0,0,319,322,5,27,0,0,320,322,5,
	15,0,0,321,315,1,0,0,0,321,316,1,0,0,0,321,318,1,0,0,0,321,319,1,0,0,0,
	321,320,1,0,0,0,322,53,1,0,0,0,323,340,5,47,0,0,324,340,5,17,0,0,325,326,
	5,17,0,0,326,327,5,5,0,0,327,340,5,47,0,0,328,331,5,17,0,0,329,330,5,18,
	0,0,330,332,5,47,0,0,331,329,1,0,0,0,332,333,1,0,0,0,333,331,1,0,0,0,333,
	334,1,0,0,0,334,340,1,0,0,0,335,340,5,46,0,0,336,337,5,6,0,0,337,338,5,
	46,0,0,338,340,5,6,0,0,339,323,1,0,0,0,339,324,1,0,0,0,339,325,1,0,0,0,
	339,328,1,0,0,0,339,335,1,0,0,0,339,336,1,0,0,0,340,55,1,0,0,0,341,347,
	5,10,0,0,342,348,5,17,0,0,343,348,5,46,0,0,344,345,5,6,0,0,345,346,5,46,
	0,0,346,348,5,6,0,0,347,342,1,0,0,0,347,343,1,0,0,0,347,344,1,0,0,0,348,
	359,1,0,0,0,349,355,5,2,0,0,350,356,5,17,0,0,351,356,5,46,0,0,352,353,5,
	6,0,0,353,354,5,46,0,0,354,356,5,6,0,0,355,350,1,0,0,0,355,351,1,0,0,0,
	355,352,1,0,0,0,356,358,1,0,0,0,357,349,1,0,0,0,358,361,1,0,0,0,359,357,
	1,0,0,0,359,360,1,0,0,0,360,362,1,0,0,0,361,359,1,0,0,0,362,363,5,11,0,
	0,363,57,1,0,0,0,364,370,5,17,0,0,365,370,5,46,0,0,366,367,5,6,0,0,367,
	368,5,46,0,0,368,370,5,6,0,0,369,364,1,0,0,0,369,365,1,0,0,0,369,366,1,
	0,0,0,370,371,1,0,0,0,371,377,5,42,0,0,372,378,5,17,0,0,373,378,5,46,0,
	0,374,375,5,6,0,0,375,376,5,46,0,0,376,378,5,6,0,0,377,372,1,0,0,0,377,
	373,1,0,0,0,377,374,1,0,0,0,378,59,1,0,0,0,379,380,3,62,31,0,380,381,5,
	1,0,0,381,386,3,46,23,0,382,383,5,2,0,0,383,385,3,46,23,0,384,382,1,0,0,
	0,385,388,1,0,0,0,386,384,1,0,0,0,386,387,1,0,0,0,387,389,1,0,0,0,388,386,
	1,0,0,0,389,390,5,3,0,0,390,61,1,0,0,0,391,392,7,2,0,0,392,63,1,0,0,0,393,
	394,5,5,0,0,394,395,5,47,0,0,395,403,5,12,0,0,396,397,5,13,0,0,397,398,
	5,47,0,0,398,403,5,5,0,0,399,400,5,5,0,0,400,401,5,47,0,0,401,403,5,5,0,
	0,402,393,1,0,0,0,402,396,1,0,0,0,402,399,1,0,0,0,403,65,1,0,0,0,50,70,
	72,79,85,88,94,97,106,109,119,123,126,133,139,146,149,158,162,165,169,179,
	186,193,197,202,209,214,219,223,231,240,255,266,268,277,288,296,304,311,
	313,321,333,339,347,355,359,369,377,386,402];

	private static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!PolicyParser.__ATN) {
			PolicyParser.__ATN = new ATNDeserializer().deserialize(PolicyParser._serializedATN);
		}

		return PolicyParser.__ATN;
	}


	static DecisionsToDFA = PolicyParser._ATN.decisionToState.map( (ds: DecisionState, index: number) => new DFA(ds, index) );

}

export class PolicyContext extends ParserRuleContext {
	constructor(parser?: PolicyParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public EOF(): TerminalNode {
		return this.getToken(PolicyParser.EOF, 0);
	}
	public allowExpression_list(): AllowExpressionContext[] {
		return this.getTypedRuleContexts(AllowExpressionContext) as AllowExpressionContext[];
	}
	public allowExpression(i: number): AllowExpressionContext {
		return this.getTypedRuleContext(AllowExpressionContext, i) as AllowExpressionContext;
	}
	public endorseExpression_list(): EndorseExpressionContext[] {
		return this.getTypedRuleContexts(EndorseExpressionContext) as EndorseExpressionContext[];
	}
	public endorseExpression(i: number): EndorseExpressionContext {
		return this.getTypedRuleContext(EndorseExpressionContext, i) as EndorseExpressionContext;
	}
	public defineExpression_list(): DefineExpressionContext[] {
		return this.getTypedRuleContexts(DefineExpressionContext) as DefineExpressionContext[];
	}
	public defineExpression(i: number): DefineExpressionContext {
		return this.getTypedRuleContext(DefineExpressionContext, i) as DefineExpressionContext;
	}
	public admitExpression_list(): AdmitExpressionContext[] {
		return this.getTypedRuleContexts(AdmitExpressionContext) as AdmitExpressionContext[];
	}
	public admitExpression(i: number): AdmitExpressionContext {
		return this.getTypedRuleContext(AdmitExpressionContext, i) as AdmitExpressionContext;
	}
    public get ruleIndex(): number {
    	return PolicyParser.RULE_policy;
	}
	public enterRule(listener: PolicyListener): void {
	    if(listener.enterPolicy) {
	 		listener.enterPolicy(this);
		}
	}
	public exitRule(listener: PolicyListener): void {
	    if(listener.exitPolicy) {
	 		listener.exitPolicy(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PolicyVisitor<Result>): Result {
		if (visitor.visitPolicy) {
			return visitor.visitPolicy(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AllowExpressionContext extends ParserRuleContext {
	constructor(parser?: PolicyParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ALLOW(): TerminalNode {
		return this.getToken(PolicyParser.ALLOW, 0);
	}
	public subject(): SubjectContext {
		return this.getTypedRuleContext(SubjectContext, 0) as SubjectContext;
	}
	public IN(): TerminalNode {
		return this.getToken(PolicyParser.IN, 0);
	}
	public scope(): ScopeContext {
		return this.getTypedRuleContext(ScopeContext, 0) as ScopeContext;
	}
	public verb(): VerbContext {
		return this.getTypedRuleContext(VerbContext, 0) as VerbContext;
	}
	public resource(): ResourceContext {
		return this.getTypedRuleContext(ResourceContext, 0) as ResourceContext;
	}
	public permissionList(): PermissionListContext {
		return this.getTypedRuleContext(PermissionListContext, 0) as PermissionListContext;
	}
	public WHERE(): TerminalNode {
		return this.getToken(PolicyParser.WHERE, 0);
	}
	public condition(): ConditionContext {
		return this.getTypedRuleContext(ConditionContext, 0) as ConditionContext;
	}
	public NEWLINE(): TerminalNode {
		return this.getToken(PolicyParser.NEWLINE, 0);
	}
	public TO(): TerminalNode {
		return this.getToken(PolicyParser.TO, 0);
	}
    public get ruleIndex(): number {
    	return PolicyParser.RULE_allowExpression;
	}
	public enterRule(listener: PolicyListener): void {
	    if(listener.enterAllowExpression) {
	 		listener.enterAllowExpression(this);
		}
	}
	public exitRule(listener: PolicyListener): void {
	    if(listener.exitAllowExpression) {
	 		listener.exitAllowExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PolicyVisitor<Result>): Result {
		if (visitor.visitAllowExpression) {
			return visitor.visitAllowExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EndorseExpressionContext extends ParserRuleContext {
	constructor(parser?: PolicyParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ENDORSE(): TerminalNode {
		return this.getToken(PolicyParser.ENDORSE, 0);
	}
	public subject(): SubjectContext {
		return this.getTypedRuleContext(SubjectContext, 0) as SubjectContext;
	}
	public IN_list(): TerminalNode[] {
	    	return this.getTokens(PolicyParser.IN);
	}
	public IN(i: number): TerminalNode {
		return this.getToken(PolicyParser.IN, i);
	}
	public TO(): TerminalNode {
		return this.getToken(PolicyParser.TO, 0);
	}
	public endorseVerb(): EndorseVerbContext {
		return this.getTypedRuleContext(EndorseVerbContext, 0) as EndorseVerbContext;
	}
	public resource_list(): ResourceContext[] {
		return this.getTypedRuleContexts(ResourceContext) as ResourceContext[];
	}
	public resource(i: number): ResourceContext {
		return this.getTypedRuleContext(ResourceContext, i) as ResourceContext;
	}
	public permissionList(): PermissionListContext {
		return this.getTypedRuleContext(PermissionListContext, 0) as PermissionListContext;
	}
	public endorseScope(): EndorseScopeContext {
		return this.getTypedRuleContext(EndorseScopeContext, 0) as EndorseScopeContext;
	}
	public WHERE(): TerminalNode {
		return this.getToken(PolicyParser.WHERE, 0);
	}
	public condition(): ConditionContext {
		return this.getTypedRuleContext(ConditionContext, 0) as ConditionContext;
	}
	public NEWLINE(): TerminalNode {
		return this.getToken(PolicyParser.NEWLINE, 0);
	}
	public scope(): ScopeContext {
		return this.getTypedRuleContext(ScopeContext, 0) as ScopeContext;
	}
	public WITH(): TerminalNode {
		return this.getToken(PolicyParser.WITH, 0);
	}
    public get ruleIndex(): number {
    	return PolicyParser.RULE_endorseExpression;
	}
	public enterRule(listener: PolicyListener): void {
	    if(listener.enterEndorseExpression) {
	 		listener.enterEndorseExpression(this);
		}
	}
	public exitRule(listener: PolicyListener): void {
	    if(listener.exitEndorseExpression) {
	 		listener.exitEndorseExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PolicyVisitor<Result>): Result {
		if (visitor.visitEndorseExpression) {
			return visitor.visitEndorseExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DefineExpressionContext extends ParserRuleContext {
	constructor(parser?: PolicyParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DEFINE(): TerminalNode {
		return this.getToken(PolicyParser.DEFINE, 0);
	}
	public definedSubject(): DefinedSubjectContext {
		return this.getTypedRuleContext(DefinedSubjectContext, 0) as DefinedSubjectContext;
	}
	public AS(): TerminalNode {
		return this.getToken(PolicyParser.AS, 0);
	}
	public defined(): DefinedContext {
		return this.getTypedRuleContext(DefinedContext, 0) as DefinedContext;
	}
	public NEWLINE(): TerminalNode {
		return this.getToken(PolicyParser.NEWLINE, 0);
	}
    public get ruleIndex(): number {
    	return PolicyParser.RULE_defineExpression;
	}
	public enterRule(listener: PolicyListener): void {
	    if(listener.enterDefineExpression) {
	 		listener.enterDefineExpression(this);
		}
	}
	public exitRule(listener: PolicyListener): void {
	    if(listener.exitDefineExpression) {
	 		listener.exitDefineExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PolicyVisitor<Result>): Result {
		if (visitor.visitDefineExpression) {
			return visitor.visitDefineExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AdmitExpressionContext extends ParserRuleContext {
	constructor(parser?: PolicyParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ADMIT(): TerminalNode {
		return this.getToken(PolicyParser.ADMIT, 0);
	}
	public subject(): SubjectContext {
		return this.getTypedRuleContext(SubjectContext, 0) as SubjectContext;
	}
	public IN_list(): TerminalNode[] {
	    	return this.getTokens(PolicyParser.IN);
	}
	public IN(i: number): TerminalNode {
		return this.getToken(PolicyParser.IN, i);
	}
	public scope(): ScopeContext {
		return this.getTypedRuleContext(ScopeContext, 0) as ScopeContext;
	}
	public TO(): TerminalNode {
		return this.getToken(PolicyParser.TO, 0);
	}
	public endorseVerb(): EndorseVerbContext {
		return this.getTypedRuleContext(EndorseVerbContext, 0) as EndorseVerbContext;
	}
	public resource_list(): ResourceContext[] {
		return this.getTypedRuleContexts(ResourceContext) as ResourceContext[];
	}
	public resource(i: number): ResourceContext {
		return this.getTypedRuleContext(ResourceContext, i) as ResourceContext;
	}
	public permissionList(): PermissionListContext {
		return this.getTypedRuleContext(PermissionListContext, 0) as PermissionListContext;
	}
	public OF(): TerminalNode {
		return this.getToken(PolicyParser.OF, 0);
	}
	public endorseScope_list(): EndorseScopeContext[] {
		return this.getTypedRuleContexts(EndorseScopeContext) as EndorseScopeContext[];
	}
	public endorseScope(i: number): EndorseScopeContext {
		return this.getTypedRuleContext(EndorseScopeContext, i) as EndorseScopeContext;
	}
	public WITH(): TerminalNode {
		return this.getToken(PolicyParser.WITH, 0);
	}
	public WHERE(): TerminalNode {
		return this.getToken(PolicyParser.WHERE, 0);
	}
	public condition(): ConditionContext {
		return this.getTypedRuleContext(ConditionContext, 0) as ConditionContext;
	}
	public NEWLINE(): TerminalNode {
		return this.getToken(PolicyParser.NEWLINE, 0);
	}
    public get ruleIndex(): number {
    	return PolicyParser.RULE_admitExpression;
	}
	public enterRule(listener: PolicyListener): void {
	    if(listener.enterAdmitExpression) {
	 		listener.enterAdmitExpression(this);
		}
	}
	public exitRule(listener: PolicyListener): void {
	    if(listener.exitAdmitExpression) {
	 		listener.exitAdmitExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PolicyVisitor<Result>): Result {
		if (visitor.visitAdmitExpression) {
			return visitor.visitAdmitExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EndorseVerbContext extends ParserRuleContext {
	constructor(parser?: PolicyParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public verb(): VerbContext {
		return this.getTypedRuleContext(VerbContext, 0) as VerbContext;
	}
	public ASSOCIATE(): TerminalNode {
		return this.getToken(PolicyParser.ASSOCIATE, 0);
	}
    public get ruleIndex(): number {
    	return PolicyParser.RULE_endorseVerb;
	}
	public enterRule(listener: PolicyListener): void {
	    if(listener.enterEndorseVerb) {
	 		listener.enterEndorseVerb(this);
		}
	}
	public exitRule(listener: PolicyListener): void {
	    if(listener.exitEndorseVerb) {
	 		listener.exitEndorseVerb(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PolicyVisitor<Result>): Result {
		if (visitor.visitEndorseVerb) {
			return visitor.visitEndorseVerb(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VerbContext extends ParserRuleContext {
	constructor(parser?: PolicyParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public INSPECT(): TerminalNode {
		return this.getToken(PolicyParser.INSPECT, 0);
	}
	public READ(): TerminalNode {
		return this.getToken(PolicyParser.READ, 0);
	}
	public USE(): TerminalNode {
		return this.getToken(PolicyParser.USE, 0);
	}
	public MANAGE(): TerminalNode {
		return this.getToken(PolicyParser.MANAGE, 0);
	}
    public get ruleIndex(): number {
    	return PolicyParser.RULE_verb;
	}
	public enterRule(listener: PolicyListener): void {
	    if(listener.enterVerb) {
	 		listener.enterVerb(this);
		}
	}
	public exitRule(listener: PolicyListener): void {
	    if(listener.exitVerb) {
	 		listener.exitVerb(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PolicyVisitor<Result>): Result {
		if (visitor.visitVerb) {
			return visitor.visitVerb(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PermissionListContext extends ParserRuleContext {
	constructor(parser?: PolicyParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public WORD_list(): TerminalNode[] {
	    	return this.getTokens(PolicyParser.WORD);
	}
	public WORD(i: number): TerminalNode {
		return this.getToken(PolicyParser.WORD, i);
	}
    public get ruleIndex(): number {
    	return PolicyParser.RULE_permissionList;
	}
	public enterRule(listener: PolicyListener): void {
	    if(listener.enterPermissionList) {
	 		listener.enterPermissionList(this);
		}
	}
	public exitRule(listener: PolicyListener): void {
	    if(listener.exitPermissionList) {
	 		listener.exitPermissionList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PolicyVisitor<Result>): Result {
		if (visitor.visitPermissionList) {
			return visitor.visitPermissionList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ScopeContext extends ParserRuleContext {
	constructor(parser?: PolicyParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public TENANCY(): TerminalNode {
		return this.getToken(PolicyParser.TENANCY, 0);
	}
	public WORD_list(): TerminalNode[] {
	    	return this.getTokens(PolicyParser.WORD);
	}
	public WORD(i: number): TerminalNode {
		return this.getToken(PolicyParser.WORD, i);
	}
	public HCL_VAR_list(): TerminalNode[] {
	    	return this.getTokens(PolicyParser.HCL_VAR);
	}
	public HCL_VAR(i: number): TerminalNode {
		return this.getToken(PolicyParser.HCL_VAR, i);
	}
	public COMPARTMENT(): TerminalNode {
		return this.getToken(PolicyParser.COMPARTMENT, 0);
	}
	public ID(): TerminalNode {
		return this.getToken(PolicyParser.ID, 0);
	}
    public get ruleIndex(): number {
    	return PolicyParser.RULE_scope;
	}
	public enterRule(listener: PolicyListener): void {
	    if(listener.enterScope) {
	 		listener.enterScope(this);
		}
	}
	public exitRule(listener: PolicyListener): void {
	    if(listener.exitScope) {
	 		listener.exitScope(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PolicyVisitor<Result>): Result {
		if (visitor.visitScope) {
			return visitor.visitScope(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EndorseScopeContext extends ParserRuleContext {
	constructor(parser?: PolicyParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ANYTENANCY(): TerminalNode {
		return this.getToken(PolicyParser.ANYTENANCY, 0);
	}
	public TENANCY(): TerminalNode {
		return this.getToken(PolicyParser.TENANCY, 0);
	}
	public WORD(): TerminalNode {
		return this.getToken(PolicyParser.WORD, 0);
	}
	public HCL_VAR(): TerminalNode {
		return this.getToken(PolicyParser.HCL_VAR, 0);
	}
    public get ruleIndex(): number {
    	return PolicyParser.RULE_endorseScope;
	}
	public enterRule(listener: PolicyListener): void {
	    if(listener.enterEndorseScope) {
	 		listener.enterEndorseScope(this);
		}
	}
	public exitRule(listener: PolicyListener): void {
	    if(listener.exitEndorseScope) {
	 		listener.exitEndorseScope(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PolicyVisitor<Result>): Result {
		if (visitor.visitEndorseScope) {
			return visitor.visitEndorseScope(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SubjectContext extends ParserRuleContext {
	constructor(parser?: PolicyParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public groupSubject(): GroupSubjectContext {
		return this.getTypedRuleContext(GroupSubjectContext, 0) as GroupSubjectContext;
	}
	public serviceSubject(): ServiceSubjectContext {
		return this.getTypedRuleContext(ServiceSubjectContext, 0) as ServiceSubjectContext;
	}
	public dynamicGroupSubject(): DynamicGroupSubjectContext {
		return this.getTypedRuleContext(DynamicGroupSubjectContext, 0) as DynamicGroupSubjectContext;
	}
	public resourceSubject(): ResourceSubjectContext {
		return this.getTypedRuleContext(ResourceSubjectContext, 0) as ResourceSubjectContext;
	}
	public ANYUSER(): TerminalNode {
		return this.getToken(PolicyParser.ANYUSER, 0);
	}
    public get ruleIndex(): number {
    	return PolicyParser.RULE_subject;
	}
	public enterRule(listener: PolicyListener): void {
	    if(listener.enterSubject) {
	 		listener.enterSubject(this);
		}
	}
	public exitRule(listener: PolicyListener): void {
	    if(listener.exitSubject) {
	 		listener.exitSubject(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PolicyVisitor<Result>): Result {
		if (visitor.visitSubject) {
			return visitor.visitSubject(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class GroupSubjectContext extends ParserRuleContext {
	constructor(parser?: PolicyParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public GROUP(): TerminalNode {
		return this.getToken(PolicyParser.GROUP, 0);
	}
	public groupName_list(): GroupNameContext[] {
		return this.getTypedRuleContexts(GroupNameContext) as GroupNameContext[];
	}
	public groupName(i: number): GroupNameContext {
		return this.getTypedRuleContext(GroupNameContext, i) as GroupNameContext;
	}
	public groupID_list(): GroupIDContext[] {
		return this.getTypedRuleContexts(GroupIDContext) as GroupIDContext[];
	}
	public groupID(i: number): GroupIDContext {
		return this.getTypedRuleContext(GroupIDContext, i) as GroupIDContext;
	}
    public get ruleIndex(): number {
    	return PolicyParser.RULE_groupSubject;
	}
	public enterRule(listener: PolicyListener): void {
	    if(listener.enterGroupSubject) {
	 		listener.enterGroupSubject(this);
		}
	}
	public exitRule(listener: PolicyListener): void {
	    if(listener.exitGroupSubject) {
	 		listener.exitGroupSubject(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PolicyVisitor<Result>): Result {
		if (visitor.visitGroupSubject) {
			return visitor.visitGroupSubject(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ResourceSubjectContext extends ParserRuleContext {
	constructor(parser?: PolicyParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public RESOURCE(): TerminalNode {
		return this.getToken(PolicyParser.RESOURCE, 0);
	}
	public resourceSubjectId_list(): ResourceSubjectIdContext[] {
		return this.getTypedRuleContexts(ResourceSubjectIdContext) as ResourceSubjectIdContext[];
	}
	public resourceSubjectId(i: number): ResourceSubjectIdContext {
		return this.getTypedRuleContext(ResourceSubjectIdContext, i) as ResourceSubjectIdContext;
	}
    public get ruleIndex(): number {
    	return PolicyParser.RULE_resourceSubject;
	}
	public enterRule(listener: PolicyListener): void {
	    if(listener.enterResourceSubject) {
	 		listener.enterResourceSubject(this);
		}
	}
	public exitRule(listener: PolicyListener): void {
	    if(listener.exitResourceSubject) {
	 		listener.exitResourceSubject(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PolicyVisitor<Result>): Result {
		if (visitor.visitResourceSubject) {
			return visitor.visitResourceSubject(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ServiceSubjectContext extends ParserRuleContext {
	constructor(parser?: PolicyParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public SERVICE(): TerminalNode {
		return this.getToken(PolicyParser.SERVICE, 0);
	}
	public serviceSubjectId_list(): ServiceSubjectIdContext[] {
		return this.getTypedRuleContexts(ServiceSubjectIdContext) as ServiceSubjectIdContext[];
	}
	public serviceSubjectId(i: number): ServiceSubjectIdContext {
		return this.getTypedRuleContext(ServiceSubjectIdContext, i) as ServiceSubjectIdContext;
	}
    public get ruleIndex(): number {
    	return PolicyParser.RULE_serviceSubject;
	}
	public enterRule(listener: PolicyListener): void {
	    if(listener.enterServiceSubject) {
	 		listener.enterServiceSubject(this);
		}
	}
	public exitRule(listener: PolicyListener): void {
	    if(listener.exitServiceSubject) {
	 		listener.exitServiceSubject(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PolicyVisitor<Result>): Result {
		if (visitor.visitServiceSubject) {
			return visitor.visitServiceSubject(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class GroupNameContext extends ParserRuleContext {
	constructor(parser?: PolicyParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public WORD_list(): TerminalNode[] {
	    	return this.getTokens(PolicyParser.WORD);
	}
	public WORD(i: number): TerminalNode {
		return this.getToken(PolicyParser.WORD, i);
	}
	public QUOTED_STRING_list(): TerminalNode[] {
	    	return this.getTokens(PolicyParser.QUOTED_STRING);
	}
	public QUOTED_STRING(i: number): TerminalNode {
		return this.getToken(PolicyParser.QUOTED_STRING, i);
	}
	public HCL_VAR(): TerminalNode {
		return this.getToken(PolicyParser.HCL_VAR, 0);
	}
    public get ruleIndex(): number {
    	return PolicyParser.RULE_groupName;
	}
	public enterRule(listener: PolicyListener): void {
	    if(listener.enterGroupName) {
	 		listener.enterGroupName(this);
		}
	}
	public exitRule(listener: PolicyListener): void {
	    if(listener.exitGroupName) {
	 		listener.exitGroupName(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PolicyVisitor<Result>): Result {
		if (visitor.visitGroupName) {
			return visitor.visitGroupName(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ResourceSubjectIdContext extends ParserRuleContext {
	constructor(parser?: PolicyParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public WORD_list(): TerminalNode[] {
	    	return this.getTokens(PolicyParser.WORD);
	}
	public WORD(i: number): TerminalNode {
		return this.getToken(PolicyParser.WORD, i);
	}
	public HCL_VAR_list(): TerminalNode[] {
	    	return this.getTokens(PolicyParser.HCL_VAR);
	}
	public HCL_VAR(i: number): TerminalNode {
		return this.getToken(PolicyParser.HCL_VAR, i);
	}
    public get ruleIndex(): number {
    	return PolicyParser.RULE_resourceSubjectId;
	}
	public enterRule(listener: PolicyListener): void {
	    if(listener.enterResourceSubjectId) {
	 		listener.enterResourceSubjectId(this);
		}
	}
	public exitRule(listener: PolicyListener): void {
	    if(listener.exitResourceSubjectId) {
	 		listener.exitResourceSubjectId(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PolicyVisitor<Result>): Result {
		if (visitor.visitResourceSubjectId) {
			return visitor.visitResourceSubjectId(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ServiceSubjectIdContext extends ParserRuleContext {
	constructor(parser?: PolicyParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public WORD(): TerminalNode {
		return this.getToken(PolicyParser.WORD, 0);
	}
	public HCL_VAR(): TerminalNode {
		return this.getToken(PolicyParser.HCL_VAR, 0);
	}
    public get ruleIndex(): number {
    	return PolicyParser.RULE_serviceSubjectId;
	}
	public enterRule(listener: PolicyListener): void {
	    if(listener.enterServiceSubjectId) {
	 		listener.enterServiceSubjectId(this);
		}
	}
	public exitRule(listener: PolicyListener): void {
	    if(listener.exitServiceSubjectId) {
	 		listener.exitServiceSubjectId(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PolicyVisitor<Result>): Result {
		if (visitor.visitServiceSubjectId) {
			return visitor.visitServiceSubjectId(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class GroupIDContext extends ParserRuleContext {
	constructor(parser?: PolicyParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ID(): TerminalNode {
		return this.getToken(PolicyParser.ID, 0);
	}
	public WORD(): TerminalNode {
		return this.getToken(PolicyParser.WORD, 0);
	}
	public HCL_VAR(): TerminalNode {
		return this.getToken(PolicyParser.HCL_VAR, 0);
	}
    public get ruleIndex(): number {
    	return PolicyParser.RULE_groupID;
	}
	public enterRule(listener: PolicyListener): void {
	    if(listener.enterGroupID) {
	 		listener.enterGroupID(this);
		}
	}
	public exitRule(listener: PolicyListener): void {
	    if(listener.exitGroupID) {
	 		listener.exitGroupID(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PolicyVisitor<Result>): Result {
		if (visitor.visitGroupID) {
			return visitor.visitGroupID(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DynamicGroupSubjectContext extends ParserRuleContext {
	constructor(parser?: PolicyParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DYNAMICGROUP(): TerminalNode {
		return this.getToken(PolicyParser.DYNAMICGROUP, 0);
	}
	public WORD(): TerminalNode {
		return this.getToken(PolicyParser.WORD, 0);
	}
	public HCL_VAR(): TerminalNode {
		return this.getToken(PolicyParser.HCL_VAR, 0);
	}
	public ID(): TerminalNode {
		return this.getToken(PolicyParser.ID, 0);
	}
    public get ruleIndex(): number {
    	return PolicyParser.RULE_dynamicGroupSubject;
	}
	public enterRule(listener: PolicyListener): void {
	    if(listener.enterDynamicGroupSubject) {
	 		listener.enterDynamicGroupSubject(this);
		}
	}
	public exitRule(listener: PolicyListener): void {
	    if(listener.exitDynamicGroupSubject) {
	 		listener.exitDynamicGroupSubject(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PolicyVisitor<Result>): Result {
		if (visitor.visitDynamicGroupSubject) {
			return visitor.visitDynamicGroupSubject(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TenancySubjectContext extends ParserRuleContext {
	constructor(parser?: PolicyParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public TENANCY(): TerminalNode {
		return this.getToken(PolicyParser.TENANCY, 0);
	}
	public WORD(): TerminalNode {
		return this.getToken(PolicyParser.WORD, 0);
	}
	public HCL_VAR(): TerminalNode {
		return this.getToken(PolicyParser.HCL_VAR, 0);
	}
    public get ruleIndex(): number {
    	return PolicyParser.RULE_tenancySubject;
	}
	public enterRule(listener: PolicyListener): void {
	    if(listener.enterTenancySubject) {
	 		listener.enterTenancySubject(this);
		}
	}
	public exitRule(listener: PolicyListener): void {
	    if(listener.exitTenancySubject) {
	 		listener.exitTenancySubject(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PolicyVisitor<Result>): Result {
		if (visitor.visitTenancySubject) {
			return visitor.visitTenancySubject(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DefinedSubjectContext extends ParserRuleContext {
	constructor(parser?: PolicyParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public groupSubject(): GroupSubjectContext {
		return this.getTypedRuleContext(GroupSubjectContext, 0) as GroupSubjectContext;
	}
	public dynamicGroupSubject(): DynamicGroupSubjectContext {
		return this.getTypedRuleContext(DynamicGroupSubjectContext, 0) as DynamicGroupSubjectContext;
	}
	public serviceSubject(): ServiceSubjectContext {
		return this.getTypedRuleContext(ServiceSubjectContext, 0) as ServiceSubjectContext;
	}
	public tenancySubject(): TenancySubjectContext {
		return this.getTypedRuleContext(TenancySubjectContext, 0) as TenancySubjectContext;
	}
    public get ruleIndex(): number {
    	return PolicyParser.RULE_definedSubject;
	}
	public enterRule(listener: PolicyListener): void {
	    if(listener.enterDefinedSubject) {
	 		listener.enterDefinedSubject(this);
		}
	}
	public exitRule(listener: PolicyListener): void {
	    if(listener.exitDefinedSubject) {
	 		listener.exitDefinedSubject(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PolicyVisitor<Result>): Result {
		if (visitor.visitDefinedSubject) {
			return visitor.visitDefinedSubject(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DefinedContext extends ParserRuleContext {
	constructor(parser?: PolicyParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public WORD(): TerminalNode {
		return this.getToken(PolicyParser.WORD, 0);
	}
	public HCL_VAR(): TerminalNode {
		return this.getToken(PolicyParser.HCL_VAR, 0);
	}
    public get ruleIndex(): number {
    	return PolicyParser.RULE_defined;
	}
	public enterRule(listener: PolicyListener): void {
	    if(listener.enterDefined) {
	 		listener.enterDefined(this);
		}
	}
	public exitRule(listener: PolicyListener): void {
	    if(listener.exitDefined) {
	 		listener.exitDefined(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PolicyVisitor<Result>): Result {
		if (visitor.visitDefined) {
			return visitor.visitDefined(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ResourceContext extends ParserRuleContext {
	constructor(parser?: PolicyParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public WORD(): TerminalNode {
		return this.getToken(PolicyParser.WORD, 0);
	}
	public HCL_VAR(): TerminalNode {
		return this.getToken(PolicyParser.HCL_VAR, 0);
	}
    public get ruleIndex(): number {
    	return PolicyParser.RULE_resource;
	}
	public enterRule(listener: PolicyListener): void {
	    if(listener.enterResource) {
	 		listener.enterResource(this);
		}
	}
	public exitRule(listener: PolicyListener): void {
	    if(listener.exitResource) {
	 		listener.exitResource(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PolicyVisitor<Result>): Result {
		if (visitor.visitResource) {
			return visitor.visitResource(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ConditionContext extends ParserRuleContext {
	constructor(parser?: PolicyParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public comparisonList(): ComparisonListContext {
		return this.getTypedRuleContext(ComparisonListContext, 0) as ComparisonListContext;
	}
	public comparison(): ComparisonContext {
		return this.getTypedRuleContext(ComparisonContext, 0) as ComparisonContext;
	}
    public get ruleIndex(): number {
    	return PolicyParser.RULE_condition;
	}
	public enterRule(listener: PolicyListener): void {
	    if(listener.enterCondition) {
	 		listener.enterCondition(this);
		}
	}
	public exitRule(listener: PolicyListener): void {
	    if(listener.exitCondition) {
	 		listener.exitCondition(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PolicyVisitor<Result>): Result {
		if (visitor.visitCondition) {
			return visitor.visitCondition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ComparisonContext extends ParserRuleContext {
	constructor(parser?: PolicyParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public variable(): VariableContext {
		return this.getTypedRuleContext(VariableContext, 0) as VariableContext;
	}
	public operator(): OperatorContext {
		return this.getTypedRuleContext(OperatorContext, 0) as OperatorContext;
	}
	public value(): ValueContext {
		return this.getTypedRuleContext(ValueContext, 0) as ValueContext;
	}
	public valueList(): ValueListContext {
		return this.getTypedRuleContext(ValueListContext, 0) as ValueListContext;
	}
	public timeWindow(): TimeWindowContext {
		return this.getTypedRuleContext(TimeWindowContext, 0) as TimeWindowContext;
	}
	public patternMatch(): PatternMatchContext {
		return this.getTypedRuleContext(PatternMatchContext, 0) as PatternMatchContext;
	}
    public get ruleIndex(): number {
    	return PolicyParser.RULE_comparison;
	}
	public enterRule(listener: PolicyListener): void {
	    if(listener.enterComparison) {
	 		listener.enterComparison(this);
		}
	}
	public exitRule(listener: PolicyListener): void {
	    if(listener.exitComparison) {
	 		listener.exitComparison(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PolicyVisitor<Result>): Result {
		if (visitor.visitComparison) {
			return visitor.visitComparison(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VariableContext extends ParserRuleContext {
	constructor(parser?: PolicyParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public WORD_list(): TerminalNode[] {
	    	return this.getTokens(PolicyParser.WORD);
	}
	public WORD(i: number): TerminalNode {
		return this.getToken(PolicyParser.WORD, i);
	}
	public HCL_VAR_list(): TerminalNode[] {
	    	return this.getTokens(PolicyParser.HCL_VAR);
	}
	public HCL_VAR(i: number): TerminalNode {
		return this.getToken(PolicyParser.HCL_VAR, i);
	}
    public get ruleIndex(): number {
    	return PolicyParser.RULE_variable;
	}
	public enterRule(listener: PolicyListener): void {
	    if(listener.enterVariable) {
	 		listener.enterVariable(this);
		}
	}
	public exitRule(listener: PolicyListener): void {
	    if(listener.exitVariable) {
	 		listener.exitVariable(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PolicyVisitor<Result>): Result {
		if (visitor.visitVariable) {
			return visitor.visitVariable(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class OperatorContext extends ParserRuleContext {
	constructor(parser?: PolicyParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public BEFORE(): TerminalNode {
		return this.getToken(PolicyParser.BEFORE, 0);
	}
	public IN(): TerminalNode {
		return this.getToken(PolicyParser.IN, 0);
	}
	public BETWEEN(): TerminalNode {
		return this.getToken(PolicyParser.BETWEEN, 0);
	}
    public get ruleIndex(): number {
    	return PolicyParser.RULE_operator;
	}
	public enterRule(listener: PolicyListener): void {
	    if(listener.enterOperator) {
	 		listener.enterOperator(this);
		}
	}
	public exitRule(listener: PolicyListener): void {
	    if(listener.exitOperator) {
	 		listener.exitOperator(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PolicyVisitor<Result>): Result {
		if (visitor.visitOperator) {
			return visitor.visitOperator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ValueContext extends ParserRuleContext {
	constructor(parser?: PolicyParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public WORD_list(): TerminalNode[] {
	    	return this.getTokens(PolicyParser.WORD);
	}
	public WORD(i: number): TerminalNode {
		return this.getToken(PolicyParser.WORD, i);
	}
	public QUOTED_STRING(): TerminalNode {
		return this.getToken(PolicyParser.QUOTED_STRING, 0);
	}
	public HCL_VAR(): TerminalNode {
		return this.getToken(PolicyParser.HCL_VAR, 0);
	}
	public WS_list(): TerminalNode[] {
	    	return this.getTokens(PolicyParser.WS);
	}
	public WS(i: number): TerminalNode {
		return this.getToken(PolicyParser.WS, i);
	}
    public get ruleIndex(): number {
    	return PolicyParser.RULE_value;
	}
	public enterRule(listener: PolicyListener): void {
	    if(listener.enterValue) {
	 		listener.enterValue(this);
		}
	}
	public exitRule(listener: PolicyListener): void {
	    if(listener.exitValue) {
	 		listener.exitValue(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PolicyVisitor<Result>): Result {
		if (visitor.visitValue) {
			return visitor.visitValue(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ValueListContext extends ParserRuleContext {
	constructor(parser?: PolicyParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public QUOTED_STRING_list(): TerminalNode[] {
	    	return this.getTokens(PolicyParser.QUOTED_STRING);
	}
	public QUOTED_STRING(i: number): TerminalNode {
		return this.getToken(PolicyParser.QUOTED_STRING, i);
	}
	public HCL_VAR_list(): TerminalNode[] {
	    	return this.getTokens(PolicyParser.HCL_VAR);
	}
	public HCL_VAR(i: number): TerminalNode {
		return this.getToken(PolicyParser.HCL_VAR, i);
	}
    public get ruleIndex(): number {
    	return PolicyParser.RULE_valueList;
	}
	public enterRule(listener: PolicyListener): void {
	    if(listener.enterValueList) {
	 		listener.enterValueList(this);
		}
	}
	public exitRule(listener: PolicyListener): void {
	    if(listener.exitValueList) {
	 		listener.exitValueList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PolicyVisitor<Result>): Result {
		if (visitor.visitValueList) {
			return visitor.visitValueList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TimeWindowContext extends ParserRuleContext {
	constructor(parser?: PolicyParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public AND(): TerminalNode {
		return this.getToken(PolicyParser.AND, 0);
	}
	public QUOTED_STRING_list(): TerminalNode[] {
	    	return this.getTokens(PolicyParser.QUOTED_STRING);
	}
	public QUOTED_STRING(i: number): TerminalNode {
		return this.getToken(PolicyParser.QUOTED_STRING, i);
	}
	public HCL_VAR_list(): TerminalNode[] {
	    	return this.getTokens(PolicyParser.HCL_VAR);
	}
	public HCL_VAR(i: number): TerminalNode {
		return this.getToken(PolicyParser.HCL_VAR, i);
	}
    public get ruleIndex(): number {
    	return PolicyParser.RULE_timeWindow;
	}
	public enterRule(listener: PolicyListener): void {
	    if(listener.enterTimeWindow) {
	 		listener.enterTimeWindow(this);
		}
	}
	public exitRule(listener: PolicyListener): void {
	    if(listener.exitTimeWindow) {
	 		listener.exitTimeWindow(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PolicyVisitor<Result>): Result {
		if (visitor.visitTimeWindow) {
			return visitor.visitTimeWindow(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ComparisonListContext extends ParserRuleContext {
	constructor(parser?: PolicyParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public logicalCombine(): LogicalCombineContext {
		return this.getTypedRuleContext(LogicalCombineContext, 0) as LogicalCombineContext;
	}
	public condition_list(): ConditionContext[] {
		return this.getTypedRuleContexts(ConditionContext) as ConditionContext[];
	}
	public condition(i: number): ConditionContext {
		return this.getTypedRuleContext(ConditionContext, i) as ConditionContext;
	}
    public get ruleIndex(): number {
    	return PolicyParser.RULE_comparisonList;
	}
	public enterRule(listener: PolicyListener): void {
	    if(listener.enterComparisonList) {
	 		listener.enterComparisonList(this);
		}
	}
	public exitRule(listener: PolicyListener): void {
	    if(listener.exitComparisonList) {
	 		listener.exitComparisonList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PolicyVisitor<Result>): Result {
		if (visitor.visitComparisonList) {
			return visitor.visitComparisonList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LogicalCombineContext extends ParserRuleContext {
	constructor(parser?: PolicyParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ALL(): TerminalNode {
		return this.getToken(PolicyParser.ALL, 0);
	}
	public ANY(): TerminalNode {
		return this.getToken(PolicyParser.ANY, 0);
	}
    public get ruleIndex(): number {
    	return PolicyParser.RULE_logicalCombine;
	}
	public enterRule(listener: PolicyListener): void {
	    if(listener.enterLogicalCombine) {
	 		listener.enterLogicalCombine(this);
		}
	}
	public exitRule(listener: PolicyListener): void {
	    if(listener.exitLogicalCombine) {
	 		listener.exitLogicalCombine(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PolicyVisitor<Result>): Result {
		if (visitor.visitLogicalCombine) {
			return visitor.visitLogicalCombine(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PatternMatchContext extends ParserRuleContext {
	constructor(parser?: PolicyParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public WORD(): TerminalNode {
		return this.getToken(PolicyParser.WORD, 0);
	}
    public get ruleIndex(): number {
    	return PolicyParser.RULE_patternMatch;
	}
	public enterRule(listener: PolicyListener): void {
	    if(listener.enterPatternMatch) {
	 		listener.enterPatternMatch(this);
		}
	}
	public exitRule(listener: PolicyListener): void {
	    if(listener.exitPatternMatch) {
	 		listener.exitPatternMatch(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PolicyVisitor<Result>): Result {
		if (visitor.visitPatternMatch) {
			return visitor.visitPatternMatch(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
