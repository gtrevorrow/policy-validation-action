// Generated from Terraform.g4 by ANTLR 4.9.0-SNAPSHOT


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

import { TerraformListener } from "./TerraformListener";
import { TerraformVisitor } from "./TerraformVisitor";


export class TerraformParser extends Parser {
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
	public static readonly T__13 = 14;
	public static readonly T__14 = 15;
	public static readonly T__15 = 16;
	public static readonly T__16 = 17;
	public static readonly T__17 = 18;
	public static readonly T__18 = 19;
	public static readonly T__19 = 20;
	public static readonly T__20 = 21;
	public static readonly T__21 = 22;
	public static readonly T__22 = 23;
	public static readonly T__23 = 24;
	public static readonly T__24 = 25;
	public static readonly T__25 = 26;
	public static readonly T__26 = 27;
	public static readonly T__27 = 28;
	public static readonly T__28 = 29;
	public static readonly VARIABLE = 30;
	public static readonly PROVIDER = 31;
	public static readonly IN = 32;
	public static readonly STAR = 33;
	public static readonly DOT = 34;
	public static readonly LCURL = 35;
	public static readonly RCURL = 36;
	public static readonly LPAREN = 37;
	public static readonly RPAREN = 38;
	public static readonly EOF_ = 39;
	public static readonly NULL_ = 40;
	public static readonly NATURAL_NUMBER = 41;
	public static readonly BOOL = 42;
	public static readonly DESCRIPTION = 43;
	public static readonly MULTILINESTRING = 44;
	public static readonly STRING = 45;
	public static readonly IDENTIFIER = 46;
	public static readonly COMMENT = 47;
	public static readonly BLOCKCOMMENT = 48;
	public static readonly WS = 49;
	public static readonly RULE_file_ = 0;
	public static readonly RULE_terraform = 1;
	public static readonly RULE_resource = 2;
	public static readonly RULE_data = 3;
	public static readonly RULE_provider = 4;
	public static readonly RULE_output = 5;
	public static readonly RULE_local = 6;
	public static readonly RULE_module = 7;
	public static readonly RULE_variable = 8;
	public static readonly RULE_block = 9;
	public static readonly RULE_blocktype = 10;
	public static readonly RULE_resourcetype = 11;
	public static readonly RULE_name = 12;
	public static readonly RULE_label = 13;
	public static readonly RULE_blockbody = 14;
	public static readonly RULE_argument = 15;
	public static readonly RULE_identifier = 16;
	public static readonly RULE_identifierchain = 17;
	public static readonly RULE_inline_index = 18;
	public static readonly RULE_expression = 19;
	public static readonly RULE_forloop = 20;
	public static readonly RULE_section = 21;
	public static readonly RULE_val = 22;
	public static readonly RULE_functioncall = 23;
	public static readonly RULE_functionname = 24;
	public static readonly RULE_functionarguments = 25;
	public static readonly RULE_index = 26;
	public static readonly RULE_filedecl = 27;
	public static readonly RULE_list_ = 28;
	public static readonly RULE_map_ = 29;
	public static readonly RULE_string = 30;
	public static readonly RULE_signed_number = 31;
	public static readonly RULE_operator_ = 32;
	public static readonly RULE_number = 33;
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"file_", "terraform", "resource", "data", "provider", "output", "local", 
		"module", "variable", "block", "blocktype", "resourcetype", "name", "label", 
		"blockbody", "argument", "identifier", "identifierchain", "inline_index", 
		"expression", "forloop", "section", "val", "functioncall", "functionname", 
		"functionarguments", "index", "filedecl", "list_", "map_", "string", "signed_number", 
		"operator_", "number",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, "'terraform'", "'resource'", "'data'", "'output'", "'locals'", 
		"'module'", "'='", "'local'", "'var'", "'?'", "':'", "'for'", "'jsonencode'", 
		"','", "'['", "']'", "'file'", "'+'", "'-'", "'/'", "'%'", "'>'", "'>='", 
		"'<'", "'<='", "'=='", "'!='", "'&&'", "'||'", "'variable'", "'provider'", 
		"'in'", "'*'", "'.'", "'{'", "'}'", "'('", "')'", undefined, "'nul'",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, "VARIABLE", "PROVIDER", "IN", "STAR", "DOT", "LCURL", 
		"RCURL", "LPAREN", "RPAREN", "EOF_", "NULL_", "NATURAL_NUMBER", "BOOL", 
		"DESCRIPTION", "MULTILINESTRING", "STRING", "IDENTIFIER", "COMMENT", "BLOCKCOMMENT", 
		"WS",
	];
	public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(TerraformParser._LITERAL_NAMES, TerraformParser._SYMBOLIC_NAMES, []);

	// @Override
	// @NotNull
	public get vocabulary(): Vocabulary {
		return TerraformParser.VOCABULARY;
	}
	// tslint:enable:no-trailing-whitespace

	// @Override
	public get grammarFileName(): string { return "Terraform.g4"; }

	// @Override
	public get ruleNames(): string[] { return TerraformParser.ruleNames; }

	// @Override
	public get serializedATN(): string { return TerraformParser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(TerraformParser._ATN, this);
	}
	// @RuleVersion(0)
	public file_(): File_Context {
		let _localctx: File_Context = new File_Context(this._ctx, this.state);
		this.enterRule(_localctx, 0, TerraformParser.RULE_file_);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 76;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				this.state = 76;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case TerraformParser.T__4:
					{
					this.state = 68;
					this.local();
					}
					break;
				case TerraformParser.T__5:
					{
					this.state = 69;
					this.module();
					}
					break;
				case TerraformParser.T__3:
					{
					this.state = 70;
					this.output();
					}
					break;
				case TerraformParser.PROVIDER:
					{
					this.state = 71;
					this.provider();
					}
					break;
				case TerraformParser.VARIABLE:
					{
					this.state = 72;
					this.variable();
					}
					break;
				case TerraformParser.T__2:
					{
					this.state = 73;
					this.data();
					}
					break;
				case TerraformParser.T__1:
					{
					this.state = 74;
					this.resource();
					}
					break;
				case TerraformParser.T__0:
					{
					this.state = 75;
					this.terraform();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				this.state = 78;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << TerraformParser.T__0) | (1 << TerraformParser.T__1) | (1 << TerraformParser.T__2) | (1 << TerraformParser.T__3) | (1 << TerraformParser.T__4) | (1 << TerraformParser.T__5) | (1 << TerraformParser.VARIABLE) | (1 << TerraformParser.PROVIDER))) !== 0));
			this.state = 80;
			this.match(TerraformParser.EOF);
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
	public terraform(): TerraformContext {
		let _localctx: TerraformContext = new TerraformContext(this._ctx, this.state);
		this.enterRule(_localctx, 2, TerraformParser.RULE_terraform);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 82;
			this.match(TerraformParser.T__0);
			this.state = 83;
			this.blockbody();
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
		this.enterRule(_localctx, 4, TerraformParser.RULE_resource);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 85;
			this.match(TerraformParser.T__1);
			this.state = 86;
			this.resourcetype();
			this.state = 87;
			this.name();
			this.state = 88;
			this.blockbody();
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
	public data(): DataContext {
		let _localctx: DataContext = new DataContext(this._ctx, this.state);
		this.enterRule(_localctx, 6, TerraformParser.RULE_data);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 90;
			this.match(TerraformParser.T__2);
			this.state = 91;
			this.resourcetype();
			this.state = 92;
			this.name();
			this.state = 93;
			this.blockbody();
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
	public provider(): ProviderContext {
		let _localctx: ProviderContext = new ProviderContext(this._ctx, this.state);
		this.enterRule(_localctx, 8, TerraformParser.RULE_provider);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 95;
			this.match(TerraformParser.PROVIDER);
			this.state = 96;
			this.resourcetype();
			this.state = 97;
			this.blockbody();
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
	public output(): OutputContext {
		let _localctx: OutputContext = new OutputContext(this._ctx, this.state);
		this.enterRule(_localctx, 10, TerraformParser.RULE_output);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 99;
			this.match(TerraformParser.T__3);
			this.state = 100;
			this.name();
			this.state = 101;
			this.blockbody();
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
	public local(): LocalContext {
		let _localctx: LocalContext = new LocalContext(this._ctx, this.state);
		this.enterRule(_localctx, 12, TerraformParser.RULE_local);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 103;
			this.match(TerraformParser.T__4);
			this.state = 104;
			this.blockbody();
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
	public module(): ModuleContext {
		let _localctx: ModuleContext = new ModuleContext(this._ctx, this.state);
		this.enterRule(_localctx, 14, TerraformParser.RULE_module);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 106;
			this.match(TerraformParser.T__5);
			this.state = 107;
			this.name();
			this.state = 108;
			this.blockbody();
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
		this.enterRule(_localctx, 16, TerraformParser.RULE_variable);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 110;
			this.match(TerraformParser.VARIABLE);
			this.state = 111;
			this.name();
			this.state = 112;
			this.blockbody();
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
	public block(): BlockContext {
		let _localctx: BlockContext = new BlockContext(this._ctx, this.state);
		this.enterRule(_localctx, 18, TerraformParser.RULE_block);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 114;
			this.blocktype();
			this.state = 118;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === TerraformParser.STRING) {
				{
				{
				this.state = 115;
				this.label();
				}
				}
				this.state = 120;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 121;
			this.blockbody();
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
	public blocktype(): BlocktypeContext {
		let _localctx: BlocktypeContext = new BlocktypeContext(this._ctx, this.state);
		this.enterRule(_localctx, 20, TerraformParser.RULE_blocktype);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 123;
			this.match(TerraformParser.IDENTIFIER);
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
	public resourcetype(): ResourcetypeContext {
		let _localctx: ResourcetypeContext = new ResourcetypeContext(this._ctx, this.state);
		this.enterRule(_localctx, 22, TerraformParser.RULE_resourcetype);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 125;
			this.match(TerraformParser.STRING);
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
	public name(): NameContext {
		let _localctx: NameContext = new NameContext(this._ctx, this.state);
		this.enterRule(_localctx, 24, TerraformParser.RULE_name);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 127;
			this.match(TerraformParser.STRING);
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
	public label(): LabelContext {
		let _localctx: LabelContext = new LabelContext(this._ctx, this.state);
		this.enterRule(_localctx, 26, TerraformParser.RULE_label);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 129;
			this.match(TerraformParser.STRING);
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
	public blockbody(): BlockbodyContext {
		let _localctx: BlockbodyContext = new BlockbodyContext(this._ctx, this.state);
		this.enterRule(_localctx, 28, TerraformParser.RULE_blockbody);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 131;
			this.match(TerraformParser.LCURL);
			this.state = 136;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << TerraformParser.T__2) | (1 << TerraformParser.T__5) | (1 << TerraformParser.T__7) | (1 << TerraformParser.T__8) | (1 << TerraformParser.VARIABLE) | (1 << TerraformParser.PROVIDER))) !== 0) || ((((_la - 32)) & ~0x1F) === 0 && ((1 << (_la - 32)) & ((1 << (TerraformParser.IN - 32)) | (1 << (TerraformParser.STAR - 32)) | (1 << (TerraformParser.NATURAL_NUMBER - 32)) | (1 << (TerraformParser.IDENTIFIER - 32)))) !== 0)) {
				{
				this.state = 134;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 3, this._ctx) ) {
				case 1:
					{
					this.state = 132;
					this.argument();
					}
					break;

				case 2:
					{
					this.state = 133;
					this.block();
					}
					break;
				}
				}
				this.state = 138;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 139;
			this.match(TerraformParser.RCURL);
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
		this.enterRule(_localctx, 30, TerraformParser.RULE_argument);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 141;
			this.identifier();
			this.state = 142;
			this.match(TerraformParser.T__6);
			this.state = 143;
			this.expression(0);
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
	public identifier(): IdentifierContext {
		let _localctx: IdentifierContext = new IdentifierContext(this._ctx, this.state);
		this.enterRule(_localctx, 32, TerraformParser.RULE_identifier);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 147;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << TerraformParser.T__2) | (1 << TerraformParser.T__5) | (1 << TerraformParser.T__7) | (1 << TerraformParser.T__8))) !== 0)) {
				{
				this.state = 145;
				_la = this._input.LA(1);
				if (!((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << TerraformParser.T__2) | (1 << TerraformParser.T__5) | (1 << TerraformParser.T__7) | (1 << TerraformParser.T__8))) !== 0))) {
				this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
				this.state = 146;
				this.match(TerraformParser.DOT);
				}
			}

			this.state = 149;
			this.identifierchain();
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
	public identifierchain(): IdentifierchainContext {
		let _localctx: IdentifierchainContext = new IdentifierchainContext(this._ctx, this.state);
		this.enterRule(_localctx, 34, TerraformParser.RULE_identifierchain);
		let _la: number;
		try {
			let _alt: number;
			this.state = 178;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case TerraformParser.VARIABLE:
			case TerraformParser.PROVIDER:
			case TerraformParser.IN:
			case TerraformParser.IDENTIFIER:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 151;
				_la = this._input.LA(1);
				if (!(((((_la - 30)) & ~0x1F) === 0 && ((1 << (_la - 30)) & ((1 << (TerraformParser.VARIABLE - 30)) | (1 << (TerraformParser.PROVIDER - 30)) | (1 << (TerraformParser.IN - 30)) | (1 << (TerraformParser.IDENTIFIER - 30)))) !== 0))) {
				this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
				this.state = 153;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 6, this._ctx) ) {
				case 1:
					{
					this.state = 152;
					this.index();
					}
					break;
				}
				this.state = 159;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 7, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 155;
						this.match(TerraformParser.DOT);
						this.state = 156;
						this.identifierchain();
						}
						}
					}
					this.state = 161;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 7, this._ctx);
				}
				}
				break;
			case TerraformParser.STAR:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 162;
				this.match(TerraformParser.STAR);
				this.state = 167;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 8, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 163;
						this.match(TerraformParser.DOT);
						this.state = 164;
						this.identifierchain();
						}
						}
					}
					this.state = 169;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 8, this._ctx);
				}
				}
				break;
			case TerraformParser.NATURAL_NUMBER:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 170;
				this.inline_index();
				this.state = 175;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 9, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 171;
						this.match(TerraformParser.DOT);
						this.state = 172;
						this.identifierchain();
						}
						}
					}
					this.state = 177;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 9, this._ctx);
				}
				}
				break;
			default:
				throw new NoViableAltException(this);
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
	public inline_index(): Inline_indexContext {
		let _localctx: Inline_indexContext = new Inline_indexContext(this._ctx, this.state);
		this.enterRule(_localctx, 36, TerraformParser.RULE_inline_index);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 180;
			this.match(TerraformParser.NATURAL_NUMBER);
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

	public expression(): ExpressionContext;
	public expression(_p: number): ExpressionContext;
	// @RuleVersion(0)
	public expression(_p?: number): ExpressionContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let _localctx: ExpressionContext = new ExpressionContext(this._ctx, _parentState);
		let _prevctx: ExpressionContext = _localctx;
		let _startState: number = 38;
		this.enterRecursionRule(_localctx, 38, TerraformParser.RULE_expression, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 189;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case TerraformParser.T__2:
			case TerraformParser.T__5:
			case TerraformParser.T__7:
			case TerraformParser.T__8:
			case TerraformParser.T__12:
			case TerraformParser.T__14:
			case TerraformParser.T__16:
			case TerraformParser.T__17:
			case TerraformParser.T__18:
			case TerraformParser.VARIABLE:
			case TerraformParser.PROVIDER:
			case TerraformParser.IN:
			case TerraformParser.STAR:
			case TerraformParser.LCURL:
			case TerraformParser.EOF_:
			case TerraformParser.NULL_:
			case TerraformParser.NATURAL_NUMBER:
			case TerraformParser.BOOL:
			case TerraformParser.DESCRIPTION:
			case TerraformParser.MULTILINESTRING:
			case TerraformParser.STRING:
			case TerraformParser.IDENTIFIER:
				{
				this.state = 183;
				this.section();
				}
				break;
			case TerraformParser.LPAREN:
				{
				this.state = 184;
				this.match(TerraformParser.LPAREN);
				this.state = 185;
				this.expression(0);
				this.state = 186;
				this.match(TerraformParser.RPAREN);
				}
				break;
			case TerraformParser.T__11:
				{
				this.state = 188;
				this.forloop();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this._ctx._stop = this._input.tryLT(-1);
			this.state = 203;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 13, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = _localctx;
					{
					this.state = 201;
					this._errHandler.sync(this);
					switch ( this.interpreter.adaptivePredict(this._input, 12, this._ctx) ) {
					case 1:
						{
						_localctx = new ExpressionContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, TerraformParser.RULE_expression);
						this.state = 191;
						if (!(this.precpred(this._ctx, 4))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 4)");
						}
						this.state = 192;
						this.operator_();
						this.state = 193;
						this.expression(5);
						}
						break;

					case 2:
						{
						_localctx = new ExpressionContext(_parentctx, _parentState);
						this.pushNewRecursionContext(_localctx, _startState, TerraformParser.RULE_expression);
						this.state = 195;
						if (!(this.precpred(this._ctx, 2))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 2)");
						}
						this.state = 196;
						this.match(TerraformParser.T__9);
						this.state = 197;
						this.expression(0);
						this.state = 198;
						this.match(TerraformParser.T__10);
						this.state = 199;
						this.expression(3);
						}
						break;
					}
					}
				}
				this.state = 205;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 13, this._ctx);
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
			this.unrollRecursionContexts(_parentctx);
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public forloop(): ForloopContext {
		let _localctx: ForloopContext = new ForloopContext(this._ctx, this.state);
		this.enterRule(_localctx, 40, TerraformParser.RULE_forloop);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 206;
			this.match(TerraformParser.T__11);
			this.state = 207;
			this.identifier();
			this.state = 208;
			this.match(TerraformParser.IN);
			this.state = 209;
			this.expression(0);
			this.state = 210;
			this.match(TerraformParser.T__10);
			this.state = 211;
			this.expression(0);
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
	public section(): SectionContext {
		let _localctx: SectionContext = new SectionContext(this._ctx, this.state);
		this.enterRule(_localctx, 42, TerraformParser.RULE_section);
		try {
			this.state = 216;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case TerraformParser.T__14:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 213;
				this.list_();
				}
				break;
			case TerraformParser.LCURL:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 214;
				this.map_();
				}
				break;
			case TerraformParser.T__2:
			case TerraformParser.T__5:
			case TerraformParser.T__7:
			case TerraformParser.T__8:
			case TerraformParser.T__12:
			case TerraformParser.T__16:
			case TerraformParser.T__17:
			case TerraformParser.T__18:
			case TerraformParser.VARIABLE:
			case TerraformParser.PROVIDER:
			case TerraformParser.IN:
			case TerraformParser.STAR:
			case TerraformParser.EOF_:
			case TerraformParser.NULL_:
			case TerraformParser.NATURAL_NUMBER:
			case TerraformParser.BOOL:
			case TerraformParser.DESCRIPTION:
			case TerraformParser.MULTILINESTRING:
			case TerraformParser.STRING:
			case TerraformParser.IDENTIFIER:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 215;
				this.val();
				}
				break;
			default:
				throw new NoViableAltException(this);
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
	public val(): ValContext {
		let _localctx: ValContext = new ValContext(this._ctx, this.state);
		this.enterRule(_localctx, 44, TerraformParser.RULE_val);
		try {
			this.state = 227;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 15, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 218;
				this.match(TerraformParser.NULL_);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 219;
				this.signed_number();
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 220;
				this.string();
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 221;
				this.identifier();
				}
				break;

			case 5:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 222;
				this.match(TerraformParser.BOOL);
				}
				break;

			case 6:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 223;
				this.match(TerraformParser.DESCRIPTION);
				}
				break;

			case 7:
				this.enterOuterAlt(_localctx, 7);
				{
				this.state = 224;
				this.filedecl();
				}
				break;

			case 8:
				this.enterOuterAlt(_localctx, 8);
				{
				this.state = 225;
				this.functioncall();
				}
				break;

			case 9:
				this.enterOuterAlt(_localctx, 9);
				{
				this.state = 226;
				this.match(TerraformParser.EOF_);
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
	public functioncall(): FunctioncallContext {
		let _localctx: FunctioncallContext = new FunctioncallContext(this._ctx, this.state);
		this.enterRule(_localctx, 46, TerraformParser.RULE_functioncall);
		try {
			let _alt: number;
			this.state = 243;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case TerraformParser.IDENTIFIER:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 229;
				this.functionname();
				this.state = 230;
				this.match(TerraformParser.LPAREN);
				this.state = 231;
				this.functionarguments();
				this.state = 232;
				this.match(TerraformParser.RPAREN);
				}
				break;
			case TerraformParser.T__12:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 234;
				this.match(TerraformParser.T__12);
				this.state = 235;
				this.match(TerraformParser.LPAREN);
				this.state = 239;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 16, this._ctx);
				while (_alt !== 1 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1 + 1) {
						{
						{
						this.state = 236;
						this.matchWildcard();
						}
						}
					}
					this.state = 241;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 16, this._ctx);
				}
				this.state = 242;
				this.match(TerraformParser.RPAREN);
				}
				break;
			default:
				throw new NoViableAltException(this);
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
	public functionname(): FunctionnameContext {
		let _localctx: FunctionnameContext = new FunctionnameContext(this._ctx, this.state);
		this.enterRule(_localctx, 48, TerraformParser.RULE_functionname);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 245;
			this.match(TerraformParser.IDENTIFIER);
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
	public functionarguments(): FunctionargumentsContext {
		let _localctx: FunctionargumentsContext = new FunctionargumentsContext(this._ctx, this.state);
		this.enterRule(_localctx, 50, TerraformParser.RULE_functionarguments);
		let _la: number;
		try {
			this.state = 256;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case TerraformParser.RPAREN:
				this.enterOuterAlt(_localctx, 1);
				// tslint:disable-next-line:no-empty
				{
				}
				break;
			case TerraformParser.T__2:
			case TerraformParser.T__5:
			case TerraformParser.T__7:
			case TerraformParser.T__8:
			case TerraformParser.T__11:
			case TerraformParser.T__12:
			case TerraformParser.T__14:
			case TerraformParser.T__16:
			case TerraformParser.T__17:
			case TerraformParser.T__18:
			case TerraformParser.VARIABLE:
			case TerraformParser.PROVIDER:
			case TerraformParser.IN:
			case TerraformParser.STAR:
			case TerraformParser.LCURL:
			case TerraformParser.LPAREN:
			case TerraformParser.EOF_:
			case TerraformParser.NULL_:
			case TerraformParser.NATURAL_NUMBER:
			case TerraformParser.BOOL:
			case TerraformParser.DESCRIPTION:
			case TerraformParser.MULTILINESTRING:
			case TerraformParser.STRING:
			case TerraformParser.IDENTIFIER:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 248;
				this.expression(0);
				this.state = 253;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === TerraformParser.T__13) {
					{
					{
					this.state = 249;
					this.match(TerraformParser.T__13);
					this.state = 250;
					this.expression(0);
					}
					}
					this.state = 255;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
				break;
			default:
				throw new NoViableAltException(this);
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
	public index(): IndexContext {
		let _localctx: IndexContext = new IndexContext(this._ctx, this.state);
		this.enterRule(_localctx, 52, TerraformParser.RULE_index);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 258;
			this.match(TerraformParser.T__14);
			this.state = 259;
			this.expression(0);
			this.state = 260;
			this.match(TerraformParser.T__15);
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
	public filedecl(): FiledeclContext {
		let _localctx: FiledeclContext = new FiledeclContext(this._ctx, this.state);
		this.enterRule(_localctx, 54, TerraformParser.RULE_filedecl);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 262;
			this.match(TerraformParser.T__16);
			this.state = 263;
			this.match(TerraformParser.LPAREN);
			this.state = 264;
			this.expression(0);
			this.state = 265;
			this.match(TerraformParser.RPAREN);
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
	public list_(): List_Context {
		let _localctx: List_Context = new List_Context(this._ctx, this.state);
		this.enterRule(_localctx, 56, TerraformParser.RULE_list_);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 267;
			this.match(TerraformParser.T__14);
			this.state = 279;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << TerraformParser.T__2) | (1 << TerraformParser.T__5) | (1 << TerraformParser.T__7) | (1 << TerraformParser.T__8) | (1 << TerraformParser.T__11) | (1 << TerraformParser.T__12) | (1 << TerraformParser.T__14) | (1 << TerraformParser.T__16) | (1 << TerraformParser.T__17) | (1 << TerraformParser.T__18) | (1 << TerraformParser.VARIABLE) | (1 << TerraformParser.PROVIDER))) !== 0) || ((((_la - 32)) & ~0x1F) === 0 && ((1 << (_la - 32)) & ((1 << (TerraformParser.IN - 32)) | (1 << (TerraformParser.STAR - 32)) | (1 << (TerraformParser.LCURL - 32)) | (1 << (TerraformParser.LPAREN - 32)) | (1 << (TerraformParser.EOF_ - 32)) | (1 << (TerraformParser.NULL_ - 32)) | (1 << (TerraformParser.NATURAL_NUMBER - 32)) | (1 << (TerraformParser.BOOL - 32)) | (1 << (TerraformParser.DESCRIPTION - 32)) | (1 << (TerraformParser.MULTILINESTRING - 32)) | (1 << (TerraformParser.STRING - 32)) | (1 << (TerraformParser.IDENTIFIER - 32)))) !== 0)) {
				{
				this.state = 268;
				this.expression(0);
				this.state = 273;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 20, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 269;
						this.match(TerraformParser.T__13);
						this.state = 270;
						this.expression(0);
						}
						}
					}
					this.state = 275;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 20, this._ctx);
				}
				this.state = 277;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === TerraformParser.T__13) {
					{
					this.state = 276;
					this.match(TerraformParser.T__13);
					}
				}

				}
			}

			this.state = 281;
			this.match(TerraformParser.T__15);
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
	public map_(): Map_Context {
		let _localctx: Map_Context = new Map_Context(this._ctx, this.state);
		this.enterRule(_localctx, 58, TerraformParser.RULE_map_);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 283;
			this.match(TerraformParser.LCURL);
			this.state = 290;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << TerraformParser.T__2) | (1 << TerraformParser.T__5) | (1 << TerraformParser.T__7) | (1 << TerraformParser.T__8) | (1 << TerraformParser.VARIABLE) | (1 << TerraformParser.PROVIDER))) !== 0) || ((((_la - 32)) & ~0x1F) === 0 && ((1 << (_la - 32)) & ((1 << (TerraformParser.IN - 32)) | (1 << (TerraformParser.STAR - 32)) | (1 << (TerraformParser.NATURAL_NUMBER - 32)) | (1 << (TerraformParser.IDENTIFIER - 32)))) !== 0)) {
				{
				{
				this.state = 284;
				this.argument();
				this.state = 286;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === TerraformParser.T__13) {
					{
					this.state = 285;
					this.match(TerraformParser.T__13);
					}
				}

				}
				}
				this.state = 292;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 293;
			this.match(TerraformParser.RCURL);
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
	public string(): StringContext {
		let _localctx: StringContext = new StringContext(this._ctx, this.state);
		this.enterRule(_localctx, 60, TerraformParser.RULE_string);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 295;
			_la = this._input.LA(1);
			if (!(_la === TerraformParser.MULTILINESTRING || _la === TerraformParser.STRING)) {
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
	public signed_number(): Signed_numberContext {
		let _localctx: Signed_numberContext = new Signed_numberContext(this._ctx, this.state);
		this.enterRule(_localctx, 62, TerraformParser.RULE_signed_number);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 298;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === TerraformParser.T__17 || _la === TerraformParser.T__18) {
				{
				this.state = 297;
				_la = this._input.LA(1);
				if (!(_la === TerraformParser.T__17 || _la === TerraformParser.T__18)) {
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

			this.state = 300;
			this.number();
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
	public operator_(): Operator_Context {
		let _localctx: Operator_Context = new Operator_Context(this._ctx, this.state);
		this.enterRule(_localctx, 64, TerraformParser.RULE_operator_);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 302;
			_la = this._input.LA(1);
			if (!(((((_la - 18)) & ~0x1F) === 0 && ((1 << (_la - 18)) & ((1 << (TerraformParser.T__17 - 18)) | (1 << (TerraformParser.T__18 - 18)) | (1 << (TerraformParser.T__19 - 18)) | (1 << (TerraformParser.T__20 - 18)) | (1 << (TerraformParser.T__21 - 18)) | (1 << (TerraformParser.T__22 - 18)) | (1 << (TerraformParser.T__23 - 18)) | (1 << (TerraformParser.T__24 - 18)) | (1 << (TerraformParser.T__25 - 18)) | (1 << (TerraformParser.T__26 - 18)) | (1 << (TerraformParser.T__27 - 18)) | (1 << (TerraformParser.T__28 - 18)) | (1 << (TerraformParser.STAR - 18)))) !== 0))) {
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
	public number(): NumberContext {
		let _localctx: NumberContext = new NumberContext(this._ctx, this.state);
		this.enterRule(_localctx, 66, TerraformParser.RULE_number);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 304;
			this.match(TerraformParser.NATURAL_NUMBER);
			this.state = 307;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 26, this._ctx) ) {
			case 1:
				{
				this.state = 305;
				this.match(TerraformParser.DOT);
				this.state = 306;
				this.match(TerraformParser.NATURAL_NUMBER);
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

	public sempred(_localctx: RuleContext, ruleIndex: number, predIndex: number): boolean {
		switch (ruleIndex) {
		case 19:
			return this.expression_sempred(_localctx as ExpressionContext, predIndex);
		}
		return true;
	}
	private expression_sempred(_localctx: ExpressionContext, predIndex: number): boolean {
		switch (predIndex) {
		case 0:
			return this.precpred(this._ctx, 4);

		case 1:
			return this.precpred(this._ctx, 2);
		}
		return true;
	}

	public static readonly _serializedATN: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x033\u0138\x04\x02" +
		"\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04\x07" +
		"\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x04\r\t\r\x04" +
		"\x0E\t\x0E\x04\x0F\t\x0F\x04\x10\t\x10\x04\x11\t\x11\x04\x12\t\x12\x04" +
		"\x13\t\x13\x04\x14\t\x14\x04\x15\t\x15\x04\x16\t\x16\x04\x17\t\x17\x04" +
		"\x18\t\x18\x04\x19\t\x19\x04\x1A\t\x1A\x04\x1B\t\x1B\x04\x1C\t\x1C\x04" +
		"\x1D\t\x1D\x04\x1E\t\x1E\x04\x1F\t\x1F\x04 \t \x04!\t!\x04\"\t\"\x04#" +
		"\t#\x03\x02\x03\x02\x03\x02\x03\x02\x03\x02\x03\x02\x03\x02\x03\x02\x06" +
		"\x02O\n\x02\r\x02\x0E\x02P\x03\x02\x03\x02\x03\x03\x03\x03\x03\x03\x03" +
		"\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x05\x03\x05\x03\x05\x03\x05\x03" +
		"\x05\x03\x06\x03\x06\x03\x06\x03\x06\x03\x07\x03\x07\x03\x07\x03\x07\x03" +
		"\b\x03\b\x03\b\x03\t\x03\t\x03\t\x03\t\x03\n\x03\n\x03\n\x03\n\x03\v\x03" +
		"\v\x07\vw\n\v\f\v\x0E\vz\v\v\x03\v\x03\v\x03\f\x03\f\x03\r\x03\r\x03\x0E" +
		"\x03\x0E\x03\x0F\x03\x0F\x03\x10\x03\x10\x03\x10\x07\x10\x89\n\x10\f\x10" +
		"\x0E\x10\x8C\v\x10\x03\x10\x03\x10\x03\x11\x03\x11\x03\x11\x03\x11\x03" +
		"\x12\x03\x12\x05\x12\x96\n\x12\x03\x12\x03\x12\x03\x13\x03\x13\x05\x13" +
		"\x9C\n\x13\x03\x13\x03\x13\x07\x13\xA0\n\x13\f\x13\x0E\x13\xA3\v\x13\x03" +
		"\x13\x03\x13\x03\x13\x07\x13\xA8\n\x13\f\x13\x0E\x13\xAB\v\x13\x03\x13" +
		"\x03\x13\x03\x13\x07\x13\xB0\n\x13\f\x13\x0E\x13\xB3\v\x13\x05\x13\xB5" +
		"\n\x13\x03\x14\x03\x14\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15" +
		"\x03\x15\x05\x15\xC0\n\x15\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15\x03" +
		"\x15\x03\x15\x03\x15\x03\x15\x03\x15\x07\x15\xCC\n\x15\f\x15\x0E\x15\xCF" +
		"\v\x15\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16\x03\x17" +
		"\x03\x17\x03\x17\x05\x17\xDB\n\x17\x03\x18\x03\x18\x03\x18\x03\x18\x03" +
		"\x18\x03\x18\x03\x18\x03\x18\x03\x18\x05\x18\xE6\n\x18\x03\x19\x03\x19" +
		"\x03\x19\x03\x19\x03\x19\x03\x19\x03\x19\x03\x19\x07\x19\xF0\n\x19\f\x19" +
		"\x0E\x19\xF3\v\x19\x03\x19\x05\x19\xF6\n\x19\x03\x1A\x03\x1A\x03\x1B\x03" +
		"\x1B\x03\x1B\x03\x1B\x07\x1B\xFE\n\x1B\f\x1B\x0E\x1B\u0101\v\x1B\x05\x1B" +
		"\u0103\n\x1B\x03\x1C\x03\x1C\x03\x1C\x03\x1C\x03\x1D\x03\x1D\x03\x1D\x03" +
		"\x1D\x03\x1D\x03\x1E\x03\x1E\x03\x1E\x03\x1E\x07\x1E\u0112\n\x1E\f\x1E" +
		"\x0E\x1E\u0115\v\x1E\x03\x1E\x05\x1E\u0118\n\x1E\x05\x1E\u011A\n\x1E\x03" +
		"\x1E\x03\x1E\x03\x1F\x03\x1F\x03\x1F\x05\x1F\u0121\n\x1F\x07\x1F\u0123" +
		"\n\x1F\f\x1F\x0E\x1F\u0126\v\x1F\x03\x1F\x03\x1F\x03 \x03 \x03!\x05!\u012D" +
		"\n!\x03!\x03!\x03\"\x03\"\x03#\x03#\x03#\x05#\u0136\n#\x03#\x03\xF1\x02" +
		"\x03($\x02\x02\x04\x02\x06\x02\b\x02\n\x02\f\x02\x0E\x02\x10\x02\x12\x02" +
		"\x14\x02\x16\x02\x18\x02\x1A\x02\x1C\x02\x1E\x02 \x02\"\x02$\x02&\x02" +
		"(\x02*\x02,\x02.\x020\x022\x024\x026\x028\x02:\x02<\x02>\x02@\x02B\x02" +
		"D\x02\x02\x07\x05\x02\x05\x05\b\b\n\v\x04\x02 \"00\x03\x02./\x03\x02\x14" +
		"\x15\x04\x02\x14\x1F##\x02\u0140\x02N\x03\x02\x02\x02\x04T\x03\x02\x02" +
		"\x02\x06W\x03\x02\x02\x02\b\\\x03\x02\x02\x02\na\x03\x02\x02\x02\fe\x03" +
		"\x02\x02\x02\x0Ei\x03\x02\x02\x02\x10l\x03\x02\x02\x02\x12p\x03\x02\x02" +
		"\x02\x14t\x03\x02\x02\x02\x16}\x03\x02\x02\x02\x18\x7F\x03\x02\x02\x02" +
		"\x1A\x81\x03\x02\x02\x02\x1C\x83\x03\x02\x02\x02\x1E\x85\x03\x02\x02\x02" +
		" \x8F\x03\x02\x02\x02\"\x95\x03\x02\x02\x02$\xB4\x03\x02\x02\x02&\xB6" +
		"\x03\x02\x02\x02(\xBF\x03\x02\x02\x02*\xD0\x03\x02\x02\x02,\xDA\x03\x02" +
		"\x02\x02.\xE5\x03\x02\x02\x020\xF5\x03\x02\x02\x022\xF7\x03\x02\x02\x02" +
		"4\u0102\x03\x02\x02\x026\u0104\x03\x02\x02\x028\u0108\x03\x02\x02\x02" +
		":\u010D\x03\x02\x02\x02<\u011D\x03\x02\x02\x02>\u0129\x03\x02\x02\x02" +
		"@\u012C\x03\x02\x02\x02B\u0130\x03\x02\x02\x02D\u0132\x03\x02\x02\x02" +
		"FO\x05\x0E\b\x02GO\x05\x10\t\x02HO\x05\f\x07\x02IO\x05\n\x06\x02JO\x05" +
		"\x12\n\x02KO\x05\b\x05\x02LO\x05\x06\x04\x02MO\x05\x04\x03\x02NF\x03\x02" +
		"\x02\x02NG\x03\x02\x02\x02NH\x03\x02\x02\x02NI\x03\x02\x02\x02NJ\x03\x02" +
		"\x02\x02NK\x03\x02\x02\x02NL\x03\x02\x02\x02NM\x03\x02\x02\x02OP\x03\x02" +
		"\x02\x02PN\x03\x02\x02\x02PQ\x03\x02\x02\x02QR\x03\x02\x02\x02RS\x07\x02" +
		"\x02\x03S\x03\x03\x02\x02\x02TU\x07\x03\x02\x02UV\x05\x1E\x10\x02V\x05" +
		"\x03\x02\x02\x02WX\x07\x04\x02\x02XY\x05\x18\r\x02YZ\x05\x1A\x0E\x02Z" +
		"[\x05\x1E\x10\x02[\x07\x03\x02\x02\x02\\]\x07\x05\x02\x02]^\x05\x18\r" +
		"\x02^_\x05\x1A\x0E\x02_`\x05\x1E\x10\x02`\t\x03\x02\x02\x02ab\x07!\x02" +
		"\x02bc\x05\x18\r\x02cd\x05\x1E\x10\x02d\v\x03\x02\x02\x02ef\x07\x06\x02" +
		"\x02fg\x05\x1A\x0E\x02gh\x05\x1E\x10\x02h\r\x03\x02\x02\x02ij\x07\x07" +
		"\x02\x02jk\x05\x1E\x10\x02k\x0F\x03\x02\x02\x02lm\x07\b\x02\x02mn\x05" +
		"\x1A\x0E\x02no\x05\x1E\x10\x02o\x11\x03\x02\x02\x02pq\x07 \x02\x02qr\x05" +
		"\x1A\x0E\x02rs\x05\x1E\x10\x02s\x13\x03\x02\x02\x02tx\x05\x16\f\x02uw" +
		"\x05\x1C\x0F\x02vu\x03\x02\x02\x02wz\x03\x02\x02\x02xv\x03\x02\x02\x02" +
		"xy\x03\x02\x02\x02y{\x03\x02\x02\x02zx\x03\x02\x02\x02{|\x05\x1E\x10\x02" +
		"|\x15\x03\x02\x02\x02}~\x070\x02\x02~\x17\x03\x02\x02\x02\x7F\x80\x07" +
		"/\x02\x02\x80\x19\x03\x02\x02\x02\x81\x82\x07/\x02\x02\x82\x1B\x03\x02" +
		"\x02\x02\x83\x84\x07/\x02\x02\x84\x1D\x03\x02\x02\x02\x85\x8A\x07%\x02" +
		"\x02\x86\x89\x05 \x11\x02\x87\x89\x05\x14\v\x02\x88\x86\x03\x02\x02\x02" +
		"\x88\x87\x03\x02\x02\x02\x89\x8C\x03\x02\x02\x02\x8A\x88\x03\x02\x02\x02" +
		"\x8A\x8B\x03\x02\x02\x02\x8B\x8D\x03\x02\x02\x02\x8C\x8A\x03\x02\x02\x02" +
		"\x8D\x8E\x07&\x02\x02\x8E\x1F\x03\x02\x02\x02\x8F\x90\x05\"\x12\x02\x90" +
		"\x91\x07\t\x02\x02\x91\x92\x05(\x15\x02\x92!\x03\x02\x02\x02\x93\x94\t" +
		"\x02\x02\x02\x94\x96\x07$\x02\x02\x95\x93\x03\x02\x02\x02\x95\x96\x03" +
		"\x02\x02\x02\x96\x97\x03\x02\x02\x02\x97\x98\x05$\x13\x02\x98#\x03\x02" +
		"\x02\x02\x99\x9B\t\x03\x02\x02\x9A\x9C\x056\x1C\x02\x9B\x9A\x03\x02\x02" +
		"\x02\x9B\x9C\x03\x02\x02\x02\x9C\xA1\x03\x02\x02\x02\x9D\x9E\x07$\x02" +
		"\x02\x9E\xA0\x05$\x13\x02\x9F\x9D\x03\x02\x02\x02\xA0\xA3\x03\x02\x02" +
		"\x02\xA1\x9F\x03\x02\x02\x02\xA1\xA2\x03\x02\x02\x02\xA2\xB5\x03\x02\x02" +
		"\x02\xA3\xA1\x03\x02\x02\x02\xA4\xA9\x07#\x02\x02\xA5\xA6\x07$\x02\x02" +
		"\xA6\xA8\x05$\x13\x02\xA7\xA5\x03\x02\x02\x02\xA8\xAB\x03\x02\x02\x02" +
		"\xA9\xA7\x03\x02\x02\x02\xA9\xAA\x03\x02\x02\x02\xAA\xB5\x03\x02\x02\x02" +
		"\xAB\xA9\x03\x02\x02\x02\xAC\xB1\x05&\x14\x02\xAD\xAE\x07$\x02\x02\xAE" +
		"\xB0\x05$\x13\x02\xAF\xAD\x03\x02\x02\x02\xB0\xB3\x03\x02\x02\x02\xB1" +
		"\xAF\x03\x02\x02\x02\xB1\xB2\x03\x02\x02\x02\xB2\xB5\x03\x02\x02\x02\xB3" +
		"\xB1\x03\x02\x02\x02\xB4\x99\x03\x02\x02\x02\xB4\xA4\x03\x02\x02\x02\xB4" +
		"\xAC\x03\x02\x02\x02\xB5%\x03\x02\x02\x02\xB6\xB7\x07+\x02\x02\xB7\'\x03" +
		"\x02\x02\x02\xB8\xB9\b\x15\x01\x02\xB9\xC0\x05,\x17\x02\xBA\xBB\x07\'" +
		"\x02\x02\xBB\xBC\x05(\x15\x02\xBC\xBD\x07(\x02\x02\xBD\xC0\x03\x02\x02" +
		"\x02\xBE\xC0\x05*\x16\x02\xBF\xB8\x03\x02\x02\x02\xBF\xBA\x03\x02\x02" +
		"\x02\xBF\xBE\x03\x02\x02\x02\xC0\xCD\x03\x02\x02\x02\xC1\xC2\f\x06\x02" +
		"\x02\xC2\xC3\x05B\"\x02\xC3\xC4\x05(\x15\x07\xC4\xCC\x03\x02\x02\x02\xC5" +
		"\xC6\f\x04\x02\x02\xC6\xC7\x07\f\x02\x02\xC7\xC8\x05(\x15\x02\xC8\xC9" +
		"\x07\r\x02\x02\xC9\xCA\x05(\x15\x05\xCA\xCC\x03\x02\x02\x02\xCB\xC1\x03" +
		"\x02\x02\x02\xCB\xC5\x03\x02\x02\x02\xCC\xCF\x03\x02\x02\x02\xCD\xCB\x03" +
		"\x02\x02\x02\xCD\xCE\x03\x02\x02\x02\xCE)\x03\x02\x02\x02\xCF\xCD\x03" +
		"\x02\x02\x02\xD0\xD1\x07\x0E\x02\x02\xD1\xD2\x05\"\x12\x02\xD2\xD3\x07" +
		"\"\x02\x02\xD3\xD4\x05(\x15\x02\xD4\xD5\x07\r\x02\x02\xD5\xD6\x05(\x15" +
		"\x02\xD6+\x03\x02\x02\x02\xD7\xDB\x05:\x1E\x02\xD8\xDB\x05<\x1F\x02\xD9" +
		"\xDB\x05.\x18\x02\xDA\xD7\x03\x02\x02\x02\xDA\xD8\x03\x02\x02\x02\xDA" +
		"\xD9\x03\x02\x02\x02\xDB-\x03\x02\x02\x02\xDC\xE6\x07*\x02\x02\xDD\xE6" +
		"\x05@!\x02\xDE\xE6\x05> \x02\xDF\xE6\x05\"\x12\x02\xE0\xE6\x07,\x02\x02" +
		"\xE1\xE6\x07-\x02\x02\xE2\xE6\x058\x1D\x02\xE3\xE6\x050\x19\x02\xE4\xE6" +
		"\x07)\x02\x02\xE5\xDC\x03\x02\x02\x02\xE5\xDD\x03\x02\x02\x02\xE5\xDE" +
		"\x03\x02\x02\x02\xE5\xDF\x03\x02\x02\x02\xE5\xE0\x03\x02\x02\x02\xE5\xE1" +
		"\x03\x02\x02\x02\xE5\xE2\x03\x02\x02\x02\xE5\xE3\x03\x02\x02\x02\xE5\xE4" +
		"\x03\x02\x02\x02\xE6/\x03\x02\x02\x02\xE7\xE8\x052\x1A\x02\xE8\xE9\x07" +
		"\'\x02\x02\xE9\xEA\x054\x1B\x02\xEA\xEB\x07(\x02\x02\xEB\xF6\x03\x02\x02" +
		"\x02\xEC\xED\x07\x0F\x02\x02\xED\xF1\x07\'\x02\x02\xEE\xF0\v\x02\x02\x02" +
		"\xEF\xEE\x03\x02\x02\x02\xF0\xF3\x03\x02\x02\x02\xF1\xF2\x03\x02\x02\x02" +
		"\xF1\xEF\x03\x02\x02\x02\xF2\xF4\x03\x02\x02\x02\xF3\xF1\x03\x02\x02\x02" +
		"\xF4\xF6\x07(\x02\x02\xF5\xE7\x03\x02\x02\x02\xF5\xEC\x03\x02\x02\x02" +
		"\xF61\x03\x02\x02\x02\xF7\xF8\x070\x02\x02\xF83\x03\x02\x02\x02\xF9\u0103" +
		"\x03\x02\x02\x02\xFA\xFF\x05(\x15\x02\xFB\xFC\x07\x10\x02\x02\xFC\xFE" +
		"\x05(\x15\x02\xFD\xFB\x03\x02\x02\x02\xFE\u0101\x03\x02\x02\x02\xFF\xFD" +
		"\x03\x02\x02\x02\xFF\u0100\x03\x02\x02\x02\u0100\u0103\x03\x02\x02\x02" +
		"\u0101\xFF\x03\x02\x02\x02\u0102\xF9\x03\x02\x02\x02\u0102\xFA\x03\x02" +
		"\x02\x02\u01035\x03\x02\x02\x02\u0104\u0105\x07\x11\x02\x02\u0105\u0106" +
		"\x05(\x15\x02\u0106\u0107\x07\x12\x02\x02\u01077\x03\x02\x02\x02\u0108" +
		"\u0109\x07\x13\x02\x02\u0109\u010A\x07\'\x02\x02\u010A\u010B\x05(\x15" +
		"\x02\u010B\u010C\x07(\x02\x02\u010C9\x03\x02\x02\x02\u010D\u0119\x07\x11" +
		"\x02\x02\u010E\u0113\x05(\x15\x02\u010F\u0110\x07\x10\x02\x02\u0110\u0112" +
		"\x05(\x15\x02\u0111\u010F\x03\x02\x02\x02\u0112\u0115\x03\x02\x02\x02" +
		"\u0113\u0111\x03\x02\x02\x02\u0113\u0114\x03\x02\x02\x02\u0114\u0117\x03" +
		"\x02\x02\x02\u0115\u0113\x03\x02\x02\x02\u0116\u0118\x07\x10\x02\x02\u0117" +
		"\u0116\x03\x02\x02\x02\u0117\u0118\x03\x02\x02\x02\u0118\u011A\x03\x02" +
		"\x02\x02\u0119\u010E\x03\x02\x02\x02\u0119\u011A\x03\x02\x02\x02\u011A" +
		"\u011B\x03\x02\x02\x02\u011B\u011C\x07\x12\x02\x02\u011C;\x03\x02\x02" +
		"\x02\u011D\u0124\x07%\x02\x02\u011E\u0120\x05 \x11\x02\u011F\u0121\x07" +
		"\x10\x02\x02\u0120\u011F\x03\x02\x02\x02\u0120\u0121\x03\x02\x02\x02\u0121" +
		"\u0123\x03\x02\x02\x02\u0122\u011E\x03\x02\x02\x02\u0123\u0126\x03\x02" +
		"\x02\x02\u0124\u0122\x03\x02\x02\x02\u0124\u0125\x03\x02\x02\x02\u0125" +
		"\u0127\x03\x02\x02\x02\u0126\u0124\x03\x02\x02\x02\u0127\u0128\x07&\x02" +
		"\x02\u0128=\x03\x02\x02\x02\u0129\u012A\t\x04\x02\x02\u012A?\x03\x02\x02" +
		"\x02\u012B\u012D\t\x05\x02\x02\u012C\u012B\x03\x02\x02\x02\u012C\u012D" +
		"\x03\x02\x02\x02\u012D\u012E\x03\x02\x02\x02\u012E\u012F\x05D#\x02\u012F" +
		"A\x03\x02\x02\x02\u0130\u0131\t\x06\x02\x02\u0131C\x03\x02\x02\x02\u0132" +
		"\u0135\x07+\x02\x02\u0133\u0134\x07$\x02\x02\u0134\u0136\x07+\x02\x02" +
		"\u0135\u0133\x03\x02\x02\x02\u0135\u0136\x03\x02\x02\x02\u0136E\x03\x02" +
		"\x02\x02\x1DNPx\x88\x8A\x95\x9B\xA1\xA9\xB1\xB4\xBF\xCB\xCD\xDA\xE5\xF1" +
		"\xF5\xFF\u0102\u0113\u0117\u0119\u0120\u0124\u012C\u0135";
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!TerraformParser.__ATN) {
			TerraformParser.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(TerraformParser._serializedATN));
		}

		return TerraformParser.__ATN;
	}

}

export class File_Context extends ParserRuleContext {
	public EOF(): TerminalNode { return this.getToken(TerraformParser.EOF, 0); }
	public local(): LocalContext[];
	public local(i: number): LocalContext;
	public local(i?: number): LocalContext | LocalContext[] {
		if (i === undefined) {
			return this.getRuleContexts(LocalContext);
		} else {
			return this.getRuleContext(i, LocalContext);
		}
	}
	public module(): ModuleContext[];
	public module(i: number): ModuleContext;
	public module(i?: number): ModuleContext | ModuleContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ModuleContext);
		} else {
			return this.getRuleContext(i, ModuleContext);
		}
	}
	public output(): OutputContext[];
	public output(i: number): OutputContext;
	public output(i?: number): OutputContext | OutputContext[] {
		if (i === undefined) {
			return this.getRuleContexts(OutputContext);
		} else {
			return this.getRuleContext(i, OutputContext);
		}
	}
	public provider(): ProviderContext[];
	public provider(i: number): ProviderContext;
	public provider(i?: number): ProviderContext | ProviderContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ProviderContext);
		} else {
			return this.getRuleContext(i, ProviderContext);
		}
	}
	public variable(): VariableContext[];
	public variable(i: number): VariableContext;
	public variable(i?: number): VariableContext | VariableContext[] {
		if (i === undefined) {
			return this.getRuleContexts(VariableContext);
		} else {
			return this.getRuleContext(i, VariableContext);
		}
	}
	public data(): DataContext[];
	public data(i: number): DataContext;
	public data(i?: number): DataContext | DataContext[] {
		if (i === undefined) {
			return this.getRuleContexts(DataContext);
		} else {
			return this.getRuleContext(i, DataContext);
		}
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
	public terraform(): TerraformContext[];
	public terraform(i: number): TerraformContext;
	public terraform(i?: number): TerraformContext | TerraformContext[] {
		if (i === undefined) {
			return this.getRuleContexts(TerraformContext);
		} else {
			return this.getRuleContext(i, TerraformContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TerraformParser.RULE_file_; }
	// @Override
	public enterRule(listener: TerraformListener): void {
		if (listener.enterFile_) {
			listener.enterFile_(this);
		}
	}
	// @Override
	public exitRule(listener: TerraformListener): void {
		if (listener.exitFile_) {
			listener.exitFile_(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TerraformVisitor<Result>): Result {
		if (visitor.visitFile_) {
			return visitor.visitFile_(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TerraformContext extends ParserRuleContext {
	public blockbody(): BlockbodyContext {
		return this.getRuleContext(0, BlockbodyContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TerraformParser.RULE_terraform; }
	// @Override
	public enterRule(listener: TerraformListener): void {
		if (listener.enterTerraform) {
			listener.enterTerraform(this);
		}
	}
	// @Override
	public exitRule(listener: TerraformListener): void {
		if (listener.exitTerraform) {
			listener.exitTerraform(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TerraformVisitor<Result>): Result {
		if (visitor.visitTerraform) {
			return visitor.visitTerraform(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ResourceContext extends ParserRuleContext {
	public resourcetype(): ResourcetypeContext {
		return this.getRuleContext(0, ResourcetypeContext);
	}
	public name(): NameContext {
		return this.getRuleContext(0, NameContext);
	}
	public blockbody(): BlockbodyContext {
		return this.getRuleContext(0, BlockbodyContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TerraformParser.RULE_resource; }
	// @Override
	public enterRule(listener: TerraformListener): void {
		if (listener.enterResource) {
			listener.enterResource(this);
		}
	}
	// @Override
	public exitRule(listener: TerraformListener): void {
		if (listener.exitResource) {
			listener.exitResource(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TerraformVisitor<Result>): Result {
		if (visitor.visitResource) {
			return visitor.visitResource(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DataContext extends ParserRuleContext {
	public resourcetype(): ResourcetypeContext {
		return this.getRuleContext(0, ResourcetypeContext);
	}
	public name(): NameContext {
		return this.getRuleContext(0, NameContext);
	}
	public blockbody(): BlockbodyContext {
		return this.getRuleContext(0, BlockbodyContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TerraformParser.RULE_data; }
	// @Override
	public enterRule(listener: TerraformListener): void {
		if (listener.enterData) {
			listener.enterData(this);
		}
	}
	// @Override
	public exitRule(listener: TerraformListener): void {
		if (listener.exitData) {
			listener.exitData(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TerraformVisitor<Result>): Result {
		if (visitor.visitData) {
			return visitor.visitData(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ProviderContext extends ParserRuleContext {
	public PROVIDER(): TerminalNode { return this.getToken(TerraformParser.PROVIDER, 0); }
	public resourcetype(): ResourcetypeContext {
		return this.getRuleContext(0, ResourcetypeContext);
	}
	public blockbody(): BlockbodyContext {
		return this.getRuleContext(0, BlockbodyContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TerraformParser.RULE_provider; }
	// @Override
	public enterRule(listener: TerraformListener): void {
		if (listener.enterProvider) {
			listener.enterProvider(this);
		}
	}
	// @Override
	public exitRule(listener: TerraformListener): void {
		if (listener.exitProvider) {
			listener.exitProvider(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TerraformVisitor<Result>): Result {
		if (visitor.visitProvider) {
			return visitor.visitProvider(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class OutputContext extends ParserRuleContext {
	public name(): NameContext {
		return this.getRuleContext(0, NameContext);
	}
	public blockbody(): BlockbodyContext {
		return this.getRuleContext(0, BlockbodyContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TerraformParser.RULE_output; }
	// @Override
	public enterRule(listener: TerraformListener): void {
		if (listener.enterOutput) {
			listener.enterOutput(this);
		}
	}
	// @Override
	public exitRule(listener: TerraformListener): void {
		if (listener.exitOutput) {
			listener.exitOutput(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TerraformVisitor<Result>): Result {
		if (visitor.visitOutput) {
			return visitor.visitOutput(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LocalContext extends ParserRuleContext {
	public blockbody(): BlockbodyContext {
		return this.getRuleContext(0, BlockbodyContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TerraformParser.RULE_local; }
	// @Override
	public enterRule(listener: TerraformListener): void {
		if (listener.enterLocal) {
			listener.enterLocal(this);
		}
	}
	// @Override
	public exitRule(listener: TerraformListener): void {
		if (listener.exitLocal) {
			listener.exitLocal(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TerraformVisitor<Result>): Result {
		if (visitor.visitLocal) {
			return visitor.visitLocal(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ModuleContext extends ParserRuleContext {
	public name(): NameContext {
		return this.getRuleContext(0, NameContext);
	}
	public blockbody(): BlockbodyContext {
		return this.getRuleContext(0, BlockbodyContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TerraformParser.RULE_module; }
	// @Override
	public enterRule(listener: TerraformListener): void {
		if (listener.enterModule) {
			listener.enterModule(this);
		}
	}
	// @Override
	public exitRule(listener: TerraformListener): void {
		if (listener.exitModule) {
			listener.exitModule(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TerraformVisitor<Result>): Result {
		if (visitor.visitModule) {
			return visitor.visitModule(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VariableContext extends ParserRuleContext {
	public VARIABLE(): TerminalNode { return this.getToken(TerraformParser.VARIABLE, 0); }
	public name(): NameContext {
		return this.getRuleContext(0, NameContext);
	}
	public blockbody(): BlockbodyContext {
		return this.getRuleContext(0, BlockbodyContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TerraformParser.RULE_variable; }
	// @Override
	public enterRule(listener: TerraformListener): void {
		if (listener.enterVariable) {
			listener.enterVariable(this);
		}
	}
	// @Override
	public exitRule(listener: TerraformListener): void {
		if (listener.exitVariable) {
			listener.exitVariable(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TerraformVisitor<Result>): Result {
		if (visitor.visitVariable) {
			return visitor.visitVariable(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BlockContext extends ParserRuleContext {
	public blocktype(): BlocktypeContext {
		return this.getRuleContext(0, BlocktypeContext);
	}
	public blockbody(): BlockbodyContext {
		return this.getRuleContext(0, BlockbodyContext);
	}
	public label(): LabelContext[];
	public label(i: number): LabelContext;
	public label(i?: number): LabelContext | LabelContext[] {
		if (i === undefined) {
			return this.getRuleContexts(LabelContext);
		} else {
			return this.getRuleContext(i, LabelContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TerraformParser.RULE_block; }
	// @Override
	public enterRule(listener: TerraformListener): void {
		if (listener.enterBlock) {
			listener.enterBlock(this);
		}
	}
	// @Override
	public exitRule(listener: TerraformListener): void {
		if (listener.exitBlock) {
			listener.exitBlock(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TerraformVisitor<Result>): Result {
		if (visitor.visitBlock) {
			return visitor.visitBlock(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BlocktypeContext extends ParserRuleContext {
	public IDENTIFIER(): TerminalNode { return this.getToken(TerraformParser.IDENTIFIER, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TerraformParser.RULE_blocktype; }
	// @Override
	public enterRule(listener: TerraformListener): void {
		if (listener.enterBlocktype) {
			listener.enterBlocktype(this);
		}
	}
	// @Override
	public exitRule(listener: TerraformListener): void {
		if (listener.exitBlocktype) {
			listener.exitBlocktype(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TerraformVisitor<Result>): Result {
		if (visitor.visitBlocktype) {
			return visitor.visitBlocktype(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ResourcetypeContext extends ParserRuleContext {
	public STRING(): TerminalNode { return this.getToken(TerraformParser.STRING, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TerraformParser.RULE_resourcetype; }
	// @Override
	public enterRule(listener: TerraformListener): void {
		if (listener.enterResourcetype) {
			listener.enterResourcetype(this);
		}
	}
	// @Override
	public exitRule(listener: TerraformListener): void {
		if (listener.exitResourcetype) {
			listener.exitResourcetype(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TerraformVisitor<Result>): Result {
		if (visitor.visitResourcetype) {
			return visitor.visitResourcetype(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NameContext extends ParserRuleContext {
	public STRING(): TerminalNode { return this.getToken(TerraformParser.STRING, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TerraformParser.RULE_name; }
	// @Override
	public enterRule(listener: TerraformListener): void {
		if (listener.enterName) {
			listener.enterName(this);
		}
	}
	// @Override
	public exitRule(listener: TerraformListener): void {
		if (listener.exitName) {
			listener.exitName(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TerraformVisitor<Result>): Result {
		if (visitor.visitName) {
			return visitor.visitName(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LabelContext extends ParserRuleContext {
	public STRING(): TerminalNode { return this.getToken(TerraformParser.STRING, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TerraformParser.RULE_label; }
	// @Override
	public enterRule(listener: TerraformListener): void {
		if (listener.enterLabel) {
			listener.enterLabel(this);
		}
	}
	// @Override
	public exitRule(listener: TerraformListener): void {
		if (listener.exitLabel) {
			listener.exitLabel(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TerraformVisitor<Result>): Result {
		if (visitor.visitLabel) {
			return visitor.visitLabel(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BlockbodyContext extends ParserRuleContext {
	public LCURL(): TerminalNode { return this.getToken(TerraformParser.LCURL, 0); }
	public RCURL(): TerminalNode { return this.getToken(TerraformParser.RCURL, 0); }
	public argument(): ArgumentContext[];
	public argument(i: number): ArgumentContext;
	public argument(i?: number): ArgumentContext | ArgumentContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ArgumentContext);
		} else {
			return this.getRuleContext(i, ArgumentContext);
		}
	}
	public block(): BlockContext[];
	public block(i: number): BlockContext;
	public block(i?: number): BlockContext | BlockContext[] {
		if (i === undefined) {
			return this.getRuleContexts(BlockContext);
		} else {
			return this.getRuleContext(i, BlockContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TerraformParser.RULE_blockbody; }
	// @Override
	public enterRule(listener: TerraformListener): void {
		if (listener.enterBlockbody) {
			listener.enterBlockbody(this);
		}
	}
	// @Override
	public exitRule(listener: TerraformListener): void {
		if (listener.exitBlockbody) {
			listener.exitBlockbody(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TerraformVisitor<Result>): Result {
		if (visitor.visitBlockbody) {
			return visitor.visitBlockbody(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ArgumentContext extends ParserRuleContext {
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TerraformParser.RULE_argument; }
	// @Override
	public enterRule(listener: TerraformListener): void {
		if (listener.enterArgument) {
			listener.enterArgument(this);
		}
	}
	// @Override
	public exitRule(listener: TerraformListener): void {
		if (listener.exitArgument) {
			listener.exitArgument(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TerraformVisitor<Result>): Result {
		if (visitor.visitArgument) {
			return visitor.visitArgument(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class IdentifierContext extends ParserRuleContext {
	public identifierchain(): IdentifierchainContext {
		return this.getRuleContext(0, IdentifierchainContext);
	}
	public DOT(): TerminalNode | undefined { return this.tryGetToken(TerraformParser.DOT, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TerraformParser.RULE_identifier; }
	// @Override
	public enterRule(listener: TerraformListener): void {
		if (listener.enterIdentifier) {
			listener.enterIdentifier(this);
		}
	}
	// @Override
	public exitRule(listener: TerraformListener): void {
		if (listener.exitIdentifier) {
			listener.exitIdentifier(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TerraformVisitor<Result>): Result {
		if (visitor.visitIdentifier) {
			return visitor.visitIdentifier(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class IdentifierchainContext extends ParserRuleContext {
	public IDENTIFIER(): TerminalNode | undefined { return this.tryGetToken(TerraformParser.IDENTIFIER, 0); }
	public IN(): TerminalNode | undefined { return this.tryGetToken(TerraformParser.IN, 0); }
	public VARIABLE(): TerminalNode | undefined { return this.tryGetToken(TerraformParser.VARIABLE, 0); }
	public PROVIDER(): TerminalNode | undefined { return this.tryGetToken(TerraformParser.PROVIDER, 0); }
	public index(): IndexContext | undefined {
		return this.tryGetRuleContext(0, IndexContext);
	}
	public DOT(): TerminalNode[];
	public DOT(i: number): TerminalNode;
	public DOT(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(TerraformParser.DOT);
		} else {
			return this.getToken(TerraformParser.DOT, i);
		}
	}
	public identifierchain(): IdentifierchainContext[];
	public identifierchain(i: number): IdentifierchainContext;
	public identifierchain(i?: number): IdentifierchainContext | IdentifierchainContext[] {
		if (i === undefined) {
			return this.getRuleContexts(IdentifierchainContext);
		} else {
			return this.getRuleContext(i, IdentifierchainContext);
		}
	}
	public STAR(): TerminalNode | undefined { return this.tryGetToken(TerraformParser.STAR, 0); }
	public inline_index(): Inline_indexContext | undefined {
		return this.tryGetRuleContext(0, Inline_indexContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TerraformParser.RULE_identifierchain; }
	// @Override
	public enterRule(listener: TerraformListener): void {
		if (listener.enterIdentifierchain) {
			listener.enterIdentifierchain(this);
		}
	}
	// @Override
	public exitRule(listener: TerraformListener): void {
		if (listener.exitIdentifierchain) {
			listener.exitIdentifierchain(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TerraformVisitor<Result>): Result {
		if (visitor.visitIdentifierchain) {
			return visitor.visitIdentifierchain(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Inline_indexContext extends ParserRuleContext {
	public NATURAL_NUMBER(): TerminalNode { return this.getToken(TerraformParser.NATURAL_NUMBER, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TerraformParser.RULE_inline_index; }
	// @Override
	public enterRule(listener: TerraformListener): void {
		if (listener.enterInline_index) {
			listener.enterInline_index(this);
		}
	}
	// @Override
	public exitRule(listener: TerraformListener): void {
		if (listener.exitInline_index) {
			listener.exitInline_index(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TerraformVisitor<Result>): Result {
		if (visitor.visitInline_index) {
			return visitor.visitInline_index(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExpressionContext extends ParserRuleContext {
	public section(): SectionContext | undefined {
		return this.tryGetRuleContext(0, SectionContext);
	}
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	public operator_(): Operator_Context | undefined {
		return this.tryGetRuleContext(0, Operator_Context);
	}
	public LPAREN(): TerminalNode | undefined { return this.tryGetToken(TerraformParser.LPAREN, 0); }
	public RPAREN(): TerminalNode | undefined { return this.tryGetToken(TerraformParser.RPAREN, 0); }
	public forloop(): ForloopContext | undefined {
		return this.tryGetRuleContext(0, ForloopContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TerraformParser.RULE_expression; }
	// @Override
	public enterRule(listener: TerraformListener): void {
		if (listener.enterExpression) {
			listener.enterExpression(this);
		}
	}
	// @Override
	public exitRule(listener: TerraformListener): void {
		if (listener.exitExpression) {
			listener.exitExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TerraformVisitor<Result>): Result {
		if (visitor.visitExpression) {
			return visitor.visitExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ForloopContext extends ParserRuleContext {
	public identifier(): IdentifierContext {
		return this.getRuleContext(0, IdentifierContext);
	}
	public IN(): TerminalNode { return this.getToken(TerraformParser.IN, 0); }
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TerraformParser.RULE_forloop; }
	// @Override
	public enterRule(listener: TerraformListener): void {
		if (listener.enterForloop) {
			listener.enterForloop(this);
		}
	}
	// @Override
	public exitRule(listener: TerraformListener): void {
		if (listener.exitForloop) {
			listener.exitForloop(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TerraformVisitor<Result>): Result {
		if (visitor.visitForloop) {
			return visitor.visitForloop(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SectionContext extends ParserRuleContext {
	public list_(): List_Context | undefined {
		return this.tryGetRuleContext(0, List_Context);
	}
	public map_(): Map_Context | undefined {
		return this.tryGetRuleContext(0, Map_Context);
	}
	public val(): ValContext | undefined {
		return this.tryGetRuleContext(0, ValContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TerraformParser.RULE_section; }
	// @Override
	public enterRule(listener: TerraformListener): void {
		if (listener.enterSection) {
			listener.enterSection(this);
		}
	}
	// @Override
	public exitRule(listener: TerraformListener): void {
		if (listener.exitSection) {
			listener.exitSection(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TerraformVisitor<Result>): Result {
		if (visitor.visitSection) {
			return visitor.visitSection(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ValContext extends ParserRuleContext {
	public NULL_(): TerminalNode | undefined { return this.tryGetToken(TerraformParser.NULL_, 0); }
	public signed_number(): Signed_numberContext | undefined {
		return this.tryGetRuleContext(0, Signed_numberContext);
	}
	public string(): StringContext | undefined {
		return this.tryGetRuleContext(0, StringContext);
	}
	public identifier(): IdentifierContext | undefined {
		return this.tryGetRuleContext(0, IdentifierContext);
	}
	public BOOL(): TerminalNode | undefined { return this.tryGetToken(TerraformParser.BOOL, 0); }
	public DESCRIPTION(): TerminalNode | undefined { return this.tryGetToken(TerraformParser.DESCRIPTION, 0); }
	public filedecl(): FiledeclContext | undefined {
		return this.tryGetRuleContext(0, FiledeclContext);
	}
	public functioncall(): FunctioncallContext | undefined {
		return this.tryGetRuleContext(0, FunctioncallContext);
	}
	public EOF_(): TerminalNode | undefined { return this.tryGetToken(TerraformParser.EOF_, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TerraformParser.RULE_val; }
	// @Override
	public enterRule(listener: TerraformListener): void {
		if (listener.enterVal) {
			listener.enterVal(this);
		}
	}
	// @Override
	public exitRule(listener: TerraformListener): void {
		if (listener.exitVal) {
			listener.exitVal(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TerraformVisitor<Result>): Result {
		if (visitor.visitVal) {
			return visitor.visitVal(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FunctioncallContext extends ParserRuleContext {
	public functionname(): FunctionnameContext | undefined {
		return this.tryGetRuleContext(0, FunctionnameContext);
	}
	public LPAREN(): TerminalNode { return this.getToken(TerraformParser.LPAREN, 0); }
	public functionarguments(): FunctionargumentsContext | undefined {
		return this.tryGetRuleContext(0, FunctionargumentsContext);
	}
	public RPAREN(): TerminalNode { return this.getToken(TerraformParser.RPAREN, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TerraformParser.RULE_functioncall; }
	// @Override
	public enterRule(listener: TerraformListener): void {
		if (listener.enterFunctioncall) {
			listener.enterFunctioncall(this);
		}
	}
	// @Override
	public exitRule(listener: TerraformListener): void {
		if (listener.exitFunctioncall) {
			listener.exitFunctioncall(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TerraformVisitor<Result>): Result {
		if (visitor.visitFunctioncall) {
			return visitor.visitFunctioncall(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FunctionnameContext extends ParserRuleContext {
	public IDENTIFIER(): TerminalNode { return this.getToken(TerraformParser.IDENTIFIER, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TerraformParser.RULE_functionname; }
	// @Override
	public enterRule(listener: TerraformListener): void {
		if (listener.enterFunctionname) {
			listener.enterFunctionname(this);
		}
	}
	// @Override
	public exitRule(listener: TerraformListener): void {
		if (listener.exitFunctionname) {
			listener.exitFunctionname(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TerraformVisitor<Result>): Result {
		if (visitor.visitFunctionname) {
			return visitor.visitFunctionname(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FunctionargumentsContext extends ParserRuleContext {
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TerraformParser.RULE_functionarguments; }
	// @Override
	public enterRule(listener: TerraformListener): void {
		if (listener.enterFunctionarguments) {
			listener.enterFunctionarguments(this);
		}
	}
	// @Override
	public exitRule(listener: TerraformListener): void {
		if (listener.exitFunctionarguments) {
			listener.exitFunctionarguments(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TerraformVisitor<Result>): Result {
		if (visitor.visitFunctionarguments) {
			return visitor.visitFunctionarguments(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class IndexContext extends ParserRuleContext {
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TerraformParser.RULE_index; }
	// @Override
	public enterRule(listener: TerraformListener): void {
		if (listener.enterIndex) {
			listener.enterIndex(this);
		}
	}
	// @Override
	public exitRule(listener: TerraformListener): void {
		if (listener.exitIndex) {
			listener.exitIndex(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TerraformVisitor<Result>): Result {
		if (visitor.visitIndex) {
			return visitor.visitIndex(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FiledeclContext extends ParserRuleContext {
	public LPAREN(): TerminalNode { return this.getToken(TerraformParser.LPAREN, 0); }
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	public RPAREN(): TerminalNode { return this.getToken(TerraformParser.RPAREN, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TerraformParser.RULE_filedecl; }
	// @Override
	public enterRule(listener: TerraformListener): void {
		if (listener.enterFiledecl) {
			listener.enterFiledecl(this);
		}
	}
	// @Override
	public exitRule(listener: TerraformListener): void {
		if (listener.exitFiledecl) {
			listener.exitFiledecl(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TerraformVisitor<Result>): Result {
		if (visitor.visitFiledecl) {
			return visitor.visitFiledecl(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class List_Context extends ParserRuleContext {
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TerraformParser.RULE_list_; }
	// @Override
	public enterRule(listener: TerraformListener): void {
		if (listener.enterList_) {
			listener.enterList_(this);
		}
	}
	// @Override
	public exitRule(listener: TerraformListener): void {
		if (listener.exitList_) {
			listener.exitList_(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TerraformVisitor<Result>): Result {
		if (visitor.visitList_) {
			return visitor.visitList_(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Map_Context extends ParserRuleContext {
	public LCURL(): TerminalNode { return this.getToken(TerraformParser.LCURL, 0); }
	public RCURL(): TerminalNode { return this.getToken(TerraformParser.RCURL, 0); }
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
	public get ruleIndex(): number { return TerraformParser.RULE_map_; }
	// @Override
	public enterRule(listener: TerraformListener): void {
		if (listener.enterMap_) {
			listener.enterMap_(this);
		}
	}
	// @Override
	public exitRule(listener: TerraformListener): void {
		if (listener.exitMap_) {
			listener.exitMap_(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TerraformVisitor<Result>): Result {
		if (visitor.visitMap_) {
			return visitor.visitMap_(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class StringContext extends ParserRuleContext {
	public STRING(): TerminalNode | undefined { return this.tryGetToken(TerraformParser.STRING, 0); }
	public MULTILINESTRING(): TerminalNode | undefined { return this.tryGetToken(TerraformParser.MULTILINESTRING, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TerraformParser.RULE_string; }
	// @Override
	public enterRule(listener: TerraformListener): void {
		if (listener.enterString) {
			listener.enterString(this);
		}
	}
	// @Override
	public exitRule(listener: TerraformListener): void {
		if (listener.exitString) {
			listener.exitString(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TerraformVisitor<Result>): Result {
		if (visitor.visitString) {
			return visitor.visitString(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Signed_numberContext extends ParserRuleContext {
	public number(): NumberContext {
		return this.getRuleContext(0, NumberContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TerraformParser.RULE_signed_number; }
	// @Override
	public enterRule(listener: TerraformListener): void {
		if (listener.enterSigned_number) {
			listener.enterSigned_number(this);
		}
	}
	// @Override
	public exitRule(listener: TerraformListener): void {
		if (listener.exitSigned_number) {
			listener.exitSigned_number(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TerraformVisitor<Result>): Result {
		if (visitor.visitSigned_number) {
			return visitor.visitSigned_number(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Operator_Context extends ParserRuleContext {
	public STAR(): TerminalNode { return this.getToken(TerraformParser.STAR, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TerraformParser.RULE_operator_; }
	// @Override
	public enterRule(listener: TerraformListener): void {
		if (listener.enterOperator_) {
			listener.enterOperator_(this);
		}
	}
	// @Override
	public exitRule(listener: TerraformListener): void {
		if (listener.exitOperator_) {
			listener.exitOperator_(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TerraformVisitor<Result>): Result {
		if (visitor.visitOperator_) {
			return visitor.visitOperator_(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NumberContext extends ParserRuleContext {
	public NATURAL_NUMBER(): TerminalNode[];
	public NATURAL_NUMBER(i: number): TerminalNode;
	public NATURAL_NUMBER(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(TerraformParser.NATURAL_NUMBER);
		} else {
			return this.getToken(TerraformParser.NATURAL_NUMBER, i);
		}
	}
	public DOT(): TerminalNode | undefined { return this.tryGetToken(TerraformParser.DOT, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return TerraformParser.RULE_number; }
	// @Override
	public enterRule(listener: TerraformListener): void {
		if (listener.enterNumber) {
			listener.enterNumber(this);
		}
	}
	// @Override
	public exitRule(listener: TerraformListener): void {
		if (listener.exitNumber) {
			listener.exitNumber(this);
		}
	}
	// @Override
	public accept<Result>(visitor: TerraformVisitor<Result>): Result {
		if (visitor.visitNumber) {
			return visitor.visitNumber(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


