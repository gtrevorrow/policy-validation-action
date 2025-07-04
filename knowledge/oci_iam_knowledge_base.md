# OCI IAM Policy Knowledge Base

This document provides the ground truth for validating OCI IAM policies.

## ANTLR v4 Grammar

```antlr
grammar Policy;

policy              : ( allowExpression | endorseExpression | defineExpression | admitExpression )+  EOF ;

allowExpression     : ALLOW subject (TO? verb resource | TO? permissionList) IN scope (WHERE condition)? NEWLINE?;
endorseExpression   : ENDORSE subject (TO endorseVerb resource | TO? permissionList) IN (endorseScope | scope) (WITH resource IN endorseScope)? (WHERE condition)? NEWLINE?;
defineExpression    : DEFINE definedSubject AS defined NEWLINE?;
admitExpression     : ADMIT subject (TO? verb resource | TO? permissionList) IN scope (WHERE condition)? NEWLINE?;

subject             : (GROUP | DYNAMIC_GROUP) (ID | NAME | anyName) | ANY_USER;
verb                : INSPECT | READ | USE | MANAGE;
endorseVerb         : ADMIT;
resource            : (anyName | allResources) (DOT anyName)?;
permissionList      : LBRACE permission (COMMA permission)* RBRACE;
permission          : PERMISSION anyName;
scope               : (COMPARTMENT | TENANCY) (ID | NAME | anyName)?;
endorseScope        : (COMPARTMENT | TENANCY) (ID | NAME | anyName);
condition           : (anyName | allAny) (EQ | NEQ | IN) (STRING | LBRACKET (STRING (COMMA STRING)*)? RBRACKET);
definedSubject      : TENANCY | COMPARTMENT | anyName;
defined             : anyName (EQ STRING)?;

anyName             : (ID | NAME);
allResources        : ALL_RESOURCES;
allAny              : ANY | ALL;

// Keywords
ALLOW               : 'Allow';
ENDORSE             : 'Endorse';
DEFINE              : 'Define';
ADMIT               : 'Admit';
GROUP               : 'group';
DYNAMIC_GROUP       : 'dynamic-group';
ANY_USER            : 'any-user';
TO                  : 'to';
IN                  : 'in';
WITH                : 'with';
WHERE               : 'where';
AS                  : 'as';
PERMISSION          : 'permission';
COMPARTMENT         : 'compartment';
TENANCY             : 'tenancy';
ALL_RESOURCES       : 'all-resources';
ANY                 : 'any';
ALL                 : 'all';
INSPECT             : 'inspect';
READ                : 'read';
USE                 : 'use';
MANAGE              : 'manage';

// Symbols and Operators
LBRACE              : '{';
RBRACE              : '}';
LBRACKET            : '[';
RBRACKET            : ']';
COMMA               : ',';
DOT                 : '.';
EQ                  : '=';
NEQ                 : '!=';

// Primitives
ID                  : [a-zA-Z_][a-zA-Z0-9_]*;
NAME                : [a-zA-Z0-9_.-]+;
STRING              : '\'' ( ~['\\] | '\\' . )* '\'';
NEWLINE             : '\r'? '\n';
WS                  : [ \t]+ -> skip;
```

## Key CIS OCI Foundations Benchmark v2.0 Rules

- **1.1 Service-Level Admins**: Ensure service-level admins are used to manage resources of a particular service, rather than broad, tenancy-level permissions.
- **1.2 Tenancy Administrator Group Restriction**: Ensure permissions on all resources are given only to the tenancy administrator group. The statement `Allow group Administrators to manage all-resources in tenancy` is compliant. Any other group with this permission is a violation.
- **1.3 Admin Group Restrictions**: Ensure IAM administrators cannot update the tenancy 'Administrators' group.
- **1.5 Compartment-level Admins**: Ensure compartment-level admins are used to manage resources within specific compartments, following the principle of least privilege.

## OCI IAM Policy Documentation Highlights

- **Policy Structure**: A policy document contains one or more statements, each of which must conform to the ANTLR v4 grammar defined above.
- **Variables**: Policy statements can include HCL variables in the format `${var.variable_name}`. These are placeholders that are resolved at runtime. When validating, their intent must be inferred from their name and context.