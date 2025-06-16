// Generated from Policy.g4 by ANTLR 4.13.2
import org.antlr.v4.runtime.tree.ParseTreeVisitor;

/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by {@link PolicyParser}.
 *
 * @param <T> The return type of the visit operation. Use {@link Void} for
 * operations with no return type.
 */
public interface PolicyVisitor<T> extends ParseTreeVisitor<T> {
	/**
	 * Visit a parse tree produced by {@link PolicyParser#policy}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitPolicy(PolicyParser.PolicyContext ctx);
	/**
	 * Visit a parse tree produced by {@link PolicyParser#allowExpression}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitAllowExpression(PolicyParser.AllowExpressionContext ctx);
	/**
	 * Visit a parse tree produced by {@link PolicyParser#endorseExpression}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitEndorseExpression(PolicyParser.EndorseExpressionContext ctx);
	/**
	 * Visit a parse tree produced by {@link PolicyParser#defineExpression}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitDefineExpression(PolicyParser.DefineExpressionContext ctx);
	/**
	 * Visit a parse tree produced by {@link PolicyParser#admitExpression}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitAdmitExpression(PolicyParser.AdmitExpressionContext ctx);
	/**
	 * Visit a parse tree produced by {@link PolicyParser#endorseVerb}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitEndorseVerb(PolicyParser.EndorseVerbContext ctx);
	/**
	 * Visit a parse tree produced by {@link PolicyParser#verb}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitVerb(PolicyParser.VerbContext ctx);
	/**
	 * Visit a parse tree produced by {@link PolicyParser#permissionList}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitPermissionList(PolicyParser.PermissionListContext ctx);
	/**
	 * Visit a parse tree produced by {@link PolicyParser#scope}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitScope(PolicyParser.ScopeContext ctx);
	/**
	 * Visit a parse tree produced by {@link PolicyParser#endorseScope}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitEndorseScope(PolicyParser.EndorseScopeContext ctx);
	/**
	 * Visit a parse tree produced by {@link PolicyParser#subject}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitSubject(PolicyParser.SubjectContext ctx);
	/**
	 * Visit a parse tree produced by {@link PolicyParser#groupSubject}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitGroupSubject(PolicyParser.GroupSubjectContext ctx);
	/**
	 * Visit a parse tree produced by {@link PolicyParser#resourceSubject}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitResourceSubject(PolicyParser.ResourceSubjectContext ctx);
	/**
	 * Visit a parse tree produced by {@link PolicyParser#serviceSubject}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitServiceSubject(PolicyParser.ServiceSubjectContext ctx);
	/**
	 * Visit a parse tree produced by {@link PolicyParser#groupName}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitGroupName(PolicyParser.GroupNameContext ctx);
	/**
	 * Visit a parse tree produced by {@link PolicyParser#resourceSubjectId}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitResourceSubjectId(PolicyParser.ResourceSubjectIdContext ctx);
	/**
	 * Visit a parse tree produced by {@link PolicyParser#serviceSubjectId}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitServiceSubjectId(PolicyParser.ServiceSubjectIdContext ctx);
	/**
	 * Visit a parse tree produced by {@link PolicyParser#groupID}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitGroupID(PolicyParser.GroupIDContext ctx);
	/**
	 * Visit a parse tree produced by {@link PolicyParser#dynamicGroupSubject}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitDynamicGroupSubject(PolicyParser.DynamicGroupSubjectContext ctx);
	/**
	 * Visit a parse tree produced by {@link PolicyParser#tenancySubject}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitTenancySubject(PolicyParser.TenancySubjectContext ctx);
	/**
	 * Visit a parse tree produced by {@link PolicyParser#definedSubject}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitDefinedSubject(PolicyParser.DefinedSubjectContext ctx);
	/**
	 * Visit a parse tree produced by {@link PolicyParser#defined}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitDefined(PolicyParser.DefinedContext ctx);
	/**
	 * Visit a parse tree produced by {@link PolicyParser#resource}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitResource(PolicyParser.ResourceContext ctx);
	/**
	 * Visit a parse tree produced by {@link PolicyParser#condition}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCondition(PolicyParser.ConditionContext ctx);
	/**
	 * Visit a parse tree produced by {@link PolicyParser#comparison}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitComparison(PolicyParser.ComparisonContext ctx);
	/**
	 * Visit a parse tree produced by {@link PolicyParser#variable}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitVariable(PolicyParser.VariableContext ctx);
	/**
	 * Visit a parse tree produced by {@link PolicyParser#operator}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitOperator(PolicyParser.OperatorContext ctx);
	/**
	 * Visit a parse tree produced by {@link PolicyParser#value}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitValue(PolicyParser.ValueContext ctx);
	/**
	 * Visit a parse tree produced by {@link PolicyParser#valueList}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitValueList(PolicyParser.ValueListContext ctx);
	/**
	 * Visit a parse tree produced by {@link PolicyParser#timeWindow}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitTimeWindow(PolicyParser.TimeWindowContext ctx);
	/**
	 * Visit a parse tree produced by {@link PolicyParser#comparisonList}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitComparisonList(PolicyParser.ComparisonListContext ctx);
	/**
	 * Visit a parse tree produced by {@link PolicyParser#logicalCombine}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitLogicalCombine(PolicyParser.LogicalCombineContext ctx);
	/**
	 * Visit a parse tree produced by {@link PolicyParser#patternMatch}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitPatternMatch(PolicyParser.PatternMatchContext ctx);
}