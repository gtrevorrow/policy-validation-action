// Generated from Policy.g4 by ANTLR 4.13.2

import {ParseTreeVisitor} from 'antlr4';


import { PolicyContext } from "./PolicyParser.js";
import { AllowExpressionContext } from "./PolicyParser.js";
import { EndorseExpressionContext } from "./PolicyParser.js";
import { DefineExpressionContext } from "./PolicyParser.js";
import { AdmitExpressionContext } from "./PolicyParser.js";
import { EndorseVerbContext } from "./PolicyParser.js";
import { VerbContext } from "./PolicyParser.js";
import { PermissionListContext } from "./PolicyParser.js";
import { ScopeContext } from "./PolicyParser.js";
import { EndorseScopeContext } from "./PolicyParser.js";
import { SubjectContext } from "./PolicyParser.js";
import { GroupSubjectContext } from "./PolicyParser.js";
import { ResourceSubjectContext } from "./PolicyParser.js";
import { ServiceSubjectContext } from "./PolicyParser.js";
import { GroupNameContext } from "./PolicyParser.js";
import { ResourceSubjectIdContext } from "./PolicyParser.js";
import { ServiceSubjectIdContext } from "./PolicyParser.js";
import { GroupIDContext } from "./PolicyParser.js";
import { DynamicGroupSubjectContext } from "./PolicyParser.js";
import { TenancySubjectContext } from "./PolicyParser.js";
import { DefinedSubjectContext } from "./PolicyParser.js";
import { DefinedContext } from "./PolicyParser.js";
import { ResourceContext } from "./PolicyParser.js";
import { ConditionContext } from "./PolicyParser.js";
import { ComparisonContext } from "./PolicyParser.js";
import { VariableContext } from "./PolicyParser.js";
import { OperatorContext } from "./PolicyParser.js";
import { ValueContext } from "./PolicyParser.js";
import { ValueListContext } from "./PolicyParser.js";
import { TimeWindowContext } from "./PolicyParser.js";
import { ComparisonListContext } from "./PolicyParser.js";
import { LogicalCombineContext } from "./PolicyParser.js";
import { PatternMatchContext } from "./PolicyParser.js";


/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `PolicyParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export default class PolicyVisitor<Result> extends ParseTreeVisitor<Result> {
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

