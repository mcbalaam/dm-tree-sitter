import XCTest
import SwiftTreeSitter
import TreeSitterDmTreeSitter

final class TreeSitterDmTreeSitterTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_dm_tree_sitter())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading dm-tree-sitter grammar")
    }
}
