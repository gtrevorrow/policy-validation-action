// Generated from Terraform.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";

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
 * This interface defines a complete generic visitor for a parse tree produced
 * by `TerraformParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export interface TerraformVisitor<Result> extends ParseTreeVisitor<Result> {
	/**
	 * Visit a parse tree produced by `TerraformParser.file_`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFile_?: (ctx: File_Context) => Result;

	/**
	 * Visit a parse tree produced by `TerraformParser.terraform`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTerraform?: (ctx: TerraformContext) => Result;

	/**
	 * Visit a parse tree produced by `TerraformParser.resource`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitResource?: (ctx: ResourceContext) => Result;

	/**
	 * Visit a parse tree produced by `TerraformParser.data`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitData?: (ctx: DataContext) => Result;

	/**
	 * Visit a parse tree produced by `TerraformParser.provider`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitProvider?: (ctx: ProviderContext) => Result;

	/**
	 * Visit a parse tree produced by `TerraformParser.output`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitOutput?: (ctx: OutputContext) => Result;

	/**
	 * Visit a parse tree produced by `TerraformParser.local`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLocal?: (ctx: LocalContext) => Result;

	/**
	 * Visit a parse tree produced by `TerraformParser.module`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitModule?: (ctx: ModuleContext) => Result;

	/**
	 * Visit a parse tree produced by `TerraformParser.variable`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVariable?: (ctx: VariableContext) => Result;

	/**
	 * Visit a parse tree produced by `TerraformParser.block`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBlock?: (ctx: BlockContext) => Result;

	/**
	 * Visit a parse tree produced by `TerraformParser.blocktype`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBlocktype?: (ctx: BlocktypeContext) => Result;

	/**
	 * Visit a parse tree produced by `TerraformParser.resourcetype`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitResourcetype?: (ctx: ResourcetypeContext) => Result;

	/**
	 * Visit a parse tree produced by `TerraformParser.name`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitName?: (ctx: NameContext) => Result;

	/**
	 * Visit a parse tree produced by `TerraformParser.label`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLabel?: (ctx: LabelContext) => Result;

	/**
	 * Visit a parse tree produced by `TerraformParser.blockbody`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBlockbody?: (ctx: BlockbodyContext) => Result;

	/**
	 * Visit a parse tree produced by `TerraformParser.argument`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitArgument?: (ctx: ArgumentContext) => Result;

	/**
	 * Visit a parse tree produced by `TerraformParser.identifier`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIdentifier?: (ctx: IdentifierContext) => Result;

	/**
	 * Visit a parse tree produced by `TerraformParser.identifierchain`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIdentifierchain?: (ctx: IdentifierchainContext) => Result;

	/**
	 * Visit a parse tree produced by `TerraformParser.inline_index`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitInline_index?: (ctx: Inline_indexContext) => Result;

	/**
	 * Visit a parse tree produced by `TerraformParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExpression?: (ctx: ExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `TerraformParser.forloop`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitForloop?: (ctx: ForloopContext) => Result;

	/**
	 * Visit a parse tree produced by `TerraformParser.section`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSection?: (ctx: SectionContext) => Result;

	/**
	 * Visit a parse tree produced by `TerraformParser.val`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVal?: (ctx: ValContext) => Result;

	/**
	 * Visit a parse tree produced by `TerraformParser.functioncall`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunctioncall?: (ctx: FunctioncallContext) => Result;

	/**
	 * Visit a parse tree produced by `TerraformParser.functionname`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunctionname?: (ctx: FunctionnameContext) => Result;

	/**
	 * Visit a parse tree produced by `TerraformParser.functionarguments`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunctionarguments?: (ctx: FunctionargumentsContext) => Result;

	/**
	 * Visit a parse tree produced by `TerraformParser.index`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIndex?: (ctx: IndexContext) => Result;

	/**
	 * Visit a parse tree produced by `TerraformParser.filedecl`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFiledecl?: (ctx: FiledeclContext) => Result;

	/**
	 * Visit a parse tree produced by `TerraformParser.list_`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitList_?: (ctx: List_Context) => Result;

	/**
	 * Visit a parse tree produced by `TerraformParser.map_`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMap_?: (ctx: Map_Context) => Result;

	/**
	 * Visit a parse tree produced by `TerraformParser.string`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitString?: (ctx: StringContext) => Result;

	/**
	 * Visit a parse tree produced by `TerraformParser.signed_number`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSigned_number?: (ctx: Signed_numberContext) => Result;

	/**
	 * Visit a parse tree produced by `TerraformParser.operator_`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitOperator_?: (ctx: Operator_Context) => Result;

	/**
	 * Visit a parse tree produced by `TerraformParser.number`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNumber?: (ctx: NumberContext) => Result;
}

