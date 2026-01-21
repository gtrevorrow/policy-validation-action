// Generated from Policy.g4 by ANTLR 4.9.0-SNAPSHOT


import { ATN } from "antlr4ts/atn/ATN";
import { ATNDeserializer } from "antlr4ts/atn/ATNDeserializer";
import { FailedPredicateException } from "antlr4ts/FailedPredicateException";
import { NotNull } from "antlr4ts/Decorators";
import { NoViableAltException } from "antlr4ts/NoViableAltException";
import { Override } from "antlr4ts/Decorators";
import { Parser } from "antlr4ts/Parser";
import { ParserRuleContext } from "antlr4ts/ParserRuleContext";
import { ParserATNSimulator } from "antlr4ts/atn/ParserATNSimulator";
import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";
import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";
import { RecognitionException } from "antlr4ts/RecognitionException";
import { RuleContext } from "antlr4ts/RuleContext";
//import { RuleVersion } from "antlr4ts/RuleVersion";
import { TerminalNode } from "antlr4ts/tree/TerminalNode";
import { Token } from "antlr4ts/Token";
import { TokenStream } from "antlr4ts/TokenStream";
import { Vocabulary } from "antlr4ts/Vocabulary";
import { VocabularyImpl } from "antlr4ts/VocabularyImpl";

import * as Utils from "antlr4ts/misc/Utils";

import { PolicyListener } from "./PolicyListener";
import { PolicyVisitor } from "./PolicyVisitor";


