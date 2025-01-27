// Generated from /Users/gordon/Documents/code/policy-validation-action/Policy.g4 by ANTLR 4.13.1
import org.antlr.v4.runtime.atn.*;
import org.antlr.v4.runtime.dfa.DFA;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.misc.*;
import org.antlr.v4.runtime.tree.*;
import java.util.List;
import java.util.Iterator;
import java.util.ArrayList;

@SuppressWarnings({"all", "warnings", "unchecked", "unused", "cast", "CheckReturnValue"})
public class PolicyParser extends Parser {
	static { RuntimeMetaData.checkVersion("4.13.1", RuntimeMetaData.VERSION); }

	protected static final DFA[] _decisionToDFA;
	protected static final PredictionContextCache _sharedContextCache =
		new PredictionContextCache();
	public static final int
		T__0=1, T__1=2, T__2=3, T__3=4, T__4=5, T__5=6, T__6=7, T__7=8, T__8=9, 
		T__9=10, T__10=11, T__11=12, T__12=13, BEFORE=14, BETWEEN=15, NEWLINE=16, 
		QUOTED_STRING=17, WS=18, ANYUSER=19, ANYTENANCY=20, ENDORSE=21, ALLOW=22, 
		DEFINE=23, RESOURCE=24, TO=25, OF=26, IN=27, WHERE=28, WITH=29, DYNAMICGROUP=30, 
		GROUP=31, SERVICE=32, COMPARTMENT=33, TENANCY=34, READ=35, INSPECT=36, 
		MANAGE=37, ASSOCIATE=38, ADMIT=39, USE=40, ANY=41, AND=42, ALL=43, AS=44, 
		ID=45, HCL_VAR=46, WORD=47;
	public static final int
		RULE_policy = 0, RULE_allowExpression = 1, RULE_endorseExpression = 2, 
		RULE_defineExpression = 3, RULE_admitExpression = 4, RULE_endorseVerb = 5, 
		RULE_verb = 6, RULE_permissionList = 7, RULE_scope = 8, RULE_endorseScope = 9, 
		RULE_subject = 10, RULE_groupSubject = 11, RULE_resourceSubject = 12, 
		RULE_serviceSubject = 13, RULE_groupName = 14, RULE_resourceSubjectId = 15, 
		RULE_serviceSubjectId = 16, RULE_groupID = 17, RULE_dynamicGroupSubject = 18, 
		RULE_tenancySubject = 19, RULE_definedSubject = 20, RULE_defined = 21, 
		RULE_resource = 22, RULE_condition = 23, RULE_comparison = 24, RULE_variable = 25, 
		RULE_operator = 26, RULE_value = 27, RULE_valueList = 28, RULE_timeWindow = 29, 
		RULE_comparisonList = 30, RULE_logicalCombine = 31, RULE_patternMatch = 32;
	private static String[] makeRuleNames() {
		return new String[] {
			"policy", "allowExpression", "endorseExpression", "defineExpression", 
			"admitExpression", "endorseVerb", "verb", "permissionList", "scope", 
			"endorseScope", "subject", "groupSubject", "resourceSubject", "serviceSubject", 
			"groupName", "resourceSubjectId", "serviceSubjectId", "groupID", "dynamicGroupSubject", 
			"tenancySubject", "definedSubject", "defined", "resource", "condition", 
			"comparison", "variable", "operator", "value", "valueList", "timeWindow", 
			"comparisonList", "logicalCombine", "patternMatch"
		};
	}
	public static final String[] ruleNames = makeRuleNames();

	private static String[] makeLiteralNames() {
		return new String[] {
			null, "'{'", "','", "'}'", "':'", "'/'", "'''", "'.'", "'='", "'!'", 
			"'('", "')'", "'*/'", "'/*'"
		};
	}
	private static final String[] _LITERAL_NAMES = makeLiteralNames();
	private static String[] makeSymbolicNames() {
		return new String[] {
			null, null, null, null, null, null, null, null, null, null, null, null, 
			null, null, "BEFORE", "BETWEEN", "NEWLINE", "QUOTED_STRING", "WS", "ANYUSER", 
			"ANYTENANCY", "ENDORSE", "ALLOW", "DEFINE", "RESOURCE", "TO", "OF", "IN", 
			"WHERE", "WITH", "DYNAMICGROUP", "GROUP", "SERVICE", "COMPARTMENT", "TENANCY", 
			"READ", "INSPECT", "MANAGE", "ASSOCIATE", "ADMIT", "USE", "ANY", "AND", 
			"ALL", "AS", "ID", "HCL_VAR", "WORD"
		};
	}
	private static final String[] _SYMBOLIC_NAMES = makeSymbolicNames();
	public static final Vocabulary VOCABULARY = new VocabularyImpl(_LITERAL_NAMES, _SYMBOLIC_NAMES);

	/**
	 * @deprecated Use {@link #VOCABULARY} instead.
	 */
	@Deprecated
	public static final String[] tokenNames;
	static {
		tokenNames = new String[_SYMBOLIC_NAMES.length];
		for (int i = 0; i < tokenNames.length; i++) {
			tokenNames[i] = VOCABULARY.getLiteralName(i);
			if (tokenNames[i] == null) {
				tokenNames[i] = VOCABULARY.getSymbolicName(i);
			}

			if (tokenNames[i] == null) {
				tokenNames[i] = "<INVALID>";
			}
		}
	}

	@Override
	@Deprecated
	public String[] getTokenNames() {
		return tokenNames;
	}

	@Override

	public Vocabulary getVocabulary() {
		return VOCABULARY;
	}

	@Override
	public String getGrammarFileName() { return "Policy.g4"; }

	@Override
	public String[] getRuleNames() { return ruleNames; }

	@Override
	public String getSerializedATN() { return _serializedATN; }

	@Override
	public ATN getATN() { return _ATN; }

	public PolicyParser(TokenStream input) {
		super(input);
		_interp = new ParserATNSimulator(this,_ATN,_decisionToDFA,_sharedContextCache);
	}

