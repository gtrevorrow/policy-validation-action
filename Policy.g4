grammar Policy;

 /*
  * Parser Rules
  */
 policy              : ( allowExpression | endorseExpression | defineExpression | admitExpression )+  EOF ;

 allowExpression     : ALLOW subject (TO? verb resource | TO? permissionList) IN scope (WHERE condition)? NEWLINE?;
 endorseExpression   : ENDORSE subject (TO endorseVerb resource | TO? permissionList) IN (endorseScope | (scope WITH resource IN endorseScope)) (WHERE condition)? NEWLINE?;
 defineExpression    : DEFINE definedSubject AS defined NEWLINE?;
 admitExpression     : ADMIT subject (OF endorseScope)?  (TO endorseVerb resource | TO? permissionList) IN scope (WITH resource IN endorseScope)? (WHERE condition)? NEWLINE?;

 endorseVerb         : (verb | ASSOCIATE);
 verb                : (INSPECT | READ | USE | MANAGE) ;
 permissionList      : '{'  WORD  (',' WORD)* '}'  ; // e.g {USER_UPDATE, USER_UIPASS_SET, USER_UIPASS_SET}
 scope               : ((COMPARTMENT ID?)  WORD (':' WORD)* | TENANCY) ;
 endorseScope        : (ANYTENANCY| TENANCY WORD);
 subject             : (groupSubject | serviceSubject | dynamicGroupSubject | resourceSubject | ANYUSER) ;
 groupSubject        : GROUP (groupName| groupID) (','(groupName|groupID))* ;
 resourceSubject     : RESOURCE resourceSubjectId (resourceSubjectId)*;
 serviceSubject      : SERVICE serviceSubjectId (',' serviceSubjectId)*;
 groupName           : (WORD | QUOTED_STRING '/' QUOTED_STRING | QUOTED_STRING | WORD '/' WORD | WORD '/' QUOTED_STRING);
 resourceSubjectId   : WORD ('\'' WORD '\'' | '\'' WORD '/' WORD '\'' )+?;
 serviceSubjectId    : WORD;
 groupID             : ID WORD;
 dynamicGroupSubject : DYNAMICGROUP ID? WORD ;
 tenancySubject      : TENANCY WORD ;
 definedSubject      : (groupSubject | dynamicGroupSubject | serviceSubject | tenancySubject);
 defined             : WORD;
 resource            : WORD;
 condition           : (comparisonList | comparison) ;
 comparison          : variable operator (value|valueList|timeWindow| patternMatch) ;
 variable            : WORD (('.' WORD )+)? ;
 operator            : ('=' | '!''=' | BEFORE | IN | BETWEEN) ;
 value               : (WORD | QUOTED_STRING | QUOTED_STRING '/' WORD | QUOTED_STRING (WS WORD)+);
 valueList           : '(' QUOTED_STRING ( ',' QUOTED_STRING )*  ')';
 timeWindow          : QUOTED_STRING AND QUOTED_STRING;
 comparisonList      : logicalCombine '{' condition  (',' condition)* '}' ;
 logicalCombine      : ( ALL | ANY ) ;
 patternMatch        : ('/' WORD '*/'|'/*' WORD '/'| '/' WORD '/') ;

 /*
  * Lexer Rules
  */
 BEFORE              : B E F O R E ;
 BETWEEN             : B E T W E E N;
 NEWLINE             : ('\r'? '\n' | '\r')+ -> skip;
 QUOTED_STRING       : '\'' (LETTER | DIGIT | ' ' | '-' | '.' | ':' | '@' | '_')+ '\'' ;
 WS                  : ' '+  -> skip;
 ANYUSER             : A N Y '-' U S E R  ;
 ANYTENANCY          : A N Y '-' T E N A N C Y ;
 ENDORSE             : E N D O R S E ;
 ALLOW               : A L L O W;
 DEFINE              : D E F I N E ;
 RESOURCE            : R E S O U R C E ;
 TO                  : T O;
 OF                  : O F ;
 IN                  : I N;
 WHERE               : W H E R E  ;
 WITH                : W I T H ;
 DYNAMICGROUP        : D Y N A M I C '-' G R O U P ;
 GROUP               : G R O U P  ;
 SERVICE             : S E R V I C E  ;
 COMPARTMENT         : C O M P A R T M E N T  ;
 TENANCY             : T E N A N C Y;
 READ                : R E A D  ;
 INSPECT             : I N S P E C T  ;
 MANAGE              : M A N A G E  ;
 ASSOCIATE           : A S S O C I A T E ;
 ADMIT               : A D M I T ;
 USE                 : U S E  ;
 ANY                 : A N Y  ;
 AND                 : A N D;
 ALL                 : A L L  ;
 AS                  : A S;
 ID                  : I D;
 WORD                : (LETTER | DIGIT | '_' | '-' | '.' | ':'| '@')+ ; // Word is last to prevent ambiguity

 fragment LETTER     : [a-zA-Z] ;
 fragment DIGIT      : [0-9] ;
 fragment A          : ('a'|'A') ;
 fragment L          : ('l'|'L') ;
 fragment O          : ('o'|'O') ;
 fragment W          : ('w'|'W') ;
 fragment I          : ('i'|'I') ;
 fragment N          : ('n'|'N') ;
 fragment T          : ('t'|'T') ;
 fragment E          : ('e'|'E') ;
 fragment R          : ('r'|'R') ;
 fragment H          : ('h'|'H') ;
 fragment U          : ('u'|'U') ;
 fragment P          : ('p'|'P') ;
 fragment S          : ('s'|'S') ;
 fragment V          : ('v'|'V') ;
 fragment C          : ('c'|'C') ;
 fragment D          : ('d'|'D') ;
 fragment M          : ('m'|'M') ;
 fragment G          : ('g'|'G') ;
 fragment Y          : ('y'|'Y') ;
 fragment F          : ('f'|'F') ;
 fragment B          : ('b'|'B') ;