export class PolicyParser extends Parser {
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
	public static readonly DENY = 23;
	public static readonly DEFINE = 24;
	public static readonly RESOURCE = 25;
	public static readonly TO = 26;
	public static readonly OF = 27;
	public static readonly IN = 28;
	public static readonly WHERE = 29;
	public static readonly WITH = 30;
	public static readonly DYNAMICGROUP = 31;
	public static readonly GROUP = 32;
	public static readonly SERVICE = 33;
	public static readonly COMPARTMENT = 34;
	public static readonly TENANCY = 35;
	public static readonly READ = 36;
	public static readonly INSPECT = 37;
	public static readonly MANAGE = 38;
	public static readonly ASSOCIATE = 39;
	public static readonly ADMIT = 40;
	public static readonly USE = 41;
	public static readonly ANY = 42;
	public static readonly AND = 43;
	public static readonly ALL = 44;
	public static readonly AS = 45;
	public static readonly ID = 46;
	public static readonly HCL_VAR = 47;
	public static readonly WORD = 48;
	public static readonly RULE_policy = 0;
	public static readonly RULE_allowExpression = 1;
	public static readonly RULE_endorseExpression = 2;
	public static readonly RULE_defineExpression = 3;
	public static readonly RULE_admitExpression = 4;
	public static readonly RULE_denyExpression = 5;
	public static readonly RULE_endorseVerb = 6;
	public static readonly RULE_verb = 7;
	public static readonly RULE_permissionList = 8;
	public static readonly RULE_scope = 9;
	public static readonly RULE_endorseScope = 10;
	public static readonly RULE_subject = 11;
	public static readonly RULE_groupSubject = 12;
	public static readonly RULE_resourceSubject = 13;
	public static readonly RULE_serviceSubject = 14;
	public static readonly RULE_groupName = 15;
	public static readonly RULE_resourceSubjectId = 16;
	public static readonly RULE_serviceSubjectId = 17;
	public static readonly RULE_groupID = 18;
	public static readonly RULE_dynamicGroupSubject = 19;
	public static readonly RULE_tenancySubject = 20;
	public static readonly RULE_definedSubject = 21;
	public static readonly RULE_defined = 22;
	public static readonly RULE_resource = 23;
	public static readonly RULE_condition = 24;
	public static readonly RULE_functionCall = 25;
	public static readonly RULE_argumentList = 26;
	public static readonly RULE_argument = 27;
	public static readonly RULE_comparison = 28;
	public static readonly RULE_variable = 29;
	public static readonly RULE_operator = 30;
	public static readonly RULE_value = 31;
	public static readonly RULE_valueList = 32;
	public static readonly RULE_timeWindow = 33;
	public static readonly RULE_comparisonList = 34;
	public static readonly RULE_logicalCombine = 35;
	public static readonly RULE_patternMatch = 36;
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"policy", "allowExpression", "endorseExpression", "defineExpression", 
		"admitExpression", "denyExpression", "endorseVerb", "verb", "permissionList", 
		"scope", "endorseScope", "subject", "groupSubject", "resourceSubject", 
		"serviceSubject", "groupName", "resourceSubjectId", "serviceSubjectId", 
		"groupID", "dynamicGroupSubject", "tenancySubject", "definedSubject", 
		"defined", "resource", "condition", "functionCall", "argumentList", "argument", 
		"comparison", "variable", "operator", "value", "valueList", "timeWindow", 
		"comparisonList", "logicalCombine", "patternMatch",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, "'{'", "','", "'}'", "':'", "'/'", "'''", "'('", "')'", "'.'", 
		"'='", "'!'", "'*/'", "'/*'",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		"BEFORE", "BETWEEN", "NEWLINE", "QUOTED_STRING", "WS", "ANYUSER", "ANYTENANCY", 
		"ENDORSE", "ALLOW", "DENY", "DEFINE", "RESOURCE", "TO", "OF", "IN", "WHERE", 
		"WITH", "DYNAMICGROUP", "GROUP", "SERVICE", "COMPARTMENT", "TENANCY", 
		"READ", "INSPECT", "MANAGE", "ASSOCIATE", "ADMIT", "USE", "ANY", "AND", 
		"ALL", "AS", "ID", "HCL_VAR", "WORD",
	];
	public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(PolicyParser._LITERAL_NAMES, PolicyParser._SYMBOLIC_NAMES, []);

	// @Override
	// @NotNull
	public get vocabulary(): Vocabulary {
		return PolicyParser.VOCABULARY;
	}
	// tslint:enable:no-trailing-whitespace

	// @Override
	public get grammarFileName(): string { return "Policy.g4"; }

	// @Override
	public get ruleNames(): string[] { return PolicyParser.ruleNames; }

	// @Override
	public get serializedATN(): string { return PolicyParser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(PolicyParser._ATN, this);
	}
	// @RuleVersion(0)
	public policy(): PolicyContext {
		let _localctx: PolicyContext = new PolicyContext(this._ctx, this.state);
		this.enterRule(_localctx, 0, PolicyParser.RULE_policy);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 79;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				this.state = 79;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case PolicyParser.ALLOW:
					{
					this.state = 74;
					this.allowExpression();
					}
					break;
				case PolicyParser.DENY:
					{
					this.state = 75;
					this.denyExpression();
					}
					break;
				case PolicyParser.ENDORSE:
					{
					this.state = 76;
					this.endorseExpression();
					}
					break;
				case PolicyParser.DEFINE:
					{
					this.state = 77;
					this.defineExpression();
					}
					break;
				case PolicyParser.ADMIT:
					{
					this.state = 78;
					this.admitExpression();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				this.state = 81;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (((((_la - 21)) & ~0x1F) === 0 && ((1 << (_la - 21)) & ((1 << (PolicyParser.ENDORSE - 21)) | (1 << (PolicyParser.ALLOW - 21)) | (1 << (PolicyParser.DENY - 21)) | (1 << (PolicyParser.DEFINE - 21)) | (1 << (PolicyParser.ADMIT - 21)))) !== 0));
			this.state = 83;
			this.match(PolicyParser.EOF);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public allowExpression(): AllowExpressionContext {
		let _localctx: AllowExpressionContext = new AllowExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 2, PolicyParser.RULE_allowExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 85;
			this.match(PolicyParser.ALLOW);
			this.state = 86;
			this.subject();
			this.state = 97;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 4, this._ctx) ) {
			case 1:
				{
				this.state = 88;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === PolicyParser.TO) {
					{
					this.state = 87;
					this.match(PolicyParser.TO);
					}
				}

				this.state = 90;
				this.verb();
				this.state = 91;
				this.resource();
				}
				break;

			case 2:
				{
				this.state = 94;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === PolicyParser.TO) {
					{
					this.state = 93;
					this.match(PolicyParser.TO);
					}
				}

				this.state = 96;
				this.permissionList();
				}
				break;
			}
			this.state = 99;
			this.match(PolicyParser.IN);
			this.state = 100;
			this.scope();
			this.state = 103;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === PolicyParser.WHERE) {
				{
				this.state = 101;
				this.match(PolicyParser.WHERE);
				this.state = 102;
				this.condition();
				}
			}

			this.state = 106;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === PolicyParser.NEWLINE) {
				{
				this.state = 105;
				this.match(PolicyParser.NEWLINE);
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public endorseExpression(): EndorseExpressionContext {
		let _localctx: EndorseExpressionContext = new EndorseExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 4, PolicyParser.RULE_endorseExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 108;
			this.match(PolicyParser.ENDORSE);
			this.state = 109;
			this.subject();
			this.state = 118;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 8, this._ctx) ) {
			case 1:
				{
				this.state = 110;
				this.match(PolicyParser.TO);
				this.state = 111;
				this.endorseVerb();
				this.state = 112;
				this.resource();
				}
				break;

			case 2:
				{
				this.state = 115;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === PolicyParser.TO) {
					{
					this.state = 114;
					this.match(PolicyParser.TO);
					}
				}

				this.state = 117;
				this.permissionList();
				}
				break;
			}
			this.state = 120;
			this.match(PolicyParser.IN);
			this.state = 128;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 9, this._ctx) ) {
			case 1:
				{
				this.state = 121;
				this.endorseScope();
				}
				break;

			case 2:
				{
				{
				this.state = 122;
				this.scope();
				this.state = 123;
				this.match(PolicyParser.WITH);
				this.state = 124;
				this.resource();
				this.state = 125;
				this.match(PolicyParser.IN);
				this.state = 126;
				this.endorseScope();
				}
				}
				break;
			}
			this.state = 132;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === PolicyParser.WHERE) {
				{
				this.state = 130;
				this.match(PolicyParser.WHERE);
				this.state = 131;
				this.condition();
				}
			}

			this.state = 135;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === PolicyParser.NEWLINE) {
				{
				this.state = 134;
				this.match(PolicyParser.NEWLINE);
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public defineExpression(): DefineExpressionContext {
		let _localctx: DefineExpressionContext = new DefineExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 6, PolicyParser.RULE_defineExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 137;
			this.match(PolicyParser.DEFINE);
			this.state = 138;
			this.definedSubject();
			this.state = 139;
			this.match(PolicyParser.AS);
			this.state = 140;
			this.defined();
			this.state = 142;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === PolicyParser.NEWLINE) {
				{
				this.state = 141;
				this.match(PolicyParser.NEWLINE);
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public admitExpression(): AdmitExpressionContext {
		let _localctx: AdmitExpressionContext = new AdmitExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 8, PolicyParser.RULE_admitExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 144;
			this.match(PolicyParser.ADMIT);
			this.state = 145;
			this.subject();
			this.state = 148;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === PolicyParser.OF) {
				{
				this.state = 146;
				this.match(PolicyParser.OF);
				this.state = 147;
				this.endorseScope();
				}
			}

			this.state = 158;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 15, this._ctx) ) {
			case 1:
				{
				this.state = 150;
				this.match(PolicyParser.TO);
				this.state = 151;
				this.endorseVerb();
				this.state = 152;
				this.resource();
				}
				break;

			case 2:
				{
				this.state = 155;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === PolicyParser.TO) {
					{
					this.state = 154;
					this.match(PolicyParser.TO);
					}
				}

				this.state = 157;
				this.permissionList();
				}
				break;
			}
			this.state = 160;
			this.match(PolicyParser.IN);
			this.state = 161;
			this.scope();
			this.state = 167;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === PolicyParser.WITH) {
				{
				this.state = 162;
				this.match(PolicyParser.WITH);
				this.state = 163;
				this.resource();
				this.state = 164;
				this.match(PolicyParser.IN);
				this.state = 165;
				this.endorseScope();
				}
			}

			this.state = 171;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === PolicyParser.WHERE) {
				{
				this.state = 169;
				this.match(PolicyParser.WHERE);
				this.state = 170;
				this.condition();
				}
			}

			this.state = 174;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === PolicyParser.NEWLINE) {
				{
				this.state = 173;
				this.match(PolicyParser.NEWLINE);
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public denyExpression(): DenyExpressionContext {
		let _localctx: DenyExpressionContext = new DenyExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 10, PolicyParser.RULE_denyExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 176;
			this.match(PolicyParser.DENY);
			this.state = 201;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case PolicyParser.ADMIT:
				{
				this.state = 177;
				this.admitExpression();
				}
				break;
			case PolicyParser.ENDORSE:
				{
				this.state = 178;
				this.endorseExpression();
				}
				break;
			case PolicyParser.ANYUSER:
			case PolicyParser.RESOURCE:
			case PolicyParser.DYNAMICGROUP:
			case PolicyParser.GROUP:
			case PolicyParser.SERVICE:
				{
				this.state = 179;
				this.subject();
				this.state = 190;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 21, this._ctx) ) {
				case 1:
					{
					this.state = 181;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					if (_la === PolicyParser.TO) {
						{
						this.state = 180;
						this.match(PolicyParser.TO);
						}
					}

					this.state = 183;
					this.verb();
					this.state = 184;
					this.resource();
					}
					break;

				case 2:
					{
					this.state = 187;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					if (_la === PolicyParser.TO) {
						{
						this.state = 186;
						this.match(PolicyParser.TO);
						}
					}

					this.state = 189;
					this.permissionList();
					}
					break;
				}
				this.state = 192;
				this.match(PolicyParser.IN);
				this.state = 193;
				this.scope();
				this.state = 196;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === PolicyParser.WHERE) {
					{
					this.state = 194;
					this.match(PolicyParser.WHERE);
					this.state = 195;
					this.condition();
					}
				}

				this.state = 199;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === PolicyParser.NEWLINE) {
					{
					this.state = 198;
					this.match(PolicyParser.NEWLINE);
					}
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
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public endorseVerb(): EndorseVerbContext {
		let _localctx: EndorseVerbContext = new EndorseVerbContext(this._ctx, this.state);
		this.enterRule(_localctx, 12, PolicyParser.RULE_endorseVerb);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 205;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case PolicyParser.READ:
			case PolicyParser.INSPECT:
			case PolicyParser.MANAGE:
			case PolicyParser.USE:
				{
				this.state = 203;
				this.verb();
				}
				break;
			case PolicyParser.ASSOCIATE:
				{
				this.state = 204;
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
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public verb(): VerbContext {
		let _localctx: VerbContext = new VerbContext(this._ctx, this.state);
		this.enterRule(_localctx, 14, PolicyParser.RULE_verb);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 207;
			_la = this._input.LA(1);
			if (!(((((_la - 36)) & ~0x1F) === 0 && ((1 << (_la - 36)) & ((1 << (PolicyParser.READ - 36)) | (1 << (PolicyParser.INSPECT - 36)) | (1 << (PolicyParser.MANAGE - 36)) | (1 << (PolicyParser.USE - 36)))) !== 0))) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public permissionList(): PermissionListContext {
		let _localctx: PermissionListContext = new PermissionListContext(this._ctx, this.state);
		this.enterRule(_localctx, 16, PolicyParser.RULE_permissionList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 209;
			this.match(PolicyParser.T__0);
			this.state = 210;
			this.match(PolicyParser.WORD);
			this.state = 215;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === PolicyParser.T__1) {
				{
				{
				this.state = 211;
				this.match(PolicyParser.T__1);
				this.state = 212;
				this.match(PolicyParser.WORD);
				}
				}
				this.state = 217;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 218;
			this.match(PolicyParser.T__2);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public scope(): ScopeContext {
		let _localctx: ScopeContext = new ScopeContext(this._ctx, this.state);
		this.enterRule(_localctx, 18, PolicyParser.RULE_scope);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 233;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case PolicyParser.COMPARTMENT:
				{
				{
				this.state = 220;
				this.match(PolicyParser.COMPARTMENT);
				this.state = 222;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === PolicyParser.ID) {
					{
					this.state = 221;
					this.match(PolicyParser.ID);
					}
				}

				}
				this.state = 224;
				_la = this._input.LA(1);
				if (!(_la === PolicyParser.HCL_VAR || _la === PolicyParser.WORD)) {
				this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
				this.state = 229;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === PolicyParser.T__3) {
					{
					{
					this.state = 225;
					this.match(PolicyParser.T__3);
					this.state = 226;
					_la = this._input.LA(1);
					if (!(_la === PolicyParser.HCL_VAR || _la === PolicyParser.WORD)) {
					this._errHandler.recoverInline(this);
					} else {
						if (this._input.LA(1) === Token.EOF) {
							this.matchedEOF = true;
						}

						this._errHandler.reportMatch(this);
						this.consume();
					}
					}
					}
					this.state = 231;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
				break;
			case PolicyParser.TENANCY:
				{
				this.state = 232;
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
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public endorseScope(): EndorseScopeContext {
		let _localctx: EndorseScopeContext = new EndorseScopeContext(this._ctx, this.state);
		this.enterRule(_localctx, 20, PolicyParser.RULE_endorseScope);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 238;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case PolicyParser.ANYTENANCY:
				{
				this.state = 235;
				this.match(PolicyParser.ANYTENANCY);
				}
				break;
			case PolicyParser.TENANCY:
				{
				this.state = 236;
				this.match(PolicyParser.TENANCY);
				this.state = 237;
				_la = this._input.LA(1);
				if (!(_la === PolicyParser.HCL_VAR || _la === PolicyParser.WORD)) {
				this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

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
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public subject(): SubjectContext {
		let _localctx: SubjectContext = new SubjectContext(this._ctx, this.state);
		this.enterRule(_localctx, 22, PolicyParser.RULE_subject);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 245;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case PolicyParser.GROUP:
				{
				this.state = 240;
				this.groupSubject();
				}
				break;
			case PolicyParser.SERVICE:
				{
				this.state = 241;
				this.serviceSubject();
				}
				break;
			case PolicyParser.DYNAMICGROUP:
				{
				this.state = 242;
				this.dynamicGroupSubject();
				}
				break;
			case PolicyParser.RESOURCE:
				{
				this.state = 243;
				this.resourceSubject();
				}
				break;
			case PolicyParser.ANYUSER:
				{
				this.state = 244;
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
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public groupSubject(): GroupSubjectContext {
		let _localctx: GroupSubjectContext = new GroupSubjectContext(this._ctx, this.state);
		this.enterRule(_localctx, 24, PolicyParser.RULE_groupSubject);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 247;
			this.match(PolicyParser.GROUP);
			this.state = 250;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case PolicyParser.QUOTED_STRING:
			case PolicyParser.HCL_VAR:
			case PolicyParser.WORD:
				{
				this.state = 248;
				this.groupName();
				}
				break;
			case PolicyParser.ID:
				{
				this.state = 249;
				this.groupID();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this.state = 259;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === PolicyParser.T__1) {
				{
				{
				this.state = 252;
				this.match(PolicyParser.T__1);
				this.state = 255;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case PolicyParser.QUOTED_STRING:
				case PolicyParser.HCL_VAR:
				case PolicyParser.WORD:
					{
					this.state = 253;
					this.groupName();
					}
					break;
				case PolicyParser.ID:
					{
					this.state = 254;
					this.groupID();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				}
				this.state = 261;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public resourceSubject(): ResourceSubjectContext {
		let _localctx: ResourceSubjectContext = new ResourceSubjectContext(this._ctx, this.state);
		this.enterRule(_localctx, 26, PolicyParser.RULE_resourceSubject);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 262;
			this.match(PolicyParser.RESOURCE);
			this.state = 263;
			this.resourceSubjectId();
			this.state = 267;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === PolicyParser.HCL_VAR || _la === PolicyParser.WORD) {
				{
				{
				this.state = 264;
				this.resourceSubjectId();
				}
				}
				this.state = 269;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public serviceSubject(): ServiceSubjectContext {
		let _localctx: ServiceSubjectContext = new ServiceSubjectContext(this._ctx, this.state);
		this.enterRule(_localctx, 28, PolicyParser.RULE_serviceSubject);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 270;
			this.match(PolicyParser.SERVICE);
			this.state = 271;
			this.serviceSubjectId();
			this.state = 276;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === PolicyParser.T__1) {
				{
				{
				this.state = 272;
				this.match(PolicyParser.T__1);
				this.state = 273;
				this.serviceSubjectId();
				}
				}
				this.state = 278;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public groupName(): GroupNameContext {
		let _localctx: GroupNameContext = new GroupNameContext(this._ctx, this.state);
		this.enterRule(_localctx, 30, PolicyParser.RULE_groupName);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 291;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 37, this._ctx) ) {
			case 1:
				{
				this.state = 279;
				this.match(PolicyParser.WORD);
				}
				break;

			case 2:
				{
				this.state = 280;
				this.match(PolicyParser.QUOTED_STRING);
				this.state = 281;
				this.match(PolicyParser.T__4);
				this.state = 282;
				this.match(PolicyParser.QUOTED_STRING);
				}
				break;

			case 3:
				{
				this.state = 283;
				this.match(PolicyParser.QUOTED_STRING);
				}
				break;

			case 4:
				{
				this.state = 284;
				this.match(PolicyParser.WORD);
				this.state = 285;
				this.match(PolicyParser.T__4);
				this.state = 286;
				this.match(PolicyParser.WORD);
				}
				break;

			case 5:
				{
				this.state = 287;
				this.match(PolicyParser.WORD);
				this.state = 288;
				this.match(PolicyParser.T__4);
				this.state = 289;
				this.match(PolicyParser.QUOTED_STRING);
				}
				break;

			case 6:
				{
				this.state = 290;
				this.match(PolicyParser.HCL_VAR);
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public resourceSubjectId(): ResourceSubjectIdContext {
		let _localctx: ResourceSubjectIdContext = new ResourceSubjectIdContext(this._ctx, this.state);
		this.enterRule(_localctx, 32, PolicyParser.RULE_resourceSubjectId);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 293;
			_la = this._input.LA(1);
			if (!(_la === PolicyParser.HCL_VAR || _la === PolicyParser.WORD)) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			this.state = 302;
			this._errHandler.sync(this);
			_alt = 1 + 1;
			do {
				switch (_alt) {
				case 1 + 1:
					{
					this.state = 302;
					this._errHandler.sync(this);
					switch ( this.interpreter.adaptivePredict(this._input, 38, this._ctx) ) {
					case 1:
						{
						this.state = 294;
						this.match(PolicyParser.T__5);
						this.state = 295;
						_la = this._input.LA(1);
						if (!(_la === PolicyParser.HCL_VAR || _la === PolicyParser.WORD)) {
						this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
						this.state = 296;
						this.match(PolicyParser.T__5);
						}
						break;

					case 2:
						{
						this.state = 297;
						this.match(PolicyParser.T__5);
						this.state = 298;
						_la = this._input.LA(1);
						if (!(_la === PolicyParser.HCL_VAR || _la === PolicyParser.WORD)) {
						this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
						this.state = 299;
						this.match(PolicyParser.T__4);
						this.state = 300;
						_la = this._input.LA(1);
						if (!(_la === PolicyParser.HCL_VAR || _la === PolicyParser.WORD)) {
						this._errHandler.recoverInline(this);
						} else {
							if (this._input.LA(1) === Token.EOF) {
								this.matchedEOF = true;
							}

							this._errHandler.reportMatch(this);
							this.consume();
						}
						this.state = 301;
						this.match(PolicyParser.T__5);
						}
						break;
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 304;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 39, this._ctx);
			} while (_alt !== 1 && _alt !== ATN.INVALID_ALT_NUMBER);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public serviceSubjectId(): ServiceSubjectIdContext {
		let _localctx: ServiceSubjectIdContext = new ServiceSubjectIdContext(this._ctx, this.state);
		this.enterRule(_localctx, 34, PolicyParser.RULE_serviceSubjectId);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 306;
			_la = this._input.LA(1);
			if (!(_la === PolicyParser.HCL_VAR || _la === PolicyParser.WORD)) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public groupID(): GroupIDContext {
		let _localctx: GroupIDContext = new GroupIDContext(this._ctx, this.state);
		this.enterRule(_localctx, 36, PolicyParser.RULE_groupID);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 308;
			this.match(PolicyParser.ID);
			this.state = 309;
			_la = this._input.LA(1);
			if (!(_la === PolicyParser.HCL_VAR || _la === PolicyParser.WORD)) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public dynamicGroupSubject(): DynamicGroupSubjectContext {
		let _localctx: DynamicGroupSubjectContext = new DynamicGroupSubjectContext(this._ctx, this.state);
		this.enterRule(_localctx, 38, PolicyParser.RULE_dynamicGroupSubject);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 311;
			this.match(PolicyParser.DYNAMICGROUP);
			this.state = 314;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case PolicyParser.QUOTED_STRING:
			case PolicyParser.HCL_VAR:
			case PolicyParser.WORD:
				{
				this.state = 312;
				this.groupName();
				}
				break;
			case PolicyParser.ID:
				{
				this.state = 313;
				this.groupID();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this.state = 323;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === PolicyParser.T__1) {
				{
				{
				this.state = 316;
				this.match(PolicyParser.T__1);
				this.state = 319;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case PolicyParser.QUOTED_STRING:
				case PolicyParser.HCL_VAR:
				case PolicyParser.WORD:
					{
					this.state = 317;
					this.groupName();
					}
					break;
				case PolicyParser.ID:
					{
					this.state = 318;
					this.groupID();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				}
				this.state = 325;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public tenancySubject(): TenancySubjectContext {
		let _localctx: TenancySubjectContext = new TenancySubjectContext(this._ctx, this.state);
		this.enterRule(_localctx, 40, PolicyParser.RULE_tenancySubject);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 326;
			this.match(PolicyParser.TENANCY);
			this.state = 327;
			_la = this._input.LA(1);
			if (!(_la === PolicyParser.HCL_VAR || _la === PolicyParser.WORD)) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public definedSubject(): DefinedSubjectContext {
		let _localctx: DefinedSubjectContext = new DefinedSubjectContext(this._ctx, this.state);
		this.enterRule(_localctx, 42, PolicyParser.RULE_definedSubject);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 333;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case PolicyParser.GROUP:
				{
				this.state = 329;
				this.groupSubject();
				}
				break;
			case PolicyParser.DYNAMICGROUP:
				{
				this.state = 330;
				this.dynamicGroupSubject();
				}
				break;
			case PolicyParser.SERVICE:
				{
				this.state = 331;
				this.serviceSubject();
				}
				break;
			case PolicyParser.TENANCY:
				{
				this.state = 332;
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
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public defined(): DefinedContext {
		let _localctx: DefinedContext = new DefinedContext(this._ctx, this.state);
		this.enterRule(_localctx, 44, PolicyParser.RULE_defined);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 335;
			_la = this._input.LA(1);
			if (!(_la === PolicyParser.HCL_VAR || _la === PolicyParser.WORD)) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public resource(): ResourceContext {
		let _localctx: ResourceContext = new ResourceContext(this._ctx, this.state);
		this.enterRule(_localctx, 46, PolicyParser.RULE_resource);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 337;
			_la = this._input.LA(1);
			if (!(_la === PolicyParser.HCL_VAR || _la === PolicyParser.WORD)) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public condition(): ConditionContext {
		let _localctx: ConditionContext = new ConditionContext(this._ctx, this.state);
		this.enterRule(_localctx, 48, PolicyParser.RULE_condition);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 343;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 44, this._ctx) ) {
			case 1:
				{
				this.state = 339;
				this.comparisonList();
				}
				break;

			case 2:
				{
				this.state = 340;
				this.comparison();
				}
				break;

			case 3:
				{
				this.state = 341;
				this.functionCall();
				}
				break;

			case 4:
				{
				this.state = 342;
				this.match(PolicyParser.HCL_VAR);
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public functionCall(): FunctionCallContext {
		let _localctx: FunctionCallContext = new FunctionCallContext(this._ctx, this.state);
		this.enterRule(_localctx, 50, PolicyParser.RULE_functionCall);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 345;
			this.match(PolicyParser.WORD);
			this.state = 346;
			this.match(PolicyParser.T__6);
			this.state = 348;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << PolicyParser.T__5) | (1 << PolicyParser.T__6) | (1 << PolicyParser.QUOTED_STRING))) !== 0) || _la === PolicyParser.HCL_VAR || _la === PolicyParser.WORD) {
				{
				this.state = 347;
				this.argumentList();
				}
			}

			this.state = 350;
			this.match(PolicyParser.T__7);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public argumentList(): ArgumentListContext {
		let _localctx: ArgumentListContext = new ArgumentListContext(this._ctx, this.state);
		this.enterRule(_localctx, 52, PolicyParser.RULE_argumentList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 352;
			this.argument();
			this.state = 357;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === PolicyParser.T__1) {
				{
				{
				this.state = 353;
				this.match(PolicyParser.T__1);
				this.state = 354;
				this.argument();
				}
				}
				this.state = 359;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public argument(): ArgumentContext {
		let _localctx: ArgumentContext = new ArgumentContext(this._ctx, this.state);
		this.enterRule(_localctx, 54, PolicyParser.RULE_argument);
		try {
			this.state = 364;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 47, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 360;
				this.variable();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 361;
				this.value();
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 362;
				this.valueList();
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 363;
				this.functionCall();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public comparison(): ComparisonContext {
		let _localctx: ComparisonContext = new ComparisonContext(this._ctx, this.state);
		this.enterRule(_localctx, 56, PolicyParser.RULE_comparison);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 366;
			this.variable();
			this.state = 367;
			this.operator();
			this.state = 372;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 48, this._ctx) ) {
			case 1:
				{
				this.state = 368;
				this.value();
				}
				break;

			case 2:
				{
				this.state = 369;
				this.valueList();
				}
				break;

			case 3:
				{
				this.state = 370;
				this.timeWindow();
				}
				break;

			case 4:
				{
				this.state = 371;
				this.patternMatch();
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public variable(): VariableContext {
		let _localctx: VariableContext = new VariableContext(this._ctx, this.state);
		this.enterRule(_localctx, 58, PolicyParser.RULE_variable);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 374;
			_la = this._input.LA(1);
			if (!(_la === PolicyParser.HCL_VAR || _la === PolicyParser.WORD)) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			this.state = 381;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === PolicyParser.T__8) {
				{
				this.state = 377;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 375;
					this.match(PolicyParser.T__8);
					this.state = 376;
					_la = this._input.LA(1);
					if (!(_la === PolicyParser.HCL_VAR || _la === PolicyParser.WORD)) {
					this._errHandler.recoverInline(this);
					} else {
						if (this._input.LA(1) === Token.EOF) {
							this.matchedEOF = true;
						}

						this._errHandler.reportMatch(this);
						this.consume();
					}
					}
					}
					this.state = 379;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (_la === PolicyParser.T__8);
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public operator(): OperatorContext {
		let _localctx: OperatorContext = new OperatorContext(this._ctx, this.state);
		this.enterRule(_localctx, 60, PolicyParser.RULE_operator);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 389;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case PolicyParser.T__9:
				{
				this.state = 383;
				this.match(PolicyParser.T__9);
				}
				break;
			case PolicyParser.T__10:
				{
				this.state = 384;
				this.match(PolicyParser.T__10);
				this.state = 385;
				this.match(PolicyParser.T__9);
				}
				break;
			case PolicyParser.BEFORE:
				{
				this.state = 386;
				this.match(PolicyParser.BEFORE);
				}
				break;
			case PolicyParser.IN:
				{
				this.state = 387;
				this.match(PolicyParser.IN);
				}
				break;
			case PolicyParser.BETWEEN:
				{
				this.state = 388;
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
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public value(): ValueContext {
		let _localctx: ValueContext = new ValueContext(this._ctx, this.state);
		this.enterRule(_localctx, 62, PolicyParser.RULE_value);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 407;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 53, this._ctx) ) {
			case 1:
				{
				this.state = 391;
				this.match(PolicyParser.WORD);
				}
				break;

			case 2:
				{
				this.state = 392;
				this.match(PolicyParser.QUOTED_STRING);
				}
				break;

			case 3:
				{
				this.state = 393;
				this.match(PolicyParser.QUOTED_STRING);
				this.state = 394;
				this.match(PolicyParser.T__4);
				this.state = 395;
				this.match(PolicyParser.WORD);
				}
				break;

			case 4:
				{
				this.state = 396;
				this.match(PolicyParser.QUOTED_STRING);
				this.state = 399;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 397;
					this.match(PolicyParser.WS);
					this.state = 398;
					this.match(PolicyParser.WORD);
					}
					}
					this.state = 401;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (_la === PolicyParser.WS);
				}
				break;

			case 5:
				{
				this.state = 403;
				this.match(PolicyParser.HCL_VAR);
				}
				break;

			case 6:
				{
				this.state = 404;
				this.match(PolicyParser.T__5);
				this.state = 405;
				this.match(PolicyParser.HCL_VAR);
				this.state = 406;
				this.match(PolicyParser.T__5);
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public valueList(): ValueListContext {
		let _localctx: ValueListContext = new ValueListContext(this._ctx, this.state);
		this.enterRule(_localctx, 64, PolicyParser.RULE_valueList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 409;
			this.match(PolicyParser.T__6);
			this.state = 415;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case PolicyParser.QUOTED_STRING:
				{
				this.state = 410;
				this.match(PolicyParser.QUOTED_STRING);
				}
				break;
			case PolicyParser.HCL_VAR:
				{
				this.state = 411;
				this.match(PolicyParser.HCL_VAR);
				}
				break;
			case PolicyParser.T__5:
				{
				this.state = 412;
				this.match(PolicyParser.T__5);
				this.state = 413;
				this.match(PolicyParser.HCL_VAR);
				this.state = 414;
				this.match(PolicyParser.T__5);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this.state = 427;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === PolicyParser.T__1) {
				{
				{
				this.state = 417;
				this.match(PolicyParser.T__1);
				this.state = 423;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case PolicyParser.QUOTED_STRING:
					{
					this.state = 418;
					this.match(PolicyParser.QUOTED_STRING);
					}
					break;
				case PolicyParser.HCL_VAR:
					{
					this.state = 419;
					this.match(PolicyParser.HCL_VAR);
					}
					break;
				case PolicyParser.T__5:
					{
					this.state = 420;
					this.match(PolicyParser.T__5);
					this.state = 421;
					this.match(PolicyParser.HCL_VAR);
					this.state = 422;
					this.match(PolicyParser.T__5);
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				}
				this.state = 429;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 430;
			this.match(PolicyParser.T__7);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public timeWindow(): TimeWindowContext {
		let _localctx: TimeWindowContext = new TimeWindowContext(this._ctx, this.state);
		this.enterRule(_localctx, 66, PolicyParser.RULE_timeWindow);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 437;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case PolicyParser.QUOTED_STRING:
				{
				this.state = 432;
				this.match(PolicyParser.QUOTED_STRING);
				}
				break;
			case PolicyParser.HCL_VAR:
				{
				this.state = 433;
				this.match(PolicyParser.HCL_VAR);
				}
				break;
			case PolicyParser.T__5:
				{
				this.state = 434;
				this.match(PolicyParser.T__5);
				this.state = 435;
				this.match(PolicyParser.HCL_VAR);
				this.state = 436;
				this.match(PolicyParser.T__5);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this.state = 439;
			this.match(PolicyParser.AND);
			this.state = 445;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case PolicyParser.QUOTED_STRING:
				{
				this.state = 440;
				this.match(PolicyParser.QUOTED_STRING);
				}
				break;
			case PolicyParser.HCL_VAR:
				{
				this.state = 441;
				this.match(PolicyParser.HCL_VAR);
				}
				break;
			case PolicyParser.T__5:
				{
				this.state = 442;
				this.match(PolicyParser.T__5);
				this.state = 443;
				this.match(PolicyParser.HCL_VAR);
				this.state = 444;
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
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public comparisonList(): ComparisonListContext {
		let _localctx: ComparisonListContext = new ComparisonListContext(this._ctx, this.state);
		this.enterRule(_localctx, 68, PolicyParser.RULE_comparisonList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 447;
			this.logicalCombine();
			this.state = 448;
			this.match(PolicyParser.T__0);
			this.state = 449;
			this.condition();
			this.state = 454;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === PolicyParser.T__1) {
				{
				{
				this.state = 450;
				this.match(PolicyParser.T__1);
				this.state = 451;
				this.condition();
				}
				}
				this.state = 456;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 457;
			this.match(PolicyParser.T__2);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public logicalCombine(): LogicalCombineContext {
		let _localctx: LogicalCombineContext = new LogicalCombineContext(this._ctx, this.state);
		this.enterRule(_localctx, 70, PolicyParser.RULE_logicalCombine);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 459;
			_la = this._input.LA(1);
			if (!(_la === PolicyParser.ANY || _la === PolicyParser.ALL)) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public patternMatch(): PatternMatchContext {
		let _localctx: PatternMatchContext = new PatternMatchContext(this._ctx, this.state);
		this.enterRule(_localctx, 72, PolicyParser.RULE_patternMatch);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 473;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 60, this._ctx) ) {
			case 1:
				{
				this.state = 461;
				this.match(PolicyParser.T__4);
				this.state = 462;
				this.match(PolicyParser.WORD);
				this.state = 463;
				this.match(PolicyParser.T__11);
				}
				break;

			case 2:
				{
				this.state = 464;
				this.match(PolicyParser.T__12);
				this.state = 465;
				this.match(PolicyParser.WORD);
				this.state = 466;
				this.match(PolicyParser.T__4);
				}
				break;

			case 3:
				{
				this.state = 467;
				this.match(PolicyParser.T__4);
				this.state = 468;
				this.match(PolicyParser.WORD);
				this.state = 469;
				this.match(PolicyParser.T__4);
				}
				break;

			case 4:
				{
				this.state = 470;
				this.match(PolicyParser.T__12);
				this.state = 471;
				this.match(PolicyParser.WORD);
				this.state = 472;
				this.match(PolicyParser.T__11);
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public static readonly _serializedATN: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x032\u01DE\x04\x02" +
		"\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04\x07" +
		"\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x04\r\t\r\x04" +
		"\x0E\t\x0E\x04\x0F\t\x0F\x04\x10\t\x10\x04\x11\t\x11\x04\x12\t\x12\x04" +
		"\x13\t\x13\x04\x14\t\x14\x04\x15\t\x15\x04\x16\t\x16\x04\x17\t\x17\x04" +
		"\x18\t\x18\x04\x19\t\x19\x04\x1A\t\x1A\x04\x1B\t\x1B\x04\x1C\t\x1C\x04" +
		"\x1D\t\x1D\x04\x1E\t\x1E\x04\x1F\t\x1F\x04 \t \x04!\t!\x04\"\t\"\x04#" +
		"\t#\x04$\t$\x04%\t%\x04&\t&\x03\x02\x03\x02\x03\x02\x03\x02\x03\x02\x06" +
		"\x02R\n\x02\r\x02\x0E\x02S\x03\x02\x03\x02\x03\x03\x03\x03\x03\x03\x05" +
		"\x03[\n\x03\x03\x03\x03\x03\x03\x03\x03\x03\x05\x03a\n\x03\x03\x03\x05" +
		"\x03d\n\x03\x03\x03\x03\x03\x03\x03\x03\x03\x05\x03j\n\x03\x03\x03\x05" +
		"\x03m\n\x03\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x05" +
		"\x04v\n\x04\x03\x04\x05\x04y\n\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03" +
		"\x04\x03\x04\x03\x04\x03\x04\x05\x04\x83\n\x04\x03\x04\x03\x04\x05\x04" +
		"\x87\n\x04\x03\x04\x05\x04\x8A\n\x04\x03\x05\x03\x05\x03\x05\x03\x05\x03" +
		"\x05\x05\x05\x91\n\x05\x03\x06\x03\x06\x03\x06\x03\x06\x05\x06\x97\n\x06" +
		"\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x05\x06\x9E\n\x06\x03\x06\x05" +
		"\x06\xA1\n\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06\x03\x06" +
		"\x05\x06\xAA\n\x06\x03\x06\x03\x06\x05\x06\xAE\n\x06\x03\x06\x05\x06\xB1" +
		"\n\x06\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x05\x07\xB8\n\x07\x03\x07" +
		"\x03\x07\x03\x07\x03\x07\x05\x07\xBE\n\x07\x03\x07\x05\x07\xC1\n\x07\x03" +
		"\x07\x03\x07\x03\x07\x03\x07\x05\x07\xC7\n\x07\x03\x07\x05\x07\xCA\n\x07" +
		"\x05\x07\xCC\n\x07\x03\b\x03\b\x05\b\xD0\n\b\x03\t\x03\t\x03\n\x03\n\x03" +
		"\n\x03\n\x07\n\xD8\n\n\f\n\x0E\n\xDB\v\n\x03\n\x03\n\x03\v\x03\v\x05\v" +
		"\xE1\n\v\x03\v\x03\v\x03\v\x07\v\xE6\n\v\f\v\x0E\v\xE9\v\v\x03\v\x05\v" +
		"\xEC\n\v\x03\f\x03\f\x03\f\x05\f\xF1\n\f\x03\r\x03\r\x03\r\x03\r\x03\r" +
		"\x05\r\xF8\n\r\x03\x0E\x03\x0E\x03\x0E\x05\x0E\xFD\n\x0E\x03\x0E\x03\x0E" +
		"\x03\x0E\x05\x0E\u0102\n\x0E\x07\x0E\u0104\n\x0E\f\x0E\x0E\x0E\u0107\v" +
		"\x0E\x03\x0F\x03\x0F\x03\x0F\x07\x0F\u010C\n\x0F\f\x0F\x0E\x0F\u010F\v" +
		"\x0F\x03\x10\x03\x10\x03\x10\x03\x10\x07\x10\u0115\n\x10\f\x10\x0E\x10" +
		"\u0118\v\x10\x03\x11\x03\x11\x03\x11\x03\x11\x03\x11\x03\x11\x03\x11\x03" +
		"\x11\x03\x11\x03\x11\x03\x11\x03\x11\x05\x11\u0126\n\x11\x03\x12\x03\x12" +
		"\x03\x12\x03\x12\x03\x12\x03\x12\x03\x12\x03\x12\x03\x12\x06\x12\u0131" +
		"\n\x12\r\x12\x0E\x12\u0132\x03\x13\x03\x13\x03\x14\x03\x14\x03\x14\x03" +
		"\x15\x03\x15\x03\x15\x05\x15\u013D\n\x15\x03\x15\x03\x15\x03\x15\x05\x15" +
		"\u0142\n\x15\x07\x15\u0144\n\x15\f\x15\x0E\x15\u0147\v\x15\x03\x16\x03" +
		"\x16\x03\x16\x03\x17\x03\x17\x03\x17\x03\x17\x05\x17\u0150\n\x17\x03\x18" +
		"\x03\x18\x03\x19\x03\x19\x03\x1A\x03\x1A\x03\x1A\x03\x1A\x05\x1A\u015A" +
		"\n\x1A\x03\x1B\x03\x1B\x03\x1B\x05\x1B\u015F\n\x1B\x03\x1B\x03\x1B\x03" +
		"\x1C\x03\x1C\x03\x1C\x07\x1C\u0166\n\x1C\f\x1C\x0E\x1C\u0169\v\x1C\x03" +
		"\x1D\x03\x1D\x03\x1D\x03\x1D\x05\x1D\u016F\n\x1D\x03\x1E\x03\x1E\x03\x1E" +
		"\x03\x1E\x03\x1E\x03\x1E\x05\x1E\u0177\n\x1E\x03\x1F\x03\x1F\x03\x1F\x06" +
		"\x1F\u017C\n\x1F\r\x1F\x0E\x1F\u017D\x05\x1F\u0180\n\x1F\x03 \x03 \x03" +
		" \x03 \x03 \x03 \x05 \u0188\n \x03!\x03!\x03!\x03!\x03!\x03!\x03!\x03" +
		"!\x06!\u0192\n!\r!\x0E!\u0193\x03!\x03!\x03!\x03!\x05!\u019A\n!\x03\"" +
		"\x03\"\x03\"\x03\"\x03\"\x03\"\x05\"\u01A2\n\"\x03\"\x03\"\x03\"\x03\"" +
		"\x03\"\x03\"\x05\"\u01AA\n\"\x07\"\u01AC\n\"\f\"\x0E\"\u01AF\v\"\x03\"" +
		"\x03\"\x03#\x03#\x03#\x03#\x03#\x05#\u01B8\n#\x03#\x03#\x03#\x03#\x03" +
		"#\x03#\x05#\u01C0\n#\x03$\x03$\x03$\x03$\x03$\x07$\u01C7\n$\f$\x0E$\u01CA" +
		"\v$\x03$\x03$\x03%\x03%\x03&\x03&\x03&\x03&\x03&\x03&\x03&\x03&\x03&\x03" +
		"&\x03&\x03&\x05&\u01DC\n&\x03&\x03\u0132\x02\x02\'\x02\x02\x04\x02\x06" +
		"\x02\b\x02\n\x02\f\x02\x0E\x02\x10\x02\x12\x02\x14\x02\x16\x02\x18\x02" +
		"\x1A\x02\x1C\x02\x1E\x02 \x02\"\x02$\x02&\x02(\x02*\x02,\x02.\x020\x02" +
		"2\x024\x026\x028\x02:\x02<\x02>\x02@\x02B\x02D\x02F\x02H\x02J\x02\x02" +
		"\x05\x04\x02&(++\x03\x0212\x04\x02,,..\x02\u0215\x02Q\x03\x02\x02\x02" +
		"\x04W\x03\x02\x02\x02\x06n\x03\x02\x02\x02\b\x8B\x03\x02\x02\x02\n\x92" +
		"\x03\x02\x02\x02\f\xB2\x03\x02\x02\x02\x0E\xCF\x03\x02\x02\x02\x10\xD1" +
		"\x03\x02\x02\x02\x12\xD3\x03\x02\x02\x02\x14\xEB\x03\x02\x02\x02\x16\xF0" +
		"\x03\x02\x02\x02\x18\xF7\x03\x02\x02\x02\x1A\xF9\x03\x02\x02\x02\x1C\u0108" +
		"\x03\x02\x02\x02\x1E\u0110\x03\x02\x02\x02 \u0125\x03\x02\x02\x02\"\u0127" +
		"\x03\x02\x02\x02$\u0134\x03\x02\x02\x02&\u0136\x03\x02\x02\x02(\u0139" +
		"\x03\x02\x02\x02*\u0148\x03\x02\x02\x02,\u014F\x03\x02\x02\x02.\u0151" +
		"\x03\x02\x02\x020\u0153\x03\x02\x02\x022\u0159\x03\x02\x02\x024\u015B" +
		"\x03\x02\x02\x026\u0162\x03\x02\x02\x028\u016E\x03\x02\x02\x02:\u0170" +
		"\x03\x02\x02\x02<\u0178\x03\x02\x02\x02>\u0187\x03\x02\x02\x02@\u0199" +
		"\x03\x02\x02\x02B\u019B\x03\x02\x02\x02D\u01B7\x03\x02\x02\x02F\u01C1" +
		"\x03\x02\x02\x02H\u01CD\x03\x02\x02\x02J\u01DB\x03\x02\x02\x02LR\x05\x04" +
		"\x03\x02MR\x05\f\x07\x02NR\x05\x06\x04\x02OR\x05\b\x05\x02PR\x05\n\x06" +
		"\x02QL\x03\x02\x02\x02QM\x03\x02\x02\x02QN\x03\x02\x02\x02QO\x03\x02\x02" +
		"\x02QP\x03\x02\x02\x02RS\x03\x02\x02\x02SQ\x03\x02\x02\x02ST\x03\x02\x02" +
		"\x02TU\x03\x02\x02\x02UV\x07\x02\x02\x03V\x03\x03\x02\x02\x02WX\x07\x18" +
		"\x02\x02Xc\x05\x18\r\x02Y[\x07\x1C\x02\x02ZY\x03\x02\x02\x02Z[\x03\x02" +
		"\x02\x02[\\\x03\x02\x02\x02\\]\x05\x10\t\x02]^\x050\x19\x02^d\x03\x02" +
		"\x02\x02_a\x07\x1C\x02\x02`_\x03\x02\x02\x02`a\x03\x02\x02\x02ab\x03\x02" +
		"\x02\x02bd\x05\x12\n\x02cZ\x03\x02\x02\x02c`\x03\x02\x02\x02de\x03\x02" +
		"\x02\x02ef\x07\x1E\x02\x02fi\x05\x14\v\x02gh\x07\x1F\x02\x02hj\x052\x1A" +
		"\x02ig\x03\x02\x02\x02ij\x03\x02\x02\x02jl\x03\x02\x02\x02km\x07\x12\x02" +
		"\x02lk\x03\x02\x02\x02lm\x03\x02\x02\x02m\x05\x03\x02\x02\x02no\x07\x17" +
		"\x02\x02ox\x05\x18\r\x02pq\x07\x1C\x02\x02qr\x05\x0E\b\x02rs\x050\x19" +
		"\x02sy\x03\x02\x02\x02tv\x07\x1C\x02\x02ut\x03\x02\x02\x02uv\x03\x02\x02" +
		"\x02vw\x03\x02\x02\x02wy\x05\x12\n\x02xp\x03\x02\x02\x02xu\x03\x02\x02" +
		"\x02yz\x03\x02\x02\x02z\x82\x07\x1E\x02\x02{\x83\x05\x16\f\x02|}\x05\x14" +
		"\v\x02}~\x07 \x02\x02~\x7F\x050\x19\x02\x7F\x80\x07\x1E\x02\x02\x80\x81" +
		"\x05\x16\f\x02\x81\x83\x03\x02\x02\x02\x82{\x03\x02\x02\x02\x82|\x03\x02" +
		"\x02\x02\x83\x86\x03\x02\x02\x02\x84\x85\x07\x1F\x02\x02\x85\x87\x052" +
		"\x1A\x02\x86\x84\x03\x02\x02\x02\x86\x87\x03\x02\x02\x02\x87\x89\x03\x02" +
		"\x02\x02\x88\x8A\x07\x12\x02\x02\x89\x88\x03\x02\x02\x02\x89\x8A\x03\x02" +
		"\x02\x02\x8A\x07\x03\x02\x02\x02\x8B\x8C\x07\x1A\x02\x02\x8C\x8D\x05," +
		"\x17\x02\x8D\x8E\x07/\x02\x02\x8E\x90\x05.\x18\x02\x8F\x91\x07\x12\x02" +
		"\x02\x90\x8F\x03\x02\x02\x02\x90\x91\x03\x02\x02\x02\x91\t\x03\x02\x02" +
		"\x02\x92\x93\x07*\x02\x02\x93\x96\x05\x18\r\x02\x94\x95\x07\x1D\x02\x02" +
		"\x95\x97\x05\x16\f\x02\x96\x94\x03\x02\x02\x02\x96\x97\x03\x02\x02\x02" +
		"\x97\xA0\x03\x02\x02\x02\x98\x99\x07\x1C\x02\x02\x99\x9A\x05\x0E\b\x02" +
		"\x9A\x9B\x050\x19\x02\x9B\xA1\x03\x02\x02\x02\x9C\x9E\x07\x1C\x02\x02" +
		"\x9D\x9C\x03\x02\x02\x02\x9D\x9E\x03\x02\x02\x02\x9E\x9F\x03\x02\x02\x02" +
		"\x9F\xA1\x05\x12\n\x02\xA0\x98\x03\x02\x02\x02\xA0\x9D\x03\x02\x02\x02" +
		"\xA1\xA2\x03\x02\x02\x02\xA2\xA3\x07\x1E\x02\x02\xA3\xA9\x05\x14\v\x02" +
		"\xA4\xA5\x07 \x02\x02\xA5\xA6\x050\x19\x02\xA6\xA7\x07\x1E\x02\x02\xA7" +
		"\xA8\x05\x16\f\x02\xA8\xAA\x03\x02\x02\x02\xA9\xA4\x03\x02\x02\x02\xA9" +
		"\xAA\x03\x02\x02\x02\xAA\xAD\x03\x02\x02\x02\xAB\xAC\x07\x1F\x02\x02\xAC" +
		"\xAE\x052\x1A\x02\xAD\xAB\x03\x02\x02\x02\xAD\xAE\x03\x02\x02\x02\xAE" +
		"\xB0\x03\x02\x02\x02\xAF\xB1\x07\x12\x02\x02\xB0\xAF\x03\x02\x02\x02\xB0" +
		"\xB1\x03\x02\x02\x02\xB1\v\x03\x02\x02\x02\xB2\xCB\x07\x19\x02\x02\xB3" +
		"\xCC\x05\n\x06\x02\xB4\xCC\x05\x06\x04\x02\xB5\xC0\x05\x18\r\x02\xB6\xB8" +
		"\x07\x1C\x02\x02\xB7\xB6\x03\x02\x02\x02\xB7\xB8\x03\x02\x02\x02\xB8\xB9" +
		"\x03\x02\x02\x02\xB9\xBA\x05\x10\t\x02\xBA\xBB\x050\x19\x02\xBB\xC1\x03" +
		"\x02\x02\x02\xBC\xBE\x07\x1C\x02\x02\xBD\xBC\x03\x02\x02\x02\xBD\xBE\x03" +
		"\x02\x02\x02\xBE\xBF\x03\x02\x02\x02\xBF\xC1\x05\x12\n\x02\xC0\xB7\x03" +
		"\x02\x02\x02\xC0\xBD\x03\x02\x02\x02\xC1\xC2\x03\x02\x02\x02\xC2\xC3\x07" +
		"\x1E\x02\x02\xC3\xC6\x05\x14\v\x02\xC4\xC5\x07\x1F\x02\x02\xC5\xC7\x05" +
		"2\x1A\x02\xC6\xC4\x03\x02\x02\x02\xC6\xC7\x03\x02\x02\x02\xC7\xC9\x03" +
		"\x02\x02\x02\xC8\xCA\x07\x12\x02\x02\xC9\xC8\x03\x02\x02\x02\xC9\xCA\x03" +
		"\x02\x02\x02\xCA\xCC\x03\x02\x02\x02\xCB\xB3\x03\x02\x02\x02\xCB\xB4\x03" +
		"\x02\x02\x02\xCB\xB5\x03\x02\x02\x02\xCC\r\x03\x02\x02\x02\xCD\xD0\x05" +
		"\x10\t\x02\xCE\xD0\x07)\x02\x02\xCF\xCD\x03\x02\x02\x02\xCF\xCE\x03\x02" +
		"\x02\x02\xD0\x0F\x03\x02\x02\x02\xD1\xD2\t\x02\x02\x02\xD2\x11\x03\x02" +
		"\x02\x02\xD3\xD4\x07\x03\x02\x02\xD4\xD9\x072\x02\x02\xD5\xD6\x07\x04" +
		"\x02\x02\xD6\xD8\x072\x02\x02\xD7\xD5\x03\x02\x02\x02\xD8\xDB\x03\x02" +
		"\x02\x02\xD9\xD7\x03\x02\x02\x02\xD9\xDA\x03\x02\x02\x02\xDA\xDC\x03\x02" +
		"\x02\x02\xDB\xD9\x03\x02\x02\x02\xDC\xDD\x07\x05\x02\x02\xDD\x13\x03\x02" +
		"\x02\x02\xDE\xE0\x07$\x02\x02\xDF\xE1\x070\x02\x02\xE0\xDF\x03\x02\x02" +
		"\x02\xE0\xE1\x03\x02\x02\x02\xE1\xE2\x03\x02\x02\x02\xE2\xE7\t\x03\x02" +
		"\x02\xE3\xE4\x07\x06\x02\x02\xE4\xE6\t\x03\x02\x02\xE5\xE3\x03\x02\x02" +
		"\x02\xE6\xE9\x03\x02\x02\x02\xE7\xE5\x03\x02\x02\x02\xE7\xE8\x03\x02\x02" +
		"\x02\xE8\xEC\x03\x02\x02\x02\xE9\xE7\x03\x02\x02\x02\xEA\xEC\x07%\x02" +
		"\x02\xEB\xDE\x03\x02\x02\x02\xEB\xEA\x03\x02\x02\x02\xEC\x15\x03\x02\x02" +
		"\x02\xED\xF1\x07\x16\x02\x02\xEE\xEF\x07%\x02\x02\xEF\xF1\t\x03\x02\x02" +
		"\xF0\xED\x03\x02\x02\x02\xF0\xEE\x03\x02\x02\x02\xF1\x17\x03\x02\x02\x02" +
		"\xF2\xF8\x05\x1A\x0E\x02\xF3\xF8\x05\x1E\x10\x02\xF4\xF8\x05(\x15\x02" +
		"\xF5\xF8\x05\x1C\x0F\x02\xF6\xF8\x07\x15\x02\x02\xF7\xF2\x03\x02\x02\x02" +
		"\xF7\xF3\x03\x02\x02\x02\xF7\xF4\x03\x02\x02\x02\xF7\xF5\x03\x02\x02\x02" +
		"\xF7\xF6\x03\x02\x02\x02\xF8\x19\x03\x02\x02\x02\xF9\xFC\x07\"\x02\x02" +
		"\xFA\xFD\x05 \x11\x02\xFB\xFD\x05&\x14\x02\xFC\xFA\x03\x02\x02\x02\xFC" +
		"\xFB\x03\x02\x02\x02\xFD\u0105\x03\x02\x02\x02\xFE\u0101\x07\x04\x02\x02" +
		"\xFF\u0102\x05 \x11\x02\u0100\u0102\x05&\x14\x02\u0101\xFF\x03\x02\x02" +
		"\x02\u0101\u0100\x03\x02\x02\x02\u0102\u0104\x03\x02\x02\x02\u0103\xFE" +
		"\x03\x02\x02\x02\u0104\u0107\x03\x02\x02\x02\u0105\u0103\x03\x02\x02\x02" +
		"\u0105\u0106\x03\x02\x02\x02\u0106\x1B\x03\x02\x02\x02\u0107\u0105\x03" +
		"\x02\x02\x02\u0108\u0109\x07\x1B\x02\x02\u0109\u010D\x05\"\x12\x02\u010A" +
		"\u010C\x05\"\x12\x02\u010B\u010A\x03\x02\x02\x02\u010C\u010F\x03\x02\x02" +
		"\x02\u010D\u010B\x03\x02\x02\x02\u010D\u010E\x03\x02\x02\x02\u010E\x1D" +
		"\x03\x02\x02\x02\u010F\u010D\x03\x02\x02\x02\u0110\u0111\x07#\x02\x02" +
		"\u0111\u0116\x05$\x13\x02\u0112\u0113\x07\x04\x02\x02\u0113\u0115\x05" +
		"$\x13\x02\u0114\u0112\x03\x02\x02\x02\u0115\u0118\x03\x02\x02\x02\u0116" +
		"\u0114\x03\x02\x02\x02\u0116\u0117\x03\x02\x02\x02\u0117\x1F\x03\x02\x02" +
		"\x02\u0118\u0116\x03\x02\x02\x02\u0119\u0126\x072\x02\x02\u011A\u011B" +
		"\x07\x13\x02\x02\u011B\u011C\x07\x07\x02\x02\u011C\u0126\x07\x13\x02\x02" +
		"\u011D\u0126\x07\x13\x02\x02\u011E\u011F\x072\x02\x02\u011F\u0120\x07" +
		"\x07\x02\x02\u0120\u0126\x072\x02\x02\u0121\u0122\x072\x02\x02\u0122\u0123" +
		"\x07\x07\x02\x02\u0123\u0126\x07\x13\x02\x02\u0124\u0126\x071\x02\x02" +
		"\u0125\u0119\x03\x02\x02\x02\u0125\u011A\x03\x02\x02\x02\u0125\u011D\x03" +
		"\x02\x02\x02\u0125\u011E\x03\x02\x02\x02\u0125\u0121\x03\x02\x02\x02\u0125" +
		"\u0124\x03\x02\x02\x02\u0126!\x03\x02\x02\x02\u0127\u0130\t\x03\x02\x02" +
		"\u0128\u0129\x07\b\x02\x02\u0129\u012A\t\x03\x02\x02\u012A\u0131\x07\b" +
		"\x02\x02\u012B\u012C\x07\b\x02\x02\u012C\u012D\t\x03\x02\x02\u012D\u012E" +
		"\x07\x07\x02\x02\u012E\u012F\t\x03\x02\x02\u012F\u0131\x07\b\x02\x02\u0130" +
		"\u0128\x03\x02\x02\x02\u0130\u012B\x03\x02\x02\x02\u0131\u0132\x03\x02" +
		"\x02\x02\u0132\u0133\x03\x02\x02\x02\u0132\u0130\x03\x02\x02\x02\u0133" +
		"#\x03\x02\x02\x02\u0134\u0135\t\x03\x02\x02\u0135%\x03\x02\x02\x02\u0136" +
		"\u0137\x070\x02\x02\u0137\u0138\t\x03\x02\x02\u0138\'\x03\x02\x02\x02" +
		"\u0139\u013C\x07!\x02\x02\u013A\u013D\x05 \x11\x02\u013B\u013D\x05&\x14" +
		"\x02\u013C\u013A\x03\x02\x02\x02\u013C\u013B\x03\x02\x02\x02\u013D\u0145" +
		"\x03\x02\x02\x02\u013E\u0141\x07\x04\x02\x02\u013F\u0142\x05 \x11\x02" +
		"\u0140\u0142\x05&\x14\x02\u0141\u013F\x03\x02\x02\x02\u0141\u0140\x03" +
		"\x02\x02\x02\u0142\u0144\x03\x02\x02\x02\u0143\u013E\x03\x02\x02\x02\u0144" +
		"\u0147\x03\x02\x02\x02\u0145\u0143\x03\x02\x02\x02\u0145\u0146\x03\x02" +
		"\x02\x02\u0146)\x03\x02\x02\x02\u0147\u0145\x03\x02\x02\x02\u0148\u0149" +
		"\x07%\x02\x02\u0149\u014A\t\x03\x02\x02\u014A+\x03\x02\x02\x02\u014B\u0150" +
		"\x05\x1A\x0E\x02\u014C\u0150\x05(\x15\x02\u014D\u0150\x05\x1E\x10\x02" +
		"\u014E\u0150\x05*\x16\x02\u014F\u014B\x03\x02\x02\x02\u014F\u014C\x03" +
		"\x02\x02\x02\u014F\u014D\x03\x02\x02\x02\u014F\u014E\x03\x02\x02\x02\u0150" +
		"-\x03\x02\x02\x02\u0151\u0152\t\x03\x02\x02\u0152/\x03\x02\x02\x02\u0153" +
		"\u0154\t\x03\x02\x02\u01541\x03\x02\x02\x02\u0155\u015A\x05F$\x02\u0156" +
		"\u015A\x05:\x1E\x02\u0157\u015A\x054\x1B\x02\u0158\u015A\x071\x02\x02" +
		"\u0159\u0155\x03\x02\x02\x02\u0159\u0156\x03\x02\x02\x02\u0159\u0157\x03" +
		"\x02\x02\x02\u0159\u0158\x03\x02\x02\x02\u015A3\x03\x02\x02\x02\u015B" +
		"\u015C\x072\x02\x02\u015C\u015E\x07\t\x02\x02\u015D\u015F\x056\x1C\x02" +
		"\u015E\u015D\x03\x02\x02\x02\u015E\u015F\x03\x02\x02\x02\u015F\u0160\x03" +
		"\x02\x02\x02\u0160\u0161\x07\n\x02\x02\u01615\x03\x02\x02\x02\u0162\u0167" +
		"\x058\x1D\x02\u0163\u0164\x07\x04\x02\x02\u0164\u0166\x058\x1D\x02\u0165" +
		"\u0163\x03\x02\x02\x02\u0166\u0169\x03\x02\x02\x02\u0167\u0165\x03\x02" +
		"\x02\x02\u0167\u0168\x03\x02\x02\x02\u01687\x03\x02\x02\x02\u0169\u0167" +
		"\x03\x02\x02\x02\u016A\u016F\x05<\x1F\x02\u016B\u016F\x05@!\x02\u016C" +
		"\u016F\x05B\"\x02\u016D\u016F\x054\x1B\x02\u016E\u016A\x03\x02\x02\x02" +
		"\u016E\u016B\x03\x02\x02\x02\u016E\u016C\x03\x02\x02\x02\u016E\u016D\x03" +
		"\x02\x02\x02\u016F9\x03\x02\x02\x02\u0170\u0171\x05<\x1F\x02\u0171\u0176" +
		"\x05> \x02\u0172\u0177\x05@!\x02\u0173\u0177\x05B\"\x02\u0174\u0177\x05" +
		"D#\x02\u0175\u0177\x05J&\x02\u0176\u0172\x03\x02\x02\x02\u0176\u0173\x03" +
		"\x02\x02\x02\u0176\u0174\x03\x02\x02\x02\u0176\u0175\x03\x02\x02\x02\u0177" +
		";\x03\x02\x02\x02\u0178\u017F\t\x03\x02\x02\u0179\u017A\x07\v\x02\x02" +
		"\u017A\u017C\t\x03\x02\x02\u017B\u0179\x03\x02\x02\x02\u017C\u017D\x03" +
		"\x02\x02\x02\u017D\u017B\x03\x02\x02\x02\u017D\u017E\x03\x02\x02\x02\u017E" +
		"\u0180\x03\x02\x02\x02\u017F\u017B\x03\x02\x02\x02\u017F\u0180\x03\x02" +
		"\x02\x02\u0180=\x03\x02\x02\x02\u0181\u0188\x07\f\x02\x02\u0182\u0183" +
		"\x07\r\x02\x02\u0183\u0188\x07\f\x02\x02\u0184\u0188\x07\x10\x02\x02\u0185" +
		"\u0188\x07\x1E\x02\x02\u0186\u0188\x07\x11\x02\x02\u0187\u0181\x03\x02" +
		"\x02\x02\u0187\u0182\x03\x02\x02\x02\u0187\u0184\x03\x02\x02\x02\u0187" +
		"\u0185\x03\x02\x02\x02\u0187\u0186\x03\x02\x02\x02\u0188?\x03\x02\x02" +
		"\x02\u0189\u019A\x072\x02\x02\u018A\u019A\x07\x13\x02\x02\u018B\u018C" +
		"\x07\x13\x02\x02\u018C\u018D\x07\x07\x02\x02\u018D\u019A\x072\x02\x02" +
		"\u018E\u0191\x07\x13\x02\x02\u018F\u0190\x07\x14\x02\x02\u0190\u0192\x07" +
		"2\x02\x02\u0191\u018F\x03\x02\x02\x02\u0192\u0193\x03\x02\x02\x02\u0193" +
		"\u0191\x03\x02\x02\x02\u0193\u0194\x03\x02\x02\x02\u0194\u019A\x03\x02" +
		"\x02\x02\u0195\u019A\x071\x02\x02\u0196\u0197\x07\b\x02\x02\u0197\u0198" +
		"\x071\x02\x02\u0198\u019A\x07\b\x02\x02\u0199\u0189\x03\x02\x02\x02\u0199" +
		"\u018A\x03\x02\x02\x02\u0199\u018B\x03\x02\x02\x02\u0199\u018E\x03\x02" +
		"\x02\x02\u0199\u0195\x03\x02\x02\x02\u0199\u0196\x03\x02\x02\x02\u019A" +
		"A\x03\x02\x02\x02\u019B\u01A1\x07\t\x02\x02\u019C\u01A2\x07\x13\x02\x02" +
		"\u019D\u01A2\x071\x02\x02\u019E\u019F\x07\b\x02\x02\u019F\u01A0\x071\x02" +
		"\x02\u01A0\u01A2\x07\b\x02\x02\u01A1\u019C\x03\x02\x02\x02\u01A1\u019D" +
		"\x03\x02\x02\x02\u01A1\u019E\x03\x02\x02\x02\u01A2\u01AD\x03\x02\x02\x02" +
		"\u01A3\u01A9\x07\x04\x02\x02\u01A4\u01AA\x07\x13\x02\x02\u01A5\u01AA\x07" +
		"1\x02\x02\u01A6\u01A7\x07\b\x02\x02\u01A7\u01A8\x071\x02\x02\u01A8\u01AA" +
		"\x07\b\x02\x02\u01A9\u01A4\x03\x02\x02\x02\u01A9\u01A5\x03\x02\x02\x02" +
		"\u01A9\u01A6\x03\x02\x02\x02\u01AA\u01AC\x03\x02\x02\x02\u01AB\u01A3\x03" +
		"\x02\x02\x02\u01AC\u01AF\x03\x02\x02\x02\u01AD\u01AB\x03\x02\x02\x02\u01AD" +
		"\u01AE\x03\x02\x02\x02\u01AE\u01B0\x03\x02\x02\x02\u01AF\u01AD\x03\x02" +
		"\x02\x02\u01B0\u01B1\x07\n\x02\x02\u01B1C\x03\x02\x02\x02\u01B2\u01B8" +
		"\x07\x13\x02\x02\u01B3\u01B8\x071\x02\x02\u01B4\u01B5\x07\b\x02\x02\u01B5" +
		"\u01B6\x071\x02\x02\u01B6\u01B8\x07\b\x02\x02\u01B7\u01B2\x03\x02\x02" +
		"\x02\u01B7\u01B3\x03\x02\x02\x02\u01B7\u01B4\x03\x02\x02\x02\u01B8\u01B9" +
		"\x03\x02\x02\x02\u01B9\u01BF\x07-\x02\x02\u01BA\u01C0\x07\x13\x02\x02" +
		"\u01BB\u01C0\x071\x02\x02\u01BC\u01BD\x07\b\x02\x02\u01BD\u01BE\x071\x02" +
		"\x02\u01BE\u01C0\x07\b\x02\x02\u01BF\u01BA\x03\x02\x02\x02\u01BF\u01BB" +
		"\x03\x02\x02\x02\u01BF\u01BC\x03\x02\x02\x02\u01C0E\x03\x02\x02\x02\u01C1" +
		"\u01C2\x05H%\x02\u01C2\u01C3\x07\x03\x02\x02\u01C3\u01C8\x052\x1A\x02" +
		"\u01C4\u01C5\x07\x04\x02\x02\u01C5\u01C7\x052\x1A\x02\u01C6\u01C4\x03" +
		"\x02\x02\x02\u01C7\u01CA\x03\x02\x02\x02\u01C8\u01C6\x03\x02\x02\x02\u01C8" +
		"\u01C9\x03\x02\x02\x02\u01C9\u01CB\x03\x02\x02\x02\u01CA\u01C8\x03\x02" +
		"\x02\x02\u01CB\u01CC\x07\x05\x02\x02\u01CCG\x03\x02\x02\x02\u01CD\u01CE" +
		"\t\x04\x02\x02\u01CEI\x03\x02\x02\x02\u01CF\u01D0\x07\x07\x02\x02\u01D0" +
		"\u01D1\x072\x02\x02\u01D1\u01DC\x07\x0E\x02\x02\u01D2\u01D3\x07\x0F\x02" +
		"\x02\u01D3\u01D4\x072\x02\x02\u01D4\u01DC\x07\x07\x02\x02\u01D5\u01D6" +
		"\x07\x07\x02\x02\u01D6\u01D7\x072\x02\x02\u01D7\u01DC\x07\x07\x02\x02" +
		"\u01D8\u01D9\x07\x0F\x02\x02\u01D9\u01DA\x072\x02\x02\u01DA\u01DC\x07" +
		"\x0E\x02\x02\u01DB\u01CF\x03\x02\x02\x02\u01DB\u01D2\x03\x02\x02\x02\u01DB" +
		"\u01D5\x03\x02\x02\x02\u01DB\u01D8\x03\x02\x02\x02\u01DCK\x03\x02\x02" +
		"\x02?QSZ`cilux\x82\x86\x89\x90\x96\x9D\xA0\xA9\xAD\xB0\xB7\xBD\xC0\xC6" +
		"\xC9\xCB\xCF\xD9\xE0\xE7\xEB\xF0\xF7\xFC\u0101\u0105\u010D\u0116\u0125" +
		"\u0130\u0132\u013C\u0141\u0145\u014F\u0159\u015E\u0167\u016E\u0176\u017D" +
		"\u017F\u0187\u0193\u0199\u01A1\u01A9\u01AD\u01B7\u01BF\u01C8\u01DB";
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!PolicyParser.__ATN) {
			PolicyParser.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(PolicyParser._serializedATN));
		}

		return PolicyParser.__ATN;
	}

}

export class PolicyContext extends ParserRuleContext {
	public EOF(): TerminalNode { return this.getToken(PolicyParser.EOF, 0); }
	public allowExpression(): AllowExpressionContext[];
	public allowExpression(i: number): AllowExpressionContext;
	public allowExpression(i?: number): AllowExpressionContext | AllowExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(AllowExpressionContext);
		} else {
			return this.getRuleContext(i, AllowExpressionContext);
		}
	}
	public denyExpression(): DenyExpressionContext[];
	public denyExpression(i: number): DenyExpressionContext;
	public denyExpression(i?: number): DenyExpressionContext | DenyExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(DenyExpressionContext);
		} else {
			return this.getRuleContext(i, DenyExpressionContext);
		}
	}
	public endorseExpression(): EndorseExpressionContext[];
	public endorseExpression(i: number): EndorseExpressionContext;
	public endorseExpression(i?: number): EndorseExpressionContext | EndorseExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(EndorseExpressionContext);
		} else {
			return this.getRuleContext(i, EndorseExpressionContext);
		}
	}
	public defineExpression(): DefineExpressionContext[];
	public defineExpression(i: number): DefineExpressionContext;
	public defineExpression(i?: number): DefineExpressionContext | DefineExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(DefineExpressionContext);
		} else {
			return this.getRuleContext(i, DefineExpressionContext);
		}
	}
	public admitExpression(): AdmitExpressionContext[];
	public admitExpression(i: number): AdmitExpressionContext;
	public admitExpression(i?: number): AdmitExpressionContext | AdmitExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(AdmitExpressionContext);
		} else {
			return this.getRuleContext(i, AdmitExpressionContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PolicyParser.RULE_policy; }
	// @Override
	public enterRule(listener: PolicyListener): void {
		if (listener.enterPolicy) {
			listener.enterPolicy(this);
		}
	}
	// @Override
	public exitRule(listener: PolicyListener): void {
		if (listener.exitPolicy) {
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
	public ALLOW(): TerminalNode { return this.getToken(PolicyParser.ALLOW, 0); }
	public subject(): SubjectContext {
		return this.getRuleContext(0, SubjectContext);
	}
	public IN(): TerminalNode { return this.getToken(PolicyParser.IN, 0); }
	public scope(): ScopeContext {
		return this.getRuleContext(0, ScopeContext);
	}
	public verb(): VerbContext | undefined {
		return this.tryGetRuleContext(0, VerbContext);
	}
	public resource(): ResourceContext | undefined {
		return this.tryGetRuleContext(0, ResourceContext);
	}
	public permissionList(): PermissionListContext | undefined {
		return this.tryGetRuleContext(0, PermissionListContext);
	}
	public WHERE(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.WHERE, 0); }
	public condition(): ConditionContext | undefined {
		return this.tryGetRuleContext(0, ConditionContext);
	}
	public NEWLINE(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.NEWLINE, 0); }
	public TO(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.TO, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PolicyParser.RULE_allowExpression; }
	// @Override
	public enterRule(listener: PolicyListener): void {
		if (listener.enterAllowExpression) {
			listener.enterAllowExpression(this);
		}
	}
	// @Override
	public exitRule(listener: PolicyListener): void {
		if (listener.exitAllowExpression) {
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
	public ENDORSE(): TerminalNode { return this.getToken(PolicyParser.ENDORSE, 0); }
	public subject(): SubjectContext {
		return this.getRuleContext(0, SubjectContext);
	}
	public IN(): TerminalNode[];
	public IN(i: number): TerminalNode;
	public IN(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(PolicyParser.IN);
		} else {
			return this.getToken(PolicyParser.IN, i);
		}
	}
	public TO(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.TO, 0); }
	public endorseVerb(): EndorseVerbContext | undefined {
		return this.tryGetRuleContext(0, EndorseVerbContext);
	}
	public resource(): ResourceContext[];
	public resource(i: number): ResourceContext;
	public resource(i?: number): ResourceContext | ResourceContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ResourceContext);
		} else {
			return this.getRuleContext(i, ResourceContext);
		}
	}
	public permissionList(): PermissionListContext | undefined {
		return this.tryGetRuleContext(0, PermissionListContext);
	}
	public endorseScope(): EndorseScopeContext | undefined {
		return this.tryGetRuleContext(0, EndorseScopeContext);
	}
	public WHERE(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.WHERE, 0); }
	public condition(): ConditionContext | undefined {
		return this.tryGetRuleContext(0, ConditionContext);
	}
	public NEWLINE(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.NEWLINE, 0); }
	public scope(): ScopeContext | undefined {
		return this.tryGetRuleContext(0, ScopeContext);
	}
	public WITH(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.WITH, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PolicyParser.RULE_endorseExpression; }
	// @Override
	public enterRule(listener: PolicyListener): void {
		if (listener.enterEndorseExpression) {
			listener.enterEndorseExpression(this);
		}
	}
	// @Override
	public exitRule(listener: PolicyListener): void {
		if (listener.exitEndorseExpression) {
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
	public DEFINE(): TerminalNode { return this.getToken(PolicyParser.DEFINE, 0); }
	public definedSubject(): DefinedSubjectContext {
		return this.getRuleContext(0, DefinedSubjectContext);
	}
	public AS(): TerminalNode { return this.getToken(PolicyParser.AS, 0); }
	public defined(): DefinedContext {
		return this.getRuleContext(0, DefinedContext);
	}
	public NEWLINE(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.NEWLINE, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PolicyParser.RULE_defineExpression; }
	// @Override
	public enterRule(listener: PolicyListener): void {
		if (listener.enterDefineExpression) {
			listener.enterDefineExpression(this);
		}
	}
	// @Override
	public exitRule(listener: PolicyListener): void {
		if (listener.exitDefineExpression) {
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
	public ADMIT(): TerminalNode { return this.getToken(PolicyParser.ADMIT, 0); }
	public subject(): SubjectContext {
		return this.getRuleContext(0, SubjectContext);
	}
	public IN(): TerminalNode[];
	public IN(i: number): TerminalNode;
	public IN(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(PolicyParser.IN);
		} else {
			return this.getToken(PolicyParser.IN, i);
		}
	}
	public scope(): ScopeContext {
		return this.getRuleContext(0, ScopeContext);
	}
	public TO(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.TO, 0); }
	public endorseVerb(): EndorseVerbContext | undefined {
		return this.tryGetRuleContext(0, EndorseVerbContext);
	}
	public resource(): ResourceContext[];
	public resource(i: number): ResourceContext;
	public resource(i?: number): ResourceContext | ResourceContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ResourceContext);
		} else {
			return this.getRuleContext(i, ResourceContext);
		}
	}
	public permissionList(): PermissionListContext | undefined {
		return this.tryGetRuleContext(0, PermissionListContext);
	}
	public OF(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.OF, 0); }
	public endorseScope(): EndorseScopeContext[];
	public endorseScope(i: number): EndorseScopeContext;
	public endorseScope(i?: number): EndorseScopeContext | EndorseScopeContext[] {
		if (i === undefined) {
			return this.getRuleContexts(EndorseScopeContext);
		} else {
			return this.getRuleContext(i, EndorseScopeContext);
		}
	}
	public WITH(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.WITH, 0); }
	public WHERE(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.WHERE, 0); }
	public condition(): ConditionContext | undefined {
		return this.tryGetRuleContext(0, ConditionContext);
	}
	public NEWLINE(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.NEWLINE, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PolicyParser.RULE_admitExpression; }
	// @Override
	public enterRule(listener: PolicyListener): void {
		if (listener.enterAdmitExpression) {
			listener.enterAdmitExpression(this);
		}
	}
	// @Override
	public exitRule(listener: PolicyListener): void {
		if (listener.exitAdmitExpression) {
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


export class DenyExpressionContext extends ParserRuleContext {
	public DENY(): TerminalNode { return this.getToken(PolicyParser.DENY, 0); }
	public admitExpression(): AdmitExpressionContext | undefined {
		return this.tryGetRuleContext(0, AdmitExpressionContext);
	}
	public endorseExpression(): EndorseExpressionContext | undefined {
		return this.tryGetRuleContext(0, EndorseExpressionContext);
	}
	public subject(): SubjectContext | undefined {
		return this.tryGetRuleContext(0, SubjectContext);
	}
	public IN(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.IN, 0); }
	public scope(): ScopeContext | undefined {
		return this.tryGetRuleContext(0, ScopeContext);
	}
	public verb(): VerbContext | undefined {
		return this.tryGetRuleContext(0, VerbContext);
	}
	public resource(): ResourceContext | undefined {
		return this.tryGetRuleContext(0, ResourceContext);
	}
	public permissionList(): PermissionListContext | undefined {
		return this.tryGetRuleContext(0, PermissionListContext);
	}
	public WHERE(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.WHERE, 0); }
	public condition(): ConditionContext | undefined {
		return this.tryGetRuleContext(0, ConditionContext);
	}
	public NEWLINE(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.NEWLINE, 0); }
	public TO(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.TO, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PolicyParser.RULE_denyExpression; }
	// @Override
	public enterRule(listener: PolicyListener): void {
		if (listener.enterDenyExpression) {
			listener.enterDenyExpression(this);
		}
	}
	// @Override
	public exitRule(listener: PolicyListener): void {
		if (listener.exitDenyExpression) {
			listener.exitDenyExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PolicyVisitor<Result>): Result {
		if (visitor.visitDenyExpression) {
			return visitor.visitDenyExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EndorseVerbContext extends ParserRuleContext {
	public verb(): VerbContext | undefined {
		return this.tryGetRuleContext(0, VerbContext);
	}
	public ASSOCIATE(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.ASSOCIATE, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PolicyParser.RULE_endorseVerb; }
	// @Override
	public enterRule(listener: PolicyListener): void {
		if (listener.enterEndorseVerb) {
			listener.enterEndorseVerb(this);
		}
	}
	// @Override
	public exitRule(listener: PolicyListener): void {
		if (listener.exitEndorseVerb) {
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
	public INSPECT(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.INSPECT, 0); }
	public READ(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.READ, 0); }
	public USE(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.USE, 0); }
	public MANAGE(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.MANAGE, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PolicyParser.RULE_verb; }
	// @Override
	public enterRule(listener: PolicyListener): void {
		if (listener.enterVerb) {
			listener.enterVerb(this);
		}
	}
	// @Override
	public exitRule(listener: PolicyListener): void {
		if (listener.exitVerb) {
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
	public WORD(): TerminalNode[];
	public WORD(i: number): TerminalNode;
	public WORD(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(PolicyParser.WORD);
		} else {
			return this.getToken(PolicyParser.WORD, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PolicyParser.RULE_permissionList; }
	// @Override
	public enterRule(listener: PolicyListener): void {
		if (listener.enterPermissionList) {
			listener.enterPermissionList(this);
		}
	}
	// @Override
	public exitRule(listener: PolicyListener): void {
		if (listener.exitPermissionList) {
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
	public TENANCY(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.TENANCY, 0); }
	public WORD(): TerminalNode[];
	public WORD(i: number): TerminalNode;
	public WORD(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(PolicyParser.WORD);
		} else {
			return this.getToken(PolicyParser.WORD, i);
		}
	}
	public HCL_VAR(): TerminalNode[];
	public HCL_VAR(i: number): TerminalNode;
	public HCL_VAR(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(PolicyParser.HCL_VAR);
		} else {
			return this.getToken(PolicyParser.HCL_VAR, i);
		}
	}
	public COMPARTMENT(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.COMPARTMENT, 0); }
	public ID(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.ID, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PolicyParser.RULE_scope; }
	// @Override
	public enterRule(listener: PolicyListener): void {
		if (listener.enterScope) {
			listener.enterScope(this);
		}
	}
	// @Override
	public exitRule(listener: PolicyListener): void {
		if (listener.exitScope) {
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
	public ANYTENANCY(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.ANYTENANCY, 0); }
	public TENANCY(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.TENANCY, 0); }
	public WORD(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.WORD, 0); }
	public HCL_VAR(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.HCL_VAR, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PolicyParser.RULE_endorseScope; }
	// @Override
	public enterRule(listener: PolicyListener): void {
		if (listener.enterEndorseScope) {
			listener.enterEndorseScope(this);
		}
	}
	// @Override
	public exitRule(listener: PolicyListener): void {
		if (listener.exitEndorseScope) {
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
	public groupSubject(): GroupSubjectContext | undefined {
		return this.tryGetRuleContext(0, GroupSubjectContext);
	}
	public serviceSubject(): ServiceSubjectContext | undefined {
		return this.tryGetRuleContext(0, ServiceSubjectContext);
	}
	public dynamicGroupSubject(): DynamicGroupSubjectContext | undefined {
		return this.tryGetRuleContext(0, DynamicGroupSubjectContext);
	}
	public resourceSubject(): ResourceSubjectContext | undefined {
		return this.tryGetRuleContext(0, ResourceSubjectContext);
	}
	public ANYUSER(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.ANYUSER, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PolicyParser.RULE_subject; }
	// @Override
	public enterRule(listener: PolicyListener): void {
		if (listener.enterSubject) {
			listener.enterSubject(this);
		}
	}
	// @Override
	public exitRule(listener: PolicyListener): void {
		if (listener.exitSubject) {
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
	public GROUP(): TerminalNode { return this.getToken(PolicyParser.GROUP, 0); }
	public groupName(): GroupNameContext[];
	public groupName(i: number): GroupNameContext;
	public groupName(i?: number): GroupNameContext | GroupNameContext[] {
		if (i === undefined) {
			return this.getRuleContexts(GroupNameContext);
		} else {
			return this.getRuleContext(i, GroupNameContext);
		}
	}
	public groupID(): GroupIDContext[];
	public groupID(i: number): GroupIDContext;
	public groupID(i?: number): GroupIDContext | GroupIDContext[] {
		if (i === undefined) {
			return this.getRuleContexts(GroupIDContext);
		} else {
			return this.getRuleContext(i, GroupIDContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PolicyParser.RULE_groupSubject; }
	// @Override
	public enterRule(listener: PolicyListener): void {
		if (listener.enterGroupSubject) {
			listener.enterGroupSubject(this);
		}
	}
	// @Override
	public exitRule(listener: PolicyListener): void {
		if (listener.exitGroupSubject) {
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
	public RESOURCE(): TerminalNode { return this.getToken(PolicyParser.RESOURCE, 0); }
	public resourceSubjectId(): ResourceSubjectIdContext[];
	public resourceSubjectId(i: number): ResourceSubjectIdContext;
	public resourceSubjectId(i?: number): ResourceSubjectIdContext | ResourceSubjectIdContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ResourceSubjectIdContext);
		} else {
			return this.getRuleContext(i, ResourceSubjectIdContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PolicyParser.RULE_resourceSubject; }
	// @Override
	public enterRule(listener: PolicyListener): void {
		if (listener.enterResourceSubject) {
			listener.enterResourceSubject(this);
		}
	}
	// @Override
	public exitRule(listener: PolicyListener): void {
		if (listener.exitResourceSubject) {
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
	public SERVICE(): TerminalNode { return this.getToken(PolicyParser.SERVICE, 0); }
	public serviceSubjectId(): ServiceSubjectIdContext[];
	public serviceSubjectId(i: number): ServiceSubjectIdContext;
	public serviceSubjectId(i?: number): ServiceSubjectIdContext | ServiceSubjectIdContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ServiceSubjectIdContext);
		} else {
			return this.getRuleContext(i, ServiceSubjectIdContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PolicyParser.RULE_serviceSubject; }
	// @Override
	public enterRule(listener: PolicyListener): void {
		if (listener.enterServiceSubject) {
			listener.enterServiceSubject(this);
		}
	}
	// @Override
	public exitRule(listener: PolicyListener): void {
		if (listener.exitServiceSubject) {
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
	public WORD(): TerminalNode[];
	public WORD(i: number): TerminalNode;
	public WORD(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(PolicyParser.WORD);
		} else {
			return this.getToken(PolicyParser.WORD, i);
		}
	}
	public QUOTED_STRING(): TerminalNode[];
	public QUOTED_STRING(i: number): TerminalNode;
	public QUOTED_STRING(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(PolicyParser.QUOTED_STRING);
		} else {
			return this.getToken(PolicyParser.QUOTED_STRING, i);
		}
	}
	public HCL_VAR(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.HCL_VAR, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PolicyParser.RULE_groupName; }
	// @Override
	public enterRule(listener: PolicyListener): void {
		if (listener.enterGroupName) {
			listener.enterGroupName(this);
		}
	}
	// @Override
	public exitRule(listener: PolicyListener): void {
		if (listener.exitGroupName) {
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
	public WORD(): TerminalNode[];
	public WORD(i: number): TerminalNode;
	public WORD(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(PolicyParser.WORD);
		} else {
			return this.getToken(PolicyParser.WORD, i);
		}
	}
	public HCL_VAR(): TerminalNode[];
	public HCL_VAR(i: number): TerminalNode;
	public HCL_VAR(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(PolicyParser.HCL_VAR);
		} else {
			return this.getToken(PolicyParser.HCL_VAR, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PolicyParser.RULE_resourceSubjectId; }
	// @Override
	public enterRule(listener: PolicyListener): void {
		if (listener.enterResourceSubjectId) {
			listener.enterResourceSubjectId(this);
		}
	}
	// @Override
	public exitRule(listener: PolicyListener): void {
		if (listener.exitResourceSubjectId) {
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
	public WORD(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.WORD, 0); }
	public HCL_VAR(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.HCL_VAR, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PolicyParser.RULE_serviceSubjectId; }
	// @Override
	public enterRule(listener: PolicyListener): void {
		if (listener.enterServiceSubjectId) {
			listener.enterServiceSubjectId(this);
		}
	}
	// @Override
	public exitRule(listener: PolicyListener): void {
		if (listener.exitServiceSubjectId) {
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
	public ID(): TerminalNode { return this.getToken(PolicyParser.ID, 0); }
	public WORD(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.WORD, 0); }
	public HCL_VAR(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.HCL_VAR, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PolicyParser.RULE_groupID; }
	// @Override
	public enterRule(listener: PolicyListener): void {
		if (listener.enterGroupID) {
			listener.enterGroupID(this);
		}
	}
	// @Override
	public exitRule(listener: PolicyListener): void {
		if (listener.exitGroupID) {
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
	public DYNAMICGROUP(): TerminalNode { return this.getToken(PolicyParser.DYNAMICGROUP, 0); }
	public groupName(): GroupNameContext[];
	public groupName(i: number): GroupNameContext;
	public groupName(i?: number): GroupNameContext | GroupNameContext[] {
		if (i === undefined) {
			return this.getRuleContexts(GroupNameContext);
		} else {
			return this.getRuleContext(i, GroupNameContext);
		}
	}
	public groupID(): GroupIDContext[];
	public groupID(i: number): GroupIDContext;
	public groupID(i?: number): GroupIDContext | GroupIDContext[] {
		if (i === undefined) {
			return this.getRuleContexts(GroupIDContext);
		} else {
			return this.getRuleContext(i, GroupIDContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PolicyParser.RULE_dynamicGroupSubject; }
	// @Override
	public enterRule(listener: PolicyListener): void {
		if (listener.enterDynamicGroupSubject) {
			listener.enterDynamicGroupSubject(this);
		}
	}
	// @Override
	public exitRule(listener: PolicyListener): void {
		if (listener.exitDynamicGroupSubject) {
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
	public TENANCY(): TerminalNode { return this.getToken(PolicyParser.TENANCY, 0); }
	public WORD(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.WORD, 0); }
	public HCL_VAR(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.HCL_VAR, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PolicyParser.RULE_tenancySubject; }
	// @Override
	public enterRule(listener: PolicyListener): void {
		if (listener.enterTenancySubject) {
			listener.enterTenancySubject(this);
		}
	}
	// @Override
	public exitRule(listener: PolicyListener): void {
		if (listener.exitTenancySubject) {
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
	public groupSubject(): GroupSubjectContext | undefined {
		return this.tryGetRuleContext(0, GroupSubjectContext);
	}
	public dynamicGroupSubject(): DynamicGroupSubjectContext | undefined {
		return this.tryGetRuleContext(0, DynamicGroupSubjectContext);
	}
	public serviceSubject(): ServiceSubjectContext | undefined {
		return this.tryGetRuleContext(0, ServiceSubjectContext);
	}
	public tenancySubject(): TenancySubjectContext | undefined {
		return this.tryGetRuleContext(0, TenancySubjectContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PolicyParser.RULE_definedSubject; }
	// @Override
	public enterRule(listener: PolicyListener): void {
		if (listener.enterDefinedSubject) {
			listener.enterDefinedSubject(this);
		}
	}
	// @Override
	public exitRule(listener: PolicyListener): void {
		if (listener.exitDefinedSubject) {
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
	public WORD(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.WORD, 0); }
	public HCL_VAR(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.HCL_VAR, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PolicyParser.RULE_defined; }
	// @Override
	public enterRule(listener: PolicyListener): void {
		if (listener.enterDefined) {
			listener.enterDefined(this);
		}
	}
	// @Override
	public exitRule(listener: PolicyListener): void {
		if (listener.exitDefined) {
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
	public WORD(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.WORD, 0); }
	public HCL_VAR(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.HCL_VAR, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PolicyParser.RULE_resource; }
	// @Override
	public enterRule(listener: PolicyListener): void {
		if (listener.enterResource) {
			listener.enterResource(this);
		}
	}
	// @Override
	public exitRule(listener: PolicyListener): void {
		if (listener.exitResource) {
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
	public comparisonList(): ComparisonListContext | undefined {
		return this.tryGetRuleContext(0, ComparisonListContext);
	}
	public comparison(): ComparisonContext | undefined {
		return this.tryGetRuleContext(0, ComparisonContext);
	}
	public functionCall(): FunctionCallContext | undefined {
		return this.tryGetRuleContext(0, FunctionCallContext);
	}
	public HCL_VAR(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.HCL_VAR, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PolicyParser.RULE_condition; }
	// @Override
	public enterRule(listener: PolicyListener): void {
		if (listener.enterCondition) {
			listener.enterCondition(this);
		}
	}
	// @Override
	public exitRule(listener: PolicyListener): void {
		if (listener.exitCondition) {
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


export class FunctionCallContext extends ParserRuleContext {
	public WORD(): TerminalNode { return this.getToken(PolicyParser.WORD, 0); }
	public argumentList(): ArgumentListContext | undefined {
		return this.tryGetRuleContext(0, ArgumentListContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PolicyParser.RULE_functionCall; }
	// @Override
	public enterRule(listener: PolicyListener): void {
		if (listener.enterFunctionCall) {
			listener.enterFunctionCall(this);
		}
	}
	// @Override
	public exitRule(listener: PolicyListener): void {
		if (listener.exitFunctionCall) {
			listener.exitFunctionCall(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PolicyVisitor<Result>): Result {
		if (visitor.visitFunctionCall) {
			return visitor.visitFunctionCall(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ArgumentListContext extends ParserRuleContext {
	public argument(): ArgumentContext[];
	public argument(i: number): ArgumentContext;
	public argument(i?: number): ArgumentContext | ArgumentContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ArgumentContext);
		} else {
			return this.getRuleContext(i, ArgumentContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PolicyParser.RULE_argumentList; }
	// @Override
	public enterRule(listener: PolicyListener): void {
		if (listener.enterArgumentList) {
			listener.enterArgumentList(this);
		}
	}
	// @Override
	public exitRule(listener: PolicyListener): void {
		if (listener.exitArgumentList) {
			listener.exitArgumentList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PolicyVisitor<Result>): Result {
		if (visitor.visitArgumentList) {
			return visitor.visitArgumentList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ArgumentContext extends ParserRuleContext {
	public variable(): VariableContext | undefined {
		return this.tryGetRuleContext(0, VariableContext);
	}
	public value(): ValueContext | undefined {
		return this.tryGetRuleContext(0, ValueContext);
	}
	public valueList(): ValueListContext | undefined {
		return this.tryGetRuleContext(0, ValueListContext);
	}
	public functionCall(): FunctionCallContext | undefined {
		return this.tryGetRuleContext(0, FunctionCallContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PolicyParser.RULE_argument; }
	// @Override
	public enterRule(listener: PolicyListener): void {
		if (listener.enterArgument) {
			listener.enterArgument(this);
		}
	}
	// @Override
	public exitRule(listener: PolicyListener): void {
		if (listener.exitArgument) {
			listener.exitArgument(this);
		}
	}
	// @Override
	public accept<Result>(visitor: PolicyVisitor<Result>): Result {
		if (visitor.visitArgument) {
			return visitor.visitArgument(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ComparisonContext extends ParserRuleContext {
	public variable(): VariableContext {
		return this.getRuleContext(0, VariableContext);
	}
	public operator(): OperatorContext {
		return this.getRuleContext(0, OperatorContext);
	}
	public value(): ValueContext | undefined {
		return this.tryGetRuleContext(0, ValueContext);
	}
	public valueList(): ValueListContext | undefined {
		return this.tryGetRuleContext(0, ValueListContext);
	}
	public timeWindow(): TimeWindowContext | undefined {
		return this.tryGetRuleContext(0, TimeWindowContext);
	}
	public patternMatch(): PatternMatchContext | undefined {
		return this.tryGetRuleContext(0, PatternMatchContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PolicyParser.RULE_comparison; }
	// @Override
	public enterRule(listener: PolicyListener): void {
		if (listener.enterComparison) {
			listener.enterComparison(this);
		}
	}
	// @Override
	public exitRule(listener: PolicyListener): void {
		if (listener.exitComparison) {
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
	public WORD(): TerminalNode[];
	public WORD(i: number): TerminalNode;
	public WORD(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(PolicyParser.WORD);
		} else {
			return this.getToken(PolicyParser.WORD, i);
		}
	}
	public HCL_VAR(): TerminalNode[];
	public HCL_VAR(i: number): TerminalNode;
	public HCL_VAR(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(PolicyParser.HCL_VAR);
		} else {
			return this.getToken(PolicyParser.HCL_VAR, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PolicyParser.RULE_variable; }
	// @Override
	public enterRule(listener: PolicyListener): void {
		if (listener.enterVariable) {
			listener.enterVariable(this);
		}
	}
	// @Override
	public exitRule(listener: PolicyListener): void {
		if (listener.exitVariable) {
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
	public BEFORE(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.BEFORE, 0); }
	public IN(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.IN, 0); }
	public BETWEEN(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.BETWEEN, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PolicyParser.RULE_operator; }
	// @Override
	public enterRule(listener: PolicyListener): void {
		if (listener.enterOperator) {
			listener.enterOperator(this);
		}
	}
	// @Override
	public exitRule(listener: PolicyListener): void {
		if (listener.exitOperator) {
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
	public WORD(): TerminalNode[];
	public WORD(i: number): TerminalNode;
	public WORD(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(PolicyParser.WORD);
		} else {
			return this.getToken(PolicyParser.WORD, i);
		}
	}
	public QUOTED_STRING(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.QUOTED_STRING, 0); }
	public HCL_VAR(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.HCL_VAR, 0); }
	public WS(): TerminalNode[];
	public WS(i: number): TerminalNode;
	public WS(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(PolicyParser.WS);
		} else {
			return this.getToken(PolicyParser.WS, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PolicyParser.RULE_value; }
	// @Override
	public enterRule(listener: PolicyListener): void {
		if (listener.enterValue) {
			listener.enterValue(this);
		}
	}
	// @Override
	public exitRule(listener: PolicyListener): void {
		if (listener.exitValue) {
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
	public QUOTED_STRING(): TerminalNode[];
	public QUOTED_STRING(i: number): TerminalNode;
	public QUOTED_STRING(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(PolicyParser.QUOTED_STRING);
		} else {
			return this.getToken(PolicyParser.QUOTED_STRING, i);
		}
	}
	public HCL_VAR(): TerminalNode[];
	public HCL_VAR(i: number): TerminalNode;
	public HCL_VAR(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(PolicyParser.HCL_VAR);
		} else {
			return this.getToken(PolicyParser.HCL_VAR, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PolicyParser.RULE_valueList; }
	// @Override
	public enterRule(listener: PolicyListener): void {
		if (listener.enterValueList) {
			listener.enterValueList(this);
		}
	}
	// @Override
	public exitRule(listener: PolicyListener): void {
		if (listener.exitValueList) {
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
	public AND(): TerminalNode { return this.getToken(PolicyParser.AND, 0); }
	public QUOTED_STRING(): TerminalNode[];
	public QUOTED_STRING(i: number): TerminalNode;
	public QUOTED_STRING(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(PolicyParser.QUOTED_STRING);
		} else {
			return this.getToken(PolicyParser.QUOTED_STRING, i);
		}
	}
	public HCL_VAR(): TerminalNode[];
	public HCL_VAR(i: number): TerminalNode;
	public HCL_VAR(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(PolicyParser.HCL_VAR);
		} else {
			return this.getToken(PolicyParser.HCL_VAR, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PolicyParser.RULE_timeWindow; }
	// @Override
	public enterRule(listener: PolicyListener): void {
		if (listener.enterTimeWindow) {
			listener.enterTimeWindow(this);
		}
	}
	// @Override
	public exitRule(listener: PolicyListener): void {
		if (listener.exitTimeWindow) {
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
	public logicalCombine(): LogicalCombineContext {
		return this.getRuleContext(0, LogicalCombineContext);
	}
	public condition(): ConditionContext[];
	public condition(i: number): ConditionContext;
	public condition(i?: number): ConditionContext | ConditionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ConditionContext);
		} else {
			return this.getRuleContext(i, ConditionContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PolicyParser.RULE_comparisonList; }
	// @Override
	public enterRule(listener: PolicyListener): void {
		if (listener.enterComparisonList) {
			listener.enterComparisonList(this);
		}
	}
	// @Override
	public exitRule(listener: PolicyListener): void {
		if (listener.exitComparisonList) {
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
	public ALL(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.ALL, 0); }
	public ANY(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.ANY, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PolicyParser.RULE_logicalCombine; }
	// @Override
	public enterRule(listener: PolicyListener): void {
		if (listener.enterLogicalCombine) {
			listener.enterLogicalCombine(this);
		}
	}
	// @Override
	public exitRule(listener: PolicyListener): void {
		if (listener.exitLogicalCombine) {
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
	public WORD(): TerminalNode | undefined { return this.tryGetToken(PolicyParser.WORD, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return PolicyParser.RULE_patternMatch; }
	// @Override
	public enterRule(listener: PolicyListener): void {
		if (listener.enterPatternMatch) {
			listener.enterPatternMatch(this);
		}
	}
	// @Override
	public exitRule(listener: PolicyListener): void {
		if (listener.exitPatternMatch) {
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


