; DreamMaker highlighting queries for tree-sitter

; Preprocessor directives - highlight as preprocessor keywords
(preprocessor_directive) @keyword

; Individual preprocessor directives for more specific highlighting
(preprocessor_define) @keyword
(preprocessor_if) @keyword
(preprocessor_ifdef) @keyword
(preprocessor_ifndef) @keyword
(preprocessor_elif) @keyword
(preprocessor_else) @keyword
(preprocessor_endif) @keyword
(preprocessor_include) @keyword
(preprocessor_undef) @keyword
(preprocessor_error) @keyword
(preprocessor_warn) @keyword
(preprocessor_pragma) @keyword

; Preprocessor macro names (define names) - highlight as constants
(preprocessor_define name: (identifier) @constant)
(preprocessor_define name: (preprocessor_macro) @constant)
(preprocessor_define value: (preprocessor_value) @string)

; Preprocessor parameters in macro definitions
(preprocessor_parameters (identifier) @parameter)

; Preprocessor macros used in code (uppercase identifiers)
(preprocessor_macro) @constant

; Comments
(comment) @comment

; Strings
(string) @string
(escape_sequence) @string.escape

; Numbers
(number) @number

; Booleans
(boolean) @boolean

; Null
(null) @constant.builtin

; Built-in variables and constants
(builtin_variable) @variable.builtin
(builtin_constant) @constant.builtin

; Built-in functions
(builtin_function) @function.builtin

; Types
(type) @type

; Storage modifiers
(storage_modifier) @keyword

; Function definitions
(function_definition name: (identifier) @function)

; Control statements
(if_statement) @conditional
(while_statement) @repeat
(for_statement) @repeat
(do_while_statement) @repeat
(switch_statement) @conditional
(try_statement) @exception
(return_statement) @keyword
(break_statement) @keyword
(continue_statement) @keyword
(goto_statement) @keyword
(sleep_statement) @keyword
(spawn_statement) @keyword
(throw_statement) @keyword

; Operators
[
  "||"
  "&&"
  "|"
  "^"
  "&"
  "=="
  "!="
  "<>"
  "<"
  ">"
  "<="
  ">="
  "<<"
  ">>"
  "+"
  "-"
  "*"
  "/"
  "%"
  "**"
  "to"
  "in"
  "step"
  "!"
  "~"
  "++"
  "--"
  "="
  "+="
  "-="
  "*="
  "/="
  "**="
  "%="
  "&="
  "|="
  "^="
  "<<="
  ">>="
  "?"
  ":"
  "."
  ":"
  "/"
  "as"
] @operator

; Delimiters
[
  "("
  ")"
  "{"
  "}"
  "["
  "]"
  ","
  ";"
] @punctuation.delimiter

; Keywords
[
  "var"
  "proc"
  "verb"
  "operator"
  "if"
  "else"
  "while"
  "do"
  "for"
  "switch"
  "try"
  "catch"
  "return"
  "break"
  "continue"
  "goto"
  "sleep"
  "spawn"
  "throw"
  "new"
  "del"
  "list"
  "alist"
] @keyword

; Identifiers
(identifier) @variable
