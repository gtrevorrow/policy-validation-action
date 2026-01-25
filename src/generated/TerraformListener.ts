// Generated from Terraform.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";

import { File_Context } from "./TerraformParser";
import { TerraformContext } from "./TerraformParser";
import { ResourceContext } from "./TerraformParser";
import { DataContext } from "./TerraformParser";
import { ProviderContext } from "./TerraformParser";
import { OutputContext } from "./TerraformParser";
import { LocalContext } from "./TerraformParser";
import { ModuleContext } from "./TerraformParser";
import { VariableContext } from "./TerraformParser";
import { BlockContext } from "./TerraformParser";
import { BlocktypeContext } from "./TerraformParser";
import { ResourcetypeContext } from "./TerraformParser";
import { NameContext } from "./TerraformParser";
import { LabelContext } from "./TerraformParser";
import { BlockbodyContext } from "./TerraformParser";
import { ArgumentContext } from "./TerraformParser";
import { IdentifierContext } from "./TerraformParser";
import { IdentifierchainContext } from "./TerraformParser";
import { Inline_indexContext } from "./TerraformParser";
import { ExpressionContext } from "./TerraformParser";
import { ForloopContext } from "./TerraformParser";
import { SectionContext } from "./TerraformParser";
import { ValContext } from "./TerraformParser";
import { FunctioncallContext } from "./TerraformParser";
import { FunctionnameContext } from "./TerraformParser";
import { FunctionargumentsContext } from "./TerraformParser";
import { IndexContext } from "./TerraformParser";
import { FiledeclContext } from "./TerraformParser";
import { List_Context } from "./TerraformParser";
import { Map_Context } from "./TerraformParser";
import { StringContext } from "./TerraformParser";
import { Signed_numberContext } from "./TerraformParser";
import { Operator_Context } from "./TerraformParser";
import { NumberContext } from "./TerraformParser";


/**
 * This interface defines a complete listener for a parse tree produced by
 * `TerraformParser`.
 */
