// Generated from /Users/gordon/Documents/code/policy-validation-action/Policy.g4 by ANTLR 4.13.1
import org.antlr.v4.runtime.tree.ParseTreeListener;

/**
 * This interface defines a complete listener for a parse tree produced by
 * {@link PolicyParser}.
 */
public interface PolicyListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by {@link PolicyParser#policy}.
	 * @param ctx the parse tree
	 */
	void enterPolicy(PolicyParser.PolicyContext ctx);
	/**
	 * Exit a parse tree produced by {@link PolicyParser#policy}.
	 * @param ctx the parse tree
	 */
	void exitPolicy(PolicyParser.PolicyContext ctx);
	/**
	 * Enter a parse tree produced by {@link PolicyParser#allowExpression}.
	 * @param ctx the parse tree
	 */
	void enterAllowExpression(PolicyParser.AllowExpressionContext ctx);
	/**
	 * Exit a parse tree produced by {@link PolicyParser#allowExpression}.
	 * @param ctx the parse tree
	 */
	void exitAllowExpression(PolicyParser.AllowExpressionContext ctx);
	/**
	 * Enter a parse tree produced by {@link PolicyParser#endorseExpression}.
	 * @param ctx the parse tree
	 */
	void enterEndorseExpression(PolicyParser.EndorseExpressionContext ctx);
	/**
	 * Exit a parse tree produced by {@link PolicyParser#endorseExpression}.
	 * @param ctx the parse tree
	 */
	void exitEndorseExpression(PolicyParser.EndorseExpressionContext ctx);
	/**
	 * Enter a parse tree produced by {@link PolicyParser#defineExpression}.
	 * @param ctx the parse tree
	 */
	void enterDefineExpression(PolicyParser.DefineExpressionContext ctx);
	/**
	 * Exit a parse tree produced by {@link PolicyParser#defineExpression}.
	 * @param ctx the parse tree
	 */
	void exitDefineExpression(PolicyParser.DefineExpressionContext ctx);
	/**
	 * Enter a parse tree produced by {@link PolicyParser#admitExpression}.
	 * @param ctx the parse tree
	 */
	void enterAdmitExpression(PolicyParser.AdmitExpressionContext ctx);
	/**
	 * Exit a parse tree produced by {@link PolicyParser#admitExpression}.
	 * @param ctx the parse tree
	 */
	void exitAdmitExpression(PolicyParser.AdmitExpressionContext ctx);
	/**
	 * Enter a parse tree produced by {@link PolicyParser#endorseVerb}.
	 * @param ctx the parse tree
	 */
	void enterEndorseVerb(PolicyParser.EndorseVerbContext ctx);
	/**
	 * Exit a parse tree produced by {@link PolicyParser#endorseVerb}.
	 * @param ctx the parse tree
	 */
	void exitEndorseVerb(PolicyParser.EndorseVerbContext ctx);
	/**
	 * Enter a parse tree produced by {@link PolicyParser#verb}.
	 * @param ctx the parse tree
	 */
	void enterVerb(PolicyParser.VerbContext ctx);
	/**
	 * Exit a parse tree produced by {@link PolicyParser#verb}.
	 * @param ctx the parse tree
	 */
	void exitVerb(PolicyParser.VerbContext ctx);
	/**
	 * Enter a parse tree produced by {@link PolicyParser#permissionList}.
	 * @param ctx the parse tree
	 */
	void enterPermissionList(PolicyParser.PermissionListContext ctx);
	/**
	 * Exit a parse tree produced by {@link PolicyParser#permissionList}.
	 * @param ctx the parse tree
	 */
	void exitPermissionList(PolicyParser.PermissionListContext ctx);
	/**
	 * Enter a parse tree produced by {@link PolicyParser#scope}.
	 * @param ctx the parse tree
	 */
	void enterScope(PolicyParser.ScopeContext ctx);
	/**
	 * Exit a parse tree produced by {@link PolicyParser#scope}.
	 * @param ctx the parse tree
	 */
	void exitScope(PolicyParser.ScopeContext ctx);
	/**
	 * Enter a parse tree produced by {@link PolicyParser#endorseScope}.
	 * @param ctx the parse tree
	 */
	void enterEndorseScope(PolicyParser.EndorseScopeContext ctx);
	/**
	 * Exit a parse tree produced by {@link PolicyParser#endorseScope}.
	 * @param ctx the parse tree
	 */
	void exitEndorseScope(PolicyParser.EndorseScopeContext ctx);
	/**
	 * Enter a parse tree produced by {@link PolicyParser#subject}.
	 * @param ctx the parse tree
	 */
	void enterSubject(PolicyParser.SubjectContext ctx);
	/**
	 * Exit a parse tree produced by {@link PolicyParser#subject}.
	 * @param ctx the parse tree
	 */
	void exitSubject(PolicyParser.SubjectContext ctx);
	/**
	 * Enter a parse tree produced by {@link PolicyParser#groupSubject}.
	 * @param ctx the parse tree
	 */
	void enterGroupSubject(PolicyParser.GroupSubjectContext ctx);
	/**
	 * Exit a parse tree produced by {@link PolicyParser#groupSubject}.
	 * @param ctx the parse tree
	 */
	void exitGroupSubject(PolicyParser.GroupSubjectContext ctx);
	/**
	 * Enter a parse tree produced by {@link PolicyParser#resourceSubject}.
	 * @param ctx the parse tree
	 */
	void enterResourceSubject(PolicyParser.ResourceSubjectContext ctx);
	/**
	 * Exit a parse tree produced by {@link PolicyParser#resourceSubject}.
	 * @param ctx the parse tree
	 */
	void exitResourceSubject(PolicyParser.ResourceSubjectContext ctx);
	/**
	 * Enter a parse tree produced by {@link PolicyParser#serviceSubject}.
	 * @param ctx the parse tree
	 */
	void enterServiceSubject(PolicyParser.ServiceSubjectContext ctx);
	/**
	 * Exit a parse tree produced by {@link PolicyParser#serviceSubject}.
	 * @param ctx the parse tree
	 */
	void exitServiceSubject(PolicyParser.ServiceSubjectContext ctx);
	/**
	 * Enter a parse tree produced by {@link PolicyParser#groupName}.
	 * @param ctx the parse tree
	 */
	void enterGroupName(PolicyParser.GroupNameContext ctx);
	/**
	 * Exit a parse tree produced by {@link PolicyParser#groupName}.
	 * @param ctx the parse tree
	 */
	void exitGroupName(PolicyParser.GroupNameContext ctx);
	/**
	 * Enter a parse tree produced by {@link PolicyParser#resourceSubjectId}.
	 * @param ctx the parse tree
	 */
	void enterResourceSubjectId(PolicyParser.ResourceSubjectIdContext ctx);
	/**
	 * Exit a parse tree produced by {@link PolicyParser#resourceSubjectId}.
	 * @param ctx the parse tree
	 */
	void exitResourceSubjectId(PolicyParser.ResourceSubjectIdContext ctx);
	/**
	 * Enter a parse tree produced by {@link PolicyParser#serviceSubjectId}.
	 * @param ctx the parse tree
	 */
	void enterServiceSubjectId(PolicyParser.ServiceSubjectIdContext ctx);
	/**
	 * Exit a parse tree produced by {@link PolicyParser#serviceSubjectId}.
	 * @param ctx the parse tree
	 */
	void exitServiceSubjectId(PolicyParser.ServiceSubjectIdContext ctx);
	/**
	 * Enter a parse tree produced by {@link PolicyParser#groupID}.
	 * @param ctx the parse tree
	 */
	void enterGroupID(PolicyParser.GroupIDContext ctx);
	/**
	 * Exit a parse tree produced by {@link PolicyParser#groupID}.
	 * @param ctx the parse tree
	 */
	void exitGroupID(PolicyParser.GroupIDContext ctx);
	/**
	 * Enter a parse tree produced by {@link PolicyParser#dynamicGroupSubject}.
	 * @param ctx the parse tree
	 */
	void enterDynamicGroupSubject(PolicyParser.DynamicGroupSubjectContext ctx);
	/**
	 * Exit a parse tree produced by {@link PolicyParser#dynamicGroupSubject}.
	 * @param ctx the parse tree
	 */
	void exitDynamicGroupSubject(PolicyParser.DynamicGroupSubjectContext ctx);
	/**
	 * Enter a parse tree produced by {@link PolicyParser#tenancySubject}.
	 * @param ctx the parse tree
	 */
	void enterTenancySubject(PolicyParser.TenancySubjectContext ctx);
	/**
	 * Exit a parse tree produced by {@link PolicyParser#tenancySubject}.
	 * @param ctx the parse tree
	 */
	void exitTenancySubject(PolicyParser.TenancySubjectContext ctx);
	/**
	 * Enter a parse tree produced by {@link PolicyParser#definedSubject}.
	 * @param ctx the parse tree
	 */
	void enterDefinedSubject(PolicyParser.DefinedSubjectContext ctx);
	/**
	 * Exit a parse tree produced by {@link PolicyParser#definedSubject}.
	 * @param ctx the parse tree
	 */
	void exitDefinedSubject(PolicyParser.DefinedSubjectContext ctx);
	/**
	 * Enter a parse tree produced by {@link PolicyParser#defined}.
	 * @param ctx the parse tree
	 */
	void enterDefined(PolicyParser.DefinedContext ctx);
	/**
	 * Exit a parse tree produced by {@link PolicyParser#defined}.
	 * @param ctx the parse tree
	 */
	void exitDefined(PolicyParser.DefinedContext ctx);
	/**
	 * Enter a parse tree produced by {@link PolicyParser#resource}.
	 * @param ctx the parse tree
	 */
	void enterResource(PolicyParser.ResourceContext ctx);
	/**
	 * Exit a parse tree produced by {@link PolicyParser#resource}.
	 * @param ctx the parse tree
	 */
	void exitResource(PolicyParser.ResourceContext ctx);
	/**
	 * Enter a parse tree produced by {@link PolicyParser#condition}.
	 * @param ctx the parse tree
	 */
	void enterCondition(PolicyParser.ConditionContext ctx);
	/**
	 * Exit a parse tree produced by {@link PolicyParser#condition}.
	 * @param ctx the parse tree
	 */
	void exitCondition(PolicyParser.ConditionContext ctx);
	/**
	 * Enter a parse tree produced by {@link PolicyParser#comparison}.
	 * @param ctx the parse tree
	 */
	void enterComparison(PolicyParser.ComparisonContext ctx);
	/**
	 * Exit a parse tree produced by {@link PolicyParser#comparison}.
	 * @param ctx the parse tree
	 */
	void exitComparison(PolicyParser.ComparisonContext ctx);
	/**
	 * Enter a parse tree produced by {@link PolicyParser#variable}.
	 * @param ctx the parse tree
	 */
	void enterVariable(PolicyParser.VariableContext ctx);
	/**
	 * Exit a parse tree produced by {@link PolicyParser#variable}.
	 * @param ctx the parse tree
	 */
	void exitVariable(PolicyParser.VariableContext ctx);
	/**
	 * Enter a parse tree produced by {@link PolicyParser#operator}.
	 * @param ctx the parse tree
	 */
	void enterOperator(PolicyParser.OperatorContext ctx);
	/**
	 * Exit a parse tree produced by {@link PolicyParser#operator}.
	 * @param ctx the parse tree
	 */
	void exitOperator(PolicyParser.OperatorContext ctx);
	/**
	 * Enter a parse tree produced by {@link PolicyParser#value}.
	 * @param ctx the parse tree
	 */
	void enterValue(PolicyParser.ValueContext ctx);
	/**
	 * Exit a parse tree produced by {@link PolicyParser#value}.
	 * @param ctx the parse tree
	 */
	void exitValue(PolicyParser.ValueContext ctx);
	/**
	 * Enter a parse tree produced by {@link PolicyParser#valueList}.
	 * @param ctx the parse tree
	 */
	void enterValueList(PolicyParser.ValueListContext ctx);
	/**
	 * Exit a parse tree produced by {@link PolicyParser#valueList}.
	 * @param ctx the parse tree
	 */
	void exitValueList(PolicyParser.ValueListContext ctx);
	/**
	 * Enter a parse tree produced by {@link PolicyParser#timeWindow}.
	 * @param ctx the parse tree
	 */
	void enterTimeWindow(PolicyParser.TimeWindowContext ctx);
	/**
	 * Exit a parse tree produced by {@link PolicyParser#timeWindow}.
	 * @param ctx the parse tree
	 */
	void exitTimeWindow(PolicyParser.TimeWindowContext ctx);
	/**
	 * Enter a parse tree produced by {@link PolicyParser#comparisonList}.
	 * @param ctx the parse tree
	 */
	void enterComparisonList(PolicyParser.ComparisonListContext ctx);
	/**
	 * Exit a parse tree produced by {@link PolicyParser#comparisonList}.
	 * @param ctx the parse tree
	 */
	void exitComparisonList(PolicyParser.ComparisonListContext ctx);
	/**
	 * Enter a parse tree produced by {@link PolicyParser#logicalCombine}.
	 * @param ctx the parse tree
	 */
	void enterLogicalCombine(PolicyParser.LogicalCombineContext ctx);
	/**
	 * Exit a parse tree produced by {@link PolicyParser#logicalCombine}.
	 * @param ctx the parse tree
	 */
	void exitLogicalCombine(PolicyParser.LogicalCombineContext ctx);
	/**
	 * Enter a parse tree produced by {@link PolicyParser#patternMatch}.
	 * @param ctx the parse tree
	 */
	void enterPatternMatch(PolicyParser.PatternMatchContext ctx);
	/**
	 * Exit a parse tree produced by {@link PolicyParser#patternMatch}.
	 * @param ctx the parse tree
	 */
	void exitPatternMatch(PolicyParser.PatternMatchContext ctx);
}