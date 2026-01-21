// Generated from Policy.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";

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
 * This interface defines a complete listener for a parse tree produced by
 * `PolicyParser`.
 */
export interface PolicyListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by `PolicyParser.policy`.
	 * @param ctx the parse tree
	 */
	enterPolicy?: (ctx: PolicyContext) => void;
	/**
	 * Exit a parse tree produced by `PolicyParser.policy`.
	 * @param ctx the parse tree
	 */
	exitPolicy?: (ctx: PolicyContext) => void;

	/**
	 * Enter a parse tree produced by `PolicyParser.allowExpression`.
	 * @param ctx the parse tree
	 */
	enterAllowExpression?: (ctx: AllowExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `PolicyParser.allowExpression`.
	 * @param ctx the parse tree
	 */
	exitAllowExpression?: (ctx: AllowExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `PolicyParser.endorseExpression`.
	 * @param ctx the parse tree
	 */
	enterEndorseExpression?: (ctx: EndorseExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `PolicyParser.endorseExpression`.
	 * @param ctx the parse tree
	 */
	exitEndorseExpression?: (ctx: EndorseExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `PolicyParser.defineExpression`.
	 * @param ctx the parse tree
	 */
	enterDefineExpression?: (ctx: DefineExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `PolicyParser.defineExpression`.
	 * @param ctx the parse tree
	 */
	exitDefineExpression?: (ctx: DefineExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `PolicyParser.admitExpression`.
	 * @param ctx the parse tree
	 */
	enterAdmitExpression?: (ctx: AdmitExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `PolicyParser.admitExpression`.
	 * @param ctx the parse tree
	 */
	exitAdmitExpression?: (ctx: AdmitExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `PolicyParser.denyExpression`.
	 * @param ctx the parse tree
	 */
	enterDenyExpression?: (ctx: DenyExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `PolicyParser.denyExpression`.
	 * @param ctx the parse tree
	 */
	exitDenyExpression?: (ctx: DenyExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `PolicyParser.endorseVerb`.
	 * @param ctx the parse tree
	 */
	enterEndorseVerb?: (ctx: EndorseVerbContext) => void;
	/**
	 * Exit a parse tree produced by `PolicyParser.endorseVerb`.
	 * @param ctx the parse tree
	 */
	exitEndorseVerb?: (ctx: EndorseVerbContext) => void;

	/**
	 * Enter a parse tree produced by `PolicyParser.verb`.
	 * @param ctx the parse tree
	 */
	enterVerb?: (ctx: VerbContext) => void;
	/**
	 * Exit a parse tree produced by `PolicyParser.verb`.
	 * @param ctx the parse tree
	 */
	exitVerb?: (ctx: VerbContext) => void;

	/**
	 * Enter a parse tree produced by `PolicyParser.permissionList`.
	 * @param ctx the parse tree
	 */
	enterPermissionList?: (ctx: PermissionListContext) => void;
	/**
	 * Exit a parse tree produced by `PolicyParser.permissionList`.
	 * @param ctx the parse tree
	 */
	exitPermissionList?: (ctx: PermissionListContext) => void;

	/**
	 * Enter a parse tree produced by `PolicyParser.scope`.
	 * @param ctx the parse tree
	 */
	enterScope?: (ctx: ScopeContext) => void;
	/**
	 * Exit a parse tree produced by `PolicyParser.scope`.
	 * @param ctx the parse tree
	 */
	exitScope?: (ctx: ScopeContext) => void;

	/**
	 * Enter a parse tree produced by `PolicyParser.endorseScope`.
	 * @param ctx the parse tree
	 */
	enterEndorseScope?: (ctx: EndorseScopeContext) => void;
	/**
	 * Exit a parse tree produced by `PolicyParser.endorseScope`.
	 * @param ctx the parse tree
	 */
	exitEndorseScope?: (ctx: EndorseScopeContext) => void;

	/**
	 * Enter a parse tree produced by `PolicyParser.subject`.
	 * @param ctx the parse tree
	 */
	enterSubject?: (ctx: SubjectContext) => void;
	/**
	 * Exit a parse tree produced by `PolicyParser.subject`.
	 * @param ctx the parse tree
	 */
	exitSubject?: (ctx: SubjectContext) => void;

	/**
	 * Enter a parse tree produced by `PolicyParser.groupSubject`.
	 * @param ctx the parse tree
	 */
	enterGroupSubject?: (ctx: GroupSubjectContext) => void;
	/**
	 * Exit a parse tree produced by `PolicyParser.groupSubject`.
	 * @param ctx the parse tree
	 */
	exitGroupSubject?: (ctx: GroupSubjectContext) => void;

	/**
	 * Enter a parse tree produced by `PolicyParser.resourceSubject`.
	 * @param ctx the parse tree
	 */
	enterResourceSubject?: (ctx: ResourceSubjectContext) => void;
	/**
	 * Exit a parse tree produced by `PolicyParser.resourceSubject`.
	 * @param ctx the parse tree
	 */
	exitResourceSubject?: (ctx: ResourceSubjectContext) => void;

	/**
	 * Enter a parse tree produced by `PolicyParser.serviceSubject`.
	 * @param ctx the parse tree
	 */
	enterServiceSubject?: (ctx: ServiceSubjectContext) => void;
	/**
	 * Exit a parse tree produced by `PolicyParser.serviceSubject`.
	 * @param ctx the parse tree
	 */
	exitServiceSubject?: (ctx: ServiceSubjectContext) => void;

	/**
	 * Enter a parse tree produced by `PolicyParser.groupName`.
	 * @param ctx the parse tree
	 */
	enterGroupName?: (ctx: GroupNameContext) => void;
	/**
	 * Exit a parse tree produced by `PolicyParser.groupName`.
	 * @param ctx the parse tree
	 */
	exitGroupName?: (ctx: GroupNameContext) => void;

	/**
	 * Enter a parse tree produced by `PolicyParser.resourceSubjectId`.
	 * @param ctx the parse tree
	 */
	enterResourceSubjectId?: (ctx: ResourceSubjectIdContext) => void;
	/**
	 * Exit a parse tree produced by `PolicyParser.resourceSubjectId`.
	 * @param ctx the parse tree
	 */
	exitResourceSubjectId?: (ctx: ResourceSubjectIdContext) => void;

	/**
	 * Enter a parse tree produced by `PolicyParser.serviceSubjectId`.
	 * @param ctx the parse tree
	 */
	enterServiceSubjectId?: (ctx: ServiceSubjectIdContext) => void;
	/**
	 * Exit a parse tree produced by `PolicyParser.serviceSubjectId`.
	 * @param ctx the parse tree
	 */
	exitServiceSubjectId?: (ctx: ServiceSubjectIdContext) => void;

	/**
	 * Enter a parse tree produced by `PolicyParser.groupID`.
	 * @param ctx the parse tree
	 */
	enterGroupID?: (ctx: GroupIDContext) => void;
	/**
	 * Exit a parse tree produced by `PolicyParser.groupID`.
	 * @param ctx the parse tree
	 */
	exitGroupID?: (ctx: GroupIDContext) => void;

	/**
	 * Enter a parse tree produced by `PolicyParser.dynamicGroupSubject`.
	 * @param ctx the parse tree
	 */
	enterDynamicGroupSubject?: (ctx: DynamicGroupSubjectContext) => void;
	/**
	 * Exit a parse tree produced by `PolicyParser.dynamicGroupSubject`.
	 * @param ctx the parse tree
	 */
	exitDynamicGroupSubject?: (ctx: DynamicGroupSubjectContext) => void;

	/**
	 * Enter a parse tree produced by `PolicyParser.tenancySubject`.
	 * @param ctx the parse tree
	 */
	enterTenancySubject?: (ctx: TenancySubjectContext) => void;
	/**
	 * Exit a parse tree produced by `PolicyParser.tenancySubject`.
	 * @param ctx the parse tree
	 */
	exitTenancySubject?: (ctx: TenancySubjectContext) => void;

	/**
	 * Enter a parse tree produced by `PolicyParser.definedSubject`.
	 * @param ctx the parse tree
	 */
	enterDefinedSubject?: (ctx: DefinedSubjectContext) => void;
	/**
	 * Exit a parse tree produced by `PolicyParser.definedSubject`.
	 * @param ctx the parse tree
	 */
	exitDefinedSubject?: (ctx: DefinedSubjectContext) => void;

	/**
	 * Enter a parse tree produced by `PolicyParser.defined`.
	 * @param ctx the parse tree
	 */
	enterDefined?: (ctx: DefinedContext) => void;
	/**
	 * Exit a parse tree produced by `PolicyParser.defined`.
	 * @param ctx the parse tree
	 */
	exitDefined?: (ctx: DefinedContext) => void;

	/**
	 * Enter a parse tree produced by `PolicyParser.resource`.
	 * @param ctx the parse tree
	 */
	enterResource?: (ctx: ResourceContext) => void;
	/**
	 * Exit a parse tree produced by `PolicyParser.resource`.
	 * @param ctx the parse tree
	 */
	exitResource?: (ctx: ResourceContext) => void;

	/**
	 * Enter a parse tree produced by `PolicyParser.condition`.
	 * @param ctx the parse tree
	 */
	enterCondition?: (ctx: ConditionContext) => void;
	/**
	 * Exit a parse tree produced by `PolicyParser.condition`.
	 * @param ctx the parse tree
	 */
	exitCondition?: (ctx: ConditionContext) => void;

	/**
	 * Enter a parse tree produced by `PolicyParser.functionCall`.
	 * @param ctx the parse tree
	 */
	enterFunctionCall?: (ctx: FunctionCallContext) => void;
	/**
	 * Exit a parse tree produced by `PolicyParser.functionCall`.
	 * @param ctx the parse tree
	 */
	exitFunctionCall?: (ctx: FunctionCallContext) => void;

	/**
	 * Enter a parse tree produced by `PolicyParser.argumentList`.
	 * @param ctx the parse tree
	 */
	enterArgumentList?: (ctx: ArgumentListContext) => void;
	/**
	 * Exit a parse tree produced by `PolicyParser.argumentList`.
	 * @param ctx the parse tree
	 */
	exitArgumentList?: (ctx: ArgumentListContext) => void;

	/**
	 * Enter a parse tree produced by `PolicyParser.argument`.
	 * @param ctx the parse tree
	 */
	enterArgument?: (ctx: ArgumentContext) => void;
	/**
	 * Exit a parse tree produced by `PolicyParser.argument`.
	 * @param ctx the parse tree
	 */
	exitArgument?: (ctx: ArgumentContext) => void;

	/**
	 * Enter a parse tree produced by `PolicyParser.comparison`.
	 * @param ctx the parse tree
	 */
	enterComparison?: (ctx: ComparisonContext) => void;
	/**
	 * Exit a parse tree produced by `PolicyParser.comparison`.
	 * @param ctx the parse tree
	 */
	exitComparison?: (ctx: ComparisonContext) => void;

	/**
	 * Enter a parse tree produced by `PolicyParser.variable`.
	 * @param ctx the parse tree
	 */
	enterVariable?: (ctx: VariableContext) => void;
	/**
	 * Exit a parse tree produced by `PolicyParser.variable`.
	 * @param ctx the parse tree
	 */
	exitVariable?: (ctx: VariableContext) => void;

	/**
	 * Enter a parse tree produced by `PolicyParser.operator`.
	 * @param ctx the parse tree
	 */
	enterOperator?: (ctx: OperatorContext) => void;
	/**
	 * Exit a parse tree produced by `PolicyParser.operator`.
	 * @param ctx the parse tree
	 */
	exitOperator?: (ctx: OperatorContext) => void;

	/**
	 * Enter a parse tree produced by `PolicyParser.value`.
	 * @param ctx the parse tree
	 */
	enterValue?: (ctx: ValueContext) => void;
	/**
	 * Exit a parse tree produced by `PolicyParser.value`.
	 * @param ctx the parse tree
	 */
	exitValue?: (ctx: ValueContext) => void;

	/**
	 * Enter a parse tree produced by `PolicyParser.valueList`.
	 * @param ctx the parse tree
	 */
	enterValueList?: (ctx: ValueListContext) => void;
	/**
	 * Exit a parse tree produced by `PolicyParser.valueList`.
	 * @param ctx the parse tree
	 */
	exitValueList?: (ctx: ValueListContext) => void;

	/**
	 * Enter a parse tree produced by `PolicyParser.timeWindow`.
	 * @param ctx the parse tree
	 */
	enterTimeWindow?: (ctx: TimeWindowContext) => void;
	/**
	 * Exit a parse tree produced by `PolicyParser.timeWindow`.
	 * @param ctx the parse tree
	 */
	exitTimeWindow?: (ctx: TimeWindowContext) => void;

	/**
	 * Enter a parse tree produced by `PolicyParser.comparisonList`.
	 * @param ctx the parse tree
	 */
	enterComparisonList?: (ctx: ComparisonListContext) => void;
	/**
	 * Exit a parse tree produced by `PolicyParser.comparisonList`.
	 * @param ctx the parse tree
	 */
	exitComparisonList?: (ctx: ComparisonListContext) => void;

	/**
	 * Enter a parse tree produced by `PolicyParser.logicalCombine`.
	 * @param ctx the parse tree
	 */
	enterLogicalCombine?: (ctx: LogicalCombineContext) => void;
	/**
	 * Exit a parse tree produced by `PolicyParser.logicalCombine`.
	 * @param ctx the parse tree
	 */
	exitLogicalCombine?: (ctx: LogicalCombineContext) => void;

	/**
	 * Enter a parse tree produced by `PolicyParser.patternMatch`.
	 * @param ctx the parse tree
	 */
	enterPatternMatch?: (ctx: PatternMatchContext) => void;
	/**
	 * Exit a parse tree produced by `PolicyParser.patternMatch`.
	 * @param ctx the parse tree
	 */
	exitPatternMatch?: (ctx: PatternMatchContext) => void;
}

