// Generated from Policy.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";

import { PolicyContext } from "./PolicyParser";
import { AllowExpressionContext } from "./PolicyParser";
import { EndorseExpressionContext } from "./PolicyParser";
import { DefineExpressionContext } from "./PolicyParser";
import { AdmitExpressionContext } from "./PolicyParser";
import { DenyExpressionContext } from "./PolicyParser";
import { EndorseVerbContext } from "./PolicyParser";
import { VerbContext } from "./PolicyParser";
import { PermissionListContext } from "./PolicyParser";
import { ScopeContext } from "./PolicyParser";
import { EndorseScopeContext } from "./PolicyParser";
import { SubjectContext } from "./PolicyParser";
import { GroupSubjectContext } from "./PolicyParser";
import { ResourceSubjectContext } from "./PolicyParser";
import { ServiceSubjectContext } from "./PolicyParser";
import { GroupNameContext } from "./PolicyParser";
import { ResourceSubjectIdContext } from "./PolicyParser";
import { ServiceSubjectIdContext } from "./PolicyParser";
import { GroupIDContext } from "./PolicyParser";
import { DynamicGroupSubjectContext } from "./PolicyParser";
import { TenancySubjectContext } from "./PolicyParser";
import { DefinedSubjectContext } from "./PolicyParser";
import { DefinedContext } from "./PolicyParser";
import { ResourceContext } from "./PolicyParser";
import { ConditionContext } from "./PolicyParser";
import { FunctionCallContext } from "./PolicyParser";
import { ArgumentListContext } from "./PolicyParser";
import { ArgumentContext } from "./PolicyParser";
import { ComparisonContext } from "./PolicyParser";
import { VariableContext } from "./PolicyParser";
import { OperatorContext } from "./PolicyParser";
import { ValueContext } from "./PolicyParser";
import { ValueListContext } from "./PolicyParser";
import { TimeWindowContext } from "./PolicyParser";
import { ComparisonListContext } from "./PolicyParser";
import { LogicalCombineContext } from "./PolicyParser";
import { PatternMatchContext } from "./PolicyParser";


/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `PolicyParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export interface PolicyVisitor<Result> extends ParseTreeVisitor<Result> {
	/**
	 * Visit a parse tree produced by `PolicyParser.policy`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPolicy?: (ctx: PolicyContext) => Result;

	/**
	 * Visit a parse tree produced by `PolicyParser.allowExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAllowExpression?: (ctx: AllowExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `PolicyParser.endorseExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEndorseExpression?: (ctx: EndorseExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `PolicyParser.defineExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDefineExpression?: (ctx: DefineExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `PolicyParser.admitExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAdmitExpression?: (ctx: AdmitExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `PolicyParser.denyExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDenyExpression?: (ctx: DenyExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `PolicyParser.endorseVerb`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEndorseVerb?: (ctx: EndorseVerbContext) => Result;

	/**
	 * Visit a parse tree produced by `PolicyParser.verb`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVerb?: (ctx: VerbContext) => Result;

	/**
	 * Visit a parse tree produced by `PolicyParser.permissionList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPermissionList?: (ctx: PermissionListContext) => Result;

	/**
	 * Visit a parse tree produced by `PolicyParser.scope`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitScope?: (ctx: ScopeContext) => Result;

	/**
	 * Visit a parse tree produced by `PolicyParser.endorseScope`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEndorseScope?: (ctx: EndorseScopeContext) => Result;

	/**
	 * Visit a parse tree produced by `PolicyParser.subject`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSubject?: (ctx: SubjectContext) => Result;

	/**
	 * Visit a parse tree produced by `PolicyParser.groupSubject`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGroupSubject?: (ctx: GroupSubjectContext) => Result;

	/**
	 * Visit a parse tree produced by `PolicyParser.resourceSubject`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitResourceSubject?: (ctx: ResourceSubjectContext) => Result;

	/**
	 * Visit a parse tree produced by `PolicyParser.serviceSubject`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitServiceSubject?: (ctx: ServiceSubjectContext) => Result;

	/**
	 * Visit a parse tree produced by `PolicyParser.groupName`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGroupName?: (ctx: GroupNameContext) => Result;

	/**
	 * Visit a parse tree produced by `PolicyParser.resourceSubjectId`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitResourceSubjectId?: (ctx: ResourceSubjectIdContext) => Result;

	/**
	 * Visit a parse tree produced by `PolicyParser.serviceSubjectId`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitServiceSubjectId?: (ctx: ServiceSubjectIdContext) => Result;

	/**
	 * Visit a parse tree produced by `PolicyParser.groupID`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGroupID?: (ctx: GroupIDContext) => Result;

	/**
	 * Visit a parse tree produced by `PolicyParser.dynamicGroupSubject`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDynamicGroupSubject?: (ctx: DynamicGroupSubjectContext) => Result;

	/**
	 * Visit a parse tree produced by `PolicyParser.tenancySubject`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTenancySubject?: (ctx: TenancySubjectContext) => Result;

	/**
	 * Visit a parse tree produced by `PolicyParser.definedSubject`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDefinedSubject?: (ctx: DefinedSubjectContext) => Result;

	/**
	 * Visit a parse tree produced by `PolicyParser.defined`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDefined?: (ctx: DefinedContext) => Result;

	/**
	 * Visit a parse tree produced by `PolicyParser.resource`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitResource?: (ctx: ResourceContext) => Result;

	/**
	 * Visit a parse tree produced by `PolicyParser.condition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCondition?: (ctx: ConditionContext) => Result;

	/**
	 * Visit a parse tree produced by `PolicyParser.functionCall`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunctionCall?: (ctx: FunctionCallContext) => Result;

	/**
	 * Visit a parse tree produced by `PolicyParser.argumentList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitArgumentList?: (ctx: ArgumentListContext) => Result;

	/**
	 * Visit a parse tree produced by `PolicyParser.argument`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitArgument?: (ctx: ArgumentContext) => Result;

	/**
	 * Visit a parse tree produced by `PolicyParser.comparison`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitComparison?: (ctx: ComparisonContext) => Result;

	/**
	 * Visit a parse tree produced by `PolicyParser.variable`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVariable?: (ctx: VariableContext) => Result;

	/**
	 * Visit a parse tree produced by `PolicyParser.operator`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitOperator?: (ctx: OperatorContext) => Result;

	/**
	 * Visit a parse tree produced by `PolicyParser.value`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitValue?: (ctx: ValueContext) => Result;

	/**
	 * Visit a parse tree produced by `PolicyParser.valueList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitValueList?: (ctx: ValueListContext) => Result;

	/**
	 * Visit a parse tree produced by `PolicyParser.timeWindow`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTimeWindow?: (ctx: TimeWindowContext) => Result;

	/**
	 * Visit a parse tree produced by `PolicyParser.comparisonList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitComparisonList?: (ctx: ComparisonListContext) => Result;

	/**
	 * Visit a parse tree produced by `PolicyParser.logicalCombine`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLogicalCombine?: (ctx: LogicalCombineContext) => Result;

	/**
	 * Visit a parse tree produced by `PolicyParser.patternMatch`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPatternMatch?: (ctx: PatternMatchContext) => Result;
}