	@SuppressWarnings("CheckReturnValue")
	public static class PolicyContext extends ParserRuleContext {
		public TerminalNode EOF() { return getToken(PolicyParser.EOF, 0); }
		public List<AllowExpressionContext> allowExpression() {
			return getRuleContexts(AllowExpressionContext.class);
		}
		public AllowExpressionContext allowExpression(int i) {
			return getRuleContext(AllowExpressionContext.class,i);
		}
		public List<EndorseExpressionContext> endorseExpression() {
			return getRuleContexts(EndorseExpressionContext.class);
		}
		public EndorseExpressionContext endorseExpression(int i) {
			return getRuleContext(EndorseExpressionContext.class,i);
		}
		public List<DefineExpressionContext> defineExpression() {
			return getRuleContexts(DefineExpressionContext.class);
		}
		public DefineExpressionContext defineExpression(int i) {
			return getRuleContext(DefineExpressionContext.class,i);
		}
		public List<AdmitExpressionContext> admitExpression() {
			return getRuleContexts(AdmitExpressionContext.class);
		}
		public AdmitExpressionContext admitExpression(int i) {
			return getRuleContext(AdmitExpressionContext.class,i);
		}
		public PolicyContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_policy; }
	}

	public final PolicyContext policy() throws RecognitionException {
		PolicyContext _localctx = new PolicyContext(_ctx, getState());
		enterRule(_localctx, 0, RULE_policy);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(70); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				setState(70);
				_errHandler.sync(this);
				switch (_input.LA(1)) {
				case ALLOW:
					{
					setState(66);
					allowExpression();
					}
					break;
				case ENDORSE:
					{
					setState(67);
					endorseExpression();
					}
					break;
				case DEFINE:
					{
					setState(68);
					defineExpression();
					}
					break;
				case ADMIT:
					{
					setState(69);
					admitExpression();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				setState(72); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( (((_la) & ~0x3f) == 0 && ((1L << _la) & 549770493952L) != 0) );
			setState(74);
			match(EOF);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class AllowExpressionContext extends ParserRuleContext {
		public TerminalNode ALLOW() { return getToken(PolicyParser.ALLOW, 0); }
		public SubjectContext subject() {
			return getRuleContext(SubjectContext.class,0);
		}
		public TerminalNode IN() { return getToken(PolicyParser.IN, 0); }
		public ScopeContext scope() {
			return getRuleContext(ScopeContext.class,0);
		}
		public VerbContext verb() {
			return getRuleContext(VerbContext.class,0);
		}
		public ResourceContext resource() {
			return getRuleContext(ResourceContext.class,0);
		}
		public PermissionListContext permissionList() {
			return getRuleContext(PermissionListContext.class,0);
		}
		public TerminalNode WHERE() { return getToken(PolicyParser.WHERE, 0); }
		public ConditionContext condition() {
			return getRuleContext(ConditionContext.class,0);
		}
		public TerminalNode NEWLINE() { return getToken(PolicyParser.NEWLINE, 0); }
		public TerminalNode TO() { return getToken(PolicyParser.TO, 0); }
		public AllowExpressionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_allowExpression; }
	}

	public final AllowExpressionContext allowExpression() throws RecognitionException {
		AllowExpressionContext _localctx = new AllowExpressionContext(_ctx, getState());
		enterRule(_localctx, 2, RULE_allowExpression);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(76);
			match(ALLOW);
			setState(77);
			subject();
			setState(88);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,4,_ctx) ) {
			case 1:
				{
				setState(79);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==TO) {
					{
					setState(78);
					match(TO);
					}
				}

				setState(81);
				verb();
				setState(82);
				resource();
				}
				break;
			case 2:
				{
				setState(85);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==TO) {
					{
					setState(84);
					match(TO);
					}
				}

				setState(87);
				permissionList();
				}
				break;
			}
			setState(90);
			match(IN);
			setState(91);
			scope();
			setState(94);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==WHERE) {
				{
				setState(92);
				match(WHERE);
				setState(93);
				condition();
				}
			}

			setState(97);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==NEWLINE) {
				{
				setState(96);
				match(NEWLINE);
				}
			}

			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class EndorseExpressionContext extends ParserRuleContext {
		public TerminalNode ENDORSE() { return getToken(PolicyParser.ENDORSE, 0); }
		public SubjectContext subject() {
			return getRuleContext(SubjectContext.class,0);
		}
		public List<TerminalNode> IN() { return getTokens(PolicyParser.IN); }
		public TerminalNode IN(int i) {
			return getToken(PolicyParser.IN, i);
		}
		public TerminalNode TO() { return getToken(PolicyParser.TO, 0); }
		public EndorseVerbContext endorseVerb() {
			return getRuleContext(EndorseVerbContext.class,0);
		}
		public List<ResourceContext> resource() {
			return getRuleContexts(ResourceContext.class);
		}
		public ResourceContext resource(int i) {
			return getRuleContext(ResourceContext.class,i);
		}
		public PermissionListContext permissionList() {
			return getRuleContext(PermissionListContext.class,0);
		}
		public EndorseScopeContext endorseScope() {
			return getRuleContext(EndorseScopeContext.class,0);
		}
		public TerminalNode WHERE() { return getToken(PolicyParser.WHERE, 0); }
		public ConditionContext condition() {
			return getRuleContext(ConditionContext.class,0);
		}
		public TerminalNode NEWLINE() { return getToken(PolicyParser.NEWLINE, 0); }
		public ScopeContext scope() {
			return getRuleContext(ScopeContext.class,0);
		}
		public TerminalNode WITH() { return getToken(PolicyParser.WITH, 0); }
		public EndorseExpressionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_endorseExpression; }
	}

	public final EndorseExpressionContext endorseExpression() throws RecognitionException {
		EndorseExpressionContext _localctx = new EndorseExpressionContext(_ctx, getState());
		enterRule(_localctx, 4, RULE_endorseExpression);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(99);
			match(ENDORSE);
			setState(100);
			subject();
			setState(109);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,8,_ctx) ) {
			case 1:
				{
				setState(101);
				match(TO);
				setState(102);
				endorseVerb();
				setState(103);
				resource();
				}
				break;
			case 2:
				{
				setState(106);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==TO) {
					{
					setState(105);
					match(TO);
					}
				}

				setState(108);
				permissionList();
				}
				break;
			}
			setState(111);
			match(IN);
			setState(119);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,9,_ctx) ) {
			case 1:
				{
				setState(112);
				endorseScope();
				}
				break;
			case 2:
				{
				{
				setState(113);
				scope();
				setState(114);
				match(WITH);
				setState(115);
				resource();
				setState(116);
				match(IN);
				setState(117);
				endorseScope();
				}
				}
				break;
			}
			setState(123);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==WHERE) {
				{
				setState(121);
				match(WHERE);
				setState(122);
				condition();
				}
			}

			setState(126);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==NEWLINE) {
				{
				setState(125);
				match(NEWLINE);
				}
			}

			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class DefineExpressionContext extends ParserRuleContext {
		public TerminalNode DEFINE() { return getToken(PolicyParser.DEFINE, 0); }
		public DefinedSubjectContext definedSubject() {
			return getRuleContext(DefinedSubjectContext.class,0);
		}
		public TerminalNode AS() { return getToken(PolicyParser.AS, 0); }
		public DefinedContext defined() {
			return getRuleContext(DefinedContext.class,0);
		}
		public TerminalNode NEWLINE() { return getToken(PolicyParser.NEWLINE, 0); }
		public DefineExpressionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_defineExpression; }
	}

	public final DefineExpressionContext defineExpression() throws RecognitionException {
		DefineExpressionContext _localctx = new DefineExpressionContext(_ctx, getState());
		enterRule(_localctx, 6, RULE_defineExpression);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(128);
			match(DEFINE);
			setState(129);
			definedSubject();
			setState(130);
			match(AS);
			setState(131);
			defined();
			setState(133);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==NEWLINE) {
				{
				setState(132);
				match(NEWLINE);
				}
			}

			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class AdmitExpressionContext extends ParserRuleContext {
		public TerminalNode ADMIT() { return getToken(PolicyParser.ADMIT, 0); }
		public SubjectContext subject() {
			return getRuleContext(SubjectContext.class,0);
		}
		public List<TerminalNode> IN() { return getTokens(PolicyParser.IN); }
		public TerminalNode IN(int i) {
			return getToken(PolicyParser.IN, i);
		}
		public ScopeContext scope() {
			return getRuleContext(ScopeContext.class,0);
		}
		public TerminalNode TO() { return getToken(PolicyParser.TO, 0); }
		public EndorseVerbContext endorseVerb() {
			return getRuleContext(EndorseVerbContext.class,0);
		}
		public List<ResourceContext> resource() {
			return getRuleContexts(ResourceContext.class);
		}
		public ResourceContext resource(int i) {
			return getRuleContext(ResourceContext.class,i);
		}
		public PermissionListContext permissionList() {
			return getRuleContext(PermissionListContext.class,0);
		}
		public TerminalNode OF() { return getToken(PolicyParser.OF, 0); }
		public List<EndorseScopeContext> endorseScope() {
			return getRuleContexts(EndorseScopeContext.class);
		}
		public EndorseScopeContext endorseScope(int i) {
			return getRuleContext(EndorseScopeContext.class,i);
		}
		public TerminalNode WITH() { return getToken(PolicyParser.WITH, 0); }
		public TerminalNode WHERE() { return getToken(PolicyParser.WHERE, 0); }
		public ConditionContext condition() {
			return getRuleContext(ConditionContext.class,0);
		}
		public TerminalNode NEWLINE() { return getToken(PolicyParser.NEWLINE, 0); }
		public AdmitExpressionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_admitExpression; }
	}

	public final AdmitExpressionContext admitExpression() throws RecognitionException {
		AdmitExpressionContext _localctx = new AdmitExpressionContext(_ctx, getState());
		enterRule(_localctx, 8, RULE_admitExpression);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(135);
			match(ADMIT);
			setState(136);
			subject();
			setState(139);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==OF) {
				{
				setState(137);
				match(OF);
				setState(138);
				endorseScope();
				}
			}

			setState(149);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,15,_ctx) ) {
			case 1:
				{
				setState(141);
				match(TO);
				setState(142);
				endorseVerb();
				setState(143);
				resource();
				}
				break;
			case 2:
				{
				setState(146);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==TO) {
					{
					setState(145);
					match(TO);
					}
				}

				setState(148);
				permissionList();
				}
				break;
			}
			setState(151);
			match(IN);
			setState(152);
			scope();
			setState(158);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==WITH) {
				{
				setState(153);
				match(WITH);
				setState(154);
				resource();
				setState(155);
				match(IN);
				setState(156);
				endorseScope();
				}
			}

			setState(162);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==WHERE) {
				{
				setState(160);
				match(WHERE);
				setState(161);
				condition();
				}
			}

			setState(165);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==NEWLINE) {
				{
				setState(164);
				match(NEWLINE);
				}
			}

			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class EndorseVerbContext extends ParserRuleContext {
		public VerbContext verb() {
			return getRuleContext(VerbContext.class,0);
		}
		public TerminalNode ASSOCIATE() { return getToken(PolicyParser.ASSOCIATE, 0); }
		public EndorseVerbContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_endorseVerb; }
	}

	public final EndorseVerbContext endorseVerb() throws RecognitionException {
		EndorseVerbContext _localctx = new EndorseVerbContext(_ctx, getState());
		enterRule(_localctx, 10, RULE_endorseVerb);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(169);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case READ:
			case INSPECT:
			case MANAGE:
			case USE:
				{
				setState(167);
				verb();
				}
				break;
			case ASSOCIATE:
				{
				setState(168);
				match(ASSOCIATE);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class VerbContext extends ParserRuleContext {
		public TerminalNode INSPECT() { return getToken(PolicyParser.INSPECT, 0); }
		public TerminalNode READ() { return getToken(PolicyParser.READ, 0); }
		public TerminalNode USE() { return getToken(PolicyParser.USE, 0); }
		public TerminalNode MANAGE() { return getToken(PolicyParser.MANAGE, 0); }
		public VerbContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_verb; }
	}

	public final VerbContext verb() throws RecognitionException {
		VerbContext _localctx = new VerbContext(_ctx, getState());
		enterRule(_localctx, 12, RULE_verb);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(171);
			_la = _input.LA(1);
			if ( !((((_la) & ~0x3f) == 0 && ((1L << _la) & 1340029796352L) != 0)) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class PermissionListContext extends ParserRuleContext {
		public List<TerminalNode> WORD() { return getTokens(PolicyParser.WORD); }
		public TerminalNode WORD(int i) {
			return getToken(PolicyParser.WORD, i);
		}
		public PermissionListContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_permissionList; }
	}

	public final PermissionListContext permissionList() throws RecognitionException {
		PermissionListContext _localctx = new PermissionListContext(_ctx, getState());
		enterRule(_localctx, 14, RULE_permissionList);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(173);
			match(T__0);
			setState(174);
			match(WORD);
			setState(179);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==T__1) {
				{
				{
				setState(175);
				match(T__1);
				setState(176);
				match(WORD);
				}
				}
				setState(181);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(182);
			match(T__2);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ScopeContext extends ParserRuleContext {
		public TerminalNode TENANCY() { return getToken(PolicyParser.TENANCY, 0); }
		public List<TerminalNode> WORD() { return getTokens(PolicyParser.WORD); }
		public TerminalNode WORD(int i) {
			return getToken(PolicyParser.WORD, i);
		}
		public List<TerminalNode> HCL_VAR() { return getTokens(PolicyParser.HCL_VAR); }
		public TerminalNode HCL_VAR(int i) {
			return getToken(PolicyParser.HCL_VAR, i);
		}
		public TerminalNode COMPARTMENT() { return getToken(PolicyParser.COMPARTMENT, 0); }
		public TerminalNode ID() { return getToken(PolicyParser.ID, 0); }
		public ScopeContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_scope; }
	}

	public final ScopeContext scope() throws RecognitionException {
		ScopeContext _localctx = new ScopeContext(_ctx, getState());
		enterRule(_localctx, 16, RULE_scope);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(197);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case COMPARTMENT:
				{
				{
				setState(184);
				match(COMPARTMENT);
				setState(186);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==ID) {
					{
					setState(185);
					match(ID);
					}
				}

				}
				setState(188);
				_la = _input.LA(1);
				if ( !(_la==HCL_VAR || _la==WORD) ) {
				_errHandler.recoverInline(this);
				}
				else {
					if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
					_errHandler.reportMatch(this);
					consume();
				}
				setState(193);
				_errHandler.sync(this);
				_la = _input.LA(1);
				while (_la==T__3) {
					{
					{
					setState(189);
					match(T__3);
					setState(190);
					_la = _input.LA(1);
					if ( !(_la==HCL_VAR || _la==WORD) ) {
					_errHandler.recoverInline(this);
					}
					else {
						if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
						_errHandler.reportMatch(this);
						consume();
					}
					}
					}
					setState(195);
					_errHandler.sync(this);
					_la = _input.LA(1);
				}
				}
				break;
			case TENANCY:
				{
				setState(196);
				match(TENANCY);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class EndorseScopeContext extends ParserRuleContext {
		public TerminalNode ANYTENANCY() { return getToken(PolicyParser.ANYTENANCY, 0); }
		public TerminalNode TENANCY() { return getToken(PolicyParser.TENANCY, 0); }
		public TerminalNode WORD() { return getToken(PolicyParser.WORD, 0); }
		public EndorseScopeContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_endorseScope; }
	}

	public final EndorseScopeContext endorseScope() throws RecognitionException {
		EndorseScopeContext _localctx = new EndorseScopeContext(_ctx, getState());
		enterRule(_localctx, 18, RULE_endorseScope);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(202);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case ANYTENANCY:
				{
				setState(199);
				match(ANYTENANCY);
				}
				break;
			case TENANCY:
				{
				setState(200);
				match(TENANCY);
				setState(201);
				match(WORD);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class SubjectContext extends ParserRuleContext {
		public GroupSubjectContext groupSubject() {
			return getRuleContext(GroupSubjectContext.class,0);
		}
		public ServiceSubjectContext serviceSubject() {
			return getRuleContext(ServiceSubjectContext.class,0);
		}
		public DynamicGroupSubjectContext dynamicGroupSubject() {
			return getRuleContext(DynamicGroupSubjectContext.class,0);
		}
		public ResourceSubjectContext resourceSubject() {
			return getRuleContext(ResourceSubjectContext.class,0);
		}
		public TerminalNode ANYUSER() { return getToken(PolicyParser.ANYUSER, 0); }
		public SubjectContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_subject; }
	}

	public final SubjectContext subject() throws RecognitionException {
		SubjectContext _localctx = new SubjectContext(_ctx, getState());
		enterRule(_localctx, 20, RULE_subject);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(209);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case GROUP:
				{
				setState(204);
				groupSubject();
				}
				break;
			case SERVICE:
				{
				setState(205);
				serviceSubject();
				}
				break;
			case DYNAMICGROUP:
				{
				setState(206);
				dynamicGroupSubject();
				}
				break;
			case RESOURCE:
				{
				setState(207);
				resourceSubject();
				}
				break;
			case ANYUSER:
				{
				setState(208);
				match(ANYUSER);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class GroupSubjectContext extends ParserRuleContext {
		public TerminalNode GROUP() { return getToken(PolicyParser.GROUP, 0); }
		public List<GroupNameContext> groupName() {
			return getRuleContexts(GroupNameContext.class);
		}
		public GroupNameContext groupName(int i) {
			return getRuleContext(GroupNameContext.class,i);
		}
		public List<GroupIDContext> groupID() {
			return getRuleContexts(GroupIDContext.class);
		}
		public GroupIDContext groupID(int i) {
			return getRuleContext(GroupIDContext.class,i);
		}
		public GroupSubjectContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_groupSubject; }
	}

	public final GroupSubjectContext groupSubject() throws RecognitionException {
		GroupSubjectContext _localctx = new GroupSubjectContext(_ctx, getState());
		enterRule(_localctx, 22, RULE_groupSubject);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(211);
			match(GROUP);
			setState(214);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case QUOTED_STRING:
			case HCL_VAR:
			case WORD:
				{
				setState(212);
				groupName();
				}
				break;
			case ID:
				{
				setState(213);
				groupID();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			setState(223);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==T__1) {
				{
				{
				setState(216);
				match(T__1);
				setState(219);
				_errHandler.sync(this);
				switch (_input.LA(1)) {
				case QUOTED_STRING:
				case HCL_VAR:
				case WORD:
					{
					setState(217);
					groupName();
					}
					break;
				case ID:
					{
					setState(218);
					groupID();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				}
				setState(225);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ResourceSubjectContext extends ParserRuleContext {
		public TerminalNode RESOURCE() { return getToken(PolicyParser.RESOURCE, 0); }
		public List<ResourceSubjectIdContext> resourceSubjectId() {
			return getRuleContexts(ResourceSubjectIdContext.class);
		}
		public ResourceSubjectIdContext resourceSubjectId(int i) {
			return getRuleContext(ResourceSubjectIdContext.class,i);
		}
		public ResourceSubjectContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_resourceSubject; }
	}

	public final ResourceSubjectContext resourceSubject() throws RecognitionException {
		ResourceSubjectContext _localctx = new ResourceSubjectContext(_ctx, getState());
		enterRule(_localctx, 24, RULE_resourceSubject);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(226);
			match(RESOURCE);
			setState(227);
			resourceSubjectId();
			setState(231);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==HCL_VAR || _la==WORD) {
				{
				{
				setState(228);
				resourceSubjectId();
				}
				}
				setState(233);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ServiceSubjectContext extends ParserRuleContext {
		public TerminalNode SERVICE() { return getToken(PolicyParser.SERVICE, 0); }
		public List<ServiceSubjectIdContext> serviceSubjectId() {
			return getRuleContexts(ServiceSubjectIdContext.class);
		}
		public ServiceSubjectIdContext serviceSubjectId(int i) {
			return getRuleContext(ServiceSubjectIdContext.class,i);
		}
		public ServiceSubjectContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_serviceSubject; }
	}

	public final ServiceSubjectContext serviceSubject() throws RecognitionException {
		ServiceSubjectContext _localctx = new ServiceSubjectContext(_ctx, getState());
		enterRule(_localctx, 26, RULE_serviceSubject);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(234);
			match(SERVICE);
			setState(235);
			serviceSubjectId();
			setState(240);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==T__1) {
				{
				{
				setState(236);
				match(T__1);
				setState(237);
				serviceSubjectId();
				}
				}
				setState(242);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class GroupNameContext extends ParserRuleContext {
		public List<TerminalNode> WORD() { return getTokens(PolicyParser.WORD); }
		public TerminalNode WORD(int i) {
			return getToken(PolicyParser.WORD, i);
		}
		public List<TerminalNode> QUOTED_STRING() { return getTokens(PolicyParser.QUOTED_STRING); }
		public TerminalNode QUOTED_STRING(int i) {
			return getToken(PolicyParser.QUOTED_STRING, i);
		}
		public TerminalNode HCL_VAR() { return getToken(PolicyParser.HCL_VAR, 0); }
		public GroupNameContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_groupName; }
	}

	public final GroupNameContext groupName() throws RecognitionException {
		GroupNameContext _localctx = new GroupNameContext(_ctx, getState());
		enterRule(_localctx, 28, RULE_groupName);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(255);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,31,_ctx) ) {
			case 1:
				{
				setState(243);
				match(WORD);
				}
				break;
			case 2:
				{
				setState(244);
				match(QUOTED_STRING);
				setState(245);
				match(T__4);
				setState(246);
				match(QUOTED_STRING);
				}
				break;
			case 3:
				{
				setState(247);
				match(QUOTED_STRING);
				}
				break;
			case 4:
				{
				setState(248);
				match(WORD);
				setState(249);
				match(T__4);
				setState(250);
				match(WORD);
				}
				break;
			case 5:
				{
				setState(251);
				match(WORD);
				setState(252);
				match(T__4);
				setState(253);
				match(QUOTED_STRING);
				}
				break;
			case 6:
				{
				setState(254);
				match(HCL_VAR);
				}
				break;
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ResourceSubjectIdContext extends ParserRuleContext {
		public List<TerminalNode> WORD() { return getTokens(PolicyParser.WORD); }
		public TerminalNode WORD(int i) {
			return getToken(PolicyParser.WORD, i);
		}
		public List<TerminalNode> HCL_VAR() { return getTokens(PolicyParser.HCL_VAR); }
		public TerminalNode HCL_VAR(int i) {
			return getToken(PolicyParser.HCL_VAR, i);
		}
		public ResourceSubjectIdContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_resourceSubjectId; }
	}

	public final ResourceSubjectIdContext resourceSubjectId() throws RecognitionException {
		ResourceSubjectIdContext _localctx = new ResourceSubjectIdContext(_ctx, getState());
		enterRule(_localctx, 30, RULE_resourceSubjectId);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(257);
			_la = _input.LA(1);
			if ( !(_la==HCL_VAR || _la==WORD) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			setState(266); 
			_errHandler.sync(this);
			_alt = 1+1;
			do {
				switch (_alt) {
				case 1+1:
					{
					setState(266);
					_errHandler.sync(this);
					switch ( getInterpreter().adaptivePredict(_input,32,_ctx) ) {
					case 1:
						{
						setState(258);
						match(T__5);
						setState(259);
						_la = _input.LA(1);
						if ( !(_la==HCL_VAR || _la==WORD) ) {
						_errHandler.recoverInline(this);
						}
						else {
							if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
							_errHandler.reportMatch(this);
							consume();
						}
						setState(260);
						match(T__5);
						}
						break;
					case 2:
						{
						setState(261);
						match(T__5);
						setState(262);
						_la = _input.LA(1);
						if ( !(_la==HCL_VAR || _la==WORD) ) {
						_errHandler.recoverInline(this);
						}
						else {
							if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
							_errHandler.reportMatch(this);
							consume();
						}
						setState(263);
						match(T__4);
						setState(264);
						_la = _input.LA(1);
						if ( !(_la==HCL_VAR || _la==WORD) ) {
						_errHandler.recoverInline(this);
						}
						else {
							if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
							_errHandler.reportMatch(this);
							consume();
						}
						setState(265);
						match(T__5);
						}
						break;
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				setState(268); 
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,33,_ctx);
			} while ( _alt!=1 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER );
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ServiceSubjectIdContext extends ParserRuleContext {
		public TerminalNode WORD() { return getToken(PolicyParser.WORD, 0); }
		public TerminalNode HCL_VAR() { return getToken(PolicyParser.HCL_VAR, 0); }
		public ServiceSubjectIdContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_serviceSubjectId; }
	}

	public final ServiceSubjectIdContext serviceSubjectId() throws RecognitionException {
		ServiceSubjectIdContext _localctx = new ServiceSubjectIdContext(_ctx, getState());
		enterRule(_localctx, 32, RULE_serviceSubjectId);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(270);
			_la = _input.LA(1);
			if ( !(_la==HCL_VAR || _la==WORD) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class GroupIDContext extends ParserRuleContext {
		public TerminalNode ID() { return getToken(PolicyParser.ID, 0); }
		public TerminalNode WORD() { return getToken(PolicyParser.WORD, 0); }
		public TerminalNode HCL_VAR() { return getToken(PolicyParser.HCL_VAR, 0); }
		public GroupIDContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_groupID; }
	}

	public final GroupIDContext groupID() throws RecognitionException {
		GroupIDContext _localctx = new GroupIDContext(_ctx, getState());
		enterRule(_localctx, 34, RULE_groupID);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(272);
			match(ID);
			setState(273);
			_la = _input.LA(1);
			if ( !(_la==HCL_VAR || _la==WORD) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class DynamicGroupSubjectContext extends ParserRuleContext {
		public TerminalNode DYNAMICGROUP() { return getToken(PolicyParser.DYNAMICGROUP, 0); }
		public TerminalNode WORD() { return getToken(PolicyParser.WORD, 0); }
		public TerminalNode ID() { return getToken(PolicyParser.ID, 0); }
		public DynamicGroupSubjectContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_dynamicGroupSubject; }
	}

	public final DynamicGroupSubjectContext dynamicGroupSubject() throws RecognitionException {
		DynamicGroupSubjectContext _localctx = new DynamicGroupSubjectContext(_ctx, getState());
		enterRule(_localctx, 36, RULE_dynamicGroupSubject);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(275);
			match(DYNAMICGROUP);
			setState(277);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==ID) {
				{
				setState(276);
				match(ID);
				}
			}

			setState(279);
			match(WORD);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class TenancySubjectContext extends ParserRuleContext {
		public TerminalNode TENANCY() { return getToken(PolicyParser.TENANCY, 0); }
		public TerminalNode WORD() { return getToken(PolicyParser.WORD, 0); }
		public TenancySubjectContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_tenancySubject; }
	}

	public final TenancySubjectContext tenancySubject() throws RecognitionException {
		TenancySubjectContext _localctx = new TenancySubjectContext(_ctx, getState());
		enterRule(_localctx, 38, RULE_tenancySubject);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(281);
			match(TENANCY);
			setState(282);
			match(WORD);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class DefinedSubjectContext extends ParserRuleContext {
		public GroupSubjectContext groupSubject() {
			return getRuleContext(GroupSubjectContext.class,0);
		}
		public DynamicGroupSubjectContext dynamicGroupSubject() {
			return getRuleContext(DynamicGroupSubjectContext.class,0);
		}
		public ServiceSubjectContext serviceSubject() {
			return getRuleContext(ServiceSubjectContext.class,0);
		}
		public TenancySubjectContext tenancySubject() {
			return getRuleContext(TenancySubjectContext.class,0);
		}
		public DefinedSubjectContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_definedSubject; }
	}

	public final DefinedSubjectContext definedSubject() throws RecognitionException {
		DefinedSubjectContext _localctx = new DefinedSubjectContext(_ctx, getState());
		enterRule(_localctx, 40, RULE_definedSubject);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(288);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case GROUP:
				{
				setState(284);
				groupSubject();
				}
				break;
			case DYNAMICGROUP:
				{
				setState(285);
				dynamicGroupSubject();
				}
				break;
			case SERVICE:
				{
				setState(286);
				serviceSubject();
				}
				break;
			case TENANCY:
				{
				setState(287);
				tenancySubject();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class DefinedContext extends ParserRuleContext {
		public TerminalNode WORD() { return getToken(PolicyParser.WORD, 0); }
		public DefinedContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_defined; }
	}

	public final DefinedContext defined() throws RecognitionException {
		DefinedContext _localctx = new DefinedContext(_ctx, getState());
		enterRule(_localctx, 42, RULE_defined);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(290);
			match(WORD);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ResourceContext extends ParserRuleContext {
		public TerminalNode WORD() { return getToken(PolicyParser.WORD, 0); }
		public TerminalNode HCL_VAR() { return getToken(PolicyParser.HCL_VAR, 0); }
		public ResourceContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_resource; }
	}

	public final ResourceContext resource() throws RecognitionException {
		ResourceContext _localctx = new ResourceContext(_ctx, getState());
		enterRule(_localctx, 44, RULE_resource);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(292);
			_la = _input.LA(1);
			if ( !(_la==HCL_VAR || _la==WORD) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ConditionContext extends ParserRuleContext {
		public ComparisonListContext comparisonList() {
			return getRuleContext(ComparisonListContext.class,0);
		}
		public ComparisonContext comparison() {
			return getRuleContext(ComparisonContext.class,0);
		}
		public ConditionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_condition; }
	}

	public final ConditionContext condition() throws RecognitionException {
		ConditionContext _localctx = new ConditionContext(_ctx, getState());
		enterRule(_localctx, 46, RULE_condition);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(296);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case ANY:
			case ALL:
				{
				setState(294);
				comparisonList();
				}
				break;
			case HCL_VAR:
			case WORD:
				{
				setState(295);
				comparison();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ComparisonContext extends ParserRuleContext {
		public VariableContext variable() {
			return getRuleContext(VariableContext.class,0);
		}
		public OperatorContext operator() {
			return getRuleContext(OperatorContext.class,0);
		}
		public ValueContext value() {
			return getRuleContext(ValueContext.class,0);
		}
		public ValueListContext valueList() {
			return getRuleContext(ValueListContext.class,0);
		}
		public TimeWindowContext timeWindow() {
			return getRuleContext(TimeWindowContext.class,0);
		}
		public PatternMatchContext patternMatch() {
			return getRuleContext(PatternMatchContext.class,0);
		}
		public ComparisonContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_comparison; }
	}

	public final ComparisonContext comparison() throws RecognitionException {
		ComparisonContext _localctx = new ComparisonContext(_ctx, getState());
		enterRule(_localctx, 48, RULE_comparison);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(298);
			variable();
			setState(299);
			operator();
			setState(304);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,37,_ctx) ) {
			case 1:
				{
				setState(300);
				value();
				}
				break;
			case 2:
				{
				setState(301);
				valueList();
				}
				break;
			case 3:
				{
				setState(302);
				timeWindow();
				}
				break;
			case 4:
				{
				setState(303);
				patternMatch();
				}
				break;
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class VariableContext extends ParserRuleContext {
		public List<TerminalNode> WORD() { return getTokens(PolicyParser.WORD); }
		public TerminalNode WORD(int i) {
			return getToken(PolicyParser.WORD, i);
		}
		public List<TerminalNode> HCL_VAR() { return getTokens(PolicyParser.HCL_VAR); }
		public TerminalNode HCL_VAR(int i) {
			return getToken(PolicyParser.HCL_VAR, i);
		}
		public VariableContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_variable; }
	}

	public final VariableContext variable() throws RecognitionException {
		VariableContext _localctx = new VariableContext(_ctx, getState());
		enterRule(_localctx, 50, RULE_variable);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(306);
			_la = _input.LA(1);
			if ( !(_la==HCL_VAR || _la==WORD) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			setState(313);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==T__6) {
				{
				setState(309); 
				_errHandler.sync(this);
				_la = _input.LA(1);
				do {
					{
					{
					setState(307);
					match(T__6);
					setState(308);
					_la = _input.LA(1);
					if ( !(_la==HCL_VAR || _la==WORD) ) {
					_errHandler.recoverInline(this);
					}
					else {
						if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
						_errHandler.reportMatch(this);
						consume();
					}
					}
					}
					setState(311); 
					_errHandler.sync(this);
					_la = _input.LA(1);
				} while ( _la==T__6 );
				}
			}

			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class OperatorContext extends ParserRuleContext {
		public TerminalNode BEFORE() { return getToken(PolicyParser.BEFORE, 0); }
		public TerminalNode IN() { return getToken(PolicyParser.IN, 0); }
		public TerminalNode BETWEEN() { return getToken(PolicyParser.BETWEEN, 0); }
		public OperatorContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_operator; }
	}

	public final OperatorContext operator() throws RecognitionException {
		OperatorContext _localctx = new OperatorContext(_ctx, getState());
		enterRule(_localctx, 52, RULE_operator);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(321);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case T__7:
				{
				setState(315);
				match(T__7);
				}
				break;
			case T__8:
				{
				setState(316);
				match(T__8);
				setState(317);
				match(T__7);
				}
				break;
			case BEFORE:
				{
				setState(318);
				match(BEFORE);
				}
				break;
			case IN:
				{
				setState(319);
				match(IN);
				}
				break;
			case BETWEEN:
				{
				setState(320);
				match(BETWEEN);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ValueContext extends ParserRuleContext {
		public List<TerminalNode> WORD() { return getTokens(PolicyParser.WORD); }
		public TerminalNode WORD(int i) {
			return getToken(PolicyParser.WORD, i);
		}
		public TerminalNode QUOTED_STRING() { return getToken(PolicyParser.QUOTED_STRING, 0); }
		public TerminalNode HCL_VAR() { return getToken(PolicyParser.HCL_VAR, 0); }
		public List<TerminalNode> WS() { return getTokens(PolicyParser.WS); }
		public TerminalNode WS(int i) {
			return getToken(PolicyParser.WS, i);
		}
		public ValueContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_value; }
	}

	public final ValueContext value() throws RecognitionException {
		ValueContext _localctx = new ValueContext(_ctx, getState());
		enterRule(_localctx, 54, RULE_value);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(336);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,42,_ctx) ) {
			case 1:
				{
				setState(323);
				match(WORD);
				}
				break;
			case 2:
				{
				setState(324);
				match(QUOTED_STRING);
				}
				break;
			case 3:
				{
				setState(325);
				match(QUOTED_STRING);
				setState(326);
				match(T__4);
				setState(327);
				match(WORD);
				}
				break;
			case 4:
				{
				setState(328);
				match(QUOTED_STRING);
				setState(331); 
				_errHandler.sync(this);
				_la = _input.LA(1);
				do {
					{
					{
					setState(329);
					match(WS);
					setState(330);
					match(WORD);
					}
					}
					setState(333); 
					_errHandler.sync(this);
					_la = _input.LA(1);
				} while ( _la==WS );
				}
				break;
			case 5:
				{
				setState(335);
				match(HCL_VAR);
				}
				break;
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ValueListContext extends ParserRuleContext {
		public List<TerminalNode> QUOTED_STRING() { return getTokens(PolicyParser.QUOTED_STRING); }
		public TerminalNode QUOTED_STRING(int i) {
			return getToken(PolicyParser.QUOTED_STRING, i);
		}
		public List<TerminalNode> HCL_VAR() { return getTokens(PolicyParser.HCL_VAR); }
		public TerminalNode HCL_VAR(int i) {
			return getToken(PolicyParser.HCL_VAR, i);
		}
		public ValueListContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_valueList; }
	}

	public final ValueListContext valueList() throws RecognitionException {
		ValueListContext _localctx = new ValueListContext(_ctx, getState());
		enterRule(_localctx, 56, RULE_valueList);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(338);
			match(T__9);
			setState(339);
			_la = _input.LA(1);
			if ( !(_la==QUOTED_STRING || _la==HCL_VAR) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			setState(344);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==T__1) {
				{
				{
				setState(340);
				match(T__1);
				setState(341);
				_la = _input.LA(1);
				if ( !(_la==QUOTED_STRING || _la==HCL_VAR) ) {
				_errHandler.recoverInline(this);
				}
				else {
					if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
					_errHandler.reportMatch(this);
					consume();
				}
				}
				}
				setState(346);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(347);
			match(T__10);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class TimeWindowContext extends ParserRuleContext {
		public TerminalNode AND() { return getToken(PolicyParser.AND, 0); }
		public List<TerminalNode> QUOTED_STRING() { return getTokens(PolicyParser.QUOTED_STRING); }
		public TerminalNode QUOTED_STRING(int i) {
			return getToken(PolicyParser.QUOTED_STRING, i);
		}
		public List<TerminalNode> HCL_VAR() { return getTokens(PolicyParser.HCL_VAR); }
		public TerminalNode HCL_VAR(int i) {
			return getToken(PolicyParser.HCL_VAR, i);
		}
		public TimeWindowContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_timeWindow; }
	}

	public final TimeWindowContext timeWindow() throws RecognitionException {
		TimeWindowContext _localctx = new TimeWindowContext(_ctx, getState());
		enterRule(_localctx, 58, RULE_timeWindow);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(349);
			_la = _input.LA(1);
			if ( !(_la==QUOTED_STRING || _la==HCL_VAR) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			setState(350);
			match(AND);
			setState(351);
			_la = _input.LA(1);
			if ( !(_la==QUOTED_STRING || _la==HCL_VAR) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class ComparisonListContext extends ParserRuleContext {
		public LogicalCombineContext logicalCombine() {
			return getRuleContext(LogicalCombineContext.class,0);
		}
		public List<ConditionContext> condition() {
			return getRuleContexts(ConditionContext.class);
		}
		public ConditionContext condition(int i) {
			return getRuleContext(ConditionContext.class,i);
		}
		public ComparisonListContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_comparisonList; }
	}

	public final ComparisonListContext comparisonList() throws RecognitionException {
		ComparisonListContext _localctx = new ComparisonListContext(_ctx, getState());
		enterRule(_localctx, 60, RULE_comparisonList);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(353);
			logicalCombine();
			setState(354);
			match(T__0);
			setState(355);
			condition();
			setState(360);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==T__1) {
				{
				{
				setState(356);
				match(T__1);
				setState(357);
				condition();
				}
				}
				setState(362);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(363);
			match(T__2);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class LogicalCombineContext extends ParserRuleContext {
		public TerminalNode ALL() { return getToken(PolicyParser.ALL, 0); }
		public TerminalNode ANY() { return getToken(PolicyParser.ANY, 0); }
		public LogicalCombineContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_logicalCombine; }
	}

	public final LogicalCombineContext logicalCombine() throws RecognitionException {
		LogicalCombineContext _localctx = new LogicalCombineContext(_ctx, getState());
		enterRule(_localctx, 62, RULE_logicalCombine);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(365);
			_la = _input.LA(1);
			if ( !(_la==ANY || _la==ALL) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	@SuppressWarnings("CheckReturnValue")
	public static class PatternMatchContext extends ParserRuleContext {
		public TerminalNode WORD() { return getToken(PolicyParser.WORD, 0); }
		public PatternMatchContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_patternMatch; }
	}

	public final PatternMatchContext patternMatch() throws RecognitionException {
		PatternMatchContext _localctx = new PatternMatchContext(_ctx, getState());
		enterRule(_localctx, 64, RULE_patternMatch);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(376);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,45,_ctx) ) {
			case 1:
				{
				setState(367);
				match(T__4);
				setState(368);
				match(WORD);
				setState(369);
				match(T__11);
				}
				break;
			case 2:
				{
				setState(370);
				match(T__12);
				setState(371);
				match(WORD);
				setState(372);
				match(T__4);
				}
				break;
			case 3:
				{
				setState(373);
				match(T__4);
				setState(374);
				match(WORD);
				setState(375);
				match(T__4);
				}
				break;
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static final String _serializedATN =
		"\u0004\u0001/\u017b\u0002\u0000\u0007\u0000\u0002\u0001\u0007\u0001\u0002"+
		"\u0002\u0007\u0002\u0002\u0003\u0007\u0003\u0002\u0004\u0007\u0004\u0002"+
		"\u0005\u0007\u0005\u0002\u0006\u0007\u0006\u0002\u0007\u0007\u0007\u0002"+
		"\b\u0007\b\u0002\t\u0007\t\u0002\n\u0007\n\u0002\u000b\u0007\u000b\u0002"+
		"\f\u0007\f\u0002\r\u0007\r\u0002\u000e\u0007\u000e\u0002\u000f\u0007\u000f"+
		"\u0002\u0010\u0007\u0010\u0002\u0011\u0007\u0011\u0002\u0012\u0007\u0012"+
		"\u0002\u0013\u0007\u0013\u0002\u0014\u0007\u0014\u0002\u0015\u0007\u0015"+
		"\u0002\u0016\u0007\u0016\u0002\u0017\u0007\u0017\u0002\u0018\u0007\u0018"+
		"\u0002\u0019\u0007\u0019\u0002\u001a\u0007\u001a\u0002\u001b\u0007\u001b"+
		"\u0002\u001c\u0007\u001c\u0002\u001d\u0007\u001d\u0002\u001e\u0007\u001e"+
		"\u0002\u001f\u0007\u001f\u0002 \u0007 \u0001\u0000\u0001\u0000\u0001\u0000"+
		"\u0001\u0000\u0004\u0000G\b\u0000\u000b\u0000\f\u0000H\u0001\u0000\u0001"+
		"\u0000\u0001\u0001\u0001\u0001\u0001\u0001\u0003\u0001P\b\u0001\u0001"+
		"\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0003\u0001V\b\u0001\u0001"+
		"\u0001\u0003\u0001Y\b\u0001\u0001\u0001\u0001\u0001\u0001\u0001\u0001"+
		"\u0001\u0003\u0001_\b\u0001\u0001\u0001\u0003\u0001b\b\u0001\u0001\u0002"+
		"\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002"+
		"\u0003\u0002k\b\u0002\u0001\u0002\u0003\u0002n\b\u0002\u0001\u0002\u0001"+
		"\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001\u0002\u0001"+
		"\u0002\u0003\u0002x\b\u0002\u0001\u0002\u0001\u0002\u0003\u0002|\b\u0002"+
		"\u0001\u0002\u0003\u0002\u007f\b\u0002\u0001\u0003\u0001\u0003\u0001\u0003"+
		"\u0001\u0003\u0001\u0003\u0003\u0003\u0086\b\u0003\u0001\u0004\u0001\u0004"+
		"\u0001\u0004\u0001\u0004\u0003\u0004\u008c\b\u0004\u0001\u0004\u0001\u0004"+
		"\u0001\u0004\u0001\u0004\u0001\u0004\u0003\u0004\u0093\b\u0004\u0001\u0004"+
		"\u0003\u0004\u0096\b\u0004\u0001\u0004\u0001\u0004\u0001\u0004\u0001\u0004"+
		"\u0001\u0004\u0001\u0004\u0001\u0004\u0003\u0004\u009f\b\u0004\u0001\u0004"+
		"\u0001\u0004\u0003\u0004\u00a3\b\u0004\u0001\u0004\u0003\u0004\u00a6\b"+
		"\u0004\u0001\u0005\u0001\u0005\u0003\u0005\u00aa\b\u0005\u0001\u0006\u0001"+
		"\u0006\u0001\u0007\u0001\u0007\u0001\u0007\u0001\u0007\u0005\u0007\u00b2"+
		"\b\u0007\n\u0007\f\u0007\u00b5\t\u0007\u0001\u0007\u0001\u0007\u0001\b"+
		"\u0001\b\u0003\b\u00bb\b\b\u0001\b\u0001\b\u0001\b\u0005\b\u00c0\b\b\n"+
		"\b\f\b\u00c3\t\b\u0001\b\u0003\b\u00c6\b\b\u0001\t\u0001\t\u0001\t\u0003"+
		"\t\u00cb\b\t\u0001\n\u0001\n\u0001\n\u0001\n\u0001\n\u0003\n\u00d2\b\n"+
		"\u0001\u000b\u0001\u000b\u0001\u000b\u0003\u000b\u00d7\b\u000b\u0001\u000b"+
		"\u0001\u000b\u0001\u000b\u0003\u000b\u00dc\b\u000b\u0005\u000b\u00de\b"+
		"\u000b\n\u000b\f\u000b\u00e1\t\u000b\u0001\f\u0001\f\u0001\f\u0005\f\u00e6"+
		"\b\f\n\f\f\f\u00e9\t\f\u0001\r\u0001\r\u0001\r\u0001\r\u0005\r\u00ef\b"+
		"\r\n\r\f\r\u00f2\t\r\u0001\u000e\u0001\u000e\u0001\u000e\u0001\u000e\u0001"+
		"\u000e\u0001\u000e\u0001\u000e\u0001\u000e\u0001\u000e\u0001\u000e\u0001"+
		"\u000e\u0001\u000e\u0003\u000e\u0100\b\u000e\u0001\u000f\u0001\u000f\u0001"+
		"\u000f\u0001\u000f\u0001\u000f\u0001\u000f\u0001\u000f\u0001\u000f\u0001"+
		"\u000f\u0004\u000f\u010b\b\u000f\u000b\u000f\f\u000f\u010c\u0001\u0010"+
		"\u0001\u0010\u0001\u0011\u0001\u0011\u0001\u0011\u0001\u0012\u0001\u0012"+
		"\u0003\u0012\u0116\b\u0012\u0001\u0012\u0001\u0012\u0001\u0013\u0001\u0013"+
		"\u0001\u0013\u0001\u0014\u0001\u0014\u0001\u0014\u0001\u0014\u0003\u0014"+
		"\u0121\b\u0014\u0001\u0015\u0001\u0015\u0001\u0016\u0001\u0016\u0001\u0017"+
		"\u0001\u0017\u0003\u0017\u0129\b\u0017\u0001\u0018\u0001\u0018\u0001\u0018"+
		"\u0001\u0018\u0001\u0018\u0001\u0018\u0003\u0018\u0131\b\u0018\u0001\u0019"+
		"\u0001\u0019\u0001\u0019\u0004\u0019\u0136\b\u0019\u000b\u0019\f\u0019"+
		"\u0137\u0003\u0019\u013a\b\u0019\u0001\u001a\u0001\u001a\u0001\u001a\u0001"+
		"\u001a\u0001\u001a\u0001\u001a\u0003\u001a\u0142\b\u001a\u0001\u001b\u0001"+
		"\u001b\u0001\u001b\u0001\u001b\u0001\u001b\u0001\u001b\u0001\u001b\u0001"+
		"\u001b\u0004\u001b\u014c\b\u001b\u000b\u001b\f\u001b\u014d\u0001\u001b"+
		"\u0003\u001b\u0151\b\u001b\u0001\u001c\u0001\u001c\u0001\u001c\u0001\u001c"+
		"\u0005\u001c\u0157\b\u001c\n\u001c\f\u001c\u015a\t\u001c\u0001\u001c\u0001"+
		"\u001c\u0001\u001d\u0001\u001d\u0001\u001d\u0001\u001d\u0001\u001e\u0001"+
		"\u001e\u0001\u001e\u0001\u001e\u0001\u001e\u0005\u001e\u0167\b\u001e\n"+
		"\u001e\f\u001e\u016a\t\u001e\u0001\u001e\u0001\u001e\u0001\u001f\u0001"+
		"\u001f\u0001 \u0001 \u0001 \u0001 \u0001 \u0001 \u0001 \u0001 \u0001 "+
		"\u0003 \u0179\b \u0001 \u0001\u010c\u0000!\u0000\u0002\u0004\u0006\b\n"+
		"\f\u000e\u0010\u0012\u0014\u0016\u0018\u001a\u001c\u001e \"$&(*,.0246"+
		"8:<>@\u0000\u0004\u0002\u0000#%((\u0001\u0000./\u0002\u0000\u0011\u0011"+
		"..\u0002\u0000))++\u019b\u0000F\u0001\u0000\u0000\u0000\u0002L\u0001\u0000"+
		"\u0000\u0000\u0004c\u0001\u0000\u0000\u0000\u0006\u0080\u0001\u0000\u0000"+
		"\u0000\b\u0087\u0001\u0000\u0000\u0000\n\u00a9\u0001\u0000\u0000\u0000"+
		"\f\u00ab\u0001\u0000\u0000\u0000\u000e\u00ad\u0001\u0000\u0000\u0000\u0010"+
		"\u00c5\u0001\u0000\u0000\u0000\u0012\u00ca\u0001\u0000\u0000\u0000\u0014"+
		"\u00d1\u0001\u0000\u0000\u0000\u0016\u00d3\u0001\u0000\u0000\u0000\u0018"+
		"\u00e2\u0001\u0000\u0000\u0000\u001a\u00ea\u0001\u0000\u0000\u0000\u001c"+
		"\u00ff\u0001\u0000\u0000\u0000\u001e\u0101\u0001\u0000\u0000\u0000 \u010e"+
		"\u0001\u0000\u0000\u0000\"\u0110\u0001\u0000\u0000\u0000$\u0113\u0001"+
		"\u0000\u0000\u0000&\u0119\u0001\u0000\u0000\u0000(\u0120\u0001\u0000\u0000"+
		"\u0000*\u0122\u0001\u0000\u0000\u0000,\u0124\u0001\u0000\u0000\u0000."+
		"\u0128\u0001\u0000\u0000\u00000\u012a\u0001\u0000\u0000\u00002\u0132\u0001"+
		"\u0000\u0000\u00004\u0141\u0001\u0000\u0000\u00006\u0150\u0001\u0000\u0000"+
		"\u00008\u0152\u0001\u0000\u0000\u0000:\u015d\u0001\u0000\u0000\u0000<"+
		"\u0161\u0001\u0000\u0000\u0000>\u016d\u0001\u0000\u0000\u0000@\u0178\u0001"+
		"\u0000\u0000\u0000BG\u0003\u0002\u0001\u0000CG\u0003\u0004\u0002\u0000"+
		"DG\u0003\u0006\u0003\u0000EG\u0003\b\u0004\u0000FB\u0001\u0000\u0000\u0000"+
		"FC\u0001\u0000\u0000\u0000FD\u0001\u0000\u0000\u0000FE\u0001\u0000\u0000"+
		"\u0000GH\u0001\u0000\u0000\u0000HF\u0001\u0000\u0000\u0000HI\u0001\u0000"+
		"\u0000\u0000IJ\u0001\u0000\u0000\u0000JK\u0005\u0000\u0000\u0001K\u0001"+
		"\u0001\u0000\u0000\u0000LM\u0005\u0016\u0000\u0000MX\u0003\u0014\n\u0000"+
		"NP\u0005\u0019\u0000\u0000ON\u0001\u0000\u0000\u0000OP\u0001\u0000\u0000"+
		"\u0000PQ\u0001\u0000\u0000\u0000QR\u0003\f\u0006\u0000RS\u0003,\u0016"+
		"\u0000SY\u0001\u0000\u0000\u0000TV\u0005\u0019\u0000\u0000UT\u0001\u0000"+
		"\u0000\u0000UV\u0001\u0000\u0000\u0000VW\u0001\u0000\u0000\u0000WY\u0003"+
		"\u000e\u0007\u0000XO\u0001\u0000\u0000\u0000XU\u0001\u0000\u0000\u0000"+
		"YZ\u0001\u0000\u0000\u0000Z[\u0005\u001b\u0000\u0000[^\u0003\u0010\b\u0000"+
		"\\]\u0005\u001c\u0000\u0000]_\u0003.\u0017\u0000^\\\u0001\u0000\u0000"+
		"\u0000^_\u0001\u0000\u0000\u0000_a\u0001\u0000\u0000\u0000`b\u0005\u0010"+
		"\u0000\u0000a`\u0001\u0000\u0000\u0000ab\u0001\u0000\u0000\u0000b\u0003"+
		"\u0001\u0000\u0000\u0000cd\u0005\u0015\u0000\u0000dm\u0003\u0014\n\u0000"+
		"ef\u0005\u0019\u0000\u0000fg\u0003\n\u0005\u0000gh\u0003,\u0016\u0000"+
		"hn\u0001\u0000\u0000\u0000ik\u0005\u0019\u0000\u0000ji\u0001\u0000\u0000"+
		"\u0000jk\u0001\u0000\u0000\u0000kl\u0001\u0000\u0000\u0000ln\u0003\u000e"+
		"\u0007\u0000me\u0001\u0000\u0000\u0000mj\u0001\u0000\u0000\u0000no\u0001"+
		"\u0000\u0000\u0000ow\u0005\u001b\u0000\u0000px\u0003\u0012\t\u0000qr\u0003"+
		"\u0010\b\u0000rs\u0005\u001d\u0000\u0000st\u0003,\u0016\u0000tu\u0005"+
		"\u001b\u0000\u0000uv\u0003\u0012\t\u0000vx\u0001\u0000\u0000\u0000wp\u0001"+
		"\u0000\u0000\u0000wq\u0001\u0000\u0000\u0000x{\u0001\u0000\u0000\u0000"+
		"yz\u0005\u001c\u0000\u0000z|\u0003.\u0017\u0000{y\u0001\u0000\u0000\u0000"+
		"{|\u0001\u0000\u0000\u0000|~\u0001\u0000\u0000\u0000}\u007f\u0005\u0010"+
		"\u0000\u0000~}\u0001\u0000\u0000\u0000~\u007f\u0001\u0000\u0000\u0000"+
		"\u007f\u0005\u0001\u0000\u0000\u0000\u0080\u0081\u0005\u0017\u0000\u0000"+
		"\u0081\u0082\u0003(\u0014\u0000\u0082\u0083\u0005,\u0000\u0000\u0083\u0085"+
		"\u0003*\u0015\u0000\u0084\u0086\u0005\u0010\u0000\u0000\u0085\u0084\u0001"+
		"\u0000\u0000\u0000\u0085\u0086\u0001\u0000\u0000\u0000\u0086\u0007\u0001"+
		"\u0000\u0000\u0000\u0087\u0088\u0005\'\u0000\u0000\u0088\u008b\u0003\u0014"+
		"\n\u0000\u0089\u008a\u0005\u001a\u0000\u0000\u008a\u008c\u0003\u0012\t"+
		"\u0000\u008b\u0089\u0001\u0000\u0000\u0000\u008b\u008c\u0001\u0000\u0000"+
		"\u0000\u008c\u0095\u0001\u0000\u0000\u0000\u008d\u008e\u0005\u0019\u0000"+
		"\u0000\u008e\u008f\u0003\n\u0005\u0000\u008f\u0090\u0003,\u0016\u0000"+
		"\u0090\u0096\u0001\u0000\u0000\u0000\u0091\u0093\u0005\u0019\u0000\u0000"+
		"\u0092\u0091\u0001\u0000\u0000\u0000\u0092\u0093\u0001\u0000\u0000\u0000"+
		"\u0093\u0094\u0001\u0000\u0000\u0000\u0094\u0096\u0003\u000e\u0007\u0000"+
		"\u0095\u008d\u0001\u0000\u0000\u0000\u0095\u0092\u0001\u0000\u0000\u0000"+
		"\u0096\u0097\u0001\u0000\u0000\u0000\u0097\u0098\u0005\u001b\u0000\u0000"+
		"\u0098\u009e\u0003\u0010\b\u0000\u0099\u009a\u0005\u001d\u0000\u0000\u009a"+
		"\u009b\u0003,\u0016\u0000\u009b\u009c\u0005\u001b\u0000\u0000\u009c\u009d"+
		"\u0003\u0012\t\u0000\u009d\u009f\u0001\u0000\u0000\u0000\u009e\u0099\u0001"+
		"\u0000\u0000\u0000\u009e\u009f\u0001\u0000\u0000\u0000\u009f\u00a2\u0001"+
		"\u0000\u0000\u0000\u00a0\u00a1\u0005\u001c\u0000\u0000\u00a1\u00a3\u0003"+
		".\u0017\u0000\u00a2\u00a0\u0001\u0000\u0000\u0000\u00a2\u00a3\u0001\u0000"+
		"\u0000\u0000\u00a3\u00a5\u0001\u0000\u0000\u0000\u00a4\u00a6\u0005\u0010"+
		"\u0000\u0000\u00a5\u00a4\u0001\u0000\u0000\u0000\u00a5\u00a6\u0001\u0000"+
		"\u0000\u0000\u00a6\t\u0001\u0000\u0000\u0000\u00a7\u00aa\u0003\f\u0006"+
		"\u0000\u00a8\u00aa\u0005&\u0000\u0000\u00a9\u00a7\u0001\u0000\u0000\u0000"+
		"\u00a9\u00a8\u0001\u0000\u0000\u0000\u00aa\u000b\u0001\u0000\u0000\u0000"+
		"\u00ab\u00ac\u0007\u0000\u0000\u0000\u00ac\r\u0001\u0000\u0000\u0000\u00ad"+
		"\u00ae\u0005\u0001\u0000\u0000\u00ae\u00b3\u0005/\u0000\u0000\u00af\u00b0"+
		"\u0005\u0002\u0000\u0000\u00b0\u00b2\u0005/\u0000\u0000\u00b1\u00af\u0001"+
		"\u0000\u0000\u0000\u00b2\u00b5\u0001\u0000\u0000\u0000\u00b3\u00b1\u0001"+
		"\u0000\u0000\u0000\u00b3\u00b4\u0001\u0000\u0000\u0000\u00b4\u00b6\u0001"+
		"\u0000\u0000\u0000\u00b5\u00b3\u0001\u0000\u0000\u0000\u00b6\u00b7\u0005"+
		"\u0003\u0000\u0000\u00b7\u000f\u0001\u0000\u0000\u0000\u00b8\u00ba\u0005"+
		"!\u0000\u0000\u00b9\u00bb\u0005-\u0000\u0000\u00ba\u00b9\u0001\u0000\u0000"+
		"\u0000\u00ba\u00bb\u0001\u0000\u0000\u0000\u00bb\u00bc\u0001\u0000\u0000"+
		"\u0000\u00bc\u00c1\u0007\u0001\u0000\u0000\u00bd\u00be\u0005\u0004\u0000"+
		"\u0000\u00be\u00c0\u0007\u0001\u0000\u0000\u00bf\u00bd\u0001\u0000\u0000"+
		"\u0000\u00c0\u00c3\u0001\u0000\u0000\u0000\u00c1\u00bf\u0001\u0000\u0000"+
		"\u0000\u00c1\u00c2\u0001\u0000\u0000\u0000\u00c2\u00c6\u0001\u0000\u0000"+
		"\u0000\u00c3\u00c1\u0001\u0000\u0000\u0000\u00c4\u00c6\u0005\"\u0000\u0000"+
		"\u00c5\u00b8\u0001\u0000\u0000\u0000\u00c5\u00c4\u0001\u0000\u0000\u0000"+
		"\u00c6\u0011\u0001\u0000\u0000\u0000\u00c7\u00cb\u0005\u0014\u0000\u0000"+
		"\u00c8\u00c9\u0005\"\u0000\u0000\u00c9\u00cb\u0005/\u0000\u0000\u00ca"+
		"\u00c7\u0001\u0000\u0000\u0000\u00ca\u00c8\u0001\u0000\u0000\u0000\u00cb"+
		"\u0013\u0001\u0000\u0000\u0000\u00cc\u00d2\u0003\u0016\u000b\u0000\u00cd"+
		"\u00d2\u0003\u001a\r\u0000\u00ce\u00d2\u0003$\u0012\u0000\u00cf\u00d2"+
		"\u0003\u0018\f\u0000\u00d0\u00d2\u0005\u0013\u0000\u0000\u00d1\u00cc\u0001"+
		"\u0000\u0000\u0000\u00d1\u00cd\u0001\u0000\u0000\u0000\u00d1\u00ce\u0001"+
		"\u0000\u0000\u0000\u00d1\u00cf\u0001\u0000\u0000\u0000\u00d1\u00d0\u0001"+
		"\u0000\u0000\u0000\u00d2\u0015\u0001\u0000\u0000\u0000\u00d3\u00d6\u0005"+
		"\u001f\u0000\u0000\u00d4\u00d7\u0003\u001c\u000e\u0000\u00d5\u00d7\u0003"+
		"\"\u0011\u0000\u00d6\u00d4\u0001\u0000\u0000\u0000\u00d6\u00d5\u0001\u0000"+
		"\u0000\u0000\u00d7\u00df\u0001\u0000\u0000\u0000\u00d8\u00db\u0005\u0002"+
		"\u0000\u0000\u00d9\u00dc\u0003\u001c\u000e\u0000\u00da\u00dc\u0003\"\u0011"+
		"\u0000\u00db\u00d9\u0001\u0000\u0000\u0000\u00db\u00da\u0001\u0000\u0000"+
		"\u0000\u00dc\u00de\u0001\u0000\u0000\u0000\u00dd\u00d8\u0001\u0000\u0000"+
		"\u0000\u00de\u00e1\u0001\u0000\u0000\u0000\u00df\u00dd\u0001\u0000\u0000"+
		"\u0000\u00df\u00e0\u0001\u0000\u0000\u0000\u00e0\u0017\u0001\u0000\u0000"+
		"\u0000\u00e1\u00df\u0001\u0000\u0000\u0000\u00e2\u00e3\u0005\u0018\u0000"+
		"\u0000\u00e3\u00e7\u0003\u001e\u000f\u0000\u00e4\u00e6\u0003\u001e\u000f"+
		"\u0000\u00e5\u00e4\u0001\u0000\u0000\u0000\u00e6\u00e9\u0001\u0000\u0000"+
		"\u0000\u00e7\u00e5\u0001\u0000\u0000\u0000\u00e7\u00e8\u0001\u0000\u0000"+
		"\u0000\u00e8\u0019\u0001\u0000\u0000\u0000\u00e9\u00e7\u0001\u0000\u0000"+
		"\u0000\u00ea\u00eb\u0005 \u0000\u0000\u00eb\u00f0\u0003 \u0010\u0000\u00ec"+
		"\u00ed\u0005\u0002\u0000\u0000\u00ed\u00ef\u0003 \u0010\u0000\u00ee\u00ec"+
		"\u0001\u0000\u0000\u0000\u00ef\u00f2\u0001\u0000\u0000\u0000\u00f0\u00ee"+
		"\u0001\u0000\u0000\u0000\u00f0\u00f1\u0001\u0000\u0000\u0000\u00f1\u001b"+
		"\u0001\u0000\u0000\u0000\u00f2\u00f0\u0001\u0000\u0000\u0000\u00f3\u0100"+
		"\u0005/\u0000\u0000\u00f4\u00f5\u0005\u0011\u0000\u0000\u00f5\u00f6\u0005"+
		"\u0005\u0000\u0000\u00f6\u0100\u0005\u0011\u0000\u0000\u00f7\u0100\u0005"+
		"\u0011\u0000\u0000\u00f8\u00f9\u0005/\u0000\u0000\u00f9\u00fa\u0005\u0005"+
		"\u0000\u0000\u00fa\u0100\u0005/\u0000\u0000\u00fb\u00fc\u0005/\u0000\u0000"+
		"\u00fc\u00fd\u0005\u0005\u0000\u0000\u00fd\u0100\u0005\u0011\u0000\u0000"+
		"\u00fe\u0100\u0005.\u0000\u0000\u00ff\u00f3\u0001\u0000\u0000\u0000\u00ff"+
		"\u00f4\u0001\u0000\u0000\u0000\u00ff\u00f7\u0001\u0000\u0000\u0000\u00ff"+
		"\u00f8\u0001\u0000\u0000\u0000\u00ff\u00fb\u0001\u0000\u0000\u0000\u00ff"+
		"\u00fe\u0001\u0000\u0000\u0000\u0100\u001d\u0001\u0000\u0000\u0000\u0101"+
		"\u010a\u0007\u0001\u0000\u0000\u0102\u0103\u0005\u0006\u0000\u0000\u0103"+
		"\u0104\u0007\u0001\u0000\u0000\u0104\u010b\u0005\u0006\u0000\u0000\u0105"+
		"\u0106\u0005\u0006\u0000\u0000\u0106\u0107\u0007\u0001\u0000\u0000\u0107"+
		"\u0108\u0005\u0005\u0000\u0000\u0108\u0109\u0007\u0001\u0000\u0000\u0109"+
		"\u010b\u0005\u0006\u0000\u0000\u010a\u0102\u0001\u0000\u0000\u0000\u010a"+
		"\u0105\u0001\u0000\u0000\u0000\u010b\u010c\u0001\u0000\u0000\u0000\u010c"+
		"\u010d\u0001\u0000\u0000\u0000\u010c\u010a\u0001\u0000\u0000\u0000\u010d"+
		"\u001f\u0001\u0000\u0000\u0000\u010e\u010f\u0007\u0001\u0000\u0000\u010f"+
		"!\u0001\u0000\u0000\u0000\u0110\u0111\u0005-\u0000\u0000\u0111\u0112\u0007"+
		"\u0001\u0000\u0000\u0112#\u0001\u0000\u0000\u0000\u0113\u0115\u0005\u001e"+
		"\u0000\u0000\u0114\u0116\u0005-\u0000\u0000\u0115\u0114\u0001\u0000\u0000"+
		"\u0000\u0115\u0116\u0001\u0000\u0000\u0000\u0116\u0117\u0001\u0000\u0000"+
		"\u0000\u0117\u0118\u0005/\u0000\u0000\u0118%\u0001\u0000\u0000\u0000\u0119"+
		"\u011a\u0005\"\u0000\u0000\u011a\u011b\u0005/\u0000\u0000\u011b\'\u0001"+
		"\u0000\u0000\u0000\u011c\u0121\u0003\u0016\u000b\u0000\u011d\u0121\u0003"+
		"$\u0012\u0000\u011e\u0121\u0003\u001a\r\u0000\u011f\u0121\u0003&\u0013"+
		"\u0000\u0120\u011c\u0001\u0000\u0000\u0000\u0120\u011d\u0001\u0000\u0000"+
		"\u0000\u0120\u011e\u0001\u0000\u0000\u0000\u0120\u011f\u0001\u0000\u0000"+
		"\u0000\u0121)\u0001\u0000\u0000\u0000\u0122\u0123\u0005/\u0000\u0000\u0123"+
		"+\u0001\u0000\u0000\u0000\u0124\u0125\u0007\u0001\u0000\u0000\u0125-\u0001"+
		"\u0000\u0000\u0000\u0126\u0129\u0003<\u001e\u0000\u0127\u0129\u00030\u0018"+
		"\u0000\u0128\u0126\u0001\u0000\u0000\u0000\u0128\u0127\u0001\u0000\u0000"+
		"\u0000\u0129/\u0001\u0000\u0000\u0000\u012a\u012b\u00032\u0019\u0000\u012b"+
		"\u0130\u00034\u001a\u0000\u012c\u0131\u00036\u001b\u0000\u012d\u0131\u0003"+
		"8\u001c\u0000\u012e\u0131\u0003:\u001d\u0000\u012f\u0131\u0003@ \u0000"+
		"\u0130\u012c\u0001\u0000\u0000\u0000\u0130\u012d\u0001\u0000\u0000\u0000"+
		"\u0130\u012e\u0001\u0000\u0000\u0000\u0130\u012f\u0001\u0000\u0000\u0000"+
		"\u01311\u0001\u0000\u0000\u0000\u0132\u0139\u0007\u0001\u0000\u0000\u0133"+
		"\u0134\u0005\u0007\u0000\u0000\u0134\u0136\u0007\u0001\u0000\u0000\u0135"+
		"\u0133\u0001\u0000\u0000\u0000\u0136\u0137\u0001\u0000\u0000\u0000\u0137"+
		"\u0135\u0001\u0000\u0000\u0000\u0137\u0138\u0001\u0000\u0000\u0000\u0138"+
		"\u013a\u0001\u0000\u0000\u0000\u0139\u0135\u0001\u0000\u0000\u0000\u0139"+
		"\u013a\u0001\u0000\u0000\u0000\u013a3\u0001\u0000\u0000\u0000\u013b\u0142"+
		"\u0005\b\u0000\u0000\u013c\u013d\u0005\t\u0000\u0000\u013d\u0142\u0005"+
		"\b\u0000\u0000\u013e\u0142\u0005\u000e\u0000\u0000\u013f\u0142\u0005\u001b"+
		"\u0000\u0000\u0140\u0142\u0005\u000f\u0000\u0000\u0141\u013b\u0001\u0000"+
		"\u0000\u0000\u0141\u013c\u0001\u0000\u0000\u0000\u0141\u013e\u0001\u0000"+
		"\u0000\u0000\u0141\u013f\u0001\u0000\u0000\u0000\u0141\u0140\u0001\u0000"+
		"\u0000\u0000\u01425\u0001\u0000\u0000\u0000\u0143\u0151\u0005/\u0000\u0000"+
		"\u0144\u0151\u0005\u0011\u0000\u0000\u0145\u0146\u0005\u0011\u0000\u0000"+
		"\u0146\u0147\u0005\u0005\u0000\u0000\u0147\u0151\u0005/\u0000\u0000\u0148"+
		"\u014b\u0005\u0011\u0000\u0000\u0149\u014a\u0005\u0012\u0000\u0000\u014a"+
		"\u014c\u0005/\u0000\u0000\u014b\u0149\u0001\u0000\u0000\u0000\u014c\u014d"+
		"\u0001\u0000\u0000\u0000\u014d\u014b\u0001\u0000\u0000\u0000\u014d\u014e"+
		"\u0001\u0000\u0000\u0000\u014e\u0151\u0001\u0000\u0000\u0000\u014f\u0151"+
		"\u0005.\u0000\u0000\u0150\u0143\u0001\u0000\u0000\u0000\u0150\u0144\u0001"+
		"\u0000\u0000\u0000\u0150\u0145\u0001\u0000\u0000\u0000\u0150\u0148\u0001"+
		"\u0000\u0000\u0000\u0150\u014f\u0001\u0000\u0000\u0000\u01517\u0001\u0000"+
		"\u0000\u0000\u0152\u0153\u0005\n\u0000\u0000\u0153\u0158\u0007\u0002\u0000"+
		"\u0000\u0154\u0155\u0005\u0002\u0000\u0000\u0155\u0157\u0007\u0002\u0000"+
		"\u0000\u0156\u0154\u0001\u0000\u0000\u0000\u0157\u015a\u0001\u0000\u0000"+
		"\u0000\u0158\u0156\u0001\u0000\u0000\u0000\u0158\u0159\u0001\u0000\u0000"+
		"\u0000\u0159\u015b\u0001\u0000\u0000\u0000\u015a\u0158\u0001\u0000\u0000"+
		"\u0000\u015b\u015c\u0005\u000b\u0000\u0000\u015c9\u0001\u0000\u0000\u0000"+
		"\u015d\u015e\u0007\u0002\u0000\u0000\u015e\u015f\u0005*\u0000\u0000\u015f"+
		"\u0160\u0007\u0002\u0000\u0000\u0160;\u0001\u0000\u0000\u0000\u0161\u0162"+
		"\u0003>\u001f\u0000\u0162\u0163\u0005\u0001\u0000\u0000\u0163\u0168\u0003"+
		".\u0017\u0000\u0164\u0165\u0005\u0002\u0000\u0000\u0165\u0167\u0003.\u0017"+
		"\u0000\u0166\u0164\u0001\u0000\u0000\u0000\u0167\u016a\u0001\u0000\u0000"+
		"\u0000\u0168\u0166\u0001\u0000\u0000\u0000\u0168\u0169\u0001\u0000\u0000"+
		"\u0000\u0169\u016b\u0001\u0000\u0000\u0000\u016a\u0168\u0001\u0000\u0000"+
		"\u0000\u016b\u016c\u0005\u0003\u0000\u0000\u016c=\u0001\u0000\u0000\u0000"+
		"\u016d\u016e\u0007\u0003\u0000\u0000\u016e?\u0001\u0000\u0000\u0000\u016f"+
		"\u0170\u0005\u0005\u0000\u0000\u0170\u0171\u0005/\u0000\u0000\u0171\u0179"+
		"\u0005\f\u0000\u0000\u0172\u0173\u0005\r\u0000\u0000\u0173\u0174\u0005"+
		"/\u0000\u0000\u0174\u0179\u0005\u0005\u0000\u0000\u0175\u0176\u0005\u0005"+
		"\u0000\u0000\u0176\u0177\u0005/\u0000\u0000\u0177\u0179\u0005\u0005\u0000"+
		"\u0000\u0178\u016f\u0001\u0000\u0000\u0000\u0178\u0172\u0001\u0000\u0000"+
		"\u0000\u0178\u0175\u0001\u0000\u0000\u0000\u0179A\u0001\u0000\u0000\u0000"+
		".FHOUX^ajmw{~\u0085\u008b\u0092\u0095\u009e\u00a2\u00a5\u00a9\u00b3\u00ba"+
		"\u00c1\u00c5\u00ca\u00d1\u00d6\u00db\u00df\u00e7\u00f0\u00ff\u010a\u010c"+
		"\u0115\u0120\u0128\u0130\u0137\u0139\u0141\u014d\u0150\u0158\u0168\u0178";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}