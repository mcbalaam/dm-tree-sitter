module.exports = grammar({
  name: "dreammaker",

  extras: ($) => [/\s/, $.comment],

  word: ($) => $.identifier,

  conflicts: ($) => [
    [$.binary_expression, $.unary_expression, $.member_expression],
    [
      $.binary_expression,
      $.unary_expression,
      $.update_expression,
      $.member_expression,
    ],
    [$.binary_expression, $.member_expression, $.del_expression],
    [$.preprocessor_define],
    [$.binary_expression, $.member_expression],
    [$.if_statement],
  ],

  rules: {
    source_file: ($) => repeat($._statement),

    _statement: ($) =>
      choice(
        $.preprocessor_directive,
        $.variable_declaration,
        $.variable_declaration_with_path,
        $.function_definition,
        $.control_statement,
        $.expression_statement,
        $.block,
        $.comment,
      ),

    // Comments
    comment: ($) => choice($.line_comment, $.block_comment),

    line_comment: ($) => token(seq("//", /.*/)),

    block_comment: ($) => token(seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/")),

    // Preprocessor directives
    preprocessor_directive: ($) =>
      choice(
        $.preprocessor_define,
        $.preprocessor_if,
        $.preprocessor_ifdef,
        $.preprocessor_ifndef,
        $.preprocessor_elif,
        $.preprocessor_else,
        $.preprocessor_endif,
        $.preprocessor_include,
        $.preprocessor_undef,
        $.preprocessor_error,
        $.preprocessor_warn,
        $.preprocessor_pragma,
      ),

    preprocessor_define: ($) =>
      seq(
        "#",
        "define",
        field("name", $.identifier),
        optional($.preprocessor_parameters),
        optional(field("value", $.preprocessor_value)),
      ),

    preprocessor_parameters: ($) =>
      seq(
        "(",
        optional(
          seq($.identifier, repeat(seq(",", $.identifier)), optional("...")),
        ),
        ")",
      ),

    preprocessor_value: ($) => /[^\n]+/,

    preprocessor_if: ($) => seq("#", "if", $.preprocessor_condition),
    preprocessor_ifdef: ($) => seq("#", "ifdef", $.identifier),
    preprocessor_ifndef: ($) => seq("#", "ifndef", $.identifier),
    preprocessor_elif: ($) => seq("#", "elif", $.preprocessor_condition),
    preprocessor_else: ($) => seq("#", "else"),
    preprocessor_endif: ($) => seq("#", "endif"),
    preprocessor_include: ($) =>
      seq("#", "include", choice($.string, $.identifier)),
    preprocessor_undef: ($) => seq("#", "undef", $.identifier),
    preprocessor_error: ($) => seq("#", "error", /[^\n]*/),
    preprocessor_warn: ($) => seq("#", "warn", /[^\n]*/),
    preprocessor_pragma: ($) => seq("#", "pragma", /[^\n]*/),

    preprocessor_condition: ($) => /[^\n]+/,

    // Variable declarations
    variable_declaration: ($) =>
      seq(
        "var",
        optional(seq("/", $.storage_modifier)),
        optional(seq("/", $.type)),
        field("name", $.identifier),
        optional(seq("=", $.expression)),
        optional(";"),
      ),

    storage_modifier: ($) =>
      choice("static", "global", "tmp", "const", "final"),

    // Base types
    type: ($) =>
      choice(
        "area",
        "atom",
        "atom/movable",
        "client",
        "database",
        "database/query",
        "datum",
        "exception",
        "generator",
        "icon",
        "image",
        "list",
        "alist",
        "matrix",
        "mob",
        "mutable_appearance",
        "obj",
        "particles",
        "regex",
        "savefile",
        "sound",
        "turf",
        "world",
      ),

    path_components: ($) => repeat1(seq("/", $.identifier)),

    // Variable declarations with path
    variable_declaration_with_path: ($) =>
      seq(
        "var",
        optional(seq("/", $.storage_modifier)),
        optional(seq("/", $.type)),
        $.path_components,
        field("name", $.identifier),
        optional(seq("=", $.expression)),
        optional(";"),
      ),

    // Function definitions
    function_definition: ($) =>
      seq(
        choice("proc", "verb", "operator"),
        optional($.path_components),
        field("name", $.identifier),
        $.parameter_list,
        choice($.block, ";"),
      ),

    parameter_list: ($) =>
      seq("(", optional(seq($.parameter, repeat(seq(",", $.parameter)))), ")"),

    parameter: ($) =>
      seq(optional($.type), $.identifier, optional(seq("=", $.expression))),

    // Control statements
    control_statement: ($) =>
      choice(
        $.if_statement,
        $.while_statement,
        $.for_statement,
        $.do_while_statement,
        $.switch_statement,
        $.try_statement,
        $.return_statement,
        $.break_statement,
        $.continue_statement,
        $.goto_statement,
        $.sleep_statement,
        $.spawn_statement,
        $.throw_statement,
      ),

    if_statement: ($) =>
      seq(
        "if",
        "(",
        $.expression,
        ")",
        $._statement,
        optional(seq("else", $._statement)),
      ),

    while_statement: ($) => seq("while", "(", $.expression, ")", $._statement),

    for_statement: ($) =>
      seq(
        "for",
        "(",
        optional($.expression),
        ";",
        optional($.expression),
        ";",
        optional($.expression),
        ")",
        $._statement,
      ),

    do_while_statement: ($) =>
      seq("do", $._statement, "while", "(", $.expression, ")"),

    switch_statement: ($) => seq("switch", "(", $.expression, ")", $.block),

    try_statement: ($) =>
      seq(
        "try",
        $.block,
        "catch",
        optional(seq("(", $.identifier, ")")),
        $.block,
      ),

    return_statement: ($) =>
      prec.right(seq("return", optional(seq($.expression, optional(";"))))),
    break_statement: ($) => prec.right(seq("break", optional(";"))),
    continue_statement: ($) => prec.right(seq("continue", optional(";"))),
    goto_statement: ($) => seq("goto", $.identifier, optional(";")),
    sleep_statement: ($) =>
      prec.right(seq("sleep", optional(seq($.expression, optional(";"))))),
    spawn_statement: ($) =>
      prec.right(
        1,
        seq("spawn", optional($.parenthesized_expression), $._statement),
      ),
    throw_statement: ($) => seq("throw", $.expression, optional(";")),

    // Expressions
    expression_statement: ($) => seq($.expression, optional(";")),

    expression: ($) =>
      choice(
        $.binary_expression,
        $.unary_expression,
        $.call_expression,
        $.member_expression,
        $.new_expression,
        $.del_expression,
        $.ternary_expression,
        $.assignment_expression,
        $.update_expression,
        $.cast_expression,
        $.primary_expression,
      ),

    primary_expression: ($) =>
      choice(
        $.identifier,
        $.number,
        $.string,
        $.boolean,
        $.null,
        $.builtin_variable,
        $.builtin_constant,
        $.parenthesized_expression,
        $.list_literal,
      ),

    parenthesized_expression: ($) => seq("(", $.expression, ")"),

    binary_expression: ($) =>
      choice(
        prec.left(1, seq($.expression, "||", $.expression)),
        prec.left(2, seq($.expression, "&&", $.expression)),
        prec.left(3, seq($.expression, "|", $.expression)),
        prec.left(4, seq($.expression, "^", $.expression)),
        prec.left(5, seq($.expression, "&", $.expression)),
        prec.left(6, seq($.expression, choice("==", "!=", "<>"), $.expression)),
        prec.left(
          7,
          seq($.expression, choice("<", ">", "<=", ">="), $.expression),
        ),
        prec.left(8, seq($.expression, choice("<<", ">>"), $.expression)),
        prec.left(9, seq($.expression, choice("+", "-"), $.expression)),
        prec.left(
          10,
          seq($.expression, choice("*", "/", "%", "**"), $.expression),
        ),
        prec.left(
          11,
          seq($.expression, choice("to", "in", "step"), $.expression),
        ),
      ),

    unary_expression: ($) =>
      prec.right(12, seq(choice("!", "~", "-", "+", "++", "--"), $.expression)),

    update_expression: ($) =>
      choice(
        prec.left(13, seq($.expression, choice("++", "--"))),
        prec.right(13, seq(choice("++", "--"), $.expression)),
      ),

    assignment_expression: ($) =>
      prec.right(
        0,
        seq(
          $.expression,
          choice(
            "=",
            "+=",
            "-=",
            "*=",
            "/=",
            "**=",
            "%=",
            "&=",
            "|=",
            "^=",
            "<<=",
            ">>=",
          ),
          $.expression,
        ),
      ),

    ternary_expression: ($) =>
      prec.right(1, seq($.expression, "?", $.expression, ":", $.expression)),

    call_expression: ($) =>
      prec(
        14,
        seq(
          field(
            "function",
            choice($.identifier, $.member_expression, $.builtin_function),
          ),
          field("arguments", $.argument_list),
        ),
      ),

    argument_list: ($) =>
      seq(
        "(",
        optional(seq($.expression, repeat(seq(",", $.expression)))),
        ")",
      ),

    member_expression: ($) =>
      prec.left(15, seq($.expression, choice(".", ":", "/"), $.identifier)),

    new_expression: ($) =>
      prec.right(
        11,
        seq("new", optional(seq("/", $.type)), optional($.argument_list)),
      ),

    del_expression: ($) => prec.right(11, seq("del", $.expression)),

    cast_expression: ($) => prec(14, seq("as", $.type)),

    // Literals
    number: ($) =>
      token(
        choice(
          /0[xX][0-9a-fA-F]+/,
          /\d+\.?\d*([eE][+-]?\d+)?/,
          /\.\d+([eE][+-]?\d+)?/,
        ),
      ),

    string: ($) =>
      choice(
        $.double_quoted_string,
        $.single_quoted_string,
        $.triple_quoted_string,
        $.raw_string,
      ),

    double_quoted_string: ($) => token(seq('"', /[^"\\\n]*/, '"')),

    single_quoted_string: ($) => token(seq("'", /[^'\\\n]*/, "'")),

    triple_quoted_string: ($) => token(seq('{"', /[^"}]*/, '"}')),

    raw_string: ($) =>
      choice(token(seq('@{"', /[^"]*/, '"}')), token(seq("@", /./, /[^\n]*/))),

    escape_sequence: ($) =>
      token(
        seq(
          "\\",
          choice(
            /[tTnN"'\\<>\[\] .]/,
            /x[0-9a-fA-F]{2}/,
            /u[0-9a-fA-F]{4}/,
            /U[0-9a-fA-F]{6}/,
            "the",
            "The",
            "a",
            "A",
            "an",
            "An",
            "he",
            "He",
            "she",
            "She",
            "his",
            "him",
            "himself",
            "herself",
            "hers",
            "proper",
            "improper",
            "th",
            "s",
            "icon",
            "ref",
            "Roman",
            "roman",
            "...",
          ),
        ),
      ),

    string_interpolation: ($) => seq("[", $.expression, "]"),

    list_literal: ($) =>
      prec(
        2,
        seq(
          "list",
          "(",
          optional(seq($.expression, repeat(seq(",", $.expression)))),
          ")",
        ),
      ),

    boolean: ($) => choice("TRUE", "FALSE"),

    null: ($) => "null",

    builtin_variable: ($) => choice("usr", "world", "src", "args", "vars"),

    builtin_constant: ($) =>
      choice(
        "DM_BUILD",
        "DM_VERSION",
        "__FILE__",
        "__LINE__",
        "__MAIN__",
        "DEBUG",
        "FILE_DIR",
      ),

    builtin_function: ($) =>
      choice(
        "list",
        "alist",
        "call",
        "input",
        "locate",
        "pick",
        "arglist",
        "CRASH",
        "ASSERT",
        "EXCEPTION",
        "REGEX_QUOTE",
        "REGEX_QUOTE_REPLACEMENT",
      ),

    // Block
    block: ($) => seq("{", repeat($._statement), "}"),

    // Identifiers
    identifier: ($) => /[a-zA-Z_][a-zA-Z0-9_]*/,
  },
});
