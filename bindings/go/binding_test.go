package tree_sitter_dm_tree_sitter_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_dm_tree_sitter "github.com/tree-sitter/tree-sitter-dm_tree_sitter/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_dm_tree_sitter.Language())
	if language == nil {
		t.Errorf("Error loading dm-tree-sitter grammar")
	}
}