export interface TerraformListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by `TerraformParser.file_`.
	 * @param ctx the parse tree
	 */
	enterFile_?: (ctx: File_Context) => void;
	/**
	 * Exit a parse tree produced by `TerraformParser.file_`.
	 * @param ctx the parse tree
	 */
	exitFile_?: (ctx: File_Context) => void;

	/**
	 * Enter a parse tree produced by `TerraformParser.terraform`.
	 * @param ctx the parse tree
	 */
	enterTerraform?: (ctx: TerraformContext) => void;
	/**
	 * Exit a parse tree produced by `TerraformParser.terraform`.
	 * @param ctx the parse tree
	 */
	exitTerraform?: (ctx: TerraformContext) => void;

	/**
	 * Enter a parse tree produced by `TerraformParser.resource`.
	 * @param ctx the parse tree
	 */
	enterResource?: (ctx: ResourceContext) => void;
	/**
	 * Exit a parse tree produced by `TerraformParser.resource`.
	 * @param ctx the parse tree
	 */
	exitResource?: (ctx: ResourceContext) => void;

	/**
	 * Enter a parse tree produced by `TerraformParser.data`.
	 * @param ctx the parse tree
	 */
	enterData?: (ctx: DataContext) => void;
	/**
	 * Exit a parse tree produced by `TerraformParser.data`.
	 * @param ctx the parse tree
	 */
	exitData?: (ctx: DataContext) => void;

	/**
	 * Enter a parse tree produced by `TerraformParser.provider`.
	 * @param ctx the parse tree
	 */
	enterProvider?: (ctx: ProviderContext) => void;
	/**
	 * Exit a parse tree produced by `TerraformParser.provider`.
	 * @param ctx the parse tree
	 */
	exitProvider?: (ctx: ProviderContext) => void;

	/**
	 * Enter a parse tree produced by `TerraformParser.output`.
	 * @param ctx the parse tree
	 */
	enterOutput?: (ctx: OutputContext) => void;
	/**
	 * Exit a parse tree produced by `TerraformParser.output`.
	 * @param ctx the parse tree
	 */
	exitOutput?: (ctx: OutputContext) => void;

	/**
	 * Enter a parse tree produced by `TerraformParser.local`.
	 * @param ctx the parse tree
	 */
	enterLocal?: (ctx: LocalContext) => void;
	/**
	 * Exit a parse tree produced by `TerraformParser.local`.
	 * @param ctx the parse tree
	 */
	exitLocal?: (ctx: LocalContext) => void;

	/**
	 * Enter a parse tree produced by `TerraformParser.module`.
	 * @param ctx the parse tree
	 */
	enterModule?: (ctx: ModuleContext) => void;
	/**
	 * Exit a parse tree produced by `TerraformParser.module`.
	 * @param ctx the parse tree
	 */
	exitModule?: (ctx: ModuleContext) => void;

	/**
	 * Enter a parse tree produced by `TerraformParser.variable`.
	 * @param ctx the parse tree
	 */
	enterVariable?: (ctx: VariableContext) => void;
	/**
	 * Exit a parse tree produced by `TerraformParser.variable`.
	 * @param ctx the parse tree
	 */
	exitVariable?: (ctx: VariableContext) => void;

	/**
	 * Enter a parse tree produced by `TerraformParser.block`.
	 * @param ctx the parse tree
	 */
	enterBlock?: (ctx: BlockContext) => void;
	/**
	 * Exit a parse tree produced by `TerraformParser.block`.
	 * @param ctx the parse tree
	 */
	exitBlock?: (ctx: BlockContext) => void;

	/**
	 * Enter a parse tree produced by `TerraformParser.blocktype`.
	 * @param ctx the parse tree
	 */
	enterBlocktype?: (ctx: BlocktypeContext) => void;
	/**
	 * Exit a parse tree produced by `TerraformParser.blocktype`.
	 * @param ctx the parse tree
	 */
	exitBlocktype?: (ctx: BlocktypeContext) => void;

	/**
	 * Enter a parse tree produced by `TerraformParser.resourcetype`.
	 * @param ctx the parse tree
	 */
	enterResourcetype?: (ctx: ResourcetypeContext) => void;
	/**
	 * Exit a parse tree produced by `TerraformParser.resourcetype`.
	 * @param ctx the parse tree
	 */
	exitResourcetype?: (ctx: ResourcetypeContext) => void;

	/**
	 * Enter a parse tree produced by `TerraformParser.name`.
	 * @param ctx the parse tree
	 */
	enterName?: (ctx: NameContext) => void;
	/**
	 * Exit a parse tree produced by `TerraformParser.name`.
	 * @param ctx the parse tree
	 */
	exitName?: (ctx: NameContext) => void;

	/**
	 * Enter a parse tree produced by `TerraformParser.label`.
	 * @param ctx the parse tree
	 */
	enterLabel?: (ctx: LabelContext) => void;
	/**
	 * Exit a parse tree produced by `TerraformParser.label`.
	 * @param ctx the parse tree
	 */
	exitLabel?: (ctx: LabelContext) => void;

	/**
	 * Enter a parse tree produced by `TerraformParser.blockbody`.
	 * @param ctx the parse tree
	 */
	enterBlockbody?: (ctx: BlockbodyContext) => void;
	/**
	 * Exit a parse tree produced by `TerraformParser.blockbody`.
	 * @param ctx the parse tree
	 */
	exitBlockbody?: (ctx: BlockbodyContext) => void;

	/**
	 * Enter a parse tree produced by `TerraformParser.argument`.
	 * @param ctx the parse tree
	 */
	enterArgument?: (ctx: ArgumentContext) => void;
	/**
	 * Exit a parse tree produced by `TerraformParser.argument`.
	 * @param ctx the parse tree
	 */
	exitArgument?: (ctx: ArgumentContext) => void;

	/**
	 * Enter a parse tree produced by `TerraformParser.identifier`.
	 * @param ctx the parse tree
	 */
	enterIdentifier?: (ctx: IdentifierContext) => void;
	/**
	 * Exit a parse tree produced by `TerraformParser.identifier`.
	 * @param ctx the parse tree
	 */
	exitIdentifier?: (ctx: IdentifierContext) => void;

	/**
	 * Enter a parse tree produced by `TerraformParser.identifierchain`.
	 * @param ctx the parse tree
	 */
	enterIdentifierchain?: (ctx: IdentifierchainContext) => void;
	/**
	 * Exit a parse tree produced by `TerraformParser.identifierchain`.
	 * @param ctx the parse tree
	 */
	exitIdentifierchain?: (ctx: IdentifierchainContext) => void;

	/**
	 * Enter a parse tree produced by `TerraformParser.inline_index`.
	 * @param ctx the parse tree
	 */
	enterInline_index?: (ctx: Inline_indexContext) => void;
	/**
	 * Exit a parse tree produced by `TerraformParser.inline_index`.
	 * @param ctx the parse tree
	 */
	exitInline_index?: (ctx: Inline_indexContext) => void;

	/**
	 * Enter a parse tree produced by `TerraformParser.expression`.
	 * @param ctx the parse tree
	 */
	enterExpression?: (ctx: ExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `TerraformParser.expression`.
	 * @param ctx the parse tree
	 */
	exitExpression?: (ctx: ExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `TerraformParser.forloop`.
	 * @param ctx the parse tree
	 */
	enterForloop?: (ctx: ForloopContext) => void;
	/**
	 * Exit a parse tree produced by `TerraformParser.forloop`.
	 * @param ctx the parse tree
	 */
	exitForloop?: (ctx: ForloopContext) => void;

	/**
	 * Enter a parse tree produced by `TerraformParser.section`.
	 * @param ctx the parse tree
	 */
	enterSection?: (ctx: SectionContext) => void;
	/**
	 * Exit a parse tree produced by `TerraformParser.section`.
	 * @param ctx the parse tree
	 */
	exitSection?: (ctx: SectionContext) => void;

	/**
	 * Enter a parse tree produced by `TerraformParser.val`.
	 * @param ctx the parse tree
	 */
	enterVal?: (ctx: ValContext) => void;
	/**
	 * Exit a parse tree produced by `TerraformParser.val`.
	 * @param ctx the parse tree
	 */
	exitVal?: (ctx: ValContext) => void;

	/**
	 * Enter a parse tree produced by `TerraformParser.functioncall`.
	 * @param ctx the parse tree
	 */
	enterFunctioncall?: (ctx: FunctioncallContext) => void;
	/**
	 * Exit a parse tree produced by `TerraformParser.functioncall`.
	 * @param ctx the parse tree
	 */
	exitFunctioncall?: (ctx: FunctioncallContext) => void;

	/**
	 * Enter a parse tree produced by `TerraformParser.functionname`.
	 * @param ctx the parse tree
	 */
	enterFunctionname?: (ctx: FunctionnameContext) => void;
	/**
	 * Exit a parse tree produced by `TerraformParser.functionname`.
	 * @param ctx the parse tree
	 */
	exitFunctionname?: (ctx: FunctionnameContext) => void;

	/**
	 * Enter a parse tree produced by `TerraformParser.functionarguments`.
	 * @param ctx the parse tree
	 */
	enterFunctionarguments?: (ctx: FunctionargumentsContext) => void;
	/**
	 * Exit a parse tree produced by `TerraformParser.functionarguments`.
	 * @param ctx the parse tree
	 */
	exitFunctionarguments?: (ctx: FunctionargumentsContext) => void;

	/**
	 * Enter a parse tree produced by `TerraformParser.index`.
	 * @param ctx the parse tree
	 */
	enterIndex?: (ctx: IndexContext) => void;
	/**
	 * Exit a parse tree produced by `TerraformParser.index`.
	 * @param ctx the parse tree
	 */
	exitIndex?: (ctx: IndexContext) => void;

	/**
	 * Enter a parse tree produced by `TerraformParser.filedecl`.
	 * @param ctx the parse tree
	 */
	enterFiledecl?: (ctx: FiledeclContext) => void;
	/**
	 * Exit a parse tree produced by `TerraformParser.filedecl`.
	 * @param ctx the parse tree
	 */
	exitFiledecl?: (ctx: FiledeclContext) => void;

	/**
	 * Enter a parse tree produced by `TerraformParser.list_`.
	 * @param ctx the parse tree
	 */
	enterList_?: (ctx: List_Context) => void;
	/**
	 * Exit a parse tree produced by `TerraformParser.list_`.
	 * @param ctx the parse tree
	 */
	exitList_?: (ctx: List_Context) => void;

	/**
	 * Enter a parse tree produced by `TerraformParser.map_`.
	 * @param ctx the parse tree
	 */
	enterMap_?: (ctx: Map_Context) => void;
	/**
	 * Exit a parse tree produced by `TerraformParser.map_`.
	 * @param ctx the parse tree
	 */
	exitMap_?: (ctx: Map_Context) => void;

	/**
	 * Enter a parse tree produced by `TerraformParser.string`.
	 * @param ctx the parse tree
	 */
	enterString?: (ctx: StringContext) => void;
	/**
	 * Exit a parse tree produced by `TerraformParser.string`.
	 * @param ctx the parse tree
	 */
	exitString?: (ctx: StringContext) => void;

	/**
	 * Enter a parse tree produced by `TerraformParser.signed_number`.
	 * @param ctx the parse tree
	 */
	enterSigned_number?: (ctx: Signed_numberContext) => void;
	/**
	 * Exit a parse tree produced by `TerraformParser.signed_number`.
	 * @param ctx the parse tree
	 */
	exitSigned_number?: (ctx: Signed_numberContext) => void;

	/**
	 * Enter a parse tree produced by `TerraformParser.operator_`.
	 * @param ctx the parse tree
	 */
	enterOperator_?: (ctx: Operator_Context) => void;
	/**
	 * Exit a parse tree produced by `TerraformParser.operator_`.
	 * @param ctx the parse tree
	 */
	exitOperator_?: (ctx: Operator_Context) => void;

	/**
	 * Enter a parse tree produced by `TerraformParser.number`.
	 * @param ctx the parse tree
	 */
	enterNumber?: (ctx: NumberContext) => void;
	/**
	 * Exit a parse tree produced by `TerraformParser.number`.
	 * @param ctx the parse tree
	 */
	exitNumber?: (ctx: NumberContext) => void;
}

